import { describe, expect, it, mock } from 'bun:test'

import type { UserExport } from '@aurore/shared'

import { eq } from 'drizzle-orm'
import { sign, verify } from 'hono/jwt'

import { refreshTokens, userBans, userDermoProfiles, users } from '../../db/schema'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb } from '../helpers/app-runtime-db'
import { createTestApp } from '../helpers/createTestApp'
import { JWT_SECRET } from '../helpers/secrets'
import { createTestAdminUser, createTestUser } from '../helpers/test-factories'

mock.module('arctic', () => ({
  generateState: mock(() => 'test-state-fixed'),
  generateCodeVerifier: mock(() => 'test-verifier-fixed'),
  decodeIdToken: mock(() => ({ sub: 'google-sub-abc123', email: 'googleuser@example.com' })),
}))
mock.module('../../lib/artic', () => ({
  getGoogleInstance: mock(() => ({
    createAuthorizationURL: () => new URL('https://accounts.google.com/o/oauth2/v2/auth'),
    validateAuthorizationCode: async () => ({ idToken: () => 'fake-google-id-token' }),
  })),
}))

const runtime = await createAppRuntimeDb()
setupDbTests()

function cookies(response: Response) {
  return response.headers
    .getSetCookie()
    .map((entry) => entry.split(';')[0])
    .join('; ')
}

function cookieToken(cookie: string, name: string) {
  const value = cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`))
    ?.slice(name.length + 1)
  if (!value) throw new Error(`Missing ${name} cookie`)
  return decodeURIComponent(value)
}

async function authorize(app: Awaited<ReturnType<typeof createTestApp>>, operation: string) {
  const start = await app.request('/api/profile/access/google/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation }),
  })
  expect(start.status).toBe(200)
  const { data } = (await start.json()) as { data: { url: string } }
  const state = new URL(data.url).searchParams.get('state')
  const callback = await app.request(`/api/auth/google/callback?code=auth-code&state=${state}`, {
    headers: { Cookie: cookies(start) },
  })
  expect(callback.status).toBe(302)
  expect(callback.headers.get('location')).toBe('http://localhost:5173/auth/banned')
  expect(callback.headers.getSetCookie().some((entry) => entry.startsWith('refresh_token='))).toBe(
    false
  )
  return cookies(callback)
}

async function googleAccount() {
  const user = await createTestUser('googleuser@example.com', 'Azerty123!')
  const admin = await createTestAdminUser()
  await testDb
    .update(users)
    .set({ googleSub: 'google-sub-abc123', passwordHash: null })
    .where(eq(users.id, user.id))
  await testDb.insert(userBans).values({ userId: user.id, bannedBy: admin.id, scope: 'global' })
  return { user, admin }
}

describe('Google privacy access during suspension', () => {
  it.each(['export', 'delete-account'] as const)(
    'authorizes only %s for the linked Google owner',
    async (operation) => {
      const { user, admin } = await googleAccount()
      await testDb.insert(userDermoProfiles).values({ userId: user.id, privateNotes: 'owner-only' })
      await testDb
        .insert(userDermoProfiles)
        .values({ userId: admin.id, privateNotes: 'other-owner' })
      const app = await createTestApp({ anonDb: runtime })
      const cookie = await authorize(app, operation)
      const status = await app.request('/api/profile/access/google', {
        headers: { Cookie: cookie },
      })
      expect(await status.json()).toMatchObject({
        success: true,
        data: { userId: user.id, email: user.email, operation },
      })
      expect(await testDb.select().from(refreshTokens)).toEqual([])
      const [unchanged] = await testDb.select().from(users).where(eq(users.id, user.id))
      expect(unchanged?.passwordHash).toBeNull()
      const token = cookieToken(cookie, 'privacy_access')
      const claims = await verify(token, JWT_SECRET, 'HS256')
      expect(Number(claims.exp) - Number(claims.iat)).toBe(300)
      const general = await app.request('/api/auth/session', {
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(general.status).toBe(401)
      const post = (action: string, userId = user.id) =>
        app.request(`/api/profile/access/google/${action}`, {
          method: 'POST',
          headers: { Cookie: cookie, 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        })
      expect((await post(operation === 'export' ? 'delete-account' : 'export')).status).toBe(401)
      expect((await post(operation, admin.id)).status).toBe(401)
      const result = await post(operation)
      if (operation === 'export') {
        expect(result.status).toBe(200)
        const data = (await result.json()) as UserExport
        expect(data._meta.userId).toBe(user.id)
        expect(data.dermoProfile?.privateNotes).toBe('owner-only')
        expect(result.headers.get('Cache-Control')).toBe('no-store')
      } else {
        expect(result.status).toBe(204)
        expect(await testDb.select().from(users).where(eq(users.id, user.id))).toEqual([])
      }
      expect(await testDb.select().from(users).where(eq(users.id, admin.id))).toHaveLength(1)
    }
  )

  it('does not link a matching email or create an account', async () => {
    const user = await createTestUser('googleuser@example.com', 'Azerty123!')
    const app = await createTestApp({ anonDb: runtime })
    const cookie = await authorize(app, 'export')
    const status = await app.request('/api/profile/access/google', { headers: { Cookie: cookie } })
    expect(status.status).toBe(401)
    const remaining = await testDb.select().from(users)
    expect(remaining).toHaveLength(1)
    expect(remaining[0]?.id).toBe(user.id)
    expect(remaining[0]?.googleSub).toBeNull()
    expect(await testDb.select().from(refreshTokens)).toEqual([])
  })

  it.each(['missing-state', 'wrong-state', 'cancelled', 'expired-flow'] as const)(
    'rejects %s without granting access',
    async (failure) => {
      await googleAccount()
      const app = await createTestApp({ anonDb: runtime })
      const start = await app.request('/api/profile/access/google/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'delete-account' }),
      })
      expect(start.status).toBe(200)
      const { data } = (await start.json()) as { data: { url: string } }
      const state = new URL(data.url).searchParams.get('state')
      if (!state) throw new Error('Missing OAuth state')
      let cookie = cookies(start)
      if (failure === 'expired-flow') {
        const token = cookieToken(cookie, 'privacy_google')
        const claims = await verify(token, JWT_SECRET, 'HS256')
        cookie = `privacy_google=${await sign({ ...claims, exp: Math.floor(Date.now() / 1000) - 1 }, JWT_SECRET)}`
      }
      const query =
        failure === 'cancelled'
          ? `error=access_denied&state=${state}`
          : `code=auth-code&state=${failure === 'wrong-state' ? 'privacy.wrong' : state}`
      const response = await app.request(`/api/auth/google/callback?${query}`, {
        headers: { Cookie: failure === 'missing-state' ? '' : cookie },
      })
      const status = await app.request('/api/profile/access/google', {
        headers: { Cookie: cookies(response) },
      })
      expect(status.status).toBe(401)
      expect(await testDb.select().from(refreshTokens)).toEqual([])
    }
  )

  it('rejects expired, forged or wrong-purpose grants and cross-origin operations', async () => {
    const { user } = await googleAccount()
    const app = await createTestApp({ anonDb: runtime })
    const cookie = await authorize(app, 'delete-account')
    const token = cookieToken(cookie, 'privacy_access')
    const claims = await verify(token, JWT_SECRET, 'HS256')
    const expired = await sign({ ...claims, exp: Math.floor(Date.now() / 1000) - 1 }, JWT_SECRET)
    const wrongPurpose = await sign({ ...claims, type: 'access' }, JWT_SECRET)
    const forged = await sign(claims, 'untrusted-test-signing-key')
    for (const [Cookie, Origin, expected] of [
      [`privacy_access=${expired}`, 'http://localhost:5173', 401],
      [`privacy_access=${wrongPurpose}`, 'http://localhost:5173', 401],
      [`privacy_access=${forged}`, 'http://localhost:5173', 401],
      [cookie, 'https://attacker.example', 403],
    ] as const) {
      const res = await app.request('/api/profile/access/google/delete-account', {
        method: 'POST',
        headers: { Cookie, Origin, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      expect(res.status).toBe(expected)
    }
    expect(await testDb.select().from(users).where(eq(users.id, user.id))).toHaveLength(1)
  })
})

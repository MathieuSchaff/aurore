import { beforeAll, describe, expect, it } from 'bun:test'

import type { SsrBootResponse } from '@aurore/shared'

import { eq } from 'drizzle-orm'
import { testClient } from 'hono/testing'

import { db as appRuntimeDb } from '../../../db'
import { profiles, users } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestApp } from '../../../tests/helpers/createTestApp'
import type { TestApp, TestClient } from '../../../tests/helpers/createTestClient'
import { expectOk } from '../../../tests/helpers/expectStatus'
import { REFRESH_SECRET } from '../../../tests/helpers/secrets'
import { createTestContributorUser } from '../../../tests/helpers/test-factories'
import { verifyRefreshToken } from '../jwt.utils'
import { revokeRefreshToken } from '../refresh-token.service'

setupDbTests()

const EMAIL = 'ssr-boot@test.local'
const PASSWORD = 'Azerty123!'

function activeRefreshCookie(response: Response): string {
  const setCookie = response.headers
    .getSetCookie()
    .find((cookie) => cookie.startsWith('refresh_token=') && !cookie.includes('Max-Age=0'))
  if (!setCookie) throw new Error('login did not set a refresh cookie')
  return setCookie.split(';', 1)[0] ?? ''
}

async function loginSession(app: TestApp, email: string, password: string) {
  const response = await app.request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const cookie = activeRefreshCookie(response)
  const session = await expectOk<{ accessToken: string }>(response)
  return { cookie, accessToken: session.accessToken }
}

async function loginWithRefreshCookie(app: TestApp, email: string, password: string) {
  return (await loginSession(app, email, password)).cookie
}

let app: TestApp
let client: TestClient

beforeAll(async () => {
  app = await createTestApp({ anonDb: appRuntimeDb })
  client = testClient(app).api
})

describe('GET /api/boot', () => {
  it('returns the navbar session and fresh DB role for a valid refresh cookie', async () => {
    const user = await createTestContributorUser(EMAIL, PASSWORD)
    await testDb
      .update(profiles)
      .set({ username: 'aurore-boot' })
      .where(eq(profiles.userId, user.id))

    const cookie = await loginWithRefreshCookie(app, EMAIL, PASSWORD)

    await testDb.update(users).set({ role: 'user' }).where(eq(users.id, user.id))

    const response = await app.request('/api/boot', {
      headers: { Cookie: cookie },
    })

    const data = await expectOk<SsrBootResponse>(response)
    expect(data).toMatchObject({
      session: {
        authenticated: true,
        userId: user.id,
        role: 'user',
        user: { id: user.id, email: EMAIL, role: 'user' },
      },
      profile: { userId: user.id, username: 'aurore-boot' },
    })
  })

  it('returns an exact anonymous payload when the refresh cookie is absent', async () => {
    const data = await expectOk(client.boot.$get())

    expect(data).toEqual({
      session: { authenticated: false },
      profile: null,
    })
  })

  it('returns no personal data for a revoked refresh token', async () => {
    const user = await createTestContributorUser(EMAIL, PASSWORD)
    const cookie = await loginWithRefreshCookie(app, EMAIL, PASSWORD)
    const rawToken = cookie.slice('refresh_token='.length)
    const payload = await verifyRefreshToken(rawToken, REFRESH_SECRET)
    if (!payload) throw new Error('login set an invalid refresh token')
    await revokeRefreshToken(testDb, payload.jti, user.id)

    const response = await app.request('/api/boot', { headers: { Cookie: cookie } })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      success: true,
      data: {
        session: { authenticated: false },
        profile: null,
      },
    })
  })

  it('returns no personal data for an invalid refresh token', async () => {
    const response = await app.request('/api/boot', {
      headers: { Cookie: 'refresh_token=invalid.token' },
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      success: true,
      data: {
        session: { authenticated: false },
        profile: null,
      },
    })
  })

  it('does not authenticate a mutation with the refresh cookie', async () => {
    await createTestContributorUser(EMAIL, PASSWORD)
    const cookie = await loginWithRefreshCookie(app, EMAIL, PASSWORD)

    const response = await app.request('/api/profile', {
      method: 'PATCH',
      headers: { Cookie: cookie, 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'cookie-write' }),
    })

    expect(response.status).toBe(401)
  })
})

describe('mutation Origin guard', () => {
  it('rejects a mutation carrying a foreign Origin', async () => {
    await createTestContributorUser(EMAIL, PASSWORD)
    const { accessToken } = await loginSession(app, EMAIL, PASSWORD)

    const response = await app.request('/api/profile', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Origin: 'https://evil.example',
      },
      body: JSON.stringify({ username: 'foreign-origin' }),
    })

    expect(response.status).toBe(403)
  })

  it('allows a valid mutation when Origin is absent', async () => {
    await createTestContributorUser(EMAIL, PASSWORD)
    const { accessToken } = await loginSession(app, EMAIL, PASSWORD)

    const response = await app.request('/api/profile', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'originless-client' }),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({
      success: true,
      data: { username: 'originless-client' },
    })
  })

  it('allows a mutation from the configured frontend Origin', async () => {
    await createTestContributorUser(EMAIL, PASSWORD)
    const { accessToken } = await loginSession(app, EMAIL, PASSWORD)

    const response = await app.request('/api/profile', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Origin: 'http://localhost:5173',
      },
      body: JSON.stringify({ username: 'trusted-origin' }),
    })

    expect(response.status).toBe(200)
  })
})

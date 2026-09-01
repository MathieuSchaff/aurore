import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { userBans } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestClient,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectError, expectOk, expectStatus } from '../../../tests/helpers/expectStatus'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import { _banCacheSize, clearBanCache } from '../ban.service'
import { seedBanActors } from './ban-test.setup'

type BannedDetails = { reason: string | null; expiresAt: string | null }

setupDbTests()

describe('Ban enforcement (requireNotBanned)', () => {
  let client: TestClient
  let userId: string
  let adminId: string
  let token: string

  beforeAll(async () => {
    client = await createTestClient()
  })

  beforeEach(async () => {
    clearBanCache()
    ;({ userId, adminId, token } = await seedBanActors(client))
  })

  afterEach(() => {
    clearBanCache()
  })

  it('rejects /session with 403 banned when user has an active global ban', async () => {
    await testDb.insert(userBans).values({
      userId,
      scope: 'global',
      bannedBy: adminId,
      reason: 'spam',
    })

    const res = await client.auth.session.$get({}, withAuth(token))

    const body = await expectError<BannedDetails>(res, HTTP_STATUS.FORBIDDEN, 'banned')
    expect(body.details).toEqual({ reason: 'spam', expiresAt: null })
  })

  it('allows /session when ban is expired', async () => {
    const pastIso = new Date(Date.now() - 60_000).toISOString()
    await testDb.insert(userBans).values({
      userId,
      scope: 'global',
      bannedBy: adminId,
      expiresAt: pastIso,
    })

    const res = await client.auth.session.$get({}, withAuth(token))

    expect(res.status).toBe(HTTP_STATUS.OK)
  })

  it('allows /session when user is not banned', async () => {
    const res = await client.auth.session.$get({}, withAuth(token))

    expect(res.status).toBe(HTTP_STATUS.OK)
  })

  it('ignores non-global ban scopes on /session (per-scope enforcement is per-route)', async () => {
    await testDb.insert(userBans).values({
      userId,
      scope: 'ingredient_edit',
      bannedBy: adminId,
    })

    const res = await client.auth.session.$get({}, withAuth(token))

    expect(res.status).toBe(HTTP_STATUS.OK)
  })

  it('caches the ban check across consecutive requests', async () => {
    await testDb.insert(userBans).values({
      userId,
      scope: 'global',
      bannedBy: adminId,
    })

    const first = await client.auth.session.$get({}, withAuth(token))
    expectStatus(first, HTTP_STATUS.FORBIDDEN)
    expect(_banCacheSize()).toBe(1)

    // Delete the row out-of-band: cache should still return banned within TTL.
    await testDb.delete(userBans).where(eq(userBans.userId, userId))
    const second = await client.auth.session.$get({}, withAuth(token))
    expectStatus(second, HTTP_STATUS.FORBIDDEN)

    // Invalidate cache: request now reads fresh state.
    clearBanCache()
    const third = await client.auth.session.$get({}, withAuth(token))
    expect(third.status).toBe(HTTP_STATUS.OK)
  })

  it('returns the most recent ban when multiple rows match', async () => {
    const oldIso = new Date(Date.now() - 60_000).toISOString()
    const recentIso = new Date().toISOString()
    await testDb.insert(userBans).values([
      { userId, scope: 'global', bannedBy: adminId, reason: 'old', createdAt: oldIso },
      { userId, scope: 'global', bannedBy: adminId, reason: 'recent', createdAt: recentIso },
    ])

    const res = await client.auth.session.$get({}, withAuth(token))

    const body = await expectError<BannedDetails>(res, HTTP_STATUS.FORBIDDEN, 'banned')
    expect(body.details?.reason).toBe('recent')
  })
})

// Every route that hands out a fresh token must refuse a banned account, like /login does
describe('Ban gate at token emission', () => {
  let client: TestClient
  let userId: string
  let adminId: string
  const { rawEmail, rawPassword } = TEST_CREDENTIALS.toto

  beforeAll(async () => {
    client = await createTestClient()
  })

  beforeEach(async () => {
    clearBanCache()
    ;({ userId, adminId } = await seedBanActors(client))
  })

  afterEach(() => {
    clearBanCache()
  })

  function banGlobally() {
    return testDb
      .insert(userBans)
      .values({ userId, scope: 'global', bannedBy: adminId, reason: 'spam' })
  }

  function refreshCookieOf(res: { headers: Headers }): string {
    const cookie = res.headers
      .getSetCookie()
      .find((entry) => entry.startsWith('refresh_token=') && !entry.includes('Max-Age=0'))
    if (!cookie) throw new Error('no refresh cookie issued')
    return cookie.split(';', 1)[0] ?? ''
  }

  it('rejects /login with 403 banned and issues no cookie', async () => {
    await banGlobally()

    const res = await client.auth.login.$post({
      json: { email: rawEmail, password: rawPassword },
    })

    const body = await expectError<BannedDetails>(res, HTTP_STATUS.FORBIDDEN, 'banned')
    expect(body.details).toEqual({ reason: 'spam', expiresAt: null })
    const issued = res.headers
      .getSetCookie()
      .some((entry) => entry.startsWith('refresh_token=') && !entry.includes('Max-Age=0'))
    expect(issued).toBe(false)
  })

  it('rejects /mobile/login with 403 banned when the account has an active global ban', async () => {
    await banGlobally()

    const res = await client.auth.mobile.login.$post({
      json: { email: rawEmail, password: rawPassword },
    })

    const body = await expectError<BannedDetails>(res, HTTP_STATUS.FORBIDDEN, 'banned')
    expect(body.details).toEqual({ reason: 'spam', expiresAt: null })
  })

  it('rejects /refresh with 403 banned and clears the cookie when the ban lands after login', async () => {
    const loginRes = await client.auth.login.$post({
      json: { email: rawEmail, password: rawPassword },
    })
    const cookie = refreshCookieOf(loginRes)
    await banGlobally()

    const res = await client.auth.refresh.$post({}, { headers: { Cookie: cookie } })

    await expectError(res, HTTP_STATUS.FORBIDDEN, 'banned')
    const cleared = res.headers
      .getSetCookie()
      .some((entry) => entry.startsWith('refresh_token=') && entry.includes('Max-Age=0'))
    expect(cleared).toBe(true)
  })

  it('rejects /mobile/refresh with 403 banned when the ban lands after login', async () => {
    const session = await expectOk(
      client.auth.mobile.login.$post({ json: { email: rawEmail, password: rawPassword } })
    )
    await banGlobally()

    const res = await client.auth.mobile.refresh.$post({
      json: { refreshToken: session.refreshToken },
    })

    await expectError(res, HTTP_STATUS.FORBIDDEN, 'banned')
  })
})

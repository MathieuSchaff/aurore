import { afterEach, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { users } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { createTestClient, type TestClient } from '../../../tests/helpers/createTestClient'
import { cleanDatabase } from '../../../tests/helpers/db-cleaner'
import { expectError, expectOk } from '../../../tests/helpers/expectStatus'

describe('POST /auth/demo', () => {
  let client: TestClient

  beforeEach(async () => {
    await cleanDatabase()
    client = await createTestClient()
  })

  afterEach(async () => {
    await cleanDatabase()
  })

  it('should create a demo user and return tokens', async () => {
    const res = await client.auth.demo.$post()

    const session = await expectOk(res, HTTP_STATUS.CREATED)
    expect(session.user.email).toContain('@demo.local')
    expect(session.user.isDemo).toBe(true)
    expect(session.accessToken).toBeDefined()
    expect((session as { refreshToken?: string }).refreshToken).toBeUndefined()

    const cookie = res.headers.get('Set-Cookie') ?? ''
    expect(cookie).toContain('refresh_token=')
    expect(cookie).toContain('HttpOnly')
  })

  it('each call creates a fresh independent demo account', async () => {
    const first = await expectOk(client.auth.demo.$post(), HTTP_STATUS.CREATED)
    const second = await expectOk(client.auth.demo.$post(), HTTP_STATUS.CREATED)

    expect(first.user.email).not.toBe(second.user.email)
  })

  it('rejects refresh once the demo session has expired', async () => {
    const demoRes = await client.auth.demo.$post()
    const cookie = demoRes.headers.getSetCookie().find((c) => c.startsWith('refresh_token=')) ?? ''
    expect(cookie).toContain('refresh_token=')

    // Backdate the TTL so the rotation guard treats the session as past expiry.
    await testDb
      .update(users)
      .set({ expiresAt: new Date(Date.now() - 60_000).toISOString() })
      .where(eq(users.isDemo, true))

    const res = await client.auth.refresh.$post({}, { headers: { Cookie: cookie } })
    await expectError(res, HTTP_STATUS.UNAUTHORIZED, 'invalid_token')
  })
})

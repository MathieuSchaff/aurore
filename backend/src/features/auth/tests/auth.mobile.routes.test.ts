import { beforeAll, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestClient,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectError, expectOk, expectStatus } from '../../../tests/helpers/expectStatus'
import { createTestUser } from '../../../tests/helpers/test-factories'

function mobileLogin(client: TestClient, email: string, password: string) {
  return client.auth.mobile.login.$post({ json: { email, password } })
}

function mobileSignup(client: TestClient, email: string, password: string) {
  return client.auth.mobile.signup.$post({ json: { email, password } })
}

// Success path: the tokens the logout/refresh suites need to act on.
function mobileSession(client: TestClient, email: string, password: string) {
  return expectOk(mobileLogin(client, email, password))
}

setupDbTests()

describe('Auth Routes (mobile)', () => {
  let client: TestClient

  beforeAll(async () => {
    client = await createTestClient()
  })

  describe('POST /auth/mobile/signup', () => {
    it('returns a neutral pending response with no tokens', async () => {
      const res = await mobileSignup(client, 'newuser@test.com', 'TestPass123!')

      const data = await expectOk(res)
      expect(data).toEqual({ pending: true })
      expect((data as { accessToken?: string }).accessToken).toBeUndefined()
      expect((data as { refreshToken?: string }).refreshToken).toBeUndefined()
      expect(res.headers.get('Set-Cookie')).toBeNull()
    })

    it('should reject invalid email', async () => {
      await expectError(
        mobileSignup(client, 'invalid-email', 'TestPass123!'),
        HTTP_STATUS.BAD_REQUEST
      )
    })

    it('should reject weak password', async () => {
      await expectError(mobileSignup(client, 'test@test.com', 'weak'), HTTP_STATUS.BAD_REQUEST)
    })

    it('returns the same neutral response for an existing email', async () => {
      await createTestUser('existing@test.com', 'TestPass123!')

      const data = await expectOk(mobileSignup(client, 'existing@test.com', 'TestPass123!'))
      expect(data).toEqual({ pending: true })
    })

    it('should normalize email on signup', async () => {
      const data = await expectOk(mobileSignup(client, '  NewUser@TEST.COM  ', 'TestPass123!'))
      expect(data).toEqual({ pending: true })
    })
  })

  describe('POST /auth/mobile/login', () => {
    it('should login and return tokens in body', async () => {
      await createTestUser('login@test.com', 'TestPass123!')

      const res = await mobileLogin(client, 'login@test.com', 'TestPass123!')

      const session = await expectOk(res)
      expect(session.user.email).toBe('login@test.com')
      expect(session.accessToken).toBeDefined()
      expect(session.refreshToken).toBeDefined()

      expect(res.headers.get('Set-Cookie')).toBeNull()
    })

    it('should reject wrong password', async () => {
      await createTestUser('login@test.com', 'TestPass123!')

      await expectError(
        mobileLogin(client, 'login@test.com', 'WrongPass123!'),
        HTTP_STATUS.UNAUTHORIZED,
        'invalid_credentials'
      )
    })

    it('should reject non-existent user', async () => {
      await expectError(
        mobileLogin(client, 'notfound@test.com', 'TestPass123!'),
        HTTP_STATUS.UNAUTHORIZED,
        'invalid_credentials'
      )
    })

    it('should reject invalid email format', async () => {
      const res = await mobileLogin(client, 'not-an-email', 'TestPass123!')
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject empty body', async () => {
      const res = await client.auth.mobile.login.$post({
        // @ts-expect-error: exercising the validator with an empty body
        json: {},
      })
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })
  })

  describe('POST /auth/mobile/refresh', () => {
    it('should rotate tokens via body', async () => {
      await createTestUser('refresh@test.com', 'TestPass123!')
      const { refreshToken: oldRefreshToken } = await mobileSession(
        client,
        'refresh@test.com',
        'TestPass123!'
      )

      const data = await expectOk(
        client.auth.mobile.refresh.$post({
          json: { refreshToken: oldRefreshToken },
        })
      )

      expect(data.accessToken).toBeDefined()
      expect(data.refreshToken).toBeDefined()

      expect(data.refreshToken).not.toBe(oldRefreshToken)
    })

    it('should fail without refreshToken in body', async () => {
      const res = await client.auth.mobile.refresh.$post({
        json: {},
      })

      await expectError(res, HTTP_STATUS.BAD_REQUEST, 'missing_refresh_token')
    })

    it('should fail with invalid refresh token', async () => {
      const res = await client.auth.mobile.refresh.$post({
        json: { refreshToken: 'invalid.token.here' },
      })

      await expectError(res, HTTP_STATUS.UNAUTHORIZED, 'invalid_token')
    })

    it('should invalidate old refresh token after rotation', async () => {
      await createTestUser('refresh@test.com', 'TestPass123!')
      const { refreshToken: oldRefresh } = await mobileSession(
        client,
        'refresh@test.com',
        'TestPass123!'
      )

      const res1 = await client.auth.mobile.refresh.$post({
        json: { refreshToken: oldRefresh },
      })
      expect(res1.status).toBe(HTTP_STATUS.OK)

      const res2 = await client.auth.mobile.refresh.$post({
        json: { refreshToken: oldRefresh },
      })
      expect(res2.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('POST /auth/mobile/logout', () => {
    it('should logout with refresh token in body', async () => {
      await createTestUser('logout@test.com', 'TestPass123!')
      const session = await mobileSession(client, 'logout@test.com', 'TestPass123!')

      const res = await client.auth.mobile.logout.$post(
        { json: { refreshToken: session.refreshToken } },
        withAuth(session.accessToken)
      )

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should reject logout without access token', async () => {
      const res = await client.auth.mobile.logout.$post({
        json: {},
      })
      expectStatus(res, HTTP_STATUS.UNAUTHORIZED)
    })

    it('should invalidate refresh token after logout', async () => {
      await createTestUser('logout@test.com', 'TestPass123!')
      const session = await mobileSession(client, 'logout@test.com', 'TestPass123!')

      await client.auth.mobile.logout.$post(
        { json: { refreshToken: session.refreshToken } },
        withAuth(session.accessToken)
      )

      const refreshRes = await client.auth.mobile.refresh.$post({
        json: { refreshToken: session.refreshToken },
      })
      expect(refreshRes.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })

    it('should succeed even without refresh token in body', async () => {
      await createTestUser('logout@test.com', 'TestPass123!')
      const session = await mobileSession(client, 'logout@test.com', 'TestPass123!')

      const res = await client.auth.mobile.logout.$post({ json: {} }, withAuth(session.accessToken))

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })
  })
})

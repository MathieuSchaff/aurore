import { beforeAll, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { users } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { expectRequiresAuth } from '../../../tests/helpers/authz-matrix'
import {
  createTestEnv,
  type TestApp,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectError, expectOk, expectStatus } from '../../../tests/helpers/expectStatus'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import { createTestToto, createTestUser } from '../../../tests/helpers/test-factories'

function extractCookie(res: { headers: Headers }): string {
  return res.headers.get('Set-Cookie') ?? ''
}

function getRefreshSetCookies(res: { headers: Headers }): string[] {
  return res.headers.getSetCookie().filter((cookie) => cookie.startsWith('refresh_token='))
}

function getActiveRefreshSetCookie(res: { headers: Headers }): string {
  return getRefreshSetCookies(res).find((cookie) => !cookie.includes('Max-Age=0')) ?? ''
}

function extractActiveRefreshCookie(res: { headers: Headers }): string {
  return getActiveRefreshSetCookie(res).split(';', 1)[0] ?? ''
}

// The shared `login` helper drops the response; the cookie-based flows here need
// both the Set-Cookie header and the body token off the same call.
async function loginAndGetCookies(client: TestClient, email: string, password: string) {
  const res = await client.auth.login.$post({ json: { email, password } })
  const data = await res.json()
  if (!data.success) throw new Error(`login failed for ${email}`)
  return { res, cookie: extractActiveRefreshCookie(res), accessToken: data.data.accessToken }
}

setupDbTests()

describe('Auth Routes (browser)', () => {
  let app: TestApp
  let client: TestClient

  beforeAll(async () => {
    ;({ app, client } = await createTestEnv())
  })

  describe('POST /auth/signup', () => {
    it('returns a neutral pending response with no session cookie', async () => {
      const creds = TEST_CREDENTIALS.toto

      const res = await client.auth.signup.$post({
        json: { email: creds.rawEmail, password: creds.rawPassword },
      })

      const data = await expectOk(res)
      expect(data).toEqual({ pending: true })

      // No session: no tokens in the body, no refresh-token cookie (ADR 0009).
      expect((data as { accessToken?: string }).accessToken).toBeUndefined()
      expect(extractCookie(res)).toBe('')
    })

    it('is byte-identical for new vs existing email (status, body, cookie)', async () => {
      const fresh = await client.auth.signup.$post({
        json: {
          email: TEST_CREDENTIALS.alice.rawEmail,
          password: TEST_CREDENTIALS.alice.rawPassword,
        },
      })

      const creds = await createTestToto()
      const existing = await client.auth.signup.$post({
        json: { email: creds.rawEmail, password: creds.rawPassword },
      })

      expect(existing.status).toBe(fresh.status)
      expect(await existing.json()).toEqual(await fresh.json())
      expect(extractCookie(existing)).toBe(extractCookie(fresh))
    })

    it('should reject invalid email format', async () => {
      const res = await client.auth.signup.$post({
        json: { email: 'invalid-email', password: TEST_CREDENTIALS.toto.rawPassword },
      })

      await expectError(res, HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject empty email', async () => {
      const res = await client.auth.signup.$post({
        json: { email: '', password: TEST_CREDENTIALS.toto.rawPassword },
      })

      await expectError(res, HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject too short password', async () => {
      const res = await client.auth.signup.$post({
        json: {
          email: TEST_CREDENTIALS.toto.rawEmail,
          password: TEST_CREDENTIALS.invalide.motDePasseTropCourt,
        },
      })

      await expectError(res, HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject weak password (no uppercase)', async () => {
      const res = await client.auth.signup.$post({
        json: {
          email: TEST_CREDENTIALS.toto.rawEmail,
          password: TEST_CREDENTIALS.invalide.sansMajuscule,
        },
      })

      await expectError(res, HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject weak password (no digit)', async () => {
      const res = await client.auth.signup.$post({
        json: {
          email: TEST_CREDENTIALS.toto.rawEmail,
          password: TEST_CREDENTIALS.invalide.sansChiffre,
        },
      })

      await expectError(res, HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject weak password (no special char)', async () => {
      const res = await client.auth.signup.$post({
        json: {
          email: TEST_CREDENTIALS.toto.rawEmail,
          password: TEST_CREDENTIALS.invalide.sansCaractereSpecial,
        },
      })

      await expectError(res, HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject empty password', async () => {
      const res = await client.auth.signup.$post({
        json: { email: TEST_CREDENTIALS.toto.rawEmail, password: '' },
      })

      await expectError(res, HTTP_STATUS.BAD_REQUEST)
    })

    it('accepts an already-registered email with the same neutral 200', async () => {
      const creds = await createTestToto()

      // Different casing still resolves to the existing account: neutral pending,
      // never a CONFLICT/email_exists that would confirm the address.
      const pending = await expectOk(
        client.auth.signup.$post({
          json: { email: 'TOTO@EXEMPLE.FR', password: creds.rawPassword },
        })
      )
      expect(pending).toEqual({ pending: true })
    })

    it('should reject empty body', async () => {
      const res = await client.auth.signup.$post({
        // @ts-expect-error: exercising the validator with an empty body
        json: {},
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })
  })

  describe('POST /auth/login', () => {
    it('sets the refresh cookie at the root path', async () => {
      const creds = await createTestToto()

      const res = await client.auth.login.$post({
        json: { email: creds.rawEmail, password: creds.rawPassword },
      })

      const session = await expectOk(res)
      expect(session.user.email).toBe(creds.rawEmail)
      expect(session.accessToken).toBeDefined()
      expect((session as { refreshToken?: string }).refreshToken).toBeUndefined()

      const cookie = getActiveRefreshSetCookie(res)
      expect(cookie).toContain('refresh_token=')
      expect(cookie).toContain('HttpOnly')
      expect(cookie).toMatch(/(?:^|; )Path=\/(?:;|$)/)
    })

    it('should reject wrong password', async () => {
      const creds = await createTestToto()

      const res = await client.auth.login.$post({
        json: {
          email: creds.rawEmail,
          password: TEST_CREDENTIALS.invalide.mauvaisMotDePasse,
        },
      })

      await expectError(res, HTTP_STATUS.UNAUTHORIZED, 'invalid_credentials')
    })

    it('should reject non-existent user', async () => {
      const res = await client.auth.login.$post({
        json: {
          email: TEST_CREDENTIALS.invalide.emailInconnu,
          password: TEST_CREDENTIALS.toto.rawPassword,
        },
      })

      await expectError(res, HTTP_STATUS.UNAUTHORIZED, 'invalid_credentials')
    })

    it('should reject invalid email format', async () => {
      const res = await client.auth.login.$post({
        json: { email: 'not-an-email', password: TEST_CREDENTIALS.toto.rawPassword },
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject empty email', async () => {
      const res = await client.auth.login.$post({
        json: { email: '', password: TEST_CREDENTIALS.toto.rawPassword },
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject empty password', async () => {
      const creds = await createTestToto()

      const res = await client.auth.login.$post({
        json: { email: creds.rawEmail, password: '' },
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject empty body', async () => {
      const res = await client.auth.login.$post({
        // @ts-expect-error: exercising the validator with an empty body
        json: {},
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should not expose passwordHash in response body', async () => {
      const creds = await createTestToto()

      const session = await expectOk(
        client.auth.login.$post({
          json: { email: creds.rawEmail, password: creds.rawPassword },
        })
      )

      expect((session.user as { passwordHash?: string }).passwordHash).toBeUndefined()
      expect((session.user as { password?: string }).password).toBeUndefined()
    })
  })

  describe('POST /auth/refresh', () => {
    it('should rotate tokens with valid refresh cookie', async () => {
      const creds = await createTestToto()
      const { cookie: loginCookie } = await loginAndGetCookies(
        client,
        creds.rawEmail,
        creds.rawPassword
      )

      const res = await client.auth.refresh.$post({}, { headers: { Cookie: loginCookie } })

      const data = await expectOk(res)
      expect(data.accessToken).toBeDefined()

      const newCookie = extractCookie(res)
      expect(newCookie).toContain('refresh_token=')
    })

    it('rotates a legacy-path session and expires its old cookie', async () => {
      const creds = await createTestToto()
      const { cookie: legacyCookie } = await loginAndGetCookies(
        client,
        creds.rawEmail,
        creds.rawPassword
      )

      const res = await client.auth.refresh.$post({}, { headers: { Cookie: legacyCookie } })

      const data = await expectOk(res)
      expect(data.accessToken).toBeDefined()

      // Without this deletion, the revoked legacy cookie wins on the next refresh.
      const legacyDeletion = getRefreshSetCookies(res).find(
        (cookie) => cookie.includes('Max-Age=0') && cookie.includes('Path=/api/auth')
      )
      expect(legacyDeletion).toBeDefined()
    })

    it('should fail without refresh token', async () => {
      const res = await client.auth.refresh.$post({})

      await expectError(res, HTTP_STATUS.BAD_REQUEST, 'missing_refresh_token')
    })

    it('should fail with invalid refresh cookie', async () => {
      const res = await client.auth.refresh.$post(
        {},
        { headers: { Cookie: 'refresh_token=invalid.token.here' } }
      )

      await expectError(res, HTTP_STATUS.UNAUTHORIZED, 'invalid_token')
    })

    it('should invalidate old refresh token after rotation (replay detection)', async () => {
      const creds = await createTestToto()
      const { cookie: loginCookie } = await loginAndGetCookies(
        client,
        creds.rawEmail,
        creds.rawPassword
      )

      const res1 = await client.auth.refresh.$post({}, { headers: { Cookie: loginCookie } })
      expect(res1.status).toBe(HTTP_STATUS.OK)

      const res2 = await client.auth.refresh.$post({}, { headers: { Cookie: loginCookie } })
      expect(res2.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })

    it('should allow multiple successive rotations with fresh cookies', async () => {
      const creds = await createTestToto()
      let { cookie: currentCookie } = await loginAndGetCookies(
        client,
        creds.rawEmail,
        creds.rawPassword
      )

      for (let i = 0; i < 3; i++) {
        const res = await client.auth.refresh.$post({}, { headers: { Cookie: currentCookie } })

        const data = await expectOk(res)
        expect(data.accessToken).toBeDefined()

        currentCookie = extractActiveRefreshCookie(res)
        expect(currentCookie).toContain('refresh_token=')
      }
    })

    it('should not expose refreshToken in response body', async () => {
      const creds = await createTestToto()
      const { cookie } = await loginAndGetCookies(client, creds.rawEmail, creds.rawPassword)

      const data = await expectOk(client.auth.refresh.$post({}, { headers: { Cookie: cookie } }))

      expect((data as { refreshToken?: string }).refreshToken).toBeUndefined()
    })
  })

  describe('POST /auth/logout', () => {
    it('clears refresh cookies at both the root and legacy paths', async () => {
      const creds = await createTestToto()
      const { cookie, accessToken } = await loginAndGetCookies(
        client,
        creds.rawEmail,
        creds.rawPassword
      )

      const res = await client.auth.logout.$post(
        {},
        {
          headers: {
            Cookie: cookie,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)

      const clearedRefreshCookies = getRefreshSetCookies(res).filter((cookie) =>
        cookie.includes('Max-Age=0')
      )
      expect(clearedRefreshCookies).toHaveLength(2)
      expect(clearedRefreshCookies.some((cookie) => /(?:^|; )Path=\/(?:;|$)/.test(cookie))).toBe(
        true
      )
      expect(clearedRefreshCookies.some((cookie) => cookie.includes('Path=/api/auth'))).toBe(true)
    })

    it('deletes a demo account immediately', async () => {
      const demoResponse = await client.auth.demo.$post()
      const demo = await expectOk(demoResponse, HTTP_STATUS.CREATED)

      await expectOk(
        client.auth.logout.$post(
          {},
          {
            headers: {
              Cookie: extractActiveRefreshCookie(demoResponse),
              Authorization: `Bearer ${demo.accessToken}`,
            },
          }
        )
      )

      const [remaining] = await testDb
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, demo.user.id))
      expect(remaining).toBeUndefined()
    })

    it('sets the JS-readable session hint on login and clears it on logout', async () => {
      const creds = await createTestToto()
      const {
        res: login,
        cookie,
        accessToken,
      } = await loginAndGetCookies(client, creds.rawEmail, creds.rawPassword)

      const loginHint = login.headers.getSetCookie().find((c) => c.startsWith('aurore_session='))
      expect(loginHint).toContain('aurore_session=1')
      expect(loginHint).not.toContain('HttpOnly') // must be readable by JS at boot
      expect(loginHint).toContain('Path=/')

      const logout = await client.auth.logout.$post(
        {},
        { headers: { Cookie: cookie, Authorization: `Bearer ${accessToken}` } }
      )
      const logoutHint = logout.headers.getSetCookie().find((c) => c.startsWith('aurore_session='))
      expect(logoutHint).toBeDefined()
      expect(logoutHint).not.toContain('aurore_session=1') // cleared
    })

    expectRequiresAuth(() => app, { method: 'POST', path: '/api/auth/logout' })

    it('should invalidate refresh token after logout', async () => {
      const creds = await createTestToto()
      const { cookie, accessToken } = await loginAndGetCookies(
        client,
        creds.rawEmail,
        creds.rawPassword
      )

      await client.auth.logout.$post(
        {},
        {
          headers: {
            Cookie: cookie,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      const refreshRes = await client.auth.refresh.$post({}, { headers: { Cookie: cookie } })
      expect(refreshRes.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })

    it('should allow re-login after logout', async () => {
      const creds = await createTestToto()
      const { cookie, accessToken } = await loginAndGetCookies(
        client,
        creds.rawEmail,
        creds.rawPassword
      )

      await client.auth.logout.$post(
        {},
        {
          headers: {
            Cookie: cookie,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      const relogin = await expectOk(
        client.auth.login.$post({
          json: { email: creds.rawEmail, password: creds.rawPassword },
        })
      )
      expect(relogin.user.email).toBe(creds.rawEmail)
    })

    it('should not affect other user sessions on logout', async () => {
      const toto = TEST_CREDENTIALS.toto
      const alice = TEST_CREDENTIALS.alice
      await createTestUser(toto.rawEmail, toto.rawPassword)
      await createTestUser(alice.rawEmail, alice.rawPassword)

      const totoSession = await loginAndGetCookies(client, toto.rawEmail, toto.rawPassword)
      const aliceSession = await loginAndGetCookies(client, alice.rawEmail, alice.rawPassword)

      await client.auth.logout.$post(
        {},
        {
          headers: {
            Cookie: totoSession.cookie,
            Authorization: `Bearer ${totoSession.accessToken}`,
          },
        }
      )

      const aliceRefresh = await client.auth.refresh.$post(
        {},
        { headers: { Cookie: aliceSession.cookie } }
      )
      expect(aliceRefresh.status).toBe(HTTP_STATUS.OK)
    })

    it('uses the access-token identity when the refresh cookie belongs to another user', async () => {
      const toto = TEST_CREDENTIALS.toto
      const alice = TEST_CREDENTIALS.alice
      await createTestUser(toto.rawEmail, toto.rawPassword)
      await createTestUser(alice.rawEmail, alice.rawPassword)

      const totoSession = await loginAndGetCookies(client, toto.rawEmail, toto.rawPassword)
      const aliceSession = await loginAndGetCookies(client, alice.rawEmail, alice.rawPassword)

      // A stale cross-account cookie must never let Toto revoke Alice's session.
      await client.auth.logout.$post(
        {},
        {
          headers: {
            Cookie: aliceSession.cookie,
            Authorization: `Bearer ${totoSession.accessToken}`,
          },
        }
      )

      const aliceRefresh = await client.auth.refresh.$post(
        {},
        { headers: { Cookie: aliceSession.cookie } }
      )
      expect(aliceRefresh.status).toBe(HTTP_STATUS.OK)
    })
  })

  describe('GET /auth/session', () => {
    it('should return authenticated user info', async () => {
      const creds = await createTestToto()
      const { accessToken } = await loginAndGetCookies(client, creds.rawEmail, creds.rawPassword)

      const session = await expectOk(client.auth.session.$get({}, withAuth(accessToken)))
      expect(session.authenticated).toBe(true)
      expect(session.userId).toBeDefined()
    })

    expectRequiresAuth(() => app, { method: 'GET', path: '/api/auth/session' })

    // Logout revokes the refresh token row; the access token is a stateless JWT
    // with no revocation list, so it keeps opening /session until its ~15min TTL.
    // Pinning that here so a future "logout kills everything" claim has to face it.
    it('keeps accepting the access token after logout (only the refresh token is revoked)', async () => {
      const creds = await createTestToto()
      const { cookie, accessToken } = await loginAndGetCookies(
        client,
        creds.rawEmail,
        creds.rawPassword
      )

      await client.auth.logout.$post(
        {},
        {
          headers: {
            Cookie: cookie,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      const session = await expectOk(client.auth.session.$get({}, withAuth(accessToken)))
      expect(session.authenticated).toBe(true)
    })

    it('should return correct user for each session', async () => {
      const toto = TEST_CREDENTIALS.toto
      const alice = TEST_CREDENTIALS.alice
      await createTestUser(toto.rawEmail, toto.rawPassword)
      await createTestUser(alice.rawEmail, alice.rawPassword)

      const { accessToken: tokenToto } = await loginAndGetCookies(
        client,
        toto.rawEmail,
        toto.rawPassword
      )
      const { accessToken: tokenAlice } = await loginAndGetCookies(
        client,
        alice.rawEmail,
        alice.rawPassword
      )

      const sessionToto = await expectOk(client.auth.session.$get({}, withAuth(tokenToto)))
      const sessionAlice = await expectOk(client.auth.session.$get({}, withAuth(tokenAlice)))

      expect(sessionToto.userId).toBeDefined()
      expect(sessionAlice.userId).toBeDefined()
      expect(sessionToto.userId).not.toBe(sessionAlice.userId)
    })
  })

  describe('POST /auth/verify-email', () => {
    it('should verify a valid token and return ok(null)', async () => {
      const { createVerificationToken } = await import('../email-verification.service')
      const creds = TEST_CREDENTIALS.toto
      const user = await createTestUser(creds.rawEmail, creds.rawPassword)
      const token = await createVerificationToken(testDb, user.id)

      const result = await expectOk(client.auth['verify-email'].$post({ json: { token } }))
      expect(result).toBeNull()
    })

    it('should return invalid_token (400) for unknown token', async () => {
      const res = await client.auth['verify-email'].$post({
        json: { token: 'a'.repeat(64) },
      })

      await expectError(res, HTTP_STATUS.BAD_REQUEST, 'invalid_token')
    })

    it('should return token_expired (400) for expired token', async () => {
      const { createVerificationToken } = await import('../email-verification.service')
      const { emailVerifications } = await import('../../../db/schema')
      const creds = TEST_CREDENTIALS.toto
      const user = await createTestUser(creds.rawEmail, creds.rawPassword)
      const token = await createVerificationToken(testDb, user.id)

      await testDb
        .update(emailVerifications)
        .set({ expiresAt: new Date(Date.now() - 1000).toISOString() })
        .where(eq(emailVerifications.userId, user.id))

      const res = await client.auth['verify-email'].$post({ json: { token } })

      await expectError(res, HTTP_STATUS.BAD_REQUEST, 'token_expired')
    })
  })

  describe('POST /auth/resend-verification', () => {
    it('should resend verification email when authenticated and unverified', async () => {
      const creds = await createTestToto()
      const { accessToken } = await loginAndGetCookies(client, creds.rawEmail, creds.rawPassword)

      const res = await client.auth['resend-verification'].$post({}, withAuth(accessToken))

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should return ok(null) when already verified (idempotent)', async () => {
      const { users: usersTable } = await import('../../../db/schema')
      const creds = TEST_CREDENTIALS.toto
      const user = await createTestUser(creds.rawEmail, creds.rawPassword)
      const { accessToken } = await loginAndGetCookies(client, creds.rawEmail, creds.rawPassword)

      await testDb
        .update(usersTable)
        .set({ emailVerifiedAt: new Date().toISOString() })
        .where(eq(usersTable.id, user.id))

      const res = await client.auth['resend-verification'].$post({}, withAuth(accessToken))

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    expectRequiresAuth(() => app, { method: 'POST', path: '/api/auth/resend-verification' })

    it('should return too_many_requests (429) after 3 requests in the same hour', async () => {
      const creds = TEST_CREDENTIALS.alice
      await createTestUser(creds.rawEmail, creds.rawPassword)
      const { accessToken } = await loginAndGetCookies(client, creds.rawEmail, creds.rawPassword)

      const makeRequest = () => client.auth['resend-verification'].$post({}, withAuth(accessToken))

      await makeRequest()
      await makeRequest()
      await makeRequest()

      const res = await makeRequest()
      await expectError(res, 429, 'too_many_requests')
    })
  })

  describe('POST /auth/login — email_not_verified', () => {
    it('devrait retourner email_not_verified (403) après la grace period', async () => {
      const { users: usersTable } = await import('../../../db/schema')
      const creds = TEST_CREDENTIALS.toto
      const user = await createTestUser(creds.rawEmail, creds.rawPassword)

      await testDb
        .update(usersTable)
        .set({ createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() })
        .where(eq(usersTable.id, user.id))

      const res = await client.auth.login.$post({
        json: { email: creds.rawEmail, password: creds.rawPassword },
      })

      await expectError(res, HTTP_STATUS.FORBIDDEN, 'email_not_verified')
    })
  })

  describe('Full auth flow', () => {
    it('should complete signup → login → refresh → session → logout cycle', async () => {
      const creds = TEST_CREDENTIALS.alice

      const signupRes = await client.auth.signup.$post({
        json: { email: creds.rawEmail, password: creds.rawPassword },
      })
      // Signup is neutral now (ADR 0009): 200, no session. The flow logs in next.
      expect(signupRes.status).toBe(HTTP_STATUS.OK)

      const { cookie, accessToken } = await loginAndGetCookies(
        client,
        creds.rawEmail,
        creds.rawPassword
      )
      expect(accessToken).toBeDefined()

      const refreshRes = await client.auth.refresh.$post({}, { headers: { Cookie: cookie } })
      const { accessToken: newAccessToken } = await expectOk(refreshRes)
      const newCookie = extractActiveRefreshCookie(refreshRes)

      const sessionData = await expectOk(client.auth.session.$get({}, withAuth(newAccessToken)))
      expect(sessionData.authenticated).toBe(true)

      const logoutRes = await client.auth.logout.$post(
        {},
        {
          headers: {
            Cookie: newCookie,
            Authorization: `Bearer ${newAccessToken}`,
          },
        }
      )
      expect(logoutRes.status).toBe(HTTP_STATUS.OK)

      const postLogoutRefresh = await client.auth.refresh.$post(
        {},
        { headers: { Cookie: newCookie } }
      )
      expect(postLogoutRefresh.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  describe('POST /auth/forgot-password', () => {
    it('returns a neutral pending response with no session cookie for an unknown email', async () => {
      const res = await client.auth['forgot-password'].$post({
        json: { email: TEST_CREDENTIALS.invalide.emailInconnu },
      })

      expect(await expectOk(res)).toEqual({ pending: true })
      expect(extractCookie(res)).toBe('')
    })

    it('returns the same neutral response for an existing email (no enumeration)', async () => {
      const creds = await createTestToto()

      const unknown = await client.auth['forgot-password'].$post({
        json: { email: TEST_CREDENTIALS.alice.email },
      })
      const existing = await client.auth['forgot-password'].$post({
        json: { email: creds.rawEmail },
      })

      expect(existing.status).toBe(unknown.status)
      expect(await existing.json()).toEqual(await unknown.json())
    })

    it('rejects a malformed email at the validation boundary (400)', async () => {
      const res = await client.auth['forgot-password'].$post({
        json: { email: 'not-an-email' },
      })

      expectStatus(res, HTTP_STATUS.BAD_REQUEST)
    })
  })

  describe('POST /auth/reset-password', () => {
    async function issueToken(email: string, password: string) {
      const { createPasswordResetToken } = await import('../password-reset.service')
      const user = await createTestUser(email, password)
      const token = await createPasswordResetToken(testDb, user.id)
      return { user, token }
    }

    it('resets the password and returns ok(null); the new password then logs in', async () => {
      const creds = TEST_CREDENTIALS.toto
      const { token } = await issueToken(creds.rawEmail, creds.rawPassword)
      const newPassword = 'NouveauPass123!'

      const result = await expectOk(
        client.auth['reset-password'].$post({
          json: { token, password: newPassword },
        })
      )
      expect(result).toBeNull()

      const login = await client.auth.login.$post({
        json: { email: creds.rawEmail, password: newPassword },
      })
      expect(login.status).toBe(HTTP_STATUS.OK)
    })

    it('maps an unknown token to invalid_token (400)', async () => {
      const res = await client.auth['reset-password'].$post({
        json: { token: 'a'.repeat(64), password: 'NouveauPass123!' },
      })

      await expectError(res, HTTP_STATUS.BAD_REQUEST, 'invalid_token')
    })

    it('maps an expired token to token_expired (400)', async () => {
      const { passwordResets } = await import('../../../db/schema')
      const creds = TEST_CREDENTIALS.toto
      const { user, token } = await issueToken(creds.rawEmail, creds.rawPassword)

      await testDb
        .update(passwordResets)
        .set({ expiresAt: new Date(Date.now() - 1000).toISOString() })
        .where(eq(passwordResets.userId, user.id))

      const res = await client.auth['reset-password'].$post({
        json: { token, password: 'NouveauPass123!' },
      })

      await expectError(res, HTTP_STATUS.BAD_REQUEST, 'token_expired')
    })

    it('rejects a token of the wrong length at the validation boundary (400)', async () => {
      const res = await client.auth['reset-password'].$post({
        json: { token: 'too-short', password: 'NouveauPass123!' },
      })

      expectStatus(res, HTTP_STATUS.BAD_REQUEST)
    })

    it('rejects a weak password at the validation boundary (400)', async () => {
      const res = await client.auth['reset-password'].$post({
        json: { token: 'a'.repeat(64), password: '123' },
      })

      expectStatus(res, HTTP_STATUS.BAD_REQUEST)
    })
  })
})

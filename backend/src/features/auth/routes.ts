import {
  authSchema as authBodySchema,
  authErrorMapping,
  bannedError,
  changePasswordSchema,
  err,
  errorToStatus,
  forgotPasswordSchema,
  HTTP_STATUS,
  isApiSuccess,
  ok,
  type RawPassword,
  refreshTokenBodySchema,
  resetPasswordErrorMapping,
  resetPasswordSchema,
  verifyEmailBodySchema,
} from '@aurore/shared'

import type { Context } from 'hono'
import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'

import type { AppEnv } from '../../app-env'
import { withAdminRls } from '../../db/rls'
import { getAuthedUserId, getRlsDb } from '../../utils/accessors'
import { clientIp } from '../../utils/clientIp'
import {
  demoRateLimiterFunc,
  forgotPasswordRateLimiterFunc,
  loginRateLimiterFunc,
  rateLimiterFunc,
  resetPasswordRateLimiterFunc,
} from '../../utils/rateLimiter'
import { zValidator } from '../../utils/validator'
import { isUserBanned } from './ban.service'
import { sendVerificationEmail } from './email.service'
import {
  createVerificationToken,
  getUnverifiedEmail,
  getUnverifiedRecipientByToken,
  verifyEmailToken,
} from './email-verification.service'
import { getGoogleAuthUrl, handleGoogleCallback } from './google.service'
import { clearRefreshTokenCookie, extractRefreshToken, setRefreshTokenCookie } from './jwt.utils'
import { requireJwtAuth, requireNotBanned } from './middleware'
import { requestPasswordReset, resetPassword } from './password-reset.service'
import { withRlsContext } from './rls-context.middleware'
import {
  type AuthContext,
  changePassword,
  createDemo,
  getUserRole,
  login,
  logout,
  refresh,
  signup,
} from './service'

function buildAnonAuthContext(c: Context<AppEnv>): AuthContext {
  return {
    db: c.get('anonDb'),
    jwtSecret: c.get('jwtSecret'),
    refreshSecret: c.get('refreshSecret'),
    frontendUrl: c.get('frontendUrl'),
    ip: clientIp(c),
    userAgent: c.req.header('User-Agent') ?? 'unknown',
  }
}

const resendLimiter = new Map<string, { count: number; windowStart: number }>()
const RESEND_MAX = 3
const RESEND_WINDOW_MS = 60 * 60 * 1000

function checkResendLimit(userId: string): boolean {
  const now = Date.now()
  const entry = resendLimiter.get(userId)
  if (!entry || now - entry.windowStart > RESEND_WINDOW_MS) {
    resendLimiter.set(userId, { count: 1, windowStart: now })
    return true
  }
  if (entry.count >= RESEND_MAX) return false
  entry.count++
  return true
}

const app = new Hono<AppEnv>()

app.use('*', rateLimiterFunc)

// Auth flows that run before identity is known use anonDb. Authenticated routes that
// read RLS-protected data must establish requestDb before checking bans or entering
// their handler.
app.use('/logout', requireJwtAuth)
app.use('/session', requireJwtAuth)
app.use('/mobile/logout', requireJwtAuth)
app.use('/resend-verification', requireJwtAuth)
// /logout intentionally skips requireNotBanned: banned users must still be able
// to clear their refresh token cookie.
app.use('/session', withRlsContext)
app.use('/resend-verification', withRlsContext)
app.use('/session', requireNotBanned)
app.use('/resend-verification', requireNotBanned)

// Same gate on every route that hands out a fresh token, /login included:
// applyAuthedGuards would reject the banned user later anyway, but issuing first
// and refusing after is the login-then-redirect race this closes. withAdminRls
// because there is no authenticated session yet
function activeGlobalBan(userId: string) {
  return withAdminRls((tx) => isUserBanned(tx, userId, 'global', false))
}

// Call after any cookie change: c.json freezes the headers set so far
function bannedJson(
  c: Context<AppEnv>,
  ban: NonNullable<Awaited<ReturnType<typeof activeGlobalBan>>>
) {
  return c.json(
    bannedError({ expiresAt: ban.expiresAt, reason: ban.reason }),
    HTTP_STATUS.FORBIDDEN
  )
}

export const jwtAuthRoutes = app

  .post('/login', loginRateLimiterFunc, zValidator('json', authBodySchema), async (c) => {
    const env = c.get('env')
    const ctx = buildAnonAuthContext(c)
    const { email, password } = c.req.valid('json')

    const result = await login(ctx, email, password)

    if (!isApiSuccess(result)) {
      return c.json(err(result.error), errorToStatus(result.error, authErrorMapping))
    }

    const ban = await activeGlobalBan(result.data.user.id)
    if (ban) return bannedJson(c, ban)

    setRefreshTokenCookie(c, result.data.refreshToken, env)

    return c.json(
      ok({ user: result.data.user, accessToken: result.data.accessToken }),
      HTTP_STATUS.OK
    )
  })

  .post('/signup', zValidator('json', authBodySchema), async (c) => {
    const ctx = buildAnonAuthContext(c)
    const { email, password } = c.req.valid('json')

    const result = await signup(ctx, email, password)

    if (!isApiSuccess(result)) {
      return c.json(err(result.error), errorToStatus(result.error, authErrorMapping))
    }

    // Enumeration-safe (ADR 0009): identical neutral response for new and existing
    // emails: no session, no tokens, no Set-Cookie. The user proceeds via email.
    return c.json(ok(result.data), HTTP_STATUS.OK)
  })

  .post('/demo', demoRateLimiterFunc, async (c) => {
    const env = c.get('env')
    const ctx = buildAnonAuthContext(c)

    const result = await createDemo(ctx)

    if (!isApiSuccess(result)) {
      return c.json(err(result.error), HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }

    setRefreshTokenCookie(c, result.data.refreshToken, env)

    return c.json(
      ok({ user: result.data.user, accessToken: result.data.accessToken }),
      HTTP_STATUS.CREATED
    )
  })

  .post('/refresh', async (c) => {
    const env = c.get('env')
    const ctx = buildAnonAuthContext(c)
    const refreshToken = await extractRefreshToken(c)

    if (!refreshToken) {
      return c.json(err('missing_refresh_token'), HTTP_STATUS.BAD_REQUEST)
    }

    const result = await refresh(ctx, refreshToken)

    if (!isApiSuccess(result)) {
      clearRefreshTokenCookie(c)
      return c.json(err(result.error), errorToStatus(result.error, authErrorMapping))
    }

    // The presented token is already consumed, so the banned caller keeps nothing
    const ban = await activeGlobalBan(result.data.user.id)
    if (ban) {
      clearRefreshTokenCookie(c)
      return bannedJson(c, ban)
    }

    setRefreshTokenCookie(c, result.data.refreshToken, env)

    return c.json(
      ok({ user: result.data.user, accessToken: result.data.accessToken }),
      HTTP_STATUS.OK
    )
  })

  .post('/logout', async (c) => {
    const ctx = buildAnonAuthContext(c)
    const refreshToken = await extractRefreshToken(c)

    await logout(ctx, refreshToken ?? null, getAuthedUserId(c))

    clearRefreshTokenCookie(c)

    return c.json(ok(null, 'Disconnected'), HTTP_STATUS.OK)
  })

  .post(
    '/change-password',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    zValidator('json', changePasswordSchema),
    async (c) => {
      const requestDb = getRlsDb(c)
      const userId = getAuthedUserId(c)
      const { currentPassword, newPassword } = c.req.valid('json')

      const result = await changePassword(
        requestDb,
        userId,
        currentPassword as RawPassword,
        newPassword as RawPassword
      )
      if (!isApiSuccess(result)) {
        return c.json(err(result.error), errorToStatus(result.error, authErrorMapping))
      }

      return c.json(ok(null), HTTP_STATUS.OK)
    }
  )

  .get('/session', async (c) => {
    const userId = getAuthedUserId(c)
    const requestDb = getRlsDb(c)
    const role = await getUserRole(requestDb, userId)

    return c.json(
      ok({
        authenticated: true as const,
        userId,
        role: role ?? 'user',
      }),
      HTTP_STATUS.OK
    )
  })

  .post('/verify-email', zValidator('json', verifyEmailBodySchema), async (c) => {
    const { db } = buildAnonAuthContext(c)
    const { token } = c.req.valid('json')

    const result = await verifyEmailToken(db, token)

    if (!result.success) {
      return c.json(err(result.error), HTTP_STATUS.BAD_REQUEST)
    }

    return c.json(ok(null), HTTP_STATUS.OK)
  })

  .post('/resend-verification-token', zValidator('json', verifyEmailBodySchema), async (c) => {
    const { db } = buildAnonAuthContext(c)
    const { token } = c.req.valid('json')
    const recipient = await getUnverifiedRecipientByToken(db, token)

    // Token possession identifies the account without weakening signup neutrality
    if (recipient === null) return c.json(ok(null), HTTP_STATUS.OK)
    if (!checkResendLimit(recipient.userId)) {
      return c.json(err('too_many_requests'), HTTP_STATUS.RATE_LIMIT_EXCEEDED)
    }

    const rawToken = await createVerificationToken(db, recipient.userId)
    const verificationUrl = `${c.get('frontendUrl')}/auth/verify-email?token=${rawToken}`
    await sendVerificationEmail(recipient.email, verificationUrl)

    return c.json(ok(null), HTTP_STATUS.OK)
  })

  .post('/resend-verification', async (c) => {
    const userId = getAuthedUserId(c)
    const requestDb = getRlsDb(c)
    const frontendUrl = c.get('frontendUrl')

    if (!checkResendLimit(userId)) {
      return c.json(err('too_many_requests'), HTTP_STATUS.RATE_LIMIT_EXCEEDED)
    }

    const email = await getUnverifiedEmail(requestDb, userId)
    if (email === null) {
      return c.json(ok(null), HTTP_STATUS.OK)
    }

    const rawToken = await createVerificationToken(requestDb, userId)
    const verificationUrl = `${frontendUrl}/auth/verify-email?token=${rawToken}`
    await sendVerificationEmail(email, verificationUrl)

    return c.json(ok(null), HTTP_STATUS.OK)
  })

  .post(
    '/forgot-password',
    forgotPasswordRateLimiterFunc,
    zValidator('json', forgotPasswordSchema),
    async (c) => {
      const ctx = buildAnonAuthContext(c)
      const { email } = c.req.valid('json')

      const result = await requestPasswordReset(ctx, email)

      if (!isApiSuccess(result)) {
        return c.json(err(result.error), HTTP_STATUS.INTERNAL_SERVER_ERROR)
      }

      // Enumeration-safe (ADR 0010): identical neutral response whether or not the
      // email exists. No session, no cookie. The user proceeds via the reset email.
      return c.json(ok(result.data), HTTP_STATUS.OK)
    }
  )

  .post(
    '/reset-password',
    resetPasswordRateLimiterFunc,
    zValidator('json', resetPasswordSchema),
    async (c) => {
      const ctx = buildAnonAuthContext(c)
      const { token, password } = c.req.valid('json')

      const result = await resetPassword(ctx, token, password as RawPassword)

      if (!isApiSuccess(result)) {
        // invalid/expired token gives 400 (mirror /verify-email); server_error gives 500. A distinct
        // invalid-vs-expired code is safe: token-holder-only, no enum oracle.
        return c.json(err(result.error), errorToStatus(result.error, resetPasswordErrorMapping))
      }

      return c.json(ok(null), HTTP_STATUS.OK)
    }
  )

  .post('/mobile/login', loginRateLimiterFunc, zValidator('json', authBodySchema), async (c) => {
    const ctx = buildAnonAuthContext(c)
    const { email, password } = c.req.valid('json')

    const result = await login(ctx, email, password)

    if (!isApiSuccess(result)) {
      return c.json(err(result.error), errorToStatus(result.error, authErrorMapping))
    }

    const ban = await activeGlobalBan(result.data.user.id)
    if (ban) return bannedJson(c, ban)

    return c.json(
      ok({
        user: result.data.user,
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
      }),
      HTTP_STATUS.OK
    )
  })

  .post('/mobile/signup', zValidator('json', authBodySchema), async (c) => {
    const ctx = buildAnonAuthContext(c)
    const { email, password } = c.req.valid('json')

    const result = await signup(ctx, email, password)

    if (!isApiSuccess(result)) {
      return c.json(err(result.error), errorToStatus(result.error, authErrorMapping))
    }

    // Same neutral response as the browser endpoint: no tokens (ADR 0009). The
    // mobile client moves to a "check your email" screen and verifies via the link.
    return c.json(ok(result.data), HTTP_STATUS.OK)
  })

  .post('/mobile/refresh', zValidator('json', refreshTokenBodySchema), async (c) => {
    const ctx = buildAnonAuthContext(c)
    const { refreshToken } = c.req.valid('json')

    if (!refreshToken) {
      return c.json(err('missing_refresh_token'), HTTP_STATUS.BAD_REQUEST)
    }

    const result = await refresh(ctx, refreshToken)

    if (!isApiSuccess(result)) {
      return c.json(err(result.error), errorToStatus(result.error, authErrorMapping))
    }

    const ban = await activeGlobalBan(result.data.user.id)
    if (ban) return bannedJson(c, ban)

    return c.json(
      ok({
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
      }),
      HTTP_STATUS.OK
    )
  })

  .post('/mobile/logout', zValidator('json', refreshTokenBodySchema), async (c) => {
    const ctx = buildAnonAuthContext(c)
    const { refreshToken } = c.req.valid('json')

    await logout(ctx, refreshToken ?? null, getAuthedUserId(c))

    return c.json(ok(null, 'Disconnected'), HTTP_STATUS.OK)
  })
  .get('/google', (c) => {
    const env = c.get('env')
    const { url, state, codeVerifier } = getGoogleAuthUrl()

    setCookie(c, 'google_oauth_state', state, {
      httpOnly: true,
      secure: env === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    })

    setCookie(c, 'google_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: env === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 10,
      path: '/',
    })

    return c.redirect(url)
  })

  .get('/google/callback', async (c) => {
    const env = c.get('env')
    const ctx = buildAnonAuthContext(c)
    const frontendCallbackUrl = `${c.get('frontendUrl')}/auth/google/callback`

    const storedState = getCookie(c, 'google_oauth_state')
    const storedVerifier = getCookie(c, 'google_code_verifier')
    const { code, state } = c.req.query()

    deleteCookie(c, 'google_oauth_state')
    deleteCookie(c, 'google_code_verifier')

    if (!storedState || !storedVerifier || !code || state !== storedState) {
      return c.redirect(frontendCallbackUrl)
    }

    const result = await handleGoogleCallback(ctx, code, storedVerifier)

    if (!isApiSuccess(result)) {
      return c.redirect(frontendCallbackUrl)
    }

    // A redirect cannot carry the 403 body, so the banned page stands in for it
    if (await activeGlobalBan(result.data.user.id)) {
      return c.redirect(`${c.get('frontendUrl')}/auth/banned`)
    }

    setRefreshTokenCookie(c, result.data.refreshToken, env)

    return c.redirect(`${frontendCallbackUrl}?oauth=1`)
  })

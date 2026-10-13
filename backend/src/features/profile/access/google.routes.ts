import {
  authErrorMapping,
  err,
  errorToStatus,
  HTTP_STATUS,
  ok,
  privacyAccessConfirmationSchema,
  privacyAccessStartSchema,
} from '@aurore/shared'

import { type Context, Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'

import type { AppEnv } from '../../../app-env'
import { loginRateLimiterFunc } from '../../../utils/rateLimiter'
import { zValidator } from '../../../utils/validator'
import {
  completeGooglePrivacyAccess,
  deleteAccount,
  readGooglePrivacyGrant,
  startGooglePrivacyAccess,
} from '../../auth/service'
import { exportFilename, exportForVerifiedOwner } from './service'

const FLOW_COOKIE = 'privacy_google'
const GRANT_COOKIE = 'privacy_access'
const COOKIE_PATH = '/api'

function writeCookie(c: Context<AppEnv>, name: string, value: string, maxAge: number) {
  setCookie(c, name, value, {
    httpOnly: true,
    secure: c.get('env') === 'production',
    sameSite: 'Lax',
    path: COOKIE_PATH,
    maxAge,
  })
}

async function currentGrant(c: Context<AppEnv>) {
  return readGooglePrivacyGrant(getCookie(c, GRANT_COOKIE) ?? '', c.get('jwtSecret'))
}

export async function handleGooglePrivacyCallback(c: Context<AppEnv>) {
  const flow = getCookie(c, FLOW_COOKIE) ?? ''
  deleteCookie(c, FLOW_COOKIE, { path: COOKIE_PATH })
  const token = await completeGooglePrivacyAccess(
    c.get('anonDb'),
    c.get('jwtSecret'),
    flow,
    c.req.query('code') ?? '',
    c.req.query('state') ?? ''
  )
  // An invalid marker lets the returning page explain failure without exposing OAuth details
  writeCookie(c, GRANT_COOKIE, token ?? 'failed', 300)
  c.header('Cache-Control', 'no-store')
  return c.redirect(`${c.get('frontendUrl')}/auth/banned`)
}

export const googlePrivacyAccessRoute = new Hono<AppEnv>()
  .use('*', async (c, next) => {
    c.header('Cache-Control', 'no-store')
    await next()
  })
  .post('/start', loginRateLimiterFunc, zValidator('json', privacyAccessStartSchema), async (c) => {
    const { operation } = c.req.valid('json')
    const flow = await startGooglePrivacyAccess(c.get('jwtSecret'), operation)
    deleteCookie(c, GRANT_COOKIE, { path: COOKIE_PATH })
    writeCookie(c, FLOW_COOKIE, flow.token, 600)
    return c.json(ok({ url: flow.url }), HTTP_STATUS.OK)
  })
  .get('/', async (c) => {
    if (!getCookie(c, GRANT_COOKIE)) return c.json(ok(null), HTTP_STATUS.OK)
    const grant = await currentGrant(c)
    if (!grant) return c.json(err('invalid_credentials'), HTTP_STATUS.UNAUTHORIZED)
    return c.json(
      ok({ userId: grant.userId, email: grant.email, operation: grant.operation }),
      HTTP_STATUS.OK
    )
  })
  .post(
    '/export',
    loginRateLimiterFunc,
    zValidator('json', privacyAccessConfirmationSchema),
    async (c) => {
      const grant = await currentGrant(c)
      if (grant?.operation !== 'export' || grant.userId !== c.req.valid('json').userId) {
        return c.json(err('invalid_credentials'), HTTP_STATUS.UNAUTHORIZED)
      }
      const result = await exportForVerifiedOwner(
        c.get('anonDb'),
        grant.userId,
        '/profile/access/google/export'
      )
      if (!result.success)
        return c.json(
          err(result.error, result.details),
          errorToStatus(result.error, authErrorMapping)
        )
      deleteCookie(c, GRANT_COOKIE, { path: COOKIE_PATH })
      return c.body(JSON.stringify(result.data, null, 2), HTTP_STATUS.OK, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${exportFilename(grant.userId)}"`,
      })
    }
  )
  .post(
    '/delete-account',
    loginRateLimiterFunc,
    zValidator('json', privacyAccessConfirmationSchema),
    async (c) => {
      const grant = await currentGrant(c)
      if (grant?.operation !== 'delete-account' || grant.userId !== c.req.valid('json').userId) {
        return c.json(err('invalid_credentials'), HTTP_STATUS.UNAUTHORIZED)
      }
      await deleteAccount(grant.userId)
      deleteCookie(c, GRANT_COOKIE, { path: COOKIE_PATH })
      return c.body(null, HTTP_STATUS.NO_CONTENT)
    }
  )

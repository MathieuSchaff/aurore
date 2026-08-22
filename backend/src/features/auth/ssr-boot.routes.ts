import { HTTP_STATUS, ok, ssrBootQuerySchema } from '@aurore/shared'

import { type Context, Hono, type Next } from 'hono'
import { getCookie } from 'hono/cookie'

import type { AppEnv } from '../../app-env'
import { getRlsDb } from '../../utils/accessors'
import { zValidator } from '../../utils/validator'
import { requireSessionCookie } from './middleware'
import { withRlsContext } from './rls-context.middleware'
import { anonymousSsrBootResponse, getAuthenticatedSsrBootResponse } from './ssr-boot.service'

// The SSR boot fetch runs on the server, where Playwright cannot intercept it
// So the spec for the degraded path sets an e2e_boot_delay cookie, which the SSR fetch
// forwards, to push /boot past its 2 s SSR timeout
// Does nothing unless the e2e compose file sets E2E_TEST_HOOKS
const e2eBootDelay = async (c: Context<AppEnv>, next: Next) => {
  if (process.env.E2E_TEST_HOOKS === '1') {
    const delayMs = Number(getCookie(c, 'e2e_boot_delay'))
    if (Number.isFinite(delayMs) && delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, Math.min(delayMs, 10_000)))
    }
  }
  return next()
}

const app = new Hono<AppEnv>()

export const ssrBootRoutes = app.get(
  '/boot',
  e2eBootDelay,
  requireSessionCookie,
  withRlsContext,
  zValidator('query', ssrBootQuerySchema),
  async (c) => {
    const userId = c.get('userId')
    // Shared validation owns this large contract, so Hono does not expand it into AppType
    if (!userId) return c.json(ok(anonymousSsrBootResponse as unknown), HTTP_STATUS.OK)

    const response = await getAuthenticatedSsrBootResponse(
      getRlsDb(c),
      userId,
      c.req.valid('query')
    )
    return c.json(ok(response as unknown), HTTP_STATUS.OK)
  }
)

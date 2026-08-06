import { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { globalErrorHandler } from '../../utils/errors/error-handler'
import { JWT_SECRET, REFRESH_SECRET } from './secrets'

// Bare Hono wired to an RLS-enforced pool. createTestApp injects the owner testDb
// (implicit BYPASSRLS), which masks production; suites that must observe the real
// policies build on this instead and mount only the routers they probe.
export function createRlsApp(anonDb: AppEnv['Variables']['anonDb']) {
  const app = new Hono<AppEnv>()
  app.onError(globalErrorHandler)

  app.use('*', async (c, next) => {
    c.set('anonDb', anonDb)
    c.set('env', 'development')
    c.set('jwtSecret', JWT_SECRET)
    c.set('refreshSecret', REFRESH_SECRET)
    c.set('frontendUrl', 'http://localhost:5173')
    await next()
  })

  return app
}

// Drives the web login route, which the RLS suites mount bare under /auth.
// Distinct from loginAndGetToken, which drives /mobile/login.
export async function loginViaRlsApp(
  app: Hono<AppEnv>,
  email: string,
  password: string,
  authBase = '/auth'
): Promise<string> {
  const res = await app.request(`${authBase}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const body = (await res.json()) as { success: boolean; data?: { accessToken: string } }
  if (!body.success || !body.data) throw new Error(`login failed for ${email}`)
  return body.data.accessToken
}

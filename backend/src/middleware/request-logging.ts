import type { MiddlewareHandler } from 'hono'

import type { AppEnv } from '../app-env'
import { HEALTH_PATH, READY_PATH } from '../features/health/routes'
import { logger } from '../lib/logger'

// Container probes run every 30s and accounted for 85% of the API log volume, which
// buried the handful of lines that carry actual traffic. A failing probe still logs.
const PROBE_PATHS = new Set<string>([HEALTH_PATH, READY_PATH])

export const requestLoggingMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  // Generated, never read from the request: an inbound header would let a client forge
  // or collide ids. cors() exposes X-Request-Id so the browser can read it back.
  const requestId = crypto.randomUUID()
  c.set('requestId', requestId)

  const start = Date.now()
  await next()
  c.header('X-Request-Id', requestId)

  if (PROBE_PATHS.has(c.req.path) && c.res.status < 400) return
  logger.info({
    requestId,
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    ms: Date.now() - start,
  })
}

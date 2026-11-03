import type { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { rateLimiterFunc } from '../../utils/rateLimiter'
import { requireJwtAuth, requireNotBanned } from './middleware'
import { withRlsContext } from './rls-context.middleware'

// Use only on an exclusive router prefix: blanket guards also affect sibling routes
// This adds a separate rate budget; read-heavy routers rely on the root budget and nginx
// Ban reads need the RLS transaction; role guards stay on individual routes
export const applyAuthedGuards = (app: Hono<AppEnv>): Hono<AppEnv> => {
  app.use('*', rateLimiterFunc)
  app.use('*', requireJwtAuth)
  app.use('*', withRlsContext)
  app.use('*', requireNotBanned)
  return app
}

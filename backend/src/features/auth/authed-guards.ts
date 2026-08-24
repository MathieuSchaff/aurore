import type { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { rateLimiterFunc } from '../../utils/rateLimiter'
import { requireJwtAuth, requireNotBanned } from './middleware'
import { withRlsContext } from './rls-context.middleware'

// Guards for authed routers, in this order: rate limit, JWT, RLS tx, ban check
// This rate limit is a second budget on top of globalRateLimiterFunc (index.ts, own store)
// Routers that mostly read (user-products, collection, profile) skip it on purpose
// and rely on the root one plus nginx
// The ban check reads ban rows under RLS, so it must run inside the request transaction
// requireAdmin and requireContentModerator stay per route
// A guard here would leak onto sibling routers and block contributors
export const applyAuthedGuards = (app: Hono<AppEnv>): Hono<AppEnv> => {
  app.use('*', rateLimiterFunc)
  app.use('*', requireJwtAuth)
  app.use('*', withRlsContext)
  app.use('*', requireNotBanned)
  return app
}

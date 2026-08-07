import type { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { rateLimiterFunc } from '../../utils/rateLimiter'
import { requireJwtAuth, requireNotBanned } from './middleware'
import { withRlsContext } from './rls-context.middleware'

// Shared blanket prelude for authenticated routers: rate limit, then JWT, then RLS tx, then not-banned.
// The ban check reads ban rows under RLS, so it must run inside the request transaction.
// Per-route authz (requireAdmin/requireContentModerator) stays inline: these routers share
// mount prefixes, so a blanket guard here would leak onto siblings and block contributors.
export const applyAuthedGuards = (app: Hono<AppEnv>): Hono<AppEnv> => {
  app.use('*', rateLimiterFunc)
  app.use('*', requireJwtAuth)
  app.use('*', withRlsContext)
  app.use('*', requireNotBanned)
  return app
}

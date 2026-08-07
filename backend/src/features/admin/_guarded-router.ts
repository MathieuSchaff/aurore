import type { MiddlewareHandler } from 'hono'
import { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { rateLimiterFunc } from '../../utils/rateLimiter'
import { requireJwtAuth, requireNotBanned } from '../auth/middleware'
import { withRlsContext } from '../auth/rls-context.middleware'

// Canonical chain for admin routers mounted on dedicated prefixes: rate limit, then
// JWT, then request RLS, then global ban, then route-specific authorization, then handler.
// `guard` (requireAdmin | requireContentModerator) is the only varying capability.
// Blanket use('*') is safe only while the consumer owns its complete mount prefix.
export function createAdminGuardedRouter(guard: MiddlewareHandler<AppEnv>) {
  return new Hono<AppEnv>()
    .use('*', rateLimiterFunc)
    .use('*', requireJwtAuth)
    .use('*', withRlsContext)
    .use('*', requireNotBanned)
    .use('*', guard)
}

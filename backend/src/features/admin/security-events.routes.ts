import { HTTP_STATUS, listSecurityEventsQuerySchema, ok } from '@aurore/shared'

import { getRlsDb } from '../../utils/accessors'
import { zValidator } from '../../utils/validator'
import { requireAdmin } from '../auth/middleware'
import { listSecurityEvents } from '../security/security.service'
import { createAdminGuardedRouter } from './_guarded-router'

// Security feed is an ops surface, not content moderation, so admin-only. Unique
// '/api/admin/security-events' prefix with no contributor-reachable siblings, so blanket guard is safe.
export const adminSecurityEventsRoutes = createAdminGuardedRouter(requireAdmin).get(
  '/',
  zValidator('query', listSecurityEventsQuerySchema),
  async (c) => {
    const filters = c.req.valid('query')
    const result = await listSecurityEvents(getRlsDb(c), filters)
    return c.json(ok(result), HTTP_STATUS.OK)
  }
)

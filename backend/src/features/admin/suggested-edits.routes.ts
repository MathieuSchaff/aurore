import {
  HTTP_STATUS,
  listSuggestedEditsQuerySchema,
  ok,
  reviewSuggestedEditBodySchema,
} from '@aurore/shared'

import { z } from 'zod'

import { logger } from '../../lib/logger'
import { getAuthedUserId, getRlsDb } from '../../utils/accessors'
import { zValidator } from '../../utils/validator'
import { requireContentModerator } from '../auth/middleware'
import { listSuggestedEdits, reviewSuggestedEdit } from '../suggested-edits/service'
import { createAdminGuardedRouter } from './_guarded-router'

const editIdParam = z.object({ id: z.uuid() })

// All routes are moderator-reachable (list + review); no admin-only verb mixed in, blanket guard is safe.
export const adminSuggestedEditsRoutes = createAdminGuardedRouter(requireContentModerator)
  .get('/', zValidator('query', listSuggestedEditsQuerySchema), async (c) => {
    const filters = c.req.valid('query')
    const result = await listSuggestedEdits(getRlsDb(c), filters)
    return c.json(ok(result), HTTP_STATUS.OK)
  })
  .patch(
    '/:id',
    zValidator('param', editIdParam),
    zValidator('json', reviewSuggestedEditBodySchema),
    async (c) => {
      const { id } = c.req.valid('param')
      const { status } = c.req.valid('json')
      const reviewerId = getAuthedUserId(c)
      const edit = await reviewSuggestedEdit(getRlsDb(c), { id, reviewerId, status })
      logger.info({ reviewerId, editId: id, status }, 'suggested edit reviewed')
      return c.json(ok(edit), HTTP_STATUS.OK)
    }
  )

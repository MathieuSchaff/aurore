import { HTTP_STATUS, ok, reactionInputSchema, reactionQuerySchema } from '@aurore/shared'

import { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { getAuthedUserId, getRlsDb } from '../../utils/accessors'
import { zValidator } from '../../utils/validator'
import { optionalJwtAuth, requireJwtAuth, requireNotBanned } from '../auth/middleware'
import { withRlsContext } from '../auth/rls-context.middleware'
import { listReactions, react, unreact } from './reactions.service'

const app = new Hono<AppEnv>()

// Guards stay on the endpoints owned by this router so sibling routes are not intercepted.
// GET is an anonymous-OK signed read; mutations use the global-ban floor only, no dedicated
// ban_scope (ADR-0013)

export const socialReactionsRoutes = app
  .get(
    '/',
    optionalJwtAuth,
    withRlsContext,
    zValidator('query', reactionQuerySchema),
    async (c) => {
      const db = c.get('userId') ? getRlsDb(c) : c.get('anonDb')
      const { reactableType, reactableId } = c.req.valid('query')
      const viewerUserId = c.get('userId') ?? null
      const view = await listReactions(db, reactableType, reactableId, viewerUserId)
      return c.json(ok(view), HTTP_STATUS.OK)
    }
  )
  .post(
    '/',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    zValidator('json', reactionInputSchema),
    async (c) => {
      const db = getRlsDb(c)
      const userId = getAuthedUserId(c)
      const view = await react(userId, c.req.valid('json'), db)
      return c.json(ok(view), HTTP_STATUS.OK)
    }
  )
  .delete(
    '/',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    zValidator('json', reactionInputSchema),
    async (c) => {
      const db = getRlsDb(c)
      const userId = getAuthedUserId(c)
      const view = await unreact(userId, c.req.valid('json'), db)
      return c.json(ok(view), HTTP_STATUS.OK)
    }
  )

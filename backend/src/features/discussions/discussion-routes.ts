import { createReplySchema, createThreadSchema, HTTP_STATUS, ok } from '@aurore/shared'

import { Hono } from 'hono'
import { z } from 'zod'

import type { AppEnv } from '../../app-env'
import { getAuthedUserId, getRlsDb } from '../../utils/accessors'
import { zValidator } from '../../utils/validator'
import { requireJwtAuth, requireNotBanned, requireNotBannedScope } from '../auth/middleware'
import { withRlsContext } from '../auth/rls-context.middleware'
import {
  createReply,
  createThread,
  deleteReply,
  deleteThread,
  type EntityType,
  getThreadWithReplies,
  listThreads,
} from './service'

const slugParam = z.object({ slug: z.string().min(1).max(100) })
const threadParam = z.object({ slug: z.string().min(1).max(100), threadId: z.uuid() })
const replyParam = z.object({
  slug: z.string().min(1).max(100),
  threadId: z.uuid(),
  replyId: z.uuid(),
})

export function createDiscussionRoutes(entityType: EntityType) {
  const app = new Hono<AppEnv>()

  // Guards stay on the endpoints owned by this router so sibling routes are not intercepted

  return app
    .get('/:slug/discussions', zValidator('param', slugParam), async (c) => {
      const db = c.get('anonDb')
      const { slug } = c.req.valid('param')
      const threads = await listThreads(slug, entityType, db)
      return c.json(ok(threads), HTTP_STATUS.OK)
    })

    .post(
      '/:slug/discussions',
      requireJwtAuth,
      withRlsContext,
      requireNotBanned,
      requireNotBannedScope('discussion_post'),
      zValidator('param', slugParam),
      zValidator('json', createThreadSchema),
      async (c) => {
        const db = getRlsDb(c)
        const userId = getAuthedUserId(c)
        const { slug } = c.req.valid('param')
        const input = c.req.valid('json')
        const thread = await createThread(userId, slug, entityType, input, db)
        return c.json(ok(thread), HTTP_STATUS.CREATED)
      }
    )

    .get('/:slug/discussions/:threadId', zValidator('param', threadParam), async (c) => {
      const db = c.get('anonDb')
      const { threadId } = c.req.valid('param')
      const thread = await getThreadWithReplies(threadId, db)
      return c.json(ok(thread), HTTP_STATUS.OK)
    })

    .delete(
      '/:slug/discussions/:threadId',
      requireJwtAuth,
      withRlsContext,
      requireNotBanned,
      zValidator('param', threadParam),
      async (c) => {
        const db = getRlsDb(c)
        const userId = getAuthedUserId(c)
        const { threadId } = c.req.valid('param')
        await deleteThread(userId, threadId, db)
        return c.body(null, 204)
      }
    )

    .post(
      '/:slug/discussions/:threadId/replies',
      requireJwtAuth,
      withRlsContext,
      requireNotBanned,
      requireNotBannedScope('discussion_post'),
      zValidator('param', threadParam),
      zValidator('json', createReplySchema),
      async (c) => {
        const db = getRlsDb(c)
        const userId = getAuthedUserId(c)
        const { threadId } = c.req.valid('param')
        const input = c.req.valid('json')
        const reply = await createReply(userId, threadId, input, db)
        return c.json(ok(reply), HTTP_STATUS.CREATED)
      }
    )

    .delete(
      '/:slug/discussions/:threadId/replies/:replyId',
      requireJwtAuth,
      withRlsContext,
      requireNotBanned,
      zValidator('param', replyParam),
      async (c) => {
        const db = getRlsDb(c)
        const userId = getAuthedUserId(c)
        const { replyId } = c.req.valid('param')
        await deleteReply(userId, replyId, db)
        return c.body(null, 204)
      }
    )
}

import {
  articleSearchSchema,
  createArticleSchema,
  err,
  HTTP_STATUS,
  ok,
  updateArticleSchema,
} from '@aurore/shared'

import { type Context, Hono } from 'hono'
import { z } from 'zod'

import type { AppEnv } from '../../app-env'
import { getAuthedUserId, getRlsDb } from '../../utils/accessors'
import { zValidator } from '../../utils/validator'
import { optionalJwtAuth, requireJwtAuth, requireNotBanned } from '../auth/middleware'
import { withRlsContext } from '../auth/rls-context.middleware'
import {
  createArticle,
  deleteArticle,
  getArticleBySlug,
  getCategoryCounts,
  listArticles,
  updateArticle,
} from './service'

const slugParam = z.object({ slug: z.string().min(1).max(150) })

const articlesApp = new Hono<AppEnv>()

// Public reads use anonDb only for anonymous callers. Authenticated reads and
// writes use the request RLS transaction.
function getArticleReadDb(c: Context<AppEnv>) {
  return c.get('userId') ? getRlsDb(c) : c.get('anonDb')
}

export const articleRoutes = articlesApp
  .get(
    '/',
    optionalJwtAuth,
    withRlsContext,
    zValidator('query', articleSearchSchema),
    async (c) => {
      const db = getArticleReadDb(c)
      const query = c.req.valid('query')
      const isAdmin = c.get('userRole') === 'admin'
      const { items, total } = await listArticles(db, query, isAdmin)
      return c.json(ok({ items, total }), HTTP_STATUS.OK)
    }
  )

  .get('/categories', optionalJwtAuth, withRlsContext, async (c) => {
    const db = getArticleReadDb(c)
    const counts = await getCategoryCounts(db)
    return c.json(ok(counts), HTTP_STATUS.OK)
  })

  .get('/:slug', optionalJwtAuth, withRlsContext, zValidator('param', slugParam), async (c) => {
    const db = getArticleReadDb(c)
    const { slug } = c.req.valid('param')
    const article = await getArticleBySlug(db, slug, {
      includeDrafts: c.get('userRole') === 'admin',
    })
    return c.json(ok(article), HTTP_STATUS.OK)
  })

  .post(
    '/',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    zValidator('json', createArticleSchema),
    async (c) => {
      const db = getRlsDb(c)
      if (c.get('userRole') !== 'admin')
        return c.json(err('unauthorized_access'), HTTP_STATUS.FORBIDDEN)
      const userId = getAuthedUserId(c)
      const input = c.req.valid('json')
      const article = await createArticle(db, userId, input)
      return c.json(ok(article), HTTP_STATUS.CREATED)
    }
  )

  .patch(
    '/:slug',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    zValidator('param', slugParam),
    zValidator('json', updateArticleSchema),
    async (c) => {
      const db = getRlsDb(c)
      if (c.get('userRole') !== 'admin')
        return c.json(err('unauthorized_access'), HTTP_STATUS.FORBIDDEN)
      const { slug } = c.req.valid('param')
      const input = c.req.valid('json')
      const article = await updateArticle(db, slug, input)
      return c.json(ok(article), HTTP_STATUS.OK)
    }
  )

  .delete(
    '/:slug',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    zValidator('param', slugParam),
    async (c) => {
      const db = getRlsDb(c)
      if (c.get('userRole') !== 'admin')
        return c.json(err('unauthorized_access'), HTTP_STATUS.FORBIDDEN)
      const { slug } = c.req.valid('param')
      await deleteArticle(db, slug)
      return c.body(null, 204)
    }
  )

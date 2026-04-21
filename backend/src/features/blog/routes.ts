import {
  articleSearchSchema,
  HTTP_STATUS,
  ok,
} from '@habit-tracker/shared'

import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import type { AppEnv } from '../../app-env'
import { requireJwtAuth } from '../auth/middleware'
import { getArticleBySlug, listArticles } from './service'

const slugParam = z.object({ slug: z.string().min(1).max(150) })

const articlesApp = new Hono<AppEnv>()

articlesApp.use('*', async (c, next) => {
  if (c.req.method === 'GET') return next()
  return requireJwtAuth(c, next)
})

export const articleRoutes = articlesApp
  .get('/', zValidator('query', articleSearchSchema), async (c) => {
    const db = c.get('db')
    const query = c.req.valid('query')
    const isAdmin = c.get('userRole') === 'admin'
    const { items, total } = await listArticles(db, query, isAdmin)
    return c.json(ok({ items, total }), HTTP_STATUS.OK)
  })

  .get('/:slug', zValidator('param', slugParam), async (c) => {
    const db = c.get('db')
    const { slug } = c.req.valid('param')
    const article = await getArticleBySlug(db, slug)
    return c.json(ok(article), HTTP_STATUS.OK)
  })

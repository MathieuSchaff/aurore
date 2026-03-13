import {
  createTagSchema,
  err,
  errorToStatus,
  HTTP_STATUS,
  ok,
  tagErrorMapping,
} from '@habit-tracker/shared'

import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import type { AppEnv } from '../../../app-env'
import { requireJwtAuth } from '../../auth/middleware'
import {
  createTag,
  deleteTag,
  getTagById,
  getTagBySlug,
  listIngredientsByTag,
  listProductsByTag,
  updateTag,
} from './tags.service'
import { TagError } from './tags-error'

const idParam = z.object({ id: z.uuid() })
const slugParam = z.object({ slug: z.string().min(1).max(100) })

const tagsApp = new Hono<AppEnv>()

tagsApp.use('*', async (c, next) => {
  if (c.req.method === 'GET') return next()
  return requireJwtAuth(c, next)
})

tagsApp.onError((error, c) => {
  if (error instanceof TagError) {
    return c.json(err(error.code, error.details), errorToStatus(error.code, tagErrorMapping))
  }
  console.error('Unexpected error:', error)
  return c.json(err('server_error'), HTTP_STATUS.INTERNAL_SERVER_ERROR)
})

export const tagRoutes = tagsApp

  .post('/', zValidator('json', createTagSchema), async (c) => {
    const db = c.get('db')
    const input = c.req.valid('json')
    const tag = await createTag(db, input)
    return c.json(ok(tag), HTTP_STATUS.CREATED)
  })

  .get('/:id', zValidator('param', idParam), async (c) => {
    const db = c.get('db')
    const { id } = c.req.valid('param')
    const tag = await getTagById(db, id)
    if (!tag) throw new TagError('tag_not_found')
    return c.json(ok(tag), HTTP_STATUS.OK)
  })

  .patch('/:id', zValidator('param', idParam), zValidator('json', createTagSchema), async (c) => {
    const db = c.get('db')
    const { id } = c.req.valid('param')
    const input = c.req.valid('json')
    const tag = await updateTag(db, id, input)
    return c.json(ok(tag), HTTP_STATUS.OK)
  })

  .delete('/:id', zValidator('param', idParam), async (c) => {
    const db = c.get('db')
    const { id } = c.req.valid('param')
    const deleted = await deleteTag(db, id)
    if (!deleted) throw new TagError('tag_not_found')
    return c.body(null, 204)
  })

  .get('/:slug/products', zValidator('param', slugParam), async (c) => {
    const db = c.get('db')
    const { slug } = c.req.valid('param')
    const tag = await getTagBySlug(db, slug)
    if (!tag) throw new TagError('tag_not_found')
    const items = await listProductsByTag(db, tag.id)
    return c.json(ok(items), HTTP_STATUS.OK)
  })

  .get('/:slug/ingredients', zValidator('param', slugParam), async (c) => {
    const db = c.get('db')
    const { slug } = c.req.valid('param')
    const tag = await getTagBySlug(db, slug)
    if (!tag) throw new TagError('tag_not_found')
    const items = await listIngredientsByTag(db, tag.id)
    return c.json(ok(items), HTTP_STATUS.OK)
  })

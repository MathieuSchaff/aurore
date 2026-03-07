import {
  err,
  errorToStatus,
  HTTP_STATUS,
  ok,
  tagErrorMapping,
} from '@habit-tracker/shared'

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import type { AppEnv } from '../../../app-env'
import { isUniqueViolation } from '../../../lib/helpers'
import { requireJwtAuth } from '../../auth/middleware'
import {
  addTagToIngredient,
  listTagsByIngredient,
  removeTagFromIngredient,
  replaceIngredientTags,
} from '../tags/tags.service'
import { TagError } from '../tags/tags-error'

const ingredientParams = z.object({ ingredientId: z.uuid() })
const ingredientTagParams = z.object({ ingredientId: z.uuid(), tagId: z.uuid() })

const addIngredientTagSchema = z.object({ tagId: z.uuid() })

const replaceIngredientTagsSchema = z.object({ tagIds: z.array(z.uuid()) })

// ─── App ──────────────────────────────────────────────────

const ingredientTagsApp = new Hono<AppEnv>()

ingredientTagsApp.use('*', async (c, next) => {
  if (c.req.method === 'GET') return next()
  return requireJwtAuth(c, next)
})

ingredientTagsApp.onError((error, c) => {
  if (error instanceof TagError) {
    return c.json(err(error.code, error.details), errorToStatus(error.code, tagErrorMapping))
  }
  console.error('Unexpected error:', error)
  return c.json(err('server_error'), HTTP_STATUS.INTERNAL_SERVER_ERROR)
})

// ─── Handlers ─────────────────────────────────────────────

export const ingredientTagRoutes = ingredientTagsApp

  .get('/:ingredientId/tags', zValidator('param', ingredientParams), async (c) => {
    const db = c.get('db')
    const { ingredientId } = c.req.valid('param')
    const items = await listTagsByIngredient(db, ingredientId)
    return c.json(ok(items), HTTP_STATUS.OK)
  })

  .post('/:ingredientId/tags', zValidator('param', ingredientParams), zValidator('json', addIngredientTagSchema), async (c) => {
    const db = c.get('db')
    const { ingredientId } = c.req.valid('param')
    const { tagId } = c.req.valid('json')

    try {
      const link = await addTagToIngredient(db, ingredientId, tagId)
      if (!link) throw new TagError('database_error')
      return c.json(ok(link), HTTP_STATUS.CREATED)
    } catch (e) {
      if (e instanceof TagError) throw e
      if (isUniqueViolation(e)) throw new TagError('tag_already_exists')
      throw e
    }
  })

  .delete('/:ingredientId/tags/:tagId', zValidator('param', ingredientTagParams), async (c) => {
    const db = c.get('db')
    const { ingredientId, tagId } = c.req.valid('param')
    const removed = await removeTagFromIngredient(db, ingredientId, tagId)
    if (!removed) throw new TagError('tag_not_found')
    return c.json(ok(null), HTTP_STATUS.OK)
  })

  .put('/:ingredientId/tags', zValidator('param', ingredientParams), zValidator('json', replaceIngredientTagsSchema), async (c) => {
    const db = c.get('db')
    const { ingredientId } = c.req.valid('param')
    const { tagIds } = c.req.valid('json')
    const links = await replaceIngredientTags(db, ingredientId, tagIds)
    return c.json(ok(links), HTTP_STATUS.OK)
  })

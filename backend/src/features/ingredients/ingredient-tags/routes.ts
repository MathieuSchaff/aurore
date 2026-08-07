import {
  addIngredientTagSchema,
  HTTP_STATUS,
  ok,
  replaceIngredientTagsSchema,
} from '@aurore/shared'

import { Hono } from 'hono'
import { z } from 'zod'

import type { AppEnv } from '../../../app-env'
import { isUniqueViolation } from '../../../lib/helpers'
import { getRlsDb } from '../../../utils/accessors'
import { zValidator } from '../../../utils/validator'
import { requireAdmin, requireJwtAuth, requireNotBanned } from '../../auth/middleware'
import { withRlsContext } from '../../auth/rls-context.middleware'
import {
  addTagToIngredient,
  listTagsByIngredient,
  removeTagFromIngredient,
  replaceIngredientTags,
} from '../../ingredient-tags/service'
import { TagError } from '../../product-tags/tag-error'

const ingredientParams = z.object({ ingredientId: z.uuid() })
const ingredientTagParams = z.object({ ingredientId: z.uuid(), tagId: z.uuid() })

const ingredientTagsApp = new Hono<AppEnv>()

// Guards stay on the endpoints owned by this router so sibling routes are not intercepted

export const ingredientTagRoutes = ingredientTagsApp

  .get('/:ingredientId/tags', zValidator('param', ingredientParams), async (c) => {
    const db = c.get('anonDb')
    const { ingredientId } = c.req.valid('param')
    const items = await listTagsByIngredient(db, ingredientId)
    return c.json(ok(items), HTTP_STATUS.OK)
  })

  .post(
    '/:ingredientId/tags',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    requireAdmin,
    zValidator('param', ingredientParams),
    zValidator('json', addIngredientTagSchema),
    async (c) => {
      const db = getRlsDb(c)
      const { ingredientId } = c.req.valid('param')
      const { tagId, relevance } = c.req.valid('json')

      try {
        const link = await addTagToIngredient(db, ingredientId, tagId, relevance)
        if (!link) throw new TagError('database_error')
        return c.json(ok(link), HTTP_STATUS.CREATED)
      } catch (e) {
        if (e instanceof TagError) throw e
        if (isUniqueViolation(e)) throw new TagError('tag_already_exists')
        throw e
      }
    }
  )

  .delete(
    '/:ingredientId/tags/:tagId',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    requireAdmin,
    zValidator('param', ingredientTagParams),
    async (c) => {
      const db = getRlsDb(c)
      const { ingredientId, tagId } = c.req.valid('param')
      const removed = await removeTagFromIngredient(db, ingredientId, tagId)
      if (!removed) throw new TagError('tag_not_found')
      return c.body(null, 204)
    }
  )

  .put(
    '/:ingredientId/tags',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    requireAdmin,
    zValidator('param', ingredientParams),
    zValidator('json', replaceIngredientTagsSchema),
    async (c) => {
      const db = getRlsDb(c)
      const { ingredientId } = c.req.valid('param')
      const { tags } = c.req.valid('json')
      const links = await replaceIngredientTags(db, ingredientId, tags)
      return c.json(ok(links), HTTP_STATUS.OK)
    }
  )

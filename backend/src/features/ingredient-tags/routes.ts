import {
  createTagSchema,
  HTTP_STATUS,
  listTagsQuerySchema,
  ok,
  tagIdParamSchema,
  tagSlugParamSchema,
  updateTagSchema,
} from '@aurore/shared'

import { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { getRlsDb } from '../../utils/accessors'
import { zValidator } from '../../utils/validator'
import { requireAdmin, requireJwtAuth, requireNotBanned } from '../auth/middleware'
import { withRlsContext } from '../auth/rls-context.middleware'
import {
  createIngredientTag,
  deleteIngredientTag,
  getIngredientTagById,
  getIngredientTagBySlug,
  listIngredientsByTag,
  listIngredientTags,
  updateIngredientTag,
} from './service'

const ingredientTagsApp = new Hono<AppEnv>()

// Guards stay on the endpoints owned by this router so sibling routes are not intercepted

export const ingredientTagDefRoutes = ingredientTagsApp

  .get('/', zValidator('query', listTagsQuerySchema), async (c) => {
    const db = c.get('anonDb')
    const query = c.req.valid('query')
    const tags = await listIngredientTags(db, query)
    return c.json(ok(tags), HTTP_STATUS.OK)
  })

  .post(
    '/',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    requireAdmin,
    zValidator('json', createTagSchema),
    async (c) => {
      const db = getRlsDb(c)
      const input = c.req.valid('json')
      const tag = await createIngredientTag(db, input)
      return c.json(ok(tag), HTTP_STATUS.CREATED)
    }
  )

  .get('/:id', zValidator('param', tagIdParamSchema), async (c) => {
    const db = c.get('anonDb')
    const { id } = c.req.valid('param')
    const tag = await getIngredientTagById(db, id)
    return c.json(ok(tag), HTTP_STATUS.OK)
  })

  .patch(
    '/:id',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    requireAdmin,
    zValidator('param', tagIdParamSchema),
    zValidator('json', updateTagSchema),
    async (c) => {
      const db = getRlsDb(c)
      const { id } = c.req.valid('param')
      const input = c.req.valid('json')
      const tag = await updateIngredientTag(db, id, input)
      return c.json(ok(tag), HTTP_STATUS.OK)
    }
  )

  .delete(
    '/:id',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    requireAdmin,
    zValidator('param', tagIdParamSchema),
    async (c) => {
      const db = getRlsDb(c)
      const { id } = c.req.valid('param')
      await deleteIngredientTag(db, id)
      return c.json(ok(null), HTTP_STATUS.OK)
    }
  )

  .get('/:slug/ingredients', zValidator('param', tagSlugParamSchema), async (c) => {
    const db = c.get('anonDb')
    const { slug } = c.req.valid('param')
    const tag = await getIngredientTagBySlug(db, slug)
    const items = await listIngredientsByTag(db, tag.id)
    return c.json(ok(items), HTTP_STATUS.OK)
  })

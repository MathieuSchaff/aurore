import {
  createIngredientSchema,
  HTTP_STATUS,
  INGREDIENT_TYPE_VALUES,
  listIngredientsSearchSchema,
  ok,
  updateIngredientRouteSchema,
  verifyQualityBodySchema,
} from '@aurore/shared'

import type { Context } from 'hono'
import { Hono } from 'hono'
import { z } from 'zod'

import type { AppEnv } from '../../app-env'
import { stripAdminFields } from '../../lib/catalog'
import { getAuthedUserId, getAuthedUserRole, getRlsDb } from '../../utils/accessors'
import { zValidator } from '../../utils/validator'
import {
  optionalJwtAuth,
  requireAdmin,
  requireCatalogWrite,
  requireJwtAuth,
  requireNotBanned,
  requireNotBannedScope,
} from '../auth/middleware'
import { withRlsContext } from '../auth/rls-context.middleware'
import { listProductsByIngredient } from '../products/product-ingredients/product-ingredients.service'
import {
  createIngredient,
  deleteIngredient,
  getIngredientBySlug,
  getIngredientFilterOptions,
  listAllIngredientOptions,
  listIngredientEdits,
  listIngredients,
  listIngredientsBySlugs,
  searchIngredientIdentities,
  searchIngredients,
  updateIngredient,
  verifyIngredient,
} from './service'

const slugParam = z.object({
  slug: z.string().min(1).max(100),
})

const idParam = z.object({
  id: z.uuid(),
})

const searchQuery = z.object({
  q: z.string().min(1).max(100),
  type: z.enum(INGREDIENT_TYPE_VALUES).optional(),
})

// Comma-separated slugs, capped at 2000 chars so a bad client can't force a
// table seq-scan. Handler also caps at 50 entries before hitting the DB.
const bySlugsQuery = z.object({
  slugs: z.string().min(1).max(2000),
})

const MAX_SLUG_LOOKUP = 50

const ingredientsApp = new Hono<AppEnv>()

// A hidden ingredient is invisible to anonymous callers but visible to admins and
// contributors through ingredients_select_visible, which reads auth.role(). That GUC
// exists only inside the request transaction, so the detail routes bind identity when
// it is present; without this a moderator gets a 404 on the row they must review.
function getIngredientReadDb(c: Context<AppEnv>) {
  return c.get('userId') ? getRlsDb(c) : c.get('anonDb')
}

// This router shares /ingredients with tags and discussions. Guards stay on
// owned endpoints so sibling routes are not intercepted.

export const ingredientRoutes = ingredientsApp

  .get('/search', zValidator('query', searchQuery), async (c) => {
    const db = c.get('anonDb')
    const { q, type } = c.req.valid('query')

    const results = await searchIngredients(db, q, { type })

    return c.json(ok(results), HTTP_STATUS.OK)
  })
  .get('/search-identities', zValidator('query', searchQuery), async (c) => {
    const db = c.get('anonDb')
    const { q, type } = c.req.valid('query')

    const results = await searchIngredientIdentities(db, q, { type })

    return c.json(ok(results), HTTP_STATUS.OK)
  })
  .get('/by-slugs', zValidator('query', bySlugsQuery), async (c) => {
    const db = c.get('anonDb')
    const { slugs } = c.req.valid('query')
    const list = slugs.split(',').filter(Boolean).slice(0, MAX_SLUG_LOOKUP)
    const results = await listIngredientsBySlugs(db, list)
    return c.json(ok(results), HTTP_STATUS.OK)
  })
  .get(
    '/filter-options',
    zValidator('query', z.object({ type: z.enum(INGREDIENT_TYPE_VALUES).optional() })),
    async (c) => {
      const db = c.get('anonDb')
      const { type } = c.req.valid('query')
      const options = await getIngredientFilterOptions(db, type)
      return c.json(ok(options), HTTP_STATUS.OK)
    }
  )
  .get(
    '/options',
    zValidator('query', z.object({ type: z.enum(INGREDIENT_TYPE_VALUES).optional() })),
    async (c) => {
      const db = c.get('anonDb')
      const { type } = c.req.valid('query')
      const items = await listAllIngredientOptions(db, type)
      return c.json(ok(items), HTTP_STATUS.OK)
    }
  )
  .get('/', zValidator('query', listIngredientsSearchSchema), async (c) => {
    const db = c.get('anonDb')
    const query = c.req.valid('query')
    const { items, total } = await listIngredients(db, query)
    return c.json(ok({ items, total }), HTTP_STATUS.OK)
  })

  .post(
    '/',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    requireNotBannedScope('ingredient_create'),
    zValidator('json', createIngredientSchema),
    async (c) => {
      const db = getRlsDb(c)
      const userId = getAuthedUserId(c)
      const role = getAuthedUserRole(c)
      const input = c.req.valid('json')

      const ingredient = await createIngredient(db, userId, role, input)

      return c.json(ok(stripAdminFields(ingredient)), HTTP_STATUS.CREATED)
    }
  )

  .get('/:slug', optionalJwtAuth, withRlsContext, zValidator('param', slugParam), async (c) => {
    const db = getIngredientReadDb(c)
    const { slug } = c.req.valid('param')

    const ingredient = await getIngredientBySlug(db, slug)

    return c.json(ok(stripAdminFields(ingredient)), HTTP_STATUS.OK)
  })

  .patch(
    '/:id',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    requireNotBannedScope('ingredient_edit'),
    zValidator('param', idParam),
    zValidator('json', updateIngredientRouteSchema),
    async (c) => {
      const db = getRlsDb(c)
      const { id } = c.req.valid('param')
      const userId = getAuthedUserId(c)
      const { expectedUpdatedAt, summary, ...data } = c.req.valid('json')
      const ingredient = await updateIngredient(db, userId, id, data, summary, expectedUpdatedAt)
      return c.json(ok(stripAdminFields(ingredient)), HTTP_STATUS.OK)
    }
  )
  .patch(
    '/:id/quality',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    requireCatalogWrite,
    zValidator('param', idParam),
    zValidator('json', verifyQualityBodySchema),
    async (c) => {
      const db = getRlsDb(c)
      const { id } = c.req.valid('param')
      const actorId = getAuthedUserId(c)
      const ingredient = await verifyIngredient(db, actorId, id)
      return c.json(ok(stripAdminFields(ingredient)), HTTP_STATUS.OK)
    }
  )
  .delete(
    '/:id',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    requireNotBannedScope('ingredient_edit'),
    requireAdmin,
    zValidator('param', idParam),
    async (c) => {
      const db = getRlsDb(c)
      const role = getAuthedUserRole(c)
      const { id } = c.req.valid('param')
      await deleteIngredient(db, role, id)
      return c.body(null, 204)
    }
  )

  .get(
    '/:slug/edits',
    optionalJwtAuth,
    withRlsContext,
    zValidator('param', slugParam),
    async (c) => {
      const db = getIngredientReadDb(c)
      const { slug } = c.req.valid('param')

      const ingredient = await getIngredientBySlug(db, slug)
      const edits = await listIngredientEdits(db, ingredient.id)

      return c.json(ok(edits), HTTP_STATUS.OK)
    }
  )

  .get('/:slug/products', zValidator('param', slugParam), async (c) => {
    const db = c.get('anonDb')
    const { slug } = c.req.valid('param')

    const ingredient = await getIngredientBySlug(db, slug)

    const items = await listProductsByIngredient(db, ingredient.id)

    return c.json(ok(items), HTTP_STATUS.OK)
  })

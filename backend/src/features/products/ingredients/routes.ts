import {
  createIngredientSchema,
  err,
  errorToStatus,
  HTTP_STATUS,
  ingredientErrorMapping,
  ingredientsSearchSchema,
  ok,
  updateIngredientSchema,
} from '@habit-tracker/shared'

import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import type { AppEnv } from '../../../app-env'
import { requireJwtAuth } from '../../auth/middleware'
import { listProductsByIngredient } from '../product-ingredients/product-ingredients.service'
import { IngredientError } from './ingredients-error'
import {
  createIngredient,
  deleteIngredient,
  getIngredientBySlug,
  listAllIngredientOptions,
  listIngredientEdits,
  listIngredients,
  searchIngredients,
  updateIngredient,
} from './service'

const slugParam = z.object({
  slug: z.string().min(1).max(100),
})

const idParam = z.object({
  id: z.uuid(),
})

const searchQuery = z.object({
  q: z.string().min(1).max(100),
})

const ingredientsApp = new Hono<AppEnv>()

ingredientsApp.use('*', async (c, next) => {
  if (c.req.method === 'GET') return next()
  return requireJwtAuth(c, next)
})

ingredientsApp.onError((error, c) => {
  if (error instanceof IngredientError) {
    return c.json(err(error.code, error.details), errorToStatus(error.code, ingredientErrorMapping))
  }

  console.error('Unexpected error:', error)

  return c.json(err('server_error'), HTTP_STATUS.INTERNAL_SERVER_ERROR)
})

export const ingredientRoutes = ingredientsApp

  .get('/search', zValidator('query', searchQuery), async (c) => {
    const db = c.get('db')
    const { q } = c.req.valid('query')

    const results = await searchIngredients(q, db)

    return c.json(ok(results), HTTP_STATUS.OK)
  })
  .get('/options', async (c) => {
    const db = c.get('db')
    const items = await listAllIngredientOptions(db)
    return c.json(ok(items), HTTP_STATUS.OK)
  })
  .get('/', zValidator('query', ingredientsSearchSchema), async (c) => {
    const db = c.get('db')
    const query = c.req.valid('query')
    const { items, total } = await listIngredients(query, db)
    return c.json(ok({ items, total }), HTTP_STATUS.OK)
  })

  .post('/', zValidator('json', createIngredientSchema), async (c) => {
    const db = c.get('db')
    const userId = c.get('userId')
    const input = c.req.valid('json')

    const ingredient = await createIngredient(userId, input, db)

    return c.json(ok(ingredient), HTTP_STATUS.CREATED)
  })

  .get('/:slug', zValidator('param', slugParam), async (c) => {
    const db = c.get('db')
    const { slug } = c.req.valid('param')

    const ingredient = await getIngredientBySlug(slug, db)

    return c.json(ok(ingredient), HTTP_STATUS.OK)
  })

  .patch(
    '/:id',
    zValidator('param', idParam),
    zValidator('json', updateIngredientSchema),
    async (c) => {
      const db = c.get('db')
      const { id } = c.req.valid('param')
      const userId = c.get('userId')
      const input = c.req.valid('json')

      const ingredient = await updateIngredient(userId, id, input, undefined, db)

      return c.json(ok(ingredient), HTTP_STATUS.OK)
    }
  )

  .delete('/:id', zValidator('param', idParam), async (c) => {
    const db = c.get('db')
    const { id } = c.req.valid('param')
    await deleteIngredient(id, db)
    return c.body(null, 204)
  })

  .get('/:slug/edits', zValidator('param', slugParam), async (c) => {
    const db = c.get('db')
    const { slug } = c.req.valid('param')

    const ingredient = await getIngredientBySlug(slug, db)
    const edits = await listIngredientEdits(ingredient.id, db)

    return c.json(ok(edits), HTTP_STATUS.OK)
  })

  .get('/:slug/products', zValidator('param', slugParam), async (c) => {
    const db = c.get('db')
    const { slug } = c.req.valid('param')

    const ingredient = await getIngredientBySlug(slug, db)

    const items = await listProductsByIngredient(db, ingredient.id)

    return c.json(ok(items), HTTP_STATUS.OK)
  })

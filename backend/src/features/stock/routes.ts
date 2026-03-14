import {
  addStockEntrySchema,
  err,
  errorToStatus,
  HTTP_STATUS,
  ok,
  stockErrorMapping,
  updateStockSchema,
} from '@habit-tracker/shared'

import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import type { AppEnv } from '../../app-env'
import { requireJwtAuth } from '../auth/middleware'
import {
  addStockEntry,
  deleteStock,
  getStockByProduct,
  getStockEntries,
  getUserStock,
  upsertStock,
} from './service'
import { StockError } from './stock-error'

const productIdParam = z.object({ productId: z.uuid() })

const stockApp = new Hono<AppEnv>()

stockApp.use('*', requireJwtAuth)

stockApp.onError((error, c) => {
  if (error instanceof StockError) {
    return c.json(err(error.code, error.details), errorToStatus(error.code, stockErrorMapping))
  }
  console.error('Unexpected error:', error)
  return c.json(err('server_error'), HTTP_STATUS.INTERNAL_SERVER_ERROR)
})

export const stockRoutes = stockApp
  .get('/entries', async (c) => {
    const db = c.get('db')
    const userId = c.get('userId')
    const result = await getStockEntries(userId, db)
    return c.json(ok(result), HTTP_STATUS.OK)
  })

  .get('/', async (c) => {
    const db = c.get('db')
    const userId = c.get('userId')
    const result = await getUserStock(userId, db)
    return c.json(ok(result), HTTP_STATUS.OK)
  })

  .get('/:productId', zValidator('param', productIdParam), async (c) => {
    const db = c.get('db')
    const userId = c.get('userId')
    const { productId } = c.req.valid('param')
    const result = await getStockByProduct(userId, productId, db)
    return c.json(ok(result), HTTP_STATUS.OK)
  })

  .put(
    '/:productId',
    zValidator('param', productIdParam),
    zValidator('json', updateStockSchema),
    async (c) => {
      const db = c.get('db')
      const userId = c.get('userId')
      const { productId } = c.req.valid('param')
      const input = c.req.valid('json')
      const stock = await upsertStock(userId, productId, input, db)
      return c.json(ok(stock), HTTP_STATUS.OK)
    }
  )

  .post(
    '/:productId/entries',
    zValidator('param', productIdParam),
    zValidator('json', addStockEntrySchema),
    async (c) => {
      const db = c.get('db')
      const userId = c.get('userId')
      const { productId } = c.req.valid('param')
      const input = c.req.valid('json')
      const result = await addStockEntry(userId, productId, input, db)
      return c.json(ok(result), HTTP_STATUS.CREATED)
    }
  )

  .delete('/:productId', zValidator('param', productIdParam), async (c) => {
    const db = c.get('db')
    const userId = c.get('userId')
    const { productId } = c.req.valid('param')
    await deleteStock(userId, productId, db)
    return c.json(ok(null), HTTP_STATUS.OK)
  })

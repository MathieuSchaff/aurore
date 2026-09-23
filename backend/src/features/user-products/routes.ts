import {
  addPurchaseSchema,
  bannedError,
  createUserProductSchema,
  finishPurchaseSchema,
  HTTP_STATUS,
  ok,
  openPurchaseSchema,
  updatePurchaseSchema,
  updateUserProductReviewSchema,
  updateUserProductSchema,
} from '@aurore/shared'

import { Hono } from 'hono'
import { z } from 'zod'

import type { AppEnv } from '../../app-env'
import { getAuthedUserId, getRlsDb } from '../../utils/accessors'
import { zValidator } from '../../utils/validator'
import { isUserBannedForScope } from '../auth/ban.service'
import { requireJwtAuth, requireNotBanned } from '../auth/middleware'
import { withRlsContext } from '../auth/rls-context.middleware'
import {
  addPurchase,
  deletePurchase,
  finishPurchase,
  getPurchases,
  openPurchase,
  updatePurchase,
} from './purchase.service'
import {
  createUserProduct,
  deleteUserProduct,
  getReviewIsPublic,
  getUserProductStatusHistory,
  getUserProducts,
  updateUserProduct,
  upsertUserProductReview,
} from './service'

const idParam = z.object({ id: z.uuid() })
const purchaseParams = z.object({ id: z.uuid(), purchaseId: z.uuid() })

const app = new Hono<AppEnv>()

app.use('*', requireJwtAuth)
app.use('*', withRlsContext)
app.use('*', requireNotBanned)

export const userProductRoutes = app
  .get('/', async (c) => {
    const db = getRlsDb(c)
    const userId = getAuthedUserId(c)
    const result = await getUserProducts(userId, db)
    return c.json(ok(result), HTTP_STATUS.OK)
  })

  .post('/', zValidator('json', createUserProductSchema), async (c) => {
    const db = getRlsDb(c)
    const userId = getAuthedUserId(c)
    const input = c.req.valid('json')

    const result = await createUserProduct(userId, input, db)

    return c.json(ok(result), HTTP_STATUS.CREATED)
  })

  .patch(
    '/:id',
    zValidator('param', idParam),
    zValidator('json', updateUserProductSchema),
    async (c) => {
      const db = getRlsDb(c)
      const userId = getAuthedUserId(c)
      const { id } = c.req.valid('param')
      const input = c.req.valid('json')
      const result = await updateUserProduct(userId, id, input, db)

      return c.json(ok(result), HTTP_STATUS.OK)
    }
  )

  .delete('/:id', zValidator('param', idParam), async (c) => {
    const db = getRlsDb(c)
    const userId = getAuthedUserId(c)
    const { id } = c.req.valid('param')
    await deleteUserProduct(userId, id, db)
    return c.json(ok(null), HTTP_STATUS.OK)
  })

  .put(
    '/:id/review',
    zValidator('param', idParam),
    zValidator('json', updateUserProductReviewSchema),
    async (c) => {
      const db = getRlsDb(c)
      const userId = getAuthedUserId(c)
      const { id } = c.req.valid('param')
      const input = c.req.valid('json')

      // review_publish ban must be checked against the resolved final isPublic,
      // not the raw input: upsert preserves existing isPublic when input omits it.
      let resultingPublic = input.isPublic
      if (resultingPublic === undefined) {
        resultingPublic = (await getReviewIsPublic(id, db)) ?? false
      }

      if (resultingPublic) {
        const ban = await isUserBannedForScope(db, userId, 'review_publish')
        if (ban) {
          return c.json(
            bannedError({
              expiresAt: ban.expiresAt,
              reason: ban.reason,
              scope: 'review_publish',
            }),
            HTTP_STATUS.FORBIDDEN
          )
        }
      }

      const result = await upsertUserProductReview(userId, id, input, db)

      return c.json(ok(result), HTTP_STATUS.OK)
    }
  )

  .get('/:id/history', zValidator('param', idParam), async (c) => {
    const db = getRlsDb(c)
    const userId = getAuthedUserId(c)
    const { id } = c.req.valid('param')
    const result = await getUserProductStatusHistory(userId, id, db)
    return c.json(ok(result), HTTP_STATUS.OK)
  })

  .get('/:id/purchases', zValidator('param', idParam), async (c) => {
    const db = getRlsDb(c)
    const userId = getAuthedUserId(c)
    const { id } = c.req.valid('param')
    const result = await getPurchases(userId, id, db)
    return c.json(ok(result), HTTP_STATUS.OK)
  })

  .post(
    '/:id/purchases',
    zValidator('param', idParam),
    zValidator('json', addPurchaseSchema),
    async (c) => {
      const db = getRlsDb(c)
      const userId = getAuthedUserId(c)
      const { id } = c.req.valid('param')
      const input = c.req.valid('json')
      const result = await addPurchase(userId, id, input, db)
      return c.json(ok(result), HTTP_STATUS.CREATED)
    }
  )

  .post(
    '/:id/purchases/finish',
    zValidator('param', idParam),
    zValidator('json', finishPurchaseSchema),
    async (c) => {
      const db = getRlsDb(c)
      const userId = getAuthedUserId(c)
      const { id } = c.req.valid('param')
      const input = c.req.valid('json')
      const result = await finishPurchase(userId, id, input, db)
      return c.json(ok(result), HTTP_STATUS.OK)
    }
  )

  .post(
    '/:id/purchases/:purchaseId/open',
    zValidator('param', purchaseParams),
    zValidator('json', openPurchaseSchema),
    async (c) => {
      const db = getRlsDb(c)
      const userId = getAuthedUserId(c)
      const { purchaseId } = c.req.valid('param')
      const input = c.req.valid('json')
      const result = await openPurchase(userId, purchaseId, input, db)
      return c.json(ok(result), HTTP_STATUS.OK)
    }
  )

  .patch(
    '/:id/purchases/:purchaseId',
    zValidator('param', purchaseParams),
    zValidator('json', updatePurchaseSchema),
    async (c) => {
      const db = getRlsDb(c)
      const userId = getAuthedUserId(c)
      const { purchaseId } = c.req.valid('param')
      const input = c.req.valid('json')
      const result = await updatePurchase(userId, purchaseId, input, db)
      return c.json(ok(result), HTTP_STATUS.OK)
    }
  )

  .delete('/:id/purchases/:purchaseId', zValidator('param', purchaseParams), async (c) => {
    const db = getRlsDb(c)
    const userId = getAuthedUserId(c)
    const { purchaseId } = c.req.valid('param')
    await deletePurchase(userId, purchaseId, db)
    return c.json(ok(null), HTTP_STATUS.OK)
  })

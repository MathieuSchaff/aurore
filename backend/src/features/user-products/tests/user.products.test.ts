import { beforeEach, describe, expect, it } from 'bun:test'

import type { UserProductStatus } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { userProductStatusLog } from '../../../db/schema/products/user-product-status-log'
import { userProductReviews, userProducts } from '../../../db/schema/user-products'
import { testDb } from '../../../tests/db.test.config'
import { cleanDatabase } from '../../../tests/helpers/db-cleaner'
import {
  createTestProduct,
  createTestUser,
  type TestUser,
} from '../../../tests/helpers/test-factories'
import {
  createUserProduct,
  deleteUserProduct,
  getUserProductById,
  getUserProductByProductId,
  getUserProductStatusHistory,
  getUserProducts,
  updateUserProduct,
  upsertUserProductReview,
} from '../service'
import { UserProductError } from '../user-product-error'

// These service functions run inside the request RLS transaction, so open a
// real one here instead of handing them the root test handle.
const createUP = (userId: string, input: Parameters<typeof createUserProduct>[1]) =>
  testDb.transaction((tx) => createUserProduct(userId, input, tx))
const getUPs = (userId: string) => testDb.transaction((tx) => getUserProducts(userId, tx))
const getUPById = (userId: string, id: string) =>
  testDb.transaction((tx) => getUserProductById(userId, id, tx))
const getUPByProductId = (userId: string, productId: string) =>
  testDb.transaction((tx) => getUserProductByProductId(userId, productId, tx))
const updateUP = (userId: string, id: string, input: Parameters<typeof updateUserProduct>[2]) =>
  testDb.transaction((tx) => updateUserProduct(userId, id, input, tx))
const deleteUP = (userId: string, id: string) =>
  testDb.transaction((tx) => deleteUserProduct(userId, id, tx))
const getUPHistory = (userId: string, id: string) =>
  testDb.transaction((tx) => getUserProductStatusHistory(userId, id, tx))
const upsertUPReview = (
  userId: string,
  id: string,
  input: Parameters<typeof upsertUserProductReview>[2]
) => testDb.transaction((tx) => upsertUserProductReview(userId, id, input, tx))

describe('User Products Service', () => {
  let user!: TestUser
  let product!: Awaited<ReturnType<typeof createTestProduct>>

  beforeEach(async () => {
    await cleanDatabase()
    user = await createTestUser('user@test.com')
    product = await createTestProduct(user.id, {
      name: 'Vitamine C',
      brand: 'Solgar',
      unit: 'dropper',
    })
  })

  // Collection row under test; status is the only field any case varies.
  const collect = (status: UserProductStatus = 'in_stock') =>
    createUP(user.id, { productId: product.id, status })

  describe('createUserProduct', () => {
    it('should create a user product', async () => {
      const userProduct = await createUP(user.id, {
        productId: product.id,
        status: 'in_stock',
        sentiment: 5,
        wouldRepurchase: 'yes',
        comment: 'Good product',
      })

      expect(userProduct).toBeDefined()
      expect(userProduct.userId).toBe(user.id)
      expect(userProduct.productId).toBe(product.id)
      expect(userProduct.status).toBe('in_stock')
    })

    it('should update existing user product on conflict', async () => {
      await collect()

      const updated = await collect('archived')

      expect(updated.status).toBe('archived')

      const count = await testDb.query.userProducts.findMany({
        where: eq(userProducts.userId, user.id),
      })
      expect(count).toHaveLength(1)
    })
  })

  describe('getUserProducts', () => {
    it('should return all products for a user', async () => {
      await collect()

      const results = await getUPs(user.id)
      expect(results).toHaveLength(1)
      expect(results[0].productId).toBe(product.id)
    })

    it('should return an empty array if user has no products', async () => {
      const otherUser = await createTestUser('other@test.com')
      const results = await getUPs(otherUser.id)
      expect(results).toHaveLength(0)
    })
  })

  describe('getUserProductById', () => {
    it('should return a user product by id', async () => {
      const created = await collect()

      const fetched = await getUPById(user.id, created.id)
      expect(fetched?.id).toBe(created.id)
    })

    it('should throw if not found', async () => {
      const fakeId = crypto.randomUUID()
      expect(getUPById(user.id, fakeId)).rejects.toThrow(UserProductError)
    })

    it('should throw if the product belongs to another user', async () => {
      const created = await collect()
      const otherUser = await createTestUser('other@test.com')

      expect(getUPById(otherUser.id, created.id)).rejects.toThrow(UserProductError)
    })
  })

  describe('getUserProductByProductId', () => {
    it('should return a user product by productId', async () => {
      await collect()

      const fetched = await getUPByProductId(user.id, product.id)
      expect(fetched?.productId).toBe(product.id)
    })

    it('should throw if not found', async () => {
      const fakeProductId = crypto.randomUUID()
      expect(getUPByProductId(user.id, fakeProductId)).rejects.toThrow(UserProductError)
    })

    it('should throw if the user has no association with this product', async () => {
      await collect()
      const otherUser = await createTestUser('other@test.com')

      expect(getUPByProductId(otherUser.id, product.id)).rejects.toThrow(UserProductError)
    })
  })

  describe('updateUserProduct', () => {
    it('should update a user product', async () => {
      const created = await collect()

      const updated = await updateUP(user.id, created.id, { status: 'archived' })
      expect(updated.status).toBe('archived')
    })

    it('should throw if user product does not exist', async () => {
      const fakeId = crypto.randomUUID()
      expect(updateUP(user.id, fakeId, { status: 'archived' })).rejects.toThrow(UserProductError)
    })

    it('should throw if user product belongs to another user', async () => {
      const created = await collect()
      const otherUser = await createTestUser('other@test.com')

      expect(updateUP(otherUser.id, created.id, { status: 'archived' })).rejects.toThrow(
        UserProductError
      )
    })
  })

  describe('deleteUserProduct', () => {
    it('should delete a user product', async () => {
      const created = await collect()

      await deleteUP(user.id, created.id)

      expect(getUPById(user.id, created.id)).rejects.toThrow(UserProductError)
    })

    it('should throw if user product does not exist', async () => {
      const fakeId = crypto.randomUUID()
      expect(deleteUP(user.id, fakeId)).rejects.toThrow(UserProductError)
    })

    it('should throw if user product belongs to another user', async () => {
      const created = await collect()
      const otherUser = await createTestUser('other@test.com')

      expect(deleteUP(otherUser.id, created.id)).rejects.toThrow(UserProductError)
    })
  })

  describe('status log', () => {
    it('logs initial transition (null → status) on creation', async () => {
      const created = await collect('wishlist')

      const log = await testDb
        .select()
        .from(userProductStatusLog)
        .where(eq(userProductStatusLog.userProductId, created.id))
      expect(log).toHaveLength(1)
      expect(log[0].fromStatus).toBeNull()
      expect(log[0].toStatus).toBe('wishlist')
      expect(log[0].reason).toBeNull()
    })

    it('appends a row on status change via update', async () => {
      const created = await collect('wishlist')

      await updateUP(user.id, created.id, {
        status: 'avoided',
        reason: 'Trop riche pour mon hiver',
      })

      const history = await getUPHistory(user.id, created.id)
      expect(history).toHaveLength(2)
      expect(history[0].fromStatus).toBe('wishlist')
      expect(history[0].toStatus).toBe('avoided')
      expect(history[0].reason).toBe('Trop riche pour mon hiver')
      expect(history[1].fromStatus).toBeNull()
      expect(history[1].toStatus).toBe('wishlist')
    })

    it('does not append when update has no status field', async () => {
      const created = await collect()

      await updateUP(user.id, created.id, { comment: 'note only' })

      const history = await getUPHistory(user.id, created.id)
      expect(history).toHaveLength(1)
    })

    it('does not append when status update matches current status', async () => {
      const created = await collect()

      await updateUP(user.id, created.id, { status: 'in_stock' })

      const history = await getUPHistory(user.id, created.id)
      expect(history).toHaveLength(1)
    })

    it('logs the upsert path when createUserProduct re-statuses an existing row', async () => {
      const created = await collect('wishlist')
      await collect()

      const history = await getUPHistory(user.id, created.id)
      expect(history).toHaveLength(2)
      expect(history[0].fromStatus).toBe('wishlist')
      expect(history[0].toStatus).toBe('in_stock')
    })

    it('trims and nullifies empty reason', async () => {
      const created = await collect()

      await updateUP(user.id, created.id, { status: 'archived', reason: '   ' })

      const history = await getUPHistory(user.id, created.id)
      expect(history[0].reason).toBeNull()
    })

    it('throws when fetching history for another user product', async () => {
      const created = await collect()
      const otherUser = await createTestUser('other@test.com')

      expect(getUPHistory(otherUser.id, created.id)).rejects.toThrow(UserProductError)
    })
  })

  describe('upsertUserProductReview', () => {
    it('should create and update a review', async () => {
      const created = await collect()

      const review = await upsertUPReview(user.id, created.id, { tolerance: 5, efficacy: 4 })
      expect(review.tolerance).toBe(5)

      const updated = await upsertUPReview(user.id, created.id, { tolerance: 4 })
      expect(updated.tolerance).toBe(4)

      const reviews = await testDb.query.userProductReviews.findMany({
        where: eq(userProductReviews.userProductId, created.id),
      })
      expect(reviews).toHaveLength(1)
    })

    it('should throw if user product not found', async () => {
      const fakeId = crypto.randomUUID()
      expect(upsertUPReview(user.id, fakeId, { tolerance: 5 })).rejects.toThrow(UserProductError)
    })

    it('should throw if user product belongs to another user', async () => {
      const created = await collect()
      const otherUser = await createTestUser('other@test.com')

      expect(upsertUPReview(otherUser.id, created.id, { tolerance: 5 })).rejects.toThrow(
        UserProductError
      )
    })
  })
})

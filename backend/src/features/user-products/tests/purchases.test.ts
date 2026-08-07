import { beforeEach, describe, expect, it } from 'bun:test'

import { testDb } from '../../../tests/db.test.config'
import { cleanDatabase } from '../../../tests/helpers/db-cleaner'
import {
  createTestProduct,
  createTestUser,
  type TestUser,
} from '../../../tests/helpers/test-factories'
import { addPurchase, finishPurchase, getPurchases, openPurchase } from '../purchase.service'
import { PurchaseError } from '../purchase-error'
import { createUserProduct } from '../service'

// These service functions run inside the request RLS transaction, so open a
// real one here instead of handing them the root test handle.
const createUP = (userId: string, input: Parameters<typeof createUserProduct>[1]) =>
  testDb.transaction((tx) => createUserProduct(userId, input, tx))
const addPurch = (
  userId: string,
  userProductId: string,
  input: Parameters<typeof addPurchase>[2]
) => testDb.transaction((tx) => addPurchase(userId, userProductId, input, tx))
const getPurch = (userId: string, userProductId: string) =>
  testDb.transaction((tx) => getPurchases(userId, userProductId, tx))
const openPurch = (userId: string, purchaseId: string, input: Parameters<typeof openPurchase>[2]) =>
  testDb.transaction((tx) => openPurchase(userId, purchaseId, input, tx))
const finishPurch = (
  userId: string,
  userProductId: string,
  input: Parameters<typeof finishPurchase>[2]
) => testDb.transaction((tx) => finishPurchase(userId, userProductId, input, tx))

describe('Purchase Service', () => {
  let user!: TestUser
  let product!: Awaited<ReturnType<typeof createTestProduct>>
  let userProduct!: Awaited<ReturnType<typeof createUP>>

  beforeEach(async () => {
    await cleanDatabase()
    user = await createTestUser('user@test.com')
    product = await createTestProduct(user.id, {
      name: 'Vitamine C',
      brand: 'Solgar',
      unit: 'dropper',
    })
    userProduct = await createUP(user.id, { productId: product.id, status: 'in_stock' })
  })

  describe('addPurchase', () => {
    it('should create a purchase for a user product', async () => {
      const purchase = await addPurch(user.id, userProduct.id, {
        purchasedAt: '2026-03-22T00:00:00.000Z',
        pricePaidCents: 1500,
      })
      expect(purchase.userProductId).toBe(userProduct.id)
      expect(purchase.purchasedAt).toBe('2026-03-22T00:00:00.000Z')
      expect(purchase.pricePaidCents).toBe(1500)
      expect(purchase.openedAt).toBeNull()
      expect(purchase.finishedAt).toBeNull()
    })

    it('should throw if user product not found', async () => {
      const fakeId = crypto.randomUUID()
      await expect(
        addPurch(user.id, fakeId, { purchasedAt: '2026-03-22T00:00:00.000Z' })
      ).rejects.toThrow(PurchaseError)
    })

    it('should throw if user product belongs to another user', async () => {
      const otherUser = await createTestUser('other@test.com')
      await expect(
        addPurch(otherUser.id, userProduct.id, { purchasedAt: '2026-03-22T00:00:00.000Z' })
      ).rejects.toThrow(PurchaseError)
    })
  })

  describe('getPurchases', () => {
    it('should return purchases for a user product', async () => {
      await addPurch(user.id, userProduct.id, { purchasedAt: '2026-03-22T00:00:00.000Z' })
      await addPurch(user.id, userProduct.id, { purchasedAt: '2026-03-20T00:00:00.000Z' })

      const purchases = await getPurch(user.id, userProduct.id)
      expect(purchases).toHaveLength(2)
    })

    it('should throw if user product not found', async () => {
      const fakeId = crypto.randomUUID()
      await expect(getPurch(user.id, fakeId)).rejects.toThrow(PurchaseError)
    })
  })

  describe('openPurchase', () => {
    it('should set openedAt on a purchase', async () => {
      const purchase = await addPurch(user.id, userProduct.id, {
        purchasedAt: '2026-03-20T00:00:00.000Z',
      })
      const opened = await openPurch(user.id, purchase.id, {
        openedAt: '2026-03-22T00:00:00.000Z',
      })
      expect(opened.openedAt).toBe('2026-03-22T00:00:00.000Z')
    })

    it('should throw if another purchase is already active', async () => {
      const p1 = await addPurch(user.id, userProduct.id, {
        purchasedAt: '2026-03-20T00:00:00.000Z',
      })
      await openPurch(user.id, p1.id, { openedAt: '2026-03-20T00:00:00.000Z' })

      const p2 = await addPurch(user.id, userProduct.id, {
        purchasedAt: '2026-03-21T00:00:00.000Z',
      })
      await expect(
        openPurch(user.id, p2.id, { openedAt: '2026-03-22T00:00:00.000Z' })
      ).rejects.toThrow(PurchaseError)
    })

    it('should throw if purchase not found', async () => {
      const fakeId = crypto.randomUUID()
      await expect(
        openPurch(user.id, fakeId, { openedAt: '2026-03-22T00:00:00.000Z' })
      ).rejects.toThrow(PurchaseError)
    })
  })

  describe('finishPurchase', () => {
    it('should set finishedAt on the active purchase', async () => {
      const purchase = await addPurch(user.id, userProduct.id, {
        purchasedAt: '2026-03-20T00:00:00.000Z',
      })
      await openPurch(user.id, purchase.id, { openedAt: '2026-03-20T00:00:00.000Z' })
      const finished = await finishPurch(user.id, userProduct.id, {
        finishedAt: '2026-03-22T00:00:00.000Z',
      })
      expect(finished.finishedAt).toBe('2026-03-22T00:00:00.000Z')
    })

    it('should throw if no active purchase exists', async () => {
      await expect(
        finishPurch(user.id, userProduct.id, { finishedAt: '2026-03-22T00:00:00.000Z' })
      ).rejects.toThrow(PurchaseError)
    })
  })
})

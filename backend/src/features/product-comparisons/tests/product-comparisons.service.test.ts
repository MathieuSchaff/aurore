import { beforeEach, describe, expect, it } from 'bun:test'

import { ingredients, productIngredients } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { cleanDatabase } from '../../../tests/helpers/db-cleaner'
import { createTestProduct, createTestUser } from '../../../tests/helpers/test-factories'
import { createProduct } from '../../products/service'
import {
  createComparison,
  deleteComparison,
  getEnrichedComparison,
  listComparisons,
  updateComparison,
} from '../service'

let user: { id: string }

// createComparison/getEnrichedComparison/updateComparison/listComparisons/deleteComparison
// run inside the request RLS transaction, so open a real one here instead of handing
// them the root test handle.
const createCmp = (userId: string, input: Parameters<typeof createComparison>[1]) =>
  testDb.transaction((tx) => createComparison(userId, input, tx))
const getCmp = (userId: string, id: string) =>
  testDb.transaction((tx) => getEnrichedComparison(userId, id, tx))
const updateCmp = (userId: string, id: string, input: Parameters<typeof updateComparison>[2]) =>
  testDb.transaction((tx) => updateComparison(userId, id, input, tx))
const listCmp = (userId: string) => testDb.transaction((tx) => listComparisons(userId, tx))
const deleteCmp = (userId: string, id: string) =>
  testDb.transaction((tx) => deleteComparison(userId, id, tx))

describe('createComparison', () => {
  beforeEach(async () => {
    await cleanDatabase()
    user = await createTestUser()
  })

  it('creates a comparison with 2 products', async () => {
    const p1 = await createTestProduct(user.id, { name: 'Sérum A', brand: 'BrandA' })
    const p2 = await createTestProduct(user.id, { name: 'Sérum B', brand: 'BrandB' })

    const cmp = await createCmp(user.id, { name: 'Mes sérums', productIds: [p1.id, p2.id] })

    expect(cmp.id).toBeDefined()
    expect(cmp.name).toBe('Mes sérums')

    const enriched = await getCmp(user.id, cmp.id)
    expect(enriched.products.length).toBe(2)
    expect(enriched.products.map((p) => p.id).sort()).toEqual([p1.id, p2.id].sort())
  })

  it('rejects unknown product ids', async () => {
    const real = await createTestProduct(user.id, { name: 'Sérum X', brand: 'BrandX' })
    const fakeId = '00000000-0000-7000-8000-000000000000'

    await expect(createCmp(user.id, { productIds: [real.id, fakeId] })).rejects.toMatchObject({
      code: 'comparison_invalid_products',
    })
  })

  it("denies access to another user's comparison", async () => {
    const p1 = await createTestProduct(user.id, { name: 'Sérum A', brand: 'BrandA' })
    const p2 = await createTestProduct(user.id, { name: 'Sérum B', brand: 'BrandB' })

    const cmp = await createCmp(user.id, { productIds: [p1.id, p2.id] })

    const otherUser = await createTestUser('intruder@toto.com')

    await expect(getCmp(otherUser.id, cmp.id)).rejects.toMatchObject({
      code: 'comparison_not_found',
    })
  })
})

describe('updateComparison', () => {
  beforeEach(async () => {
    await cleanDatabase()
    user = await createTestUser()
  })

  it('rewrites productIds and persists order', async () => {
    const a = await createTestProduct(user.id, { name: 'Sérum A', brand: 'BrandA' })
    const b = await createTestProduct(user.id, { name: 'Sérum B', brand: 'BrandB' })
    const c = await createTestProduct(user.id, { name: 'Sérum C', brand: 'BrandC' })

    const cmp = await createCmp(user.id, { productIds: [a.id, b.id] })

    await updateCmp(user.id, cmp.id, { productIds: [c.id, a.id, b.id] })

    const enriched = await getCmp(user.id, cmp.id)
    expect(enriched.products.map((p) => p.id)).toEqual([c.id, a.id, b.id])
  })

  it('renames without touching products', async () => {
    const p1 = await createTestProduct(user.id, { name: 'Sérum A', brand: 'BrandA' })
    const p2 = await createTestProduct(user.id, { name: 'Sérum B', brand: 'BrandB' })

    const cmp = await createCmp(user.id, { name: 'Original', productIds: [p1.id, p2.id] })

    await updateCmp(user.id, cmp.id, { name: 'Renamed' })

    const enriched = await getCmp(user.id, cmp.id)
    expect(enriched.name).toBe('Renamed')
    expect(enriched.products.length).toBe(2)
  })
})

describe('listComparisons', () => {
  beforeEach(async () => {
    await cleanDatabase()
    user = await createTestUser()
  })

  it('lists user comparisons with product count', async () => {
    const p1 = await createTestProduct(user.id, { name: 'Sérum A', brand: 'BrandA' })
    const p2 = await createTestProduct(user.id, { name: 'Sérum B', brand: 'BrandB' })

    await createCmp(user.id, { name: 'first', productIds: [p1.id, p2.id] })

    const list = await listCmp(user.id)
    expect(list.length).toBe(1)
    expect(list[0]?.name).toBe('first')
    expect(list[0]?.productCount).toBe(2)
  })
})

describe('deleteComparison', () => {
  beforeEach(async () => {
    await cleanDatabase()
    user = await createTestUser()
  })

  it('removes a comparison and its items', async () => {
    const p1 = await createTestProduct(user.id, { name: 'Sérum A', brand: 'BrandA' })
    const p2 = await createTestProduct(user.id, { name: 'Sérum B', brand: 'BrandB' })

    const cmp = await createCmp(user.id, { productIds: [p1.id, p2.id] })

    await deleteCmp(user.id, cmp.id)

    await expect(getCmp(user.id, cmp.id)).rejects.toMatchObject({
      code: 'comparison_not_found',
    })
  })

  it('denies a different user from deleting', async () => {
    const a = await createTestProduct(user.id, { name: 'Sérum A', brand: 'BrandA' })
    const b = await createTestProduct(user.id, { name: 'Sérum B', brand: 'BrandB' })

    const cmp = await createCmp(user.id, { productIds: [a.id, b.id] })

    const otherUser = await createTestUser('intruder@test.com')

    await expect(deleteCmp(otherUser.id, cmp.id)).rejects.toMatchObject({
      code: 'comparison_not_found',
    })
  })
})

describe('enrichment', () => {
  beforeEach(async () => {
    await cleanDatabase()
    user = await createTestUser()
  })

  it('flags niacinamide as active', async () => {
    const p1 = await createTestProduct(user.id, { name: 'Sérum A', brand: 'BrandA' })
    const p2 = await createTestProduct(user.id, { name: 'Sérum B', brand: 'BrandB' })

    const [ingredient] = await testDb
      .insert(ingredients)
      .values({
        createdBy: user.id,
        name: 'Niacinamide',
        slug: 'niacinamide',
        type: 'skincare',
      })
      .returning()
    if (!ingredient) throw new Error('ingredient insert failed')

    await testDb.insert(productIngredients).values({
      productId: p1.id,
      ingredientId: ingredient.id,
    })

    const cmp = await createCmp(user.id, { productIds: [p1.id, p2.id] })

    const enriched = await getCmp(user.id, cmp.id)
    const first = enriched.products.find((p) => p.id === p1.id)
    expect(first?.ingredients[0]?.signals).toContain('active')
  })

  it('computes price per ml when total amount is set', async () => {
    const a = await testDb.transaction((tx) =>
      createProduct(
        user.id,
        'admin',
        {
          name: 'Sérum A',
          brand: 'BrandA',
          kind: 'serum',
          unit: 'pump',
          category: 'skincare',
          priceCents: 1000,
          totalAmount: 50,
          amountUnit: 'ml',
        },
        tx
      )
    )
    const b = await createTestProduct(user.id, { name: 'Sérum B', brand: 'BrandB' })

    const cmp = await createCmp(user.id, { productIds: [a.id, b.id] })

    const enriched = await getCmp(user.id, cmp.id)
    const ap = enriched.products.find((p) => p.id === a.id)
    const bp = enriched.products.find((p) => p.id === b.id)
    expect(ap?.pricePer).toEqual({ unit: 'ml', cents: 20 })
    expect(bp?.pricePer).toBeNull()
  })
})

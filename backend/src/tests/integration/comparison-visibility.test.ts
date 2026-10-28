import { describe, expect, it } from 'bun:test'

import { eq } from 'drizzle-orm'

import { ingredients, productIngredients, products } from '../../db/schema'
import {
  createComparison,
  getEnrichedComparison,
  listComparisons,
  previewComparison,
} from '../../features/product-comparisons/service'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb, withRlsAs } from '../helpers/app-runtime-db'
import { createTestIngredient, createTestProduct, createTestUser } from '../helpers/test-factories'

const runtimeDb = await createAppRuntimeDb()

setupDbTests()

describe('comparison visibility', () => {
  it('links only visible sheets belonging to that product and restores links after unhide', async () => {
    const user = await createTestUser('comparison-ingredient-links@test.local')
    const first = await createTestProduct(user.id, { name: 'Linked formula', inci: 'Aqua' })
    const second = await createTestProduct(user.id, { name: 'Unlinked formula', inci: 'Aqua' })
    const ingredient = await createTestIngredient(user.id, { name: 'Eau', slug: 'eau' }, 'admin')
    await testDb
      .update(ingredients)
      .set({ canonicalKey: 'Aqua' })
      .where(eq(ingredients.id, ingredient.id))
    await testDb.insert(productIngredients).values({
      productId: first.id,
      ingredientId: ingredient.id,
    })
    const comparison = await withRlsAs(runtimeDb, 'user', user.id, (tx) =>
      createComparison(user.id, { productIds: [first.id, second.id] }, tx)
    )

    async function expectFormulaLinks(visible: boolean) {
      await withRlsAs(runtimeDb, 'user', user.id, async (tx) => {
        const detail = await getEnrichedComparison(user.id, comparison.id, tx)
        const preview = await previewComparison([first.id, second.id], tx)
        const firstTokens = [
          { label: 'Aqua', key: 'aqua', ...(visible ? { ingredientSlug: 'eau' } : {}) },
        ]
        expect(detail.products[0]?.inciTokens).toEqual(firstTokens)
        expect(detail.products[1]?.inciTokens).toEqual([{ label: 'Aqua', key: 'aqua' }])
        expect(preview).toEqual(detail.products)
      })
    }

    await expectFormulaLinks(true)
    await testDb
      .update(ingredients)
      .set({ moderationStatus: 'hidden' })
      .where(eq(ingredients.id, ingredient.id))
    await expectFormulaLinks(false)
    await testDb
      .update(ingredients)
      .set({ moderationStatus: 'visible' })
      .where(eq(ingredients.id, ingredient.id))
    await expectFormulaLinks(true)
  })

  it('keeps the summary count aligned with visible detail after hiding and restoring products', async () => {
    const user = await createTestUser('comparison-visibility@test.local')
    const first = await createTestProduct(user.id, { name: 'First comparable product' })
    const second = await createTestProduct(user.id, { name: 'Second comparable product' })
    const comparison = await withRlsAs(runtimeDb, 'user', user.id, (tx) =>
      createComparison(user.id, { productIds: [first.id, second.id] }, tx)
    )

    async function expectVisibleProducts(expectedIds: string[]) {
      await withRlsAs(runtimeDb, 'user', user.id, async (tx) => {
        const summaries = await listComparisons(user.id, tx)
        const detail = await getEnrichedComparison(user.id, comparison.id, tx)
        expect(summaries).toHaveLength(1)
        expect(detail.products.map((product) => product.id)).toEqual(expectedIds)
        expect(summaries[0]?.productCount).toBe(expectedIds.length)
        expect(summaries[0]?.unavailableProductCount).toBe(2 - expectedIds.length)
        expect(detail.unavailableProductCount).toBe(2 - expectedIds.length)
        for (const product of [first, second]) {
          if (!expectedIds.includes(product.id)) {
            expect(JSON.stringify(detail)).not.toContain(product.name)
            expect(JSON.stringify(detail)).not.toContain(product.id)
          }
        }
      })
    }

    await expectVisibleProducts([first.id, second.id])
    await testDb
      .update(products)
      .set({ moderationStatus: 'hidden' })
      .where(eq(products.id, first.id))
    await expectVisibleProducts([second.id])
    await testDb
      .update(products)
      .set({ moderationStatus: 'hidden' })
      .where(eq(products.id, second.id))
    await expectVisibleProducts([])
    await testDb
      .update(products)
      .set({ moderationStatus: 'visible' })
      .where(eq(products.id, first.id))
    await expectVisibleProducts([first.id])
    await testDb
      .update(products)
      .set({ moderationStatus: 'visible' })
      .where(eq(products.id, second.id))
    await expectVisibleProducts([first.id, second.id])
  })
})

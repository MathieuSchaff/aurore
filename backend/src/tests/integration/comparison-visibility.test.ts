import { describe, expect, it } from 'bun:test'

import { eq } from 'drizzle-orm'

import {
  ingredients,
  ingredientTagLinks,
  ingredientTagTypes,
  productIngredients,
  products,
} from '../../db/schema'
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
  it('returns named INCI facts without ingredient links in both comparison paths', async () => {
    const user = await createTestUser('comparison-formula-facts@test.local')
    const first = await createTestProduct(user.id, {
      name: 'Named facts',
      inci: 'Parfum, Alcohol Denat., Linalool',
    })
    const second = await createTestProduct(user.id, { name: 'Missing INCI' })
    await withRlsAs(runtimeDb, 'user', user.id, async (tx) => {
      const comparison = await createComparison(user.id, { productIds: [first.id, second.id] }, tx)
      const detail = await getEnrichedComparison(user.id, comparison.id, tx)
      expect(detail.products[0]?.ingredients).toEqual([])
      expect(detail.products[0]?.inciTokens).toEqual([
        { label: 'Parfum', key: 'parfum', comparisonMarker: 'fragrance' },
        { label: 'Alcohol Denat', key: 'alcohol denat', comparisonMarker: 'denatured-alcohol' },
        { label: 'Linalool', key: 'linalool', comparisonMarker: 'fragrance-component' },
      ])
      expect(detail.products[1]?.inciTokens).toBeNull()
      expect(await previewComparison([first.id, second.id], tx)).toEqual(detail.products)
    })
  })

  it('includes catalogue active families and excludes ordinary and unknown ingredients', async () => {
    const user = await createTestUser('comparison-active-family@test.local')
    const first = await createTestProduct(user.id, {
      name: 'Ceramide formula',
      inci: 'Ceramide NP, Aqua, Invented Ingredient',
    })
    const second = await createTestProduct(user.id, {
      name: 'Unknown formula',
      inci: 'Invented Ingredient',
    })
    const ceramide = await createTestIngredient(
      user.id,
      { name: 'Céramide NP', slug: 'ceramide-np', category: 'emollient' },
      'admin'
    )
    const water = await createTestIngredient(
      user.id,
      { name: 'Eau', slug: 'eau', category: 'excipient' },
      'admin'
    )
    await testDb
      .update(ingredients)
      .set({ canonicalKey: 'Ceramide NP' })
      .where(eq(ingredients.id, ceramide.id))
    await testDb
      .update(ingredients)
      .set({ canonicalKey: 'Aqua' })
      .where(eq(ingredients.id, water.id))
    const [family] = await testDb
      .insert(ingredientTagTypes)
      .values({
        slug: 'ceramides',
        label: 'Céramides',
        tagType: 'actif_class',
      })
      .returning()
    if (!family) throw new Error('Missing active family fixture')
    await testDb
      .insert(ingredientTagLinks)
      .values({ ingredientId: ceramide.id, ingredientTagId: family.id })
    await withRlsAs(runtimeDb, 'user', user.id, async (tx) => {
      const preview = await previewComparison([first.id, second.id], tx)
      expect(preview[0]?.actives.map((active) => active.ingredientSlug)).toEqual(['ceramide-np'])
      expect(preview[1]?.actives).toEqual([])
    })
  })

  it('resolves INCI actives without product links and follows sheet visibility in preview and detail', async () => {
    const user = await createTestUser('comparison-active-identity@test.local')
    const first = await createTestProduct(user.id, {
      name: 'Active formula',
      inci: 'Niacinamide, Niacinamide, Aqua',
    })
    const second = await createTestProduct(user.id, { name: 'Missing formula' })
    const sheet = await createTestIngredient(
      user.id,
      {
        name: 'Vitamine B3',
        slug: 'vitamine-b3',
        category: 'actif',
      },
      'admin'
    )
    await testDb
      .update(ingredients)
      .set({ canonicalKey: 'Niacinamide' })
      .where(eq(ingredients.id, sheet.id))
    await testDb.insert(productIngredients).values({ productId: second.id, ingredientId: sheet.id })
    const hairSheet = await createTestIngredient(
      user.id,
      {
        name: 'B3 cheveux',
        slug: 'b3-hair',
        type: 'haircare',
        category: 'actif',
      },
      'admin'
    )
    await testDb
      .update(ingredients)
      .set({ canonicalKey: 'Niacinamide' })
      .where(eq(ingredients.id, hairSheet.id))
    const comparison = await withRlsAs(runtimeDb, 'user', user.id, (tx) =>
      createComparison(user.id, { productIds: [first.id, second.id] }, tx)
    )

    async function expectActive(visible: boolean) {
      await withRlsAs(runtimeDb, 'user', user.id, async (tx) => {
        const detail = await getEnrichedComparison(user.id, comparison.id, tx)
        const preview = await previewComparison([first.id, second.id], tx)
        expect(detail.products[0]?.ingredients).toEqual([])
        expect(detail.products[0]?.actives).toEqual(
          visible
            ? [
                {
                  key: 'Niacinamide',
                  name: 'Vitamine B3',
                  ingredientSlug: 'vitamine-b3',
                  functions: ['SMOOTHING'],
                  cosingRef: '35499',
                },
              ]
            : []
        )
        expect(detail.products[1]?.actives).toEqual([])
        expect(preview).toEqual(detail.products)
      })
    }

    await expectActive(true)
    await testDb
      .update(ingredients)
      .set({ moderationStatus: 'hidden' })
      .where(eq(ingredients.id, sheet.id))
    await expectActive(false)
    await testDb
      .update(ingredients)
      .set({ moderationStatus: 'visible' })
      .where(eq(ingredients.id, sheet.id))
    await expectActive(true)

    const duplicate = await createTestIngredient(
      user.id,
      {
        name: 'Autre fiche B3',
        slug: 'autre-b3',
        category: 'actif',
      },
      'admin'
    )
    await testDb
      .update(ingredients)
      .set({ canonicalKey: 'Niacinamide' })
      .where(eq(ingredients.id, duplicate.id))
    await withRlsAs(runtimeDb, 'user', user.id, async (tx) => {
      const preview = await previewComparison([first.id, second.id], tx)
      expect(preview[0]?.actives).toEqual([
        {
          key: 'Niacinamide',
          name: 'Niacinamide',
          ingredientSlug: null,
          functions: ['SMOOTHING'],
          cosingRef: '35499',
        },
      ])
    })
  })

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

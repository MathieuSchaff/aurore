import { beforeEach, describe, expect, it } from 'bun:test'

import { userIngredientAnalysisScore } from '../../db/schema/ingredients/user-ingredient-analysis-score'
import { productIngredients } from '../../db/schema/products/product-ingredients'
import { userProducts } from '../../db/schema/products/user-products'
import { testDb } from '../../tests/db.test.config'
import { setupDbTests } from '../../tests/db-setup'
import {
  createTestIngredient,
  createTestProduct,
  createTestUser,
  type TestUser,
} from '../../tests/helpers/test-factories'
import { calculateCompatibilityScores, getCollectionFormulaMotifs } from './service'

setupDbTests()

// Both services run inside the request RLS transaction, so open a real one here
// instead of handing them the root test handle.
const formulaMotifs = (userId: string) =>
  testDb.transaction((tx) => getCollectionFormulaMotifs(userId, tx))

const compatScores = (userId: string, productIds: string[]) =>
  testDb.transaction((tx) => calculateCompatibilityScores(userId, productIds, tx))

// Rich, widely-recognized INCI: glycerin → hydrating benefit, tocopherol → antioxidant,
// parfum → fragrance heuristic note. analyzeINCI uses algo-derm's bundled evidence, so
// these assertions don't depend on the aurore DB seed.
const MOTIF_INCI = 'Aqua, Glycerin, Niacinamide, Panthenol, Tocopherol, Parfum'

let user: TestUser

beforeEach(async () => {
  user = await createTestUser('collection@test.local')
})

async function createSignalIngredient(
  name: string,
  signal: { favorite?: number; suspect?: number }
): Promise<string> {
  const ingredient = await createTestIngredient(user.id, { name })
  const favorite = signal.favorite ?? 0
  const suspect = signal.suspect ?? 0
  await testDb.insert(userIngredientAnalysisScore).values({
    userId: user.id,
    ingredientId: ingredient.id,
    favoriteScore: favorite.toFixed(6),
    suspicionScore: suspect.toFixed(6),
    isFavorite: favorite > 0,
    isSuspect: suspect > 0,
  })
  return ingredient.id
}

async function createProductWith(name: string, ingredientIds: string[]): Promise<string> {
  const product = await createTestProduct(user.id, { name })
  if (ingredientIds.length > 0) {
    await testDb
      .insert(productIngredients)
      .values(ingredientIds.map((ingredientId) => ({ productId: product.id, ingredientId })))
  }
  return product.id
}

async function shelveProduct(
  name: string,
  opts: { inci?: string; status?: 'in_stock' | 'avoided' } = {}
): Promise<string> {
  const product = await createTestProduct(user.id, { name, inci: opts.inci })
  await testDb
    .insert(userProducts)
    .values({ userId: user.id, productId: product.id, status: opts.status ?? 'in_stock' })
  return product.id
}

describe('calculateCompatibilityScores', () => {
  it('scores a product above neutral when its ingredients lean favorite', async () => {
    const ing = await createSignalIngredient('fav-actif', { favorite: 0.8 })
    const product = await createProductWith('fav-product', [ing])

    const scores = await compatScores(user.id, [product])

    expect(scores[product]).toBe(90)
  })

  it('scores a product below neutral when its ingredients lean suspect', async () => {
    const ing = await createSignalIngredient('suspect-actif', { suspect: 0.6 })
    const product = await createProductWith('suspect-product', [ing])

    const scores = await compatScores(user.id, [product])

    expect(scores[product]).toBe(20)
  })

  it('returns null when no ingredient carries real evidence', async () => {
    const ing = await createSignalIngredient('zero-actif', {}) // flags false: appears but no evidence
    const product = await createProductWith('zero-product', [ing])

    const scores = await compatScores(user.id, [product])

    expect(scores[product]).toBeNull()
  })

  it('returns a null entry for every requested product, even unscored ones', async () => {
    const favIng = await createSignalIngredient('mixed-fav', { favorite: 1 })
    const scored = await createProductWith('mixed-scored', [favIng])
    const unscored = await createProductWith('mixed-unscored', [])

    const scores = await compatScores(user.id, [scored, unscored])

    expect(scores[scored]).toBe(100)
    expect(scores[unscored]).toBeNull()
    expect(Object.keys(scores)).toHaveLength(2)
  })

  it('averages mixed-signal ingredients within a product', async () => {
    const favIng = await createSignalIngredient('avg-fav', { favorite: 0.6 })
    const suspectIng = await createSignalIngredient('avg-suspect', { suspect: 0.6 })
    const product = await createProductWith('avg-product', [favIng, suspectIng])

    const scores = await compatScores(user.id, [product])

    // mean signal = (0.6 + -0.6) / 2 = 0 → neutral 50.
    expect(scores[product]).toBe(50)
  })

  it('returns an empty object for an empty product list', async () => {
    const scores = await compatScores(user.id, [])

    expect(scores).toEqual({})
  })
})

describe('getCollectionFormulaMotifs', () => {
  it('returns nothing for an empty collection', async () => {
    const motifs = await formulaMotifs(user.id)

    expect(motifs).toEqual({ productsAnalyzed: 0, benefits: [], notes: [] })
  })

  it('does not count a product with no INCI', async () => {
    await shelveProduct('motif-no-inci')

    const motifs = await formulaMotifs(user.id)

    expect(motifs.productsAnalyzed).toBe(0)
  })

  it('gates a single product out: one occurrence is not a motif', async () => {
    await shelveProduct('motif-single-a', { inci: MOTIF_INCI })

    const motifs = await formulaMotifs(user.id)

    expect(motifs.productsAnalyzed).toBe(1)
    expect(motifs.benefits).toEqual([])
    expect(motifs.notes).toEqual([])
  })

  it('aggregates recurring axes and excludes avoided products', async () => {
    await shelveProduct('motif-agg-a', { inci: MOTIF_INCI })
    await shelveProduct('motif-agg-b', { inci: MOTIF_INCI })
    // Same formula but rejected — must not feed the shelf's signal.
    await shelveProduct('motif-agg-c', { inci: MOTIF_INCI, status: 'avoided' })

    const motifs = await formulaMotifs(user.id)

    expect(motifs.productsAnalyzed).toBe(2)
    expect(motifs.benefits.some((b) => b.axis === 'hydrating')).toBe(true)
    expect(motifs.benefits.every((b) => b.count === 2)).toBe(true)
    expect(motifs.notes.length).toBeGreaterThan(0)
    // avoided excluded → no axis can reach 3.
    expect(motifs.notes.every((n) => n.count <= 2)).toBe(true)
  })
})

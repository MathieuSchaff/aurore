import { describe, expect, it } from 'bun:test'

import { and, eq } from 'drizzle-orm'

import { ingredientDermoProfiles } from '../../../db/schema/ingredients/ingredient-dermo-profiles'
import { userIngredientAnalysisScore } from '../../../db/schema/ingredients/user-ingredient-analysis-score'
import { productIngredients } from '../../../db/schema/products/product-ingredients'
import { userProductReviews, userProducts } from '../../../db/schema/products/user-products'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestIngredient,
  createTestProduct,
  createTestUser,
} from '../../../tests/helpers/test-factories'
import { recalculateAllSignalsForUser } from '../dermo-signal.service'

setupDbTests()

// recalculateAllSignalsForUser runs inside the request RLS transaction, so open a
// real one here instead of handing it the root test handle.
const recalcTx = (userId: string) =>
  testDb.transaction((tx) => recalculateAllSignalsForUser(userId, tx))

async function createIngredient(userId: string, name: string): Promise<string> {
  const ingredient = await createTestIngredient(userId, { name })
  return ingredient.id
}

// The shared factory has no ingredient link, which is the whole point here.
async function createProduct(
  userId: string,
  name: string,
  ingredientIds: string[]
): Promise<string> {
  const product = await createTestProduct(userId, { name })
  if (ingredientIds.length > 0) {
    await testDb
      .insert(productIngredients)
      .values(ingredientIds.map((ingredientId) => ({ productId: product.id, ingredientId })))
  }
  return product.id
}

type CollectionOpts = { status?: 'in_stock' | 'avoided'; sentiment?: number; tolerance?: number }

async function addToCollection(
  userId: string,
  productId: string,
  opts: CollectionOpts
): Promise<void> {
  const [row] = await testDb
    .insert(userProducts)
    .values({
      userId,
      productId,
      status: opts.status ?? 'in_stock',
      sentiment: opts.sentiment ?? null,
    })
    .returning({ id: userProducts.id })
  if (!row) throw new Error('user_product insert failed')
  if (opts.tolerance !== undefined) {
    await testDb
      .insert(userProductReviews)
      .values({ userProductId: row.id, tolerance: opts.tolerance })
  }
}

// MIN_EVIDENCE is 2, so a classification needs the ingredient on two products.
// The bucket each product lands in is the subject of every test, hence passed in.
async function seedPair(
  userId: string,
  ingredientId: string,
  prefix: string,
  first: CollectionOpts,
  second: CollectionOpts
): Promise<void> {
  const p1 = await createProduct(userId, `${prefix}-1`, [ingredientId])
  const p2 = await createProduct(userId, `${prefix}-2`, [ingredientId])
  await addToCollection(userId, p1, first)
  await addToCollection(userId, p2, second)
}

function getScore(userId: string, ingredientId: string) {
  return testDb
    .select()
    .from(userIngredientAnalysisScore)
    .where(
      and(
        eq(userIngredientAnalysisScore.userId, userId),
        eq(userIngredientAnalysisScore.ingredientId, ingredientId)
      )
    )
    .then((rows) => rows[0])
}

describe('recalculateAllSignalsForUser', () => {
  it('flags an ingredient that appears too often in bad products as suspect', async () => {
    const user = await createTestUser('signal-suspect@test.local')
    const ing = await createIngredient(user.id, 'suspect-actif')
    await seedPair(user.id, ing, 'bad', { status: 'avoided' }, { tolerance: 1 })

    await recalcTx(user.id)

    const row = await getScore(user.id, ing)
    expect(row?.isSuspect).toBe(true)
    expect(row?.isFavorite).toBe(false)
    expect(Number(row?.suspicionScore)).toBeGreaterThan(0)
  })

  it('flags an ingredient that appears too often in good products as favorite', async () => {
    const user = await createTestUser('signal-fav@test.local')
    const ing = await createIngredient(user.id, 'favorite-actif')
    await seedPair(user.id, ing, 'good', { tolerance: 5 }, { sentiment: 6 })

    await recalcTx(user.id)

    const row = await getScore(user.id, ing)
    expect(row?.isFavorite).toBe(true)
    expect(row?.isSuspect).toBe(false)
    expect(Number(row?.favoriteScore)).toBeGreaterThan(0)
  })

  it('does not flag an ingredient seen fewer than MIN_EVIDENCE times', async () => {
    const user = await createTestUser('signal-weak@test.local')
    const ing = await createIngredient(user.id, 'weak-actif')
    const p1 = await createProduct(user.id, 'weak-bad', [ing])
    await addToCollection(user.id, p1, { status: 'avoided' })

    await recalcTx(user.id)

    const row = await getScore(user.id, ing)
    expect(row?.isSuspect).toBe(false)
    expect(row?.isFavorite).toBe(false)
    expect(Number(row?.suspicionScore)).toBe(0)
  })

  it('ignores filler ingredients entirely', async () => {
    const user = await createTestUser('signal-filler@test.local')
    const ing = await createIngredient(user.id, 'aqua-filler')
    await testDb.insert(ingredientDermoProfiles).values({ ingredientId: ing, isFiller: true })
    await seedPair(user.id, ing, 'filler', { status: 'avoided' }, { tolerance: 1 })

    await recalcTx(user.id)

    const row = await getScore(user.id, ing)
    expect(row).toBeUndefined()
  })

  it('removes orphaned score rows for ingredients no longer in the collection', async () => {
    const user = await createTestUser('signal-orphan@test.local')
    const orphan = await createIngredient(user.id, 'orphan-actif')
    // Stale row for an ingredient absent from every collection product.
    await testDb.insert(userIngredientAnalysisScore).values({
      userId: user.id,
      ingredientId: orphan,
      suspicionScore: '0.500000',
      favoriteScore: '0',
      isSuspect: true,
      isFavorite: false,
    })

    const live = await createIngredient(user.id, 'live-actif')
    await seedPair(user.id, live, 'orphan-bad', { status: 'avoided' }, { tolerance: 1 })

    await recalcTx(user.id)

    expect(await getScore(user.id, orphan)).toBeUndefined()
    expect((await getScore(user.id, live))?.isSuspect).toBe(true)
  })

  it('does not crash on an empty good bucket (no division by zero)', async () => {
    const user = await createTestUser('signal-zerogood@test.local')
    const ing = await createIngredient(user.id, 'onlybad-actif')
    await seedPair(user.id, ing, 'zerogood', { status: 'avoided' }, { tolerance: 2 })

    await recalcTx(user.id)

    const row = await getScore(user.id, ing)
    expect(row?.isSuspect).toBe(true)
    expect(Number(row?.favoriteScore)).toBe(0)
  })

  it('does not crash and writes nothing for an empty collection', async () => {
    const user = await createTestUser('signal-empty@test.local')

    await recalcTx(user.id)

    const rows = await testDb
      .select()
      .from(userIngredientAnalysisScore)
      .where(eq(userIngredientAnalysisScore.userId, user.id))
    expect(rows).toHaveLength(0)
  })

  // Tolerance boundaries: bad <= 2, good >= 4, so 3 is the neutral gap.
  it('treats tolerance = 3 as neutral (no signal row)', async () => {
    const user = await createTestUser('signal-neutral@test.local')
    const ing = await createIngredient(user.id, 'neutral-actif')
    await seedPair(user.id, ing, 'neutral', { tolerance: 3 }, { tolerance: 3 })

    await recalcTx(user.id)

    expect(await getScore(user.id, ing)).toBeUndefined()
  })

  it('classifies tolerance = 4 as a favorite (good-bucket lower bound)', async () => {
    const user = await createTestUser('signal-tol4@test.local')
    const ing = await createIngredient(user.id, 'tol4-actif')
    await seedPair(user.id, ing, 'tol4', { tolerance: 4 }, { tolerance: 4 })

    await recalcTx(user.id)

    const row = await getScore(user.id, ing)
    expect(row?.isFavorite).toBe(true)
    expect(row?.isSuspect).toBe(false)
  })

  // Dual-bucket: sentiment=6 (good) AND tolerance<=2 (bad) on the same product
  // puts the ingredient in both sets, so it stays a candidate (row written) but
  // its bad/good contributions cancel to zero.
  it('lands sentiment=6 + low tolerance in both buckets (cancels to zero)', async () => {
    const user = await createTestUser('signal-dual@test.local')
    const ing = await createIngredient(user.id, 'dual-actif')
    await seedPair(
      user.id,
      ing,
      'dual',
      { sentiment: 6, tolerance: 2 },
      { sentiment: 6, tolerance: 2 }
    )

    await recalcTx(user.id)

    const row = await getScore(user.id, ing)
    expect(row).toBeDefined()
    expect(row?.isSuspect).toBe(false)
    expect(row?.isFavorite).toBe(false)
    expect(Number(row?.suspicionScore)).toBe(0)
    expect(Number(row?.favoriteScore)).toBe(0)
  })
})

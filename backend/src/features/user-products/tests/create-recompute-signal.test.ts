import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { ingredients } from '../../../db/schema/ingredients/ingredients'
import { userIngredientAnalysisScore } from '../../../db/schema/ingredients/user-ingredient-analysis-score'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestClient,
  signupAndGetToken,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectOk } from '../../../tests/helpers/expectStatus'
import { createTestProduct } from '../../../tests/helpers/test-factories'

setupDbTests()

async function countScores(userId: string) {
  const rows = await testDb
    .select({ id: userIngredientAnalysisScore.id })
    .from(userIngredientAnalysisScore)
    .where(eq(userIngredientAnalysisScore.userId, userId))
  return rows.length
}

// The POST endpoint upserts; before this fix only PATCH/DELETE recomputed the
// dermo signal, so a product created (or re-added) as avoided / Holy-Grail left
// the suspicion/favorite scores stale. A seeded orphan score is reconciled away
// whenever recalculateAllSignalsForUser runs against a collection with no signal
// candidates, so its survival is the observable for "did the recompute fire".
describe('user-products mutations — dermo signal recompute', () => {
  let client: TestClient
  let token: string
  let userId: string
  let productId: string

  beforeAll(async () => {
    client = await createTestClient()
  })

  beforeEach(async () => {
    const auth = await signupAndGetToken(client, 'signal@test.com', 'Azerty123!seed')
    token = auth.token
    userId = auth.userId

    const product = await createTestProduct(userId, { name: 'Sérum signal', brand: 'Brand' })
    productId = product.id

    const [ingredient] = await testDb
      .insert(ingredients)
      .values({ createdBy: userId, name: 'Aqua', slug: 'aqua-signal', type: 'skincare' })
      .returning({ id: ingredients.id })
    if (!ingredient) throw new Error('ingredient seed failed')
    await testDb
      .insert(userIngredientAnalysisScore)
      .values({ userId, ingredientId: ingredient.id, isSuspect: true })
  })

  it('skips the recompute when the created product carries no signal (in_stock)', async () => {
    const res = await client['user-products'].$post(
      { json: { productId, status: 'in_stock' } },
      withAuth(token)
    )

    expect(res.status as number).toBe(HTTP_STATUS.CREATED)
    expect(await countScores(userId)).toBe(1)
  })

  it('recomputes when the created product is avoided', async () => {
    const res = await client['user-products'].$post(
      { json: { productId, status: 'avoided' } },
      withAuth(token)
    )

    expect(res.status as number).toBe(HTTP_STATUS.CREATED)
    expect(await countScores(userId)).toBe(0)
  })

  it('recomputes when re-adding flips an existing product to avoided (upsert)', async () => {
    await client['user-products'].$post(
      { json: { productId, status: 'in_stock' } },
      withAuth(token)
    )
    expect(await countScores(userId)).toBe(1)

    await client['user-products'].$post({ json: { productId, status: 'avoided' } }, withAuth(token))
    expect(await countScores(userId)).toBe(0)
  })

  async function createInStock() {
    const created = await expectOk(
      client['user-products'].$post({ json: { productId, status: 'in_stock' } }, withAuth(token)),
      HTTP_STATUS.CREATED
    )
    expect(await countScores(userId)).toBe(1) // in_stock create carries no signal
    return created.id
  }

  it('recomputes on PATCH to avoided', async () => {
    const id = await createInStock()

    await client['user-products'][':id'].$patch(
      { param: { id }, json: { status: 'avoided' } },
      withAuth(token)
    )

    expect(await countScores(userId)).toBe(0)
  })

  it('recomputes on DELETE', async () => {
    const id = await createInStock()

    await client['user-products'][':id'].$delete({ param: { id } }, withAuth(token))

    expect(await countScores(userId)).toBe(0)
  })

  it('recomputes on review upsert when tolerance is set', async () => {
    const id = await createInStock()

    await client['user-products'][':id'].review.$put(
      { param: { id }, json: { tolerance: 1 } },
      withAuth(token)
    )

    expect(await countScores(userId)).toBe(0)
  })
})

import { describe, expect, it } from 'bun:test'

import { eq } from 'drizzle-orm'

import { ingredients, productIngredients } from '../../db/schema'
import { readProductDetailPage } from '../../features/products/service'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb } from '../helpers/app-runtime-db'
import { createTestIngredient, createTestProduct, createTestUser } from '../helpers/test-factories'

const runtime = await createAppRuntimeDb()
setupDbTests()

describe('product detail resilience', () => {
  it('omits a hidden ingredient while preserving the visible product', async () => {
    const user = await createTestUser()
    const product = await createTestProduct(user.id, { name: 'Visible detail fixture' })
    const ingredient = await createTestIngredient(user.id, { name: 'Hidden ingredient marker' })
    await testDb
      .insert(productIngredients)
      .values({ productId: product.id, ingredientId: ingredient.id })
    await testDb
      .update(ingredients)
      .set({ moderationStatus: 'hidden' })
      .where(eq(ingredients.id, ingredient.id))
    const detail = await readProductDetailPage(runtime, { viewerId: null, slug: product.slug })
    expect(detail.product.id).toBe(product.id)
    expect(detail.product.ingredients).toEqual([])
    expect(JSON.stringify(detail)).not.toContain(ingredient.name)
  })
})

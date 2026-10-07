import { describe, expect, it } from 'bun:test'

import { eq, sql } from 'drizzle-orm'

import { ingredients, productIngredients, products } from '../../db/schema'
import { readProductDetailPage } from '../../features/products/service'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb, withRlsAs } from '../helpers/app-runtime-db'
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

  it.each(['user_dermo_profiles', 'user_ingredient_preferences'] as const)(
    'keeps required data after an optional SQL read fails on %s',
    async (table) => {
      const user = await createTestUser()
      const product = await createTestProduct(user.id, {
        name: 'Optional read fixture',
        inci: 'Aqua, Glycerin',
      })
      const locked = Promise.withResolvers<void>()
      const release = Promise.withResolvers<void>()
      const blocker = testDb.transaction(async (tx) => {
        await tx.execute(sql`LOCK TABLE ${sql.identifier(table)} IN ACCESS EXCLUSIVE MODE`)
        locked.resolve()
        await release.promise
      })
      try {
        await Promise.race([locked.promise, blocker])
        await withRlsAs(runtime, 'user', user.id, async (tx) => {
          await tx.execute(sql`SET LOCAL lock_timeout = '100ms'`)
          const detail = await readProductDetailPage(tx, { viewerId: user.id, slug: product.slug })
          expect(detail.product.id).toBe(product.id)
          expect(detail.preferenceTargets).toEqual({ ingredients: [], tags: [] })
          // A swallowed SQL error would also make this independent read fail
          expect(
            await tx.select({ id: products.id }).from(products).where(eq(products.id, product.id))
          ).toHaveLength(1)
        })
      } finally {
        release.resolve()
        await blocker
      }
    }
  )
})

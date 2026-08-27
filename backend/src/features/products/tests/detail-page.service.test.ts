import { describe, expect, it } from 'bun:test'

import { resolveAvoidSlugs } from '@aurore/shared'

import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/bun-sql'

import * as schema from '../../../db/schema'
import {
  ingredients,
  productIngredients,
  productTagTypes,
  userDermoProfiles,
  userIngredientPreferences,
  userProducts,
  userTagPreferences,
} from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestIngredient,
  createTestProduct,
  createTestUser,
} from '../../../tests/helpers/test-factories'
import { readProductDetailPage } from '../service'

setupDbTests()

describe('readProductDetailPage', () => {
  it('reuses loaded detail data and stays within seven database reads', async () => {
    const user = await createTestUser('detail-query-count@aurore.test')
    const product = await createTestProduct(user.id, {
      name: 'Detail query count',
      brand: 'Aurore',
      inci: 'Aqua, Glycerin, Niacinamide, Alcohol Denat, Parfum, Limonene',
    })
    const ingredient = await createTestIngredient(user.id, { name: 'Niacinamide query count' })
    const canonicalKey = 'Niacinamide'
    await testDb.update(ingredients).set({ canonicalKey }).where(eq(ingredients.id, ingredient.id))
    await testDb.insert(productIngredients).values({
      productId: product.id,
      ingredientId: ingredient.id,
      concentrationValue: '10',
      concentrationUnit: '%',
    })
    const [tag] = await testDb
      .insert(productTagTypes)
      .values({
        slug: resolveAvoidSlugs(['peau-sensible'])[0] ?? 'detail-query-count-tag',
        label: 'Detail query count tag',
        tagType: 'concern',
      })
      .returning()
    if (!tag) throw new Error('Tag fixture missing')
    await testDb.insert(userProducts).values({
      userId: user.id,
      productId: product.id,
      status: 'wishlist',
    })
    await testDb.insert(userDermoProfiles).values({
      userId: user.id,
      skinTypes: ['peau-sensible'],
    })
    await testDb.insert(userIngredientPreferences).values({
      userId: user.id,
      canonicalKey,
      stance: 'exclude',
    })
    await testDb.insert(userTagPreferences).values({
      userId: user.id,
      tagId: tag.id,
      stance: 'require',
    })
    let queryCount = 0
    const measuredDb = drizzle(testDb.$client, {
      schema,
      logger: { logQuery: () => queryCount++ },
    })

    const page = await readProductDetailPage(measuredDb, {
      viewerId: user.id,
      slug: product.slug,
    })

    expect(page.product.id).toBe(product.id)
    expect(page.assessment).not.toBeNull()
    expect(queryCount).toBe(7)
  })
})

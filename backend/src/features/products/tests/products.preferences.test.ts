import { beforeEach, describe, expect, it } from 'bun:test'

import { resolveAvoidSlugs } from '@aurore/shared'

import { drizzle } from 'drizzle-orm/bun-sql'

import * as schema from '../../../db/schema'
import { userDermoProfiles } from '../../../db/schema/auth/users'
import { ingredients } from '../../../db/schema/ingredients/ingredients'
import { userIngredientPreferences } from '../../../db/schema/ingredients/user-ingredient-preferences'
import { productIngredients } from '../../../db/schema/products/product-ingredients'
import { userProducts } from '../../../db/schema/products/user-products'
import { productTagLinks, productTagTypes } from '../../../db/schema/tags/tags'
import { userTagPreferences } from '../../../db/schema/tags/user-tag-preferences'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestProduct, createTestUser } from '../../../tests/helpers/test-factories'
import { listProducts } from '../service'

// Service-level: testDb runs as superuser (BYPASSRLS), so fixtures write
// directly; listProducts receives userId explicitly like the route does.

setupDbTests()

let user: { id: string }

beforeEach(async () => {
  user = await createTestUser()
})

const PARFUM_KEY = 'Parfum'

async function linkIngredient(productId: string, canonicalKey: string, name: string, slug: string) {
  const [ing] = await testDb
    .insert(ingredients)
    .values({ createdBy: user.id, name, slug, type: 'skincare', canonicalKey })
    .returning({ id: ingredients.id })
  if (!ing) throw new Error('ingredient fixture failed')
  await testDb.insert(productIngredients).values({ productId, ingredientId: ing.id })
  return ing.id
}

async function makeTag(slug: string, label: string) {
  const [tag] = await testDb
    .insert(productTagTypes)
    .values({ slug, label, tagType: 'claim' })
    .returning({ id: productTagTypes.id })
  if (!tag) throw new Error('tag fixture failed')
  return tag.id
}

const baseFilters = { category: 'skincare', page: 1, limit: 20 } as const

describe('listProducts: declared rules', () => {
  it('without apply_preferences: declared rules change nothing', async () => {
    const scented = await createTestProduct(user.id, { name: 'Sérum parfumé', brand: 'Brand' })
    await linkIngredient(scented.id, PARFUM_KEY, 'Parfum (Fragrance)', 'fragrance')
    await testDb
      .insert(userIngredientPreferences)
      .values({ userId: user.id, canonicalKey: PARFUM_KEY, stance: 'exclude' })

    const result = await listProducts({ ...baseFilters }, testDb, user.id)

    expect(result.total).toBe(1)
    expect(result.hiddenCount).toBe(0)
    expect(result.excludedLabels).toEqual([])
  })

  it('"Sans" excludes the hit and counts it, clean rows stay', async () => {
    const scented = await createTestProduct(user.id, { name: 'Sérum parfumé', brand: 'Brand' })
    await linkIngredient(scented.id, PARFUM_KEY, 'Parfum (Fragrance)', 'fragrance')
    await createTestProduct(user.id, { name: 'Sérum propre', brand: 'Brand' })
    await testDb
      .insert(userIngredientPreferences)
      .values({ userId: user.id, canonicalKey: PARFUM_KEY, stance: 'exclude' })

    const result = await listProducts({ ...baseFilters, apply_preferences: true }, testDb, user.id)

    expect(result.total).toBe(1)
    expect(result.items[0]?.name).toBe('Sérum propre')
    expect(result.hiddenCount).toBe(1)
    expect(result.excludedLabels).toEqual([PARFUM_KEY])
  })

  it('include_excluded shows hits back, annotated, count intact', async () => {
    const scented = await createTestProduct(user.id, { name: 'Sérum parfumé', brand: 'Brand' })
    await linkIngredient(scented.id, PARFUM_KEY, 'Parfum (Fragrance)', 'fragrance')
    await testDb
      .insert(userIngredientPreferences)
      .values({ userId: user.id, canonicalKey: PARFUM_KEY, stance: 'exclude' })

    const result = await listProducts(
      { ...baseFilters, apply_preferences: true, include_excluded: true },
      testDb,
      user.id
    )

    expect(result.total).toBe(1)
    expect(result.hiddenCount).toBe(1)
    expect(result.items[0]?.excludeMatches).toEqual([PARFUM_KEY])
  })

  it('"Avec" keeps only rows containing the target, annotated', async () => {
    const nia = await createTestProduct(user.id, { name: 'Sérum niacinamide', brand: 'Brand' })
    await linkIngredient(nia.id, 'Niacinamide', 'Niacinamide', 'niacinamide-fixture')
    await createTestProduct(user.id, { name: 'Sérum neutre', brand: 'Brand' })
    await testDb
      .insert(userIngredientPreferences)
      .values({ userId: user.id, canonicalKey: 'Niacinamide', stance: 'require' })

    const result = await listProducts({ ...baseFilters, apply_preferences: true }, testDb, user.id)

    expect(result.total).toBe(1)
    expect(result.items[0]?.name).toBe('Sérum niacinamide')
    expect(result.items[0]?.requireMatches).toEqual(['Niacinamide'])
    expect(result.hiddenCount).toBe(1)
    expect(result.requiredLabels).toEqual(['Niacinamide'])
  })

  it('several "Avec" rules are an OR across ingredient and tag targets', async () => {
    const nia = await createTestProduct(user.id, { name: 'Sérum niacinamide', brand: 'Brand' })
    await linkIngredient(nia.id, 'Niacinamide', 'Niacinamide', 'niacinamide-fixture')
    const tagged = await createTestProduct(user.id, { name: 'Crème céramides', brand: 'Brand' })
    const tagId = await makeTag('ceramides-fixture', 'Céramides')
    await testDb
      .insert(productTagLinks)
      .values({ productId: tagged.id, productTagId: tagId, relevance: 'primary' })
    await createTestProduct(user.id, { name: 'Sérum neutre', brand: 'Brand' })
    await testDb
      .insert(userIngredientPreferences)
      .values({ userId: user.id, canonicalKey: 'Niacinamide', stance: 'require' })
    await testDb.insert(userTagPreferences).values({ userId: user.id, tagId, stance: 'require' })

    const result = await listProducts({ ...baseFilters, apply_preferences: true }, testDb, user.id)

    expect(result.total).toBe(2)
    expect(result.items.map((i) => i.name).sort()).toEqual(['Crème céramides', 'Sérum niacinamide'])
    expect(result.hiddenCount).toBe(1)
    expect(result.requiredLabels.sort()).toEqual(['Céramides', 'Niacinamide'])
  })

  it('"Sans" wins over "Avec" on the same row', async () => {
    const both = await createTestProduct(user.id, {
      name: 'Sérum niacinamide parfumé',
      brand: 'Brand',
    })
    await linkIngredient(both.id, 'Niacinamide', 'Niacinamide', 'niacinamide-fixture')
    await linkIngredient(both.id, PARFUM_KEY, 'Parfum (Fragrance)', 'fragrance')
    const clean = await createTestProduct(user.id, {
      name: 'Sérum niacinamide propre',
      brand: 'Brand',
    })
    await linkIngredient(clean.id, 'Niacinamide', 'Niacinamide bis', 'niacinamide-fixture-2')
    await testDb.insert(userIngredientPreferences).values([
      { userId: user.id, canonicalKey: 'Niacinamide', stance: 'require' },
      { userId: user.id, canonicalKey: PARFUM_KEY, stance: 'exclude' },
    ])

    const result = await listProducts({ ...baseFilters, apply_preferences: true }, testDb, user.id)

    expect(result.total).toBe(1)
    expect(result.items[0]?.name).toBe('Sérum niacinamide propre')
    expect(result.hiddenCount).toBe(1)
  })

  it('declared "Sans" on a tag excludes tagged rows, label in the banner', async () => {
    const tagged = await createTestProduct(user.id, { name: 'Crème aux huiles', brand: 'Brand' })
    const tagId = await makeTag('huiles-essentielles-fixture', 'Huiles essentielles')
    await testDb
      .insert(productTagLinks)
      .values({ productId: tagged.id, productTagId: tagId, relevance: 'primary' })
    await createTestProduct(user.id, { name: 'Crème sans', brand: 'Brand' })
    await testDb.insert(userTagPreferences).values({ userId: user.id, tagId, stance: 'exclude' })

    const result = await listProducts({ ...baseFilters, apply_preferences: true }, testDb, user.id)

    expect(result.total).toBe(1)
    expect(result.items[0]?.name).toBe('Crème sans')
    expect(result.hiddenCount).toBe(1)
    expect(result.excludedLabels).toEqual(['Huiles essentielles'])
  })

  it('anonymous caller with apply_preferences is a no-op', async () => {
    const scented = await createTestProduct(user.id, { name: 'Sérum parfumé', brand: 'Brand' })
    await linkIngredient(scented.id, PARFUM_KEY, 'Parfum (Fragrance)', 'fragrance')
    await testDb
      .insert(userIngredientPreferences)
      .values({ userId: user.id, canonicalKey: PARFUM_KEY, stance: 'exclude' })

    const result = await listProducts({ ...baseFilters, apply_preferences: true }, testDb, null)

    expect(result.total).toBe(1)
    expect(result.hiddenCount).toBe(0)
    expect(result.rulesApplied).toBe(false)
  })

  it('reports rulesApplied under an explicit true, not without the flag', async () => {
    await createTestProduct(user.id, { name: 'Sérum témoin', brand: 'Brand' })

    const withFlag = await listProducts(
      { ...baseFilters, apply_preferences: true },
      testDb,
      user.id
    )
    const withoutFlag = await listProducts({ ...baseFilters }, testDb, user.id)

    expect(withFlag.rulesApplied).toBe(true)
    expect(withoutFlag.rulesApplied).toBe(false)
  })

  it('composes a complete personalized page in nine database reads', async () => {
    const product = await createTestProduct(user.id, {
      name: 'Sérum query count',
      brand: 'Brand',
    })
    await linkIngredient(product.id, 'Niacinamide', 'Niacinamide', 'niacinamide-query-count')
    const primaryTagId = await makeTag('primary-query-count', 'Primary query count')
    const avoidSlug = resolveAvoidSlugs(['peau-sensible'])[0]
    if (!avoidSlug) throw new Error('Expected an avoid slug for sensitive skin')
    const avoidTagId = await makeTag(avoidSlug, 'Avoid query count')
    await testDb.insert(productTagLinks).values([
      { productId: product.id, productTagId: primaryTagId, relevance: 'primary' },
      { productId: product.id, productTagId: avoidTagId, relevance: 'avoid' },
    ])
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
      canonicalKey: 'Niacinamide',
      stance: 'exclude',
    })
    await testDb.insert(userTagPreferences).values({
      userId: user.id,
      tagId: primaryTagId,
      stance: 'require',
    })
    let queryCount = 0
    const measuredDb = drizzle(testDb.$client, {
      schema,
      logger: { logQuery: () => queryCount++ },
    })

    const result = await listProducts(
      {
        ...baseFilters,
        apply_preferences: true,
        include_excluded: true,
      },
      measuredDb,
      user.id
    )

    expect(result.items).toHaveLength(1)
    expect(result.items[0]?.userStatus).toBe('wishlist')
    expect(queryCount).toBe(9)
  })
})

describe('listProducts: apply_preferences=auto', () => {
  it('reads each viewer rule source once when a declared target enables auto', async () => {
    await createTestProduct(user.id, { name: 'Sérum témoin', brand: 'Brand' })
    const tagId = await makeTag('barrier-fixture', 'Barrière')
    await testDb
      .insert(userIngredientPreferences)
      .values({ userId: user.id, canonicalKey: PARFUM_KEY, stance: 'exclude' })
    await testDb.insert(userTagPreferences).values({ userId: user.id, tagId, stance: 'require' })
    const queries: string[] = []
    const measuredDb = drizzle(testDb.$client, {
      schema,
      logger: { logQuery: (query) => queries.push(query) },
    })

    const result = await listProducts(
      { ...baseFilters, apply_preferences: 'auto' },
      measuredDb,
      user.id
    )

    expect(result.rulesApplied).toBe(true)
    for (const table of [
      'user_dermo_profiles',
      'user_ingredient_preferences',
      'user_tag_preferences',
    ]) {
      expect(queries.filter((query) => query.includes(`"${table}"`))).toHaveLength(1)
    }
  })

  it('applies the declared rules when the viewer has a target, and says so', async () => {
    const scented = await createTestProduct(user.id, { name: 'Sérum parfumé', brand: 'Brand' })
    await linkIngredient(scented.id, PARFUM_KEY, 'Parfum (Fragrance)', 'fragrance')
    await createTestProduct(user.id, { name: 'Sérum propre', brand: 'Brand' })
    await testDb
      .insert(userIngredientPreferences)
      .values({ userId: user.id, canonicalKey: PARFUM_KEY, stance: 'exclude' })

    const result = await listProducts(
      { ...baseFilters, apply_preferences: 'auto' },
      testDb,
      user.id
    )

    expect(result.rulesApplied).toBe(true)
    expect(result.total).toBe(1)
    expect(result.items[0]?.name).toBe('Sérum propre')
    expect(result.hiddenCount).toBe(1)
  })

  it('a usable portrait alone resolves auto to applied', async () => {
    await createTestProduct(user.id, { name: 'Sérum témoin', brand: 'Brand' })
    await testDb
      .insert(userDermoProfiles)
      .values({ userId: user.id, skinTypes: null, skinConcerns: ['rosacee'] })

    const result = await listProducts(
      { ...baseFilters, apply_preferences: 'auto' },
      testDb,
      user.id
    )

    expect(result.rulesApplied).toBe(true)
    expect(result.total).toBe(1)
    expect(result.hiddenCount).toBe(0)
  })

  it('resolves to not applied when the viewer has nothing to apply', async () => {
    await createTestProduct(user.id, { name: 'Sérum témoin', brand: 'Brand' })

    const result = await listProducts(
      { ...baseFilters, apply_preferences: 'auto' },
      testDb,
      user.id
    )

    expect(result.rulesApplied).toBe(false)
    expect(result.total).toBe(1)
    expect(result.hiddenCount).toBe(0)
  })

  it('stays a no-op for an anonymous caller', async () => {
    await createTestProduct(user.id, { name: 'Sérum témoin', brand: 'Brand' })

    const result = await listProducts({ ...baseFilters, apply_preferences: 'auto' }, testDb, null)

    expect(result.rulesApplied).toBe(false)
    expect(result.total).toBe(1)
  })
})

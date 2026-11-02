import { describe, expect, it } from 'bun:test'

import { productTagLinks } from '../../../db/schema/tags/tags'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestProduct, createTestUser } from '../../../tests/helpers/test-factories'
import { createComparison, getEnrichedComparison } from '../../product-comparisons/service'
import { createProductTag } from '../../product-tags/service'
import { createUserProduct, getUserProducts } from '../../user-products/service'
import {
  getFilterOptions,
  getProductFullBySlug,
  listProducts,
  listVisibleProductTags,
} from '../service'

setupDbTests()

describe('calculated sensitive skin signal', () => {
  it.each([
    ['algo-derm', 'Peau sensible · signal calculé'],
    ['manual', 'Peau sensible · ajout manuel'],
  ] as const)('preserves %s provenance across product surfaces', async (source, expectedLabel) => {
    const user = await createTestUser()
    const product = await createTestProduct(user.id, {
      name: 'Gentle formula',
      brand: 'Example',
      inci: 'Aqua, Glycerin',
    })
    const other = await createTestProduct(user.id, { name: 'Other formula', brand: 'Example' })
    const tag = await testDb.transaction((tx) =>
      createProductTag(tx, {
        slug: 'peau-sensible',
        label: 'Peau sensible',
        tagType: 'skin_type',
      })
    )
    await testDb
      .insert(productTagLinks)
      .values({
        productId: product.id,
        productTagId: tag.id,
        source,
        relevance: 'primary',
      })
      .onConflictDoUpdate({
        target: [productTagLinks.productId, productTagLinks.productTagId],
        set: { source, relevance: 'primary' },
      })
    const page = await listProducts(
      { category: 'skincare', page: 1, limit: 20, skin_type: 'peau-sensible' },
      testDb
    )
    expect(page.items.map((p) => p.id)).toEqual([product.id])
    expect(page.items[0]?.tags.map((tag) => tag.slug)).toContain('peau-sensible')
    expect((await getFilterOptions(testDb)).tagCounts['peau-sensible']).toBe(1)
    expect(
      (await listVisibleProductTags(testDb, product.id)).find((t) => t.tagSlug === 'peau-sensible')
        ?.tagName
    ).toBe(expectedLabel)
    const detail = await getProductFullBySlug(product.slug, testDb)
    expect(detail).not.toHaveProperty('sensitiveSkinClaim')
    expect(detail.tags.find((tag) => tag.tagSlug === 'peau-sensible')).toMatchObject({
      source,
      tagName: expectedLabel,
    })
    expect(page.items[0]?.tags.find((tag) => tag.slug === 'peau-sensible')?.source).toBe(source)
    const comparison = await testDb.transaction((tx) =>
      createComparison(user.id, { productIds: [product.id, other.id] }, tx)
    )
    const result = await testDb.transaction((tx) =>
      getEnrichedComparison(user.id, comparison.id, tx)
    )
    expect(
      result.products.flatMap((p) => p.tags).find((tag) => tag.slug === 'peau-sensible')?.source
    ).toBe(source)
    await testDb.transaction((tx) =>
      createUserProduct(user.id, { productId: product.id, status: 'in_stock' }, tx)
    )
    const collection = await testDb.transaction((tx) => getUserProducts(user.id, tx))
    expect(
      collection.flatMap((p) => p.product?.productTagLinks.map((t) => t.productTag.label) ?? [])
    ).toContain(expectedLabel)
  })
})

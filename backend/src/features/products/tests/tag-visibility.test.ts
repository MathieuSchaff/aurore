import { beforeEach, describe, expect, it } from 'bun:test'

import { productTagLinks } from '../../../db/schema/tags/tags'
import { isDisplayedProductTagLink } from '../../../lib/product-tag-visibility'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestProduct,
  createTestUser,
  type TestUser,
} from '../../../tests/helpers/test-factories'
import { createComparison, getEnrichedComparison } from '../../product-comparisons/service'
import { createProductTag } from '../../product-tags/service'
import { createUserProduct, getUserProducts } from '../../user-products/service'
import { getFilterOptions, listProducts, listVisibleProductTags } from '../service'

setupDbTests()

describe.each(['Parfum', 'Flavor/Aroma', 'Disclosed Fragrance', 'SODIUM HYDROXIDE PARFUM'])(
  'stored fragrance-allergen inferences: %s',
  (marker) => {
    let user: TestUser
    let productId: string
    beforeEach(async () => {
      user = await createTestUser()
      const product = await createTestProduct(user.id, {
        name: 'Perfumed fixture',
        brand: 'Example',
        inci: `Aqua, Glycerin, ${marker}`,
      })
      productId = product.id
      const tag = await testDb.transaction((tx) =>
        createProductTag(tx, {
          slug: 'sans-allergenes-parfumants',
          label: 'Sans allergènes parfumants',
          tagType: 'product_characteristic',
        })
      )
      await testDb
        .insert(productTagLinks)
        .values({ productId, productTagId: tag.id, source: 'algo-derm', relevance: 'primary' })
        .onConflictDoUpdate({
          target: [productTagLinks.productId, productTagLinks.productTagId],
          set: { relevance: 'primary', source: 'algo-derm' },
        })
    })

    it('omits a stale inference from cards, filter counts and filter matches', async () => {
      const page = await listProducts({ category: 'skincare', page: 1, limit: 20 }, testDb)
      expect(page.items.find((p) => p.id === productId)?.tags.map((t) => t.slug)).not.toContain(
        'sans-allergenes-parfumants'
      )
      expect(
        (await getFilterOptions(testDb)).tagCounts['sans-allergenes-parfumants']
      ).toBeUndefined()
      const filtered = await listProducts(
        {
          category: 'skincare',
          page: 1,
          limit: 20,
          product_characteristic: 'sans-allergenes-parfumants',
        },
        testDb
      )
      expect(filtered.items).toHaveLength(0)
      expect((await listVisibleProductTags(testDb, productId)).map((t) => t.tagSlug)).not.toContain(
        'sans-allergenes-parfumants'
      )
    })

    it('omits the stale inference from the comparator and collection without deleting it', async () => {
      const other = await createTestProduct(user.id, { name: 'Other fixture', brand: 'Example' })
      const comparison = await testDb.transaction((tx) =>
        createComparison(user.id, { productIds: [productId, other.id] }, tx)
      )
      const result = await testDb.transaction((tx) =>
        getEnrichedComparison(user.id, comparison.id, tx)
      )
      expect(result.products.flatMap((p) => p.tags.map((t) => t.slug))).not.toContain(
        'sans-allergenes-parfumants'
      )
      await testDb.transaction((tx) =>
        createUserProduct(user.id, { productId, status: 'in_stock' }, tx)
      )
      const collection = await testDb.transaction((tx) => getUserProducts(user.id, tx))
      expect(
        collection.flatMap((p) => p.product?.productTagLinks.map((t) => t.productTag.slug) ?? [])
      ).not.toContain('sans-allergenes-parfumants')
      expect(
        (await testDb.select().from(productTagLinks)).some(
          (t) => t.productId === productId && t.source === 'algo-derm'
        )
      ).toBe(true)
    })

    it('preserves explicit manual claims across read paths', async () => {
      await testDb.update(productTagLinks).set({ source: 'manual' })
      expect((await listVisibleProductTags(testDb, productId)).map((tag) => tag.tagSlug)).toContain(
        'sans-allergenes-parfumants'
      )
      expect((await getFilterOptions(testDb)).tagCounts['sans-allergenes-parfumants']).toBe(1)
      const page = await listProducts(
        {
          category: 'skincare',
          page: 1,
          limit: 20,
          product_characteristic: 'sans-allergenes-parfumants',
        },
        testDb
      )
      expect(page.items.map((product) => product.id)).toContain(productId)
    })

    it('preserves avoid signals and explicit manual claims', () => {
      expect(
        isDisplayedProductTagLink('grossesse-compatible', 'avoid', 'algo-derm', 'Aqua, Retinol')
      ).toBe(true)
      expect(
        isDisplayedProductTagLink('peau-sensible', 'avoid', 'cross-signal', 'Aqua, Retinol')
      ).toBe(true)
      expect(
        isDisplayedProductTagLink('sans-allergenes-parfumants', 'primary', 'manual', 'Aqua, Parfum')
      ).toBe(true)
    })
  }
)

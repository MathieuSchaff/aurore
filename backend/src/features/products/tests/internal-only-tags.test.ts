import { beforeEach, describe, expect, it } from 'bun:test'

import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestProduct,
  createTestUser,
  type TestUser,
} from '../../../tests/helpers/test-factories'
import { createComparison, getEnrichedComparison } from '../../product-comparisons/service'
import { createProductTag, replaceProductTags } from '../../product-tags/service'
import { createUserProduct, getUserProducts } from '../../user-products/service'
import { getFilterOptions, getProductFullBySlug, listProducts } from '../service'

// docs/adr/0017: hypoallergenique / non-irritant / non-comedogene are manufacturer claims
// Aurore has no source to carry. They stay detected, stored and audited; every read that
// feeds a screen drops them. One test per surface, because the filter is applied per call
// site and nothing in the type system ties them together.
setupDbTests()

const CLAIM_SLUG = 'hypoallergenique'
const SHOWN_SLUG = 'comedogene'

describe('internal-only product tags', () => {
  let user: TestUser
  let productId: string
  let productSlug: string

  const createTag = (input: Parameters<typeof createProductTag>[1]) =>
    testDb.transaction((tx) => createProductTag(tx, input))

  beforeEach(async () => {
    user = await createTestUser()
    const product = await createTestProduct(user.id, { name: 'Crème test', brand: 'Generic' })
    productId = product.id
    productSlug = product.slug

    const claim = await createTag({
      label: 'Hypoallergénique',
      tagType: 'product_characteristic',
      slug: CLAIM_SLUG,
    })
    const shown = await createTag({
      label: 'Comédogène',
      tagType: 'product_characteristic',
      slug: SHOWN_SLUG,
    })
    // `primary`: the list card renders that relevance only, so a secondary link would
    // make the list assertion pass for the wrong reason.
    await testDb.transaction((tx) =>
      replaceProductTags(tx, productId, [
        { tagId: claim.id, relevance: 'primary' },
        { tagId: shown.id, relevance: 'primary' },
      ])
    )
  })

  it('drops the claim from the product list', async () => {
    const page = await listProducts({ category: 'skincare', page: 1, limit: 20 }, testDb)
    const item = page.items.find((p) => p.id === productId)
    const slugs = item?.tags?.map((t) => t.slug) ?? []

    expect(slugs).toContain(SHOWN_SLUG)
    expect(slugs).not.toContain(CLAIM_SLUG)
  })

  it('drops the claim from the catalogue filter counts', async () => {
    const options = await getFilterOptions(testDb)

    expect(options.tagCounts[SHOWN_SLUG]).toBe(1)
    expect(options.tagCounts[CLAIM_SLUG]).toBeUndefined()
  })

  it('drops the claim from the comparator', async () => {
    const other = await createTestProduct(user.id, { name: 'Crème témoin', brand: 'Generic' })
    const cmp = await testDb.transaction((tx) =>
      createComparison(user.id, { productIds: [productId, other.id] }, tx)
    )
    const enriched = await testDb.transaction((tx) => getEnrichedComparison(user.id, cmp.id, tx))
    const slugs = enriched.products.flatMap((p) => p.tags.map((t) => t.slug))

    expect(slugs).toContain(SHOWN_SLUG)
    expect(slugs).not.toContain(CLAIM_SLUG)
  })

  it('drops the claim from the collection payload', async () => {
    await testDb.transaction((tx) =>
      createUserProduct(user.id, { productId, status: 'in_stock' }, tx)
    )
    const rows = await testDb.transaction((tx) => getUserProducts(user.id, tx))
    const slugs = rows.flatMap((r) => r.product.productTagLinks.map((l) => l.productTag.slug))

    expect(slugs).toContain(SHOWN_SLUG)
    expect(slugs).not.toContain(CLAIM_SLUG)
  })

  // The one read that keeps them: ProductEditPage seeds its tag form from this payload and
  // posts it back, so filtering here would erase the links on every admin save.
  it('keeps the claim in the edit payload', async () => {
    const full = await getProductFullBySlug(productSlug, testDb)
    const slugs = full.tags.map((t) => t.tagSlug)

    expect(slugs).toContain(CLAIM_SLUG)
    expect(slugs).toContain(SHOWN_SLUG)
  })
})

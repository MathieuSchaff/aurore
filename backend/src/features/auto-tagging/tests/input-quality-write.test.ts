import { beforeEach, describe, expect, test } from 'bun:test'

import { and, eq } from 'drizzle-orm'

import { withAdminRls } from '../../../db/rls'
import { productTagLinks, productTagTypes } from '../../../db/schema'
import { productTagData } from '../../../db/seed/data/tags'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { updateProduct } from '../../products/write.service'
import { writeTagsForProduct } from '../write'
import { createAutoTagProduct, getTagDefBySlug, getTagLinks } from './db-helpers'

setupDbTests()

describe('INCI quality through catalogue writes', () => {
  beforeEach(async () => {
    await testDb.insert(productTagTypes).values(productTagData)
  })

  test('retains a missing tail and an explicit claim at creation', async () => {
    const user = await createTestUser()
    const product = await createAutoTagProduct(user.id, {
      name: 'Cleanser sans parfum',
      kind: 'cleanser',
      inci: 'Aqua, Glycerin, ...',
    })
    expect(product.inci).toBe('Aqua, Glycerin, ...')
    const soap = await getTagDefBySlug('sans-savon')
    const fragrance = await getTagDefBySlug('sans-parfum')
    expect(await getTagLinks(product.id, soap.id)).toEqual([])
    expect(await getTagLinks(product.id, fragrance.id)).toEqual([
      expect.objectContaining({ source: 'formula', relevance: 'secondary' }),
    ])
  })

  test('removes stale inferred absences and restores them after repair without changing manuals', async () => {
    const user = await createTestUser()
    const product = await createAutoTagProduct(user.id, {
      name: 'Cleanser sans parfum',
      kind: 'cleanser',
      inci: 'Aqua, Glycerin',
    })
    const soap = await getTagDefBySlug('sans-savon')
    const fragrance = await getTagDefBySlug('sans-parfum')
    const silicone = await getTagDefBySlug('sans-silicones')
    expect(await getTagLinks(product.id, soap.id)).toHaveLength(1)
    await testDb
      .update(productTagLinks)
      .set({ source: 'manual', relevance: 'avoid' })
      .where(
        and(
          eq(productTagLinks.productId, product.id),
          eq(productTagLinks.productTagId, silicone.id)
        )
      )
    const manual = await getTagLinks(product.id, silicone.id)
    expect(manual).toEqual([expect.objectContaining({ source: 'manual', relevance: 'avoid' })])

    const damaged = await withAdminRls((tx) =>
      updateProduct(user.id, product.id, { inci: 'Aqua, Glycerin, ...' }, tx)
    )
    expect(damaged.inci).toBe('Aqua, Glycerin, ...')
    await withAdminRls((tx) => writeTagsForProduct(product.id, tx))
    expect(await getTagLinks(product.id, soap.id)).toEqual([])
    expect(await getTagLinks(product.id, fragrance.id)).toEqual([
      expect.objectContaining({ source: 'formula', relevance: 'secondary' }),
    ])
    expect(await getTagLinks(product.id, silicone.id)).toEqual(manual)

    await withAdminRls((tx) => updateProduct(user.id, product.id, { inci: 'Aqua, Glycerin' }, tx))
    expect(await getTagLinks(product.id, soap.id)).toEqual([
      expect.objectContaining({ source: 'formula', relevance: 'secondary' }),
    ])
    expect(await getTagLinks(product.id, silicone.id)).toEqual(manual)
  })
})

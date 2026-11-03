import { expect, it } from 'bun:test'

import { eq } from 'drizzle-orm'

import { productTagLinks, productTagTypes } from '../../../db/schema/tags/tags'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestProduct, createTestUser } from '../../../tests/helpers/test-factories'
import {
  createProductTag,
  getProductTagById,
  getProductTagBySlug,
  listProductTags,
  listTagsByProduct,
} from '../../product-tags/service'
import { listPreferenceTargets, upsertTagPreference } from '../../profile/service'
import { listVisibleProductTags } from '../service'
import { loadViewerRules } from '../viewer-rules.service'

setupDbTests()

it('presents the qualified comedogenic label without rewriting stored tags or manual links', async () => {
  const user = await createTestUser()
  const product = await createTestProduct(user.id, { name: 'Label fixture', inci: 'Aqua' })
  const tag = await testDb.transaction((tx) =>
    createProductTag(tx, {
      slug: 'comedogene',
      label: 'Comédogène',
      tagType: 'product_characteristic',
    })
  )
  await testDb.insert(productTagLinks).values({
    productId: product.id,
    productTagId: tag.id,
    relevance: 'secondary',
    source: 'manual',
  })
  const expected = 'Signal comédogène potentiel'
  expect((await getProductTagById(testDb, tag.id))?.label).toBe(expected)
  expect((await getProductTagBySlug(testDb, 'comedogene'))?.label).toBe(expected)
  expect((await listProductTags(testDb)).find((row) => row.id === tag.id)?.label).toBe(expected)
  for (const read of [listTagsByProduct, listVisibleProductTags]) {
    const links = await read(testDb, product.id)
    expect(links.find((row) => row.tagSlug === 'comedogene')?.tagName).toBe(expected)
  }
  const preference = await upsertTagPreference(testDb, user.id, {
    tagId: tag.id,
    stance: 'exclude',
  })
  expect(preference.label).toBe(expected)
  const targets = await listPreferenceTargets(testDb, user.id)
  expect(targets.tags.find((row) => row.tagId === tag.id)?.label).toBe(expected)
  const rules = await loadViewerRules(testDb, user.id)
  expect(rules.declaredPreferences?.tagLabelById.get(tag.id)).toBe(expected)
  const [storedTag] = await testDb
    .select()
    .from(productTagTypes)
    .where(eq(productTagTypes.id, tag.id))
  expect(storedTag.label).toBe('Comédogène')
  const [storedLink] = await testDb
    .select()
    .from(productTagLinks)
    .where(eq(productTagLinks.productId, product.id))
  expect(storedLink.source).toBe('manual')
  expect(storedLink.relevance).toBe('secondary')
})

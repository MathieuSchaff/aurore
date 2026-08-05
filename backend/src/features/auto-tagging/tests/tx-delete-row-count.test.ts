// Inside a transaction this driver carries no affected-row count (only the pooled
// `db.delete()` does), so a runner that reports what it removed must use RETURNING. Both halves
// are asserted: the truthful path, and the trap that produced the bug.

import { beforeEach, describe, expect, it } from 'bun:test'

import { and, eq, ne } from 'drizzle-orm'

import { withAdminRls } from '../../../db/rls'
import { productTagLinks, productTagTypes } from '../../../db/schema'
import { productTagData } from '../../../db/seed/data/tags'
import { testDb } from '../../../tests/db.test.config'
import { cleanDatabase } from '../../../tests/helpers/db-cleaner'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { createAutoTagProduct } from './db-helpers'

const RICH_INCI =
  'Aqua, Niacinamide, Retinol, Glycerin, Tocopherol, Phenoxyethanol, Hyaluronic Acid'

const autoLinks = (productId: string) =>
  testDb
    .select()
    .from(productTagLinks)
    .where(and(eq(productTagLinks.productId, productId), ne(productTagLinks.source, 'manual')))

describe('tx.delete row count in auto-tag runners', () => {
  beforeEach(async () => {
    await cleanDatabase()
    await testDb.insert(productTagTypes).values(productTagData)
  })

  it('RETURNING reports every row an effective DELETE removed', async () => {
    const user = await createTestUser()
    const product = await createAutoTagProduct(user.id, {
      name: 'Returning Serum',
      inci: RICH_INCI,
    })

    const before = await autoLinks(product.id)
    expect(before.length).toBeGreaterThan(0)

    const deleted = await withAdminRls((tx) =>
      tx
        .delete(productTagLinks)
        .where(and(eq(productTagLinks.productId, product.id), ne(productTagLinks.source, 'manual')))
        .returning({ productId: productTagLinks.productId })
    )

    expect(deleted.length).toBe(before.length)
    expect(await autoLinks(product.id)).toHaveLength(0)
  })

  it('a tx DELETE without RETURNING carries no count, even though it deleted', async () => {
    const user = await createTestUser()
    const product = await createAutoTagProduct(user.id, {
      name: 'Countless Serum',
      inci: RICH_INCI,
    })

    const before = await autoLinks(product.id)
    expect(before.length).toBeGreaterThan(0)

    const result = await withAdminRls((tx) =>
      tx
        .delete(productTagLinks)
        .where(and(eq(productTagLinks.productId, product.id), ne(productTagLinks.source, 'manual')))
    )

    // Goes red if the driver ever starts exposing the count here: the runners
    // could then drop RETURNING, but only on purpose.
    const counted = result as unknown as { count?: number; rowCount?: number }
    expect(counted.count ?? counted.rowCount).toBeUndefined()
    expect(await autoLinks(product.id)).toHaveLength(0)
  })
})

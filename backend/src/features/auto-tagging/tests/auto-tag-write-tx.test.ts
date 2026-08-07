// writeTagsForProduct fans out three intake reads (brand certs, percent claims,
// tag defs). On a pooled connection each takes its own socket, but on a single
// tx connection they must NOT run concurrently: Bun's SQL pipelines them and
// misroutes the result sets, so tag-defs comes back empty and the writer's
// unconditional DELETE wipes existing rows. Runners pass a tx, so this must stay correct.

import { beforeEach, describe, expect, it } from 'bun:test'

import { and, eq, ne } from 'drizzle-orm'

import { withAdminRls } from '../../../db/rls'
import { productTagLinks, productTagTypes } from '../../../db/schema'
import { productTagData } from '../../../db/seed/data/tags'
import { testDb } from '../../../tests/db.test.config'
import { cleanDatabase } from '../../../tests/helpers/db-cleaner'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { writeTagsForProduct } from '../write'
import { createAutoTagProduct } from './db-helpers'

const RICH_INCI =
  'Aqua, Niacinamide, Retinol, Glycerin, Tocopherol, Phenoxyethanol, Hyaluronic Acid'

describe('writeTagsForProduct: transaction safety', () => {
  beforeEach(async () => {
    await cleanDatabase()
    await testDb.insert(productTagTypes).values(productTagData)
  })

  it('writes auto rows when given a transaction, not only a pooled connection', async () => {
    const user = await createTestUser()
    const product = await createAutoTagProduct(user.id, { name: 'Test Serum', inci: RICH_INCI })

    const autoCount = async () =>
      (
        await testDb
          .select()
          .from(productTagLinks)
          .where(
            and(eq(productTagLinks.productId, product.id), ne(productTagLinks.source, 'manual'))
          )
      ).length

    // Intake tagged the product via the pooled connection.
    const before = await autoCount()
    expect(before).toBeGreaterThan(0)

    // Run the writer again through the exact reconcile path: withAdminRls opens a
    // tx and runs a `SET LOCAL` before the writer's fan-out, the combination
    // that desyncs the pipeline.
    const { inserted } = await withAdminRls((tx) => writeTagsForProduct(product.id, tx))

    expect(inserted).toBeGreaterThan(0)
    expect(await autoCount()).toBe(before)
  })
})

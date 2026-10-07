import { describe, expect, it } from 'bun:test'

import { eq } from 'drizzle-orm'

import { products } from '../../db/schema'
import {
  createComparison,
  getEnrichedComparison,
  listComparisons,
} from '../../features/product-comparisons/service'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb, withRlsAs } from '../helpers/app-runtime-db'
import { createTestProduct, createTestUser } from '../helpers/test-factories'

const runtimeDb = await createAppRuntimeDb()

setupDbTests()

describe('comparison visibility', () => {
  it('keeps the summary count aligned with visible detail after hiding and restoring products', async () => {
    const user = await createTestUser('comparison-visibility@test.local')
    const first = await createTestProduct(user.id, { name: 'First comparable product' })
    const second = await createTestProduct(user.id, { name: 'Second comparable product' })
    const comparison = await withRlsAs(runtimeDb, 'user', user.id, (tx) =>
      createComparison(user.id, { productIds: [first.id, second.id] }, tx)
    )

    async function expectVisibleProducts(expectedIds: string[]) {
      await withRlsAs(runtimeDb, 'user', user.id, async (tx) => {
        const summaries = await listComparisons(user.id, tx)
        const detail = await getEnrichedComparison(user.id, comparison.id, tx)
        expect(summaries).toHaveLength(1)
        expect(detail.products.map((product) => product.id)).toEqual(expectedIds)
        expect(summaries[0]?.productCount).toBe(expectedIds.length)
      })
    }

    await expectVisibleProducts([first.id, second.id])
    await testDb
      .update(products)
      .set({ moderationStatus: 'hidden' })
      .where(eq(products.id, first.id))
    await expectVisibleProducts([second.id])
    await testDb
      .update(products)
      .set({ moderationStatus: 'hidden' })
      .where(eq(products.id, second.id))
    await expectVisibleProducts([])
    await testDb
      .update(products)
      .set({ moderationStatus: 'visible' })
      .where(eq(products.id, first.id))
    await expectVisibleProducts([first.id])
  })
})

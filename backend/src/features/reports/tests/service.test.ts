import { beforeEach, describe, expect, it } from 'bun:test'

import { eq, sql } from 'drizzle-orm'

import { products } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { createReport } from '../service'

setupDbTests()

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

let reporterId: string
let productId: string

beforeEach(async () => {
  const reporter = await createTestUser('reporter-lock@test.local', 'Azerty123!')
  reporterId = reporter.id
  const [product] = await testDb
    .insert(products)
    .values({
      createdBy: reporterId,
      name: 'Reported product',
      brand: 'Test brand',
      category: 'skincare',
      kind: 'serum',
      unit: 'pump',
      slug: 'reported-product',
    })
    .returning({ id: products.id })
  if (!product) throw new Error('product seed failed')
  productId = product.id
})

describe('reports service', () => {
  it('holds the target while creating its polymorphic reference', async () => {
    const created = deferred()
    const release = deferred()
    const writer = testDb.transaction(async (tx) => {
      await createReport(tx, {
        reporterId,
        body: { targetType: 'product', targetId: productId, reason: 'Incorrect content' },
      })
      created.resolve()
      await release.promise
    })
    await created.promise

    try {
      await expect(
        testDb.transaction(async (tx) => {
          await tx.execute(sql`SET LOCAL lock_timeout = '100ms'`)
          await tx.delete(products).where(eq(products.id, productId))
        })
      ).rejects.toThrow()
    } finally {
      release.resolve()
      await writer
    }
  })
})

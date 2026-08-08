import { afterEach, describe, expect, it } from 'bun:test'

import { and, eq, ne, sql } from 'drizzle-orm'

import { products, productTagLinks, productTagTypes } from '../../../db/schema'
import { productTagData } from '../../../db/seed/data/tags'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { captureError } from '../../../tests/helpers/capture-error'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { loadAutoTagFetchBundle } from '../lib/fetch-auto-tag-bundle'
import { writeReconciledProducts } from '../runners/backfill/reconcile-write'
import { createAutoTagProduct } from './db-helpers'

setupDbTests()

async function countAutoLinks(productId: string): Promise<number> {
  const rows = await testDb
    .select({ productId: productTagLinks.productId })
    .from(productTagLinks)
    .where(and(eq(productTagLinks.productId, productId), ne(productTagLinks.source, 'manual')))
  return rows.length
}

async function dropFailureTrigger(): Promise<void> {
  await testDb.execute(
    sql.raw('DROP TRIGGER IF EXISTS test_reconcile_failure ON product_tag_links')
  )
  await testDb.execute(sql.raw('DROP FUNCTION IF EXISTS test_reconcile_failure()'))
}

describe('reconcile write transaction boundary', () => {
  afterEach(dropFailureTrigger)

  it('keeps completed products committed when a later product fails', async () => {
    await testDb.insert(productTagTypes).values(productTagData)
    const user = await createTestUser()
    const first = await createAutoTagProduct(user.id, {
      name: 'First boundary serum',
      inci: 'Aqua, Niacinamide, Retinol, Glycerin',
    })
    const second = await createAutoTagProduct(user.id, {
      name: 'Second boundary serum',
      inci: 'Aqua, Niacinamide, Retinol, Glycerin',
    })
    expect(await countAutoLinks(first.id)).toBeGreaterThan(0)
    expect(await countAutoLinks(second.id)).toBeGreaterThan(0)

    const bundle = await loadAutoTagFetchBundle([first.id, second.id], testDb)
    await testDb
      .update(products)
      .set({ category: 'haircare', kind: 'shampoo', unit: 'bottle' })
      .where(eq(products.id, first.id))

    await testDb.execute(
      sql.raw(`
        CREATE FUNCTION test_reconcile_failure() RETURNS trigger AS $$
        BEGIN
          IF OLD.product_id = '${second.id}'::uuid THEN
            RAISE EXCEPTION 'test second product failure';
          END IF;
          RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;
        CREATE TRIGGER test_reconcile_failure
          BEFORE DELETE ON product_tag_links
          FOR EACH ROW EXECUTE FUNCTION test_reconcile_failure();
      `)
    )

    const error = await captureError(() => writeReconciledProducts([first.id, second.id], bundle))
    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).toContain('Failed query: delete')

    // A corpus-wide transaction rolls this deletion back with the second product.
    expect(await countAutoLinks(first.id)).toBe(0)
    expect(await countAutoLinks(second.id)).toBeGreaterThan(0)
  })
})

import { describe, expect, it } from 'bun:test'

import { eq } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../db/index'
import { ingredients } from '../../db/schema/ingredients/ingredients'
import { products } from '../../db/schema/products/products'
import { IngredientError } from '../../features/ingredients/ingredients-error'
import { createIngredient, updateIngredient } from '../../features/ingredients/service'
import { ProductError } from '../../features/products/product-error'
import { createProduct, updateProduct } from '../../features/products/service'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb, withRlsAs } from '../helpers/app-runtime-db'
import { captureError } from '../helpers/capture-error'
import { createTestUser } from '../helpers/test-factories'

const appRuntimeDb = await createAppRuntimeDb()

setupDbTests()

// The app_runtime pool is subject to RLS, so a 0-row UPDATE only happens when the
// policy actually denies the write. That is the real path the disambiguation guards.
function withRls<T>(role: string, userId: string, fn: (tx: DatabaseTransaction) => Promise<T>) {
  return withRlsAs(appRuntimeDb, role, userId, fn)
}

const baseProductInput = {
  name: 'Update Serum',
  brand: 'UpdateBrand',
  category: 'skincare',
  kind: 'serum',
  unit: 'dropper',
} as const

const baseIngredientInput = { name: 'Update Acid', type: 'skincare' } as const

describe('catalog update: updateIngredient 0-row disambiguation', () => {
  it('★ creator editing an ingredient that became verified gets 403, not a 500', async () => {
    const user = await createTestUser('ing-upd-verified@test.local')
    const created = await testDb.transaction((tx) =>
      createIngredient(tx, user.id, 'user', baseIngredientInput)
    )
    await testDb
      .update(ingredients)
      .set({ catalogQuality: 'verified' })
      .where(eq(ingredients.id, created.id))

    const err = await captureError(() =>
      withRls('user', user.id, (tx) =>
        updateIngredient(tx, user.id, created.id, { name: 'Renamed Acid' })
      )
    )

    expect(err).toBeInstanceOf(IngredientError)
    expect((err as IngredientError).code).toBe('unauthorized_access')
  })

  it('keeps the optimistic-lock 409 ahead of the 403 when expectedUpdatedAt is set', async () => {
    const user = await createTestUser('ing-upd-occ@test.local')
    const created = await testDb.transaction((tx) =>
      createIngredient(tx, user.id, 'user', baseIngredientInput)
    )
    await testDb
      .update(ingredients)
      .set({ catalogQuality: 'verified' })
      .where(eq(ingredients.id, created.id))

    const err = await captureError(() =>
      withRls('user', user.id, (tx) =>
        updateIngredient(
          tx,
          user.id,
          created.id,
          { name: 'Renamed Acid' },
          undefined,
          created.updatedAt
        )
      )
    )

    expect(err).toBeInstanceOf(IngredientError)
    expect((err as IngredientError).code).toBe('ingredient_update_conflict')
  })

  it('returns 403 when editing another user’s visible ingredient', async () => {
    const owner = await createTestUser('ing-upd-owner@test.local')
    const other = await createTestUser('ing-upd-other@test.local')
    const created = await testDb.transaction((tx) =>
      createIngredient(tx, owner.id, 'user', baseIngredientInput)
    )

    const err = await captureError(() =>
      withRls('user', other.id, (tx) =>
        updateIngredient(tx, other.id, created.id, { name: 'Hijacked Acid' })
      )
    )

    expect(err).toBeInstanceOf(IngredientError)
    expect((err as IngredientError).code).toBe('unauthorized_access')
  })
})

describe('catalog update: updateProduct dedup on rename', () => {
  it('translates a unique-key collision on rename into 409, never a raw 500', async () => {
    const user = await createTestUser('upd-dedup@test.local')
    await testDb.transaction((tx) =>
      createProduct(
        user.id,
        'admin',
        {
          name: 'Existing Serum',
          brand: 'DedupBrand',
          category: 'skincare',
          kind: 'serum',
          unit: 'dropper',
        },
        tx,
        { autoTag: false }
      )
    )
    const movable = await testDb.transaction((tx) =>
      createProduct(user.id, 'admin', baseProductInput, tx, { autoTag: false })
    )

    const err = await captureError(() =>
      testDb.transaction((tx) =>
        updateProduct(
          user.id,
          movable.id,
          { name: 'Existing Serum', brand: 'DedupBrand' },
          undefined,
          tx
        )
      )
    )

    expect(err).toBeInstanceOf(ProductError)
    expect((err as ProductError).code).toBe('product_already_exists')
  })
})

describe('catalog update: updateProduct field-strip', () => {
  it('ignores attempts to flip quality / moderation / verify stamps', async () => {
    const user = await createTestUser('upd-strip@test.local')
    const product = await testDb.transaction((tx) =>
      createProduct(user.id, 'user', baseProductInput, tx, { autoTag: false })
    )

    // testDb bypasses RLS, so only the service field-strip can stop the flip.
    const updated = await testDb.transaction((tx) =>
      updateProduct(
        user.id,
        product.id,
        {
          name: 'Stripped Serum',
          catalogQuality: 'verified',
          moderationStatus: 'hidden',
          verifiedBy: user.id,
          verifiedAt: new Date().toISOString(),
        } as never,
        undefined,
        tx
      )
    )

    expect(updated.name).toBe('Stripped Serum')
    expect(updated.catalogQuality).toBe('unverified')
    expect(updated.moderationStatus).toBe('visible')
    expect(updated.verifiedBy).toBeNull()
    expect(updated.verifiedAt).toBeNull()
  })
})

describe('catalog update: updateProduct 0-row disambiguation', () => {
  it('★ creator editing a row that became verified gets 403, not a silent 404', async () => {
    const user = await createTestUser('upd-verified@test.local')
    const product = await testDb.transaction((tx) =>
      createProduct(user.id, 'user', baseProductInput, tx, { autoTag: false })
    )
    await testDb
      .update(products)
      .set({ catalogQuality: 'verified' })
      .where(eq(products.id, product.id))

    const err = await captureError(() =>
      withRls('user', user.id, (tx) =>
        updateProduct(user.id, product.id, { name: 'Renamed Serum' }, undefined, tx)
      )
    )

    expect(err).toBeInstanceOf(ProductError)
    expect((err as ProductError).code).toBe('unauthorized_access')
  })

  it('returns 404 when the target product does not exist', async () => {
    const user = await createTestUser('upd-absent@test.local')
    const fakeId = crypto.randomUUID()

    const err = await captureError(() =>
      withRls('user', user.id, (tx) =>
        updateProduct(user.id, fakeId, { name: 'Ghost Serum' }, undefined, tx)
      )
    )

    expect(err).toBeInstanceOf(ProductError)
    expect((err as ProductError).code).toBe('product_not_found')
  })

  it('returns 403 when editing another user’s visible row', async () => {
    const owner = await createTestUser('upd-owner@test.local')
    const other = await createTestUser('upd-other@test.local')
    const product = await testDb.transaction((tx) =>
      createProduct(owner.id, 'user', baseProductInput, tx, { autoTag: false })
    )

    const err = await captureError(() =>
      withRls('user', other.id, (tx) =>
        updateProduct(other.id, product.id, { name: 'Hijacked Serum' }, undefined, tx)
      )
    )

    expect(err).toBeInstanceOf(ProductError)
    expect((err as ProductError).code).toBe('unauthorized_access')
  })
})

import { describe, expect, it } from 'bun:test'

import { eq } from 'drizzle-orm'

import { ingredients } from '../../db/schema/ingredients/ingredients'
import { products } from '../../db/schema/products/products'
import { IngredientError } from '../../features/ingredients/ingredients-error'
import { createIngredient } from '../../features/ingredients/service'
import { ProductError } from '../../features/products/product-error'
import { createProduct } from '../../features/products/service'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { captureError } from '../helpers/capture-error'
import { createTestUser } from '../helpers/test-factories'

setupDbTests()

const baseProductInput = {
  name: 'Submission Serum',
  brand: 'SubmitBrand',
  category: 'skincare',
  kind: 'serum',
  unit: 'dropper',
} as const

describe('catalog submission: createProduct quality stamp', () => {
  it('stamps a user submission as unverified + visible, with no verify stamp', async () => {
    const user = await createTestUser('submit-user@test.local', 'Azerty123!')

    const product = await testDb.transaction((tx) =>
      createProduct(user.id, 'user', baseProductInput, tx)
    )

    const [row] = await testDb.select().from(products).where(eq(products.id, product.id))
    expect(row?.catalogQuality).toBe('unverified')
    expect(row?.moderationStatus).toBe('visible')
    expect(row?.createdBy).toBe(user.id)
    expect(row?.verifiedBy).toBeNull()
    expect(row?.verifiedAt).toBeNull()
  })

  it('stamps a contributor submission as verified with a verify stamp', async () => {
    const user = await createTestUser('submit-contrib@test.local', 'Azerty123!')

    const product = await testDb.transaction((tx) =>
      createProduct(user.id, 'contributor', baseProductInput, tx)
    )

    const [row] = await testDb.select().from(products).where(eq(products.id, product.id))
    expect(row?.catalogQuality).toBe('verified')
    expect(row?.verifiedBy).toBe(user.id)
    expect(row?.verifiedAt).not.toBeNull()
  })

  it('stamps an admin submission as verified with a verify stamp', async () => {
    const user = await createTestUser('submit-admin@test.local', 'Azerty123!')

    const product = await testDb.transaction((tx) =>
      createProduct(user.id, 'admin', baseProductInput, tx)
    )

    const [row] = await testDb.select().from(products).where(eq(products.id, product.id))
    expect(row?.catalogQuality).toBe('verified')
    expect(row?.verifiedBy).toBe(user.id)
    expect(row?.verifiedAt).not.toBeNull()
  })
})

describe('catalog submission: createProduct dedup', () => {
  it('rejects a visible duplicate (case/space-insensitive) and returns the existing row', async () => {
    const user = await createTestUser('dup-visible@test.local', 'Azerty123!')
    const first = await testDb.transaction((tx) =>
      createProduct(user.id, 'admin', baseProductInput, tx)
    )

    const err = await captureError(() =>
      testDb.transaction((tx) =>
        createProduct(
          user.id,
          'admin',
          { ...baseProductInput, name: '  submission   serum ', brand: 'SUBMITBRAND' },
          tx
        )
      )
    )
    expect(err).toBeInstanceOf(ProductError)
    expect((err as ProductError).code).toBe('product_already_exists')
    expect((err as ProductError).details).toMatchObject({ id: first.id })
  })

  it('allows a submission whose key matches only a hidden row', async () => {
    const user = await createTestUser('dup-hidden@test.local', 'Azerty123!')
    await testDb.insert(products).values({
      createdBy: user.id,
      name: baseProductInput.name,
      brand: baseProductInput.brand,
      category: 'skincare',
      kind: 'serum',
      unit: 'dropper',
      slug: 'hidden-dup-probe',
      moderationStatus: 'hidden',
    })

    const created = await testDb.transaction((tx) =>
      createProduct(user.id, 'user', baseProductInput, tx)
    )

    const [row] = await testDb.select().from(products).where(eq(products.id, created.id))
    expect(row?.moderationStatus).toBe('visible')
    expect(row?.catalogQuality).toBe('unverified')
  })

  it('serializes concurrent same-key submissions: one wins, the rest 409, never 500', async () => {
    const user = await createTestUser('dup-race@test.local', 'Azerty123!')

    const attempts = await Promise.allSettled(
      Array.from({ length: 4 }, () =>
        testDb.transaction((tx) =>
          createProduct(user.id, 'admin', baseProductInput, tx, { autoTag: false })
        )
      )
    )

    const fulfilled = attempts.filter((a) => a.status === 'fulfilled')
    const rejected = attempts.filter((a) => a.status === 'rejected') as PromiseRejectedResult[]
    expect(fulfilled).toHaveLength(1)
    for (const r of rejected) {
      expect(r.reason).toBeInstanceOf(ProductError)
      expect((r.reason as ProductError).code).toBe('product_already_exists')
    }
  })
})

describe('catalog submission: createProduct rate-limit', () => {
  const rateInput = (label: string) => ({
    name: `Rate Serum ${label}`,
    brand: 'RateBrand',
    category: 'skincare' as const,
    kind: 'serum' as const,
    unit: 'dropper' as const,
  })

  it('blocks a simple user after 10 submissions within the hour (11th → 429)', async () => {
    const user = await createTestUser('rate-user@test.local', 'Azerty123!')
    for (let i = 0; i < 10; i++) {
      await testDb.transaction((tx) =>
        createProduct(user.id, 'user', rateInput(String(i)), tx, { autoTag: false })
      )
    }

    const err = await captureError(() =>
      testDb.transaction((tx) =>
        createProduct(user.id, 'user', rateInput('eleven'), tx, { autoTag: false })
      )
    )
    expect(err).toBeInstanceOf(ProductError)
    expect((err as ProductError).code).toBe('product_rate_limited')
  })

  it('exempts contributor and admin from the hourly limit', async () => {
    const contrib = await createTestUser('rate-contrib@test.local', 'Azerty123!')
    for (let i = 0; i < 12; i++) {
      await testDb.transaction((tx) =>
        createProduct(contrib.id, 'contributor', rateInput(`c${i}`), tx, { autoTag: false })
      )
    }
    const rows = await testDb.select().from(products).where(eq(products.createdBy, contrib.id))
    expect(rows.length).toBe(12)
  })

  it('counts hidden rows toward the quota, hiding spam does not refill it', async () => {
    const user = await createTestUser('rate-hidden@test.local', 'Azerty123!')
    for (let i = 0; i < 10; i++) {
      await testDb.transaction((tx) =>
        createProduct(user.id, 'user', rateInput(`h${i}`), tx, { autoTag: false })
      )
    }
    await testDb
      .update(products)
      .set({ moderationStatus: 'hidden' })
      .where(eq(products.createdBy, user.id))

    const err = await captureError(() =>
      testDb.transaction((tx) =>
        createProduct(user.id, 'user', rateInput('after-hide'), tx, { autoTag: false })
      )
    )
    expect(err).toBeInstanceOf(ProductError)
    expect((err as ProductError).code).toBe('product_rate_limited')
  })
})

const baseIngredientInput = { name: 'Submission Acid', type: 'skincare' } as const

describe('catalog submission: createIngredient quality stamp', () => {
  it('stamps a user submission as unverified + visible, with no verify stamp', async () => {
    const user = await createTestUser('ing-user@test.local', 'Azerty123!')

    const ingredient = await testDb.transaction((tx) =>
      createIngredient(tx, user.id, 'user', baseIngredientInput)
    )

    const [row] = await testDb.select().from(ingredients).where(eq(ingredients.id, ingredient.id))
    expect(row?.catalogQuality).toBe('unverified')
    expect(row?.moderationStatus).toBe('visible')
    expect(row?.createdBy).toBe(user.id)
    expect(row?.verifiedBy).toBeNull()
    expect(row?.verifiedAt).toBeNull()
  })

  it('stamps a contributor submission as verified with a verify stamp', async () => {
    const user = await createTestUser('ing-contrib@test.local', 'Azerty123!')

    const ingredient = await testDb.transaction((tx) =>
      createIngredient(tx, user.id, 'contributor', baseIngredientInput)
    )

    const [row] = await testDb.select().from(ingredients).where(eq(ingredients.id, ingredient.id))
    expect(row?.catalogQuality).toBe('verified')
    expect(row?.verifiedBy).toBe(user.id)
    expect(row?.verifiedAt).not.toBeNull()
  })
})

describe('catalog submission: createIngredient dedup', () => {
  it('rejects a visible duplicate slug and returns the existing row', async () => {
    const user = await createTestUser('ing-dup-visible@test.local', 'Azerty123!')
    const first = await testDb.transaction((tx) =>
      createIngredient(tx, user.id, 'contributor', baseIngredientInput)
    )

    const err = await captureError(() =>
      testDb.transaction((tx) => createIngredient(tx, user.id, 'contributor', baseIngredientInput))
    )
    expect(err).toBeInstanceOf(IngredientError)
    expect((err as IngredientError).code).toBe('ingredient_already_exists')
    expect((err as IngredientError).details).toMatchObject({ id: first.id })
  })

  it('allows a submission whose slug matches only a hidden row', async () => {
    const user = await createTestUser('ing-dup-hidden@test.local', 'Azerty123!')
    await testDb.insert(ingredients).values({
      createdBy: user.id,
      name: 'Hidden Acid',
      slug: 'submission-acid',
      type: 'skincare',
      moderationStatus: 'hidden',
    })

    const created = await testDb.transaction((tx) =>
      createIngredient(tx, user.id, 'user', baseIngredientInput)
    )

    const [row] = await testDb.select().from(ingredients).where(eq(ingredients.id, created.id))
    expect(row?.moderationStatus).toBe('visible')
    expect(row?.slug).toBe('submission-acid')
  })

  it('serializes concurrent same-slug submissions: one wins, the rest 409, never 500', async () => {
    const user = await createTestUser('ing-dup-race@test.local', 'Azerty123!')

    const attempts = await Promise.allSettled(
      Array.from({ length: 4 }, () =>
        testDb.transaction((tx) =>
          createIngredient(tx, user.id, 'contributor', baseIngredientInput)
        )
      )
    )

    const fulfilled = attempts.filter((a) => a.status === 'fulfilled')
    const rejected = attempts.filter((a) => a.status === 'rejected') as PromiseRejectedResult[]
    expect(fulfilled).toHaveLength(1)
    for (const r of rejected) {
      expect(r.reason).toBeInstanceOf(IngredientError)
      expect((r.reason as IngredientError).code).toBe('ingredient_already_exists')
    }
  })
})

describe('catalog submission: createIngredient rate-limit', () => {
  const rateIng = (label: string) => ({ name: `Rate Acid ${label}`, type: 'skincare' as const })

  it('blocks a simple user after 10 submissions within the hour (11th → 429)', async () => {
    const user = await createTestUser('ing-rate-user@test.local', 'Azerty123!')
    for (let i = 0; i < 10; i++) {
      await testDb.transaction((tx) => createIngredient(tx, user.id, 'user', rateIng(String(i))))
    }

    const err = await captureError(() =>
      testDb.transaction((tx) => createIngredient(tx, user.id, 'user', rateIng('eleven')))
    )
    expect(err).toBeInstanceOf(IngredientError)
    expect((err as IngredientError).code).toBe('ingredient_rate_limited')
  })

  it('exempts contributor and admin from the hourly limit', async () => {
    const contrib = await createTestUser('ing-rate-contrib@test.local', 'Azerty123!')
    for (let i = 0; i < 12; i++) {
      await testDb.transaction((tx) =>
        createIngredient(tx, contrib.id, 'contributor', rateIng(`c${i}`))
      )
    }
    const rows = await testDb
      .select()
      .from(ingredients)
      .where(eq(ingredients.createdBy, contrib.id))
    expect(rows.length).toBe(12)
  })

  it('counts hidden rows toward the quota, hiding spam does not refill it', async () => {
    const user = await createTestUser('ing-rate-hidden@test.local', 'Azerty123!')
    for (let i = 0; i < 10; i++) {
      await testDb.transaction((tx) => createIngredient(tx, user.id, 'user', rateIng(`h${i}`)))
    }
    await testDb
      .update(ingredients)
      .set({ moderationStatus: 'hidden' })
      .where(eq(ingredients.createdBy, user.id))

    const err = await captureError(() =>
      testDb.transaction((tx) => createIngredient(tx, user.id, 'user', rateIng('after-hide')))
    )
    expect(err).toBeInstanceOf(IngredientError)
    expect((err as IngredientError).code).toBe('ingredient_rate_limited')
  })
})

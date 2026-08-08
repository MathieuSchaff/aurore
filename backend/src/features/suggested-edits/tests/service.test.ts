import { beforeEach, describe, expect, it } from 'bun:test'

import { eq, sql } from 'drizzle-orm'

import { products, suggestedEdits } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { createSuggestedEdit, listSuggestedEdits, reviewSuggestedEdit } from '../service'

setupDbTests()

const createEdit = (args: Parameters<typeof createSuggestedEdit>[1]) =>
  testDb.transaction((tx) => createSuggestedEdit(tx, args))

const listEdits = (filters: Parameters<typeof listSuggestedEdits>[1]) =>
  testDb.transaction((tx) => listSuggestedEdits(tx, filters))

const reviewEdit = (args: Parameters<typeof reviewSuggestedEdit>[1]) =>
  testDb.transaction((tx) => reviewSuggestedEdit(tx, args))

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

let proposerId: string
let reviewerId: string
let productId: string

beforeEach(async () => {
  const proposer = await createTestUser('proposer@toto.com', 'Azerty123!')
  const reviewer = await createTestUser('reviewer@toto.com', 'Azerty123!')
  proposerId = proposer.id
  reviewerId = reviewer.id
  const [p] = await testDb
    .insert(products)
    .values({
      name: 'Old Name',
      brand: 'BrandX',
      category: 'skincare',
      kind: 'serum',
      unit: 'pump',
      slug: 'old-name-brandx',
      createdBy: proposerId,
    })
    .returning({ id: products.id })
  if (!p) throw new Error('product seed failed')
  productId = p.id
})

describe('suggested-edits service', () => {
  it('createSuggestedEdit inserts a pending row', async () => {
    const row = await createEdit({
      proposerId,
      body: {
        targetType: 'product',
        targetId: productId,
        field: 'name',
        proposedValue: 'New Name',
      },
    })
    expect(row.status).toBe('pending')
    expect(row.proposedValue).toBe('New Name')
  })

  it('createSuggestedEdit rejects a missing target sheet', async () => {
    await expect(
      createEdit({
        proposerId,
        body: {
          targetType: 'product',
          targetId: '00000000-0000-7000-8000-000000000000',
          field: 'name',
          proposedValue: 'New Name',
        },
      })
    ).rejects.toMatchObject({ code: 'not_found' })
  })

  it('holds the target sheet while creating its polymorphic reference', async () => {
    const created = deferred()
    const release = deferred()
    const writer = testDb.transaction(async (tx) => {
      await createSuggestedEdit(tx, {
        proposerId,
        body: {
          targetType: 'product',
          targetId: productId,
          field: 'name',
          proposedValue: 'New Name',
        },
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

  it('listSuggestedEdits filters by status, newest first', async () => {
    await createEdit({
      proposerId,
      body: { targetType: 'product', targetId: productId, field: 'name', proposedValue: 'A' },
    })
    const { items } = await listEdits({ status: 'pending' })
    expect(items.length).toBe(1)
    expect(items[0]?.status).toBe('pending')
  })

  it('ACCEPT applies the proposed value to the product sheet field + stamps reviewer', async () => {
    const edit = await createEdit({
      proposerId,
      body: {
        targetType: 'product',
        targetId: productId,
        field: 'name',
        proposedValue: 'Accepted Name',
      },
    })
    const result = await reviewEdit({
      id: edit.id,
      reviewerId,
      status: 'accepted',
    })
    expect(result.status).toBe('accepted')
    expect(result.reviewedBy).toBe(reviewerId)
    expect(result.reviewedAt).not.toBeNull()
    const [p] = await testDb
      .select({ name: products.name })
      .from(products)
      .where(eq(products.id, productId))
    expect(p?.name).toBe('Accepted Name')
  })

  it('REJECT leaves the sheet untouched', async () => {
    const edit = await createEdit({
      proposerId,
      body: {
        targetType: 'product',
        targetId: productId,
        field: 'name',
        proposedValue: 'Should Not Apply',
      },
    })
    await reviewEdit({ id: edit.id, reviewerId, status: 'rejected' })
    const [p] = await testDb
      .select({ name: products.name })
      .from(products)
      .where(eq(products.id, productId))
    expect(p?.name).toBe('Old Name')
  })

  it('ACCEPT on a non-pending edit throws', async () => {
    const edit = await createEdit({
      proposerId,
      body: { targetType: 'product', targetId: productId, field: 'name', proposedValue: 'X' },
    })
    await reviewEdit({ id: edit.id, reviewerId, status: 'accepted' })
    await expect(reviewEdit({ id: edit.id, reviewerId, status: 'accepted' })).rejects.toThrow()
  })

  it('ACCEPT 404s a missing edit', async () => {
    await expect(
      reviewEdit({
        id: '00000000-0000-7000-8000-000000000000',
        reviewerId,
        status: 'accepted',
      })
    ).rejects.toThrow()
  })

  // Covers the applyToSheet 0-row branch: the edit exists but its target is gone.
  it('ACCEPT on an edit whose target sheet is gone throws', async () => {
    const [edit] = await testDb
      .insert(suggestedEdits)
      .values({
        proposerId,
        targetType: 'product',
        targetId: '00000000-0000-7000-8000-000000000000',
        field: 'name',
        proposedValue: 'X',
      })
      .returning({ id: suggestedEdits.id })
    if (!edit) throw new Error('suggested edit seed failed')
    await expect(reviewEdit({ id: edit.id, reviewerId, status: 'accepted' })).rejects.toThrow()
  })
})

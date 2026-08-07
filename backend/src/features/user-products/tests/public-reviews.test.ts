import { beforeEach, describe, expect, it } from 'bun:test'

import type { SkinType } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { profiles, userDermoProfiles } from '../../../db/schema/auth/users'
import { userProductReviews } from '../../../db/schema/products/user-products'
import { testDb } from '../../../tests/db.test.config'
import { cleanDatabase } from '../../../tests/helpers/db-cleaner'
import { createTestProduct, createTestUser } from '../../../tests/helpers/test-factories'
import { createUserProduct, listPublicReviewsForProduct, upsertUserProductReview } from '../service'

// createUserProduct/upsertUserProductReview run inside the request RLS transaction,
// so open a real one here instead of handing them the root test handle.
// listPublicReviewsForProduct is the anonymous-read side (family 1, DbOrTransaction
// justified) and keeps taking testDb directly.
const collect = (userId: string, productId: string) =>
  testDb.transaction((tx) => createUserProduct(userId, { productId, status: 'in_stock' }, tx))
const upsertUPReview = (
  userId: string,
  id: string,
  input: Parameters<typeof upsertUserProductReview>[2]
) => testDb.transaction((tx) => upsertUserProductReview(userId, id, input, tx))

async function setProfile(userId: string, username: string, profilePublic = false) {
  await testDb.update(profiles).set({ username, profilePublic }).where(eq(profiles.userId, userId))
}

// A reviewer is a user plus the username the public projection exposes.
async function createReviewer(email: string, username: string, profilePublic = false) {
  const user = await createTestUser(email)
  await setProfile(user.id, username, profilePublic)
  return user
}

// Support product: nothing asserts its fields, only its slug is read back.
const seedProduct = (ownerId: string) => createTestProduct(ownerId, { name: 'Cream' })

async function setDermoProfile(
  userId: string,
  opts: {
    skinTypes?: SkinType[]
    fitzpatrickType?: number
    skinTypesPublic?: boolean
    fitzpatrickPublic?: boolean
  }
) {
  await testDb
    .insert(userDermoProfiles)
    .values({
      userId,
      skinTypes: opts.skinTypes ?? null,
      fitzpatrickType: opts.fitzpatrickType ?? null,
      skinTypesPublic: opts.skinTypesPublic ?? false,
      fitzpatrickPublic: opts.fitzpatrickPublic ?? false,
    })
    .onConflictDoUpdate({
      target: userDermoProfiles.userId,
      set: {
        skinTypes: opts.skinTypes ?? null,
        fitzpatrickType: opts.fitzpatrickType ?? null,
        skinTypesPublic: opts.skinTypesPublic ?? false,
        fitzpatrickPublic: opts.fitzpatrickPublic ?? false,
      },
    })
}

describe('listPublicReviewsForProduct', () => {
  beforeEach(async () => {
    await cleanDatabase()
  })

  it('returns an empty list when no public review exists', async () => {
    const owner = await createTestUser('seed@public-rev.test')
    const product = await seedProduct(owner.id)
    const result = await listPublicReviewsForProduct(testDb, product.slug)
    expect(result).toEqual({ reviews: [] })
  })

  it('lists only public reviews that have a non-empty comment', async () => {
    const alice = await createReviewer('alice@public-rev.test', 'alice')
    const bob = await createReviewer('bob@public-rev.test', 'bob')
    const product = await seedProduct(alice.id)
    const aliceUP = await collect(alice.id, product.id)
    const bobUP = await collect(bob.id, product.id)
    await upsertUPReview(alice.id, aliceUP.id, {
      tolerance: 5,
      comment: 'shared by alice',
      isPublic: true,
    })
    await upsertUPReview(bob.id, bobUP.id, { tolerance: 2, comment: 'private bob' })

    const result = await listPublicReviewsForProduct(testDb, product.slug)
    expect(result.reviews).toHaveLength(1)
    expect(result.reviews[0]).toMatchObject({
      comment: 'shared by alice',
      reviewer: { username: 'alice', profilePublic: false },
    })
  })

  it('nulls the 6 axes unless the author opted ratings public', async () => {
    const owner = await createReviewer('gate@public-rev.test', 'gate-rev')
    const product = await seedProduct(owner.id)
    const up = await collect(owner.id, product.id)
    // public + comment, ratings NOT opted in → axes hidden
    await upsertUPReview(owner.id, up.id, {
      tolerance: 5,
      efficacy: 4,
      comment: 'hidden numbers',
      isPublic: true,
    })

    const hidden = await listPublicReviewsForProduct(testDb, product.slug)
    expect(hidden.reviews[0]).toMatchObject({
      tolerance: null,
      efficacy: null,
      comment: 'hidden numbers',
    })

    // opt in → axes revealed (isPublic must survive a ratings-only toggle)
    await upsertUPReview(owner.id, up.id, { ratingsPublic: true })
    const shown = await listPublicReviewsForProduct(testDb, product.slug)
    expect(shown.reviews).toHaveLength(1)
    expect(shown.reviews[0]).toMatchObject({ tolerance: 5, efficacy: 4 })
  })

  it('does not list a public review with no comment (legacy unlisted)', async () => {
    const owner = await createReviewer('legacy@public-rev.test', 'legacy-rev')
    const ws = await createReviewer('legacy-ws@public-rev.test', 'legacy-ws-rev')
    const product = await seedProduct(owner.id)
    const up = await collect(owner.id, product.id)
    const wsUp = await collect(ws.id, product.id)
    // seed-style legacy rows: public but comment-less (null) or whitespace-only — both unlisted.
    await testDb.insert(userProductReviews).values([
      { userProductId: up.id, tolerance: 4, isPublic: true },
      { userProductId: wsUp.id, tolerance: 4, comment: '   ', isPublic: true },
    ])

    const result = await listPublicReviewsForProduct(testDb, product.slug)
    expect(result.reviews).toEqual([])
  })

  it('rejects publishing a review without a public comment', async () => {
    const owner = await createReviewer('reqc@public-rev.test', 'reqc-rev')
    const product = await seedProduct(owner.id)
    const up = await collect(owner.id, product.id)
    await upsertUPReview(owner.id, up.id, { tolerance: 4 }) // private, fine

    await expect(upsertUPReview(owner.id, up.id, { isPublic: true })).rejects.toThrow(
      'public_review_requires_comment'
    )
  })

  it('allows toggling public when a comment already exists (payload omits comment)', async () => {
    const owner = await createReviewer('toggle@public-rev.test', 'toggle-rev')
    const product = await seedProduct(owner.id)
    const up = await collect(owner.id, product.id)
    await upsertUPReview(owner.id, up.id, { comment: 'written first' })
    await upsertUPReview(owner.id, up.id, { isPublic: true }) // must not throw

    const result = await listPublicReviewsForProduct(testDb, product.slug)
    expect(result.reviews).toHaveLength(1)
  })

  it('exposes reviewer.profilePublic for the link-vs-plaintext decision', async () => {
    const open = await createReviewer('open@public-rev.test', 'open-rev', true)
    const shy = await createReviewer('shy@public-rev.test', 'shy-rev', false)
    const product = await seedProduct(open.id)
    const openUP = await collect(open.id, product.id)
    const shyUP = await collect(shy.id, product.id)
    await upsertUPReview(open.id, openUP.id, { comment: 'a', isPublic: true })
    await upsertUPReview(shy.id, shyUP.id, { comment: 'b', isPublic: true })

    const result = await listPublicReviewsForProduct(testDb, product.slug)
    const byUsername = Object.fromEntries(
      result.reviews.map((r) => [r.reviewer.username, r.reviewer.profilePublic])
    )
    expect(byUsername).toEqual({ 'open-rev': true, 'shy-rev': false })
  })

  it('skips reviewers whose profile has no username', async () => {
    const owner = await createTestUser('noname@public-rev.test')
    // Pseudonyms are assigned at profile creation, so the username is never null
    // through the normal flow; force it to cover the isNotNull guard that still
    // defends against legacy/admin-created rows.
    await testDb.update(profiles).set({ username: null }).where(eq(profiles.userId, owner.id))
    const product = await seedProduct(owner.id)
    const up = await collect(owner.id, product.id)
    await upsertUPReview(owner.id, up.id, { comment: 'c', isPublic: true })
    const result = await listPublicReviewsForProduct(testDb, product.slug)
    expect(result.reviews).toEqual([])
  })

  it('orders reviews newest first', async () => {
    const a = await createReviewer('first@public-rev.test', 'first-rev')
    const b = await createReviewer('second@public-rev.test', 'second-rev')
    const product = await seedProduct(a.id)
    const aUP = await collect(a.id, product.id)
    await upsertUPReview(a.id, aUP.id, { comment: 'older', isPublic: true })
    await new Promise((r) => setTimeout(r, 10))
    const bUP = await collect(b.id, product.id)
    await upsertUPReview(b.id, bUP.id, { comment: 'newer', isPublic: true })

    const result = await listPublicReviewsForProduct(testDb, product.slug)
    expect(result.reviews.map((r) => r.reviewer.username)).toEqual(['second-rev', 'first-rev'])
  })

  it('exposes skinTypes and fitzpatrickType when skinTypesPublic is true', async () => {
    const owner = await createReviewer('skin-on@public-rev.test', 'skin-on-rev')
    await setDermoProfile(owner.id, {
      skinTypes: ['peau-seche', 'peau-sensible'],
      fitzpatrickType: 2,
      skinTypesPublic: true,
      fitzpatrickPublic: true,
    })
    const product = await seedProduct(owner.id)
    const up = await collect(owner.id, product.id)
    await upsertUPReview(owner.id, up.id, { comment: 'dry and sensitive', isPublic: true })

    const result = await listPublicReviewsForProduct(testDb, product.slug)
    expect(result.reviews[0].reviewer).toMatchObject({
      skinTypes: ['peau-seche', 'peau-sensible'],
      fitzpatrickType: 2,
    })
  })

  it('nulls skinTypes and fitzpatrickType when skinTypesPublic is false', async () => {
    const owner = await createReviewer('skin-off@public-rev.test', 'skin-off-rev')
    await setDermoProfile(owner.id, {
      skinTypes: ['peau-grasse'],
      fitzpatrickType: 4,
      skinTypesPublic: false,
    })
    const product = await seedProduct(owner.id)
    const up = await collect(owner.id, product.id)
    await upsertUPReview(owner.id, up.id, { comment: 'kept private', isPublic: true })

    const result = await listPublicReviewsForProduct(testDb, product.slug)
    expect(result.reviews[0].reviewer).toMatchObject({
      skinTypes: null,
      fitzpatrickType: null,
    })
  })

  it('nulls skinTypes and fitzpatrickType when no dermo profile exists (LEFT JOIN)', async () => {
    const owner = await createReviewer('no-dermo@public-rev.test', 'no-dermo-rev')
    // intentionally no setDermoProfile call
    const product = await seedProduct(owner.id)
    const up = await collect(owner.id, product.id)
    await upsertUPReview(owner.id, up.id, { comment: 'no dermo profile', isPublic: true })

    const result = await listPublicReviewsForProduct(testDb, product.slug)
    expect(result.reviews[0].reviewer).toMatchObject({
      skinTypes: null,
      fitzpatrickType: null,
    })
  })

  it('nulls fitzpatrickType when fitzpatrickPublic is false even if skinTypesPublic is true', async () => {
    const owner = await createReviewer('fitz-off@public-rev.test', 'fitz-off-rev')
    await setDermoProfile(owner.id, {
      skinTypes: ['peau-mixte'],
      fitzpatrickType: 3,
      skinTypesPublic: true,
      fitzpatrickPublic: false,
    })
    const product = await seedProduct(owner.id)
    const up = await collect(owner.id, product.id)
    await upsertUPReview(owner.id, up.id, { comment: 'split flags', isPublic: true })

    const result = await listPublicReviewsForProduct(testDb, product.slug)
    expect(result.reviews[0].reviewer).toMatchObject({
      skinTypes: ['peau-mixte'],
      fitzpatrickType: null,
    })
  })
})

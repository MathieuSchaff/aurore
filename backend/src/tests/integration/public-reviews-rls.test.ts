/**
 * Regression test: user_product_reviews_select_public +
 * profiles_select_for_public_review must let an anonymous app_runtime caller
 * see only opted-in reviews and the matching reviewer pseudonym, never the
 * private ones. Service-level tests bypass RLS (testDb = owner pool); this
 * file binds to the real app_runtime role so the policies are exercised.
 */
import { describe, expect, it } from 'bun:test'
import { SQL } from 'bun'

import { eq } from 'drizzle-orm'

import { profiles } from '../../db/schema/auth/users'
import { products } from '../../db/schema/products/products'
import { userProductReviews, userProducts } from '../../db/schema/products/user-products'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb } from '../helpers/app-runtime-db'
import { createTestUser } from '../helpers/test-factories'

const APP_DATABASE_URL = process.env.APP_DATABASE_URL
if (!APP_DATABASE_URL) throw new Error('APP_DATABASE_URL not set')

const appRuntimeDb = await createAppRuntimeDb()

setupDbTests()

describe('public reviews RLS: anonymous app_runtime', () => {
  async function seedProduct(createdBy: string, name: string, brand: string, slug: string) {
    const [product] = await testDb
      .insert(products)
      .values({
        createdBy,
        name,
        brand,
        category: 'skincare',
        kind: 'serum',
        unit: 'dropper',
        slug,
      })
      .returning()
    if (!product) throw new Error('product seed failed')
    return product
  }

  async function seedUserProduct(userId: string, productId: string) {
    const [up] = await testDb
      .insert(userProducts)
      .values({ userId, productId, status: 'in_stock' })
      .returning()
    if (!up) throw new Error('user_product seed failed')
    return up
  }

  // Owner + product + collection entry + one opted-in review: the minimum a
  // profile needs to surface through profiles_select_for_public_review.
  async function seedPublicReview(userId: string, name: string, brand: string, slug: string) {
    const product = await seedProduct(userId, name, brand, slug)
    const up = await seedUserProduct(userId, product.id)
    const [review] = await testDb
      .insert(userProductReviews)
      .values({ userProductId: up.id, tolerance: 5, isPublic: true })
      .returning()
    if (!review) throw new Error('review seed failed')
    return review
  }

  it('exposes only is_public=true reviews and the reviewer pseudonym', async () => {
    const alice = await createTestUser('alice-rev@test.local', 'Azerty123!')
    const bob = await createTestUser('bob-rev@test.local', 'Azerty123!')
    const carol = await createTestUser('carol-rev@test.local', 'Azerty123!')

    // alice = public profile, no review at all.
    await testDb
      .update(profiles)
      .set({ username: 'alice-pub', profilePublic: true })
      .where(eq(profiles.userId, alice.id))
    // bob = private profile + a public review (tests profiles_select_for_public_review).
    await testDb
      .update(profiles)
      .set({ username: 'bob-priv-pub-rev' })
      .where(eq(profiles.userId, bob.id))
    // carol = private profile + a private-only review (must stay invisible).
    await testDb
      .update(profiles)
      .set({ username: 'carol-priv' })
      .where(eq(profiles.userId, carol.id))

    const product = await seedProduct(alice.id, 'Test Serum', 'TestBrand', 'test-serum-testbrand')
    const bobUp = await seedUserProduct(bob.id, product.id)
    const carolUp = await seedUserProduct(carol.id, product.id)

    await testDb.insert(userProductReviews).values([
      { userProductId: bobUp.id, tolerance: 4, comment: 'bob public', isPublic: true },
      { userProductId: carolUp.id, tolerance: 2, comment: 'carol private', isPublic: false },
    ])

    const visibleReviews = await appRuntimeDb.select().from(userProductReviews)
    expect(visibleReviews).toHaveLength(1)
    expect(visibleReviews[0]?.userProductId).toBe(bobUp.id)
    expect(visibleReviews[0]?.comment).toBe('bob public')

    const visibleProfiles = await appRuntimeDb.select().from(profiles)
    const visibleUserIds = visibleProfiles.map((p) => p.userId).sort()
    expect(visibleUserIds).toEqual([alice.id, bob.id].sort())
  })

  it('hides reviewer profile once their last public review flips private', async () => {
    const bob = await createTestUser('bob-flip@test.local', 'Azerty123!')

    await testDb.update(profiles).set({ username: 'bob-flip' }).where(eq(profiles.userId, bob.id))

    const review = await seedPublicReview(bob.id, 'Flip Serum', 'FlipBrand', 'flip-serum-flipbrand')

    let visible = await appRuntimeDb.select().from(profiles)
    expect(visible.map((p) => p.userId)).toEqual([bob.id])

    await testDb
      .update(userProductReviews)
      .set({ isPublic: false })
      .where(eq(userProductReviews.id, review.id))

    visible = await appRuntimeDb.select().from(profiles)
    expect(visible).toHaveLength(0)
  })

  // Regression: profiles_select_for_public_review must require
  // r.moderation_status = 'visible' in the EXISTS, otherwise the reviewer
  // pseudonym leaks via the policy even after every public review is hidden
  // by admin moderation.
  it('hides reviewer profile when their only public review is moderated hidden', async () => {
    const bob = await createTestUser('bob-mod@test.local', 'Azerty123!')

    await testDb.update(profiles).set({ username: 'bob-mod' }).where(eq(profiles.userId, bob.id))

    const review = await seedPublicReview(
      bob.id,
      'Mod Filter Serum',
      'ModFilterBrand',
      'mod-filter-serum'
    )

    let visible = await appRuntimeDb.select().from(profiles)
    expect(visible.map((p) => p.userId)).toEqual([bob.id])

    // Admin moderation hides the review: profile must stop appearing through
    // profiles_select_for_public_review.
    await testDb
      .update(userProductReviews)
      .set({ moderationStatus: 'hidden' })
      .where(eq(userProductReviews.id, review.id))

    visible = await appRuntimeDb.select().from(profiles)
    expect(visible).toHaveLength(0)
  })

  it('cannot SELECT users.password_hash (column GRANT excluded by 0038)', async () => {
    await createTestUser('hash-probe@test.local', 'Azerty123!')

    const pool = new SQL(APP_DATABASE_URL)
    let threw = false
    try {
      await pool`SELECT password_hash FROM users LIMIT 1`
    } catch (e: unknown) {
      threw = true
      expect((e as Error).message).toMatch(/permission denied/i)
    } finally {
      await pool.close()
    }
    expect(threw).toBe(true)
  })
})

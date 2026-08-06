/**
 * RLS regression: user_dermo_profiles_select_for_public_review must let
 * app_runtime read dermo data on the public reviews surface even when
 * profile_public=false, gated on skin flags + at least one visible public
 * review. Complements public-reviews-rls.test.ts (profiles + reviews surface).
 */
import { describe, expect, it } from 'bun:test'

import { eq } from 'drizzle-orm'

import { profiles, userDermoProfiles } from '../../db/schema/auth/users'
import { products } from '../../db/schema/products/products'
import { userProductReviews, userProducts } from '../../db/schema/products/user-products'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb } from '../helpers/app-runtime-db'
import { createTestUser } from '../helpers/test-factories'

const appRuntimeDb = await createAppRuntimeDb()

setupDbTests()

describe('user_dermo_profiles RLS: public reviews surface', () => {
  type ProfileOverrides = Partial<{ forcedPrivateByAdmin: boolean }>
  type DermoValues = Omit<typeof userDermoProfiles.$inferInsert, 'userId'>

  // Every case needs the same shape: a named profile (profilePublic stays false,
  // that is the point), a dermo row, and one visible public review to satisfy the
  // policy's EXISTS. Only the flags under test differ.
  async function seedReviewerWithDermo(
    email: string,
    username: string,
    dermo: DermoValues,
    profileOverrides: ProfileOverrides = {}
  ) {
    const user = await createTestUser(email, 'Azerty123!')
    await testDb
      .update(profiles)
      .set({ username, ...profileOverrides })
      .where(eq(profiles.userId, user.id))
    await testDb.insert(userDermoProfiles).values({ userId: user.id, ...dermo })

    const [product] = await testDb
      .insert(products)
      .values({
        createdBy: user.id,
        name: `Dermo Serum ${username}`,
        brand: 'DermoBrand',
        category: 'skincare',
        kind: 'serum',
        unit: 'dropper',
        slug: `dermo-serum-${username}`,
      })
      .returning()
    if (!product) throw new Error('product seed failed')

    const [up] = await testDb
      .insert(userProducts)
      .values({ userId: user.id, productId: product.id, status: 'in_stock' })
      .returning()
    if (!up) throw new Error('user_product seed failed')

    const [review] = await testDb
      .insert(userProductReviews)
      .values({ userProductId: up.id, comment: 'pub', isPublic: true })
      .returning()
    if (!review) throw new Error('review seed failed')

    return { user, review }
  }

  const visibleDermoRows = () => appRuntimeDb.select().from(userDermoProfiles)

  it('exposes dermo row via app_runtime when skinTypesPublic=true and user has a public review (profilePublic=false)', async () => {
    const { user } = await seedReviewerWithDermo('dermo-skin-on@test.local', 'dermo-skin-on', {
      skinTypes: ['peau-seche'],
      skinTypesPublic: true,
    })

    const rows = await visibleDermoRows()
    expect(rows).toHaveLength(1)
    expect(rows[0]?.userId).toBe(user.id)
  })

  it('hides dermo row via app_runtime when skinTypesPublic=false and fitzpatrickPublic=false (even with public review)', async () => {
    await seedReviewerWithDermo('dermo-flags-off@test.local', 'dermo-flags-off', {
      skinTypes: ['peau-grasse'],
      skinTypesPublic: false,
      fitzpatrickPublic: false,
    })

    expect(await visibleDermoRows()).toHaveLength(0)
  })

  it('exposes dermo row via app_runtime when fitzpatrickPublic=true and skinTypesPublic=false (profilePublic=false)', async () => {
    const { user } = await seedReviewerWithDermo('dermo-fitz-on@test.local', 'dermo-fitz-on', {
      fitzpatrickType: 3,
      skinTypesPublic: false,
      fitzpatrickPublic: true,
    })

    const rows = await visibleDermoRows()
    expect(rows).toHaveLength(1)
    expect(rows[0]?.userId).toBe(user.id)
  })

  it('hides dermo row when profile is force-privated by admin (even with skinTypesPublic=true and public review)', async () => {
    await seedReviewerWithDermo(
      'dermo-force-priv@test.local',
      'dermo-force-priv',
      { skinTypes: ['peau-normale'], skinTypesPublic: true },
      { forcedPrivateByAdmin: true }
    )

    expect(await visibleDermoRows()).toHaveLength(0)
  })

  it('hides dermo row when the only public review is moderated hidden', async () => {
    const { review } = await seedReviewerWithDermo(
      'dermo-mod-hidden@test.local',
      'dermo-mod-hidden',
      { skinTypes: ['peau-mixte'], skinTypesPublic: true }
    )

    // First confirm the row is visible with moderation_status='visible' (default)
    expect(await visibleDermoRows()).toHaveLength(1)

    // Admin hides the review: dermo row must disappear
    await testDb
      .update(userProductReviews)
      .set({ moderationStatus: 'hidden' })
      .where(eq(userProductReviews.id, review.id))

    expect(await visibleDermoRows()).toHaveLength(0)
  })
})

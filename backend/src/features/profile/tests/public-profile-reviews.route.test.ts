import { beforeAll, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { userProductReviews, userProducts } from '../../../db/schema/products/user-products'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestApp } from '../../../tests/helpers/createTestApp'
import type { TestApp } from '../../../tests/helpers/createTestClient'
import { createTestProduct } from '../../../tests/helpers/test-factories'
import { seedPublicAuthor } from './profile-test.setup'

setupDbTests()

type ReviewSeed = {
  comment?: string | null
  isPublic?: boolean
  ratingsPublic?: boolean
  moderationStatus?: 'visible' | 'hidden'
}

// Seed a profile (public by default) with one product review owned by them.
async function seedReviewer(
  username: string,
  review: ReviewSeed = {},
  profile: { profilePublic?: boolean; forcedPrivateByAdmin?: boolean } = {}
) {
  const {
    comment = 'Belle texture, peau apaisée.',
    isPublic = true,
    ratingsPublic = true,
    moderationStatus = 'visible',
  } = review

  const owner = await seedPublicAuthor(username, profile)
  const product = await createTestProduct(owner.id, {
    name: `Sérum ${username}`,
    brand: 'BrandX',
    unit: 'dropper',
  })

  const [up] = await testDb
    .insert(userProducts)
    .values({ userId: owner.id, productId: product.id, status: 'in_stock' })
    .returning()
  if (!up) throw new Error('user_product seed failed')

  await testDb.insert(userProductReviews).values({
    userProductId: up.id,
    comment,
    isPublic,
    // DB check upr_ratings_public_requires_public: ratings can't be public if the
    // review itself isn't.
    ratingsPublic: isPublic && ratingsPublic,
    moderationStatus,
    tolerance: 5,
    efficacy: 4,
  })

  return { ownerId: owner.id, product }
}

describe('GET /profiles/:username/reviews', () => {
  let app: TestApp

  beforeAll(async () => {
    app = await createTestApp()
  })

  async function reviewsOf(username: string) {
    const res = await app.request(`/api/profiles/${username}/reviews`)
    expect(res.status).toBe(HTTP_STATUS.OK)
    const body = (await res.json()) as {
      success: true
      data: {
        reviews: Array<{
          comment: string | null
          tolerance: number | null
          efficacy: number | null
          product: { slug: string; name: string }
          reviewer: { username: string }
        }>
      }
    }
    return body.data.reviews
  }

  it("lists a user's public reviews with the explicit product", async () => {
    const { product } = await seedReviewer('reviewer-pub')

    const reviews = await reviewsOf('reviewer-pub')
    expect(reviews).toHaveLength(1)
    expect(reviews[0].comment).toBe('Belle texture, peau apaisée.')
    expect(reviews[0].product).toEqual({ slug: product.slug, name: product.name })
    expect(reviews[0].reviewer.username).toBe('reviewer-pub')
  })

  it('excludes a private review', async () => {
    await seedReviewer('reviewer-priv', { isPublic: false })
    expect(await reviewsOf('reviewer-priv')).toHaveLength(0)
  })

  it('excludes a moderation-hidden review', async () => {
    await seedReviewer('reviewer-hidden', { moderationStatus: 'hidden' })
    expect(await reviewsOf('reviewer-hidden')).toHaveLength(0)
  })

  it('excludes a comment-less review (feuille-dépôt without text stays unlisted)', async () => {
    await seedReviewer('reviewer-nocomment', { comment: '   ' })
    expect(await reviewsOf('reviewer-nocomment')).toHaveLength(0)
  })

  it('nulls the ratings when the author did not opt in', async () => {
    await seedReviewer('reviewer-noratings', { ratingsPublic: false })
    const reviews = await reviewsOf('reviewer-noratings')
    expect(reviews).toHaveLength(1)
    expect(reviews[0].tolerance).toBeNull()
    expect(reviews[0].efficacy).toBeNull()
  })

  it('returns an empty list for a profile that is not public (master gate)', async () => {
    await seedReviewer('reviewer-shy', {}, { profilePublic: false })
    expect(await reviewsOf('reviewer-shy')).toHaveLength(0)
  })

  it('returns an empty list for an admin-force-privated profile', async () => {
    await seedReviewer('reviewer-forced', {}, { forcedPrivateByAdmin: true })
    expect(await reviewsOf('reviewer-forced')).toHaveLength(0)
  })

  it('returns an empty list for an unknown username (anti-enumeration)', async () => {
    expect(await reviewsOf('ghost')).toHaveLength(0)
  })
})

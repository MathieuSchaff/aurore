import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { profiles } from '../../../db/schema/auth/users'
import { ingredients } from '../../../db/schema/ingredients/ingredients'
import { discussionReplies, discussionThreads } from '../../../db/schema/products/discussions'
import { products } from '../../../db/schema/products/products'
import { userProductReviews, userProducts } from '../../../db/schema/products/user-products'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestClient,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectOk, expectStatus } from '../../../tests/helpers/expectStatus'
import { login } from '../../../tests/helpers/login'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import {
  createTestAdminUser,
  createTestContributorUser,
  createTestUser,
} from '../../../tests/helpers/test-factories'

const ANY_USER_ID = '019d0000-0000-7000-8000-00000000abc1'
const GHOST_ID = '019d0000-0000-7000-8000-000000000abc'

function setProfile(userId: string, values: Partial<typeof profiles.$inferInsert>) {
  return testDb.update(profiles).set(values).where(eq(profiles.userId, userId))
}

// Raw insert rather than createTestProduct/createTestIngredient: the catalog
// services open a transaction and run auto-tagging, which deadlocks against the
// TRUNCATE of the next beforeEach in this suite.
async function seedProduct(
  createdBy: string,
  values: Partial<typeof products.$inferInsert> & { name: string }
) {
  const [product] = await testDb
    .insert(products)
    .values({
      brand: 'ModBrand',
      category: 'skincare',
      kind: 'serum',
      unit: 'dropper',
      slug: `${values.name.toLowerCase().replaceAll(' ', '-')}-${Math.random().toString(36).slice(2, 8)}`,
      ...values,
      createdBy,
    })
    .returning()
  if (!product) throw new Error('product seed failed')
  return product
}

async function seedIngredient(createdBy: string, name: string) {
  const [ingredient] = await testDb
    .insert(ingredients)
    .values({
      createdBy,
      name,
      slug: `${name.toLowerCase().replaceAll(' ', '-')}-${Math.random().toString(36).slice(2, 8)}`,
      type: 'skincare',
    })
    .returning()
  if (!ingredient) throw new Error('ingredient seed failed')
  return ingredient
}

// No shared factory for discussions: the repo convention is a local helper.
async function seedThread(productId: string, authorId: string, title = 'T', content = 'c') {
  const [thread] = await testDb
    .insert(discussionThreads)
    .values({ productId, authorId, title, content })
    .returning({ id: discussionThreads.id })
  if (!thread) throw new Error('thread seed failed')
  return thread.id
}

async function seedReply(threadId: string, authorId: string, content = 'r') {
  const [reply] = await testDb
    .insert(discussionReplies)
    .values({ threadId, authorId, content })
    .returning({ id: discussionReplies.id })
  if (!reply) throw new Error('reply seed failed')
  return reply.id
}

async function setupProductAndReview(opts: {
  userId: string
  isPublic?: boolean
}): Promise<{ productSlug: string; reviewId: string }> {
  const product = await seedProduct(opts.userId, { name: 'Mod Serum' })

  const [up] = await testDb
    .insert(userProducts)
    .values({ userId: opts.userId, productId: product.id, status: 'in_stock' })
    .returning()
  if (!up) throw new Error('user_product seed failed')

  const [review] = await testDb
    .insert(userProductReviews)
    .values({
      userProductId: up.id,
      tolerance: 4,
      comment: 'public test review',
      isPublic: opts.isPublic ?? true,
    })
    .returning({ id: userProductReviews.id })
  if (!review) throw new Error('review seed failed')

  return { productSlug: product.slug, reviewId: review.id }
}

setupDbTests()

describe('POST /admin/moderation/* + public read filters', () => {
  let client: TestClient
  let userId: string
  let adminId: string
  let userToken: string
  let adminToken: string
  let contributorId: string
  let contributorToken: string

  beforeAll(async () => {
    client = await createTestClient()
  })

  beforeEach(async () => {
    const toto = TEST_CREDENTIALS.toto
    const admin = TEST_CREDENTIALS.admin
    const contributor = TEST_CREDENTIALS.contributor
    const user = await createTestUser(toto.rawEmail, toto.rawPassword)
    const adminUser = await createTestAdminUser(admin.rawEmail, admin.rawPassword)
    const contributorUser = await createTestContributorUser(
      contributor.rawEmail,
      contributor.rawPassword
    )
    userId = user.id
    adminId = adminUser.id
    contributorId = contributorUser.id
    userToken = await login(client, toto.rawEmail, toto.rawPassword)
    adminToken = await login(client, admin.rawEmail, admin.rawPassword)
    contributorToken = await login(client, contributor.rawEmail, contributor.rawPassword)
    // give the reviewer a username so the public reviews join doesn't drop the row
    await setProfile(userId, { username: 'reviewer-pub' })
  })

  function publicReviews(slug: string) {
    return expectOk(client.products[':slug'].reviews.public.$get({ param: { slug } }))
  }

  it('hides a review from /products/:slug/reviews/public and restores it', async () => {
    const { productSlug, reviewId } = await setupProductAndReview({ userId })

    expect((await publicReviews(productSlug)).reviews.length).toBe(1)

    const hideBody = await expectOk(
      client.admin.moderation.reviews[':id'].$patch(
        {
          param: { id: reviewId },
          json: { status: 'hidden', reason: 'abuse' },
        },
        withAuth(adminToken)
      )
    )
    expect(hideBody.moderationStatus).toBe('hidden')
    expect(hideBody.moderationReason).toBe('abuse')

    expect((await publicReviews(productSlug)).reviews.length).toBe(0)

    // Restore: row reappears
    const restore = await client.admin.moderation.reviews[':id'].$patch(
      {
        param: { id: reviewId },
        json: { status: 'visible' },
      },
      withAuth(adminToken)
    )
    expect(restore.status).toBe(HTTP_STATUS.OK)

    expect((await publicReviews(productSlug)).reviews.length).toBe(1)
  })

  it('hides a discussion thread from listThreads (product slug)', async () => {
    const product = await seedProduct(userId, { name: 'Thread Serum', brand: 'ThreadBrand' })
    const threadId = await seedThread(product.id, userId, 'Visible thread', 'hi')

    const before = await expectOk(
      client.products[':slug'].discussions.$get(
        { param: { slug: product.slug } },
        withAuth(userToken)
      )
    )
    expect(before.length).toBeGreaterThanOrEqual(1)

    const hide = await client.admin.moderation.threads[':id'].$patch(
      { param: { id: threadId }, json: { status: 'hidden', reason: 'spam' } },
      withAuth(adminToken)
    )
    expect(hide.status).toBe(HTTP_STATUS.OK)

    const after = await expectOk(
      client.products[':slug'].discussions.$get(
        { param: { slug: product.slug } },
        withAuth(userToken)
      )
    )
    expect(after.some((t) => t.id === threadId)).toBe(false)
  })

  it('hides a discussion reply from the thread detail', async () => {
    const product = await seedProduct(userId, { name: 'Reply Serum', brand: 'ReplyBrand' })
    const threadId = await seedThread(product.id, userId, 'Thread with reply', 'hi')
    const replyId = await seedReply(threadId, userId, 'visible reply')

    const before = await expectOk(
      client.products[':slug'].discussions[':threadId'].$get(
        { param: { slug: product.slug, threadId } },
        withAuth(userToken)
      )
    )
    expect(before.replies.length).toBe(1)

    const hide = await client.admin.moderation.replies[':id'].$patch(
      { param: { id: replyId }, json: { status: 'hidden' } },
      withAuth(adminToken)
    )
    expect(hide.status).toBe(HTTP_STATUS.OK)

    const after = await expectOk(
      client.products[':slug'].discussions[':threadId'].$get(
        { param: { slug: product.slug, threadId } },
        withAuth(userToken)
      )
    )
    expect(after.replies.length).toBe(0)
  })

  it('plain user (role=user) gets 403 on all 3 content moderation endpoints', async () => {
    const reviewRes = await client.admin.moderation.reviews[':id'].$patch(
      { param: { id: GHOST_ID }, json: { status: 'hidden' } },
      withAuth(userToken)
    )
    expectStatus(reviewRes, HTTP_STATUS.FORBIDDEN)

    const threadRes = await client.admin.moderation.threads[':id'].$patch(
      { param: { id: GHOST_ID }, json: { status: 'hidden' } },
      withAuth(userToken)
    )
    expectStatus(threadRes, HTTP_STATUS.FORBIDDEN)

    const replyRes = await client.admin.moderation.replies[':id'].$patch(
      { param: { id: GHOST_ID }, json: { status: 'hidden' } },
      withAuth(userToken)
    )
    expectStatus(replyRes, HTTP_STATUS.FORBIDDEN)
  })

  // Contributors can use the reversible content moderation subset.
  // The review path also proves the new user_product_reviews
  // RLS policy fires under app.role='contributor' (else the UPDATE touches 0 rows, so 404).
  it('contributor hides a review (200) and it drops from public reviews', async () => {
    const { productSlug, reviewId } = await setupProductAndReview({ userId })

    const hideBody = await expectOk(
      client.admin.moderation.reviews[':id'].$patch(
        { param: { id: reviewId }, json: { status: 'hidden', reason: 'spam' } },
        withAuth(contributorToken)
      )
    )
    expect(hideBody.moderationStatus).toBe('hidden')

    expect((await publicReviews(productSlug)).reviews.length).toBe(0)

    const [row] = await testDb
      .select({ moderatedBy: userProductReviews.moderatedBy })
      .from(userProductReviews)
      .where(eq(userProductReviews.id, reviewId))
    expect(row?.moderatedBy).toBe(contributorId)
  })

  it('contributor hides a thread and a reply (200)', async () => {
    const product = await seedProduct(userId, { name: 'Modo Thread Serum' })
    const threadId = await seedThread(product.id, userId)
    const replyId = await seedReply(threadId, userId)

    const hideThread = await client.admin.moderation.threads[':id'].$patch(
      { param: { id: threadId }, json: { status: 'hidden' } },
      withAuth(contributorToken)
    )
    expect(hideThread.status).toBe(HTTP_STATUS.OK)

    const hideReply = await client.admin.moderation.replies[':id'].$patch(
      { param: { id: replyId }, json: { status: 'hidden' } },
      withAuth(contributorToken)
    )
    expect(hideReply.status).toBe(HTTP_STATUS.OK)
  })

  it('contributor GET preview review (200): owns the queue, can inspect', async () => {
    const { reviewId } = await setupProductAndReview({ userId })
    const res = await client.admin.moderation.reviews[':id'].$get(
      { param: { id: reviewId } },
      withAuth(contributorToken)
    )
    expect(res.status).toBe(HTTP_STATUS.OK)
  })

  // Admin-only / irreversible subset stays closed to contributor in S1.
  it('contributor gets 403 on force-private (account-level, admin-only)', async () => {
    const res = await client.admin.moderation.profiles[':userId'].visibility.$patch(
      { param: { userId: ANY_USER_ID }, json: { forcedPrivate: true } },
      withAuth(contributorToken)
    )
    expectStatus(res, HTTP_STATUS.FORBIDDEN)
  })

  // Catalog-sheet hide opens to moderators. The route guard + service persistence
  // are proven here; the RLS public-absence
  // (anon/user can't SELECT hidden, contributor can) lives in catalog-rls.test.ts:
  // this harness runs as the table owner and bypasses RLS.
  it('contributor hides a product sheet (200) and restores it', async () => {
    const product = await seedProduct(userId, { name: 'Spam Serum', brand: 'SpamBrand' })

    const hideBody = await expectOk(
      client.admin.moderation.products[':id'].$patch(
        { param: { id: product.id }, json: { status: 'hidden', reason: 'spam' } },
        withAuth(contributorToken)
      )
    )
    expect(hideBody.moderationStatus).toBe('hidden')

    const [hidden] = await testDb
      .select({ status: products.moderationStatus, moderatedBy: products.moderatedBy })
      .from(products)
      .where(eq(products.id, product.id))
    expect(hidden?.status).toBe('hidden')
    expect(hidden?.moderatedBy).toBe(contributorId)

    const restore = await client.admin.moderation.products[':id'].$patch(
      { param: { id: product.id }, json: { status: 'visible' } },
      withAuth(contributorToken)
    )
    expect(restore.status).toBe(HTTP_STATUS.OK)
    const [restored] = await testDb
      .select({ status: products.moderationStatus })
      .from(products)
      .where(eq(products.id, product.id))
    expect(restored?.status).toBe('visible')
  })

  it('contributor hides an ingredient sheet (200)', async () => {
    const ingredient = await seedIngredient(userId, 'Spam Acid')

    const hideBody = await expectOk(
      client.admin.moderation.ingredients[':id'].$patch(
        { param: { id: ingredient.id }, json: { status: 'hidden', reason: 'spam' } },
        withAuth(contributorToken)
      )
    )
    expect(hideBody.moderationStatus).toBe('hidden')

    const [hidden] = await testDb
      .select({ status: ingredients.moderationStatus, moderatedBy: ingredients.moderatedBy })
      .from(ingredients)
      .where(eq(ingredients.id, ingredient.id))
    expect(hidden?.status).toBe('hidden')
    expect(hidden?.moderatedBy).toBe(contributorId)
  })

  it('plain user (role=user) gets 403 on product + ingredient hide', async () => {
    const productRes = await client.admin.moderation.products[':id'].$patch(
      { param: { id: GHOST_ID }, json: { status: 'hidden' } },
      withAuth(userToken)
    )
    expectStatus(productRes, HTTP_STATUS.FORBIDDEN)

    const ingredientRes = await client.admin.moderation.ingredients[':id'].$patch(
      { param: { id: GHOST_ID }, json: { status: 'hidden' } },
      withAuth(userToken)
    )
    expectStatus(ingredientRes, HTTP_STATUS.FORBIDDEN)
  })

  // The moderator previews a reported sheet (even hidden) before deciding;
  // mirrors the review/thread/reply preview path.
  it('contributor GET preview product (200) returns the sheet even when hidden', async () => {
    const product = await seedProduct(userId, {
      name: 'Preview Spam',
      brand: 'PrevBrand',
      moderationStatus: 'hidden',
      moderationReason: 'ad',
    })
    await setProfile(userId, { username: 'preview-author' })

    const body = await expectOk(
      client.admin.moderation.products[':id'].$get(
        { param: { id: product.id } },
        withAuth(contributorToken)
      )
    )
    if (body.kind !== 'product') throw new Error('expected product kind')
    expect(body.name).toBe('Preview Spam')
    expect(body.brand).toBe('PrevBrand')
    expect(body.moderationStatus).toBe('hidden')
    expect(body.authorUsername).toBe('preview-author')
  })

  it('admin GET preview ingredient (200)', async () => {
    const ingredient = await seedIngredient(userId, 'Preview Acid')

    const body = await expectOk(
      client.admin.moderation.ingredients[':id'].$get(
        { param: { id: ingredient.id } },
        withAuth(adminToken)
      )
    )
    if (body.kind !== 'ingredient') throw new Error('expected ingredient kind')
    expect(body.name).toBe('Preview Acid')
  })

  it('plain user GET preview product → 403', async () => {
    const res = await client.admin.moderation.products[':id'].$get(
      { param: { id: '019d0000-0000-7000-8000-00000000abcd' } },
      withAuth(userToken)
    )
    expectStatus(res, HTTP_STATUS.FORBIDDEN)
  })

  it('returns 404 when targeting a non-existing review', async () => {
    const ghost = '019d0000-0000-7000-8000-000000000bad'
    const res = await client.admin.moderation.reviews[':id'].$patch(
      { param: { id: ghost }, json: { status: 'hidden' } },
      withAuth(adminToken)
    )
    expectStatus(res, HTTP_STATUS.NOT_FOUND)
  })

  it('rejects whitespace-only reason via zod trim().min(1)', async () => {
    const { reviewId } = await setupProductAndReview({ userId })
    const res = await client.admin.moderation.reviews[':id'].$patch(
      { param: { id: reviewId }, json: { status: 'hidden', reason: '   ' } },
      withAuth(adminToken)
    )
    expectStatus(res, HTTP_STATUS.BAD_REQUEST)
  })

  it('force-private profile hides /u/:username and clears on restore', async () => {
    // Set username + flip public so the route returns a row when not force-private
    await setProfile(userId, { username: 'targetable-user', profilePublic: true, bio: 'hello' })

    const before = await client.profiles[':username'].public.$get({
      param: { username: 'targetable-user' },
    })
    expect(before.status).toBe(HTTP_STATUS.OK)

    const hideBody = await expectOk(
      client.admin.moderation.profiles[':userId'].visibility.$patch(
        { param: { userId }, json: { forcedPrivate: true, reason: 'abuse' } },
        withAuth(adminToken)
      )
    )
    expect(hideBody.forcedPrivateByAdmin).toBe(true)
    expect(hideBody.forcedPrivateReason).toBe('abuse')

    const after = await client.profiles[':username'].public.$get({
      param: { username: 'targetable-user' },
    })
    expectStatus(after, HTTP_STATUS.NOT_FOUND)

    const unhideBody = await expectOk(
      client.admin.moderation.profiles[':userId'].visibility.$patch(
        { param: { userId }, json: { forcedPrivate: false } },
        withAuth(adminToken)
      )
    )
    expect(unhideBody.forcedPrivateByAdmin).toBe(false)
    expect(unhideBody.forcedPrivateReason).toBeNull()

    const restored = await client.profiles[':username'].public.$get({
      param: { username: 'targetable-user' },
    })
    expect(restored.status).toBe(HTTP_STATUS.OK)
  })

  it('force-private also drops the user public reviews from the list', async () => {
    await setProfile(userId, { username: 'fp-reviewer' })
    const { productSlug } = await setupProductAndReview({ userId })

    expect((await publicReviews(productSlug)).reviews.length).toBe(1)

    await client.admin.moderation.profiles[':userId'].visibility.$patch(
      { param: { userId }, json: { forcedPrivate: true } },
      withAuth(adminToken)
    )

    // innerJoin profiles drops the review when the pseudonym policy stops matching.
    expect((await publicReviews(productSlug)).reviews.length).toBe(0)
  })

  it('force-private non-admin → 403', async () => {
    const res = await client.admin.moderation.profiles[':userId'].visibility.$patch(
      { param: { userId: ANY_USER_ID }, json: { forcedPrivate: true } },
      withAuth(userToken)
    )
    expectStatus(res, HTTP_STATUS.FORBIDDEN)
  })

  it('force-private 404 when target profile row does not exist', async () => {
    const ghost = '019d0000-0000-7000-8000-00000000bad1'
    const res = await client.admin.moderation.profiles[':userId'].visibility.$patch(
      { param: { userId: ghost }, json: { forcedPrivate: true } },
      withAuth(adminToken)
    )
    expectStatus(res, HTTP_STATUS.NOT_FOUND)
  })

  it('admin GET preview returns content even when moderation_status=hidden', async () => {
    const { reviewId } = await setupProductAndReview({ userId })
    // hide first
    await client.admin.moderation.reviews[':id'].$patch(
      { param: { id: reviewId }, json: { status: 'hidden', reason: 'abuse' } },
      withAuth(adminToken)
    )

    const body = await expectOk(
      client.admin.moderation.reviews[':id'].$get({ param: { id: reviewId } }, withAuth(adminToken))
    )
    expect(body.kind).toBe('review')
    expect(body.moderationStatus).toBe('hidden')
    expect(body.moderationReason).toBe('abuse')
    if (body.kind === 'review') {
      expect(body.comment).toBe('public test review')
    }
  })

  it('admin GET preview thread + reply', async () => {
    const product = await seedProduct(userId, { name: 'Preview Serum', brand: 'PreviewBrand' })
    const threadId = await seedThread(product.id, userId, 'Preview thread', 'hello')
    const replyId = await seedReply(threadId, userId, 'reply body')

    const thread = await expectOk(
      client.admin.moderation.threads[':id'].$get({ param: { id: threadId } }, withAuth(adminToken))
    )
    if (thread.kind !== 'thread') throw new Error('expected thread kind')
    expect(thread.title).toBe('Preview thread')

    const reply = await expectOk(
      client.admin.moderation.replies[':id'].$get({ param: { id: replyId } }, withAuth(adminToken))
    )
    if (reply.kind !== 'reply') throw new Error('expected reply kind')
    expect(reply.content).toBe('reply body')
  })

  it('admin GET preview 404 when target missing', async () => {
    const ghost = '019d0000-0000-7000-8000-000000000fff'
    const res = await client.admin.moderation.reviews[':id'].$get(
      { param: { id: ghost } },
      withAuth(adminToken)
    )
    expectStatus(res, HTTP_STATUS.NOT_FOUND)
  })

  it('non-admin GET preview → 403', async () => {
    const res = await client.admin.moderation.reviews[':id'].$get(
      { param: { id: '019d0000-0000-7000-8000-00000000abcd' } },
      withAuth(userToken)
    )
    expectStatus(res, HTTP_STATUS.FORBIDDEN)
  })

  it('records moderatedBy + moderatedAt on the row', async () => {
    const { reviewId } = await setupProductAndReview({ userId })
    const before = Date.now()
    await client.admin.moderation.reviews[':id'].$patch(
      { param: { id: reviewId }, json: { status: 'hidden', reason: 'check audit' } },
      withAuth(adminToken)
    )

    const [row] = await testDb
      .select({
        moderatedBy: userProductReviews.moderatedBy,
        moderatedAt: userProductReviews.moderatedAt,
        moderationReason: userProductReviews.moderationReason,
      })
      .from(userProductReviews)
      .where(eq(userProductReviews.id, reviewId))

    expect(row?.moderatedBy).toBe(adminId)
    expect(row?.moderationReason).toBe('check audit')
    expect(row?.moderatedAt && Date.parse(row.moderatedAt)).toBeGreaterThanOrEqual(before)
  })
})

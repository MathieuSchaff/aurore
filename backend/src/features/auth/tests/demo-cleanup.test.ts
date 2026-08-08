import { describe, expect, it } from 'bun:test'

import { eq } from 'drizzle-orm'

import {
  contentReports,
  discussionReplies,
  discussionThreads,
  ingredientEdits,
  ingredients,
  productEdits,
  products,
  socialPostReplies,
  socialPosts,
  socialReactions,
  suggestedEdits,
  userProductReviews,
  userProducts,
  users,
} from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestIngredient, createTestProduct } from '../../../tests/helpers/test-factories'
import { sweepExpiredDemos } from '../demo-cleanup'

setupDbTests()

const insertUser = async (overrides: Partial<typeof users.$inferInsert>): Promise<string> => {
  const [row] = await testDb
    .insert(users)
    .values({
      email: `${crypto.randomUUID()}@demo.local`,
      passwordHash: null,
      isDemo: false,
      ...overrides,
    })
    .returning({ id: users.id })
  if (!row) throw new Error('insert failed')
  return row.id
}

describe('sweepExpiredDemos', () => {
  it('deletes expired demos, keeps fresh demos and real users', async () => {
    const past = new Date(Date.now() - 60_000).toISOString()
    const future = new Date(Date.now() + 60_000).toISOString()

    const expiredId = await insertUser({ isDemo: true, expiresAt: past })
    const freshId = await insertUser({ isDemo: true, expiresAt: future })
    const realId = await insertUser({ isDemo: false, expiresAt: null })

    const count = await sweepExpiredDemos()
    expect(count).toBe(1)

    const remaining = await testDb.select({ id: users.id }).from(users)
    const ids = remaining.map((r) => r.id)
    expect(ids).not.toContain(expiredId)
    expect(ids).toContain(freshId)
    expect(ids).toContain(realId)
  })

  it('deletes an expired demo that edited shared catalog entries', async () => {
    const expiredId = await insertUser({
      isDemo: true,
      expiresAt: new Date(Date.now() - 60_000).toISOString(),
    })
    const ownerId = await insertUser({ isDemo: false, expiresAt: null })
    const product = await createTestProduct(ownerId, { name: 'Shared demo cleanup product' })
    const ingredient = await createTestIngredient(ownerId, {
      name: 'Shared demo cleanup ingredient',
    })

    await testDb.insert(productEdits).values({
      productId: product.id,
      editedBy: expiredId,
      changes: { name: { old: product.name, new: 'Edited by demo' } },
    })
    await testDb.insert(ingredientEdits).values({
      ingredientId: ingredient.id,
      editedBy: expiredId,
      changes: { name: { old: ingredient.name, new: 'Edited by demo' } },
    })

    expect(await sweepExpiredDemos()).toBe(1)

    expect(await testDb.select().from(users)).not.toContainEqual(
      expect.objectContaining({ id: expiredId })
    )
    expect(await testDb.select().from(productEdits)).toHaveLength(0)
    expect(await testDb.select().from(ingredientEdits)).toHaveLength(0)
  })

  it('deletes public content and catalog entries attributable to an expired demo', async () => {
    const expiredId = await insertUser({
      isDemo: true,
      expiresAt: new Date(Date.now() - 60_000).toISOString(),
    })
    const ownerId = await insertUser({ isDemo: false, expiresAt: null })
    const sharedProduct = await createTestProduct(ownerId, { name: 'Shared cleanup product' })
    const sharedIngredient = await createTestIngredient(ownerId, {
      name: 'Shared cleanup ingredient',
    })
    const demoProduct = await createTestProduct(
      expiredId,
      { name: 'Demo-owned cleanup product' },
      'user'
    )
    const demoIngredient = await createTestIngredient(
      expiredId,
      { name: 'Demo-owned cleanup ingredient' },
      'user'
    )

    const [survivingPost, demoPost, anchoredPost] = await testDb
      .insert(socialPosts)
      .values([
        {
          authorId: ownerId,
          tone: 'principal',
          content: 'Surviving post',
          productId: sharedProduct.id,
        },
        {
          authorId: expiredId,
          tone: 'principal',
          content: 'Demo post',
          productId: sharedProduct.id,
        },
        {
          authorId: ownerId,
          tone: 'principal',
          content: 'Post anchored to demo product',
          productId: demoProduct.id,
        },
      ])
      .returning({ id: socialPosts.id })
    if (!survivingPost || !demoPost || !anchoredPost) throw new Error('post insert failed')

    const [demoPostReply, replyToDemoPost] = await testDb
      .insert(socialPostReplies)
      .values([
        { postId: survivingPost.id, authorId: expiredId, content: 'Demo reply' },
        { postId: demoPost.id, authorId: ownerId, content: 'Reply to demo post' },
      ])
      .returning({ id: socialPostReplies.id })
    if (!demoPostReply || !replyToDemoPost) throw new Error('post reply insert failed')

    const [survivingThread, demoThread, anchoredThread] = await testDb
      .insert(discussionThreads)
      .values([
        {
          ingredientId: sharedIngredient.id,
          authorId: ownerId,
          title: 'Surviving thread',
          content: 'Surviving thread content',
        },
        {
          productId: sharedProduct.id,
          authorId: expiredId,
          title: 'Demo thread',
          content: 'Demo thread content',
        },
        {
          ingredientId: demoIngredient.id,
          authorId: ownerId,
          title: 'Thread anchored to demo ingredient',
          content: 'Anchored thread content',
        },
      ])
      .returning({ id: discussionThreads.id })
    if (!survivingThread || !demoThread || !anchoredThread) {
      throw new Error('thread insert failed')
    }

    const [demoThreadReply, replyToDemoThread] = await testDb
      .insert(discussionReplies)
      .values([
        { threadId: survivingThread.id, authorId: expiredId, content: 'Demo thread reply' },
        { threadId: demoThread.id, authorId: ownerId, content: 'Reply to demo thread' },
      ])
      .returning({ id: discussionReplies.id })
    if (!demoThreadReply || !replyToDemoThread) throw new Error('thread reply insert failed')

    await testDb.insert(socialReactions).values([
      {
        reactableType: 'post',
        reactableId: survivingPost.id,
        userId: expiredId,
        kind: 'merci',
      },
      {
        reactableType: 'post',
        reactableId: demoPost.id,
        userId: ownerId,
        kind: 'merci',
      },
      {
        reactableType: 'post_reply',
        reactableId: demoPostReply.id,
        userId: ownerId,
        kind: 'soutien',
      },
      {
        reactableType: 'thread',
        reactableId: demoThread.id,
        userId: ownerId,
        kind: 'moi-aussi',
      },
      {
        reactableType: 'thread_reply',
        reactableId: demoThreadReply.id,
        userId: ownerId,
        kind: 'soutien',
      },
    ])
    await testDb.insert(suggestedEdits).values({
      proposerId: ownerId,
      targetType: 'product',
      targetId: demoProduct.id,
      field: 'name',
      proposedValue: 'New name',
    })
    await testDb.insert(contentReports).values({
      reporterId: ownerId,
      targetType: 'ingredient',
      targetId: demoIngredient.id,
      reason: 'Demo-owned target',
    })

    expect(await sweepExpiredDemos()).toBe(1)

    expect(await testDb.select().from(users).where(eq(users.id, expiredId))).toHaveLength(0)
    expect(
      await testDb.select().from(products).where(eq(products.id, demoProduct.id))
    ).toHaveLength(0)
    expect(
      await testDb.select().from(ingredients).where(eq(ingredients.id, demoIngredient.id))
    ).toHaveLength(0)
    expect(await testDb.select().from(socialPosts)).toEqual([
      expect.objectContaining({ id: survivingPost.id }),
    ])
    expect(await testDb.select().from(socialPostReplies)).toHaveLength(0)
    expect(await testDb.select().from(discussionThreads)).toEqual([
      expect.objectContaining({ id: survivingThread.id }),
    ])
    expect(await testDb.select().from(discussionReplies)).toHaveLength(0)
    expect(await testDb.select().from(socialReactions)).toHaveLength(0)
    expect(await testDb.select().from(suggestedEdits)).toHaveLength(0)
    expect(await testDb.select().from(contentReports)).toHaveLength(0)
  })

  it('deletes reports targeting reviews cascaded with a demo-owned product', async () => {
    const expiredId = await insertUser({
      isDemo: true,
      expiresAt: new Date(Date.now() - 60_000).toISOString(),
    })
    const reviewerId = await insertUser({ isDemo: false, expiresAt: null })
    const demoProduct = await createTestProduct(
      expiredId,
      { name: 'Demo product reviewed by another user' },
      'user'
    )

    const [userProduct] = await testDb
      .insert(userProducts)
      .values({ userId: reviewerId, productId: demoProduct.id })
      .returning({ id: userProducts.id })
    if (!userProduct) throw new Error('user product insert failed')

    const [review] = await testDb
      .insert(userProductReviews)
      .values({ userProductId: userProduct.id, comment: 'Third-party review', isPublic: true })
      .returning({ id: userProductReviews.id })
    if (!review) throw new Error('review insert failed')

    await testDb.insert(contentReports).values({
      reporterId: reviewerId,
      targetType: 'review',
      targetId: review.id,
      reason: 'Report attached to a cascading review',
    })

    expect(await sweepExpiredDemos()).toBe(1)
    expect(
      await testDb.select().from(userProductReviews).where(eq(userProductReviews.id, review.id))
    ).toHaveLength(0)
    expect(
      await testDb.select().from(contentReports).where(eq(contentReports.targetId, review.id))
    ).toHaveLength(0)
  })
})

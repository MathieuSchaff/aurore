import type { EditTargetType, ReactableType, ReportTargetType } from '@aurore/shared'

import { and, eq } from 'drizzle-orm'

import type { DatabaseTransaction, DbOrTransaction } from '../db'
import {
  discussionReplies,
  discussionThreads,
  ingredients,
  products,
  profiles,
  socialPostReplies,
  socialPosts,
  userProductReviews,
  users,
} from '../db/schema'

type PolymorphicTargetType = EditTargetType | ReactableType | ReportTargetType

export async function isPolymorphicTargetVisible(
  db: DbOrTransaction,
  type: PolymorphicTargetType,
  id: string
): Promise<boolean> {
  switch (type) {
    case 'product': {
      const [row] = await db
        .select({ id: products.id })
        .from(products)
        .where(and(eq(products.id, id), eq(products.moderationStatus, 'visible')))
      return Boolean(row)
    }
    case 'ingredient': {
      const [row] = await db
        .select({ id: ingredients.id })
        .from(ingredients)
        .where(and(eq(ingredients.id, id), eq(ingredients.moderationStatus, 'visible')))
      return Boolean(row)
    }
    case 'review': {
      const [row] = await db
        .select({ id: userProductReviews.id })
        .from(userProductReviews)
        .where(
          and(
            eq(userProductReviews.id, id),
            eq(userProductReviews.isPublic, true),
            eq(userProductReviews.moderationStatus, 'visible')
          )
        )
      return Boolean(row)
    }
    case 'profile': {
      const [row] = await db
        .select({ id: profiles.userId })
        .from(profiles)
        .where(and(eq(profiles.userId, id), eq(profiles.forcedPrivateByAdmin, false)))
      return Boolean(row)
    }
    case 'post': {
      const [row] = await db
        .select({ id: socialPosts.id })
        .from(socialPosts)
        .where(and(eq(socialPosts.id, id), eq(socialPosts.moderationStatus, 'visible')))
      return Boolean(row)
    }
    case 'thread': {
      const [row] = await db
        .select({ id: discussionThreads.id })
        .from(discussionThreads)
        .where(and(eq(discussionThreads.id, id), eq(discussionThreads.moderationStatus, 'visible')))
      return Boolean(row)
    }
    case 'post_reply': {
      const [row] = await db
        .select({ id: socialPostReplies.id })
        .from(socialPostReplies)
        .innerJoin(socialPosts, eq(socialPosts.id, socialPostReplies.postId))
        .where(
          and(
            eq(socialPostReplies.id, id),
            eq(socialPostReplies.moderationStatus, 'visible'),
            eq(socialPosts.moderationStatus, 'visible')
          )
        )
      return Boolean(row)
    }
    case 'reply':
    case 'thread_reply': {
      const [row] = await db
        .select({ id: discussionReplies.id })
        .from(discussionReplies)
        .innerJoin(discussionThreads, eq(discussionThreads.id, discussionReplies.threadId))
        .where(
          and(
            eq(discussionReplies.id, id),
            eq(discussionReplies.moderationStatus, 'visible'),
            eq(discussionThreads.moderationStatus, 'visible')
          )
        )
      return Boolean(row)
    }
  }
}

async function lockPostReply(tx: DatabaseTransaction, id: string): Promise<boolean> {
  const [candidate] = await tx
    .select({ parentId: socialPostReplies.postId })
    .from(socialPostReplies)
    .where(and(eq(socialPostReplies.id, id), eq(socialPostReplies.moderationStatus, 'visible')))
  if (!candidate) return false

  const [parent] = await tx
    .select({ id: socialPosts.id })
    .from(socialPosts)
    .where(and(eq(socialPosts.id, candidate.parentId), eq(socialPosts.moderationStatus, 'visible')))
    .for('key share', { of: socialPosts })
  if (!parent) return false

  const [reply] = await tx
    .select({ id: socialPostReplies.id })
    .from(socialPostReplies)
    .where(
      and(
        eq(socialPostReplies.id, id),
        eq(socialPostReplies.postId, parent.id),
        eq(socialPostReplies.moderationStatus, 'visible')
      )
    )
    .for('key share', { of: socialPostReplies })
  return Boolean(reply)
}

async function lockDiscussionReply(tx: DatabaseTransaction, id: string): Promise<boolean> {
  const [candidate] = await tx
    .select({ parentId: discussionReplies.threadId })
    .from(discussionReplies)
    .where(and(eq(discussionReplies.id, id), eq(discussionReplies.moderationStatus, 'visible')))
  if (!candidate) return false

  const [parent] = await tx
    .select({ id: discussionThreads.id })
    .from(discussionThreads)
    .where(
      and(
        eq(discussionThreads.id, candidate.parentId),
        eq(discussionThreads.moderationStatus, 'visible')
      )
    )
    .for('key share', { of: discussionThreads })
  if (!parent) return false

  const [reply] = await tx
    .select({ id: discussionReplies.id })
    .from(discussionReplies)
    .where(
      and(
        eq(discussionReplies.id, id),
        eq(discussionReplies.threadId, parent.id),
        eq(discussionReplies.moderationStatus, 'visible')
      )
    )
    .for('key share', { of: discussionReplies })
  return Boolean(reply)
}

// A polymorphic reference has no FK to arbitrate target deletion. KEY SHARE is
// the narrowest row lock that conflicts with DELETE; it remains held until the
// caller's transaction commits. For a reply, the parent is locked before the reply.
export async function lockVisiblePolymorphicTarget(
  tx: DatabaseTransaction,
  type: PolymorphicTargetType,
  id: string
): Promise<boolean> {
  switch (type) {
    case 'product': {
      const [row] = await tx
        .select({ id: products.id })
        .from(products)
        .where(and(eq(products.id, id), eq(products.moderationStatus, 'visible')))
        .for('key share', { of: products })
      return Boolean(row)
    }
    case 'ingredient': {
      const [row] = await tx
        .select({ id: ingredients.id })
        .from(ingredients)
        .where(and(eq(ingredients.id, id), eq(ingredients.moderationStatus, 'visible')))
        .for('key share', { of: ingredients })
      return Boolean(row)
    }
    case 'review': {
      const [row] = await tx
        .select({ id: userProductReviews.id })
        .from(userProductReviews)
        .where(
          and(
            eq(userProductReviews.id, id),
            eq(userProductReviews.isPublic, true),
            eq(userProductReviews.moderationStatus, 'visible')
          )
        )
        .for('key share', { of: userProductReviews })
      return Boolean(row)
    }
    case 'profile': {
      const [row] = await tx
        .select({ id: users.id })
        .from(users)
        .innerJoin(profiles, eq(profiles.userId, users.id))
        .where(and(eq(users.id, id), eq(profiles.forcedPrivateByAdmin, false)))
        .for('key share', { of: users })
      return Boolean(row)
    }
    case 'post': {
      const [row] = await tx
        .select({ id: socialPosts.id })
        .from(socialPosts)
        .where(and(eq(socialPosts.id, id), eq(socialPosts.moderationStatus, 'visible')))
        .for('key share', { of: socialPosts })
      return Boolean(row)
    }
    case 'thread': {
      const [row] = await tx
        .select({ id: discussionThreads.id })
        .from(discussionThreads)
        .where(and(eq(discussionThreads.id, id), eq(discussionThreads.moderationStatus, 'visible')))
        .for('key share', { of: discussionThreads })
      return Boolean(row)
    }
    case 'post_reply':
      return lockPostReply(tx, id)
    case 'reply':
    case 'thread_reply':
      return lockDiscussionReply(tx, id)
  }
}

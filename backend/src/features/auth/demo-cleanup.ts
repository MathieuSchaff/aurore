import type { EditTargetType, ReactableType, ReportTargetType } from '@aurore/shared'

import { and, eq, inArray, lt, or, type SQL, sql } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../db'
import { withAdminRls } from '../../db/rls'
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
} from '../../db/schema'
import { logger } from '../../lib/logger'
import { isUserBanned } from './ban.service'

type DemoCleanupTargets = {
  userIds: string[]
  productIds: string[]
  ingredientIds: string[]
  userProductIds: string[]
  reviewIds: string[]
  postIds: string[]
  postReplyIds: string[]
  threadIds: string[]
  threadReplyIds: string[]
}

export type DeleteAccountResult =
  | { status: 'deleted' }
  | { status: 'banned'; expiresAt: string | null; reason: string | null }

const rowIds = <T extends { id: string }>(rows: T[]): string[] => rows.map((row) => row.id)

function required(condition: SQL | undefined): SQL {
  if (!condition) throw new Error('at least one cleanup condition is required')
  return condition
}

function andAll(first: SQL, ...rest: SQL[]): SQL {
  return required(and(first, ...rest))
}

function entries<K extends string, V>(record: Record<K, V>): [K, V][] {
  return Object.entries(record) as [K, V][]
}

function targetScopes<K extends string>(
  targets: Record<K, string[]>,
  condition: (type: K, ids: string[]) => SQL
): SQL[] {
  return entries(targets).flatMap(([type, ids]) => (ids.length > 0 ? [condition(type, ids)] : []))
}

async function lockDemoUsers(tx: DatabaseTransaction, condition: SQL): Promise<string[]> {
  return rowIds(
    await tx
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.isDemo, true), condition))
      .orderBy(users.id)
      .for('update')
  )
}

async function collectCleanupTargets(
  tx: DatabaseTransaction,
  userIds: string[]
): Promise<DemoCleanupTargets> {
  const productIds = rowIds(
    await tx
      .select({ id: products.id })
      .from(products)
      .where(inArray(products.createdBy, userIds))
      .orderBy(products.id)
      .for('update')
  )
  const ingredientIds = rowIds(
    await tx
      .select({ id: ingredients.id })
      .from(ingredients)
      .where(inArray(ingredients.createdBy, userIds))
      .orderBy(ingredients.id)
      .for('update')
  )

  const userProductIds = rowIds(
    await tx
      .select({ id: userProducts.id })
      .from(userProducts)
      .where(
        required(
          or(
            inArray(userProducts.userId, userIds),
            productIds.length > 0 ? inArray(userProducts.productId, productIds) : undefined
          )
        )
      )
      .orderBy(userProducts.id)
      .for('update')
  )
  const reviewIds =
    userProductIds.length === 0
      ? []
      : rowIds(
          await tx
            .select({ id: userProductReviews.id })
            .from(userProductReviews)
            .where(inArray(userProductReviews.userProductId, userProductIds))
            .orderBy(userProductReviews.id)
            .for('update')
        )

  const postIds = rowIds(
    await tx
      .select({ id: socialPosts.id })
      .from(socialPosts)
      .where(
        required(
          or(
            inArray(socialPosts.authorId, userIds),
            productIds.length > 0 ? inArray(socialPosts.productId, productIds) : undefined,
            ingredientIds.length > 0 ? inArray(socialPosts.ingredientId, ingredientIds) : undefined
          )
        )
      )
      .orderBy(socialPosts.id)
      .for('update')
  )
  const postReplyIds = rowIds(
    await tx
      .select({ id: socialPostReplies.id })
      .from(socialPostReplies)
      .where(
        required(
          or(
            inArray(socialPostReplies.authorId, userIds),
            postIds.length > 0 ? inArray(socialPostReplies.postId, postIds) : undefined
          )
        )
      )
      .orderBy(socialPostReplies.id)
      .for('update')
  )

  const threadIds = rowIds(
    await tx
      .select({ id: discussionThreads.id })
      .from(discussionThreads)
      .where(
        required(
          or(
            inArray(discussionThreads.authorId, userIds),
            productIds.length > 0 ? inArray(discussionThreads.productId, productIds) : undefined,
            ingredientIds.length > 0
              ? inArray(discussionThreads.ingredientId, ingredientIds)
              : undefined
          )
        )
      )
      .orderBy(discussionThreads.id)
      .for('update')
  )
  const threadReplyIds = rowIds(
    await tx
      .select({ id: discussionReplies.id })
      .from(discussionReplies)
      .where(
        required(
          or(
            inArray(discussionReplies.authorId, userIds),
            threadIds.length > 0 ? inArray(discussionReplies.threadId, threadIds) : undefined
          )
        )
      )
      .orderBy(discussionReplies.id)
      .for('update')
  )

  return {
    userIds,
    productIds,
    ingredientIds,
    userProductIds,
    reviewIds,
    postIds,
    postReplyIds,
    threadIds,
    threadReplyIds,
  }
}

async function deletePolymorphicDependants(
  tx: DatabaseTransaction,
  targets: DemoCleanupTargets
): Promise<void> {
  const reportTargets = {
    review: targets.reviewIds,
    thread: targets.threadIds,
    reply: targets.threadReplyIds,
    profile: targets.userIds,
    product: targets.productIds,
    ingredient: targets.ingredientIds,
  } satisfies Record<ReportTargetType, string[]>
  const reportScopes = targetScopes(reportTargets, (type, ids) =>
    andAll(eq(contentReports.targetType, type), inArray(contentReports.targetId, ids))
  )
  if (reportScopes.length > 0) {
    await tx.delete(contentReports).where(required(or(...reportScopes)))
  }

  const editTargets = {
    product: targets.productIds,
    ingredient: targets.ingredientIds,
  } satisfies Record<EditTargetType, string[]>
  const editScopes = targetScopes(editTargets, (type, ids) =>
    andAll(eq(suggestedEdits.targetType, type), inArray(suggestedEdits.targetId, ids))
  )
  if (editScopes.length > 0) {
    await tx.delete(suggestedEdits).where(required(or(...editScopes)))
  }

  const reactionTargets = {
    post: targets.postIds,
    post_reply: targets.postReplyIds,
    thread: targets.threadIds,
    thread_reply: targets.threadReplyIds,
  } satisfies Record<ReactableType, string[]>
  const reactionScopes = [
    inArray(socialReactions.userId, targets.userIds),
    ...targetScopes(reactionTargets, (type, ids) =>
      andAll(eq(socialReactions.reactableType, type), inArray(socialReactions.reactableId, ids))
    ),
  ]
  await tx.delete(socialReactions).where(required(or(...reactionScopes)))
}

async function deletePublicContent(
  tx: DatabaseTransaction,
  targets: DemoCleanupTargets
): Promise<void> {
  if (targets.postReplyIds.length > 0) {
    await tx.delete(socialPostReplies).where(inArray(socialPostReplies.id, targets.postReplyIds))
  }
  if (targets.postIds.length > 0) {
    await tx.delete(socialPosts).where(inArray(socialPosts.id, targets.postIds))
  }
  if (targets.threadReplyIds.length > 0) {
    await tx.delete(discussionReplies).where(inArray(discussionReplies.id, targets.threadReplyIds))
  }
  if (targets.threadIds.length > 0) {
    await tx.delete(discussionThreads).where(inArray(discussionThreads.id, targets.threadIds))
  }
}

// Callers lock these demo accounts first. Collection then locks every doomed
// target before deleting polymorphic rows, closing the validate-then-delete race.
async function purgeDemoUsers(tx: DatabaseTransaction, userIds: string[]): Promise<number> {
  if (userIds.length === 0) return 0

  const targets = await collectCleanupTargets(tx, userIds)
  await deletePolymorphicDependants(tx, targets)
  await deletePublicContent(tx, targets)

  await tx.delete(productEdits).where(inArray(productEdits.editedBy, userIds))
  await tx.delete(ingredientEdits).where(inArray(ingredientEdits.editedBy, userIds))

  const deleted = await tx
    .delete(users)
    .where(and(eq(users.isDemo, true), inArray(users.id, userIds)))
    .returning({ id: users.id })
  return deleted.length
}

export async function deleteAccount(userId: string): Promise<DeleteAccountResult> {
  return withAdminRls(async (tx) => {
    const [account] = await tx
      .select({ id: users.id, isDemo: users.isDemo })
      .from(users)
      .where(eq(users.id, userId))
      .for('update')

    if (!account) return { status: 'deleted' }

    const ban = await isUserBanned(tx, userId, 'global', false)
    if (ban) {
      return { status: 'banned', expiresAt: ban.expiresAt, reason: ban.reason }
    }

    if (account.isDemo) {
      const deleted = await purgeDemoUsers(tx, [account.id])
      if (deleted !== 1) throw new Error('locked demo account was not deleted')
    } else {
      const deleted = await tx
        .delete(users)
        .where(eq(users.id, account.id))
        .returning({ id: users.id })
      if (deleted.length !== 1) throw new Error('locked account was not deleted')
    }
    return { status: 'deleted' }
  })
}

export async function deleteDemoUser(userId: string): Promise<boolean> {
  return withAdminRls(async (tx) => {
    const userIds = await lockDemoUsers(tx, eq(users.id, userId))
    return (await purgeDemoUsers(tx, userIds)) === 1
  })
}

export async function sweepExpiredDemos(): Promise<number> {
  const count = await withAdminRls(async (tx) => {
    const userIds = await lockDemoUsers(tx, lt(users.expiresAt, sql`now()`))
    return purgeDemoUsers(tx, userIds)
  })
  logger.info({ count }, 'expired demo users swept')
  return count
}

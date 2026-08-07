import type { AdminDashboard } from '@aurore/shared'

import { eq, gt, isNull, or, sql } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../db'
import { contentReports, roleRequests, userBans } from '../../db/schema'
import { profiles } from '../../db/schema/auth/users'
import { discussionReplies, discussionThreads } from '../../db/schema/products/discussions'
import { userProductReviews } from '../../db/schema/products/user-products'
import { nowISO } from '../../utils/dates'

export async function getAdminDashboard(db: DatabaseTransaction): Promise<AdminDashboard> {
  const nowIso = nowISO()

  // Sequential on purpose: this service receives `requestDb`, so it is
  // always the RLS transaction, i.e. one connection. Fanning these counts out with
  // Promise.all is what wedged that connection "idle in transaction" in fetchProductMeta,
  // and ten wedged connections exhaust the Bun SQL pool and take the whole API down.
  const openReportsRows = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(contentReports)
    .where(eq(contentReports.status, 'open'))

  const activeBansRows = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(userBans)
    .where(or(isNull(userBans.expiresAt), gt(userBans.expiresAt, nowIso)))

  const hiddenReviewsRows = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(userProductReviews)
    .where(eq(userProductReviews.moderationStatus, 'hidden'))

  const hiddenThreadsRows = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(discussionThreads)
    .where(eq(discussionThreads.moderationStatus, 'hidden'))

  const hiddenRepliesRows = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(discussionReplies)
    .where(eq(discussionReplies.moderationStatus, 'hidden'))

  const forcedPrivateRows = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(profiles)
    .where(eq(profiles.forcedPrivateByAdmin, true))

  const pendingRoleRequestsRows = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(roleRequests)
    .where(eq(roleRequests.status, 'pending'))

  return {
    openReports: openReportsRows[0]?.count ?? 0,
    activeBans: activeBansRows[0]?.count ?? 0,
    hiddenReviews: hiddenReviewsRows[0]?.count ?? 0,
    hiddenThreads: hiddenThreadsRows[0]?.count ?? 0,
    hiddenReplies: hiddenRepliesRows[0]?.count ?? 0,
    forcedPrivateProfiles: forcedPrivateRows[0]?.count ?? 0,
    pendingRoleRequests: pendingRoleRequestsRows[0]?.count ?? 0,
  }
}

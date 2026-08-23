import {
  type CancelRoleRequestResult,
  err,
  type ListRoleRequestsQuery,
  type ListRoleRequestsResponse,
  ok,
  type ReviewRoleRequestInput,
  type ReviewRoleRequestResult,
  type RoleRequestView,
  type SubmitRoleRequestInput,
  type SubmitRoleRequestResult,
} from '@aurore/shared'

import { and, desc, eq } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../db'
import { roleRequests, users, usersSafe } from '../../db/schema'
import { nowISO } from '../../utils/dates'

export async function submitRoleRequest(
  db: DatabaseTransaction,
  { userId, body }: { userId: string; body: SubmitRoleRequestInput }
): Promise<SubmitRoleRequestResult> {
  const [requester] = await db
    .select({ role: usersSafe.role })
    .from(usersSafe)
    .where(eq(usersSafe.id, userId))
    .limit(1)

  if (!requester) return err('not_found')
  // Only plain users request elevation because elevated roles already hold catalog rights
  if (requester.role !== 'user') return err('already_elevated')

  const [pending] = await db
    .select({ id: roleRequests.id })
    .from(roleRequests)
    .where(and(eq(roleRequests.userId, userId), eq(roleRequests.status, 'pending')))
    .limit(1)

  // The partial unique index closes the race while this check yields the domain error
  if (pending) return err('already_pending')

  // The conflict handler turns a concurrent submit into the same domain error
  const [row] = await db
    .insert(roleRequests)
    .values({ userId, motivation: body.motivation, motivationLink: body.motivationLink ?? null })
    .onConflictDoNothing()
    .returning()

  if (!row) return err('already_pending')
  return ok(row)
}

export async function getMyRoleRequest(
  db: DatabaseTransaction,
  userId: string
): Promise<RoleRequestView | null> {
  const [row] = await db
    .select()
    .from(roleRequests)
    .where(eq(roleRequests.userId, userId))
    // UUIDv7 ordering breaks createdAt ties without discarding a request
    .orderBy(desc(roleRequests.createdAt), desc(roleRequests.id))
    .limit(1)

  return row ?? null
}

export async function cancelRoleRequest(
  db: DatabaseTransaction,
  { userId, id }: { userId: string; id: string }
): Promise<CancelRoleRequestResult> {
  // The userId filter keeps ownership explicit in addition to tenant isolation
  const [existing] = await db
    .select()
    .from(roleRequests)
    .where(and(eq(roleRequests.id, id), eq(roleRequests.userId, userId)))
    .limit(1)

  if (!existing) return err('not_found')
  if (existing.status !== 'pending') return err('not_pending')

  // Filtering by owner and status prevents a concurrent review from being overwritten
  const [row] = await db
    .update(roleRequests)
    .set({ status: 'cancelled' })
    .where(
      and(
        eq(roleRequests.id, id),
        eq(roleRequests.userId, userId),
        eq(roleRequests.status, 'pending')
      )
    )
    .returning()

  if (!row) return err('not_pending')
  return ok(row)
}

export async function listRoleRequests(
  db: DatabaseTransaction,
  filters: ListRoleRequestsQuery
): Promise<ListRoleRequestsResponse> {
  const rows = await db
    .select()
    .from(roleRequests)
    .where(filters.status ? eq(roleRequests.status, filters.status) : undefined)
    .orderBy(desc(roleRequests.createdAt))

  return { items: rows }
}

export async function reviewRoleRequest(
  db: DatabaseTransaction,
  { id, adminId, review }: { id: string; adminId: string; review: ReviewRoleRequestInput }
): Promise<ReviewRoleRequestResult> {
  const [existing] = await db.select().from(roleRequests).where(eq(roleRequests.id, id)).limit(1)

  if (!existing) return err('not_found')
  if (existing.status !== 'pending') return err('not_pending')

  const reviewedAt = nowISO()

  if (review.decision === 'reject') {
    const [row] = await db
      .update(roleRequests)
      .set({ status: 'rejected', rejectionReason: review.reason, reviewedBy: adminId, reviewedAt })
      .where(and(eq(roleRequests.id, id), eq(roleRequests.status, 'pending')))
      .returning()

    if (!row) return err('not_pending')
    return ok(row)
  }

  // Approve resolves the request and promotes the requester in the same tx: withRlsContext
  // opened it with app.role='admin', so the users write passes admin_bypass. Only a plain
  // user is promoted; if their role changed since submitting we skip the write instead
  // (0091 backstop forbids admin promotion). Status guard makes approve atomic: a
  // concurrent review that resolved the row first leaves 0 rows, so no promotion runs.
  const [row] = await db
    .update(roleRequests)
    .set({ status: 'approved', reviewedBy: adminId, reviewedAt })
    .where(and(eq(roleRequests.id, id), eq(roleRequests.status, 'pending')))
    .returning()

  if (!row) return err('not_pending')

  await db
    .update(users)
    .set({ role: 'contributor' })
    .where(and(eq(users.id, existing.userId), eq(users.role, 'user')))

  return ok(row)
}

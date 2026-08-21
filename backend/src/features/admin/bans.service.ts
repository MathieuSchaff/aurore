import {
  type AdminBanListItem,
  type AdminBanStatus,
  type AdminUserAccount,
  type ApiResponse,
  type BanScope,
  type CreateBanInput,
  type CreateBanResult,
  err,
  ok,
  type UpdateBanInput,
  type UpdateBanResult,
} from '@aurore/shared'

import { desc, eq, sql } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../db'
import { type UserBan, userBans, usersSafe } from '../../db/schema'
import { profiles } from '../../db/schema/auth/users'
import { normalizeInstant } from '../../utils/dates'
import { clearBanCache } from '../auth/ban.service'

// Cap avoids accidental full-table scans; no pagination until admin volume justifies it.
const ADMIN_USERS_LIST_LIMIT = 100

const adminUserSelection = {
  id: usersSafe.id,
  email: usersSafe.email,
  role: usersSafe.role,
  emailVerifiedAt: usersSafe.emailVerifiedAt,
  createdAt: usersSafe.createdAt,
  forcedPrivateByAdmin: sql<boolean>`COALESCE(${profiles.forcedPrivateByAdmin}, false)`,
}

function normalizeAdminUser(user: AdminUserAccount): AdminUserAccount {
  return {
    ...user,
    emailVerifiedAt: user.emailVerifiedAt ? normalizeInstant(user.emailVerifiedAt) : null,
    createdAt: normalizeInstant(user.createdAt),
  }
}

type CreateBanArgs = {
  actorId: string
  targetUserId: string
  body: CreateBanInput
}

export async function createBan(
  db: DatabaseTransaction,
  { actorId, targetUserId, body }: CreateBanArgs
): Promise<CreateBanResult> {
  if (actorId === targetUserId) {
    return err('cannot_self_ban')
  }

  if (body.expiresAt && Date.parse(body.expiresAt) <= Date.now()) {
    return err('invalid_input')
  }

  const [target] = await db
    .select({ id: usersSafe.id })
    .from(usersSafe)
    .where(eq(usersSafe.id, targetUserId))
    .limit(1)

  if (!target) {
    return err('not_found')
  }

  const [row] = await db
    .insert(userBans)
    .values({
      userId: targetUserId,
      scope: body.scope,
      reason: body.reason ?? null,
      bannedBy: actorId,
      expiresAt: body.expiresAt ?? null,
    })
    .returning()

  if (!row) {
    return err('server_error')
  }

  clearBanCache(targetUserId)
  return ok(row)
}

// Returns null when the ban is absent; caller falls through to liftBan's not_found path.
export async function getBanScope(
  db: DatabaseTransaction,
  banId: string
): Promise<BanScope | null> {
  const [row] = await db
    .select({ scope: userBans.scope })
    .from(userBans)
    .where(eq(userBans.id, banId))
    .limit(1)
  return row?.scope ?? null
}

export async function listUserBans(
  db: DatabaseTransaction,
  userId: string
): Promise<AdminBanListItem[]> {
  const rows = await db
    .select({
      id: userBans.id,
      userId: userBans.userId,
      scope: userBans.scope,
      reason: userBans.reason,
      bannedBy: userBans.bannedBy,
      expiresAt: userBans.expiresAt,
      createdAt: userBans.createdAt,
      status: sql<AdminBanStatus>`CASE
        WHEN ${userBans.expiresAt} IS NULL OR ${userBans.expiresAt} > now() THEN 'active'
        ELSE 'expired'
      END`,
    })
    .from(userBans)
    .where(eq(userBans.userId, userId))
    .orderBy(desc(userBans.createdAt))

  return rows.map((row) => ({
    ...row,
    expiresAt: row.expiresAt ? normalizeInstant(row.expiresAt) : null,
    createdAt: normalizeInstant(row.createdAt),
  }))
}

type LiftedBanSummary = Pick<UserBan, 'userId' | 'scope' | 'reason' | 'bannedBy'>
export type LiftBanResult = ApiResponse<LiftedBanSummary, 'not_found' | 'server_error'>

export async function liftBan(db: DatabaseTransaction, banId: string): Promise<LiftBanResult> {
  // The row is destroyed here, so return what it held: this is the last moment where
  // who banned whom, and why, still exists anywhere.
  const deleted = await db.delete(userBans).where(eq(userBans.id, banId)).returning({
    userId: userBans.userId,
    scope: userBans.scope,
    reason: userBans.reason,
    bannedBy: userBans.bannedBy,
  })

  const row = deleted[0]
  if (!row) return err('not_found')

  clearBanCache(row.userId)
  return ok(row)
}

export async function updateBan(
  db: DatabaseTransaction,
  banId: string,
  body: UpdateBanInput
): Promise<UpdateBanResult> {
  if (body.expiresAt && Date.parse(body.expiresAt) <= Date.now()) {
    return err('invalid_input')
  }

  const updates: { reason?: string | null; expiresAt?: string | null } = {}
  if (body.reason !== undefined) updates.reason = body.reason
  if (body.expiresAt !== undefined) updates.expiresAt = body.expiresAt

  // Zod's .refine guarantees at least one field at the route layer, but guard here
  // so the service is safe under direct calls (seed, future internal callers).
  if (Object.keys(updates).length === 0) {
    return err('invalid_input')
  }

  const [row] = await db.update(userBans).set(updates).where(eq(userBans.id, banId)).returning()
  if (!row) return err('not_found')

  clearBanCache(row.userId)
  return ok(row)
}

export async function listUsers(db: DatabaseTransaction): Promise<AdminUserAccount[]> {
  const rows = await db
    .select(adminUserSelection)
    .from(usersSafe)
    .leftJoin(profiles, eq(profiles.userId, usersSafe.id))
    .orderBy(desc(usersSafe.createdAt))
    .limit(ADMIN_USERS_LIST_LIMIT)
  return rows.map(normalizeAdminUser)
}

export async function getAdminUserById(
  db: DatabaseTransaction,
  userId: string
): Promise<AdminUserAccount | null> {
  const [user] = await db
    .select(adminUserSelection)
    .from(usersSafe)
    .leftJoin(profiles, eq(profiles.userId, usersSafe.id))
    .where(eq(usersSafe.id, userId))
    .limit(1)

  if (!user) return null

  return normalizeAdminUser(user)
}

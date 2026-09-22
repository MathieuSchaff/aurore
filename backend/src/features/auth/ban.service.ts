import type { BanScope } from '@aurore/shared'

import { and, desc, eq, gt, isNull, or } from 'drizzle-orm'

import type { Database, DatabaseTransaction } from '../../db'
import { type UserBan, userBans } from '../../db/schema'
import { normalizeInstant, nowISO } from '../../utils/dates'

function toApiBan(row: UserBan | undefined): UserBan | null {
  if (!row) return null
  return {
    ...row,
    expiresAt: row.expiresAt ? normalizeInstant(row.expiresAt) : null,
    createdAt: normalizeInstant(row.createdAt),
  }
}

// Ban decisions read committed state so another transaction cannot warm a stale result
export async function isUserBanned(
  db: Database | DatabaseTransaction,
  userId: string,
  scope: 'global' = 'global'
): Promise<UserBan | null> {
  const nowIso = nowISO()
  const rows = await db
    .select()
    .from(userBans)
    .where(
      and(
        eq(userBans.userId, userId),
        eq(userBans.scope, scope),
        or(isNull(userBans.expiresAt), gt(userBans.expiresAt, nowIso))
      )
    )
    .orderBy(desc(userBans.createdAt))
    .limit(1)

  return toApiBan(rows[0])
}

export async function isUserBannedForScope(
  db: DatabaseTransaction,
  userId: string,
  scope: BanScope
): Promise<UserBan | null> {
  const nowIso = nowISO()
  const rows = await db
    .select()
    .from(userBans)
    .where(
      and(
        eq(userBans.userId, userId),
        eq(userBans.scope, scope),
        or(isNull(userBans.expiresAt), gt(userBans.expiresAt, nowIso))
      )
    )
    .orderBy(desc(userBans.createdAt))
    .limit(1)

  return toApiBan(rows[0])
}

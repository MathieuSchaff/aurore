import type { UserPublic } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import type { DbOrTransaction } from '../../db'
import { usersSafe } from '../../db/schema'

export async function getUserRole(
  db: DbOrTransaction,
  userId: string
): Promise<UserPublic['role'] | null> {
  const [row] = await db
    .select({ role: usersSafe.role })
    .from(usersSafe)
    .where(eq(usersSafe.id, userId))
    .limit(1)
  return row?.role ?? null
}

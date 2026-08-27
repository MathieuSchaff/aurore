import { err, ok, type UpdateRoleResult } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../db'
import { users, usersSafe } from '../../db/schema'

type DemoteArgs = { adminId: string; targetUserId: string; role: 'user' }

// Only contributors are demotable: rejects admins and plain users so the affordance
// cannot silently change unintended roles.
export async function demoteToUser(
  db: DatabaseTransaction,
  { adminId, targetUserId, role }: DemoteArgs
): Promise<UpdateRoleResult> {
  if (adminId === targetUserId) {
    return err('cannot_self_demote')
  }

  const [target] = await db
    .select({ id: usersSafe.id, role: usersSafe.role })
    .from(usersSafe)
    .where(eq(usersSafe.id, targetUserId))
    .limit(1)

  if (!target) {
    return err('not_found')
  }

  if (target.role !== 'contributor') {
    return err('not_a_contributor')
  }

  const [row] = await db
    .update(users)
    .set({ role })
    .where(eq(users.id, targetUserId))
    .returning({ id: users.id, role: users.role })

  if (!row) {
    return err('server_error')
  }

  return ok(row)
}

import { type AuthInput, err, ok } from '@aurore/shared'

import { eq, sql } from 'drizzle-orm'

import type { Database } from '../../../db'
import { bindRlsContext } from '../../../db/rls'
import { users } from '../../../db/schema'
import { authenticatePassword, deleteAccount, getUserById } from '../../auth/service'
import { logSecurityEvent } from '../../security/service'
import { checkExportRateLimit, exportUserData } from '../service'

export { exportFilename } from '../service'

export async function exportWithPassword(db: Database, credentials: AuthInput) {
  const identity = await authenticatePassword(db, credentials.email, credentials.password)
  if (!identity.success) return identity
  return exportForVerifiedOwner(db, identity.data.id, '/profile/access/export')
}

export async function exportForVerifiedOwner(
  db: Database,
  userId: string,
  route: '/profile/access/export' | '/profile/access/google/export'
) {
  const user = await getUserById(db, userId)
  if (!user) return err('not_found')
  if (user.isDemo) return err('forbidden')
  const rate = checkExportRateLimit(user.id)
  if (!rate.ok) return err('rate_limit_exceeded', { retryAfter: rate.retryAfterSec })

  const data = await db.transaction(async (tx) => {
    const [account] = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, user.id))
      .for('key share')
    if (!account) return null
    await bindRlsContext(tx, user.id)
    // Identity verification grants only ownership, even for an administrator
    await tx.execute(sql`SELECT set_config('app.role', 'user', true)`)
    return exportUserData(tx, user.id)
  })
  if (!data) return err('not_found')
  await logSecurityEvent(db, {
    userId: user.id,
    severity: 'low',
    eventType: 'data_export_requested',
    field: 'export',
    payload: 'json',
    route,
  }).catch(() => {})
  return ok(data)
}

export async function deleteWithPassword(db: Database, credentials: AuthInput) {
  const identity = await authenticatePassword(db, credentials.email, credentials.password)
  if (!identity.success) return identity
  await deleteAccount(identity.data.id)
  return ok(null)
}

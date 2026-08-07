import { eq, sql, TransactionRollbackError } from 'drizzle-orm'
import type { Context, Next } from 'hono'

import type { AppEnv } from '../../app-env'
import { users } from '../../db/schema'
import { getAuthedUserRole } from '../../utils/accessors'

// Wraps authenticated requests in a transaction and binds the PostgreSQL RLS context.
// Must run after requireJwtAuth. Public requests without userId pass through unchanged.
//
// A propagated error or final HTTP status >= 400 rolls back the request transaction.
// Only the rollback requested here is suppressed; unexpected rollback errors propagate.
export const withRlsContext = async (c: Context<AppEnv>, next: Next) => {
  const userId = c.get('userId')

  if (!userId) {
    await next()
    return
  }
  if (c.get('requestDb')) {
    throw new Error('withRlsContext: requestDb is already set')
  }
  const anonDb = c.get('anonDb')
  // Throws if userId is set but role is not: programmer error (requireJwtAuth not chained).
  const role = getAuthedUserRole(c)
  let rollbackRequested = false
  try {
    await anonDb.transaction(async (tx) => {
      // SET LOCAL only accepts literal strings, making concatenation an injection risk.
      // set_config() takes a parameterized value, so it is safe.
      await tx.execute(sql`SELECT set_config('app.user_id', ${userId}, true)`)
      await tx.execute(sql`SELECT set_config('app.role', ${role}, true)`)

      // Account deletion takes FOR UPDATE before touching owned targets. Holding
      // KEY SHARE here makes every authenticated request lock in that same order,
      // account before target, so no write commits after account cleanup.
      await tx.select({ id: users.id }).from(users).where(eq(users.id, userId)).for('key share')

      c.set('requestDb', tx)

      await next()
      if (c.error || c.res.status >= 400) {
        rollbackRequested = true
        tx.rollback()
      }
    })
  } catch (e) {
    // Preserve the downstream response after the rollback requested above.
    if (e instanceof TransactionRollbackError && rollbackRequested) return
    throw e
  } finally {
    // Never expose a transaction after its callback has completed.
    c.set('requestDb', undefined)
  }
}

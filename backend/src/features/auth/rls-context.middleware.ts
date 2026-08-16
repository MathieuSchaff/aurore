import { eq, sql, TransactionRollbackError } from 'drizzle-orm'
import type { Context, Next } from 'hono'

import type { AppEnv } from '../../app-env'
import { users } from '../../db/schema'

// Wraps authenticated requests in a transaction and binds the PostgreSQL RLS context.
// Must run after requireJwtAuth. Public requests without userId pass through unchanged.
//
// A propagated error or final HTTP status >= 400 rolls back the request transaction.
// Only the rollback requested here is suppressed; unexpected rollback errors propagate
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
  let rollbackRequested = false
  try {
    await anonDb.transaction(async (tx) => {
      // Account deletion takes FOR UPDATE before touching owned targets. Holding
      // KEY SHARE here makes every authenticated request lock in that same order,
      // account before target, so no write commits after account cleanup
      const [account] = await tx
        .select({ id: users.id, role: users.role })
        .from(users)
        .where(eq(users.id, userId))
        .for('key share')

      // Every policy checks app.role, so it comes from the row, never from the JWT
      // claim: a demoted contributor carries a stale claim until its token expires. An
      // account gone since the token was issued falls back to the anonymous context
      // (docs/adr/0018, which supersedes 0008)
      const role = account?.role ?? ''

      // Guards and services after this point read the context role: requireAdmin, the
      // verified stamp, the submission rate limit. Overwrite the claim so they see the
      // row the policies see, else the service stamps a demoted user's insert verified
      // and the INSERT policy kills the request with a 500
      c.set('userRole', account?.role)

      // SET LOCAL only accepts literal strings, making concatenation an injection risk.
      // set_config() takes a parameterized value, so it is safe
      await tx.execute(sql`SELECT set_config('app.user_id', ${userId}, true)`)
      await tx.execute(sql`SELECT set_config('app.role', ${role}, true)`)

      c.set('requestDb', tx)

      await next()
      if (c.error || c.res.status >= 400) {
        rollbackRequested = true
        tx.rollback()
      }
    })
  } catch (e) {
    // Preserve the downstream response after the rollback requested above
    if (e instanceof TransactionRollbackError && rollbackRequested) return
    throw e
  } finally {
    // Never expose a transaction after its callback has completed
    c.set('requestDb', undefined)
  }
}

import type { Context } from 'hono'

import type { AppEnv } from '../app-env'
import type { DatabaseTransaction } from '../db'

// Throws if requireJwtAuth did not run: loud programmer error instead of silent undefined.
export function getAuthedUserId(c: Context<AppEnv>): string {
  const userId = c.get('userId')
  if (userId === undefined)
    throw new Error('getAuthedUserId: requireJwtAuth must run before this route')
  return userId
}

export function getAuthedUserRole(
  c: Context<AppEnv>
): NonNullable<AppEnv['Variables']['userRole']> {
  const role = c.get('userRole')
  if (role === undefined)
    throw new Error('getAuthedUserRole: requireJwtAuth must run before this route')
  return role
}

export function getRlsDb(c: Context<AppEnv>): DatabaseTransaction {
  const requestDb = c.get('requestDb')
  if (!requestDb) {
    throw new Error('getRlsDb: withRlsContext must run before this route')
  }
  return requestDb
}

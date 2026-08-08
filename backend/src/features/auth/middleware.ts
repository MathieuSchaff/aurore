import { type BanScope, err, HTTP_STATUS } from '@aurore/shared'

import type { Context, Next } from 'hono'

import type { AppEnv } from '../../app-env'
import { getRlsDb } from '../../utils/accessors'
import { isUserBanned, isUserBannedForScope } from './ban.service'
import { verifyAccessToken } from './jwt.utils'
import { getUserRole } from './user.utils'

export const requireJwtAuth = async (c: Context<AppEnv>, next: Next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json(err('unauthorized'), HTTP_STATUS.UNAUTHORIZED)
  }

  const token = authHeader.substring(7)
  const jwtSecret = c.get('jwtSecret')

  const payload = await verifyAccessToken(token, jwtSecret)

  if (!payload) {
    return c.json(err('unauthorized'), HTTP_STATUS.UNAUTHORIZED)
  }

  c.set('userId', payload.sub)
  c.set('userRole', payload.role)

  await next()
}

// Requires requireJwtAuth then withRlsContext. The ban query uses requestDb so
// user_bans RLS sees the authenticated user identity and role.
export const requireNotBanned = async (c: Context<AppEnv>, next: Next) => {
  const userId = c.get('userId')
  if (!userId) return c.json(err('unauthorized'), HTTP_STATUS.UNAUTHORIZED)

  const requestDb = getRlsDb(c)
  const ban = await isUserBanned(requestDb, userId, 'global')
  if (ban) {
    return c.json(
      err('banned', { expiresAt: ban.expiresAt, reason: ban.reason }),
      HTTP_STATUS.FORBIDDEN
    )
  }
  await next()
}

// Must run after requireJwtAuth (needs userRole).
export const requireAdmin = async (c: Context<AppEnv>, next: Next) => {
  if (c.get('userRole') !== 'admin') {
    return c.json(err('forbidden'), HTTP_STATUS.FORBIDDEN)
  }
  await next()
}

// Requires requireJwtAuth then withRlsContext. The fresh DB role closes the stale-JWT
// demotion window for catalogue writes; RLS remains the DB-level backstop.
export const requireCatalogWrite = async (c: Context<AppEnv>, next: Next) => {
  const userId = c.get('userId')
  if (!userId) {
    return c.json(err('unauthorized'), HTTP_STATUS.UNAUTHORIZED)
  }

  const requestDb = getRlsDb(c)
  const role = await getUserRole(requestDb, userId)
  if (role !== 'admin' && role !== 'contributor') {
    return c.json(err('forbidden'), HTTP_STATUS.FORBIDDEN)
  }
  await next()
}

// admin OR contributor. Contributor ("modérateur") has reversible, content-scoped
// actions (hide/restore reviews, report queue). Irreversible account-level actions
// (force-private, bans) stay behind requireAdmin.
// Requires requireJwtAuth then withRlsContext, and re-sources the role from the DB.
export const requireContentModerator = async (c: Context<AppEnv>, next: Next) => {
  const userId = c.get('userId')
  if (!userId) {
    return c.json(err('unauthorized'), HTTP_STATUS.UNAUTHORIZED)
  }

  const requestDb = getRlsDb(c)
  const role = await getUserRole(requestDb, userId)
  if (role !== 'admin' && role !== 'contributor') {
    return c.json(err('forbidden'), HTTP_STATUS.FORBIDDEN)
  }
  await next()
}

// Checks action-specific scope only; 'global' is already enforced by requireNotBanned.
// Requires requireJwtAuth, then withRlsContext, then requireNotBanned in the router chain.
export const requireNotBannedScope =
  (scope: Exclude<BanScope, 'global'>) => async (c: Context<AppEnv>, next: Next) => {
    const userId = c.get('userId')
    if (!userId) return c.json(err('unauthorized'), HTTP_STATUS.UNAUTHORIZED)

    const requestDb = getRlsDb(c)
    const ban = await isUserBannedForScope(requestDb, userId, scope)
    if (ban) {
      return c.json(
        err('banned', { expiresAt: ban.expiresAt, reason: ban.reason, scope }),
        HTTP_STATUS.FORBIDDEN
      )
    }
    await next()
  }

// Passes anonymous requests through unchanged; sets userId/userRole when a valid
// bearer is present. Use on public reads that personalize for logged-in callers.
export const optionalJwtAuth = async (c: Context<AppEnv>, next: Next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return next()

  const token = authHeader.substring(7)
  const payload = await verifyAccessToken(token, c.get('jwtSecret'))
  if (payload) {
    c.set('userId', payload.sub)
    c.set('userRole', payload.role)
  }
  return next()
}

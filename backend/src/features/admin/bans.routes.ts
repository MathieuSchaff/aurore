import {
  adminBanErrorMapping,
  adminRoleErrorMapping,
  createBanBodySchema,
  err,
  errorToStatus,
  HTTP_STATUS,
  isApiSuccess,
  ok,
  updateBanBodySchema,
  updateRoleBodySchema,
} from '@aurore/shared'

import { Hono } from 'hono'
import { z } from 'zod'

import type { AppEnv } from '../../app-env'
import { db as baseDb } from '../../db'
import { logger } from '../../lib/logger'
import { getAuthedUserId, getAuthedUserRole, getRlsDb } from '../../utils/accessors'
import { rateLimiterFunc } from '../../utils/rateLimiter'
import { zValidator } from '../../utils/validator'
import {
  requireAdmin,
  requireContentModerator,
  requireJwtAuth,
  requireNotBanned,
} from '../auth/middleware'
import { withRlsContext } from '../auth/rls-context.middleware'
import {
  createBan,
  getAdminUserById,
  getBanScope,
  liftBan,
  listUserBans,
  listUsers,
  updateBan,
} from './bans.service'
import { getAdminDashboard } from './dashboard.service'
import { logModerationAction } from './moderation-audit.service'
import { demoteToUser } from './roles.service'

const userIdParam = z.object({ id: z.uuid() })
const banIdParam = z.object({ banId: z.uuid() })

// This router mounts on the shared '/api/admin' prefix. Scope the common chain to
// the paths it owns so it cannot wrap sibling routers such as /admin/moderation.
const protectedPaths = [
  '/users',
  '/users/:id',
  '/users/:id/bans',
  '/users/:id/role',
  '/bans/:banId',
  '/dashboard',
] as const

const app = new Hono<AppEnv>()
for (const path of protectedPaths) {
  app.use(path, rateLimiterFunc)
  app.use(path, requireJwtAuth)
  app.use(path, withRlsContext)
  app.use(path, requireNotBanned)
}

// Authz remains per-route: contributors handle content-scoped bans, while global
// lockout, role management and dashboard access stay admin-only.

export const adminBansRoutes = app
  .post(
    '/users/:id/bans',
    requireContentModerator,
    zValidator('param', userIdParam),
    zValidator('json', createBanBodySchema),
    async (c) => {
      const { id: targetUserId } = c.req.valid('param')
      const body = c.req.valid('json')
      const actorId = getAuthedUserId(c)

      // Contributors are restricted to content-scoped bans; 'global' (account lockout) stays admin-only.
      // Clean 403 before the write; RLS WITH CHECK is the DB backstop.
      if (getAuthedUserRole(c) !== 'admin' && body.scope === 'global') {
        return c.json(err('forbidden'), HTTP_STATUS.FORBIDDEN)
      }
      const requestDb = getRlsDb(c)
      const result = await createBan(requestDb, { actorId, targetUserId, body })

      if (!isApiSuccess(result)) {
        return c.json(err(result.error), errorToStatus(result.error, adminBanErrorMapping))
      }

      logger.info(
        { actorId, targetUserId, scope: body.scope, expiresAt: body.expiresAt ?? null },
        'ban created'
      )
      return c.json(ok(result.data), HTTP_STATUS.CREATED)
    }
  )
  .get('/users/:id/bans', requireContentModerator, zValidator('param', userIdParam), async (c) => {
    const { id: targetUserId } = c.req.valid('param')
    const requestDb = getRlsDb(c)
    const rows = await listUserBans(requestDb, targetUserId)
    return c.json(ok(rows), HTTP_STATUS.OK)
  })
  .delete('/bans/:banId', requireContentModerator, zValidator('param', banIdParam), async (c) => {
    const { banId } = c.req.valid('param')
    const actorId = getAuthedUserId(c)

    // App-level gate for owner/BYPASSRLS contexts (tests, dev): contributors cannot lift 'global' bans.
    // Under prod RLS, the user_bans_moderation_scoped policy hides 'global' rows from contributors,
    // so getBanScope returns null and liftBan's 0-row DELETE yields not_found (404).
    // Either path prevents the lift; the RLS DELETE is the prod enforcement
    // (tested in tests/integration/user-bans-rls.test.ts).
    if (getAuthedUserRole(c) !== 'admin') {
      const scope = await getBanScope(getRlsDb(c), banId)
      if (scope === 'global') {
        return c.json(err('forbidden'), HTTP_STATUS.FORBIDDEN)
      }
    }

    const result = await liftBan(getRlsDb(c), banId)

    if (!isApiSuccess(result)) {
      return c.json(err(result.error), errorToStatus(result.error, adminBanErrorMapping))
    }

    await logModerationAction(baseDb, {
      actorId,
      targetUserId: result.data.userId,
      action: 'ban_lifted',
      details: {
        scope: result.data.scope,
        bannedBy: result.data.bannedBy,
        reason: result.data.reason,
      },
    })

    logger.info({ actorId, banId }, 'ban lifted')
    return c.json(ok(null, 'Ban lifted'), HTTP_STATUS.OK)
  })
  .patch(
    '/bans/:banId',
    requireAdmin,
    zValidator('param', banIdParam),
    zValidator('json', updateBanBodySchema),
    async (c) => {
      const { banId } = c.req.valid('param')
      const body = c.req.valid('json')
      const adminId = getAuthedUserId(c)

      const result = await updateBan(getRlsDb(c), banId, body)

      if (!isApiSuccess(result)) {
        return c.json(err(result.error), errorToStatus(result.error, adminBanErrorMapping))
      }

      await logModerationAction(baseDb, {
        actorId: adminId,
        targetUserId: result.data.userId,
        action: 'ban_updated',
        details: {
          scope: result.data.scope,
          expiresAtChanged: body.expiresAt !== undefined,
          expiresAt: body.expiresAt ?? null,
          reasonChanged: body.reason !== undefined,
        },
      })

      logger.info(
        {
          adminId,
          banId,
          expiresAt: body.expiresAt ?? null,
          reasonChanged: body.reason !== undefined,
        },
        'ban updated'
      )
      return c.json(ok(result.data), HTTP_STATUS.OK)
    }
  )
  .patch(
    '/users/:id/role',
    requireAdmin,
    zValidator('param', userIdParam),
    zValidator('json', updateRoleBodySchema),
    async (c) => {
      const { id: targetUserId } = c.req.valid('param')
      const body = c.req.valid('json')
      const adminId = getAuthedUserId(c)

      const result = await demoteToUser(getRlsDb(c), {
        adminId,
        targetUserId,
        role: body.role,
      })

      if (!isApiSuccess(result)) {
        return c.json(err(result.error), errorToStatus(result.error, adminRoleErrorMapping))
      }

      await logModerationAction(baseDb, {
        actorId: adminId,
        targetUserId,
        action: 'role_changed',
        details: {
          role: body.role,
          reason: body.reason ?? null,
        },
      })

      logger.info({ adminId, targetUserId, reason: body.reason ?? null }, 'contributor demoted')
      return c.json(ok(result.data), HTTP_STATUS.OK)
    }
  )
  .get('/users', requireAdmin, async (c) => {
    const items = await listUsers(getRlsDb(c))
    return c.json(ok({ items }), HTTP_STATUS.OK)
  })
  .get('/users/:id', requireAdmin, zValidator('param', userIdParam), async (c) => {
    const { id: userId } = c.req.valid('param')
    const user = await getAdminUserById(getRlsDb(c), userId)
    if (!user) return c.json(err('not_found'), HTTP_STATUS.NOT_FOUND)
    return c.json(ok(user), HTTP_STATUS.OK)
  })
  .get('/dashboard', requireAdmin, async (c) => {
    const dashboard = await getAdminDashboard(getRlsDb(c))
    return c.json(ok(dashboard), HTTP_STATUS.OK)
  })

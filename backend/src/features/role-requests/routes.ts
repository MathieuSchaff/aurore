import type { MyRoleRequestResponse } from '@aurore/shared'
import {
  cancelRoleRequestErrorMapping,
  err,
  errorToStatus,
  HTTP_STATUS,
  isApiSuccess,
  ok,
  submitRoleRequestBodySchema,
  submitRoleRequestErrorMapping,
} from '@aurore/shared'

import { Hono } from 'hono'
import { z } from 'zod'

import type { AppEnv } from '../../app-env'
import { logger } from '../../lib/logger'
import { getAuthedUserId, getRlsDb } from '../../utils/accessors'
import { zValidator } from '../../utils/validator'
import { applyAuthedGuards } from '../auth/authed-guards'
import { getUserRole } from '../auth/user-role.service'
import { cancelRoleRequest, getMyRoleRequest, submitRoleRequest } from './service'

const requestIdParam = z.object({ id: z.uuid() })

const app = applyAuthedGuards(new Hono<AppEnv>())

export const roleRequestsRoutes = app
  .post('/', zValidator('json', submitRoleRequestBodySchema), async (c) => {
    const userId = getAuthedUserId(c)
    const body = c.req.valid('json')

    const result = await submitRoleRequest(getRlsDb(c), { userId, body })
    if (!isApiSuccess(result)) {
      return c.json(err(result.error), errorToStatus(result.error, submitRoleRequestErrorMapping))
    }

    logger.info({ userId, requestId: result.data.id }, 'role request submitted')
    return c.json(ok(result.data), HTTP_STATUS.CREATED)
  })
  .get('/me', async (c) => {
    const userId = getAuthedUserId(c)
    const db = getRlsDb(c)
    const latest = await getMyRoleRequest(db, userId)
    // The bearer role lags an approval or a demotion by one refresh, so ask the database
    const role = await getUserRole(db, userId)
    const canApply = role === 'user' && latest?.status !== 'pending'
    return c.json(ok({ latest, canApply } satisfies MyRoleRequestResponse), HTTP_STATUS.OK)
  })
  .post('/:id/cancel', zValidator('param', requestIdParam), async (c) => {
    const userId = getAuthedUserId(c)
    const { id } = c.req.valid('param')

    const result = await cancelRoleRequest(getRlsDb(c), { userId, id })
    if (!isApiSuccess(result)) {
      return c.json(err(result.error), errorToStatus(result.error, cancelRoleRequestErrorMapping))
    }

    logger.info({ userId, requestId: id }, 'role request cancelled')
    return c.json(ok(result.data), HTTP_STATUS.OK)
  })

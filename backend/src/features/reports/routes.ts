import { createReportBodySchema, HTTP_STATUS, ok } from '@aurore/shared'

import { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { getAuthedUserId, getRlsDb } from '../../utils/accessors'
import { zValidator } from '../../utils/validator'
import { applyAuthedGuards } from '../auth/authed-guards'
import { createReport } from './service'

const app = applyAuthedGuards(new Hono<AppEnv>())

export const reportsRoutes = app.post(
  '/',
  zValidator('json', createReportBodySchema),
  async (c) => {
    const reporterId = getAuthedUserId(c)
    const body = c.req.valid('json')

    const report = await createReport(getRlsDb(c), { reporterId, body })
    return c.json(ok(report), HTTP_STATUS.CREATED)
  }
)

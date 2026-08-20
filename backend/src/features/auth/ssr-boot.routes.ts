import { HTTP_STATUS, ok } from '@aurore/shared'

import { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { getRlsDb } from '../../utils/accessors'
import { requireSessionCookie } from './middleware'
import { withRlsContext } from './rls-context.middleware'
import { anonymousSsrBootResponse, getAuthenticatedSsrBootResponse } from './ssr-boot.service'

const app = new Hono<AppEnv>()

export const ssrBootRoutes = app.get('/boot', requireSessionCookie, withRlsContext, async (c) => {
  const userId = c.get('userId')
  if (!userId) return c.json(ok(anonymousSsrBootResponse), HTTP_STATUS.OK)

  const response = await getAuthenticatedSsrBootResponse(getRlsDb(c), userId)
  return c.json(ok(response), HTTP_STATUS.OK)
})

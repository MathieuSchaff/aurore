import { HTTP_STATUS, ok, ssrBootQuerySchema } from '@aurore/shared'

import { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { getRlsDb } from '../../utils/accessors'
import { zValidator } from '../../utils/validator'
import { requireSessionCookie } from './middleware'
import { withRlsContext } from './rls-context.middleware'
import { anonymousSsrBootResponse, getAuthenticatedSsrBootResponse } from './ssr-boot.service'

const app = new Hono<AppEnv>()

export const ssrBootRoutes = app.get(
  '/boot',
  requireSessionCookie,
  withRlsContext,
  zValidator('query', ssrBootQuerySchema),
  async (c) => {
    const userId = c.get('userId')
    // Shared validation owns this large contract, so Hono does not expand it into AppType
    if (!userId) return c.json(ok(anonymousSsrBootResponse as unknown), HTTP_STATUS.OK)

    const response = await getAuthenticatedSsrBootResponse(
      getRlsDb(c),
      userId,
      c.req.valid('query')
    )
    return c.json(ok(response as unknown), HTTP_STATUS.OK)
  }
)

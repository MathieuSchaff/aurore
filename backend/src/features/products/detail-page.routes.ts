import { HTTP_STATUS, ok } from '@aurore/shared'

import { Hono } from 'hono'
import { z } from 'zod'

import type { AppEnv } from '../../app-env'
import { getRlsDb } from '../../utils/accessors'
import { zValidator } from '../../utils/validator'
import { optionalJwtAuth } from '../auth/middleware'
import { withRlsContext } from '../auth/rls-context.middleware'
import { readProductDetailPage } from './service'

const slugParam = z.object({ slug: z.string().min(1).max(100) })

export const productDetailPageRoutes = new Hono<AppEnv>().get(
  '/:slug/page',
  optionalJwtAuth,
  withRlsContext,
  zValidator('param', slugParam),
  async (c) => {
    const viewerId = c.get('userId') ?? null
    const database = viewerId ? getRlsDb(c) : c.get('anonDb')
    const page = await readProductDetailPage(database, {
      viewerId,
      slug: c.req.valid('param').slug,
    })
    // Shared validation owns this large contract, so Hono does not expand it into AppType
    return c.json(ok(page as unknown), HTTP_STATUS.OK)
  }
)

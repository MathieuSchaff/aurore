import { err, HTTP_STATUS, ok } from '@aurore/shared'

import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { z } from 'zod'

import type { AppEnv } from '../../app-env'
import { getAuthedUserId, getRlsDb } from '../../utils/accessors'
import { zValidator } from '../../utils/validator'
import {
  requireCatalogWrite,
  requireJwtAuth,
  requireNotBanned,
  requireNotBannedScope,
} from '../auth/middleware'
import { withRlsContext } from '../auth/rls-context.middleware'
import { uploadAvatar, uploadProductImage } from './service'

const app = new Hono<AppEnv>()

app.use('*', requireJwtAuth)
app.use('*', withRlsContext)
app.use('*', requireNotBanned)
app.use('*', bodyLimit({ maxSize: 1_048_576 }))

export const uploadsRoutes = app
  .post('/avatar', async (c) => {
    const userId = getAuthedUserId(c)
    const body = await c.req.parseBody()
    const file = body.image
    if (!(file instanceof File)) {
      return c.json(err('upload_invalid_format'), HTTP_STATUS.BAD_REQUEST)
    }
    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadAvatar(getRlsDb(c), userId, buffer)
    return c.json(ok(result), HTTP_STATUS.CREATED)
  })
  .post(
    '/product/:slug',
    requireNotBannedScope('product_edit'),
    requireCatalogWrite,
    zValidator(
      'param',
      z.object({ slug: z.string().regex(/^[a-z0-9][a-z0-9-]{0,198}[a-z0-9]$|^[a-z0-9]$/) })
    ),
    async (c) => {
      const { slug } = c.req.valid('param')
      const body = await c.req.parseBody()
      const file = body.image
      if (!(file instanceof File)) {
        return c.json(err('upload_invalid_format'), HTTP_STATUS.BAD_REQUEST)
      }
      const buffer = Buffer.from(await file.arrayBuffer())
      const result = await uploadProductImage(getRlsDb(c), slug, buffer)
      return c.json(ok(result), HTTP_STATUS.CREATED)
    }
  )

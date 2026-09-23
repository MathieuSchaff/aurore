import { authErrorMapping, authSchema, err, errorToStatus, HTTP_STATUS } from '@aurore/shared'

import { Hono } from 'hono'

import type { AppEnv } from '../../../app-env'
import { loginRateLimiterFunc } from '../../../utils/rateLimiter'
import { zValidator } from '../../../utils/validator'
import { deleteWithPassword, exportFilename, exportWithPassword } from './service'

export const privacyAccessRoute = new Hono<AppEnv>()
  .post('/export', loginRateLimiterFunc, zValidator('json', authSchema), async (c) => {
    const result = await exportWithPassword(c.get('anonDb'), c.req.valid('json'))
    if (!result.success)
      return c.json(
        err(result.error, result.details),
        errorToStatus(result.error, authErrorMapping)
      )
    return c.body(JSON.stringify(result.data, null, 2), HTTP_STATUS.OK, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${exportFilename(result.data._meta.userId)}"`,
      'Cache-Control': 'no-store',
    })
  })
  .post('/delete-account', loginRateLimiterFunc, zValidator('json', authSchema), async (c) => {
    const result = await deleteWithPassword(c.get('anonDb'), c.req.valid('json'))
    if (!result.success)
      return c.json(err(result.error), errorToStatus(result.error, authErrorMapping))
    return c.body(null, HTTP_STATUS.NO_CONTENT)
  })

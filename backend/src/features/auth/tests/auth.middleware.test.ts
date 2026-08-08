import { describe, expect, it } from 'bun:test'

import { Hono, type MiddlewareHandler } from 'hono'

import type { AppEnv } from '../../../app-env'
import {
  requireCatalogWrite,
  requireContentModerator,
  requireNotBanned,
  requireNotBannedScope,
} from '../middleware'

const guards: ReadonlyArray<[string, MiddlewareHandler<AppEnv>]> = [
  ['requireNotBanned', requireNotBanned],
  ['requireCatalogWrite', requireCatalogWrite],
  ['requireContentModerator', requireContentModerator],
  ['requireNotBannedScope', requireNotBannedScope('product_edit')],
]

describe('authenticated DB guards', () => {
  it.each(guards)(
    '%s returns 401 before reading requestDb when userId is absent',
    async (_, guard) => {
      const app = new Hono<AppEnv>()
      app.use('*', guard)
      app.get('/', (c) => c.json({ ok: true }))

      const res = await app.request('/')
      const body = (await res.json()) as { success: boolean; error: string }

      expect(res.status).toBe(401)
      expect(body).toEqual({ success: false, error: 'unauthorized' })
    }
  )

  it.each(guards)('%s rejects an authenticated request without requestDb', async (_, guard) => {
    const app = new Hono<AppEnv>()
    app.onError((error, c) => c.json({ message: error.message }, 500))
    app.use('*', async (c, next) => {
      c.set('userId', '11111111-2222-3333-4444-555555555555')
      c.set('userRole', 'user')
      await next()
    })
    app.use('*', guard)
    app.get('/', (c) => c.json({ ok: true }))

    const res = await app.request('/')
    const body = (await res.json()) as { message: string }

    expect(res.status).toBe(500)
    expect(body.message).toContain('withRlsContext')
  })
})

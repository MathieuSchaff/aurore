import { describe, expect, it } from 'bun:test'

import { sql } from 'drizzle-orm'
import { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { generateAccessToken } from '../../features/auth/jwt.utils'
import { requireJwtAuth } from '../../features/auth/middleware'
import { withRlsContext } from '../../features/auth/rls-context.middleware'
import { createTestApp } from '../helpers/createTestApp'
import { JWT_SECRET } from '../helpers/secrets'

describe('withRlsContext', () => {
  it('binds app.user_id for the duration of the request', async () => {
    const userId = '11111111-2222-3333-4444-555555555555'

    const app = await createTestApp()

    const probe = new Hono<AppEnv>()
    probe.use('*', requireJwtAuth)
    probe.use('*', withRlsContext)
    probe.get('/rls-probe', async (c) => {
      const db = c.get('db')
      // current_setting with missing_ok=true returns '' instead of throwing when unset
      const rows = await db.execute(sql`SELECT current_setting('app.user_id', true) AS uid`)
      return c.json(rows)
    })

    app.route('/__test__', probe)

    const token = await generateAccessToken(userId, JWT_SECRET)
    const res = await app.request('/__test__/rls-probe', {
      headers: { Authorization: `Bearer ${token}` },
    })

    expect(res.status).toBe(200)
    const body = (await res.json()) as Array<{ uid: string }>
    expect(body[0]?.uid).toBe(userId)
  })

  it('skips RLS context for unauthenticated (no userId) requests', async () => {
    const app = await createTestApp()

    const probe = new Hono<AppEnv>()
    // No requireJwtAuth — no userId set
    probe.use('*', withRlsContext)
    probe.get('/rls-probe-public', (c) => c.json({ ok: true }))

    app.route('/__test_public__', probe)

    const res = await app.request('/__test_public__/rls-probe-public')
    expect(res.status).toBe(200)
  })
})

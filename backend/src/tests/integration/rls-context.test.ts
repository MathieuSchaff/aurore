import { describe, expect, it } from 'bun:test'

import { eq, sql, TransactionRollbackError } from 'drizzle-orm'
import { type Context, Hono, type Next } from 'hono'

import type { AppEnv } from '../../app-env'
import { db as appRuntimeDb } from '../../db'
import { userPreferences } from '../../db/schema'
import { generateAccessToken } from '../../features/auth/jwt.utils'
import { requireJwtAuth } from '../../features/auth/middleware'
import { withRlsContext } from '../../features/auth/rls-context.middleware'
import { getRlsDb } from '../../utils/accessors'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createTestApp } from '../helpers/createTestApp'
import { JWT_SECRET } from '../helpers/secrets'
import { createTestUser } from '../helpers/test-factories'

setupDbTests()

const createRlsTestApp = () => createTestApp({ anonDb: appRuntimeDb })

const REQUEST_DB_AFTER_HEADER = 'x-test-request-db-after-rls'

const exposeRequestDbAfterRls = async (c: Context<AppEnv>, next: Next) => {
  await next()
  c.header(REQUEST_DB_AFTER_HEADER, c.get('requestDb') ? 'present' : 'absent')
}

describe('withRlsContext', () => {
  it('binds app.user_id for the duration of the request', async () => {
    const userId = '11111111-2222-3333-4444-555555555555'

    const app = await createRlsTestApp()

    const probe = new Hono<AppEnv>()
    probe.use('*', requireJwtAuth)
    probe.use('*', exposeRequestDbAfterRls)
    probe.use('*', withRlsContext)
    probe.get('/rls-probe', async (c) => {
      const db = getRlsDb(c)
      // current_setting with missing_ok=true returns '' instead of throwing when unset
      const rows = await db.execute(sql`
        SELECT current_setting('app.user_id', true) AS uid,
               current_setting('app.role', true) AS role
      `)
      return c.json(rows)
    })

    app.route('/__test__', probe)

    const token = await generateAccessToken(userId, 'user', JWT_SECRET)
    const res = await app.request('/__test__/rls-probe', {
      headers: { Authorization: `Bearer ${token}` },
    })

    expect(res.status).toBe(200)
    expect(res.headers.get(REQUEST_DB_AFTER_HEADER)).toBe('absent')
    const body = (await res.json()) as Array<{ uid: string; role: string }>
    expect(body[0]?.uid).toBe(userId)
    expect(body[0]?.role).toBe('user')
  })

  it('skips RLS context for unauthenticated (no userId) requests', async () => {
    const app = await createRlsTestApp()

    const probe = new Hono<AppEnv>()
    // No requireJwtAuth, so no userId is set
    probe.use('*', withRlsContext)
    probe.get('/rls-probe-public', (c) => c.json({ ok: true }))

    app.route('/__test_public__', probe)

    const res = await app.request('/__test_public__/rls-probe-public')
    expect(res.status).toBe(200)
  })

  it('rolls back the tx when the handler throws after a DB insert', async () => {
    // Use a real seeded user so the FK on user_preferences.user_id is satisfied.
    const user = await createTestUser('rls-rollback-probe@test.local', 'Azerty123!')

    const app = await createRlsTestApp()

    const probe = new Hono<AppEnv>()
    probe.use('*', requireJwtAuth)
    probe.use('*', exposeRequestDbAfterRls)
    probe.use('*', withRlsContext)
    probe.post('/fail-after-insert', async (c) => {
      const db = getRlsDb(c)
      await db.insert(userPreferences).values({ userId: user.id, aiConsent: true })
      throw new Error('simulated failure')
    })

    app.route('/__test_rollback__', probe)

    const token = await generateAccessToken(user.id, 'user', JWT_SECRET)
    const res = await app.request('/__test_rollback__/fail-after-insert', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })

    // globalErrorHandler returns 500 for generic errors that are not domain errors.
    expect(res.status).toBeGreaterThanOrEqual(500)
    expect(res.headers.get(REQUEST_DB_AFTER_HEADER)).toBe('absent')

    // Confirm the tx rolled back: the row must not exist outside the request tx.
    const persisted = await testDb
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, user.id))
    expect(persisted).toHaveLength(0)
  })

  it('rejects nested RLS middleware and clears the outer requestDb', async () => {
    const userId = '11111111-2222-3333-4444-555555555555'
    const app = await createRlsTestApp()

    const probe = new Hono<AppEnv>()
    probe.use('*', requireJwtAuth)
    probe.use('*', exposeRequestDbAfterRls)
    probe.use('*', withRlsContext)
    probe.use('*', withRlsContext)
    probe.get('/nested', (c) => c.json({ ok: true }))

    app.route('/__test_nested__', probe)

    const token = await generateAccessToken(userId, 'user', JWT_SECRET)
    const res = await app.request('/__test_nested__/nested', {
      headers: { Authorization: `Bearer ${token}` },
    })

    expect(res.status).toBe(500)
    expect(res.headers.get(REQUEST_DB_AFTER_HEADER)).toBe('absent')
  })

  it('propagates a TransactionRollbackError it did not request', async () => {
    const app = new Hono<AppEnv>()
    const unexpectedRollbackDb = {
      transaction: async () => {
        throw new TransactionRollbackError()
      },
    } as unknown as AppEnv['Variables']['anonDb']

    app.onError((error, c) => c.json({ message: error.message }, 500))
    app.use('*', async (c, next) => {
      c.set('anonDb', unexpectedRollbackDb)
      c.set('userId', '11111111-2222-3333-4444-555555555555')
      c.set('userRole', 'user')
      await next()
    })
    app.use('*', withRlsContext)
    app.get('/unexpected-rollback', (c) => c.json({ ok: true }))

    const res = await app.request('/unexpected-rollback')
    const body = (await res.json()) as { message: string }

    expect(res.status).toBe(500)
    expect(body.message).toBe('Rollback')
  })

  it.each([400, 404, 409, 500] as const)(
    'rolls back the tx when the handler returns a %i response after a DB insert',
    async (status) => {
      const user = await createTestUser(`rls-status-${status}@test.local`, 'Azerty123!')
      const app = await createRlsTestApp()

      const probe = new Hono<AppEnv>()
      probe.use('*', requireJwtAuth)
      probe.use('*', exposeRequestDbAfterRls)
      probe.use('*', withRlsContext)
      probe.post('/fail-after-insert', async (c) => {
        const db = getRlsDb(c)
        await db.insert(userPreferences).values({ userId: user.id, aiConsent: true })
        return c.json({ success: false, error: 'expected_failure' }, status)
      })

      app.route('/__test_status_rollback__', probe)

      const token = await generateAccessToken(user.id, 'user', JWT_SECRET)
      const res = await app.request('/__test_status_rollback__/fail-after-insert', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.status).toBe(status)
      expect(res.headers.get(REQUEST_DB_AFTER_HEADER)).toBe('absent')

      const persisted = await testDb
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, user.id))
      expect(persisted).toHaveLength(0)
    }
  )
})

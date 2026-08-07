/**
 * Regression test: seedDemoData must run inside the RLS-context transaction.
 *
 * createTestApp injects the owner (superuser) testDb, which bypasses RLS entirely.
 * This test forces the demo route to use a real app_runtime pool so RLS WITH CHECK
 * is enforced. If seedDemoData were moved back outside the transaction, every INSERT
 * it makes would fail with "new row violates row-level security policy".
 */
import { describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { bindRlsContext } from '../../db/rls'
import { profiles } from '../../db/schema'
import { createDemo } from '../../features/auth/service'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb } from '../helpers/app-runtime-db'
import { expectOk } from '../helpers/expectStatus'
import { createRlsApp } from '../helpers/rls-app'
import { JWT_SECRET, REFRESH_SECRET } from '../helpers/secrets'

// Real app_runtime connection: RLS is fully enforced here.
const appRuntimeDb = await createAppRuntimeDb()

setupDbTests()

describe('POST /auth/demo — RLS enforcement via app_runtime', () => {
  it('creates a demo account with seed data when app_runtime pool is the db handle', async () => {
    const { jwtAuthRoutes } = await import('../../features/auth/routes')
    const app = createRlsApp(appRuntimeDb).route('/auth', jwtAuthRoutes)

    // 201 proves the full createDemo + seedDemoData path succeeded under RLS.
    const body = await expectOk<{ user: { isDemo: boolean } }>(
      app.request('/auth/demo', { method: 'POST' }),
      HTTP_STATUS.CREATED
    )
    expect(body.user.isDemo).toBe(true)
  })

  it('isolates demo accounts: one cannot read another seeded rows under RLS', async () => {
    const ctx = {
      db: appRuntimeDb,
      jwtSecret: JWT_SECRET,
      refreshSecret: REFRESH_SECRET,
      frontendUrl: 'http://localhost:5173',
      ip: '127.0.0.1',
      userAgent: 'test',
    }

    const a = await createDemo(ctx)
    const b = await createDemo(ctx)
    if (!a.success || !b.success) throw new Error('demo creation failed')
    const aId = a.data.user.id
    const bId = b.data.user.id
    expect(aId).not.toBe(bId)

    // Read profiles with A's RLS context bound on the app_runtime pool: policies
    // must scope the result to A's rows only.
    const aRows = await appRuntimeDb.transaction(async (tx) => {
      await bindRlsContext(tx, aId)
      return tx.select({ userId: profiles.userId }).from(profiles)
    })

    expect(aRows.length).toBeGreaterThan(0)
    expect(aRows.every((row) => row.userId === aId)).toBe(true)
    expect(aRows.some((row) => row.userId === bId)).toBe(false)
  })
})

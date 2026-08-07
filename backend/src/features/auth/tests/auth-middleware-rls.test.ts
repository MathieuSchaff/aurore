import { afterEach, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { eq } from 'drizzle-orm'
import { Hono, type MiddlewareHandler } from 'hono'

import type { AppEnv } from '../../../app-env'
import { db as appRuntimeDb } from '../../../db'
import { userBans, users } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestApp } from '../../../tests/helpers/createTestApp'
import { expectError } from '../../../tests/helpers/expectStatus'
import { JWT_SECRET } from '../../../tests/helpers/secrets'
import {
  createTestAdminUser,
  createTestContributorUser,
  createTestUser,
} from '../../../tests/helpers/test-factories'
import { clearBanCache } from '../ban.service'
import { generateAccessToken } from '../jwt.utils'
import {
  requireCatalogWrite,
  requireContentModerator,
  requireJwtAuth,
  requireNotBanned,
  requireNotBannedScope,
} from '../middleware'
import { withRlsContext } from '../rls-context.middleware'

setupDbTests()

const roleGuards: ReadonlyArray<[string, MiddlewareHandler<AppEnv>]> = [
  ['requireCatalogWrite', requireCatalogWrite],
  ['requireContentModerator', requireContentModerator],
]

describe('authenticated DB guards under app_runtime', () => {
  beforeEach(() => {
    clearBanCache()
  })

  afterEach(() => {
    clearBanCache()
  })

  it('rejects an active global ban through the request RLS transaction', async () => {
    const user = await createTestUser('middleware-ban-user@test.local', 'Azerty123!')
    const admin = await createTestAdminUser('middleware-ban-admin@test.local', 'Azerty123!')
    await testDb.insert(userBans).values({
      userId: user.id,
      scope: 'global',
      bannedBy: admin.id,
      reason: 'spam',
    })

    const app = await createTestApp({ anonDb: appRuntimeDb })
    const probe = new Hono<AppEnv>()
    probe.use('*', requireJwtAuth)
    probe.use('*', withRlsContext)
    probe.use('*', requireNotBanned)
    probe.get('/guarded', (c) => c.json({ ok: true }))
    app.route('/__test_auth_guard__', probe)

    const token = await generateAccessToken(user.id, 'user', JWT_SECRET)
    const res = await app.request('/__test_auth_guard__/guarded', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const body = await expectError<{ reason?: string }>(res, HTTP_STATUS.FORBIDDEN, 'banned')
    expect(body.details?.reason).toBe('spam')
  })

  it('rejects an active scoped ban after the global ban guard', async () => {
    const user = await createTestUser('middleware-scope-user@test.local', 'Azerty123!')
    const admin = await createTestAdminUser('middleware-scope-admin@test.local', 'Azerty123!')
    await testDb.insert(userBans).values({
      userId: user.id,
      scope: 'product_edit',
      bannedBy: admin.id,
      reason: 'unsafe edits',
    })

    const app = await createTestApp({ anonDb: appRuntimeDb })
    const probe = new Hono<AppEnv>()
    probe.use('*', requireJwtAuth)
    probe.use('*', withRlsContext)
    probe.use('*', requireNotBanned)
    probe.use('*', requireNotBannedScope('product_edit'))
    probe.post('/guarded', (c) => c.json({ ok: true }))
    app.route('/__test_scope_guard__', probe)

    const token = await generateAccessToken(user.id, 'user', JWT_SECRET)
    const res = await app.request('/__test_scope_guard__/guarded', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    const body = await expectError<{ scope?: string }>(res, HTTP_STATUS.FORBIDDEN, 'banned')
    expect(body.details?.scope).toBe('product_edit')
  })
  it.each(roleGuards)(
    '%s reads the fresh DB role instead of the JWT claim',
    async (name, guard) => {
      const user = await createTestContributorUser(
        `middleware-role-${name.toLowerCase()}@test.local`,
        'Azerty123!'
      )
      const token = await generateAccessToken(user.id, 'contributor', JWT_SECRET)
      const app = await createTestApp({ anonDb: appRuntimeDb })
      const probe = new Hono<AppEnv>()
      probe.use('*', requireJwtAuth)
      probe.use('*', withRlsContext)
      probe.use('*', guard)
      probe.get('/guarded', (c) => c.json({ ok: true }))
      app.route('/__test_role_guard__', probe)

      const beforeDemotion = await app.request('/__test_role_guard__/guarded', {
        headers: { Authorization: `Bearer ${token}` },
      })
      expect(beforeDemotion.status).toBe(200)

      await testDb.update(users).set({ role: 'user' }).where(eq(users.id, user.id))

      const afterDemotion = await app.request('/__test_role_guard__/guarded', {
        headers: { Authorization: `Bearer ${token}` },
      })
      await expectError(afterDemotion, HTTP_STATUS.FORBIDDEN, 'forbidden')
    }
  )

  it('serves /auth/session through the request RLS transaction', async () => {
    const user = await createTestContributorUser(
      'middleware-session-contributor@test.local',
      'Azerty123!'
    )
    const token = await generateAccessToken(user.id, 'contributor', JWT_SECRET)
    const app = await createTestApp({ anonDb: appRuntimeDb })

    const res = await app.request('/api/auth/session', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const body = (await res.json()) as { data?: { role?: string } }

    expect(res.status).toBe(200)
    expect(body.data?.role).toBe('contributor')
  })
})

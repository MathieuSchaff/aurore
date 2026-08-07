import { describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { db as appRuntimeDb } from '../../../db'
import { users } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestApp } from '../../../tests/helpers/createTestApp'
import { expectError } from '../../../tests/helpers/expectStatus'
import { JWT_SECRET } from '../../../tests/helpers/secrets'
import { createTestContributorUser } from '../../../tests/helpers/test-factories'
import { getRlsDb } from '../../../utils/accessors'
import { generateAccessToken } from '../../auth/jwt.utils'
import { requireContentModerator } from '../../auth/middleware'
import { createAdminGuardedRouter } from '../_guarded-router'

setupDbTests()

describe('createAdminGuardedRouter', () => {
  it('establishes request RLS before ban and fresh-role guards', async () => {
    const user = await createTestContributorUser(
      'guarded-router-contributor@test.local',
      'Azerty123!'
    )
    const token = await generateAccessToken(user.id, 'contributor', JWT_SECRET)
    const app = await createTestApp({ anonDb: appRuntimeDb })
    const guarded = createAdminGuardedRouter(requireContentModerator).get('/', (c) => {
      getRlsDb(c)
      return c.json({ ok: true })
    })
    app.route('/__test_admin_guard__', guarded)

    const allowed = await app.request('/__test_admin_guard__', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(allowed.status).toBe(200)

    await testDb.update(users).set({ role: 'user' }).where(eq(users.id, user.id))

    const demoted = await app.request('/__test_admin_guard__', {
      headers: { Authorization: `Bearer ${token}` },
    })
    await expectError(demoted, HTTP_STATUS.FORBIDDEN, 'forbidden')
  })
})

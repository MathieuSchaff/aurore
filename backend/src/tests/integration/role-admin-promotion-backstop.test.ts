/**
 * DB backstop regression (migration 0091): the application pool (app_runtime) may
 * never write role='admin'. This is the fail-closed layer behind the route guard +
 * shared validator — if the validator on the role-write path is ever relaxed, the DB
 * still refuses an admin promotion. Demote->'user' and promote->'contributor' (16b)
 * stay allowed; the table owner (`app`, used by seed/migrations) is exempt.
 *
 * Like user-bans-rls, route tests run as the owner `app` (exempt), so the trigger is
 * only observable under the real app_runtime pool — hence the dedicated connection.
 */
import { describe, expect, it } from 'bun:test'

import { eq, sql } from 'drizzle-orm'

import { users } from '../../db/schema'
import { getOrCreateSeedUser } from '../../db/seed/seeders/create-user'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb } from '../helpers/app-runtime-db'
import { createTestContributorUser, createTestUser } from '../helpers/test-factories'

const appRuntimeDb = await createAppRuntimeDb()

function setRoleAs(userId: string, role: 'user' | 'admin' | 'contributor') {
  return appRuntimeDb
    .update(users)
    .set({ role })
    .where(eq(users.id, userId))
    .returning({ id: users.id, role: users.role })
}

// Kept over .rejects.toThrow(): that matcher hangs on bun SQL tagged templates
// (see role-separation.test.ts) and silently passes when the await is dropped.
async function rejected(run: () => Promise<unknown>): Promise<boolean> {
  try {
    await run()
    return false
  } catch {
    return true
  }
}

setupDbTests()

describe('users role backstop under app_runtime (migration 0091)', () => {
  it('rejects an app_runtime UPDATE promoting a user to admin', async () => {
    const user = await createTestUser('backstop-promote@test.local', 'Azerty123!')
    expect(await rejected(() => setRoleAs(user.id, 'admin'))).toBe(true)
  })

  it('rejects an app_runtime UPDATE promoting a contributor to admin', async () => {
    const modo = await createTestContributorUser('backstop-modo@test.local', 'Azerty123!')
    expect(await rejected(() => setRoleAs(modo.id, 'admin'))).toBe(true)
  })

  it('allows an app_runtime demote of a contributor to user', async () => {
    const modo = await createTestContributorUser('backstop-demote@test.local', 'Azerty123!')
    const rows = await setRoleAs(modo.id, 'user')
    expect(rows[0]?.role).toBe('user')
  })

  it('allows an app_runtime promote of a user to contributor (role-request 16b)', async () => {
    const user = await createTestUser('backstop-contrib@test.local', 'Azerty123!')
    const rows = await setRoleAs(user.id, 'contributor')
    expect(rows[0]?.role).toBe('contributor')
  })

  it('rejects an app_runtime INSERT of an admin user', async () => {
    const threw = await rejected(() =>
      appRuntimeDb.execute(sql`
        INSERT INTO users (email, role) VALUES ('backstop-insert@test.local', 'admin')
      `)
    )
    expect(threw).toBe(true)
  })

  it('lets the table owner set role=admin (seed/migration path stays exempt)', async () => {
    const user = await createTestUser('backstop-owner@test.local', 'Azerty123!')
    await testDb.update(users).set({ role: 'admin' }).where(eq(users.id, user.id))
    const [row] = await testDb.select({ role: users.role }).from(users).where(eq(users.id, user.id))
    expect(row?.role).toBe('admin')
  })

  // The exemption above is only worth anything if the seed actually reaches it.
  // It did not: the seeder ran on the app_runtime pool, so a fresh DB refused
  // its own bootstrap. Both branches are covered: creation, then reuse.
  it('promotes the seed user on both branches of getOrCreateSeedUser', async () => {
    const email = 'backstop-seed-bootstrap@test.local'
    const created = await getOrCreateSeedUser(email, 'Azerty123!seed')

    const readBack = async () => {
      const [row] = await testDb
        .select({ role: users.role, emailVerifiedAt: users.emailVerifiedAt })
        .from(users)
        .where(eq(users.id, created.id))
      return row
    }

    expect((await readBack())?.role).toBe('admin')
    expect((await readBack())?.emailVerifiedAt).not.toBeNull()

    await testDb.update(users).set({ role: 'user' }).where(eq(users.id, created.id))
    await getOrCreateSeedUser(email, 'Azerty123!seed')
    expect((await readBack())?.role).toBe('admin')
  })
})

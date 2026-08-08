/**
 * RLS regression for user_bans under the real app_runtime pool.
 * Route-level tests run as the table-owner `app` (implicit BYPASSRLS), which masks
 * production: APP_DATABASE_URL connects as `app_runtime` (no BYPASSRLS). user_bans needs
 * more than tenant_isolation + admin_bypass: a contributor ("modérateur") could not
 * otherwise write any ban under prod RLS. S4 adds user_bans_moderation_scoped: a
 * contributor may act on bans whose scope !== 'global'; the 'global' lockout stays admin-only.
 */
import { describe, expect, it } from 'bun:test'

import type { BanScope } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { userBans } from '../../db/schema'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb, withRlsAs } from '../helpers/app-runtime-db'
import {
  createTestAdminUser,
  createTestContributorUser,
  createTestUser,
} from '../helpers/test-factories'

const appRuntimeDb = await createAppRuntimeDb()

type BanValues = { userId: string; scope: BanScope; bannedBy: string }

function insertBanAs(role: string, contextUserId: string, values: BanValues) {
  return withRlsAs(appRuntimeDb, role, contextUserId, (tx) =>
    tx.insert(userBans).values(values).returning({ id: userBans.id, scope: userBans.scope })
  )
}

function deleteBanAs(role: string, contextUserId: string, banId: string) {
  return withRlsAs(appRuntimeDb, role, contextUserId, (tx) =>
    tx.delete(userBans).where(eq(userBans.id, banId)).returning({ id: userBans.id })
  )
}

function updateBanAs(
  role: string,
  contextUserId: string,
  banId: string,
  set: Partial<{ reason: string; scope: BanScope }>
) {
  return withRlsAs(appRuntimeDb, role, contextUserId, (tx) =>
    tx.update(userBans).set(set).where(eq(userBans.id, banId)).returning({ id: userBans.id })
  )
}

function selectScopesAs(role: string, contextUserId: string, userId: string) {
  return withRlsAs(appRuntimeDb, role, contextUserId, async (tx) => {
    const rows = await tx
      .select({ scope: userBans.scope })
      .from(userBans)
      .where(eq(userBans.userId, userId))
    return rows.map((r) => r.scope)
  })
}

setupDbTests()

describe('user_bans RLS under app_runtime', () => {
  it('lets a contributor INSERT a content-scoped ban', async () => {
    const target = await createTestUser('ub-target@test.local', 'Azerty123!')
    const modo = await createTestContributorUser('ub-modo@test.local', 'Azerty123!')

    const rows = await insertBanAs('contributor', modo.id, {
      userId: target.id,
      scope: 'review_publish',
      bannedBy: modo.id,
    })
    expect(rows).toHaveLength(1)
    expect(rows[0]?.scope).toBe('review_publish')
  })

  it('rejects a contributor INSERT of a global ban (WITH CHECK)', async () => {
    const target = await createTestUser('ub-g-target@test.local', 'Azerty123!')
    const modo = await createTestContributorUser('ub-g-modo@test.local', 'Azerty123!')

    await expect(
      insertBanAs('contributor', modo.id, {
        userId: target.id,
        scope: 'global',
        bannedBy: modo.id,
      })
    ).rejects.toThrow()
  })

  it('lets a contributor DELETE a content-scoped ban but not a global one', async () => {
    const target = await createTestUser('ub-del-target@test.local', 'Azerty123!')
    const admin = await createTestAdminUser('ub-del-admin@test.local', 'Azerty123!')
    const modo = await createTestContributorUser('ub-del-modo@test.local', 'Azerty123!')

    const seeded = await testDb
      .insert(userBans)
      .values([
        { userId: target.id, scope: 'review_publish', bannedBy: admin.id },
        { userId: target.id, scope: 'global', bannedBy: admin.id },
      ])
      .returning({ id: userBans.id, scope: userBans.scope })
    const content = seeded.find((b) => b.scope === 'review_publish')
    const global = seeded.find((b) => b.scope === 'global')
    if (!content || !global) throw new Error('seed failed')

    const deletedContent = await deleteBanAs('contributor', modo.id, content.id)
    expect(deletedContent).toHaveLength(1)

    const deletedGlobal = await deleteBanAs('contributor', modo.id, global.id)
    expect(deletedGlobal).toHaveLength(0)
  })

  it('hides a global ban from a contributor UPDATE (USING → 0 rows)', async () => {
    const target = await createTestUser('ub-upd-target@test.local', 'Azerty123!')
    const admin = await createTestAdminUser('ub-upd-admin@test.local', 'Azerty123!')
    const modo = await createTestContributorUser('ub-upd-modo@test.local', 'Azerty123!')

    const [g] = await testDb
      .insert(userBans)
      .values({ userId: target.id, scope: 'global', bannedBy: admin.id })
      .returning({ id: userBans.id })
    if (!g) throw new Error('seed failed')

    const updated = await updateBanAs('contributor', modo.id, g.id, { reason: 'x' })
    expect(updated).toHaveLength(0)
  })

  it('rejects a contributor flipping a content ban to global (WITH CHECK)', async () => {
    const target = await createTestUser('ub-flip-target@test.local', 'Azerty123!')
    const admin = await createTestAdminUser('ub-flip-admin@test.local', 'Azerty123!')
    const modo = await createTestContributorUser('ub-flip-modo@test.local', 'Azerty123!')

    const [c] = await testDb
      .insert(userBans)
      .values({ userId: target.id, scope: 'review_publish', bannedBy: admin.id })
      .returning({ id: userBans.id })
    if (!c) throw new Error('seed failed')

    await expect(updateBanAs('contributor', modo.id, c.id, { scope: 'global' })).rejects.toThrow()
  })

  it('hides global bans from a contributor SELECT, shows content-scoped ones', async () => {
    const target = await createTestUser('ub-sel-target@test.local', 'Azerty123!')
    const admin = await createTestAdminUser('ub-sel-admin@test.local', 'Azerty123!')
    const modo = await createTestContributorUser('ub-sel-modo@test.local', 'Azerty123!')

    await testDb.insert(userBans).values([
      { userId: target.id, scope: 'review_publish', bannedBy: admin.id },
      { userId: target.id, scope: 'global', bannedBy: admin.id },
    ])

    const scopes = await selectScopesAs('contributor', modo.id, target.id)
    expect(scopes).toEqual(['review_publish'])
  })

  it('still lets an admin INSERT a global ban (admin_bypass)', async () => {
    const target = await createTestUser('ub-adm-target@test.local', 'Azerty123!')
    const admin = await createTestAdminUser('ub-adm-admin@test.local', 'Azerty123!')

    const rows = await insertBanAs('admin', admin.id, {
      userId: target.id,
      scope: 'global',
      bannedBy: admin.id,
    })
    expect(rows).toHaveLength(1)
  })
})

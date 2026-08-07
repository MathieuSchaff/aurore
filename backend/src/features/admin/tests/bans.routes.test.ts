import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { moderationActions, userBans } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestClient,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectError, expectOk, expectStatus } from '../../../tests/helpers/expectStatus'
import { login } from '../../../tests/helpers/login'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import {
  createTestAdminUser,
  createTestContributorUser,
  createTestUser,
} from '../../../tests/helpers/test-factories'
import { clearBanCache } from '../../auth/ban.service'

// Raw insert on purpose: the ban routes are the subject of this suite, so the
// fixtures must not go through them.
async function seedBan(values: typeof userBans.$inferInsert): Promise<string> {
  const [row] = await testDb.insert(userBans).values(values).returning({ id: userBans.id })
  if (!row) throw new Error('ban seed failed')
  return row.id
}

function bansForUser(userId: string) {
  return testDb.select().from(userBans).where(eq(userBans.userId, userId))
}

function bansById(banId: string) {
  return testDb.select().from(userBans).where(eq(userBans.id, banId))
}

function moderationTrailFor(targetUserId: string) {
  return testDb
    .select()
    .from(moderationActions)
    .where(eq(moderationActions.targetUserId, targetUserId))
}

setupDbTests()

describe('POST /admin/users/:id/bans', () => {
  let client: TestClient
  let userId: string
  let adminId: string
  let adminToken: string
  let userToken: string

  beforeAll(async () => {
    client = await createTestClient()
  })

  beforeEach(async () => {
    clearBanCache()
    const toto = TEST_CREDENTIALS.toto
    const admin = TEST_CREDENTIALS.admin
    const user = await createTestUser(toto.rawEmail, toto.rawPassword)
    const adminUser = await createTestAdminUser(admin.rawEmail, admin.rawPassword)
    userId = user.id
    adminId = adminUser.id
    userToken = await login(client, toto.rawEmail, toto.rawPassword)
    adminToken = await login(client, admin.rawEmail, admin.rawPassword)
  })

  // The ban cache is in-memory, so the DB truncate of setupDbTests() never reaches it.
  afterEach(() => {
    clearBanCache()
  })

  it('admin creates a global ban (201, row inserted, cache invalidated)', async () => {
    const ban = await expectOk(
      client.admin.users[':id'].bans.$post(
        {
          param: { id: userId },
          json: { scope: 'global', reason: 'spam' },
        },
        withAuth(adminToken)
      ),
      HTTP_STATUS.CREATED
    )
    expect(ban).toMatchObject({
      userId,
      scope: 'global',
      reason: 'spam',
      bannedBy: adminId,
      expiresAt: null,
    })

    expect(await bansForUser(userId)).toHaveLength(1)
    // Cache invalidation for the target is asserted by the end-to-end test below
    // (admin's own /auth/session warms the cache first, which makes a size check noisy).
  })

  it('admin creates a ban with future expiresAt', async () => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const ban = await expectOk(
      client.admin.users[':id'].bans.$post(
        {
          param: { id: userId },
          json: { scope: 'global', expiresAt: future },
        },
        withAuth(adminToken)
      ),
      HTTP_STATUS.CREATED
    )
    expect(Date.parse(ban.expiresAt ?? '')).toBe(Date.parse(future))
  })

  it('non-admin caller gets 403 forbidden', async () => {
    await expectError(
      client.admin.users[':id'].bans.$post(
        { param: { id: adminId }, json: { scope: 'global' } },
        withAuth(userToken)
      ),
      HTTP_STATUS.FORBIDDEN,
      'forbidden'
    )
  })

  it('self-ban rejected with cannot_self_ban (400)', async () => {
    await expectError(
      client.admin.users[':id'].bans.$post(
        { param: { id: adminId }, json: { scope: 'global' } },
        withAuth(adminToken)
      ),
      HTTP_STATUS.BAD_REQUEST,
      'cannot_self_ban'
    )
  })

  it('target user not found returns 404', async () => {
    const ghost = '019d0000-0000-7000-8000-00000000ffff'
    await expectError(
      client.admin.users[':id'].bans.$post(
        { param: { id: ghost }, json: { scope: 'global' } },
        withAuth(adminToken)
      ),
      HTTP_STATUS.NOT_FOUND,
      'not_found'
    )
  })

  it('expiresAt in the past returns 400 invalid_input', async () => {
    const past = new Date(Date.now() - 60_000).toISOString()
    await expectError(
      client.admin.users[':id'].bans.$post(
        { param: { id: userId }, json: { scope: 'global', expiresAt: past } },
        withAuth(adminToken)
      ),
      HTTP_STATUS.BAD_REQUEST,
      'invalid_input'
    )
  })

  it('rejects whitespace-only reason as invalid (zod trim().min(1))', async () => {
    const res = await client.admin.users[':id'].bans.$post(
      {
        param: { id: userId },
        json: { scope: 'global', reason: '   ' },
      },
      withAuth(adminToken)
    )

    expectStatus(res, HTTP_STATUS.BAD_REQUEST)
  })

  it('GET /admin/users/:id/bans lists bans newest-first for admin', async () => {
    const old = new Date(Date.now() - 60_000).toISOString()
    const recent = new Date().toISOString()
    await testDb.insert(userBans).values([
      { userId, scope: 'global', bannedBy: adminId, reason: 'old', createdAt: old },
      { userId, scope: 'global', bannedBy: adminId, reason: 'recent', createdAt: recent },
    ])

    const bans = await expectOk(
      client.admin.users[':id'].bans.$get({ param: { id: userId } }, withAuth(adminToken))
    )
    expect(bans).toHaveLength(2)
    expect(bans[0]?.reason).toBe('recent')
    expect(bans[1]?.reason).toBe('old')
  })

  it('GET /admin/users/:id/bans returns 403 for non-admin', async () => {
    const res = await client.admin.users[':id'].bans.$get(
      { param: { id: userId } },
      withAuth(userToken)
    )

    expectStatus(res, HTTP_STATUS.FORBIDDEN)
  })

  it('DELETE /admin/bans/:banId lifts the ban and allows the user again', async () => {
    const banId = await seedBan({ userId, scope: 'global', bannedBy: adminId, reason: 'oops' })
    clearBanCache()

    const banned = await client.auth.session.$get({}, withAuth(userToken))
    expectStatus(banned, HTTP_STATUS.FORBIDDEN)

    const lift = await client.admin.bans[':banId'].$delete(
      { param: { banId } },
      withAuth(adminToken)
    )
    expect(lift.status).toBe(HTTP_STATUS.OK)

    const allowed = await client.auth.session.$get({}, withAuth(userToken))
    expect(allowed.status).toBe(HTTP_STATUS.OK)

    expect(await bansById(banId)).toHaveLength(0)
  })

  it('DELETE /admin/bans/:banId records what the deletion destroys', async () => {
    const banId = await seedBan({ userId, scope: 'global', bannedBy: adminId, reason: 'oops' })
    clearBanCache()

    await client.admin.bans[':banId'].$delete({ param: { banId } }, withAuth(adminToken))

    const [trail] = await moderationTrailFor(userId)

    // The ban row is gone, so this structured payload is the only place these still exist.
    expect(trail).toMatchObject({
      actorId: adminId,
      action: 'ban_lifted',
      details: { scope: 'global', reason: 'oops', bannedBy: adminId },
    })
  })

  it('DELETE /admin/bans/:banId returns 404 when banId does not exist', async () => {
    const ghost = '019d0000-0000-7000-8000-000000000bad'
    await expectError(
      client.admin.bans[':banId'].$delete({ param: { banId: ghost } }, withAuth(adminToken)),
      HTTP_STATUS.NOT_FOUND,
      'not_found'
    )
  })

  it('DELETE /admin/bans/:banId returns 403 for non-admin', async () => {
    const banId = await seedBan({ userId, scope: 'global', bannedBy: adminId })

    const res = await client.admin.bans[':banId'].$delete({ param: { banId } }, withAuth(userToken))

    expectStatus(res, HTTP_STATUS.FORBIDDEN)
  })

  it('GET /admin/users returns recent users newest-first for admin', async () => {
    const users = await expectOk(client.admin.users.$get({}, withAuth(adminToken)))

    // Setup creates user then admin, so admin is newer and comes first.
    expect(users.items.length).toBeGreaterThanOrEqual(2)
    const ids = users.items.map((u) => u.id)
    expect(ids).toContain(userId)
    expect(ids).toContain(adminId)
    // Each item has the safe-projection shape (no password_hash / google_sub)
    const firstItem = users.items[0]
    expect(firstItem).toHaveProperty('email')
    expect(firstItem).toHaveProperty('role')
    expect(firstItem).toHaveProperty('emailVerifiedAt')
    expect(firstItem).not.toHaveProperty('passwordHash')
  })

  it('GET /admin/users returns 403 for non-admin', async () => {
    const res = await client.admin.users.$get({}, withAuth(userToken))
    expectStatus(res, HTTP_STATUS.FORBIDDEN)
  })

  it('PATCH /admin/bans/:banId extends expiresAt and invalidates cache', async () => {
    const banId = await seedBan({ userId, scope: 'global', bannedBy: adminId, reason: 'first' })
    clearBanCache()

    // Warm cache as the target user
    const warm = await client.auth.session.$get({}, withAuth(userToken))
    expectStatus(warm, HTTP_STATUS.FORBIDDEN)

    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const patchedBan = await expectOk(
      client.admin.bans[':banId'].$patch(
        {
          param: { banId },
          json: { expiresAt: future, reason: 'extended' },
        },
        withAuth(adminToken)
      )
    )
    expect(patchedBan.expiresAt && Date.parse(patchedBan.expiresAt)).toBe(Date.parse(future))
    expect(patchedBan.reason).toBe('extended')

    const [trail] = await moderationTrailFor(userId)
    expect(trail).toMatchObject({
      actorId: adminId,
      action: 'ban_updated',
      details: { scope: 'global', expiresAtChanged: true, expiresAt: future, reasonChanged: true },
    })

    // Cache was invalidated, so /auth/session reads fresh state (still banned, expiry not reached)
    const after = await client.auth.session.$get({}, withAuth(userToken))
    expectStatus(after, HTTP_STATUS.FORBIDDEN)
  })

  it('PATCH /admin/bans/:banId can clear expiresAt (make permanent)', async () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const banId = await seedBan({
      userId,
      scope: 'global',
      bannedBy: adminId,
      expiresAt: tomorrow,
    })

    const patchedBan = await expectOk(
      client.admin.bans[':banId'].$patch(
        {
          param: { banId },
          json: { expiresAt: null },
        },
        withAuth(adminToken)
      )
    )
    expect(patchedBan.expiresAt).toBeNull()
  })

  it('PATCH /admin/bans/:banId rejects past expiresAt with 400 invalid_input', async () => {
    const banId = await seedBan({ userId, scope: 'global', bannedBy: adminId })

    const past = new Date(Date.now() - 60_000).toISOString()
    await expectError(
      client.admin.bans[':banId'].$patch(
        { param: { banId }, json: { expiresAt: past } },
        withAuth(adminToken)
      ),
      HTTP_STATUS.BAD_REQUEST,
      'invalid_input'
    )
  })

  it('PATCH /admin/bans/:banId returns 404 when banId does not exist', async () => {
    const ghost = '019d0000-0000-7000-8000-00000000bad0'
    const res = await client.admin.bans[':banId'].$patch(
      {
        param: { banId: ghost },
        json: { reason: 'whatever' },
      },
      withAuth(adminToken)
    )

    expectStatus(res, HTTP_STATUS.NOT_FOUND)
  })

  it('PATCH /admin/bans/:banId rejects empty body (400 invalid_input via zod refine)', async () => {
    const banId = await seedBan({ userId, scope: 'global', bannedBy: adminId })

    const res = await client.admin.bans[':banId'].$patch(
      { param: { banId }, json: {} },
      withAuth(adminToken)
    )

    expectStatus(res, HTTP_STATUS.BAD_REQUEST)
  })

  it('PATCH /admin/bans/:banId returns 403 for non-admin', async () => {
    const banId = await seedBan({ userId, scope: 'global', bannedBy: adminId })

    const res = await client.admin.bans[':banId'].$patch(
      { param: { banId }, json: { reason: 'noop' } },
      withAuth(userToken)
    )

    expectStatus(res, HTTP_STATUS.FORBIDDEN)
  })

  it('end-to-end: ban created then /auth/session returns 403 banned immediately', async () => {
    const beforeRes = await client.auth.session.$get({}, withAuth(userToken))
    expect(beforeRes.status).toBe(HTTP_STATUS.OK)

    await client.admin.users[':id'].bans.$post(
      {
        param: { id: userId },
        json: { scope: 'global', reason: 'manual ops' },
      },
      withAuth(adminToken)
    )

    const body = await expectError<{ reason: string; expiresAt: string | null }>(
      client.auth.session.$get({}, withAuth(userToken)),
      HTTP_STATUS.FORBIDDEN,
      'banned'
    )
    expect(body.details).toMatchObject({ reason: 'manual ops', expiresAt: null })
  })
})

// Contributors can manage reversible, content-scoped bans. Global account lockout
// stays admin-only. These route-level tests run as the table-owner `app` (BYPASSRLS),
// so they exercise the app-level guard + handler scope gate; DB-level RLS has its own test.
describe('Contributor (moderator) content-scoped bans', () => {
  let client: TestClient
  let targetId: string
  let contributorId: string
  let adminId: string
  let contributorToken: string
  let userToken: string

  beforeAll(async () => {
    client = await createTestClient()
  })

  beforeEach(async () => {
    clearBanCache()
    const target = await createTestUser('s4-target@test.local', 'Azerty123!')
    const contributor = await createTestContributorUser('s4-modo@test.local', 'Azerty123!')
    const admin = await createTestAdminUser('s4-admin@test.local', 'Azerty123!')
    targetId = target.id
    contributorId = contributor.id
    adminId = admin.id
    contributorToken = await login(client, 's4-modo@test.local', 'Azerty123!')
    userToken = await login(client, 's4-target@test.local', 'Azerty123!')
  })

  afterEach(() => {
    clearBanCache()
  })

  it('contributor creates a content-scoped ban (review_publish): 201, bannedBy=contributor', async () => {
    const ban = await expectOk(
      client.admin.users[':id'].bans.$post(
        { param: { id: targetId }, json: { scope: 'review_publish', reason: 'spam reviews' } },
        withAuth(contributorToken)
      ),
      HTTP_STATUS.CREATED
    )
    expect(ban).toMatchObject({
      userId: targetId,
      scope: 'review_publish',
      bannedBy: contributorId,
    })
  })

  it('contributor creating a global ban: 403 forbidden', async () => {
    await expectError(
      client.admin.users[':id'].bans.$post(
        { param: { id: targetId }, json: { scope: 'global', reason: 'nope' } },
        withAuth(contributorToken)
      ),
      HTTP_STATUS.FORBIDDEN,
      'forbidden'
    )

    expect(await bansForUser(targetId)).toHaveLength(0)
  })

  it('contributor lifts a content-scoped ban: 200, row deleted', async () => {
    const banId = await seedBan({
      userId: targetId,
      scope: 'review_publish',
      bannedBy: adminId,
      reason: 'x',
    })
    clearBanCache()

    const res = await client.admin.bans[':banId'].$delete(
      { param: { banId } },
      withAuth(contributorToken)
    )

    expect(res.status).toBe(HTTP_STATUS.OK)
    expect(await bansById(banId)).toHaveLength(0)
  })

  // The app-level gate returns 403 here (owner `app`, BYPASSRLS, so getBanScope sees the
  // global row). Under prod RLS the same request is 404 (the row is hidden from the
  // contributor, so not_found); the DB-level denial is proven in user-bans-rls.test.ts.
  it('contributor lifting a global ban: 403 forbidden, ban survives', async () => {
    const banId = await seedBan({ userId: targetId, scope: 'global', bannedBy: adminId })

    await expectError(
      client.admin.bans[':banId'].$delete({ param: { banId } }, withAuth(contributorToken)),
      HTTP_STATUS.FORBIDDEN,
      'forbidden'
    )

    expect(await bansById(banId)).toHaveLength(1)
  })

  it('contributor lists user bans: 200 (queue reachable by moderator)', async () => {
    const res = await client.admin.users[':id'].bans.$get(
      { param: { id: targetId } },
      withAuth(contributorToken)
    )
    expect(res.status).toBe(HTTP_STATUS.OK)
  })

  // Pins the admin-vs-contributor boundary: PATCH stays requireAdmin, so a
  // contributor is rejected (the plain-user 403 test can't catch a regression
  // that loosened PATCH to requireContentModerator).
  it('contributor cannot update a ban (PATCH stays admin-only): 403', async () => {
    const banId = await seedBan({ userId: targetId, scope: 'review_publish', bannedBy: adminId })

    const res = await client.admin.bans[':banId'].$patch(
      { param: { banId }, json: { reason: 'nope' } },
      withAuth(contributorToken)
    )
    expectStatus(res, HTTP_STATUS.FORBIDDEN)
  })

  it('plain user creating a content-scoped ban: 403, nothing inserted', async () => {
    const res = await client.admin.users[':id'].bans.$post(
      { param: { id: contributorId }, json: { scope: 'review_publish' } },
      withAuth(userToken)
    )
    expectStatus(res, HTTP_STATUS.FORBIDDEN)
    expect(await bansForUser(contributorId)).toHaveLength(0)
  })
})

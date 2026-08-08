import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import {
  discussionReplies,
  discussionThreads,
  socialPostReplies,
  socialPosts,
  socialReactions,
  userBans,
} from '../../../db/schema'
import { profiles, users } from '../../../db/schema/auth/users'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { expectRequiresAuth } from '../../../tests/helpers/authz-matrix'
import {
  createTestEnv,
  type TestApp,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectError, expectOk } from '../../../tests/helpers/expectStatus'
import { authDelete, authPatch, setupAndLogin } from '../../../tests/helpers/route-test-helpers'
import { JWT_SECRET, REFRESH_SECRET } from '../../../tests/helpers/secrets'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import {
  createTestAdminUser,
  createTestProduct,
  createTestUser,
} from '../../../tests/helpers/test-factories'
import { createDemo } from '../../auth/service'
import { updateProfile } from '../service'

setupDbTests()

describe('Profile Routes', () => {
  let app: TestApp
  let client: TestClient
  let token: string

  beforeAll(async () => {
    const env = await createTestEnv()
    app = env.app
    client = env.client
  })

  beforeEach(async () => {
    token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
  })

  describe('GET /profile', () => {
    it('should return profile for authenticated user', async () => {
      const profile = await expectOk(client.profile.$get({}, withAuth(token)))
      expect(profile.userId).toBeDefined()
    })

    it('should return distinct profiles for different users', async () => {
      const tokenAlice = await setupAndLogin(app, TEST_CREDENTIALS.alice)

      const profileToto = await expectOk(client.profile.$get({}, withAuth(token)))
      const profileAlice = await expectOk(client.profile.$get({}, withAuth(tokenAlice)))

      expect(profileToto.userId).toBeDefined()
      expect(profileAlice.userId).toBeDefined()
      expect(profileToto.userId).not.toBe(profileAlice.userId)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/api/profile')

      await expectError(res, HTTP_STATUS.UNAUTHORIZED)
    })

    it('should reject request with invalid token', async () => {
      const res = await app.request('/api/profile', {
        headers: { Authorization: 'Bearer invalid.token.here' },
      })

      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })

    it('should reject request with empty Authorization header', async () => {
      const res = await app.request('/api/profile', {
        headers: { Authorization: '' },
      })

      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })

    it('should reject request with malformed Bearer token', async () => {
      const res = await app.request('/api/profile', {
        headers: { Authorization: 'Bearer' },
      })

      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })

    it('should not expose sensitive fields in profile response', async () => {
      const profile = await expectOk(client.profile.$get({}, withAuth(token)))

      // passwordHash / password are not in the typed response, so assert via untyped lookup
      const raw = profile as Record<string, unknown>
      expect(raw.passwordHash).toBeUndefined()
      expect(raw.password).toBeUndefined()
    })
  })

  describe('PATCH /profile', () => {
    it('should update username', async () => {
      const profile = await expectOk(
        client.profile.$patch({ json: { username: 'newname' } }, withAuth(token))
      )
      expect(profile.username).toBe('newname')
    })

    it('returns 409 username_taken on collision, not an unhandled 500', async () => {
      const tokenAlice = await setupAndLogin(app, TEST_CREDENTIALS.alice)
      await client.profile.$patch({ json: { username: 'shared_name' } }, withAuth(tokenAlice))

      // Collision must surface as a clean 409 (handled), not a 500. The 500-vs-200
      // split was a username-existence oracle (incl. private profiles). The 409
      // goes through the global error handler, so it's not in the typed RPC
      // response; use a raw request to read the untyped status.
      const res = await authPatch(app, '/api/profile', token, { username: 'shared_name' })

      await expectError(res, HTTP_STATUS.CONFLICT, 'username_taken')
    })

    it('should update bio', async () => {
      const profile = await expectOk(
        client.profile.$patch({ json: { bio: 'Hello world' } }, withAuth(token))
      )
      expect(profile.bio).toBe('Hello world')
    })

    it('should update avatarUrl', async () => {
      const profile = await expectOk(
        client.profile.$patch(
          { json: { avatarUrl: 'https://example.com/avatar.png' } },
          withAuth(token)
        )
      )
      expect(profile.avatarUrl).toBe('https://example.com/avatar.png')
    })

    it('should update multiple fields at once', async () => {
      const profile = await expectOk(
        client.profile.$patch({ json: { username: 'multi', bio: 'Updated bio' } }, withAuth(token))
      )
      expect(profile.username).toBe('multi')
      expect(profile.bio).toBe('Updated bio')
    })

    it('should persist updates across requests', async () => {
      await client.profile.$patch({ json: { username: 'persisted' } }, withAuth(token))

      const profile = await expectOk(client.profile.$get({}, withAuth(token)))
      expect(profile.username).toBe('persisted')
    })

    it('should allow overwriting a previously set field', async () => {
      await client.profile.$patch({ json: { username: 'first' } }, withAuth(token))
      await client.profile.$patch({ json: { username: 'second' } }, withAuth(token))

      const profile = await expectOk(client.profile.$get({}, withAuth(token)))
      expect(profile.username).toBe('second')
    })

    it('should not affect other fields when updating one', async () => {
      await client.profile.$patch({ json: { username: 'myname', bio: 'my bio' } }, withAuth(token))
      await client.profile.$patch({ json: { username: 'updated' } }, withAuth(token))

      const profile = await expectOk(client.profile.$get({}, withAuth(token)))
      expect(profile.username).toBe('updated')
      expect(profile.bio).toBe('my bio')
    })

    it('should not leak one user profile data to another', async () => {
      const tokenAlice = await setupAndLogin(app, TEST_CREDENTIALS.alice)

      await client.profile.$patch(
        { json: { username: 'toto_name', bio: 'toto bio' } },
        withAuth(token)
      )
      await client.profile.$patch(
        { json: { username: 'alice_name', bio: 'alice bio' } },
        withAuth(tokenAlice)
      )

      const profileToto = await expectOk(client.profile.$get({}, withAuth(token)))
      const profileAlice = await expectOk(client.profile.$get({}, withAuth(tokenAlice)))

      expect(profileToto.username).toBe('toto_name')
      expect(profileToto.bio).toBe('toto bio')
      expect(profileAlice.username).toBe('alice_name')
      expect(profileAlice.bio).toBe('alice bio')
    })

    // Validator failures return 400 via middleware, not in the typed response.
    it('should reject empty username', async () => {
      const res = await authPatch(app, '/api/profile', token, { username: '' })
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject username over 32 chars', async () => {
      const res = await authPatch(app, '/api/profile', token, { username: 'a'.repeat(33) })
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should accept username at exactly 32 chars', async () => {
      const res = await client.profile.$patch(
        { json: { username: 'a'.repeat(32) } },
        withAuth(token)
      )
      expect(res.status).toBe(HTTP_STATUS.OK)
    })

    it('should reject bio over 500 chars', async () => {
      const res = await authPatch(app, '/api/profile', token, { bio: 'a'.repeat(501) })
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should accept bio at exactly 500 chars', async () => {
      const res = await client.profile.$patch({ json: { bio: 'a'.repeat(500) } }, withAuth(token))
      expect(res.status).toBe(HTTP_STATUS.OK)
    })

    it('should reject invalid avatarUrl', async () => {
      const res = await authPatch(app, '/api/profile', token, { avatarUrl: 'not-a-url' })
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unknown fields (strict mode)', async () => {
      const res = await authPatch(app, '/api/profile', token, { hackerField: 'oops' })
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    expectRequiresAuth(() => app, {
      method: 'PATCH',
      path: '/api/profile',
      body: { username: 'nope' },
    })

    // Defense-in-depth: profileUpdateSchema is .strict() so the route layer
    // already rejects unknown keys with 400. This service-level test bypasses
    // zod to lock the explicit whitelist in updateProfile, so a future schema
    // loosen-up must not become a moderation-flag escalation.
    it('updateProfile service ignores moderation columns when called with extras', async () => {
      const user = await createTestUser('wl-attacker@test.local', 'Azerty123!')

      // Simulates a future schema regression that lets extra keys through.
      // Cast through unknown so the call type-checks; the service MUST drop
      // the unwhitelisted keys at runtime.
      type ProfileUpdateInput = Parameters<typeof updateProfile>[2]
      const malicious = {
        username: 'attacker-name',
        forcedPrivateByAdmin: false,
        forcedPrivateReason: 'cleared by attacker',
        profilePublic: true,
      } as unknown as ProfileUpdateInput

      await testDb.transaction((tx) => updateProfile(tx, user.id, malicious))

      const [row] = await testDb
        .select({
          username: profiles.username,
          forcedPrivateByAdmin: profiles.forcedPrivateByAdmin,
          forcedPrivateReason: profiles.forcedPrivateReason,
          profilePublic: profiles.profilePublic,
        })
        .from(profiles)
        .where(eq(profiles.userId, user.id))

      // Whitelisted field flows through.
      expect(row?.username).toBe('attacker-name')
      // Moderation + privacy flags untouched (defaults from signup).
      expect(row?.forcedPrivateByAdmin).toBe(false) // default false, but attacker tried to confirm-clear; semantically untouched
      expect(row?.forcedPrivateReason).toBeNull()
      expect(row?.profilePublic).toBe(false) // signup default, proves the malicious 'true' did not land
    })
  })

  describe('GET /profile/stats', () => {
    it('returns zeroed stats for a new user', async () => {
      const stats = await expectOk(client.profile.stats.$get({}, withAuth(token)))
      expect(stats.totalProducts).toBe(0)
    })

    expectRequiresAuth(() => app, { method: 'GET', path: '/api/profile/stats' })
  })

  describe('GET /profile/preferences', () => {
    it('returns default preferences for a new user', async () => {
      const preferences = await expectOk(client.profile.preferences.$get({}, withAuth(token)))
      expect(preferences.criteriaWeights).toBeDefined()
      expect(preferences.criteriaWeights.tolerance).toBe(1)
    })

    expectRequiresAuth(() => app, { method: 'GET', path: '/api/profile/preferences' })
  })

  describe('PATCH /profile/preferences', () => {
    it('updates criteriaWeights and merges with existing values', async () => {
      const preferences = await expectOk(
        client.profile.preferences.$patch(
          { json: { criteriaWeights: { tolerance: 8, efficacy: 3 } } },
          withAuth(token)
        )
      )
      expect(preferences.criteriaWeights.tolerance).toBe(8)
      expect(preferences.criteriaWeights.efficacy).toBe(3)
    })

    it('persists changes across requests', async () => {
      await client.profile.preferences.$patch(
        { json: { criteriaWeights: { tolerance: 7 } } },
        withAuth(token)
      )

      const preferences = await expectOk(client.profile.preferences.$get({}, withAuth(token)))
      expect(preferences.criteriaWeights.tolerance).toBe(7)
    })

    it('rejects weight outside 0-10 range', async () => {
      const res = await authPatch(app, '/api/profile/preferences', token, {
        criteriaWeights: { tolerance: 11 },
      })
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    expectRequiresAuth(() => app, {
      method: 'PATCH',
      path: '/api/profile/preferences',
      body: { criteriaWeights: { tolerance: 5 } },
    })
  })

  describe('DELETE /profile/deleteUser', () => {
    it('deletes the account and rejects a subsequent login', async () => {
      const deleted = await authDelete(app, '/api/profile/deleteUser', token)
      expect(deleted.status).toBe(204)

      const login = await client.auth.login.$post({
        json: {
          email: TEST_CREDENTIALS.toto.rawEmail,
          password: TEST_CREDENTIALS.toto.rawPassword,
        },
      })
      expect(login.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })

    it('preserves the global-ban gate outside the request RLS transaction', async () => {
      const user = await createTestUser(
        TEST_CREDENTIALS.toto.rawEmail,
        TEST_CREDENTIALS.toto.rawPassword
      )
      const admin = await createTestAdminUser('normal-delete-ban-admin@test.local', 'Azerty123!')
      await testDb.insert(userBans).values({
        userId: user.id,
        bannedBy: admin.id,
        scope: 'global',
        reason: 'Account locked',
      })

      const deletion = await authDelete(app, '/api/profile/deleteUser', token)

      expect(deletion.status).toBe(HTTP_STATUS.FORBIDDEN)
      expect(await testDb.select().from(users).where(eq(users.id, user.id))).toHaveLength(1)
    })

    it('keeps normal-account public content and anonymizes its author', async () => {
      const deletedUser = await createTestUser(
        TEST_CREDENTIALS.toto.rawEmail,
        TEST_CREDENTIALS.toto.rawPassword
      )
      const catalogOwner = await createTestUser('normal-delete-owner@test.local', 'Azerty123!')
      const product = await createTestProduct(catalogOwner.id, {
        name: 'Normal deletion shared product',
      })

      const [post] = await testDb
        .insert(socialPosts)
        .values({
          authorId: deletedUser.id,
          tone: 'principal',
          content: 'Post kept after normal deletion',
          productId: product.id,
        })
        .returning({ id: socialPosts.id })
      if (!post) throw new Error('post insert failed')

      const [postReply] = await testDb
        .insert(socialPostReplies)
        .values({
          postId: post.id,
          authorId: deletedUser.id,
          content: 'Post reply kept after normal deletion',
        })
        .returning({ id: socialPostReplies.id })
      if (!postReply) throw new Error('post reply insert failed')

      const [thread] = await testDb
        .insert(discussionThreads)
        .values({
          productId: product.id,
          authorId: deletedUser.id,
          title: 'Thread kept after normal deletion',
          content: 'Thread content kept after normal deletion',
        })
        .returning({ id: discussionThreads.id })
      if (!thread) throw new Error('thread insert failed')

      const [threadReply] = await testDb
        .insert(discussionReplies)
        .values({
          threadId: thread.id,
          authorId: deletedUser.id,
          content: 'Thread reply kept after normal deletion',
        })
        .returning({ id: discussionReplies.id })
      if (!threadReply) throw new Error('thread reply insert failed')

      const [reaction] = await testDb
        .insert(socialReactions)
        .values({
          reactableType: 'post',
          reactableId: post.id,
          userId: deletedUser.id,
          kind: 'merci',
        })
        .returning({ id: socialReactions.id })
      if (!reaction) throw new Error('reaction insert failed')

      const deleted = await authDelete(app, '/api/profile/deleteUser', token)
      expect(deleted.status).toBe(204)

      const [keptPost] = await testDb
        .select({ id: socialPosts.id, authorId: socialPosts.authorId })
        .from(socialPosts)
        .where(eq(socialPosts.id, post.id))
      const [keptPostReply] = await testDb
        .select({ id: socialPostReplies.id, authorId: socialPostReplies.authorId })
        .from(socialPostReplies)
        .where(eq(socialPostReplies.id, postReply.id))
      const [keptThread] = await testDb
        .select({ id: discussionThreads.id, authorId: discussionThreads.authorId })
        .from(discussionThreads)
        .where(eq(discussionThreads.id, thread.id))
      const [keptThreadReply] = await testDb
        .select({ id: discussionReplies.id, authorId: discussionReplies.authorId })
        .from(discussionReplies)
        .where(eq(discussionReplies.id, threadReply.id))
      const [keptReaction] = await testDb
        .select({ id: socialReactions.id, userId: socialReactions.userId })
        .from(socialReactions)
        .where(eq(socialReactions.id, reaction.id))

      expect({
        post: keptPost,
        postReply: keptPostReply,
        thread: keptThread,
        threadReply: keptThreadReply,
        reaction: keptReaction,
      }).toEqual({
        post: { id: post.id, authorId: null },
        postReply: { id: postReply.id, authorId: null },
        thread: { id: thread.id, authorId: null },
        threadReply: { id: threadReply.id, authorId: null },
        reaction: { id: reaction.id, userId: null },
      })
    })

    it('purges a demo account through the account deletion route', async () => {
      const demo = await createDemo({
        db: testDb,
        jwtSecret: JWT_SECRET,
        refreshSecret: REFRESH_SECRET,
        frontendUrl: 'http://localhost:5173',
      })
      expect(demo.success).toBe(true)
      if (!demo.success) return

      const deleted = await authDelete(app, '/api/profile/deleteUser', demo.data.accessToken)
      expect(deleted.status).toBe(204)

      const remaining = await testDb.select().from(users).where(eq(users.id, demo.data.user.id))
      expect(remaining).toHaveLength(0)
    })

    expectRequiresAuth(() => app, { method: 'DELETE', path: '/api/profile/deleteUser' })
  })
})

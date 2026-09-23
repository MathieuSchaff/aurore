import { describe, expect, it } from 'bun:test'

import { authSchema, type UserExport } from '@aurore/shared'

import { eq } from 'drizzle-orm'
import { sign } from 'hono/jwt'
import { testClient } from 'hono/testing'

import {
  refreshTokens,
  userBans,
  userDermoProfiles,
  userProductReviews,
  userProducts,
  users,
} from '../../db/schema'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb } from '../helpers/app-runtime-db'
import { createTestApp } from '../helpers/createTestApp'
import { withAuth } from '../helpers/createTestClient'
import { JWT_SECRET } from '../helpers/secrets'
import { TEST_CREDENTIALS } from '../helpers/test-credentials'
import { createTestAdminUser, createTestProduct, createTestUser } from '../helpers/test-factories'

const runtime = await createAppRuntimeDb()
setupDbTests()

describe('privacy access during suspension', () => {
  it.each(['valid', 'expired'] as const)(
    'exports and deletes with password while the session is %s',
    async (sessionState) => {
      const client = testClient(await createTestApp({ anonDb: runtime })).api
      const { rawEmail, rawPassword } = TEST_CREDENTIALS.toto
      const credentials = authSchema.parse({ email: rawEmail, password: rawPassword })
      const user = await createTestUser(rawEmail, rawPassword)
      const other = await createTestAdminUser()
      const publicFlag = sessionState === 'valid'
      await testDb.insert(userDermoProfiles).values({ userId: user.id, discoverable: publicFlag })
      const product = await createTestProduct(user.id, { name: 'Privacy export fixture' })
      const [entry] = await testDb
        .insert(userProducts)
        .values({ userId: user.id, productId: product.id })
        .returning()
      if (!entry) throw new Error('missing collection fixture')
      await testDb.insert(userProductReviews).values({
        userProductId: entry.id,
        isPublic: true,
        comment: 'Synthetic review',
        ratingsPublic: publicFlag,
      })
      const login = await client.auth.login.$post({ json: credentials })
      const session = await login.json()
      if (!session.success) throw new Error('login fixture failed')
      const bearer =
        sessionState === 'valid'
          ? session.data.accessToken
          : await sign(
              {
                sub: user.id,
                role: 'user',
                type: 'access',
                jti: crypto.randomUUID(),
                iat: Math.floor(Date.now() / 1000) - 120,
                exp: Math.floor(Date.now() / 1000) - 60,
              },
              JWT_SECRET
            )
      await testDb.insert(userBans).values({ userId: user.id, bannedBy: other.id, scope: 'global' })
      const before = await testDb
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.userId, user.id))

      const exported = await client.profile.access.export.$post(
        { json: credentials },
        withAuth(bearer)
      )
      expect(exported.status).toBe(200)
      const data = (await exported.json()) as UserExport
      expect(data._meta.userId).toBe(user.id)
      expect(data.user.email).toBe(rawEmail)
      expect(data.dermoProfile?.discoverable).toBe(publicFlag)
      expect(data.productReviews[0]?.ratingsPublic).toBe(publicFlag)
      expect(exported.headers.getSetCookie()).toEqual([])
      expect(
        await testDb.select().from(refreshTokens).where(eq(refreshTokens.userId, user.id))
      ).toEqual(before)
      const generalAccess = await client.auth.session.$get({}, withAuth(bearer))
      expect(Number(generalAccess.status)).toBe(sessionState === 'valid' ? 403 : 401)

      const deleted = await client.profile.access['delete-account'].$post(
        { json: credentials },
        withAuth(bearer)
      )
      expect(deleted.status).toBe(204)
      expect(await testDb.select().from(users).where(eq(users.id, user.id))).toEqual([])
      expect(await testDb.select().from(users).where(eq(users.id, other.id))).toHaveLength(1)
    }
  )

  it('rejects incorrect credentials before exporting or deleting', async () => {
    const client = testClient(await createTestApp({ anonDb: runtime })).api
    const user = await createTestUser()
    const credentials = authSchema.parse({ email: user.email, password: 'IncorrectPass123!' })
    expect((await client.profile.access.export.$post({ json: credentials })).status).toBe(401)
    expect(
      (await client.profile.access['delete-account'].$post({ json: credentials })).status
    ).toBe(401)
    expect(await testDb.select().from(users).where(eq(users.id, user.id))).toHaveLength(1)
  })
})

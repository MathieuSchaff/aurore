import { describe, expect, it } from 'bun:test'

import { isApiSuccess } from '@aurore/shared'

import { userBans } from '../../db/schema'
import { createBan, liftBan } from '../../features/admin/bans.service'
import { isUserBanned } from '../../features/auth/ban.service'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb, withRlsAs } from '../helpers/app-runtime-db'
import { createTestAdminUser, createTestUser } from '../helpers/test-factories'

const runtime = await createAppRuntimeDb()
setupDbTests()

describe('committed ban visibility', () => {
  it.each(['create', 'lift'] as const)(
    'observes a committed %s after a concurrent read',
    async (operation) => {
      const user = await createTestUser()
      const admin = await createTestAdminUser()
      let banId = ''
      if (operation === 'lift') {
        const [ban] = await testDb
          .insert(userBans)
          .values({ userId: user.id, bannedBy: admin.id, scope: 'global' })
          .returning()
        if (!ban) throw new Error('missing ban fixture')
        banId = ban.id
      }
      const changed = Promise.withResolvers<void>()
      const commit = Promise.withResolvers<void>()
      const mutation = withRlsAs(runtime, 'admin', admin.id, async (tx) => {
        const result =
          operation === 'create'
            ? await createBan(tx, {
                actorId: admin.id,
                targetUserId: user.id,
                body: { scope: 'global' },
              })
            : await liftBan(tx, banId)
        expect(isApiSuccess(result)).toBe(true)
        changed.resolve()
        await commit.promise
      })
      try {
        await Promise.race([changed.promise, mutation])
        const before = await withRlsAs(runtime, 'user', user.id, (tx) => isUserBanned(tx, user.id))
        expect(before !== null).toBe(operation === 'lift')
        commit.resolve()
        await mutation
        const after = await withRlsAs(runtime, 'user', user.id, (tx) => isUserBanned(tx, user.id))
        expect(after !== null).toBe(operation === 'create')
      } finally {
        commit.resolve()
        await mutation
      }
    }
  )
})

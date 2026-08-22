import { describe, expect, it } from 'bun:test'

import { userBans } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { listUserBans } from '../bans.service'

setupDbTests()

describe('listUserBans', () => {
  it('classifies permanent, future and past bans', async () => {
    const actor = await createTestUser('ban-service-actor@test.local', 'Azerty123!')
    const target = await createTestUser('ban-service-target@test.local', 'Azerty123!')
    const future = new Date(Date.now() + 60_000).toISOString()
    const past = new Date(Date.now() - 60_000).toISOString()

    await testDb.insert(userBans).values([
      { userId: target.id, scope: 'product_edit', bannedBy: actor.id, reason: 'permanent' },
      {
        userId: target.id,
        scope: 'ingredient_edit',
        bannedBy: actor.id,
        reason: 'future',
        expiresAt: future,
      },
      {
        userId: target.id,
        scope: 'review_publish',
        bannedBy: actor.id,
        reason: 'past',
        expiresAt: past,
      },
    ])

    const bans = await testDb.transaction((tx) => listUserBans(tx, target.id))

    expect(Object.fromEntries(bans.map((ban) => [ban.reason, ban.status]))).toEqual({
      permanent: 'active',
      future: 'active',
      past: 'expired',
    })
  })
})

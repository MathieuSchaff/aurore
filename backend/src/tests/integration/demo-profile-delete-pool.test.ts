import { describe, expect, it } from 'bun:test'

import { eq, sql } from 'drizzle-orm'

import { db as appRuntimeDb } from '../../db'
import { users } from '../../db/schema'
import { generateAccessToken } from '../../features/auth/jwt.utils'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createTestApp } from '../helpers/createTestApp'
import { authDelete } from '../helpers/route-test-helpers'
import { JWT_SECRET } from '../helpers/secrets'
import { createTestUser } from '../helpers/test-factories'

setupDbTests()

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

async function settlesWithin(promise: Promise<unknown>, timeoutMs: number): Promise<boolean> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<false>((resolve) => {
    timeoutId = setTimeout(() => resolve(false), timeoutMs)
  })
  const settled = promise.then(
    () => true,
    () => true
  )
  const result = await Promise.race([settled, timeout])
  if (timeoutId !== undefined) clearTimeout(timeoutId)
  return result
}

describe('DELETE /profile/deleteUser: connection boundary', () => {
  it('deletes a demo without waiting for an eleventh pool connection', async () => {
    const demo = await createTestUser('demo-profile-pool@test.local', 'Azerty123!')
    await testDb.update(users).set({ isDemo: true }).where(eq(users.id, demo.id))
    const token = await generateAccessToken(demo.id, 'user', JWT_SECRET)
    const app = await createTestApp({ anonDb: appRuntimeDb })

    const release = deferred()
    const heldConnections = Array.from({ length: 9 }, () => {
      const ready = deferred()
      const task = appRuntimeDb.transaction(async (tx) => {
        await tx.execute(sql`SELECT 1`)
        ready.resolve()
        await release.promise
      })
      return { ready: ready.promise, task }
    })
    await Promise.all(heldConnections.map(({ ready }) => ready))

    // Account deletion must need only one root transaction: the tenth slot.
    const deletion = Promise.resolve(authDelete(app, '/api/profile/deleteUser', token))
    let completedWithPoolFull = false
    try {
      completedWithPoolFull = await settlesWithin(deletion, 1_000)
    } finally {
      release.resolve()
      await Promise.all(heldConnections.map(({ task }) => task))
    }

    const response = await deletion
    expect(completedWithPoolFull).toBe(true)
    expect(response.status).toBe(204)
  })
})

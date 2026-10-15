import { describe, expect, it } from 'bun:test'

import { sql } from 'drizzle-orm'

import {
  createUserProduct,
  getUserProductStatusHistory,
  updateUserProduct,
} from '../../features/user-products/service'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb, withRlsAs } from '../helpers/app-runtime-db'
import { createTestProduct, createTestUser } from '../helpers/test-factories'

const runtime = await createAppRuntimeDb()
setupDbTests()

describe('concurrent collection POSTs', () => {
  it.each([
    { kind: 'existing row', existing: true, holyGrail: false, next: 'wishlist' as const },
    { kind: 'first inserts', existing: false, holyGrail: false, next: 'archived' as const },
    { kind: 'first Holy Grail insert', existing: false, holyGrail: true, next: 'avoided' as const },
  ])('uses the committed state after waiting for $kind', async ({ existing, holyGrail, next }) => {
    const user = await createTestUser('collection-race@seed.local')
    const product = await createTestProduct(user.id, { name: 'Concurrent collection product' })
    const initial = existing
      ? await testDb.transaction((tx) =>
          createUserProduct(user.id, { productId: product.id, status: 'in_stock' }, tx)
        )
      : null
    const ready = Promise.withResolvers<void>()
    const release = Promise.withResolvers<void>()
    const started = Promise.withResolvers<void>()
    let secondPid = 0
    const first = withRlsAs(runtime, 'user', user.id, async (tx) => {
      if (initial) await updateUserProduct(user.id, initial.id, { status: 'archived' }, tx)
      else
        await createUserProduct(
          user.id,
          { productId: product.id, status: 'in_stock', sentiment: holyGrail ? 6 : undefined },
          tx
        )
      ready.resolve()
      await release.promise
    })
    let second: ReturnType<typeof createUserProduct> | undefined
    try {
      await Promise.race([ready.promise, first])
      second = withRlsAs(runtime, 'user', user.id, async (tx) => {
        const [row] = await tx.execute(sql`SELECT pg_backend_pid() AS pid`)
        secondPid = Number(row?.pid)
        started.resolve()
        return createUserProduct(user.id, { productId: product.id, status: next }, tx)
      })
      await Promise.race([started.promise, second])
      const deadline = Date.now() + 3000
      while (true) {
        const waiting = await testDb.execute(
          sql`SELECT pid FROM pg_stat_activity WHERE pid = ${secondPid} AND wait_event_type = 'Lock'`
        )
        if (waiting.length > 0) break
        if (Date.now() >= deadline) throw new Error('the concurrent POST never reached a lock')
        await Bun.sleep(10)
      }
      release.resolve()
      await first
      const result = await second
      expect(result).toMatchObject({ status: next, sentiment: null })
      const history = await withRlsAs(runtime, 'user', user.id, (tx) =>
        getUserProductStatusHistory(user.id, result.id, tx)
      )
      expect(history.filter((entry) => entry.toStatus === next)).toMatchObject([
        { fromStatus: existing ? 'archived' : 'in_stock', toStatus: next },
      ])
      expect(history.filter((entry) => entry.fromStatus === null)).toHaveLength(1)
    } finally {
      release.resolve()
      await Promise.allSettled([first, ...(second ? [second] : [])])
    }
  })
})

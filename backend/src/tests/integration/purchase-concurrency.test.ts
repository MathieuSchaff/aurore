import { describe, expect, it } from 'bun:test'

import { and, eq, isNotNull, isNull, sql } from 'drizzle-orm'

import { purchases, userProducts, users } from '../../db/schema'
import { finishPurchase, openPurchase } from '../../features/user-products/purchase.service'
import { PurchaseError } from '../../features/user-products/purchase-error'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb, withRlsAs } from '../helpers/app-runtime-db'
import { captureError } from '../helpers/capture-error'
import { createTestProduct, createTestUser } from '../helpers/test-factories'

const appRuntimeDb = await createAppRuntimeDb()
const openedAt = '2026-09-15T00:00:00.000Z'

setupDbTests()

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

async function seedPurchases() {
  const user = await createTestUser('purchase-concurrency@test.local')
  const product = await createTestProduct(user.id, { name: 'Purchase concurrency' })
  const [userProduct] = await testDb
    .insert(userProducts)
    .values({ userId: user.id, productId: product.id })
    .returning()
  if (!userProduct) throw new Error('user product seed failed')
  const rows = await testDb
    .insert(purchases)
    .values([
      { userProductId: userProduct.id, purchasedAt: '2026-09-14' },
      { userProductId: userProduct.id, purchasedAt: '2026-09-14' },
    ])
    .returning()
  const [first, second] = rows
  if (!first || !second) throw new Error('purchase seed failed')
  return { user, userProduct, first, second }
}

async function waitForBlockedOrSettled(pid: number, settled: () => boolean) {
  const deadline = Date.now() + 3_000
  while (Date.now() < deadline) {
    if (settled()) return
    const rows = await testDb.execute(sql`
      SELECT pid FROM pg_stat_activity
      WHERE datname = current_database() AND pid = ${pid} AND wait_event_type = 'Lock'
    `)
    if (rows.length > 0) return
    await Bun.sleep(10)
  }
  throw new Error('concurrent purchase neither blocked nor settled')
}

describe('purchase opening concurrency', () => {
  it('rejects a concurrent opening and allows it after the active purchase finishes', async () => {
    const { user, userProduct, first, second } = await seedPurchases()
    const opened = deferred()
    const release = deferred()
    const firstOpening = withRlsAs(appRuntimeDb, 'user', user.id, async (tx) => {
      await tx.select({ id: users.id }).from(users).where(eq(users.id, user.id)).for('key share')
      const result = await openPurchase(user.id, first.id, { openedAt }, tx)
      opened.resolve()
      await release.promise
      return result
    })
    firstOpening.catch(() => {})

    let secondOpening: Promise<unknown> | undefined
    try {
      await Promise.race([opened.promise, firstOpening])
      let pid = 0
      let settled = false
      const started = deferred()
      secondOpening = captureError(() =>
        withRlsAs(appRuntimeDb, 'user', user.id, async (tx) => {
          await tx
            .select({ id: users.id })
            .from(users)
            .where(eq(users.id, user.id))
            .for('key share')
          const [connection] = await tx.execute<{ pid: number }>(
            sql`SELECT pg_backend_pid() AS pid`
          )
          if (!connection) throw new Error('missing backend pid')
          pid = connection.pid
          started.resolve()
          return openPurchase(user.id, second.id, { openedAt }, tx)
        })
      ).then((error) => {
        settled = true
        return error
      })

      await Promise.race([started.promise, secondOpening])
      // Hold A before commit so B either waits or reproduces the stale active read
      await waitForBlockedOrSettled(pid, () => settled)
      release.resolve()
      await firstOpening
      const error = await secondOpening
      expect(error).toBeInstanceOf(PurchaseError)
      expect(error).toMatchObject({ code: 'active_purchase_exists' })

      const active = await testDb
        .select({ id: purchases.id })
        .from(purchases)
        .where(
          and(
            eq(purchases.userProductId, userProduct.id),
            isNotNull(purchases.openedAt),
            isNull(purchases.finishedAt)
          )
        )
      expect(active).toEqual([{ id: first.id }])

      const finished = await withRlsAs(appRuntimeDb, 'user', user.id, (tx) =>
        finishPurchase(user.id, userProduct.id, { finishedAt: openedAt }, tx)
      )
      expect(finished.id).toBe(first.id)
      const next = await withRlsAs(appRuntimeDb, 'user', user.id, (tx) =>
        openPurchase(user.id, second.id, { openedAt }, tx)
      )
      expect(next.id).toBe(second.id)
      expect(next.openedAt).toBe(openedAt)
    } finally {
      release.resolve()
      await Promise.allSettled([firstOpening, ...(secondOpening ? [secondOpening] : [])])
    }
  })

  it('supports callers that supply a database outside a transaction', async () => {
    const { user, first, second } = await seedPurchases()
    const result = await openPurchase(user.id, first.id, { openedAt }, testDb)
    expect(result.openedAt).toBe(openedAt)
    const error = await captureError(() => openPurchase(user.id, second.id, { openedAt }, testDb))
    expect(error).toMatchObject({ code: 'active_purchase_exists' })
  })
})

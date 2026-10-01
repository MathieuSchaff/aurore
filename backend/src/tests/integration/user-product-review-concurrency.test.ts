import { describe, expect, it } from 'bun:test'

import { and, eq, sql } from 'drizzle-orm'

import { userProductReviews, userProductStatusLog, userProducts } from '../../db/schema'
import { updateUserProduct, upsertUserProductReview } from '../../features/user-products/service'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb, withRlsAs } from '../helpers/app-runtime-db'
import { createTestProduct, createTestUser } from '../helpers/test-factories'

const runtime = await createAppRuntimeDb()
setupDbTests()

describe('concurrent personal product changes', () => {
  it.each(['review', 'status'] as const)(
    'preserves a committed %s change when another edit was waiting',
    async (kind) => {
      const user = await createTestUser()
      const product = await createTestProduct(user.id, { name: 'Concurrent personal edit' })
      const [entry] = await testDb
        .insert(userProducts)
        .values({ userId: user.id, productId: product.id })
        .returning()
      if (!entry) throw new Error('missing collection fixture')
      await testDb
        .insert(userProductReviews)
        .values({ userProductId: entry.id, isPublic: true, comment: 'My experience' })
      const changed = Promise.withResolvers<void>()
      const release = Promise.withResolvers<void>()
      const started = Promise.withResolvers<void>()
      let secondPid = 0
      const first = withRlsAs(runtime, 'user', user.id, async (tx) => {
        if (kind === 'review')
          await upsertUserProductReview(user.id, entry.id, { isPublic: false }, tx)
        else await updateUserProduct(user.id, entry.id, { status: 'archived' }, tx)
        changed.resolve()
        await release.promise
      })
      let second: Promise<unknown> | undefined
      try {
        await Promise.race([changed.promise, first])
        second = withRlsAs(runtime, 'user', user.id, async (tx) => {
          const rows = await tx.execute(sql`SELECT pg_backend_pid() AS pid`)
          secondPid = Number(rows[0]?.pid)
          started.resolve()
          return kind === 'review'
            ? upsertUserProductReview(user.id, entry.id, { tolerance: 4 }, tx)
            : updateUserProduct(user.id, entry.id, { comment: 'A personal note' }, tx)
        })
        await Promise.race([started.promise, second])
        const deadline = Date.now() + 3000
        while (true) {
          const waiting = await testDb.execute(
            sql`SELECT pid FROM pg_stat_activity WHERE pid = ${secondPid} AND wait_event_type = 'Lock'`
          )
          if (waiting.length > 0) break
          if (Date.now() >= deadline) throw new Error('the second edit never reached the row lock')
          await Bun.sleep(10)
        }
        release.resolve()
        await Promise.all([first, second])
        if (kind === 'review') {
          const review = await testDb.query.userProductReviews.findFirst({
            where: eq(userProductReviews.userProductId, entry.id),
          })
          expect(review).toMatchObject({ isPublic: false, ratingsPublic: false, tolerance: 4 })
        } else {
          const transitions = await testDb
            .select()
            .from(userProductStatusLog)
            .where(
              and(
                eq(userProductStatusLog.userProductId, entry.id),
                eq(userProductStatusLog.toStatus, 'archived')
              )
            )
          expect(transitions).toHaveLength(1)
        }
      } finally {
        release.resolve()
        await Promise.allSettled([first, ...(second ? [second] : [])])
      }
    }
  )
})

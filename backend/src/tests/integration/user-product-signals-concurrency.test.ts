import { describe, expect, it } from 'bun:test'

import { HTTP_STATUS, ok } from '@aurore/shared'

import { eq, sql } from 'drizzle-orm'

import {
  ingredientDermoProfiles,
  productIngredients,
  userIngredientAnalysisScore,
  userProducts,
} from '../../db/schema'
import { withRlsContext } from '../../features/auth/rls-context.middleware'
import { recalculateAllSignalsForUser } from '../../features/user-products/dermo-signal.service'
import { updateUserProduct } from '../../features/user-products/service'
import { getRlsDb } from '../../utils/accessors'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb } from '../helpers/app-runtime-db'
import { createRlsApp } from '../helpers/rls-app'
import { createTestIngredient, createTestProduct, createTestUser } from '../helpers/test-factories'

const appRuntimeDb = await createAppRuntimeDb()

setupDbTests()

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

async function waitForBlockedRecalculations(applicationName: string): Promise<void> {
  const deadline = Date.now() + 3_000
  while (Date.now() < deadline) {
    const [row] = await testDb.execute<{ count: number }>(sql`
      SELECT count(*)::int AS count
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND application_name = ${applicationName}
        AND wait_event_type = 'Lock'
    `)
    if (row?.count === 2) return
    await Bun.sleep(10)
  }
  throw new Error('timed out waiting for both signal recalculations to block')
}

describe('user product signal concurrency', () => {
  it('keeps signals consistent after concurrent changes to different products', async () => {
    const user = await createTestUser('signal-concurrency@test.local')
    const ingredient = await createTestIngredient(user.id, { name: 'Shared signal ingredient' })
    const first = await createTestProduct(user.id, { name: 'First signal product' })
    const second = await createTestProduct(user.id, { name: 'Second signal product' })
    await testDb.insert(productIngredients).values([
      { productId: first.id, ingredientId: ingredient.id },
      { productId: second.id, ingredientId: ingredient.id },
    ])
    const collection = await testDb
      .insert(userProducts)
      .values([
        { userId: user.id, productId: first.id },
        { userId: user.id, productId: second.id },
      ])
      .returning({ id: userProducts.id })

    const applicationName = `signal-concurrency-${user.id}`
    const app = createRlsApp(appRuntimeDb)
    app.use('*', async (c, next) => {
      c.set('userId', user.id)
      await next()
    })
    app.use('*', withRlsContext)
    app.patch('/:id', async (c) => {
      const tx = getRlsDb(c)
      await tx.execute(sql`SELECT set_config('application_name', ${applicationName}, true)`)
      await updateUserProduct(user.id, c.req.param('id'), { status: 'avoided' }, tx)
      await recalculateAllSignalsForUser(user.id, tx)
      return c.json(ok(null), HTTP_STATUS.OK)
    })

    const lockReady = deferred()
    const releaseLock = deferred()
    // Both old calculations would read one avoided product before blocking here
    // The user lock makes the second calculation read only after the first commits
    const blocker = testDb.transaction(async (tx) => {
      await tx.execute(sql`LOCK TABLE ${ingredientDermoProfiles} IN ACCESS EXCLUSIVE MODE`)
      lockReady.resolve()
      await releaseLock.promise
    })
    await lockReady.promise
    const requests = collection.map((item) => app.request(`/${item.id}`, { method: 'PATCH' }))
    try {
      await waitForBlockedRecalculations(applicationName)
      releaseLock.resolve()
      const responses = await Promise.all(requests)
      expect(responses.map((response) => response.status)).toEqual([HTTP_STATUS.OK, HTTP_STATUS.OK])
      const scores = await testDb
        .select({
          suspicion: userIngredientAnalysisScore.suspicionScore,
          isSuspect: userIngredientAnalysisScore.isSuspect,
        })
        .from(userIngredientAnalysisScore)
        .where(eq(userIngredientAnalysisScore.userId, user.id))
      expect(scores).toEqual([{ suspicion: '1.000000', isSuspect: true }])
    } finally {
      releaseLock.resolve()
      await Promise.allSettled([blocker, ...requests])
    }
  }, 10_000)
})

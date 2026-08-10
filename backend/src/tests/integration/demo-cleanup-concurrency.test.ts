import { describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { eq, sql } from 'drizzle-orm'

import { db as appRuntimeDb } from '../../db'
import { ingredientEdits, products, socialPosts, socialReactions, users } from '../../db/schema'
import { deleteDemoUser } from '../../features/auth/demo-cleanup'
import { generateAccessToken } from '../../features/auth/jwt.utils'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createTestApp } from '../helpers/createTestApp'
import { authPatch } from '../helpers/route-test-helpers'
import { JWT_SECRET } from '../helpers/secrets'
import { createTestProduct, createTestUser } from '../helpers/test-factories'

setupDbTests()

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

async function waitForBlockedStatement(...fragments: string[]): Promise<void> {
  const deadline = Date.now() + 3_000
  while (Date.now() < deadline) {
    const rows = await testDb.execute(sql`
      SELECT query
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND pid <> pg_backend_pid()
        AND wait_event_type = 'Lock'
    `)
    const found = rows.some((row) => {
      const query = String(row.query).toLowerCase()
      return fragments.every((fragment) => query.includes(fragment.toLowerCase()))
    })
    if (found) return
    await Bun.sleep(10)
  }
  throw new Error(`timed out waiting for blocked SQL: ${fragments.join(' + ')}`)
}

function holdIngredientEditTable() {
  const ready = deferred()
  const release = deferred()
  const done = testDb.transaction(async (tx) => {
    await tx.execute(sql`LOCK TABLE ${ingredientEdits} IN ACCESS EXCLUSIVE MODE`)
    ready.resolve()
    await release.promise
  })
  return { ready: ready.promise, release: release.resolve, done }
}

function holdProduct(productId: string) {
  const ready = deferred()
  const release = deferred()
  const done = testDb.transaction(async (tx) => {
    await tx
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, productId))
      .for('update')
    ready.resolve()
    await release.promise
  })
  return { ready: ready.promise, release: release.resolve, done }
}

describe('demo cleanup concurrency', () => {
  it('rejects a polymorphic write that starts after its target is deleted by the purge', async () => {
    const demo = await createTestUser('demo-reaction-race@test.local', 'Azerty123!')
    const reactor = await createTestUser('reactor-race@test.local', 'Azerty123!')
    await testDb.update(users).set({ isDemo: true }).where(eq(users.id, demo.id))

    const [post] = await testDb
      .insert(socialPosts)
      .values({
        authorId: demo.id,
        tone: 'principal',
        content: 'Post deleted during reaction',
        concernSlug: 'rosacee',
      })
      .returning({ id: socialPosts.id })
    if (!post) throw new Error('post seed failed')

    const app = await createTestApp({ anonDb: appRuntimeDb })
    const reactorToken = await generateAccessToken(reactor.id, 'user', JWT_SECRET)
    const tableLock = holdIngredientEditTable()
    await tableLock.ready

    const cleanup = deleteDemoUser(demo.id)
    cleanup.catch(() => {})
    let reactionRequest: Promise<Response> | undefined
    try {
      // The purge has already removed the post and its reactions in its own
      // uncommitted tx, then waits on the final blocking-history table.
      await waitForBlockedStatement('delete from "ingredient_edits"')

      reactionRequest = Promise.resolve(
        app.request('/api/social/reactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${reactorToken}`,
          },
          body: JSON.stringify({
            reactableType: 'post',
            reactableId: post.id,
            kind: 'merci',
          }),
        })
      )
      await waitForBlockedStatement('from "social_posts"', 'for key share')

      tableLock.release()
      const [deleted, reactionResponse] = await Promise.all([cleanup, reactionRequest])

      expect(deleted).toBe(true)
      expect(reactionResponse.status).toBe(HTTP_STATUS.NOT_FOUND)
      expect(
        await testDb.select().from(socialReactions).where(eq(socialReactions.reactableId, post.id))
      ).toHaveLength(0)
    } finally {
      tableLock.release()
      await Promise.allSettled([
        tableLock.done,
        cleanup,
        ...(reactionRequest ? [reactionRequest] : []),
      ])
    }
  }, 10_000)

  it('serializes a catalog update before deleting the same demo account', async () => {
    const demo = await createTestUser('demo-catalog-lock@test.local', 'Azerty123!')
    await testDb.update(users).set({ isDemo: true }).where(eq(users.id, demo.id))
    const product = await createTestProduct(
      demo.id,
      { name: 'Demo product updated during cleanup' },
      'user'
    )
    const token = await generateAccessToken(demo.id, 'user', JWT_SECRET)
    const app = await createTestApp({ anonDb: appRuntimeDb })

    const productLock = holdProduct(product.id)
    await productLock.ready

    const update = Promise.resolve(
      authPatch(app, `/api/products/${product.id}`, token, { notes: 'Concurrent edit' })
    )
    await waitForBlockedStatement('update "products"')

    const cleanup = deleteDemoUser(demo.id)
    cleanup.catch(() => {})
    try {
      // The request holds the account in KEY SHARE while waiting for the
      // product. Cleanup therefore waits at account, preserving one order.
      await waitForBlockedStatement('from "users"', 'for update')

      productLock.release()
      const [updateResponse, deleted] = await Promise.all([update, cleanup])

      expect(updateResponse.status).toBe(HTTP_STATUS.OK)
      expect(deleted).toBe(true)
    } finally {
      productLock.release()
      await Promise.allSettled([productLock.done, update, cleanup])
    }
  }, 10_000)
})

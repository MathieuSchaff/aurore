/**
 * Regression test: admin moderation routes must work under the real app_runtime pool.
 * Route-level tests use testDb, which connects as superuser `app` and can mask
 * production RLS behavior. This mini-app injects the real `app_runtime` pool as
 * anonDb, so the guarded route must open requestDb and bind the admin identity
 * before updating a FORCE RLS table.
 */
import { describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { products } from '../../db/schema/products/products'
import { userProductReviews, userProducts } from '../../db/schema/products/user-products'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb, withRlsAs } from '../helpers/app-runtime-db'
import { expectOk } from '../helpers/expectStatus'
import { createRlsApp, loginViaRlsApp } from '../helpers/rls-app'
import {
  createTestAdminUser,
  createTestContributorUser,
  createTestProduct,
  createTestUser,
} from '../helpers/test-factories'

const appRuntimeDb = await createAppRuntimeDb()

async function buildApp() {
  const { jwtAuthRoutes } = await import('../../features/auth/routes')
  const { adminModerationRoutes } = await import('../../features/admin/moderation.routes')

  return createRlsApp(appRuntimeDb)
    .route('/auth', jwtAuthRoutes)
    .route('/admin/moderation', adminModerationRoutes)
}

setupDbTests()

describe('admin moderation under app_runtime: RLS enforcement', () => {
  it('hides a withdrawn review from contributor routes and direct RLS access', async () => {
    const reviewer = await createTestUser()
    const moderator = await createTestContributorUser(
      'contributor-private@test.local',
      'Azerty123!'
    )
    const product = await createTestProduct(reviewer.id, { name: 'Withdrawn review product' })
    const [entry] = await testDb
      .insert(userProducts)
      .values({ userId: reviewer.id, productId: product.id })
      .returning()
    if (!entry) throw new Error('missing collection entry')
    const [review] = await testDb
      .insert(userProductReviews)
      .values({ userProductId: entry.id, comment: 'Private experience', isPublic: false })
      .returning()
    if (!review) throw new Error('missing private review')
    const app = await buildApp()
    const token = await loginViaRlsApp(app, 'contributor-private@test.local', 'Azerty123!')
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

    expect((await app.request(`/admin/moderation/reviews/${review.id}`, { headers })).status).toBe(
      404
    )
    expect(
      (
        await app.request(`/admin/moderation/reviews/${review.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ status: 'hidden' }),
        })
      ).status
    ).toBe(404)
    await withRlsAs(appRuntimeDb, 'contributor', moderator.id, async (tx) => {
      expect(
        await tx.select().from(userProductReviews).where(eq(userProductReviews.id, review.id))
      ).toEqual([])
      expect(
        await tx
          .update(userProductReviews)
          .set({ moderationStatus: 'hidden' })
          .where(eq(userProductReviews.id, review.id))
          .returning()
      ).toEqual([])
    })
    expect(
      await testDb.query.userProductReviews.findFirst({
        where: eq(userProductReviews.id, review.id),
      })
    ).toMatchObject({ isPublic: false, moderationStatus: 'visible' })
  })

  it('PATCH /admin/moderation/reviews/:id flips moderation_status to hidden', async () => {
    const reviewer = await createTestUser('reviewer-rls@test.local', 'Azerty123!')
    await createTestAdminUser('admin-rls@test.local', 'Azerty123!')

    const [product] = await testDb
      .insert(products)
      .values({
        createdBy: reviewer.id,
        name: 'Mod RLS Serum',
        brand: 'ModRLSBrand',
        category: 'skincare',
        kind: 'serum',
        unit: 'dropper',
        slug: 'mod-rls-serum',
      })
      .returning()
    if (!product) throw new Error('product seed failed')

    const [up] = await testDb
      .insert(userProducts)
      .values({ userId: reviewer.id, productId: product.id, status: 'in_stock' })
      .returning()
    if (!up) throw new Error('user_product seed failed')

    const [review] = await testDb
      .insert(userProductReviews)
      .values({ userProductId: up.id, tolerance: 4, comment: 'rls test', isPublic: true })
      .returning()
    if (!review) throw new Error('review seed failed')

    const app = await buildApp()
    const token = await loginViaRlsApp(app, 'admin-rls@test.local', 'Azerty123!')

    // Under app_runtime this is only 200 when the request transaction carries
    // the authenticated admin RLS context.
    const body = await expectOk<{ moderationStatus: string; moderationReason: string | null }>(
      app.request(`/admin/moderation/reviews/${review.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'hidden', reason: 'rls regression' }),
      }),
      HTTP_STATUS.OK
    )
    expect(body.moderationStatus).toBe('hidden')

    const [updated] = await testDb
      .select({ moderationStatus: userProductReviews.moderationStatus })
      .from(userProductReviews)
      .where(eq(userProductReviews.id, review.id))
    expect(updated?.moderationStatus).toBe('hidden')
  })
})

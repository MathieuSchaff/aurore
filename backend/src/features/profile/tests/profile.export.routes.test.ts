import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { and, eq } from 'drizzle-orm'
import type { Hono } from 'hono'

import type { AppEnv } from '../../../app-env'
import { ingredients } from '../../../db/schema/ingredients/ingredients'
import { userIngredientAnalysisScore } from '../../../db/schema/ingredients/user-ingredient-analysis-score'
import { securityEvents } from '../../../db/schema/monitoring/security-events'
import { products } from '../../../db/schema/products/products'
import { userProductStatusLog } from '../../../db/schema/products/user-product-status-log'
import { userProducts } from '../../../db/schema/products/user-products'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { expectRequiresAuth } from '../../../tests/helpers/authz-matrix'
import { createTestApp } from '../../../tests/helpers/createTestApp'
import {
  authGet,
  loginAndGetToken,
  setupAndLogin,
  setupAndLoginAdmin,
} from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { resetExportRateLimit, USER_EXPORT_TENANT_TABLES } from '../export.service'

// RLS-scoped route; this file covers auth/headers contract, exhaustivity
// (every audited tenant table has a JSON section), cross-user isolation,
// and rate-limit + audit side-effects.
//
// Fixtures stay minimal: this tests "does export hit every section", not
// column-level fidelity (that belongs in service tests).

const EXPECTED_TOP_LEVEL_KEYS = [
  '_meta',
  'user',
  'profile',
  'dermoProfile',
  'preferences',
  'ingredientPreferences',
  'tagPreferences',
  'products',
  'productReviews',
  'productStatusLog',
  'purchases',
  'ingredientAnalysisScores',
  'discussionThreads',
  'discussionReplies',
] as const

setupDbTests()

describe('GET /profile/export', () => {
  let app: Hono<AppEnv>

  beforeAll(async () => {
    app = await createTestApp()
  })

  beforeEach(() => {
    resetExportRateLimit()
  })

  afterEach(() => {
    resetExportRateLimit()
  })

  expectRequiresAuth(() => app, { method: 'GET', path: '/api/profile/export' })

  it('returns 200 with attachment headers for an authenticated user', async () => {
    const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

    const res = await authGet(app, '/api/profile/export', token)

    expect(res.status).toBe(HTTP_STATUS.OK)
    expect(res.headers.get('Content-Type')).toContain('application/json')
    const disp = res.headers.get('Content-Disposition') ?? ''
    expect(disp).toContain('attachment')
    expect(disp).toMatch(/filename="aurore-export-[0-9a-f-]+-\d{8}\.json"/)
    expect(res.headers.get('Cache-Control')).toBe('no-store')
  })

  it('returns JSON with every expected top-level section', async () => {
    const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

    const res = await authGet(app, '/api/profile/export', token)
    const body = (await res.json()) as Record<string, unknown>

    for (const key of EXPECTED_TOP_LEVEL_KEYS) {
      expect(body).toHaveProperty(key)
    }
  })

  it('covers every tenant table audited via USER_EXPORT_TENANT_TABLES', () => {
    // Anti-drift: any table added to the audit list must have a dedicated
    // top-level section, mapped 1-1 here. Forces an explicit ack when a new
    // tenant table appears.
    const tableToSection: Record<(typeof USER_EXPORT_TENANT_TABLES)[number], string> = {
      users: 'user',
      profiles: 'profile',
      user_dermo_profiles: 'dermoProfile',
      user_preferences: 'preferences',
      user_ingredient_preferences: 'ingredientPreferences',
      user_tag_preferences: 'tagPreferences',
      user_products: 'products',
      user_product_reviews: 'productReviews',
      user_product_status_log: 'productStatusLog',
      purchases: 'purchases',
      user_ingredient_analysis_score: 'ingredientAnalysisScores',
      discussion_threads: 'discussionThreads',
      discussion_replies: 'discussionReplies',
    }
    for (const t of USER_EXPORT_TENANT_TABLES) {
      const section = tableToSection[t]
      expect(EXPECTED_TOP_LEVEL_KEYS).toContain(section as (typeof EXPECTED_TOP_LEVEL_KEYS)[number])
    }
  })

  it('returns a well-formed _meta block with the caller userId', async () => {
    const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

    const res = await authGet(app, '/api/profile/export', token)
    const body = (await res.json()) as {
      _meta: { schemaVersion: string; exportedAt: string; userId: string }
      user: { _meta: { id?: string } }
    }

    expect(body._meta.schemaVersion).toBe('1')
    expect(body._meta.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    expect(body._meta.userId).toBeDefined()
    // user._meta.id and _meta.userId must match, otherwise we exported
    // someone else's data (RLS violation signal).
    expect(body.user._meta.id).toBe(body._meta.userId)
  })

  it('returns the caller’s own profile, not another user’s', async () => {
    const tokenToto = await setupAndLogin(app, TEST_CREDENTIALS.toto)
    const tokenAlice = await setupAndLogin(app, TEST_CREDENTIALS.alice)

    const [resToto, resAlice] = await Promise.all([
      authGet(app, '/api/profile/export', tokenToto),
      authGet(app, '/api/profile/export', tokenAlice),
    ])
    const dataToto = (await resToto.json()) as { user: { email: string } }
    const dataAlice = (await resAlice.json()) as { user: { email: string } }

    expect(dataToto.user.email).toBe(TEST_CREDENTIALS.toto.rawEmail)
    expect(dataAlice.user.email).toBe(TEST_CREDENTIALS.alice.rawEmail)
    expect(dataToto.user.email).not.toBe(dataAlice.user.email)
  })

  it('does not leak other users’ rows when the caller is an admin', async () => {
    // The *_admin_bypass RLS policies are PERMISSIVE, so RLS alone opens the
    // whole table to an admin. Only the SQL predicates in export.service keep
    // an admin export down to the admin's own rows.
    const victim = await createTestUser(
      TEST_CREDENTIALS.alice.rawEmail,
      TEST_CREDENTIALS.alice.rawPassword
    )

    const [product] = await testDb
      .insert(products)
      .values({
        createdBy: victim.id,
        name: 'Victim Serum',
        brand: 'VictimBrand',
        category: 'skincare',
        kind: 'serum',
        unit: 'dropper',
        slug: 'victim-serum',
      })
      .returning()
    if (!product) throw new Error('product fixture failed')

    const [ingredient] = await testDb
      .insert(ingredients)
      .values({
        createdBy: victim.id,
        name: 'Victim Ingredient',
        slug: 'victim-ingredient',
        type: 'skincare',
      })
      .returning()
    if (!ingredient) throw new Error('ingredient fixture failed')

    const [userProduct] = await testDb
      .insert(userProducts)
      .values({ userId: victim.id, productId: product.id, status: 'in_stock' })
      .returning()
    if (!userProduct) throw new Error('user_product fixture failed')

    await testDb.insert(userProductStatusLog).values({
      userId: victim.id,
      userProductId: userProduct.id,
      toStatus: 'archived',
    })
    await testDb.insert(userIngredientAnalysisScore).values({
      userId: victim.id,
      ingredientId: ingredient.id,
      isSuspect: true,
    })

    const adminToken = await setupAndLoginAdmin(app, TEST_CREDENTIALS.admin)
    const res = await authGet(app, '/api/profile/export', adminToken)
    const body = (await res.json()) as {
      products: unknown[]
      productStatusLog: unknown[]
      ingredientAnalysisScores: unknown[]
    }

    expect(res.status).toBe(HTTP_STATUS.OK)
    expect(body.products).toHaveLength(0)
    expect(body.productStatusLog).toHaveLength(0)
    expect(body.ingredientAnalysisScores).toHaveLength(0)

    // Same fixtures, non-admin owner: proves the assertions above are empty
    // because of scoping, not because the fixtures never landed.
    const victimToken = await loginAndGetToken(
      app,
      TEST_CREDENTIALS.alice.rawEmail,
      TEST_CREDENTIALS.alice.rawPassword
    )
    const victimRes = await authGet(app, '/api/profile/export', victimToken)
    const victimBody = (await victimRes.json()) as {
      products: unknown[]
      productStatusLog: unknown[]
      ingredientAnalysisScores: unknown[]
    }
    expect(victimBody.products).toHaveLength(1)
    expect(victimBody.productStatusLog).toHaveLength(1)
    expect(victimBody.ingredientAnalysisScores).toHaveLength(1)
  })

  it('writes a `data_export_requested` audit event tied to the caller', async () => {
    const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
    const res = await authGet(app, '/api/profile/export', token)
    const body = (await res.json()) as { _meta: { userId: string } }

    const events = await testDb
      .select()
      .from(securityEvents)
      .where(
        and(
          eq(securityEvents.userId, body._meta.userId),
          eq(securityEvents.eventType, 'data_export_requested')
        )
      )
    expect(events.length).toBe(1)
    expect(events[0]?.severity).toBe('low')
    expect(events[0]?.route).toBe('/profile/export')
  })

  it('rejects a second export within the cooldown window', async () => {
    const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

    const first = await authGet(app, '/api/profile/export', token)
    expect(first.status).toBe(HTTP_STATUS.OK)

    const second = await authGet(app, '/api/profile/export', token)
    expect(second.status).toBe(HTTP_STATUS.RATE_LIMIT_EXCEEDED)
    const errBody = (await second.json()) as {
      success: boolean
      error: string
      details: { retryAfter: number }
    }
    expect(errBody.success).toBe(false)
    expect(errBody.error).toBe('rate_limit_exceeded')
    expect(errBody.details.retryAfter).toBeGreaterThan(0)
  })
})

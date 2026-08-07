import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { and, eq } from 'drizzle-orm'

import { users } from '../../../db/schema/auth/users'
import { userIngredientAnalysisScore } from '../../../db/schema/ingredients/user-ingredient-analysis-score'
import { securityEvents } from '../../../db/schema/monitoring/security-events'
import { userProductStatusLog } from '../../../db/schema/products/user-product-status-log'
import { userProducts } from '../../../db/schema/products/user-products'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { expectRequiresAuth } from '../../../tests/helpers/authz-matrix'
import { createTestApp } from '../../../tests/helpers/createTestApp'
import type { TestApp } from '../../../tests/helpers/createTestClient'
import { expectError } from '../../../tests/helpers/expectStatus'
import {
  authGet,
  loginAndGetToken,
  setupAndLogin,
  setupAndLoginAdmin,
} from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import {
  createTestIngredient,
  createTestProduct,
  createTestUser,
} from '../../../tests/helpers/test-factories'
import { resetExportRateLimit, USER_EXPORT_TENANT_TABLES } from '../export.service'

// Covers auth/headers, exhaustivity (every audited tenant table has a JSON section),
// cross-user isolation, and rate-limit + audit side-effects. Fixtures stay minimal:
// column-level fidelity belongs in service tests.

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
  let app: TestApp
  let token: string

  beforeAll(async () => {
    app = await createTestApp()
  })

  beforeEach(async () => {
    resetExportRateLimit()
    token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
  })

  afterEach(() => {
    resetExportRateLimit()
  })

  expectRequiresAuth(() => app, { method: 'GET', path: '/api/profile/export' })

  it('returns 200 with attachment headers for an authenticated user', async () => {
    const res = await authGet(app, '/api/profile/export', token)

    expect(res.status).toBe(HTTP_STATUS.OK)
    expect(res.headers.get('Content-Type')).toContain('application/json')
    const disp = res.headers.get('Content-Disposition') ?? ''
    expect(disp).toContain('attachment')
    expect(disp).toMatch(/filename="aurore-export-[0-9a-f-]+-\d{8}\.json"/)
    expect(res.headers.get('Cache-Control')).toBe('no-store')
  })

  it('returns JSON with every expected top-level section', async () => {
    const res = await authGet(app, '/api/profile/export', token)
    const body = (await res.json()) as Record<string, unknown>

    for (const key of EXPECTED_TOP_LEVEL_KEYS) {
      expect(body).toHaveProperty(key)
    }
  })

  it('covers every tenant table audited via USER_EXPORT_TENANT_TABLES', () => {
    // Drift guard: any table added to the audit list must have a dedicated
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
    const tokenAlice = await setupAndLogin(app, TEST_CREDENTIALS.alice)

    const [resToto, resAlice] = await Promise.all([
      authGet(app, '/api/profile/export', token),
      authGet(app, '/api/profile/export', tokenAlice),
    ])
    const dataToto = (await resToto.json()) as { user: { email: string } }
    const dataAlice = (await resAlice.json()) as { user: { email: string } }

    expect(dataToto.user.email).toBe(TEST_CREDENTIALS.toto.rawEmail)
    expect(dataAlice.user.email).toBe(TEST_CREDENTIALS.alice.rawEmail)
    expect(dataToto.user.email).not.toBe(dataAlice.user.email)
  })

  it('rejects a demo account before touching the security journal', async () => {
    // Demo exports carry nothing and each call would append a
    // data_export_requested event, so the guard sits before the rate limiter.
    const demo = await createTestUser(
      TEST_CREDENTIALS.jeanmichel.rawEmail,
      TEST_CREDENTIALS.jeanmichel.rawPassword
    )
    await testDb.update(users).set({ isDemo: true }).where(eq(users.id, demo.id))
    const demoToken = await loginAndGetToken(
      app,
      TEST_CREDENTIALS.jeanmichel.rawEmail,
      TEST_CREDENTIALS.jeanmichel.rawPassword
    )

    const res = await authGet(app, '/api/profile/export', demoToken)

    await expectError(res, HTTP_STATUS.FORBIDDEN, 'forbidden')
    const events = await testDb
      .select()
      .from(securityEvents)
      .where(
        and(
          eq(securityEvents.userId, demo.id),
          eq(securityEvents.eventType, 'data_export_requested')
        )
      )
    expect(events).toHaveLength(0)
  })

  it('does not leak other users’ rows when the caller is an admin', async () => {
    // The *_admin_bypass RLS policies are PERMISSIVE, so RLS alone opens the
    // whole table to an admin. Only the SQL predicates in export.service keep
    // an admin export down to the admin's own rows.
    const victim = await createTestUser(
      TEST_CREDENTIALS.alice.rawEmail,
      TEST_CREDENTIALS.alice.rawPassword
    )
    const product = await createTestProduct(victim.id, {
      name: 'Victim Serum',
      brand: 'VictimBrand',
      unit: 'dropper',
    })
    const ingredient = await createTestIngredient(victim.id, { name: 'Victim Ingredient' })

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

    // Same fixtures, owner who is not an admin: proves the assertions above are empty
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
    const first = await authGet(app, '/api/profile/export', token)
    expect(first.status).toBe(HTTP_STATUS.OK)

    const second = await authGet(app, '/api/profile/export', token)
    const errBody = await expectError<{ retryAfter: number }>(
      second,
      HTTP_STATUS.RATE_LIMIT_EXCEEDED,
      'rate_limit_exceeded'
    )
    expect(errBody.details?.retryAfter).toBeGreaterThan(0)
  })
})

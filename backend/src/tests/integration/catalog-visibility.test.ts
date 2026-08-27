import { describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { ingredients } from '../../db/schema/ingredients/ingredients'
import { products } from '../../db/schema/products/products'
import { userProducts } from '../../db/schema/products/user-products'
import { createIngredient } from '../../features/ingredients/service'
import { ProductError } from '../../features/products/product-error'
import { createProduct } from '../../features/products/service'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb, withRlsAs } from '../helpers/app-runtime-db'
import { createTestClient, withAuth } from '../helpers/createTestClient'
import { expectError, expectOk } from '../helpers/expectStatus'
import { login } from '../helpers/login'
import { createRlsApp, loginViaRlsApp } from '../helpers/rls-app'
import { TEST_CREDENTIALS } from '../helpers/test-credentials'
import { createTestAdminUser, createTestUser } from '../helpers/test-factories'

const appRuntimeDb = await createAppRuntimeDb()

setupDbTests()

const VISIBILITY_ADMIN = { email: 'visibility-admin@test.local', password: 'Azerty123!' } as const

type ProductOverrides = { name: string; brand: string; slug?: string }

// autoTag stays off: these suites assert visibility, and the tagging pass only
// adds write cost and rows that no assertion reads.
function seedProduct(userId: string, overrides: ProductOverrides) {
  return testDb.transaction((tx) =>
    createProduct(
      userId,
      'admin',
      { category: 'skincare', kind: 'serum', unit: 'dropper', ...overrides },
      tx,
      { autoTag: false }
    )
  )
}

function hideProduct(id: string) {
  return testDb.update(products).set({ moderationStatus: 'hidden' }).where(eq(products.id, id))
}

// RLS-aware app: injects appRuntimeDb so SELECT policies fire (no BYPASSRLS).
// Products routes include withRlsContext internally, so auth tokens produce the
// correct app.role context inside the transaction.
async function buildRlsApp() {
  const { jwtAuthRoutes } = await import('../../features/auth/routes')
  const { productsFeature } = await import('../../features/products')

  return createRlsApp(appRuntimeDb).route('/auth', jwtAuthRoutes).route('', productsFeature)
}

// 1. Unhide collision via route

describe('catalog visibility: unhide collision via route', () => {
  const admin = TEST_CREDENTIALS.admin

  it('PATCH /admin/moderation/products/:id → 409 with details when unhiding to occupied key', async () => {
    const client = await createTestClient()
    const adminUser = await createTestAdminUser(admin.rawEmail, admin.rawPassword)
    const adminToken = await login(client, admin.rawEmail, admin.rawPassword)

    const p1 = await seedProduct(adminUser.id, { name: 'Unhide Serum', brand: 'UnhideBrand' })
    await hideProduct(p1.id)

    // Explicit slug avoids a collision with p1, still there as a hidden row
    // Hiding frees products_name_brand_unique_visible (partial on visible) but not
    // products_slug_unique, which is a full unique index
    const p2 = await seedProduct(adminUser.id, {
      name: 'Unhide Serum',
      brand: 'UnhideBrand',
      slug: 'unhide-serum-v2',
    })

    const res = await client.admin.moderation.products[':id'].$patch(
      { param: { id: p1.id }, json: { status: 'visible' } },
      withAuth(adminToken)
    )

    const body = await expectError<{ id: string; name: string; brand: string; slug: string }>(
      res,
      HTTP_STATUS.CONFLICT,
      'product_already_exists'
    )
    expect(body.details?.id).toBe(p2.id)
    expect(body.details?.name).toBe(p2.name)
    expect(body.details?.slug).toBe(p2.slug)
  })

  it('PATCH /admin/moderation/ingredients/:id → 409 with details when unhiding to occupied key', async () => {
    const client = await createTestClient()
    const adminUser = await createTestAdminUser(admin.rawEmail, admin.rawPassword)
    const adminToken = await login(client, admin.rawEmail, admin.rawPassword)

    const seedIngredient = () =>
      testDb.transaction((tx) =>
        createIngredient(tx, adminUser.id, 'admin', { name: 'Unhide Acid', type: 'skincare' })
      )

    const i1 = await seedIngredient()
    await testDb
      .update(ingredients)
      .set({ moderationStatus: 'hidden' })
      .where(eq(ingredients.id, i1.id))

    const i2 = await seedIngredient()

    const res = await client.admin.moderation.ingredients[':id'].$patch(
      { param: { id: i1.id }, json: { status: 'visible' } },
      withAuth(adminToken)
    )

    const body = await expectError<{ id: string; name: string; slug: string }>(
      res,
      HTTP_STATUS.CONFLICT,
      'ingredient_already_exists'
    )
    expect(body.details?.id).toBe(i2.id)
    expect(body.details?.name).toBe(i2.name)
  })
})

// 2. RLS visibility: hidden product excluded from reads

describe('catalog visibility, RLS: hidden product excluded from public reads', () => {
  it('GET /products/:slug returns 404 for hidden product (anon)', async () => {
    const app = await buildRlsApp()
    const user = await createTestUser('rls-vis-anon@test.local', 'Azerty123!')

    const product = await seedProduct(user.id, { name: 'RLS Vis Serum', brand: 'RLSBrand' })
    await hideProduct(product.id)

    const res = await app.request(`/products/${product.slug}`)
    expect(res.status).toBe(HTTP_STATUS.NOT_FOUND)
  })

  it('GET /products/:slug returns 200 for hidden product (admin)', async () => {
    const app = await buildRlsApp()
    await createTestAdminUser(VISIBILITY_ADMIN.email, VISIBILITY_ADMIN.password)
    const user = await createTestUser('rls-vis-user@test.local', 'Azerty123!')

    const product = await seedProduct(user.id, { name: 'RLS Admin Serum', brand: 'RLSAdminBrand' })
    await hideProduct(product.id)

    const adminToken = await loginViaRlsApp(app, VISIBILITY_ADMIN.email, VISIBILITY_ADMIN.password)
    const res = await app.request(`/products/${product.slug}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
    expect(res.status).toBe(HTTP_STATUS.OK)
  })

  it('GET /products search does not return hidden product (anon)', async () => {
    const app = await buildRlsApp()
    const user = await createTestUser('rls-search@test.local', 'Azerty123!')

    await seedProduct(user.id, { name: 'Visible Serum', brand: 'VisibleBrand' })
    const hidden = await seedProduct(user.id, { name: 'Hidden Serum', brand: 'HiddenBrand' })
    await hideProduct(hidden.id)

    const body = await expectOk<{ items: Array<{ name: string }> }>(
      app.request('/products?category=skincare')
    )

    const names = body.items.map((i) => i.name)
    expect(names).not.toContain('Hidden Serum')
    expect(names).toContain('Visible Serum')
  })

  it('GET /products does not return the owner own hidden product (browse stays honest)', async () => {
    const app = await buildRlsApp()
    const ownerEmail = 'rls-owner-browse@test.local'
    const ownerPw = 'Azerty123!'
    const owner = await createTestUser(ownerEmail, ownerPw)

    await seedProduct(owner.id, { name: 'Owner Visible Serum', brand: 'OwnerVisibleBrand' })
    const hidden = await seedProduct(owner.id, {
      name: 'Owner Hidden Serum',
      brand: 'OwnerHiddenBrand',
    })
    await hideProduct(hidden.id)

    const token = await loginViaRlsApp(app, ownerEmail, ownerPw)
    const body = await expectOk<{ items: Array<{ name: string }> }>(
      app.request('/products?category=skincare', {
        headers: { Authorization: `Bearer ${token}` },
      })
    )

    const names = body.items.map((i) => i.name)
    // app.own_submissions is unset on the browse path, so the owner's hidden sheet
    // must not resurface here: it surfaces only via GET /me/submissions.
    expect(names).not.toContain('Owner Hidden Serum')
    expect(names).toContain('Owner Visible Serum')
  })
})

// 3. Join cross-feature: hidden product drops join rows

describe('catalog visibility: hidden product drops join rows', () => {
  it('user_products INNER JOIN products returns 0 rows when product is hidden', async () => {
    const user = await createTestUser('rls-join@test.local', 'Azerty123!')

    const [product] = await testDb
      .insert(products)
      .values({
        createdBy: user.id,
        name: 'Join Test Serum',
        brand: 'JoinBrand',
        category: 'skincare',
        kind: 'serum',
        unit: 'dropper',
        slug: 'join-test-serum',
      })
      .returning()
    if (!product) throw new Error('product seed failed')

    const [up] = await testDb
      .insert(userProducts)
      .values({ userId: user.id, productId: product.id, status: 'in_stock' })
      .returning()
    if (!up) throw new Error('user_product seed failed')

    const collectionRows = () =>
      withRlsAs(appRuntimeDb, 'user', user.id, (tx) =>
        tx
          .select({ upId: userProducts.id })
          .from(userProducts)
          .innerJoin(products, eq(products.id, userProducts.productId))
          .where(eq(userProducts.id, up.id))
      )

    // Before hiding: user sees their own collection entry via RLS
    expect(await collectionRows()).toHaveLength(1)

    await hideProduct(product.id)

    // After hiding: INNER JOIN drops the row
    expect(await collectionRows()).toHaveLength(0)
  })
})

// 4. Concurrent RLS-path create: one wins, no 500

describe('catalog visibility, concurrent RLS-path create: one wins, no 500', () => {
  it('4 concurrent createProduct calls via appRuntimeDb: 1 success, 3 x product_already_exists', async () => {
    const user = await createTestUser('concurrent-rls@test.local', 'Azerty123!')

    const input = {
      name: 'Concurrent RLS Serum',
      brand: 'ConcurrentBrand',
      category: 'skincare' as const,
      kind: 'serum' as const,
      unit: 'dropper' as const,
    }

    // Use 'user' role to match the RLS INSERT policy withCheck constraint
    // (catalog_quality='unverified' branch), which is the real production path.
    const attempts = await Promise.allSettled(
      Array.from({ length: 4 }, () =>
        withRlsAs(appRuntimeDb, 'user', user.id, (tx) =>
          createProduct(user.id, 'user', input, tx, { autoTag: false })
        )
      )
    )

    const fulfilled = attempts.filter((a) => a.status === 'fulfilled')
    const rejected = attempts.filter((a) => a.status === 'rejected') as PromiseRejectedResult[]

    expect(fulfilled).toHaveLength(1)
    for (const r of rejected) {
      expect(r.reason).toBeInstanceOf(ProductError)
      expect((r.reason as ProductError).code).toBe('product_already_exists')
    }
  })
})

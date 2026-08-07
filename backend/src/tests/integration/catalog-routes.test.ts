import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { userBans } from '../../db/schema'
import { clearBanCache } from '../../features/auth/ban.service'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createTestClient, type TestClient, withAuth } from '../helpers/createTestClient'
import { expectError, expectOk, expectStatus } from '../helpers/expectStatus'
import { login } from '../helpers/login'
import { TEST_CREDENTIALS } from '../helpers/test-credentials'
import {
  createTestAdminUser,
  createTestContributorUser,
  createTestUser,
} from '../helpers/test-factories'

const VALID_PRODUCT = {
  name: 'User Serum',
  brand: 'UserBrand',
  category: 'skincare',
  kind: 'serum',
  unit: 'dropper',
} as const

const VALID_INGREDIENT = { name: 'User Acid', type: 'skincare' } as const

const ADMIN_FIELDS = ['moderatedBy', 'moderationReason', 'moderatedAt', 'verifiedBy', 'verifiedAt']

setupDbTests()

describe('catalog routes: guard swap (requireCatalogWrite removed from create/edit)', () => {
  let client: TestClient
  let userId: string
  let adminId: string
  let userToken: string

  beforeAll(async () => {
    client = await createTestClient()
  })

  beforeEach(async () => {
    clearBanCache()
    const toto = TEST_CREDENTIALS.toto
    const admin = TEST_CREDENTIALS.admin

    const user = await createTestUser(toto.rawEmail, toto.rawPassword)
    const adminUser = await createTestAdminUser(admin.rawEmail, admin.rawPassword)

    userId = user.id
    adminId = adminUser.id
    userToken = await login(client, toto.rawEmail, toto.rawPassword)
  })

  // The ban cache is process memory, so cleanDatabase alone would leave it stale.
  afterEach(() => {
    clearBanCache()
  })

  it('ingredient_create ban blocks POST /ingredients with scope detail', async () => {
    await testDb.insert(userBans).values({
      userId,
      scope: 'ingredient_create',
      bannedBy: adminId,
      reason: 'spam',
    })

    const res = await client.ingredients.$post(
      { json: VALID_INGREDIENT as never },
      withAuth(userToken)
    )

    const body = await expectError<{ scope?: string }>(res, HTTP_STATUS.FORBIDDEN, 'banned')
    expect(body.details?.scope).toBe('ingredient_create')
  })

  it('ingredient_create ban does NOT block PATCH /ingredients/:id (scope-specific)', async () => {
    await testDb.insert(userBans).values({
      userId,
      scope: 'ingredient_create',
      bannedBy: adminId,
    })

    // any PATCH 404s (no such ingredient) but ban scope is create-only, so no 403
    const res = await client.ingredients[':id'].$patch(
      { param: { id: crypto.randomUUID() }, json: { name: 'x' } as never },
      withAuth(userToken)
    )

    expect(res.status as number).not.toBe(HTTP_STATUS.FORBIDDEN)
  })
})

describe('catalog routes: verify (PATCH /:id/quality)', () => {
  let client: TestClient
  let userToken: string
  let contributorToken: string

  beforeAll(async () => {
    client = await createTestClient()
  })

  beforeEach(async () => {
    const toto = TEST_CREDENTIALS.toto
    const contrib = TEST_CREDENTIALS.contributor
    await createTestUser(toto.rawEmail, toto.rawPassword)
    await createTestContributorUser(contrib.rawEmail, contrib.rawPassword)
    userToken = await login(client, toto.rawEmail, toto.rawPassword)
    contributorToken = await login(client, contrib.rawEmail, contrib.rawPassword)
  })

  const postProduct = () =>
    expectOk(
      client.products.$post({ json: VALID_PRODUCT }, withAuth(userToken)),
      HTTP_STATUS.CREATED
    )

  const postIngredient = () =>
    expectOk(
      client.ingredients.$post({ json: VALID_INGREDIENT }, withAuth(userToken)),
      HTTP_STATUS.CREATED
    )

  it('contributor can verify a product (PATCH /products/:id/quality)', async () => {
    const { id } = await postProduct()

    const body = await expectOk(
      client.products[':id'].quality.$patch(
        { param: { id }, json: { quality: 'verified' } },
        withAuth(contributorToken)
      )
    )
    expect(body.catalogQuality).toBe('verified')
  })

  it('regular user gets 403 on PATCH /products/:id/quality', async () => {
    const { id } = await postProduct()

    const res = await client.products[':id'].quality.$patch(
      { param: { id }, json: { quality: 'verified' } as never },
      withAuth(userToken)
    )

    expectStatus(res, HTTP_STATUS.FORBIDDEN)
  })

  it('contributor can verify an ingredient (PATCH /ingredients/:id/quality)', async () => {
    const { id } = await postIngredient()

    const body = await expectOk(
      client.ingredients[':id'].quality.$patch(
        { param: { id }, json: { quality: 'verified' } },
        withAuth(contributorToken)
      )
    )
    expect(body.catalogQuality).toBe('verified')
  })

  it('regular user gets 403 on PATCH /ingredients/:id/quality', async () => {
    const { id } = await postIngredient()

    const res = await client.ingredients[':id'].quality.$patch(
      { param: { id }, json: { quality: 'verified' } as never },
      withAuth(userToken)
    )

    expectStatus(res, HTTP_STATUS.FORBIDDEN)
  })
})

describe('catalog routes: field-strip public projections', () => {
  let client: TestClient
  let userToken: string

  beforeAll(async () => {
    client = await createTestClient()
  })

  beforeEach(async () => {
    const toto = TEST_CREDENTIALS.toto
    await createTestUser(toto.rawEmail, toto.rawPassword)
    userToken = await login(client, toto.rawEmail, toto.rawPassword)
  })

  function expectStripped(data: unknown) {
    const record = data as Record<string, unknown>
    for (const f of ADMIN_FIELDS) expect(record).not.toHaveProperty(f)
    expect(record).toHaveProperty('catalogQuality')
  }

  it('POST /products response strips admin fields but keeps catalogQuality', async () => {
    const data = await expectOk(
      client.products.$post({ json: VALID_PRODUCT }, withAuth(userToken)),
      HTTP_STATUS.CREATED
    )
    expectStripped(data)
  })

  it('GET /products/:slug response strips admin fields', async () => {
    const { slug } = await expectOk(
      client.products.$post({ json: VALID_PRODUCT }, withAuth(userToken)),
      HTTP_STATUS.CREATED
    )

    expectStripped(await expectOk(client.products[':slug'].$get({ param: { slug } })))
  })

  it('POST /ingredients response strips admin fields but keeps catalogQuality', async () => {
    const data = await expectOk(
      client.ingredients.$post({ json: VALID_INGREDIENT }, withAuth(userToken)),
      HTTP_STATUS.CREATED
    )
    expectStripped(data)
  })

  it('GET /ingredients/:slug response strips admin fields', async () => {
    const { slug } = await expectOk(
      client.ingredients.$post({ json: VALID_INGREDIENT }, withAuth(userToken)),
      HTTP_STATUS.CREATED
    )

    expectStripped(await expectOk(client.ingredients[':slug'].$get({ param: { slug } })))
  })
})

describe('catalog routes: list endpoints strip admin fields', () => {
  let client: TestClient
  let userToken: string
  let contributorToken: string

  beforeAll(async () => {
    client = await createTestClient()
  })

  beforeEach(async () => {
    const toto = TEST_CREDENTIALS.toto
    const contrib = TEST_CREDENTIALS.contributor
    await createTestUser(toto.rawEmail, toto.rawPassword)
    await createTestContributorUser(contrib.rawEmail, contrib.rawPassword)
    userToken = await login(client, toto.rawEmail, toto.rawPassword)
    contributorToken = await login(client, contrib.rawEmail, contrib.rawPassword)
  })

  function expectItemsStripped(items: Array<Record<string, unknown>>) {
    expect(items.length).toBeGreaterThan(0)
    for (const item of items) {
      for (const f of ADMIN_FIELDS) expect(item).not.toHaveProperty(f)
    }
  }

  // A verified+visible row has verifiedBy/verifiedAt not null, so a leak can't
  // hide behind null values. The row still appears in a public list (RLS only
  // hides 'hidden' rows), proving any verify-stamp leak in the list projection.
  it('GET /products list strips admin fields on a verified row', async () => {
    const created = await expectOk(
      client.products.$post({ json: VALID_PRODUCT }, withAuth(userToken)),
      HTTP_STATUS.CREATED
    )
    await client.products[':id'].quality.$patch(
      { param: { id: created.id }, json: { quality: 'verified' } },
      withAuth(contributorToken)
    )

    const { items } = await expectOk(client.products.$get({ query: { category: 'skincare' } }))
    expectItemsStripped(items as Array<Record<string, unknown>>)
  })

  it('GET /ingredients list strips admin fields on a verified row', async () => {
    const created = await expectOk(
      client.ingredients.$post({ json: VALID_INGREDIENT }, withAuth(userToken)),
      HTTP_STATUS.CREATED
    )
    await client.ingredients[':id'].quality.$patch(
      { param: { id: created.id }, json: { quality: 'verified' } },
      withAuth(contributorToken)
    )

    const { items } = await expectOk(client.ingredients.$get({ query: {} }))
    expectItemsStripped(items as Array<Record<string, unknown>>)
  })
})

describe('catalog routes: read filters (?quality / ?status)', () => {
  let client: TestClient
  let userToken: string
  let adminToken: string

  beforeAll(async () => {
    client = await createTestClient()
  })

  beforeEach(async () => {
    const toto = TEST_CREDENTIALS.toto
    const admin = TEST_CREDENTIALS.admin
    await createTestUser(toto.rawEmail, toto.rawPassword)
    await createTestAdminUser(admin.rawEmail, admin.rawPassword)
    userToken = await login(client, toto.rawEmail, toto.rawPassword)
    adminToken = await login(client, admin.rawEmail, admin.rawPassword)
  })

  it('GET /products?quality=unverified returns only unverified products', async () => {
    await client.products.$post({ json: VALID_PRODUCT }, withAuth(userToken))
    await client.products.$post(
      { json: { ...VALID_PRODUCT, name: 'Admin Serum', brand: 'AdminBrand' } },
      withAuth(adminToken)
    )

    const { items } = await expectOk(
      client.products.$get({ query: { category: 'skincare', quality: 'unverified' } })
    )
    expect(items.length).toBe(1)
  })

  it('GET /ingredients?quality=unverified returns only unverified ingredients', async () => {
    await client.ingredients.$post({ json: VALID_INGREDIENT }, withAuth(userToken))
    await client.ingredients.$post(
      { json: { name: 'Admin Acid', type: 'skincare' as const } },
      withAuth(adminToken)
    )

    const { items } = await expectOk(client.ingredients.$get({ query: { quality: 'unverified' } }))
    expect(items.length).toBe(1)
  })
})

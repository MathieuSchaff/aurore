import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import type { Hono } from 'hono'

import type { AppEnv } from '../../../app-env'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestEnv, type TestClient, withAuth } from '../../../tests/helpers/createTestClient'
import { expectOk } from '../../../tests/helpers/expectStatus'
import { setupAndLogin, setupAndLoginContributor } from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'

type ProductBody = {
  name: string
  brand: string
  category: 'skincare'
  kind: 'serum'
  unit: 'bottle' | 'pump'
  inci?: string
  texture?: 'gel'
}
const PRODUCT_A: ProductBody = {
  name: 'Sérum A',
  brand: 'Acme',
  category: 'skincare',
  kind: 'serum',
  unit: 'bottle',
}
const PRODUCT_B: ProductBody = {
  name: 'Sérum B',
  brand: 'Acme',
  category: 'skincare',
  kind: 'serum',
  unit: 'bottle',
}

async function createProduct(client: TestClient, token: string, body: ProductBody) {
  const res = await client.products.$post({ json: body }, withAuth(token))
  const data = await res.json()
  if (!data.success) throw new Error('product creation failed')
  return data.data
}

setupDbTests()

describe('Product Comparison Routes', () => {
  let app: Hono<AppEnv>
  let client: TestClient
  // Product fixtures now require contributor+ (catalog-authz); the comparison
  // routes themselves stay open to any authenticated user.
  let contributorToken: string

  beforeAll(async () => {
    const env = await createTestEnv()
    app = env.app
    client = env.client
  })

  beforeEach(async () => {
    contributorToken = await setupAndLoginContributor(app, TEST_CREDENTIALS.contributor)
  })

  it('previews selected products in order without creating a comparison', async () => {
    const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
    const a = await createProduct(client, contributorToken, PRODUCT_A)
    const b = await createProduct(client, contributorToken, PRODUCT_B)
    const preview = await expectOk(
      client['product-comparisons'].preview.$get(
        { query: { ids: `${b.id},${a.id}` } },
        withAuth(token)
      )
    )
    expect(preview.map((product) => product.id)).toEqual([b.id, a.id])
    expect(preview[0]?.ingredients).toEqual([])
    expect(await expectOk(client['product-comparisons'].$get({}, withAuth(token)))).toEqual([])
  })

  it('previews the container, texture and INCI in label order', async () => {
    const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
    const a = await createProduct(client, contributorToken, {
      ...PRODUCT_A,
      unit: 'pump',
      texture: 'gel',
      inci: 'Aqua, Niacinamide, Glycerin',
    })
    const b = await createProduct(client, contributorToken, PRODUCT_B)
    const [first, second] = await expectOk(
      client['product-comparisons'].preview.$get(
        { query: { ids: `${a.id},${b.id}` } },
        withAuth(token)
      )
    )
    expect(first).toMatchObject({ unit: 'pump', texture: 'gel' })
    expect(first?.inciTokens?.map((t) => t.label)).toEqual(['Aqua', 'Niacinamide', 'Glycerin'])
    expect(second).toMatchObject({ unit: 'bottle', texture: null, inciTokens: null })
  })

  it('rejects anonymous preview requests', async () => {
    const res = await app.request('/api/product-comparisons/preview?ids=invalid')
    expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
  })

  it.each([
    '',
    'invalid',
    '00000000-0000-7000-8000-000000000001',
    '00000000-0000-7000-8000-000000000001,00000000-0000-7000-8000-000000000001',
    Array.from({ length: 9 }, (_, index) => `00000000-0000-7000-8000-00000000000${index}`).join(
      ','
    ),
  ])('rejects invalid preview selections (%#)', async (ids) => {
    const res = await app.request(`/api/product-comparisons/preview?ids=${ids}`, {
      headers: { Authorization: `Bearer ${contributorToken}` },
    })
    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
  })

  it('rejects a preview containing a missing product', async () => {
    const a = await createProduct(client, contributorToken, PRODUCT_A)
    const res = await client['product-comparisons'].preview.$get(
      { query: { ids: `${a.id},00000000-0000-7000-8000-000000000000` } },
      withAuth(contributorToken)
    )
    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    expect(await res.json()).toMatchObject({ success: false, error: 'comparison_invalid_products' })
  })

  it('POST creates a comparison', async () => {
    const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
    const a = await createProduct(client, contributorToken, PRODUCT_A)
    const b = await createProduct(client, contributorToken, PRODUCT_B)

    const res = await client['product-comparisons'].$post(
      { json: { name: 'Sérums', productIds: [a.id, b.id] } },
      withAuth(token)
    )
    expect(res.status).toBe(HTTP_STATUS.CREATED)
  })

  it('POST rejects 1 product (too few)', async () => {
    const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
    const a = await createProduct(client, contributorToken, PRODUCT_A)

    // Single product fails the zod min(2), so 400 from validator middleware.
    const res = await app.request('/api/product-comparisons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productIds: [a.id] }),
    })
    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
  })

  it('GET /:id returns enriched comparison', async () => {
    const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
    const a = await createProduct(client, contributorToken, PRODUCT_A)
    const b = await createProduct(client, contributorToken, PRODUCT_B)
    const createdRes = await client['product-comparisons'].$post(
      { json: { productIds: [a.id, b.id] } },
      withAuth(token)
    )
    const createdData = await createdRes.json()
    if (!createdData.success) throw new Error('comparison creation failed')

    const comparison = await expectOk(
      client['product-comparisons'][':id'].$get(
        { param: { id: createdData.data.id } },
        withAuth(token)
      )
    )
    expect(comparison.products.length).toBe(2)
  })

  it('PATCH renames a comparison', async () => {
    const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
    const a = await createProduct(client, contributorToken, PRODUCT_A)
    const b = await createProduct(client, contributorToken, PRODUCT_B)
    const createdRes = await client['product-comparisons'].$post(
      { json: { productIds: [a.id, b.id] } },
      withAuth(token)
    )
    const createdData = await createdRes.json()
    if (!createdData.success) throw new Error('comparison creation failed')

    const res = await client['product-comparisons'][':id'].$patch(
      { json: { name: 'Renamed' }, param: { id: createdData.data.id } },
      withAuth(token)
    )
    expect(res.status).toBe(HTTP_STATUS.OK)
  })

  // Oracle: PATCH response reflects the written input, updated name and the
  // new productIds in order. Regression guard on the update/enrich path.
  it('PATCH response reflects the written input', async () => {
    const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
    const a = await createProduct(client, contributorToken, PRODUCT_A)
    const b = await createProduct(client, contributorToken, PRODUCT_B)
    const c = await createProduct(client, contributorToken, {
      ...PRODUCT_A,
      name: 'Sérum C',
    })
    const createdRes = await client['product-comparisons'].$post(
      { json: { productIds: [a.id, b.id] } },
      withAuth(token)
    )
    const createdData = await createdRes.json()
    if (!createdData.success) throw new Error('comparison creation failed')

    const comparison = await expectOk(
      client['product-comparisons'][':id'].$patch(
        { json: { name: 'Renamed', productIds: [b.id, c.id] }, param: { id: createdData.data.id } },
        withAuth(token)
      )
    )
    expect(comparison.name).toBe('Renamed')
    expect(comparison.products.map((p) => p.id)).toEqual([b.id, c.id])
  })

  it('DELETE removes a comparison', async () => {
    const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
    const a = await createProduct(client, contributorToken, PRODUCT_A)
    const b = await createProduct(client, contributorToken, PRODUCT_B)
    const createdRes = await client['product-comparisons'].$post(
      { json: { productIds: [a.id, b.id] } },
      withAuth(token)
    )
    const createdData = await createdRes.json()
    if (!createdData.success) throw new Error('comparison creation failed')

    const res = await client['product-comparisons'][':id'].$delete(
      { param: { id: createdData.data.id } },
      withAuth(token)
    )
    expect(res.status).toBe(204)
  })

  it('GET requires auth (401 anon)', async () => {
    const res = await app.request('/api/product-comparisons', { method: 'GET' })
    expect(res.status).toBe(401)
  })
})

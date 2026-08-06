import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import type { CreateProductInput } from '@aurore/shared'
import { HTTP_STATUS } from '@aurore/shared'

import type { Hono } from 'hono'

import type { AppEnv } from '../../../app-env'
import { setupDbTests } from '../../../tests/db-setup'
import { expectRequiresAuth } from '../../../tests/helpers/authz-matrix'
import type { TestClient } from '../../../tests/helpers/createTestClient'
import { createTestEnv, withAuth } from '../../../tests/helpers/createTestClient'
import { expectOk } from '../../../tests/helpers/expectStatus'
import { COMPLEMENT, HAIRCARE, SKINCARE } from '../../../tests/helpers/product-shapes'
import {
  setupAndLogin,
  setupAndLoginAdmin,
  setupAndLoginContributor,
} from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'

const VALID_PRODUCT = { name: 'Vitamine C', brand: 'Solgar', ...COMPLEMENT } as const

// Pair used by every tab-scoping test: one row per domain tab, distinct brands
// and kinds so a leak across tabs is visible in the assertion.
const SKINCARE_PRODUCT = {
  name: 'Sérum Vitamine C',
  brand: 'Brand-Skincare',
  ...SKINCARE,
} as const

const HAIRCARE_PRODUCT = { name: 'Shampoo Doux', brand: 'Brand-Haircare', ...HAIRCARE } as const

const SKINCARE_SERUM = { name: 'Sérum C', brand: 'CeraVe', ...SKINCARE } as const

setupDbTests()

describe('Product Routes', () => {
  let app: Hono<AppEnv>
  let client: TestClient
  // Record routes need contributor+ (catalog-authz); CRUD here runs as contributor, delete still needs admin.
  let contributorToken: string

  beforeAll(async () => {
    const env = await createTestEnv()
    app = env.app
    client = env.client
  })

  beforeEach(async () => {
    contributorToken = await setupAndLoginContributor(app, TEST_CREDENTIALS.contributor)
  })

  // Defaults to VALID_PRODUCT (a complement); pass a full payload to land on another tab.
  async function createProduct(overrides: Partial<CreateProductInput> = {}) {
    const res = await client.products.$post(
      { json: { ...VALID_PRODUCT, ...overrides } },
      withAuth(contributorToken)
    )
    const data = await res.json()
    if (!data.success) throw new Error('create failed')
    return data.data
  }

  describe('POST /products', () => {
    it('should create a product with required fields', async () => {
      const product = await expectOk(
        client.products.$post({ json: VALID_PRODUCT }, withAuth(contributorToken)),
        HTTP_STATUS.CREATED
      )
      expect(product.id).toBeDefined()
      expect(product.name).toBe('Vitamine C')
      expect(product.brand).toBe('Solgar')
      expect(product.slug).toBeTypeOf('string')
    })

    it('should create a product with all optional fields', async () => {
      const product = await expectOk(
        client.products.$post(
          {
            json: {
              ...VALID_PRODUCT,
              description: 'Antioxydant puissant',
              totalAmount: 60,
              amountUnit: 'capsule',
              priceCents: 1500,
              notes: 'À prendre le matin',
            },
          },
          withAuth(contributorToken)
        ),
        HTTP_STATUS.CREATED
      )
      expect(product.description).toBe('Antioxydant puissant')
      expect(product.totalAmount).toBe(60)
      expect(product.amountUnit).toBe('capsule')
      expect(product.priceCents).toBe(1500)
      expect(product.notes).toBe('À prendre le matin')
    })

    it('should return 409 for duplicate name+brand', async () => {
      await createProduct()
      const res = await client.products.$post({ json: VALID_PRODUCT }, withAuth(contributorToken))

      expect(res.status as number).toBe(HTTP_STATUS.CONFLICT)
      const data = (await res.json()) as { success: boolean; error?: string }
      expect(data.success).toBe(false)
      expect(data.error).toBe('product_already_exists')
    })

    it('should allow same name with different brands', async () => {
      await createProduct()
      const res = await client.products.$post(
        { json: { ...VALID_PRODUCT, brand: 'Now Foods' } },
        withAuth(contributorToken)
      )

      expect(res.status as number).toBe(HTTP_STATUS.CREATED)
    })

    it('should reject missing required fields', async () => {
      // Invalid on purpose, to trigger schema validation.
      const res = await client.products.$post(
        { json: { name: 'Zinc' } as never },
        withAuth(contributorToken)
      )

      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    expectRequiresAuth(() => app, { method: 'POST', path: '/api/products', body: VALID_PRODUCT })
  })

  describe('role enforcement (records)', () => {
    it('201 for a plain user on POST /products (guard swap: requireCatalogWrite removed)', async () => {
      const userToken = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const res = await client.products.$post({ json: VALID_PRODUCT }, withAuth(userToken))
      expect(res.status as number).toBe(HTTP_STATUS.CREATED)
    })
  })

  describe('GET /products', () => {
    it('should return the correct paginated shape', async () => {
      const list = await expectOk(client.products.$get({ query: { category: 'skincare' } }))
      expect(list).toHaveProperty('items')
      expect(list).toHaveProperty('total')
      expect(list).toHaveProperty('page')
      expect(list).toHaveProperty('limit')
    })

    it('should return empty items when no products exist', async () => {
      const list = await expectOk(client.products.$get({ query: { category: 'skincare' } }))
      expect(list.items).toEqual([])
      expect(list.total).toBe(0)
    })

    it('should list all products within a domain without filters', async () => {
      await createProduct()
      await createProduct({ name: 'Magnésium' })

      const list = await expectOk(client.products.$get({ query: { category: 'complement' } }))
      expect(list.total).toBe(2)
      expect(list.items).toHaveLength(2)
    })

    it('should filter by kind', async () => {
      await createProduct()
      await createProduct(SKINCARE_SERUM)

      const list = await expectOk(
        client.products.$get({ query: { category: 'skincare', kind: 'serum' } })
      )
      expect(list.total).toBe(1)
      expect(list.items[0]?.kind).toBe('serum')
    })

    it('should reject kind that does not belong to the requested category', async () => {
      // Cross-category leak guard: ?category=skincare&kind=shampoo must 400.
      const res = await client.products.$get({
        query: { category: 'skincare', kind: 'shampoo' },
      })
      expect(res.status as number).toBe(400)
    })

    it('should accept solaire kinds on the skincare tab', async () => {
      // Skincare tab spans skincare/solaire/bodycare DB categories; sunscreen must pass.
      const res = await client.products.$get({
        query: { category: 'skincare', kind: 'sunscreen' },
      })
      expect(res.status).toBe(200)
    })

    it('should filter by brand', async () => {
      await createProduct()
      await createProduct(SKINCARE_SERUM)

      const list = await expectOk(
        client.products.$get({ query: { category: 'skincare', brand: 'CeraVe' } })
      )
      expect(list.total).toBe(1)
      expect(list.items[0]?.brand).toBe('CeraVe')
    })

    it('should paginate results', async () => {
      await createProduct()
      await createProduct({ name: 'Magnésium' })
      await createProduct({ name: 'Zinc' })

      const list = await expectOk(
        client.products.$get({ query: { category: 'complement', limit: '2', page: '1' } })
      )
      expect(list.items).toHaveLength(2)
      expect(list.total).toBe(3)
      expect(list.page).toBe(1)
      expect(list.limit).toBe(2)
    })

    it('should return page 2 correctly', async () => {
      await createProduct()
      await createProduct({ name: 'Magnésium' })
      await createProduct({ name: 'Zinc' })

      const list = await expectOk(
        client.products.$get({ query: { category: 'complement', limit: '2', page: '2' } })
      )
      expect(list.items).toHaveLength(1)
      expect(list.page).toBe(2)
    })

    it('should default to page=1 and limit=20', async () => {
      const list = await expectOk(client.products.$get({ query: { category: 'skincare' } }))
      expect(list.page).toBe(1)
      expect(list.limit).toBe(20)
    })

    it('should return 400 for invalid limit', async () => {
      const res = await client.products.$get({
        query: { category: 'skincare', limit: '999' },
      })

      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should not require authentication', async () => {
      const res = await client.products.$get({ query: { category: 'skincare' } })

      expect(res.status as number).toBe(HTTP_STATUS.OK)
    })

    it('should return each item with the correct summary fields', async () => {
      await createProduct({ priceCents: 1500 })

      const list = await expectOk(client.products.$get({ query: { category: 'complement' } }))
      const item = list.items[0]
      if (!item) throw new Error('expected at least one item')

      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('slug')
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('brand')
      expect(item).toHaveProperty('kind')
      expect(item).toHaveProperty('unit')
      expect(item).toHaveProperty('priceCents')
      expect(item).toHaveProperty('profileMatches')
      expect(item).toHaveProperty('tags')
      expect(item).not.toHaveProperty('description')
      expect(item).not.toHaveProperty('inci')
    })
  })

  describe('GET /products/:slug', () => {
    it('should return the product by slug without auth', async () => {
      const created = await createProduct()

      const fetched = await expectOk(
        client.products[':slug'].$get({ param: { slug: created.slug } })
      )
      expect(fetched.id).toBe(created.id)
      expect(fetched.slug).toBe(created.slug)
      expect(fetched.name).toBe('Vitamine C')
    })

    it('should return 404 for unknown slug', async () => {
      const res = await client.products[':slug'].$get({
        param: { slug: 'slug-qui-nexiste-pas' },
      })

      expect(res.status as number).toBe(HTTP_STATUS.NOT_FOUND)
      // Error body shape comes from globalErrorHandler, outside the route's success union.
      const data = (await res.json()) as { success: boolean; error?: string }
      expect(data.success).toBe(false)
      expect(data.error).toBe('product_not_found')
    })
  })

  describe('GET /products/brands', () => {
    it('returns an empty array when no products exist', async () => {
      const brands = await expectOk(client.products.brands.$get({ query: {} }))
      expect(brands).toEqual([])
    })

    it('returns distinct brand names sorted A→Z', async () => {
      await createProduct({ ...SKINCARE_SERUM, name: 'Serum C', brand: 'The Ordinary' })
      await createProduct({ ...SKINCARE_SERUM, name: 'SPF 50', brand: 'Avène' })
      await createProduct({ ...SKINCARE_SERUM, name: 'Niacinamide', brand: 'The Ordinary' })

      const brands = await expectOk(client.products.brands.$get({ query: {} }))
      expect(brands).toEqual(['Avène', 'The Ordinary'])
    })

    it('does not require authentication', async () => {
      const res = await client.products.brands.$get({ query: {} })
      expect(res.status).toBe(200)
    })

    // Route-level guard: service coverage alone would miss a dropped `category`
    // in the routes.ts destructuring or the getDistinctBrands call.
    it('scopes brands to the requested tab', async () => {
      await createProduct(SKINCARE_PRODUCT)
      await createProduct(HAIRCARE_PRODUCT)

      const brands = await expectOk(
        client.products.brands.$get({ query: { category: 'haircare' } })
      )
      expect(brands).toEqual(['Brand-Haircare'])
    })

    it('rejects unknown category value', async () => {
      const res = await client.products.brands.$get({
        query: { category: 'nope' as never },
      })
      expect(res.status as number).toBe(400)
    })
  })

  describe('GET /products/filter-options', () => {
    it('should return the correct structure when empty', async () => {
      const options = await expectOk(client.products['filter-options'].$get({ query: {} }))
      expect(options).toHaveProperty('kinds')
      expect(options).toHaveProperty('brands')
      expect(options).toHaveProperty('tagCounts')
      expect(options.kinds).toEqual([])
      expect(options.brands).toEqual([])
      expect(options.tagCounts).toEqual({})
    })

    it('should return populated kinds and brands after creating products', async () => {
      await createProduct()
      await createProduct(SKINCARE_SERUM)

      const options = await expectOk(client.products['filter-options'].$get({ query: {} }))
      expect(options.kinds).toContain('gelule')
      expect(options.kinds).toContain('serum')
      expect(options.brands).toContain('Solgar')
      expect(options.brands).toContain('CeraVe')
    })

    it('should not require authentication', async () => {
      const res = await client.products['filter-options'].$get({ query: {} })

      expect(res.status as number).toBe(HTTP_STATUS.OK)
    })
  })

  describe('GET /products/filter-options?category=', () => {
    it('scopes brands and kinds to the requested tab', async () => {
      await createProduct(SKINCARE_PRODUCT)
      await createProduct(HAIRCARE_PRODUCT)

      const options = await expectOk(
        client.products['filter-options'].$get({ query: { category: 'haircare' } })
      )
      expect(options.brands).toEqual(['Brand-Haircare'])
      expect(options.kinds).toEqual(['shampoo'])
    })

    it('rejects unknown category value', async () => {
      const res = await client.products['filter-options'].$get({
        query: { category: 'nope' as never },
      })
      expect(res.status as number).toBe(400)
    })
  })

  describe('GET /products/check-duplicate', () => {
    it('should return an empty array when no similar products exist', async () => {
      const matches = await expectOk(
        client.products['check-duplicate'].$get({
          query: { name: 'Niacinamide', brand: 'CeraVe' },
        })
      )
      expect(matches).toEqual([])
    })

    it('should return similar products for an exact name+brand match', async () => {
      await createProduct()

      const matches = await expectOk(
        client.products['check-duplicate'].$get({
          query: { name: 'Vitamine C', brand: 'Solgar' },
        })
      )
      expect(matches).toHaveLength(1)
      expect(matches[0]?.name).toBe('Vitamine C')
      expect(matches[0]?.brand).toBe('Solgar')
    })

    it('should return 400 when name is missing', async () => {
      const res = await client.products['check-duplicate'].$get({
        query: { brand: 'Solgar' } as never,
      })

      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should return 400 when brand is missing', async () => {
      const res = await client.products['check-duplicate'].$get({
        query: { name: 'Vitamine C' } as never,
      })

      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should return 400 when name is too short', async () => {
      const res = await client.products['check-duplicate'].$get({
        query: { name: 'A', brand: 'Solgar' },
      })

      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should return the correct shape for each result (id, name, brand, kind, slug)', async () => {
      await createProduct()

      const matches = await expectOk(
        client.products['check-duplicate'].$get({
          query: { name: 'Vitamine C', brand: 'Solgar' },
        })
      )
      expect(matches).toHaveLength(1)
      const item = matches[0]
      if (!item) throw new Error('expected an item')
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('brand')
      expect(item).toHaveProperty('kind')
      expect(item).toHaveProperty('slug')
    })

    it('should not require authentication', async () => {
      const res = await client.products['check-duplicate'].$get({
        query: { name: 'Niacinamide', brand: 'CeraVe' },
      })

      expect(res.status as number).toBe(HTTP_STATUS.OK)
    })
  })

  describe('GET /products/slug-preview', () => {
    it('returns slugified name+brand for a fresh product', async () => {
      const preview = await expectOk(
        client.products['slug-preview'].$get(
          { query: { name: 'CeraVe Baume', brand: 'CeraVe' } },
          withAuth(contributorToken)
        )
      )
      expect(preview.slug).toBe('cera-ve-baume-cera-ve')
    })

    it('appends numeric suffix when base slug is already taken', async () => {
      await createProduct({
        name: 'Niacinamide',
        brand: 'Ordinary',
        slug: 'niacinamide-ordinary',
      })

      const preview = await expectOk(
        client.products['slug-preview'].$get(
          { query: { name: 'Niacinamide', brand: 'Ordinary' } },
          withAuth(contributorToken)
        )
      )
      expect(preview.slug).toBe('niacinamide-ordinary-1')
    })

    it('works with empty brand', async () => {
      const preview = await expectOk(
        client.products['slug-preview'].$get(
          { query: { name: 'Niacinamide', brand: '' } },
          withAuth(contributorToken)
        )
      )
      expect(preview.slug).toBe('niacinamide')
    })

    it('returns 400 when name is too short', async () => {
      const res = await client.products['slug-preview'].$get(
        {
          query: { name: 'A', brand: '' },
        },
        withAuth(contributorToken)
      )
      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })
  })

  describe('GET /products/search', () => {
    it('should return an empty array when nothing matches', async () => {
      const results = await expectOk(client.products.search.$get({ query: { q: 'xyzzyx' } }))
      expect(results.items).toEqual([])
    })

    it('should return products matching by name', async () => {
      await createProduct()
      await createProduct({ name: 'Magnésium' })

      const results = await expectOk(client.products.search.$get({ query: { q: 'Vitamine' } }))
      expect(results.items).toHaveLength(1)
      expect(results.items[0]?.name).toBe('Vitamine C')
    })

    it('should return products matching by brand', async () => {
      await createProduct()
      await createProduct(SKINCARE_SERUM)

      const results = await expectOk(client.products.search.$get({ query: { q: 'CeraVe' } }))
      expect(results.items).toHaveLength(1)
      expect(results.items[0]?.brand).toBe('CeraVe')
    })

    it('should be case-insensitive', async () => {
      await createProduct()

      const results = await expectOk(client.products.search.$get({ query: { q: 'VITAMINE' } }))
      expect(results.items).toHaveLength(1)
    })

    it('should return 400 when q is missing', async () => {
      const res = await client.products.search.$get({ query: {} as never })

      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should respect the limit query param', async () => {
      await createProduct()
      await createProduct({ name: 'Vitamine D' })
      await createProduct({ name: 'Vitamine E' })

      const results = await expectOk(
        client.products.search.$get({ query: { q: 'Vitamine', limit: '2' } })
      )
      expect(results.items).toHaveLength(2)
    })

    it('should return the correct shape (id, name, brand, kind, slug)', async () => {
      await createProduct()

      const results = await expectOk(client.products.search.$get({ query: { q: 'Vitamine' } }))
      expect(results.items).toHaveLength(1)
      const item = results.items[0]
      if (!item) throw new Error('expected an item')
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('brand')
      expect(item).toHaveProperty('kind')
      expect(item).toHaveProperty('slug')
      expect(item).not.toHaveProperty('description')
      expect(item).not.toHaveProperty('priceCents')
    })

    it('should not require authentication', async () => {
      const res = await client.products.search.$get({ query: { q: 'test' } })

      expect(res.status as number).toBe(HTTP_STATUS.OK)
    })

    // Route-level guard: service coverage alone would miss a dropped `category`
    // in the routes.ts destructuring or the searchProducts call.
    it('scopes results to the requested tab', async () => {
      await createProduct({ ...SKINCARE_PRODUCT, name: 'Sérum Kératine' })
      await createProduct({ ...HAIRCARE_PRODUCT, name: 'Shampoing Kératine' })

      const results = await expectOk(
        client.products.search.$get({ query: { q: 'keratine', category: 'haircare' } })
      )
      expect(results.items.map((p) => p.name)).toEqual(['Shampoing Kératine'])
    })

    it('rejects unknown category value', async () => {
      const res = await client.products.search.$get({
        query: { q: 'keratine', category: 'nope' as never },
      })
      expect(res.status as number).toBe(400)
    })
  })

  describe('GET /products/by-ids', () => {
    it('should return products matching the requested ids in any order', async () => {
      const a = await createProduct()
      const b = await createProduct({ name: 'Magnésium' })

      const items = await expectOk(
        client.products['by-ids'].$get({ query: { ids: `${a.id},${b.id}` } })
      )
      expect(items.map((p) => p.id).sort()).toEqual([a.id, b.id].sort())
      expect(items[0]).toHaveProperty('name')
      expect(items[0]).toHaveProperty('brand')
    })

    it('should return 400 when ids is missing', async () => {
      const res = await client.products['by-ids'].$get({ query: {} as never })
      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should return 400 when an id is not a uuid', async () => {
      const res = await client.products['by-ids'].$get({ query: { ids: 'not-a-uuid' } })
      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should not require authentication', async () => {
      const created = await createProduct()

      const res = await client.products['by-ids'].$get({ query: { ids: created.id } })
      expect(res.status as number).toBe(HTTP_STATUS.OK)
    })
  })

  describe('GET /products/shelf-status', () => {
    it("returns shelf status only for the caller's shelved products", async () => {
      const shelved = await createProduct()
      const other = await createProduct({ name: 'Magnésium' })
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      await client['user-products'].$post(
        { json: { productId: shelved.id, status: 'wishlist' } },
        withAuth(token)
      )

      const overlay = await expectOk(
        client.products['shelf-status'].$get(
          { query: { ids: `${shelved.id},${other.id}` } },
          withAuth(token)
        )
      )
      // Products not on the shelf are omitted; the explicit userId filter (not RLS) scopes the read.
      expect(overlay).toEqual([{ productId: shelved.id, userStatus: 'wishlist' }])
    })

    it('returns an empty overlay for an anonymous caller', async () => {
      const product = await createProduct()
      const overlay = await expectOk(
        client.products['shelf-status'].$get({ query: { ids: product.id } })
      )
      expect(overlay).toEqual([])
    })

    it('returns 400 when an id is not a uuid', async () => {
      const res = await client.products['shelf-status'].$get({ query: { ids: 'not-a-uuid' } })
      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('returns 400 when ids is missing', async () => {
      const res = await client.products['shelf-status'].$get({ query: {} as never })
      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })
  })

  describe('PATCH /products/:id', () => {
    it('should update product fields', async () => {
      const created = await createProduct()

      const patched = await expectOk(
        client.products[':id'].$patch(
          {
            param: { id: created.id },
            json: { brand: 'Now Foods', priceCents: 1200 },
          },
          withAuth(contributorToken)
        )
      )
      expect(patched.brand).toBe('Now Foods')
      expect(patched.priceCents).toBe(1200)
      expect(patched.name).toBe('Vitamine C')
    })

    it('should not affect untouched fields', async () => {
      const created = await createProduct({ notes: 'Note initiale' })

      await client.products[':id'].$patch(
        { param: { id: created.id }, json: { brand: 'Now Foods' } },
        withAuth(contributorToken)
      )

      const fetched = await expectOk(
        client.products[':slug'].$get({ param: { slug: created.slug } })
      )
      expect(fetched.notes).toBe('Note initiale')
    })

    it('should allow overwriting a previously set field', async () => {
      const created = await createProduct()

      await client.products[':id'].$patch(
        { param: { id: created.id }, json: { notes: 'première note' } },
        withAuth(contributorToken)
      )
      const updated = await expectOk(
        client.products[':id'].$patch(
          { param: { id: created.id }, json: { notes: 'deuxième note' } },
          withAuth(contributorToken)
        )
      )

      const fetched = await expectOk(
        client.products[':slug'].$get({ param: { slug: updated.slug } })
      )
      expect(fetched.notes).toBe('deuxième note')
    })

    it('should return 404 for unknown id', async () => {
      const res = await client.products[':id'].$patch(
        { param: { id: crypto.randomUUID() }, json: { brand: 'XY' } },
        withAuth(contributorToken)
      )

      expect(res.status as number).toBe(HTTP_STATUS.NOT_FOUND)
      const data = await res.json()
      if (!data.success) expect(data.error).toBe('product_not_found')
    })

    it('should reject unknown fields (strict schema)', async () => {
      const created = await createProduct()

      const res = await client.products[':id'].$patch(
        {
          param: { id: created.id },
          json: { hackerField: 'oops' } as never,
        },
        withAuth(contributorToken)
      )

      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    expectRequiresAuth(() => app, {
      method: 'PATCH',
      path: `/api/products/${crypto.randomUUID()}`,
      body: { brand: 'X' },
    })

    // inci write rule (comma-or-short) is only enforced when inci is present in the body.
    // A notes-only edit omits inci, so it never re-validates an untouched legacy value
    // (see service test for preservation).
    it('rejects a non-conforming inci sent in the patch body', async () => {
      const created = await createProduct()

      const longNoComma =
        'AQUA GLYCERIN CETEARYL ALCOHOL DIMETHICONE PHENOXYETHANOL TOCOPHEROL BUTYROSPERMUM PARKII BUTTER CAPRYLIC CAPRIC TRIGLYCERIDE SODIUM HYALURONATE'
      const res = await client.products[':id'].$patch(
        { param: { id: created.id }, json: { inci: longNoComma } },
        withAuth(contributorToken)
      )

      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })
  })

  describe('DELETE /products/:id', () => {
    it('should delete the product and return null data', async () => {
      const adminToken = await setupAndLoginAdmin(app, TEST_CREDENTIALS.admin)
      const created = await createProduct()

      const res = await client.products[':id'].$delete(
        { param: { id: created.id } },
        withAuth(adminToken)
      )

      expect(res.status as number).toBe(HTTP_STATUS.NO_CONTENT)
    })

    it('should make the product unreachable by slug after deletion', async () => {
      const adminToken = await setupAndLoginAdmin(app, TEST_CREDENTIALS.admin)
      const created = await createProduct()

      await client.products[':id'].$delete({ param: { id: created.id } }, withAuth(adminToken))

      const res = await client.products[':slug'].$get({ param: { slug: created.slug } })
      expect(res.status as number).toBe(HTTP_STATUS.NOT_FOUND)
    })

    it('should not affect other products when deleting one', async () => {
      const adminToken = await setupAndLoginAdmin(app, TEST_CREDENTIALS.admin)
      const p1 = await createProduct()
      const p2 = await createProduct({ name: 'Magnésium' })

      await client.products[':id'].$delete({ param: { id: p1.id } }, withAuth(adminToken))

      const res = await client.products[':slug'].$get({ param: { slug: p2.slug } })
      expect(res.status as number).toBe(HTTP_STATUS.OK)
    })

    it('should return 403 for a contributor (admin-only DELETE, route guard)', async () => {
      // requireAdmin blocks a contributor with 'forbidden' before the handler;
      // the service-layer unauthorized_access check is the backstop.
      // Boundary: contributors create/edit, not delete.
      const created = await createProduct()

      const res = await client.products[':id'].$delete(
        { param: { id: created.id } },
        withAuth(contributorToken)
      )

      expect(res.status as number).toBe(HTTP_STATUS.FORBIDDEN)
      const data = (await res.json()) as { success: boolean; error?: string }
      expect(data.success).toBe(false)
      expect(data.error).toBe('forbidden')
    })

    it('should return 404 for unknown id (product_not_found)', async () => {
      const adminToken = await setupAndLoginAdmin(app, TEST_CREDENTIALS.admin)

      const res = await client.products[':id'].$delete(
        { param: { id: crypto.randomUUID() } },
        withAuth(adminToken)
      )

      expect(res.status as number).toBe(HTTP_STATUS.NOT_FOUND)
      const data = (await res.json()) as { success: boolean; error?: string }
      expect(data.success).toBe(false)
      expect(data.error).toBe('product_not_found')
    })

    expectRequiresAuth(() => app, {
      method: 'DELETE',
      path: `/api/products/${crypto.randomUUID()}`,
    })
  })
})

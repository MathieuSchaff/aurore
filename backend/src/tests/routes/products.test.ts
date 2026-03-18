import { beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@habit-tracker/shared'

import type { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { TEST_CREDENTIALS } from '../helpers/test-credentials'
import { createTestUser } from '../helpers/test-factories'
import { createTestApp } from './createTestApp'

// ── Helpers ──────────────────────────────────────────────────────────

async function loginAndGetToken(app: Hono<AppEnv>, email: string, password: string) {
  const res = await app.request('/auth/mobile/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!data.success) throw new Error('Login failed in helper')
  return data.data.accessToken as string
}

async function setupAndLogin(app: Hono<AppEnv>, creds: { rawEmail: string; rawPassword: string }) {
  await createTestUser(creds.rawEmail, creds.rawPassword)
  return loginAndGetToken(app, creds.rawEmail, creds.rawPassword)
}

function authPost(app: Hono<AppEnv>, path: string, token: string, body: object) {
  return app.request(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
}

function authPatch(app: Hono<AppEnv>, path: string, token: string, body: object) {
  return app.request(path, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
}

function authDelete(app: Hono<AppEnv>, path: string, token: string) {
  return app.request(path, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

const VALID_PRODUCT = {
  name: 'Vitamine C',
  brand: 'Solgar',
  kind: 'complément',
  unit: 'gélule',
}

// ── Tests ────────────────────────────────────────────────────────────

describe('Product Routes', () => {
  let app: Hono<AppEnv>

  beforeEach(() => {
    app = createTestApp()
  })

  // ━━━ POST /products ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('POST /products', () => {
    it('should create a product with required fields', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/products', token, VALID_PRODUCT)

      expect(res.status).toBe(HTTP_STATUS.CREATED)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.id).toBeDefined()
      expect(data.data.name).toBe('Vitamine C')
      expect(data.data.brand).toBe('Solgar')
      expect(data.data.slug).toBeTypeOf('string')
    })

    it('should create a product with all optional fields', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/products', token, {
        ...VALID_PRODUCT,
        description: 'Antioxydant puissant',
        totalAmount: 60,
        amountUnit: 'gélules',
        priceCents: 1500,
        notes: 'À prendre le matin',
      })

      expect(res.status).toBe(HTTP_STATUS.CREATED)
      const data = await res.json()
      expect(data.data.description).toBe('Antioxydant puissant')
      expect(data.data.totalAmount).toBe(60)
      expect(data.data.amountUnit).toBe('gélules')
      expect(data.data.priceCents).toBe(1500)
      expect(data.data.notes).toBe('À prendre le matin')
    })

    it('should store createdAt and updatedAt', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/products', token, VALID_PRODUCT)
      const data = await res.json()

      expect(data.data.createdAt).toBeDefined()
      expect(data.data.updatedAt).toBeDefined()
    })

    it('should return 409 for duplicate name+brand', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      await authPost(app, '/products', token, VALID_PRODUCT)
      const res = await authPost(app, '/products', token, VALID_PRODUCT)

      expect(res.status).toBe(HTTP_STATUS.CONFLICT)
      const data = await res.json()
      expect(data.success).toBe(false)
      expect(data.error).toBe('product_already_exists')
    })

    it('should allow same name with different brands', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      await authPost(app, '/products', token, VALID_PRODUCT)
      const res = await authPost(app, '/products', token, { ...VALID_PRODUCT, brand: 'Now Foods' })

      expect(res.status).toBe(HTTP_STATUS.CREATED)
    })

    it('should reject missing required fields', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/products', token, { name: 'Zinc' })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(VALID_PRODUCT),
      })

      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })

    it('should reject request with invalid token', async () => {
      const res = await authPost(app, '/products', 'invalid.token.here', VALID_PRODUCT)

      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  // ━━━ GET /products/:slug ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('GET /products/:slug', () => {
    it('should return the product by slug without auth', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/products', token, VALID_PRODUCT)
      const { data: created } = await createRes.json()

      const res = await app.request(`/products/${created.slug}`)

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.id).toBe(created.id)
      expect(data.data.slug).toBe(created.slug)
      expect(data.data.name).toBe('Vitamine C')
    })

    it('should also work when authenticated', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/products', token, VALID_PRODUCT)
      const { data: created } = await createRes.json()

      const res = await app.request(`/products/${created.slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.data.id).toBe(created.id)
    })

    it('should return 404 for unknown slug', async () => {
      const res = await app.request('/products/slug-qui-nexiste-pas')

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND)
      const data = await res.json()
      expect(data.success).toBe(false)
      expect(data.error).toBe('product_not_found')
    })
  })

  // ━━━ PATCH /products/:id ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('PATCH /products/:id', () => {
    it('should update product fields', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/products', token, VALID_PRODUCT)
      const { data: created } = await createRes.json()

      const res = await authPatch(app, `/products/${created.id}`, token, {
        brand: 'Now Foods',
        priceCents: 1200,
      })

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.brand).toBe('Now Foods')
      expect(data.data.priceCents).toBe(1200)
      expect(data.data.name).toBe('Vitamine C')
    })

    it('should not affect untouched fields', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/products', token, {
        ...VALID_PRODUCT,
        notes: 'Note initiale',
      })
      const { data: created } = await createRes.json()

      await authPatch(app, `/products/${created.id}`, token, { brand: 'Now Foods' })

      const res = await app.request(`/products/${created.slug}`)
      const data = await res.json()
      expect(data.data.notes).toBe('Note initiale')
    })

    it('should persist updates across requests', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/products', token, VALID_PRODUCT)
      const { data: created } = await createRes.json()

      await authPatch(app, `/products/${created.id}`, token, { notes: 'Mise à jour persistée' })

      const res = await app.request(`/products/${created.slug}`)
      const data = await res.json()
      expect(data.data.notes).toBe('Mise à jour persistée')
    })

    it('should allow overwriting a previously set field', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/products', token, VALID_PRODUCT)
      const { data: created } = await createRes.json()

      await authPatch(app, `/products/${created.id}`, token, { notes: 'première note' })
      const updateRes = await authPatch(app, `/products/${created.id}`, token, {
        notes: 'deuxième note',
      })
      const { data: updated } = await updateRes.json()

      const res = await app.request(`/products/${updated.slug}`)
      const data = await res.json()
      expect(data.data.notes).toBe('deuxième note')
    })

    it('should return 404 for unknown id', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPatch(app, `/products/${crypto.randomUUID()}`, token, { brand: 'X' })

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND)
      const data = await res.json()
      expect(data.error).toBe('product_not_found')
    })

    it('should reject unknown fields (strict schema)', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/products', token, VALID_PRODUCT)
      const { data: created } = await createRes.json()

      const res = await authPatch(app, `/products/${created.id}`, token, { hackerField: 'oops' })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request(`/products/${crypto.randomUUID()}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: 'X' }),
      })

      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  // ━━━ GET /products/brands ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('GET /products/brands', () => {
    it('returns an empty array when no products exist', async () => {
      const res = await app.request('/products/brands')
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
    })

    it('returns distinct brand names sorted A→Z', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      await authPost(app, '/products', token, {
        name: 'Serum C',
        brand: 'The Ordinary',
        kind: 'skincare',
        unit: 'ml',
      })
      await authPost(app, '/products', token, {
        name: 'SPF 50',
        brand: 'Avène',
        kind: 'skincare',
        unit: 'ml',
      })
      await authPost(app, '/products', token, {
        name: 'Niacinamide',
        brand: 'The Ordinary',
        kind: 'skincare',
        unit: 'ml',
      })

      const res = await app.request('/products/brands')
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.data).toEqual(['Avène', 'The Ordinary'])
    })

    it('does not require authentication', async () => {
      const res = await app.request('/products/brands')
      expect(res.status).toBe(200)
    })
  })

  // ━━━ DELETE /products/:id ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('DELETE /products/:id', () => {
    it('should delete the product and return null data', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/products', token, VALID_PRODUCT)
      const { data: created } = await createRes.json()

      const res = await authDelete(app, `/products/${created.id}`, token)

      expect(res.status).toBe(HTTP_STATUS.NO_CONTENT)
    })

    it('should make the product unreachable by slug after deletion', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/products', token, VALID_PRODUCT)
      const { data: created } = await createRes.json()

      await authDelete(app, `/products/${created.id}`, token)

      const res = await app.request(`/products/${created.slug}`)
      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND)
    })

    it('should not affect other products when deleting one', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const r1 = await authPost(app, '/products', token, VALID_PRODUCT)
      const r2 = await authPost(app, '/products', token, {
        name: 'Magnésium',
        brand: 'Solgar',
        kind: 'complément',
        unit: 'gélule',
      })

      const { data: p1 } = await r1.json()
      const { data: p2 } = await r2.json()

      await authDelete(app, `/products/${p1.id}`, token)

      const res = await app.request(`/products/${p2.slug}`)
      expect(res.status).toBe(HTTP_STATUS.OK)
    })

    it('should return 500 for unknown id (product_delete_failed)', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authDelete(app, `/products/${crypto.randomUUID()}`, token)

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      const data = await res.json()
      expect(data.success).toBe(false)
      expect(data.error).toBe('product_delete_failed')
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request(`/products/${crypto.randomUUID()}`, { method: 'DELETE' })

      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })
})

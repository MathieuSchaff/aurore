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

function authGet(app: Hono<AppEnv>, path: string, token: string) {
  return app.request(path, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

function authPost(app: Hono<AppEnv>, path: string, token: string, body: object) {
  return app.request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
}

async function createProduct(app: Hono<AppEnv>, token: string) {
  const res = await app.request('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: 'Vitamine C', brand: 'Solgar', kind: 'complément', unit: 'gélule' }),
  })
  const data = await res.json()
  return data.data as { id: string; slug: string }
}

// ── Tests ────────────────────────────────────────────────────────────

describe('Stock Routes', () => {
  let app: Hono<AppEnv>

  beforeEach(() => {
    app = createTestApp()
  })

  // ━━━ POST /stock/:productId/entries ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('POST /stock/:productId/entries', () => {
    it('should create a stock entry and increment product_stock qty', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const product = await createProduct(app, token)

      const res = await authPost(app, `/stock/${product.id}/entries`, token, {
        qty: 3,
        pricePaidCents: 2500,
        purchasedAt: '2026-03-13',
      })

      expect(res.status).toBe(HTTP_STATUS.CREATED)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.entry.qty).toBe(3)
      expect(data.data.entry.pricePaidCents).toBe(2500)
      expect(data.data.stock.qty).toBe(3)
    })

    it('should accumulate qty on repeated entries', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const product = await createProduct(app, token)

      await authPost(app, `/stock/${product.id}/entries`, token, {
        qty: 2,
        purchasedAt: '2026-03-10',
      })
      const res = await authPost(app, `/stock/${product.id}/entries`, token, {
        qty: 5,
        purchasedAt: '2026-03-13',
      })

      const data = await res.json()
      expect(data.data.stock.qty).toBe(7)
    })

    it('should reject qty of 0', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const product = await createProduct(app, token)

      const res = await authPost(app, `/stock/${product.id}/entries`, token, {
        qty: 0,
        purchasedAt: '2026-03-13',
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject invalid date format', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const product = await createProduct(app, token)

      const res = await authPost(app, `/stock/${product.id}/entries`, token, {
        qty: 1,
        purchasedAt: '13/03/2026',
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should work without optional price', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const product = await createProduct(app, token)

      const res = await authPost(app, `/stock/${product.id}/entries`, token, {
        qty: 1,
        purchasedAt: '2026-03-13',
      })

      expect(res.status).toBe(HTTP_STATUS.CREATED)
      const data = await res.json()
      expect(data.data.entry.pricePaidCents).toBeNull()
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/stock/00000000-0000-0000-0000-000000000001/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty: 1, purchasedAt: '2026-03-13' }),
      })
      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })

    it('should only increment stock for the authenticated user', async () => {
      const tokenToto = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const tokenAlice = await setupAndLogin(app, TEST_CREDENTIALS.alice)
      const product = await createProduct(app, tokenToto)

      await authPost(app, `/stock/${product.id}/entries`, tokenToto, {
        qty: 3,
        purchasedAt: '2026-03-13',
      })

      // Alice should have no stock entries
      const res = await authGet(app, '/stock/entries', tokenAlice)
      const data = await res.json()
      expect(data.data).toEqual([])
    })
  })
})

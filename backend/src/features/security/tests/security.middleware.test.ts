import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestEnv,
  type TestApp,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectError } from '../../../tests/helpers/expectStatus'
import { setupAndLoginContributor } from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'

const VALID_PRODUCT = {
  name: 'Sérum Test',
  brand: 'TestBrand',
  category: 'skincare',
  kind: 'serum',
  unit: 'pump',
}

// `as never`: most bodies here are deliberately invalid payloads the route's
// input type rejects; the point is to reach the scanner before validation.
async function postProduct<TBody>(client: TestClient, token: string, body: TBody) {
  return client.products.$post({ json: body as never }, withAuth(token))
}

setupDbTests()

describe('Security Middleware: product routes', () => {
  let app: TestApp
  let client: TestClient
  let token: string

  beforeAll(async () => {
    ;({ app, client } = await createTestEnv())
  })

  beforeEach(async () => {
    // Product creation requires contributor+ (catalog-authz); the security
    // middleware under test runs regardless of role.
    token = await setupAndLoginContributor(app, TEST_CREDENTIALS.contributor)
  })

  describe('detection', () => {
    it('blocks javascript: URL on first attempt (403)', async () => {
      const res = await postProduct(client, token, {
        ...VALID_PRODUCT,
        url: 'javascript:alert(document.cookie)',
      })
      await expectError(res, HTTP_STATUS.FORBIDDEN, 'forbidden')
    })

    it('blocks data:text/html URL on first attempt (403)', async () => {
      const res = await postProduct(client, token, {
        ...VALID_PRODUCT,
        url: 'data:text/html,<script>alert(1)</script>',
      })
      expect(res.status).toBe(HTTP_STATUS.FORBIDDEN)
    })

    it('blocks HTML in inci on first attempt (403)', async () => {
      const res = await postProduct(client, token, {
        ...VALID_PRODUCT,
        inci: '<script>alert(1)</script>',
      })
      expect(res.status).toBe(HTTP_STATUS.FORBIDDEN)
    })

    it('http:// URL is LOW for the scanner (not 403); https-only schema rejects it (400)', async () => {
      const res = await postProduct(client, token, {
        ...VALID_PRODUCT,
        url: 'http://example.com',
      })
      // Scanner classifies http:// as LOW and passes it (no 403). The hardened
      // https-only product schema is what rejects it at validation, with a 400.
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('passes valid product through', async () => {
      const res = await postProduct(client, token, VALID_PRODUCT)
      expect(res.status).toBe(HTTP_STATUS.CREATED)
    })

    it('passes valid product with https URL through', async () => {
      const res = await postProduct(client, token, {
        ...VALID_PRODUCT,
        url: 'https://example.com',
      })
      expect(res.status).toBe(HTTP_STATUS.CREATED)
    })
  })

  describe('Content-Type bypass', () => {
    it('blocks HIGH detection even when Content-Type is text/plain', async () => {
      const res = await app.request('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...VALID_PRODUCT, url: 'javascript:alert(1)' }),
      })
      expect(res.status).toBe(HTTP_STATUS.FORBIDDEN)
    })

    it('blocks HIGH detection even when Content-Type is missing', async () => {
      const res = await app.request('/api/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...VALID_PRODUCT, inci: '<script>1</script>' }),
      })
      expect(res.status).toBe(HTTP_STATUS.FORBIDDEN)
    })
  })

  describe('repeat-offender fast-path', () => {
    it('low-severity events do not contribute to the block', async () => {
      for (let i = 0; i < 5; i++) {
        await postProduct(client, token, {
          name: `Produit ${i}`,
          brand: 'TestBrand',
          category: 'skincare',
          kind: 'serum',
          unit: 'pump',
          url: 'http://example.com',
        })
      }

      const res = await postProduct(client, token, { ...VALID_PRODUCT, name: 'Produit Final' })
      expect(res.status).toBe(HTTP_STATUS.CREATED)
    })

    it('blocks a clean request once 3 high-severity events are on record', async () => {
      for (let i = 0; i < 3; i++) {
        await postProduct(client, token, {
          ...VALID_PRODUCT,
          name: `Produit ${i}`,
          url: 'javascript:alert(1)',
        })
      }

      // Nothing to detect in this body: the 403 can only come from isUserBlocked.
      const res = await postProduct(client, token, { ...VALID_PRODUCT, name: 'Produit Final' })
      expect(res.status).toBe(HTTP_STATUS.FORBIDDEN)
    })
  })
})

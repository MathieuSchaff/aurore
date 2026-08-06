import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import type { CreateUserProductInput } from '@aurore/shared'
import { HTTP_STATUS } from '@aurore/shared'

import type { Hono } from 'hono'

import type { AppEnv } from '../../../app-env'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestEnv, type TestClient, withAuth } from '../../../tests/helpers/createTestClient'
import { expectOk } from '../../../tests/helpers/expectStatus'
import { loginAndGetToken, setupAndLogin } from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import { createTestProduct, createTestUser } from '../../../tests/helpers/test-factories'

// Catalogue row every collection entry points at; no assertion reads its fields.
const SUPPORT_PRODUCT = { name: 'Crème hydratante', brand: 'Avène' } as const

setupDbTests()

describe('User Products API', () => {
  let app: Hono<AppEnv>
  let client: TestClient
  let token: string
  let productId: string

  beforeAll(async () => {
    const env = await createTestEnv()
    app = env.app
    client = env.client
  })

  beforeEach(async () => {
    const creds = TEST_CREDENTIALS.toto
    const user = await createTestUser(creds.rawEmail, creds.rawPassword)
    token = await loginAndGetToken(app, creds.rawEmail, creds.rawPassword)
    const product = await createTestProduct(user.id, SUPPORT_PRODUCT)
    productId = product.id
  })

  // Setup-only: tests whose subject is POST itself call the route directly.
  // `as` defaults to the current `token`, reassigned by the beforeEach above.
  function createUserProduct(overrides: Partial<CreateUserProductInput> = {}, as = token) {
    return expectOk(
      client['user-products'].$post(
        { json: { productId, status: 'in_stock', ...overrides } },
        withAuth(as)
      ),
      HTTP_STATUS.CREATED
    )
  }

  // Row owned by someone else, target of every cross-user 404.
  async function createOtherUserProduct() {
    const otherToken = await setupAndLogin(app, TEST_CREDENTIALS.alice)
    return createUserProduct({}, otherToken)
  }

  describe('GET /user-products', () => {
    it('returns empty list initially', async () => {
      const products = await expectOk(client['user-products'].$get({}, withAuth(token)))
      expect(products).toEqual([])
    })

    it('returns user products after creation', async () => {
      await createUserProduct()
      const products = await expectOk(client['user-products'].$get({}, withAuth(token)))
      expect(products).toHaveLength(1)
      expect(products[0]?.productId).toBe(productId)
    })
  })

  describe('POST /user-products', () => {
    it('creates a user product with status only', async () => {
      const userProduct = await expectOk(
        client['user-products'].$post({ json: { productId, status: 'wishlist' } }, withAuth(token)),
        HTTP_STATUS.CREATED
      )
      expect(userProduct.productId).toBe(productId)
      expect(userProduct.status).toBe('wishlist')
    })

    it('creates a user product with all optional fields', async () => {
      const userProduct = await expectOk(
        client['user-products'].$post(
          {
            json: {
              productId,
              status: 'archived',
              sentiment: 5,
              wouldRepurchase: 'yes',
              comment: 'Mon produit préféré',
            },
          },
          withAuth(token)
        ),
        HTTP_STATUS.CREATED
      )
      expect(userProduct.sentiment).toBe(5)
      expect(userProduct.wouldRepurchase).toBe('yes')
      expect(userProduct.comment).toBe('Mon produit préféré')
    })

    it('upserts on duplicate productId', async () => {
      await createUserProduct()
      const upserted = await expectOk(
        client['user-products'].$post({ json: { productId, status: 'archived' } }, withAuth(token)),
        HTTP_STATUS.CREATED
      )
      expect(upserted.status).toBe('archived')

      const products = await expectOk(client['user-products'].$get({}, withAuth(token)))
      expect(products).toHaveLength(1)
    })

    it('rejects missing productId', async () => {
      const res = await client['user-products'].$post(
        // @ts-expect-error — missing productId is exactly what we want to test
        { json: { status: 'in_stock' } },
        withAuth(token)
      )
      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })
  })

  describe('GET /user-products/:id', () => {
    it('returns the user product with relations', async () => {
      const up = await createUserProduct()

      const fetched = await expectOk(
        client['user-products'][':id'].$get({ param: { id: up.id } }, withAuth(token))
      )
      expect(fetched.id).toBe(up.id)
      expect(fetched.product).toBeDefined()
    })

    it('returns 404 for unknown id', async () => {
      const fakeId = crypto.randomUUID()
      const res = await client['user-products'][':id'].$get(
        { param: { id: fakeId } },
        withAuth(token)
      )
      expect(res.status as number).toBe(HTTP_STATUS.NOT_FOUND)
    })

    it('returns 404 for another user product', async () => {
      const up = await createOtherUserProduct()

      const res = await client['user-products'][':id'].$get(
        { param: { id: up.id } },
        withAuth(token)
      )
      expect(res.status as number).toBe(HTTP_STATUS.NOT_FOUND)
    })
  })

  describe('PATCH /user-products/:id', () => {
    it('updates status', async () => {
      const up = await createUserProduct()

      const updated = await expectOk(
        client['user-products'][':id'].$patch(
          { param: { id: up.id }, json: { status: 'archived' } },
          withAuth(token)
        )
      )
      expect(updated.status).toBe('archived')
    })

    it('returns 404 for another user product', async () => {
      const up = await createOtherUserProduct()

      const res = await client['user-products'][':id'].$patch(
        { param: { id: up.id }, json: { status: 'archived' } },
        withAuth(token)
      )
      expect(res.status as number).toBe(HTTP_STATUS.NOT_FOUND)
    })

    it('persists experience tags (ressenti / routine / preferences)', async () => {
      const up = await createUserProduct()

      const updated = await expectOk(
        client['user-products'][':id'].$patch(
          {
            param: { id: up.id },
            json: {
              ressenti: ['leger', 'confortable'],
              routine: ['matin', 'voyage'],
              preferences: ['sans-parfum'],
            },
          },
          withAuth(token)
        )
      )
      expect(updated.ressenti).toEqual(['leger', 'confortable'])
      expect(updated.routine).toEqual(['matin', 'voyage'])
      expect(updated.preferences).toEqual(['sans-parfum'])
    })

    it('rejects an unknown tag value', async () => {
      const up = await createUserProduct()

      const res = await client['user-products'][':id'].$patch(
        {
          param: { id: up.id },
          // @ts-expect-error — 'not-a-real-tag' is intentionally invalid
          json: { ressenti: ['not-a-real-tag'] },
        },
        withAuth(token)
      )
      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })
  })

  describe('DELETE /user-products/:id', () => {
    it('deletes a user product', async () => {
      const up = await createUserProduct()

      const res = await client['user-products'][':id'].$delete(
        { param: { id: up.id } },
        withAuth(token)
      )
      expect(res.status).toBe(HTTP_STATUS.OK)

      const products = await expectOk(client['user-products'].$get({}, withAuth(token)))
      expect(products).toHaveLength(0)
    })

    it('returns 404 for another user product', async () => {
      const up = await createOtherUserProduct()

      const res = await client['user-products'][':id'].$delete(
        { param: { id: up.id } },
        withAuth(token)
      )
      expect(res.status as number).toBe(HTTP_STATUS.NOT_FOUND)
    })
  })

  describe('PUT /user-products/:id/review', () => {
    it('creates then updates a review', async () => {
      const up = await createUserProduct()

      const review = await expectOk(
        client['user-products'][':id'].review.$put(
          { param: { id: up.id }, json: { tolerance: 5, efficacy: 4 } },
          withAuth(token)
        )
      )
      expect(review.tolerance).toBe(5)
      expect(review.efficacy).toBe(4)

      const updated = await expectOk(
        client['user-products'][':id'].review.$put(
          { param: { id: up.id }, json: { tolerance: 3 } },
          withAuth(token)
        )
      )
      expect(updated.tolerance).toBe(3)
      expect(updated.efficacy).toBe(4)
    })

    it('returns 404 for unknown user product', async () => {
      const fakeId = crypto.randomUUID()
      const res = await client['user-products'][':id'].review.$put(
        { param: { id: fakeId }, json: { tolerance: 5 } },
        withAuth(token)
      )
      expect(res.status as number).toBe(HTTP_STATUS.NOT_FOUND)
    })
  })

  describe('GET /user-products/:id/history', () => {
    it('returns ordered transitions including initial creation', async () => {
      const up = await createUserProduct({ status: 'wishlist' })

      await client['user-products'][':id'].$patch(
        {
          param: { id: up.id },
          json: { status: 'avoided', reason: 'Trop riche pour mon hiver' },
        },
        withAuth(token)
      )

      const history = await expectOk(
        client['user-products'][':id'].history.$get({ param: { id: up.id } }, withAuth(token))
      )
      expect(history).toHaveLength(2)
      expect(history[0]?.toStatus).toBe('avoided')
      expect(history[0]?.fromStatus).toBe('wishlist')
      expect(history[0]?.reason).toBe('Trop riche pour mon hiver')
      expect(history[1]?.toStatus).toBe('wishlist')
      expect(history[1]?.fromStatus).toBeNull()
    })

    it('returns 404 for another user product', async () => {
      const fakeId = crypto.randomUUID()
      const res = await client['user-products'][':id'].history.$get(
        { param: { id: fakeId } },
        withAuth(token)
      )
      expect(res.status as number).toBe(HTTP_STATUS.NOT_FOUND)
    })
  })

  describe('Purchases', () => {
    let upId: string

    beforeEach(async () => {
      const up = await createUserProduct()
      upId = up.id
    })

    // Setup-only, same rule as createUserProduct: the "adds a purchase" test posts directly.
    function addPurchase(json: { purchasedAt: string; pricePaidCents?: number }) {
      return expectOk(
        client['user-products'][':id'].purchases.$post(
          { param: { id: upId }, json },
          withAuth(token)
        ),
        HTTP_STATUS.CREATED
      )
    }

    it('lists purchases (empty initially)', async () => {
      const purchases = await expectOk(
        client['user-products'][':id'].purchases.$get({ param: { id: upId } }, withAuth(token))
      )
      expect(purchases).toEqual([])
    })

    it('adds a purchase', async () => {
      const purchase = await expectOk(
        client['user-products'][':id'].purchases.$post(
          {
            param: { id: upId },
            json: { purchasedAt: '2026-03-01T00:00:00.000Z', pricePaidCents: 1200 },
          },
          withAuth(token)
        ),
        HTTP_STATUS.CREATED
      )
      expect(purchase.purchasedAt).toBe('2026-03-01T00:00:00.000Z')
      expect(purchase.pricePaidCents).toBe(1200)
      expect(purchase.openedAt).toBeNull()
      expect(purchase.finishedAt).toBeNull()
    })

    it('opens a purchase', async () => {
      const purchase = await addPurchase({ purchasedAt: '2026-03-01T00:00:00.000Z' })

      const opened = await expectOk(
        client['user-products'][':id'].purchases[':purchaseId'].open.$post(
          {
            param: { id: upId, purchaseId: purchase.id },
            json: { openedAt: '2026-03-05T00:00:00.000Z' },
          },
          withAuth(token)
        )
      )
      expect(opened.openedAt).toBe('2026-03-05T00:00:00.000Z')
    })

    it('finishes the active purchase', async () => {
      const purchase = await addPurchase({ purchasedAt: '2026-03-01T00:00:00.000Z' })
      await client['user-products'][':id'].purchases[':purchaseId'].open.$post(
        {
          param: { id: upId, purchaseId: purchase.id },
          json: { openedAt: '2026-03-05T00:00:00.000Z' },
        },
        withAuth(token)
      )

      const finished = await expectOk(
        client['user-products'][':id'].purchases.finish.$post(
          { param: { id: upId }, json: { finishedAt: '2026-03-20T00:00:00.000Z' } },
          withAuth(token)
        )
      )
      expect(finished.finishedAt).toBe('2026-03-20T00:00:00.000Z')
    })

    it('updates a purchase', async () => {
      const purchase = await addPurchase({
        purchasedAt: '2026-03-01T00:00:00.000Z',
        pricePaidCents: 1000,
      })

      const updated = await expectOk(
        client['user-products'][':id'].purchases[':purchaseId'].$patch(
          {
            param: { id: upId, purchaseId: purchase.id },
            json: { pricePaidCents: 1500 },
          },
          withAuth(token)
        )
      )
      expect(updated.pricePaidCents).toBe(1500)
    })

    it('deletes a purchase', async () => {
      const purchase = await addPurchase({ purchasedAt: '2026-03-01T00:00:00.000Z' })

      const res = await client['user-products'][':id'].purchases[':purchaseId'].$delete(
        { param: { id: upId, purchaseId: purchase.id } },
        withAuth(token)
      )
      expect(res.status).toBe(HTTP_STATUS.OK)

      const purchases = await expectOk(
        client['user-products'][':id'].purchases.$get({ param: { id: upId } }, withAuth(token))
      )
      expect(purchases).toHaveLength(0)
    })
  })
})

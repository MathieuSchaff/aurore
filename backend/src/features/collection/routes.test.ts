import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { setupDbTests } from '../../tests/db-setup'
import { expectRequiresAuth } from '../../tests/helpers/authz-matrix'
import {
  createTestEnv,
  signupAndGetToken,
  type TestApp,
  type TestClient,
  withAuth,
} from '../../tests/helpers/createTestClient'
import { expectOk, expectStatus } from '../../tests/helpers/expectStatus'
import { createTestProduct } from '../../tests/helpers/test-factories'

setupDbTests()

const SOME_UUID = '00000000-0000-0000-0000-000000000000'

describe('collection routes', () => {
  let app: TestApp
  let client: TestClient
  let token: string
  let userId: string

  beforeAll(async () => {
    ;({ app, client } = await createTestEnv())
  })

  beforeEach(async () => {
    ;({ token, userId } = await signupAndGetToken(
      client,
      'collection@test.local',
      'Azerty123!seed'
    ))
  })

  describe('POST /collection/compatibility-scores', () => {
    expectRequiresAuth(() => app, {
      method: 'POST',
      path: '/api/collection/compatibility-scores',
      body: { productIds: [SOME_UUID] },
    })

    it('rejects an empty productIds list', async () => {
      const res = await client.collection['compatibility-scores'].$post(
        { json: { productIds: [] } },
        withAuth(token)
      )

      expectStatus(res, HTTP_STATUS.BAD_REQUEST)
    })

    it('returns a score map keyed by productId (null without signal)', async () => {
      const product = await createTestProduct(userId, {
        name: 'Compat Cream',
        brand: 'Brand',
        kind: 'moisturizer',
        unit: 'tube',
      })

      const { scores } = await expectOk(
        client.collection['compatibility-scores'].$post(
          { json: { productIds: [product.id] } },
          withAuth(token)
        )
      )

      expect(scores).toHaveProperty(product.id)
      expect(scores[product.id]).toBeNull()
    })
  })

  describe('GET /collection/formula-motifs', () => {
    expectRequiresAuth(() => app, { method: 'GET', path: '/api/collection/formula-motifs' })

    it('returns an empty motif set for an empty collection', async () => {
      const motifs = await expectOk(client.collection['formula-motifs'].$get({}, withAuth(token)))

      expect(motifs).toEqual({ productsAnalyzed: 0, benefits: [], notes: [] })
    })
  })
})

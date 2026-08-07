import { beforeAll, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestClient,
  signupAndGetToken,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectError, expectOk, expectStatus } from '../../../tests/helpers/expectStatus'
import { createTestProduct, createTestUser } from '../../../tests/helpers/test-factories'
import { upsertDermoProfile } from '../../profile/service'

setupDbTests()

async function seedProduct(inci?: string) {
  const user = await createTestUser()
  return createTestProduct(user.id, { name: inci ? 'Sérum inci' : 'Sérum no inci', inci })
}

describe('GET /products/:slug/dermo-score', () => {
  let client: TestClient

  beforeAll(async () => {
    client = await createTestClient()
  })

  it('returns 200 with an assessment when the product has INCI', async () => {
    const product = await seedProduct('Aqua, Glycerin, Niacinamide, Parfum')

    await expectOk(client.products[':slug']['dermo-score'].$get({ param: { slug: product.slug } }))
  })

  // inci_missing is a missing resource, not malformed input, so it must be 404, not 400.
  it('returns 404 with inci_missing when the product has no INCI', async () => {
    const product = await seedProduct()

    await expectError(
      client.products[':slug']['dermo-score'].$get({ param: { slug: product.slug } }),
      HTTP_STATUS.NOT_FOUND,
      'inci_missing'
    )
  })

  it('returns 404 for an unknown slug', async () => {
    const res = await client.products[':slug']['dermo-score'].$get({
      param: { slug: 'does-not-exist' },
    })

    expectStatus(res, HTTP_STATUS.NOT_FOUND)
  })

  // optionalJwtAuth wiring: a valid bearer must reach the service as a userId, so
  // the profiled score stops matching the anonymous one. Which way it shifts is
  // the service's rule, asserted in dermo-score.service.test.ts.
  it('personalizes the score when a valid bearer carries a profile', async () => {
    const { token, userId } = await signupAndGetToken(
      client,
      'sensitive@dermo-route.test',
      'Azerty123!seed'
    )
    await testDb.transaction((tx) =>
      upsertDermoProfile(tx, userId, { skinTypes: ['peau-sensible'] })
    )
    const product = await seedProduct('Aqua, Glycerin, Alcohol Denat, Parfum, Limonene')

    const anon = await expectOk(
      client.products[':slug']['dermo-score'].$get({ param: { slug: product.slug } })
    )
    const authed = await expectOk(
      client.products[':slug']['dermo-score'].$get(
        { param: { slug: product.slug } },
        withAuth(token)
      )
    )

    expect(authed.productAxisRisk.irritation.risk).not.toBe(anon.productAxisRisk.irritation.risk)
  })

  // The endpoint is public: optionalJwtAuth falls through on a bearer it cannot
  // verify instead of rejecting it, so a stale token still gets the anonymous score.
  it('falls through anonymously when the bearer is invalid', async () => {
    const product = await seedProduct('Aqua, Glycerin, Niacinamide, Parfum')

    const anon = await expectOk(
      client.products[':slug']['dermo-score'].$get({ param: { slug: product.slug } })
    )
    const bogus = await expectOk(
      client.products[':slug']['dermo-score'].$get(
        { param: { slug: product.slug } },
        withAuth('not-a-valid-jwt')
      )
    )

    expect(bogus).toEqual(anon)
  })
})

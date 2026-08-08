import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { setupDbTests } from '../../../tests/db-setup'
import { expectRequiresAuth } from '../../../tests/helpers/authz-matrix'
import {
  createTestEnv,
  type TestApp,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectOk } from '../../../tests/helpers/expectStatus'
import { authPatch, setupAndLogin } from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'

setupDbTests()

describe('Dermo Profile Routes', () => {
  let app: TestApp
  let client: TestClient
  let token: string

  beforeAll(async () => {
    const env = await createTestEnv()
    app = env.app
    client = env.client
  })

  beforeEach(async () => {
    token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
  })

  describe('GET /profile/dermo', () => {
    it('should return null for a new user', async () => {
      const dermoProfile = await expectOk(client.profile.dermo.$get({}, withAuth(token)))
      expect(dermoProfile).toBeNull()
    })

    expectRequiresAuth(() => app, { method: 'GET', path: '/api/profile/dermo' })
  })

  describe('PATCH /profile/dermo', () => {
    it('should create dermo profile on first patch', async () => {
      const dermoProfile = await expectOk(
        client.profile.dermo.$patch(
          {
            json: {
              skinTypes: ['peau-seche', 'peau-sensible'],
              fitzpatrickType: 2,
              skinConcerns: ['rosacee', 'deshydratation'],
              privateNotes: 'Reacts to fragrances',
            },
          },
          withAuth(token)
        )
      )
      expect(dermoProfile.skinTypes).toEqual(['peau-seche', 'peau-sensible'])
      expect(dermoProfile.fitzpatrickType).toBe(2)
      expect(dermoProfile.skinConcerns).toEqual(['rosacee', 'deshydratation'])
      expect(dermoProfile.privateNotes).toBe('Reacts to fragrances')
    })

    it('should persist dermo profile across requests', async () => {
      await client.profile.dermo.$patch({ json: { skinTypes: ['peau-grasse'] } }, withAuth(token))
      const dermoProfile = await expectOk(client.profile.dermo.$get({}, withAuth(token)))
      expect(dermoProfile?.skinTypes).toEqual(['peau-grasse'])
    })

    it('should update only provided fields on subsequent patch', async () => {
      await client.profile.dermo.$patch(
        {
          json: {
            skinTypes: ['peau-seche'],
            skinConcerns: ['anti-acne'],
          },
        },
        withAuth(token)
      )
      await client.profile.dermo.$patch({ json: { fitzpatrickType: 3 } }, withAuth(token))
      const dermoProfile = await expectOk(client.profile.dermo.$get({}, withAuth(token)))
      expect(dermoProfile?.skinTypes).toEqual(['peau-seche'])
      expect(dermoProfile?.skinConcerns).toEqual(['anti-acne'])
      expect(dermoProfile?.fitzpatrickType).toBe(3)
    })

    // zValidator failures return 400 from middleware, not reflected in the
    // typed response, so use authPatch here instead.
    it('should reject more than 3 skin types', async () => {
      const res = await authPatch(app, '/api/profile/dermo', token, {
        skinTypes: ['dry', 'oily', 'combination', 'sensitive'],
      })
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject an invalid skin type', async () => {
      const res = await authPatch(app, '/api/profile/dermo', token, {
        skinTypes: ['unknown_type'],
      })
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject fitzpatrickType below 1', async () => {
      const res = await authPatch(app, '/api/profile/dermo', token, { fitzpatrickType: 0 })
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject fitzpatrickType above 6', async () => {
      const res = await authPatch(app, '/api/profile/dermo', token, { fitzpatrickType: 7 })
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject an invalid skin concern', async () => {
      const res = await authPatch(app, '/api/profile/dermo', token, {
        skinConcerns: ['unknown_concern'],
      })
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unknown fields (strict mode)', async () => {
      const res = await authPatch(app, '/api/profile/dermo', token, { hackerField: 'oops' })
      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should not leak dermo data between users', async () => {
      const tokenAlice = await setupAndLogin(app, TEST_CREDENTIALS.alice)
      await client.profile.dermo.$patch({ json: { skinTypes: ['peau-seche'] } }, withAuth(token))
      await client.profile.dermo.$patch(
        { json: { skinTypes: ['peau-grasse'] } },
        withAuth(tokenAlice)
      )
      const dermoToto = await expectOk(client.profile.dermo.$get({}, withAuth(token)))
      const dermoAlice = await expectOk(client.profile.dermo.$get({}, withAuth(tokenAlice)))
      expect(dermoToto?.skinTypes).toEqual(['peau-seche'])
      expect(dermoAlice?.skinTypes).toEqual(['peau-grasse'])
    })

    expectRequiresAuth(() => app, {
      method: 'PATCH',
      path: '/api/profile/dermo',
      body: { skinTypes: ['dry'] },
    })
  })
})

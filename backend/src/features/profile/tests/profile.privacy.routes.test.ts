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

describe('Privacy Settings Routes', () => {
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

  describe('GET /profile/privacy-settings', () => {
    it('returns default settings for a new user', async () => {
      const settings = await expectOk(client.profile['privacy-settings'].$get({}, withAuth(token)))

      expect(settings).toEqual({
        profilePublic: false,
        bioPublic: false,
        avatarPublic: false,
        linksPublic: false,
        skinTypesPublic: false,
        fitzpatrickPublic: false,
        skinConcernsPublic: false,
        discoverable: false,
        aiConsent: false,
      })
    })

    expectRequiresAuth(() => app, { method: 'GET', path: '/api/profile/privacy-settings' })

    it('returns distinct settings per user', async () => {
      const tokenAlice = await setupAndLogin(app, TEST_CREDENTIALS.alice)

      await client.profile['privacy-settings'].$patch(
        { json: { profilePublic: true } },
        withAuth(token)
      )

      const settingsToto = await expectOk(
        client.profile['privacy-settings'].$get({}, withAuth(token))
      )
      const settingsAlice = await expectOk(
        client.profile['privacy-settings'].$get({}, withAuth(tokenAlice))
      )

      expect(settingsToto.profilePublic).toBe(true)
      expect(settingsAlice.profilePublic).toBe(false)
    })
  })

  describe('PATCH /profile/privacy-settings', () => {
    it('updates profilePublic', async () => {
      const settings = await expectOk(
        client.profile['privacy-settings'].$patch(
          { json: { profilePublic: true } },
          withAuth(token)
        )
      )
      expect(settings.profilePublic).toBe(true)
    })

    it('updates aiConsent', async () => {
      const settings = await expectOk(
        client.profile['privacy-settings'].$patch({ json: { aiConsent: true } }, withAuth(token))
      )
      expect(settings.aiConsent).toBe(true)
    })

    it('persists changes across requests', async () => {
      await client.profile['privacy-settings'].$patch(
        { json: { profilePublic: true } },
        withAuth(token)
      )

      const settings = await expectOk(client.profile['privacy-settings'].$get({}, withAuth(token)))
      expect(settings.profilePublic).toBe(true)
    })

    it('updating one field does not affect the other', async () => {
      await client.profile['privacy-settings'].$patch(
        { json: { aiConsent: true } },
        withAuth(token)
      )

      // PATCH response itself must carry aiConsent: true (partial update must not reset it)
      const settings = await expectOk(
        client.profile['privacy-settings'].$patch(
          { json: { profilePublic: true } },
          withAuth(token)
        )
      )
      expect(settings.aiConsent).toBe(true)
      expect(settings.profilePublic).toBe(true)
    })

    it('rejects unknown fields (strict mode)', async () => {
      const res = await authPatch(app, '/api/profile/privacy-settings', token, {
        hackerField: true,
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('rejects non-boolean value', async () => {
      const res = await authPatch(app, '/api/profile/privacy-settings', token, {
        profilePublic: 'yes',
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    expectRequiresAuth(() => app, {
      method: 'PATCH',
      path: '/api/profile/privacy-settings',
      body: { profilePublic: true },
    })

    it('updates each profile-table sub-flag independently', async () => {
      const settings = await expectOk(
        client.profile['privacy-settings'].$patch(
          { json: { bioPublic: true, avatarPublic: true, linksPublic: true } },
          withAuth(token)
        )
      )
      expect(settings.bioPublic).toBe(true)
      expect(settings.avatarPublic).toBe(true)
      expect(settings.linksPublic).toBe(true)
      expect(settings.profilePublic).toBe(false)
    })

    it('updates dermo sub-flags even when dermo row does not exist yet', async () => {
      const settings = await expectOk(
        client.profile['privacy-settings'].$patch(
          {
            json: {
              skinTypesPublic: true,
              fitzpatrickPublic: true,
              skinConcernsPublic: true,
            },
          },
          withAuth(token)
        )
      )
      expect(settings.skinTypesPublic).toBe(true)
      expect(settings.fitzpatrickPublic).toBe(true)
      expect(settings.skinConcernsPublic).toBe(true)
    })

    it('updates all 9 flags in a single request', async () => {
      const settings = await expectOk(
        client.profile['privacy-settings'].$patch(
          {
            json: {
              profilePublic: true,
              bioPublic: true,
              avatarPublic: true,
              linksPublic: true,
              skinTypesPublic: true,
              fitzpatrickPublic: true,
              skinConcernsPublic: true,
              discoverable: true,
              aiConsent: true,
            },
          },
          withAuth(token)
        )
      )
      expect(settings).toEqual({
        profilePublic: true,
        bioPublic: true,
        avatarPublic: true,
        linksPublic: true,
        skinTypesPublic: true,
        fitzpatrickPublic: true,
        skinConcernsPublic: true,
        discoverable: true,
        aiConsent: true,
      })
    })

    // discoverable is opt-in matching consent. It persists like any dermo flag,
    // and a partial update of another flag must not reset it.
    it('opts in to discoverable without disturbing other flags', async () => {
      const optIn = await expectOk(
        client.profile['privacy-settings'].$patch({ json: { discoverable: true } }, withAuth(token))
      )
      expect(optIn.discoverable).toBe(true)
      expect(optIn.profilePublic).toBe(false)

      // A later unrelated PATCH must preserve the discoverable opt-in.
      const later = await expectOk(
        client.profile['privacy-settings'].$patch(
          { json: { profilePublic: true } },
          withAuth(token)
        )
      )
      expect(later.discoverable).toBe(true)
      expect(later.profilePublic).toBe(true)
    })
  })
})

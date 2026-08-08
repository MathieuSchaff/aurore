import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { setupDbTests } from '../../../tests/db-setup'
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

describe('Profile Links Routes', () => {
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

  it('should return empty links array for a new profile', async () => {
    const profile = await expectOk(client.profile.$get({}, withAuth(token)))
    expect(profile.links).toEqual([])
  })

  it('should save and return links', async () => {
    const links = [{ label: 'Instagram', url: 'https://instagram.com/test' }]
    const profile = await expectOk(client.profile.$patch({ json: { links } }, withAuth(token)))
    expect(profile.links).toEqual(links)
  })

  it('should persist links across requests', async () => {
    const links = [{ label: 'Blog', url: 'https://example.com' }]
    await client.profile.$patch({ json: { links } }, withAuth(token))
    const profile = await expectOk(client.profile.$get({}, withAuth(token)))
    expect(profile.links).toEqual(links)
  })

  it('should replace existing links on update', async () => {
    await client.profile.$patch(
      { json: { links: [{ label: 'Old', url: 'https://old.com' }] } },
      withAuth(token)
    )
    const profile = await expectOk(
      client.profile.$patch(
        { json: { links: [{ label: 'New', url: 'https://new.com' }] } },
        withAuth(token)
      )
    )
    expect(profile.links).toHaveLength(1)
    expect(profile.links?.[0]?.label).toBe('New')
  })

  it('should accept exactly 5 links', async () => {
    const links = Array.from({ length: 5 }, (_, i) => ({
      label: `Link ${i}`,
      url: `https://example.com/${i}`,
    }))
    const res = await client.profile.$patch({ json: { links } }, withAuth(token))
    expect(res.status).toBe(HTTP_STATUS.OK)
  })

  // Validator errors return 400; not in the typed response. Use raw helper.
  it('should reject 6 or more links', async () => {
    const links = Array.from({ length: 6 }, (_, i) => ({
      label: `Link ${i}`,
      url: `https://example.com/${i}`,
    }))
    const res = await authPatch(app, '/api/profile', token, { links })
    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
  })

  it('should reject a link with an invalid URL', async () => {
    const res = await authPatch(app, '/api/profile', token, {
      links: [{ label: 'Bad', url: 'not-a-url' }],
    })
    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
  })

  it('should reject a link with an empty label', async () => {
    const res = await authPatch(app, '/api/profile', token, {
      links: [{ label: '', url: 'https://example.com' }],
    })
    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
  })
})

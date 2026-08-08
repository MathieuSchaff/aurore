import { beforeAll, describe, expect, it } from 'bun:test'

import { HTTP_STATUS, type PublicProfileView } from '@aurore/shared'

import { setupDbTests } from '../../../tests/db-setup'
import { createTestApp } from '../../../tests/helpers/createTestApp'
import type { TestApp } from '../../../tests/helpers/createTestClient'
import { authPatch } from '../../../tests/helpers/route-test-helpers'
import { seedProfileOwner } from './profile-test.setup'

setupDbTests()

describe('GET /profiles/:username/public', () => {
  let app: TestApp

  beforeAll(async () => {
    app = await createTestApp()
  })

  it('returns 404 for an unknown username', async () => {
    const res = await app.request('/api/profiles/no-such-user/public')
    expect(res.status).toBe(HTTP_STATUS.NOT_FOUND)
  })

  it('returns 404 when the master profilePublic flag is off', async () => {
    await seedProfileOwner(app, 'matt-private')

    const res = await app.request('/api/profiles/matt-private/public')
    expect(res.status).toBe(HTTP_STATUS.NOT_FOUND)
  })

  it('returns username only when master is on and sub-flags are off', async () => {
    const token = await seedProfileOwner(app, 'matt-shy')
    await authPatch(app, '/api/profile/privacy-settings', token, { profilePublic: true })

    const res = await app.request('/api/profiles/matt-shy/public')
    expect(res.status).toBe(HTTP_STATUS.OK)
    const body = (await res.json()) as { success: true; data: PublicProfileView }
    expect(body.data).toEqual({
      username: 'matt-shy',
      bio: null,
      avatarUrl: null,
      links: null,
      skinTypes: null,
      fitzpatrickType: null,
      skinConcerns: null,
    })
  })

  it('returns every field when all flags are on', async () => {
    const token = await seedProfileOwner(app, 'matt-open')
    await authPatch(app, '/api/profile/privacy-settings', token, {
      profilePublic: true,
      bioPublic: true,
      avatarPublic: true,
      linksPublic: true,
      skinTypesPublic: true,
      fitzpatrickPublic: true,
      skinConcernsPublic: true,
    })

    const res = await app.request('/api/profiles/matt-open/public')
    expect(res.status).toBe(HTTP_STATUS.OK)
    const body = (await res.json()) as { success: true; data: PublicProfileView }
    expect(body.data).toEqual({
      username: 'matt-open',
      bio: 'My bio',
      avatarUrl: 'https://example.com/me.png',
      links: [{ label: 'IG', url: 'https://instagram.com/me' }],
      skinTypes: ['peau-mixte'],
      fitzpatrickType: 3,
      skinConcerns: ['rosacee'],
    })
  })

  it('rejects empty username param (zValidator)', async () => {
    const res = await app.request('/api/profiles/%20/public')
    // trim+min(1) gives 400 (zValidator default)
    expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
  })
})

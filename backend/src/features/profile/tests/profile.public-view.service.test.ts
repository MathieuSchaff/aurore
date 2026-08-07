import { beforeAll, describe, expect, it } from 'bun:test'

import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestApp } from '../../../tests/helpers/createTestApp'
import type { TestApp } from '../../../tests/helpers/createTestClient'
import { authPatch } from '../../../tests/helpers/route-test-helpers'
import { getPublicProfileByUsername } from '../service'
import { seedProfileOwner } from './profile-test.setup'

// Service-level matrix for getPublicProfileByUsername. Exercises RLS
// gate (master `profile_public`) and the per-field projection so we
// have proof the toggles actually mask data; there is no public HTTP
// route yet, this is the only consumer.

setupDbTests()

describe('getPublicProfileByUsername', () => {
  let app: TestApp

  beforeAll(async () => {
    app = await createTestApp()
  })

  it('returns null when master profilePublic is false', async () => {
    await seedProfileOwner(app, 'matt-private')

    const view = await getPublicProfileByUsername(testDb, 'matt-private')
    expect(view).toBeNull()
  })

  it('returns null for an unknown username', async () => {
    const view = await getPublicProfileByUsername(testDb, 'no-such-user')
    expect(view).toBeNull()
  })

  it('exposes only username when master is on and all sub-flags are off', async () => {
    const token = await seedProfileOwner(app, 'matt-shy')
    await authPatch(app, '/api/profile/privacy-settings', token, { profilePublic: true })

    const view = await getPublicProfileByUsername(testDb, 'matt-shy')
    expect(view).toEqual({
      username: 'matt-shy',
      bio: null,
      avatarUrl: null,
      links: null,
      skinTypes: null,
      fitzpatrickType: null,
      skinConcerns: null,
    })
  })

  it('exposes each profile field when its sub-flag is on', async () => {
    const token = await seedProfileOwner(app, 'matt-bio')
    await authPatch(app, '/api/profile/privacy-settings', token, {
      profilePublic: true,
      bioPublic: true,
      avatarPublic: true,
      linksPublic: true,
    })

    const view = await getPublicProfileByUsername(testDb, 'matt-bio')
    expect(view?.bio).toBe('My bio')
    expect(view?.avatarUrl).toBe('https://example.com/me.png')
    expect(view?.links).toEqual([{ label: 'IG', url: 'https://instagram.com/me' }])
    expect(view?.skinTypes).toBeNull()
    expect(view?.fitzpatrickType).toBeNull()
    expect(view?.skinConcerns).toBeNull()
  })

  it('exposes each dermo field when its sub-flag is on', async () => {
    const token = await seedProfileOwner(app, 'matt-skin')
    await authPatch(app, '/api/profile/privacy-settings', token, {
      profilePublic: true,
      skinTypesPublic: true,
      fitzpatrickPublic: true,
      skinConcernsPublic: true,
    })

    const view = await getPublicProfileByUsername(testDb, 'matt-skin')
    expect(view?.skinTypes).toEqual(['peau-mixte'])
    expect(view?.fitzpatrickType).toBe(3)
    expect(view?.skinConcerns).toEqual(['rosacee'])
    expect(view?.bio).toBeNull()
    expect(view?.avatarUrl).toBeNull()
    expect(view?.links).toBeNull()
  })

  it('exposes every field when all flags are on', async () => {
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

    const view = await getPublicProfileByUsername(testDb, 'matt-open')
    expect(view).toEqual({
      username: 'matt-open',
      bio: 'My bio',
      avatarUrl: 'https://example.com/me.png',
      links: [{ label: 'IG', url: 'https://instagram.com/me' }],
      skinTypes: ['peau-mixte'],
      fitzpatrickType: 3,
      skinConcerns: ['rosacee'],
    })
  })
})

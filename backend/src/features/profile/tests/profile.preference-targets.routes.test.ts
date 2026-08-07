import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS, type UserExport } from '@aurore/shared'

import { buildAliasIndex, lookupIngredient, MERGED_EVIDENCE_DB } from 'algo-derm/engine'

import { ingredients } from '../../../db/schema/ingredients/ingredients'
import { productTagTypes } from '../../../db/schema/tags/tags'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { expectRequiresAuth } from '../../../tests/helpers/authz-matrix'
import {
  createTestEnv,
  type TestApp,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectOk } from '../../../tests/helpers/expectStatus'
import { authGet, setupAndLogin } from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import { createTestUser } from '../../../tests/helpers/test-factories'

// Key resolved from the same alias index the linker uses, so the fixture
// stays valid across algo-derm vendor bumps.
const aliasIndex = buildAliasIndex(MERGED_EVIDENCE_DB)
const NIACINAMIDE_KEY = lookupIngredient('niacinamide', aliasIndex)?.inci ?? null
if (!NIACINAMIDE_KEY)
  throw new Error('algo-derm has no entry for niacinamide — check vendor tarball')

// Deliberately slash-carrying: locks the query-param (not path-param) DELETE contract.
const SLASH_KEY = 'Caprylic/Capric Triglyceride'

setupDbTests()

async function seedCatalogFixtures() {
  const owner = await createTestUser()
  await testDb.insert(ingredients).values([
    {
      createdBy: owner.id,
      name: 'Niacinamide',
      slug: 'niacinamide-pref-fixture',
      type: 'skincare',
      canonicalKey: NIACINAMIDE_KEY,
    },
    {
      createdBy: owner.id,
      name: 'Caprylic/Capric Triglyceride',
      slug: 'triglyceride-pref-fixture',
      type: 'skincare',
      canonicalKey: SLASH_KEY,
    },
  ])
  const [tag] = await testDb
    .insert(productTagTypes)
    .values({ slug: 'sans-parfum-fixture', label: 'Sans parfum', tagType: 'claim' })
    .returning({ id: productTagTypes.id })
  if (!tag) throw new Error('tag fixture insert failed')
  return { tagId: tag.id }
}

describe('Preference targets routes', () => {
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

  expectRequiresAuth(() => app, { method: 'GET', path: '/api/profile/preference-targets' })
  expectRequiresAuth(() => app, {
    method: 'PUT',
    path: '/api/profile/ingredient-preferences',
    body: { canonicalKey: 'Niacinamide', stance: 'require' },
  })
  expectRequiresAuth(() => app, {
    method: 'DELETE',
    path: '/api/profile/ingredient-preferences?key=Niacinamide',
  })
  expectRequiresAuth(() => app, {
    method: 'PUT',
    path: '/api/profile/tag-preferences',
    body: { tagId: '00000000-0000-7000-8000-000000000000', stance: 'exclude' },
  })
  expectRequiresAuth(() => app, {
    method: 'DELETE',
    path: `/api/profile/tag-preferences/${crypto.randomUUID()}`,
  })

  it('returns empty targets for a fresh user', async () => {
    const data = await expectOk(client.profile['preference-targets'].$get({}, withAuth(token)))

    expect(data).toEqual({ ingredients: [], tags: [] })
  })

  it('rejects an ingredient key the catalogue does not carry', async () => {
    const res = await client.profile['ingredient-preferences'].$put(
      { json: { canonicalKey: 'Substance Inconnue', stance: 'exclude' } },
      withAuth(token)
    )

    expect(res.status).toBe(HTTP_STATUS.NOT_FOUND)
  })

  it('upserts an ingredient preference, then flips its stance in place', async () => {
    await seedCatalogFixtures()

    const put = await client.profile['ingredient-preferences'].$put(
      { json: { canonicalKey: NIACINAMIDE_KEY, stance: 'require' } },
      withAuth(token)
    )
    expect(put.status).toBe(HTTP_STATUS.OK)

    const flip = await client.profile['ingredient-preferences'].$put(
      { json: { canonicalKey: NIACINAMIDE_KEY, stance: 'exclude' } },
      withAuth(token)
    )
    expect(flip.status).toBe(HTTP_STATUS.OK)

    const targets = await expectOk(client.profile['preference-targets'].$get({}, withAuth(token)))
    expect(targets.ingredients).toHaveLength(1)
    expect(targets.ingredients[0]?.canonicalKey).toBe(NIACINAMIDE_KEY)
    expect(targets.ingredients[0]?.stance).toBe('exclude')
    // The recap displays the catalogue name, not the raw canonical key.
    expect(targets.ingredients[0]?.name).toBe('Niacinamide')
  })

  it('deletes an ingredient preference through the query param, slashes included', async () => {
    await seedCatalogFixtures()

    await client.profile['ingredient-preferences'].$put(
      { json: { canonicalKey: SLASH_KEY, stance: 'exclude' } },
      withAuth(token)
    )

    const del = await client.profile['ingredient-preferences'].$delete(
      { query: { key: SLASH_KEY } },
      withAuth(token)
    )
    expect(del.status).toBe(204)

    const targets = await expectOk(client.profile['preference-targets'].$get({}, withAuth(token)))
    expect(targets.ingredients).toEqual([])
  })

  it('upserts and deletes a tag preference, labels joined from the taxonomy', async () => {
    const { tagId } = await seedCatalogFixtures()

    const unknown = await client.profile['tag-preferences'].$put(
      { json: { tagId: '00000000-0000-7000-8000-000000000000', stance: 'exclude' } },
      withAuth(token)
    )
    expect(unknown.status).toBe(HTTP_STATUS.NOT_FOUND)

    const saved = await expectOk(
      client.profile['tag-preferences'].$put(
        { json: { tagId, stance: 'exclude' } },
        withAuth(token)
      )
    )
    expect(saved.slug).toBe('sans-parfum-fixture')
    expect(saved.label).toBe('Sans parfum')

    const del = await client.profile['tag-preferences'][':tagId'].$delete(
      { param: { tagId } },
      withAuth(token)
    )
    expect(del.status).toBe(204)

    const targets = await expectOk(client.profile['preference-targets'].$get({}, withAuth(token)))
    expect(targets.tags).toEqual([])
  })

  it('scopes targets to the requesting user', async () => {
    await seedCatalogFixtures()
    const tokenAlice = await setupAndLogin(app, TEST_CREDENTIALS.alice)

    await client.profile['ingredient-preferences'].$put(
      { json: { canonicalKey: NIACINAMIDE_KEY, stance: 'exclude' } },
      withAuth(token)
    )

    const targets = await expectOk(
      client.profile['preference-targets'].$get({}, withAuth(tokenAlice))
    )
    expect(targets.ingredients).toEqual([])
  })

  it('ships preferences in the RGPD export', async () => {
    await seedCatalogFixtures()

    await client.profile['ingredient-preferences'].$put(
      { json: { canonicalKey: NIACINAMIDE_KEY, stance: 'require' } },
      withAuth(token)
    )

    const res = await authGet(app, '/api/profile/export', token)
    expect(res.status).toBe(HTTP_STATUS.OK)
    const dump = (await res.json()) as UserExport
    expect(dump.ingredientPreferences).toHaveLength(1)
    expect(dump.ingredientPreferences[0]?.canonicalKey).toBe(NIACINAMIDE_KEY)
    expect(dump.ingredientPreferences[0]?.stance).toBe('require')
    expect(dump.tagPreferences).toEqual([])
  })
})

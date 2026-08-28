import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import type { CreateIngredientInput } from '@aurore/shared'
import { HTTP_STATUS } from '@aurore/shared'

import { setupDbTests } from '../../../tests/db-setup'
import { expectRequiresAuth } from '../../../tests/helpers/authz-matrix'
import {
  createTestEnv,
  type TestApp,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectError, expectOk, expectStatus } from '../../../tests/helpers/expectStatus'
import {
  setupAndLogin,
  setupAndLoginAdmin,
  setupAndLoginContributor,
} from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'

const VALID_INGREDIENT = { name: 'Rétinol', type: 'skincare' } as const

setupDbTests()

describe('Ingredient Routes', () => {
  let app: TestApp
  let client: TestClient
  // Catalog record routes require contributor+ since the catalog-authz work;
  // record CRUD here runs as a contributor, deletes still require admin.
  let contributorToken: string

  beforeAll(async () => {
    ;({ app, client } = await createTestEnv())
  })

  beforeEach(async () => {
    contributorToken = await setupAndLoginContributor(app, TEST_CREDENTIALS.contributor)
  })

  // Setup only: tests whose subject is the POST itself call the route directly.
  async function createIngredient(
    overrides: Partial<CreateIngredientInput> & Pick<CreateIngredientInput, 'name'>
  ) {
    return expectOk(
      client.ingredients.$post(
        { json: { type: 'skincare', ...overrides } },
        withAuth(contributorToken)
      ),
      HTTP_STATUS.CREATED
    )
  }

  describe('POST /ingredients', () => {
    it('should create an ingredient with only a name', async () => {
      const ingredient = await expectOk(
        client.ingredients.$post({ json: VALID_INGREDIENT }, withAuth(contributorToken)),
        HTTP_STATUS.CREATED
      )
      expect(ingredient.id).toBeDefined()
      expect(ingredient.name).toBe('Rétinol')
      expect(ingredient.slug).toBe('retinol')
      expect(ingredient.description).toBe('')
      expect(ingredient.content).toBe('')
      expect(ingredient.category).toBeNull()
    })

    it('should create an ingredient with all optional fields', async () => {
      const ingredient = await expectOk(
        client.ingredients.$post(
          {
            json: {
              name: 'Acide Ascorbique',
              type: 'skincare',
              description: 'Forme pure de la vitamine C',
              content: '## Description\n\nActif antioxydant.',
              category: 'humectant',
            },
          },
          withAuth(contributorToken)
        ),
        HTTP_STATUS.CREATED
      )
      expect(ingredient.description).toBe('Forme pure de la vitamine C')
      expect(ingredient.content).toBe('## Description\n\nActif antioxydant.')
      expect(ingredient.category).toBe('humectant')
    })

    it('should auto-generate slug from name', async () => {
      const ingredient = await expectOk(
        client.ingredients.$post(
          { json: { name: 'Acide Hyaluronique', type: 'skincare' } },
          withAuth(contributorToken)
        ),
        HTTP_STATUS.CREATED
      )
      expect(ingredient.slug).toBe('acide-hyaluronique')
    })

    it('should use custom slug when provided by admin', async () => {
      // Custom slug requires the DB role to be admin; the JWT role must also be
      // admin to clear requireCatalogWrite, so log in as an admin from the start.
      const adminToken = await setupAndLoginAdmin(app, TEST_CREDENTIALS.admin)

      const ingredient = await expectOk(
        client.ingredients.$post(
          { json: { name: 'Niacinamide', type: 'skincare', slug: 'niacin' } },
          withAuth(adminToken)
        ),
        HTTP_STATUS.CREATED
      )
      expect(ingredient.slug).toBe('niacin')
    })

    it('should NOT use custom slug when provided by non-admin', async () => {
      const ingredient = await expectOk(
        client.ingredients.$post(
          { json: { name: 'Niacinamide', type: 'skincare', slug: 'niacin' } },
          withAuth(contributorToken)
        ),
        HTTP_STATUS.CREATED
      )
      expect(ingredient.slug).toBe('niacinamide')
    })

    it('should return 409 for duplicate slug (admin)', async () => {
      // Duplicate-slug guard only triggers for admins (only they set slugs);
      // log in as admin so the JWT clears requireCatalogWrite too.
      const adminToken = await setupAndLoginAdmin(app, TEST_CREDENTIALS.admin)

      await expectOk(
        client.ingredients.$post(
          { json: { name: 'Magnésium', type: 'skincare', slug: 'magnesium' } },
          withAuth(adminToken)
        ),
        HTTP_STATUS.CREATED
      )
      const res = await client.ingredients.$post(
        { json: { name: 'Magnésium Bis', type: 'skincare', slug: 'magnesium' } },
        withAuth(adminToken)
      )

      await expectError(res, HTTP_STATUS.CONFLICT, 'ingredient_already_exists')
    })

    it('should reject missing name', async () => {
      const res = await client.ingredients.$post(
        // @ts-expect-error missing required name, testing schema rejection
        { json: { description: 'orphan' } },
        withAuth(contributorToken)
      )

      expectStatus(res, HTTP_STATUS.BAD_REQUEST)
    })

    expectRequiresAuth(() => app, {
      method: 'POST',
      path: '/api/ingredients',
      body: VALID_INGREDIENT,
    })

    it('should reject invalid slug formats and malicious strings', async () => {
      const badSlugs = [
        'UPPERCASE',
        'with spaces',
        'multiple--hyphens',
        'trailing-hyphen-',
        '-leading-hyphen',
        'dot.in.slug',
        'under_score',

        'hello@world',
        'price$100',
        'tag#navigation',
        'search?q=test',
        'percent%20encoded',
        'back\\slash',
        'forward/slash',
        'pipe|line',
        'star*asterisk',

        '<script>alert(1)</script>',
        'javascript:alert(1)',
        '<img src=x onerror=alert(1)>',
        '"><script>confirm(1)</script>',

        "' OR '1'='1",
        "'; DROP TABLE ingredients; --",
        '1; SELECT * FROM users',
        'admin --',

        '../../etc/passwd',
        'C:\\Windows\\System32',
        '/root',
        '~/.ssh/id_rsa',

        'a'.repeat(101),
      ]

      for (const slug of badSlugs) {
        const res = await client.ingredients.$post(
          { json: { name: 'Security Test', type: 'skincare', slug } },
          withAuth(contributorToken)
        )
        expectStatus(res, HTTP_STATUS.BAD_REQUEST)
      }
    })
  })

  describe('role enforcement (records)', () => {
    it('201 for a plain user on POST /ingredients (guard swap: requireCatalogWrite removed)', async () => {
      const userToken = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const res = await client.ingredients.$post({ json: VALID_INGREDIENT }, withAuth(userToken))
      expectStatus(res, HTTP_STATUS.CREATED)
    })

    it('201 for a contributor on POST /ingredients', async () => {
      const res = await client.ingredients.$post(
        { json: VALID_INGREDIENT },
        withAuth(contributorToken)
      )
      expectStatus(res, HTTP_STATUS.CREATED)
    })
  })

  describe('GET /ingredients/:slug', () => {
    it('should return the ingredient by slug without auth', async () => {
      const created = await createIngredient(VALID_INGREDIENT)

      const fetched = await expectOk(
        client.ingredients[':slug'].$get({ param: { slug: created.slug } })
      )
      expect(fetched.id).toBe(created.id)
      expect(fetched.slug).toBe(created.slug)
      expect(fetched.name).toBe('Rétinol')
    })

    it('should also work when authenticated', async () => {
      const created = await createIngredient(VALID_INGREDIENT)

      const fetched = await expectOk(
        client.ingredients[':slug'].$get(
          { param: { slug: created.slug } },
          withAuth(contributorToken)
        )
      )
      expect(fetched.id).toBe(created.id)
    })

    it('should return 404 for unknown slug', async () => {
      const res = await client.ingredients[':slug'].$get({ param: { slug: 'slug-inexistant' } })

      await expectError(res, HTTP_STATUS.NOT_FOUND, 'ingredient_not_found')
    })
  })

  describe('GET /ingredients/by-slugs', () => {
    it('returns name+slug for known slugs and skips unknown ones', async () => {
      const niac = await createIngredient({ name: 'Niacinamide' })
      const retinol = await createIngredient({ name: 'Rétinol' })

      const results = await expectOk(
        client.ingredients['by-slugs'].$get({
          query: { slugs: `${niac.slug},${retinol.slug},nope` },
        })
      )
      const slugs = results.map((d) => d.slug).sort()
      expect(slugs).toEqual([niac.slug, retinol.slug].sort())
    })

    it('returns an empty list when slugs is comma-only', async () => {
      const results = await expectOk(
        client.ingredients['by-slugs'].$get({ query: { slugs: ',,,' } })
      )
      expect(results).toEqual([])
    })

    it('rejects when slugs param is missing', async () => {
      const res = await client.ingredients['by-slugs'].$get({
        // @ts-expect-error missing required slugs, testing schema rejection
        query: {},
      })
      expectStatus(res, HTTP_STATUS.BAD_REQUEST)
    })
  })

  describe('PATCH /ingredients/:id', () => {
    it('should update ingredient fields', async () => {
      const created = await createIngredient(VALID_INGREDIENT)

      const updated = await expectOk(
        client.ingredients[':id'].$patch(
          {
            param: { id: created.id },
            json: { description: 'Alternative naturelle au rétinol', category: 'actif' },
          },
          withAuth(contributorToken)
        )
      )
      expect(updated.description).toBe('Alternative naturelle au rétinol')
      expect(updated.category).toBe('actif')
      expect(updated.name).toBe('Rétinol')
    })

    it('should not affect untouched fields', async () => {
      const created = await createIngredient({ ...VALID_INGREDIENT, content: 'Contenu initial' })

      await client.ingredients[':id'].$patch(
        { param: { id: created.id }, json: { category: 'actif' } },
        withAuth(contributorToken)
      )

      const fetched = await expectOk(
        client.ingredients[':slug'].$get({ param: { slug: created.slug } })
      )
      expect(fetched.content).toBe('Contenu initial')
    })

    it('should persist updates across requests', async () => {
      const created = await createIngredient(VALID_INGREDIENT)

      await client.ingredients[':id'].$patch(
        { param: { id: created.id }, json: { description: 'Description persistée' } },
        withAuth(contributorToken)
      )

      const fetched = await expectOk(
        client.ingredients[':slug'].$get({ param: { slug: created.slug } })
      )
      expect(fetched.description).toBe('Description persistée')
    })

    it('keeps the slug stable when the name changes (slug immutable)', async () => {
      const created = await createIngredient({ name: 'Vitamine E' })

      const updated = await expectOk(
        client.ingredients[':id'].$patch(
          { param: { id: created.id }, json: { name: 'Vitamine E Tocopherol' } },
          withAuth(contributorToken)
        )
      )
      expect(updated.name).toBe('Vitamine E Tocopherol')
      expect(updated.slug).toBe('vitamine-e')
    })

    it('should return 404 for unknown id', async () => {
      const fakeId = crypto.randomUUID()

      const res = await client.ingredients[':id'].$patch(
        { param: { id: fakeId }, json: { description: 'X' } },
        withAuth(contributorToken)
      )

      await expectError(res, HTTP_STATUS.NOT_FOUND, 'ingredient_not_found')
    })

    it('should reject unknown fields (strict schema)', async () => {
      const created = await createIngredient(VALID_INGREDIENT)

      const res = await client.ingredients[':id'].$patch(
        // @ts-expect-error hackerField rejected by strict schema
        { param: { id: created.id }, json: { hackerField: 'oops' } },
        withAuth(contributorToken)
      )

      expectStatus(res, HTTP_STATUS.BAD_REQUEST)
    })

    expectRequiresAuth(() => app, {
      method: 'PATCH',
      path: `/api/ingredients/${crypto.randomUUID()}`,
      body: { description: 'X' },
    })
  })

  describe('DELETE /ingredients/:id', () => {
    it('should delete the ingredient and return null data', async () => {
      const adminToken = await setupAndLoginAdmin(app, TEST_CREDENTIALS.admin)
      const created = await createIngredient(VALID_INGREDIENT)

      const res = await client.ingredients[':id'].$delete(
        { param: { id: created.id } },
        withAuth(adminToken)
      )

      expectStatus(res, 204)
    })

    it('should make the ingredient unreachable by slug after deletion', async () => {
      const adminToken = await setupAndLoginAdmin(app, TEST_CREDENTIALS.admin)
      const created = await createIngredient(VALID_INGREDIENT)

      await client.ingredients[':id'].$delete({ param: { id: created.id } }, withAuth(adminToken))

      const res = await client.ingredients[':slug'].$get({ param: { slug: created.slug } })
      expectStatus(res, HTTP_STATUS.NOT_FOUND)
    })

    it('should not affect other ingredients when deleting one', async () => {
      const adminToken = await setupAndLoginAdmin(app, TEST_CREDENTIALS.admin)
      const i1 = await createIngredient(VALID_INGREDIENT)
      const i2 = await createIngredient({ name: 'Niacinamide' })

      await client.ingredients[':id'].$delete({ param: { id: i1.id } }, withAuth(adminToken))

      const res = await client.ingredients[':slug'].$get({ param: { slug: i2.slug } })
      expectStatus(res, HTTP_STATUS.OK)
    })

    it('should return 403 for a contributor (admin-only DELETE, route guard)', async () => {
      // requireAdmin on the DELETE route blocks a contributor with 'forbidden'
      // before the handler; the service unauthorized_access check is the backstop.
      const created = await createIngredient(VALID_INGREDIENT)

      const res = await client.ingredients[':id'].$delete(
        { param: { id: created.id } },
        withAuth(contributorToken)
      )

      await expectError(res, HTTP_STATUS.FORBIDDEN, 'forbidden')
    })

    it('should return 500 for unknown id (ingredient_delete_failed)', async () => {
      const adminToken = await setupAndLoginAdmin(app, TEST_CREDENTIALS.admin)
      const fakeId = crypto.randomUUID()

      const res = await client.ingredients[':id'].$delete(
        { param: { id: fakeId } },
        withAuth(adminToken)
      )

      await expectError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'ingredient_delete_failed')
    })

    expectRequiresAuth(() => app, {
      method: 'DELETE',
      path: `/api/ingredients/${crypto.randomUUID()}`,
    })
  })

  describe('GET /ingredients/:slug/edits', () => {
    const listEdits = (slug: string) =>
      expectOk(client.ingredients[':slug'].edits.$get({ param: { slug } }))

    const patch = (id: string, json: { description?: string; content?: string; name?: string }) =>
      client.ingredients[':id'].$patch({ param: { id }, json }, withAuth(contributorToken))

    it('should return an empty list for a new ingredient', async () => {
      const created = await createIngredient(VALID_INGREDIENT)

      expect(await listEdits(created.slug)).toEqual([])
    })

    it('should return edits after an update without auth', async () => {
      const created = await createIngredient(VALID_INGREDIENT)

      await patch(created.id, { description: 'Première description' })

      const edits = await listEdits(created.slug)
      expect(edits).toHaveLength(1)
      expect(edits[0]?.ingredientId).toBe(created.id)
      expect(edits[0]?.changes).toHaveProperty('description')
    })

    it('should return edits newest first', async () => {
      const created = await createIngredient(VALID_INGREDIENT)

      await patch(created.id, { description: 'Première description' })
      await patch(created.id, { content: 'Deuxième modification' })

      const edits = await listEdits(created.slug)
      expect(edits).toHaveLength(2)
      expect(edits[0]?.changes).toHaveProperty('content')
      expect(edits[1]?.changes).toHaveProperty('description')
    })

    it('should return 404 for unknown slug', async () => {
      const res = await client.ingredients[':slug'].edits.$get({
        param: { slug: 'slug-inexistant' },
      })

      expectStatus(res, HTTP_STATUS.NOT_FOUND)
    })

    it('should not return edits from other ingredients', async () => {
      const i1 = await createIngredient(VALID_INGREDIENT)
      const i2 = await createIngredient({ name: 'Niacinamide' })

      await patch(i1.id, { description: 'Edit sur i1' })

      expect(await listEdits(i2.slug)).toHaveLength(0)
    })

    it('should record old and new values in changes', async () => {
      const created = await createIngredient({
        name: 'Rétinol',
        description: 'Ancienne description',
      })

      await patch(created.id, { description: 'Nouvelle description' })

      const edits = await listEdits(created.slug)
      const change = edits[0]?.changes.description
      expect(change?.old).toBe('Ancienne description')
      expect(change?.new).toBe('Nouvelle description')
    })

    it('should not create an edit when values are unchanged', async () => {
      const created = await createIngredient({
        name: 'Rétinol',
        description: 'Description inchangée',
      })

      await patch(created.id, { description: 'Description inchangée' })

      expect(await listEdits(created.slug)).toHaveLength(0)
    })

    it('should not track slug in edits when name changes', async () => {
      const created = await createIngredient({ name: 'Vitamine C' })

      const updated = await expectOk(patch(created.id, { name: 'Vitamine C Pure' }))

      const edits = await listEdits(updated.slug)
      expect(edits).toHaveLength(1)
      expect(edits[0]?.changes).toHaveProperty('name')
      expect(edits[0]?.changes).not.toHaveProperty('slug')
    })

    it('should record editedBy with the authenticated user id', async () => {
      const profile = await expectOk(client.profile.$get({}, withAuth(contributorToken)))
      const created = await createIngredient(VALID_INGREDIENT)

      await patch(created.id, { description: 'Edit tracée' })

      const edits = await listEdits(created.slug)
      expect(edits[0]?.editedBy).toBe(profile.userId)
    })
  })
})

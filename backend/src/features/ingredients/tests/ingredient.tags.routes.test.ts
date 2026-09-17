import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { createIngredientTag } from '../../../features/ingredient-tags/service'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { expectRequiresAuth, expectRoleMatrix } from '../../../tests/helpers/authz-matrix'
import {
  createTestEnv,
  type TestApp,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectError, expectOk, expectStatus } from '../../../tests/helpers/expectStatus'
import {
  setupAndLoginAdmin,
  setupAndLoginContributor,
} from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'

// Ingredient↔tag links FK to `ingredient_tags`, not `product_tags_defs`.
// Insert directly via service since the HTTP route requires admin and tests
// need the tag as a fixture, not to assert creation behaviour.
async function createTag(name = 'Anti-âge') {
  const tag = await testDb.transaction((tx) => createIngredientTag(tx, { label: name }))
  return { id: tag.id, slug: tag.slug }
}

setupDbTests()

describe('Ingredient Tag Routes', () => {
  let app: TestApp
  let client: TestClient
  // Ingredient fixtures now require contributor+ (catalog-authz); the
  // ingredient↔tag link routes under test remain admin-only.
  let contributorToken: string
  let adminToken: string

  beforeAll(async () => {
    ;({ app, client } = await createTestEnv())
  })

  beforeEach(async () => {
    contributorToken = await setupAndLoginContributor(app, TEST_CREDENTIALS.contributor)
    adminToken = await setupAndLoginAdmin(app, TEST_CREDENTIALS.admin)
  })

  // Fixture only: the ingredient is support, never the subject of these tests.
  async function createIngredient(name = 'Rétinol') {
    return expectOk(
      client.ingredients.$post({ json: { name, type: 'skincare' } }, withAuth(contributorToken)),
      HTTP_STATUS.CREATED
    )
  }

  const linkTag = (ingredientId: string, tagId: string) =>
    client.ingredients[':ingredientId'].tags.$post(
      { param: { ingredientId }, json: { tagId } },
      withAuth(adminToken)
    )

  const listTags = (ingredientId: string) =>
    client.ingredients[':ingredientId'].tags.$get({ param: { ingredientId } })

  describe('GET /ingredients/:ingredientId/tags', () => {
    it('should return empty list when no tags linked', async () => {
      const ingredient = await createIngredient()

      const tags = await expectOk(listTags(ingredient.id))
      expect(tags).toEqual([])
    })

    it('should return tags after adding one', async () => {
      const ingredient = await createIngredient()
      const tag = await createTag()

      await linkTag(ingredient.id, tag.id)

      const tags = await expectOk(listTags(ingredient.id))
      expect(tags).toHaveLength(1)
    })

    it('should not require authentication', async () => {
      const ingredient = await createIngredient()

      const res = await listTags(ingredient.id)
      expectStatus(res, HTTP_STATUS.OK)
    })

    it('should reject invalid ingredientId (non-UUID)', async () => {
      const res = await listTags('not-a-uuid')
      expectStatus(res, HTTP_STATUS.BAD_REQUEST)
    })
  })

  describe('POST /ingredients/:ingredientId/tags', () => {
    it('should add a tag to an ingredient', async () => {
      const ingredient = await createIngredient()
      const tag = await createTag()

      const added = await expectOk(linkTag(ingredient.id, tag.id), HTTP_STATUS.CREATED)
      expect(added.ingredientTagId).toBe(tag.id)
      expect(added.ingredientId).toBe(ingredient.id)
    })

    it('should reject duplicate tag link', async () => {
      const ingredient = await createIngredient()
      const tag = await createTag()

      await linkTag(ingredient.id, tag.id)
      const res = await linkTag(ingredient.id, tag.id)

      expectStatus(res, HTTP_STATUS.CONFLICT)
    })

    it('should reject invalid tagId (non-UUID)', async () => {
      const ingredient = await createIngredient()

      const res = await linkTag(ingredient.id, 'not-a-uuid')

      expectStatus(res, HTTP_STATUS.BAD_REQUEST)
    })

    expectRequiresAuth(() => app, {
      method: 'POST',
      path: `/api/ingredients/${crypto.randomUUID()}/tags`,
      body: { tagId: crypto.randomUUID() },
    })

    describe('role enforcement', () => {
      expectRoleMatrix(
        () => app,
        async () => {
          const ingredient = await createIngredient()
          const tag = await createTag()
          return {
            method: 'POST',
            path: `/api/ingredients/${ingredient.id}/tags`,
            body: { tagId: tag.id },
          }
        },
        {
          user: HTTP_STATUS.FORBIDDEN,
          contributor: HTTP_STATUS.FORBIDDEN,
          admin: HTTP_STATUS.CREATED,
        }
      )
    })
  })

  describe('DELETE /ingredients/:ingredientId/tags/:tagId', () => {
    const unlinkTag = (ingredientId: string, tagId: string) =>
      client.ingredients[':ingredientId'].tags[':tagId'].$delete(
        { param: { ingredientId, tagId } },
        withAuth(adminToken)
      )

    it('should remove a tag from an ingredient', async () => {
      const ingredient = await createIngredient()
      const tag = await createTag()

      await linkTag(ingredient.id, tag.id)
      const res = await unlinkTag(ingredient.id, tag.id)

      expectStatus(res, HTTP_STATUS.NO_CONTENT)
    })

    it('should no longer appear in list after removal', async () => {
      const ingredient = await createIngredient()
      const tag = await createTag()

      await linkTag(ingredient.id, tag.id)
      await unlinkTag(ingredient.id, tag.id)

      const tags = await expectOk(listTags(ingredient.id))
      expect(tags).toEqual([])
    })

    expectRequiresAuth(() => app, {
      method: 'DELETE',
      path: `/api/ingredients/${crypto.randomUUID()}/tags/${crypto.randomUUID()}`,
    })
  })

  describe('PUT /ingredients/:ingredientId/tags', () => {
    const replaceTags = (
      ingredientId: string,
      expectedUpdatedAt: string,
      tags: Array<{ tagId: string }>
    ) =>
      app.request(`/api/ingredients/${ingredientId}/tags`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expectedUpdatedAt, tags }),
      })

    it('rejects a tag replacement based on a stale ingredient version', async () => {
      const ingredient = await createIngredient()
      const firstTag = await createTag('Premier')
      const secondTag = await createTag('Second')

      await expectOk(replaceTags(ingredient.id, ingredient.updatedAt, [{ tagId: firstTag.id }]))
      await expectError(
        replaceTags(ingredient.id, ingredient.updatedAt, [{ tagId: secondTag.id }]),
        HTTP_STATUS.CONFLICT,
        'ingredient_update_conflict'
      )

      const tags = await expectOk(listTags(ingredient.id))
      expect(tags.map((tag) => tag.ingredientTagId)).toEqual([firstTag.id])
    })

    it('should replace all tags for an ingredient', async () => {
      const ingredient = await createIngredient()
      const tag1 = await createTag('Tag 1')
      const tag2 = await createTag('Tag 2')

      await linkTag(ingredient.id, tag1.id)
      const tags = await expectOk(
        client.ingredients[':ingredientId'].tags.$put(
          {
            param: { ingredientId: ingredient.id },
            json: { expectedUpdatedAt: ingredient.updatedAt, tags: [{ tagId: tag2.id }] },
          },
          withAuth(adminToken)
        )
      )
      expect(tags).toHaveLength(1)
      expect(tags[0]?.ingredientTagId).toBe(tag2.id)
    })

    it('should clear all tags when tagIds is empty', async () => {
      const ingredient = await createIngredient()
      const tag = await createTag()

      await linkTag(ingredient.id, tag.id)
      const tags = await expectOk(
        client.ingredients[':ingredientId'].tags.$put(
          {
            param: { ingredientId: ingredient.id },
            json: { expectedUpdatedAt: ingredient.updatedAt, tags: [] },
          },
          withAuth(adminToken)
        )
      )
      expect(tags).toEqual([])
    })

    expectRequiresAuth(() => app, {
      method: 'PUT',
      path: `/api/ingredients/${crypto.randomUUID()}/tags`,
      body: { tagIds: [] },
    })
  })
})

import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import type { CreateTagInput } from '@aurore/shared'
import { HTTP_STATUS } from '@aurore/shared'

import { setupDbTests } from '../../../tests/db-setup'
import { expectRequiresAuth, expectRoleMatrix } from '../../../tests/helpers/authz-matrix'
import {
  createTestEnv,
  type TestApp,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectOk, expectStatus } from '../../../tests/helpers/expectStatus'
import { setupAndLoginAdmin } from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'

type ApiErrorBody = { success: false; error: string }
const VALID_TAG = { label: 'Anti-âge' }

setupDbTests()

describe('Product Tag Routes', () => {
  let app: TestApp
  let client: TestClient
  let adminToken: string

  beforeAll(async () => {
    ;({ app, client } = await createTestEnv())
  })

  beforeEach(async () => {
    adminToken = await setupAndLoginAdmin(app, TEST_CREDENTIALS.admin)
  })

  // Setup-only: tests whose subject is the POST itself call the route directly.
  async function createTag(overrides: Partial<CreateTagInput> = {}) {
    return expectOk(
      client['product-tags'].$post({ json: { ...VALID_TAG, ...overrides } }, withAuth(adminToken)),
      HTTP_STATUS.CREATED
    )
  }

  describe('POST /product-tags', () => {
    it('should create a tag with only a name', async () => {
      const tag = await expectOk(
        client['product-tags'].$post({ json: VALID_TAG }, withAuth(adminToken)),
        HTTP_STATUS.CREATED
      )
      expect(tag.id).toBeDefined()
      expect(tag.label).toBe('Anti-âge')
      expect(tag.slug).toBe('anti-age')
      expect(tag.tagType).toBe('')
    })

    it('should create a tag with a category', async () => {
      const tag = await expectOk(
        client['product-tags'].$post(
          { json: { label: 'Peau grasse', tagType: 'skin_type' } },
          withAuth(adminToken)
        ),
        HTTP_STATUS.CREATED
      )
      expect(tag.label).toBe('Peau grasse')
      expect(tag.tagType).toBe('skin_type')
    })

    it('should auto-generate slug from name', async () => {
      const tag = await expectOk(
        client['product-tags'].$post({ json: { label: 'Rides et Ridules' } }, withAuth(adminToken)),
        HTTP_STATUS.CREATED
      )

      expect(tag.slug).toBe('rides-et-ridules')
    })

    it('should use custom slug when provided', async () => {
      const tag = await expectOk(
        client['product-tags'].$post(
          { json: { label: 'Éclat', slug: 'eclat-custom' } },
          withAuth(adminToken)
        ),
        HTTP_STATUS.CREATED
      )

      expect(tag.slug).toBe('eclat-custom')
    })

    it('should store a createdAt timestamp', async () => {
      const tag = await expectOk(
        client['product-tags'].$post({ json: VALID_TAG }, withAuth(adminToken)),
        HTTP_STATUS.CREATED
      )

      expect(tag.createdAt).toBeDefined()
    })

    it('should return 409 for duplicate slug', async () => {
      await createTag({ label: 'Acné', slug: 'acne' })

      const res = await client['product-tags'].$post(
        { json: { label: 'Acné Bis', slug: 'acne' } },
        withAuth(adminToken)
      )

      expectStatus(res, HTTP_STATUS.CONFLICT)
      const body = (await res.json()) as unknown as ApiErrorBody
      expect(body.success).toBe(false)
      expect(body.error).toBe('tag_already_exists')
    })

    it('should reject missing label', async () => {
      const res = await client['product-tags'].$post(
        // @ts-expect-error: missing required label, testing schema rejection
        { json: { tagType: 'skin_type' } },
        withAuth(adminToken)
      )

      expectStatus(res, HTTP_STATUS.BAD_REQUEST)
    })

    expectRequiresAuth(() => app, { method: 'POST', path: '/api/product-tags', body: VALID_TAG })

    describe('role enforcement', () => {
      expectRoleMatrix(
        () => app,
        { method: 'POST', path: '/api/product-tags', body: { label: 'X', tagType: 'concern' } },
        {
          user: HTTP_STATUS.FORBIDDEN,
          contributor: HTTP_STATUS.FORBIDDEN,
          admin: HTTP_STATUS.CREATED,
        }
      )
    })
  })

  describe('GET /product-tags/:id', () => {
    it('should return the tag without auth', async () => {
      const created = await createTag()

      const tag = await expectOk(client['product-tags'][':id'].$get({ param: { id: created.id } }))
      expect(tag.id).toBe(created.id)
      expect(tag.label).toBe('Anti-âge')
    })

    it('should also work when authenticated', async () => {
      const created = await createTag()

      const tag = await expectOk(
        client['product-tags'][':id'].$get({ param: { id: created.id } }, withAuth(adminToken))
      )
      expect(tag.id).toBe(created.id)
    })

    it('should return 404 for unknown id', async () => {
      const res = await client['product-tags'][':id'].$get({
        param: { id: crypto.randomUUID() },
      })

      expectStatus(res, HTTP_STATUS.NOT_FOUND)
      const body = (await res.json()) as unknown as ApiErrorBody
      expect(body.success).toBe(false)
      expect(body.error).toBe('tag_not_found')
    })

    it('should return 400 for an invalid UUID', async () => {
      const res = await client['product-tags'][':id'].$get({ param: { id: 'not-a-uuid' } })

      expectStatus(res, HTTP_STATUS.BAD_REQUEST)
    })
  })

  describe('PATCH /product-tags/:id', () => {
    it('should update tag fields', async () => {
      const created = await createTag({ label: 'Rides' })

      const tag = await expectOk(
        client['product-tags'][':id'].$patch(
          { param: { id: created.id }, json: { label: 'Rides et Ridules', tagType: 'concern' } },
          withAuth(adminToken)
        )
      )
      expect(tag.label).toBe('Rides et Ridules')
      expect(tag.tagType).toBe('concern')
    })

    it('should persist updates across requests', async () => {
      const created = await createTag()

      await client['product-tags'][':id'].$patch(
        { param: { id: created.id }, json: { label: 'Anti-âge Pro' } },
        withAuth(adminToken)
      )

      const tag = await expectOk(client['product-tags'][':id'].$get({ param: { id: created.id } }))
      expect(tag.label).toBe('Anti-âge Pro')
    })

    it('should return 404 for unknown id', async () => {
      const res = await client['product-tags'][':id'].$patch(
        { param: { id: crypto.randomUUID() }, json: { label: 'X' } },
        withAuth(adminToken)
      )

      expectStatus(res, HTTP_STATUS.NOT_FOUND)
      const body = (await res.json()) as unknown as ApiErrorBody
      expect(body.error).toBe('tag_not_found')
    })

    it('should return 409 when updating to a conflicting slug', async () => {
      await createTag({ label: 'Éclat', slug: 'eclat' })
      const t2 = await createTag({ label: 'Luminosité' })

      const res = await client['product-tags'][':id'].$patch(
        { param: { id: t2.id }, json: { label: 'Éclat', slug: 'eclat' } },
        withAuth(adminToken)
      )

      expectStatus(res, HTTP_STATUS.CONFLICT)
      const body = (await res.json()) as unknown as ApiErrorBody
      expect(body.error).toBe('tag_already_exists')
    })

    expectRequiresAuth(() => app, {
      method: 'PATCH',
      path: `/api/product-tags/${crypto.randomUUID()}`,
      body: { label: 'X' },
    })
  })

  describe('DELETE /product-tags/:id', () => {
    it('should delete the tag and return null data', async () => {
      const created = await createTag()

      const deleted = await expectOk(
        client['product-tags'][':id'].$delete({ param: { id: created.id } }, withAuth(adminToken))
      )
      expect(deleted).toBeNull()
    })

    it('should make the tag unreachable after deletion', async () => {
      const created = await createTag()

      await client['product-tags'][':id'].$delete(
        { param: { id: created.id } },
        withAuth(adminToken)
      )

      const res = await client['product-tags'][':id'].$get({ param: { id: created.id } })
      expectStatus(res, HTTP_STATUS.NOT_FOUND)
    })

    it('should not affect other tags when deleting one', async () => {
      const t1 = await createTag()
      const t2 = await createTag({ label: 'Hydratation' })

      await client['product-tags'][':id'].$delete({ param: { id: t1.id } }, withAuth(adminToken))

      const res = await client['product-tags'][':id'].$get({ param: { id: t2.id } })
      expectStatus(res, HTTP_STATUS.OK)
    })

    it('should return 404 for unknown id', async () => {
      const res = await client['product-tags'][':id'].$delete(
        { param: { id: crypto.randomUUID() } },
        withAuth(adminToken)
      )

      expectStatus(res, HTTP_STATUS.NOT_FOUND)
      const body = (await res.json()) as unknown as ApiErrorBody
      expect(body.error).toBe('tag_not_found')
    })

    expectRequiresAuth(() => app, {
      method: 'DELETE',
      path: `/api/product-tags/${crypto.randomUUID()}`,
    })
  })
})

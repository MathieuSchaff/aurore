import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { eq } from 'drizzle-orm'
import type { Hono } from 'hono'

import type { AppEnv } from '../../../app-env'
import { productIngredients } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import type { TestClient } from '../../../tests/helpers/createTestClient'
import { createTestEnv, withAuth } from '../../../tests/helpers/createTestClient'
import { expectError, expectOk } from '../../../tests/helpers/expectStatus'
import { SKINCARE } from '../../../tests/helpers/product-shapes'
import {
  setupAndLogin,
  setupAndLoginAdmin,
  setupAndLoginContributor,
} from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'

setupDbTests()

describe('Product draft transactions', () => {
  let app: Hono<AppEnv>
  let client: TestClient
  let token: string

  beforeAll(async () => {
    ;({ app, client } = await createTestEnv())
  })

  beforeEach(async () => {
    token = await setupAndLoginContributor(app, TEST_CREDENTIALS.contributor)
  })

  it('rolls back creation when an ingredient cannot be linked and permits retry', async () => {
    const input = { name: 'Atomic serum', brand: 'Atomic brand', slug: 'atomic-serum', ...SKINCARE }
    const response = await app.request('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...input, ingredients: [{ ingredientId: crypto.randomUUID() }] }),
    })
    expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    await expectError(
      client.products[':slug'].$get({ param: { slug: input.slug } }),
      HTTP_STATUS.NOT_FOUND,
      'product_not_found'
    )

    const saved = await expectOk(
      client.products.$post({ json: input }, withAuth(token)),
      HTTP_STATUS.CREATED
    )
    expect(saved.slug).toBe(input.slug)
  })

  it('creates the fiche, manual tags and concentrations together', async () => {
    const ingredient = await expectOk(
      client.ingredients.$post(
        { json: { name: 'Niacinamide', type: 'skincare' } },
        withAuth(token)
      ),
      HTTP_STATUS.CREATED
    )
    const admin = await setupAndLoginAdmin(app, TEST_CREDENTIALS.admin)
    const tag = await expectOk(
      client['product-tags'].$post(
        { json: { label: 'Hydratation', slug: 'hydration', tagType: 'concern' } },
        withAuth(admin)
      ),
      HTTP_STATUS.CREATED
    )
    const saved = await expectOk(
      client.products.$post(
        {
          json: {
            name: 'Complete draft',
            brand: 'Atomic brand',
            ...SKINCARE,
            tags: [{ tagId: tag.id, relevance: 'primary' }],
            ingredients: [
              {
                ingredientId: ingredient.id,
                concentrationValue: 2,
                concentrationUnit: '%',
                concentrationPer: 'dose',
                notes: 'Declared on packaging',
              },
            ],
          },
        },
        withAuth(token)
      ),
      HTTP_STATUS.CREATED
    )
    const detail = await expectOk(client.products[':slug'].$get({ param: { slug: saved.slug } }))
    expect(detail.ingredients).toContainEqual(
      expect.objectContaining({
        ingredientId: ingredient.id,
        concentrationValue: '2',
        concentrationUnit: '%',
        concentrationPer: 'dose',
        notes: 'Declared on packaging',
      })
    )
    expect(detail.tags).toContainEqual(
      expect.objectContaining({ productTagId: tag.id, source: 'manual', relevance: 'primary' })
    )
  })

  it('rolls back a failed edit with its old links and accepts a corrected retry', async () => {
    const ingredient = await expectOk(
      client.ingredients.$post({ json: { name: 'Retinal', type: 'skincare' } }, withAuth(token)),
      HTTP_STATUS.CREATED
    )
    const product = await expectOk(
      client.products.$post(
        {
          json: {
            name: 'Existing draft',
            brand: 'Atomic brand',
            ...SKINCARE,
            notes: 'Original',
            ingredients: [
              {
                ingredientId: ingredient.id,
                concentrationValue: 0.1,
                concentrationUnit: '%',
                notes: 'Keep this source',
              },
            ],
          },
        },
        withAuth(token)
      ),
      HTTP_STATUS.CREATED
    )
    const failed = await client.products[':id'].$patch(
      {
        param: { id: product.id },
        json: {
          notes: 'Changed',
          ingredients: [{ ingredientId: crypto.randomUUID() }],
        },
      },
      withAuth(token)
    )
    expect(failed.status as number).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    const unchanged = await expectOk(
      client.products[':slug'].$get({ param: { slug: product.slug } })
    )
    expect(unchanged.notes).toBe('Original')
    expect(unchanged.ingredients).toContainEqual(
      expect.objectContaining({
        ingredientId: ingredient.id,
        concentrationValue: '0.1',
        notes: 'Keep this source',
      })
    )
    await expectOk(
      client.products[':id'].$patch(
        {
          param: { id: product.id },
          json: {
            notes: 'Changed',
            ingredients: [
              {
                ingredientId: ingredient.id,
                concentrationValue: null,
                concentrationUnit: null,
                notes: 'Keep this source',
              },
            ],
          },
        },
        withAuth(token)
      )
    )
    const corrected = await expectOk(
      client.products[':slug'].$get({ param: { slug: product.slug } })
    )
    expect(corrected.notes).toBe('Changed')
    expect(corrected.ingredients).toContainEqual(
      expect.objectContaining({
        ingredientId: ingredient.id,
        concentrationValue: null,
        concentrationUnit: null,
        notes: 'Keep this source',
      })
    )
  })

  it.each(['canonical', 'uppercase', 'mixed'] as const)(
    'preserves linker provenance when saving a concentration edit with %s UUIDs',
    async (casing) => {
      const formatUuid = (id: string) => {
        if (casing === 'uppercase') return id.toUpperCase()
        if (casing === 'mixed')
          return id.replace(/[a-f]/g, (letter, index) =>
            index % 2 === 0 ? letter.toUpperCase() : letter
          )
        return id
      }
      const edited = await expectOk(
        client.ingredients.$post({ json: { name: 'Retinal', type: 'skincare' } }, withAuth(token)),
        HTTP_STATUS.CREATED
      )
      const untouched = await expectOk(
        client.ingredients.$post({ json: { name: 'Glycerin', type: 'skincare' } }, withAuth(token)),
        HTTP_STATUS.CREATED
      )
      const product = await expectOk(
        client.products.$post(
          { json: { name: 'Inherited links', brand: 'Atomic brand', ...SKINCARE } },
          withAuth(token)
        ),
        HTTP_STATUS.CREATED
      )
      await testDb.insert(productIngredients).values([
        { productId: product.id, ingredientId: edited.id, source: 'linker' },
        { productId: product.id, ingredientId: untouched.id, source: 'linker' },
      ])

      // Saving one dose must not make untouched INCI links permanent
      await expectOk(
        client.products[':id'].$patch(
          {
            param: { id: product.id },
            json: {
              ingredients: [
                {
                  ingredientId: formatUuid(edited.id),
                  concentrationValue: 2,
                  concentrationUnit: '%',
                },
                { ingredientId: formatUuid(untouched.id) },
              ],
            },
          },
          withAuth(token)
        )
      )

      const links = await testDb
        .select({
          ingredientId: productIngredients.ingredientId,
          source: productIngredients.source,
          concentrationValue: productIngredients.concentrationValue,
        })
        .from(productIngredients)
        .where(eq(productIngredients.productId, product.id))
      expect(links).toHaveLength(2)
      expect(links).toContainEqual({
        ingredientId: edited.id,
        source: 'linker',
        concentrationValue: '2',
      })
      expect(links).toContainEqual({
        ingredientId: untouched.id,
        source: 'linker',
        concentrationValue: null,
      })
    }
  )

  it('rejects link payloads from an ordinary owner without changing the fiche', async () => {
    const owner = await setupAndLogin(app, TEST_CREDENTIALS.toto)
    const product = await expectOk(
      client.products.$post(
        { json: { name: 'Owner draft', brand: 'Atomic brand', ...SKINCARE } },
        withAuth(owner)
      ),
      HTTP_STATUS.CREATED
    )
    await expectError(
      client.products[':id'].$patch(
        { param: { id: product.id }, json: { notes: 'Forbidden', ingredients: [] } },
        withAuth(owner)
      ),
      HTTP_STATUS.FORBIDDEN,
      'unauthorized_access'
    )
    const unchanged = await expectOk(
      client.products[':slug'].$get({ param: { slug: product.slug } })
    )
    expect(unchanged.notes).toBeNull()
    await expectError(
      client.products.$post(
        { json: { name: 'Forbidden draft', brand: 'Atomic brand', ...SKINCARE, tags: [] } },
        withAuth(owner)
      ),
      HTTP_STATUS.FORBIDDEN,
      'unauthorized_access'
    )
  })
})

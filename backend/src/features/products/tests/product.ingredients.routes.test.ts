import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import type { CreateIngredientInput, CreateProductInput } from '@aurore/shared'
import { HTTP_STATUS } from '@aurore/shared'

import type { Hono } from 'hono'

import type { AppEnv } from '../../../app-env'
import { setupDbTests } from '../../../tests/db-setup'
import { expectRequiresAuth, expectRoleMatrix } from '../../../tests/helpers/authz-matrix'
import type { TestClient } from '../../../tests/helpers/createTestClient'
import { createTestEnv, withAuth } from '../../../tests/helpers/createTestClient'
import { expectOk } from '../../../tests/helpers/expectStatus'
import { SKINCARE } from '../../../tests/helpers/product-shapes'
import { setupAndLoginContributor } from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'

const VALID_PRODUCT = { name: 'Sérum Rétinol', brand: 'The Ordinary', ...SKINCARE } as const

setupDbTests()

describe('Product Ingredients Routes', () => {
  let app: Hono<AppEnv>
  let client: TestClient
  let contributorToken: string

  beforeAll(async () => {
    ;({ app, client } = await createTestEnv())
  })

  beforeEach(async () => {
    contributorToken = await setupAndLoginContributor(app, TEST_CREDENTIALS.contributor)
  })

  async function createProduct(overrides: Partial<CreateProductInput> = {}) {
    const res = await client.products.$post(
      { json: { ...VALID_PRODUCT, ...overrides } },
      withAuth(contributorToken)
    )
    const data = await res.json()
    if (!data.success) throw new Error('create product failed')
    return data.data
  }

  async function createIngredient(
    overrides: Partial<CreateIngredientInput> & Pick<CreateIngredientInput, 'name'>
  ) {
    const res = await client.ingredients.$post(
      { json: { type: 'skincare', ...overrides } },
      withAuth(contributorToken)
    )
    const data = await res.json()
    if (!data.success) throw new Error('create ingredient failed')
    return data.data
  }

  function linkIngredient(productId: string, ingredientId: string) {
    return client.products[':productId'].ingredients.$post(
      { param: { productId }, json: { ingredientId } },
      withAuth(contributorToken)
    )
  }

  describe('GET /products/:productId/ingredients', () => {
    it('should return an empty list without auth', async () => {
      const product = await createProduct()

      const links = await expectOk(
        client.products[':productId'].ingredients.$get({ param: { productId: product.id } })
      )
      expect(links).toEqual([])
    })

    it('should return linked ingredients with joined details', async () => {
      const product = await createProduct()
      const ingredient = await createIngredient({
        name: 'Rétinol',
        description: 'Dérivé de la vitamine A',
        category: 'actif',
      })

      await client.products[':productId'].ingredients.$post(
        {
          param: { productId: product.id },
          json: {
            ingredientId: ingredient.id,
            concentrationValue: 0.5,
            concentrationUnit: '%',
          },
        },
        withAuth(contributorToken)
      )

      const links = await expectOk(
        client.products[':productId'].ingredients.$get({ param: { productId: product.id } })
      )
      expect(links).toHaveLength(1)

      const link = links[0]
      if (!link) throw new Error('expected a link')
      expect(link.ingredientId).toBe(ingredient.id)
      expect(link.ingredientName).toBe('Rétinol')
      expect(link.ingredientSlug).toBe('retinol')
      expect(link.ingredientCategory).toBe('actif')
      expect(link.ingredientDescription).toBe('Dérivé de la vitamine A')
      expect(link.concentrationValue).toBe('0.5')
      expect(link.concentrationUnit).toBe('%')
    })

    it('should not return ingredients from other products', async () => {
      const p1 = await createProduct()
      const p2 = await createProduct({ name: 'Autre Sérum', brand: 'CeraVe' })
      const ingredient = await createIngredient({ name: 'Niacinamide' })

      await linkIngredient(p1.id, ingredient.id)

      const links = await expectOk(
        client.products[':productId'].ingredients.$get({ param: { productId: p2.id } })
      )
      expect(links).toHaveLength(0)
    })

    it('should return 400 for an invalid UUID', async () => {
      const res = await client.products[':productId'].ingredients.$get({
        param: { productId: 'not-a-uuid' },
      })
      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })
  })

  describe('POST /products/:productId/ingredients', () => {
    it('should add an ingredient with only an ingredientId', async () => {
      const product = await createProduct()
      const ingredient = await createIngredient({ name: 'Zinc' })

      const link = await expectOk(linkIngredient(product.id, ingredient.id), HTTP_STATUS.CREATED)
      expect(link.productId).toBe(product.id)
      expect(link.ingredientId).toBe(ingredient.id)
      expect(link.concentrationValue).toBeNull()
      expect(link.concentrationUnit).toBeNull()
      expect(link.notes).toBeNull()
    })

    it('should add an ingredient with concentration details', async () => {
      const product = await createProduct()
      const ingredient = await createIngredient({ name: 'Rétinol' })

      const link = await expectOk(
        client.products[':productId'].ingredients.$post(
          {
            param: { productId: product.id },
            json: {
              ingredientId: ingredient.id,
              concentrationValue: 0.5,
              concentrationUnit: '%',
              concentrationPer: 'mL',
              notes: 'Encapsulé',
            },
          },
          withAuth(contributorToken)
        ),
        HTTP_STATUS.CREATED
      )
      expect(link.concentrationValue).toBe('0.5')
      expect(link.concentrationUnit).toBe('%')
      expect(link.concentrationPer).toBe('mL')
      expect(link.notes).toBe('Encapsulé')
    })

    it('should return 409 when adding the same ingredient twice', async () => {
      const product = await createProduct()
      const ingredient = await createIngredient({ name: 'Niacinamide' })

      await linkIngredient(product.id, ingredient.id)
      const res = await linkIngredient(product.id, ingredient.id)

      expect(res.status as number).toBe(HTTP_STATUS.CONFLICT)
      const data = (await res.json()) as { success: boolean; error?: string }
      expect(data.error).toBe('product_ingredient_already_exists')
    })

    it('should reject missing ingredientId', async () => {
      const product = await createProduct()

      const res = await client.products[':productId'].ingredients.$post(
        {
          param: { productId: product.id },
          json: { concentrationValue: 5 } as never,
        },
        withAuth(contributorToken)
      )

      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    expectRequiresAuth(() => app, {
      method: 'POST',
      path: `/api/products/${crypto.randomUUID()}/ingredients`,
      body: { ingredientId: crypto.randomUUID() },
    })
  })

  describe('PATCH /products/:productId/ingredients/:ingredientId', () => {
    it('should update concentration and notes', async () => {
      const product = await createProduct()
      const ingredient = await createIngredient({ name: 'Rétinol' })
      await linkIngredient(product.id, ingredient.id)

      const patched = await expectOk(
        client.products[':productId'].ingredients[':ingredientId'].$patch(
          {
            param: { productId: product.id, ingredientId: ingredient.id },
            json: { concentrationValue: 0.3, concentrationUnit: '%', notes: 'Microencapsulé' },
          },
          withAuth(contributorToken)
        )
      )
      expect(patched.concentrationValue).toBe('0.3')
      expect(patched.concentrationUnit).toBe('%')
      expect(patched.notes).toBe('Microencapsulé')
    })

    it('should return 404 when the link does not exist', async () => {
      const product = await createProduct()

      const res = await client.products[':productId'].ingredients[':ingredientId'].$patch(
        {
          param: { productId: product.id, ingredientId: crypto.randomUUID() },
          json: { notes: 'X' },
        },
        withAuth(contributorToken)
      )

      expect(res.status as number).toBe(HTTP_STATUS.NOT_FOUND)
      const data = (await res.json()) as { success: boolean; error?: string }
      expect(data.error).toBe('product_ingredient_not_found')
    })

    it('should reject unknown fields (strict schema)', async () => {
      const product = await createProduct()

      const res = await client.products[':productId'].ingredients[':ingredientId'].$patch(
        {
          param: { productId: product.id, ingredientId: crypto.randomUUID() },
          json: { unknownField: 'oops' } as never,
        },
        withAuth(contributorToken)
      )

      expect(res.status as number).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    expectRequiresAuth(() => app, {
      method: 'PATCH',
      path: `/api/products/${crypto.randomUUID()}/ingredients/${crypto.randomUUID()}`,
      body: { notes: 'X' },
    })
  })

  describe('DELETE /products/:productId/ingredients/:ingredientId', () => {
    it('should remove the ingredient link and return null', async () => {
      const product = await createProduct()
      const ingredient = await createIngredient({ name: 'Niacinamide' })
      await linkIngredient(product.id, ingredient.id)

      const res = await client.products[':productId'].ingredients[':ingredientId'].$delete(
        { param: { productId: product.id, ingredientId: ingredient.id } },
        withAuth(contributorToken)
      )

      expect(res.status as number).toBe(HTTP_STATUS.NO_CONTENT)
    })

    it('should return 404 when the link does not exist', async () => {
      const product = await createProduct()

      const res = await client.products[':productId'].ingredients[':ingredientId'].$delete(
        { param: { productId: product.id, ingredientId: crypto.randomUUID() } },
        withAuth(contributorToken)
      )

      expect(res.status as number).toBe(HTTP_STATUS.NOT_FOUND)
      const data = (await res.json()) as { success: boolean; error?: string }
      expect(data.error).toBe('product_ingredient_not_found')
    })

    expectRequiresAuth(() => app, {
      method: 'DELETE',
      path: `/api/products/${crypto.randomUUID()}/ingredients/${crypto.randomUUID()}`,
    })
  })

  describe('PUT /products/:productId/ingredients', () => {
    it('should replace all ingredients', async () => {
      const product = await createProduct()
      const old = await createIngredient({ name: 'Ancien' })
      const nouveau = await createIngredient({ name: 'Nouveau' })
      await linkIngredient(product.id, old.id)

      const replaced = await expectOk(
        client.products[':productId'].ingredients.$put(
          {
            param: { productId: product.id },
            json: {
              ingredients: [
                { ingredientId: nouveau.id, concentrationValue: 5, concentrationUnit: '%' },
              ],
            },
          },
          withAuth(contributorToken)
        )
      )
      expect(replaced).toHaveLength(1)
      expect(replaced[0]?.ingredientId).toBe(nouveau.id)
      expect(replaced[0]?.concentrationValue).toBe('5')
    })

    expectRequiresAuth(() => app, {
      method: 'PUT',
      path: `/api/products/${crypto.randomUUID()}/ingredients`,
      body: { ingredients: [] },
    })
  })

  describe('PUT /products/:productId/ingredients — role enforcement', () => {
    expectRoleMatrix(
      () => app,
      async () => {
        const product = await createProduct()
        return {
          method: 'PUT',
          path: `/api/products/${product.id}/ingredients`,
          body: { ingredients: [] },
        }
      },
      { user: HTTP_STATUS.FORBIDDEN, contributor: HTTP_STATUS.OK, admin: HTTP_STATUS.OK }
    )
  })
})

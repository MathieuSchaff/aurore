import { beforeEach, describe, expect, it } from 'bun:test'

import { listIngredientsSearchSchema } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { ingredients } from '../../../db/schema/ingredients/ingredients'
import { addTagToIngredient, createIngredientTag } from '../../../features/ingredient-tags/service'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestIngredient,
  createTestProduct,
  createTestUser,
  type TestUser,
} from '../../../tests/helpers/test-factories'
import { addIngredientToProduct } from '../../products/product-ingredients/product-ingredients.service'
import { IngredientError } from '../ingredients-error'
import {
  createIngredient,
  deleteIngredient,
  getIngredientById,
  getIngredientBySlug,
  listAllIngredientOptions,
  listIngredients,
  searchIngredientIdentities,
  searchIngredients,
} from '../service'

let user: TestUser

// Helper: page/limit have schema defaults, so we parse to satisfy types that aren't optional.
function filters(input: Record<string, string> = {}) {
  return listIngredientsSearchSchema.parse(input)
}

async function makeTag(name: string, category?: string) {
  return testDb.transaction((tx) => createIngredientTag(tx, { label: name, tagType: category }))
}

const addTag = (
  ingredientId: string,
  tagId: string,
  relevance?: Parameters<typeof addTagToIngredient>[3]
) => testDb.transaction((tx) => addTagToIngredient(tx, ingredientId, tagId, relevance))

const createIng = (
  userId: string,
  role: Parameters<typeof createIngredient>[2],
  input: Parameters<typeof createIngredient>[3]
) => testDb.transaction((tx) => createIngredient(tx, userId, role, input))

const getIng = (id: string) => testDb.transaction((tx) => getIngredientById(tx, id))

const delIng = (role: Parameters<typeof deleteIngredient>[1], id: string) =>
  testDb.transaction((tx) => deleteIngredient(tx, role, id))

async function makeKeyedIngredient(
  name: string,
  canonicalKey: string,
  extra: Omit<Parameters<typeof createTestIngredient>[1], 'name'> = {}
) {
  const ingredient = await createTestIngredient(user.id, { name, ...extra })
  await testDb.update(ingredients).set({ canonicalKey }).where(eq(ingredients.id, ingredient.id))
  return ingredient
}

setupDbTests()

describe('Ingredient Service', () => {
  beforeEach(async () => {
    user = await createTestUser()
  })

  describe('createIngredient', () => {
    it('should create an ingredient with minimal fields', async () => {
      const ingredient = await createTestIngredient(user.id, { name: 'Rétinol' })

      expect(ingredient.id).toBeDefined()
      expect(ingredient.name).toBe('Rétinol')
      expect(ingredient.createdBy).toBe(user.id)
      expect(ingredient.slug).toBe('retinol')
      expect(ingredient.description).toBe('')
      expect(ingredient.content).toBe('')
      expect(ingredient.category).toBeNull()
    })

    it('should create an ingredient with all fields', async () => {
      const ingredient = await createTestIngredient(user.id, {
        name: 'Acide Ascorbique',
        description: 'Forme pure de la vitamine C',
        content: '## Description\n\nActif antioxydant.',
        category: 'humectant',
      })

      expect(ingredient.name).toBe('Acide Ascorbique')
      expect(ingredient.description).toBe('Forme pure de la vitamine C')
      expect(ingredient.content).toBe('## Description\n\nActif antioxydant.')
      expect(ingredient.category).toBe('humectant')
    })

    it('should auto-generate slug from name', async () => {
      const ingredient = await createTestIngredient(user.id, { name: 'Acide Hyaluronique' })
      expect(ingredient.slug).toBe('acide-hyaluronique')
    })

    it('should use custom slug when provided by admin', async () => {
      const ingredient = await createTestIngredient(
        user.id,
        { name: 'Niacinamide', slug: 'niacin' },
        'admin'
      )
      expect(ingredient.slug).toBe('niacin')
    })

    it('should NOT use custom slug when provided by non-admin', async () => {
      const ingredient = await createTestIngredient(
        user.id,
        { name: 'Niacinamide', slug: 'niacin' },
        'user'
      )
      expect(ingredient.slug).toBe('niacinamide')
    })

    it('should store createdAt and updatedAt timestamps', async () => {
      const ingredient = await createTestIngredient(user.id, { name: 'Zinc' })
      expect(typeof ingredient.createdAt).toBe('string')
      expect(typeof ingredient.updatedAt).toBe('string')
    })

    it('should throw ingredient_already_exists for duplicate slug (admin)', async () => {
      await createTestIngredient(user.id, { name: 'Magnésium', slug: 'magnesium' }, 'admin')

      try {
        await createTestIngredient(user.id, { name: 'Magnésium Bis', slug: 'magnesium' }, 'admin')
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(IngredientError)
        expect((e as IngredientError).code).toBe('ingredient_already_exists')
      }
    })

    it('should allow different users to create ingredients with different names', async () => {
      const other = await createTestUser('other@test.com')
      const i1 = await createTestIngredient(user.id, { name: 'Rétinol' })
      const i2 = await createIng(other.id, 'contributor', {
        name: 'Bakuchiol',
        type: 'skincare',
      })

      expect(i1.id).not.toBe(i2.id)
    })
  })

  describe('getIngredientById', () => {
    it('should return the ingredient for a valid id', async () => {
      const created = await createTestIngredient(user.id, { name: 'Rétinol' })
      const fetched = await getIng(created.id)

      expect(fetched.id).toBe(created.id)
      expect(fetched.name).toBe('Rétinol')
    })

    it('should throw ingredient_not_found for unknown id', async () => {
      const fakeId = crypto.randomUUID()
      expect(getIng(fakeId)).rejects.toThrow(IngredientError)
    })
  })

  describe('getIngredientBySlug', () => {
    it('should return the ingredient for a valid slug', async () => {
      const created = await createTestIngredient(user.id, { name: 'Niacinamide' })
      const fetched = await getIngredientBySlug(testDb, created.slug)

      expect(fetched.id).toBe(created.id)
      expect(fetched.slug).toBe('niacinamide')
    })

    it('should throw ingredient_not_found for unknown slug', async () => {
      expect(getIngredientBySlug(testDb, 'slug-inexistant')).rejects.toThrow(IngredientError)
    })
  })

  describe('deleteIngredient', () => {
    it('should permanently remove the ingredient', async () => {
      const created = await createTestIngredient(user.id, { name: 'Rétinol' })
      await delIng('admin', created.id)
      expect(getIng(created.id)).rejects.toThrow(IngredientError)
    })

    it('should not affect other ingredients when deleting one', async () => {
      const i1 = await createTestIngredient(user.id, { name: 'Ingrédient A' })
      const i2 = await createTestIngredient(user.id, { name: 'Ingrédient B' })

      await delIng('admin', i1.id)
      const fetched = await getIng(i2.id)
      expect(fetched.id).toBe(i2.id)
    })
  })

  describe('listIngredients', () => {
    it('should return the correct shape with defaults', async () => {
      await createTestIngredient(user.id, { name: 'Rétinol' })
      const result = await listIngredients(testDb, filters())

      expect(result).toHaveProperty('items')
      expect(result).toHaveProperty('total')
      expect(result.total).toBe(1)
      expect(result.items).toHaveLength(1)
    })

    it('should order items by name', async () => {
      await createTestIngredient(user.id, { name: 'Zinc PCA' })
      await createTestIngredient(user.id, { name: 'Acide Azélaïque' })
      await createTestIngredient(user.id, { name: 'Niacinamide' })

      const result = await listIngredients(testDb, filters())
      expect(result.items[0]?.name).toBe('Acide Azélaïque')
      expect(result.items[1]?.name).toBe('Niacinamide')
      expect(result.items[2]?.name).toBe('Zinc PCA')
    })

    it('should filter by tags (concern)', async () => {
      const i1 = await createTestIngredient(user.id, { name: 'Rétinol' })
      // Untagged witness: a silently dropped axis would return it too.
      await createTestIngredient(user.id, { name: 'Squalane' })
      const tag = await makeTag('Anti-âge', 'concern')
      await addTag(i1.id, tag.id)

      const result = await listIngredients(testDb, filters({ concern: 'anti-age' }))
      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Rétinol')
    })

    it('should filter by tags (actif_class)', async () => {
      const i1 = await createTestIngredient(user.id, { name: 'Céramide NP' })
      // Untagged witness: a silently dropped axis would return it too.
      await createTestIngredient(user.id, { name: 'Acide hyaluronique' })
      const tag = await makeTag('Céramides', 'actif_class')
      await addTag(i1.id, tag.id)

      const result = await listIngredients(testDb, filters({ actif_class: tag.slug }))
      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Céramide NP')
    })

    describe('avoid_for filter', () => {
      it('flags matching ingredients via profileMatches but does not exclude them', async () => {
        const reactive = await makeTag('Peau réactive', 'skin_type')
        const retinol = await createTestIngredient(user.id, { name: 'Rétinol' })
        const gentle = await createTestIngredient(user.id, { name: 'Hydratant doux' })
        await addTag(retinol.id, reactive.id, 'avoid')

        const result = await listIngredients(testDb, filters({ avoid_for: reactive.slug }))
        expect(result.items.map((i) => i.name).sort()).toEqual(['Hydratant doux', 'Rétinol'])
        const flagged = result.items.find((i) => i.id === retinol.id)
        expect(flagged?.profileMatches).toEqual([reactive.slug])
        const ok = result.items.find((i) => i.id === gentle.id)
        expect(ok?.profileMatches).toEqual([])
      })

      it('does not flag ingredients where the tag relevance is primary or secondary', async () => {
        const reactive = await makeTag('Peau réactive', 'skin_type')
        const dedicated = await createTestIngredient(user.id, { name: 'Allantoïne' })
        await addTag(dedicated.id, reactive.id, 'primary')

        const result = await listIngredients(testDb, filters({ avoid_for: reactive.slug }))
        expect(result.items[0]?.profileMatches).toEqual([])
      })

      it('returns empty profileMatches when no avoid_for filter is provided', async () => {
        await createTestIngredient(user.id, { name: 'Niacinamide' })
        const result = await listIngredients(testDb, filters())
        expect(result.items[0]?.profileMatches).toEqual([])
      })
    })
  })

  describe('listAllIngredientOptions', () => {
    it('should scope options to the ingredient type when set', async () => {
      await createTestIngredient(user.id, { name: 'Niacinamide' })
      await createTestIngredient(user.id, { name: 'Kératine hydrolysée', type: 'haircare' })

      const haircare = await listAllIngredientOptions(testDb, 'haircare')
      expect(haircare.map((i) => i.name)).toEqual(['Kératine hydrolysée'])

      const all = await listAllIngredientOptions(testDb)
      expect(all.map((i) => i.name)).toEqual(['Kératine hydrolysée', 'Niacinamide'])
    })
  })

  describe('searchIngredients', () => {
    it('should return ingredients matching by name', async () => {
      await createTestIngredient(user.id, { name: 'Niacinamide' })
      await createTestIngredient(user.id, { name: 'Zinc PCA' })

      const results = await searchIngredients(testDb, 'niacin')
      expect(results).toHaveLength(1)
      expect(results[0]?.name).toBe('Niacinamide')
    })

    it('should be case-insensitive', async () => {
      await createTestIngredient(user.id, { name: 'Niacinamide' })
      const results = await searchIngredients(testDb, 'NIACINAMIDE')
      expect(results).toHaveLength(1)
    })

    it('should match names without accents', async () => {
      await createTestIngredient(user.id, { name: 'Sélénium', slug: 'trace-mineral' })
      const results = await searchIngredients(testDb, 'se')
      expect(results).toHaveLength(1)
      expect(results[0]?.name).toBe('Sélénium')
    })

    // Similarity alone would rank the short contains-match above the long
    // prefix-match; the explicit rank must win for a predictable dropdown.
    it('should rank exact > prefix > contains even when similarity disagrees', async () => {
      await createTestIngredient(user.id, { name: 'Pro-Rétinol' })
      await createTestIngredient(user.id, { name: 'Rétinol Palmitate Complexe Stabilisé' })
      await createTestIngredient(user.id, { name: 'Rétinol' })

      const results = await searchIngredients(testDb, 'retinol')
      expect(results.map((r) => r.name)).toEqual([
        'Rétinol',
        'Rétinol Palmitate Complexe Stabilisé',
        'Pro-Rétinol',
      ])
    })

    // pg_trgm similarity catches typos that ILIKE %q% would miss.
    it('should match typos via trigram similarity', async () => {
      await createTestIngredient(user.id, { name: 'Niacinamide' })
      const results = await searchIngredients(testDb, 'niacynamid')
      expect(results.length).toBeGreaterThan(0)
      expect(results[0]?.name).toBe('Niacinamide')
    })

    it('should return empty list for blank query', async () => {
      await createTestIngredient(user.id, { name: 'Niacinamide' })
      const results = await searchIngredients(testDb, '   ')
      expect(results).toHaveLength(0)
    })

    // Cross-domain homonyms (ceramides) must not leak into another tab's dropdown.
    it('should scope results to the requested type', async () => {
      await createTestIngredient(user.id, { name: 'Céramide NP' })
      await createTestIngredient(user.id, { name: 'Céramide 2', type: 'haircare' })

      const scoped = await searchIngredients(testDb, 'ceramide', { type: 'skincare' })
      expect(scoped.map((r) => r.name)).toEqual(['Céramide NP'])

      const unscoped = await searchIngredients(testDb, 'ceramide')
      expect(unscoped).toHaveLength(2)
    })

    // The catalogue filter reads product_ingredients, which drops excipients on
    // purpose. Without this flag the drawer offers the option and matches nothing.
    it('should flag an ingredient no product links as not filterable', async () => {
      const linked = await createTestIngredient(user.id, { name: 'Niacinamide' })
      await createTestIngredient(user.id, { name: 'Niacinamide Ester', slug: 'niacinamide-ester' })
      const product = await createTestProduct(user.id, { name: 'Sérum test' })
      await testDb.transaction((tx) =>
        addIngredientToProduct(tx, { productId: product.id, ingredientId: linked.id })
      )

      const results = await searchIngredients(testDb, 'niacinamide')
      const byName = new Map(results.map((r) => [r.name, r.filterable]))
      expect(byName.get('Niacinamide')).toBe(true)
      expect(byName.get('Niacinamide Ester')).toBe(false)
    })
  })

  describe('searchIngredientIdentities', () => {
    it('returns the best matching row once per canonical identity', async () => {
      await makeKeyedIngredient('Niacinamide', 'Niacinamide')
      await makeKeyedIngredient('Pro-Niacinamide', 'Niacinamide')

      const results = await searchIngredientIdentities(testDb, 'niacinamide')

      expect(results.map((r) => r.slug)).toEqual(['niacinamide'])
    })

    it('deduplicates identities before applying the result limit', async () => {
      await makeKeyedIngredient('Niacinamide A', 'Niacinamide')
      await makeKeyedIngredient('Niacinamide B', 'Niacinamide')
      await makeKeyedIngredient('Niacinamide Zinc', 'Niacinamide Zinc')

      const results = await searchIngredientIdentities(testDb, 'niacinamide', { limit: 2 })

      expect(results.map((r) => r.canonicalKey)).toEqual(['Niacinamide', 'Niacinamide Zinc'])
    })

    it('returns one preference target when an identity spans ingredient types', async () => {
      await makeKeyedIngredient('Céramide', 'Ceramide NP')
      await makeKeyedIngredient('Céramide cheveux', 'Ceramide NP', { type: 'haircare' })

      const results = await searchIngredientIdentities(testDb, 'ceramide')

      expect(results.map((r) => r.type)).toEqual(['skincare'])
    })
  })
})

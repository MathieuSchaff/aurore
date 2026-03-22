import { beforeEach, describe, expect, it } from 'bun:test'

import { IngredientError } from '../../../features/products/ingredients/ingredients-error'
import {
  createIngredient,
  deleteIngredient,
  getIngredientById,
  getIngredientBySlug,
  listIngredientEdits,
  updateIngredient,
} from '../../../features/products/ingredients/service'
import { testDb } from '../../db.test.config'
import { createTestUser } from '../../helpers/test-factories'

describe('Ingredient Service', () => {
  // biome-ignore lint: testing
  let user: any

  beforeEach(async () => {
    user = await createTestUser()
  })

  // ─── createIngredient ─────────────────────────────────────────

  describe('createIngredient', () => {
    it('should create an ingredient with minimal fields', async () => {
      const ingredient = await createIngredient(user.id, { name: 'Rétinol' }, testDb)

      expect(ingredient.id).toBeDefined()
      expect(ingredient.name).toBe('Rétinol')
      expect(ingredient.createdBy).toBe(user.id)
      expect(ingredient.slug).toBe('retinol')
      expect(ingredient.description).toBe('')
      expect(ingredient.content).toBe('')
      expect(ingredient.category).toBeNull()
    })

    it('should create an ingredient with all fields', async () => {
      const ingredient = await createIngredient(
        user.id,
        {
          name: 'Acide Ascorbique',
          description: 'Forme pure de la vitamine C',
          content: '## Description\n\nActif antioxydant.',
          category: 'vitamine',
        },
        testDb
      )

      expect(ingredient.name).toBe('Acide Ascorbique')
      expect(ingredient.description).toBe('Forme pure de la vitamine C')
      expect(ingredient.content).toBe('## Description\n\nActif antioxydant.')
      expect(ingredient.category).toBe('vitamine')
    })

    it('should auto-generate slug from name', async () => {
      const ingredient = await createIngredient(user.id, { name: 'Acide Hyaluronique' }, testDb)

      expect(ingredient.slug).toBe('acide-hyaluronique')
    })

    it('should use custom slug when provided', async () => {
      const ingredient = await createIngredient(
        user.id,
        { name: 'Niacinamide', slug: 'niacin' },
        testDb
      )

      expect(ingredient.slug).toBe('niacin')
    })

    it('should store createdAt and updatedAt timestamps', async () => {
      const ingredient = await createIngredient(user.id, { name: 'Zinc' }, testDb)

      expect(ingredient.createdAt).toBeInstanceOf(Date)
      expect(ingredient.updatedAt).toBeInstanceOf(Date)
    })

    it('should throw ingredient_already_exists for duplicate slug', async () => {
      await createIngredient(user.id, { name: 'Magnésium', slug: 'magnesium' }, testDb)

      try {
        await createIngredient(user.id, { name: 'Magnésium Bis', slug: 'magnesium' }, testDb)
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(IngredientError)
        expect((e as IngredientError).code).toBe('ingredient_already_exists')
      }
    })

    it('should allow different users to create ingredients with different names', async () => {
      const other = await createTestUser('other@test.com')

      const i1 = await createIngredient(user.id, { name: 'Rétinol' }, testDb)
      const i2 = await createIngredient(other.id, { name: 'Bakuchiol' }, testDb)

      expect(i1.id).not.toBe(i2.id)
    })
  })

  // ─── getIngredientById ────────────────────────────────────────

  describe('getIngredientById', () => {
    it('should return the ingredient for a valid id', async () => {
      const created = await createIngredient(user.id, { name: 'Rétinol' }, testDb)

      const fetched = await getIngredientById(created.id, testDb)

      expect(fetched.id).toBe(created.id)
      expect(fetched.name).toBe('Rétinol')
    })

    it('should throw ingredient_not_found for unknown id', async () => {
      const fakeId = crypto.randomUUID()

      try {
        await getIngredientById(fakeId, testDb)
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(IngredientError)
        expect((e as IngredientError).code).toBe('ingredient_not_found')
      }
    })

    it('should also reject via rejects.toThrow', async () => {
      const fakeId = crypto.randomUUID()
      expect(getIngredientById(fakeId, testDb)).rejects.toThrow(IngredientError)
    })
  })

  // ─── getIngredientBySlug ──────────────────────────────────────

  describe('getIngredientBySlug', () => {
    it('should return the ingredient for a valid slug', async () => {
      const created = await createIngredient(user.id, { name: 'Niacinamide' }, testDb)

      const fetched = await getIngredientBySlug(created.slug, testDb)

      expect(fetched.id).toBe(created.id)
      expect(fetched.slug).toBe('niacinamide')
    })

    it('should throw ingredient_not_found for unknown slug', async () => {
      try {
        await getIngredientBySlug('slug-inexistant', testDb)
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(IngredientError)
        expect((e as IngredientError).code).toBe('ingredient_not_found')
      }
    })
  })

  // ─── updateIngredient ─────────────────────────────────────────

  describe('updateIngredient', () => {
    it('should update ingredient fields and return the updated record', async () => {
      const created = await createIngredient(user.id, { name: 'Bakuchiol' }, testDb)

      const updated = await updateIngredient(
        user.id,
        created.id,
        { description: 'Alternative naturelle au rétinol', category: 'actif' },
        undefined,
        testDb
      )

      expect(updated.description).toBe('Alternative naturelle au rétinol')
      expect(updated.category).toBe('actif')
    })

    it('should create an audit log when fields change', async () => {
      const created = await createIngredient(
        user.id,
        { name: 'Acide Azélaïque', category: 'actif' },
        testDb
      )

      await updateIngredient(
        user.id,
        created.id,
        { description: 'Actif multi-usage' },
        'Ajout description',
        testDb
      )

      const edits = await listIngredientEdits(created.id, testDb)

      expect(edits).toHaveLength(1)
      expect(edits[0]?.summary).toBe('Ajout description')
      expect(edits[0]?.editedBy).toBe(user.id)
      expect(edits[0]?.changes).toHaveProperty('description')
    })

    it('should not create an audit log when nothing actually changes', async () => {
      const created = await createIngredient(user.id, { name: 'Panthénol' }, testDb)

      // category is already null — setting it to null again is not a change
      await updateIngredient(user.id, created.id, { category: null }, undefined, testDb)

      const edits = await listIngredientEdits(created.id, testDb)

      expect(edits).toHaveLength(0)
    })

    it('should auto-update slug when name changes', async () => {
      const created = await createIngredient(user.id, { name: 'Vitamine E' }, testDb)

      const updated = await updateIngredient(
        user.id,
        created.id,
        { name: 'Vitamine E Tocopherol' },
        undefined,
        testDb
      )

      expect(updated.slug).toBe('vitamine-e-tocopherol')
    })

    it('should throw ingredient_not_found for unknown id', async () => {
      const fakeId = crypto.randomUUID()

      try {
        await updateIngredient(user.id, fakeId, { description: 'X' }, undefined, testDb)
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(IngredientError)
        expect((e as IngredientError).code).toBe('ingredient_not_found')
      }
    })
  })

  // ─── deleteIngredient ─────────────────────────────────────────

  describe('deleteIngredient', () => {
    it('should permanently remove the ingredient', async () => {
      const created = await createIngredient(user.id, { name: 'Rétinol' }, testDb)

      await deleteIngredient(created.id, testDb)

      expect(getIngredientById(created.id, testDb)).rejects.toThrow(IngredientError)
    })

    it('should throw ingredient_delete_failed for unknown id', async () => {
      const fakeId = crypto.randomUUID()

      try {
        await deleteIngredient(fakeId, testDb)
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(IngredientError)
        expect((e as IngredientError).code).toBe('ingredient_delete_failed')
      }
    })

    it('should not affect other ingredients when deleting one', async () => {
      const i1 = await createIngredient(user.id, { name: 'Ingrédient A' }, testDb)
      const i2 = await createIngredient(user.id, { name: 'Ingrédient B' }, testDb)

      await deleteIngredient(i1.id, testDb)

      const fetched = await getIngredientById(i2.id, testDb)
      expect(fetched.id).toBe(i2.id)
    })
  })

  // ─── listIngredientEdits ──────────────────────────────────────

  describe('listIngredientEdits', () => {
    it('should return an empty list when no edits exist', async () => {
      const created = await createIngredient(user.id, { name: 'Panthénol' }, testDb)

      const edits = await listIngredientEdits(created.id, testDb)

      expect(edits).toEqual([])
    })

    it('should return edits for a given ingredient', async () => {
      const created = await createIngredient(user.id, { name: 'Niacinamide' }, testDb)

      await updateIngredient(
        user.id,
        created.id,
        { description: 'Première description' },
        'Edit 1',
        testDb
      )

      const edits = await listIngredientEdits(created.id, testDb)

      expect(edits).toHaveLength(1)
      expect(edits[0]?.ingredientId).toBe(created.id)
      expect(edits[0]?.summary).toBe('Edit 1')
    })

    it('should return multiple edits ordered newest first', async () => {
      const created = await createIngredient(user.id, { name: 'Rétinol' }, testDb)

      await updateIngredient(
        user.id,
        created.id,
        { description: 'Première description' },
        'Premier edit',
        testDb
      )
      await updateIngredient(
        user.id,
        created.id,
        { content: 'Contenu wiki complet' },
        'Deuxième edit',
        testDb
      )

      const edits = await listIngredientEdits(created.id, testDb)

      expect(edits).toHaveLength(2)
      // newest first
      expect(edits[0]?.summary).toBe('Deuxième edit')
      expect(edits[1]?.summary).toBe('Premier edit')
    })

    it('should not return edits from other ingredients', async () => {
      const i1 = await createIngredient(user.id, { name: 'Ingrédient A' }, testDb)
      const i2 = await createIngredient(user.id, { name: 'Ingrédient B' }, testDb)

      await updateIngredient(user.id, i1.id, { description: 'A modifié' }, 'edit A', testDb)

      const editsForI2 = await listIngredientEdits(i2.id, testDb)

      expect(editsForI2).toHaveLength(0)
    })
  })
})

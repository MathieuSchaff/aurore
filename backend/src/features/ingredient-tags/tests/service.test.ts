import { beforeEach, describe, expect, it } from 'bun:test'

import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestIngredient, createTestUser } from '../../../tests/helpers/test-factories'
import {
  addManyTagsToIngredient,
  addTagToIngredient,
  createIngredientTag,
  listIngredientsByTag,
  listTagsByIngredient,
  removeTagFromIngredient,
  replaceIngredientTags,
} from '../service'

setupDbTests()

const createTag = (label: string, tagType?: string) =>
  testDb.transaction((tx) => createIngredientTag(tx, { label, tagType }))

const addTag = (ingredientId: string, tagId: string) =>
  testDb.transaction((tx) => addTagToIngredient(tx, ingredientId, tagId))

const addManyTags = (ingredientId: string, tagIds: string[]) =>
  testDb.transaction((tx) => addManyTagsToIngredient(tx, ingredientId, tagIds))

const removeTag = (ingredientId: string, tagId: string) =>
  testDb.transaction((tx) => removeTagFromIngredient(tx, ingredientId, tagId))

const replaceTags = (ingredientId: string, tagIds: string[]) =>
  testDb.transaction((tx) => replaceIngredientTags(tx, ingredientId, tagIds))

describe('Ingredient Tags Service', () => {
  let user: any

  beforeEach(async () => {
    user = await createTestUser()
  })

  describe('addTagToIngredient', () => {
    it('should link a tag to an ingredient', async () => {
      const ingredient = await createTestIngredient(user.id, { name: 'Ingrédient Test' })
      const tag = await createTag('Hydratant')

      const link = await addTag(ingredient.id, tag.id)

      expect(link).toBeDefined()
      expect(link?.ingredientId).toBe(ingredient.id)
      expect(link?.ingredientTagId).toBe(tag.id)
    })
  })

  describe('addManyTagsToIngredient', () => {
    it('should link multiple tags to an ingredient at once', async () => {
      const ingredient = await createTestIngredient(user.id, { name: 'Ingrédient Test' })
      const t1 = await createTag('Peeling')
      const t2 = await createTag('Exfoliant')

      const links = await addManyTags(ingredient.id, [t1.id, t2.id])

      expect(links).toHaveLength(2)
      const tagIds = links.map((l) => l.ingredientTagId)
      expect(tagIds).toContain(t1.id)
      expect(tagIds).toContain(t2.id)
    })
  })

  describe('listTagsByIngredient', () => {
    it('should return tags for a given ingredient', async () => {
      const ingredient = await createTestIngredient(user.id, { name: 'Ingrédient Test' })
      const tag = await createTag('Actif', 'type')

      await addTag(ingredient.id, tag.id)

      const result = await listTagsByIngredient(testDb, ingredient.id)

      expect(result).toHaveLength(1)
      expect(result[0]?.ingredientId).toBe(ingredient.id)
      expect(result[0]?.tagName).toBe('Actif')
    })
  })

  describe('listIngredientsByTag', () => {
    it('should return ingredients for a given tag', async () => {
      const i1 = await createTestIngredient(user.id, { name: 'Ingrédient 1' })
      const i2 = await createTestIngredient(user.id, { name: 'Ingrédient 2' })
      const tag = await createTag('Apaisant')

      await addTag(i1.id, tag.id)
      await addTag(i2.id, tag.id)

      const result = await listIngredientsByTag(testDb, tag.id)

      expect(result).toHaveLength(2)
      const names = result.map((r) => r.name)
      expect(names).toContain('Ingrédient 1')
      expect(names).toContain('Ingrédient 2')
    })
  })

  describe('removeTagFromIngredient', () => {
    it('should remove a tag from an ingredient', async () => {
      const ingredient = await createTestIngredient(user.id, { name: 'Ingrédient Test' })
      const tag = await createTag('Temporaire')

      await addTag(ingredient.id, tag.id)
      const removed = await removeTag(ingredient.id, tag.id)

      expect(removed).toBe(true)
      const remaining = await listTagsByIngredient(testDb, ingredient.id)
      expect(remaining).toHaveLength(0)
    })
  })

  describe('replaceIngredientTags', () => {
    it('should replace ingredient tags', async () => {
      const ingredient = await createTestIngredient(user.id, { name: 'Ingrédient Test' })
      const t1 = await createTag('Vieux')
      const t2 = await createTag('Neuf')

      await addTag(ingredient.id, t1.id)
      await replaceTags(ingredient.id, [t2.id])

      const result = await listTagsByIngredient(testDb, ingredient.id)
      expect(result).toHaveLength(1)
      expect(result[0]?.ingredientTagId).toBe(t2.id)
    })
  })
})

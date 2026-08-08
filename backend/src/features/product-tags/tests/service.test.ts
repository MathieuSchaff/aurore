import { beforeEach, describe, expect, it } from 'bun:test'

import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestProduct,
  createTestUser,
  type TestUser,
} from '../../../tests/helpers/test-factories'
import {
  addManyTagsToProduct,
  addTagToProduct,
  createProductTag,
  deleteProductTag,
  getProductTagById,
  getProductTagBySlug,
  listProductsByTag,
  listTagsByProduct,
  removeTagFromProduct,
  replaceProductTags,
  updateProductTag,
} from '../service'
import { TagError } from '../tag-error'

setupDbTests()

const createTag = (input: Parameters<typeof createProductTag>[1]) =>
  testDb.transaction((tx) => createProductTag(tx, input))

const updateTag = (id: string, input: Parameters<typeof updateProductTag>[2]) =>
  testDb.transaction((tx) => updateProductTag(tx, id, input))

const deleteTag = (id: string) => testDb.transaction((tx) => deleteProductTag(tx, id))

const addTag = (productId: string, tagId: string) =>
  testDb.transaction((tx) => addTagToProduct(tx, productId, tagId))

const addManyTags = (productId: string, tagIds: string[]) =>
  testDb.transaction((tx) => addManyTagsToProduct(tx, productId, tagIds))

const removeTag = (productId: string, tagId: string) =>
  testDb.transaction((tx) => removeTagFromProduct(tx, productId, tagId))

const replaceTags = (productId: string, tagIds: string[]) =>
  testDb.transaction((tx) => replaceProductTags(tx, productId, tagIds))

describe('Product Tags Service', () => {
  let user: TestUser

  beforeEach(async () => {
    user = await createTestUser()
  })

  // Names stay a parameter: the two-product tests need distinct slugs.
  function seedProduct(name = 'Produit Test') {
    return createTestProduct(user.id, { name })
  }

  describe('createProductTag', () => {
    it('should create a tag with a name only', async () => {
      const tag = await createTag({ label: 'Anti-âge' })

      expect(tag.id).toBeDefined()
      expect(tag.label).toBe('Anti-âge')
      expect(tag.slug).toBe('anti-age')
      expect(tag.tagType).toBe('')
    })

    it('should create a tag with a category', async () => {
      const tag = await createTag({ label: 'Peau grasse', tagType: 'skin_type' })

      expect(tag.label).toBe('Peau grasse')
      expect(tag.tagType).toBe('skin_type')
    })

    it('should use custom slug when provided', async () => {
      const tag = await createTag({ label: 'Éclat', slug: 'eclat-custom' })

      expect(tag.slug).toBe('eclat-custom')
    })

    it('should auto-generate slug from name', async () => {
      const tag = await createTag({ label: 'Rides et Ridules' })

      expect(tag.slug).toBe('rides-et-ridules')
    })

    it('should store createdAt timestamp', async () => {
      const tag = await createTag({ label: 'Hydratation' })

      expect(typeof tag.createdAt).toBe('string')
    })

    it('should throw tag_already_exists for duplicate slug', async () => {
      await createTag({ label: 'Acné', slug: 'acne' })

      try {
        await createTag({ label: 'Acné Bis', slug: 'acne' })
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(TagError)
        expect((e as TagError).code).toBe('tag_already_exists')
      }
    })
  })

  describe('getProductTagById', () => {
    it('should return the tag for a valid id', async () => {
      const created = await createTag({ label: 'Cicatrisant' })

      const fetched = await getProductTagById(testDb, created.id)

      expect(fetched).toBeDefined()
      expect(fetched?.id).toBe(created.id)
      expect(fetched?.label).toBe('Cicatrisant')
    })

    it('should return undefined for unknown id', async () => {
      const result = await getProductTagById(testDb, crypto.randomUUID())

      expect(result).toBeUndefined()
    })
  })

  describe('getProductTagBySlug', () => {
    it('should return the tag for a valid slug', async () => {
      const created = await createTag({ label: 'Sérum' })

      const fetched = await getProductTagBySlug(testDb, created.slug)

      expect(fetched).toBeDefined()
      expect(fetched?.id).toBe(created.id)
    })

    it('should return undefined for unknown slug', async () => {
      const result = await getProductTagBySlug(testDb, 'slug-inexistant')

      expect(result).toBeUndefined()
    })
  })

  describe('updateProductTag', () => {
    it('should update tag fields', async () => {
      const created = await createTag({ label: 'Rides' })

      const updated = await updateTag(created.id, {
        label: 'Rides et Ridules',
        tagType: 'concern',
      })

      expect(updated.label).toBe('Rides et Ridules')
      expect(updated.tagType).toBe('concern')
    })

    it('should throw tag_not_found for unknown id', async () => {
      try {
        await updateTag(crypto.randomUUID(), { label: 'X' })
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(TagError)
        expect((e as TagError).code).toBe('tag_not_found')
      }
    })

    it('should throw tag_already_exists when slug conflicts', async () => {
      await createTag({ label: 'Éclat', slug: 'eclat' })
      const t2 = await createTag({ label: 'Luminosité' })

      try {
        await updateTag(t2.id, { label: 'Éclat', slug: 'eclat' })
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(TagError)
        expect((e as TagError).code).toBe('tag_already_exists')
      }
    })
  })

  describe('deleteProductTag', () => {
    it('should delete an existing tag and return true', async () => {
      const created = await createTag({ label: 'Pores' })

      const result = await deleteTag(created.id)

      expect(result).toBe(true)
      expect(await getProductTagById(testDb, created.id)).toBeUndefined()
    })

    it('should return false for unknown id', async () => {
      const result = await deleteTag(crypto.randomUUID())

      expect(result).toBe(false)
    })
  })

  describe('addTagToProduct', () => {
    it('should link a tag to a product', async () => {
      const product = await seedProduct()
      const tag = await createTag({ label: 'Hydratation' })

      const link = await addTag(product.id, tag.id)

      expect(link).toBeDefined()
      expect(link?.productId).toBe(product.id)
      expect(link?.productTagId).toBe(tag.id)
    })
  })

  describe('addManyTagsToProduct', () => {
    it('should return an empty array when given no tag ids', async () => {
      const product = await seedProduct()

      const links = await addManyTags(product.id, [])

      expect(links).toEqual([])
    })

    it('should link multiple tags to a product at once', async () => {
      const product = await seedProduct()
      const t1 = await createTag({ label: 'Acné' })
      const t2 = await createTag({ label: 'Pores' })
      const t3 = await createTag({ label: 'Sébum' })

      const links = await addManyTags(product.id, [t1.id, t2.id, t3.id])

      expect(links).toHaveLength(3)
      const tagIds = links.map((l) => l.productTagId)
      expect(tagIds).toContain(t1.id)
      expect(tagIds).toContain(t2.id)
      expect(tagIds).toContain(t3.id)
    })
  })

  describe('listTagsByProduct', () => {
    it('should return an empty list when the product has no tags', async () => {
      const product = await seedProduct()

      const result = await listTagsByProduct(testDb, product.id)

      expect(result).toEqual([])
    })

    it('should return tags with joined tag information', async () => {
      const product = await seedProduct()
      const tag = await createTag({ label: 'Anti-âge', tagType: 'concern' })

      await addTag(product.id, tag.id)

      const result = await listTagsByProduct(testDb, product.id)

      expect(result).toHaveLength(1)
      expect(result[0]?.productId).toBe(product.id)
      expect(result[0]?.productTagId).toBe(tag.id)
      expect(result[0]?.tagName).toBe('Anti-âge')
      expect(result[0]?.tagSlug).toBe('anti-age')
      expect(result[0]?.tagCategory).toBe('concern')
    })

    it('should not return tags from other products', async () => {
      const p1 = await seedProduct('Produit A')
      const p2 = await seedProduct('Produit B')
      const tag = await createTag({ label: 'Test' })

      await addTag(p1.id, tag.id)

      const tagsForP2 = await listTagsByProduct(testDb, p2.id)

      expect(tagsForP2).toHaveLength(0)
    })
  })

  describe('listProductsByTag', () => {
    it('should return an empty list when no products have the tag', async () => {
      const tag = await createTag({ label: 'Orphan Tag' })

      const result = await listProductsByTag(testDb, tag.id)

      expect(result).toEqual([])
    })

    it('should return product links for a given tag', async () => {
      const p1 = await seedProduct('Produit A')
      const p2 = await seedProduct('Produit B')
      const tag = await createTag({ label: 'Commun' })

      await addTag(p1.id, tag.id)
      await addTag(p2.id, tag.id)

      const result = await listProductsByTag(testDb, tag.id)

      expect(result).toHaveLength(2)
      const productIds = result.map((r) => r.id)
      expect(productIds).toContain(p1.id)
      expect(productIds).toContain(p2.id)
    })
  })

  describe('removeTagFromProduct', () => {
    it('should remove a tag from a product and return true', async () => {
      const product = await seedProduct()
      const tag = await createTag({ label: 'À retirer' })

      await addTag(product.id, tag.id)
      const removed = await removeTag(product.id, tag.id)

      expect(removed).toBe(true)

      const remaining = await listTagsByProduct(testDb, product.id)
      expect(remaining).toHaveLength(0)
    })

    it('should return false when the link does not exist', async () => {
      const product = await seedProduct()
      const tag = await createTag({ label: 'Inexistant' })

      const result = await removeTag(product.id, tag.id)

      expect(result).toBe(false)
    })

    it('should only remove the specified tag, not others', async () => {
      const product = await seedProduct()
      const t1 = await createTag({ label: 'Garder' })
      const t2 = await createTag({ label: 'Retirer' })

      await addManyTags(product.id, [t1.id, t2.id])
      await removeTag(product.id, t2.id)

      const remaining = await listTagsByProduct(testDb, product.id)
      expect(remaining).toHaveLength(1)
      expect(remaining[0]?.productTagId).toBe(t1.id)
    })
  })

  describe('replaceProductTags', () => {
    it('should replace existing tags with new ones', async () => {
      const product = await seedProduct()
      const t1 = await createTag({ label: 'Ancien' })
      const t2 = await createTag({ label: 'Nouveau' })

      await addTag(product.id, t1.id)
      await replaceTags(product.id, [t2.id])

      const result = await listTagsByProduct(testDb, product.id)
      expect(result).toHaveLength(1)
      expect(result[0]?.productTagId).toBe(t2.id)
    })

    it('should clear all tags when given an empty array', async () => {
      const product = await seedProduct()
      const tag = await createTag({ label: 'À effacer' })

      await addTag(product.id, tag.id)
      const result = await replaceTags(product.id, [])

      expect(result).toEqual([])
      const remaining = await listTagsByProduct(testDb, product.id)
      expect(remaining).toHaveLength(0)
    })

    it('should handle replacing when no tags existed', async () => {
      const product = await seedProduct()
      const t1 = await createTag({ label: 'Premier' })
      const t2 = await createTag({ label: 'Deuxième' })

      const result = await replaceTags(product.id, [t1.id, t2.id])

      expect(result).toHaveLength(2)
    })
  })
})

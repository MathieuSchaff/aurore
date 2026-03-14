import { beforeEach, describe, expect, it } from 'bun:test'

import { createProduct } from '../../../features/products/service'
import {
  addManyTagsToProduct,
  addTagToProduct,
  createTag,
  deleteTag,
  getTagById,
  getTagBySlug,
  listProductsByTag,
  listTagsByProduct,
  removeTagFromProduct,
  replaceProductTags,
  updateTag,
} from '../../../features/products/tags/tags.service'
import { TagError } from '../../../features/products/tags/tags-error'
import { testDb } from '../../db.test.config'
import { createTestUser } from '../../helpers/test-factories'

// ─── Helper ───────────────────────────────────────────────────

async function makeProduct(userId: string, name = 'Produit Test') {
  return createProduct(
    userId,
    { name, brand: 'Generic', kind: 'complément', unit: 'gélule' },
    testDb
  )
}

// ─── Tests ────────────────────────────────────────────────────

describe('Tags Service', () => {
  // biome-ignore lint: testing
  let user: any

  beforeEach(async () => {
    user = await createTestUser()
  })

  // ─── createTag ────────────────────────────────────────────────

  describe('createTag', () => {
    it('should create a tag with a name only', async () => {
      const tag = await createTag(testDb, { name: 'Anti-âge' })

      expect(tag.id).toBeDefined()
      expect(tag.name).toBe('Anti-âge')
      expect(tag.slug).toBe('anti-age')
      expect(tag.category).toBeNull()
    })

    it('should create a tag with a category', async () => {
      const tag = await createTag(testDb, { name: 'Peau grasse', category: 'skin_type' })

      expect(tag.name).toBe('Peau grasse')
      expect(tag.category).toBe('skin_type')
    })

    it('should use custom slug when provided', async () => {
      const tag = await createTag(testDb, { name: 'Éclat', slug: 'eclat-custom' })

      expect(tag.slug).toBe('eclat-custom')
    })

    it('should auto-generate slug from name', async () => {
      const tag = await createTag(testDb, { name: 'Rides et Ridules' })

      expect(tag.slug).toBe('rides-et-ridules')
    })

    it('should store createdAt timestamp', async () => {
      const tag = await createTag(testDb, { name: 'Hydratation' })

      expect(tag.createdAt).toBeInstanceOf(Date)
    })

    it('should throw tag_already_exists for duplicate slug', async () => {
      await createTag(testDb, { name: 'Acné', slug: 'acne' })

      try {
        await createTag(testDb, { name: 'Acné Bis', slug: 'acne' })
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(TagError)
        expect((e as TagError).code).toBe('tag_already_exists')
      }
    })
  })

  // ─── getTagById ───────────────────────────────────────────────

  describe('getTagById', () => {
    it('should return the tag for a valid id', async () => {
      const created = await createTag(testDb, { name: 'Cicatrisant' })

      const fetched = await getTagById(testDb, created.id)

      expect(fetched).toBeDefined()
      expect(fetched?.id).toBe(created.id)
      expect(fetched?.name).toBe('Cicatrisant')
    })

    it('should return undefined for unknown id', async () => {
      const result = await getTagById(testDb, crypto.randomUUID())

      expect(result).toBeUndefined()
    })
  })

  // ─── getTagBySlug ─────────────────────────────────────────────

  describe('getTagBySlug', () => {
    it('should return the tag for a valid slug', async () => {
      const created = await createTag(testDb, { name: 'Sérum' })

      const fetched = await getTagBySlug(testDb, created.slug)

      expect(fetched).toBeDefined()
      expect(fetched?.id).toBe(created.id)
    })

    it('should return undefined for unknown slug', async () => {
      const result = await getTagBySlug(testDb, 'slug-inexistant')

      expect(result).toBeUndefined()
    })
  })

  // ─── updateTag ────────────────────────────────────────────────

  describe('updateTag', () => {
    it('should update tag fields', async () => {
      const created = await createTag(testDb, { name: 'Rides' })

      const updated = await updateTag(testDb, created.id, {
        name: 'Rides et Ridules',
        category: 'concern',
      })

      expect(updated.name).toBe('Rides et Ridules')
      expect(updated.category).toBe('concern')
    })

    it('should throw tag_not_found for unknown id', async () => {
      try {
        await updateTag(testDb, crypto.randomUUID(), { name: 'X' })
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(TagError)
        expect((e as TagError).code).toBe('tag_not_found')
      }
    })

    it('should throw tag_already_exists when slug conflicts', async () => {
      await createTag(testDb, { name: 'Éclat', slug: 'eclat' })
      const t2 = await createTag(testDb, { name: 'Luminosité' })

      try {
        await updateTag(testDb, t2.id, { name: 'Éclat', slug: 'eclat' })
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(TagError)
        expect((e as TagError).code).toBe('tag_already_exists')
      }
    })
  })

  // ─── deleteTag ────────────────────────────────────────────────

  describe('deleteTag', () => {
    it('should delete an existing tag and return true', async () => {
      const created = await createTag(testDb, { name: 'Pores' })

      const result = await deleteTag(testDb, created.id)

      expect(result).toBe(true)
      expect(await getTagById(testDb, created.id)).toBeUndefined()
    })

    it('should return false for unknown id', async () => {
      const result = await deleteTag(testDb, crypto.randomUUID())

      expect(result).toBe(false)
    })
  })

  // ─── addTagToProduct ──────────────────────────────────────────

  describe('addTagToProduct', () => {
    it('should link a tag to a product', async () => {
      const product = await makeProduct(user.id)
      const tag = await createTag(testDb, { name: 'Hydratation' })

      const link = await addTagToProduct(testDb, product.id, tag.id)

      expect(link).toBeDefined()
      expect(link?.productId).toBe(product.id)
      expect(link?.tagId).toBe(tag.id)
    })
  })

  // ─── addManyTagsToProduct ─────────────────────────────────────

  describe('addManyTagsToProduct', () => {
    it('should return an empty array when given no tag ids', async () => {
      const product = await makeProduct(user.id)

      const links = await addManyTagsToProduct(testDb, product.id, [])

      expect(links).toEqual([])
    })

    it('should link multiple tags to a product at once', async () => {
      const product = await makeProduct(user.id)
      const t1 = await createTag(testDb, { name: 'Acné' })
      const t2 = await createTag(testDb, { name: 'Pores' })
      const t3 = await createTag(testDb, { name: 'Sébum' })

      const links = await addManyTagsToProduct(testDb, product.id, [t1.id, t2.id, t3.id])

      expect(links).toHaveLength(3)
      const tagIds = links.map((l) => l.tagId)
      expect(tagIds).toContain(t1.id)
      expect(tagIds).toContain(t2.id)
      expect(tagIds).toContain(t3.id)
    })
  })

  // ─── listTagsByProduct ────────────────────────────────────────

  describe('listTagsByProduct', () => {
    it('should return an empty list when the product has no tags', async () => {
      const product = await makeProduct(user.id)

      const result = await listTagsByProduct(testDb, product.id)

      expect(result).toEqual([])
    })

    it('should return tags with joined tag information', async () => {
      const product = await makeProduct(user.id)
      const tag = await createTag(testDb, { name: 'Anti-âge', category: 'concern' })

      await addTagToProduct(testDb, product.id, tag.id)

      const result = await listTagsByProduct(testDb, product.id)

      expect(result).toHaveLength(1)
      expect(result[0]?.productId).toBe(product.id)
      expect(result[0]?.tagId).toBe(tag.id)
      expect(result[0]?.tagName).toBe('Anti-âge')
      expect(result[0]?.tagSlug).toBe('anti-age')
      expect(result[0]?.tagCategory).toBe('concern')
    })

    it('should not return tags from other products', async () => {
      const p1 = await makeProduct(user.id, 'Produit A')
      const p2 = await makeProduct(user.id, 'Produit B')
      const tag = await createTag(testDb, { name: 'Test' })

      await addTagToProduct(testDb, p1.id, tag.id)

      const tagsForP2 = await listTagsByProduct(testDb, p2.id)

      expect(tagsForP2).toHaveLength(0)
    })
  })

  // ─── listProductsByTag ────────────────────────────────────────

  describe('listProductsByTag', () => {
    it('should return an empty list when no products have the tag', async () => {
      const tag = await createTag(testDb, { name: 'Orphan Tag' })

      const result = await listProductsByTag(testDb, tag.id)

      expect(result).toEqual([])
    })

    it('should return product links for a given tag', async () => {
      const p1 = await makeProduct(user.id, 'Produit A')
      const p2 = await makeProduct(user.id, 'Produit B')
      const tag = await createTag(testDb, { name: 'Commun' })

      await addTagToProduct(testDb, p1.id, tag.id)
      await addTagToProduct(testDb, p2.id, tag.id)

      const result = await listProductsByTag(testDb, tag.id)

      expect(result).toHaveLength(2)
      const productIds = result.map((r) => r.id)
      expect(productIds).toContain(p1.id)
      expect(productIds).toContain(p2.id)
    })
  })

  // ─── removeTagFromProduct ─────────────────────────────────────

  describe('removeTagFromProduct', () => {
    it('should remove a tag from a product and return true', async () => {
      const product = await makeProduct(user.id)
      const tag = await createTag(testDb, { name: 'À retirer' })

      await addTagToProduct(testDb, product.id, tag.id)
      const removed = await removeTagFromProduct(testDb, product.id, tag.id)

      expect(removed).toBe(true)

      const remaining = await listTagsByProduct(testDb, product.id)
      expect(remaining).toHaveLength(0)
    })

    it('should return false when the link does not exist', async () => {
      const product = await makeProduct(user.id)
      const tag = await createTag(testDb, { name: 'Inexistant' })

      const result = await removeTagFromProduct(testDb, product.id, tag.id)

      expect(result).toBe(false)
    })

    it('should only remove the specified tag, not others', async () => {
      const product = await makeProduct(user.id)
      const t1 = await createTag(testDb, { name: 'Garder' })
      const t2 = await createTag(testDb, { name: 'Retirer' })

      await addManyTagsToProduct(testDb, product.id, [t1.id, t2.id])
      await removeTagFromProduct(testDb, product.id, t2.id)

      const remaining = await listTagsByProduct(testDb, product.id)
      expect(remaining).toHaveLength(1)
      expect(remaining[0]?.tagId).toBe(t1.id)
    })
  })

  // ─── replaceProductTags ───────────────────────────────────────

  describe('replaceProductTags', () => {
    it('should replace existing tags with new ones', async () => {
      const product = await makeProduct(user.id)
      const t1 = await createTag(testDb, { name: 'Ancien' })
      const t2 = await createTag(testDb, { name: 'Nouveau' })

      await addTagToProduct(testDb, product.id, t1.id)
      await replaceProductTags(testDb, product.id, [t2.id])

      const result = await listTagsByProduct(testDb, product.id)
      expect(result).toHaveLength(1)
      expect(result[0]?.tagId).toBe(t2.id)
    })

    it('should clear all tags when given an empty array', async () => {
      const product = await makeProduct(user.id)
      const tag = await createTag(testDb, { name: 'À effacer' })

      await addTagToProduct(testDb, product.id, tag.id)
      const result = await replaceProductTags(testDb, product.id, [])

      expect(result).toEqual([])
      const remaining = await listTagsByProduct(testDb, product.id)
      expect(remaining).toHaveLength(0)
    })

    it('should handle replacing when no tags existed', async () => {
      const product = await makeProduct(user.id)
      const t1 = await createTag(testDb, { name: 'Premier' })
      const t2 = await createTag(testDb, { name: 'Deuxième' })

      const result = await replaceProductTags(testDb, product.id, [t1.id, t2.id])

      expect(result).toHaveLength(2)
    })
  })
})

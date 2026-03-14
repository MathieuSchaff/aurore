import { beforeEach, describe, expect, it } from 'bun:test'

import {
  createIngredient,
  listIngredients,
  searchIngredients,
} from '../../../features/products/ingredients/service'
import { addTagToIngredient, createTag } from '../../../features/products/tags/tags.service'
import { testDb } from '../../db.test.config'
import { createTestUser } from '../../helpers/test-factories'

// ─── Helpers ──────────────────────────────────────────────────

// biome-ignore lint: testing
let user: any

async function makeIngredient(
  name: string,
  extra: { category?: string; description?: string; slug?: string } = {}
) {
  return createIngredient(user.id, { name, ...extra }, testDb)
}

async function makeTag(name: string, category?: string) {
  return createTag(testDb, { name, category })
}

// ─── Tests ────────────────────────────────────────────────────

describe('Ingredient Service — listIngredients / searchIngredients', () => {
  beforeEach(async () => {
    user = await createTestUser()
  })

  // ═══════════════════════════════════════════════════════════════
  // listIngredients
  // ═══════════════════════════════════════════════════════════════

  describe('listIngredients', () => {
    // ─── Shape & defaults ─────────────────────────────────────────

    it('should return the correct shape with defaults', async () => {
      await makeIngredient('Rétinol')

      const result = await listIngredients({}, testDb)

      expect(result).toHaveProperty('items')
      expect(result).toHaveProperty('total')
      expect(result.total).toBe(1)
      expect(result.items).toHaveLength(1)
    })

    it('should return an empty result when no ingredients exist', async () => {
      const result = await listIngredients({}, testDb)

      expect(result.total).toBe(0)
      expect(result.items).toEqual([])
    })

    it('should return all ingredients when no filters are given', async () => {
      await makeIngredient('Rétinol')
      await makeIngredient('Niacinamide')
      await makeIngredient('Zinc PCA')

      const result = await listIngredients({}, testDb)

      expect(result.total).toBe(3)
      expect(result.items).toHaveLength(3)
    })

    it('should return the correct summary fields per item', async () => {
      await makeIngredient('Rétinol', { category: 'actif', description: 'Un actif puissant' })

      const result = await listIngredients({}, testDb)
      const item = result.items[0]

      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('slug')
      expect(item).toHaveProperty('category')
      expect(item).toHaveProperty('description')
      expect(item?.name).toBe('Rétinol')
      expect(item?.category).toBe('actif')
      // should NOT have content, createdBy, etc.
      expect(item).not.toHaveProperty('content')
      expect(item).not.toHaveProperty('createdBy')
    })

    it('should truncate description to 120 characters', async () => {
      const longDesc = 'A'.repeat(200)
      await makeIngredient('Long Desc', { description: longDesc })

      const result = await listIngredients({}, testDb)

      expect(result.items[0]?.description?.length).toBe(120)
    })

    it('should order items by name', async () => {
      await makeIngredient('Zinc PCA')
      await makeIngredient('Acide Azélaïque')
      await makeIngredient('Niacinamide')

      const result = await listIngredients({}, testDb)

      expect(result.items[0]?.name).toBe('Acide Azélaïque')
      expect(result.items[1]?.name).toBe('Niacinamide')
      expect(result.items[2]?.name).toBe('Zinc PCA')
    })

    // ─── Pagination ───────────────────────────────────────────────

    it('should paginate correctly', async () => {
      await makeIngredient('Ingrédient A')
      await makeIngredient('Ingrédient B')
      await makeIngredient('Ingrédient C')

      const page1 = await listIngredients({ limit: 2, page: 1 }, testDb)
      const page2 = await listIngredients({ limit: 2, page: 2 }, testDb)

      expect(page1.items).toHaveLength(2)
      expect(page1.total).toBe(3)

      expect(page2.items).toHaveLength(1)
      expect(page2.total).toBe(3)
    })

    it('should return an empty page when page exceeds total', async () => {
      await makeIngredient('Seul ingrédient')

      const result = await listIngredients({ page: 99 }, testDb)

      expect(result.items).toEqual([])
      expect(result.total).toBe(1)
    })

    // ─── Filtre category ──────────────────────────────────────────

    it('should filter by single category', async () => {
      await makeIngredient('Rétinol', { category: 'actif' })
      await makeIngredient('Eau purifiée', { category: 'excipient' })

      const result = await listIngredients({ category: 'actif' }, testDb)

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Rétinol')
    })

    it('should filter by multiple categories (comma-separated)', async () => {
      await makeIngredient('Rétinol', { category: 'actif' })
      await makeIngredient('Vitamine C', { category: 'vitamine' })
      await makeIngredient('Eau purifiée', { category: 'excipient' })

      const result = await listIngredients({ category: 'actif,vitamine' }, testDb)

      expect(result.total).toBe(2)
    })

    it('should return nothing for non-existent category', async () => {
      await makeIngredient('Rétinol', { category: 'actif' })

      const result = await listIngredients({ category: 'inexistant' }, testDb)

      expect(result.total).toBe(0)
      expect(result.items).toEqual([])
    })

    // ─── Filtre par tags (concern, skinType, attribute) ───────────

    it('should filter by concern tag', async () => {
      const i1 = await makeIngredient('Rétinol')
      await makeIngredient('Eau purifiée')

      const tag = await makeTag('Anti-âge', 'concern')
      await addTagToIngredient(testDb, i1.id, tag.id)

      const result = await listIngredients({ concern: 'anti-age' }, testDb)

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Rétinol')
    })

    it('should filter by skinType tag', async () => {
      const i1 = await makeIngredient('Niacinamide')
      await makeIngredient('Panthénol')

      const tag = await makeTag('Peau grasse', 'skin_type')
      await addTagToIngredient(testDb, i1.id, tag.id)

      const result = await listIngredients({ skinType: 'peau-grasse' }, testDb)

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Niacinamide')
    })

    it('should filter by attribute tag', async () => {
      const i1 = await makeIngredient('Aloe Vera')
      await makeIngredient('Silicone')

      const tag = await makeTag('Naturel', 'attribute')
      await addTagToIngredient(testDb, i1.id, tag.id)

      const result = await listIngredients({ attribute: 'naturel' }, testDb)

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Aloe Vera')
    })

    it('should filter by multiple tag slugs (comma-separated)', async () => {
      const i1 = await makeIngredient('Rétinol Filter')
      const i2 = await makeIngredient('Acide Azélaïque Filter')
      await makeIngredient('Eau purifiée Filter')

      const t1 = await makeTag('Anti-âge Multi', 'concern')
      const t2 = await makeTag('Anti-taches Multi', 'concern')
      await addTagToIngredient(testDb, i1.id, t1.id)
      await addTagToIngredient(testDb, i2.id, t2.id)

      const result = await listIngredients({ concern: 'anti-age-multi,anti-taches-multi' }, testDb)

      expect(result.total).toBe(2)
    })

    // ─── Combinaisons de filtres ──────────────────────────────────

    it('should combine category + tag filters (AND)', async () => {
      const i1 = await makeIngredient('Rétinol Combo', { category: 'actif' })
      const i2 = await makeIngredient('Eau Combo', { category: 'excipient' })

      const tag = await makeTag('Anti-âge Combo', 'concern')
      await addTagToIngredient(testDb, i1.id, tag.id)
      await addTagToIngredient(testDb, i2.id, tag.id)

      // Les deux ont le tag, mais seul i1 a la catégorie 'actif'
      const result = await listIngredients({ category: 'actif', concern: 'anti-age-combo' }, testDb)

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Rétinol Combo')
    })

    it('should combine multiple tag filters across categories (AND)', async () => {
      const i1 = await makeIngredient('Niacinamide Cross')
      const i2 = await makeIngredient('Rétinol Cross')

      const concern = await makeTag('Pores Cross', 'concern')
      const skinType = await makeTag('Peau grasse Cross', 'skin_type')

      // i1 a les deux tags
      await addTagToIngredient(testDb, i1.id, concern.id)
      await addTagToIngredient(testDb, i1.id, skinType.id)
      // i2 n'a que concern
      await addTagToIngredient(testDb, i2.id, concern.id)

      const result = await listIngredients(
        { concern: 'pores-cross', skinType: 'peau-grasse-cross' },
        testDb
      )

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Niacinamide Cross')
    })

    it('should combine pagination with filters', async () => {
      for (let i = 0; i < 5; i++) {
        await makeIngredient(`Actif ${i}`, { category: 'actif' })
      }
      await makeIngredient('Excipient', { category: 'excipient' })

      const page1 = await listIngredients({ category: 'actif', limit: 3, page: 1 }, testDb)
      const page2 = await listIngredients({ category: 'actif', limit: 3, page: 2 }, testDb)

      expect(page1.total).toBe(5)
      expect(page1.items).toHaveLength(3)

      expect(page2.total).toBe(5)
      expect(page2.items).toHaveLength(2)
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // searchIngredients
  // ═══════════════════════════════════════════════════════════════

  describe('searchIngredients', () => {
    it('should return ingredients matching by name', async () => {
      await makeIngredient('Niacinamide')
      await makeIngredient('Zinc PCA')

      const results = await searchIngredients('niacin', testDb)

      expect(results).toHaveLength(1)
      expect(results[0]?.name).toBe('Niacinamide')
    })

    it('should return ingredients matching by slug', async () => {
      await makeIngredient('Acide Hyaluronique')

      const results = await searchIngredients('acide-hyaluronique', testDb)

      expect(results).toHaveLength(1)
      expect(results[0]?.slug).toBe('acide-hyaluronique')
    })

    it('should match both name and slug (OR)', async () => {
      // name contains "zinc", slug is "zinc-pca"
      await makeIngredient('Zinc PCA')
      // name doesn't contain "zinc" but slug does
      await makeIngredient('Pyrithione de zinc', { slug: 'zinc-pyrithione' })

      const results = await searchIngredients('zinc', testDb)

      expect(results).toHaveLength(2)
    })

    it('should be case-insensitive', async () => {
      await makeIngredient('Niacinamide')

      const results = await searchIngredients('NIACINAMIDE', testDb)

      expect(results).toHaveLength(1)
    })

    it('should return an empty array when nothing matches', async () => {
      await makeIngredient('Rétinol')

      const results = await searchIngredients('xyzzyx', testDb)

      expect(results).toEqual([])
    })

    it('should respect the limit parameter', async () => {
      await makeIngredient('Test A')
      await makeIngredient('Test B')
      await makeIngredient('Test C')

      const results = await searchIngredients('test', testDb, 2)

      expect(results).toHaveLength(2)
    })

    it('should use default limit of 10', async () => {
      for (let i = 0; i < 15; i++) {
        await makeIngredient(`Match ${String(i).padStart(2, '0')}`)
      }

      const results = await searchIngredients('match', testDb)

      expect(results).toHaveLength(10)
    })

    it('should order results by name', async () => {
      await makeIngredient('Zinc Search')
      await makeIngredient('Acide Search')
      await makeIngredient('Niacin Search')

      const results = await searchIngredients('search', testDb)

      expect(results[0]?.name).toBe('Acide Search')
      expect(results[1]?.name).toBe('Niacin Search')
      expect(results[2]?.name).toBe('Zinc Search')
    })

    it('should return the correct shape (id, name, slug, category)', async () => {
      await makeIngredient('Rétinol Shape', { category: 'actif' })

      const results = await searchIngredients('shape', testDb)

      expect(results).toHaveLength(1)
      const item = results[0]
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('slug')
      expect(item).toHaveProperty('category')
      // should NOT have description, content, createdBy, etc.
      expect(item).not.toHaveProperty('description')
      expect(item).not.toHaveProperty('content')
      expect(item).not.toHaveProperty('createdBy')
    })
  })
})

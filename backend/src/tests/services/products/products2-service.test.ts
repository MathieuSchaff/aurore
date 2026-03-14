import { beforeEach, describe, expect, it } from 'bun:test'

import { createIngredient } from '../../../features/products/ingredients/service'
import { addIngredientToProduct } from '../../../features/products/product-ingredients/product-ingredients.service'
import {
  createProduct,
  getFilterOptions,
  getProductWithIngredientsBySlug,
  listProducts,
  searchProducts,
} from '../../../features/products/service'
import { addTagToProduct, createTag } from '../../../features/products/tags/tags.service'
import { testDb } from '../../db.test.config'
import { createTestUser } from '../../helpers/test-factories'

// ─── Helpers ──────────────────────────────────────────────────

// biome-ignore lint: testing
let user: any

async function makeProduct(
  name: string,
  brand: string,
  kind = 'skincare',
  unit = 'pump',
  extra: Record<string, unknown> = {}
) {
  return createProduct(user.id, { name, brand, kind, unit, ...extra }, testDb)
}

async function makeIngredient(name: string) {
  return createIngredient(user.id, { name }, testDb)
}

async function makeTag(name: string, category?: string) {
  return createTag(testDb, { name, category })
}

// ─── Tests ────────────────────────────────────────────────────

describe('Product Service — listProducts / searchProducts / getFilterOptions / getProductWithIngredientsBySlug', () => {
  beforeEach(async () => {
    user = await createTestUser()
  })

  // ═══════════════════════════════════════════════════════════════
  // listProducts
  // ═══════════════════════════════════════════════════════════════

  describe('listProducts', () => {
    // ─── Pagination & shape ───────────────────────────────────────

    it('should return the correct shape with defaults', async () => {
      await makeProduct('Sérum A', 'BrandA')

      const result = await listProducts({}, testDb)

      expect(result).toHaveProperty('items')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('page')
      expect(result).toHaveProperty('limit')
      expect(result.page).toBe(1)
      expect(result.limit).toBe(20)
      expect(result.total).toBe(1)
      expect(result.items).toHaveLength(1)
    })

    it('should return all products when no filters are given', async () => {
      await makeProduct('Sérum A', 'BrandA')
      await makeProduct('Crème B', 'BrandB')
      await makeProduct('Lotion C', 'BrandC')

      const result = await listProducts({}, testDb)

      expect(result.total).toBe(3)
      expect(result.items).toHaveLength(3)
    })

    it('should return an empty result when no products exist', async () => {
      const result = await listProducts({}, testDb)

      expect(result.total).toBe(0)
      expect(result.items).toEqual([])
    })

    it('should paginate correctly', async () => {
      await makeProduct('Produit A', 'Brand')
      await makeProduct('Produit B', 'Brand')
      await makeProduct('Produit C', 'Brand')

      const page1 = await listProducts({ limit: 2, page: 1 }, testDb)
      const page2 = await listProducts({ limit: 2, page: 2 }, testDb)

      expect(page1.items).toHaveLength(2)
      expect(page1.total).toBe(3)
      expect(page1.page).toBe(1)

      expect(page2.items).toHaveLength(1)
      expect(page2.total).toBe(3)
      expect(page2.page).toBe(2)
    })

    it('should return an empty page when page exceeds total', async () => {
      await makeProduct('Seul produit', 'Brand')

      const result = await listProducts({ page: 99 }, testDb)

      expect(result.items).toEqual([])
      expect(result.total).toBe(1)
    })

    it('should order items by name', async () => {
      await makeProduct('Zinc Sérum', 'Brand')
      await makeProduct('Acide Sérum', 'Brand')
      await makeProduct('Niacin Sérum', 'Brand')

      const result = await listProducts({}, testDb)

      expect(result.items[0]?.name).toBe('Acide Sérum')
      expect(result.items[1]?.name).toBe('Niacin Sérum')
      expect(result.items[2]?.name).toBe('Zinc Sérum')
    })

    it('should return the correct summary fields per item', async () => {
      await makeProduct('Sérum Test', 'The Ordinary', 'skincare', 'pump', { priceCents: 1200 })

      const result = await listProducts({}, testDb)
      const item = result.items[0]

      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('slug')
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('brand')
      expect(item).toHaveProperty('kind')
      expect(item).toHaveProperty('unit')
      expect(item).toHaveProperty('priceCents')
      expect(item?.name).toBe('Sérum Test')
      expect(item?.brand).toBe('The Ordinary')
      expect(item?.priceCents).toBe(1200)
    })

    // ─── Filtre kind ──────────────────────────────────────────────

    it('should filter by single kind', async () => {
      await makeProduct('Sérum A', 'Brand', 'skincare')
      await makeProduct('Zinc', 'Brand', 'complément')

      const result = await listProducts({ kind: 'skincare' }, testDb)

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Sérum A')
    })

    it('should filter by multiple kinds (comma-separated string)', async () => {
      await makeProduct('Sérum A', 'BrandA', 'skincare')
      await makeProduct('Zinc', 'BrandB', 'complément')
      await makeProduct('Shampoing', 'BrandC', 'cheveux')

      const result = await listProducts({ kind: 'skincare,complément' }, testDb)

      expect(result.total).toBe(2)
    })

    it('should filter by multiple kinds (array)', async () => {
      await makeProduct('Sérum A', 'BrandA', 'skincare')
      await makeProduct('Zinc', 'BrandB', 'complément')
      await makeProduct('Shampoing', 'BrandC', 'cheveux')

      const result = await listProducts({ kind: ['skincare', 'complément'] }, testDb)

      expect(result.total).toBe(2)
    })

    // ─── Filtre brand ─────────────────────────────────────────────

    it('should filter by single brand', async () => {
      await makeProduct('Sérum A', 'The Ordinary', 'skincare')
      await makeProduct('Sérum B', 'CeraVe', 'skincare')

      const result = await listProducts({ brand: 'CeraVe' }, testDb)

      expect(result.total).toBe(1)
      expect(result.items[0]?.brand).toBe('CeraVe')
    })

    it('should filter by multiple brands (array)', async () => {
      await makeProduct('Sérum A', 'The Ordinary', 'skincare')
      await makeProduct('Sérum B', 'CeraVe', 'skincare')
      await makeProduct('Sérum C', 'La Roche-Posay', 'skincare')

      const result = await listProducts({ brand: ['The Ordinary', 'CeraVe'] }, testDb)

      expect(result.total).toBe(2)
    })

    // ─── Filtre ingredient ────────────────────────────────────────

    it('should filter by ingredient slug', async () => {
      const p1 = await makeProduct('Sérum Niacin', 'Brand')
      const p2 = await makeProduct('Crème Zinc', 'Brand')
      const niacin = await makeIngredient('Niacinamide')
      const zinc = await makeIngredient('Zinc PCA')

      await addIngredientToProduct(testDb, { productId: p1.id, ingredientId: niacin.id })
      await addIngredientToProduct(testDb, { productId: p2.id, ingredientId: zinc.id })

      const result = await listProducts({ ingredient: 'niacinamide' }, testDb)

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Sérum Niacin')
    })

    it('should filter by multiple ingredient slugs', async () => {
      const p1 = await makeProduct('Sérum Niacin', 'Brand')
      const p2 = await makeProduct('Crème Zinc', 'Brand')
      const p3 = await makeProduct('Lotion Panthénol', 'Brand')
      const niacin = await makeIngredient('Niacinamide')
      const zinc = await makeIngredient('Zinc PCA')
      const panthenol = await makeIngredient('Panthénol')

      await addIngredientToProduct(testDb, { productId: p1.id, ingredientId: niacin.id })
      await addIngredientToProduct(testDb, { productId: p2.id, ingredientId: zinc.id })
      await addIngredientToProduct(testDb, { productId: p3.id, ingredientId: panthenol.id })

      const result = await listProducts({ ingredient: ['niacinamide', 'zinc-pca'] }, testDb)

      expect(result.total).toBe(2)
    })

    // ─── Filtre tag (par catégorie) ───────────────────────────────

    it('should filter by concern tag', async () => {
      const p1 = await makeProduct('Sérum Anti-âge', 'BrandA')
      await makeProduct('Crème Hydratante', 'BrandB')

      const tag = await makeTag('Anti-âge', 'concern')
      await addTagToProduct(testDb, p1.id, tag.id)

      const result = await listProducts({ concern: 'anti-age' }, testDb)

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Sérum Anti-âge')
    })

    it('should filter by skin_type tag', async () => {
      const p1 = await makeProduct('Sérum Peau Grasse', 'BrandA')
      await makeProduct('Crème Universelle', 'BrandB')

      const tag = await makeTag('Peau grasse', 'skin_type')
      await addTagToProduct(testDb, p1.id, tag.id)

      const result = await listProducts({ skin_type: 'peau-grasse' }, testDb)

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Sérum Peau Grasse')
    })

    it('should filter by routine_step tag', async () => {
      const p1 = await makeProduct('Nettoyant Visage', 'BrandA')
      await makeProduct('Sérum Nuit', 'BrandB')

      const tag = await makeTag('Nettoyage', 'routine_step')
      await addTagToProduct(testDb, p1.id, tag.id)

      const result = await listProducts({ routine_step: 'nettoyage' }, testDb)

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Nettoyant Visage')
    })

    it('should filter by attribute tag', async () => {
      const p1 = await makeProduct('Sérum Bio', 'BrandA')
      await makeProduct('Sérum Standard', 'BrandB')

      const tag = await makeTag('Bio', 'attribute')
      await addTagToProduct(testDb, p1.id, tag.id)

      const result = await listProducts({ attribute: 'bio' }, testDb)

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Sérum Bio')
    })

    it('should filter by product_type tag', async () => {
      const p1 = await makeProduct('Sérum Visage', 'BrandA')
      await makeProduct('Crème Corps', 'BrandB')

      const tag = await makeTag('Sérum', 'product_type')
      await addTagToProduct(testDb, p1.id, tag.id)

      const result = await listProducts({ product_type: 'serum' }, testDb)

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Sérum Visage')
    })

    it('should filter by skin_zone tag', async () => {
      const p1 = await makeProduct('Contour Yeux', 'BrandA')
      await makeProduct('Crème Visage', 'BrandB')

      const tag = await makeTag('Contour des yeux', 'skin_zone')
      await addTagToProduct(testDb, p1.id, tag.id)

      const result = await listProducts({ skin_zone: 'contour-des-yeux' }, testDb)

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Contour Yeux')
    })

    it('should filter by multiple tag slugs in the same category', async () => {
      const p1 = await makeProduct('Sérum Anti-âge', 'BrandA')
      const p2 = await makeProduct('Sérum Anti-taches', 'BrandB')
      await makeProduct('Crème Basique', 'BrandC')

      const t1 = await makeTag('Anti-âge', 'concern')
      const t2 = await makeTag('Anti-taches', 'concern')
      await addTagToProduct(testDb, p1.id, t1.id)
      await addTagToProduct(testDb, p2.id, t2.id)

      const result = await listProducts({ concern: 'anti-age,anti-taches' }, testDb)

      expect(result.total).toBe(2)
    })

    // ─── Combinaison de filtres ───────────────────────────────────

    it('should combine kind + brand filters (AND)', async () => {
      await makeProduct('Sérum A', 'The Ordinary', 'skincare')
      await makeProduct('Zinc', 'The Ordinary', 'complément')
      await makeProduct('Sérum B', 'CeraVe', 'skincare')

      const result = await listProducts({ kind: 'skincare', brand: 'The Ordinary' }, testDb)

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Sérum A')
    })

    it('should combine kind + tag filters (AND)', async () => {
      const p1 = await makeProduct('Sérum Anti-âge', 'BrandA', 'skincare')
      await makeProduct('Zinc Anti-âge', 'BrandB', 'complément')

      const tag = await makeTag('Anti-âge', 'concern')
      await addTagToProduct(testDb, p1.id, tag.id)

      // Le complément n'a pas le tag, donc seul skincare + tag matche
      const result = await listProducts({ kind: 'skincare', concern: 'anti-age' }, testDb)

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Sérum Anti-âge')
    })

    it('should combine ingredient + kind filters (AND)', async () => {
      const p1 = await makeProduct('Sérum Niacin', 'BrandA', 'skincare')
      const p2 = await makeProduct('Gélules Niacin', 'BrandB', 'complément')
      const niacin = await makeIngredient('Niacinamide Combo')

      await addIngredientToProduct(testDb, { productId: p1.id, ingredientId: niacin.id })
      await addIngredientToProduct(testDb, { productId: p2.id, ingredientId: niacin.id })

      const result = await listProducts(
        { kind: 'skincare', ingredient: 'niacinamide-combo' },
        testDb
      )

      expect(result.total).toBe(1)
      expect(result.items[0]?.name).toBe('Sérum Niacin')
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // searchProducts
  // ═══════════════════════════════════════════════════════════════

  describe('searchProducts', () => {
    it('should return products matching by name', async () => {
      await makeProduct('Niacinamide 10%', 'The Ordinary', 'skincare')
      await makeProduct('Zinc Sérum', 'Brand', 'skincare')

      const results = await searchProducts({ q: 'niacin' }, testDb)

      expect(results).toHaveLength(1)
      expect(results[0]?.name).toBe('Niacinamide 10%')
    })

    it('should return products matching by brand', async () => {
      await makeProduct('Sérum A', 'The Ordinary', 'skincare')
      await makeProduct('Sérum B', 'CeraVe', 'skincare')

      const results = await searchProducts({ q: 'ordinary' }, testDb)

      expect(results).toHaveLength(1)
      expect(results[0]?.brand).toBe('The Ordinary')
    })

    it('should match both name and brand (OR)', async () => {
      await makeProduct('CeraVe Lotion', 'Generic', 'skincare')
      await makeProduct('Sérum B', 'CeraVe', 'skincare')

      const results = await searchProducts({ q: 'cerave' }, testDb)

      expect(results).toHaveLength(2)
    })

    it('should be case-insensitive', async () => {
      await makeProduct('Niacinamide Sérum', 'Brand', 'skincare')

      const results = await searchProducts({ q: 'NIACINAMIDE' }, testDb)

      expect(results).toHaveLength(1)
    })

    it('should return an empty array when nothing matches', async () => {
      await makeProduct('Sérum A', 'Brand', 'skincare')

      const results = await searchProducts({ q: 'xyzzyx' }, testDb)

      expect(results).toEqual([])
    })

    it('should respect the limit parameter', async () => {
      await makeProduct('Test A', 'BrandA', 'skincare')
      await makeProduct('Test B', 'BrandB', 'skincare')
      await makeProduct('Test C', 'BrandC', 'skincare')

      const results = await searchProducts({ q: 'test', limit: 2 }, testDb)

      expect(results).toHaveLength(2)
    })

    it('should use default limit of 8', async () => {
      // Créer 10 produits
      for (let i = 0; i < 10; i++) {
        await makeProduct(`Match ${i}`, `Brand${i}`, 'skincare')
      }

      const results = await searchProducts({ q: 'match' }, testDb)

      expect(results).toHaveLength(8)
    })

    it('should prioritize exact match over prefix over partial', async () => {
      await makeProduct('Zinc PCA Sérum', 'Brand', 'skincare')
      await makeProduct('Zinc', 'Solgar', 'complément')
      await makeProduct('Zinc Bisglycinate', 'Brand', 'complément')

      const results = await searchProducts({ q: 'zinc' }, testDb)

      // exact match "Zinc" first
      expect(results[0]?.name).toBe('Zinc')
      // prefix matches next (Zinc Bisglycinate, Zinc PCA Sérum)
      expect(results[1]?.name).toBe('Zinc Bisglycinate')
      expect(results[2]?.name).toBe('Zinc PCA Sérum')
    })

    it('should return the correct shape (id, name, brand, kind, slug)', async () => {
      await makeProduct('Sérum Test', 'The Ordinary', 'skincare')

      const results = await searchProducts({ q: 'sérum' }, testDb)

      expect(results).toHaveLength(1)
      const item = results[0]
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('brand')
      expect(item).toHaveProperty('kind')
      expect(item).toHaveProperty('slug')
      // should NOT have priceCents, unit, etc.
      expect(item).not.toHaveProperty('priceCents')
      expect(item).not.toHaveProperty('unit')
      expect(item).not.toHaveProperty('description')
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // getFilterOptions
  // ═══════════════════════════════════════════════════════════════

  describe('getFilterOptions', () => {
    it('should return empty arrays when no data exists', async () => {
      const options = await getFilterOptions(testDb)

      expect(options.kinds).toEqual([])
      expect(options.brands).toEqual([])
      expect(options.tags).toEqual({
        routine_step: [],
        attribute: [],
        skin_type: [],
        skin_zone: [],
        product_type: [],
        concern: [],
      })
    })

    it('should return distinct kinds', async () => {
      await makeProduct('Sérum A', 'BrandA', 'skincare')
      await makeProduct('Sérum B', 'BrandB', 'skincare')
      await makeProduct('Zinc', 'BrandC', 'complément')

      const options = await getFilterOptions(testDb)

      expect(options.kinds).toHaveLength(2)
      expect(options.kinds).toContain('skincare')
      expect(options.kinds).toContain('complément')
    })

    it('should return distinct brands', async () => {
      await makeProduct('Sérum A', 'The Ordinary', 'skincare')
      await makeProduct('Sérum B', 'The Ordinary', 'skincare', 'pump', { slug: 'serum-b-to' })
      await makeProduct('Crème', 'CeraVe', 'skincare')

      const options = await getFilterOptions(testDb)

      expect(options.brands).toHaveLength(2)
      expect(options.brands).toContain('The Ordinary')
      expect(options.brands).toContain('CeraVe')
    })

    it('should return tags grouped by category', async () => {
      await makeTag('Anti-âge', 'concern')
      await makeTag('Rides', 'concern')
      await makeTag('Peau grasse', 'skin_type')
      await makeTag('Nettoyage', 'routine_step')

      const options = await getFilterOptions(testDb)

      expect(options.tags.concern).toHaveLength(2)
      expect(options.tags.skin_type).toHaveLength(1)
      expect(options.tags.routine_step).toHaveLength(1)
      expect(options.tags.attribute).toEqual([])
      expect(options.tags.product_type).toEqual([])
      expect(options.tags.skin_zone).toEqual([])
    })

    it('should return tag name and slug in each category', async () => {
      await makeTag('Anti-âge', 'concern')

      const options = await getFilterOptions(testDb)

      expect(options.tags.concern[0]).toEqual({ name: 'Anti-âge', slug: 'anti-age' })
    })

    it('should ignore tags with unknown categories', async () => {
      await makeTag('Orphelin', 'unknown_category')

      const options = await getFilterOptions(testDb)

      // Toutes les catégories connues restent vides
      const allTags = Object.values(options.tags).flat()
      expect(allTags).toHaveLength(0)
    })

    it('should ignore tags without category', async () => {
      await makeTag('Sans catégorie')

      const options = await getFilterOptions(testDb)

      const allTags = Object.values(options.tags).flat()
      expect(allTags).toHaveLength(0)
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // getProductWithIngredientsBySlug
  // ═══════════════════════════════════════════════════════════════

  describe('getProductWithIngredientsBySlug', () => {
    it('should return the product with an empty ingredients array', async () => {
      const product = await makeProduct('Sérum Nu', 'Brand')

      const result = await getProductWithIngredientsBySlug(product.slug, testDb)

      expect(result.id).toBe(product.id)
      expect(result.slug).toBe(product.slug)
      expect(result.name).toBe('Sérum Nu')
      expect(result.ingredients).toEqual([])
    })

    it('should return the product with its ingredients', async () => {
      const product = await makeProduct('Sérum Complet', 'Brand')
      const niacin = await makeIngredient('Niacinamide Full')
      const zinc = await makeIngredient('Zinc Full')

      await addIngredientToProduct(testDb, {
        productId: product.id,
        ingredientId: niacin.id,
        concentrationValue: '10',
        concentrationUnit: '%',
      })
      await addIngredientToProduct(testDb, {
        productId: product.id,
        ingredientId: zinc.id,
      })

      const result = await getProductWithIngredientsBySlug(product.slug, testDb)

      expect(result.name).toBe('Sérum Complet')
      expect(result.ingredients).toHaveLength(2)

      const ingredientNames = result.ingredients.map(
        (i: { ingredientName: string }) => i.ingredientName
      )
      expect(ingredientNames).toContain('Niacinamide Full')
      expect(ingredientNames).toContain('Zinc Full')
    })

    it('should include joined ingredient fields', async () => {
      const product = await makeProduct('Sérum Détail', 'Brand')
      const ingredient = await createIngredient(
        user.id,
        { name: 'Acide Hyaluronique Detail', category: 'actif', description: 'Hydratant' },
        testDb
      )

      await addIngredientToProduct(testDb, {
        productId: product.id,
        ingredientId: ingredient.id,
        concentrationValue: '1',
        concentrationUnit: '%',
      })

      const result = await getProductWithIngredientsBySlug(product.slug, testDb)

      const ing = result.ingredients[0]
      expect(ing?.ingredientName).toBe('Acide Hyaluronique Detail')
      expect(ing?.ingredientSlug).toBe('acide-hyaluronique-detail')
      expect(ing?.ingredientCategory).toBe('actif')
      expect(ing?.ingredientDescription).toBe('Hydratant')
      expect(ing?.concentrationValue).toBe('1')
      expect(ing?.concentrationUnit).toBe('%')
    })

    it('should throw ProductError for unknown slug', async () => {
      const { ProductError } = await import('../../../features/products/product-error')

      expect(getProductWithIngredientsBySlug('slug-inexistant', testDb)).rejects.toThrow(
        ProductError
      )
    })
  })
})

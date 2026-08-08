import { beforeEach, describe, expect, it } from 'bun:test'

import { createProductSchema } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { productEdits, products } from '../../../db/schema/products'
import { productTagLinks, productTagTypes } from '../../../db/schema/tags/tags'
import { createProductTag, replaceProductTags } from '../../../features/product-tags/service'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  BODYCARE,
  COMPLEMENT,
  DENTAL,
  HAIRCARE,
  SOLAIRE,
} from '../../../tests/helpers/product-shapes'
import {
  createTestIngredient,
  createTestProduct,
  createTestUser,
  type TestUser,
} from '../../../tests/helpers/test-factories'
import { ProductError } from '../product-error'
import { addIngredientToProduct } from '../product-ingredients/product-ingredients.service'
import {
  deleteProduct,
  findSimilarProducts,
  getDistinctBrands,
  getFilterOptions,
  getProductById,
  getProductBySlug,
  getProductFullBySlug,
  listProducts,
  searchProducts,
  updateProduct,
} from '../service'

type ListFilters = Parameters<typeof listProducts>[0]

const LIST_BASE = { category: 'skincare', page: 1, limit: 20 } as const

setupDbTests()

describe('Product Service', () => {
  let user: TestUser

  beforeEach(async () => {
    user = await createTestUser()
  })

  function list(overrides: Partial<ListFilters> = {}, userId?: string) {
    return listProducts({ ...LIST_BASE, ...overrides }, testDb, userId)
  }

  const createTag = (input: Parameters<typeof createProductTag>[1]) =>
    testDb.transaction((tx) => createProductTag(tx, input))

  const replaceTags = (productId: string, tagsInput: Parameters<typeof replaceProductTags>[2]) =>
    testDb.transaction((tx) => replaceProductTags(tx, productId, tagsInput))

  describe('createProduct', () => {
    it('should create a product with minimal fields', async () => {
      const product = await createTestProduct(user.id, {
        name: 'Vitamine C',
        brand: 'Generic',
        ...COMPLEMENT,
      })

      expect(product.id).toBeDefined()
      expect(product.name).toBe('Vitamine C')
      expect(product.createdBy).toBe(user.id)
      expect(product.slug).toBe('vitamine-c-generic')
    })

    it('should auto-generate slug from name and brand', async () => {
      const product = await createTestProduct(user.id, {
        name: 'Acide Hyaluronique',
        brand: 'The Ordinary',
      })
      expect(product.slug).toBe('acide-hyaluronique-the-ordinary')
    })

    it('should throw product_already_exists for duplicate name+brand', async () => {
      await createTestProduct(user.id, { name: 'Vitamine D3', brand: 'Solgar' })
      expect(createTestProduct(user.id, { name: 'Vitamine D3', brand: 'Solgar' })).rejects.toThrow(
        ProductError
      )
    })

    // Auto-tag pipeline runs inline at create. `type-serum` is emitted
    // deterministically by pass 3 (kind-tag-detection) for any skincare serum,
    // so this proves the wiring without depending on INCI parsing.
    it('writes auto-tags when matching defs exist', async () => {
      await testDb.insert(productTagTypes).values({
        slug: 'type-serum',
        label: 'Sérum',
        tagType: 'product_type_v2',
      })

      const product = await createTestProduct(user.id, {
        name: 'Serum Test',
        brand: 'Auto-Tag Brand',
      })

      const pairs = await testDb
        .select({ slug: productTagTypes.slug, relevance: productTagLinks.relevance })
        .from(productTagLinks)
        .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
        .where(eq(productTagLinks.productId, product.id))

      expect(pairs).toEqual([{ slug: 'type-serum', relevance: 'primary' }])
    })

    // Fail-soft contract: when no product_tags_defs exist for the slugs the
    // orchestrator emits, write silently inserts zero rows instead of throwing.
    // Product creation must still succeed.
    it('fails soft when no tag defs exist (product still returned)', async () => {
      const product = await createTestProduct(user.id, {
        name: 'Serum Orphan',
        brand: 'No Defs',
      })

      expect(product.id).toBeDefined()

      const pairs = await testDb
        .select()
        .from(productTagLinks)
        .where(eq(productTagLinks.productId, product.id))

      expect(pairs).toHaveLength(0)
    })
  })

  describe('Retrieval', () => {
    it('should return the product by id', async () => {
      const created = await createTestProduct(user.id, { name: 'Magnésium', brand: 'Solgar' })
      const fetched = await testDb.transaction((tx) => getProductById(created.id, tx))
      expect(fetched.id).toBe(created.id)
    })

    it('should return the product by slug', async () => {
      const created = await createTestProduct(user.id, { name: 'Coenzyme Q10', brand: 'Solgar' })
      const fetched = await getProductBySlug(created.slug, testDb)
      expect(fetched.id).toBe(created.id)
    })
  })

  describe('updateProduct', () => {
    it('should update product fields', async () => {
      const created = await createTestProduct(user.id, { name: 'Fer', brand: 'Generic' })
      const updated = await testDb.transaction((tx) =>
        updateProduct(user.id, created.id, { brand: 'Solgar', priceCents: 1800 }, undefined, tx)
      )
      expect(updated.brand).toBe('Solgar')
      expect(updated.priceCents).toBe(1800)
    })

    it('should create an audit log when fields change', async () => {
      const created = await createTestProduct(user.id, { name: 'Spiruline', brand: 'Generic' })
      await testDb.transaction((tx) =>
        updateProduct(user.id, created.id, { description: 'Riche' }, 'Edit', tx)
      )

      const edits = await testDb
        .select()
        .from(productEdits)
        .where(eq(productEdits.productId, created.id))
      expect(edits).toHaveLength(1)
    })

    it('should NOT regenerate slug when only name changes (stable URL)', async () => {
      const created = await createTestProduct(user.id, { name: 'Vitamine C', brand: 'Generic' })
      const originalSlug = created.slug
      const updated = await testDb.transaction((tx) =>
        updateProduct(user.id, created.id, { name: 'Vitamine C plus' }, undefined, tx)
      )
      expect(updated.name).toBe('Vitamine C plus')
      expect(updated.slug).toBe(originalSlug)
    })

    it('should slugify and update slug when explicitly provided', async () => {
      const created = await createTestProduct(user.id, { name: 'Magnésium', brand: 'Generic' })
      const updated = await testDb.transaction((tx) =>
        updateProduct(user.id, created.id, { slug: 'Magnésium Bisglycinate' }, undefined, tx)
      )
      expect(updated.slug).toBe('magnesium-bisglycinate')
    })

    // Legacy rows predate the comma-or-short inci write rule and carry a long
    // space-separated inci that inciBase now rejects. A notes-only edit must
    // leave that untouched field alone: updateProduct only normalizes/validates
    // inci when it is present in the payload, so the stored value survives verbatim.
    it('preserves a non-conforming stored inci on a notes-only edit', async () => {
      const legacyInci =
        'AQUA GLYCERIN CETEARYL ALCOHOL DIMETHICONE PHENOXYETHANOL TOCOPHEROL BUTYROSPERMUM PARKII BUTTER CAPRYLIC CAPRIC TRIGLYCERIDE SODIUM HYALURONATE'
      // Fixture must be the shape the current rule rejects: long and comma-free.
      expect(legacyInci.length).toBeGreaterThan(100)
      expect(legacyInci).not.toContain(',')

      const [row] = await testDb
        .insert(products)
        .values({
          createdBy: user.id,
          name: 'Legacy Cream',
          brand: 'Generic',
          category: 'skincare',
          kind: 'serum',
          unit: 'pump',
          slug: 'legacy-noncomforming-inci',
          inci: legacyInci,
        })
        .returning()
      if (!row) throw new Error('insert failed')

      const updated = await testDb.transaction((tx) =>
        updateProduct(user.id, row.id, { notes: 'safe edit' }, undefined, tx)
      )

      expect(updated.notes).toBe('safe edit')
      expect(updated.inci).toBe(legacyInci)
    })
  })

  describe('deleteProduct', () => {
    it('should permanently remove the product', async () => {
      const created = await createTestProduct(user.id, { name: 'Sélénium', brand: 'Solgar' })
      await testDb.transaction((tx) => deleteProduct(tx, 'admin', created.id))
      expect(testDb.transaction((tx) => getProductById(created.id, tx))).rejects.toThrow(
        ProductError
      )
    })
  })

  describe('listProducts', () => {
    // Three priced rows spanning the ranges the filters slice on.
    async function seedPriceRange() {
      await createTestProduct(user.id, { name: 'Pas cher', brand: 'A', priceCents: 500 })
      await createTestProduct(user.id, { name: 'Moyen', brand: 'B', priceCents: 2000 })
      await createTestProduct(user.id, { name: 'Cher', brand: 'C', priceCents: 5000 })
    }

    // Same idea with a NULL price in the middle, to pin NULLs-last ordering.
    async function seedPricesWithNull() {
      await createTestProduct(user.id, { name: 'Cher', brand: 'A', priceCents: 5000 })
      await createTestProduct(user.id, { name: 'Sans prix', brand: 'B' })
      await createTestProduct(user.id, { name: 'Pas cher', brand: 'C', priceCents: 1000 })
    }

    it('should return paginated items', async () => {
      await createTestProduct(user.id, { name: 'Sérum A', brand: 'BrandA' })
      const result = await list()
      expect(result.items).toHaveLength(1)
      expect(result.total).toBe(1)
    })

    it('should filter by brand', async () => {
      await createTestProduct(user.id, { name: 'Sérum A', brand: 'The Ordinary' })
      await createTestProduct(user.id, { name: 'Sérum B', brand: 'CeraVe' })
      const result = await list({ brand: 'CeraVe' })
      expect(result.total).toBe(1)
      expect(result.items[0]?.brand).toBe('CeraVe')
    })

    it('should filter by kind', async () => {
      await createTestProduct(user.id, { name: 'Sérum A', brand: 'Brand' })
      await createTestProduct(user.id, { name: 'Zinc', brand: 'Brand', ...COMPLEMENT })
      const result = await list({ kind: 'serum' })
      expect(result.total).toBe(1)
    })

    describe('q (free-text)', () => {
      it('should match products whose name contains q (case-insensitive)', async () => {
        await createTestProduct(user.id, { name: 'Sérum Matifiant', brand: 'BrandA' })
        await createTestProduct(user.id, { name: 'Crème hydratante', brand: 'BrandB' })
        const result = await list({ q: 'matifi' })
        expect(result.items.map((p) => p.name)).toEqual(['Sérum Matifiant'])
      })

      it('should match products whose brand contains q', async () => {
        await createTestProduct(user.id, { name: 'Crème jour', brand: 'Matifico' })
        await createTestProduct(user.id, { name: 'Crème nuit', brand: 'OtherBrand' })
        const result = await list({ q: 'matifi' })
        expect(result.items.map((p) => p.name)).toEqual(['Crème jour'])
      })

      it('should match products whose name contains q without accents', async () => {
        await createTestProduct(user.id, { name: 'Sérum réparateur', brand: 'BrandA' })
        await createTestProduct(user.id, { name: 'Crème hydratante', brand: 'BrandB' })
        const result = await list({ q: 'serum' })
        expect(result.items.map((p) => p.name)).toEqual(['Sérum réparateur'])
      })

      // ?q= must recall what the search dropdown recalls, otherwise
      // "Voir tous les résultats" loses the typo matches the user just saw.
      it('should match typo queries via trigram like the dropdown', async () => {
        await createTestProduct(user.id, { name: 'Niacinamide 10%', brand: 'The Ordinary' })
        const result = await list({ q: 'niacynamid' })
        expect(result.items.map((p) => p.name)).toEqual(['Niacinamide 10%'])
      })

      it('should order by relevance when q is set without explicit sort', async () => {
        await createTestProduct(user.id, { name: 'Le Sérum', brand: 'BrandA' })
        await createTestProduct(user.id, { name: 'Sérum', brand: 'BrandC' })
        const result = await list({ q: 'serum' })
        expect(result.items.map((p) => p.name)).toEqual(['Sérum', 'Le Sérum'])
      })

      it('should order by relevance when sort=relevance with q', async () => {
        await createTestProduct(user.id, { name: 'Le Sérum', brand: 'BrandA' })
        await createTestProduct(user.id, { name: 'Sérum', brand: 'BrandC' })
        const result = await list({ q: 'serum', sort: 'relevance' })
        expect(result.items.map((p) => p.name)).toEqual(['Sérum', 'Le Sérum'])
      })

      it('should sort alphabetically when sort=name is explicit even with q', async () => {
        await createTestProduct(user.id, { name: 'Sérum', brand: 'BrandC' })
        await createTestProduct(user.id, { name: 'Le Sérum', brand: 'BrandA' })
        const result = await list({ q: 'serum', sort: 'name' })
        expect(result.items.map((p) => p.name)).toEqual(['Le Sérum', 'Sérum'])
      })

      it('should keep an explicit sort=newest even with q', async () => {
        await createTestProduct(user.id, { name: 'Sérum', brand: 'BrandC' })
        await new Promise((r) => setTimeout(r, 5))
        await createTestProduct(user.id, { name: 'Le Sérum', brand: 'BrandA' })
        const result = await list({ q: 'serum', sort: 'newest' })
        expect(result.items.map((p) => p.name)).toEqual(['Le Sérum', 'Sérum'])
      })

      it('should fall back to name order when sort=relevance without q', async () => {
        await createTestProduct(user.id, { name: 'Sérum', brand: 'BrandC' })
        await createTestProduct(user.id, { name: 'Le Sérum', brand: 'BrandA' })
        const result = await list({ sort: 'relevance' })
        expect(result.items.map((p) => p.name)).toEqual(['Le Sérum', 'Sérum'])
      })

      it('should return empty when q matches nothing', async () => {
        await createTestProduct(user.id, { name: 'Sérum', brand: 'Brand' })
        const result = await list({ q: 'xyzqwerty' })
        expect(result.items).toHaveLength(0)
      })
    })

    describe('price range', () => {
      it('should filter by priceMin', async () => {
        await seedPriceRange()
        const result = await list({ limit: 10, priceMin: 1500 })
        expect(result.items.map((p) => p.name).sort()).toEqual(['Cher', 'Moyen'])
      })

      it('should filter by priceMax', async () => {
        await seedPriceRange()
        const result = await list({ limit: 10, priceMax: 2500 })
        expect(result.items.map((p) => p.name).sort()).toEqual(['Moyen', 'Pas cher'])
      })

      it('should filter by priceMin and priceMax combined', async () => {
        await seedPriceRange()
        const result = await list({ limit: 10, priceMin: 1000, priceMax: 3000 })
        expect(result.items.map((p) => p.name)).toEqual(['Moyen'])
      })

      it('should exclude products without priceCents when range active', async () => {
        await createTestProduct(user.id, { name: 'Sans prix', brand: 'A' })
        await createTestProduct(user.id, { name: 'Avec prix', brand: 'B', priceCents: 2000 })

        const result = await list({ limit: 10, priceMin: 0 })
        expect(result.items.map((p) => p.name)).toEqual(['Avec prix'])
      })
    })

    describe('sort', () => {
      it('should sort by name ascending by default (no sort param)', async () => {
        await createTestProduct(user.id, { name: 'Zinc', brand: 'A' })
        await createTestProduct(user.id, { name: 'Acide salicylique', brand: 'B' })
        await createTestProduct(user.id, { name: 'Mélatonine', brand: 'C' })

        const result = await list({ limit: 10 })
        expect(result.items.map((p) => p.name)).toEqual(['Acide salicylique', 'Mélatonine', 'Zinc'])
      })

      it('should sort by name when sort=name is explicit', async () => {
        await createTestProduct(user.id, { name: 'Zinc', brand: 'A' })
        await createTestProduct(user.id, { name: 'Acide salicylique', brand: 'B' })

        const result = await list({ limit: 10, sort: 'name' })
        expect(result.items.map((p) => p.name)).toEqual(['Acide salicylique', 'Zinc'])
      })

      it('should return all items in random order without error (sort=random)', async () => {
        await createTestProduct(user.id, { name: 'A', brand: 'A' })
        await createTestProduct(user.id, { name: 'B', brand: 'B' })
        await createTestProduct(user.id, { name: 'C', brand: 'C' })

        const result = await list({ limit: 10, sort: 'random' })
        expect(result.items).toHaveLength(3)
        expect(new Set(result.items.map((p) => p.name))).toEqual(new Set(['A', 'B', 'C']))
      })

      it('should sort by price ascending with NULLs last', async () => {
        await seedPricesWithNull()
        const result = await list({ limit: 10, sort: 'price_asc' })
        expect(result.items.map((p) => p.name)).toEqual(['Pas cher', 'Cher', 'Sans prix'])
      })

      it('should sort by price descending with NULLs last', async () => {
        await seedPricesWithNull()
        const result = await list({ limit: 10, sort: 'price_desc' })
        expect(result.items.map((p) => p.name)).toEqual(['Cher', 'Pas cher', 'Sans prix'])
      })

      it('should sort by newest (most recent createdAt first)', async () => {
        await createTestProduct(user.id, { name: 'Ancien', brand: 'A' })
        await new Promise((r) => setTimeout(r, 5))
        await createTestProduct(user.id, { name: 'Recent', brand: 'B' })

        const result = await list({ limit: 10, sort: 'newest' })
        expect(result.items.map((p) => p.name)).toEqual(['Recent', 'Ancien'])
      })
    })

    describe('ingredient filter', () => {
      it('should return only products linked to the given ingredient slug', async () => {
        const niacin = await createTestIngredient(user.id, { name: 'Niacinamide' })
        const retinal = await createTestIngredient(user.id, { name: 'Rétinaldéhyde' })
        const p1 = await createTestProduct(user.id, { name: 'Sérum niacin', brand: 'A' })
        const p2 = await createTestProduct(user.id, { name: 'Crème retinal', brand: 'B' })
        await createTestProduct(user.id, { name: 'Produit sans lien', brand: 'C' })
        await testDb.transaction((tx) =>
          addIngredientToProduct(tx, { productId: p1.id, ingredientId: niacin.id })
        )
        await testDb.transaction((tx) =>
          addIngredientToProduct(tx, { productId: p2.id, ingredientId: retinal.id })
        )

        const result = await list({ limit: 10, ingredient: niacin.slug })
        expect(result.items.map((p) => p.name)).toEqual(['Sérum niacin'])
      })

      it('should support multiple ingredient slugs (OR)', async () => {
        const a = await createTestIngredient(user.id, { name: 'Aloe' })
        const b = await createTestIngredient(user.id, { name: 'Beta' })
        const p1 = await createTestProduct(user.id, { name: 'P1', brand: 'x' })
        const p2 = await createTestProduct(user.id, { name: 'P2', brand: 'y' })
        await createTestProduct(user.id, { name: 'P3', brand: 'z' })
        await testDb.transaction((tx) =>
          addIngredientToProduct(tx, { productId: p1.id, ingredientId: a.id })
        )
        await testDb.transaction((tx) =>
          addIngredientToProduct(tx, { productId: p2.id, ingredientId: b.id })
        )

        const result = await list({ limit: 10, ingredient: `${a.slug},${b.slug}` })
        expect(result.items.map((p) => p.name).sort()).toEqual(['P1', 'P2'])
      })
    })

    describe('tag categories', () => {
      // listProducts routes every category through one generic tagFilterCondition
      // path (routine_moment is the sole special case, covered separately below),
      // so 'concern' stands in for the whole PRODUCT_TAG_CATEGORIES set.
      it('should filter by a tag category', async () => {
        const tag = await createTag({ label: 'Test concern', tagType: 'concern' })
        const matched = await createTestProduct(user.id, { name: 'Match', brand: 'A' })
        await createTestProduct(user.id, { name: 'Non-match', brand: 'B' })
        await replaceTags(matched.id, [tag.id])

        const result = await list({ limit: 10, concern: tag.slug })
        expect(result.items.map((p) => p.name)).toEqual(['Match'])
      })

      it('should apply OR within a tag category (multiple slugs of same category)', async () => {
        const acne = await createTag({ label: 'Anti-acné', tagType: 'concern' })
        const aging = await createTag({ label: 'Anti-âge', tagType: 'concern' })
        const p1 = await createTestProduct(user.id, { name: 'Produit acné', brand: 'A' })
        const p2 = await createTestProduct(user.id, { name: 'Produit âge', brand: 'B' })
        await createTestProduct(user.id, { name: 'Produit neutre', brand: 'C' })
        await replaceTags(p1.id, [acne.id])
        await replaceTags(p2.id, [aging.id])

        const result = await list({ limit: 10, concern: `${acne.slug},${aging.slug}` })
        expect(result.items.map((p) => p.name).sort()).toEqual(['Produit acné', 'Produit âge'])
      })

      it('should apply AND across tag categories (intersection)', async () => {
        const oily = await createTag({ label: 'Grasse', tagType: 'skin_type' })
        const acne = await createTag({ label: 'Acné', tagType: 'concern' })
        const both = await createTestProduct(user.id, {
          name: 'Pour peau grasse acnéique',
          brand: 'A',
        })
        const onlyOily = await createTestProduct(user.id, { name: 'Juste grasse', brand: 'B' })
        const onlyAcne = await createTestProduct(user.id, { name: 'Juste acné', brand: 'C' })
        await replaceTags(both.id, [oily.id, acne.id])
        await replaceTags(onlyOily.id, [oily.id])
        await replaceTags(onlyAcne.id, [acne.id])

        const result = await list({ limit: 10, skin_type: oily.slug, concern: acne.slug })
        expect(result.items.map((p) => p.name)).toEqual(['Pour peau grasse acnéique'])
      })
    })

    // matin/soir are universal moments: they also match products carrying no routine_moment tag
    // (usable any time). Restrictive moments (hebdomadaire…) keep a strict EXISTS.
    describe('routine_moment universal moments', () => {
      it('matin matches products tagged matin AND products with no moment tag', async () => {
        const matin = await createTag({
          label: 'Matin',
          tagType: 'routine_moment',
          slug: 'moment-matin',
        })
        const tagged = await createTestProduct(user.id, { name: 'Tagué matin', brand: 'A' })
        await createTestProduct(user.id, { name: 'Sans moment', brand: 'B' })
        await replaceTags(tagged.id, [matin.id])

        const result = await list({ limit: 10, routine_moment: 'moment-matin' })
        expect(result.items.map((p) => p.name).sort()).toEqual(['Sans moment', 'Tagué matin'])
      })

      it('matin excludes products tagged with a different moment only', async () => {
        const matin = await createTag({
          label: 'Matin',
          tagType: 'routine_moment',
          slug: 'moment-matin',
        })
        const soir = await createTag({
          label: 'Soir',
          tagType: 'routine_moment',
          slug: 'moment-soir',
        })
        const matinProduct = await createTestProduct(user.id, { name: 'Produit matin', brand: 'A' })
        const soirProduct = await createTestProduct(user.id, { name: 'Produit soir', brand: 'B' })
        await replaceTags(matinProduct.id, [matin.id])
        await replaceTags(soirProduct.id, [soir.id])

        const result = await list({ limit: 10, routine_moment: 'moment-matin' })
        expect(result.items.map((p) => p.name)).toEqual(['Produit matin'])
      })

      it('restrictive moment (hebdomadaire) stays strict — untagged products excluded', async () => {
        const hebdo = await createTag({
          label: 'Hebdomadaire',
          tagType: 'routine_moment',
          slug: 'moment-hebdomadaire',
        })
        const tagged = await createTestProduct(user.id, { name: 'Masque hebdo', brand: 'A' })
        await createTestProduct(user.id, { name: 'Sans moment', brand: 'B' })
        await replaceTags(tagged.id, [hebdo.id])

        const result = await list({ limit: 10, routine_moment: 'moment-hebdomadaire' })
        expect(result.items.map((p) => p.name)).toEqual(['Masque hebdo'])
      })
    })

    describe('domain tab scoping', () => {
      it('skincare tab returns skincare + solaire + bodycare products', async () => {
        await createTestProduct(user.id, { name: 'Sérum', brand: 'A' })
        await createTestProduct(user.id, { name: 'SPF 50', brand: 'B', ...SOLAIRE })
        await createTestProduct(user.id, { name: 'Lait corps', brand: 'C', ...BODYCARE })
        await createTestProduct(user.id, { name: 'Shampoing', brand: 'D', ...HAIRCARE })

        const result = await list()
        expect(result.total).toBe(3)
        expect(result.items.map((p) => p.name).sort()).toEqual(['Lait corps', 'SPF 50', 'Sérum'])
      })

      it('haircare tab returns only haircare products', async () => {
        await createTestProduct(user.id, { name: 'Sérum', brand: 'A' })
        await createTestProduct(user.id, { name: 'Shampoing', brand: 'B', ...HAIRCARE })

        const result = await list({ category: 'haircare' })
        expect(result.total).toBe(1)
        expect(result.items[0]?.name).toBe('Shampoing')
      })

      it('dental tab returns only dental products', async () => {
        await createTestProduct(user.id, { name: 'Sérum', brand: 'A' })
        await createTestProduct(user.id, { name: 'Dentifrice', brand: 'B', ...DENTAL })

        const result = await list({ category: 'dental' })
        expect(result.total).toBe(1)
        expect(result.items[0]?.name).toBe('Dentifrice')
      })

      it('complement tab returns only complement products', async () => {
        await createTestProduct(user.id, { name: 'Sérum', brand: 'A' })
        await createTestProduct(user.id, { name: 'Zinc', brand: 'B', ...COMPLEMENT })

        const result = await list({ category: 'complement' })
        expect(result.total).toBe(1)
        expect(result.items[0]?.name).toBe('Zinc')
      })

      it('combines with tag filters (AND)', async () => {
        const product = await createTestProduct(user.id, { name: 'Sérum acné', brand: 'A' })
        await createTestProduct(user.id, { name: 'Shampoing', brand: 'B', ...HAIRCARE })
        const tag = await createTag({
          label: 'Acné',
          slug: 'acne',
          tagType: 'concern',
        })
        await replaceTags(product.id, [{ tagId: tag.id, relevance: 'primary' }])

        const result = await list({ concern: 'acne' })
        expect(result.total).toBe(1)
        expect(result.items[0]?.name).toBe('Sérum acné')
      })
    })

    describe('avoid_for filter', () => {
      it('flags matching products via profileMatches but does not exclude them', async () => {
        const reactive = await createTag({
          label: 'Peau réactive',
          tagType: 'skin_type',
        })
        const retinol = await createTestProduct(user.id, { name: 'Rétinol fort', brand: 'A' })
        const gentle = await createTestProduct(user.id, { name: 'Hydratant doux', brand: 'B' })
        await replaceTags(retinol.id, [{ tagId: reactive.id, relevance: 'avoid' }])

        const result = await list({ limit: 10, avoid_for: reactive.slug })
        expect(result.items.map((p) => p.name).sort()).toEqual(['Hydratant doux', 'Rétinol fort'])
        const flagged = result.items.find((p) => p.id === retinol.id)
        expect(flagged?.profileMatches).toEqual([reactive.slug])
        const ok = result.items.find((p) => p.id === gentle.id)
        expect(ok?.profileMatches).toEqual([])
      })

      it('does not flag products where the tag relevance is primary or secondary', async () => {
        const reactive = await createTag({
          label: 'Peau réactive',
          tagType: 'skin_type',
        })
        const dedicated = await createTestProduct(user.id, {
          name: 'Produit pour peau réactive',
          brand: 'A',
        })
        await replaceTags(dedicated.id, [{ tagId: reactive.id, relevance: 'primary' }])

        const result = await list({ limit: 10, avoid_for: reactive.slug })
        expect(result.items.map((p) => p.name)).toEqual(['Produit pour peau réactive'])
        expect(result.items[0]?.profileMatches).toEqual([])
      })

      it('returns empty profileMatches when no avoid_for filter is provided', async () => {
        await createTestProduct(user.id, { name: 'Produit simple', brand: 'A' })
        const result = await list({ limit: 10 })
        expect(result.items[0]?.profileMatches).toEqual([])
      })

      // User concern slug (anti-acne) ≠ product tag slug (acne-imperfections).
      // resolveAvoidSlugs bridges the drift; without it the badge stays dark
      // even when relevant `avoid` tags exist.
      it('translates user concern slugs to product tag slugs before matching', async () => {
        const acne = await createTag({
          label: 'Acné / Imperfections',
          tagType: 'concern',
          slug: 'acne-imperfections',
        })
        const risky = await createTestProduct(user.id, {
          name: 'Sérum risqué pour acné',
          brand: 'A',
        })
        await replaceTags(risky.id, [{ tagId: acne.id, relevance: 'avoid' }])

        const result = await list({ limit: 10, avoid_for: 'anti-acne' })
        const flagged = result.items.find((p) => p.id === risky.id)
        expect(flagged?.profileMatches).toEqual(['acne-imperfections'])
      })

      // 4 user concerns collapse onto rougeurs-vasculaires; one match yields
      // one slug in profileMatches (deduped by SQL inArray + resolver Set).
      it('dedupes when multiple user concerns map to the same product tag', async () => {
        const redness = await createTag({
          label: 'Rougeurs vasculaires',
          tagType: 'concern',
          slug: 'rougeurs-vasculaires',
        })
        const risky = await createTestProduct(user.id, { name: 'Tonique alcool', brand: 'A' })
        await replaceTags(risky.id, [{ tagId: redness.id, relevance: 'avoid' }])

        const result = await list({
          limit: 10,
          avoid_for: 'anti-rougeurs,rosacee,couperose,flushs',
        })
        const flagged = result.items.find((p) => p.id === risky.id)
        expect(flagged?.profileMatches).toEqual(['rougeurs-vasculaires'])
      })
    })

    describe('userStatus (shelf flag)', () => {
      it('returns null userStatus for anonymous callers', async () => {
        await createTestProduct(user.id, { name: 'Anon visible', brand: 'A' })
        const result = await list()
        expect(result.items[0]?.userStatus).toBeNull()
      })

      it('flags products the caller has shelved with their actual status', async () => {
        const { createUserProduct } = await import('../../user-products/service')
        const shelved = await createTestProduct(user.id, { name: 'Sur étagère', brand: 'A' })
        const unshelved = await createTestProduct(user.id, { name: 'Pas sur étagère', brand: 'B' })
        await testDb.transaction((tx) =>
          createUserProduct(user.id, { productId: shelved.id, status: 'in_stock' }, tx)
        )

        const result = await list({}, user.id)
        const flagged = result.items.find((p) => p.id === shelved.id)
        const plain = result.items.find((p) => p.id === unshelved.id)
        expect(flagged?.userStatus).toBe('in_stock')
        expect(plain?.userStatus).toBeNull()
      })

      it('does not leak other users shelf status when userId filter is enforced', async () => {
        const other = await createTestUser('other@test.com')
        const { createUserProduct } = await import('../../user-products/service')
        const product = await createTestProduct(user.id, { name: 'Produit partagé', brand: 'A' })
        await testDb.transaction((tx) =>
          createUserProduct(other.id, { productId: product.id, status: 'in_stock' }, tx)
        )

        const result = await list({}, user.id)
        expect(result.items[0]?.userStatus).toBeNull()
      })
    })

    describe('tags aggregation', () => {
      it('exposes primary tags only as { slug, tagType, relevance } entries', async () => {
        const acne = await createTag({ label: 'Anti-acné', tagType: 'concern' })
        const oily = await createTag({ label: 'Grasse', tagType: 'skin_type' })
        const vegan = await createTag({
          label: 'Vegan',
          tagType: 'product_characteristic',
        })
        const product = await createTestProduct(user.id, { name: 'Sérum complet', brand: 'A' })
        await replaceTags(product.id, [
          { tagId: acne.id, relevance: 'primary' },
          { tagId: oily.id, relevance: 'primary' },
          { tagId: vegan.id, relevance: 'secondary' },
        ])

        const result = await list()
        const tags = result.items[0]?.tags ?? []
        expect(tags).toContainEqual({
          slug: acne.slug,
          tagType: 'concern',
          relevance: 'primary',
        })
        expect(tags).toContainEqual({
          slug: oily.slug,
          tagType: 'skin_type',
          relevance: 'primary',
        })
        // secondary tags are list over-fetch; the card only renders primary chips
        expect(tags.map((t) => t.slug)).not.toContain(vegan.slug)
      })

      it('excludes avoid-relevance tags from the tags array', async () => {
        const reactive = await createTag({
          label: 'Réactive',
          tagType: 'skin_type',
        })
        const product = await createTestProduct(user.id, { name: 'Rétinol', brand: 'A' })
        await replaceTags(product.id, [{ tagId: reactive.id, relevance: 'avoid' }])

        const result = await list()
        expect(result.items[0]?.tags).toEqual([])
      })

      it('returns empty tags array for products without any tags', async () => {
        await createTestProduct(user.id, { name: 'Sans tag', brand: 'A' })
        const result = await list()
        expect(result.items[0]?.tags).toEqual([])
      })
    })

    describe('pagination', () => {
      it('should respect the limit param', async () => {
        for (let i = 0; i < 5; i++) {
          await createTestProduct(user.id, { name: `P${i}`, brand: `B${i}` })
        }
        const result = await list({ limit: 2 })
        expect(result.items).toHaveLength(2)
        expect(result.total).toBe(5)
      })

      it('should return empty items when page exceeds totalPages', async () => {
        await createTestProduct(user.id, { name: 'Seul', brand: 'A' })
        const result = await list({ page: 10 })
        expect(result.items).toHaveLength(0)
        expect(result.total).toBe(1)
      })

      it('should paginate consistently (page 1 + page 2 cover distinct items)', async () => {
        for (let i = 0; i < 4; i++) {
          await createTestProduct(user.id, {
            name: `Produit ${String.fromCharCode(65 + i)}`,
            brand: `B${i}`,
          })
        }
        const p1 = await list({ page: 1, limit: 2 })
        const p2 = await list({ page: 2, limit: 2 })
        const ids1 = p1.items.map((p) => p.id)
        const ids2 = p2.items.map((p) => p.id)
        expect(ids1).toHaveLength(2)
        expect(ids2).toHaveLength(2)
        expect(ids1.some((id) => ids2.includes(id))).toBe(false)
      })
    })
  })

  describe('searchProducts', () => {
    it('should return products matching by name', async () => {
      await createTestProduct(user.id, { name: 'Niacinamide 10%', brand: 'The Ordinary' })
      const result = await searchProducts({ q: 'niacin' }, testDb)
      expect(result.items).toHaveLength(1)
      expect(result.items[0]?.name).toBe('Niacinamide 10%')
      expect(result.hasMore).toBe(false)
    })

    it('should return products matching by brand without accents', async () => {
      await createTestProduct(user.id, { name: 'Tolérance Control', brand: 'Avène' })
      const result = await searchProducts({ q: 'avene' }, testDb)
      expect(result.items).toHaveLength(1)
      expect(result.items[0]?.brand).toBe('Avène')
    })

    it('should prioritize exact match over prefix (pg_trgm)', async () => {
      await createTestProduct(user.id, { name: 'Zinc PCA Sérum', brand: 'Brand' })
      await createTestProduct(user.id, { name: 'Zinc', brand: 'Solgar' })
      await createTestProduct(user.id, { name: 'Zinc Bisglycinate', brand: 'Brand' })

      const result = await searchProducts({ q: 'zinc' }, testDb)
      expect(result.items[0]?.name).toBe('Zinc')
      expect(result.items[1]?.name).toBe('Zinc PCA Sérum')
      expect(result.items[2]?.name).toBe('Zinc Bisglycinate')
    })

    // Similarity alone would rank the short contains-match above the long
    // prefix-match; the explicit rank must win for a predictable dropdown.
    it('should rank exact > prefix > contains even when similarity disagrees', async () => {
      await createTestProduct(user.id, { name: 'Le Sérum', brand: 'BrandA' })
      await createTestProduct(user.id, {
        name: 'Sérum Niacinamide Concentré Apaisant',
        brand: 'BrandB',
      })
      await createTestProduct(user.id, { name: 'Sérum', brand: 'BrandC' })

      const result = await searchProducts({ q: 'serum' }, testDb)
      expect(result.items.map((p) => p.name)).toEqual([
        'Sérum',
        'Sérum Niacinamide Concentré Apaisant',
        'Le Sérum',
      ])
    })

    it('should rank brand exact match above name contains match', async () => {
      await createTestProduct(user.id, { name: 'Crème Avène Réparatrice', brand: 'Other' })
      await createTestProduct(user.id, { name: 'Tolérance Control', brand: 'Avène' })

      const result = await searchProducts({ q: 'avene' }, testDb)
      expect(result.items[0]?.brand).toBe('Avène')
    })

    // escapeLike() regression guards: %, _ and \ in q must match literally,
    // never as LIKE wildcards.
    it('should treat % in q as a literal, not a match-all wildcard', async () => {
      await createTestProduct(user.id, { name: 'Niacinamide 10%', brand: 'The Ordinary' })
      // Contains "10" without the literal %: matches iff % degrades to a wildcard.
      await createTestProduct(user.id, { name: 'Vitamine 100', brand: 'BrandB' })
      const result = await searchProducts({ q: '10%' }, testDb)
      expect(result.items.map((p) => p.name)).toEqual(['Niacinamide 10%'])
    })

    it('should treat _ in q as a literal, not a single-char wildcard', async () => {
      await createTestProduct(user.id, { name: 'Formule A_B', brand: 'BrandA' })
      await createTestProduct(user.id, { name: 'Formule AXB', brand: 'BrandB' })
      const result = await searchProducts({ q: 'A_B' }, testDb)
      expect(result.items.map((p) => p.name)).toEqual(['Formule A_B'])
    })

    it('should not throw on a backslash in q', async () => {
      await createTestProduct(user.id, { name: 'Crème hydratante', brand: 'BrandB' })
      const result = await searchProducts({ q: 'a\\b' }, testDb)
      expect(result.items).toHaveLength(0)
    })

    it('should scope results to the domain tab when category is set', async () => {
      await createTestProduct(user.id, { name: 'Sérum Kératine', brand: 'BrandA' })
      await createTestProduct(user.id, { name: 'Shampoing Kératine', brand: 'BrandB', ...HAIRCARE })

      const skincare = await searchProducts({ q: 'keratine', category: 'skincare' }, testDb)
      expect(skincare.items.map((p) => p.name)).toEqual(['Sérum Kératine'])

      const haircare = await searchProducts({ q: 'keratine', category: 'haircare' }, testDb)
      expect(haircare.items.map((p) => p.name)).toEqual(['Shampoing Kératine'])

      const unscoped = await searchProducts({ q: 'keratine' }, testDb)
      expect(unscoped.items).toHaveLength(2)
    })

    it('should expose hasMore + nextOffset for pagination', async () => {
      for (let i = 0; i < 5; i++) {
        await createTestProduct(user.id, { name: `Vitamin C v${i}`, brand: 'BrandX' })
      }
      const page1 = await searchProducts({ q: 'vitamin', limit: 3, offset: 0 }, testDb)
      expect(page1.items).toHaveLength(3)
      expect(page1.hasMore).toBe(true)
      expect(page1.nextOffset).toBe(3)

      const page2 = await searchProducts({ q: 'vitamin', limit: 3, offset: 3 }, testDb)
      expect(page2.items).toHaveLength(2)
      expect(page2.hasMore).toBe(false)
    })
  })

  describe('getDistinctBrands', () => {
    it('should scope brands to the domain tab when category is set', async () => {
      await createTestProduct(user.id, { name: 'Sérum', brand: 'SkinBrand' })
      await createTestProduct(user.id, { name: 'Shampoing', brand: 'HairBrand', ...HAIRCARE })

      expect(await getDistinctBrands(testDb, 'skincare')).toEqual(['SkinBrand'])
      expect(await getDistinctBrands(testDb, 'haircare')).toEqual(['HairBrand'])
      expect(await getDistinctBrands(testDb)).toEqual(['HairBrand', 'SkinBrand'])
    })
  })

  describe('findSimilarProducts', () => {
    it('should return a product with exact name and brand match', async () => {
      await createTestProduct(user.id, { name: 'Niacinamide 10%', brand: 'The Ordinary' })
      const results = await findSimilarProducts('Niacinamide 10%', 'The Ordinary', testDb)
      expect(results).toHaveLength(1)
    })
  })

  describe('getFilterOptions', () => {
    it('should return distinct brands and kinds', async () => {
      await createTestProduct(user.id, { name: 'Sérum A', brand: 'The Ordinary' })
      await createTestProduct(user.id, { name: 'Zinc', brand: 'Solgar', ...COMPLEMENT })
      const options = await getFilterOptions(testDb)
      expect(options.brands).toContain('The Ordinary')
      expect(options.brands).toContain('Solgar')
      expect(options.kinds).toContain('serum')
      expect(options.kinds).toContain('gelule')
    })

    it('should include product counts per tag in tagCounts map', async () => {
      const tagAcne = await createTag({ label: 'Anti-acné', tagType: 'concern' })
      const tagAging = await createTag({ label: 'Anti-âge', tagType: 'concern' })

      const p1 = await createTestProduct(user.id, { name: 'P1', brand: 'A' })
      const p2 = await createTestProduct(user.id, { name: 'P2', brand: 'B' })
      const p3 = await createTestProduct(user.id, { name: 'P3', brand: 'C' })

      await replaceTags(p1.id, [tagAcne.id])
      await replaceTags(p2.id, [tagAcne.id, tagAging.id])
      await replaceTags(p3.id, [tagAging.id])

      const options = await getFilterOptions(testDb)
      expect(options.tagCounts[tagAcne.slug]).toBe(2)
      expect(options.tagCounts[tagAging.slug]).toBe(2)
    })

    it('omits orphan tags (defined but not linked to any product) from tagCounts', async () => {
      const linked = await createTag({ label: 'Lié', tagType: 'concern' })
      const orphan = await createTag({ label: 'Orphelin', tagType: 'concern' })
      const p = await createTestProduct(user.id, { name: 'P', brand: 'B' })
      await replaceTags(p.id, [linked.id])

      const options = await getFilterOptions(testDb)
      expect(options.tagCounts[linked.slug]).toBe(1)
      expect(options.tagCounts[orphan.slug]).toBeUndefined()
    })

    describe('domain tab scoping', () => {
      it('scopes brands and kinds to the skincare tab categories', async () => {
        await createTestProduct(user.id, { name: 'Sérum', brand: 'Brand-Skincare' })
        await createTestProduct(user.id, { name: 'SPF', brand: 'Brand-Solaire', ...SOLAIRE })
        await createTestProduct(user.id, {
          name: 'Shampoing',
          brand: 'Brand-Haircare',
          ...HAIRCARE,
        })

        const options = await getFilterOptions(testDb, 'skincare')
        expect(options.brands.sort()).toEqual(['Brand-Skincare', 'Brand-Solaire'])
        expect(options.kinds.sort()).toEqual(['serum', 'sunscreen'])
      })

      it('scopes tagCounts to the requested domain tab', async () => {
        const skinTag = await createTag({ label: 'Anti-acné', tagType: 'concern' })
        const hairTag = await createTag({ label: 'Pellicules', tagType: 'concern' })

        const skinProduct = await createTestProduct(user.id, { name: 'Sérum', brand: 'A' })
        const hairProduct = await createTestProduct(user.id, {
          name: 'Shampoing',
          brand: 'B',
          ...HAIRCARE,
        })
        await replaceTags(skinProduct.id, [skinTag.id])
        await replaceTags(hairProduct.id, [hairTag.id])

        const skinOptions = await getFilterOptions(testDb, 'skincare')
        expect(skinOptions.tagCounts[skinTag.slug]).toBe(1)
        expect(skinOptions.tagCounts[hairTag.slug]).toBeUndefined()

        const hairOptions = await getFilterOptions(testDb, 'haircare')
        expect(hairOptions.tagCounts[hairTag.slug]).toBe(1)
        expect(hairOptions.tagCounts[skinTag.slug]).toBeUndefined()
      })

      it('omitting category keeps current (unscoped) behavior', async () => {
        await createTestProduct(user.id, { name: 'Sérum', brand: 'A' })
        await createTestProduct(user.id, { name: 'Shampoing', brand: 'B', ...HAIRCARE })

        const options = await getFilterOptions(testDb)
        expect(options.brands.sort()).toEqual(['A', 'B'])
        expect(options.kinds.sort()).toEqual(['serum', 'shampoo'])
      })
    })
  })

  describe('getProductFullBySlug', () => {
    it('should return product with its ingredients and tags', async () => {
      const product = await createTestProduct(user.id, { name: 'Sérum Complet', brand: 'Brand' })
      const niacin = await createTestIngredient(user.id, { name: 'Niacinamide' })
      await testDb.transaction((tx) =>
        addIngredientToProduct(tx, { productId: product.id, ingredientId: niacin.id })
      )

      const result = await getProductFullBySlug(product.slug, testDb)
      expect(result.ingredients).toHaveLength(1)
      expect(result.ingredients[0]?.ingredientName).toBe('Niacinamide')
      expect(Array.isArray(result.tags)).toBe(true)
    })

    // The sheet reads both off the payload; nothing else recomputes them.
    it('should ship the INCI facts the product sheet displays', async () => {
      const product = await createTestProduct(user.id, {
        name: 'Sérum Parfumé',
        brand: 'Brand',
        inci: 'Aqua, Glycerin, Limonene',
      })

      const result = await getProductFullBySlug(product.slug, testDb)
      expect(result.inciCount).toBe(3)
      expect(result.hasFragrance).toBe(true)
    })

    it('should report empty INCI facts when the product has no INCI', async () => {
      const product = await createTestProduct(user.id, { name: 'Sérum Nu', brand: 'Brand' })

      const result = await getProductFullBySlug(product.slug, testDb)
      expect(result.inciCount).toBe(0)
      expect(result.hasFragrance).toBe(false)
    })
  })
})

describe('createProductSchema validation', () => {
  const baseInput = {
    name: 'Test',
    brand: 'Brand',
    category: 'skincare',
    kind: 'serum',
    unit: 'pump',
  } as const

  it('requires category', () => {
    const result = createProductSchema.safeParse({
      name: 'Test',
      brand: 'Brand',
      kind: 'serum',
      unit: 'pump',
    })
    expect(result.success).toBe(false)
  })

  it('rejects mismatched category and kind', () => {
    const result = createProductSchema.safeParse({ ...baseInput, kind: 'gelule' })
    expect(result.success).toBe(false)
  })

  it('accepts valid category and kind pair', () => {
    const result = createProductSchema.safeParse(baseInput)
    expect(result.success).toBe(true)
  })

  it('rejects a long inci with no commas (bare prose)', () => {
    const longNoComma =
      'AQUA GLYCERIN CETEARYL ALCOHOL DIMETHICONE PHENOXYETHANOL TOCOPHEROL BUTYROSPERMUM PARKII BUTTER CAPRYLIC CAPRIC TRIGLYCERIDE SODIUM HYALURONATE'
    expect(longNoComma.length).toBeGreaterThan(100)
    const result = createProductSchema.safeParse({ ...baseInput, inci: longNoComma })
    expect(result.success).toBe(false)
  })

  it('accepts a short inci with no commas (single ingredient)', () => {
    const result = createProductSchema.safeParse({ ...baseInput, inci: 'AQUA' })
    expect(result.success).toBe(true)
  })

  it('accepts a long inci that is comma-separated', () => {
    const result = createProductSchema.safeParse({
      ...baseInput,
      inci: 'Aqua, Glycerin, Cetearyl Alcohol, Dimethicone, Phenoxyethanol, Tocopherol, Butyrospermum Parkii Butter',
    })
    expect(result.success).toBe(true)
  })
})

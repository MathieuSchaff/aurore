import { beforeEach, describe, expect, it } from 'bun:test'

import { eq } from 'drizzle-orm'

import { productEdits } from '../../../db/schema/products'
import { ProductError } from '../../../features/products/product-error'
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductBySlug,
  updateProduct,
} from '../../../features/products/service'
import { testDb } from '../../db.test.config'
import { cleanDatabase } from '../../helpers/db-cleaner'
import { createTestUser } from '../../helpers/test-factories'

describe('Product Service', () => {
  // biome-ignore lint: testing
  let user: any

  beforeEach(async () => {
    await cleanDatabase()
    user = await createTestUser()
  })

  // ─── createProduct ────────────────────────────────────────────

  describe('createProduct', () => {
    it('should create a product with minimal fields', async () => {
      const product = await createProduct(
        user.id,
        { name: 'Vitamine C', brand: 'Generic', kind: 'complément', unit: 'gélule' },
        testDb
      )

      expect(product.id).toBeDefined()
      expect(product.name).toBe('Vitamine C')
      expect(product.createdBy).toBe(user.id)
      expect(product.slug).toBe('vitamine-c-generic')
      expect(product.brand).toBe('Generic')
    })

    it('should create a product with all optional fields', async () => {
      const product = await createProduct(
        user.id,
        {
          name: 'Rétinol 0.5%',
          brand: 'The Ordinary',
          kind: 'skincare',
          unit: 'pump',
          description: 'Rétinol en solution huileuse',
          totalAmount: 30,
          amountUnit: 'mL',
          priceCents: 800,
          notes: 'Utiliser le soir',
        },
        testDb
      )

      expect(product.name).toBe('Rétinol 0.5%')
      expect(product.brand).toBe('The Ordinary')
      expect(product.description).toBe('Rétinol en solution huileuse')
      expect(product.totalAmount).toBe(30)
      expect(product.amountUnit).toBe('mL')
      expect(product.priceCents).toBe(800)
      expect(product.notes).toBe('Utiliser le soir')
    })

    it('should auto-generate slug from name', async () => {
      const product = await createProduct(
        user.id,
        { name: 'Acide Hyaluronique', brand: 'The Ordinary', kind: 'skincare', unit: 'pump' },
        testDb
      )

      expect(product.slug).toBe('acide-hyaluronique-the-ordinary')
    })

    it('should use custom slug when provided', async () => {
      const product = await createProduct(
        user.id,
        {
          name: 'Magnésium Marin',
          brand: 'Solgar',
          kind: 'complément',
          unit: 'gélule',
          slug: 'mag-marin',
        },
        testDb
      )

      expect(product.slug).toBe('mag-marin')
    })

    it('should store createdAt and updatedAt timestamps', async () => {
      const product = await createProduct(
        user.id,
        { name: 'Zinc', brand: 'Solgar', kind: 'complément', unit: 'gélule' },
        testDb
      )

      expect(product.createdAt).toBeInstanceOf(Date)
      expect(product.updatedAt).toBeInstanceOf(Date)
    })

    it('should throw product_already_exists for duplicate name+brand', async () => {
      await createProduct(
        user.id,
        { name: 'Vitamine D3', brand: 'Solgar', kind: 'complément', unit: 'gélule' },
        testDb
      )

      try {
        await createProduct(
          user.id,
          { name: 'Vitamine D3', brand: 'Solgar', kind: 'complément', unit: 'gélule' },
          testDb
        )
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(ProductError)
        expect((e as ProductError).code).toBe('product_already_exists')
      }
    })

    it('should allow same name with different brands', async () => {
      const p1 = await createProduct(
        user.id,
        { name: 'Oméga 3', brand: 'Solgar', kind: 'complément', unit: 'gélule' },
        testDb
      )
      const p2 = await createProduct(
        user.id,
        { name: 'Oméga 3', brand: 'Now Foods', kind: 'complément', unit: 'gélule' },
        testDb
      )

      expect(p1.id).not.toBe(p2.id)
    })
  })

  // ─── getProductById ───────────────────────────────────────────

  describe('getProductById', () => {
    it('should return the product for a valid id', async () => {
      const created = await createProduct(
        user.id,
        { name: 'Magnésium', brand: 'Solgar', kind: 'complément', unit: 'gélule' },
        testDb
      )

      const fetched = await getProductById(created.id, testDb)

      expect(fetched.id).toBe(created.id)
      expect(fetched.name).toBe('Magnésium')
    })

    it('should throw product_not_found for unknown id', async () => {
      const fakeId = crypto.randomUUID()

      try {
        await getProductById(fakeId, testDb)
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(ProductError)
        expect((e as ProductError).code).toBe('product_not_found')
      }
    })

    it('should also reject via rejects.toThrow', async () => {
      const fakeId = crypto.randomUUID()
      expect(getProductById(fakeId, testDb)).rejects.toThrow(ProductError)
    })
  })

  // ─── getProductBySlug ─────────────────────────────────────────

  describe('getProductBySlug', () => {
    it('should return the product for a valid slug', async () => {
      const created = await createProduct(
        user.id,
        { name: 'Coenzyme Q10', brand: 'Solgar', kind: 'complément', unit: 'gélule' },
        testDb
      )

      const fetched = await getProductBySlug(created.slug, testDb)

      expect(fetched.id).toBe(created.id)
      expect(fetched.slug).toBe('coenzyme-q10-solgar')
    })

    it('should throw product_not_found for unknown slug', async () => {
      try {
        await getProductBySlug('slug-inexistant', testDb)
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(ProductError)
        expect((e as ProductError).code).toBe('product_not_found')
      }
    })
  })

  // ─── updateProduct ────────────────────────────────────────────

  describe('updateProduct', () => {
    it('should update product fields and return the updated product', async () => {
      const created = await createProduct(
        user.id,
        { name: 'Fer bisglycinate', brand: 'Generic', kind: 'complément', unit: 'gélule' },
        testDb
      )

      const updated = await updateProduct(
        user.id,
        created.id,
        { brand: 'Solgar', priceCents: 1800 },
        undefined,
        testDb
      )

      expect(updated.brand).toBe('Solgar')
      expect(updated.priceCents).toBe(1800)
      expect(updated.name).toBe('Fer bisglycinate')
    })

    it('should create an audit log when fields change', async () => {
      const created = await createProduct(
        user.id,
        { name: 'Spiruline', brand: 'Generic', kind: 'complément', unit: 'comprimé' },
        testDb
      )

      await updateProduct(
        user.id,
        created.id,
        { description: 'Riche en protéines et en chlorophylle' },
        'Ajout description',
        testDb
      )

      const edits = await testDb
        .select()
        .from(productEdits)
        .where(eq(productEdits.productId, created.id))

      expect(edits).toHaveLength(1)
      expect(edits[0]?.summary).toBe('Ajout description')
      expect(edits[0]?.editedBy).toBe(user.id)
      expect(edits[0]?.changes).toHaveProperty('description')
    })

    it('should not create an audit log when nothing actually changes', async () => {
      const created = await createProduct(
        user.id,
        { name: 'Curcuma', brand: 'Solgar', kind: 'complément', unit: 'gélule' },
        testDb
      )

      // brand is already set — setting it to the same value is not a change
      await updateProduct(user.id, created.id, { brand: 'Solgar' }, undefined, testDb)

      const edits = await testDb
        .select()
        .from(productEdits)
        .where(eq(productEdits.productId, created.id))

      expect(edits).toHaveLength(0)
    })

    it('should auto-update slug when name changes', async () => {
      const created = await createProduct(
        user.id,
        { name: 'Vitamine B12', brand: 'Generic', kind: 'complément', unit: 'gélule' },
        testDb
      )

      const updated = await updateProduct(
        user.id,
        created.id,
        { name: 'Vitamine B12 Active' },
        undefined,
        testDb
      )

      expect(updated.slug).toBe('vitamine-b12-active')
    })

    it('should record multiple field changes in a single audit entry', async () => {
      const created = await createProduct(
        user.id,
        { name: 'Zinc bisglycinate', brand: 'Generic', kind: 'complément', unit: 'gélule' },
        testDb
      )

      await updateProduct(
        user.id,
        created.id,
        { brand: 'Solgar', notes: 'À prendre avec le repas', priceCents: 1200 },
        'Mise à jour complète',
        testDb
      )

      const edits = await testDb
        .select()
        .from(productEdits)
        .where(eq(productEdits.productId, created.id))

      expect(edits).toHaveLength(1)
      expect(edits[0]?.changes).toHaveProperty('brand')
      expect(edits[0]?.changes).toHaveProperty('notes')
      expect(edits[0]?.changes).toHaveProperty('priceCents')
    })

    it('should throw product_not_found for unknown id', async () => {
      const fakeId = crypto.randomUUID()

      try {
        await updateProduct(user.id, fakeId, { brand: 'X' }, undefined, testDb)
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(ProductError)
        expect((e as ProductError).code).toBe('product_not_found')
      }
    })
  })

  // ─── deleteProduct ────────────────────────────────────────────

  describe('deleteProduct', () => {
    it('should permanently remove the product', async () => {
      const created = await createProduct(
        user.id,
        { name: 'Sélénium', brand: 'Solgar', kind: 'complément', unit: 'gélule' },
        testDb
      )

      await deleteProduct(created.id, testDb)

      expect(getProductById(created.id, testDb)).rejects.toThrow(ProductError)
    })

    it('should throw product_delete_failed for unknown id', async () => {
      const fakeId = crypto.randomUUID()

      try {
        await deleteProduct(fakeId, testDb)
        throw new Error('should have thrown')
      } catch (e) {
        expect(e).toBeInstanceOf(ProductError)
        expect((e as ProductError).code).toBe('product_delete_failed')
      }
    })

    it('should not affect other products when deleting one', async () => {
      const p1 = await createProduct(
        user.id,
        { name: 'Produit A', brand: 'Brand A', kind: 'complément', unit: 'gélule' },
        testDb
      )
      const p2 = await createProduct(
        user.id,
        { name: 'Produit B', brand: 'Brand B', kind: 'complément', unit: 'comprimé' },
        testDb
      )

      await deleteProduct(p1.id, testDb)

      const fetched = await getProductById(p2.id, testDb)
      expect(fetched.id).toBe(p2.id)
    })
  })
})

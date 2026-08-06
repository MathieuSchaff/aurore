import { beforeEach, describe, expect, it } from 'bun:test'

import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestIngredient,
  createTestProduct,
  createTestUser,
  type TestUser,
} from '../../../tests/helpers/test-factories'
import {
  addIngredientToProduct,
  addManyIngredientsToProduct,
  listIngredientsByProduct,
  listProductsByIngredient,
  removeIngredientFromProduct,
  replaceProductIngredients,
  updateProductIngredient,
} from '../product-ingredients/product-ingredients.service'

setupDbTests()

const addIng = (data: Parameters<typeof addIngredientToProduct>[1]) =>
  testDb.transaction((tx) => addIngredientToProduct(tx, data))

const addManyIng = (data: Parameters<typeof addManyIngredientsToProduct>[1]) =>
  testDb.transaction((tx) => addManyIngredientsToProduct(tx, data))

const updIng = (
  productId: string,
  ingredientId: string,
  data: Parameters<typeof updateProductIngredient>[3]
) => testDb.transaction((tx) => updateProductIngredient(tx, productId, ingredientId, data))

const removeIng = (productId: string, ingredientId: string) =>
  testDb.transaction((tx) => removeIngredientFromProduct(tx, productId, ingredientId))

const replaceIng = (productId: string, data: Parameters<typeof replaceProductIngredients>[2]) =>
  testDb.transaction((tx) => replaceProductIngredients(tx, productId, data))

describe('Product Ingredients Service', () => {
  let user: TestUser

  beforeEach(async () => {
    user = await createTestUser()
  })

  describe('addIngredientToProduct', () => {
    it('should link an ingredient to a product', async () => {
      const product = await createTestProduct(user.id, { name: 'Produit Test' })
      const ingredient = await createTestIngredient(user.id, { name: 'Ingrédient Test' })

      const link = await addIng({
        productId: product.id,
        ingredientId: ingredient.id,
      })

      expect(link).toBeDefined()
      expect(link?.productId).toBe(product.id)
      expect(link?.ingredientId).toBe(ingredient.id)
    })

    it('should store concentration details', async () => {
      const product = await createTestProduct(user.id, { name: 'Produit Test' })
      const ingredient = await createTestIngredient(user.id, { name: 'Rétinol' })

      const link = await addIng({
        productId: product.id,
        ingredientId: ingredient.id,
        concentrationValue: '0.5',
        concentrationUnit: '%',
        notes: 'Encapsulé',
      })

      expect(link?.concentrationValue).toBe('0.5')
      expect(link?.concentrationUnit).toBe('%')
      expect(link?.notes).toBe('Encapsulé')
    })

    it('should store per-unit concentration (e.g. 2500 IU per drop)', async () => {
      const product = await createTestProduct(user.id, { name: 'Produit Test' })
      const ingredient = await createTestIngredient(user.id, { name: 'Vitamine D3' })

      const link = await addIng({
        productId: product.id,
        ingredientId: ingredient.id,
        concentrationValue: '2500',
        concentrationUnit: 'IU',
        concentrationPer: 'goutte',
      })

      expect(link?.concentrationValue).toBe('2500')
      expect(link?.concentrationUnit).toBe('IU')
      expect(link?.concentrationPer).toBe('goutte')
    })
  })

  describe('addManyIngredientsToProduct', () => {
    it('should return an empty array when given no data', async () => {
      const result = await addManyIng([])

      expect(result).toEqual([])
    })

    it('should link multiple ingredients to a product at once', async () => {
      const product = await createTestProduct(user.id, { name: 'Produit Test' })
      const i1 = await createTestIngredient(user.id, { name: 'Niacinamide' })
      const i2 = await createTestIngredient(user.id, { name: 'Zinc' })
      const i3 = await createTestIngredient(user.id, { name: 'Panthénol' })

      const links = await addManyIng([
        {
          productId: product.id,
          ingredientId: i1.id,
          concentrationValue: '10',
          concentrationUnit: '%',
        },
        { productId: product.id, ingredientId: i2.id },
        { productId: product.id, ingredientId: i3.id, notes: 'Forme liposomale' },
      ])

      expect(links).toHaveLength(3)
      const ingredientIds = links.map((l) => l.ingredientId)
      expect(ingredientIds).toContain(i1.id)
      expect(ingredientIds).toContain(i2.id)
      expect(ingredientIds).toContain(i3.id)
    })
  })

  describe('listIngredientsByProduct', () => {
    it('should return an empty list when the product has no ingredients', async () => {
      const product = await createTestProduct(user.id, { name: 'Produit Test' })

      const result = await listIngredientsByProduct(testDb, product.id)

      expect(result).toEqual([])
    })

    it('should return ingredients with joined ingredient information', async () => {
      const product = await createTestProduct(user.id, { name: 'Produit Test' })
      const ingredient = await createTestIngredient(user.id, {
        name: 'Acide Hyaluronique',
        category: 'actif',
        description: 'Hydratant',
      })

      await addIng({
        productId: product.id,
        ingredientId: ingredient.id,
        concentrationValue: '1',
        concentrationUnit: '%',
      })

      const result = await listIngredientsByProduct(testDb, product.id)

      expect(result).toHaveLength(1)
      expect(result[0]?.productId).toBe(product.id)
      expect(result[0]?.ingredientId).toBe(ingredient.id)
      expect(result[0]?.ingredientName).toBe('Acide Hyaluronique')
      expect(result[0]?.ingredientSlug).toBe('acide-hyaluronique')
      expect(result[0]?.ingredientCategory).toBe('actif')
      expect(result[0]?.ingredientDescription).toBe('Hydratant')
      expect(result[0]?.concentrationValue).toBe('1')
      expect(result[0]?.concentrationUnit).toBe('%')
    })

    it('should not return ingredients from other products', async () => {
      const p1 = await createTestProduct(user.id, { name: 'Produit A' })
      const p2 = await createTestProduct(user.id, { name: 'Produit B' })
      const ingredient = await createTestIngredient(user.id, { name: 'Ingrédient Test' })

      await addIng({ productId: p1.id, ingredientId: ingredient.id })

      const result = await listIngredientsByProduct(testDb, p2.id)

      expect(result).toHaveLength(0)
    })

    it('should return results ordered by ingredient name', async () => {
      const product = await createTestProduct(user.id, { name: 'Produit Test' })
      const zinc = await createTestIngredient(user.id, { name: 'Zinc' })
      const acide = await createTestIngredient(user.id, { name: 'Acide Azélaïque' })

      await addManyIng([
        { productId: product.id, ingredientId: zinc.id },
        { productId: product.id, ingredientId: acide.id },
      ])

      const result = await listIngredientsByProduct(testDb, product.id)

      // ordered by ingredient name ASC
      expect(result[0]?.ingredientName).toBe('Acide Azélaïque')
      expect(result[1]?.ingredientName).toBe('Zinc')
    })
  })

  describe('listProductsByIngredient', () => {
    it('should return an empty list when no products contain the ingredient', async () => {
      const ingredient = await createTestIngredient(user.id, { name: 'Ingrédient Test' })

      const result = await listProductsByIngredient(testDb, ingredient.id)

      expect(result).toEqual([])
    })

    it('should return product links for a given ingredient', async () => {
      const p1 = await createTestProduct(user.id, { name: 'Sérum A' })
      const p2 = await createTestProduct(user.id, { name: 'Sérum B' })
      const ingredient = await createTestIngredient(user.id, { name: 'Niacinamide' })

      await addManyIng([
        { productId: p1.id, ingredientId: ingredient.id },
        { productId: p2.id, ingredientId: ingredient.id },
      ])

      const result = await listProductsByIngredient(testDb, ingredient.id)

      expect(result).toHaveLength(2)
      const productIds = result.map((r) => r.id)
      expect(productIds).toContain(p1.id)
      expect(productIds).toContain(p2.id)
    })
  })

  describe('updateProductIngredient', () => {
    it('should update concentration fields', async () => {
      const product = await createTestProduct(user.id, { name: 'Produit Test' })
      const ingredient = await createTestIngredient(user.id, { name: 'Rétinol' })

      await addIng({
        productId: product.id,
        ingredientId: ingredient.id,
      })

      const updated = await updIng(product.id, ingredient.id, {
        concentrationValue: '0.3',
        concentrationUnit: '%',
        notes: 'Microencapsulé',
      })

      expect(updated).toBeDefined()
      expect(updated?.concentrationValue).toBe('0.3')
      expect(updated?.concentrationUnit).toBe('%')
      expect(updated?.notes).toBe('Microencapsulé')
    })

    it('should return undefined when the link does not exist', async () => {
      const product = await createTestProduct(user.id, { name: 'Produit Test' })
      const ingredient = await createTestIngredient(user.id, { name: 'Ingrédient Test' })

      const result = await updIng(product.id, ingredient.id, {
        notes: 'Nope',
      })

      expect(result).toBeUndefined()
    })

    it('should only update provided fields', async () => {
      const product = await createTestProduct(user.id, { name: 'Produit Test' })
      const ingredient = await createTestIngredient(user.id, { name: 'Ingrédient Test' })

      await addIng({
        productId: product.id,
        ingredientId: ingredient.id,
        concentrationValue: '5',
        concentrationUnit: '%',
        concentrationPer: 'mL',
        notes: 'Ancienne note',
      })

      const updated = await updIng(product.id, ingredient.id, {
        notes: 'Nouvelle note',
      })

      expect(updated?.notes).toBe('Nouvelle note')
      expect(updated?.concentrationValue).toBe('5')
      expect(updated?.concentrationUnit).toBe('%')
      expect(updated?.concentrationPer).toBe('mL')
    })
  })

  describe('removeIngredientFromProduct', () => {
    it('should remove the link and return true', async () => {
      const product = await createTestProduct(user.id, { name: 'Produit Test' })
      const ingredient = await createTestIngredient(user.id, { name: 'Ingrédient Test' })

      await addIng({
        productId: product.id,
        ingredientId: ingredient.id,
      })

      const removed = await removeIng(product.id, ingredient.id)

      expect(removed).toBe(true)

      const remaining = await listIngredientsByProduct(testDb, product.id)
      expect(remaining).toHaveLength(0)
    })

    it('should return false when the link does not exist', async () => {
      const product = await createTestProduct(user.id, { name: 'Produit Test' })
      const ingredient = await createTestIngredient(user.id, { name: 'Ingrédient Test' })

      const result = await removeIng(product.id, ingredient.id)

      expect(result).toBe(false)
    })

    it('should only remove the specified link, not others', async () => {
      const product = await createTestProduct(user.id, { name: 'Produit Test' })
      const i1 = await createTestIngredient(user.id, { name: 'Garder' })
      const i2 = await createTestIngredient(user.id, { name: 'Retirer' })

      await addManyIng([
        { productId: product.id, ingredientId: i1.id },
        { productId: product.id, ingredientId: i2.id },
      ])

      await removeIng(product.id, i2.id)

      const remaining = await listIngredientsByProduct(testDb, product.id)
      expect(remaining).toHaveLength(1)
      expect(remaining[0]?.ingredientId).toBe(i1.id)
    })
  })

  describe('replaceProductIngredients', () => {
    it('should replace existing ingredients with new ones', async () => {
      const product = await createTestProduct(user.id, { name: 'Produit Test' })
      const old = await createTestIngredient(user.id, { name: 'Ancien' })
      const nouveau = await createTestIngredient(user.id, { name: 'Nouveau' })

      await addIng({ productId: product.id, ingredientId: old.id })

      await replaceIng(product.id, [
        { ingredientId: nouveau.id, concentrationValue: '5', concentrationUnit: '%' },
      ])

      const result = await listIngredientsByProduct(testDb, product.id)
      expect(result).toHaveLength(1)
      expect(result[0]?.ingredientId).toBe(nouveau.id)
    })

    it('should clear all ingredients when given an empty array', async () => {
      const product = await createTestProduct(user.id, { name: 'Produit Test' })
      const ingredient = await createTestIngredient(user.id, { name: 'Ingrédient Test' })

      await addIng({
        productId: product.id,
        ingredientId: ingredient.id,
      })

      const result = await replaceIng(product.id, [])

      expect(result).toEqual([])

      const remaining = await listIngredientsByProduct(testDb, product.id)
      expect(remaining).toHaveLength(0)
    })

    it('should add productId to each entry correctly', async () => {
      const product = await createTestProduct(user.id, { name: 'Produit Test' })
      const i1 = await createTestIngredient(user.id, { name: 'Premier' })
      const i2 = await createTestIngredient(user.id, { name: 'Deuxième' })

      const result = await replaceIng(product.id, [
        { ingredientId: i1.id },
        { ingredientId: i2.id, notes: 'Liposomal' },
      ])

      expect(result).toHaveLength(2)
      for (const link of result) {
        expect(link.productId).toBe(product.id)
      }
      const ingredientIds = result.map((l) => l.ingredientId)
      expect(ingredientIds).toContain(i1.id)
      expect(ingredientIds).toContain(i2.id)
    })
  })
})

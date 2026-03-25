import { beforeAll, describe, expect, it } from 'bun:test'

import slugify from '@sindresorhus/slugify'
import { eq, sql } from 'drizzle-orm'

import { ingredients, productIngredients, products } from '../db/schema'
import { getOrCreateSeedUser } from '../db/seed/create-user'
import { extractCapacity, parseCSV } from '../db/seed/utils'
import { createIngredient } from '../features/products/ingredients/service'
import { addIngredientToProduct } from '../features/products/product-ingredients/product-ingredients.service'
import { createProduct } from '../features/products/service'
import { testDb } from './db.test.config'

// --- Tests ---

describe('Skincare Seeding Transformation', () => {
  it('should parse CSV correctly even with commas in quotes', () => {
    const csv = 'col1,col2\n"val,1","val2"'
    const rows = parseCSV(csv)
    expect(rows).toHaveLength(2)
    expect(rows[1][0]).toBe('val,1')
  })

  it('should extract capacity correctly', () => {
    const { name, totalAmount, unit } = extractCapacity(
      'SK-II Brightening Derm Revival Masks, 10 Count',
      'SK-II'
    )
    expect(name).toBe('Brightening Derm Revival Masks')
    expect(totalAmount).toBe(10)
    expect(unit).toBe('Count')
  })

  it('should extract capacity from complex strings', () => {
    const { name, totalAmount, unit } = extractCapacity(
      'IsNtree Aloe Fresh Type Soothing Gel, 10.14 fl oz/300 mL',
      'IsNtree'
    )
    expect(name).toBe('Aloe Fresh Type Soothing Gel')
    expect(totalAmount).toBe(300)
    expect(unit).toBe('mL')
  })
})

describe('Database Seeding Integration', () => {
  it('should seed a product and its ingredients into the test database', async () => {
    // 1. Setup
    const user = await getOrCreateSeedUser()
    const sampleData = [
      'SK-II Brightening Derm Revival Masks, 10 Count',
      'SK-II',
      'Skin Treatments',
      'Facial Masks',
      'Water, Glycerin, Niacinamide',
      'https://image.jpg',
      'https://product.com',
    ]

    const [rawName, brand, usageType, category, ingredientsList, imageUrl, productUrl] = sampleData
    const { name, totalAmount, unit } = extractCapacity(rawName, brand)

    // 2. Act: Seed Product
    const product = await createProduct(
      user.id,
      {
        name,
        brand,
        kind: usageType,
        unit,
        totalAmount,
        imageUrl,
        url: productUrl,
        slug: slugify(`${brand}-${name}`),
        notes: `Category: ${category}`,
      },
      testDb
    )

    expect(product.name).toBe('Brightening Derm Revival Masks')
    expect(product.imageUrl).toBe(imageUrl)

    // 3. Act: Seed Ingredients & Link
    const ingNames = ingredientsList.split(',').map((i) => i.trim())
    for (const ingName of ingNames) {
      const ingSlug = slugify(ingName)

      // Upsert ingredient
      let ingredient
      try {
        ingredient = await createIngredient(
          user.id,
          {
            name: ingName,
            slug: ingSlug,
            description: '',
            content: '',
            category: 'skincare',
          },
          testDb
        )
      } catch (e) {
        // Find existing if create fails
        ingredient = await testDb.query.ingredients.findFirst({
          where: (fields, { eq }) => eq(fields.slug, ingSlug),
        })
      }

      if (ingredient) {
        await addIngredientToProduct(testDb, {
          productId: product.id,
          ingredientId: ingredient.id,
          notes: null,
          concentrationValue: null,
          concentrationUnit: null,
          concentrationPer: null,
        })
      }
    }

    // 4. Validate results
    const dbProduct = await testDb.query.products.findFirst({
      where: (fields, { eq }) => eq(fields.id, product.id),
    })
    expect(dbProduct).toBeDefined()
    expect(dbProduct?.imageUrl).toBe(imageUrl)

    const linkedIngredients = await testDb
      .select()
      .from(productIngredients)
      .where(eq(productIngredients.productId, product.id))
    expect(linkedIngredients).toHaveLength(3)

    console.log('✅ Integration test passed: Product and 3 ingredients linked.')
  })
})

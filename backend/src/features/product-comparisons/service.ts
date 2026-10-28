import type {
  ComparisonSummary,
  CreateComparisonInput,
  EnrichedComparison,
  EnrichedComparisonProduct,
  UpdateComparisonInput,
} from '@aurore/shared'
import { classifyIngredientSignals, isDisplayedProductTag } from '@aurore/shared'

import { and, asc, count, eq, inArray } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../db'
import {
  ingredients,
  productComparisonItems,
  productComparisons,
  productIngredients,
  products,
  productTagLinks,
  productTagTypes,
} from '../../db/schema'
import { listInciTokens } from '../../lib/inci-facts'
import { getComparisonActives } from './actives'
import { linkFormulaTokens } from './formula-links'
import { markComparisonTokens } from './formula-markers'
import { ProductComparisonError } from './product-comparison-error'

export async function createComparison(
  userId: string,
  input: CreateComparisonInput,
  database: DatabaseTransaction
): Promise<ComparisonSummary> {
  const ids = input.productIds
  const found = await database
    .select({ id: products.id })
    .from(products)
    .where(inArray(products.id, ids))

  // Reject all if any id is bogus: UI assumes every productId resolves.
  if (found.length !== ids.length) {
    throw new ProductComparisonError('comparison_invalid_products')
  }

  return database.transaction(async (tx) => {
    const [comparison] = await tx
      .insert(productComparisons)
      .values({ userId, name: input.name ?? null })
      .returning()

    if (!comparison) throw new ProductComparisonError('comparison_invalid_products')

    await tx.insert(productComparisonItems).values(
      ids.map((productId, index) => ({
        comparisonId: comparison.id,
        productId,
        position: index,
      }))
    )

    // userId must not leak to the client.
    return {
      id: comparison.id,
      name: comparison.name,
      productCount: ids.length,
      unavailableProductCount: 0,
      createdAt: comparison.createdAt,
    }
  })
}

export async function getEnrichedComparison(
  userId: string,
  id: string,
  database: DatabaseTransaction
): Promise<EnrichedComparison> {
  const comparison = await database
    .select()
    .from(productComparisons)
    .where(and(eq(productComparisons.id, id), eq(productComparisons.userId, userId)))
    .limit(1)
    .then((rows) => rows[0])

  if (!comparison) throw new ProductComparisonError('comparison_not_found')

  const items = await database
    .select({
      productId: productComparisonItems.productId,
      position: productComparisonItems.position,
    })
    .from(productComparisonItems)
    .where(eq(productComparisonItems.comparisonId, id))
    .orderBy(asc(productComparisonItems.position))

  if (items.length === 0) {
    return {
      id: comparison.id,
      name: comparison.name,
      createdAt: comparison.createdAt,
      products: [],
      unavailableProductCount: 0,
    }
  }

  const visibleProducts = await getComparisonProducts(
    items.map((item) => item.productId),
    database
  )
  return {
    id: comparison.id,
    name: comparison.name,
    createdAt: comparison.createdAt,
    products: visibleProducts,
    unavailableProductCount: items.length - visibleProducts.length,
  }
}

export async function previewComparison(
  productIds: string[],
  database: DatabaseTransaction
): Promise<EnrichedComparisonProduct[]> {
  const products = await getComparisonProducts(productIds, database)
  if (products.length !== productIds.length) {
    throw new ProductComparisonError('comparison_invalid_products')
  }
  return products
}

function computeComparisonPricePer(
  product: Pick<EnrichedComparisonProduct, 'priceCents' | 'totalAmount' | 'amountUnit'>
): EnrichedComparisonProduct['pricePer'] {
  return product.priceCents !== null &&
    product.totalAmount !== null &&
    product.totalAmount > 0 &&
    (product.amountUnit === 'ml' || product.amountUnit === 'g' || product.amountUnit === 'unit')
    ? { unit: product.amountUnit, cents: product.priceCents / product.totalAmount }
    : null
}

async function getComparisonProducts(
  productIds: string[],
  database: DatabaseTransaction
): Promise<EnrichedComparisonProduct[]> {
  const productRows = await database
    .select({
      id: products.id,
      name: products.name,
      brand: products.brand,
      kind: products.kind,
      category: products.category,
      slug: products.slug,
      imageUrl: products.imageUrl,
      unit: products.unit,
      texture: products.texture,
      inci: products.inci,
      totalAmount: products.totalAmount,
      amountUnit: products.amountUnit,
      priceCents: products.priceCents,
    })
    .from(products)
    .where(inArray(products.id, productIds))

  // No position column on product_ingredients: order by createdAt for a stable UI order
  // Links inserted in one transaction share one createdAt, so the uuidv7 id breaks the tie
  const ingredientRows = await database
    .select({
      productId: productIngredients.productId,
      ingredientId: ingredients.id,
      name: ingredients.name,
      slug: ingredients.slug,
      canonicalKey: ingredients.canonicalKey,
      moderationStatus: ingredients.moderationStatus,
      createdAt: productIngredients.createdAt,
    })
    .from(productIngredients)
    .innerJoin(ingredients, eq(productIngredients.ingredientId, ingredients.id))
    .where(inArray(productIngredients.productId, productIds))
    .orderBy(asc(productIngredients.createdAt), asc(productIngredients.id))

  const tagRows = await database
    .select({
      productId: productTagLinks.productId,
      slug: productTagTypes.slug,
      tagType: productTagTypes.tagType,
      relevance: productTagLinks.relevance,
    })
    .from(productTagLinks)
    .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
    .where(inArray(productTagLinks.productId, productIds))

  const activesByProduct = await getComparisonActives(productRows, database)
  const productById = new Map(productRows.map((p) => [p.id, p]))

  const ingredientsByProduct = new Map<string, EnrichedComparisonProduct['ingredients']>()
  for (const row of ingredientRows) {
    const list = ingredientsByProduct.get(row.productId) ?? []
    list.push({
      id: row.ingredientId,
      inciName: row.name,
      slug: row.slug,
      signals: classifyIngredientSignals(row.slug),
    })
    ingredientsByProduct.set(row.productId, list)
  }

  const tagsByProduct = new Map<string, EnrichedComparisonProduct['tags']>()
  for (const row of tagRows) {
    // Comparator UI renders positive tags only, not avoid.
    if (row.relevance !== 'primary' && row.relevance !== 'secondary') continue
    if (!isDisplayedProductTag(row.slug)) continue
    const list = tagsByProduct.get(row.productId) ?? []
    list.push({
      slug: row.slug,
      tagType: row.tagType,
      relevance: row.relevance,
    })
    tagsByProduct.set(row.productId, list)
  }

  return productIds.flatMap((productId) => {
    const p = productById.get(productId)
    if (!p) return []
    const pricePer = computeComparisonPricePer(p)
    const enriched: EnrichedComparisonProduct = {
      id: p.id,
      name: p.name,
      brand: p.brand,
      kind: p.kind as string,
      slug: p.slug,
      imageUrl: p.imageUrl,
      unit: p.unit,
      texture: p.texture,
      totalAmount: p.totalAmount,
      amountUnit: p.amountUnit,
      priceCents: p.priceCents,
      pricePer,
      inciTokens: markComparisonTokens(
        linkFormulaTokens(
          listInciTokens(p.inci),
          ingredientRows.filter(
            (row) => row.productId === p.id && row.moderationStatus === 'visible'
          )
        )
      ),
      ingredients: ingredientsByProduct.get(p.id) ?? [],
      actives: activesByProduct.get(p.id) ?? [],
      tags: tagsByProduct.get(p.id) ?? [],
    }
    return [enriched]
  })
}

export async function updateComparison(
  userId: string,
  id: string,
  input: UpdateComparisonInput,
  database: DatabaseTransaction
) {
  const existing = await database.query.productComparisons.findFirst({
    where: and(eq(productComparisons.id, id), eq(productComparisons.userId, userId)),
  })
  if (!existing) throw new ProductComparisonError('comparison_not_found')

  await database.transaction(async (tx) => {
    if (input.name !== undefined) {
      await tx
        .update(productComparisons)
        .set({ name: input.name })
        .where(eq(productComparisons.id, id))
    }

    if (input.productIds !== undefined) {
      const found = await tx
        .select({ id: products.id })
        .from(products)
        .where(inArray(products.id, input.productIds))
      if (found.length !== input.productIds.length) {
        throw new ProductComparisonError('comparison_invalid_products')
      }
      await tx.delete(productComparisonItems).where(eq(productComparisonItems.comparisonId, id))
      await tx.insert(productComparisonItems).values(
        input.productIds.map((productId, index) => ({
          comparisonId: id,
          productId,
          position: index,
        }))
      )
    }
  })
}

export async function listComparisons(
  userId: string,
  database: DatabaseTransaction
): Promise<ComparisonSummary[]> {
  const rows = await database
    .select({
      id: productComparisons.id,
      name: productComparisons.name,
      createdAt: productComparisons.createdAt,
      productCount: count(products.id),
      storedProductCount: count(productComparisonItems.productId),
    })
    .from(productComparisons)
    .leftJoin(
      productComparisonItems,
      eq(productComparisonItems.comparisonId, productComparisons.id)
    )
    .leftJoin(products, eq(products.id, productComparisonItems.productId))
    .where(eq(productComparisons.userId, userId))
    .groupBy(productComparisons.id)
    .orderBy(asc(productComparisons.createdAt))

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    createdAt: r.createdAt,
    productCount: Number(r.productCount),
    unavailableProductCount: Number(r.storedProductCount) - Number(r.productCount),
  }))
}

export async function deleteComparison(userId: string, id: string, database: DatabaseTransaction) {
  const existing = await database.query.productComparisons.findFirst({
    where: and(eq(productComparisons.id, id), eq(productComparisons.userId, userId)),
  })
  if (!existing) throw new ProductComparisonError('comparison_not_found')
  await database.delete(productComparisons).where(eq(productComparisons.id, id))
}

import type { CreateTagInput, UpdateTagInput } from '@habit-tracker/shared'
import { createTagSchema } from '@habit-tracker/shared'

import slugify from '@sindresorhus/slugify'
import { and, eq, getTableColumns } from 'drizzle-orm'

import type { DB } from '../../db/index'
import { type Ingredient, ingredients } from '../../db/schema/ingredients'
import { type Product, products } from '../../db/schema/products'
import {
  type IngredientTagDef,
  ingredientTagsDefs,
  type ProductTagDef,
  productTagsDefs,
  tagIngredients,
  tagProducts,
} from '../../db/schema/tags'
import { isUniqueViolation } from '../../lib/helpers'
import { TagError } from './tags-error'

// ── Product tag definition CRUD ──────────────────────────────────────

export async function createProductTag(db: DB, data: CreateTagInput): Promise<ProductTagDef> {
  createTagSchema.parse(data)
  const slug = data.slug ?? slugify(data.name)
  try {
    const [tag] = await db
      .insert(productTagsDefs)
      .values({ slug, label: data.name, tagType: data.category ?? '' })
      .returning()
    if (!tag) throw new TagError('tag_creation_failed')
    return tag
  } catch (e) {
    if (e instanceof TagError) throw e
    if (isUniqueViolation(e)) throw new TagError('tag_already_exists')
    throw e
  }
}

export async function getProductTagById(db: DB, id: string): Promise<ProductTagDef | undefined> {
  const [tag] = await db.select().from(productTagsDefs).where(eq(productTagsDefs.id, id)).limit(1)
  return tag
}

export async function getProductTagBySlug(db: DB, slug: string): Promise<ProductTagDef | undefined> {
  const [tag] = await db.select().from(productTagsDefs).where(eq(productTagsDefs.slug, slug)).limit(1)
  return tag
}

export async function listProductTags(
  db: DB,
  params: { category?: string; limit?: number; offset?: number } = {}
) {
  const { category, limit = 100, offset = 0 } = params
  const where = category ? eq(productTagsDefs.tagType, category) : undefined
  return db.select().from(productTagsDefs).where(where).limit(limit).offset(offset).orderBy(productTagsDefs.label)
}

export async function updateProductTag(db: DB, id: string, data: UpdateTagInput): Promise<ProductTagDef> {
  createTagSchema.parse(data)
  try {
    const [tag] = await db
      .update(productTagsDefs)
      .set({ label: data.name, tagType: data.category ?? '' })
      .where(eq(productTagsDefs.id, id))
      .returning()
    if (!tag) throw new TagError('tag_not_found')
    return tag
  } catch (e) {
    if (e instanceof TagError) throw e
    if (isUniqueViolation(e)) throw new TagError('tag_already_exists')
    throw e
  }
}

export async function deleteProductTag(db: DB, id: string): Promise<boolean> {
  const result = await db.delete(productTagsDefs).where(eq(productTagsDefs.id, id)).returning({ id: productTagsDefs.id })
  return result.length > 0
}

// ── Ingredient tag definition CRUD ───────────────────────────────────

export async function createIngredientTag(db: DB, data: CreateTagInput): Promise<IngredientTagDef> {
  createTagSchema.parse(data)
  const slug = data.slug ?? slugify(data.name)
  try {
    const [tag] = await db
      .insert(ingredientTagsDefs)
      .values({ slug, label: data.name, tagType: data.category ?? '' })
      .returning()
    if (!tag) throw new TagError('tag_creation_failed')
    return tag
  } catch (e) {
    if (e instanceof TagError) throw e
    if (isUniqueViolation(e)) throw new TagError('tag_already_exists')
    throw e
  }
}

export async function getIngredientTagById(db: DB, id: string): Promise<IngredientTagDef | undefined> {
  const [tag] = await db.select().from(ingredientTagsDefs).where(eq(ingredientTagsDefs.id, id)).limit(1)
  return tag
}

export async function getIngredientTagBySlug(db: DB, slug: string): Promise<IngredientTagDef | undefined> {
  const [tag] = await db.select().from(ingredientTagsDefs).where(eq(ingredientTagsDefs.slug, slug)).limit(1)
  return tag
}

export async function listIngredientTags(
  db: DB,
  params: { category?: string; limit?: number; offset?: number } = {}
) {
  const { category, limit = 100, offset = 0 } = params
  const where = category ? eq(ingredientTagsDefs.tagType, category) : undefined
  return db.select().from(ingredientTagsDefs).where(where).limit(limit).offset(offset).orderBy(ingredientTagsDefs.label)
}

export async function updateIngredientTag(db: DB, id: string, data: UpdateTagInput): Promise<IngredientTagDef> {
  createTagSchema.parse(data)
  try {
    const [tag] = await db
      .update(ingredientTagsDefs)
      .set({ label: data.name, tagType: data.category ?? '' })
      .where(eq(ingredientTagsDefs.id, id))
      .returning()
    if (!tag) throw new TagError('tag_not_found')
    return tag
  } catch (e) {
    if (e instanceof TagError) throw e
    if (isUniqueViolation(e)) throw new TagError('tag_already_exists')
    throw e
  }
}

export async function deleteIngredientTag(db: DB, id: string): Promise<boolean> {
  const result = await db.delete(ingredientTagsDefs).where(eq(ingredientTagsDefs.id, id)).returning({ id: ingredientTagsDefs.id })
  return result.length > 0
}

// ── Product associations ─────────────────────────────────────────────

export async function addTagToProduct(
  db: DB,
  productId: string,
  productTagId: string,
  relevance: 'primary' | 'secondary' | 'avoid' = 'secondary'
) {
  const [link] = await db.insert(tagProducts).values({ productId, productTagId, relevance }).returning()
  return link
}

export async function addManyTagsToProduct(
  db: DB,
  productId: string,
  tagsInput: (string | { tagId: string; relevance?: 'primary' | 'secondary' | 'avoid' })[]
) {
  if (tagsInput.length === 0) return []

  const values = tagsInput.map((t) => {
    if (typeof t === 'string') {
      return { productId, productTagId: t, relevance: 'secondary' as const }
    }
    return { productId, productTagId: t.tagId, relevance: t.relevance ?? ('secondary' as const) }
  })

  return db.insert(tagProducts).values(values).returning()
}

export async function listTagsByProduct(db: DB, productId: string) {
  return db
    .select({
      productTagId: tagProducts.productTagId,
      productId: tagProducts.productId,
      relevance: tagProducts.relevance,
      tagName: productTagsDefs.label,
      tagSlug: productTagsDefs.slug,
      tagCategory: productTagsDefs.tagType,
    })
    .from(tagProducts)
    .innerJoin(productTagsDefs, eq(tagProducts.productTagId, productTagsDefs.id))
    .where(eq(tagProducts.productId, productId))
    .orderBy(productTagsDefs.tagType, productTagsDefs.label)
}

export async function listProductsByTag(db: DB, productTagId: string): Promise<Product[]> {
  return db
    .select(getTableColumns(products))
    .from(tagProducts)
    .innerJoin(products, eq(tagProducts.productId, products.id))
    .where(eq(tagProducts.productTagId, productTagId))
    .orderBy(products.name)
}

export async function removeTagFromProduct(db: DB, productId: string, productTagId: string): Promise<boolean> {
  const result = await db
    .delete(tagProducts)
    .where(and(eq(tagProducts.productId, productId), eq(tagProducts.productTagId, productTagId)))
    .returning({ productTagId: tagProducts.productTagId })
  return result.length > 0
}

export async function replaceProductTags(
  db: DB,
  productId: string,
  tagsInput: (string | { tagId: string; relevance?: 'primary' | 'secondary' | 'avoid' })[]
) {
  return db.transaction(async (tx) => {
    await tx.delete(tagProducts).where(eq(tagProducts.productId, productId))

    if (tagsInput.length === 0) return []

    const values = tagsInput.map((t) => {
      if (typeof t === 'string') {
        return { productId, productTagId: t, relevance: 'secondary' as const }
      }
      return { productId, productTagId: t.tagId, relevance: t.relevance ?? ('secondary' as const) }
    })

    return tx.insert(tagProducts).values(values).returning()
  })
}

// ── Ingredient associations ──────────────────────────────────────────

export async function addTagToIngredient(
  db: DB,
  ingredientId: string,
  ingredientTagId: string,
  relevance: 'primary' | 'secondary' | 'avoid' = 'secondary'
) {
  const [link] = await db.insert(tagIngredients).values({ ingredientId, ingredientTagId, relevance }).returning()
  return link
}

export async function addManyTagsToIngredient(
  db: DB,
  ingredientId: string,
  tagsInput: (string | { tagId: string; relevance?: 'primary' | 'secondary' | 'avoid' })[]
) {
  if (tagsInput.length === 0) return []

  const values = tagsInput.map((t) => {
    if (typeof t === 'string') {
      return { ingredientId, ingredientTagId: t, relevance: 'secondary' as const }
    }
    return { ingredientId, ingredientTagId: t.tagId, relevance: t.relevance ?? ('secondary' as const) }
  })

  return db.insert(tagIngredients).values(values).returning()
}

export async function listTagsByIngredient(db: DB, ingredientId: string) {
  return db
    .select({
      ingredientTagId: tagIngredients.ingredientTagId,
      ingredientId: tagIngredients.ingredientId,
      relevance: tagIngredients.relevance,
      tagName: ingredientTagsDefs.label,
      tagSlug: ingredientTagsDefs.slug,
      tagCategory: ingredientTagsDefs.tagType,
    })
    .from(tagIngredients)
    .innerJoin(ingredientTagsDefs, eq(tagIngredients.ingredientTagId, ingredientTagsDefs.id))
    .where(eq(tagIngredients.ingredientId, ingredientId))
    .orderBy(ingredientTagsDefs.tagType, ingredientTagsDefs.label)
}

export async function listIngredientsByTag(db: DB, ingredientTagId: string): Promise<Ingredient[]> {
  return db
    .select(getTableColumns(ingredients))
    .from(tagIngredients)
    .innerJoin(ingredients, eq(tagIngredients.ingredientId, ingredients.id))
    .where(eq(tagIngredients.ingredientTagId, ingredientTagId))
    .orderBy(ingredients.name)
}

export async function removeTagFromIngredient(db: DB, ingredientId: string, ingredientTagId: string): Promise<boolean> {
  const result = await db
    .delete(tagIngredients)
    .where(and(eq(tagIngredients.ingredientId, ingredientId), eq(tagIngredients.ingredientTagId, ingredientTagId)))
    .returning({ ingredientTagId: tagIngredients.ingredientTagId })
  return result.length > 0
}

export async function replaceIngredientTags(
  db: DB,
  ingredientId: string,
  tagsInput: (string | { tagId: string; relevance?: 'primary' | 'secondary' | 'avoid' })[]
) {
  return db.transaction(async (tx) => {
    await tx.delete(tagIngredients).where(eq(tagIngredients.ingredientId, ingredientId))

    if (tagsInput.length === 0) return []

    const values = tagsInput.map((t) => {
      if (typeof t === 'string') {
        return { ingredientId, ingredientTagId: t, relevance: 'secondary' as const }
      }
      return { ingredientId, ingredientTagId: t.tagId, relevance: t.relevance ?? ('secondary' as const) }
    })

    return tx.insert(tagIngredients).values(values).returning()
  })
}

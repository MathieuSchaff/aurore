import type { CreateTagInput, UpdateTagInput } from '@habit-tracker/shared'

import slugify from '@sindresorhus/slugify'
import { and, eq, getTableColumns } from 'drizzle-orm'

import type { DB } from '../../../db/index'
import { type Ingredient, ingredients } from '../../../db/schema/ingredients'
import { type Product, products } from '../../../db/schema/products'
import {
  type IngredientTag,
  ingredientTags,
  type ProductTag,
  productTags,
  type Tag,
  tags,
} from '../../../db/schema/tags'
import { isUniqueViolation } from '../../../lib/helpers'
import { TagError } from './tags-error'

// type ListTagsParams = {
//   category?: string
//   search?: string
//   limit?: number
//   offset?: number
// }

export async function createTag(db: DB, data: CreateTagInput): Promise<Tag> {
  const slug = data.slug ?? slugify(data.name)
  try {
    const [tag] = await db
      .insert(tags)
      .values({ ...data, slug })
      .returning()
    if (!tag) throw new TagError('tag_creation_failed')
    return tag
  } catch (e) {
    if (e instanceof TagError) throw e
    if (isUniqueViolation(e)) throw new TagError('tag_already_exists')
    throw e
  }
}
export async function getTagById(db: DB, id: string): Promise<Tag | undefined> {
  const [tag] = await db.select().from(tags).where(eq(tags.id, id)).limit(1)
  return tag
}

export async function getTagBySlug(db: DB, slug: string): Promise<Tag | undefined> {
  const [tag] = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1)
  return tag
}

export async function listTags(
  db: DB,
  params: { category?: string; search?: string; limit?: number; offset?: number } = {}
) {
  const { category, search, limit = 100, offset = 0 } = params

  const conditions = []

  if (category) conditions.push(eq(tags.category, category))
  // if (search) conditions.push(ilike(tags.name, `%${search}%`))

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [items] = await Promise.all([
    db.select().from(tags).where(where).limit(limit).offset(offset).orderBy(tags.name),
  ])

  return items
}

export async function updateTag(db: DB, id: string, data: UpdateTagInput): Promise<Tag> {
  try {
    const [tag] = await db.update(tags).set(data).where(eq(tags.id, id)).returning()
    if (!tag) throw new TagError('tag_not_found')
    return tag
  } catch (e) {
    if (e instanceof TagError) throw e
    if (isUniqueViolation(e)) throw new TagError('tag_already_exists')
    throw e
  }
}
export async function deleteTag(db: DB, id: string): Promise<boolean> {
  const result = await db.delete(tags).where(eq(tags.id, id)).returning({ id: tags.id })
  return result.length > 0
}

export async function addTagToProduct(
  db: DB,
  productId: string,
  tagId: string,
  relevance: 'primary' | 'secondary' | 'avoid' = 'secondary'
) {
  const [link] = await db.insert(productTags).values({ productId, tagId, relevance }).returning()
  return link
}

export async function addManyTagsToProduct(
  db: DB,
  productId: string,
  tagsInput: (string | { tagId: string; relevance?: 'primary' | 'secondary' | 'avoid' })[]
): Promise<ProductTag[]> {
  if (tagsInput.length === 0) return []

  const values = tagsInput.map((t) => {
    if (typeof t === 'string') {
      return { productId, tagId: t, relevance: 'secondary' as const }
    }
    return { productId, ...t, relevance: t.relevance ?? 'secondary' }
  })

  return db.insert(productTags).values(values).returning()
}

export async function listTagsByProduct(db: DB, productId: string) {
  return db
    .select({
      id: productTags.id,
      productId: productTags.productId,
      tagId: productTags.tagId,
      relevance: productTags.relevance,
      createdAt: productTags.createdAt,
      // Joined tag fields
      tagName: tags.name,
      tagSlug: tags.slug,
      tagCategory: tags.category,
    })
    .from(productTags)
    .innerJoin(tags, eq(productTags.tagId, tags.id))
    .where(eq(productTags.productId, productId))
    .orderBy(tags.category, tags.name)
}

export async function listProductsByTag(db: DB, tagId: string): Promise<Product[]> {
  return db
    .select(getTableColumns(products))
    .from(productTags)
    .innerJoin(products, eq(productTags.productId, products.id))
    .where(eq(productTags.tagId, tagId))
    .orderBy(products.name)
}

export async function removeTagFromProduct(
  db: DB,
  productId: string,
  tagId: string
): Promise<boolean> {
  const result = await db
    .delete(productTags)
    .where(and(eq(productTags.productId, productId), eq(productTags.tagId, tagId)))
    .returning({ id: productTags.id })
  return result.length > 0
}

export async function replaceProductTags(
  db: DB,
  productId: string,
  tagsInput: (string | { tagId: string; relevance?: 'primary' | 'secondary' | 'avoid' })[]
): Promise<ProductTag[]> {
  // We use a transaction because we must delete all old tags before we save the new list
  return db.transaction(async (tx) => {
    await tx.delete(productTags).where(eq(productTags.productId, productId))

    if (tagsInput.length === 0) return []

    const values = tagsInput.map((t) => {
      if (typeof t === 'string') {
        return { productId, tagId: t, relevance: 'secondary' as const }
      }
      return { productId, ...t, relevance: t.relevance ?? 'secondary' }
    })

    return tx.insert(productTags).values(values).returning()
  })
}

export async function addTagToIngredient(
  db: DB,
  ingredientId: string,
  tagId: string,
  relevance: 'primary' | 'secondary' | 'avoid' = 'secondary'
) {
  const [link] = await db
    .insert(ingredientTags)
    .values({ ingredientId, tagId, relevance })
    .returning()
  return link
}

export async function addManyTagsToIngredient(
  db: DB,
  ingredientId: string,
  tagsInput: (string | { tagId: string; relevance?: 'primary' | 'secondary' | 'avoid' })[]
): Promise<IngredientTag[]> {
  if (tagsInput.length === 0) return []

  const values = tagsInput.map((t) => {
    if (typeof t === 'string') {
      return { ingredientId, tagId: t, relevance: 'secondary' as const }
    }
    return { ingredientId, ...t, relevance: t.relevance ?? 'secondary' }
  })

  return db.insert(ingredientTags).values(values).returning()
}

export async function listTagsByIngredient(db: DB, ingredientId: string) {
  return db
    .select({
      id: ingredientTags.id,
      ingredientId: ingredientTags.ingredientId,
      tagId: ingredientTags.tagId,
      relevance: ingredientTags.relevance,
      createdAt: ingredientTags.createdAt,
      tagName: tags.name,
      tagSlug: tags.slug,
      tagCategory: tags.category,
    })
    .from(ingredientTags)
    .innerJoin(tags, eq(ingredientTags.tagId, tags.id))
    .where(eq(ingredientTags.ingredientId, ingredientId))
    .orderBy(tags.category, tags.name)
}

export async function listIngredientsByTag(db: DB, tagId: string): Promise<Ingredient[]> {
  return db
    .select(getTableColumns(ingredients))
    .from(ingredientTags)
    .innerJoin(ingredients, eq(ingredientTags.ingredientId, ingredients.id))
    .where(eq(ingredientTags.tagId, tagId))
    .orderBy(ingredients.name)
}

export async function removeTagFromIngredient(
  db: DB,
  ingredientId: string,
  tagId: string
): Promise<boolean> {
  const result = await db
    .delete(ingredientTags)
    .where(and(eq(ingredientTags.ingredientId, ingredientId), eq(ingredientTags.tagId, tagId)))
    .returning({ id: ingredientTags.id })
  return result.length > 0
}

export async function replaceIngredientTags(
  db: DB,
  ingredientId: string,
  tagsInput: (string | { tagId: string; relevance?: 'primary' | 'secondary' | 'avoid' })[]
): Promise<IngredientTag[]> {
  // Same thing as for the product, we use a transaction to be sure the data is clean
  return db.transaction(async (tx) => {
    await tx.delete(ingredientTags).where(eq(ingredientTags.ingredientId, ingredientId))

    if (tagsInput.length === 0) return []

    const values = tagsInput.map((t) => {
      if (typeof t === 'string') {
        return { ingredientId, tagId: t, relevance: 'secondary' as const }
      }
      return { ingredientId, ...t, relevance: t.relevance ?? 'secondary' }
    })

    return tx.insert(ingredientTags).values(values).returning()
  })
}

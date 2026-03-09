import type {
  CreateIngredientInput,
  FieldChange,
  IngredientChanges,
  IngredientSearchFilters,
  UpdateIngredientInput,
} from '@habit-tracker/shared'
import { ingredientChangesSchema } from '@habit-tracker/shared'

import slugify from '@sindresorhus/slugify'
import { and, eq, ilike, inArray, or, type SQL, sql } from 'drizzle-orm'

import { db } from '../../../db'
import type { Database } from '../../../db/index'
import { type Ingredient, ingredientEdits, ingredients } from '../../../db/schema/ingredients'
import { ingredientTags, tags } from '../../../db/schema/tags'
import { areEqual, isUniqueViolation } from '../../../lib/helpers'
import { IngredientError } from './ingredients-error'

const EXCLUDED_KEYS = new Set(['id', 'createdBy', 'createdAt', 'slug', 'updatedAt'])

export async function listIngredients(filters: IngredientSearchFilters, database: Database = db) {
  const conditions: SQL[] = []

  if (filters.category.length > 0) {
    conditions.push(inArray(ingredients.category, filters.category))
  }

  const addTagGroup = (slugs: string[]) => {
    if (slugs.length === 0) return
    conditions.push(
      inArray(
        ingredients.id,
        database
          .select({ ingredientId: ingredientTags.ingredientId })
          .from(ingredientTags)
          .innerJoin(tags, eq(ingredientTags.tagId, tags.id))
          .where(inArray(tags.slug, slugs))
      )
    )
  }

  addTagGroup(filters.concern)
  addTagGroup(filters.skinType)
  addTagGroup(filters.routineStep)
  addTagGroup(filters.attribute)

  const query = database
    .select()
    .from(ingredients)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(ingredients.name)

  console.log(query.toSQL())
  return query
}
export async function createIngredient(
  userId: string,
  input: CreateIngredientInput,
  database: Database = db
): Promise<Ingredient> {
  try {
    const [ingredient] = await database
      .insert(ingredients)
      .values({
        ...input,
        createdBy: userId,
        slug: input.slug ?? slugify(input.name),
      })
      .returning()

    if (!ingredient) throw new IngredientError('ingredient_creation_failed')

    return ingredient
  } catch (e) {
    if (e instanceof IngredientError) throw e
    if (isUniqueViolation(e)) throw new IngredientError('ingredient_already_exists')
    throw e
  }
}

export async function getIngredientById(id: string, database: Database = db): Promise<Ingredient> {
  const [ingredient] = await database
    .select()
    .from(ingredients)
    .where(eq(ingredients.id, id))
    .limit(1)

  if (!ingredient) throw new IngredientError('ingredient_not_found')
  return ingredient
}

export async function getIngredientBySlug(
  slug: string,
  database: Database = db
): Promise<Ingredient> {
  const [ingredient] = await database
    .select()
    .from(ingredients)
    .where(eq(ingredients.slug, slug))
    .limit(1)

  if (!ingredient) throw new IngredientError('ingredient_not_found')
  return ingredient
}

export async function updateIngredient(
  userId: string,
  id: string,
  data: UpdateIngredientInput,
  summary?: string,
  database: Database = db
): Promise<Ingredient> {
  const oldIngredient = await getIngredientById(id, database)
  const slug = data.slug ?? (data.name ? slugify(data.name) : undefined)
  if (slug) data.slug = slug
  const [newIngredient] = await database
    .update(ingredients)
    .set(data)
    .where(eq(ingredients.id, id))
    .returning()

  if (!newIngredient) throw new IngredientError('ingredient_update_failed')

  const changes: IngredientChanges = {}

  for (const key in data) {
    if (EXCLUDED_KEYS.has(key)) continue

    const k = key as keyof IngredientChanges
    const oldVal = oldIngredient[k]
    const newVal = newIngredient[k]

    if (!areEqual(oldVal, newVal)) {
      ;(changes as Record<string, FieldChange<unknown>>)[k] = {
        old: oldVal ?? null,
        new: newVal ?? null,
      }
    }
  }

  if (Object.keys(changes).length === 0) return newIngredient

  const parsed = ingredientChangesSchema.parse(changes)

  await database.insert(ingredientEdits).values({
    ingredientId: id,
    editedBy: userId,
    summary: summary ?? null,
    changes: parsed,
  })

  return newIngredient
}

export async function deleteIngredient(id: string, database: Database = db): Promise<void> {
  const rows = await database
    .delete(ingredients)
    .where(eq(ingredients.id, id))
    .returning({ id: ingredients.id })

  if (!rows[0]) throw new IngredientError('ingredient_delete_failed')
}

export async function listIngredientEdits(ingredientId: string, database: Database = db) {
  return database
    .select()
    .from(ingredientEdits)
    .where(eq(ingredientEdits.ingredientId, ingredientId))
    .orderBy(sql`${ingredientEdits.createdAt} DESC`)
}
export async function searchIngredients(
  query: string,
  database: Database = db,
  limit = 10
): Promise<Pick<Ingredient, 'id' | 'name' | 'slug' | 'category'>[]> {
  const pattern = `%${query}%`
  return database
    .select({
      id: ingredients.id,
      name: ingredients.name,
      slug: ingredients.slug,
      category: ingredients.category,
    })
    .from(ingredients)
    .where(or(ilike(ingredients.name, pattern), ilike(ingredients.slug, pattern)))
    .orderBy(ingredients.name)
    .limit(limit)
}

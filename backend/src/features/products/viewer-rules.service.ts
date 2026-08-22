import { resolveAvoidSlugs } from '@aurore/shared'

import { and, eq, exists, inArray, type SQL, sql } from 'drizzle-orm'

import type { DbOrTransaction } from '../../db/index'
import { ingredients, productIngredients } from '../../db/schema'
import { userDermoProfiles } from '../../db/schema/auth/users'
import { userIngredientPreferences } from '../../db/schema/ingredients/user-ingredient-preferences'
import { products } from '../../db/schema/products'
import { productTagLinks, productTagTypes } from '../../db/schema/tags/tags'
import { userTagPreferences } from '../../db/schema/tags/user-tag-preferences'

export type DeclaredPreferences = {
  excludeKeys: string[]
  requireKeys: string[]
  excludeTagIds: string[]
  requireTagIds: string[]
  // Text for the banner. An ingredient canonical key is already readable ("Parfum"),
  // so we use it as is. A tag brings its own label
  excludeLabels: string[]
  requireLabels: string[]
  tagLabelById: Map<string, string>
}

// These slugs only add a badge on the product card
//  they don't help to filter the list of products ( when we fetch products)
// For exemple: if a user pick "anti-acne" but the products have a the tag "acne-imperfections"
// then resolveAvoidSlugs map them. 16 of 22 concerns need a rename
// it most slugs match no tag at all and the badge never shows
export async function loadViewerRules(database: DbOrTransaction, userId: string) {
  const [dermoProfile] = await database
    .select({
      skinTypes: userDermoProfiles.skinTypes,
      skinConcerns: userDermoProfiles.skinConcerns,
    })
    .from(userDermoProfiles)
    // Public profiles can be read by other users
    // so we need to say where userDermoProfiles.userId = userId
    .where(eq(userDermoProfiles.userId, userId))
    .limit(1)
  const ingredientPrefs = await database
    .select({
      canonicalKey: userIngredientPreferences.canonicalKey,
      stance: userIngredientPreferences.stance,
    })
    .from(userIngredientPreferences)
    .where(eq(userIngredientPreferences.userId, userId))
  const tagPrefs = await database
    .select({
      tagId: userTagPreferences.tagId,
      label: productTagTypes.label,
      stance: userTagPreferences.stance,
    })
    .from(userTagPreferences)
    .innerJoin(productTagTypes, eq(productTagTypes.id, userTagPreferences.tagId))
    .where(eq(userTagPreferences.userId, userId))

  const avoidSlugs = dermoProfile
    ? resolveAvoidSlugs([...(dermoProfile.skinTypes ?? []), ...(dermoProfile.skinConcerns ?? [])])
    : []

  if (ingredientPrefs.length === 0 && tagPrefs.length === 0) {
    return {
      avoidSlugs,
      declaredPreferences: null,
      hasRules: avoidSlugs.length > 0,
    }
  }

  const excludeKeys = ingredientPrefs
    .filter((p) => p.stance === 'exclude')
    .map((p) => p.canonicalKey)
  const requireKeys = ingredientPrefs
    .filter((p) => p.stance === 'require')
    .map((p) => p.canonicalKey)
  const excludeTags = tagPrefs.filter((p) => p.stance === 'exclude')
  const requireTags = tagPrefs.filter((p) => p.stance === 'require')

  return {
    avoidSlugs,
    declaredPreferences: {
      excludeKeys,
      requireKeys,
      excludeTagIds: excludeTags.map((t) => t.tagId),
      requireTagIds: requireTags.map((t) => t.tagId),
      excludeLabels: [...excludeKeys, ...excludeTags.map((t) => t.label)],
      requireLabels: [...requireKeys, ...requireTags.map((t) => t.label)],
      tagLabelById: new Map(tagPrefs.map((t) => [t.tagId, t.label])),
    } satisfies DeclaredPreferences,
    hasRules: true,
  }
}

// One EXISTS for the ingredients, one for the tags
// Both read indexed columns: ingredients_canonical_key_idx,
// product_ingredients_product_idx, and the product_tag_links primary key
export function declaredTargetHits(
  keys: string[],
  tagIds: string[],
  database: DbOrTransaction
): SQL[] {
  const hits: SQL[] = []
  if (keys.length > 0) {
    hits.push(
      exists(
        database
          .select({ one: sql`1` })
          .from(productIngredients)
          .innerJoin(ingredients, eq(productIngredients.ingredientId, ingredients.id))
          .where(
            and(
              eq(productIngredients.productId, products.id),
              inArray(ingredients.canonicalKey, keys)
            )
          )
      )
    )
  }
  if (tagIds.length > 0) {
    hits.push(
      exists(
        database
          .select({ one: sql`1` })
          .from(productTagLinks)
          .where(
            and(
              eq(productTagLinks.productId, products.id),
              inArray(productTagLinks.productTagId, tagIds)
            )
          )
      )
    )
  }
  return hits
}

type DeclaredMatchMaps = {
  requireByProduct: Map<string, string[]>
  excludeByProduct: Map<string, string[]>
}

function addLabelOnce(map: Map<string, string[]>, productId: string, label: string) {
  const list = map.get(productId) ?? []
  if (!list.includes(label)) list.push(label)
  map.set(productId, list)
}

async function fetchIngredientMatches(
  itemIds: string[],
  ingredientKeys: string[],
  database: DbOrTransaction
) {
  if (ingredientKeys.length === 0) return []
  return database
    .selectDistinct({
      productId: productIngredients.productId,
      key: ingredients.canonicalKey,
    })
    .from(productIngredients)
    .innerJoin(ingredients, eq(productIngredients.ingredientId, ingredients.id))
    .where(
      and(
        inArray(productIngredients.productId, itemIds),
        inArray(ingredients.canonicalKey, ingredientKeys)
      )
    )
}

async function fetchTagMatches(itemIds: string[], tagIds: string[], database: DbOrTransaction) {
  if (tagIds.length === 0) return []
  return database
    .selectDistinct({
      productId: productTagLinks.productId,
      tagId: productTagLinks.productTagId,
    })
    .from(productTagLinks)
    .where(
      and(
        inArray(productTagLinks.productId, itemIds),
        inArray(productTagLinks.productTagId, tagIds)
      )
    )
}

function collectIngredientMatches(
  rows: Awaited<ReturnType<typeof fetchIngredientMatches>>,
  requireKeys: Set<string>,
  maps: DeclaredMatchMaps
) {
  for (const row of rows) {
    if (row.key === null) continue
    addLabelOnce(
      requireKeys.has(row.key) ? maps.requireByProduct : maps.excludeByProduct,
      row.productId,
      row.key
    )
  }
}

function collectTagMatches(
  rows: Awaited<ReturnType<typeof fetchTagMatches>>,
  declared: DeclaredPreferences,
  maps: DeclaredMatchMaps
) {
  const requireTags = new Set(declared.requireTagIds)
  for (const row of rows) {
    const label = declared.tagLabelById.get(row.tagId)
    if (!label) continue
    addLabelOnce(
      requireTags.has(row.tagId) ? maps.requireByProduct : maps.excludeByProduct,
      row.productId,
      label
    )
  }
}

export async function fetchDeclaredMatches(
  itemIds: string[],
  declared: DeclaredPreferences,
  includeExcluded: boolean,
  database: DbOrTransaction
): Promise<{ requireByProduct: Map<string, string[]>; excludeByProduct: Map<string, string[]> }> {
  const requireByProduct = new Map<string, string[]>()
  const excludeByProduct = new Map<string, string[]>()
  if (itemIds.length === 0) return { requireByProduct, excludeByProduct }

  // An excluded row is only on screen under include_excluded, so we only look it up then
  const ingredientKeys = includeExcluded
    ? [...declared.requireKeys, ...declared.excludeKeys]
    : declared.requireKeys
  const tagIds = includeExcluded
    ? [...declared.requireTagIds, ...declared.excludeTagIds]
    : declared.requireTagIds
  const ingredientRows = await fetchIngredientMatches(itemIds, ingredientKeys, database)
  collectIngredientMatches(ingredientRows, new Set(declared.requireKeys), {
    requireByProduct,
    excludeByProduct,
  })

  const tagRows = await fetchTagMatches(itemIds, tagIds, database)
  collectTagMatches(tagRows, declared, { requireByProduct, excludeByProduct })

  return { requireByProduct, excludeByProduct }
}

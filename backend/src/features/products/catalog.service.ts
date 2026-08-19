import type {
  ListProductsFilters,
  ProductKind,
  ProductListItem,
  ProductsPage,
  UserProductStatus,
} from '@aurore/shared'
import {
  DENTAL_PRODUCT_TAG_CATEGORIES,
  HAIRCARE_PRODUCT_TAG_CATEGORIES,
  isDisplayedProductTag,
  PRODUCT_DOMAIN_DB_CATEGORIES,
  type ProductDomainTab,
  SKINCARE_PRODUCT_TAG_CATEGORIES,
  SUPPLEMENT_PRODUCT_TAG_CATEGORIES,
} from '@aurore/shared'

import {
  and,
  asc,
  count,
  eq,
  exists,
  gte,
  inArray,
  lte,
  not,
  notExists,
  or,
  type SQL,
  sql,
} from 'drizzle-orm'

import type { DbOrTransaction } from '../../db/index'
import { ingredients, productIngredients } from '../../db/schema'
import { products } from '../../db/schema/products'
import { userProducts } from '../../db/schema/products/user-products'
import { productTagLinks, productTagTypes } from '../../db/schema/tags/tags'
import { productSearchMatch } from './search.service'
import {
  type DeclaredPreferences,
  declaredTargetHits,
  fetchDeclaredMatches,
  loadViewerRules,
} from './viewer-rules.service'

const PRODUCT_TAG_CATEGORIES_BY_DOMAIN = {
  skincare: SKINCARE_PRODUCT_TAG_CATEGORIES,
  haircare: HAIRCARE_PRODUCT_TAG_CATEGORIES,
  dental: DENTAL_PRODUCT_TAG_CATEGORIES,
  complement: SUPPLEMENT_PRODUCT_TAG_CATEGORIES,
} as const

function buildKindCondition(filters: ListProductsFilters): SQL | null {
  if (filters.kind) {
    const kinds = Array.isArray(filters.kind) ? filters.kind : filters.kind.split(',')
    return kinds.length === 1
      ? eq(products.kind, kinds[0] as ProductKind)
      : inArray(products.kind, kinds as ProductKind[])
  }
  return null
}

function buildBrandCondition(filters: ListProductsFilters): SQL | null {
  if (filters.brand) {
    const brands = Array.isArray(filters.brand) ? filters.brand : filters.brand.split(',')
    return brands.length === 1 ? eq(products.brand, brands[0]) : inArray(products.brand, brands)
  }
  return null
}

function buildIngredientCondition(
  filters: ListProductsFilters,
  database: DbOrTransaction
): SQL | null {
  // EXISTS stops at the first match for each product, using product_ingredients_product_idx
  // The old IN (SELECT ...) built the whole set first
  if (!filters.ingredient) return null
  const slugs = Array.isArray(filters.ingredient)
    ? filters.ingredient
    : filters.ingredient.split(',')
  if (slugs.length === 0) return null
  return exists(
    database
      .select({ one: sql`1` })
      .from(productIngredients)
      .innerJoin(ingredients, eq(productIngredients.ingredientId, ingredients.id))
      .where(and(eq(productIngredients.productId, products.id), inArray(ingredients.slug, slugs)))
  )
}

function buildTagFilterCondition(slugCsv: string, tagType: string, database: DbOrTransaction): SQL {
  return exists(
    database
      .select({ one: sql`1` })
      .from(productTagLinks)
      .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
      .where(
        and(
          eq(productTagLinks.productId, products.id),
          inArray(productTagTypes.slug, slugCsv.split(',')),
          eq(productTagTypes.tagType, tagType)
        )
      )
  )
}

const ROUTINE_MOMENT_UNIVERSAL = new Set(['moment-matin', 'moment-soir'])

function buildRoutineMomentCondition(slugCsv: string, database: DbOrTransaction): SQL {
  const slugs = slugCsv.split(',').map((slug) => slug.trim())
  const strict = buildTagFilterCondition(slugCsv, 'routine_moment', database)
  if (!slugs.some((slug) => ROUTINE_MOMENT_UNIVERSAL.has(slug))) return strict

  // matin and soir also match a product carrying no moment tag at all
  const noMomentTag = notExists(
    database
      .select({ one: sql`1` })
      .from(productTagLinks)
      .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
      .where(
        and(
          eq(productTagLinks.productId, products.id),
          eq(productTagTypes.tagType, 'routine_moment')
        )
      )
  )
  return or(strict, noMomentTag) as SQL
}

function buildTagConditions(filters: ListProductsFilters, database: DbOrTransaction): SQL[] {
  // `filters` is a union split on category, but the tagType we loop on covers every domain,
  // so TypeScript cannot narrow the lookup. Every tag field is string | undefined,
  // which is why the cast is safe
  const tagFilters = filters as unknown as Record<string, string | undefined>
  const conditions: SQL[] = []
  for (const tagType of PRODUCT_TAG_CATEGORIES_BY_DOMAIN[filters.category]) {
    const value = tagFilters[tagType]
    if (!value) continue
    conditions.push(
      tagType === 'routine_moment'
        ? buildRoutineMomentCondition(value, database)
        : buildTagFilterCondition(value, tagType, database)
    )
  }
  return conditions
}

function buildListConditions(filters: ListProductsFilters, database: DbOrTransaction): SQL[] {
  return [
    inArray(products.category, [...PRODUCT_DOMAIN_DB_CATEGORIES[filters.category]]),
    buildKindCondition(filters),
    buildBrandCondition(filters),
    buildIngredientCondition(filters, database),
    ...buildTagConditions(filters, database),
    filters.priceMin === undefined ? null : gte(products.priceCents, filters.priceMin),
    filters.priceMax === undefined ? null : lte(products.priceCents, filters.priceMax),
    filters.q ? productSearchMatch(filters.q).condition : null,
    filters.quality ? eq(products.catalogQuality, filters.quality) : null,
    filters.status ? eq(products.moderationStatus, filters.status) : null,
  ].filter((condition): condition is SQL => condition !== null)
}
type ProductRowExtras = {
  matchesByProduct: Map<string, string[]>
  tagsByProduct: Map<string, ProductListItem['tags']>
  statusByProduct: Map<string, UserProductStatus>
}

function emptyProductRowExtras(): ProductRowExtras {
  return {
    matchesByProduct: new Map<string, string[]>(),
    tagsByProduct: new Map<string, ProductListItem['tags']>(),
    statusByProduct: new Map<string, UserProductStatus>(),
  }
}

function collectProductTagRows(
  rows: {
    productId: string
    slug: string
    tagType: string
    relevance: 'primary' | 'secondary' | 'avoid'
  }[],
  avoidSlugs: string[],
  extras: ProductRowExtras
) {
  const avoidSlugSet = new Set(avoidSlugs)
  for (const row of rows) {
    if (row.relevance === 'avoid') {
      if (!avoidSlugSet.has(row.slug)) continue
      const list = extras.matchesByProduct.get(row.productId) ?? []
      list.push(row.slug)
      extras.matchesByProduct.set(row.productId, list)
      continue
    }
    if (!isDisplayedProductTag(row.slug)) continue
    const list = extras.tagsByProduct.get(row.productId) ?? []
    list.push({ slug: row.slug, tagType: row.tagType, relevance: row.relevance })
    extras.tagsByProduct.set(row.productId, list)
  }
}

// Scope shelf rows to the viewer because public review rows can belong to other users
export async function getShelfStatusByProductIds(
  database: DbOrTransaction,
  userId: string,
  productIds: string[]
): Promise<{ productId: string; status: UserProductStatus }[]> {
  if (productIds.length === 0) return []
  return database
    .select({ productId: userProducts.productId, status: userProducts.status })
    .from(userProducts)
    .where(and(eq(userProducts.userId, userId), inArray(userProducts.productId, productIds)))
}

async function fetchProductRowExtras(
  items: { id: string }[],
  userId: string | null,
  database: DbOrTransaction,
  avoidSlugs: string[]
): Promise<ProductRowExtras> {
  const extras = emptyProductRowExtras()
  if (items.length === 0) return extras

  const itemIds = items.map((i) => i.id)

  // One after the other, not Promise.all
  // For a logged in caller `database` is the RLS transaction, so one connection
  // Promise.all left it stuck "idle in transaction" right after the tag read
  // Ten of those empty the Bun SQL pool and the whole API goes down

  // Primary tags only: the card draws relevance='primary' chips
  // Nothing here reads the secondary ones, and avoid tags travel in profileMatches
  const tagRows = await database
    .select({
      productId: productTagLinks.productId,
      slug: productTagTypes.slug,
      tagType: productTagTypes.tagType,
      relevance: productTagLinks.relevance,
    })
    .from(productTagLinks)
    .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
    .where(
      and(
        inArray(productTagLinks.productId, itemIds),
        inArray(
          productTagLinks.relevance,
          avoidSlugs.length > 0 ? ['primary', 'avoid'] : ['primary']
        )
      )
    )

  const shelfRows = userId ? await getShelfStatusByProductIds(database, userId, itemIds) : []

  collectProductTagRows(tagRows, avoidSlugs, extras)
  for (const row of shelfRows) extras.statusByProduct.set(row.productId, row.status)
  return extras
}

type ViewerRuleSelection = {
  applyDeclared: boolean
  declaredPreferences: DeclaredPreferences | null
  avoidSlugs: string[]
}

const NO_VIEWER_RULES: ViewerRuleSelection = {
  applyDeclared: false,
  declaredPreferences: null,
  avoidSlugs: [],
}

function shouldApplyViewerRules(
  preference: ListProductsFilters['apply_preferences'],
  hasRules: boolean
) {
  if (preference === true) return true
  if (preference === 'auto') return hasRules
  return false
}

async function selectViewerRules(
  filters: ListProductsFilters,
  database: DbOrTransaction,
  userId: string | null
): Promise<ViewerRuleSelection> {
  if (!userId) return NO_VIEWER_RULES
  if (!filters.apply_preferences) return NO_VIEWER_RULES
  const viewerRules = await loadViewerRules(database, userId)
  if (!shouldApplyViewerRules(filters.apply_preferences, viewerRules.hasRules)) {
    return NO_VIEWER_RULES
  }
  return {
    applyDeclared: true,
    declaredPreferences: viewerRules.declaredPreferences,
    avoidSlugs: viewerRules.avoidSlugs,
  }
}

function buildViewerRuleConditions(
  declaredPreferences: DeclaredPreferences | null,
  database: DbOrTransaction
): SQL[] {
  if (!declaredPreferences) return []
  const excludeHits = declaredTargetHits(
    declaredPreferences.excludeKeys,
    declaredPreferences.excludeTagIds,
    database
  )
  const requireHits = declaredTargetHits(
    declaredPreferences.requireKeys,
    declaredPreferences.requireTagIds,
    database
  )
  return [
    ...excludeHits.map((hit) => not(hit) as SQL),
    ...(requireHits.length > 0 ? [or(...requireHits) as SQL] : []),
  ]
}

function resolveProductOrder(filters: ListProductsFilters) {
  switch (filters.sort) {
    case 'random':
      return [sql`random()`]
    case 'price_asc':
      return [sql`${products.priceCents} ASC NULLS LAST`]
    case 'price_desc':
      return [sql`${products.priceCents} DESC NULLS LAST`]
    case 'newest':
      return [sql`${products.createdAt} DESC NULLS LAST`]
    case 'name':
      return [products.name]
    default: {
      if (!filters.q) return [products.name]
      const match = productSearchMatch(filters.q)
      return [match.rank, match.similarityDesc, products.name]
    }
  }
}

async function countProductsByRules(
  database: DbOrTransaction,
  baseConditions: SQL[],
  ruleConditions: SQL[]
) {
  const rulesActive = ruleConditions.length > 0
  const [counts] = await database
    .select({
      base: count(),
      ruled: rulesActive
        ? sql<number>`count(*) FILTER (WHERE ${and(...ruleConditions)})`.mapWith(Number)
        : count(),
    })
    .from(products)
    .where(and(...baseConditions))
  return { baseTotal: counts?.base ?? 0, ruledTotal: counts?.ruled ?? 0 }
}

async function getDeclaredMatchesForItems(
  itemIds: string[],
  declaredPreferences: DeclaredPreferences | null,
  includeExcluded: boolean,
  database: DbOrTransaction
) {
  if (!declaredPreferences) {
    return {
      requireByProduct: new Map<string, string[]>(),
      excludeByProduct: new Map<string, string[]>(),
    }
  }
  return fetchDeclaredMatches(itemIds, declaredPreferences, includeExcluded, database)
}

export async function listProducts(
  filters: ListProductsFilters,
  database: DbOrTransaction,
  userId: string | null = null
): Promise<ProductsPage> {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 20
  const offset = (page - 1) * limit

  // The user rules only apply when the profile toggle is on and the caller is logged in
  // An anonymous caller reads nothing anyway, RLS makes sure of that
  // 'auto' resolves here so an unstated URL keeps one stable cache key on the client
  const { applyDeclared, declaredPreferences, avoidSlugs } = await selectViewerRules(
    filters,
    database,
    userId
  )
  // Each "Sans" rule removes rows on its own
  // The "Avec" rules are joined with OR, so a row needs at least one of them
  // With AND the list would already be empty by the third rule
  const ruleConditions = buildViewerRuleConditions(declaredPreferences, database)
  const rulesActive = ruleConditions.length > 0
  const enforceRules = rulesActive && !filters.include_excluded

  const baseConditions = buildListConditions(filters, database)
  const itemConditions = enforceRules ? [...baseConditions, ...ruleConditions] : baseConditions
  const where = itemConditions.length > 0 ? and(...itemConditions) : undefined

  const orderBy = resolveProductOrder(filters)

  const items = await database
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      brand: products.brand,
      kind: products.kind,
      unit: products.unit,
      priceCents: products.priceCents,
      totalAmount: products.totalAmount,
      amountUnit: products.amountUnit,
      imageUrl: products.imageUrl,
    })
    .from(products)
    .where(where)
    .orderBy(...orderBy)
    .limit(limit)
    .offset(offset)

  const { baseTotal, ruledTotal } = await countProductsByRules(
    database,
    baseConditions,
    ruleConditions
  )
  const total = enforceRules ? ruledTotal : baseTotal
  const hiddenCount = rulesActive ? Math.max(0, baseTotal - ruledTotal) : 0

  const { matchesByProduct, tagsByProduct, statusByProduct } = await fetchProductRowExtras(
    items,
    userId,
    database,
    avoidSlugs
  )

  const { requireByProduct, excludeByProduct } = await getDeclaredMatchesForItems(
    items.map((item) => item.id),
    declaredPreferences,
    Boolean(filters.include_excluded),
    database
  )

  const itemsWithMatches: ProductListItem[] = items.map((i) => ({
    ...i,
    profileMatches: matchesByProduct.get(i.id) ?? [],
    requireMatches: requireByProduct.get(i.id) ?? [],
    excludeMatches: excludeByProduct.get(i.id) ?? [],
    tags: tagsByProduct.get(i.id) ?? [],
    userStatus: statusByProduct.get(i.id) ?? null,
  }))

  return {
    items: itemsWithMatches,
    total,
    page,
    limit,
    hiddenCount,
    excludedLabels: declaredPreferences?.excludeLabels ?? [],
    requiredLabels: declaredPreferences?.requireLabels ?? [],
    rulesApplied: applyDeclared,
  }
}
export type FilterOptions = {
  kinds: string[]
  brands: string[]
  // A slug is here only if at least one product carries it
  // The frontend reads a missing slug as 0 and greys out the chip
  tagCounts: Record<string, number>
}

export async function getFilterOptions(
  database: DbOrTransaction,
  category?: ProductDomainTab
): Promise<FilterOptions> {
  const dbCategories = category ? [...PRODUCT_DOMAIN_DB_CATEGORIES[category]] : null
  const productScope = dbCategories ? inArray(products.category, dbCategories) : undefined

  // One after the other, not Promise.all: fetchProductRowExtras says what breaks when we fan them out
  const kindRows = await database
    .selectDistinct({ kind: products.kind })
    .from(products)
    .where(productScope)
    .orderBy(products.kind)

  const brands = await getDistinctBrands(database, category)

  const tagRows = await database
    .select({
      slug: productTagTypes.slug,
      count: count(productTagLinks.productId),
    })
    .from(productTagTypes)
    .innerJoin(productTagLinks, eq(productTagTypes.id, productTagLinks.productTagId))
    .innerJoin(products, eq(productTagLinks.productId, products.id))
    .where(productScope)
    .groupBy(productTagTypes.id, productTagTypes.slug)

  const tagCounts: Record<string, number> = {}
  for (const r of tagRows) {
    if (!isDisplayedProductTag(r.slug)) continue
    tagCounts[r.slug] = r.count
  }

  return {
    kinds: kindRows.map((r) => r.kind),
    brands,
    tagCounts,
  }
}
export async function getDistinctBrands(
  database: DbOrTransaction,
  category?: ProductDomainTab
): Promise<string[]> {
  const rows = await database
    .selectDistinct({ brand: products.brand })
    .from(products)
    .where(
      category ? inArray(products.category, [...PRODUCT_DOMAIN_DB_CATEGORIES[category]]) : undefined
    )
    .orderBy(asc(products.brand))
  return rows.map((r) => r.brand)
}

export async function getProductsByIds(
  ids: string[],
  database: DbOrTransaction
): Promise<{ id: string; name: string; brand: string }[]> {
  if (ids.length === 0) return []
  return database
    .select({ id: products.id, name: products.name, brand: products.brand })
    .from(products)
    .where(inArray(products.id, ids))
}

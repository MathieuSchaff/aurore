import type {
  AllIngredientTagCategory,
  CreateIngredientInput,
  IngredientErrorCode,
  IngredientFilterOptions,
  IngredientType,
  ListIngredientsSearchFilters,
  UpdateIngredientInput,
} from '@aurore/shared'
import {
  ALL_INGREDIENT_FILTER_CATEGORIES,
  createIngredientSchema,
  updateIngredientSchema,
} from '@aurore/shared'

import slugify from '@sindresorhus/slugify'
import { and, count, desc, eq, inArray, isNotNull, or, type SQL, sql } from 'drizzle-orm'

import type { Database, DatabaseTransaction, DbOrTransaction } from '../../db/index'
import { ingredientEdits, ingredients } from '../../db/schema/ingredients/ingredients'
import { ingredientTagLinks, ingredientTagTypes } from '../../db/schema/tags/tags'
import {
  assertWithinSubmissionRateLimit,
  type CatalogRole,
  resolveCatalogQuality,
  translateUniqueViolation,
} from '../../lib/catalog'
import { areEqual, escapeLike } from '../../lib/helpers'
import { buildChanges, ingredientEditConfig, logEdit } from '../../lib/logs'
import { normalizeInstant, nowISO } from '../../utils/dates'
import { IngredientError } from './ingredients-error'

function normalizeIngredient<T extends { createdAt: string; updatedAt: string }>(row: T): T {
  return {
    ...row,
    createdAt: normalizeInstant(row.createdAt),
    updatedAt: normalizeInstant(row.updatedAt),
  }
}

function normalizeEdit<T extends { createdAt: string }>(row: T): T {
  return { ...row, createdAt: normalizeInstant(row.createdAt) }
}

// Stricter than the shared noHtml refinement: a lone `<` / `>` or `javascript:`
// passes Zod but crashes the seed noHtml check and can leak into rendered INCI lists.
function assertNameNoHtml(name: string, code: IngredientErrorCode) {
  if (name.includes('<') || name.includes('>') || name.includes('javascript:')) {
    throw new IngredientError(code, { publicDetails: 'Nom invalide' })
  }
}

// Fields the caller may never overwrite; silently skipped in updateIngredient.
const IMMUTABLE_KEYS = new Set(['id', 'createdBy', 'createdAt', 'updatedAt'])

// Fields tracked in the audit log. Mirrors `ingredientChangesSchema` in shared/.
const TRACKED_FIELDS = ['name', 'description', 'content', 'type', 'category'] as const

// Mutable copy because drizzle inArray rejects readonly arrays.
const ALL_FILTER_CATEGORIES = [...ALL_INGREDIENT_FILTER_CATEGORIES]

export async function listIngredients(database: Database, filters: ListIngredientsSearchFilters) {
  const conditions: SQL[] = []
  const page = filters.page ?? 1
  const limit = filters.limit ?? 20
  const offset = (page - 1) * limit

  // All tag filters share the same subquery shape: "ingredient has at least
  // one row in ingredient_tags whose tag slug is in this list". AND across
  // axes, OR within an axis.
  const addTagGroup = (slugs: string[]) => {
    if (slugs.length === 0) return
    conditions.push(
      inArray(
        ingredients.id,
        database
          .select({ ingredientId: ingredientTagLinks.ingredientId })
          .from(ingredientTagLinks)
          .innerJoin(
            ingredientTagTypes,
            eq(ingredientTagLinks.ingredientTagId, ingredientTagTypes.id)
          )
          .where(inArray(ingredientTagTypes.slug, slugs))
      )
    )
  }

  for (const axis of ALL_INGREDIENT_FILTER_CATEGORIES) {
    addTagGroup(filters[axis]?.split(',').filter(Boolean) ?? [])
  }

  const ingredientTypes = filters.ingredient_type?.split(',').filter(Boolean) ?? []
  if (ingredientTypes.length > 0) {
    conditions.push(inArray(ingredients.type, ingredientTypes as IngredientType[]))
  }

  if (filters.quality) {
    conditions.push(eq(ingredients.catalogQuality, filters.quality))
  }
  if (filters.status) {
    conditions.push(eq(ingredients.moderationStatus, filters.status))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const orderBy = filters.sort === 'random' ? sql`random()` : ingredients.name

  // avoid_for is computed after the fetch as per-ingredient profileMatches (badge UX)
  // Mirrors products. Never excludes rows.
  const avoidSlugs = filters.avoid_for ? filters.avoid_for.split(',').filter(Boolean) : []

  // Promise.all is safe because the HTTP route deliberately passes anonDb and this
  // public-read service requires Database rather than DatabaseTransaction.
  const [items, [{ total }]] = await Promise.all([
    database
      .select({
        id: ingredients.id,
        name: ingredients.name,
        slug: ingredients.slug,
        type: ingredients.type,
        category: ingredients.category,
        // Truncated to keep the list payload small, full text on detail page.
        description: sql<string | null>`left(${ingredients.description}, 120)`,
      })
      .from(ingredients)
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    database
      .select({ total: sql<number>`cast(count(*) as integer)` })
      .from(ingredients)
      .where(where),
  ])

  const matchesByIngredient = new Map<string, string[]>()
  if (items.length > 0 && avoidSlugs.length > 0) {
    const itemIds = items.map((i) => i.id)
    const avoidRows = await database
      .select({ ingredientId: ingredientTagLinks.ingredientId, slug: ingredientTagTypes.slug })
      .from(ingredientTagLinks)
      .innerJoin(ingredientTagTypes, eq(ingredientTagLinks.ingredientTagId, ingredientTagTypes.id))
      .where(
        and(
          inArray(ingredientTagLinks.ingredientId, itemIds),
          inArray(ingredientTagTypes.slug, avoidSlugs),
          eq(ingredientTagLinks.relevance, 'avoid')
        )
      )
    for (const row of avoidRows) {
      const list = matchesByIngredient.get(row.ingredientId) ?? []
      list.push(row.slug)
      matchesByIngredient.set(row.ingredientId, list)
    }
  }

  const itemsWithMatches = items.map((i) => ({
    ...i,
    profileMatches: matchesByIngredient.get(i.id) ?? [],
  }))

  return { items: itemsWithMatches, total }
}

export async function createIngredient(
  database: DatabaseTransaction,
  userId: string,
  role: CatalogRole,
  input: CreateIngredientInput
) {
  createIngredientSchema.parse(input)

  assertNameNoHtml(input.name, 'ingredient_creation_failed')

  await assertWithinSubmissionRateLimit(
    database,
    'count_recent_ingredient_submissions',
    userId,
    role,
    () => new IngredientError('ingredient_rate_limited')
  )

  // Users who are not admins cannot pick a custom slug; derive from name to prevent taxonomy squatting.
  const slug = input.slug && role === 'admin' ? slugify(input.slug) : slugify(input.name)

  try {
    // Reject as a duplicate (409 + existing) if a public ingredient already has this
    // slug. Only public ones count, so a hidden/rejected one never blocks a new submission.
    // This check can be raced by a concurrent insert; the 23505 catch below is the backstop.
    const [existing] = await database
      .select({ id: ingredients.id, slug: ingredients.slug, name: ingredients.name })
      .from(ingredients)
      .where(and(eq(ingredients.slug, slug), eq(ingredients.moderationStatus, 'visible')))
      .limit(1)
    if (existing) {
      throw new IngredientError('ingredient_already_exists', { publicDetails: existing })
    }

    const [ingredient] = await database
      .insert(ingredients)
      .values({
        ...input,
        createdBy: userId,
        slug,
        ...resolveCatalogQuality(role, userId),
      })
      .returning()

    if (!ingredient) throw new IngredientError('ingredient_creation_failed')

    return normalizeIngredient(ingredient)
  } catch (e) {
    if (e instanceof IngredientError) throw e
    translateUniqueViolation(e, () => new IngredientError('ingredient_already_exists'))
  }
}

export async function getIngredientById(database: DatabaseTransaction, id: string) {
  const [ingredient] = await database
    .select()
    .from(ingredients)
    .where(eq(ingredients.id, id))
    .limit(1)

  if (!ingredient) throw new IngredientError('ingredient_not_found')
  return normalizeIngredient(ingredient)
}

export async function getIngredientBySlug(database: DbOrTransaction, slug: string) {
  const [ingredient] = await database
    .select()
    .from(ingredients)
    .where(eq(ingredients.slug, slug))
    .limit(1)

  if (!ingredient) throw new IngredientError('ingredient_not_found')
  return normalizeIngredient(ingredient)
}

export async function updateIngredient(
  database: DatabaseTransaction,
  userId: string,
  id: string,
  data: UpdateIngredientInput,
  summary?: string,
  expectedUpdatedAt?: string
) {
  updateIngredientSchema.parse(data)

  const oldIngredient = await getIngredientById(database, id)

  if (data.name) assertNameNoHtml(data.name, 'ingredient_update_failed')

  // Skip unchanged fields to avoid spurious UPDATE + audit entries.
  const filteredData: Partial<UpdateIngredientInput> = {}

  for (const key of Object.keys(data) as (keyof UpdateIngredientInput)[]) {
    if (IMMUTABLE_KEYS.has(key)) continue
    if (areEqual(oldIngredient[key as keyof typeof oldIngredient], data[key])) continue
    // Object.assign works around TS losing the index type on dynamic keys.
    Object.assign(filteredData, { [key]: data[key] })
  }

  if (Object.keys(filteredData).length === 0) {
    // Still check OCC so a stale client gets a 409, not a silent no-op.
    if (expectedUpdatedAt && oldIngredient.updatedAt !== expectedUpdatedAt) {
      throw new IngredientError('ingredient_update_conflict')
    }
    return oldIngredient // already normalized via getIngredientById
  }

  const whereConditions = [eq(ingredients.id, id)]
  if (expectedUpdatedAt) {
    whereConditions.push(eq(ingredients.updatedAt, expectedUpdatedAt))
  }

  const [newIngredient] = await database
    .update(ingredients)
    .set(filteredData)
    .where(and(...whereConditions))
    .returning()

  if (!newIngredient) {
    // 0-row UPDATE: with a lock set, the row moved under us, so 409 (client reloads, wins over 403).
    // Otherwise getIngredientById already proved the row is visible, so 0 rows means the
    // caller can't edit it, so 403. Never read rowCount (bun-postgres footgun).
    if (expectedUpdatedAt) throw new IngredientError('ingredient_update_conflict')
    throw new IngredientError('unauthorized_access')
  }

  const changes = buildChanges(oldIngredient, newIngredient, TRACKED_FIELDS)

  await logEdit(database, ingredientEditConfig, {
    entityId: id,
    editedBy: userId,
    summary: summary ?? null,
    changes,
  })

  return normalizeIngredient(newIngredient)
}

// Stamp an ingredient as verified. Route guard (requireCatalogWrite) limits
// callers to admin/contributor; only sets the quality stamp. Once a row is
// verified it stays verified, there is no way back.
export async function verifyIngredient(database: DatabaseTransaction, actorId: string, id: string) {
  const [row] = await database
    .update(ingredients)
    .set({
      catalogQuality: 'verified',
      verifiedBy: actorId,
      verifiedAt: nowISO(),
    })
    .where(and(eq(ingredients.id, id), eq(ingredients.moderationStatus, 'visible')))
    .returning()
  if (!row) throw new IngredientError('ingredient_not_found')
  return normalizeIngredient(row)
}

export async function deleteIngredient(
  database: DatabaseTransaction,
  role: 'user' | 'admin' | 'contributor',
  id: string
) {
  if (role !== 'admin') throw new IngredientError('unauthorized_access')

  const rows = await database
    .delete(ingredients)
    .where(eq(ingredients.id, id))
    .returning({ id: ingredients.id })

  if (!rows[0]) throw new IngredientError('ingredient_delete_failed')
}

export async function listIngredientEdits(database: DbOrTransaction, ingredientId: string) {
  const rows = await database
    .select()
    .from(ingredientEdits)
    .where(eq(ingredientEdits.ingredientId, ingredientId))
    .orderBy(sql`${ingredientEdits.createdAt} DESC`)
  return rows.map(normalizeEdit)
}

function buildIngredientSearch(query: string) {
  const q = query.trim()
  if (!q) return null
  const escaped = escapeLike(q)
  const rank = sql<number>`CASE
        WHEN search_norm(${ingredients.name}) = search_norm(${q})
          OR search_norm(${ingredients.slug}) = search_norm(${q}) THEN 0
        WHEN search_norm(${ingredients.name}) LIKE search_norm(${escaped}) || '%' ESCAPE '\\'
          OR search_norm(${ingredients.slug}) LIKE search_norm(${escaped}) || '%' ESCAPE '\\' THEN 1
        WHEN search_norm(${ingredients.name}) LIKE '%' || search_norm(${escaped}) || '%' ESCAPE '\\'
          OR search_norm(${ingredients.slug}) LIKE '%' || search_norm(${escaped}) || '%' ESCAPE '\\' THEN 2
        ELSE 3
      END`
  const similarity = sql<number>`GREATEST(
        similarity(search_norm(${ingredients.name}), search_norm(${q})),
        similarity(search_norm(${ingredients.slug}), search_norm(${q}))
      )`
  const matches = or(
    sql`search_norm(${ingredients.name}) LIKE '%' || search_norm(${escaped}) || '%' ESCAPE '\\'`,
    sql`search_norm(${ingredients.slug}) LIKE '%' || search_norm(${escaped}) || '%' ESCAPE '\\'`,
    sql`search_norm(${ingredients.name}) % search_norm(${q})`,
    sql`search_norm(${ingredients.slug}) % search_norm(${q})`
  )
  return { rank, similarity, matches }
}

const ingredientSearchColumns = {
  id: ingredients.id,
  name: ingredients.name,
  slug: ingredients.slug,
  type: ingredients.type,
  category: ingredients.category,
  canonicalKey: ingredients.canonicalKey,
}

// Fuzzy search aligned with `searchProducts`: accent-folded substring fallback
// catches short queries below the trigram floor, with similarity for typos.
export async function searchIngredients(
  database: Database,
  query: string,
  opts: { limit?: number; type?: IngredientType } = {}
) {
  const { limit = 10, type } = opts
  const search = buildIngredientSearch(query)
  if (!search) return []

  return database
    .select({
      ...ingredientSearchColumns,
      // The catalogue filter reads product_ingredients, which drops excipients and
      // overly common tokens on purpose. Without this flag the filter offers Glycerin
      // and then matches nothing, which reads as a bug instead of a boundary.
      // Table-qualified by hand: drizzle interpolates a column ref unqualified, so
      // the outer `ingredients.id` would bind inside the subquery and never match.
      filterable: sql<boolean>`exists (
        select 1 from product_ingredients
        where product_ingredients.ingredient_id = ingredients.id
      )`,
    })
    .from(ingredients)
    .where(and(type ? eq(ingredients.type, type) : undefined, search.matches))
    .orderBy(search.rank, desc(search.similarity), ingredients.name)
    .limit(limit)
}

export async function searchIngredientIdentities(
  database: Database,
  query: string,
  opts: { limit?: number; type?: IngredientType } = {}
) {
  const { limit = 10, type } = opts
  const search = buildIngredientSearch(query)
  if (!search) return []

  // Row-level search must keep aliases; only preference search collapses them.
  const representatives = database
    .selectDistinctOn([ingredients.canonicalKey], {
      ...ingredientSearchColumns,
      searchRank: search.rank.as('search_rank'),
      searchSimilarity: search.similarity.as('search_similarity'),
    })
    .from(ingredients)
    .where(
      and(
        isNotNull(ingredients.canonicalKey),
        type ? eq(ingredients.type, type) : undefined,
        search.matches
      )
    )
    .orderBy(
      ingredients.canonicalKey,
      search.rank,
      desc(search.similarity),
      ingredients.name,
      ingredients.slug
    )
    .as('ingredient_identity_representatives')

  return database
    .select({
      id: representatives.id,
      name: representatives.name,
      slug: representatives.slug,
      type: representatives.type,
      category: representatives.category,
      canonicalKey: sql<string>`${representatives.canonicalKey}`,
    })
    .from(representatives)
    .orderBy(
      representatives.searchRank,
      desc(representatives.searchSimilarity),
      representatives.name,
      representatives.slug
    )
    .limit(limit)
}

export async function getIngredientFilterOptions(
  database: Database,
  domain?: IngredientType
): Promise<IngredientFilterOptions> {
  const ingredientScope = domain ? eq(ingredients.type, domain) : undefined

  const rows = await database
    .select({
      slug: ingredientTagTypes.slug,
      name: ingredientTagTypes.label,
      category: ingredientTagTypes.tagType,
      count: count(ingredientTagLinks.ingredientId),
    })
    .from(ingredientTagTypes)
    .innerJoin(ingredientTagLinks, eq(ingredientTagTypes.id, ingredientTagLinks.ingredientTagId))
    .innerJoin(ingredients, eq(ingredientTagLinks.ingredientId, ingredients.id))
    .where(
      ingredientScope
        ? and(inArray(ingredientTagTypes.tagType, ALL_FILTER_CATEGORIES), ingredientScope)
        : inArray(ingredientTagTypes.tagType, ALL_FILTER_CATEGORIES)
    )
    .groupBy(
      ingredientTagTypes.id,
      ingredientTagTypes.slug,
      ingredientTagTypes.label,
      ingredientTagTypes.tagType
    )
    .orderBy(ingredientTagTypes.tagType, ingredientTagTypes.label)

  const tags = rows
    .filter((r): r is typeof r & { category: AllIngredientTagCategory } => r.category !== null)
    .map((r) => ({ slug: r.slug, name: r.name, category: r.category, count: r.count }))

  return { tags }
}

export async function listAllIngredientOptions(database: Database, type?: IngredientType) {
  return database
    .select({
      id: ingredients.id,
      name: ingredients.name,
      slug: ingredients.slug,
    })
    .from(ingredients)
    .where(type ? eq(ingredients.type, type) : undefined)
    .orderBy(ingredients.name)
}

// Batch lookup used by the async ingredient filter to resolve `name` for
// chips deep-linked from the URL (a slug list with no labels in cache).
export async function listIngredientsBySlugs(database: Database, slugs: string[]) {
  if (slugs.length === 0) return []
  return database
    .select({ slug: ingredients.slug, name: ingredients.name })
    .from(ingredients)
    .where(inArray(ingredients.slug, slugs))
}

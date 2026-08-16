import type {
  CreateProductInput,
  ListProductsFilters,
  ProductKind,
  ProductSearchPage,
  ProductSearchResult,
  ProductUnit,
  UpdateProductInput,
  UserProductStatus,
} from '@aurore/shared'
import {
  DENTAL_PRODUCT_TAG_CATEGORIES,
  HAIRCARE_PRODUCT_TAG_CATEGORIES,
  isDisplayedProductTag,
  PRODUCT_DOMAIN_DB_CATEGORIES,
  type ProductDomainTab,
  resolveAvoidSlugs,
  SKINCARE_PRODUCT_TAG_CATEGORIES,
  SUPPLEMENT_PRODUCT_TAG_CATEGORIES,
} from '@aurore/shared'

import slugify from '@sindresorhus/slugify'
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

import type { DatabaseTransaction, DbOrTransaction } from '../../db/index'
import { ingredients, productIngredients } from '../../db/schema'
import { userDermoProfiles } from '../../db/schema/auth/users'
import { userIngredientPreferences } from '../../db/schema/ingredients/user-ingredient-preferences'
import { type Product, products } from '../../db/schema/products'
import { userProducts } from '../../db/schema/products/user-products'
import { productTagLinks, productTagTypes } from '../../db/schema/tags/tags'
import { userTagPreferences } from '../../db/schema/tags/user-tag-preferences'
import {
  assertWithinSubmissionRateLimit,
  type CatalogRole,
  resolveCatalogQuality,
  translateUniqueViolation,
} from '../../lib/catalog'
import { escapeLike } from '../../lib/helpers'
import { computeInciFacts } from '../../lib/inci-facts'
import { buildChanges, logEdit, productEditConfig } from '../../lib/logs'
import { normalizeInci } from '../../lib/normalize-inci'
import { nowISO } from '../../utils/dates'
import { type OrchestratorProductFields, writeTagsForProductFailSoft } from '../auto-tagging'
import { listTagsByProduct } from '../product-tags/service'
import { ProductError } from './product-error'
import { listIngredientsByProduct } from './product-ingredients/product-ingredients.service'

// Trim and collapse the spaces inside the string
// so create and update always write the exact same value.
const normalizeString = (s: string) => s.trim().replace(/\s+/g, ' ')

const NORMALIZED_STRING_FIELDS = ['name', 'brand', 'kind', 'unit', 'amountUnit'] as const

const PRODUCT_TAG_CATEGORIES_BY_DOMAIN = {
  skincare: SKINCARE_PRODUCT_TAG_CATEGORIES,
  haircare: HAIRCARE_PRODUCT_TAG_CATEGORIES,
  dental: DENTAL_PRODUCT_TAG_CATEGORIES,
  complement: SUPPLEMENT_PRODUCT_TAG_CATEGORIES,
} as const

export async function createProduct(
  userId: string,
  role: CatalogRole,
  input: CreateProductInput,
  database: DatabaseTransaction,
  options: { autoTag?: boolean } = {}
) {
  try {
    await assertWithinSubmissionRateLimit(
      database,
      'count_recent_product_submissions',
      userId,
      role,
      () => new ProductError('product_rate_limited')
    )

    const name = normalizeString(input.name)
    const brand = normalizeString(input.brand)

    // Reject if a visible product already has the same name and brand.
    // We compare with norm(), the same function the DB unique index uses.
    // Hidden and rejected products don't count, so they never block a new submission.
    // Two inserts at the same time can both pass this check.
    // The 23505 catch at the end of the function is the real guard.
    const [existing] = await database
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        brand: products.brand,
        kind: products.kind,
      })
      .from(products)
      .where(
        and(
          eq(products.moderationStatus, 'visible'),
          sql`norm(${products.name}) = norm(${name})`,
          sql`norm(${products.brand}) = norm(${brand})`
        )
      )
      .limit(1)
    if (existing) throw new ProductError('product_already_exists', existing)

    const slug = input.slug ?? `${name}${brand ? `-${brand}` : ''}`
    const [product] = await database
      .insert(products)
      .values({
        ...input,
        createdBy: userId,
        name,
        brand,
        // We write null, never ''.
        // If '' could reach the column, every reader would need a `btrim(inci) <> ''` guard
        // to tell "we have no formula" from "the formula is empty".
        inci: input.inci?.trim() ? normalizeInci(input.inci).value : null,
        kind: normalizeString(input.kind) as ProductKind,
        unit: normalizeString(input.unit) as ProductUnit,
        amountUnit: input.amountUnit ? normalizeString(input.amountUnit) : input.amountUnit,
        slug: slugify(slug),
        ...resolveCatalogQuality(role, userId),
      })
      .returning()

    if (!product) throw new ProductError('product_creation_failed')

    // The seed passes autoTag:false. It tags later, once the ingredients are linked.
    // Tagging here would see zero ingredient, then collide on the primary key with the seed phase.
    if (options.autoTag ?? true) {
      await writeTagsForProductFailSoft(database, product.id, { operation: 'create', userId })
    }

    return product
  } catch (e) {
    if (e instanceof ProductError) throw e
    translateUniqueViolation(e, () => new ProductError('product_already_exists'))
  }
}
async function getProductRow(condition: SQL, database: DbOrTransaction) {
  const row = await database
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      brand: products.brand,
      category: products.category,
      description: products.description,
      inci: products.inci,
      totalAmount: products.totalAmount,
      amountUnit: products.amountUnit,
      url: products.url,
      imageUrl: products.imageUrl,
      unit: products.unit,
      priceCents: products.priceCents,
      kind: products.kind,
      texture: products.texture,
      notes: products.notes,
      catalogQuality: products.catalogQuality,
      moderationStatus: products.moderationStatus,
      createdBy: products.createdBy,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .where(condition)
    .limit(1)
  return row[0] ?? null
}

export async function getProductById(id: string, database: DatabaseTransaction) {
  const row = await getProductRow(eq(products.id, id), database)
  if (!row) throw new ProductError('product_not_found')
  return row
}

export async function getProductBySlug(slug: string, database: DbOrTransaction) {
  const row = await getProductRow(eq(products.slug, slug), database)
  if (!row) throw new ProductError('product_not_found')
  return row
}

// One call for Layout, Info, Edit and Sheet, so they all share the same cache entry.
export async function getProductFullBySlug(slug: string, database: DbOrTransaction) {
  const product = await getProductBySlug(slug, database)
  // One after the other, not Promise.all: fetchProductMeta says what breaks when we fan them out
  const ingredients = await listIngredientsByProduct(database, product.id)
  // We send every tag, even the internal ones.
  // ProductEditPage fills its tag form from here and posts it back,
  // so dropping a tag here would erase it on every admin save.
  // Nothing shows on screen today because the detail page reads `tags` through
  // PROFILE_CATEGORIES, and that list has no product_characteristic.
  // That is luck, not a guard. Add it to the list and the marketing claims appear.
  const tags = await listTagsByProduct(database, product.id)
  // We name the two fields instead of spreading.
  // A rename in computeInciFacts must break the build, not silently rename a payload key.
  const { inciCount, hasFragrance } = computeInciFacts(product.inci)
  return {
    ...product,
    inciCount,
    hasFragrance,
    ingredients,
    tags,
  }
}

// id, createdBy and createdAt never change.
// The quality, moderation and verify fields are only set by an admin route.
const EXCLUDED_KEYS = new Set([
  'id',
  'createdBy',
  'createdAt',
  'catalogQuality',
  'moderationStatus',
  'verifiedBy',
  'verifiedAt',
])

const TRACKED_FIELDS = [
  'name',
  'brand',
  'category',
  'kind',
  'texture',
  'unit',
  'inci',
  'description',
  'totalAmount',
  'amountUnit',
  'slug',
  'url',
  'imageUrl',
  'notes',
  'priceCents',
] as const

// Edit one of these fields and the detected tags can change, so we tag again.
const AUTOTAG_INPUT_FIELDS = [
  'inci',
  'kind',
  'category',
  'brand',
  'texture',
  'name',
  'description',
] as const satisfies readonly Extract<
  (typeof TRACKED_FIELDS)[number],
  keyof OrchestratorProductFields
>[]

// Add a field to OrchestratorProductFields, forget it in the list above,
// and edits to that column stop tagging again without any error.
// The line below breaks the build in that case.
type MissingAutotagInputField = Exclude<
  keyof OrchestratorProductFields,
  (typeof AUTOTAG_INPUT_FIELDS)[number]
>
const _autotagInputFieldsCoverOrchestratorInput: [MissingAutotagInputField] extends [never]
  ? true
  : MissingAutotagInputField = true

function isColumnLike(obj: unknown): obj is { name: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    typeof (obj as Record<string, unknown>).name === 'string'
  )
}

export async function updateProduct(
  userId: string,
  id: string,
  data: UpdateProductInput,
  summary: string | undefined,
  database: DatabaseTransaction
): Promise<Product> {
  for (const field of NORMALIZED_STRING_FIELDS) {
    const v = data[field]
    if (typeof v === 'string') {
      ;(data as Record<string, unknown>)[field] = normalizeString(v)
    }
  }

  // Same normalization as create, so an edited INCI looks like a created one.
  // An emptied form field writes null, not ''.
  // The user clearing the field means "we have no formula", which is what null already means.
  if (typeof data.inci === 'string') {
    data.inci = data.inci.trim() ? normalizeInci(data.inci).value : null
  }

  // Renaming a product does not change its slug.
  // A silent slug change breaks bookmarks, SEO, and the image filenames on the CDN.
  // To change the slug, the caller has to pass it.
  if (data.slug !== undefined) data.slug = slugify(data.slug)

  const setEntries = Object.entries(data).filter(([k]) => !EXCLUDED_KEYS.has(k))

  if (setEntries.length === 0) {
    const existing = await database.query.products.findFirst({ where: eq(products.id, id) })
    if (!existing) throw new ProductError('product_not_found')
    return existing
  }

  const setClauses = setEntries.map(([k, v]) => {
    const col = products[k as keyof typeof products]
    if (!isColumnLike(col)) throw new ProductError('product_update_failed')
    return sql`${sql.identifier(col.name)} = ${v}`
  })

  // Raw SQL because the edit log needs the old values and the new values in one call.
  let result: Record<string, unknown>[]
  try {
    result = (await database.execute(sql`
      UPDATE ${products}
      SET ${sql.join(setClauses, sql`, `)}
      WHERE ${products.id} = ${id}
      RETURNING
        ${products}.*,
        ${sql.join(
          TRACKED_FIELDS.map((f) => {
            const col = products[f as keyof typeof products]
            if (!isColumnLike(col)) throw new ProductError('product_update_failed')
            return sql`OLD.${sql.identifier(col.name)} AS ${sql.identifier(`old_${f}`)}`
          }),
          sql`, `
        )}
    `)) as Record<string, unknown>[]
  } catch (e) {
    if (e instanceof ProductError) throw e
    // Renaming a name or a brand can hit the unique index on visible products.
    // We throw again so withRlsContext rolls back.
    // Swallowing the 23505 here would show the user a 500 instead.
    translateUniqueViolation(e, () => new ProductError('product_already_exists'))
  }

  const row = result[0] as Record<string, unknown> | undefined
  if (!row) {
    // The UPDATE touched no row, and with RLS we can't tell why from here.
    // So we read the row again: it exists means 403, it doesn't mean 404.
    // Never use rowCount to decide, it lies with bun-postgres.
    const [visible] = await database
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, id))
      .limit(1)
    throw new ProductError(visible ? 'unauthorized_access' : 'product_not_found')
  }

  const newProduct: Record<string, unknown> = {}
  for (const [key, col] of Object.entries(products)) {
    if (isColumnLike(col)) {
      newProduct[key] = row[col.name]
    }
  }

  const oldProduct: Record<string, unknown> = {}
  for (const f of TRACKED_FIELDS) {
    oldProduct[f] = row[`old_${f}`]
  }

  const changes = buildChanges(oldProduct, newProduct, TRACKED_FIELDS)

  await logEdit(database, productEditConfig, {
    entityId: id,
    editedBy: userId,
    summary: summary ?? null,
    changes,
  })

  if (AUTOTAG_INPUT_FIELDS.some((f) => changes[f] !== undefined)) {
    await writeTagsForProductFailSoft(database, id, { operation: 'update', userId })
  }

  return newProduct as Product
}

// Once a product is verified it stays verified. There is no way back. On purpose.
export async function verifyProduct(
  actorId: string,
  id: string,
  database: DatabaseTransaction
): Promise<Product> {
  const [row] = await database
    .update(products)
    .set({
      catalogQuality: 'verified',
      verifiedBy: actorId,
      verifiedAt: nowISO(),
    })
    .where(and(eq(products.id, id), eq(products.moderationStatus, 'visible')))
    .returning()
  if (!row) throw new ProductError('product_not_found')
  return row
}

type ProductSummary = Pick<
  Product,
  | 'id'
  | 'slug'
  | 'name'
  | 'brand'
  | 'kind'
  | 'unit'
  | 'priceCents'
  | 'totalAmount'
  | 'amountUnit'
  | 'imageUrl'
> & {
  // Avoid tags matching the caller profile. Empty when the profile toggle is off.
  profileMatches: string[]
  // What this row contains from the user "Avec" rules: canonical keys and tag labels.
  requireMatches: string[]
  // What this row contains from the user "Sans" rules.
  // Only filled under include_excluded. Otherwise the row is already gone from the list.
  excludeMatches: string[]
  // Primary tags only. The card chips and the "+N" counter both read relevance='primary'.
  // Secondary is around 15 tags per product and nothing displays them.
  tags: { slug: string; tagType: string; relevance: 'primary' | 'secondary' }[]
  // null when the caller is not logged in, or has not added the product.
  userStatus: UserProductStatus | null
}
export type ProductsPage = {
  items: ProductSummary[]
  total: number
  page: number
  limit: number
  // How many rows the user rules removed from this filter set.
  // Under include_excluded, how many they would remove. 0 when no rule is active.
  hiddenCount: number
  // What the rules matched on, for the banner:
  // "sans : parfum · avec au moins un de : niacinamide".
  excludedLabels: string[]
  requiredLabels: string[]
}

// Used by the autocomplete (`searchProducts`) and by the list (`?q=`),
// so "Voir tous les résultats" finds and sorts exactly like the dropdown did.
function productSearchMatch(q: string) {
  const escaped = escapeLike(q)
  return {
    condition: or(
      sql`search_norm(${products.name}) LIKE '%' || search_norm(${escaped}) || '%' ESCAPE '\\'`,
      sql`search_norm(${products.brand}) LIKE '%' || search_norm(${escaped}) || '%' ESCAPE '\\'`,
      // % is the form of similarity() > threshold that can use the GIN trgm index.
      sql`search_norm(${products.name}) % search_norm(${q})`,
      sql`search_norm(${products.brand}) % search_norm(${q})`
    ) as SQL,
    // We rank by hand. With similarity alone a short word found in the middle beats
    // a long name that starts with the query, and the order looks random.
    rank: sql`CASE
        WHEN search_norm(${products.name}) = search_norm(${q})
          OR search_norm(${products.brand}) = search_norm(${q}) THEN 0
        WHEN search_norm(${products.name}) LIKE search_norm(${escaped}) || '%' ESCAPE '\\'
          OR search_norm(${products.brand}) LIKE search_norm(${escaped}) || '%' ESCAPE '\\' THEN 1
        WHEN search_norm(${products.name}) LIKE '%' || search_norm(${escaped}) || '%' ESCAPE '\\'
          OR search_norm(${products.brand}) LIKE '%' || search_norm(${escaped}) || '%' ESCAPE '\\' THEN 2
        ELSE 3
      END`,
    similarityDesc: sql`GREATEST(
        similarity(search_norm(${products.name}), search_norm(${q})),
        similarity(search_norm(${products.brand}), search_norm(${q}))
      ) DESC`,
  }
}

// One flat list of ifs, one per optional filter.
// The complexity score equals the number of filters, so splitting the function
// moves that number somewhere else without making anything clearer.
// The listProducts filter tests cover the behaviour.
function buildListConditions(filters: ListProductsFilters, database: DbOrTransaction): SQL[] {
  const conditions: SQL[] = []

  conditions.push(inArray(products.category, [...PRODUCT_DOMAIN_DB_CATEGORIES[filters.category]]))

  if (filters.kind) {
    const kinds = Array.isArray(filters.kind) ? filters.kind : filters.kind.split(',')
    conditions.push(
      kinds.length === 1
        ? eq(products.kind, kinds[0] as ProductKind)
        : inArray(products.kind, kinds as ProductKind[])
    )
  }

  if (filters.brand) {
    const brands = Array.isArray(filters.brand) ? filters.brand : filters.brand.split(',')
    conditions.push(
      brands.length === 1 ? eq(products.brand, brands[0]) : inArray(products.brand, brands)
    )
  }

  // EXISTS stops at the first match for each product, using product_ingredients_product_idx.
  // The old IN (SELECT ...) built the whole set first.
  if (filters.ingredient) {
    const slugs = Array.isArray(filters.ingredient)
      ? filters.ingredient
      : filters.ingredient.split(',')
    if (slugs.length > 0) {
      conditions.push(
        exists(
          database
            .select({ one: sql`1` })
            .from(productIngredients)
            .innerJoin(ingredients, eq(productIngredients.ingredientId, ingredients.id))
            .where(
              and(eq(productIngredients.productId, products.id), inArray(ingredients.slug, slugs))
            )
        )
      )
    }
  }

  const tagFilterCondition = (raw: string, tagType: string): SQL =>
    exists(
      database
        .select({ one: sql`1` })
        .from(productTagLinks)
        .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
        .where(
          and(
            eq(productTagLinks.productId, products.id),
            inArray(productTagTypes.slug, raw.split(',')),
            eq(productTagTypes.tagType, tagType)
          )
        )
    )

  // matin and soir also match a product carrying no moment tag at all.
  // A product with no moment is usable any moment, so it belongs in both.
  // hebdomadaire, usage-localise and crise stay strict: no tag means no match.
  const ROUTINE_MOMENT_UNIVERSAL = new Set(['moment-matin', 'moment-soir'])
  const routineMomentFilterCondition = (raw: string): SQL => {
    const slugs = raw.split(',').map((s) => s.trim())
    const includesUniversal = slugs.some((s) => ROUTINE_MOMENT_UNIVERSAL.has(s))
    const strict = tagFilterCondition(raw, 'routine_moment')
    if (!includesUniversal) return strict
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

  // `filters` is a union split on category, but the tagType we loop on covers every domain,
  // so TypeScript cannot narrow the lookup. Every tag field is string | undefined,
  // which is why the cast is safe.
  // routine_moment only exists in skincare, so the special case below does nothing elsewhere.
  const tagFilters = filters as unknown as Record<string, string | undefined>
  for (const tagType of PRODUCT_TAG_CATEGORIES_BY_DOMAIN[filters.category]) {
    const value = tagFilters[tagType]
    if (!value) continue
    if (tagType === 'routine_moment') {
      conditions.push(routineMomentFilterCondition(value))
      continue
    }
    conditions.push(tagFilterCondition(value, tagType))
  }

  if (filters.priceMin !== undefined) {
    conditions.push(gte(products.priceCents, filters.priceMin))
  }
  if (filters.priceMax !== undefined) {
    conditions.push(lte(products.priceCents, filters.priceMax))
  }

  if (filters.q) {
    conditions.push(productSearchMatch(filters.q).condition)
  }

  if (filters.quality) {
    conditions.push(eq(products.catalogQuality, filters.quality))
  }
  if (filters.status) {
    conditions.push(eq(products.moderationStatus, filters.status))
  }

  return conditions
}
type ProductMeta = {
  matchesByProduct: Map<string, string[]>
  tagsByProduct: Map<string, ProductSummary['tags']>
  statusByProduct: Map<string, UserProductStatus>
}

// Public review rows can be read by other users
// so we need to say where userProducts.userId = userId
// Used by the list meta and by the /shelf-status overlay.
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

async function fetchProductMeta(
  items: { id: string }[],
  userId: string | null,
  database: DbOrTransaction,
  avoidSlugs: string[]
): Promise<ProductMeta> {
  const matchesByProduct = new Map<string, string[]>()
  const tagsByProduct = new Map<string, ProductSummary['tags']>()
  const statusByProduct = new Map<string, UserProductStatus>()

  if (items.length === 0) {
    return { matchesByProduct, tagsByProduct, statusByProduct }
  }

  const itemIds = items.map((i) => i.id)

  // One after the other, not Promise.all.
  // For a logged in caller `database` is the RLS transaction, so it is a single connection.
  // With Promise.all that connection got stuck "idle in transaction" right after the tag read.
  // Ten of those empty the Bun SQL pool and the whole API goes down.
  const avoidRows =
    avoidSlugs.length > 0
      ? await database
          .select({ productId: productTagLinks.productId, slug: productTagTypes.slug })
          .from(productTagLinks)
          .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
          .where(
            and(
              inArray(productTagLinks.productId, itemIds),
              inArray(productTagTypes.slug, avoidSlugs),
              eq(productTagLinks.relevance, 'avoid')
            )
          )
      : []

  // Primary tags only. The card only draws relevance='primary' chips.
  // Secondary is around 15 tags per product and nobody reads them here.
  // The avoid tags travel in profileMatches instead.
  const positiveTagRows = await database
    .select({
      productId: productTagLinks.productId,
      slug: productTagTypes.slug,
      tagType: productTagTypes.tagType,
      relevance: productTagLinks.relevance,
    })
    .from(productTagLinks)
    .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
    .where(
      and(inArray(productTagLinks.productId, itemIds), eq(productTagLinks.relevance, 'primary'))
    )

  const shelfRows = userId ? await getShelfStatusByProductIds(database, userId, itemIds) : []

  for (const row of avoidRows) {
    const list = matchesByProduct.get(row.productId) ?? []
    list.push(row.slug)
    matchesByProduct.set(row.productId, list)
  }

  for (const row of positiveTagRows) {
    if (!isDisplayedProductTag(row.slug)) continue
    const list = tagsByProduct.get(row.productId) ?? []
    list.push({
      slug: row.slug,
      tagType: row.tagType,
      relevance: row.relevance as 'primary' | 'secondary',
    })
    tagsByProduct.set(row.productId, list)
  }

  for (const row of shelfRows) {
    statusByProduct.set(row.productId, row.status)
  }

  return { matchesByProduct, tagsByProduct, statusByProduct }
}

type DeclaredPreferences = {
  excludeKeys: string[]
  requireKeys: string[]
  excludeTagIds: string[]
  requireTagIds: string[]
  // Text for the banner. An ingredient canonical key is already readable ("Parfum"),
  // so we use it as is. A tag brings its own label.
  excludeLabels: string[]
  requireLabels: string[]
  tagLabelById: Map<string, string>
}

// These slugs only add a badge on the product card
//  they don't help to filter the list of products ( when we fetch products)
// For exemple: if a user pick "anti-acne" but the products have a the tag "acne-imperfections"
// then resolveAvoidSlugs map them. 16 of 22 concerns need a rename
// it most slugs match no tag at all and the badge never shows
async function loadAvoidSlugs(database: DbOrTransaction, userId: string): Promise<string[]> {
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
  if (!dermoProfile) return []
  const { skinTypes, skinConcerns } = dermoProfile
  return resolveAvoidSlugs([...(skinTypes ?? []), ...skinConcerns])
}

async function loadDeclaredPreferences(
  database: DbOrTransaction,
  userId: string
): Promise<DeclaredPreferences | null> {
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

  if (ingredientPrefs.length === 0 && tagPrefs.length === 0) return null

  const excludeKeys = ingredientPrefs
    .filter((p) => p.stance === 'exclude')
    .map((p) => p.canonicalKey)
  const requireKeys = ingredientPrefs
    .filter((p) => p.stance === 'require')
    .map((p) => p.canonicalKey)
  const excludeTags = tagPrefs.filter((p) => p.stance === 'exclude')
  const requireTags = tagPrefs.filter((p) => p.stance === 'require')

  return {
    excludeKeys,
    requireKeys,
    excludeTagIds: excludeTags.map((t) => t.tagId),
    requireTagIds: requireTags.map((t) => t.tagId),
    excludeLabels: [...excludeKeys, ...excludeTags.map((t) => t.label)],
    requireLabels: [...requireKeys, ...requireTags.map((t) => t.label)],
    tagLabelById: new Map(tagPrefs.map((t) => [t.tagId, t.label])),
  }
}

// One EXISTS for the ingredients, one for the tags.
// Both read indexed columns: ingredients_canonical_key_idx,
// product_ingredients_product_idx, and the product_tag_links primary key.
function declaredTargetHits(keys: string[], tagIds: string[], database: DbOrTransaction): SQL[] {
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

async function fetchDeclaredMatches(
  itemIds: string[],
  declared: DeclaredPreferences,
  includeExcluded: boolean,
  database: DbOrTransaction
): Promise<{ requireByProduct: Map<string, string[]>; excludeByProduct: Map<string, string[]> }> {
  const requireByProduct = new Map<string, string[]>()
  const excludeByProduct = new Map<string, string[]>()
  if (itemIds.length === 0) return { requireByProduct, excludeByProduct }

  const collect = (map: Map<string, string[]>, productId: string, label: string) => {
    const list = map.get(productId) ?? []
    if (!list.includes(label)) list.push(label)
    map.set(productId, list)
  }

  // An excluded row is only on screen under include_excluded, so we only look it up then.
  const ingredientKeys = includeExcluded
    ? [...declared.requireKeys, ...declared.excludeKeys]
    : declared.requireKeys
  const tagIds = includeExcluded
    ? [...declared.requireTagIds, ...declared.excludeTagIds]
    : declared.requireTagIds
  const requireKeySet = new Set(declared.requireKeys)
  const requireTagSet = new Set(declared.requireTagIds)

  if (ingredientKeys.length > 0) {
    const rows = await database
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
    for (const row of rows) {
      if (row.key === null) continue
      collect(
        requireKeySet.has(row.key) ? requireByProduct : excludeByProduct,
        row.productId,
        row.key
      )
    }
  }

  if (tagIds.length > 0) {
    const rows = await database
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
    for (const row of rows) {
      const label = declared.tagLabelById.get(row.tagId)
      if (!label) continue
      collect(
        requireTagSet.has(row.tagId) ? requireByProduct : excludeByProduct,
        row.productId,
        label
      )
    }
  }

  return { requireByProduct, excludeByProduct }
}

export async function listProducts(
  filters: ListProductsFilters,
  database: DbOrTransaction,
  userId: string | null = null
): Promise<ProductsPage> {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 20
  const offset = (page - 1) * limit

  // The user rules only apply when the profile toggle is on and the caller is logged in.
  // An anonymous caller reads nothing anyway, RLS makes sure of that.
  const declared =
    filters.apply_preferences && userId ? await loadDeclaredPreferences(database, userId) : null
  // Same condition as above, same transaction. This is the half read from the dermo profile.
  // One after the other, not Promise.all: fetchProductMeta says what breaks when we fan them out
  const avoidSlugs =
    filters.apply_preferences && userId ? await loadAvoidSlugs(database, userId) : []
  const excludeHits = declared
    ? declaredTargetHits(declared.excludeKeys, declared.excludeTagIds, database)
    : []
  const requireHits = declared
    ? declaredTargetHits(declared.requireKeys, declared.requireTagIds, database)
    : []
  // Each "Sans" rule removes rows on its own.
  // The "Avec" rules are joined with OR, so a row needs at least one of them.
  // With AND the list would already be empty by the third rule.
  const ruleConditions: SQL[] = [
    ...excludeHits.map((hit) => not(hit) as SQL),
    ...(requireHits.length > 0 ? [or(...requireHits) as SQL] : []),
  ]
  const rulesActive = ruleConditions.length > 0
  const enforceRules = rulesActive && !filters.include_excluded

  const conditions = buildListConditions(filters, database)
  if (enforceRules) conditions.push(...ruleConditions)
  const where = conditions.length > 0 ? and(...conditions) : undefined

  const orderBy = (() => {
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
      // relevance, and no sort at all: rank by match if there is a query, by name if not.
      default: {
        if (!filters.q) return [products.name]
        const match = productSearchMatch(filters.q)
        return [match.rank, match.similarityDesc, products.name]
      }
    }
  })()

  // The "N masqués" banner needs two counts: with the rules and without them.
  // The `where` above already carries one of the two, so we only count the other side here.
  // One after the other, not Promise.all: fetchProductMeta says what breaks when we fan them out
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

  const countResult = await database.select({ total: count() }).from(products).where(where)

  const altResult = rulesActive
    ? await database
        .select({ total: count() })
        .from(products)
        .where(
          enforceRules
            ? and(...buildListConditions(filters, database))
            : and(...buildListConditions(filters, database), ...ruleConditions)
        )
    : [{ total: 0 }]

  const total = countResult[0]?.total ?? 0
  const altTotal = altResult[0]?.total ?? 0
  // The two counts swap places depending on the mode.
  // Rules on: total is the ruled count, alt is the base count.
  // include_excluded: total is the base count, alt is the ruled count.
  const hiddenCount = rulesActive
    ? Math.max(0, enforceRules ? altTotal - total : total - altTotal)
    : 0

  const { matchesByProduct, tagsByProduct, statusByProduct } = await fetchProductMeta(
    items,
    userId,
    database,
    avoidSlugs
  )

  const { requireByProduct, excludeByProduct } = declared
    ? await fetchDeclaredMatches(
        items.map((i) => i.id),
        declared,
        Boolean(filters.include_excluded),
        database
      )
    : {
        requireByProduct: new Map<string, string[]>(),
        excludeByProduct: new Map<string, string[]>(),
      }

  const itemsWithMatches: ProductSummary[] = items.map((i) => ({
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
    excludedLabels: declared?.excludeLabels ?? [],
    requiredLabels: declared?.requireLabels ?? [],
  }
}
export type FilterOptions = {
  kinds: string[]
  brands: string[]
  // A slug is here only if at least one product carries it.
  // The frontend reads a missing slug as 0 and greys out the chip.
  tagCounts: Record<string, number>
}

export async function getFilterOptions(
  database: DbOrTransaction,
  category?: ProductDomainTab
): Promise<FilterOptions> {
  const dbCategories = category ? [...PRODUCT_DOMAIN_DB_CATEGORIES[category]] : null
  const productScope = dbCategories ? inArray(products.category, dbCategories) : undefined

  // One after the other, not Promise.all: fetchProductMeta says what breaks when we fan them out
  const kindRows = await database
    .selectDistinct({ kind: products.kind })
    .from(products)
    .where(productScope)
    .orderBy(products.kind)

  const brandRows = await database
    .selectDistinct({ brand: products.brand })
    .from(products)
    .where(productScope)
    .orderBy(products.brand)

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
    brands: brandRows.map((r) => r.brand),
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

export async function deleteProduct(
  database: DatabaseTransaction,
  role: 'user' | 'admin' | 'contributor',
  id: string
): Promise<void> {
  if (role !== 'admin') throw new ProductError('unauthorized_access')

  const product = await database.query.products.findFirst({ where: eq(products.id, id) })
  if (!product) throw new ProductError('product_not_found')

  await database.delete(products).where(eq(products.id, id))
}

export async function findSimilarProducts(
  name: string,
  brand: string,
  database: DbOrTransaction
): Promise<ProductSearchResult[]> {
  const trimmedName = name.trim()
  const trimmedBrand = brand.trim()
  if (!trimmedName || !trimmedBrand) return []
  const escapedName = escapeLike(trimmedName)

  return database
    .select({
      id: products.id,
      name: products.name,
      brand: products.brand,
      kind: products.kind,
      slug: products.slug,
    })
    .from(products)
    .where(
      and(
        or(
          sql`search_norm(${products.brand}) = search_norm(${trimmedBrand})`,
          // % lets this branch use the index. 0.5 is still the real cutoff.
          sql`(search_norm(${products.brand}) % search_norm(${trimmedBrand})
            AND similarity(search_norm(${products.brand}), search_norm(${trimmedBrand})) > 0.5)`
        ),
        or(
          // % is the form of similarity() > threshold that can use the GIN trgm index.
          sql`search_norm(${products.name}) % search_norm(${trimmedName})`,
          sql`search_norm(${products.name}) LIKE '%' || search_norm(${escapedName}) || '%' ESCAPE '\\'`
        )
      )
    )
    .limit(5)
    .orderBy(
      sql`similarity(search_norm(${products.name}), search_norm(${trimmedName})) DESC`,
      products.name
    )
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

export async function searchProducts(
  filters: { q: string; limit?: number; offset?: number; category?: ProductDomainTab },
  database: DbOrTransaction
): Promise<ProductSearchPage> {
  const limit = filters.limit ?? 8
  const offset = filters.offset ?? 0
  const match = productSearchMatch(filters.q.trim())
  // Same category filter as listProducts.
  // The dropdown must show the same products as the page it links to.
  const where = filters.category
    ? and(
        match.condition,
        inArray(products.category, [...PRODUCT_DOMAIN_DB_CATEGORIES[filters.category]])
      )
    : match.condition
  const rows = await database
    .select({
      id: products.id,
      name: products.name,
      brand: products.brand,
      kind: products.kind,
      slug: products.slug,
    })
    .from(products)
    .where(where)
    .limit(limit + 1)
    .offset(offset)
    .orderBy(match.rank, match.similarityDesc, products.name)
  const hasMore = rows.length > limit
  const items = hasMore ? rows.slice(0, limit) : rows
  return { items, hasMore, nextOffset: offset + limit }
}

export async function previewSlug(
  name: string,
  brand: string,
  database: DatabaseTransaction
): Promise<string> {
  const normalizedName = normalizeString(name)
  const normalizedBrand = normalizeString(brand)
  const raw = `${normalizedName}${normalizedBrand ? `-${normalizedBrand}` : ''}`
  const baseSlug = slugify(raw)

  // A name like '!!' passes the Zod min(2) check but slugify returns ''.
  // We return a fallback, otherwise the loop below would spin forever on slug=''.
  if (!baseSlug) return 'product'

  let candidate = baseSlug
  let attempt = 1
  while (attempt <= 100) {
    const [existing] = await database
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, candidate))
      .limit(1)
    if (!existing) return candidate
    candidate = `${baseSlug}-${attempt}`
    attempt++
  }
  return `${baseSlug}-${Date.now()}`
}

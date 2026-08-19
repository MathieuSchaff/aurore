import type {
  CreateProductInput,
  ProductKind,
  ProductUnit,
  UpdateProductInput,
} from '@aurore/shared'

import slugify from '@sindresorhus/slugify'
import { and, eq, like, or, sql } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../db/index'
import { type Product, products } from '../../db/schema/products'
import {
  assertWithinSubmissionRateLimit,
  type CatalogRole,
  resolveCatalogQuality,
  translateUniqueViolation,
} from '../../lib/catalog'
import { buildChanges, logEdit, productEditConfig } from '../../lib/logs'
import { normalizeInci } from '../../lib/normalize-inci'
import { nowISO } from '../../utils/dates'
import { type OrchestratorProductFields, writeTagsForProductFailSoft } from '../auto-tagging'
import { ProductError } from './product-error'

// Trim and collapse the spaces inside the string
// so create and update always write the exact same value
const normalizeString = (s: string) => s.trim().replace(/\s+/g, ' ')

const NORMALIZED_STRING_FIELDS = ['name', 'brand', 'kind', 'unit', 'amountUnit'] as const

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

    // Reject if a visible product already has the same name and brand
    // We compare with norm(), the same function the DB unique index uses
    // Hidden and rejected products don't count, so they never block a new submission
    // Two inserts at the same time can both pass this check
    // The 23505 catch at the end of the function is the real guard
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
    if (existing) {
      throw new ProductError('product_already_exists', { publicDetails: existing })
    }

    const slug = input.slug ?? `${name}${brand ? `-${brand}` : ''}`
    const [product] = await database
      .insert(products)
      .values({
        ...input,
        createdBy: userId,
        name,
        brand,
        // We write null, never ''
        // If '' could reach the column, every reader would need a `btrim(inci) <> ''` guard
        // to tell "we have no formula" from "the formula is empty"
        inci: input.inci?.trim() ? normalizeInci(input.inci).value : null,
        kind: normalizeString(input.kind) as ProductKind,
        unit: normalizeString(input.unit) as ProductUnit,
        amountUnit: input.amountUnit ? normalizeString(input.amountUnit) : input.amountUnit,
        slug: slugify(slug),
        ...resolveCatalogQuality(role, userId),
      })
      .returning()

    if (!product) throw new ProductError('product_creation_failed')

    // The seed passes autoTag:false. It tags later, once the ingredients are linked
    // Tagging here would see zero ingredient, then collide on the primary key with the seed phase
    if (options.autoTag ?? true) {
      await writeTagsForProductFailSoft(database, product.id, { operation: 'create', userId })
    }

    return product
  } catch (e) {
    if (e instanceof ProductError) throw e
    translateUniqueViolation(e, () => new ProductError('product_already_exists'))
  }
}
// id, createdBy and createdAt never change
// The quality, moderation and verify fields are only set by an admin route
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

// Edit one of these fields and the detected tags can change, so we tag again
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
// and edits to that column stop tagging again without any error
// The line below breaks the build in that case
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

function normalizeUpdateInput(input: UpdateProductInput) {
  for (const field of NORMALIZED_STRING_FIELDS) {
    const value = input[field]
    if (typeof value === 'string') {
      ;(input as Record<string, unknown>)[field] = normalizeString(value)
    }
  }

  if (typeof input.inci === 'string') {
    input.inci = input.inci.trim() ? normalizeInci(input.inci).value : null
  }
  if (input.slug !== undefined) input.slug = slugify(input.slug)
}

function buildUpdateClauses(input: UpdateProductInput) {
  return Object.entries(input)
    .filter(([key]) => !EXCLUDED_KEYS.has(key))
    .map(([key, value]) => {
      const column = products[key as keyof typeof products]
      if (!isColumnLike(column)) throw new ProductError('product_update_failed')
      return sql`${sql.identifier(column.name)} = ${value}`
    })
}

async function executeProductUpdate(
  id: string,
  setClauses: ReturnType<typeof buildUpdateClauses>,
  database: DatabaseTransaction
) {
  try {
    return (await database.execute(sql`
      UPDATE ${products}
      SET ${sql.join(setClauses, sql`, `)}
      WHERE ${products.id} = ${id}
      RETURNING
        ${products}.*,
        ${sql.join(
          TRACKED_FIELDS.map((field) => {
            const column = products[field as keyof typeof products]
            if (!isColumnLike(column)) throw new ProductError('product_update_failed')
            return sql`OLD.${sql.identifier(column.name)} AS ${sql.identifier(`old_${field}`)}`
          }),
          sql`, `
        )}
    `)) as Record<string, unknown>[]
  } catch (error) {
    if (error instanceof ProductError) throw error
    translateUniqueViolation(error, () => new ProductError('product_already_exists'))
  }
}

async function throwMissingProductUpdate(
  id: string,
  database: DatabaseTransaction
): Promise<never> {
  const [visible] = await database
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, id))
    .limit(1)
  throw new ProductError(visible ? 'unauthorized_access' : 'product_not_found')
}

function readUpdatedProducts(row: Record<string, unknown>) {
  const newProduct: Record<string, unknown> = {}
  for (const [key, column] of Object.entries(products)) {
    if (isColumnLike(column)) newProduct[key] = row[column.name]
  }

  const oldProduct: Record<string, unknown> = {}
  for (const field of TRACKED_FIELDS) oldProduct[field] = row[`old_${field}`]
  return { newProduct, oldProduct }
}

export async function updateProduct(
  userId: string,
  id: string,
  input: UpdateProductInput,
  database: DatabaseTransaction
): Promise<Product> {
  // Same normalization as create, so an edited INCI looks like a created one
  // An emptied form field writes null, not ''
  // The user clearing the field means "we have no formula", which is what null already means
  // Renaming a product does not change its slug
  // A silent slug change breaks bookmarks, SEO, and the image filenames on the CDN
  // To change the slug, the caller has to pass it
  normalizeUpdateInput(input)

  const setClauses = buildUpdateClauses(input)

  if (setClauses.length === 0) {
    const existing = await database.query.products.findFirst({ where: eq(products.id, id) })
    if (!existing) throw new ProductError('product_not_found')
    return existing
  }

  // Raw SQL because the edit log needs the old values and the new values in one call
  // Renaming a name or a brand can hit the unique index on visible products
  // The helper translates that conflict before withRlsContext rolls back
  const updatedRows = await executeProductUpdate(id, setClauses, database)

  const row = updatedRows[0] as Record<string, unknown> | undefined
  if (!row) {
    // The UPDATE touched no row, and with RLS we can't tell why from here
    // So we read the row again: it exists means 403, it doesn't mean 404
    // Never use rowCount to decide, it lies with bun-postgres
    return throwMissingProductUpdate(id, database)
  }

  const { newProduct, oldProduct } = readUpdatedProducts(row)
  const changes = buildChanges(oldProduct, newProduct, TRACKED_FIELDS)

  await logEdit(database, productEditConfig, {
    entityId: id,
    editedBy: userId,
    // The wire contract has no summary key (updateProductSchema is strict), so
    // nothing can ever fill it on this path
    summary: null,
    changes,
  })

  if (AUTOTAG_INPUT_FIELDS.some((f) => changes[f] !== undefined)) {
    await writeTagsForProductFailSoft(database, id, { operation: 'update', userId })
  }

  return newProduct as Product
}

// Once a product is verified it stays verified. There is no way back. On purpose
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

export async function previewSlug(
  name: string,
  brand: string,
  database: DatabaseTransaction
): Promise<string> {
  const normalizedName = normalizeString(name)
  const normalizedBrand = normalizeString(brand)
  const nameAndBrand = `${normalizedName}${normalizedBrand ? `-${normalizedBrand}` : ''}`
  const baseSlug = slugify(nameAndBrand)

  // A name like '!!' passes the Zod min(2) check but slugify returns ''
  // We return a fallback, otherwise the loop below would spin forever on slug=''
  if (!baseSlug) return 'product'

  const existingRows = await database
    .select({ slug: products.slug })
    .from(products)
    .where(or(eq(products.slug, baseSlug), like(products.slug, `${baseSlug}-%`)))
  const occupied = new Set(existingRows.map((row) => row.slug))

  if (!occupied.has(baseSlug)) return baseSlug
  for (let attempt = 1; attempt < 100; attempt++) {
    const candidate = `${baseSlug}-${attempt}`
    if (!occupied.has(candidate)) return candidate
  }
  return `${baseSlug}-${Date.now()}`
}

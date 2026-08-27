import { z } from 'zod'

import { fieldChangeSchema, httpsUrl, noHtml, safeUrl } from '../core'
import { PRODUCT_DOMAIN_TABS } from './domain-tabs'
import { PRODUCT_CATEGORY_VALUES, PRODUCT_KINDS } from './kinds'
import { PRODUCT_TEXTURE_VALUES } from './textures'
import { PRODUCT_AMOUNT_UNIT_VALUES, PRODUCT_UNIT_VALUES } from './units'

// Soft validation: rejects HTML and bare prose (no comma for strings > 100 chars).
// It does not check the full INCI naming rules. algo-derm does that at processing time
const inciBase = noHtml(z.string().max(5000)).refine(
  (v) => v.trim().length <= 100 || v.includes(','),
  { message: 'inci must be a comma-separated ingredient list' }
)

// Only accept slugs matching what the service stores (slugify() output). Else the
// slug changes on save, and anything keyed by slug (auto-tag, links, ingest) misses the row
const stableSlug = z
  .string()
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase alphanumeric with single hyphens')

const isKindValidForCategory = (d: { category: string; kind: string }): boolean => {
  const validKinds = PRODUCT_KINDS[d.category as keyof typeof PRODUCT_KINDS]
  return validKinds ? Object.values(validKinds).includes(d.kind as never) : false
}

export const createProductSchema = z
  .object({
    name: noHtml(z.string().trim().min(2).max(200)),
    brand: noHtml(z.string().trim().min(2).max(200)),
    category: z.enum(PRODUCT_CATEGORY_VALUES),
    kind: z.string().min(1).max(100),
    unit: z.enum(PRODUCT_UNIT_VALUES),
    slug: stableSlug.optional(),
    inci: inciBase.optional(),
    description: noHtml(z.string().max(5000)).optional(),
    totalAmount: z.number().int().min(1).optional(),
    amountUnit: z.enum(PRODUCT_AMOUNT_UNIT_VALUES).optional(),
    texture: z.enum(PRODUCT_TEXTURE_VALUES).optional(),
    url: httpsUrl.optional(),
    imageUrl: httpsUrl.optional(),
    notes: noHtml(z.string().max(5000)).optional(),
    priceCents: z.number().int().min(0).optional(),
  })
  .refine(isKindValidForCategory, { message: 'kind is not valid for the given category' })

export const updateProductSchema = z
  .object({
    name: noHtml(z.string().trim().min(2).max(200)).optional(),
    brand: noHtml(z.string().trim().min(2).max(200)).optional(),
    category: z.enum(PRODUCT_CATEGORY_VALUES).optional(),
    kind: z.string().min(1).max(100).optional(),
    unit: z.enum(PRODUCT_UNIT_VALUES).optional(),
    slug: stableSlug.optional(),
    inci: inciBase.nullable().optional(),
    description: noHtml(z.string().max(5000)).nullable().optional(),
    totalAmount: z.number().int().min(1).nullable().optional(),
    amountUnit: z.enum(PRODUCT_AMOUNT_UNIT_VALUES).nullable().optional(),
    texture: z.enum(PRODUCT_TEXTURE_VALUES).nullable().optional(),
    url: httpsUrl.nullable().optional(),
    imageUrl: httpsUrl.nullable().optional(),
    notes: noHtml(z.string().max(5000)).nullable().optional(),
    priceCents: z.number().int().min(0).nullable().optional(),
  })
  .strict()
  .superRefine((d, ctx) => {
    const hasCategory = d.category !== undefined
    const hasKind = d.kind !== undefined
    if (hasCategory !== hasKind) {
      ctx.addIssue({
        code: 'custom',
        message: 'category and kind must be updated together',
        path: [hasCategory ? 'kind' : 'category'],
      })
      return
    }
    if (d.category !== undefined && d.kind !== undefined) {
      if (!isKindValidForCategory(d as { category: string; kind: string })) {
        ctx.addIssue({
          code: 'custom',
          message: 'kind is not valid for the given category',
          path: ['kind'],
        })
      }
    }
  })

const editableProductFields = {
  name: fieldChangeSchema(z.string()),
  brand: fieldChangeSchema(z.string()),
  category: fieldChangeSchema(z.enum(PRODUCT_CATEGORY_VALUES)),
  kind: fieldChangeSchema(z.string()),
  unit: fieldChangeSchema(z.enum(PRODUCT_UNIT_VALUES)),
  slug: fieldChangeSchema(z.string()),
  inci: fieldChangeSchema(z.string()),
  description: fieldChangeSchema(z.string()),
  totalAmount: fieldChangeSchema(z.number().int()),
  amountUnit: fieldChangeSchema(z.enum(PRODUCT_AMOUNT_UNIT_VALUES)),
  texture: fieldChangeSchema(z.enum(PRODUCT_TEXTURE_VALUES)),
  url: fieldChangeSchema(safeUrl),
  imageUrl: fieldChangeSchema(safeUrl),
  notes: fieldChangeSchema(z.string()),
  priceCents: fieldChangeSchema(z.number().int()),
  updatedAt: fieldChangeSchema(z.iso.datetime()),
}

export const productChangesSchema = z
  .object(editableProductFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field change is required',
  })

export const searchProductsQuery = z.object({
  q: z.string().trim().min(1).max(100),
  limit: z.coerce.number().int().min(1).max(20).default(8),
  offset: z.coerce.number().int().min(0).default(0),
  // Scope to the active domain tab so the dropdown agrees with the list page it links to
  category: z.enum(PRODUCT_DOMAIN_TABS).optional(),
})

export const distinctBrandsQuery = z.object({
  category: z.enum(PRODUCT_DOMAIN_TABS).optional(),
})

// Comma-separated UUIDs in query string. Kept as a plain GET param so it can
// be used as a TanStack Query key without serializing a body. Cap at 50 ids:
// that covers any realistic comparison/picker batch and keeps the URL bounded
export const productsByIdsQuery = z.object({
  ids: z
    .string()
    .transform((s) => s.split(',').filter(Boolean))
    .pipe(z.array(z.uuid()).min(1).max(50)),
})

// No comma check here: the preview endpoint exists to show parse results
// on a raw INCI string the user may not have formatted yet
export const productFormulaPreviewSchema = z
  .object({
    inci: noHtml(z.string().trim().min(1).max(5000)),
    category: z.enum(PRODUCT_CATEGORY_VALUES),
    kind: z.string().min(1).max(100),
    name: noHtml(z.string().trim().max(200)).optional(),
    brand: noHtml(z.string().trim().max(200)).optional(),
    texture: z.enum(PRODUCT_TEXTURE_VALUES).optional(),
    description: noHtml(z.string().max(5000)).optional(),
  })
  .refine(isKindValidForCategory, { message: 'kind is not valid for the given category' })

export type ProductFormulaPreviewInput = z.infer<typeof productFormulaPreviewSchema>

export const patentSchema = z.object({
  name: z.string(),
  description: z
    .string()
    .transform((v) => (v.trim() === '' ? null : v))
    .nullable()
    .optional(),
  // Map empty url to null. Otherwise safeUrl rejects "" and the whole update fails
  url: z.preprocess((v) => (v === '' ? null : v), safeUrl.nullable().optional()),
})

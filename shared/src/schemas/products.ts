import { z } from 'zod'

import { fieldChangeSchema } from './common'

const uuid = z.uuid()

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  brand: z.string().min(1).max(200),
  kind: z.string().min(1).max(100),
  unit: z.string().min(1).max(50),
  slug: z.string().max(100).optional(),
  inci: z.string().max(5000).optional(),
  description: z.string().max(5000).optional(),
  totalAmount: z.number().int().min(1).optional(),
  amountUnit: z.string().min(1).max(50).optional(),
  url: z.url().max(2000).optional(),
  notes: z.string().max(5000).optional(),
  priceCents: z.number().int().min(0).optional(),
  expiresAt: z.string().max(50).optional(),
})

export const updateProductSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    brand: z.string().min(1).max(200).optional(),
    kind: z.string().min(1).max(100).optional(),
    unit: z.string().min(1).max(50).optional(),
    slug: z.string().max(100).optional(),
    inci: z.string().max(5000).nullable().optional(),
    description: z.string().max(5000).nullable().optional(),
    totalAmount: z.number().int().min(1).nullable().optional(),
    amountUnit: z.string().min(1).max(50).nullable().optional(),
    url: z.url().max(2000).nullable().optional(),
    notes: z.string().max(5000).nullable().optional(),
    priceCents: z.number().int().min(0).nullable().optional(),
    expiresAt: z.string().max(50).nullable().optional(),
  })
  .strict()

export const updateStockSchema = z.object({
  qty: z.number().int().min(0),
})

export const productResponseSchema = z.object({
  id: uuid,
  createdBy: uuid,
  name: z.string(),
  slug: z.string(),
  brand: z.string(),
  kind: z.string(),
  unit: z.string(),
  inci: z.string().nullable(),
  description: z.string().nullable(),
  totalAmount: z.number().int().nullable(),
  amountUnit: z.string().nullable(),
  url: z.string().nullable(),
  notes: z.string().nullable(),
  priceCents: z.number().int().nullable(),
  expiresAt: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const productStockResponseSchema = z.object({
  id: uuid,
  userId: uuid,
  productId: uuid,
  qty: z.number().int(),
  updatedAt: z.date(),
})

export const productEditResponseSchema = z.object({
  id: uuid,
  productId: uuid,
  editedBy: uuid,
  changes: z.record(
    z.string(),
    z.object({
      old: z.string().nullable(),
      new: z.string().nullable(),
    })
  ),
  summary: z.string().nullable(),
  createdAt: z.date(),
})

export const productWithStockResponseSchema = productResponseSchema.extend({
  stock: productStockResponseSchema.nullable(),
})

export const filterOptionsSchema = z.object({
  kinds: z.array(z.string()),
  brands: z.array(z.string()),
  tags: z.array(
    z.object({
      name: z.string(),
      slug: z.string(),
      category: z.string().nullable(),
    })
  ),
})

export const productsPageSchema = z.object({
  items: z.array(productResponseSchema),
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
})

export type ProductsPage = z.infer<typeof productsPageSchema>

const editableProductFields = {
  name: fieldChangeSchema(z.string()),
  brand: fieldChangeSchema(z.string()),
  kind: fieldChangeSchema(z.string()),
  unit: fieldChangeSchema(z.string()),
  slug: fieldChangeSchema(z.string()),
  inci: fieldChangeSchema(z.string()),
  description: fieldChangeSchema(z.string()),
  totalAmount: fieldChangeSchema(z.number().int()),
  amountUnit: fieldChangeSchema(z.string()),
  url: fieldChangeSchema(z.url()),
  notes: fieldChangeSchema(z.string()),
  priceCents: fieldChangeSchema(z.number().int()),
  expiresAt: fieldChangeSchema(z.string()),
  updatedAt: fieldChangeSchema(z.iso.datetime()),
}

export const productChangesSchema = z
  .object(editableProductFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field change is required',
  })

export const searchProductsQuery = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().int().min(1).max(20).default(8),
})
export type ProductChanges = z.infer<typeof productChangesSchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type UpdateStockInput = z.infer<typeof updateStockSchema>
export type ProductEditResponseSchema = z.infer<typeof productEditResponseSchema>

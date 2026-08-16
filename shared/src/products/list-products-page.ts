import { z } from 'zod'

import { userProductStatusSchema } from '../user-products'
import { PRODUCT_KINDS, type ProductKind } from './kinds'
import { PRODUCT_UNIT_VALUES } from './units'

const PRODUCT_KIND_VALUES = Object.values(PRODUCT_KINDS).flatMap((kinds) =>
  Object.values(kinds)
) as [ProductKind, ...ProductKind[]]

export const productListItemSchema = z
  .object({
    id: z.uuid(),
    slug: z.string(),
    name: z.string(),
    brand: z.string(),
    kind: z.enum(PRODUCT_KIND_VALUES),
    unit: z.enum(PRODUCT_UNIT_VALUES),
    priceCents: z.number().int().nullable(),
    totalAmount: z.number().int().nullable(),
    amountUnit: z.string().nullable(),
    imageUrl: z.string().nullable(),
    profileMatches: z.array(z.string()),
    requireMatches: z.array(z.string()),
    excludeMatches: z.array(z.string()),
    tags: z.array(
      z
        .object({
          slug: z.string(),
          tagType: z.string(),
          relevance: z.enum(['primary', 'secondary']),
        })
        .strict()
    ),
    userStatus: userProductStatusSchema.nullable(),
  })
  .strict()

export const productsPageSchema = z
  .object({
    items: z.array(productListItemSchema),
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    hiddenCount: z.number().int().min(0),
    excludedLabels: z.array(z.string()),
    requiredLabels: z.array(z.string()),
  })
  .strict()

export type ProductListItem = z.infer<typeof productListItemSchema>
export type ProductsPage = z.infer<typeof productsPageSchema>

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
    // Avoid tags matching the caller profile. Empty when the profile toggle is off
    profileMatches: z.array(z.string()),
    // What this row contains from the user "Avec" rules: canonical keys and tag labels
    requireMatches: z.array(z.string()),
    // What this row contains from the user "Sans" rules
    // Only filled under include_excluded. Otherwise the row is already gone from the list
    excludeMatches: z.array(z.string()),
    // Primary tags only: the card chips and the "+N" counter both read relevance='primary'
    // Nothing displays the secondary ones
    tags: z.array(
      z
        .object({
          slug: z.string(),
          tagType: z.string(),
          relevance: z.enum(['primary', 'secondary']),
        })
        .strict()
    ),
    // null when the caller is not logged in, or has not added the product
    userStatus: userProductStatusSchema.nullable(),
  })
  .strict()

export const productsPageSchema = z
  .object({
    items: z.array(productListItemSchema),
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    // How many rows the user rules removed from this filter set
    // Under include_excluded, how many they would remove. 0 when no rule is active
    hiddenCount: z.number().int().min(0),
    // What the rules matched on, for the banner:
    // "sans : parfum · avec au moins un de : niacinamide"
    excludedLabels: z.array(z.string()),
    requiredLabels: z.array(z.string()),
    // Whether the server applied the declared rules to this response: true under an
    // explicit apply_preferences=true, resolved under 'auto', false otherwise
    rulesApplied: z.boolean(),
  })
  .strict()

export type ProductListItem = z.infer<typeof productListItemSchema>
export type ProductsPage = z.infer<typeof productsPageSchema>

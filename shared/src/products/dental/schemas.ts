import { z } from 'zod'

import { tagItemSchema } from '../../core'

export const dentalProductFilterOptionsSchema = z.object({
  kinds: z.array(z.string()),
  brands: z.array(z.string()),
  tags: z.object({
    concern: z.array(tagItemSchema),
    age_group: z.array(tagItemSchema),
    product_type: z.array(tagItemSchema),
    dental_effect: z.array(tagItemSchema),
    product_label: z.array(tagItemSchema),
  }),
})

export const dentalListProductsQuery = z.object({
  kind: z.string().optional(),
  brand: z.string().optional(),
  ingredient: z.string().optional(),
  avoid_for: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['name', 'random']).optional(),
})

export type DentalProductFilterOptions = z.infer<typeof dentalProductFilterOptionsSchema>
export type DentalListProductsFilters = z.infer<typeof dentalListProductsQuery>

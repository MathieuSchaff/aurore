import { z } from 'zod'

import { tagItemSchema } from '../../core'

export const haircareProductFilterOptionsSchema = z.object({
  kinds: z.array(z.string()),
  brands: z.array(z.string()),
  tags: z.object({
    hair_type: z.array(tagItemSchema),
    concern: z.array(tagItemSchema),
    product_type: z.array(tagItemSchema),
    routine_step: z.array(tagItemSchema),
    hair_effect: z.array(tagItemSchema),
    product_label: z.array(tagItemSchema),
  }),
})

export const haircareListProductsQuery = z.object({
  kind: z.string().optional(),
  brand: z.string().optional(),
  ingredient: z.string().optional(),
  avoid_for: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['name', 'random']).optional(),
})

export type HaircareProductFilterOptions = z.infer<typeof haircareProductFilterOptionsSchema>
export type HaircareListProductsFilters = z.infer<typeof haircareListProductsQuery>

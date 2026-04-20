import { z } from 'zod'

export const supplementProductFilterOptionsSchema = z.object({
  kinds: z.array(z.string()),
  brands: z.array(z.string()),
  tags: z.object({}),
})

export const supplementListProductsQuery = z.object({
  kind: z.string().optional(),
  brand: z.string().optional(),
  ingredient: z.string().optional(),
  avoid_for: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['name', 'random']).optional(),
})

export type SupplementProductFilterOptions = z.infer<typeof supplementProductFilterOptionsSchema>
export type SupplementListProductsFilters = z.infer<typeof supplementListProductsQuery>

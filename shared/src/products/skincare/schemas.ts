import { z } from 'zod'

import { PRODUCT_DOMAIN_TABS } from '../domain-tabs'
import { tagItemSchema } from '../../core'

export const skincareProductFilterOptionsSchema = z.object({
  kinds: z.array(z.string()),
  brands: z.array(z.string()),
  tags: z.object({
    routine_step: z.array(tagItemSchema),
    skin_type: z.array(tagItemSchema),
    skin_zone: z.array(tagItemSchema),
    product_type: z.array(tagItemSchema),
    concern: z.array(tagItemSchema),
    // Former 'attribute' split into 3 distinct buckets:
    //   - skin_effect   : visible skin effect (matifiant, occlusif, repulpant, …)
    //   - product_label : formulation labels (sans-parfum, vegan, …)
    //   - shared_label  : molecule+product labels (comedogene, non-comedogene)
    skin_effect: z.array(tagItemSchema),
    product_label: z.array(tagItemSchema),
    shared_label: z.array(tagItemSchema),
  }),
})

export const skincareListProductsQuery = z.object({
  category: z.enum(PRODUCT_DOMAIN_TABS).optional(),
  kind: z.string().optional(),
  brand: z.string().optional(),
  routine_step: z.string().optional(),
  skin_type: z.string().optional(),
  concern: z.string().optional(),
  product_type: z.string().optional(),
  ingredient: z.string().optional(),
  skin_zone: z.string().optional(),
  skin_effect: z.string().optional(),
  product_label: z.string().optional(),
  shared_label: z.string().optional(),
  avoid_for: z.string().optional(),
  priceMin: z.coerce.number().int().min(0).optional(),
  priceMax: z.coerce.number().int().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['name', 'random', 'price_asc', 'price_desc', 'newest']).optional(),
})

export type SkincareProductFilterOptions = z.infer<typeof skincareProductFilterOptionsSchema>
export type SkincareListProductsFilters = z.infer<typeof skincareListProductsQuery>

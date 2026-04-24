import { z } from 'zod'

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
    skin_effect: z.array(tagItemSchema),
    product_label: z.array(tagItemSchema),
    shared_label: z.array(tagItemSchema),
  }),
})

export type SkincareProductFilterOptions = z.infer<typeof skincareProductFilterOptionsSchema>

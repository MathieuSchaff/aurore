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

export type HaircareProductFilterOptions = z.infer<typeof haircareProductFilterOptionsSchema>

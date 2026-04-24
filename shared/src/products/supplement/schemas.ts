import { z } from 'zod'

import { tagItemSchema } from '../../core'

export const supplementProductFilterOptionsSchema = z.object({
  kinds: z.array(z.string()),
  brands: z.array(z.string()),
  tags: z.object({
    goal: z.array(tagItemSchema),
    product_type: z.array(tagItemSchema),
    moment: z.array(tagItemSchema),
    restriction: z.array(tagItemSchema),
    product_label: z.array(tagItemSchema),
  }),
})

export type SupplementProductFilterOptions = z.infer<typeof supplementProductFilterOptionsSchema>

import { z } from 'zod'

import { productResponseSchema, productStockResponseSchema } from './products'

export const stockWithProductResponseSchema = productStockResponseSchema.extend({
  product: productResponseSchema,
})

export type StockWithProduct = z.infer<typeof stockWithProductResponseSchema>

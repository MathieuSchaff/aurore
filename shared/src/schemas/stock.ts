import { z } from 'zod'

export const addStockEntrySchema = z.object({
  qty: z.number().int().min(1).max(9999),
  pricePaidCents: z.number().int().min(0).optional(),
  purchasedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD requis'),
})

export const stockEntryResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  qty: z.number().int(),
  pricePaidCents: z.number().int().nullable(),
  purchasedAt: z.string(),
  createdAt: z.date(),
})

export type AddStockEntryInput = z.infer<typeof addStockEntrySchema>
export type StockEntryResponse = z.infer<typeof stockEntryResponseSchema>

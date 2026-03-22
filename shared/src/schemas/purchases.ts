import { z } from 'zod'

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD requis')

export const addPurchaseSchema = z.object({
  purchasedAt: dateString,
  pricePaidCents: z.number().int().min(0).optional(),
  expiresAt: dateString.optional(),
})

export const openPurchaseSchema = z.object({
  openedAt: dateString,
})

export const finishPurchaseSchema = z.object({
  finishedAt: dateString,
})

export type AddPurchaseInput = z.infer<typeof addPurchaseSchema>
export type OpenPurchaseInput = z.infer<typeof openPurchaseSchema>
export type FinishPurchaseInput = z.infer<typeof finishPurchaseSchema>

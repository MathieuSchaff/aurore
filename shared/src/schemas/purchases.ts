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

export const updatePurchaseSchema = z.object({
  purchasedAt: dateString.optional(),
  pricePaidCents: z.number().int().min(0).nullable().optional(),
})

export const purchaseSchema = z.object({
  id: z.string().uuid(),
  userProductId: z.string().uuid(),
  purchasedAt: z.string(),
  pricePaidCents: z.number().int().min(0).nullable(),
  openedAt: z.string().nullable(),
  finishedAt: z.string().nullable(),
  expiresAt: z.string().nullable(),
  createdAt: z.string(),
})

export type AddPurchaseInput = z.infer<typeof addPurchaseSchema>
export type OpenPurchaseInput = z.infer<typeof openPurchaseSchema>
export type FinishPurchaseInput = z.infer<typeof finishPurchaseSchema>
export type UpdatePurchaseInput = z.infer<typeof updatePurchaseSchema>
export type Purchase = z.infer<typeof purchaseSchema>

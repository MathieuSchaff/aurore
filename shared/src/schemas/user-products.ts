import { z } from 'zod'

export const userProductStatus = [
  'in_stock',
  'wishlist',
  'watched',
  'holy_grail',
  'archived',
  'avoided',
] as const

export const repurchaseFlag = ['yes', 'no', 'unsure'] as const

export const userProductStatusSchema = z.enum(userProductStatus)
export const repurchaseFlagSchema = z.enum(repurchaseFlag)

export const userProductSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  status: userProductStatusSchema,
  qty: z.number().int().min(0),
  sentiment: z.number().int().min(1).max(5).nullable(),
  wouldRepurchase: repurchaseFlagSchema.nullable(),
  comment: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const userProductReviewSchema = z.object({
  id: z.string().uuid(),
  userProductId: z.string().uuid(),
  tolerance: z.number().int().min(1).max(5).nullable(),
  efficacy: z.number().int().min(1).max(5).nullable(),
  sensoriality: z.number().int().min(1).max(5).nullable(),
  stability: z.number().int().min(1).max(5).nullable(),
  mixability: z.number().int().min(1).max(5).nullable(),
  valueForMoney: z.number().int().min(1).max(5).nullable(),
  comment: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type UserProductStatus = z.infer<typeof userProductStatusSchema>
export type RepurchaseFlag = z.infer<typeof repurchaseFlagSchema>
export type UserProduct = z.infer<typeof userProductSchema>
export type UserProductReview = z.infer<typeof userProductReviewSchema>

export const createUserProductSchema = z.object({
  productId: z.string().uuid(),
  status: userProductStatusSchema.default('in_stock'),
  qty: z.number().int().min(0).default(0),
  sentiment: z.number().int().min(1).max(5).optional(),
  wouldRepurchase: repurchaseFlagSchema.optional(),
  comment: z.string().max(1000).optional(),
})

export const updateUserProductSchema = z.object({
  status: userProductStatusSchema.optional(),
  qty: z.number().int().min(0).optional(),
  sentiment: z.number().int().min(1).max(5).nullable().optional(),
  wouldRepurchase: repurchaseFlagSchema.nullable().optional(),
  comment: z.string().max(1000).nullable().optional(),
})

export const updateUserProductReviewSchema = z.object({
  tolerance: z.number().int().min(1).max(5).nullable().optional(),
  efficacy: z.number().int().min(1).max(5).nullable().optional(),
  sensoriality: z.number().int().min(1).max(5).nullable().optional(),
  stability: z.number().int().min(1).max(5).nullable().optional(),
  mixability: z.number().int().min(1).max(5).nullable().optional(),
  valueForMoney: z.number().int().min(1).max(5).nullable().optional(),
  comment: z.string().max(5000).nullable().optional(),
})

export type CreateUserProductInput = z.infer<typeof createUserProductSchema>
export type UpdateUserProductInput = z.infer<typeof updateUserProductSchema>
export type UpdateUserProductReviewInput = z.infer<typeof updateUserProductReviewSchema>

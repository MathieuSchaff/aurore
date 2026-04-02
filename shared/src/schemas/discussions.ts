import { z } from 'zod'

export const createThreadSchema = z.object({
  title: z.string().min(1).max(120),
  content: z.string().min(1),
})

export const createReplySchema = z.object({
  content: z.string().min(1),
})

const uuid = z.uuid()

export const replyResponseSchema = z.object({
  id: uuid,
  threadId: uuid,
  authorId: uuid.nullable(),
  authorName: z.string().nullable(),
  content: z.string(),
  createdAt: z.date(),
})

export const threadResponseSchema = z.object({
  id: uuid,
  productId: uuid.nullable(),
  ingredientId: uuid.nullable(),
  authorId: uuid.nullable(),
  authorName: z.string().nullable(),
  title: z.string(),
  content: z.string(),
  replyCount: z.number().int(),
  createdAt: z.date(),
})

export const threadWithRepliesResponseSchema = threadResponseSchema.omit({ replyCount: true }).extend({
  replies: z.array(replyResponseSchema),
})

export type CreateThreadInput = z.infer<typeof createThreadSchema>
export type CreateReplyInput = z.infer<typeof createReplySchema>

import { z } from 'zod'

import { err } from '../core'

// Mirror of the DB ban_scope enum in backend/src/db/schema/auth/user-bans.ts
// A new scope needs a migration there too
export const banScopeSchema = z.enum([
  'global',
  'ingredient_edit',
  'product_edit',
  'product_create',
  'ingredient_create',
  'discussion_post',
  'review_publish',
  'social_post',
])

export type BanScope = z.infer<typeof banScopeSchema>

export const bannedErrorDetailsSchema = z.object({
  expiresAt: z.string().nullable().catch(null),
  reason: z.string().nullable().catch(null),
  scope: banScopeSchema.optional().catch(undefined),
})

export type BannedErrorDetails = z.infer<typeof bannedErrorDetailsSchema>

export const bannedErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.literal('banned'),
  details: bannedErrorDetailsSchema.catch({ expiresAt: null, reason: null }).optional(),
})

export const bannedError = (details: BannedErrorDetails) => err('banned', details)

export type BannedErrorResponse = ReturnType<typeof bannedError>

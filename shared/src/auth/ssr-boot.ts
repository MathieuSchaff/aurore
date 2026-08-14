import { z } from 'zod'

import { profilePublicSchema } from '../profile'
import type { UserPublic } from './index'

const userPublicSchema: z.ZodType<UserPublic> = z
  .object({
    id: z.uuid(),
    email: z.email(),
    createdAt: z.iso.datetime(),
    emailVerified: z.boolean(),
    role: z.enum(['user', 'admin', 'contributor']),
    isDemo: z.boolean(),
  })
  .strict()

const anonymousSsrBootSchema = z
  .object({
    session: z.object({ authenticated: z.literal(false) }).strict(),
    profile: z.null(),
  })
  .strict()

const authenticatedSsrBootSchema = z
  .object({
    session: z
      .object({
        authenticated: z.literal(true),
        userId: z.uuid(),
        user: userPublicSchema,
        role: z.enum(['user', 'admin', 'contributor']),
      })
      .strict(),
    profile: profilePublicSchema,
  })
  .strict()

export const ssrBootResponseSchema = z.union([anonymousSsrBootSchema, authenticatedSsrBootSchema])

export type SsrBootResponse = z.infer<typeof ssrBootResponseSchema>

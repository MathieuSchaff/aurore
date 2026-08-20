import { z } from 'zod'

import type { ProductDetailPage, ProductsPage } from '../products'
import { listProductsQuery, productDetailPageSchema, productsPageSchema } from '../products'
import type { ProfilePublic } from '../profile'
import { profilePublicSchema } from '../profile'
import type { UserPublic } from './index'

const noViewSsrBootQuerySchema = z.object({ view: z.undefined().optional() }).strict()
const productsSsrBootQuerySchema = z.intersection(
  z.object({ view: z.literal('products') }),
  listProductsQuery
)
const productDetailSsrBootQuerySchema = z
  .object({
    view: z.literal('product-detail'),
    slug: z.string().min(1).max(200),
  })
  .strict()

export const ssrBootQuerySchema = z.union([
  noViewSsrBootQuerySchema,
  productsSsrBootQuerySchema,
  productDetailSsrBootQuerySchema,
])

export type SsrBootQuery = z.infer<typeof ssrBootQuerySchema>

export type SsrBootPage =
  | ({ view: 'products' } & ProductsPage)
  | ({ view: 'product-detail' } & ProductDetailPage)

export type SsrBootResponse =
  | {
      session: { authenticated: false }
      profile: null
      page?: undefined
    }
  | {
      session: {
        authenticated: true
        userId: string
        user: UserPublic
        role: UserPublic['role']
      }
      profile: ProfilePublic
      page?: SsrBootPage
    }

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
    page: z.undefined().optional(),
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
    page: z
      .discriminatedUnion('view', [
        productsPageSchema.extend({ view: z.literal('products') }).strict(),
        productDetailPageSchema.extend({ view: z.literal('product-detail') }).strict(),
      ])
      .optional(),
  })
  .strict()

export const ssrBootResponseSchema: z.ZodType<SsrBootResponse> = z.union([
  anonymousSsrBootSchema,
  authenticatedSsrBootSchema,
])

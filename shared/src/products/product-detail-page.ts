import { z } from 'zod'

import { preferenceTargetsSchema, userDermoProfileSchema } from '../profile'
import { userProductStatusSchema } from '../user-products'
import { PRODUCT_CATEGORY_VALUES, PRODUCT_KINDS, type ProductKind } from './kinds'
import { PRODUCT_TEXTURE_VALUES } from './textures'
import { PRODUCT_UNIT_VALUES } from './units'

const PRODUCT_KIND_VALUES = Object.values(PRODUCT_KINDS).flatMap((kinds) =>
  Object.values(kinds)
) as [ProductKind, ...ProductKind[]]

const productDetailIngredientSchema = z
  .object({
    productId: z.uuid(),
    ingredientId: z.uuid(),
    concentrationValue: z.string().nullable(),
    concentrationUnit: z.string().nullable(),
    concentrationPer: z.string().nullable(),
    notes: z.string().nullable(),
    ingredientName: z.string(),
    ingredientSlug: z.string(),
    ingredientCategory: z.string().nullable(),
    ingredientDescription: z.string(),
    ingredientCanonicalKey: z.string().nullable(),
  })
  .strict()

const productDetailTagSchema = z
  .object({
    productTagId: z.uuid(),
    productId: z.uuid(),
    relevance: z.enum(['primary', 'secondary', 'avoid']),
    tagName: z.string(),
    tagSlug: z.string(),
    tagCategory: z.string(),
  })
  .strict()

export const productDetailSchema = z
  .object({
    id: z.uuid(),
    slug: z.string(),
    name: z.string(),
    brand: z.string(),
    category: z.enum(PRODUCT_CATEGORY_VALUES),
    description: z.string().nullable(),
    inci: z.string().nullable(),
    totalAmount: z.number().int().nullable(),
    amountUnit: z.string().nullable(),
    url: z.string().nullable(),
    imageUrl: z.string().nullable(),
    unit: z.enum(PRODUCT_UNIT_VALUES),
    priceCents: z.number().int().nullable(),
    kind: z.enum(PRODUCT_KIND_VALUES),
    texture: z.enum(PRODUCT_TEXTURE_VALUES).nullable(),
    notes: z.string().nullable(),
    catalogQuality: z.enum(['unverified', 'verified']),
    moderationStatus: z.enum(['visible', 'hidden']),
    createdBy: z.uuid(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    inciCount: z.number().int().min(0),
    hasFragrance: z.boolean(),
    ingredients: z.array(productDetailIngredientSchema),
    tags: z.array(productDetailTagSchema),
  })
  .strict()

// algo-derm stays on the backend only, so shared validates its serialized JSON
// without copying the vendor contract
const serializedAssessmentSchema = z.record(z.string(), z.json())

export const productDetailPageSchema = z
  .object({
    product: productDetailSchema,
    userStatus: userProductStatusSchema.nullable(),
    dermoProfile: userDermoProfileSchema.nullable(),
    assessment: serializedAssessmentSchema.nullable(),
    preferenceTargets: preferenceTargetsSchema,
  })
  .strict()

export type ProductDetail = z.infer<typeof productDetailSchema>
export type ProductDetailPage = z.infer<typeof productDetailPageSchema>

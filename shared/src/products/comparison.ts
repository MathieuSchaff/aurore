import type { HttpStatus } from '../core'
import { HTTP_STATUS } from '../core'
import type { DermoSignal } from './dermo-signals'
import type { ProductTexture } from './textures'
import type { ProductUnit } from './units'

export type ComparisonPriceUnit = 'ml' | 'g' | 'unit'

// `label` is printed as on the pack
// `key` only matches the same name across products, it is never shown
export type InciToken = { label: string; key: string; ingredientSlug?: string }

export type EnrichedComparisonProduct = {
  id: string
  name: string
  brand: string
  kind: string
  slug: string
  imageUrl: string | null
  unit: ProductUnit
  texture: ProductTexture | null
  totalAmount: number | null
  amountUnit: string | null
  priceCents: number | null
  pricePer: { unit: ComparisonPriceUnit; cents: number } | null
  // Label order, `null` when no INCI is on file
  inciTokens: InciToken[] | null
  // Not the formula: only the names linked to an ingredient sheet, in link order
  ingredients: Array<{
    id: string
    inciName: string
    slug: string
    signals: DermoSignal[]
  }>
  tags: Array<{ slug: string; tagType: string; relevance: 'primary' | 'secondary' }>
}

export type EnrichedComparison = {
  id: string
  name: string | null
  createdAt: string
  products: EnrichedComparisonProduct[]
  unavailableProductCount: number
}

export type ComparisonSummary = {
  id: string
  name: string | null
  productCount: number
  unavailableProductCount: number
  createdAt: string
}

export type ProductComparisonErrorCode =
  | 'comparison_not_found'
  | 'comparison_invalid_products'
  | 'unauthorized_access'

export const productComparisonErrorMapping = {
  comparison_not_found: HTTP_STATUS.NOT_FOUND,
  comparison_invalid_products: HTTP_STATUS.BAD_REQUEST,
  unauthorized_access: HTTP_STATUS.FORBIDDEN,
} as const satisfies Record<ProductComparisonErrorCode, HttpStatus>

export const COMPARISON_MIN_PRODUCTS = 2
export const COMPARISON_MAX_PRODUCTS = 8

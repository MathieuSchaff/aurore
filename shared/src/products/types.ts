import type { z } from 'zod'

import type { CatalogQuality, ModerationStatus } from '../admin'
import type { ProductCategory, ProductKind } from './kinds'
import type {
  createProductSchema,
  patentSchema,
  productChangesSchema,
  updateProductSchema,
} from './schemas'
import type { ProductTexture } from './textures'
import type { ProductUnit } from './units'

export type ProductSearchResult = {
  id: string
  name: string
  brand: string
  kind: string
  slug: string
}

export type ProductSearchPage = {
  items: ProductSearchResult[]
  hasMore: boolean
  nextOffset: number
}

export type ProductErrorCode =
  | 'product_not_found'
  | 'product_creation_failed'
  | 'product_update_failed'
  | 'product_delete_failed'
  | 'product_already_exists'
  | 'product_rate_limited'
  | 'unauthorized_access'
  | 'database_error'
  | 'tag_domain_mismatch'

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductChanges = z.infer<typeof productChangesSchema>
export type Patent = z.infer<typeof patentSchema>

export type ProductRecord = {
  id: string
  createdBy: string
  name: string
  brand: string
  category: ProductCategory
  kind: ProductKind
  texture: ProductTexture | null
  unit: ProductUnit
  inci: string | null
  description: string | null
  totalAmount: number | null
  amountUnit: string | null
  slug: string
  url: string | null
  patents: Patent[]
  imageUrl: string | null
  notes: string | null
  priceCents: number | null
  moderationStatus: ModerationStatus
  moderatedBy: string | null
  moderatedAt: string | null
  moderationReason: string | null
  catalogQuality: CatalogQuality
  verifiedBy: string | null
  verifiedAt: string | null
  createdAt: string
  updatedAt: string
}

import type { FieldChange } from './common'

export type Product = {
  id: string
  createdBy: string
  name: string
  slug: string
  brand: string
  kind: string
  unit: string

  inci: string | null
  description: string | null

  totalAmount: number | null
  amountUnit: string | null

  url: string | null
  notes: string | null
  priceCents: number | null
  expiresAt: string | null

  // Timestamps (en ISO String pour le transit API, ou Date)
  createdAt: string | Date
  updatedAt: string | Date
}

export type ProductStock = {
  id: string
  userId: string
  productId: string
  qty: number
  updatedAt: string | Date
}

export type ProductWithStock = Product & {
  stock: ProductStock | null
}
export type EditableProductKeys = Exclude<keyof Product, 'id' | 'createdBy' | 'createdAt' | 'slug'>

export type ProductChanges = {
  [K in EditableProductKeys]?: FieldChange<Product[K]>
}

export type ProductEdit = {
  id: string
  productId: string
  editedBy: string
  // changes: Record<string, { old: string | null; new: string | null }>
  changes: ProductChanges
  summary: string | null
  createdAt: string | Date
}
export type ProductSearchResult = {
  id: string
  name: string
  brand: string
  kind: string
  slug: string
}
export type ProductErrorCode =
  | 'product_not_found'
  | 'product_creation_failed'
  | 'product_update_failed'
  | 'product_delete_failed'
  | 'product_already_exists'
  | 'stock_update_failed'
  | 'unauthorized_access'
  | 'database_error'
  | 'no_updatable_fields'

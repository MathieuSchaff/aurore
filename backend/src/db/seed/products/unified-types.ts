import type { ProductTagGroups } from '../utils'
import type { Ingredient } from './ingredients'

export interface UnifiedProductSeed {
  slug: string
  name: string
  brand: string
  kind: string
  unit: string
  totalAmount: number
  amountUnit: string
  priceCents: number
  description: string
  notes?: string
  inci?: string
  url?: string
  imageUrl?: string
  tags: ProductTagGroups
  keyIngredients?: Ingredient[]
}

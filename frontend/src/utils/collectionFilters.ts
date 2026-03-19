import type { UserProductStatus, RepurchaseFlag, DisplayScale } from '@habit-tracker/shared'
import { calculateWeightedScore } from '../lib/helpers/reviews'
import type { CriteriaWeights, ReviewCriteria } from '../lib/helpers/reviews'

export interface FilterableProduct {
  id: string
  status: UserProductStatus
  sentiment: number | null
  wouldRepurchase: RepurchaseFlag | null
  updatedAt: string
  review: ReviewCriteria | null
  product: {
    name: string
    brand: string
    kind: string
    priceCents: number | null
  }
}

export interface CollectionFilters {
  status: UserProductStatus | 'all'
  search: string
  brand: string | 'all'
  kind: string | 'all'
  sentiment: number | 'all'
  repurchase: RepurchaseFlag | 'all'
  minNote: number
  maxPriceEuros: number | ''
}

export type SortOption = 'name' | 'note' | 'sentiment' | 'date' | 'price_asc' | 'price_desc'

export const DEFAULT_FILTERS: CollectionFilters = {
  status: 'all',
  search: '',
  brand: 'all',
  kind: 'all',
  sentiment: 'all',
  repurchase: 'all',
  minNote: 0,
  maxPriceEuros: '',
}

export function applyFilters<T extends FilterableProduct>(
  products: T[],
  filters: CollectionFilters,
  weights?: CriteriaWeights,
): T[] {
  return products.filter((p) => {
    const score = calculateWeightedScore(p.review, weights, 'out_of_20')
    const numericScore = score ? parseFloat(score) : 0

    const matchesStatus = filters.status === 'all' || p.status === filters.status
    const q = filters.search.toLowerCase()
    const matchesSearch =
      q === '' ||
      p.product.name.toLowerCase().includes(q) ||
      p.product.brand.toLowerCase().includes(q)
    const matchesBrand = filters.brand === 'all' || p.product.brand === filters.brand
    const matchesKind = filters.kind === 'all' || p.product.kind === filters.kind
    const matchesSentiment = filters.sentiment === 'all' || p.sentiment === filters.sentiment
    const matchesRepurchase = filters.repurchase === 'all' || p.wouldRepurchase === filters.repurchase
    const matchesMinNote = numericScore >= filters.minNote
    const matchesMaxPrice =
      filters.maxPriceEuros === '' ||
      (p.product.priceCents ?? 0) / 100 <= filters.maxPriceEuros

    return (
      matchesStatus &&
      matchesSearch &&
      matchesBrand &&
      matchesKind &&
      matchesSentiment &&
      matchesRepurchase &&
      matchesMinNote &&
      matchesMaxPrice
    )
  })
}

export function sortProducts<T extends FilterableProduct>(
  products: T[],
  sortBy: SortOption,
  weights?: CriteriaWeights,
  displayScale?: DisplayScale,
): T[] {
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.product.name.localeCompare(b.product.name)
      case 'sentiment':
        return (b.sentiment ?? 0) - (a.sentiment ?? 0)
      case 'note': {
        const scoreA = parseFloat(calculateWeightedScore(a.review, weights, displayScale) ?? '0')
        const scoreB = parseFloat(calculateWeightedScore(b.review, weights, displayScale) ?? '0')
        return scoreB - scoreA
      }
      case 'date':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case 'price_asc':
        // Using Infinity to ensure products without prices end up at the bottom
        return (a.product.priceCents ?? Infinity) - (b.product.priceCents ?? Infinity)
      case 'price_desc':
        // Using -Infinity so null prices also end up at the bottom for descending sort
        return (b.product.priceCents ?? -Infinity) - (a.product.priceCents ?? -Infinity)
      default:
        return 0
    }
  })
}

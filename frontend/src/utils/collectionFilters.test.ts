import { describe, it, expect } from 'vitest'
import {
  applyFilters,
  sortProducts,
  DEFAULT_FILTERS,
  type FilterableProduct,
} from './collectionFilters'

const makeProduct = (overrides: Partial<FilterableProduct> = {}): FilterableProduct => ({
  id: 'p1',
  status: 'in_stock',
  sentiment: null,
  wouldRepurchase: null,
  updatedAt: '2026-01-01T00:00:00Z',
  review: null,
  product: {
    name: 'CeraVe Cleanser',
    brand: 'CeraVe',
    kind: 'skincare',
    priceCents: 1299,
  },
  ...overrides,
})

const products: FilterableProduct[] = [
  makeProduct({
    id: 'p1',
    status: 'in_stock',
    product: { name: 'CeraVe Cleanser', brand: 'CeraVe', kind: 'skincare', priceCents: 1299 },
  }),
  makeProduct({
    id: 'p2',
    status: 'wishlist',
    product: { name: 'Niacinamide Serum', brand: 'The Ordinary', kind: 'sérum', priceCents: 599 },
  }),
  makeProduct({
    id: 'p3',
    status: 'archived',
    sentiment: 3,
    product: { name: 'SPF 50', brand: 'La Roche-Posay', kind: 'solaire', priceCents: 2490 },
  }),
  makeProduct({
    id: 'p4',
    status: 'in_stock',
    sentiment: 5,
    product: { name: 'Crème Barrière', brand: 'CeraVe', kind: 'soin', priceCents: null },
  }),
  makeProduct({
    id: 'p5',
    status: 'holy_grail',
    product: { name: 'Huile Sèche', brand: 'Embryolisse', kind: 'soin', priceCents: 1800 },
  }),
]

describe('applyFilters', () => {
  it('returns all products when no filters are set', () => {
    expect(applyFilters(products, DEFAULT_FILTERS)).toHaveLength(5)
  })

  it('filters by basic fields (status, brand, kind)', () => {
    expect(applyFilters(products, { ...DEFAULT_FILTERS, status: 'in_stock' })).toHaveLength(2)
    expect(applyFilters(products, { ...DEFAULT_FILTERS, brand: 'CeraVe' })).toHaveLength(2)
    expect(applyFilters(products, { ...DEFAULT_FILTERS, kind: 'soin' })).toHaveLength(2)
  })

  it('handles combination filters and search', () => {
    const combined = applyFilters(products, { ...DEFAULT_FILTERS, status: 'in_stock', brand: 'CeraVe' })
    expect(combined).toHaveLength(2)

    expect(applyFilters(products, { ...DEFAULT_FILTERS, search: 'cerave' })).toHaveLength(2)
    expect(applyFilters(products, { ...DEFAULT_FILTERS, search: 'embryolisse' })).toHaveLength(1)
  })

  it('filters by numeric values (price and sentiment)', () => {
    // max 10 euros
    const affordable = applyFilters(products, { ...DEFAULT_FILTERS, maxPriceEuros: 10 })
    expect(affordable.some(p => p.id === 'p2')).toBe(true) // 5.99
    expect(affordable.some(p => p.id === 'p1')).toBe(false) // 12.99

    expect(applyFilters(products, { ...DEFAULT_FILTERS, sentiment: 5 })).toHaveLength(1)
    expect(applyFilters(products, { ...DEFAULT_FILTERS, minNote: 10 })).toHaveLength(0)
  })
})

describe('sortProducts', () => {
  it('sorts by name and date correctly', () => {
    const byName = sortProducts(products, 'name')
    expect(byName[0].product.name).toBe('CeraVe Cleanser')

    const withDates = [
      makeProduct({ id: 'old', updatedAt: '2025-01-01T00:00:00Z' }),
      makeProduct({ id: 'new', updatedAt: '2026-03-01T00:00:00Z' }),
    ]
    expect(sortProducts(withDates, 'date')[0].id).toBe('new')
  })

  it('handles nulls in price and sentiment sorting', () => {
    const asc = sortProducts(products, 'price_asc')
    expect(asc[asc.length - 1].product.priceCents).toBeNull()

    const bySentiment = sortProducts(products, 'sentiment')
    expect(bySentiment[0].sentiment).toBe(5)
  })
})

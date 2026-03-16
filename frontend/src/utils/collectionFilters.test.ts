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
  it('sans filtre → retourne tout', () => {
    expect(applyFilters(products, DEFAULT_FILTERS)).toHaveLength(5)
  })

  it('filtre par statut unique', () => {
    const result = applyFilters(products, { ...DEFAULT_FILTERS, status: 'in_stock' })
    expect(result).toHaveLength(2)
    expect(result.every((p) => p.status === 'in_stock')).toBe(true)
  })

  it('filtre par marque', () => {
    const result = applyFilters(products, { ...DEFAULT_FILTERS, brand: 'CeraVe' })
    expect(result).toHaveLength(2)
    expect(result.every((p) => p.product.brand === 'CeraVe')).toBe(true)
  })

  it('filtre par kind', () => {
    const result = applyFilters(products, { ...DEFAULT_FILTERS, kind: 'soin' })
    expect(result).toHaveLength(2)
  })

  it('filtre par sentiment', () => {
    const result = applyFilters(products, { ...DEFAULT_FILTERS, sentiment: 5 })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('p4')
  })

  it('filtres combinés (statut + marque)', () => {
    const result = applyFilters(products, { ...DEFAULT_FILTERS, status: 'in_stock', brand: 'CeraVe' })
    expect(result).toHaveLength(2)
  })

  it('filtre par prix max — 10€ → exclut produits > 10€', () => {
    const result = applyFilters(products, { ...DEFAULT_FILTERS, maxPriceEuros: 10 })
    // 5.99€ (p2) passes; p4 has priceCents=null → 0/100 = 0 ≤ 10 passes
    expect(result.some((p) => p.id === 'p2')).toBe(true)
    expect(result.some((p) => p.id === 'p4')).toBe(true)
    // 12.99€, 24.90€, 18.00€ fail
    expect(result.some((p) => p.id === 'p1')).toBe(false)
    expect(result.some((p) => p.id === 'p3')).toBe(false)
    expect(result.some((p) => p.id === 'p5')).toBe(false)
  })

  it('filtre par note min → produits sans review ont score 0', () => {
    const result = applyFilters(products, { ...DEFAULT_FILTERS, minNote: 10 })
    expect(result).toHaveLength(0)
  })

  it('filtre qui ne matche rien → tableau vide', () => {
    const result = applyFilters(products, { ...DEFAULT_FILTERS, brand: 'Marque Inexistante' })
    expect(result).toHaveLength(0)
  })

  it('recherche par nom (partiel, insensible à la casse)', () => {
    const result = applyFilters(products, { ...DEFAULT_FILTERS, search: 'cerave' })
    expect(result).toHaveLength(2)
  })

  it('recherche par marque', () => {
    const result = applyFilters(products, { ...DEFAULT_FILTERS, search: 'embryolisse' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('p5')
  })
})

describe('sortProducts', () => {
  it('tri par nom A→Z', () => {
    const result = sortProducts(products, 'name')
    const names = result.map((p) => p.product.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })

  it('tri par prix croissant — null en fin de liste', () => {
    const result = sortProducts(products, 'price_asc')
    const prices = result.map((p) => p.product.priceCents)
    expect(prices[prices.length - 1]).toBeNull()
  })

  it('tri par prix décroissant — null en fin de liste', () => {
    const result = sortProducts(products, 'price_desc')
    const prices = result.map((p) => p.product.priceCents)
    expect(prices[prices.length - 1]).toBeNull()
    const firstNonNull = prices.find((p) => p !== null)
    expect(firstNonNull).toBeGreaterThan(0)
  })

  it('tri par sentiment — null traité comme 0, descend', () => {
    const result = sortProducts(products, 'sentiment')
    expect(result[0].id).toBe('p4') // sentiment 5
    expect(result[1].id).toBe('p3') // sentiment 3
  })

  it("tri par date (récents d'abord)", () => {
    const withDates = [
      makeProduct({ id: 'old', updatedAt: '2025-01-01T00:00:00Z' }),
      makeProduct({ id: 'new', updatedAt: '2026-03-01T00:00:00Z' }),
    ]
    const result = sortProducts(withDates, 'date')
    expect(result[0].id).toBe('new')
  })
})

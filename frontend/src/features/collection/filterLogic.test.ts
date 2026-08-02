import type { ProductKind, RepurchaseFlag } from '@aurore/shared'

import { describe, expect, it } from 'vitest'

import type { UserProduct } from '@/lib/queries/user-products'
import type { CollectionSearch } from '@/routes/_authenticated/collection.index'
import { applyFilters, type CollectionFilters, sortProducts } from './filterLogic'

// Characterization suite: it pins the CURRENT behaviour of both pure functions so
// the refactor flagged in code-health-audit.md can proceed without silent drift.
// Fixtures carry only the fields the two functions read.
const makeProduct = (over: {
  id?: string
  name?: string
  brand?: string
  kind?: ProductKind
  priceCents?: number | null
  sentiment?: number | null
  wouldRepurchase?: RepurchaseFlag | null
  review?: Record<string, number> | null
  updatedAt?: string
}): UserProduct =>
  ({
    id: over.id ?? 'up-1',
    sentiment: over.sentiment,
    wouldRepurchase: over.wouldRepurchase,
    review: over.review ?? null,
    updatedAt: over.updatedAt ?? '2026-01-01T00:00:00.000Z',
    product: {
      id: over.id ?? 'p-1',
      name: over.name ?? 'Serum',
      brand: over.brand ?? 'BrandA',
      kind: over.kind ?? 'serum',
      priceCents: over.priceCents ?? null,
    },
  }) as unknown as UserProduct

const baseFilters: CollectionFilters = {
  q: '',
  brand: 'all',
  productType: 'all',
  sentiment: 'all',
  repurchase: 'all',
  minNote: 0,
  maxPrice: '',
}

describe('applyFilters', () => {
  it('returns an empty list for an empty collection', () => {
    expect(applyFilters([], baseFilters, undefined)).toEqual([])
  })

  it('keeps every product, in input order, when no filter narrows', () => {
    const products = [
      makeProduct({ id: 'c', brand: 'BrandB', kind: 'moisturizer' }),
      makeProduct({ id: 'a', priceCents: 9900 }),
      makeProduct({ id: 'b', kind: 'gelule' }),
    ]
    expect(applyFilters(products, baseFilters, undefined).map((p) => p.id)).toEqual(['c', 'a', 'b'])
  })

  it('minNote=0 keeps products with no review (score coerces to 0)', () => {
    const products = [makeProduct({ id: 'a', review: null })]
    expect(applyFilters(products, baseFilters, undefined)).toHaveLength(1)
  })

  it('minNote excludes products scoring below the threshold', () => {
    const products = [
      makeProduct({ id: 'low', review: { tolerance: 2 } }), // 8.0/20
      makeProduct({ id: 'high', review: { tolerance: 4 } }), // 16.0/20
    ]
    const filtered = applyFilters(products, { ...baseFilters, minNote: 10 }, undefined)
    expect(filtered.map((p) => p.id)).toEqual(['high'])
  })

  it('minNote keeps a product scoring exactly at the threshold', () => {
    const products = [makeProduct({ id: 'exact', review: { tolerance: 3 } })] // 12.0/20
    expect(applyFilters(products, { ...baseFilters, minNote: 12 }, undefined)).toHaveLength(1)
    expect(applyFilters(products, { ...baseFilters, minNote: 12.1 }, undefined)).toHaveLength(0)
  })

  it("maxPrice='' is a passthrough; a numeric bound excludes pricier products", () => {
    const products = [
      makeProduct({ id: 'cheap', priceCents: 500 }), // 5€
      makeProduct({ id: 'pricey', priceCents: 3000 }), // 30€
    ]
    expect(applyFilters(products, baseFilters, undefined)).toHaveLength(2)
    const bounded = applyFilters(products, { ...baseFilters, maxPrice: 10 }, undefined)
    expect(bounded.map((p) => p.id)).toEqual(['cheap'])
  })

  it('maxPrice keeps a product priced exactly at the bound', () => {
    const products = [makeProduct({ id: 'exact', priceCents: 1000 })] // 10€
    expect(applyFilters(products, { ...baseFilters, maxPrice: 10 }, undefined)).toHaveLength(1)
    expect(applyFilters(products, { ...baseFilters, maxPrice: 9 }, undefined)).toHaveLength(0)
  })

  it('maxPrice=0 is a real bound, not a passthrough', () => {
    const products = [
      makeProduct({ id: 'free', priceCents: null }),
      makeProduct({ id: 'paid', priceCents: 1 }),
    ]
    const bounded = applyFilters(products, { ...baseFilters, maxPrice: 0 }, undefined)
    expect(bounded.map((p) => p.id)).toEqual(['free'])
  })

  it('treats a null price as 0 under a numeric bound', () => {
    const products = [makeProduct({ id: 'free', priceCents: null })]
    expect(applyFilters(products, { ...baseFilters, maxPrice: 1 }, undefined)).toHaveLength(1)
  })

  it("sentiment='all' passes; a specific value narrows", () => {
    const products = [
      makeProduct({ id: 's6', sentiment: 6 }),
      makeProduct({ id: 's1', sentiment: 1 }),
    ]
    expect(applyFilters(products, baseFilters, undefined)).toHaveLength(2)
    const narrowed = applyFilters(products, { ...baseFilters, sentiment: 6 }, undefined)
    expect(narrowed.map((p) => p.id)).toEqual(['s6'])
  })

  it('repurchase narrows on the flag; a null flag never matches a specific value', () => {
    const products = [
      makeProduct({ id: 'yes', wouldRepurchase: 'yes' }),
      makeProduct({ id: 'unsure', wouldRepurchase: 'unsure' }),
      makeProduct({ id: 'none', wouldRepurchase: null }),
    ]
    expect(applyFilters(products, baseFilters, undefined)).toHaveLength(3)
    const narrowed = applyFilters(products, { ...baseFilters, repurchase: 'yes' }, undefined)
    expect(narrowed.map((p) => p.id)).toEqual(['yes'])
  })

  it('search matches name or brand, case-insensitively', () => {
    const products = [
      makeProduct({ id: 'm', name: 'Vitamin C Serum', brand: 'BrandA' }),
      makeProduct({ id: 'b', name: 'Cleanser', brand: 'Vichy' }),
      makeProduct({ id: 'x', name: 'Cream', brand: 'BrandB' }),
    ]
    expect(applyFilters(products, { ...baseFilters, q: 'vi' }, undefined).map((p) => p.id)).toEqual(
      ['m', 'b']
    )
  })

  it('a search hitting neither name nor brand yields an empty list', () => {
    const products = [makeProduct({ id: 'a', name: 'Serum', brand: 'BrandA' })]
    expect(applyFilters(products, { ...baseFilters, q: 'zzz' }, undefined)).toEqual([])
  })

  // The brand filter is an exact string equality while the q search is lowercased:
  // the two surfaces do not agree on case.
  it('brand narrows on an exact, case-sensitive match', () => {
    const products = [
      makeProduct({ id: 'a', brand: 'BrandA' }),
      makeProduct({ id: 'b', brand: 'BrandB' }),
    ]
    expect(
      applyFilters(products, { ...baseFilters, brand: 'BrandA' }, undefined).map((p) => p.id)
    ).toEqual(['a'])
    expect(applyFilters(products, { ...baseFilters, brand: 'branda' }, undefined)).toEqual([])
  })

  it('productType compares the derived TYPE_* tag, not the raw kind', () => {
    const products = [
      makeProduct({ id: 'serum', kind: 'serum' }), // type-serum
      makeProduct({ id: 'cream', kind: 'moisturizer' }), // type-hydratant
    ]
    expect(
      applyFilters(products, { ...baseFilters, productType: 'type-serum' }, undefined).map(
        (p) => p.id
      )
    ).toEqual(['serum'])
    expect(applyFilters(products, { ...baseFilters, productType: 'serum' }, undefined)).toEqual([])
  })

  it('a kind with no TYPE_* mapping never matches a specific productType', () => {
    const products = [makeProduct({ id: 'supp', kind: 'gelule' })]
    expect(applyFilters(products, baseFilters, undefined)).toHaveLength(1)
    expect(
      applyFilters(products, { ...baseFilters, productType: 'type-serum' }, undefined)
    ).toEqual([])
  })

  it('combines filters with AND: matching a single criterion is not enough', () => {
    const products = [
      makeProduct({ id: 'both', brand: 'BrandA', kind: 'serum' }),
      makeProduct({ id: 'brand-only', brand: 'BrandA', kind: 'moisturizer' }),
      makeProduct({ id: 'type-only', brand: 'BrandB', kind: 'serum' }),
    ]
    const filtered = applyFilters(
      products,
      { ...baseFilters, brand: 'BrandA', productType: 'type-serum' },
      undefined
    )
    expect(filtered.map((p) => p.id)).toEqual(['both'])
  })
})

describe('sortProducts', () => {
  it('returns an empty list for an empty collection', () => {
    expect(sortProducts([], 'name', undefined)).toEqual([])
  })

  it('compatibility_desc sorts scored products first, null-last', () => {
    const products = [
      makeProduct({ id: 'none' }),
      makeProduct({ id: 'low' }),
      makeProduct({ id: 'high' }),
    ]
    const scores = { high: 0.9, low: 0.2 } // 'none' absent, so NEGATIVE_INFINITY
    const sorted = sortProducts(products, 'compatibility_desc', undefined, scores)
    expect(sorted.map((p) => p.id)).toEqual(['high', 'low', 'none'])
  })

  it('compatibility_desc without a score map leaves the order untouched', () => {
    const products = [makeProduct({ id: 'a' }), makeProduct({ id: 'b' })]
    expect(sortProducts(products, 'compatibility_desc', undefined).map((p) => p.id)).toEqual([
      'a',
      'b',
    ])
  })

  it('does not mutate the input array', () => {
    const products = [makeProduct({ id: 'a', name: 'B' }), makeProduct({ id: 'b', name: 'A' })]
    const original = products.map((p) => p.id)
    sortProducts(products, 'name', undefined)
    expect(products.map((p) => p.id)).toEqual(original)
  })

  it('sorts by name alphabetically', () => {
    const products = [
      makeProduct({ id: 'b', name: 'Zinc' }),
      makeProduct({ id: 'a', name: 'Aloe' }),
    ]
    expect(sortProducts(products, 'name', undefined).map((p) => p.id)).toEqual(['a', 'b'])
  })

  it('sentiment sorts descending, a missing sentiment counting as 0', () => {
    const products = [
      makeProduct({ id: 'none', sentiment: null }),
      makeProduct({ id: 'hg', sentiment: 6 }),
      makeProduct({ id: 'mid', sentiment: 3 }),
    ]
    expect(sortProducts(products, 'sentiment', undefined).map((p) => p.id)).toEqual([
      'hg',
      'mid',
      'none',
    ])
  })

  it('date sorts on updatedAt, most recent first', () => {
    const products = [
      makeProduct({ id: 'old', updatedAt: '2026-01-01T00:00:00.000Z' }),
      makeProduct({ id: 'new', updatedAt: '2026-06-01T00:00:00.000Z' }),
    ]
    expect(sortProducts(products, 'date', undefined).map((p) => p.id)).toEqual(['new', 'old'])
  })

  it('price_asc and price_desc order on price, a null price counting as 0', () => {
    const products = [
      makeProduct({ id: 'pricey', priceCents: 3000 }),
      makeProduct({ id: 'free', priceCents: null }),
      makeProduct({ id: 'cheap', priceCents: 500 }),
    ]
    expect(sortProducts(products, 'price_asc', undefined).map((p) => p.id)).toEqual([
      'free',
      'cheap',
      'pricey',
    ])
    expect(sortProducts(products, 'price_desc', undefined).map((p) => p.id)).toEqual([
      'pricey',
      'cheap',
      'free',
    ])
  })

  it('note sorts descending on the weighted score, products with no review last', () => {
    const products = [
      makeProduct({ id: 'none', review: null }),
      makeProduct({ id: 'low', review: { tolerance: 2 } }), // 8.0/20
      makeProduct({ id: 'high', review: { tolerance: 5 } }), // 20.0/20
    ]
    expect(sortProducts(products, 'note', undefined).map((p) => p.id)).toEqual([
      'high',
      'low',
      'none',
    ])
  })

  it('an unknown sort keyword leaves the order untouched', () => {
    const products = [
      makeProduct({ id: 'b', name: 'Zinc' }),
      makeProduct({ id: 'a', name: 'Aloe' }),
    ]
    const sorted = sortProducts(products, 'nope' as CollectionSearch['sort'], undefined)
    expect(sorted.map((p) => p.id)).toEqual(['b', 'a'])
  })
})

import { describe, expect, it } from 'vitest'

import {
  buildDomainSwitchSearch,
  buildProductsApiFilters,
  buildResetSearchParams,
  hasActivePriceRange,
  isDiscoveryMode,
  PRODUCTS_PAGE_SIZE,
} from '../helpers'
import { emptyFilters } from './fixtures'

describe('hasActivePriceRange', () => {
  it('returns false when both bounds are undefined', () => {
    expect(hasActivePriceRange()).toBe(false)
  })

  it('returns true when priceMin alone is set', () => {
    expect(hasActivePriceRange(1000)).toBe(true)
  })

  it('returns true when priceMax alone is set', () => {
    expect(hasActivePriceRange(undefined, 5000)).toBe(true)
  })

  it('returns true when priceMin is 0 (explicit zero is still a bound)', () => {
    expect(hasActivePriceRange(0)).toBe(true)
  })
})

describe('isDiscoveryMode', () => {
  it('is true when no filters + no price range + no query + sort=newest', () => {
    expect(
      isDiscoveryMode({ hasFilters: false, hasPriceRange: false, hasQuery: false, sort: 'newest' })
    ).toBe(true)
  })

  it('is false when any filter is active', () => {
    expect(
      isDiscoveryMode({ hasFilters: true, hasPriceRange: false, hasQuery: false, sort: 'newest' })
    ).toBe(false)
  })

  it('is false when a price range is active', () => {
    expect(
      isDiscoveryMode({ hasFilters: false, hasPriceRange: true, hasQuery: false, sort: 'newest' })
    ).toBe(false)
  })

  it('is false when a free-text query is active', () => {
    expect(
      isDiscoveryMode({ hasFilters: false, hasPriceRange: false, hasQuery: true, sort: 'newest' })
    ).toBe(false)
  })

  it('is false when an explicit sort is set', () => {
    expect(
      isDiscoveryMode({ hasFilters: false, hasPriceRange: false, hasQuery: false, sort: 'name' })
    ).toBe(false)
    expect(
      isDiscoveryMode({
        hasFilters: false,
        hasPriceRange: false,
        hasQuery: false,
        sort: 'price_asc',
      })
    ).toBe(false)
    expect(
      isDiscoveryMode({ hasFilters: false, hasPriceRange: false, hasQuery: false, sort: 'random' })
    ).toBe(false)
  })
})

describe('buildProductsApiFilters', () => {
  it('returns discovery payload when in discovery mode', () => {
    const out = buildProductsApiFilters({
      category: 'skincare',
      filters: emptyFilters(),
      sort: 'newest',
      page: 1,
      hasFilters: false,
    })
    expect(out).toEqual({
      category: 'skincare',
      sort: 'newest',
      limit: PRODUCTS_PAGE_SIZE,
      page: 1,
    })
  })

  it('switches to paginated mode when filters are active', () => {
    const filters = emptyFilters()
    filters.concern = ['acne']
    const out = buildProductsApiFilters({
      category: 'skincare',
      filters,
      sort: 'name',
      priceMin: 1000,
      priceMax: 5000,
      page: 2,
      hasFilters: true,
    })
    expect(out.concern).toEqual(['acne'])
    expect(out.sort).toBe('name')
    expect(out.priceMin).toBe(1000)
    expect(out.priceMax).toBe(5000)
    expect(out.page).toBe(2)
    expect(out.limit).toBe(24)
  })

  it('leaves empty tag arrays as undefined', () => {
    const filters = emptyFilters()
    filters.concern = ['acne']
    const out = buildProductsApiFilters({
      category: 'skincare',
      filters,
      sort: 'name',
      page: 1,
      hasFilters: true,
    })
    expect(out.concern).toEqual(['acne'])
    expect(out.skin_type).toBeUndefined()
  })

  it('forwards only domain-relevant keys: haircare does not include skin_type', () => {
    const filters = emptyFilters()
    filters.hair_type = ['cheveux-boucles']
    filters.skin_type = ['peau-grasse'] // ignored for haircare
    const out = buildProductsApiFilters({
      category: 'haircare',
      filters,
      sort: 'name',
      page: 1,
      hasFilters: true,
    })
    expect(out.hair_type).toEqual(['cheveux-boucles'])
    expect(out.skin_type).toBeUndefined()
  })

  it('forwards brand when set (was silently dropped, bug 7)', () => {
    const filters = emptyFilters()
    filters.brand = ['avene', 'bioderma']
    const out = buildProductsApiFilters({
      category: 'skincare',
      filters,
      sort: 'name',
      page: 1,
      hasFilters: true,
    })
    expect(out.brand).toEqual(['avene', 'bioderma'])
  })

  it('forwards ingredient when set (was silently dropped, bug 7)', () => {
    const filters = emptyFilters()
    filters.ingredient = ['niacinamide']
    const out = buildProductsApiFilters({
      category: 'skincare',
      filters,
      sort: 'name',
      page: 1,
      hasFilters: true,
    })
    expect(out.ingredient).toEqual(['niacinamide'])
  })

  it('omits brand and ingredient when arrays are empty', () => {
    const out = buildProductsApiFilters({
      category: 'skincare',
      filters: emptyFilters(),
      sort: 'name',
      page: 1,
      hasFilters: true,
    })
    expect(out.brand).toBeUndefined()
    expect(out.ingredient).toBeUndefined()
  })

  it('switches out of discovery when only sort is changed', () => {
    const out = buildProductsApiFilters({
      category: 'skincare',
      filters: emptyFilters(),
      sort: 'price_asc',
      page: 1,
      hasFilters: false,
    })
    expect(out.limit).toBe(24)
    expect(out.sort).toBe('price_asc')
  })

  it('switches out of discovery when only a price range is set', () => {
    const out = buildProductsApiFilters({
      category: 'skincare',
      filters: emptyFilters(),
      sort: 'newest',
      priceMin: 500,
      page: 1,
      hasFilters: false,
    })
    expect(out.limit).toBe(24)
    expect(out.priceMin).toBe(500)
  })

  it('forwards q when set (free-text fallback)', () => {
    const out = buildProductsApiFilters({
      category: 'skincare',
      filters: emptyFilters(),
      sort: 'name',
      q: 'matifiant',
      page: 1,
      hasFilters: true,
    })
    expect(out.q).toBe('matifiant')
  })

  it('switches out of discovery when only q is set', () => {
    const out = buildProductsApiFilters({
      category: 'skincare',
      filters: emptyFilters(),
      sort: 'newest',
      q: 'matifiant',
      page: 1,
      hasFilters: false,
    })
    expect(out.limit).toBe(24)
    expect(out.q).toBe('matifiant')
  })
})

describe('buildResetSearchParams', () => {
  it('clears price bounds but keeps the standing profile_filter', () => {
    const prev = { profile_filter: true, priceMin: 1500, priceMax: 5000, sort: 'name', page: 3 }
    expect(buildResetSearchParams(prev)).toEqual({
      // A standing setting, not a filter chip: clearing the criteria must not
      // silently revoke it.
      profile_filter: true,
      show_hidden: false,
      priceMin: undefined,
      priceMax: undefined,
      sort: 'name',
      page: 3,
    })
  })

  it('preserves unrelated keys', () => {
    const prev = { sort: 'price_asc', page: 2, concern: ['acne'] }
    const next = buildResetSearchParams(prev)
    expect(next.sort).toBe('price_asc')
    expect(next.page).toBe(2)
    expect(next.concern).toEqual(['acne'])
  })
})

describe('buildProductsApiFilters: domain isolation (dental + complement)', () => {
  it('dental: excludes skincare, haircare, and supplement tag keys', () => {
    const filters = emptyFilters()
    filters.concern = ['gencives']
    filters.skin_type = ['peau-grasse'] // skincare, must be excluded
    filters.hair_type = ['cheveux-boucles'] // haircare, must be excluded
    filters.goal = ['immunite'] // supplement, must be excluded
    const out = buildProductsApiFilters({
      category: 'dental',
      filters,
      sort: 'name',
      page: 1,
      hasFilters: true,
    })
    expect(out.concern).toEqual(['gencives'])
    expect(out.skin_type).toBeUndefined()
    expect(out.hair_type).toBeUndefined()
    expect(out.goal).toBeUndefined()
  })

  it('complement: excludes skincare, haircare, and dental tag keys', () => {
    const filters = emptyFilters()
    filters.goal = ['energie']
    filters.skin_type = ['peau-grasse'] // skincare, must be excluded
    filters.hair_type = ['cheveux-fins'] // haircare, must be excluded
    filters.dental_effect = ['blanchissant'] // dental, must be excluded
    const out = buildProductsApiFilters({
      category: 'complement',
      filters,
      sort: 'name',
      page: 1,
      hasFilters: true,
    })
    expect(out.goal).toEqual(['energie'])
    expect(out.skin_type).toBeUndefined()
    expect(out.hair_type).toBeUndefined()
    expect(out.dental_effect).toBeUndefined()
  })
})

describe('buildProductsApiFilters: edge cases / adversarial inputs', () => {
  // Mixed empty + value: length > 0, so the array passes through.
  it('tag filter with empty strings mixed in is forwarded as-is', () => {
    const filters = emptyFilters()
    filters.concern = ['', 'acne']
    const out = buildProductsApiFilters({
      category: 'skincare',
      filters,
      sort: 'name',
      page: 1,
      hasFilters: true,
    })
    expect(out.concern).toEqual(['', 'acne'])
  })

  // No min ≤ max check here; backend validates.
  it('passes inverted price range through without throwing', () => {
    expect(() =>
      buildProductsApiFilters({
        category: 'skincare',
        filters: emptyFilters(),
        sort: 'name',
        priceMin: 5000,
        priceMax: 100,
        page: 1,
        hasFilters: false,
      })
    ).not.toThrow()
  })

  it('inverted price range exits discovery mode (price bound is set)', () => {
    const out = buildProductsApiFilters({
      category: 'skincare',
      filters: emptyFilters(),
      sort: 'newest',
      priceMin: 5000,
      priceMax: 100,
      page: 1,
      hasFilters: false,
    })
    expect(out.limit).toBe(24)
    expect(out.priceMin).toBe(5000)
    expect(out.priceMax).toBe(100)
  })

  // Negative/zero page passes through; backend validates.
  it('passes negative page through without throwing', () => {
    const out = buildProductsApiFilters({
      category: 'skincare',
      filters: emptyFilters(),
      sort: 'name',
      page: -1,
      hasFilters: true,
    })
    expect(out.page).toBe(-1)
  })

  it('passes page=0 through without throwing', () => {
    const out = buildProductsApiFilters({
      category: 'skincare',
      filters: emptyFilters(),
      sort: 'name',
      page: 0,
      hasFilters: true,
    })
    expect(out.page).toBe(0)
  })
})

describe('buildDomainSwitchSearch', () => {
  // All domain tag keys: domain switch resets every tag regardless of source domain.
  const EMPTY_TAGS: Record<string, string[]> = {
    skin_type: [],
    concern: [],
    skin_zone: [],
    product_type: [],
    routine_step: [],
    skin_effect: [],
    sensation: [],
    product_characteristic: [],
    product_label: [],
    hair_type: [],
    hair_effect: [],
    age_group: [],
    dental_effect: [],
    goal: [],
    moment: [],
    restriction: [],
  }

  it('switches category and resets tag filters', () => {
    const prev = {
      category: 'skincare' as const,
      skin_type: ['peau-grasse'],
      concern: ['anti-acne'],
      brand: ['Cosrx'],
      ingredient: ['niacinamide'],
      priceMin: 1000,
      priceMax: 5000,
      sort: 'price_asc' as const,
      profile_filter: true,
      page: 3,
    }

    const next = buildDomainSwitchSearch(prev, 'haircare', EMPTY_TAGS)

    expect(next.category).toBe('haircare')
    expect(next.skin_type).toEqual([])
    expect(next.concern).toEqual([])
    // Survives the domain switch: the toggle follows the reader, not the tab.
    expect(next.profile_filter).toBe(true)
    expect(next.page).toBe(1)
  })

  it('preserves sort, priceMin, priceMax, brand, and ingredient', () => {
    const prev = {
      category: 'skincare' as const,
      sort: 'price_desc' as const,
      priceMin: 500,
      priceMax: 2000,
      brand: ['Avène'],
      ingredient: ['acide-hyaluronique'],
    }

    const next = buildDomainSwitchSearch(prev, 'dental', EMPTY_TAGS)

    expect(next.sort).toBe('price_desc')
    expect(next.priceMin).toBe(500)
    expect(next.priceMax).toBe(2000)
    expect(next.brand).toEqual(['Avène'])
    expect(next.ingredient).toEqual(['acide-hyaluronique'])
  })
})

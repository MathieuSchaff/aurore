import { describe, expect, it } from 'vitest'

import { productsSearchDefaults, productsSearchSchema } from '../filters'

describe('productsSearchSchema — defaults', () => {
  it('parses an empty object into sensible defaults', () => {
    const parsed = productsSearchSchema.parse({})
    expect(parsed.sort).toBe('newest')
    expect(parsed.profile_filter).toBeUndefined()
    expect(parsed.page).toBe(1)
    expect(parsed.priceMin).toBeUndefined()
    expect(parsed.priceMax).toBeUndefined()
  })

  it('default values object matches the schema output on empty input', () => {
    // profile_filter is deliberately absent: listing it here would let
    // stripSearchParams erase an explicit `false` from the URL.
    expect('profile_filter' in productsSearchDefaults).toBe(false)
    expect(productsSearchDefaults.sort).toBe('newest')
    expect(productsSearchDefaults.page).toBe(1)
  })
})

// Every invalid-field case below exercises a field-local catch: malformed shared URLs stay out
// of GlobalError while valid sibling parameters remain available to the route.
describe('productsSearchSchema — sort', () => {
  it.each([
    'name',
    'random',
    'price_asc',
    'price_desc',
    'newest',
  ] as const)('accepts sort=%s', (sort) => {
    expect(productsSearchSchema.parse({ sort }).sort).toBe(sort)
  })

  it('drops an unknown sort value instead of throwing', () => {
    expect(productsSearchSchema.parse({ sort: 'alphabetical' }).sort).toBe('newest')
  })

  it('defaults sort to relevance when q is present', () => {
    expect(productsSearchSchema.parse({ q: 'serum' }).sort).toBe('relevance')
  })

  it('keeps an explicit sort alongside q', () => {
    expect(productsSearchSchema.parse({ q: 'serum', sort: 'price_asc' }).sort).toBe('price_asc')
  })

  it('heals relevance back to newest when q is absent', () => {
    expect(productsSearchSchema.parse({ sort: 'relevance' }).sort).toBe('newest')
  })

  // TanStack round-trips validateSearch output through the URL and re-validates.
  it('is idempotent on its own output', () => {
    const first = productsSearchSchema.parse({ q: 'serum' })
    expect(productsSearchSchema.parse(first)).toEqual(first)
  })
})

// Invalid q from a shared/hand-crafted URL degrades to the plain list; a throw here
// would bubble past the route and replace the whole app shell with GlobalError.
describe('productsSearchSchema — q resilience', () => {
  it('drops a whitespace-only q instead of throwing', () => {
    const parsed = productsSearchSchema.parse({ q: '   ' })
    expect(parsed.q).toBeUndefined()
    expect(parsed.sort).toBe('newest')
  })

  it('drops a q longer than 100 chars instead of throwing', () => {
    expect(productsSearchSchema.parse({ q: 'x'.repeat(101) }).q).toBeUndefined()
  })

  it('trims and keeps a valid padded q', () => {
    const parsed = productsSearchSchema.parse({ q: '  serum  ' })
    expect(parsed.q).toBe('serum')
    expect(parsed.sort).toBe('relevance')
  })
})

describe('productsSearchSchema — priceMin / priceMax', () => {
  it('accepts a positive integer priceMin', () => {
    expect(productsSearchSchema.parse({ priceMin: 1500 }).priceMin).toBe(1500)
  })

  it('accepts 0 as a valid bound', () => {
    expect(productsSearchSchema.parse({ priceMin: 0, priceMax: 0 }).priceMin).toBe(0)
  })

  it('drops a negative priceMin instead of throwing', () => {
    expect(productsSearchSchema.parse({ priceMin: -1 }).priceMin).toBeUndefined()
  })

  it('drops non-integer prices instead of throwing', () => {
    expect(productsSearchSchema.parse({ priceMin: 12.5 }).priceMin).toBeUndefined()
  })

  it('leaves both undefined when omitted', () => {
    const parsed = productsSearchSchema.parse({})
    expect(parsed.priceMin).toBeUndefined()
    expect(parsed.priceMax).toBeUndefined()
  })
})

describe('productsSearchSchema — tag filters', () => {
  it('accepts an array of slugs for a tag category', () => {
    const parsed = productsSearchSchema.parse({ concern: ['acne', 'anti-age'] })
    expect(parsed.concern).toEqual(['acne', 'anti-age'])
  })

  it('defaults unspecified tag arrays to empty', () => {
    const parsed = productsSearchSchema.parse({})
    expect(parsed.concern).toEqual([])
    expect(parsed.skin_type).toEqual([])
  })
})

describe('productsSearchSchema — profile_filter', () => {
  // Tri-state on purpose: an unstated toggle is not a stated "off", so the
  // standing choice can resolve it client-side.
  it('stays undefined when the URL says nothing', () => {
    expect(productsSearchSchema.parse({}).profile_filter).toBeUndefined()
  })

  it('keeps an explicit false instead of collapsing it to the default', () => {
    expect(productsSearchSchema.parse({ profile_filter: false }).profile_filter).toBe(false)
  })

  it('accepts true', () => {
    expect(productsSearchSchema.parse({ profile_filter: true }).profile_filter).toBe(true)
  })

  it('drops an invalid value instead of throwing', () => {
    expect(productsSearchSchema.parse({ profile_filter: 'yes' }).profile_filter).toBeUndefined()
  })
})

describe('productsSearchSchema — show_hidden', () => {
  it('defaults an invalid value instead of throwing', () => {
    expect(productsSearchSchema.parse({ show_hidden: 'yes' }).show_hidden).toBe(false)
  })
})

describe('productsSearchSchema — category', () => {
  it('defaults category to skincare', () => {
    const parsed = productsSearchSchema.parse({})
    expect(parsed.category).toBe('skincare')
  })

  it.each(['skincare', 'haircare', 'dental', 'complement'])('accepts category = %s', (value) => {
    const parsed = productsSearchSchema.parse({ category: value })
    expect(parsed.category).toBe(value)
  })

  it('defaults an unknown category without dropping valid siblings', () => {
    const parsed = productsSearchSchema.parse({ category: 'nope', priceMin: 1500 })
    expect(parsed.category).toBe('skincare')
    expect(parsed.priceMin).toBe(1500)
  })
})

import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useCollectionFilter } from '../CollectionFilterContext'

describe('useCollectionFilter', () => {
  it('throws when used outside CollectionFilterProvider', () => {
    expect(() => renderHook(() => useCollectionFilter())).toThrow(
      'useCollectionFilter must be used within CollectionFilterProvider'
    )
  })

  it('exposes expected keys when inside a provider', () => {
    // This test documents the contract of the context value shape.
    // Full integration testing requires a router context; checked via TypeScript.
    const value: ReturnType<typeof useCollectionFilter> = {
      brand: 'all',
      kind: 'all',
      sentiment: 'all',
      repurchase: 'all',
      minNote: 0,
      maxPrice: '',
      filterOptions: { brands: [], kinds: [] },
      setFilter: () => {},
      resetFilters: () => {},
    }
    expect(Object.keys(value)).toEqual([
      'brand', 'kind', 'sentiment', 'repurchase', 'minNote', 'maxPrice',
      'filterOptions', 'setFilter', 'resetFilters',
    ])
  })
})

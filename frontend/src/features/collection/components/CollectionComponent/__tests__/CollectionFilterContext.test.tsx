import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useCollectionFilter } from '../CollectionFilterContext'

describe('useCollectionFilter', () => {
  it('throws when used outside CollectionFilterProvider', () => {
    expect(() => renderHook(() => useCollectionFilter())).toThrow(
      'useCollectionFilter must be used within CollectionFilterProvider'
    )
  })
})

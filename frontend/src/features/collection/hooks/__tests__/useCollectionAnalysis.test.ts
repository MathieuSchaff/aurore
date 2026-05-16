import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { UserProduct } from '@/lib/queries/user-products'
import { useCollectionAnalysis } from '../useCollectionAnalysis'

describe('useCollectionAnalysis', () => {
  const mockProducts = [
    {
      id: '1',
      status: 'in_stock',
      sentiment: 6,
      product: {
        productIngredients: [
          { ingredient: { id: 'i1', name: 'Retinol' } },
          { ingredient: { id: 'i2', name: 'Aqua' } }, // filler — excluded
        ],
      },
    },
    {
      id: '2',
      status: 'archived',
      sentiment: 6,
      product: {
        productIngredients: [
          { ingredient: { id: 'i1', name: 'Retinol' } },
          { ingredient: { id: 'i3', name: 'Vitamin C' } },
        ],
      },
    },
    {
      id: '3',
      status: 'avoided',
      product: {
        productIngredients: [{ ingredient: { id: 'i4', name: 'Fragrance' } }],
      },
    },
    {
      id: '4',
      status: 'in_stock',
      review: { tolerance: 1 },
      product: {
        productIngredients: [{ ingredient: { id: 'i5', name: 'Alcohol Denat.' } }],
      },
    },
    {
      id: '5',
      status: 'in_stock',
      sentiment: 1,
      product: {
        productIngredients: [{ ingredient: { id: 'i5', name: 'Alcohol Denat.' } }],
      },
    },
  ] as unknown as UserProduct[]

  it('groups ingredients into keeping and setAside buckets and excludes fillers', () => {
    const { result } = renderHook(() => useCollectionAnalysis(mockProducts))

    expect(result.current.keeping.productCount).toBe(2)
    expect(result.current.keeping.ingredients).toEqual([
      { name: 'Retinol', count: 2 },
      { name: 'Vitamin C', count: 1 },
    ])

    expect(result.current.setAside.productCount).toBe(3)
    expect(result.current.setAside.ingredients).toEqual([
      { name: 'Alcohol Denat.', count: 2 },
      { name: 'Fragrance', count: 1 },
    ])
  })

  it('deduplicates a product that hits multiple set-aside signals', () => {
    const products = [
      {
        id: 'dup',
        status: 'avoided',
        sentiment: 1,
        review: { tolerance: 1 },
        product: {
          productIngredients: [{ ingredient: { id: 'iX', name: 'Limonene' } }],
        },
      },
    ] as unknown as UserProduct[]

    const { result } = renderHook(() => useCollectionAnalysis(products))

    expect(result.current.setAside.productCount).toBe(1)
    expect(result.current.setAside.ingredients).toEqual([{ name: 'Limonene', count: 1 }])
  })

  it('returns empty buckets when no products are loaded', () => {
    const { result } = renderHook(() => useCollectionAnalysis([]))

    expect(result.current.keeping).toEqual({ ingredients: [], productCount: 0 })
    expect(result.current.setAside).toEqual({ ingredients: [], productCount: 0 })
  })
})

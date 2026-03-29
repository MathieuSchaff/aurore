import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { UserProduct } from '@/lib/queries/user-products'
import { useCollectionAnalysis } from '../useCollectionAnalysis'

describe('useCollectionAnalysis', () => {
  const mockProducts = [
    {
      id: '1',
      status: 'holy_grail',
      sentiment: 5,
      product: {
        productIngredients: [
          { ingredient: { id: 'i1', name: 'Retinol' } },
          { ingredient: { id: 'i2', name: 'Aqua' } }, // Filler
        ],
      },
    },
    {
      id: '2',
      status: 'holy_grail',
      sentiment: 4,
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

  it('should count ingredients correctly and exclude fillers', () => {
    const { result } = renderHook(() => useCollectionAnalysis(mockProducts))

    expect(result.current.holyGrailCommon).toEqual([
      { name: 'Retinol', count: 2 },
      { name: 'Vitamin C', count: 1 },
    ])

    expect(result.current.avoidedCommon).toEqual([{ name: 'Fragrance', count: 1 }])

    expect(result.current.lowToleranceCommon).toEqual([{ name: 'Alcohol Denat.', count: 1 }])

    expect(result.current.badSentimentCommon).toEqual([{ name: 'Alcohol Denat.', count: 1 }])
  })

  it('should return empty arrays if no products match criteria', () => {
    const { result } = renderHook(() => useCollectionAnalysis([]))

    expect(result.current.holyGrailCommon).toEqual([])
    expect(result.current.lowToleranceCommon).toEqual([])
    expect(result.current.badSentimentCommon).toEqual([])
    expect(result.current.avoidedCommon).toEqual([])
  })
})

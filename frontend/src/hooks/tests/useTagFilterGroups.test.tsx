import type { TagCategoryMeta } from '@habit-tracker/shared'

import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useTagFilterGroups } from '../useTagFilterGroups'

type Cat = 'skin_type' | 'concern'

const META: Record<Cat, TagCategoryMeta> = {
  skin_type: { label: 'Peau', placeholder: 'Tous', tier: 'essential', order: 1 },
  concern: { label: 'Problème', placeholder: 'Toutes', tier: 'essential', order: 2 },
}

describe('useTagFilterGroups', () => {
  it('returns empty array when tagsByCategory is undefined', () => {
    const { result } = renderHook(() => useTagFilterGroups(['skin_type'] as const, undefined, META))
    expect(result.current).toEqual([])
  })

  it('propagates count from tag items into FilterOption', () => {
    const { result } = renderHook(() =>
      useTagFilterGroups(
        ['concern'] as const,
        { concern: [{ slug: 'acne', name: 'Acné', count: 12 }] },
        META
      )
    )
    const opt = result.current[0]?.subFilters[0]?.options[0]
    expect(opt?.value).toBe('acne')
    expect(opt?.label).toBe('Acné')
    expect(opt?.count).toBe(12)
  })

  it('leaves count undefined when the tag item has no count', () => {
    const { result } = renderHook(() =>
      useTagFilterGroups(
        ['concern'] as const,
        { concern: [{ slug: 'acne', name: 'Acné' }] },
        META
      )
    )
    const opt = result.current[0]?.subFilters[0]?.options[0]
    expect(opt?.count).toBeUndefined()
  })

  it('applies labelOverrides but preserves count', () => {
    const { result } = renderHook(() =>
      useTagFilterGroups(
        ['concern'] as const,
        { concern: [{ slug: 'barriere-cutanee-alteree', name: 'Barrière altérée', count: 5 }] },
        META,
        { 'barriere-cutanee-alteree': 'Peau sensibilisée' }
      )
    )
    const opt = result.current[0]?.subFilters[0]?.options[0]
    expect(opt?.label).toBe('Peau sensibilisée')
    expect(opt?.count).toBe(5)
  })

  it('builds a FilterGroupConfig per category with tier + label from meta', () => {
    const { result } = renderHook(() =>
      useTagFilterGroups(
        ['skin_type', 'concern'] as const,
        { skin_type: [], concern: [] },
        META
      )
    )
    expect(result.current).toHaveLength(2)
    expect(result.current[0]?.id).toBe('skin_type')
    expect(result.current[0]?.label).toBe('Peau')
    expect(result.current[0]?.tier).toBe('essential')
    expect(result.current[1]?.id).toBe('concern')
  })
})

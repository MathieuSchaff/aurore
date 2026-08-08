import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useExpandableList } from '../useExpandableList'

describe('useExpandableList', () => {
  it('shows only the first `limit` items while collapsed', () => {
    const list = Array.from({ length: 12 }, (_, i) => i)
    const { result } = renderHook(() => useExpandableList(list, 8))

    expect(result.current.visible).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
    expect(result.current.hiddenCount).toBe(4)
    expect(result.current.isExpanded).toBe(false)
  })

  it('shows everything once toggled, and hides again on a second toggle', () => {
    const list = Array.from({ length: 12 }, (_, i) => i)
    const { result } = renderHook(() => useExpandableList(list, 8))

    act(() => result.current.toggle())
    expect(result.current.visible).toEqual(list)
    expect(result.current.isExpanded).toBe(true)

    act(() => result.current.toggle())
    expect(result.current.visible).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
    expect(result.current.isExpanded).toBe(false)
  })

  it('reports zero hidden items when the list is under the limit', () => {
    const { result } = renderHook(() => useExpandableList([1, 2, 3], 8))

    expect(result.current.visible).toEqual([1, 2, 3])
    expect(result.current.hiddenCount).toBe(0)
  })

  it('collapses again when resetKey changes', () => {
    const list = Array.from({ length: 12 }, (_, i) => i)
    const { result, rerender } = renderHook(
      ({ resetKey }) => useExpandableList(list, 8, resetKey),
      { initialProps: { resetKey: 'a' } }
    )

    act(() => result.current.toggle())
    expect(result.current.isExpanded).toBe(true)

    rerender({ resetKey: 'b' })
    expect(result.current.isExpanded).toBe(false)
    expect(result.current.visible).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
  })

  it('keeps the expanded state while resetKey is stable', () => {
    const list = Array.from({ length: 12 }, (_, i) => i)
    const { result, rerender } = renderHook(
      ({ resetKey }) => useExpandableList(list, 8, resetKey),
      { initialProps: { resetKey: 'a' } }
    )

    act(() => result.current.toggle())
    rerender({ resetKey: 'a' })
    expect(result.current.isExpanded).toBe(true)
  })
})

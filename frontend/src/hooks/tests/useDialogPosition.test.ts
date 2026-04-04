import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useDialogPosition } from '../useDialogPosition'

describe('useDialogPosition', () => {
  it('returns "top" when the element is in view', () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    // Default getBoundingClientRect returns top: 0, which is not < 0
    const ref = { current: el }

    const { result } = renderHook(() => useDialogPosition(ref))

    expect(result.current).toBe('top')
    document.body.removeChild(el)
  })

  it('returns "bottom" when the element is above the viewport', () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    el.getBoundingClientRect = () =>
      ({
        top: -50,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 50,
        x: 0,
        y: -50,
        toJSON: () => {},
      }) as DOMRect

    const ref = { current: el }
    const { result } = renderHook(() => useDialogPosition(ref))

    expect(result.current).toBe('bottom')
    document.body.removeChild(el)
  })

  it('returns "top" when ref is null', () => {
    const ref = { current: null }
    const { result } = renderHook(() => useDialogPosition(ref))

    expect(result.current).toBe('top')
  })
})

import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useRetryCountdown } from '../useRetryCountdown'

describe('useRetryCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('stays at 0 when no delay is known', () => {
    const { result } = renderHook(() => useRetryCountdown(null))
    expect(result.current).toBe(0)
  })

  it('counts down to 0 and stops there', () => {
    const { result } = renderHook(() => useRetryCountdown(3))
    expect(result.current).toBe(3)

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current).toBe(1)

    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(result.current).toBe(0)
  })

  // A repeat 429 usually answers the same Retry-After, so the value alone cannot say "restart".
  it('restarts on a new error even when the delay is unchanged', () => {
    const { result, rerender } = renderHook(({ at }) => useRetryCountdown(10, at), {
      initialProps: { at: 1000 },
    })

    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(result.current).toBe(6)

    rerender({ at: 2000 })
    expect(result.current).toBe(10)
  })

  // Nothing validates details.retryAfter end to end; an absurd value must not disable the button
  // for good.
  it('clamps a delay beyond an hour', () => {
    const { result } = renderHook(() => useRetryCountdown(1_000_000_000))
    expect(result.current).toBe(3600)
  })

  it('does not tick after unmount', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { unmount } = renderHook(() => useRetryCountdown(10))
    unmount()

    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})

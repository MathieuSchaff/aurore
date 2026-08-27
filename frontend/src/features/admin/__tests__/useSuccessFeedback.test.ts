import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useSuccessFeedback } from '../useSuccessFeedback'

describe('useSuccessFeedback', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('restarts the visibility window for an identical success message', () => {
    const { result } = renderHook(() => useSuccessFeedback())

    act(() => result.current.setSuccess('Action terminée.'))
    act(() => vi.advanceTimersByTime(3400))
    act(() => result.current.setSuccess('Action terminée.'))
    act(() => vi.advanceTimersByTime(200))

    expect(result.current.success).toBe('Action terminée.')

    act(() => vi.advanceTimersByTime(3300))
    expect(result.current.success).toBeNull()
  })
})

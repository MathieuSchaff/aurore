import { QueryClient } from '@tanstack/react-query'
import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/store/auth'
import { renderHookWithProviders } from '@/test/utils'
import { useBootPending } from '../useBootPending'

describe('useBootPending', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    useAuthStore.setState({
      accessToken: null,
      bootRefreshAttempted: false,
      bootRefreshPending: false,
    })
  })

  it('keeps an unresolved boot neutral before the client probe starts', () => {
    const { result } = renderHookWithProviders(() => useBootPending(), { queryClient })

    expect(result.current).toBe(true)
  })

  it('keeps an authenticated boot neutral until the client probe starts', () => {
    queryClient.setQueryData(['session'], { authenticated: true, userId: 'u1' })

    const { result } = renderHookWithProviders(() => useBootPending(), { queryClient })

    expect(result.current).toBe(true)
    act(() => {
      useAuthStore.setState({ bootRefreshAttempted: true })
    })
    expect(result.current).toBe(false)
  })

  it('does not hold a boot whose SSR session is anonymous', () => {
    queryClient.setQueryData(['session'], { authenticated: false })

    const { result } = renderHookWithProviders(() => useBootPending(), { queryClient })

    expect(result.current).toBe(false)
  })

  it('holds an unknown boot through the probe and releases it after settlement', () => {
    const { result } = renderHookWithProviders(() => useBootPending(), { queryClient })

    act(() => {
      useAuthStore.setState({ bootRefreshAttempted: true, bootRefreshPending: true })
    })
    expect(result.current).toBe(true)

    act(() => {
      useAuthStore.setState({ bootRefreshPending: false })
    })
    expect(result.current).toBe(false)
  })
})

import type { UserPublic } from '@aurore/shared'

import { QueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { httpClient } from '@/lib/httpClient'
import { useAuthStore } from '@/store/auth'
import { renderHookWithProviders } from '@/test/utils'

vi.mock('@/lib/httpClient', () => ({
  httpClient: vi.fn(),
}))

import { __resetFreshness } from '../../auth/freshness'
import { useBootRefresh } from '../useBootRefresh'

const mockHttpClient = vi.mocked(httpClient)
const mockUseRouter = vi.mocked(useRouter)

describe('useBootRefresh', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    __resetFreshness()
    useAuthStore.setState({
      accessToken: null,
      tokenExpiresAt: null,
      user: null,
      emailVerified: false,
      role: 'user',
      isDemo: false,
      bootRefreshAttempted: false,
      bootRefreshPending: false,
      sessionExpired: false,
      banned: false,
      bannedDetails: null,
    })
  })

  afterEach(() => {
    queryClient.clear()
    vi.clearAllMocks()
  })

  it('reconciles active route data after restoring an authenticated boot', async () => {
    const invalidate = vi.fn().mockResolvedValue(undefined)
    mockUseRouter.mockReturnValue({ invalidate } as unknown as ReturnType<typeof useRouter>)
    const user = {
      id: 'u1',
      email: 'test@example.com',
      emailVerified: true,
      role: 'user',
      isDemo: false,
    } as UserPublic
    const accessToken = `h.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))}.s`
    mockHttpClient.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { accessToken, user } }),
    } as Response)

    renderHookWithProviders(() => useBootRefresh('authenticated'), { queryClient })

    await waitFor(() => expect(invalidate).toHaveBeenCalledOnce())
    expect(useAuthStore.getState()).toMatchObject({
      accessToken,
      user,
      bootRefreshAttempted: true,
      bootRefreshPending: false,
    })
  })

  it('settles an anonymous boot without probing refresh', async () => {
    const invalidate = vi.fn().mockResolvedValue(undefined)
    mockUseRouter.mockReturnValue({ invalidate } as unknown as ReturnType<typeof useRouter>)

    renderHookWithProviders(() => useBootRefresh('anonymous'), { queryClient })

    await waitFor(() => expect(useAuthStore.getState().bootRefreshAttempted).toBe(true))
    expect(mockHttpClient).not.toHaveBeenCalled()
    expect(useAuthStore.getState().bootRefreshPending).toBe(false)
    expect(invalidate).not.toHaveBeenCalled()
  })

  it('keeps an unknown boot pending only while the refresh probe is unresolved', async () => {
    const invalidate = vi.fn().mockResolvedValue(undefined)
    mockUseRouter.mockReturnValue({ invalidate } as unknown as ReturnType<typeof useRouter>)
    let resolveRefresh: ((response: Response) => void) | undefined
    mockHttpClient.mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveRefresh = resolve
      })
    )

    renderHookWithProviders(() => useBootRefresh('unknown'), { queryClient })

    await waitFor(() => expect(useAuthStore.getState().bootRefreshPending).toBe(true))
    expect(useAuthStore.getState().bootRefreshAttempted).toBe(true)
    expect(mockHttpClient).toHaveBeenCalledOnce()

    resolveRefresh?.({ ok: false } as Response)
    await waitFor(() => expect(useAuthStore.getState().bootRefreshPending).toBe(false))
    expect(invalidate).not.toHaveBeenCalled()
  })

  it('drops a seeded session after an authenticated boot probe fails', async () => {
    const invalidate = vi.fn().mockResolvedValue(undefined)
    mockUseRouter.mockReturnValue({ invalidate } as unknown as ReturnType<typeof useRouter>)
    const seededUser = {
      id: 'u1',
      email: 'admin@example.com',
      emailVerified: true,
      role: 'admin',
      isDemo: false,
    } as UserPublic
    useAuthStore.setState({ user: seededUser, role: 'admin', emailVerified: true })
    queryClient.setQueryData(['session'], {
      authenticated: true,
      userId: seededUser.id,
      user: seededUser,
      role: seededUser.role,
    })
    queryClient.setQueryData(['profile'], { username: 'Aurore' })
    const productListKey = ['products', 'list', {}, seededUser.id] as const
    queryClient.setQueryData(productListKey, {
      items: [{ id: 'p1', userStatus: 'owned' }],
      total: 1,
    })
    mockHttpClient.mockResolvedValue({ ok: false } as Response)

    renderHookWithProviders(() => useBootRefresh('authenticated'), { queryClient })

    await waitFor(() => expect(useAuthStore.getState().user).toBeNull())
    expect(useAuthStore.getState()).toMatchObject({
      accessToken: null,
      role: 'user',
      bootRefreshAttempted: true,
      bootRefreshPending: false,
    })
    expect(queryClient.getQueryData(['session'])).toBeUndefined()
    expect(queryClient.getQueryData(['profile'])).toBeUndefined()
    expect(queryClient.getQueryData(productListKey)).toEqual({
      items: [{ id: 'p1', userStatus: null }],
      total: 1,
    })
    expect(invalidate).not.toHaveBeenCalled()
  })
})

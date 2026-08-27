import type { UserPublic } from '@aurore/shared'

import { QueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { readBearerForTransport } from '@/lib/auth/credential'
import { readClientSession } from '@/lib/auth/session'
import { httpClient } from '@/lib/httpClient'
import { useAuthStore } from '@/store/auth'
import {
  anonymousTestSession,
  pendingTestSession,
  presentTestSession,
  restoringTestSession,
} from '@/test/authSession'
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
      session: pendingTestSession(),
      sessionExpired: false,
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
    useAuthStore.setState({ session: restoringTestSession(user) })

    renderHookWithProviders(() => useBootRefresh('authenticated'), { queryClient })

    await waitFor(() => expect(invalidate).toHaveBeenCalledOnce())
    expect(readClientSession()).toEqual({
      status: 'authenticated',
      user,
      credential: 'present',
    })
    expect(readBearerForTransport()).toBe(accessToken)
  })

  it('settles an anonymous boot without probing refresh', async () => {
    const invalidate = vi.fn().mockResolvedValue(undefined)
    mockUseRouter.mockReturnValue({ invalidate } as unknown as ReturnType<typeof useRouter>)
    useAuthStore.setState({ session: anonymousTestSession() })

    renderHookWithProviders(() => useBootRefresh('anonymous'), { queryClient })

    expect(mockHttpClient).not.toHaveBeenCalled()
    expect(readClientSession()).toEqual({ status: 'anonymous' })
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

    await waitFor(() => expect(mockHttpClient).toHaveBeenCalledOnce())
    expect(readClientSession()).toEqual({ status: 'pending' })

    resolveRefresh?.({ ok: false } as Response)
    await waitFor(() => expect(readClientSession()).toEqual({ status: 'anonymous' }))
    expect(invalidate).not.toHaveBeenCalled()
  })

  it('does not probe an authenticated session with a present credential', () => {
    const invalidate = vi.fn().mockResolvedValue(undefined)
    mockUseRouter.mockReturnValue({ invalidate } as unknown as ReturnType<typeof useRouter>)
    const user = {
      id: 'u1',
      email: 'user@example.test',
      createdAt: '2026-01-01T00:00:00.000Z',
      emailVerified: true,
      role: 'user',
      isDemo: false,
    } satisfies UserPublic
    useAuthStore.setState({ session: presentTestSession(user) })

    renderHookWithProviders(() => useBootRefresh('authenticated'), { queryClient })

    expect(mockHttpClient).not.toHaveBeenCalled()
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
    useAuthStore.setState({ session: restoringTestSession(seededUser) })
    queryClient.setQueryData(['profile'], { username: 'Aurore' })
    const productListKey = ['products', 'list', {}, seededUser.id] as const
    queryClient.setQueryData(productListKey, {
      items: [{ id: 'p1', userStatus: 'owned' }],
      total: 1,
    })
    mockHttpClient.mockResolvedValue({ ok: false } as Response)

    renderHookWithProviders(() => useBootRefresh('authenticated'), { queryClient })

    await waitFor(() => expect(readClientSession()).toEqual({ status: 'anonymous' }))
    expect(queryClient.getQueryData(['profile'])).toBeUndefined()
    expect(queryClient.getQueryData(productListKey)).toBeUndefined()
    expect(invalidate).not.toHaveBeenCalled()
  })
})

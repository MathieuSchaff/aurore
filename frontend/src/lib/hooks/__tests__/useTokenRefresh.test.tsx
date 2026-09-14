import type { UserPublic } from '@aurore/shared'

import { QueryClient } from '@tanstack/react-query'
import { act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { presentTestSession } from '@/test/authSession'
import { renderHookWithProviders } from '@/test/utils'
import { useAuthStore } from '../../../store/auth'

// Partial mock: keep the real scheduling math (msUntilProactiveRefresh) and isExpired,
// stub only the network refresh so the timer/visibility behaviour is what's under test.
vi.mock('../../auth/freshness', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../auth/freshness')>()),
  ensureFresh: vi.fn().mockResolvedValue('ok'),
}))

import { ensureFresh } from '../../auth/freshness'
import { useTokenRefresh } from '../useTokenRefresh'

const mockEnsureFresh = vi.mocked(ensureFresh)
const TEST_USER = {
  id: 'u1',
  email: 'a@b.com',
  createdAt: '2026-01-01T00:00:00.000Z',
  emailVerified: true,
  role: 'user',
  isDemo: false,
} satisfies UserPublic

function setVisibility(state: 'visible' | 'hidden') {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => state,
  })
  document.dispatchEvent(new Event('visibilitychange'))
}

describe('useTokenRefresh', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.useFakeTimers()
    queryClient = new QueryClient()
    useAuthStore.getState().clearAuth()
    mockEnsureFresh.mockReset()
    mockEnsureFresh.mockResolvedValue('ok')
  })

  afterEach(() => {
    vi.useRealTimers()
    queryClient.clear()
    // A test that hid the tab would otherwise leave every later one running hidden
    setVisibility('visible')
  })

  it('does nothing when there is no tokenExpiresAt', () => {
    renderHookWithProviders(() => useTokenRefresh(), { queryClient })

    vi.advanceTimersByTime(120_000)
    expect(mockEnsureFresh).not.toHaveBeenCalled()
  })

  it('schedules a refresh 1 minute before token expiry', () => {
    const fiveMin = Date.now() + 5 * 60_000
    useAuthStore.setState({ session: presentTestSession(TEST_USER, 'token', fiveMin) })

    renderHookWithProviders(() => useTokenRefresh(), { queryClient })

    expect(mockEnsureFresh).not.toHaveBeenCalled()

    vi.advanceTimersByTime(4 * 60_000)
    expect(mockEnsureFresh).toHaveBeenCalledOnce()
  })

  it('refreshes immediately when token expires in less than 1 minute', () => {
    useAuthStore.setState({
      session: presentTestSession(TEST_USER, 'token', Date.now() + 30_000),
    })

    renderHookWithProviders(() => useTokenRefresh(), { queryClient })

    expect(mockEnsureFresh).toHaveBeenCalledOnce()
  })

  it('does not fire the scheduled refresh while the tab is hidden', () => {
    useAuthStore.setState({
      session: presentTestSession(TEST_USER, 'token', Date.now() + 5 * 60_000),
    })

    renderHookWithProviders(() => useTokenRefresh(), { queryClient })
    setVisibility('hidden')

    vi.advanceTimersByTime(10 * 60_000)
    expect(mockEnsureFresh).not.toHaveBeenCalled()
  })

  it('cleans up the timer on unmount', () => {
    useAuthStore.setState({
      session: presentTestSession(TEST_USER, 'token', Date.now() + 5 * 60_000),
    })

    const { unmount } = renderHookWithProviders(() => useTokenRefresh(), { queryClient })
    unmount()

    vi.advanceTimersByTime(10 * 60_000)
    expect(mockEnsureFresh).not.toHaveBeenCalled()
  })

  it('reschedules when tokenExpiresAt changes', () => {
    useAuthStore.setState({
      session: presentTestSession(TEST_USER, 'token', Date.now() + 10 * 60_000),
    })

    const { rerender } = renderHookWithProviders(() => useTokenRefresh(), { queryClient })

    act(() => {
      useAuthStore.setState({
        session: presentTestSession(TEST_USER, 'token', Date.now() + 2 * 60_000),
      })
    })
    rerender()

    vi.advanceTimersByTime(60_000)
    expect(mockEnsureFresh).toHaveBeenCalledOnce()
  })

  describe('visibilitychange', () => {
    function loginWithExpiry(secondsFromNow: number) {
      const token = `h.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + secondsFromNow }))}.s`
      useAuthStore.getState().setAuth(token, {
        id: 'u1',
        email: 'a@b.com',
        emailVerified: true,
        role: 'user',
        isDemo: false,
      } as any)
    }

    it('refreshes when tab becomes visible and token is expired', () => {
      loginWithExpiry(-10)
      renderHookWithProviders(() => useTokenRefresh(), { queryClient })
      mockEnsureFresh.mockClear() // discard the immediate-on-mount refresh

      setVisibility('hidden')
      setVisibility('visible')

      expect(mockEnsureFresh).toHaveBeenCalledOnce()
    })

    // 45s out: past the 60s proactive lead, still short of the 30s expiry buffer, so only the
    // "due" half of the condition can fire here
    it('refreshes when the tab returns after its proactive slot, before expiry', () => {
      loginWithExpiry(45)
      renderHookWithProviders(() => useTokenRefresh(), { queryClient })
      mockEnsureFresh.mockClear()

      setVisibility('hidden')
      setVisibility('visible')

      expect(mockEnsureFresh).toHaveBeenCalledOnce()
    })

    it('does not refresh on visibility change when token is still valid', () => {
      loginWithExpiry(3600)
      renderHookWithProviders(() => useTokenRefresh(), { queryClient })
      mockEnsureFresh.mockClear()

      setVisibility('hidden')
      setVisibility('visible')

      expect(mockEnsureFresh).not.toHaveBeenCalled()
    })

    it('does not refresh on visibility change when user is not logged in', () => {
      renderHookWithProviders(() => useTokenRefresh(), { queryClient })

      setVisibility('hidden')
      setVisibility('visible')

      expect(mockEnsureFresh).not.toHaveBeenCalled()
    })

    it('removes the listener on unmount', () => {
      loginWithExpiry(-10)
      const { unmount } = renderHookWithProviders(() => useTokenRefresh(), { queryClient })
      mockEnsureFresh.mockClear()

      unmount()
      setVisibility('visible')

      expect(mockEnsureFresh).not.toHaveBeenCalled()
    })
  })
})

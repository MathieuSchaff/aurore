import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/store/auth'

vi.mock('@/lib/auth/freshness', () => ({
  ensureFresh: vi.fn(),
}))

import { ensureFresh } from '@/lib/auth/freshness'
import { recoverUnauthorized } from '../recoverUnauthorized'

const mockEnsureFresh = vi.mocked(ensureFresh)

describe('recoverUnauthorized', () => {
  beforeEach(() => {
    queryClient.clear()
    useAuthStore.getState().clearAuth()
    useAuthStore.getState().clearSessionExpired()
    mockEnsureFresh.mockReset()
  })

  afterEach(() => {
    queryClient.clear()
    useAuthStore.getState().clearAuth()
    useAuthStore.getState().clearSessionExpired()
  })

  it('clears cached user data when recovery definitively ends a live session', async () => {
    useAuthStore.setState({ accessToken: 'existing-token' })
    queryClient.setQueryData(['profile', 'me'], { username: 'mathieu' })
    mockEnsureFresh.mockResolvedValue('failed')
    const unauthorized = new Response(null, { status: 401 })

    const result = await recoverUnauthorized(unauthorized, '/api/profile')

    expect(result).toBe(unauthorized)
    expect(useAuthStore.getState().sessionExpired).toBe(true)
    expect(queryClient.getQueryData(['profile', 'me'])).toBeUndefined()
  })
})

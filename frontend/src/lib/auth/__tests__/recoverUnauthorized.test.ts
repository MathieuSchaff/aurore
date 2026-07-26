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
    queryClient.setQueryData(['collection', 'list'], [{ id: 'p1' }])
    queryClient.setQueryData(['products', 'shelf-status', 'user-1', 'p1'], { p1: 'owned' })
    mockEnsureFresh.mockResolvedValue('failed')
    const unauthorized = new Response(null, { status: 401 })

    const result = await recoverUnauthorized(unauthorized, '/api/profile')

    expect(result).toBe(unauthorized)
    expect(useAuthStore.getState().sessionExpired).toBe(true)
    expect(queryClient.getQueryData(['profile', 'me'])).toBeUndefined()
    expect(queryClient.getQueryData(['collection', 'list'])).toBeUndefined()
    expect(queryClient.getQueryData(['products', 'shelf-status', 'user-1', 'p1'])).toBeUndefined()
  })

  // A global clear() sent every mounted public list back to its loading state.
  it('keeps the public catalog and editorial caches the page is reading', async () => {
    useAuthStore.setState({ accessToken: 'existing-token' })
    queryClient.setQueryData(['products', 'list', {}], { items: [] })
    queryClient.setQueryData(['articles', 'list', {}], { items: [] })
    queryClient.setQueryData(['ingredients', 'list', {}], { items: [] })
    mockEnsureFresh.mockResolvedValue('failed')

    await recoverUnauthorized(new Response(null, { status: 401 }), '/api/profile')

    expect(queryClient.getQueryData(['products', 'list', {}])).toBeDefined()
    expect(queryClient.getQueryData(['articles', 'list', {}])).toBeDefined()
    expect(queryClient.getQueryData(['ingredients', 'list', {}])).toBeDefined()
  })
})

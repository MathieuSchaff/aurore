import { QueryClient } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '../../../store/auth'

vi.mock('../../api', () => ({
  api: {
    auth: {
      refresh: {
        $post: vi.fn(),
      },
    },
  },
}))

import { api } from '../../api'
import { silentRefresh } from '../silentRefresh'

const mockRefreshPost = vi.mocked(api.auth.refresh.$post)

describe('silentRefresh', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    useAuthStore.getState().clearAuth()
    mockRefreshPost.mockReset()
  })

  afterEach(() => {
    queryClient.clear()
  })

  it('returns true and updates store + queryClient on success', async () => {
    const fakeUser = {
      id: 'u1',
      email: 'a@b.com',
      emailVerified: true,
      role: 'user',
      isDemo: false,
    }
    const fakeToken = `h.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))}.s`

    mockRefreshPost.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({ success: true, data: { accessToken: fakeToken, user: fakeUser } }),
    } as any)

    const result = await silentRefresh(queryClient)

    expect(result).toBe(true)
    expect(useAuthStore.getState().accessToken).toBe(fakeToken)
    expect(useAuthStore.getState().user).toEqual(fakeUser)
    expect(queryClient.getQueryData(['session'])).toEqual({ authenticated: true, userId: 'u1' })
  })

  it('returns false when the server responds with !ok', async () => {
    mockRefreshPost.mockResolvedValue({ ok: false } as any)

    const result = await silentRefresh(queryClient)

    expect(result).toBe(false)
    expect(useAuthStore.getState().accessToken).toBeNull()
  })

  it('returns false when success is false in response body', async () => {
    mockRefreshPost.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: false }),
    } as any)

    const result = await silentRefresh(queryClient)

    expect(result).toBe(false)
  })

  it('returns false when the request throws', async () => {
    mockRefreshPost.mockRejectedValue(new Error('network'))

    const result = await silentRefresh(queryClient)

    expect(result).toBe(false)
  })

  it('deduplicates concurrent calls', async () => {
    const fakeUser = {
      id: 'u2',
      email: 'b@c.com',
      emailVerified: true,
      role: 'user',
      isDemo: false,
    }
    const fakeToken = `h.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))}.s`

    mockRefreshPost.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({ success: true, data: { accessToken: fakeToken, user: fakeUser } }),
    } as any)

    const [r1, r2] = await Promise.all([silentRefresh(queryClient), silentRefresh(queryClient)])

    expect(r1).toBe(true)
    expect(r2).toBe(true)
    expect(mockRefreshPost).toHaveBeenCalledOnce()
  })
})

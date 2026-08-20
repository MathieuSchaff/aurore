import type { UserPublic } from '@aurore/shared'

import { QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/store/auth'

const env = vi.hoisted(() => ({ server: false }))

vi.mock('@/lib/helpers/isServer', () => ({
  get isServer() {
    return env.server
  },
}))
vi.mock('../freshness', () => ({
  ensureFresh: vi.fn(async () => 'ok'),
  isExpired: vi.fn(() => true),
}))

import { awaitBootRefresh } from '../awaitBootRefresh'
import { ensureFresh } from '../freshness'

const mockEnsureFresh = vi.mocked(ensureFresh)

describe('awaitBootRefresh', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    env.server = false
    vi.clearAllMocks()
    useAuthStore.getState().clearAuth()
  })

  it('returns without probing on the server', async () => {
    env.server = true

    await awaitBootRefresh(queryClient)

    expect(mockEnsureFresh).not.toHaveBeenCalled()
  })

  it('probes on the client when the SSR session is authenticated', async () => {
    queryClient.setQueryData(['session'], { authenticated: true, userId: 'u1' })

    await awaitBootRefresh(queryClient)

    expect(mockEnsureFresh).toHaveBeenCalledWith(queryClient)
  })

  it('skips the probe when the SSR session is anonymous', async () => {
    queryClient.setQueryData(['session'], { authenticated: false })

    await awaitBootRefresh(queryClient)

    expect(mockEnsureFresh).not.toHaveBeenCalled()
  })

  it('clears a seeded role and private cache when the probe fails', async () => {
    const user = {
      id: 'u1',
      email: 'admin@example.com',
      emailVerified: true,
      role: 'admin',
      isDemo: false,
    } as UserPublic
    useAuthStore.setState({ user, role: 'admin', emailVerified: true })
    queryClient.setQueryData(['session'], {
      authenticated: true,
      userId: user.id,
      user,
      role: user.role,
    })
    queryClient.setQueryData(['profile'], { username: 'Aurore' })
    const productListKey = ['products', 'list', {}, user.id] as const
    queryClient.setQueryData(productListKey, {
      items: [{ id: 'p1', userStatus: 'owned' }],
      total: 1,
    })
    mockEnsureFresh.mockResolvedValueOnce('failed')

    await awaitBootRefresh(queryClient)

    expect(useAuthStore.getState()).toMatchObject({ user: null, role: 'user' })
    expect(queryClient.getQueryData(['session'])).toBeUndefined()
    expect(queryClient.getQueryData(['profile'])).toBeUndefined()
    expect(queryClient.getQueryData(productListKey)).toEqual({
      items: [{ id: 'p1', userStatus: null }],
      total: 1,
    })
  })
})

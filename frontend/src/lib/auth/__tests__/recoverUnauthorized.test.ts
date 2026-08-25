import type { UserPublic } from '@aurore/shared'

import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { queryClient } from '@/lib/queryClient'
import {
  anonymousTestSession,
  presentTestSession,
  resetTestAuthStore,
  restoringTestSession,
} from '@/test/authSession'

vi.mock('@/lib/auth/freshness', () => ({
  ensureFresh: vi.fn(),
}))

import { ensureFresh } from '@/lib/auth/freshness'
import { recoverUnauthorized } from '../recoverUnauthorized'
import { installSession, readClientSession, useSessionExpiredEvent } from '../session'

const mockEnsureFresh = vi.mocked(ensureFresh)

const AUTHENTICATED_USER = {
  id: 'user-1',
  email: 'user@example.test',
  createdAt: '2026-01-01T00:00:00.000Z',
  role: 'user',
  emailVerified: true,
  isDemo: false,
} satisfies UserPublic

describe('recoverUnauthorized', () => {
  beforeEach(() => {
    queryClient.clear()
    resetTestAuthStore()
    mockEnsureFresh.mockReset()
  })

  afterEach(() => {
    queryClient.clear()
    resetTestAuthStore()
  })

  it('returns an anonymous 401 without refreshing', async () => {
    resetTestAuthStore(anonymousTestSession())
    const unauthorized = new Response(null, { status: 401 })

    const result = await recoverUnauthorized(unauthorized, '/api/profile')

    expect(result).toBe(unauthorized)
    expect(mockEnsureFresh).not.toHaveBeenCalled()
  })

  it('settles a failed pending recovery as anonymous without expiration', async () => {
    mockEnsureFresh.mockResolvedValue('failed')
    const expiredEvent = renderHook(() => useSessionExpiredEvent())
    const unauthorized = new Response(null, { status: 401 })

    const result = await recoverUnauthorized(unauthorized, '/api/profile')

    expect(result).toBe(unauthorized)
    expect(readClientSession()).toEqual({ status: 'anonymous' })
    expect(expiredEvent.result.current).toBe(false)
  })

  it('expires a known restoring session when refresh definitively fails', async () => {
    resetTestAuthStore(restoringTestSession(AUTHENTICATED_USER))
    mockEnsureFresh.mockResolvedValue('failed')
    const unauthorized = new Response(null, { status: 401 })
    const expiredEvent = renderHook(() => useSessionExpiredEvent())

    const result = await recoverUnauthorized(unauthorized, '/api/profile')

    expect(result).toBe(unauthorized)
    expect(expiredEvent.result.current).toBe(true)
  })

  it('clears cached user data when recovery definitively ends a live session', async () => {
    resetTestAuthStore(presentTestSession(AUTHENTICATED_USER, 'existing-token'))
    queryClient.setQueryData(['profile', 'me'], { username: 'mathieu' })
    queryClient.setQueryData(['collection', 'list'], [{ id: 'p1' }])
    const detailKey = ['products', 'detail-page', 'serum-test', 'user-1'] as const
    queryClient.setQueryData(detailKey, { product: { id: 'p1' }, userStatus: 'in_stock' })
    mockEnsureFresh.mockResolvedValue('failed')
    const unauthorized = new Response(null, { status: 401 })
    const expiredEvent = renderHook(() => useSessionExpiredEvent())

    const result = await recoverUnauthorized(unauthorized, '/api/profile')

    expect(result).toBe(unauthorized)
    expect(expiredEvent.result.current).toBe(true)
    expect(queryClient.getQueryData(['profile', 'me'])).toBeUndefined()
    expect(queryClient.getQueryData(['collection', 'list'])).toBeUndefined()
    expect(queryClient.getQueryData(detailKey)).toBeUndefined()
  })

  it('drops role-dependent catalog caches and keeps role-invariant editorial data', async () => {
    resetTestAuthStore(presentTestSession(AUTHENTICATED_USER, 'existing-token'))
    queryClient.setQueryData(['products', 'list', {}], { items: [] })
    queryClient.setQueryData(['articles', 'list', {}], { items: [] })
    queryClient.setQueryData(['ingredients', 'list', {}], { items: [] })
    queryClient.setQueryData(['product-tags', 'list'], { items: [] })
    mockEnsureFresh.mockResolvedValue('failed')

    await recoverUnauthorized(new Response(null, { status: 401 }), '/api/profile')

    expect(queryClient.getQueryData(['products', 'list', {}])).toBeUndefined()
    expect(queryClient.getQueryData(['articles', 'list', {}])).toBeDefined()
    expect(queryClient.getQueryData(['ingredients', 'list', {}])).toBeUndefined()
    expect(queryClient.getQueryData(['product-tags', 'list'])).toBeDefined()
  })

  it('does not expire a login completed during failed recovery', async () => {
    resetTestAuthStore(presentTestSession(AUTHENTICATED_USER, 'stale-token'))
    let finishRefresh: (result: 'failed') => void = () => undefined
    mockEnsureFresh.mockReturnValue(
      new Promise((resolve) => {
        finishRefresh = resolve
      })
    )
    const recovery = recoverUnauthorized(new Response(null, { status: 401 }), '/api/profile')
    const replacement = {
      ...AUTHENTICATED_USER,
      id: 'user-2',
      email: 'replacement@example.test',
    } satisfies UserPublic

    installSession(queryClient, { accessToken: 'replacement-token', user: replacement })
    finishRefresh('failed')

    await expect(recovery).resolves.toHaveProperty('status', 401)
    expect(readClientSession()).toMatchObject({ status: 'authenticated', user: replacement })
    expect(renderHook(() => useSessionExpiredEvent()).result.current).toBe(false)
  })
})

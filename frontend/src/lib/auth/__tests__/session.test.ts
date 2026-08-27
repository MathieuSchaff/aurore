import type { UserPublic } from '@aurore/shared'

import { QueryClient, QueryObserver } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/store/auth'
import { pendingTestSession, presentTestSession, restoringTestSession } from '@/test/authSession'
import { readBearerForTransport, readCredentialExpiration } from '../credential'
import {
  consumeBanEvent,
  endSession,
  installSession,
  readClientSession,
  readRequestSession,
  recordBan,
  type SessionView,
  updateSessionUser,
  useSession,
  viewerId,
} from '../session'

const SEEDED_USER = {
  id: 'seeded-user',
  email: 'seeded@example.test',
  createdAt: '2026-01-01T00:00:00.000Z',
  role: 'user',
  emailVerified: true,
  isDemo: false,
} satisfies UserPublic

const OTHER_USER = {
  ...SEEDED_USER,
  id: 'other-user',
  email: 'other@example.test',
} satisfies UserPublic

function assertSessionNarrowing(session: SessionView): void {
  // @ts-expect-error user exists only on the authenticated branch
  session.user.role

  if (session.status === 'authenticated') {
    session.user.role
  }
}

void assertSessionNarrowing

describe('viewerId', () => {
  it('returns the authenticated user id', () => {
    const session: SessionView = {
      status: 'authenticated',
      user: SEEDED_USER,
      credential: 'restoring',
    }

    expect(viewerId(session)).toBe(SEEDED_USER.id)
  })

  it('returns null while the session is pending', () => {
    expect(viewerId({ status: 'pending' })).toBeNull()
  })

  it('returns null for an anonymous session', () => {
    expect(viewerId({ status: 'anonymous' })).toBeNull()
  })
})

describe('installSession', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
  })

  it('publishes an authenticated identity and credential', () => {
    installSession(new QueryClient(), {
      accessToken: 'access-token',
      user: SEEDED_USER,
    })

    expect(readClientSession()).toEqual({
      status: 'authenticated',
      user: SEEDED_USER,
      credential: 'present',
    })
  })

  it('drops marked and unmarked cache when adopting a session from anonymous', async () => {
    const queryClient = new QueryClient()
    const anonymousPageKey = ['products', 'detail-page', 'serum-test', null] as const
    await queryClient.prefetchQuery({
      queryKey: anonymousPageKey,
      queryFn: async () => ({ product: { id: 'product-1' } }),
      meta: { sessionScope: { viewerId: null } },
    })
    queryClient.setQueryData(['profile', 'me'], { username: 'previous-viewer' })

    installSession(queryClient, {
      accessToken: 'access-token',
      user: SEEDED_USER,
    })

    expect(queryClient.getQueryData(['profile', 'me'])).toBeUndefined()
    expect(queryClient.getQueryData(anonymousPageKey)).toBeUndefined()
  })

  it('keeps one page read while a pending boot adopts its viewer', async () => {
    const queryClient = new QueryClient()
    const anonymousPageRead = vi.fn(async () => ({ product: { id: 'product-1' } }))
    const viewerPageRead = vi.fn(async () => ({ product: { id: 'product-1' } }))
    const anonymousPage = {
      queryKey: ['products', 'detail-page', 'serum-test', null] as const,
      queryFn: anonymousPageRead,
      staleTime: Number.POSITIVE_INFINITY,
      meta: { sessionScope: { viewerId: null } },
    }
    const viewerPage = {
      ...anonymousPage,
      queryKey: ['products', 'detail-page', 'serum-test', SEEDED_USER.id] as const,
      queryFn: viewerPageRead,
      meta: { sessionScope: { viewerId: SEEDED_USER.id } },
    }
    useAuthStore.setState({ session: pendingTestSession() })
    await queryClient.prefetchQuery(anonymousPage)
    anonymousPageRead.mockClear()
    queryClient.setQueryData(['profile', 'me'], { username: 'residual' })

    installSession(queryClient, {
      accessToken: 'access-token',
      user: SEEDED_USER,
    })

    // Late Suspense boundaries still hydrate with the frozen pending snapshot
    // Removing the marked entry starts a request with a Bearer under the null key
    await queryClient.ensureQueryData(anonymousPage)
    await queryClient.ensureQueryData(viewerPage)
    expect(anonymousPageRead).not.toHaveBeenCalled()
    expect(viewerPageRead).toHaveBeenCalledOnce()
    expect(queryClient.getQueryData(['profile', 'me'])).toBeUndefined()
  })

  it('keeps private cache when refreshing the same viewer and role', () => {
    const queryClient = new QueryClient()
    useAuthStore.getState().setAuth('previous-token', SEEDED_USER)
    queryClient.setQueryData(['profile', 'me'], { username: 'same-viewer' })

    installSession(queryClient, {
      accessToken: 'refreshed-token',
      user: SEEDED_USER,
    })

    expect(queryClient.getQueryData(['profile', 'me'])).toEqual({ username: 'same-viewer' })
  })

  it('drops private cache when the viewer changes', () => {
    const queryClient = new QueryClient()
    useAuthStore.getState().setAuth('previous-token', SEEDED_USER)
    queryClient.setQueryData(['profile', 'me'], { username: 'previous-viewer' })

    installSession(queryClient, {
      accessToken: 'next-token',
      user: OTHER_USER,
    })

    expect(queryClient.getQueryData(['profile', 'me'])).toBeUndefined()
  })

  it('drops role-sensitive cache when the viewer role changes', () => {
    const queryClient = new QueryClient()
    useAuthStore.getState().setAuth('previous-token', SEEDED_USER)
    queryClient.setQueryData(['moderation', 'queue'], { reports: ['report-1'] })

    installSession(queryClient, {
      accessToken: 'refreshed-token',
      user: { ...SEEDED_USER, role: 'admin' },
    })

    expect(queryClient.getQueryData(['moderation', 'queue'])).toBeUndefined()
  })

  it('does not start a mounted private query with the previous viewer during adoption', async () => {
    const queryClient = new QueryClient()
    const requestedAs: Array<string | null> = []
    useAuthStore.getState().setAuth('previous-token', SEEDED_USER)
    queryClient.setQueryData(['profile', 'me'], { viewerId: SEEDED_USER.id })
    const observer = new QueryObserver(queryClient, {
      queryKey: ['profile', 'me'],
      queryFn: async () => {
        const currentViewerId = viewerId(readClientSession())
        requestedAs.push(currentViewerId)
        return { viewerId: currentViewerId }
      },
      staleTime: Number.POSITIVE_INFINITY,
    })
    const unsubscribe = observer.subscribe(() => undefined)

    installSession(queryClient, {
      accessToken: 'next-token',
      user: OTHER_USER,
    })
    await observer.refetch()

    expect(requestedAs).toEqual([OTHER_USER.id])
    unsubscribe()
  })
})

describe('updateSessionUser', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
  })

  it('updates an existing user without changing the credential freshness', () => {
    useAuthStore.setState({
      session: presentTestSession(SEEDED_USER, 'existing-token', 1_234_567),
    })

    updateSessionUser({ ...SEEDED_USER, emailVerified: false })

    expect(readClientSession()).toEqual({
      status: 'authenticated',
      user: { ...SEEDED_USER, emailVerified: false },
      credential: 'present',
    })
    expect(readBearerForTransport()).toBe('existing-token')
    expect(readCredentialExpiration()).toBe(1_234_567)
  })

  it('does not create an authenticated session from an anonymous state', () => {
    updateSessionUser(SEEDED_USER)

    expect(readClientSession()).toEqual({ status: 'anonymous' })
  })
})

describe('endSession', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
    useAuthStore.getState().clearBanned()
    useAuthStore.getState().clearSessionExpired()
  })

  it.each(['logout', 'account-deleted'] as const)(
    'clears every query and publishes anonymous for %s',
    (reason) => {
      const queryClient = new QueryClient()
      useAuthStore.getState().setAuth('existing-token', SEEDED_USER)
      queryClient.setQueryData(['profile', 'me'], { username: 'private' })
      queryClient.setQueryData(['articles', 'list'], { items: ['public'] })

      endSession(queryClient, reason)

      expect(queryClient.getQueryCache().getAll()).toHaveLength(0)
      expect(readClientSession()).toEqual({ status: 'anonymous' })
      expect(useAuthStore.getState().sessionExpired).toBe(false)
    }
  )

  it('defensively drops private cache after a failed boot probe without expiring a session', () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(['profile', 'me'], { username: 'residual' })
    queryClient.setQueryData(['articles', 'list'], { items: ['public'] })

    endSession(queryClient, 'probe-failed')

    expect(queryClient.getQueryData(['profile', 'me'])).toBeUndefined()
    expect(queryClient.getQueryData(['articles', 'list'])).toEqual({ items: ['public'] })
    expect(readClientSession()).toEqual({ status: 'anonymous' })
    expect(useAuthStore.getState().sessionExpired).toBe(false)
  })

  it('drops private cache and publishes an expiration event for a dead live session', () => {
    const queryClient = new QueryClient()
    useAuthStore.getState().setAuth('existing-token', SEEDED_USER)
    queryClient.setQueryData(['profile', 'me'], { username: 'private' })
    queryClient.setQueryData(['articles', 'list'], { items: ['public'] })

    endSession(queryClient, 'expired')

    expect(queryClient.getQueryData(['profile', 'me'])).toBeUndefined()
    expect(queryClient.getQueryData(['articles', 'list'])).toEqual({ items: ['public'] })
    expect(readClientSession()).toEqual({ status: 'anonymous' })
    expect(useAuthStore.getState().sessionExpired).toBe(true)
  })

  it('clears a pending ban notice when the session ends', () => {
    const queryClient = new QueryClient()
    recordBan(queryClient, { expiresAt: null, reason: 'Abus', scope: 'global' })

    endSession(queryClient, 'logout')

    expect(consumeBanEvent()).toBeNull()
  })
})

describe('recordBan', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
    useAuthStore.getState().clearBanned()
  })

  it('keeps identity, drops private cache and records a global ban', () => {
    const queryClient = new QueryClient()
    const details = { expiresAt: null, reason: 'Abus', scope: 'global' } as const
    useAuthStore.getState().setAuth('existing-token', SEEDED_USER)
    queryClient.setQueryData(['profile', 'me'], { username: 'private' })
    queryClient.setQueryData(['articles', 'list'], { items: ['public'] })

    recordBan(queryClient, details)

    expect(readClientSession()).toEqual({
      status: 'authenticated',
      user: SEEDED_USER,
      credential: 'present',
    })
    expect(queryClient.getQueryData(['profile', 'me'])).toBeUndefined()
    expect(queryClient.getQueryData(['articles', 'list'])).toEqual({ items: ['public'] })
    expect(useAuthStore.getState().bannedDetails).toEqual(details)
  })

  it('keeps identity and private cache for a scoped ban', () => {
    const queryClient = new QueryClient()
    const details = {
      expiresAt: null,
      reason: 'Création suspendue',
      scope: 'product_create',
    } as const
    useAuthStore.getState().setAuth('existing-token', SEEDED_USER)
    queryClient.setQueryData(['profile', 'me'], { username: 'private' })

    recordBan(queryClient, details)

    expect(readClientSession().status).toBe('authenticated')
    expect(queryClient.getQueryData(['profile', 'me'])).toEqual({ username: 'private' })
    expect(useAuthStore.getState().bannedDetails).toEqual(details)
  })

  it('lets a ban event be consumed only once', () => {
    const queryClient = new QueryClient()
    const details = { expiresAt: null, reason: null, scope: 'global' } as const
    recordBan(queryClient, details)

    expect(consumeBanEvent()).toEqual(details)
    expect(consumeBanEvent()).toBeNull()
  })
})

describe('useSession', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
  })

  it('reacts to client session changes', () => {
    const { result } = renderHook(() => useSession())

    expect(result.current).toEqual({ status: 'anonymous' })

    act(() => {
      useAuthStore.setState({ session: restoringTestSession(SEEDED_USER) })
    })

    expect(result.current).toEqual({
      status: 'authenticated',
      user: SEEDED_USER,
      credential: 'restoring',
    })
  })

  it('does not fetch while reading the client session', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    renderHook(() => useSession())

    expect(fetchSpy).not.toHaveBeenCalled()
    fetchSpy.mockRestore()
  })
})

describe('readClientSession', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
  })

  it('keeps a seeded identity authenticated while the credential is restoring', () => {
    useAuthStore.setState({ session: restoringTestSession(SEEDED_USER) })

    expect(readClientSession()).toEqual({
      status: 'authenticated',
      user: SEEDED_USER,
      credential: 'restoring',
    })
  })

  it('returns anonymous after the client boot settles without a user', () => {
    expect(readClientSession()).toEqual({
      status: 'anonymous',
    })
  })

  it('returns pending while an unknown boot probe is unresolved', () => {
    useAuthStore.setState({ session: pendingTestSession() })

    expect(readClientSession()).toEqual({
      status: 'pending',
    })
  })

  it('reports a present credential when the current user has a Bearer', () => {
    useAuthStore.setState({ session: presentTestSession(SEEDED_USER, 'access-token') })

    expect(readClientSession()).toEqual({
      status: 'authenticated',
      user: SEEDED_USER,
      credential: 'present',
    })
  })

  it('returns pending before the client boot has made a decision', () => {
    useAuthStore.setState({ session: pendingTestSession() })

    expect(readClientSession()).toEqual({
      status: 'pending',
    })
  })

  it('rejects request-scoped session reads in the browser', () => {
    expect(() => readRequestSession(new QueryClient())).toThrow('readRequestSession is server-only')
  })
})

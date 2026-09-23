import type { UserPublic } from '@aurore/shared'

import { HttpResponse, http } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { __resetFreshness } from '@/lib/auth/freshness'
import { consumeBanEvent, installSession, readClientSession } from '@/lib/auth/session'
import { queryClient } from '@/lib/queryClient'
import { presentTestSession, resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { api } from '../api'

const alice = {
  id: 'alice',
  email: 'alice@example.test',
  role: 'user',
  isDemo: false,
  emailVerified: true,
  createdAt: '2026-01-01T00:00:00.000Z',
} satisfies UserPublic
const bob = { ...alice, id: 'bob', email: 'bob@example.test' } satisfies UserPublic

describe('request session ownership', () => {
  beforeEach(() => {
    __resetFreshness()
    queryClient.clear()
    resetTestAuthStore(presentTestSession(alice, 'alice-token'))
  })

  afterEach(() => {
    queryClient.clear()
    resetTestAuthStore()
  })

  it.each([401, 403])('ignores a delayed %s from the previous account', async (status) => {
    const started = Promise.withResolvers<void>()
    const release = Promise.withResolvers<void>()
    const authorizations: (string | null)[] = []
    let refreshes = 0
    server.use(
      http.patch('*/api/profile', async ({ request }) => {
        authorizations.push(request.headers.get('authorization'))
        started.resolve()
        await release.promise
        return HttpResponse.json(
          { success: false, error: status === 403 ? 'banned' : 'unauthorized' },
          { status }
        )
      }),
      http.post('*/api/auth/refresh', () => {
        refreshes++
        return HttpResponse.json({ success: true, data: { user: bob, accessToken: 'bob-token' } })
      })
    )
    const response = api.profile.$patch({ json: { username: 'alice-name' } })
    await started.promise
    installSession(queryClient, { user: bob, accessToken: 'bob-token' })
    queryClient.setQueryData(['profile', 'me'], { username: 'bob-name' })
    release.resolve()

    expect((await response).status).toBe(status)
    expect(authorizations).toEqual(['Bearer alice-token'])
    expect(refreshes).toBe(0)
    expect(consumeBanEvent()).toBeNull()
    expect(queryClient.getQueryData(['profile', 'me'])).toEqual({ username: 'bob-name' })
  })

  it('does not replay a write when another account supersedes its refresh', async () => {
    const refreshing = Promise.withResolvers<void>()
    const release = Promise.withResolvers<void>()
    const authorizations: (string | null)[] = []
    server.use(
      http.patch('*/api/profile', ({ request }) => {
        authorizations.push(request.headers.get('authorization'))
        return HttpResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
      }),
      http.post('*/api/auth/refresh', async () => {
        refreshing.resolve()
        await release.promise
        return HttpResponse.json({ success: true, data: { user: alice, accessToken: 'alice-new' } })
      })
    )
    const response = api.profile.$patch({ json: { username: 'alice-name' } })
    await refreshing.promise
    installSession(queryClient, { user: bob, accessToken: 'bob-token' })
    release.resolve()

    expect((await response).status).toBe(401)
    expect(authorizations).toEqual(['Bearer alice-token'])
    expect(readClientSession()).toMatchObject({ user: bob })
  })
})

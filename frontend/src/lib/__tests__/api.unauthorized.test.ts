import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { __resetFreshness } from '@/lib/auth/freshness'
import { useAuthStore } from '@/store/auth'
import { pendingTestSession, presentTestSession } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { api } from '../api'

describe('authFetch: 401 interceptor', () => {
  beforeEach(() => {
    __resetFreshness()
    useAuthStore.setState({
      session: pendingTestSession(),
      sessionExpired: false,
    })
  })

  it('does not refresh on invalid credentials during pending boot', async () => {
    let refreshRequests = 0

    server.use(
      http.post('*/api/auth/login', () =>
        HttpResponse.json({ success: false, error: 'invalid_credentials' }, { status: 401 })
      ),
      http.post('*/api/auth/refresh', () => {
        refreshRequests++
        return HttpResponse.json({ success: false, error: 'invalid_token' }, { status: 401 })
      })
    )

    const response = await api.auth.login.$post({
      json: {
        email: 'nobody@example.com',
        password: 'Wrongpass1!',
      },
    })
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({
      success: false,
      error: 'invalid_credentials',
    })
    // invalid_credentials describes the submitted password, not the session.
    // Refreshing here can block the real boot probe through the shared backoff.
    expect(refreshRequests).toBe(0)
  })

  it('does not refresh when change password rejects the current password', async () => {
    let refreshRequests = 0

    const user = {
      id: 'user-1',
      email: 'user@example.com',
      createdAt: '2026-01-01T00:00:00.000Z',
      emailVerified: true,
      role: 'user',
      isDemo: false,
    } as const
    useAuthStore.setState({
      session: presentTestSession(user, 'existing-token', Date.now() + 60_000),
    })

    server.use(
      http.post('*/api/auth/change-password', () =>
        HttpResponse.json({ success: false, error: 'invalid_credentials' }, { status: 401 })
      ),
      http.post('*/api/auth/refresh', () => {
        refreshRequests++
        return HttpResponse.json({ success: false, error: 'invalid_token' }, { status: 401 })
      })
    )

    const response = await api.auth['change-password'].$post({
      json: {
        currentPassword: 'WrongPassword1!',
        newPassword: 'NewPassword1!',
      },
    })
    const body = await response.json()

    expect(response.status).toBe(401)
    expect(body).toEqual({
      success: false,
      error: 'invalid_credentials',
    })
    expect(refreshRequests).toBe(0)
  })

  it('refreshes and replays a recoverable unauthorized response', async () => {
    let refreshRequests = 0
    let sessionRequests = 0
    let replayedAuthorization: string | null = null

    const user = {
      id: 'user-1',
      email: 'user@example.com',
      emailVerified: true,
      role: 'user' as const,
      isDemo: false,
      createdAt: '2026-01-01T00:00:00.000Z',
    }

    server.use(
      http.get('*/api/auth/session', ({ request }) => {
        sessionRequests++

        if (sessionRequests === 1) {
          return HttpResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
        }

        replayedAuthorization = request.headers.get('Authorization')
        return HttpResponse.json({
          success: true,
          data: {
            authenticated: true,
            userId: user.id,
            role: user.role,
          },
        })
      }),
      http.post('*/api/auth/refresh', () => {
        refreshRequests++
        return HttpResponse.json({
          success: true,
          data: {
            accessToken: 'refreshed-token',
            user,
          },
        })
      })
    )

    const response = await api.auth.session.$get()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(refreshRequests).toBe(1)
    expect(sessionRequests).toBe(2)
    expect(replayedAuthorization).toBe('Bearer refreshed-token')
  })
})

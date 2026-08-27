import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { consumeBanEvent } from '../../lib/auth/session'
import { resetTestAuthStore } from '../../test/authSession'
import { server } from '../../test/msw/server'
import { api } from '../api'

describe('authFetch: 403 banned interceptor', () => {
  beforeEach(() => {
    resetTestAuthStore()
  })

  it('stores ban details on a 403 banned response', async () => {
    server.use(
      http.get('*/api/auth/session', () =>
        HttpResponse.json(
          {
            success: false,
            error: 'banned',
            details: { expiresAt: '2026-06-01T00:00:00.000Z', reason: 'Comportement abusif' },
          },
          { status: 403 }
        )
      )
    )

    await api.auth.session.$get()

    expect(consumeBanEvent()).toEqual({
      expiresAt: '2026-06-01T00:00:00.000Z',
      reason: 'Comportement abusif',
    })
  })

  it('stores null ban fields when expiresAt and reason are null', async () => {
    server.use(
      http.get('*/api/auth/session', () =>
        HttpResponse.json(
          { success: false, error: 'banned', details: { expiresAt: null, reason: null } },
          { status: 403 }
        )
      )
    )

    await api.auth.session.$get()

    expect(consumeBanEvent()).toEqual({ expiresAt: null, reason: null })
  })

  it('treats an unknown scope as a global ban instead of suppressing the redirect signal', async () => {
    server.use(
      http.get('*/api/auth/session', () =>
        HttpResponse.json(
          {
            success: false,
            error: 'banned',
            details: { expiresAt: null, reason: 'Compte suspendu', scope: 'future_scope' },
          },
          { status: 403 }
        )
      )
    )

    await api.auth.session.$get()

    expect(consumeBanEvent()).toEqual({
      expiresAt: null,
      reason: 'Compte suspendu',
      scope: undefined,
    })
  })

  it('does not store ban details on a non-banned 403', async () => {
    server.use(
      http.get('*/api/auth/session', () =>
        HttpResponse.json({ success: false, error: 'forbidden' }, { status: 403 })
      )
    )

    await api.auth.session.$get()

    expect(consumeBanEvent()).toBeNull()
  })
})

import type { SsrBootResponse } from '@aurore/shared'

import { QueryClient } from '@tanstack/react-query'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it } from 'vitest'

import { seedClientSession, writeRequestBootSession } from '@/lib/auth/session'
import { clearClientAuthSession, useClientAuthSessionState } from '@/lib/auth/sessionState'
import { anonymousTestSession, resetTestAuthStore } from '@/test/authSession'

const user = {
  id: '019c0000-0000-7000-8000-000000000001',
  email: 'aurore@example.test',
  createdAt: '2026-08-14T10:00:00.000Z',
  emailVerified: true,
  role: 'user',
  isDemo: false,
} satisfies Extract<SsrBootResponse, { session: { authenticated: true } }>['session']['user']

function Probe() {
  return <span>{useClientAuthSessionState().status}</span>
}

describe('useClientAuthSessionState', () => {
  afterEach(() => {
    resetTestAuthStore()
  })

  // React reads the server snapshot while hydrating. The store is seeded before
  // hydrateRoot runs, so that snapshot must be the seeded session or the nav
  // hydrates as pending against markup the server rendered as anonymous
  it('serves the seeded session as the hydration snapshot, not the initial one', () => {
    resetTestAuthStore(anonymousTestSession())

    expect(renderToString(<Probe />)).toContain('anonymous')
  })

  // A failed boot refresh flips the store to anonymous while Suspense boundaries are
  // still hydrating. Those boundaries must hydrate against what the server rendered,
  // the seeded session, and only then pick up the change through the live snapshot
  it('keeps the seeded session as the hydration snapshot after a later change', () => {
    const queryClient = new QueryClient()
    writeRequestBootSession(queryClient, 'authenticated', {
      authenticated: true,
      userId: user.id,
      user,
      role: 'user',
    })
    seedClientSession(queryClient)
    clearClientAuthSession()

    expect(renderToString(<Probe />)).toContain('authenticated')
  })
})

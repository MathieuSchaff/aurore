import type { SsrBootResponse } from '@aurore/shared'

import { QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it } from 'vitest'

import { resetTestAuthStore } from '@/test/authSession'
import { readClientSession, seedClientSession, writeRequestBootSession } from '../session'

const user = {
  id: '019c0000-0000-7000-8000-000000000001',
  email: 'aurore@example.test',
  createdAt: '2026-08-14T10:00:00.000Z',
  emailVerified: true,
  role: 'contributor',
  isDemo: false,
} satisfies Extract<SsrBootResponse, { session: { authenticated: true } }>['session']['user']

describe('seedClientSession', () => {
  beforeEach(() => {
    resetTestAuthStore()
  })

  it('publishes the authenticated capsule then removes only that capsule', () => {
    const queryClient = new QueryClient()
    const bootSession = {
      authenticated: true,
      userId: user.id,
      user,
      role: 'contributor',
    } as const
    writeRequestBootSession(queryClient, 'authenticated', bootSession)
    queryClient.setQueryData(['profile', 'me'], { username: 'aurore' })

    seedClientSession(queryClient)

    expect(readClientSession()).toEqual({
      status: 'authenticated',
      user,
      credential: 'restoring',
    })
    expect(queryClient.getQueryData(['boot', 'session'])).toBeUndefined()
    expect(queryClient.getQueryData(['profile', 'me'])).toEqual({ username: 'aurore' })
  })

  it('publishes anonymous before React can read the session', () => {
    const queryClient = new QueryClient()
    writeRequestBootSession(queryClient, 'anonymous', { authenticated: false })

    seedClientSession(queryClient)

    expect(readClientSession()).toEqual({ status: 'anonymous' })
    expect(queryClient.getQueryData(['boot', 'session'])).toBeUndefined()
  })

  it('publishes pending before React can read the session', () => {
    const queryClient = new QueryClient()
    writeRequestBootSession(queryClient, 'unknown', { authenticated: false })

    seedClientSession(queryClient)

    expect(readClientSession()).toEqual({ status: 'pending' })
    expect(queryClient.getQueryData(['boot', 'session'])).toBeUndefined()
  })

  it('rejects hydration without a restored capsule', () => {
    expect(() => seedClientSession(new QueryClient())).toThrow(
      'Hydration did not restore the boot capsule'
    )
  })
})

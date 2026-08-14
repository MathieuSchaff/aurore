import type { SsrBootResponse } from '@aurore/shared'

import { QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it } from 'vitest'

import { type AuthSessionCache, authQueries } from '@/lib/queries/auth'
import { useAuthStore } from '@/store/auth'
import { seedClientAuth } from '../seedClientAuth'

const user = {
  id: '019c0000-0000-7000-8000-000000000001',
  email: 'aurore@example.test',
  createdAt: '2026-08-14T10:00:00.000Z',
  emailVerified: true,
  role: 'contributor',
  isDemo: false,
} satisfies Extract<SsrBootResponse, { session: { authenticated: true } }>['session']['user']

describe('seedClientAuth', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      tokenExpiresAt: null,
      user: null,
      emailVerified: false,
      role: 'user',
      isDemo: false,
    })
  })

  it('seeds the SSR identity from the session cache without fabricating a token', () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData<AuthSessionCache>(authQueries.session().queryKey, {
      authenticated: true,
      userId: user.id,
      user,
      role: 'contributor',
    })

    seedClientAuth(queryClient)

    expect(useAuthStore.getState()).toMatchObject({
      accessToken: null,
      tokenExpiresAt: null,
      user,
      emailVerified: true,
      role: 'contributor',
      isDemo: false,
    })
  })
})

import type { UserPublic } from '@aurore/shared'

import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/helpers/isServer', () => ({ isServer: true }))

import { renderHookWithProviders } from '@/test/utils'
import { readRequestSession, useSession, writeRequestBootSession } from '../session'

const BOOT_USER = {
  id: 'boot-user',
  email: 'boot@example.test',
  createdAt: '2026-01-01T00:00:00.000Z',
  role: 'admin',
  emailVerified: true,
  isDemo: false,
} satisfies UserPublic

describe('readRequestSession', () => {
  it('reads an authenticated SSR boot as restoring', () => {
    const queryClient = new QueryClient()
    writeRequestBootSession(queryClient, 'authenticated', {
      authenticated: true,
      userId: BOOT_USER.id,
      role: BOOT_USER.role,
      user: BOOT_USER,
    })

    expect(readRequestSession(queryClient)).toEqual({
      status: 'authenticated',
      user: BOOT_USER,
      credential: 'restoring',
    })
  })

  it('reads an anonymous SSR boot as anonymous', () => {
    const queryClient = new QueryClient()
    writeRequestBootSession(queryClient, 'anonymous', { authenticated: false })

    expect(readRequestSession(queryClient)).toEqual({
      status: 'anonymous',
    })
  })

  it('reads an unknown SSR boot as pending', () => {
    const queryClient = new QueryClient()
    writeRequestBootSession(queryClient, 'unknown', { authenticated: false })

    expect(readRequestSession(queryClient)).toEqual({
      status: 'pending',
    })
  })

  it('rejects a request whose root loader did not publish a capsule', () => {
    const queryClient = new QueryClient()

    expect(() => readRequestSession(queryClient)).toThrow(
      'Root auth loader did not publish a boot capsule'
    )
  })
})

describe('writeRequestBootSession', () => {
  it('writes an authenticated capsule without the credential', () => {
    const queryClient = new QueryClient()
    writeRequestBootSession(queryClient, 'authenticated', {
      authenticated: true as const,
      userId: BOOT_USER.id,
      role: BOOT_USER.role,
      user: BOOT_USER,
    })

    expect(queryClient.getQueryData(['boot', 'session'])).toEqual({
      status: 'authenticated',
      user: BOOT_USER,
    })
  })

  it('writes an anonymous capsule', () => {
    const queryClient = new QueryClient()

    writeRequestBootSession(queryClient, 'anonymous', { authenticated: false })

    expect(queryClient.getQueryData(['boot', 'session'])).toEqual({ status: 'anonymous' })
  })

  it('writes an explicit pending capsule for an unknown SSR boot', () => {
    const queryClient = new QueryClient()

    writeRequestBootSession(queryClient, 'unknown', { authenticated: false })

    expect(queryClient.getQueryData(['boot', 'session'])).toEqual({ status: 'pending' })
  })
})

describe('useSession', () => {
  it('reads the request session on the server', () => {
    const queryClient = new QueryClient()
    writeRequestBootSession(queryClient, 'authenticated', {
      authenticated: true,
      userId: BOOT_USER.id,
      role: BOOT_USER.role,
      user: BOOT_USER,
    })

    const { result } = renderHookWithProviders(() => useSession(), { queryClient })

    expect(result.current).toEqual({
      status: 'authenticated',
      user: BOOT_USER,
      credential: 'restoring',
    })
  })
})

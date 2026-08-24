import type { UserPublic } from '@aurore/shared'

import { QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { anonymousTestSession, resetTestAuthStore, restoringTestSession } from '@/test/authSession'

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
import { installSession, readClientSession } from '../session'

const mockEnsureFresh = vi.mocked(ensureFresh)

const SEEDED_ADMIN = {
  id: 'u1',
  email: 'admin@example.com',
  createdAt: '2026-01-01T00:00:00.000Z',
  emailVerified: true,
  role: 'admin',
  isDemo: false,
} satisfies UserPublic

describe('awaitBootRefresh', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    env.server = false
    vi.clearAllMocks()
    resetTestAuthStore()
  })

  it('returns without probing on the server', async () => {
    env.server = true

    await awaitBootRefresh(queryClient)

    expect(mockEnsureFresh).not.toHaveBeenCalled()
  })

  it('probes on the client while the session is pending', async () => {
    await awaitBootRefresh(queryClient)

    expect(mockEnsureFresh).toHaveBeenCalledWith(queryClient)
  })

  it('skips the probe when the client session is anonymous', async () => {
    resetTestAuthStore(anonymousTestSession())

    await awaitBootRefresh(queryClient)

    expect(mockEnsureFresh).not.toHaveBeenCalled()
  })

  it('clears a seeded role and private cache when the probe fails', async () => {
    resetTestAuthStore(restoringTestSession(SEEDED_ADMIN))
    queryClient.setQueryData(['profile'], { username: 'Aurore' })
    const productListKey = ['products', 'list', {}, SEEDED_ADMIN.id] as const
    queryClient.setQueryData(productListKey, {
      items: [{ id: 'p1', userStatus: 'owned' }],
      total: 1,
    })
    mockEnsureFresh.mockResolvedValueOnce('failed')

    await awaitBootRefresh(queryClient)

    expect(readClientSession()).toEqual({ status: 'anonymous' })
    expect(queryClient.getQueryData(['profile'])).toBeUndefined()
    expect(queryClient.getQueryData(productListKey)).toBeUndefined()
  })

  it('clears a seeded session when refresh is in cooldown', async () => {
    resetTestAuthStore(restoringTestSession(SEEDED_ADMIN))
    queryClient.setQueryData(['profile'], { username: 'Aurore' })
    mockEnsureFresh.mockResolvedValueOnce('cooldown')

    await awaitBootRefresh(queryClient)

    expect(readClientSession()).toEqual({ status: 'anonymous' })
    expect(queryClient.getQueryData(['profile'])).toBeUndefined()
  })

  it('keeps a login completed while the boot probe was pending', async () => {
    let finishRefresh: (result: 'failed') => void = () => undefined
    mockEnsureFresh.mockReturnValue(
      new Promise((resolve) => {
        finishRefresh = resolve
      })
    )
    const bootProbe = awaitBootRefresh(queryClient)
    const replacement = {
      ...SEEDED_ADMIN,
      id: 'u2',
      email: 'replacement@example.com',
    } satisfies UserPublic

    installSession(queryClient, { accessToken: 'replacement-token', user: replacement })
    finishRefresh('failed')
    await bootProbe

    expect(readClientSession()).toMatchObject({ status: 'authenticated', user: replacement })
  })
})

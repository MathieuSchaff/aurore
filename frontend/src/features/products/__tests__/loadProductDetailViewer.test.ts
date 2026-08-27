import type { UserPublic } from '@aurore/shared'

import { QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { SessionView } from '@/lib/auth/session'

const { env, readClientSessionMock, readRequestSessionMock } = vi.hoisted(() => ({
  env: { server: false },
  readClientSessionMock: vi.fn<() => SessionView>(),
  readRequestSessionMock: vi.fn<() => SessionView>(),
}))

vi.mock('@/lib/helpers/isServer', () => ({
  get isServer() {
    return env.server
  },
}))
vi.mock('@/lib/auth/awaitBootRefresh', () => ({
  awaitBootRefresh: vi.fn(async () => undefined),
}))
vi.mock('@/lib/auth/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/auth/session')>()),
  readClientSession: readClientSessionMock,
  readRequestSession: readRequestSessionMock,
}))

import { awaitBootRefresh } from '@/lib/auth/awaitBootRefresh'
import { resolveProductDetailViewer } from '../loadProductDetailViewer'

const AUTHENTICATED_USER = {
  id: 'user-1',
  email: 'user@example.com',
  createdAt: '2026-08-21T06:00:00.000Z',
  emailVerified: true,
  role: 'user',
  isDemo: false,
} satisfies UserPublic

const mockAwaitBootRefresh = vi.mocked(awaitBootRefresh)

describe('resolveProductDetailViewer', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    env.server = false
    vi.clearAllMocks()
    readClientSessionMock.mockReturnValue({ status: 'anonymous' })
    readRequestSessionMock.mockReturnValue({ status: 'anonymous' })
  })

  it('waits for the client boot refresh before reading the viewer', async () => {
    mockAwaitBootRefresh.mockImplementationOnce(async () => {
      readClientSessionMock.mockReturnValue({
        status: 'authenticated',
        user: AUTHENTICATED_USER,
        credential: 'present',
      })
    })

    const viewerId = await resolveProductDetailViewer(queryClient, Promise.resolve())

    expect(mockAwaitBootRefresh).toHaveBeenCalledWith(queryClient)
    expect(viewerId).toBe(AUTHENTICATED_USER.id)
  })

  it('waits for the parent boot data on the server', async () => {
    env.server = true
    const parentMatchPromise = Promise.resolve().then(() => {
      readRequestSessionMock.mockReturnValue({
        status: 'authenticated',
        user: AUTHENTICATED_USER,
        credential: 'restoring',
      })
    })

    const viewerId = await resolveProductDetailViewer(queryClient, parentMatchPromise)

    expect(mockAwaitBootRefresh).not.toHaveBeenCalled()
    expect(viewerId).toBe(AUTHENTICATED_USER.id)
  })
})

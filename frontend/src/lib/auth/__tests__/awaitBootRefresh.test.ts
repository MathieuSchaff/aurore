import { QueryClient } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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
vi.mock('../sessionHint', () => ({
  hasSessionHint: vi.fn(() => true),
}))

import { awaitBootRefresh } from '../awaitBootRefresh'
import { ensureFresh } from '../freshness'
import { hasSessionHint } from '../sessionHint'

const mockEnsureFresh = vi.mocked(ensureFresh)
const mockHasSessionHint = vi.mocked(hasSessionHint)

describe('awaitBootRefresh', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    env.server = false
    vi.clearAllMocks()
    mockHasSessionHint.mockReturnValue(true)
  })

  // The guard lives in the module so no caller has to know it. hasSessionHint must
  // stay untouched too: it reads document.cookie, absent from the server bundle.
  it('returns without probing on the server', async () => {
    env.server = true

    await awaitBootRefresh(queryClient)

    expect(mockHasSessionHint).not.toHaveBeenCalled()
    expect(mockEnsureFresh).not.toHaveBeenCalled()
  })

  it('probes on the client when a session hint is present', async () => {
    await awaitBootRefresh(queryClient)

    expect(mockEnsureFresh).toHaveBeenCalledWith(queryClient)
  })

  it('skips the probe when no session hint is present', async () => {
    mockHasSessionHint.mockReturnValue(false)

    await awaitBootRefresh(queryClient)

    expect(mockEnsureFresh).not.toHaveBeenCalled()
  })
})

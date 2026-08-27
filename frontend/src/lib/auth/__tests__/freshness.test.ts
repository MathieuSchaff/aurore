import type { UserPublic } from '@aurore/shared'

import { QueryClient } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { readBearerForTransport } from '@/lib/auth/credential'
import { endSession, installSession, readClientSession } from '@/lib/auth/session'
import { httpClient } from '@/lib/httpClient'
import { resetTestAuthStore } from '@/test/authSession'

vi.mock('@/lib/httpClient', () => ({
  httpClient: vi.fn(),
}))

import { __resetFreshness, __setClock, ensureFresh } from '../freshness'

const mockHttpClient = vi.mocked(httpClient)

const FIRST_USER = {
  id: 'u1',
  email: 'a@b.com',
  createdAt: '2026-01-01T00:00:00.000Z',
  emailVerified: true,
  role: 'user',
  isDemo: false,
} satisfies UserPublic

const SECOND_USER = {
  ...FIRST_USER,
  id: 'u2',
  email: 'b@c.com',
} satisfies UserPublic

function token(expiresInSeconds = 3600): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds
  return `h.${btoa(JSON.stringify({ exp }))}.s`
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

describe('ensureFresh', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    resetTestAuthStore()
    mockHttpClient.mockReset()
    __resetFreshness()
  })

  afterEach(() => {
    queryClient.clear()
    __setClock(null)
  })

  it('installs the refreshed credential on success', async () => {
    const fakeToken = token()
    mockHttpClient.mockResolvedValue(
      jsonResponse({ success: true, data: { accessToken: fakeToken, user: FIRST_USER } })
    )

    const result = await ensureFresh(queryClient)

    expect(result).toBe('ok')
    expect(readBearerForTransport()).toBe(fakeToken)
    expect(readClientSession()).toMatchObject({ status: 'authenticated', user: FIRST_USER })
    expect(queryClient.getQueryData(['auth', 'credential-validation', 'u1'])).toEqual({
      authenticated: true,
      userId: 'u1',
      role: 'user',
    })
  })

  it("returns 'failed' when the server responds with !ok", async () => {
    mockHttpClient.mockResolvedValue(new Response(null, { status: 500 }))

    const result = await ensureFresh(queryClient)

    expect(result).toBe('failed')
    expect(readBearerForTransport()).toBeNull()
  })

  it("returns 'failed' when success is false in response body", async () => {
    mockHttpClient.mockResolvedValue(jsonResponse({ success: false, error: 'invalid_refresh' }))

    const result = await ensureFresh(queryClient)

    expect(result).toBe('failed')
  })

  it("returns 'failed' when the request throws", async () => {
    mockHttpClient.mockRejectedValue(new Error('network'))

    const result = await ensureFresh(queryClient)

    expect(result).toBe('failed')
  })

  it("returns 'cooldown' during the backoff window after a failure", async () => {
    // Drive the clock so the backoff window is deterministic, not real-time-within-one-tick.
    let nowMs = 1_000_000
    __setClock({ now: () => nowMs })
    mockHttpClient.mockRejectedValueOnce(new Error('network'))

    await ensureFresh(queryClient)
    expect(mockHttpClient).toHaveBeenCalledOnce()

    // 500ms into the 1s backoff window, second call short-circuits to 'cooldown'.
    nowMs += 500
    const result = await ensureFresh(queryClient)
    expect(result).toBe('cooldown')
    expect(mockHttpClient).toHaveBeenCalledOnce()
  })

  it('deduplicates concurrent calls', async () => {
    const fakeToken = token()
    mockHttpClient.mockResolvedValue(
      jsonResponse({ success: true, data: { accessToken: fakeToken, user: SECOND_USER } })
    )

    const [r1, r2] = await Promise.all([ensureFresh(queryClient), ensureFresh(queryClient)])

    expect(r1).toBe('ok')
    expect(r2).toBe('ok')
    expect(mockHttpClient).toHaveBeenCalledOnce()
  })

  it('does not overwrite a login completed during refresh', async () => {
    let resolveRefresh: (response: Response) => void = () => undefined
    mockHttpClient.mockReturnValue(
      new Promise((resolve) => {
        resolveRefresh = resolve
      })
    )
    const staleRefresh = ensureFresh(queryClient)
    const currentToken = token(7200)

    installSession(queryClient, { accessToken: currentToken, user: SECOND_USER })
    resolveRefresh(
      jsonResponse({ success: true, data: { accessToken: token(), user: FIRST_USER } })
    )

    await expect(staleRefresh).resolves.toBe('superseded')
    expect(readBearerForTransport()).toBe(currentToken)
    expect(readClientSession()).toMatchObject({ user: SECOND_USER })
  })

  it('does not restore a session logged out during refresh', async () => {
    installSession(queryClient, { accessToken: token(), user: FIRST_USER })
    let resolveRefresh: (response: Response) => void = () => undefined
    mockHttpClient.mockReturnValue(
      new Promise((resolve) => {
        resolveRefresh = resolve
      })
    )
    const staleRefresh = ensureFresh(queryClient)

    endSession(queryClient, 'logout')
    resolveRefresh(
      jsonResponse({ success: true, data: { accessToken: token(), user: FIRST_USER } })
    )

    await expect(staleRefresh).resolves.toBe('superseded')
    expect(readClientSession()).toEqual({ status: 'anonymous' })
    expect(readBearerForTransport()).toBeNull()
  })
})

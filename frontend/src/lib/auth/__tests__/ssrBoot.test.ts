import type { SsrBootResponse } from '@aurore/shared'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const getRequestHeader = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/react-start/server', () => ({ getRequestHeader }))

import { loadSsrBoot } from '../ssrBoot'

const authenticatedBoot = {
  session: {
    authenticated: true,
    userId: '019c0000-0000-7000-8000-000000000001',
    user: {
      id: '019c0000-0000-7000-8000-000000000001',
      email: 'aurore@example.test',
      createdAt: '2026-08-14T10:00:00.000Z',
      emailVerified: true,
      role: 'contributor',
      isDemo: false,
    },
    role: 'contributor',
  },
  profile: {
    userId: '019c0000-0000-7000-8000-000000000001',
    username: 'aurore-test',
    avatarUrl: null,
    links: [],
  },
} satisfies SsrBootResponse

describe('loadSsrBoot', () => {
  beforeEach(() => {
    getRequestHeader.mockReturnValue('aurore_session=1; refresh_token_backup=old; theme=dark')
    vi.stubEnv('VITE_API_URL', 'http://api.test')
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('returns anonymous without a network call when the refresh cookie is absent', async () => {
    await expect(loadSsrBoot()).resolves.toEqual({
      issue: 'anonymous',
      hasRefreshTokenCookie: false,
      data: {
        session: { authenticated: false },
        profile: null,
      },
    })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('returns authenticated data while forwarding only the refresh request cookie', async () => {
    const cookieHeader = 'theme=dark;refresh_token=opaque-token; aurore_session=1'
    getRequestHeader.mockReturnValue(cookieHeader)
    vi.mocked(fetch).mockResolvedValue(
      Response.json({ success: true, data: authenticatedBoot }, { status: 200 })
    )

    await expect(loadSsrBoot()).resolves.toEqual({
      issue: 'authenticated',
      hasRefreshTokenCookie: true,
      data: authenticatedBoot,
    })

    expect(fetch).toHaveBeenCalledOnce()
    const [input, init] = vi.mocked(fetch).mock.calls[0] ?? []
    expect(String(input)).toBe('http://api.test/api/boot?')
    const headers = new Headers(init?.headers)
    expect(Object.fromEntries(headers.entries())).toEqual({ cookie: cookieHeader })
  })

  it('forwards the selected products view and filters', async () => {
    getRequestHeader.mockReturnValue('refresh_token=opaque-token')
    vi.mocked(fetch).mockResolvedValue(
      Response.json({ success: true, data: authenticatedBoot }, { status: 200 })
    )

    await loadSsrBoot({
      view: 'products',
      category: 'skincare',
      q: 'niacinamide',
      page: '2',
      limit: '24',
    })

    const [input] = vi.mocked(fetch).mock.calls[0] ?? []
    const requestUrl = new URL(String(input))
    expect(requestUrl.pathname).toBe('/api/boot')
    expect(Object.fromEntries(requestUrl.searchParams.entries())).toEqual({
      view: 'products',
      category: 'skincare',
      q: 'niacinamide',
      page: '2',
      limit: '24',
    })
  })

  it('returns anonymous when Hono rejects the refresh session', async () => {
    getRequestHeader.mockReturnValue('refresh_token=revoked-token')
    vi.mocked(fetch).mockResolvedValue(
      Response.json({
        success: true,
        data: { session: { authenticated: false }, profile: null },
      })
    )

    await expect(loadSsrBoot()).resolves.toEqual({
      issue: 'anonymous',
      hasRefreshTokenCookie: true,
      data: {
        session: { authenticated: false },
        profile: null,
      },
    })
    expect(fetch).toHaveBeenCalledOnce()
  })

  it('falls back to unknown and emits a structured log when the boot request fails', async () => {
    getRequestHeader.mockReturnValue('refresh_token=opaque-token')
    vi.mocked(fetch).mockRejectedValue(new TypeError('connection refused'))
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    await expect(loadSsrBoot()).resolves.toEqual({
      issue: 'unknown',
      hasRefreshTokenCookie: true,
      data: {
        session: { authenticated: false },
        profile: null,
      },
    })

    expect(log).toHaveBeenCalledOnce()
    expect(JSON.parse(String(log.mock.calls[0]?.[0]))).toMatchObject({
      event: 'ssr_boot_fallback',
      route: '/api/boot',
      cause: 'network_error',
      durationMs: expect.any(Number),
    })
  })

  it('bounds the server request to two seconds and classifies a timeout', async () => {
    getRequestHeader.mockReturnValue('refresh_token=opaque-token')
    const timeoutSignal = AbortSignal.abort(new DOMException('timed out', 'TimeoutError'))
    const timeout = vi.spyOn(AbortSignal, 'timeout').mockReturnValue(timeoutSignal)
    vi.mocked(fetch).mockRejectedValue(timeoutSignal.reason)
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    await expect(loadSsrBoot()).resolves.toMatchObject({
      issue: 'unknown',
      hasRefreshTokenCookie: true,
    })
    expect(timeout).toHaveBeenCalledWith(2000)
    expect(JSON.parse(String(log.mock.calls[0]?.[0]))).toMatchObject({ cause: 'timeout' })
  })

  it('falls back when Hono returns a non-success status', async () => {
    getRequestHeader.mockReturnValue('refresh_token=opaque-token')
    vi.mocked(fetch).mockResolvedValue(new Response('unavailable', { status: 503 }))
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    await expect(loadSsrBoot()).resolves.toMatchObject({ issue: 'unknown' })
    expect(JSON.parse(String(log.mock.calls[0]?.[0]))).toMatchObject({ cause: 'http_error' })
  })

  it('falls back when the boot payload is unusable', async () => {
    getRequestHeader.mockReturnValue('refresh_token=opaque-token')
    vi.mocked(fetch).mockResolvedValue(
      Response.json({ success: true, data: { session: { authenticated: true } } })
    )
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    await expect(loadSsrBoot()).resolves.toMatchObject({ issue: 'unknown' })
    expect(JSON.parse(String(log.mock.calls[0]?.[0]))).toMatchObject({
      cause: 'invalid_response',
    })
  })
})

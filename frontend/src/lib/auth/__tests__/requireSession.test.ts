import type { UserPublic } from '@aurore/shared'

import { QueryClient } from '@tanstack/react-query'
import { isRedirect } from '@tanstack/react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  anonymousTestSession,
  presentTestSession,
  resetTestAuthStore,
  restoringTestSession,
} from '../../../test/authSession'
import { readBearerForTransport } from '../credential'
import { markHydrationSettled, markHydrationStarted } from '../hydrationGate'
import { installSession, readClientSession } from '../session'

const validationServer = vi.hoisted(() => ({
  validate: vi.fn(async (viewerId: string | null) => ({
    authenticated: true as const,
    userId: viewerId ?? '',
    role: 'user' as const,
  })),
}))

// Partial mock: keep the real isExpired (drives the local-token branch), stub only the network refresh.
vi.mock('../freshness', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../freshness')>()),
  ensureFresh: vi.fn(),
}))

vi.mock('../../queries/auth', () => ({
  authQueries: {
    validation: (viewerId: string | null) => ({
      queryKey: ['auth', 'credential-validation', viewerId],
      queryFn: () => validationServer.validate(viewerId),
    }),
  },
}))

import { ensureFresh } from '../freshness'
import { requireRole, requireSession } from '../requireSession'

const mockEnsureFresh = vi.mocked(ensureFresh)

const USER = {
  id: 'u1',
  email: 'a@b.com',
  createdAt: '2026-01-01T00:00:00.000Z',
  emailVerified: true,
  role: 'user',
  isDemo: false,
} satisfies UserPublic

const ADMIN = {
  ...USER,
  id: 'admin-1',
  email: 'admin@example.com',
  role: 'admin',
} satisfies UserPublic

const REPLACEMENT = {
  ...USER,
  id: 'u2',
  email: 'replacement@example.com',
} satisfies UserPublic

function resetValidationServer(): void {
  validationServer.validate.mockReset()
  validationServer.validate.mockImplementation(async (viewerId) => ({
    authenticated: true,
    userId: viewerId ?? '',
    role: 'user',
  }))
}

async function captureRedirect(run: Promise<unknown>) {
  try {
    await run
  } catch (error) {
    if (isRedirect(error)) return error
    throw error
  }

  throw new Error('Expected a TanStack Router redirect')
}

function createAccessToken(expiresInMs = 3_600_000): string {
  const expiresAt = Date.now() + expiresInMs
  return `h.${btoa(JSON.stringify({ exp: Math.floor(expiresAt / 1000) }))}.s`
}

function setAuthenticated(user: UserPublic = USER, expiresInMs = 3_600_000): string {
  const token = createAccessToken(expiresInMs)
  const expiresAt = Date.now() + expiresInMs
  resetTestAuthStore(presentTestSession(user, token, expiresAt))
  return token
}

describe('requireSession', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    resetTestAuthStore()
    mockEnsureFresh.mockReset()
    resetValidationServer()
  })

  afterEach(() => {
    queryClient.clear()
  })

  it('returns the live authenticated session without router context', async () => {
    setAuthenticated()

    await expect(
      requireSession({
        queryClient,
        href: '/dashboard',
      })
    ).resolves.toMatchObject({
      status: 'authenticated',
      credential: 'present',
      user: { id: 'u1' },
    })

    expect(mockEnsureFresh).not.toHaveBeenCalled()
  })

  it('attempts silent refresh when no token exists', async () => {
    mockEnsureFresh.mockImplementation(async () => {
      setAuthenticated()
      return 'ok'
    })

    await expect(
      requireSession({
        queryClient,
        href: '/dashboard',
      })
    ).resolves.toMatchObject({ status: 'authenticated' })

    expect(mockEnsureFresh).toHaveBeenCalledWith(queryClient)
  })

  it('redirects an SSR-confirmed anonymous session without probing refresh', async () => {
    resetTestAuthStore(anonymousTestSession())

    try {
      await requireSession({ queryClient, href: '/collection' })
      expect.unreachable('should have thrown redirect')
    } catch {
      expect(readBearerForTransport()).toBeNull()
    }

    expect(mockEnsureFresh).not.toHaveBeenCalled()
  })

  it('redirects to login when no token and refresh fails', async () => {
    mockEnsureFresh.mockResolvedValue('failed')

    try {
      await requireSession({
        queryClient,
        href: '/dashboard',
      })
      expect.unreachable('should have thrown redirect')
    } catch {
      expect(readBearerForTransport()).toBeNull()
    }
  })

  it('removes viewer-scoped queries when a seeded session dies before a protected route', async () => {
    const user = ADMIN
    resetTestAuthStore(restoringTestSession(user))
    queryClient.setQueryData(['profile'], { username: 'Aurore' })
    const productListKey = ['products', 'list', {}, user.id] as const
    queryClient.setQueryData(productListKey, {
      items: [{ id: 'p1', userStatus: 'owned' }],
      total: 1,
    })
    mockEnsureFresh.mockResolvedValue('failed')

    try {
      await requireSession({ queryClient, href: '/collection' })
      expect.unreachable('should have thrown redirect')
    } catch {
      expect(readClientSession()).toEqual({ status: 'anonymous' })
    }

    expect(queryClient.getQueryData(['profile'])).toBeUndefined()
    expect(queryClient.getQueryData(productListKey)).toBeUndefined()
  })

  it("redirects when no token and refresh is in 'cooldown'", async () => {
    mockEnsureFresh.mockResolvedValue('cooldown')

    try {
      await requireSession({ queryClient, href: '/dashboard' })
      expect.unreachable('should have thrown redirect')
    } catch {
      expect(readBearerForTransport()).toBeNull()
    }
  })

  it("does NOT redirect when expired token and refresh is in 'cooldown'", async () => {
    // Expired token + cooldown = possible network blip; keep the user in.
    const expiredToken = setAuthenticated(USER, -60_000)
    mockEnsureFresh.mockResolvedValue('cooldown')

    await expect(requireSession({ queryClient, href: '/dashboard' })).resolves.toMatchObject({
      status: 'authenticated',
      credential: 'present',
    })
    expect(readBearerForTransport()).toBe(expiredToken)
  })

  it('attempts silent refresh when token looks valid but server rejects session', async () => {
    setAuthenticated()

    vi.spyOn(queryClient, 'ensureQueryData').mockRejectedValueOnce(new Error('Unauthorized'))
    mockEnsureFresh.mockResolvedValue('ok')

    await expect(requireSession({ queryClient, href: '/settings' })).resolves.toMatchObject({
      status: 'authenticated',
    })

    expect(mockEnsureFresh).toHaveBeenCalledWith(queryClient)
  })

  it('redirects when token looks valid, server rejects, and refresh fails', async () => {
    setAuthenticated()

    vi.spyOn(queryClient, 'ensureQueryData').mockRejectedValueOnce(new Error('Unauthorized'))
    mockEnsureFresh.mockResolvedValue('failed')

    try {
      await requireSession({ queryClient, href: '/settings' })
      expect.unreachable('should have thrown redirect')
    } catch {
      expect(readBearerForTransport()).toBeNull()
    }
  })

  it("does NOT redirect when server rejects but refresh is in 'cooldown'", async () => {
    setAuthenticated()
    const tokenBefore = readBearerForTransport()

    vi.spyOn(queryClient, 'ensureQueryData').mockRejectedValueOnce(new Error('Unauthorized'))
    mockEnsureFresh.mockResolvedValue('cooldown')

    await expect(requireSession({ queryClient, href: '/settings' })).resolves.toMatchObject({
      status: 'authenticated',
    })
    // User stays logged in through the backoff blip.
    expect(readBearerForTransport()).toBe(tokenBefore)
  })

  it('attempts refresh when token is expired', async () => {
    setAuthenticated(USER, -60_000)

    mockEnsureFresh.mockResolvedValue('ok')

    await expect(requireSession({ queryClient, href: '/profile' })).resolves.toMatchObject({
      status: 'authenticated',
    })

    expect(mockEnsureFresh).toHaveBeenCalledWith(queryClient)
  })

  it('returns a login that replaces the session during validation', async () => {
    setAuthenticated()
    let finishValidation: (value: Awaited<ReturnType<typeof validationServer.validate>>) => void =
      () => undefined
    validationServer.validate.mockReturnValueOnce(
      new Promise((resolve) => {
        finishValidation = resolve
      })
    )
    const requiredSession = requireSession({ queryClient, href: '/settings' })
    const replacementToken = createAccessToken()

    installSession(queryClient, { accessToken: replacementToken, user: REPLACEMENT })
    finishValidation({ authenticated: true, userId: 'u1', role: 'user' })

    await expect(requiredSession).resolves.toMatchObject({ user: REPLACEMENT })
  })

  it('keeps a login completed while refresh failure was pending', async () => {
    setAuthenticated(USER, -60_000)
    let finishRefresh: (result: 'failed') => void = () => undefined
    mockEnsureFresh.mockReturnValue(
      new Promise((resolve) => {
        finishRefresh = resolve
      })
    )
    const requiredSession = requireSession({ queryClient, href: '/settings' })
    const replacementToken = createAccessToken()

    installSession(queryClient, { accessToken: replacementToken, user: REPLACEMENT })
    finishRefresh('failed')

    await expect(requiredSession).resolves.toMatchObject({ user: REPLACEMENT })
  })
})

describe('requireRole', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    resetTestAuthStore()
    mockEnsureFresh.mockReset()
    resetValidationServer()
  })

  afterEach(() => {
    queryClient.clear()
  })

  it('restores a seeded admin before checking the role', async () => {
    resetTestAuthStore(restoringTestSession(ADMIN))
    mockEnsureFresh.mockImplementation(async () => {
      installSession(queryClient, { accessToken: createAccessToken(), user: ADMIN })
      return 'ok'
    })

    await expect(
      requireRole({
        queryClient,
        href: '/admin',
        allowedRoles: ['admin'],
      })
    ).resolves.toMatchObject({
      status: 'authenticated',
      credential: 'present',
      user: { id: ADMIN.id, role: 'admin' },
    })

    expect(mockEnsureFresh).toHaveBeenCalledWith(queryClient)
  })

  it('checks a fresh credential against the local session role', async () => {
    setAuthenticated(ADMIN)
    const ensureQueryData = vi.spyOn(queryClient, 'ensureQueryData')

    await expect(
      requireRole({
        queryClient,
        href: '/admin',
        allowedRoles: ['admin'],
      })
    ).resolves.toMatchObject({ user: { id: ADMIN.id, role: 'admin' } })

    expect(mockEnsureFresh).not.toHaveBeenCalled()
    expect(ensureQueryData).not.toHaveBeenCalled()
  })

  it('refuses a privileged surface during refresh cooldown', async () => {
    setAuthenticated(ADMIN, -60_000)
    queryClient.setQueryData(['profile', 'me'], { username: 'Admin' })
    mockEnsureFresh.mockResolvedValue('cooldown')

    const refusal = await captureRedirect(
      requireRole({
        queryClient,
        href: '/admin?tab=users',
        allowedRoles: ['admin'],
      })
    )

    expect(refusal.options).toMatchObject({
      to: '/auth/login',
      search: { redirect: '/admin?tab=users' },
    })
    expect(readClientSession()).toEqual({ status: 'anonymous' })
    expect(queryClient.getQueryData(['profile', 'me'])).toBeUndefined()
  })

  it('redirects to login when credential restoration fails', async () => {
    resetTestAuthStore(restoringTestSession(ADMIN))
    mockEnsureFresh.mockResolvedValue('failed')

    const refusal = await captureRedirect(
      requireRole({
        queryClient,
        href: '/admin',
        allowedRoles: ['admin'],
      })
    )

    expect(refusal.options).toMatchObject({
      to: '/auth/login',
      search: { redirect: '/admin' },
    })
    expect(readClientSession()).toEqual({ status: 'anonymous' })
  })

  it('redirects a contributor to its configured fallback without ending the session', async () => {
    const contributor = {
      id: 'contributor-1',
      email: 'contributor@example.com',
      createdAt: '2026-01-01T00:00:00.000Z',
      emailVerified: true,
      role: 'contributor',
      isDemo: false,
    } satisfies UserPublic
    setAuthenticated(contributor)
    queryClient.setQueryData(['profile', 'me'], { username: 'Moderator' })

    const refusal = await captureRedirect(
      requireRole({
        queryClient,
        href: '/admin/users',
        allowedRoles: ['admin'],
        fallbackFor: { contributor: '/admin/reports' },
      })
    )

    expect(refusal.options).toMatchObject({ to: '/admin/reports' })
    expect(readClientSession()).toMatchObject({ status: 'authenticated', user: contributor })
    expect(queryClient.getQueryData(['profile', 'me'])).toEqual({ username: 'Moderator' })
    expect(mockEnsureFresh).not.toHaveBeenCalled()
  })

  it('redirects an anonymous session to login without probing refresh', async () => {
    resetTestAuthStore(anonymousTestSession())

    const refusal = await captureRedirect(
      requireRole({
        queryClient,
        href: '/blog/admin/new',
        allowedRoles: ['admin'],
      })
    )

    expect(refusal.options).toMatchObject({
      to: '/auth/login',
      search: { redirect: '/blog/admin/new' },
    })
    expect(mockEnsureFresh).not.toHaveBeenCalled()
  })

  it('joins the boot probe before checking a pending role', async () => {
    mockEnsureFresh.mockImplementation(async () => {
      installSession(queryClient, { accessToken: createAccessToken(), user: ADMIN })
      return 'ok'
    })

    await expect(
      requireRole({
        queryClient,
        href: '/admin',
        allowedRoles: ['admin'],
      })
    ).resolves.toMatchObject({ user: { id: ADMIN.id, role: 'admin' } })

    expect(mockEnsureFresh).toHaveBeenCalledWith(queryClient)
  })

  it('redirects to login when a successful probe produces no identity', async () => {
    mockEnsureFresh.mockResolvedValue('ok')

    const refusal = await captureRedirect(
      requireRole({
        queryClient,
        href: '/admin',
        allowedRoles: ['admin'],
      })
    )

    expect(refusal.options).toMatchObject({
      to: '/auth/login',
      search: { redirect: '/admin' },
    })
  })
})

describe('requireSession while the document hydrates', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient()
    resetTestAuthStore(anonymousTestSession())
    mockEnsureFresh.mockReset()
  })

  afterEach(() => {
    markHydrationSettled()
    queryClient.clear()
  })

  // A router redirect mid-hydration reconciles the login shell against the guarded
  // route's server markup (React #418): the guard leaves the document instead.
  it('leaves the document instead of throwing a router redirect', async () => {
    const replace = vi.spyOn(window.location, 'replace').mockImplementation(() => {})
    markHydrationStarted()
    let settled = false
    const done = () => {
      settled = true
    }
    requireSession({ queryClient, href: '/collection' }).then(done, done)

    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(replace).toHaveBeenCalledWith('/auth/login?redirect=%2Fcollection')
    expect(settled).toBe(false)
    replace.mockRestore()
  })

  it('throws the router redirect once hydration has settled', async () => {
    markHydrationStarted()
    markHydrationSettled()
    const redirect = await captureRedirect(requireSession({ queryClient, href: '/collection' }))
    expect(redirect.options.to).toBe('/auth/login')
  })
})

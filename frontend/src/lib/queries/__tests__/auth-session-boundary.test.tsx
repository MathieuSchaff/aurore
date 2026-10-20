import type { UserPublic } from '@aurore/shared'

import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw/http'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LoginPage } from '@/features/auth/page/LoginPage/LoginPage'
import type { ApiData, api } from '@/lib/api'
import { __resetFreshness } from '@/lib/auth/freshness'
import { requireSession } from '@/lib/auth/requireSession'
import { installSession, readClientSession } from '@/lib/auth/session'
import { authQueries, useLogin, useLogout } from '@/lib/queries/auth'
import { resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders, renderWithProviders } from '@/test/utils'

const NEXT_USER = {
  id: 'user-2',
  email: 'next@example.com',
  createdAt: '2026-08-21T06:00:00.000Z',
  emailVerified: true,
  role: 'user',
  isDemo: false,
} satisfies UserPublic

const CREDENTIAL_VALIDATION = {
  authenticated: true,
  userId: NEXT_USER.id,
  role: NEXT_USER.role,
} satisfies ApiData<typeof api.auth.session.$get>

function freshAccessToken(): string {
  return `h.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))}.s`
}

describe('auth session boundary', () => {
  beforeEach(() => {
    __resetFreshness()
    resetTestAuthStore()
  })

  it.each([
    ['authenticated', 200],
    ['authenticated', 401],
    ['pending', 401],
  ] as const)(
    'preserves a replacement session after logout from %s returns %s',
    async (initial, status) => {
      const started = Promise.withResolvers<void>()
      const release = Promise.withResolvers<void>()
      server.use(
        http.post('*/api/auth/logout', async () => {
          started.resolve()
          await release.promise
          return HttpResponse.json(
            status === 200
              ? { success: true, data: null }
              : { success: false, error: 'unauthorized' },
            { status }
          )
        })
      )
      const queryClient = createTestQueryClient()
      if (initial === 'authenticated') {
        installSession(queryClient, { accessToken: freshAccessToken(), user: NEXT_USER })
      }
      const { result } = renderHookWithProviders(() => useLogout(), { queryClient })
      const replacement = {
        ...NEXT_USER,
        id: 'user-3',
        email: 'replacement@example.test',
      } satisfies UserPublic
      const privateKey = ['profile', 'me']
      queryClient.setQueryDefaults(privateKey, { gcTime: Infinity })
      let pendingLogout: Promise<unknown>
      await act(async () => {
        pendingLogout = result.current.mutateAsync()
        await started.promise
        installSession(queryClient, { accessToken: freshAccessToken(), user: replacement })
        queryClient.setQueryData(privateKey, { username: 'Replacement account' })
        release.resolve()
        await pendingLogout
      })

      // The old response cannot own the session installed while logout was in flight
      expect(readClientSession()).toMatchObject({ status: 'authenticated', user: replacement })
      expect(queryClient.getQueryData(privateKey)).toEqual({ username: 'Replacement account' })
    }
  )

  it('finishes logout and navigates when its 401 recovery already ended the session', async () => {
    server.use(
      http.post('*/api/auth/logout', () =>
        HttpResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
      ),
      http.post('*/api/auth/refresh', () =>
        HttpResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
      )
    )
    const queryClient = createTestQueryClient()
    installSession(queryClient, { accessToken: freshAccessToken(), user: NEXT_USER })
    const privateKey = ['profile', 'me']
    queryClient.setQueryDefaults(privateKey, { gcTime: Infinity })
    queryClient.setQueryData(privateKey, { username: 'Expired account' })
    const onLoggedOut = vi.fn()
    const { result } = renderHookWithProviders(() => useLogout(onLoggedOut), { queryClient })

    await act(() => result.current.mutateAsync())

    expect(readClientSession()).toEqual({ status: 'anonymous' })
    expect(queryClient.getQueryData(privateKey)).toBeUndefined()
    expect(onLoggedOut).toHaveBeenCalledOnce()
  })

  it.each(['server', 'network'])(
    'keeps the session and cache when logout fails on the %s',
    async (failure) => {
      server.use(
        http.post('*/api/auth/logout', () =>
          failure === 'network'
            ? HttpResponse.error()
            : HttpResponse.json({ success: false, error: 'server_error' }, { status: 500 })
        )
      )
      const queryClient = createTestQueryClient()
      installSession(queryClient, { accessToken: freshAccessToken(), user: NEXT_USER })
      const privateKey = ['profile', 'me']
      queryClient.setQueryDefaults(privateKey, { gcTime: Infinity })
      queryClient.setQueryData(privateKey, { username: 'Still connected' })
      const { result } = renderHookWithProviders(() => useLogout(), { queryClient })

      await act(async () => {
        await expect(result.current.mutateAsync()).rejects.toThrow()
      })

      // Clearing on failure leaves a valid refresh cookie behind a logged out screen
      expect(readClientSession()).toMatchObject({ status: 'authenticated', user: NEXT_USER })
      expect(queryClient.getQueryData(privateKey)).toEqual({ username: 'Still connected' })
    }
  )

  it('drops catalogue data owned by the previous session before storing the new account', async () => {
    server.use(
      http.post('*/api/auth/login', () =>
        HttpResponse.json({
          success: true,
          data: { accessToken: freshAccessToken(), user: NEXT_USER },
        })
      )
    )
    const queryClient = createTestQueryClient()
    const hiddenProductKey = ['products', 'hidden-product'] as const
    const hiddenIngredientKey = ['ingredients', 'hidden-ingredient'] as const
    const publicArticleKey = ['articles', 'list', {}] as const
    // Unobserved fixtures must survive the request to test session cleanup, not GC
    queryClient.setDefaultOptions({ queries: { retry: false, gcTime: Infinity } })
    queryClient.setQueryData(hiddenProductKey, { moderationStatus: 'hidden' })
    queryClient.setQueryData(hiddenIngredientKey, { moderationStatus: 'hidden' })
    queryClient.setQueryData(publicArticleKey, { title: 'Public' })
    const { result } = renderHookWithProviders(() => useLogin(), { queryClient })

    await act(() => result.current.mutateAsync({ email: NEXT_USER.email, password: 'password' }))

    expect(queryClient.getQueryData(hiddenProductKey)).toBeUndefined()
    expect(queryClient.getQueryData(hiddenIngredientKey)).toBeUndefined()
    expect(queryClient.getQueryData(publicArticleKey)).toEqual({ title: 'Public' })
    expect(readClientSession()).toMatchObject({ status: 'authenticated', user: NEXT_USER })
  })

  it('keeps the live identity intact when credential validation refetches', async () => {
    let sessionReads = 0
    server.use(
      http.get('*/api/auth/session', () => {
        sessionReads++
        return HttpResponse.json({
          success: true,
          data: CREDENTIAL_VALIDATION,
        })
      })
    )
    const queryClient = createTestQueryClient()
    installSession(queryClient, { accessToken: freshAccessToken(), user: NEXT_USER })
    await queryClient.invalidateQueries({
      queryKey: authQueries.validation(NEXT_USER.id).queryKey,
      exact: true,
    })

    await queryClient.fetchQuery(authQueries.validation(NEXT_USER.id))

    expect(sessionReads).toBe(1)
    expect(readClientSession()).toMatchObject({
      status: 'authenticated',
      user: NEXT_USER,
    })
  })

  it('keeps the existing request count when a fresh credential reaches the route guard', async () => {
    let sessionReads = 0
    server.use(
      http.get('*/api/auth/session', () => {
        sessionReads++
        return HttpResponse.json({
          success: true,
          data: CREDENTIAL_VALIDATION,
        })
      })
    )
    const queryClient = createTestQueryClient()
    const accessToken = freshAccessToken()
    installSession(queryClient, { accessToken, user: NEXT_USER })

    await requireSession({ queryClient, href: '/collection' })

    expect(sessionReads).toBe(0)
  })

  it('does not validate credentials again after login succeeds', async () => {
    let sessionReads = 0
    server.use(
      http.post('*/api/auth/login', () =>
        HttpResponse.json({
          success: true,
          data: { accessToken: freshAccessToken(), user: NEXT_USER },
        })
      ),
      http.get('*/api/auth/session', () => {
        sessionReads++
        return HttpResponse.json({
          success: true,
          data: CREDENTIAL_VALIDATION,
        })
      })
    )
    const queryClient = createTestQueryClient()
    renderWithProviders(<LoginPage />, { queryClient })
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/^Email$/), NEXT_USER.email)
    await user.type(screen.getByLabelText(/^Mot de passe$/), 'Abcdef12!')
    await user.click(screen.getByRole('button', { name: /^Se connecter$/ }))
    await waitFor(() =>
      expect(readClientSession()).toMatchObject({ status: 'authenticated', user: NEXT_USER })
    )
    await requireSession({ queryClient, href: '/collection' })

    expect(sessionReads).toBe(0)
  })
})

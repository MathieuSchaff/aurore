import type { UserPublic } from '@aurore/shared'

import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { LoginPage } from '@/features/auth/page/LoginPage/LoginPage'
import type { ApiData, api } from '@/lib/api'
import { requireSession } from '@/lib/auth/requireSession'
import { installSession, readClientSession } from '@/lib/auth/session'
import { authQueries, useLogin } from '@/lib/queries/auth'
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
    resetTestAuthStore()
  })

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
    const publicArticleKey = ['articles', 'public-article'] as const
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

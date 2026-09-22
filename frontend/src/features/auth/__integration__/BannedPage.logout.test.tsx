import type { UserPublic } from '@aurore/shared'

import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BannedPage } from '@/features/auth/page/BannedPage/BannedPage'
import { readClientSession, recordBan } from '@/lib/auth/session'
import { useAuthStore } from '@/store/auth'
import { anonymousTestSession, presentTestSession, resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'

vi.unmock('@tanstack/react-router')

const USER = {
  id: 'banned-user',
  email: 'banned@example.test',
  createdAt: '2026-08-27T00:00:00.000Z',
  emailVerified: true,
  role: 'user',
  isDemo: false,
} satisfies UserPublic

function renderBannedPage(queryClient = createTestQueryClient()) {
  const rootRoute = createRootRoute({ component: Outlet })
  const bannedRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auth/banned',
    component: BannedPage,
  })
  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auth/login',
    component: () => <h1>Connexion</h1>,
  })
  const forgotPasswordRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auth/forgot-password',
    component: () => <h1>Réinitialisation du mot de passe</h1>,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([bannedRoute, loginRoute, forgotPasswordRoute]),
    history: createMemoryHistory({ initialEntries: ['/auth/banned'] }),
  })
  const view = renderWithProviders(<RouterProvider router={router} />, { queryClient })
  return { router, queryClient, view }
}

describe('BannedPage logout', () => {
  beforeEach(() => {
    resetTestAuthStore(presentTestSession(USER, 'banned-token'))
  })

  it('ends the session and returns to login', async () => {
    let authorization: string | null = null
    server.use(
      http.post('*/api/auth/logout', ({ request }) => {
        authorization = request.headers.get('authorization')
        return HttpResponse.json({ success: true, data: null })
      })
    )
    const { router, queryClient, view } = renderBannedPage()
    const user = userEvent.setup()

    try {
      await user.click(await screen.findByRole('button', { name: /se déconnecter/i }))

      await screen.findByRole('heading', { name: /^connexion$/i })
      expect(router.state.location.pathname).toBe('/auth/login')
      expect(authorization).toBe('Bearer banned-token')
      expect(readClientSession()).toEqual({ status: 'anonymous' })
    } finally {
      view.unmount()
      queryClient.clear()
    }
  })

  it('clears the ban signal when logout fails without a session', async () => {
    resetTestAuthStore(anonymousTestSession())
    const queryClient = createTestQueryClient()
    recordBan(queryClient, {
      expiresAt: null,
      reason: 'Compte suspendu',
      scope: 'global',
    })
    server.use(
      http.post('*/api/auth/logout', () =>
        HttpResponse.json({ success: false, error: 'unauthorized' }, { status: 401 })
      )
    )
    const { router, view } = renderBannedPage(queryClient)
    const user = userEvent.setup()

    try {
      await user.click(await screen.findByRole('button', { name: /se déconnecter/i }))

      await screen.findByRole('heading', { name: /^connexion$/i })
      expect(router.state.location.pathname).toBe('/auth/login')
      expect(useAuthStore.getState().bannedDetails).toBeNull()
      expect(readClientSession()).toEqual({ status: 'anonymous' })
    } finally {
      view.unmount()
      queryClient.clear()
    }
  })
})

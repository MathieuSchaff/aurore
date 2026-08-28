import type { UserPublic } from '@aurore/shared'

import { useSearch } from '@tanstack/react-router'
import { screen, waitFor } from '@testing-library/react'
import { toast } from 'react-hot-toast'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GoogleCallbackPage } from '@/features/auth/page/GoogleCallbackPage/GoogleCallbackPage'
import { ensureFresh } from '@/lib/auth/freshness'
import { anonymousTestSession, presentTestSession, resetTestAuthStore } from '@/test/authSession'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }))

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useNavigate: () => navigateMock,
  useSearch: vi.fn(),
}))

vi.mock('react-hot-toast', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}))

vi.mock('@/lib/auth/freshness', () => ({ ensureFresh: vi.fn() }))

const USER = {
  id: 'google-user',
  email: 'google@example.test',
  createdAt: '2026-08-27T00:00:00.000Z',
  emailVerified: true,
  role: 'user',
  isDemo: false,
} satisfies UserPublic

describe('GoogleCallbackPage', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    vi.mocked(useSearch).mockReset()
    vi.mocked(useSearch).mockReturnValue({ oauth: true })
    vi.mocked(ensureFresh).mockReset()
    vi.mocked(ensureFresh).mockResolvedValue('failed')
    vi.mocked(toast.error).mockReset()
    resetTestAuthStore(anonymousTestSession())
  })

  it('shows progress while completing the callback', () => {
    renderWithProviders(<GoogleCallbackPage />)

    expect(screen.getByText('Connexion en cours…')).toBeVisible()
  })

  it('uses an existing credential without refreshing', async () => {
    resetTestAuthStore(presentTestSession(USER))
    renderWithProviders(<GoogleCallbackPage />)

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({ to: '/collection', replace: true })
    })
    expect(ensureFresh).not.toHaveBeenCalled()
  })

  it('returns a failed backend callback to login without refreshing', async () => {
    vi.mocked(useSearch).mockReturnValue({ oauth: undefined })
    renderWithProviders(<GoogleCallbackPage />)

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({
        to: '/auth/login',
        search: { redirect: undefined },
        replace: true,
      })
    })
    expect(ensureFresh).not.toHaveBeenCalled()
  })

  it('refreshes the cookie-backed session before entering the app', async () => {
    vi.mocked(ensureFresh).mockResolvedValue('ok')
    const queryClient = createTestQueryClient()
    renderWithProviders(<GoogleCallbackPage />, { queryClient })

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({ to: '/collection', replace: true })
    })
    expect(ensureFresh).toHaveBeenCalledWith(queryClient)
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('reports a failed refresh before returning to login', async () => {
    renderWithProviders(<GoogleCallbackPage />)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Connexion Google échouée, veuillez réessayer')
    })
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/auth/login',
      search: { redirect: undefined },
      replace: true,
    })
  })

  it('accepts a credential installed by a concurrent refresh', async () => {
    vi.mocked(ensureFresh).mockImplementation(async () => {
      resetTestAuthStore(presentTestSession(USER))
      return 'superseded'
    })
    renderWithProviders(<GoogleCallbackPage />)

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({ to: '/collection', replace: true })
    })
    expect(toast.error).not.toHaveBeenCalled()
  })
})

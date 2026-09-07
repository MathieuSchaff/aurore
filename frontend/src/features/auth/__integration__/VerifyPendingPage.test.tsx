import type { UserPublic } from '@aurore/shared'

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { toast } from 'react-hot-toast'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { VerifyPendingPage } from '@/features/auth/page/VerifyPendingPage/VerifyPendingPage'
import { anonymousTestSession, presentTestSession, resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'

vi.mock('react-hot-toast', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}))

const USER = {
  id: 'pending-user',
  email: 'pending@example.test',
  createdAt: '2026-08-27T00:00:00.000Z',
  emailVerified: false,
  role: 'user',
  isDemo: false,
} satisfies UserPublic

describe('VerifyPendingPage', () => {
  beforeEach(() => {
    resetTestAuthStore(anonymousTestSession())
    vi.mocked(toast.success).mockReset()
    vi.mocked(toast.error).mockReset()
  })

  it('keeps the anonymous signup response neutral and hides resend', () => {
    renderWithProviders(<VerifyPendingPage />)

    expect(screen.getByText(/Si un compte peut être créé avec cette adresse/)).toBeVisible()
    expect(screen.queryByRole('button', { name: "Renvoyer l'email" })).not.toBeInTheDocument()
  })

  it('shows resend only when a credential identifies the account', () => {
    resetTestAuthStore(presentTestSession(USER))
    renderWithProviders(<VerifyPendingPage />)

    expect(screen.getByText(/Un lien de vérification vous a été envoyé/)).toBeVisible()
    expect(screen.getByRole('button', { name: "Renvoyer l'email" })).toBeVisible()
  })

  it('resends through the authenticated endpoint and confirms success', async () => {
    resetTestAuthStore(presentTestSession(USER, 'pending-token'))
    let authorization: string | null = null
    server.use(
      http.post('*/api/auth/resend-verification', ({ request }) => {
        authorization = request.headers.get('authorization')
        return HttpResponse.json({ success: true, data: null })
      })
    )
    renderWithProviders(<VerifyPendingPage />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: "Renvoyer l'email" }))

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Email envoyé ! Vérifiez votre boîte mail.')
    })
    expect(authorization).toBe('Bearer pending-token')
  })

  it('reports a resend failure', async () => {
    resetTestAuthStore(presentTestSession(USER))
    server.use(
      http.post('*/api/auth/resend-verification', () =>
        HttpResponse.json({ success: false, error: 'server_error' }, { status: 500 })
      )
    )
    renderWithProviders(<VerifyPendingPage />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: "Renvoyer l'email" }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Impossible d'envoyer l'email, réessayez plus tard.")
    })
  })
})

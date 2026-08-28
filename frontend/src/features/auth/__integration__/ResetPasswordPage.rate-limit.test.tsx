import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useNavigate: () => vi.fn(),
  useSearch: () => ({ token: 'reset-token' }),
  Link: ({ children }: { children: React.ReactNode }) => children,
}))

import { ResetPasswordPage } from '../page/ResetPasswordPage/ResetPasswordPage'

describe('ResetPasswordPage rate limit', () => {
  beforeEach(() => {
    resetTestAuthStore()
  })

  it('shows the retry delay returned by the reset-password endpoint', async () => {
    server.use(
      http.post('*/api/auth/reset-password', () =>
        HttpResponse.json(
          {
            success: false,
            error: 'too_many_requests',
            details: { retryAfter: '720' },
          },
          { status: 429 }
        )
      )
    )
    renderWithProviders(<ResetPasswordPage />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/^Nouveau mot de passe$/), 'Abcdef12!')
    await user.type(screen.getByLabelText(/Confirmer le mot de passe/), 'Abcdef12!')
    await user.click(screen.getByRole('button', { name: /Réinitialiser/ }))

    // A 429 used to fall through to the generic server error and hide the retry delay
    expect(await screen.findByText('Trop de requêtes, réessayez dans 12 min.')).toBeVisible()
  })
})

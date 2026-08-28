import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { LoginPage } from '@/features/auth/page/LoginPage/LoginPage'
import { resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'

describe('LoginPage rate limit', () => {
  beforeEach(() => {
    resetTestAuthStore()
  })

  it('shows the retry delay returned by the login endpoint', async () => {
    server.use(
      http.post('*/api/auth/login', () =>
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
    renderWithProviders(<LoginPage />)
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/^Email$/), 'user@example.com')
    await user.type(screen.getByLabelText(/^Mot de passe$/), 'Abcdef12!')
    await user.click(screen.getByRole('button', { name: /^Se connecter$/ }))

    // A 429 used to fall through to the generic server error and hide the retry delay
    expect(await screen.findByText('Trop de requêtes, réessayez dans 12 min.')).toBeVisible()
  })
})

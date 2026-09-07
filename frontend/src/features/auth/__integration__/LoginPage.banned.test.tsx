import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { LoginPage } from '@/features/auth/page/LoginPage/LoginPage'
import { resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'

describe('LoginPage banned account', () => {
  beforeEach(() => {
    resetTestAuthStore()
  })

  it('does not show a form error when login reports a ban', async () => {
    let loginCalls = 0
    server.use(
      http.post('*/api/auth/login', () => {
        loginCalls++
        return HttpResponse.json(
          {
            success: false,
            error: 'banned',
            details: { expiresAt: null, reason: 'Compte suspendu' },
          },
          { status: 403 }
        )
      })
    )
    const queryClient = createTestQueryClient()
    renderWithProviders(<LoginPage />, { queryClient })
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/^Email$/), 'user@example.com')
    await user.type(screen.getByLabelText(/^Mot de passe$/), 'Abcdef12!')
    await user.click(screen.getByRole('button', { name: /^Se connecter$/ }))
    await waitFor(() => expect(loginCalls).toBe(1))
    await waitFor(() => expect(queryClient.isMutating()).toBe(0))

    // The root ban redirect owns presentation; an inline error used to flash before navigation
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

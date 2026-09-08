import { useSearch } from '@tanstack/react-router'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { toast } from 'react-hot-toast'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { VERIFY_EMAIL_ERRORS } from '@/features/auth/lib/errorMessages'
import { VerifyEmailPage } from '@/features/auth/page/VerifyEmailPage/VerifyEmailPage'
import { anonymousTestSession, resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
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

describe('VerifyEmailPage network states', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    vi.mocked(useSearch).mockReset()
    vi.mocked(useSearch).mockReturnValue({ token: 'verify-token' })
    vi.mocked(toast.success).mockReset()
    resetTestAuthStore(anonymousTestSession())
  })

  it('keeps the verification status visible while the request is pending', async () => {
    let releaseRequest: () => void = () => undefined
    let requestStarted = false
    server.use(
      http.post('*/api/auth/verify-email', async () => {
        requestStarted = true
        await new Promise<void>((resolve) => {
          releaseRequest = resolve
        })
        return HttpResponse.json({ success: true, data: null })
      })
    )
    const queryClient = createTestQueryClient()
    const view = renderWithProviders(<VerifyEmailPage />, { queryClient })

    await waitFor(() => expect(requestStarted).toBe(true))
    expect(screen.getByText('Vérification en cours…')).toBeVisible()

    view.unmount()
    releaseRequest()
    await waitFor(() => expect(queryClient.isMutating()).toBe(0))
  })

  it('shows the generic invalid-link state for another API error', async () => {
    server.use(
      http.post('*/api/auth/verify-email', () =>
        HttpResponse.json({ success: false, error: 'invalid_token' }, { status: 400 })
      )
    )
    renderWithProviders(<VerifyEmailPage />)

    expect(await screen.findByRole('heading', { name: 'Lien invalide' })).toBeVisible()
    expect(screen.getByText(VERIFY_EMAIL_ERRORS.invalid_token)).toBeVisible()
    expect(
      screen.queryByRole('button', { name: 'Demander un nouveau lien' })
    ).not.toBeInTheDocument()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('requests a fresh link with the expired token while anonymous', async () => {
    let resubmittedToken: unknown
    server.use(
      http.post('*/api/auth/verify-email', () =>
        HttpResponse.json({ success: false, error: 'token_expired' }, { status: 400 })
      ),
      http.post('*/api/auth/resend-verification-token', async ({ request }) => {
        resubmittedToken = ((await request.json()) as { token?: unknown }).token
        return HttpResponse.json({ success: true, data: null })
      })
    )
    renderWithProviders(<VerifyEmailPage />)
    const user = userEvent.setup()

    await user.click(await screen.findByRole('button', { name: 'Demander un nouveau lien' }))

    await waitFor(() => expect(resubmittedToken).toBe('verify-token'))
    expect(toast.success).toHaveBeenCalledWith('Email envoyé ! Vérifiez votre boîte mail.')
  })
})

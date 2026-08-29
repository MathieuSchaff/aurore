import type { MutationFunctionContext } from '@tanstack/react-query'
import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { SessionView } from '../../../lib/auth/session'
import { ApiError } from '../../../lib/helpers/apiError'
import { makeErrorMutationResult, makeIdleMutationResult } from '../../../test/mutation'
import { createTestQueryClient, renderWithProviders } from '../../../test/utils'

const { navigateMock, readClientSessionMock, useSearchMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  readClientSessionMock: vi.fn<() => SessionView>(),
  useSearchMock: vi.fn(),
}))

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  useNavigate: () => navigateMock,
  useSearch: () => useSearchMock(),
}))

vi.mock('react-hot-toast', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('../../../lib/queries/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../lib/queries/auth')>()
  return {
    ...actual,
    useVerifyEmail: vi.fn(),
    useResendVerification: () => ({ mutate: vi.fn(), isPending: false }),
  }
})

vi.mock('../../../lib/auth/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../lib/auth/session')>()),
  readClientSession: readClientSessionMock,
}))

import { useVerifyEmail } from '../../../lib/queries/auth'
import { VERIFY_EMAIL_ERRORS } from '../lib/errorMessages'
import { VerifyEmailPage } from '../page/VerifyEmailPage/VerifyEmailPage'

type VerifyMutate = ReturnType<typeof useVerifyEmail>['mutate']

const MUTATION_CONTEXT = {
  client: createTestQueryClient(),
  meta: undefined,
} satisfies MutationFunctionContext

function setVerifyResolves() {
  const mutate = vi.fn<VerifyMutate>((token, options) => {
    options?.onSuccess?.(null, token, undefined, MUTATION_CONTEXT)
  })
  vi.mocked(useVerifyEmail).mockReturnValue(makeIdleMutationResult(mutate))
}

describe('VerifyEmailPage', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    useSearchMock.mockReturnValue({ token: 'tok123' })
    readClientSessionMock.mockReturnValue({ status: 'anonymous' })
    setVerifyResolves()
  })

  it('redirects to login after verifying with no session (ADR 0009)', async () => {
    renderWithProviders(<VerifyEmailPage />)

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({
        to: '/auth/login',
        search: { redirect: undefined },
      })
    })
  })

  it('sends an already-authenticated user (grace period) straight to the app', async () => {
    readClientSessionMock.mockReturnValue({
      status: 'authenticated',
      credential: 'present',
      user: {
        id: 'grace-user',
        email: 'grace@example.test',
        createdAt: '2026-01-01T00:00:00.000Z',
        role: 'user',
        emailVerified: false,
        isDemo: false,
      },
    })
    renderWithProviders(<VerifyEmailPage />)

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith({ to: '/collection' })
    })
  })

  it('shows an invalid-link message and never verifies when the token is missing', () => {
    useSearchMock.mockReturnValue({})
    renderWithProviders(<VerifyEmailPage />)

    expect(screen.getByText(VERIFY_EMAIL_ERRORS.invalid_token)).toBeVisible()
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('shows the expired-link recovery for the matching API code', () => {
    const mutate = vi.fn<VerifyMutate>()
    vi.mocked(useVerifyEmail).mockReturnValue(
      makeErrorMutationResult(mutate, new ApiError('token_expired', 400), 'tok123')
    )

    renderWithProviders(<VerifyEmailPage />)

    expect(screen.getByText(VERIFY_EMAIL_ERRORS.token_expired)).toBeVisible()
    expect(screen.getByRole('button', { name: /Demander un nouveau lien/ })).toBeVisible()
  })
})

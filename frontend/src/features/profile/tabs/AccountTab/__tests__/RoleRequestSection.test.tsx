import type { RoleRequestView } from '@aurore/shared'

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { SessionView } from '@/lib/auth/session'
import { useCancelRoleRequest, useSubmitRoleRequest } from '@/lib/queries/role-requests'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'

const { useSessionMock } = vi.hoisted(() => ({
  useSessionMock: vi.fn<() => SessionView>(),
}))

vi.mock('@/lib/queries/role-requests', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/role-requests')>()
  return { ...actual, useSubmitRoleRequest: vi.fn(), useCancelRoleRequest: vi.fn() }
})

vi.mock('@/lib/auth/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/auth/session')>()),
  useSession: useSessionMock,
}))

import { RoleRequestSection } from '../RoleRequestSection'

// `pending: true` never resolves, which is how the loading branch is exercised now
// that the component runs its real query.
function serveRequest(state: {
  data?: RoleRequestView | null
  canApply?: boolean
  pending?: boolean
  fails?: boolean
}) {
  server.use(
    http.get('*/api/role-requests/me', async () => {
      if (state.pending) await delay('infinite')
      if (state.fails) return new HttpResponse(null, { status: 500 })
      const latest = state.data ?? null
      const canApply = state.canApply ?? latest?.status !== 'pending'
      return HttpResponse.json({ success: true, data: { latest, canApply } })
    })
  )
}

function setMutations() {
  const submit = vi.fn()
  const cancel = vi.fn()
  vi.mocked(useSubmitRoleRequest).mockReturnValue({
    mutate: submit,
    isPending: false,
    isError: false,
    error: null,
  } as unknown as ReturnType<typeof useSubmitRoleRequest>)
  vi.mocked(useCancelRoleRequest).mockReturnValue({
    mutate: cancel,
    isPending: false,
    isError: false,
  } as unknown as ReturnType<typeof useCancelRoleRequest>)
  return { submit, cancel }
}

function makeRequest(overrides: Partial<RoleRequestView>): RoleRequestView {
  return {
    id: 'req-1',
    userId: 'usr-1',
    motivation: 'Une motivation suffisante pour aider.',
    motivationLink: null,
    status: 'pending',
    rejectionReason: null,
    reviewedBy: null,
    reviewedAt: null,
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
    ...overrides,
  }
}

function setSessionRole(role: 'user' | 'contributor') {
  useSessionMock.mockReturnValue({
    status: 'authenticated',
    credential: 'present',
    user: {
      id: `${role}-id`,
      email: `${role}@example.test`,
      createdAt: '2026-01-01T00:00:00.000Z',
      role,
      emailVerified: true,
      isDemo: false,
    },
  })
}

describe('RoleRequestSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setMutations()
    setSessionRole('user')
  })

  it('renders nothing for a non-user role', async () => {
    setSessionRole('contributor')
    serveRequest({ data: null })
    renderWithProviders(<RoleRequestSection />)

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Devenir modérateur' })).not.toBeInTheDocument()
    )
  })

  it('shows a loading hint while fetching', async () => {
    setSessionRole('user')
    serveRequest({ pending: true })
    renderWithProviders(<RoleRequestSection />)

    expect(await screen.findByText('Chargement…')).toBeInTheDocument()
  })

  it('shows a recoverable message (not the form) when the load fails', async () => {
    setSessionRole('user')
    serveRequest({ fails: true })
    renderWithProviders(<RoleRequestSection />)

    expect(await screen.findByText(/Impossible de charger l'état/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Envoyer la demande' })).not.toBeInTheDocument()
  })

  it('shows the pending state with a working cancel button', async () => {
    setSessionRole('user')
    serveRequest({ data: makeRequest({ status: 'pending' }) })
    const { cancel } = setMutations()
    renderWithProviders(<RoleRequestSection />)

    expect(await screen.findByText(/en attente/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Annuler ma demande' }))
    expect(cancel).toHaveBeenCalledWith('req-1')
  })

  it('shows the welcome message when the latest request is approved and the server still blocks a new one', async () => {
    setSessionRole('user')
    serveRequest({ data: makeRequest({ status: 'approved' }), canApply: false })
    renderWithProviders(<RoleRequestSection />)

    expect(await screen.findByText(/Votre demande a été acceptée/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Je veux contribuer' })).not.toBeInTheDocument()
  })

  it('offers the opt-in again when an approved request belongs to a demoted account', async () => {
    setSessionRole('user')
    serveRequest({ data: makeRequest({ status: 'approved' }), canApply: true })
    renderWithProviders(<RoleRequestSection />)

    expect(await screen.findByRole('button', { name: 'Je veux contribuer' })).toBeInTheDocument()
    expect(screen.queryByText(/Votre demande a été acceptée/)).not.toBeInTheDocument()
  })

  it('shows the rejection reason above the resubmit form when rejected', async () => {
    setSessionRole('user')
    serveRequest({
      data: makeRequest({ status: 'rejected', rejectionReason: 'Trop peu de détails.' }),
    })
    renderWithProviders(<RoleRequestSection />)

    expect(await screen.findByText(/Trop peu de détails/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Envoyer la demande' })).toBeInTheDocument()
  })

  it('keeps the form behind an opt-in for a first-time user, then reveals it', async () => {
    setSessionRole('user')
    serveRequest({ data: null })
    renderWithProviders(<RoleRequestSection />)

    // Collapsed by default: just the opt-in, no standing form.
    const optIn = await screen.findByRole('button', { name: 'Je veux contribuer' })
    expect(screen.queryByLabelText(/Votre motivation/)).not.toBeInTheDocument()

    await userEvent.click(optIn)

    expect(screen.getByLabelText(/Votre motivation/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Envoyer la demande' })).toBeInTheDocument()
  })

  it('disables submit below the 10-char minimum and enables it at the boundary', async () => {
    setSessionRole('user')
    serveRequest({ data: null })
    const { submit } = setMutations()
    renderWithProviders(<RoleRequestSection />)

    await userEvent.click(await screen.findByRole('button', { name: 'Je veux contribuer' }))
    const textarea = screen.getByLabelText(/Votre motivation/)
    const submitBtn = screen.getByRole('button', { name: 'Envoyer la demande' })

    await userEvent.type(textarea, '123456789') // 9 chars
    expect(submitBtn).toBeDisabled()

    await userEvent.type(textarea, '0') // 10 chars
    expect(submitBtn).toBeEnabled()

    await userEvent.click(submitBtn)
    await waitFor(() => {
      expect(submit).toHaveBeenCalledWith(
        { motivation: '1234567890' },
        expect.objectContaining({ onSuccess: expect.any(Function) })
      )
    })
  })
})

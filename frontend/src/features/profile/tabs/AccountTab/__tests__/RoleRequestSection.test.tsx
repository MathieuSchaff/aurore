import type { RoleRequestView } from '@aurore/shared'

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCancelRoleRequest, useSubmitRoleRequest } from '@/lib/queries/role-requests'
import { useAuthStore } from '@/store/auth'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'

vi.mock('@/lib/queries/role-requests', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/role-requests')>()
  return { ...actual, useSubmitRoleRequest: vi.fn(), useCancelRoleRequest: vi.fn() }
})

import { RoleRequestSection } from '../RoleRequestSection'

// `pending: true` never resolves, which is how the loading branch is exercised now
// that the component runs its real query.
function serveRequest(state: {
  data?: RoleRequestView | null
  pending?: boolean
  fails?: boolean
}) {
  server.use(
    http.get('*/api/role-requests/me', async () => {
      if (state.pending) await delay('infinite')
      if (state.fails) return new HttpResponse(null, { status: 500 })
      return HttpResponse.json({ success: true, data: state.data ?? null })
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

describe('RoleRequestSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setMutations()
    useAuthStore.setState({ role: 'user' })
  })

  it('renders nothing for a non-user role', async () => {
    useAuthStore.setState({ role: 'contributor' })
    serveRequest({ data: null })
    renderWithProviders(<RoleRequestSection />)

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Devenir modérateur' })).not.toBeInTheDocument()
    )
  })

  it('shows a loading hint while fetching', async () => {
    useAuthStore.setState({ role: 'user' })
    serveRequest({ pending: true })
    renderWithProviders(<RoleRequestSection />)

    expect(await screen.findByText('Chargement…')).toBeInTheDocument()
  })

  it('shows a recoverable message (not the form) when the load fails', async () => {
    useAuthStore.setState({ role: 'user' })
    serveRequest({ fails: true })
    renderWithProviders(<RoleRequestSection />)

    expect(await screen.findByText(/Impossible de charger l'état/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Envoyer la demande' })).not.toBeInTheDocument()
  })

  it('shows the pending state with a working cancel button', async () => {
    useAuthStore.setState({ role: 'user' })
    serveRequest({ data: makeRequest({ status: 'pending' }) })
    const { cancel } = setMutations()
    renderWithProviders(<RoleRequestSection />)

    expect(await screen.findByText(/en attente/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Annuler ma demande' }))
    expect(cancel).toHaveBeenCalledWith('req-1')
  })

  it('shows the welcome message when the latest request is approved', async () => {
    useAuthStore.setState({ role: 'user' })
    serveRequest({ data: makeRequest({ status: 'approved' }) })
    renderWithProviders(<RoleRequestSection />)

    expect(await screen.findByText(/Votre demande a été acceptée/)).toBeInTheDocument()
  })

  it('shows the rejection reason above the resubmit form when rejected', async () => {
    useAuthStore.setState({ role: 'user' })
    serveRequest({
      data: makeRequest({ status: 'rejected', rejectionReason: 'Trop peu de détails.' }),
    })
    renderWithProviders(<RoleRequestSection />)

    expect(await screen.findByText(/Trop peu de détails/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Envoyer la demande' })).toBeInTheDocument()
  })

  it('keeps the form behind an opt-in for a first-time user, then reveals it', async () => {
    useAuthStore.setState({ role: 'user' })
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
    useAuthStore.setState({ role: 'user' })
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

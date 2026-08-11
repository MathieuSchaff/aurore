import type { RoleRequestView } from '@aurore/shared'

import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useReviewRoleRequest } from '@/lib/queries/admin'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'

vi.mock('@/lib/queries/admin', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/admin')>()
  return { ...actual, useReviewRoleRequest: vi.fn() }
})

import { AdminRoleRequestsPage } from '../components/AdminRoleRequestsPage'

const pendingRequest: RoleRequestView = {
  id: 'req-1',
  userId: 'usr-aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  motivation: 'Je veux aider à vérifier et enrichir le catalogue.',
  motivationLink: null,
  status: 'pending',
  rejectionReason: null,
  reviewedBy: null,
  reviewedAt: null,
  createdAt: '2026-06-01T10:00:00Z',
  updatedAt: '2026-06-01T10:00:00Z',
}

function serveRequests(items: RoleRequestView[]) {
  server.use(
    http.get('*/api/admin/role-requests', () =>
      HttpResponse.json({ success: true, data: { items } })
    )
  )
}

function setupMutation() {
  const mutate = vi.fn()
  vi.mocked(useReviewRoleRequest).mockReturnValue({
    mutate,
    isPending: false,
    isError: false,
    error: null,
  } as unknown as ReturnType<typeof useReviewRoleRequest>)
  return mutate
}

describe('AdminRoleRequestsPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the header, four status tabs (pending selected), and the pending row', async () => {
    serveRequests([pendingRequest])
    setupMutation()
    renderWithProviders(<AdminRoleRequestsPage />)

    expect(await screen.findByRole('heading', { name: 'Demandes modérateur' })).toBeInTheDocument()
    expect(screen.getByText('1 demande(s)')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'En attente' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Acceptée' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Refusée' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Annulée' })).toBeInTheDocument()
    expect(screen.getByText(pendingRequest.motivation)).toBeInTheDocument()
  })

  it('shows the empty state when there are no requests', async () => {
    serveRequests([])
    setupMutation()
    renderWithProviders(<AdminRoleRequestsPage />)

    expect(await screen.findByText('Aucune demande dans cette vue.')).toBeInTheDocument()
  })

  it('approves a request with decision=approve after confirmation', async () => {
    serveRequests([pendingRequest])
    const mutate = setupMutation()
    renderWithProviders(<AdminRoleRequestsPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Approuver' }))
    const dialog = await screen.findByRole('alertdialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Approuver' }))

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith(
        { id: 'req-1', body: { decision: 'approve' } },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onSettled: expect.any(Function),
        })
      )
    })
  })

  it('rejects with decision=reject and the entered reason', async () => {
    serveRequests([pendingRequest])
    const mutate = setupMutation()
    renderWithProviders(<AdminRoleRequestsPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Refuser' }))
    const dialog = await screen.findByRole('alertdialog')
    await userEvent.type(
      within(dialog).getByLabelText(/Raison du refus/),
      'Motivation insuffisante.'
    )
    await userEvent.click(within(dialog).getByRole('button', { name: 'Refuser' }))

    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith(
        { id: 'req-1', body: { decision: 'reject', reason: 'Motivation insuffisante.' } },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onSettled: expect.any(Function),
        })
      )
    })
  })

  it('blocks the reject confirmation while the reason is empty', async () => {
    serveRequests([pendingRequest])
    const mutate = setupMutation()
    renderWithProviders(<AdminRoleRequestsPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Refuser' }))
    const dialog = await screen.findByRole('alertdialog')
    expect(within(dialog).getByRole('button', { name: 'Refuser' })).toBeDisabled()
    expect(mutate).not.toHaveBeenCalled()
  })
})

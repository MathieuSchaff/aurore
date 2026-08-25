import type { ListRoleRequestsResponse, RoleRequestStatus, RoleRequestView } from '@aurore/shared'

import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/lib/helpers/apiError'
import { useReviewRoleRequest } from '@/lib/queries/admin'
import { server } from '@/test/msw/server'
import { makeErrorMutationResult, makeIdleMutationResult } from '@/test/mutation'
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

const approvedRequest = {
  ...pendingRequest,
  id: 'req-approved',
  motivation: 'Demande déjà acceptée.',
  status: 'approved',
  reviewedBy: 'usr-admin',
  reviewedAt: '2026-06-02T10:00:00Z',
  updatedAt: '2026-06-02T10:00:00Z',
} satisfies RoleRequestView

const rejectedRequest = {
  ...pendingRequest,
  id: 'req-rejected',
  motivation: 'Demande déjà refusée.',
  status: 'rejected',
  rejectionReason: 'Expérience insuffisante.',
  reviewedBy: 'usr-admin',
  reviewedAt: '2026-06-03T10:00:00Z',
  updatedAt: '2026-06-03T10:00:00Z',
} satisfies RoleRequestView

const cancelledRequest = {
  ...pendingRequest,
  id: 'req-cancelled',
  motivation: 'Demande annulée par son auteur.',
  status: 'cancelled',
  updatedAt: '2026-06-04T10:00:00Z',
} satisfies RoleRequestView

const STATUS_CASES = [
  { status: 'pending', label: 'En attente', request: pendingRequest },
  { status: 'approved', label: 'Acceptée', request: approvedRequest },
  { status: 'rejected', label: 'Refusée', request: rejectedRequest },
  { status: 'cancelled', label: 'Annulée', request: cancelledRequest },
] satisfies ReadonlyArray<{
  status: RoleRequestStatus
  label: string
  request: RoleRequestView
}>

let lastStatus: string | undefined

type ReviewMutate = ReturnType<typeof useReviewRoleRequest>['mutate']

function serveRequests(items: RoleRequestView[]) {
  lastStatus = undefined
  server.use(
    http.get('*/api/admin/role-requests', ({ request }) => {
      const status = new URL(request.url).searchParams.get('status') ?? undefined
      lastStatus = status
      const data = {
        items: items.filter((request) => !status || request.status === status),
      } satisfies ListRoleRequestsResponse
      return HttpResponse.json({ success: true, data })
    })
  )
}

function setupMutation(error: ApiError | null = null) {
  const mutate = vi.fn<ReviewMutate>()
  const reset = vi.fn()
  vi.mocked(useReviewRoleRequest).mockReturnValue(
    error
      ? makeErrorMutationResult(
          mutate,
          error,
          { id: pendingRequest.id, body: { decision: 'approve' } },
          reset
        )
      : makeIdleMutationResult(mutate, reset)
  )
  return { mutate, reset }
}

describe('AdminRoleRequestsPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the header, four status tabs (pending selected), and the pending row', async () => {
    serveRequests([pendingRequest])
    setupMutation()
    renderWithProviders(<AdminRoleRequestsPage />)

    expect(await screen.findByRole('heading', { name: 'Demandes modérateur' })).toBeInTheDocument()
    expect(screen.getByText('1 demande(s)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'En attente' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Acceptée' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Refusée' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Annulée' })).toBeInTheDocument()
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
    const { mutate } = setupMutation()
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
    const { mutate } = setupMutation()
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
    const { mutate } = setupMutation()
    renderWithProviders(<AdminRoleRequestsPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Refuser' }))
    const dialog = await screen.findByRole('alertdialog')
    expect(within(dialog).getByRole('button', { name: 'Refuser' })).toBeDisabled()
    expect(mutate).not.toHaveBeenCalled()
  })

  it.each(STATUS_CASES)(
    'queries the $status status through the network and resets mutation feedback',
    async ({ status, label, request }) => {
      serveRequests(STATUS_CASES.map((entry) => entry.request))
      const { reset } = setupMutation()
      renderWithProviders(<AdminRoleRequestsPage />)

      await userEvent.click(await screen.findByRole('button', { name: label }))

      expect(await screen.findByText(request.motivation)).toBeInTheDocument()
      for (const other of STATUS_CASES.filter((entry) => entry.status !== status)) {
        expect(screen.queryByText(other.request.motivation)).not.toBeInTheDocument()
      }
      expect(lastStatus).toBe(status)
      expect(reset).toHaveBeenCalledOnce()
    }
  )

  it.each([
    ['not_found', 404, 'Demande introuvable.'],
    ['not_pending', 409, 'Cette demande n’est plus en attente.'],
  ] as const)('maps a %s review failure in its own domain', async (code, status, message) => {
    serveRequests([pendingRequest])
    setupMutation(new ApiError(code, status))
    renderWithProviders(<AdminRoleRequestsPage />)

    expect(await screen.findByText(message)).toBeInTheDocument()
  })
})

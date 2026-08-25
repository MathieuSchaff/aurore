import type { ListSuggestedEditsResponse, SuggestedEditView, UserPublic } from '@aurore/shared'

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/lib/helpers/apiError'
import { useReviewSuggestedEdit } from '@/lib/queries/admin'
import { useAuthStore } from '@/store/auth'
import { restoringTestSession } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { makeErrorMutationResult, makeIdleMutationResult } from '@/test/mutation'
import { renderWithProviders } from '@/test/utils'
import { AdminSuggestedEditsPage } from '../components/AdminSuggestedEditsPage'

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  Link: ({ children, to, ...rest }: { children: React.ReactNode; to: string }) => (
    <a href={to} {...(rest as object)}>
      {children}
    </a>
  ),
}))
vi.mock('@/lib/queries/admin', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/admin')>()
  return { ...actual, useReviewSuggestedEdit: vi.fn() }
})

const EDIT = {
  id: 'edit-1',
  proposerId: 'u-1',
  targetType: 'product',
  targetId: 'p-1',
  field: 'name',
  proposedValue: 'Corrected',
  status: 'pending',
  reviewedBy: null,
  reviewedAt: null,
  createdAt: '2026-06-01T00:00:00.000Z',
} satisfies SuggestedEditView

type ReviewMutate = ReturnType<typeof useReviewSuggestedEdit>['mutate']

const review = vi.fn<ReviewMutate>()
let requestedStatuses: Array<string | null>

beforeEach(() => {
  useAuthStore.setState({
    session: restoringTestSession({
      id: 'contributor-1',
      email: 'contributor@example.test',
      createdAt: '2026-01-01T00:00:00.000Z',
      emailVerified: true,
      role: 'contributor',
      isDemo: false,
    } satisfies UserPublic),
  })
  requestedStatuses = []
  server.use(
    http.get('*/api/admin/suggested-edits', ({ request }) => {
      requestedStatuses.push(new URL(request.url).searchParams.get('status'))
      const data = { items: [EDIT] } satisfies ListSuggestedEditsResponse
      return HttpResponse.json({ success: true, data })
    })
  )
  review.mockReset()
  vi.mocked(useReviewSuggestedEdit).mockReturnValue(makeIdleMutationResult(review))
})

describe('AdminSuggestedEditsPage', () => {
  it('renders a pending suggestion with the proposed value', async () => {
    renderWithProviders(<AdminSuggestedEditsPage />)
    expect(await screen.findByText('Corrected')).toBeInTheDocument()
  })

  it('accepts after confirmation', async () => {
    renderWithProviders(<AdminSuggestedEditsPage />)
    await userEvent.click(await screen.findByRole('button', { name: 'Accepter' }))
    const confirmDialog = await screen.findByRole('alertdialog')
    await userEvent.click(
      Array.from(confirmDialog.querySelectorAll('button')).find(
        (b) => b.textContent === 'Accepter'
      ) as HTMLButtonElement
    )
    await waitFor(() => {
      expect(review).toHaveBeenCalledWith(
        { id: 'edit-1', body: { status: 'accepted' } },
        expect.objectContaining({ onSuccess: expect.any(Function) })
      )
    })
  })

  it.each([
    ['not_found', 404, 'Correction introuvable.'],
    ['invalid_input', 400, "Cette correction n'est plus en attente."],
  ] as const)('maps a %s review failure in the action context', async (code, status, message) => {
    vi.mocked(useReviewSuggestedEdit).mockReturnValue(
      makeErrorMutationResult(review, new ApiError(code, status), {
        id: EDIT.id,
        body: { status: 'accepted' },
      })
    )

    renderWithProviders(<AdminSuggestedEditsPage />)

    expect(await screen.findByText(message)).toBeInTheDocument()
  })

  it('requests the selected suggested edit status', async () => {
    renderWithProviders(<AdminSuggestedEditsPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Acceptées' }))

    await waitFor(() => expect(requestedStatuses).toContain('accepted'))
  })

  it('clears the previous decision state when switching status', async () => {
    const reset = vi.fn()
    vi.mocked(useReviewSuggestedEdit).mockReturnValue(makeIdleMutationResult(review, reset))
    renderWithProviders(<AdminSuggestedEditsPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Acceptées' }))

    expect(reset).toHaveBeenCalledOnce()
  })
})

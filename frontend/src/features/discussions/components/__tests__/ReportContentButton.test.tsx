import type { ReportView } from '@aurore/shared'

import type { MutationFunctionContext } from '@tanstack/react-query'
import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/lib/helpers/apiError'
import { useCreateReport } from '@/lib/queries/reports'
import { makeIdleMutationResult } from '@/test/mutation'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'

vi.mock('@/lib/queries/reports', () => ({
  useCreateReport: vi.fn(),
}))

import { ReportContentButton } from '../ReportContentButton'
import { REPORT_LABELS } from '../ReportContentButton.constants'

type MutateFn = ReturnType<typeof useCreateReport>['mutate']

const MUTATION_CONTEXT = {
  client: createTestQueryClient(),
  meta: undefined,
} satisfies MutationFunctionContext

function setupMutation() {
  const mutate = vi.fn<MutateFn>()
  vi.mocked(useCreateReport).mockReturnValue(makeIdleMutationResult(mutate))
  return mutate
}

describe('ReportContentButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('opens the modal when the flag button is clicked', async () => {
    setupMutation()
    renderWithProviders(<ReportContentButton targetType="review" targetId="rev-1" />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Signaler ce contenu/i }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText(/Raison/i)).toBeInTheDocument()
  })

  it('shows a validation error and does not submit when the reason is empty', async () => {
    const mutate = setupMutation()
    renderWithProviders(<ReportContentButton targetType="review" targetId="rev-1" />)

    await userEvent.click(screen.getByRole('button', { name: /Signaler ce contenu/i }))
    await userEvent.click(screen.getByRole('button', { name: /Envoyer/i }))

    expect(screen.getByText(REPORT_LABELS.reasonRequired)).toBeInTheDocument()
    expect(mutate).not.toHaveBeenCalled()
  })

  it('submits the trimmed reason via the mutation on form submit', async () => {
    const mutate = setupMutation()
    renderWithProviders(<ReportContentButton targetType="reply" targetId="rep-42" />)

    await userEvent.click(screen.getByRole('button', { name: /Signaler ce contenu/i }))

    const textarea = screen.getByLabelText(/Raison/i)
    // Whitespace must be trimmed before submission.
    fireEvent.change(textarea, { target: { value: '  Propos insultants  ' } })

    await userEvent.click(screen.getByRole('button', { name: /Envoyer/i }))

    expect(mutate).toHaveBeenCalledTimes(1)
    expect(mutate).toHaveBeenCalledWith(
      { targetType: 'reply', targetId: 'rep-42', reason: 'Propos insultants' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
  })

  it('shows the thank-you confirmation when the mutation succeeds', async () => {
    const mutate = setupMutation()

    renderWithProviders(<ReportContentButton targetType="thread" targetId="t-1" />)

    await userEvent.click(screen.getByRole('button', { name: /Signaler ce contenu/i }))
    fireEvent.change(screen.getByLabelText(/Raison/i), { target: { value: 'Hors sujet' } })
    await userEvent.click(screen.getByRole('button', { name: /Envoyer/i }))

    const call = mutate.mock.calls[0]
    if (!call) throw new Error('report mutation was not called')
    const [variables, options] = call
    const report = {
      ...variables,
      id: 'report-1',
      reporterId: 'reporter-1',
      status: 'open',
      reviewedBy: null,
      reviewedAt: null,
      escalatedAt: null,
      escalatedBy: null,
      createdAt: '2026-09-15T12:00:00.000Z',
    } satisfies ReportView
    act(() => {
      options?.onSuccess?.(report, variables, undefined, MUTATION_CONTEXT)
    })

    await waitFor(() => {
      expect(screen.getByText(REPORT_LABELS.successMessage)).toBeInTheDocument()
    })
    expect(screen.queryByLabelText(/Raison/i)).not.toBeInTheDocument()
  })

  it('shows a safe message when the mutation fails', async () => {
    const mutate = setupMutation()

    renderWithProviders(<ReportContentButton targetType="thread" targetId="t-1" />)

    await userEvent.click(screen.getByRole('button', { name: /Signaler ce contenu/i }))
    fireEvent.change(screen.getByLabelText(/Raison/i), { target: { value: 'Hors sujet' } })
    await userEvent.click(screen.getByRole('button', { name: /Envoyer/i }))

    const call = mutate.mock.calls[0]
    if (!call) throw new Error('report mutation was not called')
    const [variables, options] = call
    act(() => {
      options?.onError?.(
        new ApiError('rate_limit_exceeded', 429),
        variables,
        undefined,
        MUTATION_CONTEXT
      )
    })

    await waitFor(() => {
      expect(screen.getByText(REPORT_LABELS.failureMessage)).toBeInTheDocument()
    })
  })
})

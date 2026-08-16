import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useReviewSuggestedEdit } from '@/lib/queries/admin'
import { useAuthStore } from '@/store/auth'
import { server } from '@/test/msw/server'
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
  targetType: 'product' as const,
  targetId: 'p-1',
  field: 'name',
  proposedValue: 'Corrected',
  status: 'pending' as const,
  reviewedBy: null,
  reviewedAt: null,
  createdAt: '2026-06-01T00:00:00.000Z',
}

let review: ReturnType<typeof useReviewSuggestedEdit>['mutate']

beforeEach(() => {
  useAuthStore.setState({ role: 'contributor' })
  server.use(
    http.get('*/api/admin/suggested-edits', () =>
      HttpResponse.json({ success: true, data: { items: [EDIT] } })
    )
  )
  review = vi.fn() as never
  vi.mocked(useReviewSuggestedEdit).mockReturnValue({ mutate: review, isPending: false } as never)
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
})

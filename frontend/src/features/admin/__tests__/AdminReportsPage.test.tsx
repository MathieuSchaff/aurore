import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useEscalateReport, useModerateContent, useResolveReport } from '@/lib/queries/admin'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'

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
  return {
    ...actual,
    useResolveReport: vi.fn(),
    useModerateContent: vi.fn(),
    useEscalateReport: vi.fn(),
  }
})

import type { ReportView } from '@aurore/shared'

import { useAuthStore } from '@/store/auth'
import { AdminReportsPage } from '../components/AdminReportsPage'
import { adminLabels } from '../constants'

const REPORTER = {
  id: 'usr-reporter',
  email: 'snitch@seed.local',
  role: 'user' as const,
  emailVerifiedAt: '2026-01-01T00:00:00Z',
  createdAt: '2026-01-01T00:00:00Z',
  forcedPrivateByAdmin: false,
}

const TARGET_USER = {
  id: 'usr-bad',
  email: 'spammer@seed.local',
  role: 'user' as const,
  emailVerifiedAt: null,
  createdAt: '2026-02-01T00:00:00Z',
  forcedPrivateByAdmin: true,
}

const baseReports: ReportView[] = [
  {
    id: 'rep-1',
    targetType: 'review',
    targetId: 'rev-aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    reason: 'Propos insultants',
    reporterId: REPORTER.id,
    reviewedBy: null,
    reviewedAt: null,
    status: 'open',
    escalatedAt: null,
    escalatedBy: null,
    createdAt: '2026-05-21T10:00:00Z',
  },
  {
    id: 'rep-2',
    targetType: 'profile',
    targetId: TARGET_USER.id,
    reason: 'Profil suspect',
    reporterId: REPORTER.id,
    reviewedBy: null,
    reviewedAt: null,
    status: 'open',
    escalatedAt: null,
    escalatedBy: null,
    createdAt: '2026-05-21T11:00:00Z',
  },
]

// The page pulls three endpoints: the queue, the user directory it joins reporter
// and target emails from, and the moderation preview opened by « Voir ».
function serveQueries(reports: ReportView[], preview: unknown = null) {
  server.use(
    http.get('*/api/admin/reports', () =>
      HttpResponse.json({ success: true, data: { items: reports } })
    ),
    http.get('*/api/admin/users', () =>
      HttpResponse.json({ success: true, data: { items: [REPORTER, TARGET_USER] } })
    ),
    http.get('*/api/admin/moderation/:target/:id', () =>
      HttpResponse.json({ success: true, data: preview })
    )
  )
}

function setupMutations() {
  const resolve = vi.fn()
  const moderate = vi.fn()
  const escalate = vi.fn()
  vi.mocked(useResolveReport).mockReturnValue({
    mutate: resolve,
    isPending: false,
  } as unknown as ReturnType<typeof useResolveReport>)
  vi.mocked(useModerateContent).mockReturnValue({
    mutate: moderate,
    isPending: false,
  } as unknown as ReturnType<typeof useModerateContent>)
  vi.mocked(useEscalateReport).mockReturnValue({
    mutate: escalate,
    isPending: false,
  } as unknown as ReturnType<typeof useEscalateReport>)
  return { resolve, moderate, escalate }
}

describe('AdminReportsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({ role: 'admin' })
  })

  it('renders the header count and status tabs', async () => {
    serveQueries(baseReports)
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    expect(await screen.findByRole('heading', { name: /Signalements/i })).toBeInTheDocument()
    expect(screen.getByText('2 entrée(s)')).toBeInTheDocument()

    expect(screen.getByRole('tab', { name: 'Ouverts' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Résolus' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tab', { name: 'Rejetés' })).toHaveAttribute('aria-selected', 'false')
  })

  it('shows the empty state when there are no reports', async () => {
    serveQueries([])
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    expect(await screen.findByText(adminLabels.emptyReports)).toBeInTheDocument()
  })

  it('renders the reporter email and a code snippet for content-type targets', async () => {
    serveQueries([baseReports[0]])
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    expect(await screen.findByText('snitch@seed.local')).toBeInTheDocument()
    expect(screen.getByText('Propos insultants')).toBeInTheDocument()
    // Code snippet truncates id to 8 chars: review#rev-aaaa
    expect(screen.getByText(/review#rev-aaaa/)).toBeInTheDocument()
  })

  it('renders a user-snapshot block + "Voir le profil" link when targetType is profile', async () => {
    serveQueries([baseReports[1]])
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    expect(await screen.findByText('spammer@seed.local')).toBeInTheDocument()
    // forcedPrivateByAdmin pill must appear for the target user.
    expect(screen.getByText(adminLabels.pillForced)).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /Voir le profil/i })
    expect(link).toHaveAttribute('href', '/admin/users/$userId')
  })

  it('calls the resolve mutation with status=resolved after confirmation', async () => {
    serveQueries([baseReports[0]])
    const { resolve } = setupMutations()
    renderWithProviders(<AdminReportsPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Résoudre' }))

    // useConfirm opens an alertdialog with "Confirmer"-style action button; we used confirmLabel='Résoudre'.
    const confirmDialog = await screen.findByRole('alertdialog')
    await userEvent.click(
      Array.from(confirmDialog.querySelectorAll('button')).find(
        (b) => b.textContent === 'Résoudre'
      ) as HTMLButtonElement
    )

    await waitFor(() => {
      expect(resolve).toHaveBeenCalledWith(
        { id: 'rep-1', body: { status: 'resolved' } },
        expect.objectContaining({ onSuccess: expect.any(Function) })
      )
    })
  })

  it('does not call the mutation when the user cancels the confirmation', async () => {
    serveQueries([baseReports[0]])
    const { resolve } = setupMutations()
    renderWithProviders(<AdminReportsPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Rejeter' }))
    const confirmDialog = await screen.findByRole('alertdialog')
    await userEvent.click(
      Array.from(confirmDialog.querySelectorAll('button')).find(
        (b) => b.textContent === 'Annuler'
      ) as HTMLButtonElement
    )

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
    expect(resolve).not.toHaveBeenCalled()
  })

  // Contributors own the queue but get a content-only view: no account PII,
  // no admin-only profile/global-ban affordances.
  it('hides reporter email from a contributor (no account PII)', async () => {
    useAuthStore.setState({ role: 'contributor' })
    serveQueries([baseReports[0]])
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    // The report itself is still shown: the moderator can act on content.
    expect(await screen.findByText('Propos insultants')).toBeInTheDocument()
    expect(screen.queryByText('snitch@seed.local')).not.toBeInTheDocument()
  })

  it('hides the « Voir le profil » link + target email from a contributor', async () => {
    useAuthStore.setState({ role: 'contributor' })
    serveQueries([baseReports[1]])
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    expect(await screen.findByText('Profil suspect')).toBeInTheDocument()
    expect(screen.queryByText('spammer@seed.local')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Voir le profil/i })).not.toBeInTheDocument()
  })

  // A catalogue-sheet report previews the fiche and moderates it through the same panel.
  it('previews a product-sheet report and hides the fiche', async () => {
    const productReport: ReportView = {
      id: 'rep-prod',
      targetType: 'product',
      targetId: 'prod-aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      reason: 'Fiche pub / spam',
      reporterId: REPORTER.id,
      reviewedBy: null,
      reviewedAt: null,
      status: 'open',
      escalatedAt: null,
      escalatedBy: null,
      createdAt: '2026-05-30T10:00:00Z',
    }
    serveQueries([productReport], {
      kind: 'product',
      id: productReport.targetId,
      name: 'Spam Serum',
      brand: 'SpamBrand',
      slug: 'spam-serum',
      moderationStatus: 'visible',
      moderationReason: null,
      authorId: 'usr-author',
      authorUsername: null,
      createdAt: '2026-05-30T09:00:00Z',
    })
    const { moderate } = setupMutations()
    renderWithProviders(<AdminReportsPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Voir' }))
    expect(await screen.findByText('Spam Serum')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Masquer' }))
    const confirmDialog = await screen.findByRole('alertdialog')
    await userEvent.click(
      Array.from(confirmDialog.querySelectorAll('button')).find(
        (b) => b.textContent === 'Masquer'
      ) as HTMLButtonElement
    )

    await waitFor(() => {
      expect(moderate).toHaveBeenCalledWith(
        { target: 'products', id: productReport.targetId, body: { status: 'hidden' } },
        expect.objectContaining({ onSuccess: expect.any(Function) })
      )
    })
  })

  it('switches the active tab when the user picks a different status', async () => {
    serveQueries(baseReports)
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    fireEvent.click(await screen.findByRole('tab', { name: 'Résolus' }))

    // Switching status refetches through useSuspenseQuery, so the tab bar unmounts
    // until the new page resolves. Wait for it rather than reading the torn frame.
    expect(await screen.findByRole('tab', { name: 'Résolus' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByRole('tab', { name: 'Ouverts' })).toHaveAttribute('aria-selected', 'false')
  })

  // Escalation is orthogonal to status: a row stays open while escalated.
  // The « Escaladés » view is admin-only.
  it('escalates an open report after confirmation', async () => {
    serveQueries([baseReports[0]])
    const { escalate } = setupMutations()
    renderWithProviders(<AdminReportsPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Escalader' }))
    const confirmDialog = await screen.findByRole('alertdialog')
    await userEvent.click(
      Array.from(confirmDialog.querySelectorAll('button')).find(
        (b) => b.textContent === 'Escalader'
      ) as HTMLButtonElement
    )

    await waitFor(() => {
      expect(escalate).toHaveBeenCalledWith(
        'rep-1',
        expect.objectContaining({ onSuccess: expect.any(Function) })
      )
    })
  })

  it('shows the Escaladé badge and hides the escalate button on an escalated report', async () => {
    const escalated: ReportView = {
      ...baseReports[0],
      escalatedAt: '2026-05-31T10:00:00Z',
      escalatedBy: 'usr-modo',
    }
    serveQueries([escalated])
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    expect(await screen.findByText('Escaladé')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Escalader' })).not.toBeInTheDocument()
  })

  it('shows the Escaladés tab for an admin', async () => {
    serveQueries(baseReports)
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    expect(await screen.findByRole('tab', { name: 'Escaladés' })).toBeInTheDocument()
  })

  it('hides the Escaladés tab from a contributor', async () => {
    useAuthStore.setState({ role: 'contributor' })
    serveQueries(baseReports)
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    await screen.findByRole('tab', { name: 'Ouverts' })
    expect(screen.queryByRole('tab', { name: 'Escaladés' })).not.toBeInTheDocument()
  })
})

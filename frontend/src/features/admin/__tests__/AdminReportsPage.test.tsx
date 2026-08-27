import type { ContentPreview, ListReportsResponse, ReportView } from '@aurore/shared'

import type { MutationFunctionContext } from '@tanstack/react-query'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { StrictMode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { SessionView } from '@/lib/auth/session'
import { ApiError } from '@/lib/helpers/apiError'
import { captureFrontendError } from '@/lib/observability/faro'
import { useEscalateReport, useModerateContent, useResolveReport } from '@/lib/queries/admin'
import { LinkStub } from '@/test/mocks/router'
import { server } from '@/test/msw/server'
import { makeIdleMutationResult } from '@/test/mutation'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'

const { useSessionMock } = vi.hoisted(() => ({
  useSessionMock: vi.fn<() => SessionView>(),
}))

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  Link: LinkStub,
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

vi.mock('@/lib/observability/faro', () => ({ captureFrontendError: vi.fn() }))

vi.mock('@/lib/auth/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/auth/session')>()),
  useSession: useSessionMock,
}))

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

const REVIEW_PREVIEW = {
  kind: 'review',
  id: baseReports[0].targetId,
  comment: 'Texte signalé',
  moderationStatus: 'visible',
  moderationReason: null,
  authorId: 'usr-author',
  authorUsername: 'alice',
  createdAt: '2026-05-20T09:00:00Z',
} satisfies ContentPreview

let lastReportQuery: { status?: string; escalated?: string } = {}

type ResolveMutate = ReturnType<typeof useResolveReport>['mutate']
type ModerateMutate = ReturnType<typeof useModerateContent>['mutate']
type EscalateMutate = ReturnType<typeof useEscalateReport>['mutate']

const MUTATION_CONTEXT = {
  client: createTestQueryClient(),
  meta: undefined,
} satisfies MutationFunctionContext

function setSessionRole(role: 'admin' | 'contributor') {
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

// The page pulls three endpoints: the queue, the user directory it joins reporter
// and target emails from, and the moderation preview opened by « Voir ».
function serveQueries(reports: ReportView[], preview?: ContentPreview) {
  lastReportQuery = {}
  server.use(
    http.get('*/api/admin/reports', ({ request }) => {
      const search = new URL(request.url).searchParams
      const status = search.get('status') ?? undefined
      const escalated = search.get('escalated') ?? undefined
      lastReportQuery = { status, escalated }
      const data = {
        items: reports.filter(
          (report) =>
            (!status || report.status === status) &&
            (!escalated || (escalated === 'true' && report.escalatedAt !== null))
        ),
      } satisfies ListReportsResponse
      return HttpResponse.json({ success: true, data })
    }),
    http.get('*/api/admin/users', () =>
      HttpResponse.json({ success: true, data: { items: [REPORTER, TARGET_USER] } })
    ),
    http.get('*/api/admin/moderation/:target/:id', () =>
      preview
        ? HttpResponse.json({ success: true, data: preview })
        : HttpResponse.json({ success: false, error: 'not_found' }, { status: 404 })
    )
  )
}

function setupMutations() {
  const resolve = vi.fn<ResolveMutate>()
  const moderate = vi.fn<ModerateMutate>()
  const escalate = vi.fn<EscalateMutate>()
  vi.mocked(useResolveReport).mockReturnValue(makeIdleMutationResult(resolve))
  vi.mocked(useModerateContent).mockReturnValue(makeIdleMutationResult(moderate))
  vi.mocked(useEscalateReport).mockReturnValue(makeIdleMutationResult(escalate))
  return { resolve, moderate, escalate }
}

describe('AdminReportsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setSessionRole('admin')
  })

  it('renders the header count and status tabs', async () => {
    serveQueries(baseReports)
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    expect(await screen.findByRole('heading', { name: /Signalements/i })).toBeInTheDocument()
    expect(screen.getByText('2 entrée(s)')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Ouverts' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Résolus' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Rejetés' })).toHaveAttribute('aria-pressed', 'false')
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
    expect(link).toHaveAttribute('href', `/admin/users/${TARGET_USER.id}`)
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
    setSessionRole('contributor')
    serveQueries([baseReports[0]])
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    // The report itself is still shown: the moderator can act on content.
    expect(await screen.findByText('Propos insultants')).toBeInTheDocument()
    expect(screen.queryByText('snitch@seed.local')).not.toBeInTheDocument()
  })

  it('hides the « Voir le profil » link + target email from a contributor', async () => {
    setSessionRole('contributor')
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
    const resolvedReport = {
      ...baseReports[0],
      id: 'rep-resolved',
      status: 'resolved',
      reason: 'Signalement résolu',
    } satisfies ReportView
    serveQueries([...baseReports, resolvedReport])
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    fireEvent.click(await screen.findByRole('button', { name: 'Résolus' }))

    // Switching status refetches through useSuspenseQuery, so the tab bar unmounts
    // until the new page resolves. Wait for it rather than reading the torn frame.
    expect(await screen.findByRole('button', { name: 'Résolus' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Ouverts' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('Signalement résolu')).toBeInTheDocument()
    expect(lastReportQuery).toEqual({ status: 'resolved', escalated: undefined })
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

  it('hides every decision from a contributor after escalation', async () => {
    setSessionRole('contributor')
    const escalated: ReportView = {
      ...baseReports[0],
      escalatedAt: '2026-05-31T10:00:00Z',
      escalatedBy: 'usr-modo',
    }
    serveQueries([escalated])
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    expect(await screen.findByText('Escaladé')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Résoudre' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Rejeter' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Escalader' })).not.toBeInTheDocument()
  })

  it('shows the Escaladés tab for an admin', async () => {
    serveQueries(baseReports)
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    expect(await screen.findByRole('button', { name: 'Escaladés' })).toBeInTheDocument()
  })

  it('hides the Escaladés tab from a contributor', async () => {
    setSessionRole('contributor')
    serveQueries(baseReports)
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    await screen.findByRole('button', { name: 'Ouverts' })
    expect(screen.queryByRole('button', { name: 'Escaladés' })).not.toBeInTheDocument()
  })

  it('queries escalated=true without a status in the escalated view', async () => {
    const escalated = {
      ...baseReports[0],
      id: 'rep-escalated',
      reason: 'Dossier escaladé',
      escalatedAt: '2026-05-31T10:00:00Z',
      escalatedBy: 'usr-modo',
    } satisfies ReportView
    serveQueries([...baseReports, escalated])
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    fireEvent.click(await screen.findByRole('button', { name: 'Escaladés' }))

    expect(await screen.findByText('Dossier escaladé')).toBeInTheDocument()
    expect(screen.queryByText('Propos insultants')).not.toBeInTheDocument()
    expect(lastReportQuery).toEqual({ status: undefined, escalated: 'true' })
  })

  it.each([
    ['not_found', 404, 'Signalement introuvable.'],
    ['forbidden', 403, 'Ce signalement est désormais réservé aux administrateurs.'],
  ] as const)('maps a %s resolve failure to its local message', async (code, status, message) => {
    serveQueries([baseReports[0]])
    const { resolve } = setupMutations()
    renderWithProviders(<AdminReportsPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Résoudre' }))
    const confirmDialog = await screen.findByRole('alertdialog')
    await userEvent.click(
      Array.from(confirmDialog.querySelectorAll('button')).find(
        (button) => button.textContent === 'Résoudre'
      ) as HTMLButtonElement
    )
    const call = resolve.mock.calls[0]
    if (!call) throw new Error('resolve mutation was not called')
    const [variables, options] = call
    options?.onError?.(new ApiError(code, status), variables, undefined, MUTATION_CONTEXT)

    expect(await screen.findByText(message)).toBeInTheDocument()
  })

  it('shows a local error when escalating a report fails', async () => {
    serveQueries([baseReports[0]])
    const { escalate } = setupMutations()
    renderWithProviders(<AdminReportsPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Escalader' }))
    const confirmDialog = await screen.findByRole('alertdialog')
    await userEvent.click(
      Array.from(confirmDialog.querySelectorAll('button')).find(
        (button) => button.textContent === 'Escalader'
      ) as HTMLButtonElement
    )
    const call = escalate.mock.calls[0]
    if (!call) throw new Error('escalate mutation was not called')
    const [variables, options] = call
    options?.onError?.(new ApiError('not_found', 404), variables, undefined, MUTATION_CONTEXT)

    expect(await screen.findByText('Signalement introuvable.')).toBeInTheDocument()
  })

  it('does not show feedback from a decision completed after changing queue', async () => {
    const resolvedReport = {
      ...baseReports[0],
      id: 'rep-resolved-late',
      status: 'resolved',
    } satisfies ReportView
    serveQueries([baseReports[0], resolvedReport])
    const { resolve } = setupMutations()
    renderWithProviders(<AdminReportsPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Résoudre' }))
    const confirmDialog = await screen.findByRole('alertdialog')
    await userEvent.click(
      Array.from(confirmDialog.querySelectorAll('button')).find(
        (button) => button.textContent === 'Résoudre'
      ) as HTMLButtonElement
    )
    fireEvent.click(screen.getByRole('button', { name: 'Résolus' }))
    const call = resolve.mock.calls[0]
    if (!call) throw new Error('resolve mutation was not called')
    const [variables, options] = call
    const resolved = { ...baseReports[0], status: 'resolved' } satisfies ReportView
    options?.onSuccess?.(resolved, variables, undefined, MUTATION_CONTEXT)

    await screen.findByText('Propos insultants')
    expect(screen.queryByText('Signalement résolu.')).not.toBeInTheDocument()
  })

  it('distinguishes a missing preview from a transient preview failure', async () => {
    serveQueries([baseReports[0]])
    setupMutations()
    renderWithProviders(<AdminReportsPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Voir' }))

    expect(
      await screen.findByText('Contenu introuvable (peut-être supprimé par son auteur).')
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Réessayer' })).not.toBeInTheDocument()
    expect(captureFrontendError).not.toHaveBeenCalled()
  })

  it('captures a transient preview failure once and offers to retry', async () => {
    let previewReads = 0
    serveQueries([baseReports[0]])
    server.use(
      http.get('*/api/admin/moderation/:target/:id', () => {
        previewReads += 1
        return HttpResponse.json({ success: false, error: 'server_error' }, { status: 500 })
      })
    )
    setupMutations()
    renderWithProviders(
      <StrictMode>
        <AdminReportsPage />
      </StrictMode>
    )

    await userEvent.click(await screen.findByRole('button', { name: 'Voir' }))
    await waitFor(() => expect(captureFrontendError).toHaveBeenCalledOnce())
    expect(captureFrontendError).toHaveBeenCalledWith(expect.any(ApiError), {
      source: 'admin-content-preview',
      target: 'reviews',
    })
    await userEvent.click(await screen.findByRole('button', { name: 'Réessayer' }))

    await waitFor(() => expect(previewReads).toBe(2))
    expect(screen.getByText('Impossible de charger le contenu.')).toBeInTheDocument()
  })

  it.each([
    ['invalid_input', 400, 'Cette action de modération n’est plus valide.'],
    ['not_found', 404, 'Contenu introuvable.'],
  ] as const)(
    'maps a %s preview moderation failure and resolves the author link',
    async (code, status, message) => {
      serveQueries([baseReports[0]], REVIEW_PREVIEW)
      const { moderate } = setupMutations()
      renderWithProviders(<AdminReportsPage />)

      await userEvent.click(await screen.findByRole('button', { name: 'Voir' }))
      expect(await screen.findByRole('link', { name: 'Mettre en pause' })).toHaveAttribute(
        'href',
        '/admin/users/usr-author'
      )
      await userEvent.click(screen.getByRole('button', { name: 'Masquer' }))
      const confirmDialog = await screen.findByRole('alertdialog')
      await userEvent.click(
        Array.from(confirmDialog.querySelectorAll('button')).find(
          (button) => button.textContent === 'Masquer'
        ) as HTMLButtonElement
      )
      const call = moderate.mock.calls[0]
      if (!call) throw new Error('moderate mutation was not called')
      const [variables, options] = call
      options?.onError?.(new ApiError(code, status), variables, undefined, MUTATION_CONTEXT)

      expect(await screen.findByText(message)).toBeInTheDocument()
    }
  )
})

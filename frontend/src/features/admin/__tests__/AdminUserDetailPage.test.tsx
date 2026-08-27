import type { MutationFunctionContext } from '@tanstack/react-query'
import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { SessionView } from '@/lib/auth/session'
import { ApiError } from '@/lib/helpers/apiError'
import {
  adminQueries,
  useCreateBan,
  useDemoteToUser,
  useLiftBan,
  useModerateProfileVisibility,
} from '@/lib/queries/admin'
import { server } from '@/test/msw/server'
import { makeIdleMutationResult } from '@/test/mutation'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'

const { routeParams, useSessionMock } = vi.hoisted(() => ({
  routeParams: { userId: 'usr-1' },
  useSessionMock: vi.fn<() => SessionView>(),
}))

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  Link: ({ children, to, ...rest }: { children: React.ReactNode; to: string }) => (
    <a href={to} {...(rest as object)}>
      {children}
    </a>
  ),
  getRouteApi: () => ({ useParams: () => routeParams }),
}))

vi.mock('@/lib/queries/admin', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/admin')>()
  return {
    ...actual,
    useCreateBan: vi.fn(),
    useLiftBan: vi.fn(),
    useModerateProfileVisibility: vi.fn(),
    useDemoteToUser: vi.fn(),
  }
})

vi.mock('@/lib/auth/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/auth/session')>()),
  useSession: useSessionMock,
}))

import type { AdminBanListItem, AdminUserAccount } from '@aurore/shared'

import { AdminUserDetailPage } from '../components/AdminUserDetailPage'
import { adminLabels } from '../constants'

const DEFAULT_USER: AdminUserAccount = {
  id: 'usr-1',
  email: 'target@seed.local',
  role: 'user',
  emailVerifiedAt: '2026-01-01T00:00:00Z',
  createdAt: '2026-01-15T00:00:00Z',
  forcedPrivateByAdmin: false,
}

const CONTRIBUTOR_USER: AdminUserAccount = { ...DEFAULT_USER, role: 'contributor' }
const SECOND_CONTRIBUTOR_USER: AdminUserAccount = {
  ...CONTRIBUTOR_USER,
  id: 'usr-2',
  email: 'second@seed.local',
  forcedPrivateByAdmin: true,
}

const MUTATION_CONTEXT = {
  client: createTestQueryClient(),
  meta: undefined,
} satisfies MutationFunctionContext

type AccountState = 'success' | 'not-found' | 'error' | 'pending'

type RequestCounters = {
  detail: number
  directory: number
}

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

function serveQueries({
  user = DEFAULT_USER,
  bans,
  accountState = 'success',
  counters,
}: {
  user?: AdminUserAccount | null
  bans?: AdminBanListItem[]
  accountState?: AccountState
  counters?: RequestCounters
}) {
  server.use(
    http.get('*/api/admin/users/:id/bans', () =>
      HttpResponse.json({ success: true, data: bans ?? [] })
    ),
    http.get('*/api/admin/users/:id', async () => {
      if (counters) counters.detail += 1
      if (accountState === 'pending') await delay(500)
      if (accountState === 'not-found') {
        return HttpResponse.json({ success: false, error: 'not_found' }, { status: 404 })
      }
      if (accountState === 'error') {
        return HttpResponse.json({ success: false, error: 'server_error' }, { status: 500 })
      }
      return HttpResponse.json({ success: true, data: user })
    }),
    http.get('*/api/admin/users', () => {
      if (counters) counters.directory += 1
      return HttpResponse.json({ success: true, data: { items: user ? [user] : [] } })
    })
  )
}

function setupMutations() {
  const createBan = vi.fn<ReturnType<typeof useCreateBan>['mutate']>()
  const liftBan = vi.fn<ReturnType<typeof useLiftBan>['mutate']>()
  const moderateProfile = vi.fn<ReturnType<typeof useModerateProfileVisibility>['mutate']>()
  const demote = vi.fn<ReturnType<typeof useDemoteToUser>['mutate']>()
  vi.mocked(useCreateBan).mockReturnValue(makeIdleMutationResult(createBan))
  vi.mocked(useLiftBan).mockReturnValue(makeIdleMutationResult(liftBan))
  vi.mocked(useModerateProfileVisibility).mockReturnValue(makeIdleMutationResult(moderateProfile))
  vi.mocked(useDemoteToUser).mockReturnValue(makeIdleMutationResult(demote))
  return { createBan, liftBan, moderateProfile, demote }
}

function clickConfirmDialogButton(label: string) {
  const dialog = screen.getByRole('alertdialog')
  return userEvent.click(within(dialog).getByRole('button', { name: label }))
}

describe('AdminUserDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    routeParams.userId = 'usr-1'
    setSessionRole('admin')
  })

  it("renders the user's email + role in the header when the user exists", async () => {
    const counters = { detail: 0, directory: 0 }
    serveQueries({ counters })
    setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    expect(await screen.findByRole('heading', { name: 'target@seed.local' })).toBeInTheDocument()
    expect(screen.getByText(/Utilisateur — email vérifié — créé/)).toBeInTheDocument()
    expect(counters).toEqual({ detail: 1, directory: 0 })
  })

  it('renders the user not found state only for a not_found response', async () => {
    serveQueries({ user: null, accountState: 'not-found' })
    setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    expect(await screen.findByText(adminLabels.userNotFound)).toBeInTheDocument()
  })

  it('renders a loading account state instead of a false not found state', async () => {
    serveQueries({ accountState: 'pending' })
    setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    expect(await screen.findByText('Chargement du compte…')).toBeInTheDocument()
    expect(screen.queryByText(adminLabels.userNotFound)).not.toBeInTheDocument()
  })

  it('keeps bans visible when the account request fails', async () => {
    const ban: AdminBanListItem = {
      id: 'ban-visible',
      userId: 'usr-1',
      scope: 'discussion_post',
      reason: 'Visible malgré l’erreur',
      expiresAt: null,
      createdAt: '2026-05-21T09:00:00Z',
      bannedBy: 'admin-1',
      status: 'active',
    }
    serveQueries({ accountState: 'error', bans: [ban] })
    setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    expect(await screen.findByText('Informations du compte indisponibles')).toBeInTheDocument()
    expect(screen.getByText('Visible malgré l’erreur')).toBeInTheDocument()
    expect(screen.queryByText(adminLabels.userNotFound)).not.toBeInTheDocument()
  })

  it('submits a ban with the default global scope after confirmation', async () => {
    serveQueries({})
    const { createBan } = setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    // Default scope = global (admin); no reason filled. Click the create-form submit.
    const submitBtn = await screen.findByRole('button', { name: 'Mettre en pause' })
    await userEvent.click(submitBtn)

    // Confirm modal with confirmLabel='Mettre en pause'.
    await screen.findByRole('alertdialog')
    await clickConfirmDialogButton('Mettre en pause')

    await waitFor(() => {
      expect(createBan).toHaveBeenCalledTimes(1)
    })
    expect(createBan).toHaveBeenCalledWith(
      { scope: 'global' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
  })

  it('offers every supported scope with a French label', async () => {
    serveQueries({})
    setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    const scopeSelect = await screen.findByLabelText('Portée')
    expect(
      within(scopeSelect)
        .getAllByRole('option')
        .map((option) => option.textContent)
    ).toEqual([
      'Global (toutes les actions)',
      'Création de produits',
      'Édition de produits',
      'Création d’ingrédients',
      'Édition d’ingrédients',
      'Publication dans les discussions',
      'Publication d’avis',
      'Publication sociale',
    ])
  })

  it('passes the trimmed reason and UTC datetime to the ban mutation', async () => {
    serveQueries({})
    const { createBan } = setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    // Both the create-ban card and the profile visibility card have a "Raison (optionnel)"
    // input. The create-ban one is the textarea (rows=2); the visibility one is the text input.
    const reasonField = (await screen.findAllByLabelText(/Raison \(optionnel\)/i)).find(
      (el) => el.tagName === 'TEXTAREA'
    )
    if (!reasonField) throw new Error('create-ban reason textarea not found')
    await userEvent.type(reasonField, '  comportement abusif  ')
    await userEvent.type(screen.getByLabelText('Expire le (optionnel)'), '2030-06-15T10:30')

    await userEvent.click(await screen.findByRole('button', { name: 'Mettre en pause' }))
    await screen.findByRole('alertdialog')
    await clickConfirmDialogButton('Mettre en pause')

    await waitFor(() => {
      expect(createBan).toHaveBeenCalledTimes(1)
    })
    const [body] = createBan.mock.calls[0]
    expect(body).toEqual({
      scope: 'global',
      reason: 'comportement abusif',
      expiresAt: '2030-06-15T10:30:00.000Z',
    })
  })

  it('shows the empty state in the bans list when the user has no bans', async () => {
    serveQueries({ bans: [] })
    setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    expect(await screen.findByText(adminLabels.emptyBans)).toBeInTheDocument()
  })

  it('lists active bans and lifts one through the confirmation flow', async () => {
    const ban: AdminBanListItem = {
      id: 'ban-1',
      userId: 'usr-1',
      scope: 'discussion_post',
      reason: 'Spam répété',
      expiresAt: null,
      createdAt: '2026-05-21T09:00:00Z',
      bannedBy: 'admin-1',
      status: 'active',
    }
    serveQueries({ bans: [ban] })
    const { liftBan } = setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    const bansTable = await screen.findByRole('table', {
      name: 'Pauses (actives et historique)',
    })
    expect(within(bansTable).getByText('Publication dans les discussions')).toBeInTheDocument()
    expect(within(bansTable).getByText('Active')).toBeInTheDocument()
    expect(within(bansTable).getByText('Spam répété')).toBeInTheDocument()
    expect(within(bansTable).getByText('Permanent')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Lever' }))
    await screen.findByRole('alertdialog')
    await clickConfirmDialogButton('Lever')

    await waitFor(() => {
      expect(liftBan).toHaveBeenCalledWith(
        'ban-1',
        expect.objectContaining({ onSuccess: expect.any(Function) })
      )
    })
  })

  it('shows an expired ban as history without a lift action', async () => {
    const ban: AdminBanListItem = {
      id: 'ban-expired',
      userId: 'usr-1',
      scope: 'social_post',
      reason: 'Ancienne pause',
      expiresAt: '2026-05-20T09:00:00Z',
      createdAt: '2026-05-19T09:00:00Z',
      bannedBy: 'admin-1',
      status: 'expired',
    }
    serveQueries({ bans: [ban] })
    setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    const bansTable = await screen.findByRole('table', {
      name: 'Pauses (actives et historique)',
    })
    expect(within(bansTable).getByText('Publication sociale')).toBeInTheDocument()
    expect(within(bansTable).getByText('Expirée')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Lever' })).not.toBeInTheDocument()
  })

  it('shows a local message when the ban disappeared before the lift', async () => {
    const ban: AdminBanListItem = {
      id: 'ban-missing',
      userId: 'usr-1',
      scope: 'product_edit',
      reason: null,
      expiresAt: null,
      createdAt: '2026-05-21T09:00:00Z',
      bannedBy: 'admin-1',
      status: 'active',
    }
    serveQueries({ bans: [ban] })
    const { liftBan } = setupMutations()
    liftBan.mockImplementation((banId, options) => {
      const error = new ApiError('not_found', 404)
      options?.onError?.(error, banId, undefined, MUTATION_CONTEXT)
      options?.onSettled?.(undefined, error, banId, undefined, MUTATION_CONTEXT)
    })
    renderWithProviders(<AdminUserDetailPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Lever' }))
    await clickConfirmDialogButton('Lever')

    expect(await screen.findByText('Cette pause n’existe plus.')).toBeInTheDocument()
    expect(screen.queryByText('Pause levée.')).not.toBeInTheDocument()
  })

  it('shows a local fallback for an unhandled lift failure', async () => {
    const ban: AdminBanListItem = {
      id: 'ban-network',
      userId: 'usr-1',
      scope: 'product_edit',
      reason: null,
      expiresAt: null,
      createdAt: '2026-05-21T09:00:00Z',
      bannedBy: 'admin-1',
      status: 'active',
    }
    serveQueries({ bans: [ban] })
    const { liftBan } = setupMutations()
    liftBan.mockImplementation((banId, options) => {
      const error = new TypeError('network unavailable')
      options?.onError?.(error, banId, undefined, MUTATION_CONTEXT)
      options?.onSettled?.(undefined, error, banId, undefined, MUTATION_CONTEXT)
    })
    renderWithProviders(<AdminUserDetailPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Lever' }))
    await clickConfirmDialogButton('Lever')

    expect(await screen.findByText('Une erreur est survenue.')).toBeInTheDocument()
    expect(screen.queryByText('Pause levée.')).not.toBeInTheDocument()
  })

  it('describes hidden public surfaces before forcing a profile private', async () => {
    serveQueries({})
    setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    const toggle = await screen.findByRole('switch', { name: /Forcer.*privé/i })
    await userEvent.click(toggle)

    const dialog = await screen.findByRole('alertdialog')
    expect(
      within(dialog).getByText(/avis et publications publiques.*pseudonyme/i)
    ).toBeInTheDocument()
  })

  it('forces a profile private after confirmation', async () => {
    serveQueries({})
    const { moderateProfile } = setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    const toggle = await screen.findByRole('switch', { name: /Forcer.*privé/i })
    expect(toggle).not.toBeChecked()
    await userEvent.click(toggle)
    await screen.findByRole('alertdialog')
    await clickConfirmDialogButton('Forcer en privé')

    await waitFor(() => {
      expect(moderateProfile).toHaveBeenCalledTimes(1)
    })
    const [body] = moderateProfile.mock.calls[0]
    expect(body).toMatchObject({ forcedPrivate: true })
  })

  it('describes restored public surfaces before lifting force-private', async () => {
    serveQueries({ user: { ...DEFAULT_USER, forcedPrivateByAdmin: true } })
    setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    const toggle = await screen.findByRole('switch', { name: /Forcer.*privé/i })
    await userEvent.click(toggle)

    const dialog = await screen.findByRole('alertdialog')
    expect(
      within(dialog).getByText(/avis, publications et pseudonyme.*affichage habituel/i)
    ).toBeInTheDocument()
  })

  it('lifts force-private after confirmation', async () => {
    serveQueries({ user: { ...DEFAULT_USER, forcedPrivateByAdmin: true } })
    const { moderateProfile } = setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    const toggle = await screen.findByRole('switch', { name: /Forcer.*privé/i })
    expect(toggle).toBeChecked()
    await userEvent.click(toggle)
    await screen.findByRole('alertdialog')
    await clickConfirmDialogButton('Lever')

    await waitFor(() => {
      expect(moderateProfile).toHaveBeenCalledWith(
        { forcedPrivate: false, reason: undefined },
        expect.objectContaining({ onError: expect.any(Function) })
      )
    })
  })

  it('reflects the latest server-owned force-private state after an account refetch', async () => {
    serveQueries({})
    setupMutations()
    const queryClient = createTestQueryClient()
    renderWithProviders(<AdminUserDetailPage />, { queryClient })

    const toggle = await screen.findByRole('switch', { name: /Forcer.*privé/i })
    expect(toggle).not.toBeChecked()
    server.use(
      http.get('*/api/admin/users/:id', () =>
        HttpResponse.json({
          success: true,
          data: { ...DEFAULT_USER, forcedPrivateByAdmin: true },
        })
      )
    )

    await act(async () => {
      await queryClient.invalidateQueries({
        queryKey: adminQueries.user(DEFAULT_USER.id).queryKey,
        exact: true,
      })
    })

    await waitFor(() => expect(toggle).toBeChecked())
  })

  it('clears every target-specific action draft when navigating to another account', async () => {
    serveQueries({ user: CONTRIBUTOR_USER })
    setupMutations()
    const queryClient = createTestQueryClient()
    queryClient.setQueryData(adminQueries.user(CONTRIBUTOR_USER.id).queryKey, CONTRIBUTOR_USER)
    queryClient.setQueryData(adminQueries.userBans(CONTRIBUTOR_USER.id).queryKey, [])
    queryClient.setQueryData(
      adminQueries.user(SECOND_CONTRIBUTOR_USER.id).queryKey,
      SECOND_CONTRIBUTOR_USER
    )
    queryClient.setQueryData(adminQueries.userBans(SECOND_CONTRIBUTOR_USER.id).queryKey, [])
    const { rerender } = renderWithProviders(<AdminUserDetailPage />, { queryClient })

    const profileCard = await screen.findByRole('region', { name: 'Visibilité du profil' })
    const roleCard = screen.getByRole('region', { name: 'Rôle' })
    const createBanReason = screen
      .getAllByLabelText('Raison (optionnel)')
      .find((element) => element.tagName === 'TEXTAREA')
    if (!createBanReason) throw new Error('create-ban reason textarea not found')
    await userEvent.selectOptions(screen.getByLabelText('Portée'), 'product_edit')
    await userEvent.type(createBanReason, 'pause compte un')
    await userEvent.type(screen.getByLabelText('Expire le (optionnel)'), '2030-06-15T10:30')
    await userEvent.type(within(profileCard).getByLabelText('Raison (optionnel)'), 'profil un')
    await userEvent.type(within(roleCard).getByLabelText('Raison (optionnel)'), 'rôle un')

    routeParams.userId = SECOND_CONTRIBUTOR_USER.id
    server.use(
      http.get('*/api/admin/users/:id/bans', () => HttpResponse.json({ success: true, data: [] })),
      http.get('*/api/admin/users/:id', () =>
        HttpResponse.json({ success: true, data: SECOND_CONTRIBUTOR_USER })
      )
    )
    rerender(<AdminUserDetailPage />)

    expect(
      await screen.findByRole('heading', { name: SECOND_CONTRIBUTOR_USER.email })
    ).toBeInTheDocument()
    const nextProfileCard = screen.getByRole('region', { name: 'Visibilité du profil' })
    const nextRoleCard = screen.getByRole('region', { name: 'Rôle' })
    const nextCreateBanReason = screen
      .getAllByLabelText('Raison (optionnel)')
      .find((element) => element.tagName === 'TEXTAREA')
    if (!nextCreateBanReason) throw new Error('next create-ban reason textarea not found')
    expect(screen.getByLabelText('Portée')).toHaveValue('global')
    expect(screen.getByLabelText('Expire le (optionnel)')).toHaveValue('')
    expect(nextCreateBanReason).toHaveValue('')
    expect(within(nextProfileCard).getByLabelText('Raison (optionnel)')).toHaveValue('')
    expect(within(nextRoleCard).getByLabelText('Raison (optionnel)')).toHaveValue('')
    expect(screen.getByRole('switch', { name: /Forcer.*privé/i })).toBeChecked()
  })

  it('shows a local not found error for profile visibility', async () => {
    serveQueries({})
    const { moderateProfile } = setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    await userEvent.click(await screen.findByRole('switch', { name: /Forcer.*privé/i }))
    await clickConfirmDialogButton('Forcer en privé')
    const call = moderateProfile.mock.calls[0]
    if (!call) throw new Error('profile visibility mutation was not called')
    const [variables, options] = call
    act(() => {
      options?.onError?.(new ApiError('not_found', 404), variables, undefined, MUTATION_CONTEXT)
    })

    expect(await screen.findByText(/Utilisateur introuvable/i)).toBeInTheDocument()
    expect(screen.queryByText(/Profil forcé en privé/i)).not.toBeInTheDocument()
  })

  it('shows a local fallback for an unknown profile visibility error', async () => {
    serveQueries({})
    const { moderateProfile } = setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    await userEvent.click(await screen.findByRole('switch', { name: /Forcer.*privé/i }))
    await clickConfirmDialogButton('Forcer en privé')
    const call = moderateProfile.mock.calls[0]
    if (!call) throw new Error('profile visibility mutation was not called')
    const [variables, options] = call
    act(() => {
      options?.onError?.(
        new TypeError('network unavailable'),
        variables,
        undefined,
        MUTATION_CONTEXT
      )
    })

    expect(await screen.findByText(/Une erreur est survenue/i)).toBeInTheDocument()
    expect(screen.queryByText(/Profil forcé en privé/i)).not.toBeInTheDocument()
  })

  it('does not render the demote card for a non-contributor user', async () => {
    serveQueries({}) // DEFAULT_USER has role 'user'
    setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    await screen.findByRole('heading', { name: 'target@seed.local' })
    expect(
      screen.queryByRole('button', { name: 'Rétrograder en utilisateur' })
    ).not.toBeInTheDocument()
  })

  it('describes lost moderation and curation before demotion', async () => {
    serveQueries({ user: CONTRIBUTOR_USER })
    setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Rétrograder en utilisateur' }))
    const dialog = await screen.findByRole('alertdialog')
    expect(
      within(dialog).getByText(/droits de modération et de curation.*redeviendra utilisateur/i)
    ).toBeInTheDocument()
  })

  it('demotes a contributor to user after confirmation', async () => {
    serveQueries({ user: CONTRIBUTOR_USER })
    const { demote } = setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Rétrograder en utilisateur' }))
    await screen.findByRole('alertdialog')
    await clickConfirmDialogButton('Rétrograder')

    await waitFor(() => {
      expect(demote).toHaveBeenCalledTimes(1)
    })
    expect(demote).toHaveBeenCalledWith(
      { role: 'user' },
      expect.objectContaining({ onError: expect.any(Function) })
    )
  })

  it.each([
    [new ApiError('cannot_self_demote', 400), /Vous ne pouvez pas.*rétrograder/i],
    [new ApiError('not_a_contributor', 409), /Ce compte n'est pas modérateur/i],
    [new ApiError('not_found', 404), /Utilisateur introuvable/i],
    [new TypeError('network unavailable'), /Une erreur est survenue/i],
  ])('shows a local demotion error for %s', async (error, messagePattern) => {
    serveQueries({ user: CONTRIBUTOR_USER })
    const { demote } = setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Rétrograder en utilisateur' }))
    await clickConfirmDialogButton('Rétrograder')
    const call = demote.mock.calls[0]
    if (!call) throw new Error('demotion mutation was not called')
    const [variables, options] = call
    act(() => {
      options?.onError?.(error, variables, undefined, MUTATION_CONTEXT)
    })

    expect(await screen.findByText(messagePattern)).toBeInTheDocument()
  })

  it('passes the trimmed reason to the demote mutation', async () => {
    serveQueries({ user: CONTRIBUTOR_USER })
    const { demote } = setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    // Both the role card and the profile-visibility card expose a "Raison (optionnel)"
    // input; scope to the role card via its demote button's containing card.
    const roleCard = (
      await screen.findByRole('button', { name: 'Rétrograder en utilisateur' })
    ).closest('.admin-card') as HTMLElement
    await userEvent.type(
      within(roleCard).getByLabelText(/Raison \(optionnel\)/i),
      '  curation inactive  '
    )

    await userEvent.click(await screen.findByRole('button', { name: 'Rétrograder en utilisateur' }))
    await screen.findByRole('alertdialog')
    await clickConfirmDialogButton('Rétrograder')

    await waitFor(() => {
      expect(demote).toHaveBeenCalledTimes(1)
    })
    const [body] = demote.mock.calls[0]
    expect(body).toMatchObject({ role: 'user', reason: 'curation inactive' })
  })
})

// Contributors get a content-only slice: pause/lift publications, no account surface,
// and no global account lockout option.
describe('AdminUserDetailPage: contributor content-only slice', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    routeParams.userId = 'usr-1'
    setSessionRole('contributor')
  })

  it('hides the account header + force-private and drops global from the scope options', async () => {
    const counters = { detail: 0, directory: 0 }
    serveQueries({ counters })
    setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    expect(
      await screen.findByRole('heading', { name: 'Publications en pause' })
    ).toBeInTheDocument()
    // No account PII and no account-level force-private toggle.
    expect(screen.queryByText('target@seed.local')).not.toBeInTheDocument()
    expect(screen.queryByRole('switch', { name: /Forcer.*privé/i })).not.toBeInTheDocument()
    // 'global' (account lockout) is not an offered scope; content scopes are.
    expect(
      screen.queryByRole('option', { name: 'Global (toutes les actions)' })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Publication d’avis' })).toBeInTheDocument()
    expect(counters).toEqual({ detail: 0, directory: 0 })
  })

  it('submits a content-scoped pause with the default review_publish scope', async () => {
    serveQueries({})
    const { createBan } = setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Mettre en pause' }))
    await screen.findByRole('alertdialog')
    await clickConfirmDialogButton('Mettre en pause')

    await waitFor(() => {
      expect(createBan).toHaveBeenCalledTimes(1)
    })
    expect(createBan).toHaveBeenCalledWith(
      { scope: 'review_publish' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
  })

  it('shows no lift control on a global ban (admin-only to lift)', async () => {
    const globalBan: AdminBanListItem = {
      id: 'ban-g',
      userId: 'usr-1',
      scope: 'global',
      reason: null,
      expiresAt: null,
      createdAt: '2026-05-21T09:00:00Z',
      bannedBy: 'admin-1',
      status: 'active',
    }
    serveQueries({ bans: [globalBan] })
    setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    // The row renders, but a contributor gets no live "Lever" button on a global ban.
    expect(await screen.findByText('Global (toutes les actions)')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Lever' })).not.toBeInTheDocument()
  })

  it('keeps the lift control on a content-scoped ban', async () => {
    const contentBan: AdminBanListItem = {
      id: 'ban-c',
      userId: 'usr-1',
      scope: 'review_publish',
      reason: null,
      expiresAt: null,
      createdAt: '2026-05-21T09:00:00Z',
      bannedBy: 'admin-1',
      status: 'active',
    }
    serveQueries({ bans: [contentBan] })
    setupMutations()
    renderWithProviders(<AdminUserDetailPage />)

    expect(await screen.findByRole('button', { name: 'Lever' })).toBeInTheDocument()
  })
})

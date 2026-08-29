import type { UserPublic } from '@aurore/shared'

import { fireEvent, screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useLogout } from '@/lib/queries/auth'
import {
  useDeleteUser,
  useDownloadDataExport,
  useUpdatePrivacySettings,
} from '@/lib/queries/profile'
import { presentTestSession, resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'
import { AccountSettings } from '../AccountSettings'

// Mutable so a test can simulate landing via the "#discoverable" deep-link.
// Name must start with `mock` to satisfy vitest's vi.mock hoisting rule.
let mockHash = ''
vi.mock('@tanstack/react-router', () => ({
  // Button.tsx calls createLink at module load; stub so the import doesn't throw.
  createLink: vi.fn(() => vi.fn(({ children }) => children)),
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useNavigate: () => vi.fn(),
  useLocation: ({ select }: { select: (l: { hash: string }) => unknown }) =>
    select({ hash: mockHash }),
}))

vi.mock('@/lib/queries/auth', () => ({
  useLogout: vi.fn(),
}))

vi.mock('@/lib/queries/profile', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/profile')>()
  return {
    ...actual,
    useDeleteUser: vi.fn(),
    useDownloadDataExport: vi.fn(),
    useUpdatePrivacySettings: vi.fn(),
  }
})

// The Compte tab renders RoleRequestSection for role==='user'; stub its data hooks
// to keep this privacy-focused test on a single endpoint.
vi.mock('@/lib/queries/role-requests', () => ({
  roleRequestQueries: { mine: () => ({ queryKey: ['role-requests', 'me'], queryFn: vi.fn() }) },
  useSubmitRoleRequest: () => ({ mutate: vi.fn(), isPending: false, isError: false, error: null }),
  useCancelRoleRequest: () => ({ mutate: vi.fn(), isPending: false, isError: false, error: null }),
}))

const USER: UserPublic = {
  id: 'u1',
  email: 'a@b.com',
  createdAt: '2026-01-01T00:00:00.000Z',
  emailVerified: true,
  role: 'user',
  isDemo: false,
}

const ALL_FLAGS_OFF = {
  profilePublic: false,
  bioPublic: false,
  avatarPublic: false,
  linksPublic: false,
  skinTypesPublic: false,
  fitzpatrickPublic: false,
  skinConcernsPublic: false,
  discoverable: false,
  aiConsent: false,
}

async function mountWithPrivacy(privacy: typeof ALL_FLAGS_OFF) {
  const mutate = vi.fn()
  server.use(
    http.get('*/api/profile/privacy-settings', () =>
      HttpResponse.json({ success: true, data: privacy })
    )
  )
  vi.mocked(useUpdatePrivacySettings).mockReturnValue({
    mutate,
    isPending: false,
    isError: false,
  } as unknown as ReturnType<typeof useUpdatePrivacySettings>)
  vi.mocked(useDeleteUser).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  } as unknown as ReturnType<typeof useDeleteUser>)
  vi.mocked(useDownloadDataExport).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  } as unknown as ReturnType<typeof useDownloadDataExport>)
  vi.mocked(useLogout).mockReturnValue({
    mutate: vi.fn(),
  } as unknown as ReturnType<typeof useLogout>)
  renderWithProviders(<AccountSettings />)
  await screen.findByRole('switch', { name: /Profil public/ })
  return mutate
}

describe('AccountSettings privacy granular toggles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockHash = ''
    // The privacy query only runs for an authenticated viewer (logout guard)
    resetTestAuthStore(presentTestSession(USER))
  })

  it('offers the data export to a real account', async () => {
    await mountWithPrivacy(ALL_FLAGS_OFF)

    expect(screen.getByRole('button', { name: /Télécharger mes données/ })).toBeInTheDocument()
  })

  // The export route answers 403 to demo accounts: a button whose retry can never
  // succeed is replaced by the reason.
  it('replaces the data export by its reason on a demo account', async () => {
    resetTestAuthStore(presentTestSession({ ...USER, isDemo: true }))
    await mountWithPrivacy(ALL_FLAGS_OFF)

    expect(screen.queryByRole('button', { name: /Télécharger mes données/ })).toBeNull()
    expect(screen.getByText(/Indisponible en mode démo/)).toBeInTheDocument()
  })

  it('disables every sub-toggle when master profilePublic is off', async () => {
    await mountWithPrivacy(ALL_FLAGS_OFF)

    for (const label of [
      /^Bio$/,
      /^Avatar$/,
      /^Liens$/,
      /Types de peau/,
      /Phototype/,
      /Préoccupations/,
      /trouvable/i,
    ]) {
      expect(screen.getByRole('switch', { name: label })).toBeDisabled()
    }
    expect(screen.getByRole('switch', { name: /Profil public/ })).not.toBeDisabled()
  })

  it('enables sub-toggles once master is on', async () => {
    await mountWithPrivacy({ ...ALL_FLAGS_OFF, profilePublic: true })

    for (const label of [
      /^Bio$/,
      /^Avatar$/,
      /^Liens$/,
      /Types de peau/,
      /Phototype/,
      /Préoccupations/,
      /trouvable/i,
    ]) {
      expect(screen.getByRole('switch', { name: label })).not.toBeDisabled()
    }
  })

  it('opting in to discoverable updates only that flag', async () => {
    const mutate = await mountWithPrivacy({ ...ALL_FLAGS_OFF, profilePublic: true })

    fireEvent.click(screen.getByRole('switch', { name: /trouvable/i }))

    expect(mutate).toHaveBeenCalledWith({ discoverable: true })
  })
})

describe('AccountSettings deep-link scroll to discoverable toggle', () => {
  let scrollSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockHash = ''
    scrollSpy = vi.fn()
    // Neither DOM environment implements scrollIntoView; stub it.
    Element.prototype.scrollIntoView =
      scrollSpy as unknown as typeof Element.prototype.scrollIntoView
    // Run the rAF callback synchronously so the scroll happens within render.
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0)
      return 0
    })
  })

  it('scrolls to the discoverable subgroup when arriving via #discoverable', async () => {
    mockHash = 'discoverable'
    await mountWithPrivacy({ ...ALL_FLAGS_OFF, profilePublic: true })

    expect(scrollSpy).toHaveBeenCalledTimes(1)
    expect((scrollSpy.mock.instances[0] as HTMLElement).id).toBe('privacy-discoverable')
  })

  it('does not scroll without the hash', async () => {
    await mountWithPrivacy({ ...ALL_FLAGS_OFF, profilePublic: true })

    expect(scrollSpy).not.toHaveBeenCalled()
  })
})

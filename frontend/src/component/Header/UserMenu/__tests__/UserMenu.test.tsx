import { fireEvent, screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useLogout } from '@/lib/queries/auth'
import { useAuthStore } from '@/store/auth'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'
import { UserMenu } from '../UserMenu'

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: vi.fn(() => vi.fn()),
}))

vi.mock('@/lib/queries/auth', () => ({
  useLogout: vi.fn(),
}))

function setAuthState(isAuthenticated: boolean) {
  setAuthStore({ accessToken: isAuthenticated ? 'tok' : null, role: 'user' })
}

function setAuthStore(state: {
  accessToken: string | null
  role: 'user' | 'admin' | 'contributor'
}) {
  useAuthStore.setState(state)
}

// Counts the /profile fetches so the `enabled` gate can be asserted on the wire
// rather than on the arguments handed to useQuery.
let profileHits = 0

function setProfile(profile: { username?: string; avatarUrl?: string | null } | null) {
  server.use(
    http.get('*/api/profile', () => {
      profileHits += 1
      return HttpResponse.json({ success: true, data: profile })
    })
  )
}

function openMenu() {
  fireEvent.click(screen.getByRole('button', { name: 'Menu utilisateur' }))
}

describe('UserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    profileHits = 0
    setAuthState(false)
    setProfile({ username: 'mathieu', avatarUrl: null })
    vi.mocked(useLogout).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useLogout>)
  })

  it('shows auth shortcuts in the dropdown when the user is not authenticated', () => {
    setAuthState(false)
    renderWithProviders(<UserMenu />)
    openMenu()

    expect(screen.getByText(/Connexion/)).toBeInTheDocument()
    expect(screen.getByText(/S'inscrire/)).toBeInTheDocument()
    expect(screen.queryByText(/Déconnexion/)).not.toBeInTheDocument()
  })

  it('shows profile + logout entries when the user is authenticated', () => {
    setAuthState(true)
    renderWithProviders(<UserMenu />)
    openMenu()

    expect(screen.getByText(/Profil/)).toBeInTheDocument()
    expect(screen.getByText(/Déconnexion/)).toBeInTheDocument()
    expect(screen.queryByText(/Connexion/)).not.toBeInTheDocument()
  })

  it('triggers the logout mutation when the logout entry is clicked', () => {
    const mutate = vi.fn()
    vi.mocked(useLogout).mockReturnValue({
      mutate,
      isPending: false,
    } as unknown as ReturnType<typeof useLogout>)
    setAuthState(true)
    renderWithProviders(<UserMenu />)
    openMenu()

    fireEvent.click(screen.getByText(/Déconnexion/))

    expect(mutate).toHaveBeenCalledTimes(1)
  })

  // « Modération » reaches admins and contributors, and points at the reports queue.
  it('shows the Modération link to /admin/reports for an admin', () => {
    setAuthStore({ accessToken: 'tok', role: 'admin' })
    renderWithProviders(<UserMenu />)
    openMenu()

    const link = screen.getByRole('link', { name: /Modération/i })
    expect(link).toHaveAttribute('href', '/admin/reports')
  })

  it('shows the Modération link for a contributor', () => {
    setAuthStore({ accessToken: 'tok', role: 'contributor' })
    renderWithProviders(<UserMenu />)
    openMenu()

    expect(screen.getByRole('link', { name: /Modération/i })).toBeInTheDocument()
  })

  it('hides Modération from a plain user', () => {
    setAuthStore({ accessToken: 'tok', role: 'user' })
    renderWithProviders(<UserMenu />)
    openMenu()

    expect(screen.queryByText(/Modération/i)).not.toBeInTheDocument()
  })

  it('does not probe /profile when unauthenticated (enabled gated on accessToken)', async () => {
    setAuthStore({ accessToken: null, role: 'user' })
    renderWithProviders(<UserMenu />)

    await screen.findByRole('button', { name: 'Menu utilisateur' })
    expect(profileHits).toBe(0)
  })

  it('does not expose a cached profile after the session ends', () => {
    setAuthState(false)
    setProfile({ username: 'mathieu', avatarUrl: null })

    renderWithProviders(<UserMenu />)

    expect(screen.getByRole('img', { name: 'Avatar par défaut' })).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: 'Avatar de mathieu' })).not.toBeInTheDocument()
  })

  it('renders the username next to the avatar only in the drawer variant', async () => {
    setAuthState(true)
    setProfile({ username: 'mathieu', avatarUrl: null })

    const { rerender } = renderWithProviders(<UserMenu variant="bar" />)
    await screen.findByRole('img', { name: 'Avatar de mathieu' })
    expect(screen.queryByText('mathieu')).not.toBeInTheDocument()

    rerender(<UserMenu variant="drawer" />)
    expect(await screen.findByText('mathieu')).toBeInTheDocument()
  })
})

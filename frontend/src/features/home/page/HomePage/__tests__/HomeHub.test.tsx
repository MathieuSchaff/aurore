import type { UserPublic } from '@aurore/shared'

import { screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/store/auth'
import { anonymousTestSession, restoringTestSession } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { makeUserProduct, renderWithProviders } from '@/test/utils'

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')), // Expose `to`/`search.tab`/`hash` so doorway deep-links are assertable.
  Link: ({
    children,
    to,
    search,
    hash,
  }: {
    children: React.ReactNode
    to?: string
    search?: { tab?: string }
    hash?: string
  }) => (
    <a href={typeof to === 'string' ? to : undefined} data-tab={search?.tab} data-hash={hash}>
      {children}
    </a>
  ),
}))

vi.mock('@/component/Button/Button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
  ButtonLink: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// ShelfPulse pulls its own suspense query; out of scope for the hub copy test.
vi.mock('@/features/profile/components/ShelfPulse/ShelfPulse', () => ({
  ShelfPulse: () => <div>shelf-pulse</div>,
}))

import { HomeHub } from '../HomeHub'

const fakeUser = {
  id: 'u1',
  email: 'lea@example.test',
  createdAt: '2026-01-15T00:00:00.000Z',
  emailVerified: true,
  role: 'user',
  isDemo: false,
} satisfies UserPublic

// The hub reads four independent endpoints; each test declares the four payloads
// it needs, and `dermoFails` drives the degraded-portrait branch.
function serveQueries(data: {
  me: unknown
  dermo?: unknown
  list: unknown
  privacy: unknown
  dermoFails?: boolean
}) {
  server.use(
    http.get('*/api/profile', () => HttpResponse.json({ success: true, data: data.me })),
    http.get('*/api/profile/dermo', () =>
      data.dermoFails
        ? new HttpResponse(null, { status: 500 })
        : HttpResponse.json({ success: true, data: data.dermo })
    ),
    http.get('*/api/user-products', () => HttpResponse.json({ success: true, data: data.list })),
    http.get('*/api/profile/privacy-settings', () =>
      HttpResponse.json({ success: true, data: data.privacy })
    )
  )
}

afterEach(() => {
  useAuthStore.setState({ session: anonymousTestSession() })
})

describe('HomeHub', () => {
  it('keeps the collection doorway when its most recent catalogue row is unavailable', async () => {
    serveQueries({
      me: { createdAt: null },
      dermo: null,
      list: [{ ...makeUserProduct(), product: null }],
      privacy: { discoverable: false },
    })
    renderWithProviders(<HomeHub />)
    expect(await screen.findByText(/produit désormais indisponible/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ouvrir.*collection/i })).toBeInTheDocument()
    expect(screen.queryByText(/aucun produit/i)).not.toBeInTheDocument()
  })

  it('renders a calm onboarding hub for a brand-new account', async () => {
    useAuthStore.setState({ session: restoringTestSession(fakeUser) })
    serveQueries({
      me: { createdAt: null },
      dermo: {
        skinTypes: [],
        fitzpatrickType: null,
        skinConcerns: [],
        privateNotes: null,
      },
      list: [],
      privacy: { discoverable: false },
    })

    renderWithProviders(<HomeHub />)

    expect(await screen.findByText(/vos produits.*vos notes.*raisons/i)).toBeInTheDocument()
    expect(await screen.findByText(/aucun produit/i)).toBeInTheDocument()
    expect(await screen.findByText(/compléter.*profil/i)).toBeInTheDocument()
    // Discovery off: land on the account tab that holds the toggle, not a dead-end.
    const discoverCta = await screen.findByRole('link', { name: /activer.*découverte/i })
    expect(discoverCta).toHaveAttribute('href', '/profile')
    expect(discoverCta).toHaveAttribute('data-tab', 'account')
    // …and deep-links to the toggle so it isn't lost partway down the page.
    expect(discoverCta).toHaveAttribute('data-hash', 'discoverable')
  })

  it('surfaces the last decision and live doorways for a returning user', async () => {
    useAuthStore.setState({ session: restoringTestSession(fakeUser) })
    const recent = makeUserProduct({
      id: 'recent',
      status: 'in_stock',
      sentiment: 5,
      updatedAt: '2026-06-20T00:00:00.000Z',
      product: { ...makeUserProduct().product, brand: 'The Ordinary', name: 'Niacinamide 10%' },
    })
    serveQueries({
      me: { createdAt: '2026-01-15T00:00:00.000Z' },
      dermo: {
        skinTypes: ['peau-mixte'],
        fitzpatrickType: 3,
        skinConcerns: ['anti-acne'],
        privateNotes: 'secret',
      },
      list: [recent],
      privacy: { discoverable: true },
    })

    renderWithProviders(<HomeHub />)

    // Hero reprise line (one node) + doorway "Dernier ajout" line (another node).
    expect(await screen.findByText(/vous avez classé.*en stock/i)).toBeInTheDocument()
    expect(
      await screen.findByText(/dernier ajout.*The Ordinary.*Niacinamide 10%/i)
    ).toBeInTheDocument()
    // Doorway A cta flips to "Ouvrir ma collection" once a recent item exists.
    expect(await screen.findByRole('link', { name: /ouvrir.*collection/i })).toBeInTheDocument()
    // Discovery on: the doorway opens the people tab directly.
    const discoverCta = await screen.findByRole('link', { name: /découvrir/i })
    expect(discoverCta).toHaveAttribute('href', '/profile')
    expect(discoverCta).toHaveAttribute('data-tab', 'people')
    // On: no scroll hash needed (the people tab is the content itself).
    expect(discoverCta).not.toHaveAttribute('data-hash')
    expect(screen.getByText(/voir.*profil/i)).toBeInTheDocument()
    // Private notes are never exposed on the home.
    expect(screen.queryByText(/secret/)).not.toBeInTheDocument()
  })

  it('surfaces a calm retry instead of an endless spinner when the skin query errors', async () => {
    useAuthStore.setState({ session: restoringTestSession(fakeUser) })
    serveQueries({
      me: { createdAt: null },
      list: [],
      privacy: { discoverable: false },
      dermoFails: true,
    })

    renderWithProviders(<HomeHub />)

    expect(await screen.findByText(/portrait.*n'a pas pu se charger/i)).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /réessayer/i })).toBeInTheDocument()
    expect(screen.queryByText(/chargement.*portrait/i)).not.toBeInTheDocument()
  })
})

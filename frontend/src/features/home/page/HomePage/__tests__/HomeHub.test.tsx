import type { UserPublic } from '@aurore/shared'

import { screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/store/auth'
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

const fakeUser = { id: 'u1', username: 'lea' } as unknown as UserPublic

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
  useAuthStore.setState({ user: null, role: 'user' })
})

describe('HomeHub', () => {
  it('renders a calm onboarding hub for a brand-new account', async () => {
    useAuthStore.setState({ user: fakeUser, role: 'user' })
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

    expect(await screen.findByText(/Vos produits, vos notes et les raisons/)).toBeInTheDocument()
    expect(await screen.findByText(/Aucun produit pour l'instant/)).toBeInTheDocument()
    expect(await screen.findByText('Compléter mon profil')).toBeInTheDocument()
    // Discovery off: land on the account tab that holds the toggle, not a dead-end.
    const discoverCta = (await screen.findByText('Activer la découverte')).closest('a')
    expect(discoverCta).toHaveAttribute('href', '/profile')
    expect(discoverCta).toHaveAttribute('data-tab', 'account')
    // …and deep-links to the toggle so it isn't lost partway down the page.
    expect(discoverCta).toHaveAttribute('data-hash', 'discoverable')
  })

  it('surfaces the last decision and live doorways for a returning user', async () => {
    useAuthStore.setState({ user: fakeUser, role: 'user' })
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
    expect(await screen.findByText(/vous avez classé .*En stock/)).toBeInTheDocument()
    expect(
      await screen.findByText(/Dernier ajout : The Ordinary — Niacinamide 10%/)
    ).toBeInTheDocument()
    // Doorway A cta flips to "Ouvrir ma collection" once a recent item exists.
    expect(await screen.findByText('Ouvrir ma collection')).toBeInTheDocument()
    // Discovery on: the doorway opens the people tab directly.
    const discoverCta = (await screen.findByText('Découvrir')).closest('a')
    expect(discoverCta).toHaveAttribute('href', '/profile')
    expect(discoverCta).toHaveAttribute('data-tab', 'people')
    // On: no scroll hash needed (the people tab is the content itself).
    expect(discoverCta).not.toHaveAttribute('data-hash')
    expect(screen.getByText('Voir mon profil')).toBeInTheDocument()
    // Private notes are never exposed on the home.
    expect(screen.queryByText(/secret/)).not.toBeInTheDocument()
  })

  it('surfaces a calm retry instead of an endless spinner when the skin query errors', async () => {
    useAuthStore.setState({ user: fakeUser, role: 'user' })
    serveQueries({
      me: { createdAt: null },
      list: [],
      privacy: { discoverable: false },
      dermoFails: true,
    })

    renderWithProviders(<HomeHub />)

    expect(await screen.findByText(/Votre portrait n'a pas pu se charger/)).toBeInTheDocument()
    expect(await screen.findByText('Réessayer')).toBeInTheDocument()
    expect(screen.queryByText('Chargement de votre portrait…')).not.toBeInTheDocument()
  })
})

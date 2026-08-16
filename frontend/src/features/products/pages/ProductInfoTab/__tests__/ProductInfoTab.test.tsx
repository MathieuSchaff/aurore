import type { ProductDetail, UserDermoProfile, UserPublic } from '@aurore/shared'

import { fireEvent, screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { authQueries } from '@/lib/queries/auth'
import { productQueries } from '@/lib/queries/products'
import { profileQueries } from '@/lib/queries/profile'
import { useAuthStore } from '@/store/auth'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'
import { ProductInfoTab } from '../ProductInfoTab'

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  Link: vi.fn(({ children }) => children),
  getRouteApi: vi.fn(() => ({ useParams: () => ({ slug: 'product-x' }) })),
}))

vi.mock('@/hooks/useCopyToClipboard', () => ({ useCopyToClipboard: vi.fn() }))

// react-markdown is lazily imported by ProductInfoTab, so short-circuit it.
vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => children,
}))

// ReportContentButton uses useCreateReport (useMutation), so it needs a QueryClient;
// this suite renders bare. Not under test here.
vi.mock('@/features/discussions/components/ReportContentButton', () => ({
  ReportContentButton: () => null,
}))

// SuggestEditButton uses useProposeSuggestedEdit (useMutation), so it needs a QueryClient;
// this suite renders bare. Not under test here.
vi.mock('@/features/discussions/components/SuggestEditButton', () => ({
  SuggestEditButton: () => null,
}))

function setProduct(overrides: Record<string, unknown> = {}) {
  server.use(
    http.get('*/api/products/:slug', () =>
      HttpResponse.json({
        success: true,
        data: {
          id: 'p1',
          slug: 'product-x',
          name: 'Product X',
          kind: 'moisturizer',
          description: 'A nice description',
          inci: null,
          notes: null,
          url: null,
          ingredients: [],
          tags: [],
          ...overrides,
        },
      })
    )
  )
}

function setDermo(profile: { skinTypes?: string[]; skinConcerns?: string[] } | null) {
  server.use(
    http.get('*/api/profile/dermo', () => HttpResponse.json({ success: true, data: profile }))
  )
}

// The dermo query is gated on a signed-in user; the store drives that gate.
function signIn() {
  useAuthStore.setState({ user: { id: 'u1' } as UserPublic })
}

describe('ProductInfoTab', () => {
  const copy = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({ user: null })
    setProduct()
    setDermo(null)
    vi.mocked(useCopyToClipboard).mockReturnValue({
      copied: false,
      copy,
    } as unknown as ReturnType<typeof useCopyToClipboard>)
  })

  it('renders description and ingredient list with concentration formatting', async () => {
    setProduct({
      description: 'Glow serum.',
      ingredients: [
        {
          ingredientSlug: 'niacinamide',
          ingredientName: 'Niacinamide',
          ingredientCategory: 'actif',
          concentrationValue: '10',
          concentrationUnit: '%',
          concentrationPer: null,
          notes: null,
        },
      ],
    })
    renderWithProviders(<ProductInfoTab />)

    expect(await screen.findByText('Glow serum.')).toBeInTheDocument()
    expect(screen.getByText('Niacinamide')).toBeInTheDocument()
    expect(screen.getByText('10 %')).toBeInTheDocument()
  })

  it('renders a neutral At a Glance summary from kind and ingredient groups', async () => {
    setProduct({
      kind: 'moisturizer',
      ingredients: [
        {
          ingredientSlug: 'niacinamide',
          ingredientName: 'Niacinamide',
          ingredientCategory: 'actif',
        },
        { ingredientSlug: 'glycerin', ingredientName: 'Glycerin', ingredientCategory: 'humectant' },
      ],
    })
    renderWithProviders(<ProductInfoTab />)

    expect(await screen.findByText('En bref')).toBeInTheDocument()
    expect(screen.getByText(/Composition : actifs et agents hydratants\./)).toBeInTheDocument()
  })

  it('boxes the manufacturer copy behind a disclosure with an unverified-voice note', async () => {
    setProduct({ description: 'Buy now at a discount price!' })
    renderWithProviders(<ProductInfoTab />)

    expect(await screen.findByText('Texte de la marque')).toBeInTheDocument()
    expect(screen.getByText('Voix commerciale, non vérifiée par Aurore.')).toBeInTheDocument()
    expect(screen.getByText('Buy now at a discount price!')).toBeInTheDocument()
  })

  it('copies the ingredient list as comma-joined string with concentrations', async () => {
    setProduct({
      ingredients: [
        {
          ingredientSlug: 'niacinamide',
          ingredientName: 'Niacinamide',
          concentrationValue: '10',
          concentrationUnit: '%',
          concentrationPer: null,
        },
        {
          ingredientSlug: 'glycerin',
          ingredientName: 'Glycerin',
          concentrationValue: null,
          concentrationUnit: null,
          concentrationPer: null,
        },
      ],
    })
    renderWithProviders(<ProductInfoTab />)

    fireEvent.click(await screen.findByRole('button', { name: 'Copier la liste des ingrédients' }))

    expect(copy).toHaveBeenCalledWith('Niacinamide (10 %), Glycerin')
  })

  it('warns when an avoid tag matches the user dermo profile', async () => {
    signIn()
    setDermo({ skinTypes: ['peau-sensible'], skinConcerns: [] })
    setProduct({
      tags: [
        { tagSlug: 'peau-sensible', relevance: 'avoid' },
        { tagSlug: 'anti-age', relevance: 'primary' },
      ],
    })
    renderWithProviders(<ProductInfoTab />)

    expect(
      await screen.findByText(/Peut ne pas convenir à votre profil cutané/)
    ).toBeInTheDocument()
    expect(screen.getByText(/Sensible/)).toBeInTheDocument()
  })

  it('warns from the seeded SSR identity before the auth store catches up', async () => {
    const queryClient = createTestQueryClient()
    const user: UserPublic = {
      id: '019c0000-0000-7000-8000-000000000001',
      email: 'aurore@example.test',
      createdAt: '2026-08-16T10:00:00.000Z',
      emailVerified: true,
      role: 'user',
      isDemo: false,
    }
    queryClient.setQueryData(authQueries.session().queryKey, {
      authenticated: true,
      userId: user.id,
      user,
      role: user.role,
    })
    const product: ProductDetail = {
      id: '019c0000-0000-7000-8000-000000000002',
      slug: 'product-x',
      name: 'Product X',
      brand: 'Aurore',
      category: 'skincare',
      kind: 'moisturizer',
      description: null,
      inci: null,
      totalAmount: 50,
      amountUnit: 'ml',
      notes: null,
      url: null,
      imageUrl: null,
      unit: 'jar',
      priceCents: 2500,
      texture: 'creme',
      catalogQuality: 'verified',
      moderationStatus: 'visible',
      createdBy: '019c0000-0000-7000-8000-000000000003',
      createdAt: '2026-08-16T08:00:00.000Z',
      updatedAt: '2026-08-16T08:00:00.000Z',
      inciCount: 0,
      hasFragrance: false,
      ingredients: [],
      tags: [
        {
          productTagId: '019c0000-0000-7000-8000-000000000010',
          productId: '019c0000-0000-7000-8000-000000000002',
          tagName: 'Peau sensible',
          tagSlug: 'peau-sensible',
          tagCategory: 'skin_type',
          relevance: 'avoid',
        },
      ],
    }
    queryClient.setQueryData(productQueries.bySlug('product-x').queryKey, product)
    const dermoProfile: UserDermoProfile = {
      userId: user.id,
      skinTypes: ['peau-sensible'],
      fitzpatrickType: null,
      skinConcerns: [],
      privateNotes: null,
      createdAt: '2026-08-16T09:00:00.000Z',
      updatedAt: '2026-08-16T09:00:00.000Z',
    }
    queryClient.setQueryData<UserDermoProfile | null>(profileQueries.dermo().queryKey, dermoProfile)

    renderWithProviders(<ProductInfoTab />, { queryClient })

    expect(
      await screen.findByText(/Peut ne pas convenir à votre profil cutané/)
    ).toBeInTheDocument()
  })

  // The user concern vocab and the product tag vocab drifted apart: 'rosacee' is
  // only ever tagged 'rougeurs-vasculaires' on a product, so a raw slug comparison
  // never lights the notice for it.
  it('warns when an avoid tag matches a bridged concern slug', async () => {
    signIn()
    setDermo({ skinTypes: [], skinConcerns: ['rosacee', 'eczema'] })
    setProduct({
      tags: [
        { tagSlug: 'rougeurs-vasculaires', relevance: 'avoid' },
        { tagSlug: 'eczema-atopie', relevance: 'avoid' },
      ],
    })
    renderWithProviders(<ProductInfoTab />)

    expect(
      await screen.findByText(/Peut ne pas convenir à votre profil cutané/)
    ).toBeInTheDocument()
    expect(screen.getByText(/Rougeurs/)).toBeInTheDocument()
    expect(screen.getByText(/Eczéma \/ Atopie/)).toBeInTheDocument()
  })

  it('still warns on a concern slug identical in both vocabs', async () => {
    signIn()
    setDermo({ skinTypes: [], skinConcerns: ['deshydratation'] })
    setProduct({
      tags: [{ tagSlug: 'deshydratation', relevance: 'avoid' }],
    })
    renderWithProviders(<ProductInfoTab />)

    expect(
      await screen.findByText(/Peut ne pas convenir à votre profil cutané/)
    ).toBeInTheDocument()
    expect(screen.getByText(/Déshydratation/)).toBeInTheDocument()
  })

  it('does not warn for non-matching avoid tags', async () => {
    signIn()
    setDermo({ skinTypes: ['peau-grasse'], skinConcerns: [] })
    setProduct({
      tags: [{ tagSlug: 'peau-sensible', relevance: 'avoid' }],
    })
    renderWithProviders(<ProductInfoTab />)

    expect(await screen.findByText('En bref')).toBeInTheDocument()
    expect(screen.queryByText(/Peut ne pas convenir/)).not.toBeInTheDocument()
  })
})

import {
  ok,
  type ProductDetail,
  type ProductDetailPage,
  type UserDermoProfile,
  type UserPublic,
} from '@aurore/shared'

import { fireEvent, screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw/http'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { productQueries } from '@/lib/queries/products'
import { useAuthStore } from '@/store/auth'
import { anonymousTestSession, restoringTestSession } from '@/test/authSession'
import { PRODUCT_DETAILS } from '@/test/msw/fixtures/products'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'
import { ProductInfoTab } from '../ProductInfoTab'

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  Link: vi.fn(({ children }) => children),
  getRouteApi: vi.fn(() => ({ useParams: () => ({ slug: 'product-x' }) })),
}))

vi.mock('@/hooks/useCopyToClipboard', () => ({ useCopyToClipboard: vi.fn() }))

vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => children,
}))

vi.mock('@/features/discussions/components/ReportContentButton', () => ({
  ReportContentButton: () => null,
}))

vi.mock('@/features/discussions/components/SuggestEditButton', () => ({
  SuggestEditButton: () => null,
}))

let dermoProfile: UserDermoProfile | null = null

const BASE_PRODUCT = PRODUCT_DETAILS[0]
if (!BASE_PRODUCT) throw new Error('product fixture missing')

function makeIngredient(
  overrides: Partial<ProductDetail['ingredients'][number]>
): ProductDetail['ingredients'][number] {
  return {
    productId: BASE_PRODUCT.id,
    ingredientId: '44444444-4444-4444-8444-444444444444',
    concentrationValue: null,
    concentrationUnit: null,
    concentrationPer: null,
    notes: null,
    ingredientName: 'Ingredient',
    ingredientSlug: 'ingredient',
    ingredientCategory: null,
    ingredientDescription: '',
    ingredientCanonicalKey: null,
    ...overrides,
  }
}

function makeTag(overrides: Partial<ProductDetail['tags'][number]>): ProductDetail['tags'][number] {
  return {
    productTagId: '55555555-5555-4555-8555-555555555555',
    productId: BASE_PRODUCT.id,
    relevance: 'primary',
    source: 'manual',
    tagName: 'Tag',
    tagSlug: 'tag',
    tagCategory: 'concern',
    ...overrides,
  }
}

function setProduct(overrides: Partial<ProductDetail> = {}) {
  const product = {
    ...BASE_PRODUCT,
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
  } satisfies ProductDetail
  const page = {
    product,
    userStatus: null,
    dermoProfile,
    assessment: null,
    preferenceTargets: { ingredients: [], tags: [] },
  } satisfies ProductDetailPage
  server.use(
    http.get('*/api/products/:slug/page', () =>
      HttpResponse.json({
        success: true,
        data: page,
      })
    )
  )
}

function setDermo(profile: Partial<Pick<UserDermoProfile, 'skinTypes' | 'skinConcerns'>> | null) {
  dermoProfile = profile
    ? {
        userId: 'u1',
        skinTypes: profile.skinTypes ?? [],
        fitzpatrickType: null,
        skinConcerns: profile.skinConcerns ?? [],
        privateNotes: null,
        createdAt: '2026-08-16T09:00:00.000Z',
        updatedAt: '2026-08-16T09:00:00.000Z',
      }
    : null
}

function signIn() {
  const user = {
    id: 'u1',
    email: 'user@example.com',
    createdAt: '2026-08-21T06:00:00.000Z',
    emailVerified: true,
    role: 'user',
    isDemo: false,
  } satisfies UserPublic
  useAuthStore.setState({ session: restoringTestSession(user) })
}

describe('ProductInfoTab', () => {
  const copy = vi.fn<(text: string) => Promise<boolean>>(async () => true)

  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({ session: anonymousTestSession() })
    setProduct()
    setDermo(null)
    server.use(
      http.get('*/api/products/:slug/reviews/public', () => HttpResponse.json(ok({ reviews: [] }))),
      http.get('*/api/products/:slug/posts', () => HttpResponse.json(ok({ posts: [] })))
    )
    vi.mocked(useCopyToClipboard).mockReturnValue({ copied: false, copy })
  })

  it('renders description and ingredient list with concentration formatting', async () => {
    setProduct({
      description: 'Glow serum.',
      ingredients: [
        makeIngredient({
          ingredientSlug: 'niacinamide',
          ingredientName: 'Niacinamide',
          ingredientCategory: 'actif',
          concentrationValue: '10',
          concentrationUnit: '%',
        }),
      ],
    })
    renderWithProviders(<ProductInfoTab />)

    expect(await screen.findByText('Glow serum.')).toBeInTheDocument()
    expect(screen.getByText('Niacinamide')).toBeInTheDocument()
    expect(screen.getByText('10 %')).toBeInTheDocument()
  })

  it('keeps associated ingredient sheets accessible when the INCI is absent', async () => {
    setProduct({
      kind: 'moisturizer',
      ingredients: [
        makeIngredient({
          ingredientSlug: 'niacinamide',
          ingredientName: 'Niacinamide',
          ingredientCategory: 'actif',
        }),
        makeIngredient({
          ingredientSlug: 'glycerin',
          ingredientName: 'Glycerin',
          ingredientCategory: 'humectant',
        }),
      ],
    })
    renderWithProviders(<ProductInfoTab />)

    expect(await screen.findByText(/Liste INCI non renseignée/)).toBeInTheDocument()
    expect(screen.getByText(/2 fiches associées/)).toBeInTheDocument()
    fireEvent.click(screen.getByText('Consulter les fiches ingrédients'))
    expect(screen.getByText('Niacinamide')).toBeInTheDocument()
    expect(screen.getByText('Glycerin')).toBeInTheDocument()
  })

  it('boxes the manufacturer copy behind a disclosure with an unverified-voice note', async () => {
    setProduct({ description: 'Buy now at a discount price!' })
    renderWithProviders(<ProductInfoTab />)

    expect(await screen.findByText('Ce que dit la marque')).toBeInTheDocument()
    expect(screen.getByText(/Les bénéfices annoncés sont ceux de la marque/)).toBeInTheDocument()
    expect(screen.getByText('Buy now at a discount price!')).toBeInTheDocument()
  })

  it.each([null, '', '   '])(
    'does not offer a reconstructed INCI when the declaration is %j',
    async (inci) => {
      setProduct({
        inci,
        ingredients: [
          makeIngredient({
            ingredientSlug: 'niacinamide',
            ingredientName: 'Niacinamide',
            concentrationValue: '10',
            concentrationUnit: '%',
          }),
        ],
      })
      renderWithProviders(<ProductInfoTab />)

      await screen.findByText(/Liste INCI non renseignée/)
      // Blank declarations must not look like a temporary reading failure
      expect(screen.getByText(/la liste INCI.*pas encore renseignée/i)).toBeInTheDocument()
      // Linked sheets may describe only part of the declared formula
      expect(screen.queryByRole('button', { name: /Copier la liste/ })).not.toBeInTheDocument()
      expect(copy).not.toHaveBeenCalled()
    }
  )

  it('copies the complete declared INCI even without associated sheets', async () => {
    setProduct({ inci: '  Aqua, 1,2-Hexanediol, Retinal  ', inciCount: 3, ingredients: [] })
    renderWithProviders(<ProductInfoTab />)
    fireEvent.click(await screen.findByRole('button', { name: /Copier la liste/ }))
    expect(copy).toHaveBeenCalledWith('  Aqua, 1,2-Hexanediol, Retinal  ')
    expect(screen.getByRole('heading', { name: 'Les 3 ingrédients' })).toBeInTheDocument()
    expect(screen.queryByText('Consulter les fiches ingrédients')).not.toBeInTheDocument()
  })

  it('keeps every associated sheet reachable inside the disclosure', async () => {
    setProduct({
      ingredients: Array.from({ length: 12 }, (_, index) =>
        makeIngredient({
          ingredientSlug: `ingredient-${index}`,
          ingredientName: `Ingredient ${index}`,
        })
      ),
    })
    renderWithProviders(<ProductInfoTab />)
    fireEvent.click(await screen.findByText('Consulter les fiches ingrédients'))
    expect(screen.getByText('Ingredient 11')).toBeInTheDocument()
    expect(screen.getByText('12 fiches associées')).toBeInTheDocument()
  })

  it('warns when an avoid tag matches the user dermo profile', async () => {
    signIn()
    setDermo({ skinTypes: ['peau-sensible'], skinConcerns: [] })
    setProduct({
      tags: [
        makeTag({ tagSlug: 'peau-sensible', relevance: 'avoid' }),
        makeTag({ tagSlug: 'anti-age', relevance: 'primary' }),
      ],
    })
    renderWithProviders(<ProductInfoTab />)

    expect(
      await screen.findByText(/Peut ne pas convenir à votre profil cutané/)
    ).toBeInTheDocument()
    expect(screen.getByText(/Sensible/)).toBeInTheDocument()
  })

  it('warns from a seeded identity while its Bearer is restoring', async () => {
    const queryClient = createTestQueryClient()
    const user: UserPublic = {
      id: '019c0000-0000-7000-8000-000000000001',
      email: 'aurore@example.test',
      createdAt: '2026-08-16T10:00:00.000Z',
      emailVerified: true,
      role: 'user',
      isDemo: false,
    }
    useAuthStore.setState({ session: restoringTestSession(user) })
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
          source: 'manual',
        },
      ],
    }
    const dermoProfile: UserDermoProfile = {
      userId: user.id,
      skinTypes: ['peau-sensible'],
      fitzpatrickType: null,
      skinConcerns: [],
      privateNotes: null,
      createdAt: '2026-08-16T09:00:00.000Z',
      updatedAt: '2026-08-16T09:00:00.000Z',
    }
    queryClient.setQueryData(productQueries.detailPage('product-x', user.id).queryKey, {
      product,
      userStatus: null,
      dermoProfile,
      assessment: null,
      preferenceTargets: { ingredients: [], tags: [] },
    })

    renderWithProviders(<ProductInfoTab />, { queryClient })

    expect(
      await screen.findByText(/Peut ne pas convenir à votre profil cutané/)
    ).toBeInTheDocument()
  })

  // The profile's 'rosacee' maps to the product tag 'rougeurs-vasculaires'
  // Comparing raw slugs would hide this warning
  it('warns when an avoid tag matches a bridged concern slug', async () => {
    signIn()
    setDermo({ skinTypes: [], skinConcerns: ['rosacee', 'eczema'] })
    setProduct({
      tags: [
        makeTag({ tagSlug: 'rougeurs-vasculaires', relevance: 'avoid' }),
        makeTag({ tagSlug: 'eczema-atopie', relevance: 'avoid' }),
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
      tags: [makeTag({ tagSlug: 'deshydratation', relevance: 'avoid' })],
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
      tags: [makeTag({ tagSlug: 'peau-sensible', relevance: 'avoid' })],
    })
    renderWithProviders(<ProductInfoTab />)

    expect(
      await screen.findByRole('heading', { name: 'Comprendre la formule' })
    ).toBeInTheDocument()
    expect(screen.queryByText(/Peut ne pas convenir/)).not.toBeInTheDocument()
  })
})

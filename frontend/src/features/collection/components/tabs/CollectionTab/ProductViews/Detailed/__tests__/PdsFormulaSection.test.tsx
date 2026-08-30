import type { ProductDetail, ProductDetailPage, UserDermoProfile, UserPublic } from '@aurore/shared'

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/store/auth'
import { presentTestSession } from '@/test/authSession'
import { PRODUCT_DETAILS } from '@/test/msw/fixtures/products'
import { server } from '@/test/msw/server'
import { makeUserProduct, renderWithProviders } from '@/test/utils'
import { PdsFormulaSection } from '../PdsFormulaSection'

const USER = {
  id: 'u1',
  email: 'user@example.com',
  createdAt: '2026-08-21T06:00:00.000Z',
  emailVerified: true,
  role: 'user',
  isDemo: false,
} satisfies UserPublic

const BASE_PRODUCT = PRODUCT_DETAILS[0]
if (!BASE_PRODUCT) throw new Error('product fixture missing')

const SENSITIVE_PORTRAIT: UserDermoProfile = {
  userId: USER.id,
  skinTypes: ['peau-sensible'],
  fitzpatrickType: null,
  skinConcerns: [],
  privateNotes: null,
  createdAt: '2026-08-16T09:00:00.000Z',
  updatedAt: '2026-08-16T09:00:00.000Z',
}

const EMPTY_ASSESSMENT: ProductDetailPage['assessment'] = {
  explanation: { topDrivers: [], topBenefitDrivers: [], confidenceFactors: [] },
  ingredientSignals: [],
  regulatoryFindings: [],
  interactions: [],
  coverage: { matched: 1, total: 2 },
  matchedEvidence: [],
}

function makeTag(overrides: Partial<ProductDetail['tags'][number]>): ProductDetail['tags'][number] {
  return {
    productTagId: '55555555-5555-4555-8555-555555555555',
    productId: BASE_PRODUCT.id,
    relevance: 'primary',
    tagName: 'Tag',
    tagSlug: 'tag',
    tagCategory: 'concern',
    ...overrides,
  }
}

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

function servePage(
  page: Partial<Omit<ProductDetailPage, 'product'>>,
  product: Partial<ProductDetail> = {}
) {
  const data = {
    product: { ...BASE_PRODUCT, ...product },
    userStatus: 'in_stock',
    dermoProfile: null,
    assessment: null,
    preferenceTargets: { ingredients: [], tags: [] },
    ...page,
  } satisfies ProductDetailPage
  server.use(
    http.get('*/api/products/:slug/page', () => HttpResponse.json({ success: true, data }))
  )
}

describe('PdsFormulaSection', () => {
  beforeEach(() => {
    useAuthStore.setState({ session: presentTestSession(USER) })
  })

  it('warns when an avoid tag matches the viewer portrait', async () => {
    servePage(
      { dermoProfile: SENSITIVE_PORTRAIT },
      { tags: [makeTag({ tagSlug: 'peau-sensible', relevance: 'avoid' })] }
    )
    renderWithProviders(<PdsFormulaSection p={makeUserProduct()} />)

    expect(
      await screen.findByText(/Peut ne pas convenir à votre profil cutané/)
    ).toBeInTheDocument()
    expect(screen.getByText(/Sensible/)).toBeInTheDocument()
  })

  it('does not warn when no avoid tag matches the portrait', async () => {
    servePage(
      { dermoProfile: SENSITIVE_PORTRAIT },
      { inci: 'Aqua', tags: [makeTag({ tagSlug: 'peau-grasse', relevance: 'avoid' })] }
    )
    renderWithProviders(<PdsFormulaSection p={makeUserProduct()} />)

    expect(await screen.findByText('Liste INCI')).toBeInTheDocument()
    expect(screen.queryByText(/Peut ne pas convenir/)).not.toBeInTheDocument()
  })

  it('highlights a risk driver on an axis the portrait follows', async () => {
    const assessment: ProductDetailPage['assessment'] = {
      ...EMPTY_ASSESSMENT,
      explanation: {
        topDrivers: [
          {
            label: 'Parfum',
            source: 'ingredient',
            axes: ['allergenicity'],
            ingredientSlug: null,
            inci: 'Parfum',
          },
        ],
        topBenefitDrivers: [],
        confidenceFactors: [],
      },
    }
    servePage({ dermoProfile: SENSITIVE_PORTRAIT, assessment }, { inci: 'Aqua, Parfum' })
    renderWithProviders(<PdsFormulaSection p={makeUserProduct()} />)

    // The dialog title is the sheet's h2, so the reading nests one level below it
    expect(
      await screen.findByRole('heading', { name: 'Lecture de la formule', level: 3 })
    ).toBeInTheDocument()
    expect(screen.getByText('Parfum').closest('li')).toHaveAttribute('data-relevant')
  })

  it('offers to declare a linked ingredient from the shelf', async () => {
    servePage(
      { assessment: EMPTY_ASSESSMENT },
      {
        inci: 'Aqua, Niacinamide',
        ingredients: [
          makeIngredient({
            ingredientName: 'Niacinamide',
            ingredientSlug: 'niacinamide',
            ingredientCanonicalKey: 'niacinamide',
          }),
        ],
      }
    )
    renderWithProviders(<PdsFormulaSection p={makeUserProduct()} />)

    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Utiliser un ingrédient de cette formule dans mes recherches',
      })
    )

    expect(screen.getByRole('button', { name: 'Sans Niacinamide' })).toBeInTheDocument()
  })
})

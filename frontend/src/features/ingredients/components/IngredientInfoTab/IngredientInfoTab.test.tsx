import { getRouteApi } from '@tanstack/react-router'
import { screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ApiData, api } from '@/lib/api'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'
import { ingredientLabels } from '../../constants'
import { IngredientInfoTab } from './IngredientInfoTab'

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  Link: vi.fn(({ children }) => children),
  // Returns a frozen object resolved at module load: beforeEach is too late
  // because IngredientInfoTab calls getRouteApi() at the top level.
  getRouteApi: vi.fn(() => ({ useParams: () => ({ slug: 'retinol' }) })),
}))

// react-markdown + plugins are ESM-only, so stub to avoid module-graph cost.
vi.mock('react-markdown', () => ({ default: ({ children }: { children: string }) => children }))
vi.mock('remark-gfm', () => ({ default: () => null }))

type Ingredient = ApiData<(typeof api.ingredients)[':slug']['$get']>
type IngredientProducts = ApiData<(typeof api.ingredients)[':slug']['products']['$get']>
type IngredientTags = ApiData<(typeof api.ingredients)[':ingredientId']['tags']['$get']>

const PRODUCT = {
  id: '11111111-1111-4111-8111-111111111111',
  createdBy: '22222222-2222-4222-8222-222222222222',
  name: 'Sérum',
  slug: 'serum',
  brand: 'Lab',
  category: 'skincare',
  kind: 'serum',
  unit: 'pump',
  texture: null,
  inci: null,
  description: null,
  totalAmount: null,
  amountUnit: null,
  url: null,
  patents: [],
  imageUrl: null,
  notes: null,
  priceCents: null,
  catalogQuality: 'verified',
  verifiedBy: null,
  verifiedAt: null,
  moderationStatus: 'visible',
  moderatedBy: null,
  moderatedAt: null,
  moderationReason: null,
  createdAt: '2026-01-15T10:00:00.000Z',
  updatedAt: '2026-01-15T10:00:00.000Z',
} satisfies IngredientProducts[number]

// The nested resource routes are registered before the by-slug one: `:slug` would
// otherwise swallow `/products` and `/tags`.
function serveIngredient({
  products = [],
  tags = [],
  overrides = {},
}: {
  products?: IngredientProducts
  tags?: IngredientTags
  overrides?: Partial<Ingredient>
} = {}) {
  server.use(
    http.get('*/api/ingredients/:slug/products', () =>
      HttpResponse.json({ success: true, data: products })
    ),
    http.get('*/api/ingredients/:id/tags', () => HttpResponse.json({ success: true, data: tags })),
    http.get('*/api/ingredients/:slug', () =>
      HttpResponse.json({
        success: true,
        data: {
          id: 'i1',
          createdBy: PRODUCT.createdBy,
          slug: 'retinol',
          name: 'Rétinol',
          type: 'skincare',
          category: 'actif',
          canonicalKey: 'Retinol',
          description: 'Description',
          content: '',
          catalogQuality: 'verified',
          moderationStatus: 'visible',
          createdAt: '2026-01-15T10:00:00Z',
          updatedAt: '2026-01-15T10:00:00Z',
          ...overrides,
        } satisfies Ingredient,
      })
    )
  )
}

describe('IngredientInfoTab', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // getRouteApi factory already returns { useParams }. Apply again after clear.
    vi.mocked(getRouteApi).mockReturnValue({
      useParams: () => ({ slug: 'retinol' }),
    } as unknown as ReturnType<typeof getRouteApi>)
    serveIngredient()
  })

  it('renders family (type + category) and the description section', async () => {
    renderWithProviders(<IngredientInfoTab />)

    expect(await screen.findByText('skincare')).toBeInTheDocument()
    expect(screen.getByText('actif')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('splits tags into beneficial (Fonctions) and avoid (À noter) sections', async () => {
    serveIngredient({
      tags: [
        {
          ingredientTagId: 't1',
          ingredientId: 'i1',
          tagName: 'Anti-âge',
          tagSlug: 'anti-age',
          tagCategory: 'concern',
          relevance: 'primary',
        },
        {
          ingredientTagId: 't2',
          ingredientId: 'i1',
          tagName: 'Photosensibilisant',
          tagSlug: 'photosensibilisant',
          tagCategory: 'caution',
          relevance: 'avoid',
        },
      ] satisfies IngredientTags,
    })
    renderWithProviders(<IngredientInfoTab />)

    expect(await screen.findByText('Anti-âge')).toBeInTheDocument()
    expect(screen.getByText('Photosensibilisant')).toBeInTheDocument()
  })

  it('shows an empty-state message when no products reference the ingredient', async () => {
    serveIngredient()
    renderWithProviders(<IngredientInfoTab />)
    expect(await screen.findByText(ingredientLabels.noProductsAssociated)).toBeInTheDocument()
  })

  it('truncates to MAX_VISIBLE_PRODUCTS and exposes a "Voir tous" link', async () => {
    const products = Array.from({ length: 8 }, (_, i) => ({
      ...PRODUCT,
      id: `p${i}`,
      slug: `product-${i}`,
      name: `Produit ${i}`,
      category: 'skincare',
    })) satisfies IngredientProducts
    serveIngredient({ products })
    renderWithProviders(<IngredientInfoTab />)

    // 5 visible names + the "Voir tous" link.
    expect(await screen.findByText('Produit 0')).toBeInTheDocument()
    expect(screen.getByText('Produit 4')).toBeInTheDocument()
    expect(screen.queryByText('Produit 5')).not.toBeInTheDocument()
    expect(screen.getByText('Voir tous les produits (8)')).toBeInTheDocument()
  })

  // The link opens the skincare catalogue tab, which cannot list the haircare product
  // so the count says 6, what that tab will show, not the 7 the endpoint returns
  it('counts only the products of the ingredient domain in the "Voir tous" link', async () => {
    const products = [
      ...Array.from(
        { length: 6 },
        (_, i) =>
          ({
            ...PRODUCT,
            id: `p${i}`,
            slug: `product-${i}`,
            name: `Produit ${i}`,
            category: i === 0 ? 'solaire' : 'skincare',
            kind: i === 0 ? 'sunscreen' : 'serum',
          }) satisfies IngredientProducts[number]
      ),
      {
        ...PRODUCT,
        id: 'hair',
        slug: 'shampoo',
        name: 'Shampoing',
        category: 'haircare',
        kind: 'shampoo',
      },
    ] satisfies IngredientProducts
    serveIngredient({ products })
    renderWithProviders(<IngredientInfoTab />)

    expect(await screen.findByText('Voir tous les produits (6)')).toBeInTheDocument()
    expect(screen.queryByText('Shampoing')).not.toBeInTheDocument()
  })
})

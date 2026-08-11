import { getRouteApi } from '@tanstack/react-router'
import { screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

// The nested resource routes are registered before the by-slug one: `:slug` would
// otherwise swallow `/products` and `/tags`.
function serveIngredient({
  products = [],
  tags = [],
  overrides = {},
}: {
  products?: unknown[]
  tags?: unknown[]
  overrides?: Record<string, unknown>
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
          slug: 'retinol',
          name: 'Rétinol',
          type: 'actif',
          category: 'rétinoïde',
          description: 'Description',
          content: '',
          updatedAt: '2026-01-15T10:00:00Z',
          ...overrides,
        },
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

    expect(await screen.findByText('actif')).toBeInTheDocument()
    expect(screen.getByText('rétinoïde')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('splits tags into beneficial (Fonctions) and avoid (À noter) sections', async () => {
    serveIngredient({
      tags: [
        { ingredientTagId: 't1', tagName: 'Anti-âge', relevance: 'primary' },
        { ingredientTagId: 't2', tagName: 'Photosensibilisant', relevance: 'avoid' },
      ],
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
      id: `p${i}`,
      slug: `product-${i}`,
      name: `Produit ${i}`,
    }))
    serveIngredient({ products })
    renderWithProviders(<IngredientInfoTab />)

    // 5 visible names + the "Voir tous" link.
    expect(await screen.findByText('Produit 0')).toBeInTheDocument()
    expect(screen.getByText('Produit 4')).toBeInTheDocument()
    expect(screen.queryByText('Produit 5')).not.toBeInTheDocument()
    expect(screen.getByText('Voir tous les produits (8)')).toBeInTheDocument()
  })
})

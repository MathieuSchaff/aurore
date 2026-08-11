import { useNavigate } from '@tanstack/react-router'
import { fireEvent, screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useIngredientTagFilterGroups } from '@/hooks/useIngredientTagFilterGroups'
import { useListFilters } from '@/hooks/useListFilters'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'
import { ingredientLabels } from '../../constants'
import { IngredientsPage } from './IngredientsPage'

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  Link: vi.fn(({ children }) => children),
  createLink: vi.fn(() => vi.fn(({ children }) => children)),
  useNavigate: vi.fn(),
  getRouteApi: vi.fn(() => ({
    useSearch: () => ({ page: 1, type: 'skincare', profile_filter: false }),
  })),
}))

vi.mock('@/hooks/useListFilters', () => ({ useListFilters: vi.fn() }))
vi.mock('@/hooks/useIngredientTagFilterGroups', () => ({
  useIngredientTagFilterGroups: vi.fn(() => []),
}))

// SearchCombobox + FilterDrawer fetch on their own and don't matter to the
// behaviours under test, so short-circuit them.
vi.mock('@/component/Search/SearchCombobox', () => ({
  SearchCombobox: () => null,
}))
vi.mock('@/component/Filter/FilterDrawer/FilterDrawer', () => ({
  FilterDrawer: () => null,
}))
vi.mock('@/component/Filter/ActiveFiltersBar/ActiveFiltersBar', () => ({
  ActiveFiltersBar: () => null,
}))

function serveList(list: { items: unknown[]; total: number }) {
  server.use(
    http.get('*/api/ingredients', () => HttpResponse.json({ success: true, data: list })),
    http.get('*/api/ingredients/filter-options', () =>
      HttpResponse.json({ success: true, data: { tags: [] } })
    )
  )
}

function setListFilters(overrides: Partial<ReturnType<typeof useListFilters>> = {}) {
  vi.mocked(useListFilters).mockReturnValue({
    filterCount: 0,
    activeTags: [],
    applyFilters: vi.fn(),
    resetFilters: vi.fn(),
    goToPage: vi.fn(),
    toggleSingleFilter: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useListFilters>)
}

describe('IngredientsPage', () => {
  const navigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigate).mockReturnValue(navigate)
    vi.mocked(useIngredientTagFilterGroups).mockReturnValue([])
    setListFilters()
    serveList({ items: [], total: 0 })
  })

  it('renders the empty state when the query returns no items', async () => {
    renderWithProviders(<IngredientsPage />)
    expect(await screen.findByText(ingredientLabels.noResultsTitle)).toBeInTheDocument()
  })

  it('renders one card per ingredient returned by the query', async () => {
    serveList({
      items: [
        {
          id: 'i1',
          slug: 'retinol',
          name: 'Rétinol',
          description: 'Anti-âge classique.',
          category: 'rétinoïde',
          profileMatches: [],
        },
        {
          id: 'i2',
          slug: 'niacinamide',
          name: 'Niacinamide',
          description: 'Régule le sébum.',
          category: 'actif',
          profileMatches: [],
        },
      ],
      total: 2,
    })

    renderWithProviders(<IngredientsPage />)
    expect(await screen.findByText('Rétinol')).toBeInTheDocument()
    expect(screen.getByText('Niacinamide')).toBeInTheDocument()
    expect(screen.getByText('Régule le sébum.')).toBeInTheDocument()
  })

  // Neutral wording on purpose: "Éviter" / "Déconseillé" was a verdict
  it('flags ingredients matching the user portrait with a neutral badge', async () => {
    serveList({
      items: [
        {
          id: 'i1',
          slug: 'retinol',
          name: 'Rétinol',
          description: '',
          category: 'rétinoïde',
          profileMatches: ['peau-sensible'],
        },
      ],
      total: 1,
    })

    renderWithProviders(<IngredientsPage />)
    expect(await screen.findByText('Pour vous')).toBeInTheDocument()
  })

  it('fires navigate when a domain tab is clicked', async () => {
    renderWithProviders(<IngredientsPage />)
    // Skincare is active by default; click haircare to trigger the change.
    fireEvent.click(await screen.findByRole('tab', { name: /Cheveux/ }))
    expect(navigate).toHaveBeenCalledTimes(1)
  })
})

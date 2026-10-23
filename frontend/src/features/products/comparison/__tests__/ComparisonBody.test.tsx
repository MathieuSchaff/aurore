import type { EnrichedComparisonProduct } from '@aurore/shared'

import { screen, within } from '@testing-library/react'
import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'

import { userProductQueries } from '@/lib/queries/user-products'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'
import { ComparisonBody } from '../components/ComparisonBody'
import { DiffSection } from '../components/DiffSection'
import { META_STRIP_LABELS } from '../components/MetaStrip.constants'
import { SIGNALS_LABELS } from '../components/SignalsSection.constants'

type Ingredient = EnrichedComparisonProduct['ingredients'][number]

const ing = (slug: string, signals: Ingredient['signals'] = []): Ingredient => ({
  id: slug,
  inciName: slug,
  slug,
  position: 0,
  signals,
})

const make = (id: string, ingredients: Ingredient[]): EnrichedComparisonProduct => ({
  id,
  name: id,
  brand: 'X',
  kind: 'serum',
  slug: id,
  imageUrl: null,
  totalAmount: 50,
  amountUnit: 'ml',
  priceCents: 1000,
  pricePer: { unit: 'ml', cents: 20 },
  ingredients,
  tags: [],
})

const render = (ui: ReactElement) => {
  const queryClient = createTestQueryClient()
  queryClient.setQueryData(userProductQueries.list().queryKey, [])
  return renderWithProviders(ui, { queryClient })
}

describe('ComparisonBody', () => {
  it('identifies each ingredient list by product name when brands match', () => {
    const a = { ...make('a', [ing('water'), ing('squalane')]), name: 'Crème légère' }
    const b = { ...make('b', [ing('water')]), name: 'Crème intense' }
    render(<DiffSection products={[a, b]} />)
    const light = screen.getByRole('article', { name: 'X Crème légère' })
    const rich = screen.getByRole('article', { name: 'X Crème intense' })
    expect(within(light).getByRole('heading', { name: 'X Crème légère' })).toBeDefined()
    expect(within(light).getByText('squalane')).toBeDefined()
    expect(within(rich).queryByText('squalane')).toBeNull()
    expect(within(rich).getByText(/aucun ingrédient en propre/i)).toBeDefined()
  })

  it.each([
    {
      lists: [
        ['water', 'glycerin'],
        ['water', 'glycerin'],
      ],
      count: 2,
    },
    {
      lists: [
        ['water', 'glycerin'],
        ['water', 'niacinamide'],
      ],
      count: 1,
    },
    {
      lists: [
        ['water', 'glycerin', 'squalane'],
        ['water', 'niacinamide', 'panthenol'],
      ],
      count: 1,
    },
    { lists: [['water'], ['glycerin']], count: 0 },
    {
      lists: [
        ['water', 'glycerin'],
        ['water', 'glycerin'],
        ['water', 'squalane'],
      ],
      count: 1,
    },
  ])('describes ingredient overlap without judging formulas (%#)', ({ lists, count }) => {
    render(
      <ComparisonBody
        products={lists.map((list, index) =>
          make(
            String(index),
            list.map((slug) => ing(slug))
          )
        )}
      />
    )
    const summary = screen.getByRole('note', { name: /synthèse des ingrédients renseignés/i })
    const headline =
      count === 0
        ? /aucun ingrédient renseigné en commun/i
        : new RegExp(
            `${count} ingrédient${count > 1 ? 's' : ''} renseigné${count > 1 ? 's' : ''} en commun`,
            'i'
          )
    expect(within(summary).getByText(headline)).toBeDefined()
    expect(
      within(summary).getByText(new RegExp(`chacun des ${lists.length} produits`))
    ).toBeDefined()
    expect(within(summary).getByText(/listes peuvent être incomplètes/i)).toBeDefined()
    expect(summary.textContent).not.toMatch(
      /compositions (proches|nuancées|distinctes)|sensations|complémentaires|familles|%/i
    )
  })

  it('does not present storage order as INCI position or concentration', () => {
    const a = make('a', [ing('water'), ing('glycerin')])
    const b = make('b', [ing('water'), ing('niacinamide')])
    render(<ComparisonBody products={[a, b]} />)
    expect(screen.queryByText(/concentration/i)).toBeNull()
    expect(screen.queryAllByRole('img', { name: /position INCI/i })).toHaveLength(0)
    expect(screen.queryAllByText(/^#\d+/)).toHaveLength(0)
  })

  it('attributes partial overlap without calling it exclusive', () => {
    const a = make('Alpha', [ing('water'), ing('glycerin'), ing('niacinamide')])
    const b = make('Beta', [ing('water'), ing('glycerin')])
    const c = make('Gamma', [ing('water'), ing('squalane')])
    render(<ComparisonBody products={[a, b, c]} />)
    const shared = screen.getByRole('region', { name: /partagés par certains produits/i })
    expect(within(shared).getByText('glycerin')).toBeDefined()
    expect(within(shared).getByText(/Alpha.*Beta/)).toBeDefined()
    expect(screen.getAllByText('glycerin')).toHaveLength(1)
    expect(screen.getAllByText(/1 en propre/)).toHaveLength(2)
    expect(screen.getByText(/0 en propre/)).toBeDefined()
  })

  it.each([
    [[], []],
    [[ing('water')], []],
    [[], [ing('water')]],
  ])('withholds formula conclusions when a list is empty (%#)', (first, second) => {
    render(<ComparisonBody products={[make('a', first), make('b', second)]} />)
    const summary = screen.getByRole('note', { name: /synthèse des ingrédients renseignés/i })
    expect(within(summary).getByText(/données insuffisantes/i)).toBeDefined()
    expect(within(summary).queryByText(/compositions (proches|nuancées|distinctes)/i)).toBeNull()
    expect(within(summary).queryByText(/en commun|complémentaires/i)).toBeNull()
    expect(screen.queryByRole('heading', { name: /différences/i })).toBeNull()
    expect(screen.queryByRole('heading', { name: /points communs/i })).toBeNull()
    expect(screen.queryByText(/aucun signal à signaler/i)).toBeNull()
  })

  it('preserves known alerts when another product has no ingredient list', () => {
    render(<ComparisonBody products={[make('a', [ing('parfum', ['alert'])]), make('b', [])]} />)
    expect(screen.getByText(/données insuffisantes/i)).toBeDefined()
    expect(screen.getByRole('heading', { name: /vigilances/i })).toBeDefined()
    expect(screen.getByText('parfum')).toBeDefined()
  })

  it('restores the comparison when the missing ingredient list becomes available', () => {
    const a = make('a', [ing('water')])
    const { rerender } = render(<ComparisonBody products={[a, make('b', [])]} />)
    expect(screen.getByText(/données insuffisantes/i)).toBeDefined()
    rerender(<ComparisonBody products={[a, make('b', [ing('water')])]} />)
    expect(screen.queryByText(/données insuffisantes/i)).toBeNull()
    expect(screen.getByRole('heading', { name: /différences/i })).toBeDefined()
    const summary = screen.getByRole('note', { name: /synthèse des ingrédients renseignés/i })
    expect(within(summary).getByText(/1 ingrédient renseigné en commun/)).toBeDefined()
  })

  it('renders shared actives in signals section', () => {
    const a = make('a', [ing('water'), ing('niacinamide', ['active'])])
    const b = make('b', [ing('water'), ing('niacinamide', ['active'])])
    render(<ComparisonBody products={[a, b]} />)
    expect(screen.getByText(SIGNALS_LABELS.actives)).toBeDefined()
    // Renders both as a shared-active pill and in the common ingredients section.
    expect(screen.getAllByText('niacinamide').length).toBeGreaterThan(0)
  })

  it('attributes alerts to their product', () => {
    const a = make('a', [ing('parfum', ['alert'])])
    const b = make('b', [ing('water')])
    render(<ComparisonBody products={[a, b]} />)
    const alerts = screen.getByRole('article', { name: /vigilances/i })
    expect(alerts.textContent).toContain('X : a')
    expect(alerts.textContent).not.toContain('X : b')
  })

  it('shows total prices and quantities without inventing missing values', () => {
    const a = make('a', [ing('water')])
    const b = {
      ...make('b', [ing('water')]),
      priceCents: null,
      pricePer: null,
      totalAmount: null,
      amountUnit: null,
    }
    const c = {
      ...make('c', [ing('water')]),
      priceCents: 0,
      pricePer: { unit: 'ml' as const, cents: 0 },
    }
    render(<ComparisonBody products={[a, b, c]} />)
    const shelf = screen.getByRole('region', { name: /produits comparés/i })
    expect(within(shelf).getByText(/Prix total : 10,00\s*€/)).toBeDefined()
    expect(within(shelf).getByText(/Prix total non renseigné/)).toBeDefined()
    expect(within(shelf).getByText(/Quantité non renseignée/)).toBeDefined()
    expect(within(shelf).getByText(/Prix total : 0,00\s*€/)).toBeDefined()
    expect(within(shelf).getByText(/0,20\s*€ \/ ml/)).toBeDefined()
  })

  it('flags mixed-unit prices as not comparable', () => {
    const a = make('a', [ing('water')])
    const b: EnrichedComparisonProduct = {
      ...make('b', [ing('water')]),
      amountUnit: 'g',
      pricePer: { unit: 'g', cents: 50 },
    }
    render(<ComparisonBody products={[a, b]} />)
    expect(screen.getAllByText(META_STRIP_LABELS.priceMixed).length).toBeGreaterThan(0)
  })
})

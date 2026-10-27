import type { EnrichedComparisonProduct } from '@aurore/shared'

import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'

import { userProductQueries } from '@/lib/queries/user-products'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'
import { ComparisonBody } from '../components/ComparisonBody'
import { IDENTITY_LABELS } from '../components/ProductIdentityTable.constants'
import { SIGNALS_LABELS } from '../components/SignalsSection.constants'

type Ingredient = EnrichedComparisonProduct['ingredients'][number]

const ing = (slug: string, signals: Ingredient['signals'] = []): Ingredient => ({
  id: slug,
  inciName: slug,
  slug,
  signals,
})

const inci = (...labels: string[]) => labels.map((label) => ({ label, key: label.toLowerCase() }))

const make = (
  id: string,
  ingredients: Ingredient[],
  inciTokens: EnrichedComparisonProduct['inciTokens'] = null
): EnrichedComparisonProduct => ({
  id,
  name: id,
  brand: 'X',
  kind: 'serum',
  slug: id,
  imageUrl: null,
  unit: 'pump',
  texture: null,
  totalAmount: 50,
  amountUnit: 'ml',
  priceCents: 1000,
  pricePer: { unit: 'ml', cents: 20 },
  inciTokens,
  ingredients,
  tags: [],
})

const render = (ui: ReactElement) => {
  const queryClient = createTestQueryClient()
  queryClient.setQueryData(userProductQueries.list().queryKey, [])
  return renderWithProviders(ui, { queryClient })
}

const identityRow = (name: string) =>
  within(screen.getByRole('table', { name: 'Fiche d’identité' }))
    .getByRole('rowheader', { name })
    .closest('tr')?.textContent

const formulaCells = (rowIndex: number) => {
  const row = within(screen.getByRole('table', { name: 'Formules' })).getAllByRole('row')[rowIndex]
  if (!row) throw new Error(`No formula row ${rowIndex}`)
  return within(row)
    .getAllByRole('cell')
    .map((cell) => cell.textContent)
}

describe('ComparisonBody', () => {
  it('reads identity, formulas, signals then experience', () => {
    render(<ComparisonBody products={[make('a', []), make('b', [])]} />)
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Fiche d’identité',
      'Formules',
      'Signaux',
      'Votre expérience',
    ])
  })

  it('shows prices and quantities without inventing missing values', () => {
    const b = {
      ...make('b', []),
      priceCents: null,
      pricePer: null,
      totalAmount: null,
      amountUnit: null,
    }
    const c = { ...make('c', []), priceCents: 0, pricePer: { unit: 'ml' as const, cents: 0 } }
    render(<ComparisonBody products={[make('a', []), b, c]} />)
    expect(identityRow('Prix')).toMatch(/10,00\s*€Non renseigné0,00\s*€/)
    expect(identityRow('Contenance')).toContain('Non renseignée')
    expect(identityRow('Prix unitaire')).toMatch(/0,20\s*€ \/ ml/)
    expect(screen.queryByText(/total/i)).toBeNull()
  })

  it('names the container and falls back to the texture tag', () => {
    const a = { ...make('a', []), texture: 'gel' as const }
    const b = {
      ...make('b', []),
      unit: 'jar' as const,
      tags: [{ slug: 'texture-creme', tagType: 'texture', relevance: 'secondary' as const }],
    }
    render(<ComparisonBody products={[a, b]} />)
    expect(identityRow('Contenant')).toBe('ContenantPompePot')
    expect(identityRow('Texture')).toMatch(/^TextureGel/)
    expect(identityRow('Texture')).not.toContain('Non renseignée')
  })

  it('flags mixed-unit prices as not comparable', () => {
    const b = { ...make('b', []), amountUnit: 'g', pricePer: { unit: 'g' as const, cents: 50 } }
    render(<ComparisonBody products={[make('a', []), b]} />)
    expect(screen.getAllByText(IDENTITY_LABELS.priceMixed)).toHaveLength(2)
  })

  it('aligns formulas by label rank and marks what every product shares', () => {
    const a = make('a', [], inci('Aqua', 'Glycerin', 'Squalane'))
    const b = make('b', [], inci('Aqua', 'Niacinamide', 'Glycerin'))
    render(<ComparisonBody products={[a, b]} />)
    expect(formulaCells(1)).toEqual(['Aqua (commun)', 'Aqua (commun)'])
    expect(formulaCells(2)).toEqual(['Glycerin (commun)', 'Niacinamide'])
    expect(formulaCells(3)).toEqual(['Squalane', 'Glycerin (commun)'])
    expect(screen.queryByText(/concentration/i)).toBeNull()
  })

  it('filters by blanking cells, never by moving an ingredient to another rank', async () => {
    const user = userEvent.setup()
    const a = make('a', [], inci('Aqua', 'Glycerin', 'Squalane'))
    const b = make('b', [], inci('Aqua', 'Niacinamide', 'Glycerin'))
    render(<ComparisonBody products={[a, b]} />)
    await user.click(screen.getByRole('radio', { name: 'Seulement les différences' }))
    const table = screen.getByRole('table', { name: 'Formules' })
    expect(
      within(table)
        .getAllByRole('rowheader')
        .map((h) => h.textContent)
    ).toEqual(['2', '3'])
    expect(formulaCells(1)).toEqual(['', 'Niacinamide'])
    await user.click(screen.getByRole('radio', { name: 'Seulement les communs' }))
    expect(within(table).queryByText('Squalane')).toBeNull()
    expect(within(table).getAllByText('Glycerin')).toHaveLength(2)
  })

  it('folds a long formula behind one toggle', async () => {
    const user = userEvent.setup()
    const labels = Array.from({ length: 20 }, (_, i) => `Ingredient ${i + 1}`)
    render(
      <ComparisonBody products={[make('a', [], inci(...labels)), make('b', [], inci('Aqua'))]} />
    )
    const table = screen.getByRole('table', { name: 'Formules' })
    expect(within(table).getAllByRole('rowheader')).toHaveLength(15)
    const toggle = screen.getByRole('button', { name: 'Voir toute la formule' })
    await user.click(toggle)
    expect(within(table).getAllByRole('rowheader')).toHaveLength(20)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  it('withholds shared marks when one product has no INCI on file', () => {
    const a = make('a', [], inci('Aqua', 'Glycerin'))
    render(<ComparisonBody products={[a, make('b', [])]} />)
    expect(screen.getByText(/Liste INCI non renseignée : X b/)).toBeDefined()
    expect(screen.queryByRole('radio')).toBeNull()
    expect(formulaCells(1)).toEqual(['Aqua', 'Liste non renseignée'])
  })

  it('says so when no product has an INCI on file', () => {
    render(<ComparisonBody products={[make('a', []), make('b', [])]} />)
    expect(screen.getByText(/aucune liste INCI renseignée/i)).toBeDefined()
    expect(screen.queryByRole('table', { name: 'Formules' })).toBeNull()
  })

  it('preserves known alerts when another product has no ingredient list', () => {
    render(<ComparisonBody products={[make('a', [ing('parfum', ['alert'])]), make('b', [])]} />)
    expect(screen.getByRole('heading', { name: /vigilances/i })).toBeDefined()
    expect(screen.getByText('parfum')).toBeDefined()
  })

  it('renders shared actives in signals section', () => {
    const a = make('a', [ing('water'), ing('niacinamide', ['active'])])
    const b = make('b', [ing('water'), ing('niacinamide', ['active'])])
    render(<ComparisonBody products={[a, b]} />)
    expect(screen.getByText(SIGNALS_LABELS.actives)).toBeDefined()
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
})

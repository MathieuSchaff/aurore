import type { EnrichedComparisonProduct } from '@aurore/shared'

import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/test/utils'
import { SignalsSection } from '../components/SignalsSection'

type Ingredient = EnrichedComparisonProduct['ingredients'][number]
const ingredient = (
  slug: string,
  inciName: string,
  signals: Ingredient['signals'] = []
): Ingredient => ({ id: slug, slug, inciName, signals })
const product = (id: string, ingredients: Ingredient[]): EnrichedComparisonProduct => ({
  id,
  name: `Formule ${id}`,
  brand: 'Même marque',
  slug: id,
  kind: 'serum',
  imageUrl: null,
  unit: 'bottle',
  texture: null,
  inciTokens: null,
  totalAmount: null,
  amountUnit: null,
  priceCents: null,
  pricePer: null,
  ingredients,
  tags: [],
})
const retinol = ingredient('retinol', 'Rétinol', ['active'])
const glycolic = ingredient('glycolic-acid', 'Acide glycolique', ['active'])
const water = ingredient('water', 'Eau')

describe('SignalsSection', () => {
  it('names products for unshared actives and each alert instead of a ratio', () => {
    renderWithProviders(
      <SignalsSection
        products={[
          product('A', [retinol, ingredient('parfum', 'Parfum', ['alert'])]),
          product('B', [water, ingredient('parfum', 'Parfum', ['alert'])]),
          product('C', [water]),
        ]}
      />
    )
    const active = screen.getByRole('article', { name: /actifs renseignés/i })
    expect(active.textContent).toContain('Rétinol')
    expect(active.textContent).toContain('Même marque Formule A')
    expect(active.textContent).not.toMatch(/Formule B|Formule C/)
    const alert = screen.getByRole('article', { name: /vigilances/i })
    expect(alert.textContent).toMatch(/Parfum.*Même marque Formule A.*Même marque Formule B/s)
    expect(alert.textContent).not.toMatch(/Formule C|2\/3/)
    expect(screen.queryByText(/aucun signal à signaler/i)).toBeNull()
  })

  it.each([
    { first: [retinol, glycolic], second: [water], same: true, between: false },
    { first: [retinol], second: [glycolic], same: false, between: true },
    { first: [retinol, glycolic], second: [retinol], same: true, between: true },
  ])(
    'describes pair provenance without an association verdict (%#)',
    ({ first, second, same, between }) => {
      renderWithProviders(<SignalsSection products={[product('A', first), product('B', second)]} />)
      const pairs = screen.getByRole('article', { name: /paires d.ingrédients repérées/i })
      expect(within(pairs).getByText(/Rétinol \+ Acide glycolique/)).toBeDefined()
      expect(pairs.textContent).not.toMatch(
        /retinol|glycolic-acid|irritante|alterner|à espacer|éviter|conflit/i
      )
      const sameFormula = within(pairs).queryByText(/dans une même formule/i)
      expect(Boolean(sameFormula)).toBe(same)
      if (sameFormula) {
        expect(sameFormula.textContent).toContain('Même marque Formule A')
        expect(sameFormula.textContent).not.toContain('Formule B')
      }
      const cross = within(pairs).queryByText(/répartis entre produits/i)
      expect(Boolean(cross)).toBe(between)
      if (cross) expect(cross.textContent).toMatch(/Même marque Formule A.*Même marque Formule B/s)
      expect(screen.getByText(/ne permet pas de conclure.*utilisation ensemble/i)).toBeDefined()
    }
  )

  it('names missing lists while retaining known signals, then removes the missing-data message', () => {
    const { rerender } = renderWithProviders(
      <SignalsSection products={[product('A', [retinol]), product('B', [])]} />
    )
    expect(screen.getByRole('article', { name: /actifs renseignés/i }).textContent).toContain(
      'Rétinol'
    )
    expect(screen.getByText(/liste d.ingrédients non renseignée/i).textContent).toContain(
      'Même marque Formule B'
    )
    rerender(<SignalsSection products={[product('A', [retinol]), product('B', [water])]} />)
    expect(screen.queryByText(/liste d.ingrédients non renseignée/i)).toBeNull()
  })

  it('limits the meaning of an empty detection even when ingredient lists are nonempty', () => {
    renderWithProviders(
      <SignalsSection products={[product('A', [water]), product('B', [water])]} />
    )
    expect(screen.getByText(/aucun repère détecté dans les données renseignées/i)).toBeDefined()
    expect(screen.getByText(/repérage n.est pas exhaustif/i)).toBeDefined()
    expect(screen.queryByText(/aucun signal à signaler/i)).toBeNull()
  })
})

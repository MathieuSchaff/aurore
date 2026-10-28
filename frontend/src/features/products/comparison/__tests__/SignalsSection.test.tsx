import type { EnrichedComparisonProduct } from '@aurore/shared'

import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/utils'
import { SignalsSection } from '../components/SignalsSection'

vi.mock('@tanstack/react-router', async () => {
  const { LinkStub, createLinkStub } = await import('@/test/mocks/router')
  return { Link: LinkStub, createLink: createLinkStub }
})

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
  inciTokens: ingredients.length
    ? ingredients.map((i) => ({
        label: i.inciName,
        key: i.slug,
        ...(i.slug === 'parfum' ? { comparisonMarker: 'fragrance' as const } : {}),
      }))
    : null,
  totalAmount: null,
  amountUnit: null,
  priceCents: null,
  pricePer: null,
  actives: ingredients
    .filter((i) => i.signals.includes('active'))
    .map((i) => ({
      key: i.slug,
      name: i.inciName,
      ingredientSlug: i.slug,
      functions: [],
      cosingRef: null,
    })),
  ingredients,
  tags: [],
})
const retinol = ingredient('retinol', 'Rétinol', ['active'])
const glycolic = ingredient('glycolic-acid', 'Acide glycolique', ['active'])
const water = ingredient('water', 'Eau')

describe('SignalsSection', () => {
  it('shows named formula facts without alert language or a counter', () => {
    const p = product('A', [])
    p.inciTokens = [
      { key: 'parfum', label: 'Parfum', comparisonMarker: 'fragrance', ingredientSlug: 'parfum' },
      { key: 'alcohol denat', label: 'Alcohol Denat.', comparisonMarker: 'denatured-alcohol' },
    ]
    renderWithProviders(<SignalsSection products={[p, product('B', [])]} />)
    const facts = within(screen.getByRole('article', { name: 'Parfum et alcool dénaturé' }))
    expect(facts.getByRole('link', { name: 'Parfum' })).toHaveAttribute(
      'href',
      '/ingredients/parfum'
    )
    expect(facts.getByText('Alcohol Denat.')).toBeVisible()
    expect(facts.queryByRole('link', { name: 'Alcohol Denat.' })).not.toBeInTheDocument()
    expect(facts.getByText('Mention de parfum')).toBeVisible()
    expect(facts.queryByText(/^2$/)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/allergènes ou sensibilisants|vigilances|sans parfum/i)
    ).not.toBeInTheDocument()
    expect(screen.getByText(/liste d.ingrédients non renseignée/i)).toHaveTextContent('Formule B')
  })

  it('links the active sheet, translates known functions and omits the counter', () => {
    const p = product('A', [retinol])
    p.actives = p.actives.map((active) => ({
      ...active,
      functions: ['SKIN CONDITIONING', 'SKIN CONDITIONING - MISCELLANEOUS'],
    }))
    renderWithProviders(<SignalsSection products={[p]} />)
    const active = within(screen.getByRole('article', { name: /actifs renseignés/i }))
    expect(active.getByRole('link', { name: 'Rétinol' })).toHaveAttribute(
      'href',
      '/ingredients/retinol'
    )
    expect(active.getByText('Soin de la peau')).toBeVisible()
    expect(active.queryByText(/^1$/)).not.toBeInTheDocument()
    expect(active.getByRole('link', { name: 'CosIng' })).toBeVisible()
  })

  it('keeps ambiguous names as text and does not invent missing roles', () => {
    const p = product('A', [retinol])
    p.actives = p.actives.map((active) => ({
      ...active,
      ingredientSlug: null,
      functions: ['UNKNOWN'],
    }))
    renderWithProviders(<SignalsSection products={[p]} />)
    expect(screen.getByText('Rétinol')).toBeVisible()
    expect(screen.queryByRole('link', { name: 'Rétinol' })).not.toBeInTheDocument()
    expect(screen.getByText('Rôle non renseigné.')).toBeVisible()
  })

  it('does not call a raw INCI list missing when there are no linked sheets', () => {
    const p = product('A', [])
    p.inciTokens = [{ label: 'Aqua', key: 'aqua' }]
    renderWithProviders(<SignalsSection products={[p]} />)
    expect(screen.queryByText(/liste d.ingrédients non renseignée/i)).not.toBeInTheDocument()
  })

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
    const alert = screen.getByRole('article', { name: /parfum et alcool dénaturé/i })
    expect(alert.textContent).toMatch(/Parfum.*Même marque Formule A.*Même marque Formule B/s)
    expect(alert.textContent).not.toMatch(/Formule C|2\/3/)
    expect(screen.queryByText(/aucun signal à signaler/i)).toBeNull()
  })

  it.each([
    { first: [retinol, glycolic], second: [water] },
    { first: [retinol], second: [glycolic] },
    { first: [retinol, glycolic], second: [retinol] },
  ])(
    'keeps actives without pairing ingredients or discussing combined use (%#)',
    ({ first, second }) => {
      renderWithProviders(<SignalsSection products={[product('A', first), product('B', second)]} />)
      const actives = screen.getByRole('article', { name: /actifs renseignés/i })
      expect(within(actives).getByText('Rétinol')).toBeVisible()
      expect(within(actives).getByText('Acide glycolique')).toBeVisible()
      expect(
        screen.queryByRole('article', { name: /paires d.ingrédients/i })
      ).not.toBeInTheDocument()
      expect(screen.queryByText(/utilisation ensemble/i)).not.toBeInTheDocument()
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

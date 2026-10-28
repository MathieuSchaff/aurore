import type { EnrichedComparisonProduct } from '@aurore/shared'

import { describe, expect, it } from 'vitest'

import { computeActives, computeFormulaMarkers } from '../helpers/aggregations'

const ing = (id: string, slug: string, signals: ('active' | 'alert')[] = []) => ({
  id,
  inciName: slug,
  slug,
  signals,
})

const prod = (id: string, ingredients: ReturnType<typeof ing>[]): EnrichedComparisonProduct => ({
  id,
  name: id,
  brand: 'X',
  kind: 'serum',
  slug: id,
  imageUrl: null,
  unit: 'bottle',
  texture: null,
  totalAmount: null,
  amountUnit: null,
  priceCents: null,
  pricePer: null,
  inciTokens: null,
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

describe('computeActives', () => {
  it('does not choose one sheet when product domains resolve the same substance differently', () => {
    const a = prod('a', [])
    const b = prod('b', [])
    a.actives = [
      {
        key: 'Niacinamide',
        name: 'Vitamine B3',
        ingredientSlug: 'b3',
        functions: ['SMOOTHING'],
        cosingRef: '35499',
      },
    ]
    b.actives = a.actives.map((active) => ({ ...active, ingredientSlug: 'b3-hair' }))
    expect(computeActives([a, b])[0]).toMatchObject({
      name: 'Niacinamide',
      ingredientSlug: null,
      presentIn: ['a', 'b'],
    })
  })

  it('groups canonical identities independently of names and slugs', () => {
    const a = prod('a', [])
    const b = prod('b', [])
    a.actives = [
      {
        key: 'Niacinamide',
        name: 'Vitamine B3',
        ingredientSlug: 'b3',
        functions: ['SMOOTHING'],
        cosingRef: '35499',
      },
    ]
    b.actives = a.actives.map((active) => ({ ...active, name: 'Niacinamide' }))
    expect(computeActives([a, b])).toEqual([{ ...a.actives[0], presentIn: ['a', 'b'] }])
  })

  it('attributes common, partially shared and single-product actives', () => {
    const a = prod('a', [
      ing('1', 'water'),
      ing('2', 'niacinamide', ['active']),
      ing('3', 'retinol', ['active']),
    ])
    const b = prod('b', [ing('2', 'niacinamide', ['active'])])
    const c = prod('c', [ing('4', 'panthenol', ['active'])])
    expect(
      computeActives([a, b, c]).map((i) => ({
        slug: i.ingredientSlug,
        inciName: i.name,
        presentIn: i.presentIn,
      }))
    ).toEqual([
      { slug: 'niacinamide', inciName: 'niacinamide', presentIn: ['a', 'b'] },
      { slug: 'retinol', inciName: 'retinol', presentIn: ['a'] },
      { slug: 'panthenol', inciName: 'panthenol', presentIn: ['c'] },
    ])
  })
})

describe('computeFormulaMarkers', () => {
  it('attributes raw formula markers without requiring linked ingredient sheets', () => {
    const a = prod('a', [])
    const b = prod('b', [])
    const c = prod('c', [ing('1', 'parfum', ['alert'])])
    const parfum = { key: 'parfum', label: 'Parfum', comparisonMarker: 'fragrance' as const }
    a.inciTokens = [parfum, parfum, { key: 'aqua', label: 'Aqua' }]
    b.inciTokens = [
      parfum,
      { key: 'alcohol denat', label: 'Alcohol Denat.', comparisonMarker: 'denatured-alcohol' },
    ]
    expect(computeFormulaMarkers([a, b, c])).toEqual([
      { token: parfum, presentIn: ['a', 'b'] },
      {
        token: {
          key: 'alcohol denat',
          label: 'Alcohol Denat.',
          comparisonMarker: 'denatured-alcohol',
        },
        presentIn: ['b'],
      },
    ])
  })

  it('keeps a shared name unlinked when product sheets disagree', () => {
    const a = prod('a', [])
    const b = prod('b', [])
    a.inciTokens = [
      { key: 'parfum', label: 'Parfum', comparisonMarker: 'fragrance', ingredientSlug: 'parfum' },
    ]
    b.inciTokens = [{ key: 'parfum', label: 'Parfum', comparisonMarker: 'fragrance' }]
    expect(computeFormulaMarkers([a, b])[0]?.token.ingredientSlug).toBeUndefined()
  })
})

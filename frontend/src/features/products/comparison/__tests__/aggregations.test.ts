import type { EnrichedComparisonProduct } from '@aurore/shared'

import { describe, expect, it } from 'vitest'

import { computeActives, computeAlerts, computeIngredientPairs } from '../helpers/aggregations'

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
  ingredients,
  tags: [],
})

describe('computeActives', () => {
  it('attributes common, partially shared and single-product actives', () => {
    const a = prod('a', [
      ing('1', 'water'),
      ing('2', 'niacinamide', ['active']),
      ing('3', 'retinol', ['active']),
    ])
    const b = prod('b', [ing('2', 'niacinamide', ['active'])])
    const c = prod('c', [ing('4', 'panthenol', ['active'])])
    expect(computeActives([a, b, c])).toEqual([
      { slug: 'niacinamide', inciName: 'niacinamide', presentIn: ['a', 'b'] },
      { slug: 'retinol', inciName: 'retinol', presentIn: ['a'] },
      { slug: 'panthenol', inciName: 'panthenol', presentIn: ['c'] },
    ])
  })
})

describe('computeAlerts', () => {
  it('reports each alert ingredient with present-in count', () => {
    const a = prod('a', [ing('1', 'parfum', ['alert']), ing('2', 'water')])
    const b = prod('b', [ing('1', 'parfum', ['alert'])])
    const c = prod('c', [ing('3', 'alcool-denat', ['alert'])])
    const alerts = computeAlerts([a, b, c])
    expect(alerts.find((x) => x.slug === 'parfum')?.presentIn).toEqual(['a', 'b'])
    expect(alerts.find((x) => x.slug === 'alcool-denat')?.presentIn).toEqual(['c'])
  })
})

describe('computeIngredientPairs', () => {
  it.each([
    { lists: [['retinol', 'glycolic-acid'], ['water']], sameFormula: ['a'], betweenProducts: [] },
    { lists: [['retinol'], ['glycolic-acid']], sameFormula: [], betweenProducts: [['a', 'b']] },
    {
      lists: [['retinol', 'glycolic-acid'], ['retinol'], ['water']],
      sameFormula: ['a'],
      betweenProducts: [['a', 'b']],
    },
    {
      lists: [
        ['retinol', 'glycolic-acid'],
        ['retinol', 'glycolic-acid'],
      ],
      sameFormula: ['a', 'b'],
      betweenProducts: [['a', 'b']],
    },
    { lists: [['retinol', 'glycolic-acid'], []], sameFormula: ['a'], betweenProducts: [] },
  ])(
    'keeps formula and cross-product occurrences separate (%#)',
    ({ lists, sameFormula, betweenProducts }) => {
      const products = lists.map((slugs, index) =>
        prod(
          String.fromCharCode(97 + index),
          slugs.map((slug) => ing(slug, slug))
        )
      )
      const pairs = computeIngredientPairs(products)
      expect(pairs).toHaveLength(1)
      expect(pairs[0]).toMatchObject({ sameFormula, betweenProducts })
      expect(pairs[0]?.a.inciName).toBe('retinol')
      expect(pairs[0]?.b.inciName).toBe('glycolic-acid')
      expect(pairs[0]).not.toHaveProperty('severity')
      expect(pairs[0]).not.toHaveProperty('note')
    }
  )

  it('does not invent a pair when its second ingredient is absent or unknown', () => {
    expect(computeIngredientPairs([prod('a', [ing('1', 'retinol')]), prod('b', [])])).toEqual([])
  })
})

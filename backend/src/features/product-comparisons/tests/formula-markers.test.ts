import { describe, expect, it } from 'bun:test'

import { listInciTokens } from '../../../lib/inci-facts'
import { markComparisonTokens } from '../formula-markers'

describe('comparison formula markers', () => {
  it('distinguishes declared perfume, named components and denatured alcohol', () => {
    const tokens = markComparisonTokens(
      listInciTokens(
        'Aqua, Parfum (Fragrance), Linalool, Citral, Alcohol Denat., SD Alcohol 40-B, Alcool dénaturé'
      )
    )
    expect(tokens?.map((token) => token.comparisonMarker)).toEqual([
      undefined,
      'fragrance',
      'fragrance-component',
      'fragrance-component',
      'denatured-alcohol',
      'denatured-alcohol',
      'denatured-alcohol',
    ])
    expect(tokens?.[1]?.label).toBe('Parfum (Fragrance)')
  })

  it('does not flag plain or fatty alcohols, preservatives or an unrecognised name', () => {
    const tokens = listInciTokens(
      'Alcohol, Cetyl Alcohol, Cetearyl Alcohol, Benzyl Alcohol, Phenoxyethanol, Methylisothiazolinone, Unknown Ingredient'
    )
    expect(markComparisonTokens(tokens)).toEqual(tokens)
  })

  it('preserves missing formulas and existing links', () => {
    expect(markComparisonTokens(null)).toBeNull()
    expect(
      markComparisonTokens([{ key: 'parfum', label: 'Parfum', ingredientSlug: 'parfum' }])
    ).toEqual([
      { key: 'parfum', label: 'Parfum', ingredientSlug: 'parfum', comparisonMarker: 'fragrance' },
    ])
  })
})

import { describe, expect, it } from 'bun:test'

import { listInciTokens } from '../../../lib/inci-facts'
import { linkFormulaTokens } from '../formula-links'

describe('linkFormulaTokens', () => {
  it('links aliases without replacing labels, ranks or repeated tokens', () => {
    const result = linkFormulaTokens(listInciTokens('Water, Unknown Ingredient, Aqua'), [
      { name: 'Eau', slug: 'eau', canonicalKey: 'Aqua' },
    ])
    expect(result).toEqual([
      { label: 'Water', key: 'water', ingredientSlug: 'eau' },
      { label: 'Unknown Ingredient', key: 'unknown ingredient' },
      { label: 'Aqua', key: 'aqua', ingredientSlug: 'eau' },
    ])
  })

  it('leaves ambiguous catalogue identities unlinked', () => {
    const tokens = listInciTokens('Aqua')
    expect(
      linkFormulaTokens(tokens, [
        { name: 'Eau', slug: 'eau', canonicalKey: 'Aqua' },
        { name: 'Water', slug: 'water', canonicalKey: 'Aqua' },
      ])
    ).toEqual(tokens)
  })

  it('keeps pigment qualifiers when selecting a sheet', () => {
    const tokens = listInciTokens('Iron Oxides (CI 77499), Titanium Dioxide [CI 77891]')
    const result = linkFormulaTokens(tokens, [
      { name: 'Oxyde de fer rouge', slug: 'red-iron', canonicalKey: 'CI 77491' },
      { name: 'Oxyde de fer noir', slug: 'black-iron', canonicalKey: 'CI 77499' },
      { name: 'Filtre UV', slug: 'uv-filter', canonicalKey: 'Titanium Dioxide' },
    ])
    expect(result?.map((token) => token.ingredientSlug)).toEqual(['black-iron', undefined])
  })

  it('links an exact catalogue name when no vendor identity exists', () => {
    expect(
      linkFormulaTokens(listInciTokens('Uncatalogued Botanical Extract'), [
        {
          name: 'Uncatalogued Botanical Extract',
          slug: 'uncatalogued-botanical',
          canonicalKey: null,
        },
      ])?.[0]?.ingredientSlug
    ).toBe('uncatalogued-botanical')
  })
})

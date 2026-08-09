import { describe, expect, it } from 'vitest'

import { avoidedIngredientNames } from '../components/FormulaReading/avoidedIngredients'

const declarable = [
  { canonicalKey: 'Parfum', name: 'Parfum' },
  { canonicalKey: 'Niacinamide', name: 'Niacinamide' },
]

describe('avoidedIngredientNames', () => {
  it('names the avoided ingredients the formula contains', () => {
    expect(
      avoidedIngredientNames(declarable, [{ canonicalKey: 'Parfum', stance: 'exclude' }])
    ).toEqual(['Parfum'])
  })

  it('says nothing about a sought ingredient', () => {
    // Product decision: `require` needs no mention. Finding the ingredient in
    // the formula is what the reader asked for.
    expect(
      avoidedIngredientNames(declarable, [{ canonicalKey: 'Niacinamide', stance: 'require' }])
    ).toEqual([])
  })

  it('ignores a rule on an ingredient this formula does not contain', () => {
    expect(
      avoidedIngredientNames(declarable, [{ canonicalKey: 'Retinol', stance: 'exclude' }])
    ).toEqual([])
  })

  it('stays silent while the preference query has no answer', () => {
    // Undefined covers both loading and failure on this SSR'd page; claiming
    // "you avoid nothing here" would deny a rule the reader already set.
    expect(avoidedIngredientNames(declarable, undefined)).toEqual([])
  })

  it('keeps formula order, not declaration order', () => {
    expect(
      avoidedIngredientNames(declarable, [
        { canonicalKey: 'Niacinamide', stance: 'exclude' },
        { canonicalKey: 'Parfum', stance: 'exclude' },
      ])
    ).toEqual(['Parfum', 'Niacinamide'])
  })
})

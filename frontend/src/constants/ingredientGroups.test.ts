import {
  DENTAL_INGREDIENT_CATEGORY_VALUES,
  HAIRCARE_INGREDIENT_CATEGORY_VALUES,
  SKINCARE_INGREDIENT_CATEGORY_VALUES,
  SUPPLEMENT_CATEGORY_VALUES,
} from '@aurore/shared'

import { describe, expect, it } from 'vitest'

import { summarizeIngredientGroups } from './ingredientGroups'

// Derived from shared, never typed by hand: a hand-written list only ever pins the categories
// someone remembered, and an unmapped one is dropped silently (a whole group disappears from
// the summary of a product). This is also the only assertion that sees an incomplete reading
// order, which the Record type cannot.
const ALL_CATEGORIES = [
  ...new Set([
    ...SKINCARE_INGREDIENT_CATEGORY_VALUES,
    ...HAIRCARE_INGREDIENT_CATEGORY_VALUES,
    ...DENTAL_INGREDIENT_CATEGORY_VALUES,
    ...SUPPLEMENT_CATEGORY_VALUES,
  ]),
]

describe('summarizeIngredientGroups', () => {
  it('labels every category the schemas accept, in any domain', () => {
    const groups = summarizeIngredientGroups(ALL_CATEGORIES)

    expect(groups).toHaveLength(ALL_CATEGORIES.length)
    expect(groups.filter(Boolean)).toHaveLength(ALL_CATEGORIES.length)
  })

  it('labels the skincare, dental and haircare categories', () => {
    expect(
      summarizeIngredientGroups([
        'actif',
        'humectant',
        'emollient',
        'filtre-uv',
        'tensioactif',
        'conditionneur',
        'abrasif',
        'excipient',
      ])
    ).toEqual([
      'actifs',
      'agents hydratants',
      'agents adoucissants',
      'filtres UV',
      'agents lavants',
      'agents conditionneurs',
      'agents abrasifs',
      'excipients de formulation',
    ])
  })

  it('reads actives first and base ingredients last, whatever the input order', () => {
    expect(summarizeIngredientGroups(['excipient', 'autre', 'vitamine', 'actif'])).toEqual([
      'actifs',
      'vitamines',
      'autres ingrédients',
      'excipients de formulation',
    ])
  })

  it('ignores empty input, null, undefined and unknown categories', () => {
    expect(summarizeIngredientGroups([])).toEqual([])
    expect(summarizeIngredientGroups([null, undefined, 'categorie-inconnue'])).toEqual([])
  })

  it('collapses a category repeated across ingredients', () => {
    expect(summarizeIngredientGroups(['actif', 'actif', 'vitamine'])).toEqual([
      'actifs',
      'vitamines',
    ])
  })
})

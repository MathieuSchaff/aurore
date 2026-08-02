import { describe, expect, it } from 'vitest'

import { summarizeIngredientGroups } from './ingredientGroups'

// The supplement categories the catalog holds today. An unmapped one is dropped
// silently, so the summary of a `complement` product loses a whole group.
const SUPPLEMENT_CATEGORIES_IN_CATALOG = [
  'vitamine',
  'mineral',
  'acide-gras',
  'antioxydant',
  'carotenoide',
  'plante',
  'prebiotique',
  'neuroactif',
  'acide-amine',
  'autre',
]

describe('summarizeIngredientGroups', () => {
  it('labels every supplement category present in the catalog', () => {
    const groups = summarizeIngredientGroups(SUPPLEMENT_CATEGORIES_IN_CATALOG)

    expect(groups).toHaveLength(SUPPLEMENT_CATEGORIES_IN_CATALOG.length)
    expect(groups.filter(Boolean)).toHaveLength(SUPPLEMENT_CATEGORIES_IN_CATALOG.length)
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

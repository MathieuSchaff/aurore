import { describe, expect, it } from 'vitest'

import { getBanScopeLabel, getBanScopeOptions } from '../banScopePresentation'

describe('ban scope presentation', () => {
  it('exposes every scope with a French label for admins', () => {
    expect(getBanScopeOptions(true)).toEqual([
      { value: 'global', label: 'Global (toutes les actions)' },
      { value: 'product_create', label: 'Création de produits' },
      { value: 'product_edit', label: 'Édition de produits' },
      { value: 'ingredient_create', label: 'Création d’ingrédients' },
      { value: 'ingredient_edit', label: 'Édition d’ingrédients' },
      { value: 'discussion_post', label: 'Publication dans les discussions' },
      { value: 'review_publish', label: 'Publication d’avis' },
      { value: 'social_post', label: 'Publication sociale' },
    ])
  })

  it('removes only the global scope for contributors', () => {
    const options = getBanScopeOptions(false)

    expect(options).toHaveLength(7)
    expect(options.some((option) => option.value === 'global')).toBe(false)
    expect(options.some((option) => option.value === 'ingredient_create')).toBe(true)
    expect(options.some((option) => option.value === 'social_post')).toBe(true)
  })

  it('maps stored enum values to labels without a raw fallback', () => {
    expect(getBanScopeLabel('ingredient_create')).toBe('Création d’ingrédients')
    expect(getBanScopeLabel('social_post')).toBe('Publication sociale')
  })
})

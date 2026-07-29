import { describe, expect, it } from 'vitest'

import type { FilterGroupConfig } from '@/component/Filter/types'
import { emptyFilters } from '@/features/products/__tests__/fixtures'
import type { FilterKey } from '@/features/products/filters'
import {
  applySearchIntent,
  inferActiveIntent,
  intentCountLabel,
  isSearchIntentAvailable,
  SEARCH_INTENTS,
} from '../SkincareFilterIntents'

function intentGroups(
  option: 'enabled' | 'disabled' | 'missing',
  count = 12
): FilterGroupConfig<FilterKey>[] {
  return [
    {
      id: 'product',
      label: 'Produit',
      defaultOpen: true,
      tier: 'essential',
      subFilters: [
        {
          key: 'product_type_v2',
          label: 'Type',
          placeholder: 'Tous',
          options:
            option === 'missing'
              ? []
              : [
                  {
                    value: 'type-hydratant',
                    label: 'Hydratant',
                    count,
                    disabled: option === 'disabled',
                  },
                ],
        },
      ],
    },
  ]
}

describe('skincare filter intents', () => {
  it('defines six product families backed by one product-type option each', () => {
    expect(SEARCH_INTENTS).toHaveLength(6)
    for (const intent of SEARCH_INTENTS) {
      expect(Object.keys(intent.filters)).toEqual(['product_type_v2'])
      expect(intent.filters.product_type_v2).toHaveLength(1)
    }
  })

  it('replaces the active family and preserves manual refinements', () => {
    const moisturizer = SEARCH_INTENTS.find((intent) => intent.id === 'moisturizer')
    const cleanser = SEARCH_INTENTS.find((intent) => intent.id === 'cleanser')
    if (!moisturizer || !cleanser) throw new Error('Test intents are missing')

    const withMoisturizer = applySearchIntent(emptyFilters(), moisturizer)
    const withManualConcern = {
      ...withMoisturizer,
      concern: ['acne-imperfections'],
    }

    expect(applySearchIntent(withManualConcern, cleanser)).toMatchObject({
      concern: ['acne-imperfections'],
      product_type_v2: ['type-nettoyant'],
    })
  })

  it('infers the exact family when only its product type is filled', () => {
    const filters = {
      ...emptyFilters(),
      product_type_v2: ['type-nettoyant'],
    }
    expect(inferActiveIntent(filters)?.id).toBe('cleanser')
  })

  it('does not infer an intent when an axis beyond the preset is filled', () => {
    const filters = {
      ...emptyFilters(),
      product_type_v2: ['type-nettoyant'],
      texture: ['texture-gel'],
    }
    expect(inferActiveIntent(filters)).toBeUndefined()
  })

  it('is available when every canonical option exists and is enabled', () => {
    const moisturizer = SEARCH_INTENTS.find((intent) => intent.id === 'moisturizer')
    if (!moisturizer) throw new Error('Test intent is missing')

    expect(isSearchIntentAvailable(moisturizer, intentGroups('enabled'))).toBe(true)
  })

  it('is unavailable when a canonical option is disabled', () => {
    const moisturizer = SEARCH_INTENTS.find((intent) => intent.id === 'moisturizer')
    if (!moisturizer) throw new Error('Test intent is missing')

    expect(isSearchIntentAvailable(moisturizer, intentGroups('disabled'))).toBe(false)
  })

  it('is unavailable when a canonical option is missing', () => {
    const moisturizer = SEARCH_INTENTS.find((intent) => intent.id === 'moisturizer')
    if (!moisturizer) throw new Error('Test intent is missing')

    expect(isSearchIntentAvailable(moisturizer, intentGroups('missing'))).toBe(false)
  })

  it('formats the product count in French and handles unavailable families', () => {
    const moisturizer = SEARCH_INTENTS.find((intent) => intent.id === 'moisturizer')
    if (!moisturizer) throw new Error('Test intent is missing')

    expect(intentCountLabel(moisturizer, intentGroups('enabled', 1_582))).toBe('1 582 produits')
    expect(intentCountLabel(moisturizer, intentGroups('enabled', 1))).toBe('1 produit')
    expect(intentCountLabel(moisturizer, intentGroups('missing'))).toBe('Indisponible')
  })
})

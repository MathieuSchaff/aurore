import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const DENTAL_ABRASIFS: IngredientInput[] = [
  {
    name: 'Silice Hydratée (Hydrated Silica)',
    slug: INGREDIENT_SLUGS.HYDRATED_SILICA,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
  {
    name: 'Carbonate de Calcium',
    slug: INGREDIENT_SLUGS.CALCIUM_CARBONATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
  {
    name: 'Bicarbonate de Soude (Sodium Bicarbonate)',
    slug: INGREDIENT_SLUGS.SODIUM_BICARBONATE_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
]

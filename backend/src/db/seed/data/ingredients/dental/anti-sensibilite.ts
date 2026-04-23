import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const DENTAL_ANTI_SENSIBILITE: IngredientInput[] = [
  {
    name: 'Nitrate de Potassium (Potassium Nitrate)',
    slug: INGREDIENT_SLUGS.POTASSIUM_NITRATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
  {
    name: 'Fluorure Stanneux (Stannous Fluoride)',
    slug: INGREDIENT_SLUGS.STANNOUS_FLUORIDE,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
]

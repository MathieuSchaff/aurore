import { INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const DENTAL_ANTI_SENSIBILITE: IngredientInput[] = [
  {
    name: 'Nitrate de Potassium (Potassium Nitrate)',
    slug: INGREDIENT_SLUGS.POTASSIUM_NITRATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
  {
    name: 'Fluorure Stanneux (Stannous Fluoride)',
    slug: INGREDIENT_SLUGS.STANNOUS_FLUORIDE,
    type: INGREDIENT_TYPES.DENTAL,
    category: INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
]

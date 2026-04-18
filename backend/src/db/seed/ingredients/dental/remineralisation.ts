import { INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const DENTAL_REMINERALISATION: IngredientInput[] = [
  {
    name: 'Hydroxyapatite',
    slug: INGREDIENT_SLUGS.HYDROXYAPATITE,
    type: INGREDIENT_TYPES.DENTAL,
    category: INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
  {
    name: 'Glycérophosphate de Calcium (Calcium Glycerophosphate)',
    slug: INGREDIENT_SLUGS.CALCIUM_GLYCEROPHOSPHATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
]

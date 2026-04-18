import { INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const DENTAL_DIVERS: IngredientInput[] = [
  {
    name: 'Xylitol',
    slug: INGREDIENT_SLUGS.XYLITOL_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
  {
    name: 'Menthol',
    slug: INGREDIENT_SLUGS.MENTHOL_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: INGREDIENT_CATEGORIES.EXCIPIENT,
    description: '',
    content: '',
  },
  {
    name: 'Laurylsulfate de Sodium (SLS)',
    slug: INGREDIENT_SLUGS.SODIUM_LAURYL_SULFATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: INGREDIENT_CATEGORIES.TENSIOACTIF,
    description: '',
    content: '',
  },
]

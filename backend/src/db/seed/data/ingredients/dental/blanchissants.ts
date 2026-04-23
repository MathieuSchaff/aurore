import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const DENTAL_BLANCHISSANTS: IngredientInput[] = [
  {
    name: "Peroxyde d'Hydrogène (Hydrogen Peroxide)",
    slug: INGREDIENT_SLUGS.HYDROGEN_PEROXIDE,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
  {
    name: 'Peroxyde de Carbamide (Carbamide Peroxide)',
    slug: INGREDIENT_SLUGS.CARBAMIDE_PEROXIDE,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
]

import { SKINCARE_INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const DENTAL_EXCIPIENTS: IngredientInput[] = [
  {
    name: 'Glycérine (Glycerin)',
    slug: INGREDIENT_SLUGS.GLYCERIN_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description: '',
    content: '',
  },
  {
    name: 'Sorbitol',
    slug: INGREDIENT_SLUGS.SORBITOL_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description: '',
    content: '',
  },
  {
    name: 'Carraghénane (Carrageenan)',
    slug: INGREDIENT_SLUGS.CARRAGEENAN_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: '',
    content: '',
  },
  {
    name: 'Gomme de Xanthane (Xanthan Gum)',
    slug: INGREDIENT_SLUGS.XANTHAN_GUM_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: '',
    content: '',
  },
]

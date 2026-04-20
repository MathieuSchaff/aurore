import { SKINCARE_INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const HAIR_AGENTS_NACRANTS: IngredientInput[] = [
  {
    name: 'Glycol Distéarate (Glycol Distearate)',
    slug: INGREDIENT_SLUGS.GLYCOL_DISTEARATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: '',
    content: '',
  },
  {
    name: 'Mica',
    slug: INGREDIENT_SLUGS.MICA_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: '',
    content: '',
  },
  {
    name: 'Dioxyde de Titane (Titanium Dioxide)',
    slug: INGREDIENT_SLUGS.TITANIUM_DIOXIDE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: '',
    content: '',
  },
]

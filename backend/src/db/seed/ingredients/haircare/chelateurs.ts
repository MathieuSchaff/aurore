import { INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const HAIR_CHELATEURS: IngredientInput[] = [
  {
    name: 'Disodium EDTA',
    slug: INGREDIENT_SLUGS.DISODIUM_EDTA_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: INGREDIENT_CATEGORIES.EXCIPIENT,
    description: '',
    content: '',
  },
  {
    name: 'Tetrasodium EDTA',
    slug: INGREDIENT_SLUGS.TETRASODIUM_EDTA,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: INGREDIENT_CATEGORIES.EXCIPIENT,
    description: '',
    content: '',
  },
  {
    name: 'Acide Phytique (Phytic Acid)',
    slug: INGREDIENT_SLUGS.PHYTIC_ACID_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: INGREDIENT_CATEGORIES.EXCIPIENT,
    description: '',
    content: '',
  },
  {
    name: 'Gluconate de Sodium (Sodium Gluconate)',
    slug: INGREDIENT_SLUGS.SODIUM_GLUCONATE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: INGREDIENT_CATEGORIES.EXCIPIENT,
    description: '',
    content: '',
  },
]

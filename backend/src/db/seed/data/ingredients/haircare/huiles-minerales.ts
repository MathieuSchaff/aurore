import { HAIRCARE_INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const HAIR_HUILES_MINERALES: IngredientInput[] = [
  {
    name: 'Huile de Paraffine (Paraffinum Liquidum)',
    slug: INGREDIENT_SLUGS.PARAFFINUM_LIQUIDUM_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description: '',
    content: '',
  },
  {
    name: 'Vaseline (Petrolatum)',
    slug: INGREDIENT_SLUGS.PETROLATUM_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description: '',
    content: '',
  },
  {
    name: 'Huile Minérale (Mineral Oil)',
    slug: INGREDIENT_SLUGS.MINERAL_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description: '',
    content: '',
  },
  {
    name: 'Céresine (Ceresin)',
    slug: INGREDIENT_SLUGS.CERESIN_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: '',
    content: '',
  },
  {
    name: 'Ozokérite (Ozokerite)',
    slug: INGREDIENT_SLUGS.OZOKERITE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: '',
    content: '',
  },
  {
    name: 'Cire Microcristalline (Cera Microcristallina)',
    slug: INGREDIENT_SLUGS.CERA_MICROCRISTALLINA_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: '',
    content: '',
  },
]

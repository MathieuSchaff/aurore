import { INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const DENTAL_ANTIMICROBIENS: IngredientInput[] = [
  {
    name: 'Fluorure de Sodium (Sodium Fluoride)',
    slug: INGREDIENT_SLUGS.SODIUM_FLUORIDE,
    type: INGREDIENT_TYPES.DENTAL,
    category: INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
  {
    name: 'Monofluorophosphate de Sodium',
    slug: INGREDIENT_SLUGS.SODIUM_MONOFLUOROPHOSPHATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
  {
    name: 'Chlorhexidine',
    slug: INGREDIENT_SLUGS.CHLORHEXIDINE,
    type: INGREDIENT_TYPES.DENTAL,
    category: INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
  {
    name: "Huile d'Arbre à Thé (Tea Tree Oil)",
    slug: INGREDIENT_SLUGS.TEA_TREE_OIL_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
  {
    name: 'Huile de Clou de Girofle / Eugénol',
    slug: INGREDIENT_SLUGS.CLOVE_OIL_EUGENOL,
    type: INGREDIENT_TYPES.DENTAL,
    category: INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
  {
    name: 'Thymol',
    slug: INGREDIENT_SLUGS.THYMOL,
    type: INGREDIENT_TYPES.DENTAL,
    category: INGREDIENT_CATEGORIES.ACTIF,
    description: '',
    content: '',
  },
]

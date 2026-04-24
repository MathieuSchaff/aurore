import { DENTAL_INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const DENTAL_BLANCHISSANTS: IngredientInput[] = [
  {
    name: "Peroxyde d'Hydrogène (Hydrogen Peroxide)",
    slug: INGREDIENT_SLUGS.HYDROGEN_PEROXIDE,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.ACTIF,
    description: "L'agent de blanchiment chimique le plus puissant.",
    content:
      "Le peroxyde d'hydrogène pénètre dans l'émail pour briser les molécules responsables des colorations profondes. En raison de sa puissance, sa concentration est très strictement réglementée dans les produits en vente libre pour éviter d'irriter les gencives ou de fragiliser les dents.",
  },
  {
    name: 'Peroxyde de Carbamide (Carbamide Peroxide)',
    slug: INGREDIENT_SLUGS.CARBAMIDE_PEROXIDE,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.ACTIF,
    description: 'Une forme stable de peroxyde souvent utilisée pour le blanchiment à domicile.',
    content:
      "Le peroxyde de carbamide se décompose lentement en libérant du peroxyde d'hydrogène. Cette libération progressive le rend plus doux et permet une application prolongée (souvent via des gouttières), ce qui est idéal pour un blanchiment progressif avec moins de sensibilité.",
  },
]

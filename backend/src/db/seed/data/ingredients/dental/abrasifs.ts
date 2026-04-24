import { DENTAL_INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const DENTAL_ABRASIFS: IngredientInput[] = [
  {
    name: 'Silice Hydratée (Hydrated Silica)',
    slug: INGREDIENT_SLUGS.HYDRATED_SILICA,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.ABRASIF,
    description: 'Un agent polissant doux utilisé pour éliminer la plaque.',
    content:
      "La silice hydratée est un abrasif courant qui aide à nettoyer mécaniquement la surface des dents sans rayer l'émail. Elle est efficace pour éliminer les débris alimentaires et les taches de surface légères (café, thé), laissant les dents plus lisses.",
  },
  {
    name: 'Carbonate de Calcium',
    slug: INGREDIENT_SLUGS.CALCIUM_CARBONATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.ABRASIF,
    description: 'Un minéral naturel qui nettoie et renforce les dents.',
    content:
      'Le carbonate de calcium agit comme un agent de polissage doux. En plus de son action nettoyante, il aide à neutraliser les acides de la plaque et apporte une source de calcium qui peut contribuer à la santé globale des tissus dentaires.',
  },
  {
    name: 'Bicarbonate de Soude (Sodium Bicarbonate)',
    slug: INGREDIENT_SLUGS.SODIUM_BICARBONATE_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.ABRASIF,
    description: 'Un ingrédient polyvalent pour un nettoyage profond et une haleine fraîche.',
    content:
      "Le bicarbonate de soude est apprécié pour ses propriétés polissantes et neutralisantes. Il aide à dissoudre les taches de surface, équilibre le pH buccal pour limiter la prolifération bactérienne et possède une action désodorisante naturelle pour l'haleine.",
  },
]

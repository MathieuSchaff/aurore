import { DENTAL_INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const DENTAL_ANTI_SENSIBILITE: IngredientInput[] = [
  {
    name: 'Nitrate de Potassium (Potassium Nitrate)',
    slug: INGREDIENT_SLUGS.POTASSIUM_NITRATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.ACTIF,
    description: 'Un agent désensibilisant qui calme les nerfs de la dent.',
    content:
      'Le nitrate de potassium agit en pénétrant dans les tubules dentinaires pour atteindre les terminaisons nerveuses. Il aide à bloquer la transmission des signaux de douleur causés par le froid, le chaud ou les aliments sucrés, offrant ainsi un soulagement efficace pour les dents sensibles.',
  },
  {
    name: 'Fluorure Stanneux (Stannous Fluoride)',
    slug: INGREDIENT_SLUGS.STANNOUS_FLUORIDE,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Un actif multi-action qui protège contre les caries, la plaque et la sensibilité.',
    content:
      'Le fluorure stanneux est unique car il offre une protection contre les caries tout en créant une barrière protectrice sur la dentine exposée. Il possède également des propriétés antibactériennes qui aident à réduire la plaque et à prévenir les problèmes de gencives (gingivite).',
  },
]

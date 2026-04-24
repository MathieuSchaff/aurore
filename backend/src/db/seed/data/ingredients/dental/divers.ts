import { DENTAL_INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const DENTAL_DIVERS: IngredientInput[] = [
  {
    name: 'Xylitol',
    slug: INGREDIENT_SLUGS.XYLITOL_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.ACTIF,
    description: 'Un sucre naturel qui combat les bactéries responsables des caries.',
    content:
      "Le xylitol est un édulcorant naturel issu du bouleau qui ne peut pas être fermenté par les bactéries buccales. Il aide à réduire la formation de la plaque, favorise la salivation et neutralise l'acidité, créant un environnement défavorable aux caries.",
  },
  {
    name: 'Menthol',
    slug: INGREDIENT_SLUGS.MENTHOL_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: "L'ingrédient phare pour une haleine fraîche.",
    content:
      "Le menthol est extrait de l'huile de menthe. Il procure une sensation de fraîcheur immédiate et aide à masquer les odeurs désagréables, tout en ayant de légères propriétés antiseptiques qui contribuent à l'hygiène globale.",
  },
  {
    name: 'Laurylsulfate de Sodium (SLS)',
    slug: INGREDIENT_SLUGS.SODIUM_LAURYL_SULFATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description: 'Un agent moussant puissant présent dans de nombreux dentifrices.',
    content:
      "Le SLS est responsable de la mousse lors du brossage, ce qui aide à répartir les actifs dans toute la bouche. Cependant, chez certaines personnes sensibles, il peut favoriser l'apparition d'aphtes ou causer une sécheresse buccale.",
  },
]

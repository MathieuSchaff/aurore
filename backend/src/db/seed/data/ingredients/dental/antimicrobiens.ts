import { DENTAL_INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const DENTAL_ANTIMICROBIENS: IngredientInput[] = [
  {
    name: 'Fluorure de Sodium (Sodium Fluoride)',
    slug: INGREDIENT_SLUGS.SODIUM_FLUORIDE,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.ACTIF,
    description: "L'actif de référence pour la prévention des caries.",
    content:
      "Le fluorure de sodium renforce l'émail des dents en le rendant plus résistant aux attaques acides des bactéries. Il favorise également la reminéralisation des zones de l'émail qui ont commencé à s'affaiblir, arrêtant ainsi le processus de formation des caries dès le début.",
  },
  {
    name: 'Monofluorophosphate de Sodium',
    slug: INGREDIENT_SLUGS.SODIUM_MONOFLUOROPHOSPHATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.ACTIF,
    description: 'Une source de fluor efficace pour protéger et renforcer les dents.',
    content:
      'Moins réactif que le fluorure de sodium pur, le monofluorophosphate de sodium libère du fluor au contact de la salive. Il est souvent utilisé dans des formules complexes pour assurer une protection durable contre la déminéralisation et renforcer la structure dentaire.',
  },
  {
    name: 'Chlorhexidine',
    slug: INGREDIENT_SLUGS.CHLORHEXIDINE,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.ACTIF,
    description: "L'antiseptique de référence pour les problèmes de gencives.",
    content:
      "La chlorhexidine est un agent antibactérien puissant utilisé pour lutter contre la plaque dentaire et traiter l'inflammation des gencives (gingivite). Son action est prolongée car elle se fixe sur les tissus buccaux pour libérer ses bienfaits pendant plusieurs heures.",
  },
  {
    name: "Huile d'Arbre à Thé (Tea Tree Oil)",
    slug: INGREDIENT_SLUGS.TEA_TREE_OIL_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.ACTIF,
    description: 'Une alternative naturelle aux antibactériens classiques.',
    content:
      "L'huile de tea tree possède des propriétés antiseptiques et anti-inflammatoires naturelles. En hygiène buccale, elle aide à réduire la prolifération des bactéries responsables de la mauvaise haleine et aide à apaiser les gencives irritées.",
  },
  {
    name: 'Huile de Clou de Girofle / Eugénol',
    slug: INGREDIENT_SLUGS.CLOVE_OIL_EUGENOL,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.ACTIF,
    description: "L'ingrédient traditionnel pour le soulagement des douleurs dentaires.",
    content:
      "Riche en eugénol, l'huile de clou de girofle est reconnue pour ses vertus anesthésiantes et antibactériennes. Elle est particulièrement efficace pour calmer les douleurs dentaires mineures et assainir la bouche.",
  },
  {
    name: 'Thymol',
    slug: INGREDIENT_SLUGS.THYMOL,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.ACTIF,
    description: 'Un composant naturel du thym aux propriétés antiseptiques.',
    content:
      "Le thymol est un agent antibactérien qui aide à prévenir la formation de la plaque dentaire et combat la mauvaise haleine (halitose). Il apporte également une sensation de propreté et d'assainissement en profondeur.",
  },
]

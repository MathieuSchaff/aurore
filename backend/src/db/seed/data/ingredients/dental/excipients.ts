import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

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
  {
    name: 'Gomme de Cellulose (Cellulose Gum / CMC)',
    slug: INGREDIENT_SLUGS.CELLULOSE_GUM_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      'Dérivé cellulosique carboxyméthylé très répandu comme épaississant et stabilisant dans les dentifrices, qui donne leur texture pâteuse caractéristique.',
    content: `
# Gomme de Cellulose (CMC — Carboxyméthylcellulose Sodique)

La gomme de cellulose (ou CMC — Carboxymethylcellulose sodium) est l'un des épaississants les plus utilisés en formulation dentaire, présente dans plus de 8 produits du catalogue. Elle rivalise avec la gomme de xanthane comme agent de texture de référence.

## INCI
**CELLULOSE GUM** (nom INCI) / Sodium Carboxymethylcellulose

## Rôle en formule dentaire
- **Épaississant rhéologique** : crée un réseau polymère en solution aqueuse qui augmente la viscosité et donne la texture semi-solide du dentifrice. Concentrations typiques : 0,5–2 %.
- **Stabilisant** : maintient la suspension homogène des abrasifs (silice, carbonate de calcium) et des actifs insolubles dans la base aqueuse.
- **Filmogène léger** : forme un film protecteur sur les muqueuses et l'émail en soutien d'autres actifs.
- **Compatible fluorures** : contrairement à certains épaississants, ne complexe pas les ions fluorure et n'en réduit pas la biodisponibilité.

## Différence avec la gomme de xanthane
La xanthane est d'origine microbienne (fermentation) et plus résistante aux variations de salinité. La CMC est d'origine végétale (cellulose modifiée) et légèrement plus sensible aux électrolytes forts — les formulateurs choisissent selon le profil ionique de la formule.

## Sécurité
Excipient alimentaire approuvé (E466), aucune toxicité orale ni mucosale. Tolérance universelle.
`,
  },
]

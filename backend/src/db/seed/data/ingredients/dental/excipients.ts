import { DENTAL_INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const DENTAL_EXCIPIENTS: IngredientInput[] = [
  {
    name: 'Glycérine (Glycerin)',
    slug: INGREDIENT_SLUGS.GLYCERIN_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Un agent humectant qui empêche le dentifrice de sécher.',
    content:
      "La glycérine est utilisée pour maintenir la texture onctueuse du dentifrice. Elle aide également à préserver l'humidité de la formule et donne une sensation de douceur en bouche lors du brossage.",
  },
  {
    name: 'Sorbitol',
    slug: INGREDIENT_SLUGS.SORBITOL_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Un agent de texture qui apporte une touche sucrée sans risque pour les dents.',
    content:
      "Le sorbitol sert à la fois d'humectant pour garder le produit souple et d'édulcorant non cariogène. Contrairement au sucre, il n'est pas utilisé par les bactéries pour produire des acides, ce qui le rend idéal pour les produits d'hygiène buccale.",
  },
  {
    name: 'Carraghénane (Carrageenan)',
    slug: INGREDIENT_SLUGS.CARRAGEENAN_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: "Un gélifiant naturel extrait d'algues rouges.",
    content:
      "Le carraghénane est utilisé pour stabiliser la texture du dentifrice et s'assurer que les composants restent bien mélangés. Il aide à donner au produit sa consistance parfaite pour qu'il tienne bien sur la brosse à dents.",
  },
  {
    name: 'Gomme de Xanthane (Xanthan Gum)',
    slug: INGREDIENT_SLUGS.XANTHAN_GUM_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Un épaississant naturel pour une texture homogène.',
    content:
      'La gomme de xanthane est un agent de texture qui permet de lier les ingrédients entre eux. Elle assure que le dentifrice reste homogène et facile à extraire du tube, tout en contribuant à une sensation agréable en bouche.',
  },
  {
    name: 'Gomme de Cellulose (Cellulose Gum / CMC)',
    slug: INGREDIENT_SLUGS.CELLULOSE_GUM_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.EXCIPIENT,
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

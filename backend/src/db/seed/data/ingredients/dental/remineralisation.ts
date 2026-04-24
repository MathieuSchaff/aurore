import { DENTAL_INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const DENTAL_REMINERALISATION: IngredientInput[] = [
  {
    name: 'Hydroxyapatite',
    slug: INGREDIENT_SLUGS.HYDROXYAPATITE,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.ACTIF,
    description: `Le constituant principal de l'émail (97%), capable de
    reconstruire la dent sans fluor`,
    content: `L'hydroxyapatite — formule
    Ca10(PO4)6(OH)2 — représente environ 97% de l'émail dentaire et 70% de la
    dentine. C'est l'ingrédient biomimétique par excellence : au lieu de
    simplement protéger la dent, il la reconstruit avec son matériau
    d'origine.\n\n### Mécanisme d'action\nContrairement au fluor qui crée une
    couche de fluorapatite, l'hydroxyapatite dépose des cristaux identiques à la
    matrice biologique. Elle agit comme un réservoir de calcium et de phosphate
    qui se libèrent lors des attaques acides pour reminéraliser les zones
    affaiblies (white spots). \n\n### Nano vs Micro-particules\nL'efficacité
    dépend de la taille : la Nano-hydroxyapatite (nHAp), avec des particules de
    20 à 80 nm, est assez petite pour pénétrer profondément dans les tubules
    dentinaires (1-2 µm) et les micro-fissures de l'émail. La forme 'micro' agit
    plus en surface comme un bouclier protecteur et polissant.\n\n### Bénéfices
    démontrés\n- **Anti-caries** : Des études cliniques montrent une efficacité
    équivalente au fluorure (1450 ppm) pour prévenir les caries, sans risque de
    toxicité (idéal pour les enfants et femmes enceintes).\n- **Sensibilité** :
    Elle scelle physiquement les tubules ouverts, réduisant la douleur liée au
    chaud et au froid de manière durable.\n- **Blancheur naturelle** : En
    lissant la surface de l'émail, elle améliore la réflexion de la lumière et
    empêche l'adhérence de la plaque et des taches (café, thé).\n\n### Sécurité
    et Usage\nValidée par le SCCS jusqu'à 10%, elle est parfaitement
    biocompatible. Pour un effet optimal, il est recommandé de ne pas rincer
    immédiatement après le brossage pour laisser les ions saturer la surface
    dentaire.`,
  },
  {
    name: 'Glycérophosphate de Calcium (Calcium Glycerophosphate)',
    slug: INGREDIENT_SLUGS.CALCIUM_GLYCEROPHOSPHATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: DENTAL_INGREDIENT_CATEGORIES.ACTIF,
    description: "Un agent minéralisant qui renforce l'émail et neutralise les acides.",
    content:
      "Le glycérophosphate de calcium aide à maintenir un pH équilibré dans la bouche en neutralisant les acides produits par les bactéries. Il fournit une source de calcium et de phosphate, favorisant la reminéralisation naturelle des dents et renforçant la structure de l'émail contre les caries.",
  },
]

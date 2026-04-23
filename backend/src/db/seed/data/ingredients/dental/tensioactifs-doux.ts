import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const DENTAL_TENSIOACTIFS_DOUX: IngredientInput[] = [
  {
    name: 'Cocamidopropyl Bétaïne',
    slug: INGREDIENT_SLUGS.COCAMIDOPROPYL_BETAINE_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      "Tensioactif amphotère dérivé de l'huile de coco, utilisé comme alternative ou complément au SLS pour une mousse plus douce sur les muqueuses buccales.",
    content: `
# Cocamidopropyl Bétaïne

La cocamidopropyl bétaïne (CAPB) est un tensioactif amphotère présent dans de nombreux dentifrices et bains de bouche comme co-tensioactif ou remplacement partiel du SLS. Sa tolérance muqueuse supérieure en fait l'actif de choix dans les formules "sans SLS".

## INCI
**COCAMIDOPROPYL BETAINE**

## Structure et comportement
- **Amphotère** : porte à la fois une charge positive (ammonium quaternaire) et négative (carboxylate) selon le pH. À pH buccal (6,5–7,5), se comporte principalement comme tensioactif neutre à légèrement cationique.
- **Dérivé coco** : synthétisé à partir de l'acide laurique de l'huile de coco + diméthylaminopropylamine + chloroacétate de sodium.

## Rôle en formule dentaire
- **Moussant doux** : crée une mousse crémeuse et persistante sans l'agressivité du SLS.
- **Détergence** : solubilise les résidus alimentaires, les composés soufrés et les colorants de surface (café, thé).
- **Synergie avec le SLS** : souvent formulé *avec* le SLS (pas en remplacement total) pour en réduire l'irritation par effet tampon ionique.
- **Émulsifiant** : stabilise les émulsions huile/eau dans les formules à huiles essentielles (Botot, La Rosée).

## Avantage vs SLS
Le SLS (anionique) provoque des ulcères aphtheux chez les sujets prédisposés et altère la perception gustative. La CAPB ne présente pas ces effets aux doses formulaires.

## Sécurité
Controversée historiquement pour des impuretés de fabrication (amidoamine résiduelle), aujourd'hui largement résolue par les fabricants qualité pharma/cosmétique. CAPB pure : excellente tolérance muqueuse.

## Produits représentatifs
Sensodyne Protection Complète, Elmex (plusieurs formules), Botot Dentifrice.
`,
  },
]

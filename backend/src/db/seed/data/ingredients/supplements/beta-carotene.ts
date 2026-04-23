import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const BETA_CAROTENE: IngredientInput[] = [
  {
    name: 'Bêta-carotène',
    slug: INGREDIENT_SLUGS.BETA_CAROTENE,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.CAROTENOIDE,
    description:
      "Caroténoïde provitamine A abondant dans les fruits et légumes colorés, précurseur principal de la vitamine A (rétinol) dans l'organisme.",
    content: `
# Bêta-carotène

## Identité

Le bêta-carotène est un caroténoïde provitamine A de la famille des terpènes (C₄₀H₅₆). C'est le précurseur le plus efficace de la vitamine A (rétinol) : l'organisme le convertit selon ses besoins via l'enzyme BCO1 (bêta-carotène oxygénase 1).

**Conversion :** 1 µg de rétinol (RAE) = 12 µg de bêta-carotène alimentaire. Le taux de conversion est variable selon la génétique individuelle (polymorphismes BCO1), le statut en vitamine A et la matrice alimentaire.

## Apports recommandés (en tant que source de vitamine A)

| Population | Vitamine A (µg RAE/jour) | Équivalent bêta-carotène |
|-----------|--------------------------|--------------------------|
| Hommes adultes | 900 µg RAE | ~10,8 mg |
| Femmes adultes | 700 µg RAE | ~8,4 mg |

Ces besoins sont facilement couverts par une alimentation riche en fruits et légumes colorés.

## Sources alimentaires

| Aliment | Portion | Bêta-carotène |
|---------|---------|---------------|
| Patate douce | 100 g | 8-10 mg |
| Épinards cuits | 100 g | 6-7 mg |
| Carotte moyenne | 60 g | 5-6 mg |
| Kale | 100 g | 5-6 mg |
| Abricot sec | 100 g | 3-4 mg |
| Poivron rouge | 100 g | 2-3 mg |

L'absorption est nettement améliorée par la présence de lipides dans le repas (huile d'olive, avocat, noix) et par la cuisson, qui brise les parois cellulaires des végétaux.

## Rôles physiologiques

- **Précurseur de vitamine A :** converti en rétinol pour la vision, la différenciation cellulaire, l'immunité et la santé cutanée
- **Antioxydant :** neutralise l'oxygène singulet et les radicaux peroxyles, protège les membranes cellulaires
- **Photoprotection cutanée :** contribue à la protection endogène contre les UV (effet modeste, ne remplace pas un écran solaire)

## Supplémentation

### Quand envisager

- Alimentation très pauvre en fruits et légumes colorés
- Malabsorption des graisses (mucoviscidose, insuffisance pancréatique)
- Régimes restrictifs prolongés

### Doses étudiées

- **Alimentation :** 3-6 mg/jour couvrent les besoins pour la majorité des adultes
- **Supplémentation :** 6-15 mg/jour dans les études sur la photoprotection
- **Limite de sécurité :** pas de limite haute officielle pour le bêta-carotène alimentaire ; la supplémentation à haute dose (≥20 mg/jour) est déconseillée chez les fumeurs

## Sécurité

- **Caroténodermie :** coloration jaune-orangée de la peau à forte consommation, bénigne et réversible
- **Pas de toxicité de la vitamine A :** contrairement au rétinol préformé, le bêta-carotène ne provoque pas d'hypervitaminose A car la conversion est régulée à la baisse quand les réserves sont suffisantes

### Risque chez les fumeurs

Les études ATBC et CARET ont montré une augmentation du risque de cancer du poumon chez les fumeurs et travailleurs exposés à l'amiante supplémentés à haute dose (20-30 mg/jour). **La supplémentation en bêta-carotène isolé est contre-indiquée chez les fumeurs.**

Ce risque ne s'applique pas au bêta-carotène alimentaire.

## Limites

- Taux de conversion en vitamine A très variable selon la génétique individuelle (polymorphismes BCO1)
- Effet antioxydant plus faible que l'astaxanthine ou le lycopène
- Supplémentation isolée déconseillée chez les fumeurs
- L'alimentation reste la source préférable dans la grande majorité des cas
`,
  },
]

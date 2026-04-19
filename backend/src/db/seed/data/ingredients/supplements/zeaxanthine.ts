import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const ZEAXANTHINE: IngredientInput[] = [
  {
    name: 'Zéaxanthine',
    slug: INGREDIENT_SLUGS.ZEAXANTHINE,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.CAROTENOIDE,
    description:
      "Caroténoïde xanthophylle isomère de la lutéine, concentré au centre de la macula où il assure la protection des photorécepteurs contre la lumière bleue.",
    content: `
# Zéaxanthine

## Identité

La zéaxanthine est un caroténoïde xanthophylle (C₄₀H₅₆O₂), isomère structurel de la lutéine. Elle se distingue par sa concentration préférentielle au **centre de la fovéa** (zone de vision la plus précise), tandis que la lutéine domine en périphérie de la macula.

Comme la lutéine, la zéaxanthine n'est pas synthétisée par l'organisme et doit être apportée par l'alimentation ou la supplémentation.

## Cible quotidienne

**2 mg/jour** — dose utilisée dans l'étude AREDS2 en combinaison avec 10 mg de lutéine.

## Sources alimentaires

| Aliment | Zéaxanthine (mg/100 g) | Note |
|---------|-------------------------|------|
| Poivron orange | 1 | Source la plus riche |
| Maïs | 0,5 | Bonne source |
| Kale | 1 | Riche aussi en lutéine |
| Jaune d'œuf | 0,3 | Très biodisponible |
| Épinards cuits | 0,4 | Source complémentaire |
| Brocoli | 0,1 | Apport modeste |

La zéaxanthine est plus difficile à obtenir en quantité suffisante par l'alimentation seule que la lutéine. Le maïs et les poivrons orange sont les meilleures sources spécifiques.

Comme tous les caroténoïdes, l'absorption est améliorée par la présence de lipides dans le repas.

## Rôle physiologique

### Protection maculaire centrale

La zéaxanthine est le caroténoïde dominant au centre exact de la fovéa, là où la densité de cônes (photorécepteurs responsables de la vision des couleurs et de l'acuité) est maximale.

- **Filtre de lumière bleue :** absorbe les longueurs d'onde à haute énergie (400-500 nm)
- **Antioxydant :** protège les photorécepteurs et l'épithélium pigmentaire rétinien contre les dommages oxydatifs induits par la lumière
- **Complémentarité avec la lutéine :** la lutéine couvre la périphérie maculaire, la zéaxanthine protège le centre — ensemble, elles assurent une couverture complète du pigment maculaire

## Supplémentation

### Indication principale

- **Prévention de la DMLA avancée :** dans l'étude AREDS2, la combinaison lutéine (10 mg) + zéaxanthine (2 mg) a remplacé le bêta-carotène dans la formulation de référence, avec une efficacité équivalente et un meilleur profil de sécurité (pas de risque accru chez les fumeurs)

### Doses

- **Standard :** 2 mg/jour (en association avec 10 mg de lutéine)
- **Alimentaire :** difficile d'atteindre 2 mg/jour par l'alimentation seule sans consommation régulière de maïs ou poivrons
- **Pas de limite haute établie :** bonne tolérance aux doses étudiées

### Toujours associer à la lutéine

La zéaxanthine est rarement supplémentée seule. Le ratio 5:1 (lutéine:zéaxanthine) de l'étude AREDS2 est le standard actuel. Cette combinaison reflète le ratio naturel dans le pigment maculaire.

## Sécurité

Excellent profil de sécurité, identique à la lutéine. Pas de toxicité connue. Caroténodermie possible à très forte consommation (bénigne, réversible). Pas de risque spécifique chez les fumeurs.

## Limites

- Données cliniques principalement dans le cadre de la combinaison AREDS2 (avec lutéine, vitamines C/E, zinc, cuivre) — difficile d'isoler l'effet propre de la zéaxanthine
- Peu d'études sur la supplémentation en zéaxanthine seule
- Sources alimentaires moins abondantes que pour la lutéine
`,
  },
]

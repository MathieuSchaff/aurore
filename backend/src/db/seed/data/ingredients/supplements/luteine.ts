import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const LUTEINE: IngredientInput[] = [
  {
    name: 'Lutéine',
    slug: INGREDIENT_SLUGS.LUTEINE,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.CAROTENOIDE,
    description:
      "Caroténoïde xanthophylle concentré dans la macula de l'œil, essentiel à la protection rétinienne et associé au soutien de la fonction cognitive.",
    content: `
# Lutéine

## Identité

La lutéine est un caroténoïde xanthophylle (C₄₀H₅₆O₂) de couleur jaune-orangé. Contrairement au bêta-carotène, elle n'est pas un précurseur de la vitamine A. L'organisme ne la synthétise pas : l'apport est exclusivement alimentaire ou par supplémentation.

La lutéine se concentre préférentiellement dans la macula (zone centrale de la rétine) où, avec la zéaxanthine, elle forme le pigment maculaire. Ce pigment agit comme un filtre de lumière bleue et un bouclier antioxydant pour les photorécepteurs.

## Cible quotidienne

**10 mg/jour** — dose utilisée dans les études cliniques sur la vision et la cognition (études AREDS2 notamment).

Aucun apport journalier recommandé officiel n'est établi, mais la plupart des bénéfices cliniques sont observés à partir de 6-10 mg/jour.

## Sources alimentaires

| Aliment | Lutéine (mg/100 g) | Note |
|---------|---------------------|------|
| Chou kale | 22 | Source la plus riche |
| Épinards cuits | 12 | Absorption améliorée avec lipides |
| Brocoli | 2 | Bon complément quotidien |
| Courgettes | 2 | Facile à intégrer |
| Maïs | 0,7 | Source modeste |
| Jaune d'œuf | 0,3 | Très biodisponible malgré la faible teneur |
| Poivron orange | 1 | Source complémentaire |

**Point clé :** la lutéine est liposoluble. Son absorption est significativement améliorée par la présence de graisses dans le repas (huile d'olive, avocat, noix, jaune d'œuf). Une portion de kale ou d'épinards accompagnée d'un œuf constitue une combinaison naturelle efficace.

## Rôles physiologiques

### Protection oculaire

- **Filtre de lumière bleue :** le pigment maculaire absorbe la lumière bleue à haute énergie (400-500 nm), réduisant le stress photo-oxydatif sur les photorécepteurs
- **Antioxydant rétinien :** neutralise les radicaux libres générés par l'exposition lumineuse
- **Densité du pigment maculaire :** un pigment maculaire dense est associé à une meilleure acuité visuelle et un risque réduit de dégénérescence maculaire liée à l'âge (DMLA)

### Fonction cognitive

Des études observationnelles associent des apports élevés en lutéine à de meilleures performances cognitives, particulièrement chez les personnes âgées. La lutéine est le caroténoïde dominant dans le cerveau humain. Les mécanismes proposés incluent la protection des membranes neuronales contre le stress oxydatif.

## Supplémentation

### Indications étudiées

- **Prévention de la DMLA :** l'étude AREDS2 a montré que la lutéine (10 mg) + zéaxanthine (2 mg) est une alternative sûre et efficace au bêta-carotène dans la formule de prévention de la DMLA avancée
- **Fatigue visuelle numérique :** amélioration de la densité du pigment maculaire et réduction de la fatigue oculaire
- **Support cognitif :** données préliminaires prometteuses, recherche en cours

### Doses

- **Efficace :** 10 mg/jour (dose AREDS2)
- **Alimentaire suffisant :** une alimentation riche en légumes verts foncés couvre facilement 6-10 mg/jour
- **Dose maximale étudiée :** jusqu'à 20 mg/jour sans effet indésirable notable

## Sécurité

Excellent profil de sécurité. Pas de toxicité connue aux doses étudiées. Le seul effet rapporté à très forte consommation est une caroténodermie (coloration jaunâtre de la peau), bénigne et réversible.

Contrairement au bêta-carotène, la lutéine n'est pas associée à un risque accru chez les fumeurs.

## Limites

- Peu d'essais cliniques à long terme sur la cognition
- Biodisponibilité variable selon la matrice alimentaire et la présence de lipides
- Résultats sur la DMLA surtout en prévention secondaire (stades intermédiaires), pas en prévention primaire chez les sujets sains
`,
  },
]

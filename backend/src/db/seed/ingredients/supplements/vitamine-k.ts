import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const VITAMINE_K: IngredientInput[] = [
  {
    name: 'Vitamine K2 (Menaquinone)',
    slug: INGREDIENT_SLUGS.VITAMINE_K2,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.VITAMINE,
    description:
      "Vitamine liposoluble essentielle a la fixation du calcium dans les os et a la prevention des calcifications vasculaires. Souvent associee a la vitamine D3 en supplementation.",
    content: `
# Vitamine K2 (Menaquinone)

## Identite et biochimie

La vitamine K existe sous deux formes principales : K1 (phylloquinone, vegetaux verts) et K2 (menaquinones, produits fermentes et d'origine animale). La K2 se decline en sous-types notes MK-n selon la longueur de la chaine laterale.

**Formes supplementees :**

- **MK-4 :** demi-vie courte (~2-4 heures), necessite des prises multiples. Doses etudiees : 15-45 mg/jour (sante osseuse, surtout au Japon).
- **MK-7 :** demi-vie longue (~72 heures), atteint un etat stable en 2 semaines. Forme preferee en supplementation quotidienne. Doses etudiees : 100-200 ug/jour.

**Sources alimentaires :**

| Aliment (portion) | K2 (ug) | Type |
|---|---|---|
| Natto (100 g) | ~1 000 ug | MK-7 |
| Fromages a pate dure (100 g) | 70-80 ug | MK-7 a MK-9 |
| Jaune d'oeuf (2 oeufs) | 15-30 ug | MK-4 |
| Foie de poulet (100 g) | 10-15 ug | MK-4 |
| Beurre (10 g) | 2-3 ug | MK-4 |

La K1 alimentaire (legumes verts) est abondante mais mal absorbee (~10%) et peu redistribuee vers les tissus extra-hepatiques. La K2, plus liposoluble, est mieux absorbee et atteint les os et les vaisseaux.

## Mecanisme d'action

### Carboxylation des proteines dependantes de la vitamine K

La vitamine K est le cofacteur de la gamma-glutamyl carboxylase, qui active les proteines dependantes de la vitamine K (PVKD) par carboxylation des residus glutamate en gamma-carboxyglutamate (Gla). Ces residus Gla permettent aux proteines de lier le calcium.

### Proteines cles activees

- **Osteocalcine (os) :** hormone osseuse produite par les osteoblastes. Sous forme carboxylee, elle fixe le calcium dans la matrice osseuse. La forme sous-carboxylee (ucOC, marqueur de deficit en K2) est associee a une fragilite osseuse accrue.
- **Matrix Gla Protein (vaisseaux) :** plus puissant inhibiteur connu de la calcification vasculaire. Sans carboxylation par la K2, la MGP reste inactive et les calcifications progressent.
- **Facteurs de coagulation (foie) :** principalement actives par la K1. La K2 a peu d'effet sur la coagulation aux doses supplementees (100-200 ug).

### Effet paradoxal du calcium

La K2 resout le paradoxe du calcium : elle oriente le calcium vers les os (via l'osteocalcine) et l'eloigne des arteres (via la MGP). Sans K2 suffisante, une supplementation en calcium et vitamine D pourrait theoriquement contribuer aux calcifications vasculaires.

## Benefices documentes

### Sante osseuse (niveau de preuve : modere a eleve)

- MK-4 a haute dose (45 mg/jour) : reduction des fractures vertebrales dans les etudes japonaises
- MK-7 (100-200 ug/jour) : amelioration des marqueurs osseux (osteocalcine carboxylee, ucOC), benefice sur la densite minerale osseuse chez les femmes postmenopausees
- Synergie avec la vitamine D3 et le calcium

### Sante cardiovasculaire (niveau de preuve : modere)

- Etude de Rotterdam (2004) : apport eleve en K2 (pas K1) associe a une reduction de 50% du risque de maladie coronarienne et de calcification aortique severe
- Etude PREVEND : chaque 10 ug de K2 alimentaire associe a une reduction de 9% du risque d'evenement coronarien
- La K2 ralentit la progression de la rigidite arterielle (mesure par vitesse de l'onde de pouls) dans les essais randomises

### Metabolisme du calcium (niveau de preuve : modere)

Reduction de l'osteocalcine sous-carboxylee (ucOC) et de la MGP desphosphorylee (dp-ucMGP), deux marqueurs de deficit fonctionnel en vitamine K.

## Posologie

### Doses recommandees

- **MK-7 :** 100-200 ug/jour (dose la plus etudiee et la plus pratique)
- **MK-4 :** 15-45 mg/jour (utilise au Japon pour l'osteoporose, dose beaucoup plus elevee)
- **ANC officiel (vitamine K totale) :** 70-120 ug/jour, mais cible principalement la coagulation (K1), pas les effets extra-hepatiques

### Forme et timing

- Prendre avec un repas contenant des graisses (liposoluble)
- MK-7 : une prise par jour suffit (longue demi-vie)
- MK-4 : fractionner en 3 prises si haute dose
- Privilegier la forme trans (all-trans MK-7), biologiquement active

## Securite

### Profil general

La vitamine K2 est consideree comme tres sure. Aucune toxicite rapportee meme a des doses elevees (MK-4 jusqu'a 45 mg/jour pendant des annees dans les etudes japonaises). Pas de limite superieure definie par l'EFSA.

### Interaction critique : anticoagulants

**Contre-indication avec les anti-vitamine K (AVK) :** warfarine, acenocoumarol, fluindione. La K2 antagonise directement l'effet de ces medicaments. Les patients sous AVK doivent avoir un apport en vitamine K stable et ne pas supplementer sans suivi medical de l'INR.

Les anticoagulants oraux directs (AOD : rivaroxaban, apixaban, dabigatran) ne sont pas affectes par la vitamine K.

### Effets secondaires

Aucun effet secondaire notable rapporte aux doses recommandees.

## Besoins et populations

| Situation | Besoin en K2 |
|---|---|
| Supplementation en vitamine D + calcium | Quasi indispensable (orientation du calcium) |
| Femmes postmenopausees | Interet marque pour la sante osseuse |
| Personnes agees | Prevention des calcifications et fractures |
| Alimentation pauvre en fermentes | Deficit probable en K2 |

## Synergies

- Vitamine D3 (synergie majeure pour le metabolisme osseux et calcique)
- Calcium (orientation vers les os via l'osteocalcine)
- Magnesium (cofacteur du metabolisme osseux)

## Limites de la recherche

- Essais a long terme sur les evenements cardiovasculaires (pas seulement les marqueurs) encore limites
- Dose optimale de MK-7 debattue (100 vs 200 ug)
- Peu d'etudes chez les hommes jeunes
- Interaction K1/K2 dans les tissus encore partiellement comprise
`,
  },
]

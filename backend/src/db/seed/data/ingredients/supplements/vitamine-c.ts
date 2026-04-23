import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const VITAMINE_C: IngredientInput[] = [
  {
    name: 'Vitamine C (Acide ascorbique)',
    slug: INGREDIENT_SLUGS.VITAMINE_C,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.VITAMINE,
    description:
      "Vitamine hydrosoluble essentielle, puissant antioxydant et cofacteur de la synthese du collagene. Non synthetisee par l'organisme humain, elle doit etre apportee par l'alimentation ou la supplementation.",
    content: `
# Vitamine C (Acide ascorbique)

## Identite et biochimie

L'acide L-ascorbique est une vitamine hydrosoluble que l'humain ne peut pas synthetiser (perte du gene GULO au cours de l'evolution). C'est un donneur d'electrons puissant, ce qui en fait un antioxydant majeur et un cofacteur enzymatique essentiel.

**Absorption :** transportee activement dans l'intestin grele via les transporteurs SVCT1/SVCT2. L'absorption est dose-dependante et saturable : ~70-90% pour des doses de 30-180 mg, ~50% a 1 000 mg, ~15-20% a 6 000 mg. Pas de stockage significatif — l'exces est excrete par voie urinaire.

**Pool corporel :** environ 1 500-2 000 mg chez un adulte. En dessous de 300 mg, des signes de scorbut apparaissent. Demi-vie : 10-20 jours.

## Mecanismes d'action

### Antioxydant

La vitamine C neutralise directement les radicaux libres (superoxyde, hydroxyle, peroxyle) dans le compartiment aqueux. Elle regenere la vitamine E oxydee (cycle redox tocopherol) et maintient le glutathion sous forme reduite.

### Cofacteur enzymatique

Cofacteur des hydroxylases a fer et a cuivre, impliquees dans :

- **Synthese du collagene** (prolyl et lysyl hydroxylases) — indispensable a la structure de la peau, des tendons, des vaisseaux et des os
- **Synthese de la carnitine** (transport des acides gras dans les mitochondries)
- **Synthese de la noradrenaline** (dopamine beta-hydroxylase)
- **Demethylation de l'ADN et des histones** (enzymes TET et JHDM)

### Absorption du fer

La vitamine C reduit le fer ferrique (Fe3+) en fer ferreux (Fe2+) dans le tube digestif, augmentant son absorption de 2 a 6 fois. Particulierement utile pour le fer non heminique (vegetaux, supplements).

## Sources alimentaires

| Aliment (portion) | Vitamine C (mg) | % besoins (110 mg) |
|---|---|---|
| Poivron rouge cru (100 g) | 160 mg | 145% |
| Kiwi (1 fruit, 75 g) | 70 mg | 64% |
| Fraises (100 g) | 60 mg | 55% |
| Brocoli cuit vapeur (100 g) | 60 mg | 55% |
| Orange (1 fruit) | 50 mg | 45% |
| Citron (100 g, jus) | 45 mg | 41% |
| Chou kale cru (100 g) | 120 mg | 109% |

**Point cle :** la vitamine C est fragile — degradee par la chaleur, la lumiere et l'oxydation. Privilegier les aliments crus ou cuits rapidement a la vapeur.

## Posologie en supplementation

### Apports recommandes

- **ANC (EFSA) :** 110 mg/jour pour les adultes
- **Dose optimale estimee :** 200-500 mg/jour (saturation des tissus sans exces urinaire massif)
- **Limite superieure toleree :** 2 000 mg/jour (au-dela, risque de troubles digestifs)

### Formes de supplementation

- **Acide ascorbique :** forme la plus etudiee, bon rapport cout/efficacite. Peut etre acide pour l'estomac a haute dose.
- **Ascorbate de sodium/calcium :** formes tamponnees, mieux tolerees gastriquement. Attention a l'apport en sodium.
- **Vitamine C liposomale :** encapsulee dans des liposomes, meilleure biodisponibilite a haute dose. Plus couteuse.
- **Ester-C (ascorbate de calcium + metabolites) :** marketing fort, avantages cliniques modestes.

### Timing et absorption

- Fractionner les prises (2-3x/jour) ameliore l'absorption par rapport a une dose unique
- Prendre avec un repas pour reduire l'irritation gastrique
- L'absorption diminue significativement au-dela de 500 mg par prise

## Benefices documentes

### Fonction immunitaire (niveau de preuve : modere)

La vitamine C s'accumule dans les leucocytes (10-80x les taux plasmatiques). Les meta-analyses montrent une reduction modeste de la duree des rhumes (-8% chez les adultes) mais pas de l'incidence en population generale. Effet plus marque chez les personnes soumises a un stress physique intense (marathoniens, militaires : -50% d'incidence).

### Synthese du collagene et sante des tissus

Cofacteur indispensable. Un deficit entraine des symptomes de scorbut (fragilite vasculaire, retard de cicatrisation, douleurs articulaires) en 1-3 mois. Un apport adequat soutient l'integrite de la peau, des gencives et des tissus conjonctifs.

### Absorption du fer

Benefice bien documente pour les personnes a risque de carence martiale (vegetariens, femmes en age de procreer). 100 mg de vitamine C avec un repas peut doubler l'absorption du fer non heminique.

### Protection antioxydante

Reduction du stress oxydatif mesurable dans les etudes (F2-isoprostanes, 8-OHdG). Impact clinique sur les maladies chroniques : preuves observationnelles solides, essais randomises moins concluants.

## Securite

### Profil general

La vitamine C est consideree comme tres sure. L'exces est elimine par voie renale.

### Effets secondaires

- **Troubles digestifs (> 2 000 mg/jour) :** diarrhee osmotique, crampes abdominales, nausees
- **Oxalates urinaires :** augmentation modeste. Risque theorique de calculs renaux chez les personnes predisposees, mais les etudes de cohorte ne montrent pas d'augmentation significative du risque aux doses standard
- **Faux negatifs sur la glycemie capillaire** et **faux positifs sur la recherche de sang dans les selles** a haute dose

### Contre-indications relatives

- Antecedent de calculs renaux d'oxalate de calcium — prudence au-dela de 1 000 mg/jour
- Hemochromatose — la vitamine C augmente l'absorption du fer
- Deficit en G6PD — risque d'hemolyse a tres haute dose IV (pas en supplementation orale standard)

## Synergies

- Vitamine E (regeneration du tocopherol oxyde)
- Fer (amelioration de l'absorption)
- Collagene (cofacteur indispensable a sa synthese)

## Limites de la recherche

- Mega-doses (> 1 g) : pas de benefice supplementaire demontre pour la plupart des indications
- Prevention des maladies cardiovasculaires et du cancer : preuves insuffisantes pour recommander une supplementation specifique
- La plupart des adultes avec une alimentation variee atteignent des apports adequats sans supplementation
`,
  },
]

import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const VITAMINE_D: IngredientInput[] = [
  {
    name: 'Vitamine D3 (Cholecalciferol)',
    slug: INGREDIENT_SLUGS.VITAMINE_D3,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.VITAMINE,
    description:
      "Vitamine liposoluble essentielle a la sante osseuse, immunitaire et musculaire. Synthetisee par la peau sous l'effet des UVB, souvent deficitaire en Europe du Nord.",
    content: `
# Vitamine D3 (Cholecalciferol)

## Identite et biochimie

La vitamine D existe sous deux formes principales : D2 (ergocalciferol, d'origine vegetale) et D3 (cholecalciferol, d'origine animale ou synthetisee par la peau). La D3 est la forme preferee en supplementation car elle eleve le taux serique de 25(OH)D plus efficacement que la D2.

**Synthese cutanee :** les UVB (290-315 nm) convertissent le 7-dehydrocholesterol epidermique en pre-vitamine D3. La synthese est negligeable en hiver au-dessus du 35e parallele (toute la France metropolitaine), chez les peaux foncees (Fitzpatrick IV-VI), et derriere une vitre ou un ecran solaire.

**Metabolisme :** la D3 est hydroxilee dans le foie en 25(OH)D (calcidiol, forme circulante mesuree en bilan sanguin), puis dans le rein en 1,25(OH)2D (calcitriol, forme active hormonale).

**Sources alimentaires :** poissons gras (saumon, maquereau, sardine), jaune d'oeuf, foie. Couverture alimentaire typique : 100-200 UI/jour, tres insuffisante par rapport aux besoins.

## Mecanismes d'action

### Metabolisme phosphocalcique

Le calcitriol agit comme une hormone steroidienne via le recepteur nucleaire VDR, present dans la quasi-totalite des tissus. Il augmente l'absorption intestinale du calcium (de 10-15% a 30-40%) et du phosphore, et module la resorption osseuse via les osteoclastes.

### Fonction immunitaire

La vitamine D module l'immunite innee (activation des macrophages, production de cathelicidine antimicrobienne) et adaptative (differentiation des lymphocytes T regulateurs, modulation de la reponse inflammatoire).

### Fonction musculaire

Le VDR est exprime dans le tissu musculaire squelettique. Un deficit en vitamine D est associe a une faiblesse musculaire proximale et a un risque accru de chutes chez les personnes agees.

## Taux seriques et interpretation

| Taux 25(OH)D | Interpretation |
|---|---|
| < 10 ng/mL (25 nmol/L) | Carence severe |
| 10-20 ng/mL (25-50 nmol/L) | Deficit |
| **20-40 ng/mL (50-100 nmol/L)** | **Zone adequate (consensus)** |
| 30-40 ng/mL | Cible raisonnable pour la plupart des adultes |
| 40-60 ng/mL | Partie haute, parfois visee en optimisation |
| > 60 ng/mL | Exces, sans benefice supplementaire demontre |
| > 100 ng/mL | Risque de toxicite (hypercalcemie) |

**Conversion :** 1 ng/mL = 2,5 nmol/L.

## Posologie

### Estimation empirique

La regle clinique la plus utilisee : +100 UI/jour eleve le taux d'environ 0,7 a 1 ng/mL a l'etat stable (sans exposition solaire).

### Doses recommandees

| Situation | Dose quotidienne | Objectif |
|---|---|---|
| Exposition solaire moderee | 800 UI | Maintien 20-30 ng/mL |
| Peu d'exposition (hiver, travail interieur) | 1 000-2 000 UI | Atteindre 30-40 ng/mL |
| Carence confirmee (< 20 ng/mL) | 3 000-4 000 UI pendant 2-3 mois | Rattrapage, puis maintien a 1 000-2 000 UI |

**Conversion :** 1 ug = 40 UI. Donc 25 ug = 1 000 UI, 50 ug = 2 000 UI.

### Facteurs de variabilite

La reponse a la supplementation varie considerablement selon le poids corporel (liposoluble, se dilue dans la masse grasse), la pigmentation cutanee, l'absorption intestinale, le statut en magnesium (cofacteur necessaire aux enzymes d'hydroxylation), et la genetique du recepteur VDR.

**Recommandation :** supplementer, tester le taux apres 8-12 semaines, ajuster. Le dosage sanguin est la seule verification fiable.

## Forme et timing

- **Cholecalciferol (D3)** : forme preferee, superieure a la D2 pour maintenir le taux
- Prendre avec un repas contenant des graisses (absorption amelioree de 30-50%)
- Prise quotidienne preferee aux bolus mensuels (pharmacocinetique plus stable)
- Sources de D3 vegetale disponibles (lichen) pour les regimes vegetaliens

## Securite

### Profil general

La vitamine D est sure aux doses recommandees (jusqu'a 4 000 UI/jour, limite superieure EFSA). Des doses superieures peuvent etre utilisees sous surveillance medicale.

### Toxicite

La toxicite (hypercalcemie) est rare et ne survient qu'a des doses tres elevees (> 10 000 UI/jour pendant plusieurs mois) ou a des taux > 100 ng/mL. Symptomes : nausees, vomissements, calcifications des tissus mous, atteinte renale.

La toxicite par exposition solaire est impossible (mecanisme d'auto-regulation cutanee).

### Interactions

- **Magnesium :** cofacteur indispensable — un deficit en magnesium limite l'activation de la vitamine D
- **Vitamine K2 :** synergie pour la fixation du calcium dans les os plutot que dans les arteres
- **Calcium :** la vitamine D augmente son absorption ; surveiller l'apport total

## Populations specifiques

### Personnes a peau foncee

Synthese cutanee reduite de 50-90% selon la pigmentation. Deficit quasi universel en hiver aux latitudes europeennes. Supplementation particulierement importante.

### Personnes agees

Synthese cutanee reduite avec l'age. Risque accru de chutes et fractures en cas de deficit. Supplementation recommandee par la plupart des societes savantes.

### Femmes enceintes

Un statut adequat en vitamine D soutient le developpement osseux foetal. Supplementation souvent recommandee (800-1 000 UI/jour).

## Synergies

- Vitamine K2 (orientation du calcium vers les os)
- Magnesium (activation enzymatique de la D3)
- Calcium (absorption amelioree par la D3)

## Limites de la recherche

- Effets extra-osseux (immunite, cancer, depression) : preuves observationnelles solides, mais les essais randomises montrent des resultats mitiges
- Dose optimale debattue au-dela de la sante osseuse
- Variabilite genetique du VDR encore mal comprise en pratique clinique
`,
  },
]

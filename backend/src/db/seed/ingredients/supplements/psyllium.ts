import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const PSYLLIUM: IngredientInput[] = [
  {
    name: 'Psyllium (Ispaghul)',
    slug: INGREDIENT_SLUGS.PSYLLIUM,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.PREBIOTIQUE,
    description:
      "Fibre soluble naturelle issue des teguments de Plantago ovata. Ameliore le transit, le cholesterol, la glycemie et la sante du microbiote intestinal avec un niveau de preuve eleve.",
    content: `
# Psyllium (Ispaghul)

## Identite

Le psyllium est une fibre hautement soluble extraite des teguments (enveloppes) des graines de Plantago ovata. Au contact de l'eau, il forme un gel visqueux dans le tube digestif, ce qui explique ses multiples effets physiologiques.

**Caracteristiques :** fibre non fermentescible en grande partie (contrairement a l'inuline), ce qui le rend bien tolere par les intestins sensibles. Pas de valeur calorique significative.

## Mecanismes d'action

### Formation de gel

Le psyllium absorbe l'eau et forme un gel dans le tractus gastro-intestinal. Ce gel ralentit la vidange gastrique, retarde l'absorption du glucose et des lipides, et augmente le volume fecal.

### Effet sur le microbiote

Stimule la production de metabolites protecteurs (acides gras a chaine courte) par les bacteries intestinales. Soutient la muqueuse du colon.

### Regulation du transit

Augmente le volume et l'hydratation des selles (laxatif de lest). Paradoxalement, aide aussi en cas de diarrhee (absorption de l'exces d'eau).

## Benefices documentes

### Cholesterol (niveau de preuve : eleve)

Etude The Lancet 2019 (185 etudes, 50 essais, 4 600 participants) : les personnes consommant le plus de fibres ont 15-30% de reduction de mortalite toutes causes. Le psyllium reduit specifiquement le LDL-cholesterol en liant les acides biliaires dans l'intestin.

### Glycemie et insuline (niveau de preuve : eleve)

Meta-analyse 2023 : reduction significative de la resistance a l'insuline, de l'HbA1c, de la glycemie a jeun et de la tension arterielle. Effet dose-dependant.

### Transit intestinal (niveau de preuve : eleve)

Efficace sur la constipation (augmente le volume fecal) et la diarrhee (absorbe l'exces d'eau). Bien tolere dans le syndrome de l'intestin irritable (IBS), contrairement aux fibres insolubles comme le son de ble.

### Prevention cardiovasculaire et metabolique (niveau de preuve : eleve)

Reduction du cholesterol total et de la pression arterielle. Contribution a la prevention du diabete de type 2 et du cancer du colon (donnees observationnelles).

## Posologie

### Dose recommandee

- **Debut :** 1-2 g/jour (1 cuillere a cafe dans 250-300 mL d'eau)
- **Dose cible :** 5-7 g/jour (augmenter progressivement sur 10+ jours)
- **Toujours avec beaucoup d'eau** (minimum 250 mL par prise)

### Timing

Prendre a distance des medicaments et supplements (1h minimum) — le psyllium peut ralentir l'absorption d'autres substances sans la reduire au total.

## Securite

### Effets secondaires

- **Ballonnements, flatulences** (surtout en debut d'utilisation ou si dose trop rapide)
- **Constipation paradoxale** si pris sans assez d'eau
- **Obstruction oesophagienne** (risque theorique si avale sec sans eau)

### Precautions

- Toujours dissoudre dans l'eau, boire immediatement
- Augmenter progressivement
- Verifier la qualite du produit (risque de contamination au plomb selon les marques)
- Le psyllium ralentit l'absorption mais ne la reduit pas au total

### Contre-indications

- Obstruction intestinale ou stenose digestive
- Dysphagie severe
- Impaction fecale

## Synergies

- Probiotiques (le psyllium nourrit le microbiote)
- Regime riche en legumineuses et vegetaux (fibres complementaires)
`,
  },
]

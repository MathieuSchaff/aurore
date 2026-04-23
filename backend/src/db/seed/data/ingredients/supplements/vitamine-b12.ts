import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const VITAMINE_B12: IngredientInput[] = [
  {
    name: 'Vitamine B12 (Cobalamine)',
    slug: INGREDIENT_SLUGS.VITAMINE_B12,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.VITAMINE,
    description:
      "Vitamine hydrosoluble essentielle au fonctionnement du systeme nerveux, a la formation des globules rouges et a la synthese de l'ADN. Exclusivement d'origine animale ou bacterienne.",
    content: `
# Vitamine B12 (Cobalamine)

## Identite et biochimie

La vitamine B12 est la plus grande et la plus complexe des vitamines. Elle contient un atome de cobalt au centre d'un noyau corrine. C'est la seule vitamine qui ne peut etre synthetisee ni par les plantes ni par les animaux — elle est produite exclusivement par des micro-organismes (bacteries et archees).

**Formes actives :**

- **Methylcobalamine :** cofacteur cytosolique de la methionine synthase (cycle de methylation)
- **Adenosylcobalamine :** cofacteur mitochondrial de la methylmalonyl-CoA mutase (metabolisme des acides gras)

**Formes supplementees :**

- **Cyanocobalamine :** forme synthetique, tres stable, la plus etudiee. Convertie en formes actives dans l'organisme.
- **Methylcobalamine :** forme active directe, instable a la lumiere. Marketing fort, mais pas de superiorite clinique demontree par rapport a la cyanocobalamine.
- **Hydroxocobalamine :** forme injectable (usage medical), longue retention tissulaire.

**Absorption :** processus complexe necessitant le facteur intrinseque (FI) produit par les cellules parietales de l'estomac. La B12 alimentaire est liberee par l'acide gastrique, se lie au FI dans le duodenum, et le complexe est absorbe dans l'ileon terminal. Capacite du systeme FI : ~1,5-2 ug par repas. Au-dela, une diffusion passive non specifique absorbe ~1% de la dose (pertinente pour les hautes doses orales).

**Reserves hepatiques :** 2-5 mg. Suffisantes pour 2-5 ans en l'absence totale d'apport (turnover lent, cycle enterohepathique efficace).

## Mecanismes d'action

### Cycle de methylation (methionine synthase)

La methylcobalamine transfere un groupe methyle de l'homocysteine pour regenerer la methionine, qui est ensuite convertie en S-adenosylmethionine (SAM), le principal donneur de methyle de l'organisme.

**Consequences d'un deficit :** accumulation d'homocysteine (marqueur de risque cardiovasculaire), perturbation de la methylation de l'ADN, de la synthese de la myelane et des neurotransmetteurs.

### Metabolisme du methylmalonyl-CoA

L'adenosylcobalamine permet la conversion du methylmalonyl-CoA en succinyl-CoA dans les mitochondries, etape cle du metabolisme des acides gras a chaine impaire et de certains acides amines.

**Consequences d'un deficit :** accumulation d'acide methylmalonique (MMA), marqueur specifique de deficit en B12 (plus specifique que l'homocysteine).

### Synthese de l'ADN

Via le cycle de methylation, la B12 est indirectement necessaire a la synthese du thymidylate (precurseur de l'ADN). Un deficit entraine une synthese d'ADN ralentie avec maturation cytoplasmique normale — les cellules deviennent anormalement grandes (megaloblastose).

## Sources alimentaires

| Aliment (portion) | B12 (ug) | % besoins (4 ug) |
|---|---|---|
| Foie (veau, 100 g) | 65 ug | > 1 000% |
| Fruits de mer (moules, 100 g) | 12 ug | 300% |
| Sardines (100 g) | 8 ug | 200% |
| Saumon cuit (100 g) | 4 ug | 100% |
| Boeuf cuit (100 g) | 2,5 ug | 60% |
| Oeufs (2 oeufs) | 1,4 ug | 35% |
| Lait (250 mL) | 1,2 ug | 30% |

**Alimentation vegetalienne :** aucune source fiable de B12. Supplementation obligatoire.

## Deficit : causes et diagnostic

### Causes principales

- **Alimentation vegetalienne/vegetarienne** sans supplementation
- **Malabsorption :** gastrite atrophique (frequente apres 60 ans), maladie de Biermer (auto-immune), chirurgie bariatrique, maladie de Crohn ileale, insuffisance pancreatique
- **Medicaments :** metformine (reduction de l'absorption de 10-30%), IPP au long cours (reduction de la liberation de B12 alimentaire)
- **Age :** prevalence de deficit augmente avec l'age (gastrite atrophique, hypochlorhydrie)

### Marqueurs biologiques

| Marqueur | Utilite |
|---|---|
| B12 serique | Premier depistage, mais zone grise large (200-400 pg/mL) |
| Acide methylmalonique (MMA) | Marqueur fonctionnel specifique (eleve = deficit) |
| Homocysteine | Eleve en deficit B12 et/ou B9 (moins specifique) |
| Holotranscobalamine (holoTC) | B12 active circulante, marqueur precoce |

### Manifestations du deficit

- **Hematologiques :** anemie megaloblastique (macrocytose, VGM > 100 fL)
- **Neurologiques :** neuropathie peripherique, sclerose combinee de la moelle, troubles cognitifs, depression. Les atteintes neurologiques peuvent preceder l'anemie et etre irreversibles si le traitement est tardif.
- **Psychiatriques :** depression, psychose, troubles de la memoire (surtout chez les personnes agees)

## Posologie en supplementation

### Apports recommandes

- **ANC :** 4 ug/jour (EFSA)
- **Supplementation preventive (vegetaliens) :** 10-25 ug/jour en continu OU 2 000 ug/semaine en une prise
- **Correction de deficit :** injections IM d'hydroxocobalamine (protocole medical) ou fortes doses orales (1 000-2 000 ug/jour pendant 1-3 mois)

### Pourquoi les doses orales sont si elevees

Le systeme du facteur intrinseque sature a ~1,5-2 ug par prise. Au-dela, seule la diffusion passive (1% de la dose) contribue. Donc 1 000 ug oraux delivrent ~10 ug par diffusion passive + ~1,5 ug par FI = ~12 ug absorbes. C'est pourquoi les supplements contiennent 100 a 2 000 ug pour des besoins de 4 ug.

### Forme

Cyanocobalamine ou methylcobalamine — les deux sont efficaces. La cyanocobalamine est moins chere, plus stable, et mieux etudiee. Pas de difference cliniquement significative entre les formes orales dans les etudes comparatives.

## Securite

### Profil general

La vitamine B12 est hydrosoluble et atoxique. Aucune limite superieure definie par l'EFSA. L'exces est excrete par voie renale. Des doses de 5 000 ug/jour n'ont pas montre d'effets indesirables.

### Precautions

- **Acne :** quelques rapports de poussees d'acne a haute dose (modification du microbiome cutane de Cutibacterium acnes). Rare.
- **Masquage d'un deficit en folates :** la B12 seule peut corriger l'anemie megaloblastique tout en laissant progresser les atteintes neurologiques d'un deficit en folates. En pratique, supplementer les deux simultanement en cas de doute.

## Populations a risque de deficit

- Vegetaliens et vegetariens stricts (supplementation obligatoire)
- Personnes agees (> 65 ans) — depistage recommande
- Patients sous metformine au long cours
- Patients sous IPP au long cours
- Post-chirurgie bariatrique
- Maladie de Crohn ileale

## Synergies

- Folates / vitamine B9 (cycle de methylation, prevention de l'anemie megaloblastique)
- Fer (anemie mixte frequente)
- Betaine / TMG (voie alternative de remethylation de l'homocysteine)

## Limites de la recherche

- Seuil de deficit debattu (< 200 pg/mL certain, 200-400 pg/mL zone grise)
- Benefices de la supplementation chez les personnes agees sans deficit franc : preuves limitees
- Impact sur les performances cognitives chez les sujets non deficitaires : non demontre
- Methylcobalamine vs cyanocobalamine : pas de difference clinique malgre le marketing
`,
  },
]

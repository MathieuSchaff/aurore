import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const TMG: IngredientInput[] = [
  {
    name: 'TMG (Trimethylglycine / Betaine)',
    slug: INGREDIENT_SLUGS.TMG,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.ACIDE_AMINE,
    description:
      "Donneur de groupes methyle derive de la glycine, implique dans le cycle de la methionine. Reduit l'homocysteine et soutient la methylation. Approuve FDA pour l'homocystinurie.",
    content: `
# TMG (Trimethylglycine / Betaine)

## Identite et biochimie

La trimethylglycine (TMG), aussi appelee betaine anhydre, est un derive de la glycine portant trois groupes methyle. C'est une molecule zwitterionique naturellement presente dans l'organisme et dans divers aliments.

**Ne pas confondre** avec la betaine HCl (chlorhydrate de betaine), qui est une aide digestive avec des proprietes differentes.

**Sources alimentaires :** son de ble (~1 300 mg/100g), epinards crus (~550 mg/100g), quinoa (~390 mg/100g), betterave (~300 mg/100g). Regime occidental moyen : ~182 mg/jour. La cuisson (surtout l'ebullition) reduit significativement la teneur en TMG.

**Biosynthese :** synthetisee dans l'organisme a partir de la choline via la choline deshydrogenase puis la betaine aldehyde deshydrogenase.

**Statut FDA :** approuvee sous prescription (Cystadane) pour le traitement de l'homocystinurie.

## Mecanismes d'action

### Donneur de groupes methyle

Fonction principale. La TMG transfere un groupe methyle a l'homocysteine pour regenerer la methionine, via l'enzyme betaine-homocysteine methyltransferase (BHMT), principalement dans le foie et les reins.

Homocysteine + TMG -> Methionine + Dimethylglycine (DMG)

La methionine est ensuite convertie en S-adenosylmethionine (SAMe), le principal donneur de methyle universel de l'organisme, necessaire pour la synthese des neurotransmetteurs (dopamine, serotonine, noradrenaline), la methylation de l'ADN (epigenetique), la synthese de la creatine et la production de phosphatidylcholine.

### Osmolyte

Regule l'equilibre hydrique intracellulaire, protege les proteines contre le stress osmotique et stabilise les structures enzymatiques. Similaire au role de la creatine.

## Benefices documentes

### Reduction de l'homocysteine (niveau de preuve : eleve)

Meta-analyse 2013 (5 etudes) : 4 g/jour pendant 6 semaines reduit l'homocysteine plasmatique de 10-15%. Revue systematique 2021 : 4 g/jour efficace sans effets negatifs sur la pression arterielle.

**Nuance critique :** l'homocysteine elevee est associee aux maladies cardiovasculaires dans les etudes observationnelles, mais les interventions abaissant l'homocysteine n'ont pas demontre de reduction des evenements cardiovasculaires. La correlation n'implique pas la causalite.

### Sante hepatique - NAFLD (niveau de preuve : modere, resultats mixtes)

Modeles animaux : preuves solides de prevention et reduction de la steatose, amelioration de la resistance a l'insuline hepatique, activation de l'AMPK. Etudes humaines : un essai a 20 g/jour pendant 12 mois n'a pas ameliore la steatose vs. placebo, mais pourrait proteger contre l'aggravation.

### Performance athletique (niveau de preuve : faible a modere)

Resultats tres inconsistants. Quelques etudes positives (augmentation de la masse musculaire des bras, amelioration du 1RM, amelioration du VO2max chez les footballeurs a 2 g/jour). Plusieurs etudes negatives (pas d'effet sur l'hypertrophie ni la force). La TMG semble plus efficace dans les contextes d'entrainement intense.

### Sante mentale (niveau de preuve : faible)

Une etude : SAMe + TMG superieur a SAMe seul pour la depression legere a moderee. Mecanisme : augmentation de la production de SAMe, precurseur des neurotransmetteurs. Aucune etude de TMG seule chez l'humain.

## Posologie

| Objectif | Dose | Duree |
|---|---|---|
| Reduction homocysteine | 4-6 g/jour | 6-12 semaines |
| Performance athletique | 2,5-5 g/jour | 2-14 semaines |
| Depression (avec SAMe) | 375 mg/jour | 12 mois |
| Dose de depart | 500-1 000 mg/jour | progressif |

Prendre avec les repas, diviser en 2-3 prises. Forme recommandee : betaine anhydre (TMG), pas betaine HCl.

## Securite

### Probleme majeur : elevation des lipides sanguins

Meta-analyse 2020 (6 essais, doses >= 4 g/jour) : augmentation significative du LDL-cholesterol (+0,36 mmol/L, +11%), du cholesterol total et des triglycerides (+0,14 mmol/L). Effet detectable des 2 semaines. Dose-dependant : non significatif a 1,5-3 g/jour, significatif a 6 g/jour.

**Cette elevation pourrait contrecarrer tout benefice cardiovasculaire de la reduction de l'homocysteine.**

### Autres effets secondaires

- Troubles digestifs (nausees, diarrhee, ballonnements) — les plus frequents
- Hypermethioninemie (rare mais grave) : risque d'oedeme cerebral, surtout chez les patients CBS-deficients
- Odeur corporelle de poisson (trimethylamine) — liee a un deficit de l'enzyme FMO3
- Irritabilite, troubles du sommeil

### Contre-indications

- Hypercholesterolemie severe ou non controlee
- Homocystinurie CBS sans supervision medicale
- Grossesse/allaitement (donnees insuffisantes)
- Enfants (sauf prescription medicale)
- Obesite (risque accru d'elevation lipidique)

### Prerequis avant supplementation

Bilan lipidique de base normal, statut folate/B12 optimal, absence de contre-indications. Bilan lipidique de suivi a 6-8 semaines si dose >= 3 g/jour.

## Synergies

- SAMe (potentialisation des effets antidepresseurs)
- Vitamines B6, B9, B12 (voies complementaires du cycle de la methionine)
- Corriger d'abord les deficiences en folate/B12 avant d'ajouter la TMG

## Limites de la recherche

- Elevation du LDL non expliquee mecanistiquement
- Securite a long terme (> 2-3 ans) non etablie
- Performance athletique : resultats tres inconsistants
- Benefice net cardiovasculaire non demontre malgre la baisse de l'homocysteine
- Etudes humaines pour la steatose hepatique insuffisantes et contradictoires
`,
  },
]

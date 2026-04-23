import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const PHOSPHATIDYLSERINE: IngredientInput[] = [
  {
    name: 'Phosphatidylserine',
    slug: INGREDIENT_SLUGS.PHOSPHATIDYLSERINE,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.NEUROACTIF,
    description:
      'Phospholipide constitutif des membranes neuronales, implique dans la neurotransmission, la memoire et la regulation du cortisol. Benefices documentes sur le declin cognitif, le TDAH et le stress.',
    content: `
# Phosphatidylserine (PS)

## Identite et biochimie

La phosphatidylserine (PS) est un phospholipide anionique composant structural essentiel des membranes cellulaires. Elle represente 5-10% des phospholipides totaux et 15% du pool phospholipidique cerebral, avec une concentration particulierement elevee dans les membranes synaptiques.

**Localisation :** principalement dans le feuillet interne de la membrane plasmique. Son externalisation est un signal de phagocytose (reconnaissance des cellules apoptotiques).

**Synthese :** dans le reticulum endoplasmique par deux enzymes (PSS1 a partir de la PE, PSS2 a partir de la PC). Le cerveau obtient la serine necessaire par captation depuis la circulation et synthese locale a partir du glucose.

**Biodisponibilite orale :** elevee. La PS exogene (300-800 mg/jour) traverse efficacement la barriere hemato-encephalique et s'integre dans les membranes neuronales.

## Mecanismes d'action

### Integrite et fluidite membranaire

Maintient la fluidite et la permeabilite des membranes neuronales, essentielles pour la transduction des signaux, la transmission synaptique et le metabolisme energetique cerebral.

### Neurotransmission

Restaure la liberation d'acetylcholine chez les personnes agees en facilitant l'activation de la proteine kinase C (PKC). Influence favorablement la dopamine, la serotonine et la noradrenaline.

### Exocytose synaptique

Via la synaptotagmine I (proteine effectrice de la PS), mediation de la fusion des vesicules synaptiques avec la membrane plasmique pour la liberation des neurotransmetteurs.

### Regulation de l'axe HHS (cortisol)

Reduction de la CRF (corticotropin-releasing factor), attenuation de l'ACTH et du cortisol. Effet particulierement prononce chez les individus chroniquement stresses. 600 mg/jour pendant 10 jours : -35% de cortisol post-exercice, +37% de testosterone, ratio T/C +184%.

## Benefices documentes

### Declin cognitif lie a l'age (niveau de preuve : eleve)

Revue de 127 articles : la PS (300-800 mg/jour) ralentit, arrete ou inverse les alterations biochimiques et la deterioration structurelle des cellules nerveuses. Etude en double aveugle (149 participants, 50-70 ans) : amelioration significative chez les personnes avec perte de memoire la plus severe. Fonctions ameliorees : memoire court et long terme, apprentissage, attention, concentration, raisonnement, competences linguistiques.

### TDAH chez l'enfant (niveau de preuve : modere)

Etude randomisee en double aveugle (36 enfants, 4-14 ans, 200 mg/jour pendant 2 mois) : amelioration significative des symptomes globaux (p<0.01), de l'inattention (p<0.01), de l'hyperactivite (p<0.01) et de la memoire auditive a court terme (p<0.05). Meta-analyse 2022 (4 etudes, 344 participants) : taille d'effet 0.36 sur l'inattention (p=0.01).

### Gestion du stress et cortisol (niveau de preuve : modere)

800 mg/jour pendant 10 jours : attenuation significative de l'ACTH (p=0.003) et du cortisol (p=0.03) en reponse a l'exercice. 400 mg PS + 400 mg PA : normalisation de l'hyperreactivite de l'axe HHS chez les sujets chroniquement stresses (pas d'effet chez les sujets peu stresses).

### Depression du sujet age (niveau de preuve : preliminaire)

100 mg PS + DHA/EPA, 3x/jour pendant 12 semaines : amelioration significative des scores de depression de Hamilton chez les sujets ages avec reponse insuffisante aux antidepresseurs.

### Performance sportive (niveau de preuve : modere)

750 mg/jour pendant 10 jours : +85% du temps jusqu'a epuisement a 85% VO2max chez les cyclistes.

## Posologie

| Objectif | Dose | Duree |
|---|---|---|
| Prevention declin cognitif | 300 mg/jour (100 mg x 3) | 6-12 mois |
| TDAH (enfants) | 200 mg/jour | 2-4 mois |
| Stress/cortisol | 600-800 mg/jour | 10+ jours |
| Performance sportive | 400-750 mg/jour | 10+ jours |

Prendre avec les repas. Eviter juste avant le coucher (peut stimuler la liberation de neurotransmetteurs). Possible diminution d'efficacite apres 16 semaines d'utilisation continue.

## Securite

### Profil general

Bien toleree sans effets secondaires significatifs aux doses recommandees. DL50 rat > 5 g/kg.

### Effets secondaires (rares, surtout > 300 mg)

Insomnie, troubles GI (nausees, flatulences), maux de tete, changements d'humeur.

### Contre-indications

- Allergie aux fruits de mer (certaines formulations marines) — utiliser PS vegetale
- Medicaments anticholinergiques (effet oppose sur l'acetylcholine)
- Medicaments anticoagulants (effet theorique sur la coagulation)
- Grossesse/allaitement (donnees insuffisantes)

## Sources commerciales

- **PS vegetale (soja, tournesol, chou) :** forme actuelle standard, sans risque d'ESB
- **PS bovine (cortex cerebral) :** abandonnee (risque de maladie de la vache folle)
- **PS-DHA (marine) :** combine PS et omega-3, synergie documentee

## Synergies

- Omega-3 DHA (integration optimale dans les membranes neuronales)
- Acide phosphatidique (normalisation de l'axe HHS)
- Ginkgo biloba (potentiel additif cognitif)
`,
  },
]

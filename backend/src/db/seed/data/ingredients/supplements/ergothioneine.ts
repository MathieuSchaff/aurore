import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { SUPPLEMENTS_ANTIOXYDANTS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

// Supplement-specific slug ('ergothioneine-supplement') disambiguates
// from a skincare ERGOTHIONEINE entry that otherwise produces a duplicate
// slug insert.
export const ERGOTHIONEINE: IngredientInput[] = [
  {
    name: 'Ergothionéine',
    slug: SUPPLEMENTS_ANTIOXYDANTS.ERGOTHIONEINE_SUPPLEMENT,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.ANTIOXYDANT,
    description:
      "Acide aminé soufré non synthétisé par les mammifères, transporté par un système dédié (OCTN1) et considéré comme une potentielle « vitamine de longévité » grâce à sa stabilité antioxydante exceptionnelle.",
    content: `
# Ergothionéine

## Identité

L'ergothionéine (EGT) est un dérivé thiourée de l'histidine (C₉H₁₅N₃O₂S, 229,3 g/mol), découvert en 1909 dans le seigle ergoté. Les mammifères ne la synthétisent pas : l'apport est exclusivement alimentaire.

Sa forme thione prédominante lui confère une stabilité exceptionnelle : contrairement au glutathion, elle ne s'oxyde pas spontanément et ne devient jamais pro-oxydante. Elle chélate également le Fe²⁺ et le Cu²⁺, prévenant la réaction de Fenton.

## Transporteur dédié OCTN1

L'ergothionéine dispose d'un transporteur spécifique hautement sélectif (OCTN1/SLC22A4), avec une affinité 100× supérieure à celle de la carnitine. Ce transporteur est exprimé dans les érythrocytes, la moelle osseuse, le cerveau, la rétine, le foie, les reins et les mitochondries.

**Système adaptatif :** l'expression d'OCTN1 est induite par le stress oxydatif et l'inflammation, concentrant l'ergothionéine aux sites de dommages.

L'existence d'un transporteur dédié conservé par l'évolution, combinée à la forte rétention corporelle (excrétion urinaire <5%), a conduit à proposer l'ergothionéine comme une « vitamine de stress » ou « longevity vitamin ».

## Sources alimentaires

| Aliment | Concentration (mg/kg frais) |
|---------|----------------------------|
| Cèpe (Boletus edulis) | 400-528 |
| Shiitake | 150-200 |
| Pleurote | 90-120 |
| Champignon de Paris | 30-50 |

100 g de champignons frais ≈ 20-30 mg d'ergothionéine. Autres sources : foie, viande rouge, haricots noirs, son d'avoine, ail.

Apports estimés : 5-15 mg/jour en Asie (forte consommation de champignons), 1-5 mg/jour en Occident.

## Mécanismes d'action

### Antioxydant direct

Neutralise efficacement le radical hydroxyle, l'oxygène singulet, le superoxyde, le peroxynitrite et l'acide hypochloreux. Ne s'auto-oxyde pas (avantage majeur vs glutathion).

### Activation Nrf2/KEAP1

Modifie KEAP1, libérant Nrf2 qui active la transcription de gènes antioxydants endogènes : HO-1, NQO1, SOD, catalase, glutathion S-transférase. Amplification importante (+80 à +200% selon les enzymes).

### Inhibition NF-κB

Réduit les cytokines pro-inflammatoires : TNF-α (-40-60%), IL-1β (-35-55%), IL-6 (-30-50%).

### Activation des sirtuines (SIRT1, SIRT6)

Stabilisation de Nrf2 par désacétylation, régulation épigénétique, protection des télomères.

### Protection mitochondriale

Accumulation ciblée via OCTN1 mitochondrial. Protection de l'ADN mitochondrial, maintien du potentiel de membrane, réduction du superoxyde mitochondrial.

## Bénéfices documentés

### Associations épidémiologiques

**Méta-analyse (601 893 participants, 4 cohortes) :** des taux élevés d'ergothionéine sont associés à une réduction de 6% de la mortalité toutes causes (RR : 0,94, IC 95% : 0,91-0,98) et une réduction significative de la mortalité cardiovasculaire.

### Neuroprotection

- Niveaux plasmatiques réduits de 30-50% chez les patients Alzheimer et Parkinson
- Corrélation inverse entre taux d'EGT et déclin cognitif
- Étude Singapour (n=470, >50 ans) : consommation de champignons ≥2×/semaine associée à une meilleure cognition
- Essai clinique (n=147, 55-79 ans, 16 semaines) : amélioration de la mémoire prospective et de l'initiation du sommeil vs placebo

### Santé cutanée

Essais cliniques : amélioration de l'élasticité (R7 +8,4%), réduction de la mélanine (-4,5%), de l'érythème (-5,4%) et des rides (-6,1%) à 25 mg/jour pendant 8 semaines.

### Qualité du sommeil

Essai clinique (n=92, 40-75 ans) : amélioration de la qualité et de l'initiation du sommeil à 5-20 mg/jour.

### Autres domaines étudiés (préclinique)

Protection rénale et hépatique dans le diabète de type 2 (activation Nrf2, réduction NF-κB), amélioration de la NAFLD, protection endothéliale cardiovasculaire.

## Posologie

| Source | Dose | Contexte |
|--------|------|----------|
| EFSA | 30 mg/jour adultes, 20 mg/jour enfants >3 ans | Limite de sécurité |
| Suppléments | 5-25 mg/jour | Usage courant |
| Études cliniques | 10-25 mg/jour | Cognition, peau, sommeil |

**Pharmacocinétique :** biodisponibilité orale élevée (OCTN1 intestinal), Tmax 1-3h, très peu métabolisée, forte réabsorption rénale, longue demi-vie avec accumulation progressive. Traverse la barrière hémato-encéphalique.

## Sécurité

**Profil exemplaire.** FDA : statut GRAS (2011). EFSA : Novel Food approuvé (2016/2017), sûr y compris chez les femmes enceintes/allaitantes.

Aucun effet indésirable significatif dans toutes les études humaines (5-30 mg/jour, 7 jours à 16 semaines). Test Ames négatif (pas de génotoxicité). Pas de toxicité reproductive.

**Interaction théorique :** compétition OCTN1 avec la gabapentine (aucun cas rapporté).

**Aucune contre-indication absolue établie.** Prudence : nourrissons <3 ans (données insuffisantes), insuffisance rénale sévère.

## Avantages comparatifs

| Critère | Ergothionéine | Glutathion | Vitamine C |
|---------|---------------|------------|------------|
| Stabilité | Très stable, pas d'auto-oxydation | Facilement oxydé | Modérée |
| Biodisponibilité orale | Excellente | Faible | Bonne |
| Transport spécifique | OCTN1 (haute affinité) | Non-spécifique | Non-spécifique |
| Ciblage mitochondrial | Oui (OCTN1) | Non | Non |
| Doses efficaces | 5-30 mg | 250-1000 mg | 60-2000 mg |
| Effet pro-oxydant | Aucun | Possible | Possible (Fe²⁺) |

## Limites de la recherche

- Majorité des preuves précliniques (>100 études animales/in vitro) — peu d'essais cliniques à long terme
- Les associations épidémiologiques (mortalité, cognition) ne prouvent pas la causalité
- Essais cliniques existants de courte durée (max 16 semaines) et petits échantillons
- Effets cognitifs objectifs non soutenus au-delà des premières semaines dans l'essai disponible
- Pharmacogénétique (polymorphismes OCTN1) et variabilité de réponse non étudiées
- Production et coût des suppléments encore élevés
`,
  },
]

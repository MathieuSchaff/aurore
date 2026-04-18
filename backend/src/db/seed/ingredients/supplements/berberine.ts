import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const BERBERINE: IngredientInput[] = [
  {
    name: 'Berbérine',
    slug: INGREDIENT_SLUGS.BERBERINE,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.PLANTE,
    description:
      "Alcaloïde végétal isoquinoléique, principalement étudié pour ses effets sur la glycémie, les lipides sanguins et le syndrome métabolique.",
    content: `
# Berbérine

## Identité

La berbérine est un alcaloïde isoquinoléique présent dans plusieurs plantes (Berberis vulgaris, Coptis chinensis, Hydrastis canadensis). La forme couramment utilisée en supplémentation est le chlorhydrate de berbérine (berbérine HCl), à une pureté ≥97%.

## Mécanismes d'action

### Activation de l'AMPK

La berbérine active l'AMPK (AMP-activated protein kinase), un régulateur central du métabolisme énergétique cellulaire. Cette activation entraîne :

- Amélioration de la sensibilité à l'insuline
- Réduction de la gluconéogenèse hépatique
- Augmentation du transport de glucose dans les cellules musculaires
- Stimulation de l'oxydation des acides gras

### Autres voies

- Inhibition de NF-κB (effet anti-inflammatoire)
- Modulation du microbiote intestinal
- Amélioration de la fonction hépatique (contexte NAFLD)

## Efficacité clinique

### Glycémie et diabète de type 2

Données issues de méta-analyses (2021-2024) :

| Paramètre | Réduction moyenne | Niveau de preuve |
|-----------|-------------------|------------------|
| HbA1c | -0,63 à -0,73% | Modéré |
| Glycémie à jeun | -0,82 à -0,86 mmol/L | Modéré |
| Glycémie postprandiale | -1,16 à -1,26 mmol/L | Modéré |
| HOMA-IR | -0,71 à -1,25 | Modéré |

Efficacité comparable à la metformine 1500 mg/jour dans certaines études. Effet dose-dépendant entre 900-1500 mg/jour, amélioration significative dès 4 semaines, bénéfice maximal entre 8-12 semaines.

### Lipides sanguins

| Paramètre | Réduction moyenne | Études |
|-----------|-------------------|--------|
| LDL-cholestérol | -0,46 à -0,65 mmol/L | 14-18 RCTs |
| Cholestérol total | -0,48 à -0,61 mmol/L | 17-18 RCTs |
| Triglycérides | -0,34 à -0,50 mmol/L | 18 RCTs |
| HDL-cholestérol | +0,05 à +0,17 mmol/L | 15 RCTs |

Différence selon le sexe : les femmes montrent une augmentation significative du HDL (+0,11 mmol/L), pas les hommes.

### Poids et composition corporelle

Perte modeste : -2,07 kg en moyenne (IC 95% : -3,09 à -1,05). Plus efficace chez les personnes en surpoids (IMC 25-30), à doses >1 g/jour, après au moins 8 semaines. Effet limité chez les sujets de poids normal.

### Syndrome métabolique

Réduction significative de la glycémie à jeun, des triglycérides et du tour de taille. Pas d'effet significatif sur la pression artérielle.

## Bioavailabilité : limitation majeure

La biodisponibilité orale est très faible : **0,36-0,68%**. Environ 50% de la dose est excrétée intacte dans les selles.

**Causes :** effet de premier passage intestinal massif, efflux par la P-glycoprotéine, métabolisme hépatique extensif, faible solubilité et perméabilité.

**Rôle du microbiote :** les bactéries intestinales convertissent la berbérine en dihydroberbérine (dhBBR), dont l'absorption est 5× supérieure. La co-administration d'antibiotiques diminue cette conversion et réduit l'efficacité.

**Formulations améliorées :** les formulations micellaires/liposomales (ex : LipoMicel®) augmentent la biodisponibilité jusqu'à 6×. La dihydroberbérine en supplément direct est prometteuse mais manque de données humaines.

## Posologie

### Schéma progressif

| Période | Dose | Fréquence |
|---------|------|-----------|
| Semaines 1-2 | 300-500 mg | 1×/jour avec repas |
| Semaines 3-4 | 500 mg | 2×/jour avec repas |
| Semaines 5+ | 500 mg | 2-3×/jour avec repas |

**Dose thérapeutique :** 900-1500 mg/jour en 2-3 prises.
**Minimum efficace :** ~900 mg/jour.
**Maximum recommandé :** 1500 mg/jour (au-delà, effets gastro-intestinaux fréquents).

Toujours prendre avec un repas. Durée minimale d'évaluation : 8-12 semaines.

## Sécurité et effets secondaires

### Effets gastro-intestinaux

Incidence : 2-34% selon les études, surtout dans les 4 premières semaines. Nausées, diarrhée, constipation, crampes abdominales, goût amer. Gestion : débuter à faible dose, augmentation progressive, prise avec repas.

### Interactions médicamenteuses (important)

La berbérine inhibe les cytochromes CYP3A4, CYP2D6 et CYP2C9 ainsi que la P-glycoprotéine.

**Interactions à risque élevé :**
- Immunosuppresseurs (ciclosporine, tacrolimus) — surveillance étroite
- Anticoagulants (warfarine) — INR instable

**Interactions à risque modéré :**
- Statines (risque accru de myopathie)
- Antidiabétiques (risque d'hypoglycémie additive)
- Macrolides, benzodiazépines

### Contre-indications

- Grossesse (risque tératogène potentiel)
- Allaitement (passage dans le lait maternel)
- Nourrissons (risque d'ictère nucléaire)
- Insuffisance hépatique sévère

### Sécurité à long terme

Bon profil de sécurité jusqu'à 24 semaines dans les essais. Pas de toxicité hépatique ou rénale observée. Données au-delà de 6 mois absentes.

## Impact sur la performance physique

### Conflit AMPK/mTOR

L'activation chronique de l'AMPK par la berbérine inhibe mTORC1, essentiel à la synthèse protéique musculaire. Des données précliniques montrent une augmentation de l'atrophie musculaire et une diminution des marqueurs de synthèse protéique.

Chez l'humain, les résultats sont contradictoires : l'activation transitoire de l'AMPK par l'exercice ne semble pas compromettre l'hypertrophie, mais l'activation chronique par supplémentation pourrait avoir un effet différent.

**Recommandation :** éviter la berbérine pendant les phases de prise de masse musculaire. Si la prise est nécessaire pour des raisons métaboliques, éloigner le timing de l'entraînement (>6h).

## Indications pertinentes

**Justifiées :**
- Diabète de type 2 / pré-diabète (si metformine mal tolérée, ou en complément)
- Dyslipidémie (si statine non tolérée)
- Syndrome métabolique avec résistance à l'insuline
- SOPK avec troubles métaboliques associés

**Non recommandées :**
- Prévention primaire chez sujets sains
- Perte de poids isolée (effet modeste)
- Objectif anti-âge / longévité (preuves insuffisantes)
- Performance sportive / hypertrophie (potentiellement contre-productif)

## Limites de la recherche

- Majorité des études de courte durée (≤6 mois) et sur de petits échantillons
- Aucune donnée sur les événements cardiovasculaires réels (pas d'outcome data)
- Nombreuses études chinoises avec risque potentiel de biais de publication
- Hétérogénéité des formulations entre études
- Effet individuel très variable selon le microbiote et la génétique
- Comparaisons directes avec la metformine encore limitées en qualité

## Synergies documentées

- **Berbérine + silymarine :** meilleure réduction du cholestérol, hépatoprotection additive
- **Berbérine + levure de riz rouge :** synergie sur le LDL-C (surveillance nécessaire)
- **Berbérine + probiotiques :** théoriquement favorable à la conversion en dihydroberbérine
`,
  },
]

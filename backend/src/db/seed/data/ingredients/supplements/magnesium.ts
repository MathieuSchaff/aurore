import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const MAGNESIUM: IngredientInput[] = [
  {
    name: 'Magnésium',
    slug: INGREDIENT_SLUGS.MAGNESIUM,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.MINERAL,
    description:
      "Minéral essentiel impliqué dans plus de 600 réactions enzymatiques. Cofacteur de l'ATP, régulateur neuromusculaire et cardiovasculaire, fréquemment déficient dans l'alimentation moderne.",
    content: `
# Magnésium

## Identité

Le magnésium (Mg²⁺) est le quatrième élément le plus abondant dans l'organisme et le second cation intracellulaire après le potassium. Il est impliqué dans plus de 600 réactions enzymatiques.

**Distribution :** 60% dans les os, 39% intracellulaire, 1% extracellulaire (forme ionisée active). L'absorption intestinale est de 30-40% de la dose ingérée.

## Fonctions principales

### Métabolisme énergétique

L'ATP biologiquement actif existe principalement sous forme de complexe Mg-ATP. Le magnésium est indispensable à la formation, au stockage et à l'utilisation de l'énergie cellulaire.

### Système nerveux

- Antagoniste naturel des récepteurs NMDA (neuroprotection)
- Interaction avec les récepteurs GABA (relaxation, sommeil)
- Régulation de la libération de neurotransmetteurs
- Stabilisation axonale et modulation du seuil de stimulation

### Système cardiovasculaire

- Vasodilatation (antagonisme calcique dans les muscles lisses vasculaires)
- Stimulation de la production de monoxyde d'azote (NO)
- Stabilité électrique cardiaque
- Réduction modeste de la pression artérielle (2-4 mmHg systolique, 2-3 mmHg diastolique)

### Métabolisme glucidique

- Cofacteur essentiel à l'action de l'insuline
- Nécessaire à la sécrétion d'insuline par les cellules β pancréatiques
- Relation inverse dose-dépendante entre apport en magnésium et risque de diabète de type 2

### Fonction musculaire

Régule la contraction et la relaxation musculaire, stimule la recapture du calcium par le réticulum sarcoplasmique, contribue à la prévention des crampes.

## Déficience

### Prévalence

Population générale : 3-10%. Patients hospitalisés : ~10%. Soins intensifs : jusqu'à 65%. La majorité de la population occidentale n'atteint pas les apports recommandés.

**Diagnostic difficile :** le magnésium sérique (1% du total corporel) ne reflète pas fidèlement les réserves intracellulaires. Une déplétion peut exister malgré un sérum normal.

### Populations à risque

Personnes âgées, diabétiques, alcooliques, patients sous IPP ou diurétiques au long cours, maladies inflammatoires intestinales, femmes enceintes/allaitantes, athlètes.

### Symptômes de déficience

**Précoces :** fatigue, crampes musculaires, tremblements, irritabilité, perte d'appétit.
**Avancés :** tétanie, paresthésies, convulsions, arythmies, hypocalcémie et hypokaliémie réfractaires.

## Formes de supplémentation

### Formes organiques (meilleure biodisponibilité)

| Forme | Caractéristiques |
|-------|------------------|
| **Bisglycinate/glycinate** | Excellente biodisponibilité, tolérance GI optimale. Contient ~1,54 g de glycine pour 250 mg Mg — effets synergiques sommeil. Distribution préférentielle vers le cerveau à hautes doses |
| **Citrate** | Bonne biodisponibilité, balance efficacité/tolérance. Effet laxatif modéré |
| **Malate** | Bonne absorption, parfois associé au soutien énergétique |
| **Taurate** | Potentiellement bénéfique pour la fonction cardiovasculaire |
| **Thréonate** | Études animales montrant augmentation du magnésium cérébral. Données humaines limitées |

### Formes inorganiques (biodisponibilité inférieure)

| Forme | Caractéristiques |
|-------|------------------|
| **Oxyde** | Teneur élémentaire élevée (60%), mais faible absorption. Fréquent car économique |
| **Chlorure** | Biodisponibilité modérée à bonne, goût désagréable |
| **Sulfate** (Epsom) | Usage hospitalier IV/IM (éclampsie, asthme aigu). Oral : laxatif puissant |

**Règle générale :** les formes organiques chélatées sont mieux absorbées et mieux tolérées que les formes inorganiques.

## Posologie

### Apports recommandés

| Population | Apport quotidien |
|-----------|-----------------|
| Hommes adultes | 400-420 mg |
| Femmes adultes | 310-320 mg |
| Femmes enceintes | 350-360 mg |

### Supplémentation

- **Dose courante :** 200-400 mg/jour de magnésium élémentaire
- **Migraine (prévention) :** 400-600 mg/jour
- **Hypertension :** >370 mg/jour pour effet significatif
- **Limite supérieure tolérable (suppléments) :** 350 mg/jour selon l'IOM (ne concerne pas l'apport alimentaire)

### Optimisation de l'absorption

- Fractionner les doses (plusieurs prises/jour)
- Prendre avec les repas (protéines, triglycérides à chaîne moyenne)
- Éviter la prise simultanée avec de fortes doses d'autres minéraux, phytates ou oxalates
- Favoriser la co-consommation avec amidon résistant, oligosaccharides ou inuline

## Bénéfices étudiés

| Indication | Niveau de preuve |
|-----------|-----------------|
| Prévention migraines | Probable (400-600 mg/jour) |
| Réduction pression artérielle | Modéré (-2 à -4 mmHg systolique) |
| Sensibilité à l'insuline | Modéré à fort |
| Anxiété légère et insomnie | Émergent (bisglycinate 250 mg) |
| Dépression | Émergent (résultats inconsistants) |
| Crampes musculaires | Variable |

## Sécurité

**Voie orale :** très sûr aux doses recommandées. La toxicité alimentaire est pratiquement inexistante chez les personnes à fonction rénale normale (excrétion rénale efficace).

**Effets secondaires dose-dépendants :** diarrhée et inconfort GI (principalement avec les formes inorganiques — oxyde, carbonate, hydroxyde). Les formes chélatées (bisglycinate) minimisent cet effet.

**Contre-indications :**
- Insuffisance rénale sévère (risque d'hypermagnésémie)
- Bloc cardiaque (sauf sous supervision médicale)

**Interactions médicamenteuses :**
- Réduit l'absorption des bisphosphonates, antibiotiques (tétracyclines, fluoroquinolones) et lévothyroxine — espacer les prises de 2-4h
- IPP au long cours : réduisent l'absorption du magnésium
- Diurétiques de l'anse et thiazidiques : augmentent les pertes urinaires

## Sources alimentaires

| Aliment | Mg (mg/100 g) |
|---------|---------------|
| Graines de citrouille | 550 |
| Chocolat noir (>70%) | 200 |
| Amandes | 270 |
| Épinards cuits | 87 |
| Haricots noirs | 70 |
| Avocat | 29 |

## Limites

- Le magnésium sérique est un marqueur imparfait du statut réel
- La variabilité de biodisponibilité entre formes complique les comparaisons entre études
- Les essais sur la dépression montrent des résultats inconsistants
- L'absorption cutanée (bains d'Epsom, huile de magnésium) reste controversée scientifiquement
`,
  },
]

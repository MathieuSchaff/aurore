import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { SUPPLEMENTS_CAROTENOIDES } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

// Uses the carotenoid-specific slug ('astaxanthine-supplement') because
// INGREDIENT_SLUGS.ASTAXANTHINE is shadowed by the skincare entry
// ('astaxanthine') — sourcing directly from the supplement group avoids
// the slug collision during seeding.
export const ASTAXANTHINE: IngredientInput[] = [
  {
    name: 'Astaxanthine',
    slug: SUPPLEMENTS_CAROTENOIDES.ASTAXANTHINE,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.CAROTENOIDE,
    description:
      "Caroténoïde xanthophylle (C40H52O4) issu de la microalgue Haematococcus pluvialis, considéré comme l'un des antioxydants naturels les plus puissants.",
    content: `
# Astaxanthine

## Identité et structure

L'astaxanthine (3,3′-dihydroxy-β,β-carotène-4,4′-dione) est un caroténoïde xanthophylle de couleur rouge-orangé. Sa formule moléculaire est C₄₀H₅₂O₄ (≈596,85 Da).

Sa structure unique — polaire aux extrémités (groupements hydroxyle et céto), lipophile au centre (doubles liaisons conjuguées) — lui permet de s'insérer entièrement dans les membranes cellulaires et d'intercepter les espèces réactives de l'oxygène sur toute leur largeur.

La forme naturelle (Haematococcus pluvialis) est majoritairement 3S,3'S et mono-estérifiée. La forme synthétique est un mélange racémique 3R,3'R / 3R,3'S / 3S,3'S (ratio 1:2:1), avec une capacité antioxydante nettement inférieure.

**Sources naturelles :** Haematococcus pluvialis (microalgue, source principale), saumon, crevettes, homard, krill, levure Phaffia rhodozyma.

## Capacité antioxydante

L'astaxanthine figure parmi les antioxydants les plus puissants connus :

- 100 à 500 fois plus puissante que la vitamine E (α-tocophérol)
- ~10 fois plus active que le β-carotène
- ~65 fois plus efficace que la vitamine C pour la neutralisation des radicaux
- Valeur ORAC la plus élevée parmi les caroténoïdes testés

**Particularité unique :** contrairement à d'autres antioxydants, l'astaxanthine ne se transforme jamais en pro-oxydant une fois épuisée.

## Mécanismes d'action

### Voie Nrf2/ARE (défense antioxydante)

L'astaxanthine active le facteur de transcription Nrf2, qui stimule l'expression d'enzymes antioxydantes endogènes : HO-1, SOD, catalase, glutathion peroxydase, NQO1. Cela crée une protection cellulaire durable au-delà du simple piégeage direct des radicaux.

### Voie NF-κB (anti-inflammatoire)

Elle inhibe l'activation de NF-κB et la translocation nucléaire de NF-κB p65, réduisant les cytokines pro-inflammatoires (TNF-α, IL-1β, IL-6, IL-8) et la production de PGE2 et de monoxyde d'azote.

### Crosstalk Nrf2–NF-κB

L'activation de Nrf2 supprime NF-κB par antagonisme. L'augmentation de HO-1 produit du monoxyde de carbone qui inhibe directement NF-κB. Ces deux voies agissent de manière coordonnée.

### Protection mitochondriale

L'astaxanthine protège les mitochondries contre les radicaux oxygénés endogènes, conserve leur capacité redox et améliore l'efficacité de production énergétique.

## Bénéfices documentés

### Santé cardiovasculaire

- Amélioration du profil lipidique : ↑ HDL, ↓ triglycérides (6-12 mg/jour, 12 semaines)
- Protection contre l'oxydation des LDL : +42% du temps d'oxydation à 14,4 mg/jour
- Augmentation de l'adiponectine sérique

### Neuroprotection

L'astaxanthine traverse la barrière hémato-encéphalique, permettant des effets neuroprotecteurs directs. À 12 mg/jour pendant 12 semaines, elle contribue à la protection contre le déclin cognitif lié à l'âge. Elle favorise l'expression de BDNF, GFAP et GAP-43.

### Santé cutanée

- Photoprotection UV (réduction des dommages à l'ADN, activation de Nrf2 cutané)
- Amélioration de l'élasticité et de l'hydratation (3-6 mg/jour, 8-16 semaines)
- Inhibition des MMP (protection du collagène)
- Effets anti-âge modérés mais constants selon les méta-analyses

### Santé oculaire

Traverse la barrière hémato-rétinienne. Amélioration de l'accommodation visuelle, réduction de la fatigue oculaire numérique, protection antioxydante de la rétine.

### Performance physique

- Réduction des dommages musculaires induits par l'exercice (4-8 mg/jour)
- Amélioration de la récupération post-exercice
- Amélioration de l'adaptation métabolique à l'entraînement aérobie chez les personnes âgées

### Système immunitaire

Activation des lymphocytes T, stimulation des cellules natural killer, augmentation des IgM/IgG et de l'IL-2.

### Métabolisme du glucose

Amélioration du métabolisme du glucose et protection des cellules β pancréatiques chez les patients diabétiques de type 2.

## Pharmacocinétique

- **Absorption :** diffusion passive intestinale, formation de micelles avec les acides biliaires, incorporation dans les chylomicrons
- **Biodisponibilité :** naturellement faible (lipophile). AUC 2,4× supérieure avec un repas lipidique vs à jeun
- **Cmax (8 mg natif) :** 3,86 µg/mL (Tmax 8,5 h) — formulation micellaire : 7,21 µg/mL (Tmax 3,67 h)
- **Demi-vie :** 15,9 ± 5,3 heures
- **Distribution :** foie, muscles, peau, cerveau (BHE), rétine, tissu adipeux
- **Impact tabac :** réduction significative de la demi-vie (consommation accélérée par le stress oxydatif)

## Posologie

| Objectif | Dose | Durée minimale |
|----------|------|----------------|
| Antioxydant général | 4-6 mg/jour | 4-8 semaines |
| Santé cutanée | 3-12 mg/jour | 8-16 semaines |
| Santé cardiovasculaire | 6-12 mg/jour | 12 semaines |
| Performance sportive | 4-8 mg/jour | 4-8 semaines |
| Santé oculaire | 6-12 mg/jour | 12 semaines |
| Neuroprotection | 12 mg/jour | 12 semaines |

**EFSA (2019) :** AJA de 0,2 mg/kg/jour, soit 12 mg/jour pour un adulte de 60 kg.

**Administration :** toujours avec un repas contenant des lipides. Privilégier les formulations lipidiques ou micellaires (gélules molles).

**Associations synergiques :** oméga-3, vitamine E, autres caroténoïdes.

## Sécurité

**Profil excellent aux doses thérapeutiques (2-12 mg/jour).** Classée GRAS par la FDA. Revue de 87 études humaines sans préoccupation de sécurité identifiée. Doses jusqu'à 40-50 mg/jour tolérées sans effet indésirable grave.

**Effets secondaires rares :** douleurs abdominales légères, selles rougeâtres (bénin), légère pigmentation cutanée à très hautes doses (réversible).

**Contre-indications :**
- Grossesse et allaitement (données insuffisantes)
- Enfants (prudence, données limitées)
- Allergie aux crustacés ou aux algues

**Interactions médicamenteuses à surveiller :**
- Anticoagulants/antiagrégants (risque hémorragique accru)
- Antihypertenseurs (effet additif hypotenseur)
- Immunosuppresseurs (stimulation immunitaire potentiellement antagoniste)
- Substrats CYP2B6/CYP3A4 (métabolisme accéléré possible)
- Inhibiteurs de la 5-alpha-réductase (effet additif théorique)

## Limites de la recherche

- Majorité des études sur des femmes japonaises en bonne santé (généralisation limitée)
- Échantillons souvent petits (n < 50)
- Nombreuses études financées par l'industrie
- Dose optimale par indication non définitivement établie
- Effets à long terme (> 12 semaines) peu documentés
- Pas de comparaison directe rigoureuse avec d'autres antioxydants en conditions cliniques
`,
  },
]

import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_AGENTS_NACRANTS: IngredientInput[] = [
  {
    name: 'Glycol Distéarate (Glycol Distearate)',
    slug: INGREDIENT_SLUGS.GLYCOL_DISTEARATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      "Diester du glycol et de l'acide stéarique, agent nacrant et opacifiant de référence qui cristallise dans la phase aqueuse pour créer l'aspect perlé des shampoings et après-shampooings.",
    content: `
# Glycol Distéarate (Glycol Distearate)

Le glycol distéarate (EGDS, éthylène glycol distéarate) est un diester formé par réaction de l'éthylène glycol avec deux molécules d'acide stéarique (C18). C'est l'agent nacrant le plus utilisé en cosmétique capillaire, responsable de l'aspect opaque et perlé caractéristique des shampoings commerciaux.

## INCI
**GLYCOL DISTEARATE** (CAS: 627-83-8 | COSING: 35756)

## Mécanisme d'action

### 1. Cristallisation et diffraction de la lumière
Incorporé à chaud dans la formule (T > point de fusion ~57°C), le glycol distéarate se recristallise lors du refroidissement sous forme de feuillets lamellaires plaquettaires. Ces plaquettes microscopiques diffractent et réfléchissent la lumière dans toutes les directions — créant l'effet nacré et perlé, et rendant la formule opaque.

### 2. Modification de rhéologie
Les cristaux de glycol distéarate s'insèrent dans la structure micellaire des tensioactifs, augmentant la viscosité de la formule et modifiant sa texture — apportant un corps crémeux aux shampoings.

### 3. Effet conditionneur léger
La fraction stéarate (C18) se dépose légèrement sur la cuticule capillaire lors du rinçage, contribuant à un toucher doux et lissant.

### 4. Stabilisation des micelles
Intégré dans les micelles mixtes de tensioactifs, il modifie leur forme (sphériques → cylindriques), augmentant la viscosité sans ajout de sel — avantage dans les formules basses teneur en NaCl.

## Paramètres formulatoires

- **Point de fusion** : 55–60°C — incorporation nécessite une phase chaude
- **Concentration optimale** : 1–3% pour l'effet nacrant visible
- **Refroidissement** : vitesse de refroidissement contrôlée pour taille et régularité des cristaux

## Concentration d'usage

- Shampoings et après-shampooings : 1–3%
`,
  },
  {
    name: 'Mica',
    slug: INGREDIENT_SLUGS.MICA_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      "Silicate d'aluminium et de potassium sous forme de fines plaquettes réfléchissantes, agent nacrant et scintillant d'origine minérale utilisé dans les soins capillaires et produits coiffants.",
    content: `
# Mica

Le mica est un groupe de silicates en feuillets (phyllosilicates) contenant principalement de la muscovite (KAl₂(AlSi₃O₁₀)(OH)₂), de la phlogopite ou d'autres espèces. Exfolié en fines plaquettes, il est utilisé comme agent nacrant, scintillant et opacifiant dans les cosmétiques capillaires et les produits coiffants.

## INCI
**MICA** (CAS: 12001-26-2 | COSING: 52034)

## Mécanisme d'action

### 1. Diffraction et réflexion de la lumière
Les plaquettes de mica (diamètre 5–100 µm, épaisseur 0,1–1 µm) forment un réseau de miroirs microscopiques. Leur structure en feuillets semi-transparents crée une interférence constructive de la lumière — effet nacré, irisé ou scintillant selon la taille et le traitement des particules.

### 2. Adhérence à la fibre capillaire
Les plaquettes se déposent sur la cuticule capillaire lors de l'application, réfléchissant la lumière directement sur la surface du cheveu. Amélioration immédiate de la brillance et de l'effet "healthy hair".

### 3. Modification de texture sensorielle
Confèrent un toucher soyeux et doux à la formule — les plaquettes glissent les unes sur les autres et sur la fibre, réduisant la friction perçue lors de l'application.

### 4. Opacification et coloration
Le mica brut est blanc nacré. Enrobé de dioxyde de titane (TiO₂) ou d'oxyde de fer, il devient coloré et irisé — base de la plupart des micas colorés pour cosmétique (CI 77019).

## Qualités cosmétiques

- Grade cosmétique : granulométrie contrôlée < 150 µm
- Mica synthétique (fluorophlogopite) : alternative pour formules "sans mica d'extraction"
- Mica naturel : sourcing responsable requis (travail des enfants documenté dans certaines mines en Inde et à Madagascar)

## Concentration d'usage

- Shampoings nacrants et soins : 0,5–3%
- Produits coiffants scintillants : 1–5%
`,
  },
  {
    name: 'Dioxyde de Titane (Titanium Dioxide)',
    slug: INGREDIENT_SLUGS.TITANIUM_DIOXIDE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      "Oxyde minéral blanc d'origine naturelle ou synthétique, agent opacifiant puissant qui confère blancheur et opacité aux shampoings et soins capillaires, avec un secondaire effet protecteur UV.",
    content: `
# Dioxyde de Titane (Titanium Dioxide)

Le dioxyde de titane (TiO₂) est un oxyde minéral d'origine naturelle (minéral rutile, anatase, brookite) ou synthétique. En cosmétique capillaire, il est principalement utilisé comme agent opacifiant blanc et pigment, distinct de son usage en tant que filtre UV dans les produits solaires.

## INCI
**TITANIUM DIOXIDE** (CAS: 13463-67-7 | COSING: 75488 | CI: 77891)

## Formes cristallines

| Forme | Indice de réfraction | Usage cosmétique |
|---|---|---|
| Rutile | 2,72 | Opacification, filtrage UV maximal |
| Anatase | 2,55 | Opacification, photocatalyse |
| Brookite | 2,63 | Rare en cosmétique |

## Mécanisme d'action

### 1. Opacification par diffusion de la lumière
Les particules de TiO₂ (indice de réfraction très élevé : n=2,55–2,72) diffusent intensément la lumière par effet Mie. Même à faible concentration, le TiO₂ rend les formules opaques blanc laiteux — utilisé pour le blanchiment et l'opacification des shampoings et après-shampooings.

### 2. Enrobage des particules de mica
Le TiO₂ est déposé en couche mince sur les plaquettes de mica par précipitation chimique. Cette couche modifie les interférences optiques — crée des effets nacrés irisés or, argent, bronze selon l'épaisseur du dépôt.

### 3. Protection UV de la fibre
Les particules nanométriques (< 100 nm) absorbent et réfléchissent les UV-A et UV-B, contribuant à protéger la kératine de la photo-oxydation et la couleur des cheveux teints contre la décoloration photochimique.

### 4. Opacification des soins colorants
Utilisé comme base blanche dans les soins pigmentés, masks colorants et produits "color-depositing".

## Taille des particules et usage

- **Grade micronisé** (< 400 nm) : opacifiant cosmétique, nacrant
- **Grade nano** (< 100 nm) : filtre UV (réglementation EU stricte pour produits solaires)

## Statut réglementaire

Autorisé comme colorant cosmétique (CI 77891) et comme filtre UV. L'ECHA et le SCCS ont évalué le risque des nanoparticules inhalables — usage restreint dans les aérosols. Non autorisé comme colorant alimentaire en EU depuis 2022 (E171), mais le statut cosmétique est distinct.

## Concentration d'usage

- Shampoings et après-shampooings : 0,2–1%
- Soins colorants blancs : 1–5%
`,
  },
]

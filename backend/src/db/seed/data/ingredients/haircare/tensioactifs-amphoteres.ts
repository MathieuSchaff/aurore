import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_TENSIOACTIFS_AMPHOTERES: IngredientInput[] = [
  {
    name: 'Cocamidopropyl Betaine',
    slug: INGREDIENT_SLUGS.COCAMIDOPROPYL_BETAINE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Co-tensioactif amphotère de référence dérivé du coco, adoucit les formules sulfatées, améliore la mousse et la douceur sensorielle tout en conditionnant légèrement la fibre.',
    content: `
# Cocamidopropyl Betaine (CAPB)

La cocamidopropyl bétaïne est un tensioactif zwitterionique synthétisé par condensation des acides gras de l'huile de coco avec la 3-(diméthylaminopropyl)amine, puis quaternisation avec l'acide chloroacétique. C'est le co-tensioactif amphotère le plus utilisé en cosmétique capillaire mondiale.

## INCI
**COCAMIDOPROPYL BETAINE** (CAS: 61789-40-0 | COSING: 31891)

## Mécanisme d'action

### 1. Amphotérie et adaptation au pH
À pH acide (<4) : charge globale positive (cationique). À pH physiologique (5–7) : charge neutre (zwitterionique). À pH basique (>9) : charge négative (anionique). En shampoing (pH 5–6), la CAPB est essentiellement neutre — ne déstabilise pas le système tensioactif principal.

### 2. Adoucissement de la formule
La CAPB "dilue" l'action irritante des tensioactifs anioniques (SLES, SLS) par compétition pour les sites de liaison membranaires. Permet de réduire la concentration en sulfates sans perte de moussant.

### 3. Épaississement synergique
En présence de NaCl ou de tensioactifs anioniques, la CAPB forme des agrégats mixtes qui augmentent la viscosité naturelle de la formule — réduction des épaississants nécessaires.

### 4. Effet conditionneur léger
La fraction cationique résiduelle à pH shampoing se dépose légèrement sur la fibre chargée négativement, apportant une touche de douceur post-rinçage.

## Avantages formulatoires
- Incompatible charges contraires → compatible avec tous tensioactifs anioniques
- Améliore la tolérance ophtalmologique et cutanée
- Stabilis les émulsions et les mousses

## Concentration d'usage
2–10% comme co-tensioactif. Souvent à 3–6% dans les shampoings grand public.

> ⚠️ Peut provoquer des réactions de contact chez les sujets sensibilisés à l'amidoamine (impureté de synthèse) — allergie rare mais documentée.
`,
  },
  {
    name: 'Coco-Betaine',
    slug: INGREDIENT_SLUGS.COCO_BETAINE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Bétaïne de coco sans liaison amide, tensioactif amphotère plus pur et moins susceptible aux impuretés allergisantes que la cocamidopropyl bétaïne.',
    content: `
# Coco-Betaine

La coco-bétaïne est une bétaïne alkyle directe obtenue par réaction des acides gras de coco avec la bétaïne, sans le bras propylamine intermédiaire de la CAPB. Sa structure plus simple lui confère un profil de pureté supérieur.

## INCI
**COCO-BETAINE** (CAS: 68424-94-2 | COSING: 32028)

## Différence clé avec la CAPB
L'absence de groupement amide intermédiaire (-CO-NH-) élimine le risque de formation d'amidoamine (impureté responsable de la sensibilisation contact à la CAPB). La coco-bétaïne présente donc un profil allergie réduit.

## Mécanisme d'action

### 1. Amphotérie identique à la CAPB
Comportement zwitterionique en pH physiologique : charge neutre autour du pH 5–6, légèrement positive à pH acide.

### 2. Détersivité et moussant
Légèrement inférieur en pouvoir moussant à la CAPB (absence du groupement amide qui favorise l'adsorption à l'interface) — mais produit une mousse fine et stable.

### 3. Douceur cutanée
Même effet adoucissant que la CAPB sur les systèmes sulfatés, avec meilleur profil tolérance pour peaux sensibles.

## Avantages
- Préférée dans les formules hypoallergéniques
- Profil impureté inférieur à la CAPB
- Compatible certifications naturelles selon sourcing

## Concentration d'usage
2–10% en co-tensioactif dans shampoings et formules douces.
`,
  },
  {
    name: 'Sodium Cocoamphoacetate',
    slug: INGREDIENT_SLUGS.SODIUM_COCOAMPHOACETATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      "Tensioactif amphotère dérivé des acides gras de coco et de l'acide acétique, très doux, adapté aux shampoings bébé et formules pour cuirs chevelus sensibles.",
    content: `
# Sodium Cocoamphoacetate

Le sodium cocoamphoacetate est un tensioactif amphoacétate — dérivé de la condensation des acides gras de coco avec l'imidazoline, puis ouverture de cycle et neutralisation. C'est un tensioactif historiquement "bébé" en raison de son excellente tolérance ophtalmologique.

## INCI
**SODIUM COCOAMPHOACETATE** (CAS: 68334-21-4 | COSING: 57170)

## Mécanisme d'action

### 1. Amphotérie douce
Fonction amino-acétate très légèrement chargée à pH physiologique. Faible densité de charge ionique → interaction très limitée avec les protéines et les membranes cellulaires.

### 2. Détersivité légère à modérée
Capacité détersive plus faible que la CAPB ou les sulfates — c'est intentionnel dans les formules ciblant la douceur. Nettoyage efficace sur cuir chevelu peu gras ou enfant.

### 3. Excellente tolérance ophtalmologique
Propriété clé : le sodium cocoamphoacetate est "no-tears" — ne provoque pas de brûlure oculaire. Base de nombreux shampoings bébé.

### 4. Compatibilité pH acide
Stable et actif à pH 5–6, compatible avec le film acide cutané.

## Avantages
- Adapté formules bébé, nourrissons
- Cuirs chevelus réactifs, atopiques
- Certifiable naturel (Cosmos/Ecocert)

## Concentration d'usage
3–15% comme tensioactif principal ou co-principal dans les formules douces.
`,
  },
  {
    name: 'Disodium Cocoamphodiacetate',
    slug: INGREDIENT_SLUGS.DISODIUM_COCOAMPHODIACETATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Version di-acétate des amphotères coco, tensioactif très doux à double charge anionique, excellent co-tensioactif pour formules cuir chevelu sensible et anti-pelliculaire.',
    content: `
# Disodium Cocoamphodiacetate

Le disodium cocoamphodiacetate est la version di-carboxyméthylée de l'imidazoline de coco. Deux groupes acétate sont greffés sur le noyau imidazolinique, conférant deux charges anioniques — structure plus complexe que le mono-acétate.

## INCI
**DISODIUM COCOAMPHODIACETATE** (CAS: 68650-39-5 | COSING: 33438)

## Mécanisme d'action

### 1. Double charge anionique
Les deux groupes carboxyméthyle génèrent une charge anionique significative à pH physiologique. Cela renforce l'effet "barrière" contre les tensioactifs irritants co-formulés et améliore la substantivité des actifs cationiques.

### 2. Tolérance exceptionnelle
Parmi les tensioactifs les mieux tolérés de la catégorie amphotère. Faible coefficient de pénétration cutanée. Recommandé pour eczéma, dermite atopique, cuirs chevelus hyper-réactifs.

### 3. Compatibilité anti-pelliculaire
Synergie documentée avec le zinc pyrithione et le climbazole — améliore leur déposition sur le cuir chevelu par complexation.

### 4. Moussant modéré
Mousse stable mais moins volumineuse que la CAPB. Souvent associé à la CAPB ou aux glucosides pour améliorer la densité de mousse.

## Avantages
- Formules spécialisées cuir chevelu sensible, anti-pelliculaire
- Compatibilité élargie avec actifs thérapeutiques
- Certifiable naturel

## Concentration d'usage
2–10% en co-tensioactif ou 5–15% comme tensioactif principal dans formules très douces.
`,
  },
]

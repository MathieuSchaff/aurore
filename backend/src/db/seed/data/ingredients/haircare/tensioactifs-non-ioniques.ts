import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_TENSIOACTIFS_NON_IONIQUES: IngredientInput[] = [
  {
    name: 'Coco-Glucoside',
    slug: INGREDIENT_SLUGS.COCO_GLUCOSIDE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      "Tensioactif non ionique d'origine 100% végétale issu du coco et du glucose, doux, certifiable naturel, base des shampoings sans sulfates.",
    content: `
# Coco-Glucoside

Le coco-glucoside est un alkyl polyglycoside (APG) obtenu par condensation des alcools gras de l'huile de coco (C8–C16) avec le glucose issu de l'amidon (maïs, blé, pomme de terre). C'est l'un des tensioactifs les plus populaires dans les formules naturelles et sans sulfates.

## INCI
**COCO-GLUCOSIDE** (CAS: 68515-73-1 | COSING: 32042)

## Mécanisme d'action

### 1. Non ionique : absence de charge
Le coco-glucoside ne porte aucune charge ionique nette — il ne perturbe pas les charges de surface de la kératine (négative) ni du cuir chevelu. Résultat : faible interaction avec les protéines, potentiel irritant minimal.

### 2. Détersivité par solubilisation
Le glucose en tête hydrophile forme des liaisons hydrogène avec l'eau et les salissures hydrophiles, tandis que la chaîne coco solubilise les lipides sébacés en micelles. Détersivité douce à modérée selon la longueur de chaîne.

### 3. Mousse
Produit une mousse fine et abondante, légèrement différente des sulfates (moins crémeuse, plus aérée). Stable en présence d'électrolytes.

### 4. Compatibilité universelle
Non ionique : compatible avec tensioactifs anioniques, cationiques et amphotères. Ne réagit pas avec les actifs chargés — liberté formulatoire maximale.

## Avantages
- 100% d'origine végétale, certifiable Cosmos/Ecocert
- Biodégradable rapidement
- Adapté peaux sensibles, bébés, formules naturelles

## Concentration d'usage
5–20% comme tensioactif principal dans les shampoings sans sulfates ; 2–8% en co-tensioactif.
`,
  },
  {
    name: 'Decyl Glucoside',
    slug: INGREDIENT_SLUGS.DECYL_GLUCOSIDE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Alkyl glucoside à chaîne C10 décyle, tensioactif non ionique très doux, faible CMC, adapté aux formules bébé et shampoings ultra-doux.',
    content: `
# Decyl Glucoside

Le decyl glucoside est un alkyl polyglycoside (APG) formé par condensation du 1-décanol (alcool gras C10) avec le glucose. La chaîne décyle plus courte que le coco-glucoside lui confère des propriétés spécifiques.

## INCI
**DECYL GLUCOSIDE** (CAS: 54549-25-6 | COSING: 33161)

## Mécanisme d'action

### 1. Douceur optimale grâce à la chaîne C10
La chaîne décyle (C10) est plus courte que les chaînes C12–C16 du coco-glucoside. Elle produit des micelles plus petites, moins tensioactives mais plus douces — détersivité légère idéale pour cuirs chevelus fragiles.

### 2. CMC élevée et faible concentration effective
La CMC du decyl glucoside est plus élevée que celle des glucosides à longues chaînes, ce qui signifie qu'il forme des micelles moins efficacement à basse concentration. Avantage : à concentration modérée, l'effet nettoyant reste doux.

### 3. Emulsification légère
Bonne capacité émulsifiante pour les huiles légères — utile dans les shampoings nourrissants ou les formules "co-wash" légères.

## Comparaison avec le coco-glucoside
Le decyl glucoside est plus doux mais moins détersif que le coco-glucoside. Les deux sont souvent associés pour équilibrer douceur et performance.

## Concentration d'usage
5–15% comme tensioactif principal ou co-principal dans formules ultra-douces.
`,
  },
  {
    name: 'Lauryl Glucoside',
    slug: INGREDIENT_SLUGS.LAURYL_GLUCOSIDE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Alkyl glucoside à chaîne C12 laurique, tensioactif non ionique naturel avec le meilleur équilibre détersivité/douceur de la famille APG.',
    content: `
# Lauryl Glucoside

Le lauryl glucoside est un alkyl polyglycoside (APG) obtenu par condensation de l'alcool laurique (C12) avec le glucose. La chaîne laurique C12 est la longueur optimale pour l'activité tensioactive — c'est aussi pourquoi le SLS (lauryl sulfate) est si actif, mais ici sans sulfate.

## INCI
**LAURYL GLUCOSIDE** (CAS: 110615-47-9 | COSING: 37949)

## Mécanisme d'action

### 1. Détersivité optimale dans la famille APG
La chaîne C12 laurique est la plus active pour la solubilisation micellaire des lipides. Parmi les glucosides, c'est le lauryl qui offre la meilleure performance détersive, comparable à certains sulfates doux.

### 2. Non ionique : compatibilité universelle
Absence de charge → compatible avec tous types de tensioactifs co-formulés. Peut être utilisé avec des actifs cationiques (kératine quaternaire, protéines) sans précipitation.

### 3. Mousse abondante
Produit une mousse plus volumineuse que le decyl glucoside, légèrement moins que le coco-glucoside — profil intermédiaire idéal.

### 4. Biodégradabilité
Comme tous les APG, biodégradable rapidement (>98% en 28 jours). Profil environnemental excellent.

## Avantages
- Meilleur détersif de la famille APG
- Adapté cheveux normaux à gras dans les shampoings naturels
- Certifiable Cosmos/Ecocert

## Concentration d'usage
5–15% comme tensioactif principal ou en mélange avec CAPB ou coco-glucoside.
`,
  },
  {
    name: 'Caprylyl/Capryl Glucoside',
    slug: INGREDIENT_SLUGS.CAPRYLYL_CAPRYL_GLUCOSIDE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Mélange APG de courtes chaînes C8–C10, tensioactif non ionique très doux avec propriétés émulsifiantes et solubilisantes, idéal pour formules légères et bébé.',
    content: `
# Caprylyl/Capryl Glucoside

Le caprylyl/capryl glucoside est un alkyl polyglycoside (APG) mixte formé par condensation de caprylol (C8) et de caprylol/caprol (C10) avec le glucose. Les deux chaînes courtes lui confèrent des propriétés de solubilisation particulières.

## INCI
**CAPRYLYL/CAPRYL GLUCOSIDE** (CAS: 68515-73-1 | COSING: 31797)

## Mécanisme d'action

### 1. Chaînes courtes : douceur maximale
Les chaînes C8 et C10 forment des micelles plus petites et moins actives que les chaînes C12 ou C14. Pouvoir détersif faible — adapté aux cuirs chevelus très sensibles, bébés ou formules "no-lather".

### 2. Solubilisation d'actifs lipophiles
Les chaînes courtes sont particulièrement efficaces pour solubiliser les parfums, huiles essentielles et actifs lipophiles en phase aqueuse. Très utilisé comme solubilisant dans les formules transparentes.

### 3. Émulsification légère
Bonne capacité à stabiliser des émulsions huile-eau légères sans alourdir la formule.

## Utilisations typiques
- Shampoings ultra-doux (bébé, post-chimique, cuir chevelu atopique)
- Formules pour cheveux fins où le poids est un problème
- Solubilisation d'huiles essentielles dans des sprays aqueux

## Concentration d'usage
2–10% comme co-tensioactif ou solubilisant ; 5–15% comme tensioactif principal dans formules très légères.
`,
  },
  {
    name: 'Polysorbate 20',
    slug: INGREDIENT_SLUGS.POLYSORBATE_20,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Ester de sorbitan éthoxylé (laurate), solubilisant non ionique léger, principalement utilisé pour incorporer les huiles et parfums dans les formules aqueuses capillaires.',
    content: `
# Polysorbate 20 (Tween 20)

Le polysorbate 20 (PS20) est un ester de sorbitol éthoxylé et d'acide laurique. Sa chaîne lipophile courte (C12) et sa longue tête hydrophile polyéthylèneglycol (20 EO) lui confèrent un HLB élevé (~16,7) — excellent solubilisant/émulsifiant pour phases aqueuses.

## INCI
**POLYSORBATE 20** (CAS: 9005-64-5 | COSING: 56178)

## Mécanisme d'action

### 1. Solubilisation d'actifs lipophiles
Le PS20 forme des micelles gonflées (swollen micelles) capables d'incorporer des huiles et des parfums dans la phase aqueuse. C'est son usage principal en shampoing : solubiliser des huiles essentielles pour obtenir des formules limpides.

### 2. Émulsification faible à modérée
HLB élevé = tendance à former des émulsions H/E (huile dans eau) légères. Moins stable que les émulsifiants à HLB intermédiaire, mais suffisant pour des émulsions légères.

### 3. Conditionnement léger
Faible dépôt sur la cuticule, légèrement lubrifiant — apporte une touche de brillance sans alourdir.

### 4. Rinçabilité
Le PS20 se rince facilement en raison de sa forte hydrophilie — ne laisse pas de résidu lourd.

## Usage formulatoire
Principalement comme **solubilisant** (pour huiles essentielles, fragrances, vitamines liposolubles dans des formules limpides) plutôt que comme tensioactif détersif principal.

## Concentration d'usage
0,5–3% comme solubilisant ; jusqu'à 5% en co-émulsifiant.
`,
  },
  {
    name: 'Polysorbate 60',
    slug: INGREDIENT_SLUGS.POLYSORBATE_60,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Ester de sorbitan éthoxylé (stéarate), émulsifiant non ionique à HLB élevé, utilisé pour stabiliser les émulsions légères dans après-shampooings et traitements capillaires.',
    content: `
# Polysorbate 60 (Tween 60)

Le polysorbate 60 (PS60) est un ester de sorbitol éthoxylé et d'acide stéarique (C18). La chaîne stéaryle plus longue que le PS20 lui confère un HLB légèrement inférieur (~14,9) et une meilleure capacité émulsifiante pour les corps gras.

## INCI
**POLYSORBATE 60** (CAS: 9005-67-8 | COSING: 56180)

## Mécanisme d'action

### 1. Émulsification H/E
HLB de ~15 → émulsions huile-dans-eau stables. Utilisé pour incorporer des huiles végétales et des beurres fondus dans des formules légères sans graisser la formule.

### 2. Solubilisation de corps gras moyens
La chaîne C18 solubilise mieux les corps gras à chaînes longues (stéarine, palmitique) que le PS20 (C12). Utile dans les après-shampooings contenant des esters de cire.

### 3. Stabilisation d'émulsions
En association avec des co-émulsifiants (alcools gras, glycérol stéarate), stabilise les émulsions légères des après-shampooings et des soins sans rinçage.

## Différence PS20 vs PS60 vs PS80

| | Polysorbate 20 | Polysorbate 60 | Polysorbate 80 |
|---|---|---|---|
| Chaîne | C12 (laurate) | C18 (stéarate) | C18:1 (oléate) |
| HLB | ~16,7 | ~14,9 | ~15 |
| Usage principal | Solubilisant | Émulsifiant H/E | Émulsifiant + solubilisant |

## Concentration d'usage
1–5% comme co-émulsifiant dans après-shampooings et sérums capillaires.
`,
  },
  {
    name: 'Polysorbate 80',
    slug: INGREDIENT_SLUGS.POLYSORBATE_80,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      "Ester de sorbitan éthoxylé (oléate), émulsifiant non ionique polyvalent, solubilise huiles et silicones dans les formules aqueuses et améliore l'étalement des soins capillaires.",
    content: `
# Polysorbate 80 (Tween 80)

Le polysorbate 80 (PS80) est l'ester d'oléate (C18:1 insaturé) du sorbitol éthoxylé. La double liaison de la chaîne oléyle confère une fluidité particulière aux micelles formées, différenciant son comportement de celui du PS60 (stéarate saturé).

## INCI
**POLYSORBATE 80** (CAS: 9005-65-6 | COSING: 56183)

## Mécanisme d'action

### 1. Solubilisation optimale des huiles insaturées
La chaîne oléyle (C18:1) a une affinité particulière pour les huiles végétales riches en acides gras insaturés (jojoba, argan, avocat). Solubilise ces huiles plus efficacement que le PS20 ou le PS60 dans les formules aqueuses transparentes.

### 2. Solubilisation des silicones légères
Le PS80 peut solubiliser les silicones volatiles (cyclométhicone) et certaines dimethicones légères — utilisé dans les shampoings contenant des silicones pour maintenir la limpidité de la formule.

### 3. Amélioration de l'étalement
Réduit la tension superficielle des formules, améliorant leur étalement sur la fibre et le cuir chevelu — meilleure distribution des actifs.

### 4. Émulsification légère H/E
HLB ~15 → émulsions légères huile-dans-eau. Souvent associé à un co-émulsifiant pour plus de stabilité.

## Avantage vs PS20 et PS60
Le PS80 est le plus polyvalent des trois : il solubilise aussi bien les huiles légères que lourdes, et tolère mieux les huiles insaturées complexes.

## Concentration d'usage
0,5–3% comme solubilisant ; 1–5% en co-émulsifiant.
`,
  },
]

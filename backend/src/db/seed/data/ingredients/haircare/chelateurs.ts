import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_CHELATEURS: IngredientInput[] = [
  {
    name: 'Disodium EDTA',
    slug: INGREDIENT_SLUGS.DISODIUM_EDTA_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      "Chélateur synthétique disel de l'EDTA, séquestre les ions calcaire et métaux lourds qui déstabilisent les formules et ternissent la fibre capillaire.",
    content: `
# Disodium EDTA

Le disodium EDTA (acide éthylènediaminetétraacétique disel sodique) est le chélateur cosmétique le plus utilisé au monde. Il séquestre les ions métalliques divalents et trivalents (Ca²⁺, Mg²⁺, Fe³⁺, Cu²⁺) qui perturbent les formules cosmétiques et dégradent la fibre capillaire.

## INCI
**DISODIUM EDTA** (CAS: 139-33-3 | COSING: 34286)

## Mécanisme d'action

### 1. Chélation des ions métalliques
L'EDTA forme des complexes octaédraux stables avec les ions di- et trivalents via ses quatre groupements acétate et les deux azotes aminés. Ces complexes sont hydrosolubles et inactifs — les ions métalliques ne peuvent plus interagir avec les autres constituants de la formule.

### 2. Stabilisation des formules contre l'eau dure
L'eau du robinet contient du calcium et du magnésium (eau dure) qui forment des sels insolubles avec les tensioactifs anioniques, réduisant leur efficacité moussante et lavante. L'EDTA séquestre ces ions avant qu'ils ne précipitent, maintenant les performances du shampoing.

### 3. Protection de la fibre contre les métaux exogènes
Les cheveux accumulent des ions métalliques (cuivre issu de l'eau chlorée, fer de l'eau de robinet, métaux lourds environnementaux) dans le cortex. Ces dépôts catalysent des réactions d'oxydation qui dégradent la kératine et ternissent la couleur. L'EDTA les séquestre en surface et les élimine au rinçage.

### 4. Potentialisation des conservateurs
Les ions métalliques peuvent inactiver les conservateurs organiques. En les chélatant, l'EDTA renforce indirectement l'efficacité du système conservateur.

## Considérations environnementales

L'EDTA est peu biodégradable (< 20% en 28 jours, test OCDE 301). Son accumulation dans les eaux de surface et sa remobilisation de métaux lourds des sédiments suscitent des préoccupations environnementales, poussant à son remplacement progressif par des alternatives plus biodégradables (gluconate de sodium, GLDA, acide phytique).

## Concentration d'usage

- Shampoings, après-shampooings, masques : 0,05–0,1%
`,
  },
  {
    name: 'Tetrasodium EDTA',
    slug: INGREDIENT_SLUGS.TETRASODIUM_EDTA,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      "Sel tétrasodique de l'EDTA, chélateur plus soluble que la forme disodique, efficace à pH neutre à basique pour la stabilisation des formules capillaires.",
    content: `
# Tetrasodium EDTA

Le tetrasodium EDTA (acide éthylènediaminetétraacétique sel tétrasodique) est la forme totalement neutralisée de l'EDTA. Plus soluble dans l'eau que le disodium EDTA et efficace sur une plage de pH plus large, il est privilégié dans les formules à pH neutre à légèrement basique (shampoings, laques, gels coiffants).

## INCI
**TETRASODIUM EDTA** (CAS: 64-02-8 | COSING: 58404)

## Différences avec le Disodium EDTA

| Propriété | Disodium EDTA | Tetrasodium EDTA |
|---|---|---|
| pH efficacité | 4–7 | 7–11 |
| Solubilité dans l'eau | Bonne | Très élevée |
| Utilisation typique | Shampoings acides, après-shampooings | Shampoings, gels, produits à pH neutre–basique |
| Biodégradabilité | Faible | Faible |

## Mécanisme d'action

Identique au disodium EDTA : formation de complexes stables avec les ions métalliques divalents et trivalents (Ca²⁺, Mg²⁺, Fe³⁺, Cu²⁺, Zn²⁺), les rendant inactifs et hydrosolubles.

### 1. Chélation eau dure
Séquestre le calcium et le magnésium de l'eau de ville, préservant la mousse et l'efficacité lavante des tensioactifs anioniques.

### 2. Protection anti-oxydative
Neutralise les ions ferreux (Fe²⁺/Fe³⁺) et cuivreux (Cu⁺/Cu²⁺) qui catalysent la peroxydation lipidique et la dégradation des colorants, stabilisant la couleur et la formule.

### 3. Chélation à pH basique
Particulièrement utile dans les formules à pH > 7 (colorations, permanentes, défrisages) où le disodium EDTA perd de son efficacité.

## Considérations environnementales

Même profil de biodégradabilité limitée que le disodium EDTA. Tendance à être remplacé par le GLDA tétrasodique (acide L-glutamique N,N-diacétique) ou l'acide phytique dans les formules certifiées naturelles.

## Concentration d'usage

- Shampoings et produits coiffants : 0,05–0,2%
`,
  },
  {
    name: 'Acide Phytique (Phytic Acid)',
    slug: INGREDIENT_SLUGS.PHYTIC_ACID_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      "Hexaphosphate d'inositol d'origine végétale, chélateur biodégradable puissant des métaux lourds accumulés dans la fibre capillaire, compatible formules naturelles et Cosmos.",
    content: `
# Acide Phytique (Phytic Acid)

L'acide phytique (myo-inositol hexakisphosphate, IP6) est le principal composé de stockage du phosphore dans les graines végétales (riz, blé, maïs, légumineuses). C'est l'alternative naturelle et biodégradable la plus puissante à l'EDTA pour la chélation des ions métalliques en cosmétique capillaire.

## INCI
**PHYTIC ACID** (CAS: 83-86-3 | COSING: 75562)

## Mécanisme d'action

### 1. Chélation multisite hautement efficace
L'IP6 possède 12 groupements phosphate pouvant former des complexes stables avec une grande variété de cations métalliques (Fe³⁺, Cu²⁺, Zn²⁺, Ca²⁺, Mg²⁺, Al³⁺). Sa capacité de chélation par molécule est supérieure à celle de l'EDTA pour les cations trivalents.

### 2. Élimination des métaux accumulés dans la fibre
Les cheveux fixent progressivement les métaux lourds de l'eau, des colorants et de l'environnement dans leur cortex. L'acide phytique les chélate en surface et dans les couches superficielles de la fibre, facilitant leur rinçage — amélioration de la brillance et protection contre les dommages oxydatifs catalysés par les métaux.

### 3. Inhibition de la peroxydation lipidique
En séquestrant Fe²⁺ et Cu²⁺, l'acide phytique inhibe les réactions de Fenton et Haber-Weiss génératrices de radicaux hydroxyles (·OH) qui oxydent les lipides intercellulaires de la cuticule.

### 4. Régulation du pH
Propriétés légèrement acidifiantes utiles pour fermer la cuticule après des traitements alcalins (coloration, décoloration).

## Avantages environnementaux

Biodégradable (> 60% en 28 jours selon OCDE 301), d'origine 100% végétale, compatible certifications Cosmos/Ecocert et NATRUE. Représente l'alternative verte de référence à l'EDTA.

## Concentration d'usage

- Shampoings, après-shampooings, masques : 0,05–0,5%
- Formules "detox métaux" (pré-décoloration) : jusqu'à 1%
`,
  },
  {
    name: 'Gluconate de Sodium (Sodium Gluconate)',
    slug: INGREDIENT_SLUGS.SODIUM_GLUCONATE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      "Sel sodique de l'acide gluconique, chélateur biodégradable d'origine naturelle, alternatif vert à l'EDTA pour la stabilisation des formules et la séquestration des ions calcaire.",
    content: `
# Gluconate de Sodium (Sodium Gluconate)

Le gluconate de sodium est le sel sodique de l'acide gluconique, produit par fermentation bactérienne ou fongique du glucose. C'est un chélateur biodégradable doux, largement utilisé dans les formulations cosmétiques naturelles et dans les industries alimentaire et pharmaceutique.

## INCI
**SODIUM GLUCONATE** (CAS: 527-07-1 | COSING: 57237)

## Mécanisme d'action

### 1. Chélation par coordination
L'ion gluconate possède plusieurs groupements hydroxyle et carboxylate capables de former des complexes de coordination avec les ions métalliques divalents (Ca²⁺, Mg²⁺, Fe²⁺, Cu²⁺). La stabilité de ces complexes est inférieure à celle de l'EDTA mais suffisante pour la plupart des applications cosmétiques.

### 2. Séquestration des ions calcium (eau dure)
Protège les tensioactifs anioniques des effets négatifs du calcium et du magnésium présents dans l'eau du robinet. Maintien des performances moussantes et lavantes du shampoing.

### 3. Stabilisation antioxydante
Séquestre Fe²⁺/Fe³⁺ et Cu²⁺, cofacteurs des réactions radicalaires oxydatives, protégeant les actifs sensibles à l'oxydation (vitamines, polyphénols, acides gras insaturés) dans la formule.

### 4. Régulateur de pH
L'acide gluconique libre présente des propriétés tampons légères à pH 4–6, stabilisant le pH des formules acides (après-shampooings, masques).

## Avantages par rapport à l'EDTA

- **Biodégradable** : > 98% en 28 jours (test OCDE 301)
- **Origine naturelle** : fermentation du glucose — certifiable Cosmos/Ecocert
- **Non toxique** : GRAS (Generally Recognized As Safe) pour usage alimentaire
- **Éco-profil favorable** : pas de problème de remobilisation des métaux lourds dans les sédiments

## Limites

Pouvoir chélateur inférieur à l'EDTA sur les cations trivalents (Fe³⁺, Al³⁺). Souvent associé à d'autres chélateurs naturels (acide phytique, acide citrique) pour atteindre des performances équivalentes.

## Concentration d'usage

- Shampoings, après-shampooings, masques : 0,1–0,5%
`,
  },
]

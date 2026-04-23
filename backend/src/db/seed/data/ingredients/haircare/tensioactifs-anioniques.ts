import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_TENSIOACTIFS_ANIONIQUES: IngredientInput[] = [
  {
    name: 'Sodium Lauryl Sulfate (SLS)',
    slug: INGREDIENT_SLUGS.SLS_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Tensioactif anionique puissant, agent moussant efficace mais potentiellement irritant pour le cuir chevelu et dénaturant pour les protéines kératiniques.',
    content: `
# Sodium Lauryl Sulfate (SLS)

Le SLS est un sulfate d'alkyle à chaîne C12, obtenu par sulfonation de l'alcool laurique (huile de coco ou de palme) suivi d'une neutralisation au sodium. C'est l'un des tensioactifs les plus étudiés et les plus critiqués en cosmétique capillaire.

## INCI
**SODIUM LAURYL SULFATE** (CAS: 151-21-3 | COSING: 57292)

## Mécanisme d'action

### 1. Détersivité
Le SLS forme une micelle autour des lipides sébacés, des résidus de coiffants et des particules de pollution. Sa CMC (concentration micellaire critique) très basse (~8 mM) lui confère une puissance détergente élevée même à faible concentration.

### 2. Solubilisation des lipides cutanés
Le SLS ne se contente pas d'éliminer les salissures : il extrait aussi les lipides intercellulaires de la cuticule et les sébums du cuir chevelu. Cette lipodéplétion répétée fragilise la barrière et peut induire irritation, sécheresse et desquamation.

### 3. Dénaturation protéique
À concentration >1%, le SLS peut se lier aux protéines kératiniques et aux cellules épithéliales, entraînant une légère dénaturation — responsable du gonflement de la cuticule et d'une porosité accrue après lavages répétés.

## Avantages formulatoires
- Moussant exceptionnel (mousse abondante, blanche, stable)
- Excellent pouvoir dégraissant — adapté cheveux très gras
- Faible coût, grande disponibilité

## Limites et controverses
- Irritant cuir chevelu sensible, dermite de contact possible
- Interférence avec la couleur : accélère la perte de pigments de coloration
- Non recommandé cheveux bouclés/très secs/colorés
- Interdit dans certaines certifications naturelles (Cosmos, Ecocert)

## Concentration d'usage
- Formules grand public : 5–15%
- Formules professionnelles denses : jusqu'à 20%

> ⚠️ L'irritation est dose-dépendante. À 0,5–1%, le SLS est bien toléré sur cheveux normaux ; c'est l'usage quotidien à haute concentration qui pose problème.
`,
  },
  {
    name: 'Sodium Laureth Sulfate (SLES)',
    slug: INGREDIENT_SLUGS.SLES_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Version éthoxylée du SLS, plus douce et moins irritante, tensioactif anionique de référence dans la majorité des shampoings du marché.',
    content: `
# Sodium Laureth Sulfate (SLES)

Le SLES est l'ester sulfate d'alcool laurylique éthoxylé. L'éthoxylation (ajout de 1 à 3 motifs oxyde d'éthylène) réduit la charge anionique effective et améliore considérablement le profil tolérance par rapport au SLS.

## INCI
**SODIUM LAURETH SULFATE** (CAS: 68585-34-2 | COSING: 57297)

Désigné aussi **Sodium Lauryl Ether Sulfate** ; le degré d'éthoxylation est précisé (ex: SLES-2 = 2 EO).

## Mécanisme d'action

### 1. Détersivité modérée
La chaîne éthoxylée crée un "écran" stérique qui réduit l'interaction directe du groupement sulfate avec les kératinocytes et les protéines. Détersivité excellente mais moins agressive que le SLS.

### 2. Moussant
Produit une mousse abondante, crémeuse et stable — propriété sensorielle très appréciée par les consommateurs.

### 3. Solubilisation
Bonne capacité à solubiliser les actifs lipophiles (huiles essentielles, vitamines liposolubles) dans la phase aqueuse du shampoing.

## Comparaison SLS vs SLES

| Propriété | SLS | SLES |
|---|---|---|
| Irritation potentielle | Élevée | Modérée |
| Détersivité | Très élevée | Élevée |
| Mousse | Abondante | Très abondante et crémeuse |
| CMC | ~8 mM | ~1 mM |
| Tolérance cuir chevelu | Faible–moyenne | Bonne |

## Concentration d'usage
5–15% dans les shampoings standards ; 10–20% dans les shampooings professionnels.

> ⚠️ Peut contenir des traces de 1,4-dioxane (sous-produit d'éthoxylation) si non purifié. Les formules conformes aux réglementations UE sont traités pour éliminer ce contaminant.
`,
  },
  {
    name: 'Ammonium Lauryl Sulfate',
    slug: INGREDIENT_SLUGS.AMMONIUM_LAURYL_SULFATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Analogue ammonium du SLS, tensioactif anionique puissant produisant une mousse dense, légèrement plus doux que son homologue sodique.',
    content: `
# Ammonium Lauryl Sulfate

L'ammonium lauryl sulfate (ALS) est le sel ammonium de l'acide dodécylsulfurique. Il est obtenu par la même voie de synthèse que le SLS, avec une neutralisation à l'ammoniac plutôt qu'à la soude.

## INCI
**AMMONIUM LAURYL SULFATE** (CAS: 2235-54-3 | COSING: 28861)

## Mécanisme d'action

Identique au SLS : détersivité par formation de micelles, dégraissage des lipides sébacés et coiffants. Le contre-ion ammonium (NH₄⁺) plutôt que sodium (Na⁺) confère :

### 1. Légère douceur accrue
Le contre-ion ammonium génère une interaction ionique légèrement moins forte avec les protéines kératiniques que le sodium, résultant en un profil d'irritation légèrement inférieur.

### 2. Texture formulatoire différente
L'ALS produit des viscosités naturelles différentes de celles du SLES dans les matrices shampoings — souvent utilisé pour moduler la texture sans épaississant.

### 3. Compatibilité pH
Stable sur une plage de pH légèrement plus large que le SLS ; adapté aux shampoings légèrement acides (pH 5–6).

## Avantages
- Mousse abondante et crémeuse
- Bon pouvoir dégraissant
- Légèrement mieux toléré que SLS sur cuir chevelu sensible

## Concentration d'usage
5–15% dans shampoings classiques.

> Souvent utilisé en remplacement du SLS dans les shampoings "sans SLS" — ne signifie pas pour autant "sans sulfates".
`,
  },
  {
    name: 'Ammonium Laureth Sulfate',
    slug: INGREDIENT_SLUGS.AMMONIUM_LAURETH_SULFATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Version éthoxylée du sel ammonium, tensioactif anionique doux très moussant, alternative au SLES dans les formules à pH ajusté.',
    content: `
# Ammonium Laureth Sulfate

L'ammonium laureth sulfate est le sel ammonium de l'alcool laurylique éthoxylé sulfaté. Il combine la douceur de l'éthoxylation avec le profil solubilité du contre-ion ammonium.

## INCI
**AMMONIUM LAURETH SULFATE** (CAS: 32612-48-9 | COSING: 28857)

## Mécanisme d'action

### 1. Détersivité douce
L'éthoxylation réduit l'affinité du groupement sulfate pour les protéines kératiniques et les cellules épithéliales. Efficacité détersive élevée avec moindre potentiel irritant.

### 2. Mousse crémeuse
Produit une mousse dense et crémeuse, légèrement différente de celle du SLES sodique — souvent perçue comme plus luxueuse en termes sensoriels.

### 3. Solubilité étendue
Meilleure solubilité à basse température que son analogue sodique ; facilite la formulation en conditions hivernales.

## Comparaison avec SLES
Profil fonctionnel très proche du SLES. La différence principale réside dans la compatibilité formulatoire avec certains actifs cationiques (légèrement meilleure avec ALS/ALES) et la texture de mousse.

## Concentration d'usage
5–15% en shampoing standard.
`,
  },
  {
    name: 'Sodium Cocoyl Sulfate',
    slug: INGREDIENT_SLUGS.SODIUM_COCOYL_SULFATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      "Mélange de sulfates d'alkyle dérivés du coco (C8–C18), tensioactif anionique naturel plus doux que le SLS pur grâce à la diversité de ses chaînes.",
    content: `
# Sodium Cocoyl Sulfate

Le sodium cocoyl sulfate est un mélange de sulfates d'alcools gras issus de l'huile de coco. Contrairement au SLS (C12 pur), il contient plusieurs chaînes carbonées (C8 caprylique, C10 caprique, C12 laurique, C14 myristique, C16 palmitique, C18 stéarique) dans des proportions proches de celles de l'huile de coco naturelle.

## INCI
**SODIUM COCOYL SULFATE** (CAS: 97069-66-4 | COSING: 57189)

## Mécanisme d'action

### 1. Détersivité équilibrée
Le mélange de chaînes confère une détersivité efficace mais moins agressive que le SLS C12 pur. Les chaînes courtes (C8–C10) apportent de la douceur ; les chaînes longues (C14–C18) améliorent la crémosite de la mousse.

### 2. Moussant naturel
Produit une mousse dense et stable, avec des propriétés sensorielles proches de celles des tensioactifs naturels. Compatible certifications Cosmos/Ecocert.

### 3. Profil d'irritation réduit
L'hétérogénéité des chaînes dilue l'effet du C12 (le plus irritant) et réduit globalement la pénétration cutanée.

## Avantages
- Certifiable naturel (origine coco 100%)
- Mousse abondante malgré la douceur
- Bon dégraissant adapté cheveux normaux à gras

## Concentration d'usage
5–15% dans les shampoings naturels et certifiés.
`,
  },
  {
    name: 'Disodium Laureth Sulfosuccinate',
    slug: INGREDIENT_SLUGS.DISODIUM_LAURETH_SULFOSUCCINATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Tensioactif anionique doux dérivé du succinate, très bien toléré sur cuir chevelu sensible et cheveux colorés, utilisé en co-tensioactif.',
    content: `
# Disodium Laureth Sulfosuccinate

Le disodium laureth sulfosuccinate est un ester sulfosuccinique de l'alcool laurylique éthoxylé. Sa structure di-ionique lui confère une douceur exceptionnelle comparée aux sulfates classiques.

## INCI
**DISODIUM LAURETH SULFOSUCCINATE** (CAS: 39354-45-5 | COSING: 33454)

## Mécanisme d'action

### 1. Douceur de surface
Deux charges anioniques réparties sur une même molécule réduisent l'interaction per-charge avec les protéines et les membranes cellulaires. Potentiel irritant très faible — un des tensioactifs anioniques les mieux tolérés.

### 2. Détersivité modérée
Moins puissant que le SLES en termes de dégraissage. Idéal pour cheveux normaux à secs, shampoings "doux" et formules bébé.

### 3. Synergie avec d'autres tensioactifs
Utilisé comme co-tensioactif secondaire avec les glucosides ou la coco-bétaïne pour améliorer la tolérance et la sensorialité de la formule globale.

## Avantages
- Adapté cuirs chevelus sensibles, réactifs, post-coloration
- N'accélère pas la perte de couleur sur cheveux colorés
- Bonne compatibilité avec les actifs protéiques et les soins réparateurs

## Concentration d'usage
2–10% en co-tensioactif dans shampoings doux et formules spéciales.
`,
  },
  {
    name: 'Sodium Lauroyl Sarcosinate',
    slug: INGREDIENT_SLUGS.SODIUM_LAUROYL_SARCOSINATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Tensioactif anionique acide aminé (sarcosinique), doux, naturel, avec un pH de formulation favorable au respect du microbiome du cuir chevelu.',
    content: `
# Sodium Lauroyl Sarcosinate

Le sodium lauroyl sarcosinate est le sel sodique de l'acide N-lauroyl sarcosinique, lui-même dérivé de la condensation de l'acide laurique avec la sarcosine (N-méthylglycine). C'est un tensioactif de la famille des acides aminés.

## INCI
**SODIUM LAUROYL SARCOSINATE** (CAS: 137-16-6 | COSING: 57262)

## Mécanisme d'action

### 1. Détersivité douce par structure acide aminé
La sarcosine en tête polaire confère une affinité naturelle avec les protéines kératiniques tout en réduisant l'interaction agressive sur les membranes cellulaires.

### 2. pH naturellement acide
En solution, ce tensioactif maintient un pH de 5–6, proche du pH naturel du cuir chevelu (4,5–5,5). Favorable au respect du film hydrolipidique et du microbiome capillaire.

### 3. Anti-accumulation de cations
La tête anionique repousse les dépôts cationiques (calcaire, résidus conditionneurs) — contribue à un cheveu plus léger et plus propre au fil des lavages.

## Avantages
- Certifiable naturel (Cosmos/Ecocert)
- Doux sur cuirs chevelus sensibles
- Bon agent moussant secondaire

## Concentration d'usage
2–8% en co-tensioactif ; rarement utilisé seul comme base principale.
`,
  },
  {
    name: 'Sodium Cocoyl Glutamate',
    slug: INGREDIENT_SLUGS.SODIUM_COCOYL_GLUTAMATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      "Tensioactif anionique dérivé de l'acide glutamique et du coco, très doux, certifiable naturel, adapté aux shampoings sans sulfates pour cheveux sensibles.",
    content: `
# Sodium Cocoyl Glutamate

Le sodium cocoyl glutamate est obtenu par condensation des acides gras de l'huile de coco avec l'acide L-glutamique, un acide aminé naturel. Il appartient à la famille des tensioactifs amino-acides, particulièrement prisés en cosmétique naturelle.

## INCI
**SODIUM COCOYL GLUTAMATE** (CAS: 68187-30-4 | COSING: 57183)

## Mécanisme d'action

### 1. Détersivité douce par biomimétisme amino-acide
La tête polaire glutamique imite les acides aminés de la kératine — faible tension interfaciale avec les cellules épithéliales, peu ou pas d'effet dénaturant sur les protéines.

### 2. Rinçabilité et légèreté
La structure glutamique favorise un rinçage complet sans résidu. Laisse les cheveux légers et sans effet lourd post-lavage.

### 3. Compatibilité microbiome
Formule à pH 5–6 compatible avec le film acide du cuir chevelu. Ne perturbe pas significativement la flore microbienne cutanée.

## Avantages
- 100% d'origine naturelle, certifiable Cosmos/Ecocert
- Adapté peaux atopiques, cuirs chevelus réactifs
- Bon profil tolérance enfants et personnes sensibles

## Concentration d'usage
5–15% comme tensioactif principal ou co-principal dans les shampoings doux et sans sulfates.
`,
  },
  {
    name: 'Sodium Lauroyl Glutamate',
    slug: INGREDIENT_SLUGS.SODIUM_LAUROYL_GLUTAMATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Tensioactif amino-acide très doux à chaîne C12 laurique, excellent profil tolérance pour cuirs chevelus sensibles et formules bébé.',
    content: `
# Sodium Lauroyl Glutamate

Le sodium lauroyl glutamate est la variante laurique (C12) du sodium cocoyl glutamate. La chaîne laurique fixe confère une CMC plus définie et une performance moussante légèrement supérieure à celle du mélange cocoyle.

## INCI
**SODIUM LAUROYL GLUTAMATE** (CAS: 29923-31-7 | COSING: 57264)

## Mécanisme d'action

### 1. Détersivité douce
Même mécanisme amino-acide que le cocoyl glutamate : interaction non dénaturante avec la kératine. La chaîne C12 offre une détersivité légèrement supérieure au mélange coco (qui dilue avec des chaînes longues moins actives).

### 2. Profil mousse
Produit une mousse fine et crémeuse, moins volumineuse que les sulfates mais de qualité sensorielle élevée.

### 3. Action sur la cuticule
La tête glutamique forme des liaisons hydrogène superficielles avec la cuticule, contribuant à un légèrement effet lissant au lavage.

## Avantages
- Origine naturelle certifiable
- Idéal shampoings bébé, formules hypoallergéniques
- Compatible pH acide (5–6)

## Concentration d'usage
5–12% comme tensioactif principal ou co-principal.
`,
  },
  {
    name: 'Sodium Cocoyl Isethionate (SCI)',
    slug: INGREDIENT_SLUGS.SODIUM_COCOYL_ISETHIONATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      "Tensioactif anionique solide dérivé de l'acide iséthionique et du coco, produit une mousse crémeuse et riche tout en respectant la barrière du cuir chevelu.",
    content: `
# Sodium Cocoyl Isethionate (SCI)

Le sodium cocoyl isethionate est un ester de l'acide iséthionique (2-hydroxyéthanesulfonate de sodium) et des acides gras de l'huile de coco. Il se présente sous forme de poudre/pastilles blanches, base de nombreux shampoings solides.

## INCI
**SODIUM COCOYL ISETHIONATE** (CAS: 61789-32-0 | COSING: 57185)

## Mécanisme d'action

### 1. Détersivité douce par ester sulfonate
Le groupement iséthionate est moins ionique que le sulfate, ce qui réduit l'interaction avec les protéines kératiniques et les cellules du cuir chevelu.

### 2. Mousse crémeuse dense
Signature sensorielle remarquable : produit une mousse riche, crémeuse, "onctueuse", très appréciée dans les shampoings solides et les syndet bars. La mousse est conditionnante en elle-même.

### 3. Douceur tactile
Laisse les cheveux et le cuir chevelu avec un ressenti doux immédiat — souvent décrit comme "proche du savon mais sans les inconvénients du savon à pH élevé".

## Usage formulatoire
Base solide de prédilection pour shampoings solides et barres de nettoyage. Peut être utilisé liquide en émulsion à pH 5–7.

## Concentration d'usage
- Shampoings solides : 30–60% (base principale)
- Shampoings liquides : 5–15% en co-tensioactif

> Certifiable naturel (Cosmos/Ecocert) selon l'origine des acides gras utilisés.
`,
  },
  {
    name: 'Sodium Lauryl Methyl Isethionate (SLMI)',
    slug: INGREDIENT_SLUGS.SODIUM_LAURYL_METHYL_ISETHIONATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      "Tensioactif anionique de nouvelle génération dérivé de l'isethionate méthylé, offre détersivité et douceur supérieures au SLES avec une mousse microstructurée.",
    content: `
# Sodium Lauryl Methyl Isethionate (SLMI)

Le SLMI est un tensioactif acylisethionate méthylé, développé comme alternative haute performance aux sulfates éthoxylés. Sa structure unique lui confère un profil performances/tolérance amélioré.

## INCI
**SODIUM LAURYL METHYL ISETHIONATE** (CAS: 18880-24-5)

## Mécanisme d'action

### 1. Détersivité haute performance
La chaîne lauryle (C12) assure une détersivité efficace comparable au SLES. Le groupe méthyle sur l'isethionate optimise l'orientation en micelle et améliore la solubilisation des lipides sébacés.

### 2. Mousse microstructurée
Produit une mousse fine, serrée et très stable — texture différente des sulfates classiques, perçue comme plus luxueuse. Excellente tenue en présence de calcium (eau dure).

### 3. Tolérance cutanée améliorée
L'isethionate méthylé présente un potentiel irritant significativement inférieur au SLS et proche du SLES. Adapté aux formules pour cuirs chevelus sensibles ou fréquemment lavés.

## Concentration d'usage
5–15% comme tensioactif principal ou en mélange avec glucosides ou bétaïnes.
`,
  },
  {
    name: 'Sodium Coco-Sulfate (SCS)',
    slug: INGREDIENT_SLUGS.SODIUM_COCO_SULFATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      "Mélange de sulfates d'alcools gras de coco non éthoxylés, souvent présenté comme alternative naturelle au SLS, mais au profil irritant comparable.",
    content: `
# Sodium Coco-Sulfate (SCS)

Le sodium coco-sulfate est un mélange de sulfates d'alcools gras directement issus de l'huile de coco, sans éthoxylation. Il est parfois présenté à tort comme une alternative "douce" ou "naturelle" au SLS alors que son profil fonctionnel est proche.

## INCI
**SODIUM COCO-SULFATE** (CAS: 97069-66-4 | COSING: 57189)

> Même numéro CAS que le Sodium Cocoyl Sulfate — la nomenclature INCI diffère mais les matières premières sont très similaires.

## Mécanisme d'action

### 1. Détersivité par sulfatation directe
Absence d'éthoxylation : le groupement sulfate interagit directement avec les membranes lipidiques et les protéines, comme le SLS mais avec une distribution de chaînes plus large (C8–C18).

### 2. Mousse abondante
Excellente production de mousse grâce aux chaînes C10–C14. Adaptée aux shampoings à rincer.

### 3. Profil irritation
Malgré son origine "naturelle", le SCS contient une fraction significative de C12 (lauryl) qui lui confère un potentiel irritant similaire au SLS. Le terme "sans SLS" sur les étiquettes contenant du SCS est techniquement exact mais trompeur.

## Nuance formulatoire
La présence de chaînes plus longues (C16–C18) adoucit légèrement le profil global par rapport au SLS pur C12, mais ne le rend pas "doux" pour autant.

## Concentration d'usage
5–15% en shampoing.
`,
  },
  {
    name: 'TEA Lauryl Sulfate',
    slug: INGREDIENT_SLUGS.TEA_LAURYL_SULFATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Sel triéthanolamine du lauryl sulfate, tensioactif anionique liquide et dense utilisé en shampoing, moins irritant que le SLS sodique.',
    content: `
# TEA Lauryl Sulfate (Triethanolamine Lauryl Sulfate)

Le TEA lauryl sulfate est le sel de triéthanolamine de l'acide dodécylsulfurique. Le contre-ion TEA (triéthanolamine) modifie les propriétés physico-chimiques par rapport au sel sodium, notamment la viscosité naturelle et la solubilité.

## INCI
**TEA-LAURYL SULFATE** (CAS: 139-96-8 | COSING: 58575)

## Mécanisme d'action

### 1. Détersivité comparable au SLS
Même chaîne alkyle C12 : mécanisme de solubilisation des lipides sébacés et formation de micelles identique au SLS.

### 2. Viscosité naturelle élevée
Le sel TEA produit des solutions plus visqueuses que le sel sodium à concentration équivalente — réduit le besoin d'épaississants dans la formule.

### 3. Tolérance légèrement améliorée
Le contre-ion TEA crée une interaction ionique légèrement différente avec les kératinocytes, résultant en un potentiel irritant légèrement inférieur au SLS sodique. Reste un tensioactif fort.

## Limitation réglementaire
La TEA peut former des nitrosamines en présence d'agents nitrosants (certains conservateurs). Réglementé en UE : concentration maximale 2,5% dans les produits rincés. Tendance à être remplacé par des sels sodium ou ammonium dans les nouvelles formules.

## Concentration d'usage
5–12% dans shampoings (contrainte réglementaire TEA).
`,
  },
]

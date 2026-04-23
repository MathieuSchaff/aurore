import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_CERAMIDES_LIPIDES: IngredientInput[] = [
  {
    name: 'Céramide NP (Ceramide NP)',
    slug: INGREDIENT_SLUGS.CERAMIDE_NP_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Céramide non-hydroxy phytosphingosine, constituant majeur du ciment intercellulaire de la cuticule capillaire, restaure la barrière lipidique et réduit la porosité.',
    content: `
# Céramide NP (Ceramide NP)

Le céramide NP (N-stéaroyl phytosphingosine) est l'un des six céramides naturellement présents dans le ciment intercellulaire de la cuticule capillaire. Il appartient au sous-groupe des céramides non-hydroxy (NP = Non-hydroxy fatty acid / Phytosphingosine). C'est le céramide de référence le plus couramment utilisé en formulation réparatrice.

## INCI
**CERAMIDE NP** (CAS: 95315-51-8 | COSING: 72050)

## Structure chimique

Sphingolipide composé d'une phytosphingosine (base sphingoïde C18 à quatre hydroxyles) liée par une liaison amide à un acide gras saturé non-hydroxylé (principalement acide stéarique C18). Amphiphile : tête polaire hydrophile + chaîne lipophile.

## Mécanisme d'action

### 1. Restauration du ciment intercellulaire
Les céramides forment avec le cholestérol et les acides gras libres une organisation lamellaire cristalline-liquide dans les espaces intercellulaires de la cuticule. Le céramide NP reconstitue cette structure en se réinsérant dans les lacunes causées par les traitements chimiques ou thermiques.

### 2. Réduction de la porosité
En comblant les espaces inter-écailles, il réduit la perte en eau transfibre (TEWL capillaire), diminuant l'hygrométrie différentielle responsable du frisottis.

### 3. Renforcement de la cohésion cuticule-cortex
Stabilise l'adhérence des couches cuticulaires entre elles et avec la zone CMC (Cell Membrane Complex), prévenant le soulèvement des écailles et les cassures.

## Concentration d'usage
- Après-shampooings et masques : 0,1–1%
- Leave-ins et sérums : 0,05–0,5%
- Toujours associé au cholestérol et aux acides gras libres pour une organisation lamellaire optimale (ratio céramides:cholestérol:acides gras libres ≈ 3:1:1).
`,
  },
  {
    name: 'Céramide AP (Ceramide AP)',
    slug: INGREDIENT_SLUGS.CERAMIDE_AP_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Céramide alpha-hydroxy phytosphingosine, variant hydroxylé qui renforce la cohésion lamellaire de la cuticule avec une affinité particulière pour les fibres chimiquement traitées.',
    content: `
# Céramide AP (Ceramide AP)

Le céramide AP (AP = Alpha-hydroxy fatty acid / Phytosphingosine) est un sphingolipide dont la chaîne d'acide gras est hydroxylée en position alpha. Cette hydroxylation supplémentaire lui confère des propriétés de liaison différentes au sein du ciment intercellulaire, renforçant l'ancrage dans les couches lipidiques cuticulaires.

## INCI
**CERAMIDE AP** (CAS: 100403-19-8 | COSING: 72047)

## Structure chimique

Phytosphingosine liée par liaison amide à un acide gras alpha-hydroxylé (typiquement acide alpha-hydroxystéarique). La fonction hydroxyle sur la chaîne grasse crée des liaisons hydrogène supplémentaires intra-lamellaires.

## Mécanisme d'action

### 1. Liaisons hydrogène renforcées
Le groupement alpha-OH de la chaîne acyle forme des ponts hydrogène avec les groupes céramide adjacents et les têtes polaires du cholestérol, densifiant la structure lamellaire.

### 2. Cohésion préférentielle sur fibre colorée
Les fibres décolorées ou colorées présentent une déplétion préférentielle en céramides AP. Sa restitution cible prioritairement ces zones fragilisées, expliquant sa fréquence dans les soins post-coloration.

### 3. Réparation du CMC (Cell Membrane Complex)
Zone de jonction cuticule-cortex la plus vulnérable aux dommages chimiques. Le céramide AP reconstitue préférentiellement cette couche par sa géométrie moléculaire complémentaire.

## Concentration d'usage
0,05–0,5% dans masques, traitements intensifs et soins post-coloration.
`,
  },
  {
    name: 'Céramide EOP (Ceramide EOP)',
    slug: INGREDIENT_SLUGS.CERAMIDE_EOP_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Céramide ester-lié oméga-hydroxy phytosphingosine, lipide ultra-longue chaîne constituant la couche lipidique superficielle de la fibre capillaire, clé de la brillance et de la résistance à l'humidité.",
    content: `
# Céramide EOP (Ceramide EOP)

Le céramide EOP (EOP = Ester-linked Omega-hydroxy fatty acid / Phytosphingosine) est un céramide de très longue chaîne (C30–C36) dont l'acide gras oméga-hydroxylé est estérifié avec de l'acide linoléique. C'est le céramide de la couche lipidique la plus externe de la cuticule, directement responsable des propriétés de surface de la fibre.

## INCI
**CERAMIDE EOP** (CAS: 132636-42-1)

## Structure chimique

Acide gras ultra-long (ω-hydroxy C30–C36) lié à une phytosphingosine, avec l'acide linoléique estérifié sur le groupement ω-hydroxyle. Structure bimoléculaire unique dans la couche covalente liée.

## Mécanisme d'action

### 1. Couche lipidique externe covalente
Contrairement aux autres céramides intercellulaires, le céramide EOP est lié de manière covalente aux protéines de la cuticule (kératin-associated proteins). Il forme la couche la plus externe hydrophobe de la fibre — le "18-MEA layer" — directement responsable du toucher soyeux et de la brillance.

### 2. Hydrophobie de surface
L'acide linoléique en position oméga confère une hydrophobie de surface qui protège la fibre de l'humidité ambiante et du frisottis. La perte de cette couche (par décoloration, permanent) est la principale cause d'augmentation de la porosité.

### 3. Biomarqueur des dommages capillaires
La mesure du céramide EOP par spectroscopie est utilisée en recherche cosmétique comme indicateur objectif du niveau de dommage de la fibre.

## Concentration d'usage
0,01–0,1% — actif de haute valeur, difficile à synthétiser, utilisé en quantités moindres que les céramides NP/AP. Présent dans les soins premium anti-porosité.
`,
  },
  {
    name: 'Céramide NS (Ceramide NS)',
    slug: INGREDIENT_SLUGS.CERAMIDE_NS_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Céramide non-hydroxy sphingosine, constituant fondamental du ciment intercellulaire cuticulaire, renforce la barrière lipidique et améliore la résistance mécanique de la fibre.',
    content: `
# Céramide NS (Ceramide NS)

Le céramide NS (NS = Non-hydroxy fatty acid / Sphingosine) est structurellement analogue au céramide NP mais utilise la sphingosine (base sphingoïde à deux hydroxyles, C18:1 avec double liaison Δ4-trans) plutôt que la phytosphingosine comme base. Il est l'un des céramides les plus abondants dans le ciment intercellulaire épidermique et capillaire.

## INCI
**CERAMIDE NS** (CAS: 100403-19-8)

## Structure chimique

Sphingosine (C18:1, Δ4-trans) liée par liaison amide à un acide gras saturé non-hydroxylé (C16–C24). La double liaison trans sur la sphingosine influence la fluidité de la bicouche lipidique dans laquelle il s'insère.

## Mécanisme d'action

### 1. Fluidité lamellaire modulée
La double liaison Δ4 de la sphingosine confère une légère fluidité à la phase lipidique intercellulaire, permettant une meilleure adaptation aux variations thermiques sans perte de cohésion.

### 2. Régulation du cholestérol
Le céramide NS a une affinité particulière pour le cholestérol — ils forment des domaines lipidiques organisés (rafts) qui constituent les zones les plus imperméables du ciment intercellulaire.

### 3. Signal de réparation
Des études in vitro montrent que le céramide NS active des voies de signalisation de réparation dans les kératinocytes du cuir chevelu, contribuant à la restauration endogène des lipides folliculaires.

## Concentration d'usage
0,05–0,5% dans après-shampooings, masques et soins leave-in. Souvent co-formulé avec le céramide NP pour couvrir les deux sous-types sphingoïdes.
`,
  },
  {
    name: 'Céramide AS (Ceramide AS)',
    slug: INGREDIENT_SLUGS.CERAMIDE_AS_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Céramide alpha-hydroxy sphingosine, variante hydroxylée à base sphingosine offrant un profil complémentaire aux céramides NP et NS pour la restauration complète du ciment intercellulaire.',
    content: `
# Céramide AS (Ceramide AS)

Le céramide AS (AS = Alpha-hydroxy fatty acid / Sphingosine) combine la base sphingosine (C18:1 Δ4-trans) avec un acide gras alpha-hydroxylé. Il représente le pendant "sphingosine" du céramide AP (qui utilise la phytosphingosine). Dans la formulation multicéramide, son inclusion permet une couverture complète des profils naturels.

## INCI
**CERAMIDE AS** (sans CAS unique standardisé, mélange d'homologues)

## Structure chimique

Sphingosine (Δ4-trans) liée par liaison amide à un acide gras 2-hydroxylé (C16–C24). Le groupement OH en α crée des liaisons hydrogène supplémentaires dans l'organisation lamellaire.

## Mécanisme d'action

### 1. Complémentarité structurelle
La fibre capillaire saine contient six sous-types de céramides en proportions spécifiques. Le céramide AS comble le sous-type alpha-hydroxy/sphingosine dans les formules visant la restitution la plus complète possible du profil lipidique natif.

### 2. Organisation lamellaire robuste
Les liaisons hydrogène supplémentaires de la chaîne alpha-hydroxylée, combinées à la géométrie de la sphingosine, créent une bicouche plus dense et résistante aux tensioactifs qu'un mélange NP/NS seul.

### 3. Résistance au shampooing
La cohésion renforcée du ciment reconstruit avec une palette complète de céramides (NP+AP+NS+AS) montre une meilleure résistance aux cycles de lavage vs. céramide unique.

## Concentration d'usage
0,05–0,3% dans traitements intensifs multicéramide et soins scalp-to-tip.
`,
  },
  {
    name: 'Céramide 2',
    slug: INGREDIENT_SLUGS.CERAMIDE_2_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Ancienne nomenclature INCI correspondant au céramide NS, actif lipidique cuticule parmi les plus étudiés pour la réparation des fibres décolorées et chimiquement endommagées.',
    content: `
# Céramide 2 (Ceramide NS — ancienne nomenclature)

Le "Céramide 2" est la désignation de l'ancienne nomenclature INCI (antérieure à 2006), qui correspond à l'actuel **Ceramide NS** (N-stéaroyl sphingosine). On le retrouve encore fréquemment sur les étiquettes de produits plus anciens ou reformulés avant la mise à jour INCI.

## INCI
**CERAMIDE 2** (ancienne nomenclature) = **CERAMIDE NS** (nomenclature actuelle)
CAS: 100403-19-8

## Note nomenclature

L'INCI a renommé les céramides en 2006 en adoptant une nomenclature basée sur la structure chimique (type d'acide gras + base sphingoïde) :
- Céramide 1 → Ceramide EOS
- Céramide 2 → Ceramide NS
- Céramide 3 → Ceramide NP
- Céramide 6II → Ceramide AP

## Mécanisme d'action

Identique au Ceramide NS : restauration du ciment intercellulaire, formation de domaines lipidiques organisés avec le cholestérol, réduction de la porosité.

Voir la fiche **Céramide NS** pour le détail complet du mécanisme.

## Concentration d'usage
0,05–0,5% dans après-shampooings, masques et leave-ins. Retrouvé notamment dans les produits Kérastase Resistance et Bain de Terre.
`,
  },
  {
    name: 'Céramide 3',
    slug: INGREDIENT_SLUGS.CERAMIDE_3_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Ancienne nomenclature INCI correspondant au céramide NP, le plus représenté dans la cuticule capillaire saine et la référence formulatoire pour les soins lipidiques réparateurs.',
    content: `
# Céramide 3 (Ceramide NP — ancienne nomenclature)

Le "Céramide 3" est la désignation historique (pré-2006) du **Ceramide NP** (N-stéaroyl phytosphingosine). C'est le céramide capillaire le plus abondant dans la cuticule native et le plus étudié dans la littérature sur la réparation capillaire.

## INCI
**CERAMIDE 3** (ancienne nomenclature) = **CERAMIDE NP** (nomenclature actuelle)
CAS: 95315-51-8 | COSING: 72050

## Note nomenclature

Résultat de la révision INCI 2006 adoptant la nomenclature chimique structurelle. Le céramide 3 reste présent sur de nombreuses étiquettes de produits formulés avant ou peu après cette date.

## Mécanisme d'action

Identique au Ceramide NP : insertion dans les espaces intercellulaires de la cuticule, organisation lamellaire avec cholestérol et acides gras libres, réduction de la porosité et renforcement de la cohésion cuticulaire.

Voir la fiche **Céramide NP** pour le détail complet du mécanisme.

## Présence dans les formules connues
Retrouvé dans les gammes Schwarzkopf BC Repair Rescue, Wella Enrich, et les soins céramide grand public.

## Concentration d'usage
0,1–1% dans après-shampooings et masques ; 0,05–0,5% dans leave-ins.
`,
  },
  {
    name: 'Phytosphingosine',
    slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Base sphingoïde précurseur des céramides cuticulaires, dotée d'une activité antimicrobienne intrinsèque, apaise le cuir chevelu et participe à la biosynthèse des lipides de barrière.",
    content: `
# Phytosphingosine

La phytosphingosine (D-ribo-phytosphingosine) est une base sphingoïde à quatre groupes hydroxyle naturellement présente dans les levures (*Saccharomyces cerevisiae*), les champignons et certaines plantes. En cosmétique, elle est obtenue par fermentation. C'est le précurseur biosynthétique des céramides NP et AP — deux des six céramides de la cuticule capillaire.

## INCI
**PHYTOSPHINGOSINE** (CAS: 554-62-1 | COSING: 55930)

## Structure chimique

Base sphingoïde C18 saturée avec quatre groupes hydroxyle (C1, C3, C4, C5-OH), contrairement à la sphingosine classique (deux OH, une double liaison). Cette saturation la rend plus rigide et lui confère des propriétés biologiques distinctes.

## Mécanisme d'action

### 1. Précurseur céramide
La phytosphingosine est N-acylée in vivo par les céramide synthases pour former les céramides NP et AP. Appliquée topiquement, elle stimule la production endogène de céramides dans les kératinocytes du cuir chevelu.

### 2. Activité antimicrobienne
Inhibe la croissance de *Staphylococcus epidermidis*, *Propionibacterium acnes* et certains dermatophytes par perturbation membranaire. Utile dans les soins anti-pelliculaires et cuirs chevelus irrités.

### 3. Anti-inflammatoire
Inhibe la production de cytokines pro-inflammatoires (IL-1α, TNF-α) dans les kératinocytes — réduit les rougeurs et l'inconfort du cuir chevelu sensible.

### 4. Renforcement barrière
Améliore la synthèse de lipides lamellaires du cuir chevelu, réduisant la sensibilité aux irritants externes.

## Concentration d'usage
0,05–0,2% dans shampoings apaisants, soins cuir chevelu, traitements anti-pelliculaires et masques réparateurs.
`,
  },
  {
    name: 'Cholestérol (Cholesterol)',
    slug: INGREDIENT_SLUGS.CHOLESTEROL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Lipide stéroïdien indispensable à l'organisation lamellaire du ciment intercellulaire cuticulaire, le cholestérol amplifie l'efficacité des céramides et réduit la porosité de la fibre capillaire.",
    content: `
# Cholestérol (Cholesterol)

Le cholestérol est un stérol membranaire naturellement présent dans tous les tissus animaux, notamment dans la cuticule capillaire où il constitue environ 25% des lipides intercellulaires (aux côtés des céramides et des acides gras libres). En cosmétique, il est principalement obtenu à partir de la lanoline (laine de mouton) ou par synthèse.

## INCI
**CHOLESTEROL** (CAS: 57-88-5 | COSING: 31749)

## Rôle dans la cuticule capillaire

### Ratio lipidique intercellulaire natif
La cuticule saine contient un ratio précis de lipides intercellulaires :
- Céramides : ~50%
- Cholestérol : ~25%
- Acides gras libres : ~25%

Ce rapport est la clé de l'organisation en phases lamellaires cristallines — altérer ce ratio (par décoloration, shampooing agressif) augmente la porosité.

## Mécanisme d'action

### 1. Modulateur de fluidité lipidique
Intercalé entre les queues hydrophobes des céramides et des acides gras, le cholestérol régule la fluidité de la bicouche lipidique — ni trop rigide (cassante), ni trop fluide (perméable).

### 2. Synergie avec les céramides
Sans cholestérol, les céramides seuls forment des phases cristallines trop rigides, moins efficaces. La présence de cholestérol crée la phase "liquide-ordonnée" optimale pour la fonction barrière.

### 3. Réduction de la TEWL capillaire
En restaurant le ratio lipidique intercellulaire, le cholestérol réduit la perte en eau transfibre, diminuant la sécheresse et le frisottis.

### 4. Émollient structurel
Améliore le glissant et la douceur de surface en comblant les microcrevasses cuticulaires.

## Concentration d'usage
0,1–2% dans masques, après-shampooings et soins réparateurs, toujours co-formulé avec des céramides et des acides gras libres.
`,
  },
  {
    name: 'Acide Linoléique (Linoleic Acid)',
    slug: INGREDIENT_SLUGS.LINOLEIC_ACID_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Acide gras oméga-6 essentiel, composant clé du ciment intercellulaire cuticulaire et de la couche lipidique externe (18-MEA), essentiel pour la brillance et la résistance à l'humidité.",
    content: `
# Acide Linoléique (Linoleic Acid)

L'acide linoléique (LA, C18:2, Δ9,12-cis) est un acide gras polyinsaturé oméga-6 essentiel. Il est abondant dans les huiles végétales (tournesol, carthame, rosier muscat) et constitue l'un des acides gras libres les plus importants du ciment intercellulaire de la cuticule capillaire.

## INCI
**LINOLEIC ACID** (CAS: 60-33-3 | COSING: 43948)

## Rôle spécifique dans la fibre capillaire

### Couche 18-MEA (18-Methyl Eicosanoic Acid layer)
L'acide linoléique est le composant oméga-estérifié du céramide EOP — la couche lipidique la plus externe de la cuticule, liée de façon covalente aux protéines. Cette couche est directement responsable de l'hydrophobie de surface de la fibre saine.

## Mécanisme d'action

### 1. Restauration de la surface hydrophobe
Après décoloration ou coloration, la couche 18-MEA est partiellement dégradée — la fibre devient hydrophile, absorbant l'humidité et perdant sa brillance. L'acide linoléique topique partiellement restaure cette hydrophobie.

### 2. Composant des lipides intercellulaires
Participe à l'organisation lamellaire du CMC aux côtés des céramides et du cholestérol, comblant les lacunes créées par les traitements chimiques agressifs.

### 3. Précurseur céramide EOP
En formule, l'acide linoléique peut être incorporé enzymatiquement (ou par interaction physique) dans les céramides EOP incomplets, restaurant la structure native.

### 4. Anti-inflammatoire
Précurseur des prostaglandines anti-inflammatoires — réduit l'irritation du cuir chevelu.

## Concentration d'usage
0,1–2% dans huiles, sérums, masques et leave-ins. Présent dans toute huile végétale à fort ratio LA/AO (rosier muscat, tournesol, chanvre).
`,
  },
  {
    name: 'Acide Oléique (Oleic Acid)',
    slug: INGREDIENT_SLUGS.OLEIC_ACID_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Acide gras monoinsaturé oméga-9 pénétrant, lubrifiant et émollient de la fibre capillaire, mais susceptible d'augmenter la porosité des cheveux très poreux si utilisé en excès.",
    content: `
# Acide Oléique (Oleic Acid)

L'acide oléique (OA, C18:1, Δ9-cis) est l'acide gras monoinsaturé oméga-9 le plus répandu dans les lipides végétaux et animaux (huile d'olive : 65–80%, huile d'argan : 43–49%). C'est l'un des acides gras libres naturellement présents dans le ciment intercellulaire de la cuticule capillaire.

## INCI
**OLEIC ACID** (CAS: 112-80-1 | COSING: 54357)

## Mécanisme d'action

### 1. Pénétration corticale facilitée
Sa simple double liaison crée une légère courbure moléculaire qui perturbe temporairement la packing lipidique de la cuticule, facilitant sa propre pénétration et celle des actifs co-formulés vers le cortex.

### 2. Émollience et lubrification
Forme un film lipidique souple sur la cuticule, réduisant la friction entre fibres, améliorant le démêlage et conférant un toucher soyeux.

### 3. Nutrition du cortex
Pénètre jusqu'au cortex et s'associe aux lipides corticaux, améliorant la flexibilité et réduisant la fragilité de la fibre (particulièrement efficace sur cheveux secs et cassants).

### 4. Composant lipidique intercellulaire
Acide gras libre constitutif du ciment intercellulaire — sa restitution contribue au rééquilibrage du ratio céramide:cholestérol:acides gras libres.

## Profil selon la porosité du cheveu

| Type de cheveu | Comportement acide oléique |
|---|---|
| Faible porosité | Pénètre lentement, peut alourdir |
| Porosité normale | Optimal : équilibre entre pénétration et surface |
| Forte porosité | À doser avec précaution : peut augmenter l'ouverture cuticulaire |

## Concentration d'usage
0,5–5% dans huiles, masques et soins capillaires. Présent dans toute huile riche en acides gras monoinsaturés (olive, argan, avocat).
`,
  },
  {
    name: 'Acide Béhénique (Behenic Acid)',
    slug: INGREDIENT_SLUGS.BEHENIC_ACID,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Acide gras saturé à très longue chaîne (C22), émollient structurel de la fibre capillaire, filmogène léger et composant des lipides cuticulaires des cheveux à forte affinité pour la kératine.',
    content: `
# Acide Béhénique (Behenic Acid)

L'acide béhénique (acide docosanoïque, C22:0) est un acide gras saturé à très longue chaîne naturellement présent dans l'arachide, le colza, la noix de Ben (*Moringa oleifera*) et la graines de moutarde. En cosmétique capillaire, c'est un actif structurant et émollient de haute performance.

## INCI
**BEHENIC ACID** (CAS: 112-85-6 | COSING: 30533)

## Structure chimique

Acide gras saturé à 22 carbones (C22H44O2). Sa chaîne linéaire longue et saturée lui confère un point de fusion élevé (~80°C) et une très forte tendance à l'organisation cristalline — propriété exploitée pour la formation de films structurés.

## Mécanisme d'action

### 1. Filmogène structurel sur cuticule
Sa longue chaîne saturée s'organise en couches cristallines à la surface de la cuticule, créant un film lisse, hydrophobe et résistant qui améliore la brillance et réduit la friction.

### 2. Affinité pour la kératine
L'acide béhénique a une forte affinité électrostatique pour les sites hydrophobes de la kératine exposés sur les écailles cuticulaires abîmées — il "colle" préférentiellement aux zones endommagées.

### 3. Émollience sans lourdeur
Contrairement aux corps gras courts, il ne pénètre pas massivement dans le cortex — reste en surface, apportant une émollience légère sans alourdir les cheveux fins.

### 4. Composant des cires capillaires
Précurseur de la béhényl bétaïne et de l'alcool béhénylique, eux-mêmes utilisés comme agents de conditionnement dans les formules capillaires.

## Concentration d'usage
0,1–2% dans après-shampooings, masques et sérums lissants ; jusqu'à 5% dans les formules de masques très riches.
`,
  },
  {
    name: 'Squalane',
    slug: INGREDIENT_SLUGS.SQUALANE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Hydrocarbure lipidique léger biomimétique, émollient non occlusif qui pénètre la fibre sans la surcharger, apporte brillance et souplesse en reproduisant les lipides sébacés naturels.',
    content: `
# Squalane

Le squalane est un hydrocarbure isoprénoïde saturé (C30H62) produit par hydrogénation du squalène. Le squalène naturel est présent dans le sébum humain (~13%) et dans l'huile d'olive (0,1–0,7%) ou de sucre de canne (canne à sucre, source principale actuelle). Le squalane est sa forme stabilisée et non oxydable.

## INCI
**SQUALANE** (CAS: 111-01-3 | COSING: 57573)

## Structure chimique

Hydrocarbure terpénoïde ramifié (six unités isoprène saturées), sans double liaison, sans groupements fonctionnels polaires. Cette structure purement non polaire lui confère une très bonne compatibilité avec les lipides cuticulaires.

## Mécanisme d'action

### 1. Biomimétisme sébacé
Le squalane reproduit le composant hydrocarbure du sébum naturel qui lubrifie la tige capillaire depuis le follicule. Sur cheveux secs, privés de sebum (longueurs, pointes), il restaure cette lubrification naturelle.

### 2. Pénétration légère
Son poids moléculaire (422 Da) et sa structure branchée lui permettent de s'intercaler dans les lipides cuticulaires sans les saturer. Il pénètre plus en profondeur que les huiles végétales classiques mais moins que les silicones.

### 3. Émollience non occlusive
Contrairement aux huiles minérales, il n'occlude pas la fibre — laisse les échanges gazeux et hydriques se faire. Résultat : brillance et souplesse sans effet "film lourd".

### 4. Stabilité oxydative
L'absence de double liaison le rend très stable à l'air et à la chaleur — pas de rancissement en formule ou sur la fibre.

### 5. Compatibilité universelle
Inerte chimiquement, compatible avec tensioactifs, silicones, actifs anioniques et cationiques. Convient aux cheveux fins, épais, colorés, naturels.

## Concentration d'usage
- Huiles légères et sérums : 5–20%
- Masques et après-shampooings : 1–5%
- Leave-ins : 1–3%
`,
  },
  {
    name: 'Phospholipides (Phospholipids)',
    slug: INGREDIENT_SLUGS.PHOSPHOLIPIDS_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Lipides membranaires amphiphiles aux propriétés émulsifiantes et restauratrices, ils reconstituent la bicouche lipidique du ciment intercellulaire cuticulaire et améliorent la pénétration des actifs.',
    content: `
# Phospholipides (Phospholipids)

Les phospholipides sont des lipides complexes constitués d'un glycérol estérifié par deux acides gras et un groupement phosphate lié à un alcool (choline, éthanolamine, sérine, inositol). Ils sont les constituants fondamentaux de toutes les membranes cellulaires biologiques. En cosmétique capillaire, ils sont obtenus principalement depuis le soja ou le tournesol (lécithine végétale).

## INCI
**PHOSPHOLIPIDS** (terme générique) ou selon la source : **HYDROGENATED LECITHIN**, **SOYA LECITHIN**, **SUNFLOWER SEED CERA**

## Composition

Un mélange de phospholipides cosmétique contient typiquement :
- Phosphatidylcholine (PC) : 35–45%
- Phosphatidyléthanolamine (PE) : 25–35%
- Phosphatidylinositol (PI) : 5–10%
- Phosphatidylsérine (PS) : 2–5%
- Lysophospholipides : traces

## Mécanisme d'action

### 1. Auto-organisation en bicouches
Leur structure amphiphile (tête polaire phosphatée + deux chaînes grasses hydrophobes) leur permet de former spontanément des bicouches lamellaires — structures analogues au ciment intercellulaire de la cuticule. Ils se réorganisent dans les espaces intercuticulaires endommagés.

### 2. Vecteur de délivrance (liposomes)
Les phospholipides forment des liposomes (vésicules lipidiques) qui encapsulent les actifs hydrophiles et lipophiles, facilitant leur pénétration à travers la cuticule et leur délivrance ciblée dans le cortex.

### 3. Émulsification et stabilité de formule
Excellent émulsifiant naturel (HLB ≈ 8–10), permettant de formuler des émulsions légères stables sans tensioactifs synthétiques agressifs.

### 4. Nutrition protéique indirecte
Les acides gras libérés par hydrolyse des phospholipides nourrissent les lipides corticaux et intercuticulaires.

## Concentration d'usage
0,5–3% dans après-shampooings, masques et soins réparateurs.
`,
  },
  {
    name: 'Phosphatidylcholine',
    slug: INGREDIENT_SLUGS.PHOSPHATIDYLCHOLINE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Phospholipide majeur de la membrane cellulaire, principal actif de la lécithine, forme des liposomes vecteurs d'actifs et restaure la bicouche lipidique intercellulaire de la cuticule.",
    content: `
# Phosphatidylcholine

La phosphatidylcholine (PC) est le phospholipide le plus abondant dans les membranes cellulaires animales et végétales. Elle constitue 35–50% de la lécithine de soja et de tournesol. En cosmétique capillaire, c'est l'actif lipidique le plus étudié pour ses propriétés réparatrices et vectorisantes.

## INCI
**PHOSPHATIDYLCHOLINE** (CAS: 8002-43-5 | COSING: 75609)

## Structure chimique

Glycérophospholipide avec une tête polaire choline-phosphate zwitterionique, un sn-1 généralement occupé par un acide gras saturé (palmitique C16:0 ou stéarique C18:0) et un sn-2 par un acide gras insaturé (oléique C18:1 ou linoléique C18:2).

## Mécanisme d'action

### 1. Formation de liposomes
La phosphatidylcholine forme spontanément des vésicules liposomales en milieu aqueux. Ces liposomes :
- Encapsulent des actifs hydrophiles dans leur cœur aqueux
- Incorporent des actifs lipophiles dans leur bicouche
- Fusionnent avec les lipides intercellulaires de la cuticule, libérant les actifs directement au bon endroit

### 2. Restauration du CMC (Cell Membrane Complex)
La zone CMC est la couche β-kératine qui joint les cellules cuticulaires entre elles. La phosphatidylcholine se réinsère préférentiellement dans cette zone via fusion membranaire, restaurant la cohésion et réduisant l'exfoliation des écailles.

### 3. Hydratation membranaire
La tête choline est hautement hygroscopique — elle retient l'eau dans la bicouche reconstituée, maintenant l'hydratation de la fibre entre deux shampooings.

### 4. Signal biologique folliculaire
Des études in vitro montrent que la PC appliquée sur le cuir chevelu améliore la prolifération des cellules folliculaires et des kératinocytes — potentiel soin cuir chevelu au-delà de la fibre.

## Concentration d'usage
- Sérums et soins leave-in haute performance : 0,5–2%
- Masques et après-shampooings : 0,2–1%
- Souvent sous forme de lécithine hydrogénée (plus stable en formule) ou de PC purifiée (≥97%) pour les formules premium.
`,
  },
]

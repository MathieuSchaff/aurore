import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_PROTEINES: IngredientInput[] = [
  {
    name: 'Kératine Hydrolysée (Hydrolyzed Keratin)',
    slug: INGREDIENT_SLUGS.HYDROLYZED_KERATIN,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Protéine structurelle de la fibre capillaire hydrolysée en peptides, comble les zones de porosité et renforce la résistance mécanique du cheveu.',
    content: `
# Kératine Hydrolysée (Hydrolyzed Keratin)

La kératine est la protéine constitutive principale du cheveu (65–95% de la masse sèche). L'hydrolyse acide, basique ou enzymatique fragmente ses longues chaînes en peptides de faible poids moléculaire capables de pénétrer la fibre endommagée.

## INCI
**HYDROLYZED KERATIN** (CAS: 69430-36-0 | COSING: 37836)

## Mécanisme d'action

### 1. Comblement des zones de porosité
Les peptides kératiniques (500–5 000 Da) diffusent dans les zones corticales appauvries par décoloration, permanente ou friction thermique. Ils s'intègrent temporairement à la matrice protéique résiduelle via liaisons hydrogène et électrostatiques.

### 2. Reconstitution de la cuticule
En surface, les fragments de plus haut poids moléculaire déposent un film protéique qui lisse les écailles soulevées, réduit la rugosité et améliore la brillance.

### 3. Renforcement mécanique
Des études instrumentales (traction, élasticité) montrent une réduction des cassures et une augmentation du module d'élasticité après traitements répétés à la kératine hydrolysée.

### 4. Substantivité
La kératine hydrolysée présente une affinité naturelle pour la fibre kératinique endommagée — son dépôt résiste partiellement au rinçage, en particulier dans les formules après-shampooings et masques.

## Concentration d'usage
- Après-shampooings / masques : 1–5%
- Leave-ins et sérums : 0,5–3%
- Shampoings : 0,5–2%

> Les formules de lissage kératinisant (Brazilian Blowout) utilisent la kératine à des concentrations élevées (10–20%) avec fixation thermique.
`,
  },
  {
    name: 'Protéine de Blé Hydrolysée (Hydrolyzed Wheat Protein)',
    slug: INGREDIENT_SLUGS.HYDROLYZED_WHEAT_PROTEIN,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Protéine végétale hydrolysée du gluten de blé, riche en glutamine et proline, renforce la fibre capillaire et améliore l'élasticité sans alourdir.",
    content: `
# Protéine de Blé Hydrolysée (Hydrolyzed Wheat Protein)

Obtenue par hydrolyse enzymatique ou acide du gluten de froment (*Triticum aestivum*), la protéine de blé hydrolysée délivre un profil d'acides aminés riche en glutamine (~35%), proline (~15%) et glycine. Sa légèreté en fait un actif adapté aux cheveux fins à normaux.

## INCI
**HYDROLYZED WHEAT PROTEIN** (CAS: 70084-87-6 | COSING: 37843)

## Mécanisme d'action

### 1. Pénétration corticale sélective
Les peptides de faible PM (<2 kDa) traversent la cuticule et se lient aux chaînes de kératine corticale via liaisons hydrogène, renforçant la structure interne de la fibre.

### 2. Film protéique de surface
Les fractions de plus haut PM déposent un voile protéique léger qui lisse la cuticule sans effet coating lourd — bénéfice brillance sans alourdir.

### 3. Amélioration de l'élasticité
La glutamine et la proline s'intègrent aux zones d'alpha-hélices de la kératine, améliorant la flexibilité et réduisant les cassures par traction.

### 4. Hydratation indirecte
Les acides aminés libres issus de l'hydrolyse (glutamine, glycine) exercent une action humectante complémentaire — rétention d'eau dans la fibre.

## Concentration d'usage
- Shampoings : 0,5–2%
- Après-shampooings / masques : 1–5%
- Leave-ins : 0,5–2%

> ⚠️ Contre-indiqué chez les personnes souffrant de sensibilité/allergie au gluten de blé (contact topique — risque distinct de l'intolérance alimentaire, mais à surveiller en cuir chevelu irrité).
`,
  },
  {
    name: 'Soie Hydrolysée (Hydrolyzed Silk)',
    slug: INGREDIENT_SLUGS.HYDROLYZED_SILK,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Fibroïne de soie hydrolysée en petits peptides, confère une brillance exceptionnelle, une texture soyeuse et renforce la résistance à la casse.',
    content: `
# Soie Hydrolysée (Hydrolyzed Silk)

La soie est produite par le ver à soie (*Bombyx mori*). La fibroïne de soie hydrolysée est obtenue par hydrolyse enzymatique ou acide de la protéine de soie purifiée. Elle se distingue par sa richesse en sérine (~33%), glycine (~45%) et alanine (~25%), et par ses propriétés optiques exceptionnelles.

## INCI
**HYDROLYZED SILK** (CAS: 96690-41-4 | COSING: 37832)

## Mécanisme d'action

### 1. Effet optique et brillance
Les peptides de soie forment un film extrêmement régulier sur la cuticule, qui réfléchit la lumière de façon uniforme — brillance visible instrumentalement (goniophotométrie) et perçue comme naturelle.

### 2. Toucher soyeux (sensorialité)
La structure β-sheet de la soie hydrolysée confère au film déposé une texture glissante distinctive — réduction de friction, démêlage facilité, cheveu doux au toucher.

### 3. Renforcement de la fibre
Les petits peptides (<1 kDa) pénètrent la cuticule et comblent les micro-fissures. Les fractions sérines forment des liaisons hydrogène avec la kératine cortical.

### 4. Rétention hydrique
La sérine et la glycine sont des humectants naturels : la soie hydrolysée contribue à maintenir l'eau dans la fibre.

## Concentration d'usage
- Après-shampooings / masques : 0,5–3%
- Leave-ins et sérums brillance : 0,5–2%
- Shampoings : 0,2–1%
`,
  },
  {
    name: 'Protéine de Soja Hydrolysée (Hydrolyzed Soy Protein)',
    slug: INGREDIENT_SLUGS.HYDROLYZED_SOY_PROTEIN,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Protéine végétale hydrolysée du soja, riche en acides aminés essentiels, renforce la fibre capillaire et améliore la rétention de couleur des cheveux colorés.',
    content: `
# Protéine de Soja Hydrolysée (Hydrolyzed Soy Protein)

Obtenue par hydrolyse enzymatique des protéines de soja (*Glycine max*), cette protéine végétale présente un profil d'acides aminés complet — acide glutamique (~20%), acide aspartique (~12%), leucine, lysine. Sa charge anionique (pH cosmétique) lui confère une bonne substantivité sur la fibre.

## INCI
**HYDROLYZED SOY PROTEIN** (CAS: 68607-88-5 | COSING: 37840)

## Mécanisme d'action

### 1. Renforcement structural
Les peptides pénètrent le cortex endommagé et s'intègrent à la matrice kératinique via liaisons ioniques et hydrogène. Amélioration mesurable de la résistance à la traction.

### 2. Rétention de couleur
Les acides aminés de la protéine de soja interagissent avec les molécules de colorant en fixant les liaisons covalentes et ioniques dans la cuticule — prolonge l'éclat et la durée de la couleur sur cheveux colorés.

### 3. Substantivité sur cuticule abîmée
Les peptides chargés négativement s'adsorbent préférentiellement sur les zones de cuticule soulevée ou manquante (cheveux décolorés), où la charge électronégative de la kératine est exposée.

### 4. Apport humectant
Profil riche en acides aminés polaires (glutamine, asparagine) qui retiennent l'eau dans la fibre.

## Concentration d'usage
- Après-shampooings / masques : 1–5%
- Leave-ins : 0,5–2%
- Shampoings couleur : 0,5–2%
`,
  },
  {
    name: 'Collagène Hydrolysé (Hydrolyzed Collagen)',
    slug: INGREDIENT_SLUGS.HYDROLYZED_COLLAGEN_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Protéine de tissu conjonctif hydrolysée en peptides, apporte fermeté à la fibre capillaire, hydratation et renforcement de la cuticule.',
    content: `
# Collagène Hydrolysé (Hydrolyzed Collagen)

Le collagène hydrolysé est obtenu par hydrolyse acide, basique ou enzymatique de collagène bovin, porcin, marin ou végétal (collagène végétal = protéines à profil similaire). Il se distingue par sa haute teneur en glycine (~33%), proline (~12%) et hydroxyproline (~10%) — un profil unique parmi les protéines cosmétiques.

## INCI
**HYDROLYZED COLLAGEN** (CAS: 9015-54-7 | COSING: 37813)

## Mécanisme d'action

### 1. Film protecteur de surface
Les peptides de haut PM forment un film flexible sur la cuticule qui réduit les frottements, protège contre la chaleur et les UV. Amélioration du coefficient de friction instrumentale.

### 2. Renforcement de la cuticule
La glycine et l'hydroxyproline s'intercalent dans les liaisons peptidiques des chaînes kératiniques superficielles. Réduction de la porosité mesurable (porosity test, LRET).

### 3. Hydratation
Le profil riche en acides aminés polaires contribue à la rétention hydrique de la fibre — action hygroscopique directe.

### 4. Substantivité
Les peptides collagène (PM 500–5 000 Da) s'adsorbent sur la surface kératinique et résistent au rinçage partiel — effet cumulatif avec les applications répétées.

## Concentration d'usage
- Masques et après-shampooings : 1–5%
- Leave-ins : 0,5–2%
- Shampoings : 0,5–1,5%
`,
  },
  {
    name: 'Protéine de Riz Hydrolysée (Hydrolyzed Rice Protein)',
    slug: INGREDIENT_SLUGS.HYDROLYZED_RICE_PROTEIN,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Protéine de riz hydrolysée riche en cystéine et méthionine, renforce la fibre capillaire en profondeur et protège contre les dommages oxydatifs.',
    content: `
# Protéine de Riz Hydrolysée (Hydrolyzed Rice Protein)

Obtenue par hydrolyse enzymatique des protéines du riz (*Oryza sativa*) — principalement glutéline et prolamines. Sa richesse en acides aminés soufrés (cystéine, méthionine) est particulièrement intéressante pour la fibre kératinique, dont les ponts disulfure constituent la structure de résistance.

## INCI
**HYDROLYZED RICE PROTEIN** (CAS: 9015-54-7 | COSING: 37841)

## Mécanisme d'action

### 1. Reconstitution des ponts disulfure
La cystéine fournie par les peptides de riz peut participer à la restitution partielle des liaisons S–S de la kératine fragilisées par décoloration ou permanente. Amélioration de la résistance structurelle.

### 2. Protection oxydative
La méthionine agit comme sacrificateur d'oxydants : elle s'oxyde préférentiellement à la kératine, protégeant la fibre contre le peroxyde, les UV et la chaleur.

### 3. Légèreté sur la fibre
Contrairement à certaines protéines lourdes, la protéine de riz hydrolysée présente un poids moléculaire moyen faible — pénètre bien sans alourdir ni raidir le cheveu.

### 4. Douceur et brillance
Son profil en acides aminés confère un toucher doux et une brillance subtile — adapté aux cheveux fins.

## Concentration d'usage
- Après-shampooings / masques : 1–5%
- Leave-ins : 0,5–2%
- Shampoings : 0,5–2%
`,
  },
  {
    name: "Protéine d'Avoine Hydrolysée (Hydrolyzed Oat Protein)",
    slug: INGREDIENT_SLUGS.HYDROLYZED_OAT_PROTEIN,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Protéine d'avoine hydrolysée à profil apaisant, renforce la fibre et protège le cuir chevelu irrité grâce à ses peptides anti-inflammatoires et humectants.",
    content: `
# Protéine d'Avoine Hydrolysée (Hydrolyzed Oat Protein)

Extraite de l'avoine (*Avena sativa*) par hydrolyse enzymatique de l'avenine et des globulines. Ce qui distingue cette protéine est son association naturelle avec les bêta-glucanes et les avenanthramides — des composés anti-inflammatoires spécifiques à l'avoine.

## INCI
**HYDROLYZED OAT PROTEIN** (CAS: 94350-05-7 | COSING: 37820)

## Mécanisme d'action

### 1. Apaisement du cuir chevelu
Les peptides d'avoine et les avenanthramides co-extractibles inhibent les voies NF-κB et la libération d'histamine — effet apaisant documenté sur cuirs chevelus sensibles, sujets aux démangeaisons ou à la dermite séborrhéique.

### 2. Renforcement et lissage
Les peptides protéiques (600–4 000 Da) s'adsorbent sur la cuticule et comblent les micro-défauts, améliorant le lissé et réduisant la rugosité de surface.

### 3. Hydratation synergique
Les bêta-glucanes associés aux peptides forment un film hygroscopique qui retient l'eau à la surface de la fibre — humectance complémentaire à l'action protéique.

### 4. Tolérance cutanée
Faible potentiel allergisant (sauf sensibilité connue à l'avoine) — adapté aux formules sensibles, bébé et cuir chevelu irrité.

## Concentration d'usage
- Shampoings apaisants : 0,5–2%
- Masques cuir chevelu : 1–3%
- Leave-ins : 0,5–2%
`,
  },
  {
    name: 'Protéine de Quinoa Hydrolysée (Hydrolyzed Quinoa Protein)',
    slug: INGREDIENT_SLUGS.HYDROLYZED_QUINOA_PROTEIN,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Protéine du quinoa hydrolysée, profil d'acides aminés complet proche de la kératine, renforce la fibre, améliore l'élasticité et protège contre la casse.",
    content: `
# Protéine de Quinoa Hydrolysée (Hydrolyzed Quinoa Protein)

Le quinoa (*Chenopodium quinoa*) est l'une des rares protéines végétales à profil complet en acides aminés essentiels — lysine, méthionine, cystéine, thréonine. Sa composition (albumines et globulines) est proche du profil kératinique, ce qui en fait un actif de choix pour la restauration de la fibre.

## INCI
**HYDROLYZED QUINOA PROTEIN** (CAS: 222400-29-7)

## Mécanisme d'action

### 1. Complémentarité avec la kératine
La richesse en lysine, cystéine et méthionine permet une intégration efficace aux chaînes kératiniques — les acides aminés soufrés participent à la reconstitution des liaisons disulfure fragilisées.

### 2. Renforcement de la résistance à la traction
Des tests mécaniques (cyclage traction/relaxation) montrent une amélioration de l'élasticité et de la résistance à la casse après traitement répété.

### 3. Protection thermique
Le film protéique déposé en surface agit comme bouclier thermique partiel — ralentit la dénaturation de la kératine lors du brushing ou lissage.

### 4. Hydratation et souplesse
Les acides aminés polaires du quinoa (asparagine, glutamine, thréonine) retiennent l'humidité dans la fibre, améliorant la souplesse.

## Concentration d'usage
- Masques et après-shampooings : 1–5%
- Leave-ins : 0,5–2%
- Shampoings : 0,5–2%
`,
  },
  {
    name: 'Acides Aminés de Blé (Wheat Amino Acids)',
    slug: INGREDIENT_SLUGS.WHEAT_AMINO_ACIDS,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Mélange d'acides aminés libres issus du blé, pénètre profondément la fibre capillaire, hydrate le cortex et renforce la structure kératinique.",
    content: `
# Acides Aminés de Blé (Wheat Amino Acids)

Les acides aminés de blé sont obtenus par hydrolyse poussée du gluten de froment (*Triticum aestivum*) jusqu'à la libération des acides aminés libres — forme non peptidique, de très faible poids moléculaire (75–200 Da). Cette micronisation assure une pénétration corticale maximale.

## INCI
**WHEAT AMINO ACIDS** (CAS: 70084-87-6 — fraction acides aminés libres)

## Composition typique
Acide glutamique (~35%), proline (~15%), acide aspartique (~10%), leucine, phénylalanine, valine — profil représentatif du gluten hydrolysé.

## Mécanisme d'action

### 1. Pénétration corticale profonde
Le très faible PM des acides aminés libres (< 200 Da) leur permet de traverser la cuticule intacte et de diffuser jusqu'au cortex — là où les peptides plus lourds ne pénètrent pas.

### 2. Hydratation interne de la fibre
Les acides aminés polaires (glutamine, asparagine) agissent comme humectants endocorticaux — retiennent l'eau dans le cortex, réduisant la sécheresse interne et l'électricité statique.

### 3. Nutrition structurelle
Ils fournissent les briques de base nécessaires aux mécanismes de réparation naturelle de la kératine — rôle de réservoir d'acides aminés accessibles.

### 4. Effet NMF capillaire
Mimétisme du Natural Moisturizing Factor (NMF) de la fibre capillaire — profil proche des acides aminés endogènes du cortex.

## Concentration d'usage
- Tous types de formules : 0,5–3%
- Associé idéalement à des peptides plus lourds pour une action multi-niveaux.
`,
  },
  {
    name: 'Acides Aminés de Soie (Silk Amino Acids)',
    slug: INGREDIENT_SLUGS.SILK_AMINO_ACIDS,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Acides aminés libres de la fibroïne de soie — sérine, glycine, alanine — pénètrent la fibre capillaire et apportent brillance, douceur et résistance à la casse.',
    content: `
# Acides Aminés de Soie (Silk Amino Acids)

Les acides aminés de soie sont obtenus par hydrolyse totale de la fibroïne de *Bombyx mori* jusqu'aux acides aminés libres. Le profil est dominé par la sérine (~33%), la glycine (~45%) et l'alanine (~25%), avec de faibles quantités de tyrosine et valine.

## INCI
**SILK AMINO ACIDS** (CAS: 96690-41-4 — fraction acides aminés libres)

## Mécanisme d'action

### 1. Pénétration et hydratation corticale
La glycine (PM 75 Da) et la sérine (PM 105 Da) sont parmi les acides aminés les plus petits — pénètrent la cuticule et s'intègrent directement dans la matrice corticale. La sérine est un humectant naturel puissant (composant du NMF cutané).

### 2. Brillance et toucher soyeux
En surface, la glycine et l'alanine forment un film ultra-mince de faible rugosité optique — amélioration de la réflectance et du toucher perçu. Bénéfice sensoriel distinctif par rapport aux autres protéines.

### 3. Résistance à la casse
Les acides aminés s'incorporent aux zones de fragilité de la kératine et renforcent les liaisons inter-chaînes — amélioration de l'allongement à la rupture.

### 4. Affinité avec la kératine
Analogie structurelle entre la fibroïne de soie (β-sheet) et les domaines cristallins de la kératine — dépôt préférentiel sur les zones endommagées.

## Concentration d'usage
- Après-shampooings et leave-ins : 0,5–3%
- Sérums brillance : 0,2–1%
`,
  },
  {
    name: 'Arginine',
    slug: INGREDIENT_SLUGS.ARGININE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Acide aminé cationique essentiel de la kératine, améliore l'hydratation de la fibre, renforce la résistance chimique et stimule la microcirculation du cuir chevelu.",
    content: `
# Arginine

L'arginine est un acide aminé semi-essentiel, l'un des plus abondants dans la kératine des cheveux (~7% des résidus). Sa guanidinium à charge positive en fait un actif clé pour la substantivité sur fibre chargée négativement.

## INCI
**ARGININE** (CAS: 74-79-3 | COSING: 28952)

## Mécanisme d'action

### 1. Substantivité cationique
Le groupe guanidinium (pKa ~12,5) de l'arginine est chargé positivement à pH cosmétique. Il s'adsorbe électrostatiquement sur la kératine chargée négativement — dépôt substantif, résistant au rinçage, particulièrement efficace sur cheveux décolorés (charge négative augmentée).

### 2. Protection contre les dommages chimiques
L'arginine forme une barrière protectrice sur la cuticule qui ralentit la pénétration des agents alcalins et oxydants (peroxyde, relaxants) dans le cortex — réduction des dommages lors des traitements chimiques.

### 3. Hydratation et élasticité
Intégrée dans le NMF capillaire naturel, l'arginine contribue à la rétention hydrique du cortex et améliore la flexibilité de la fibre.

### 4. Stimulation de la microcirculation (cuir chevelu)
L'arginine est le précurseur du monoxyde d'azote (NO) via la NO synthase. Le NO est un vasodilatateur qui améliore la microcirculation péri-folliculaire — bénéfice sur la nutrition du bulbe pileux.

## Concentration d'usage
- Après-shampooings / masques : 0,5–3%
- Leave-ins : 0,3–1%
- Formules pré-chimiques : 1–5%
`,
  },
  {
    name: 'Protéine de Jojoba Hydrolysée (Hydrolyzed Jojoba Esters)',
    slug: INGREDIENT_SLUGS.HYDROLYZED_JOJOBA_PROTEIN,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Esters de jojoba hydrolysés combinant un fragment protéique et un fragment lipidique, apportent nutrition, brillance et protection thermique à la fibre capillaire.',
    content: `
# Protéine de Jojoba Hydrolysée (Hydrolyzed Jojoba Esters)

Les esters de jojoba hydrolysés (*Simmondsia chinensis*) sont des molécules hybrides obtenues par transestérification partielle des cires liquides du jojoba avec des fragments protéiques ou peptidiques. Cette nature amphiphile (tête protéique + queue lipidique) est unique parmi les actifs protéiques capillaires.

## INCI
**HYDROLYZED JOJOBA ESTERS** (CAS: 227927-89-1)

## Mécanisme d'action

### 1. Affinité avec les lipides de la cuticule
La partie ester lipidique s'intègre aux lipides inter-cellulaires de la cuticule (18-MEA, acides gras libres) — reconstitution du film lipidique superficiel souvent dégradé par la coloration ou la chaleur.

### 2. Renforcement protéique
La partie peptidique s'associe aux chaînes kératiniques sous-jacentes — combinaison inédite de renforcement lipidique + protéique en une seule molécule.

### 3. Brillance et protection thermique
Le film amphotère déposé en surface réfléchit la lumière, réduit la friction et agit comme barrière thermique partielle lors du brushing.

### 4. Légèreté
Contrairement aux huiles de jojoba non modifiées, les esters hydrolysés ne laissent pas de résidu gras visible — bénéfice pour les cheveux fins.

## Concentration d'usage
- Sérums et leave-ins : 0,5–2%
- Masques : 1–3%
`,
  },
  {
    name: 'Créatine (Creatine)',
    slug: INGREDIENT_SLUGS.CREATINE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Molécule guanidinoacétate naturelle, renforce la résistance mécanique de la fibre kératinique et protège contre les dommages oxydatifs et thermiques.',
    content: `
# Créatine (Creatine)

La créatine (acide guanidinoacétique N-méthylé) est une molécule naturellement synthétisée dans l'organisme (foie, rein, pancréas) à partir d'arginine, glycine et méthionine. En cosmétique capillaire, elle est utilisée pour son action de renforcement de la structure kératinique.

## INCI
**CREATINE** (CAS: 57-00-1 | COSING: 32430)

## Mécanisme d'action

### 1. Renforcement des liaisons kératiniques
La créatine interagit avec les domaines peptidiques de la kératine via liaisons hydrogène et électrostatiques, augmentant la cohésion interne de la fibre. Des tests mécaniques (traction cyclique) montrent une amélioration significative de la résistance à la casse.

### 2. Protection contre les dommages oxydatifs
Son groupement guanidinium agit comme piégeur de radicaux libres — protection contre la décoloration oxidative et la dégradation thermique.

### 3. Renforcement de la cuticule
Des études microscopiques (AFM) montrent une amélioration de l'adhésion des écailles cuticulaires après traitement à la créatine — réduction de la porosité mesurable.

### 4. Compatibilité avec la kératine endogène
La créatine est présente naturellement dans les tissus kératinisés — son apport externe est bien toléré et assimilé sans perturbation du micro-environnement fibres.

## Concentration d'usage
- Masques et après-shampooings : 0,5–3%
- Shampoings renforceurs : 0,2–1%
`,
  },
  {
    name: 'Proline',
    slug: INGREDIENT_SLUGS.PROLINE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Acide aminé cyclique constitutif de la kératine et du collagène, contribue à l'élasticité et à la flexibilité de la fibre capillaire.",
    content: `
# Proline

La proline est un acide aminé cyclique imino — seul acide aminé naturel à cycle pyrrolidine, ce qui lui confère des propriétés conformationnelles uniques. Elle représente ~10–15% de la composition de la kératine et ~12% du collagène.

## INCI
**PROLINE** (CAS: 147-85-3 | COSING: 56192)

## Mécanisme d'action

### 1. Flexibilité conformationnelle
Le cycle pyrrolidine de la proline introduit des coudes rigides dans les chaînes peptidiques. En s'incorporant aux zones de coudes de la kératine, elle module l'élasticité de la fibre — réduction du module de Young, meilleure tolérance à l'élongation.

### 2. Reconstitution des structures secondaires
La proline participe à la stabilisation des hélices alpha et des feuillets bêta de la kératine — reconstruction partielle de la structure secondaire dégradée par les traitements chimiques.

### 3. Osmolyte compatible
Comme dans les organismes résistants au stress, la proline libre agit comme osmolyte dans la fibre — protection contre la déshydratation et le stress thermique.

### 4. Précurseur d'hydroxyproline
En présence de cofacteurs (vitamine C), la proline peut être hydroxylée en hydroxyproline, renforçant les liaisons inter-peptidiques.

## Concentration d'usage
- Formules protéiques complexes : 0,1–1%
- Souvent associée à d'autres acides aminés ou peptides.
`,
  },
  {
    name: 'Thréonine (Threonine)',
    slug: INGREDIENT_SLUGS.THREONINE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Acide aminé essentiel hydroxylé, hydrate la fibre capillaire de l'intérieur, participe aux liaisons structurelles de la kératine et renforce la cuticule.",
    content: `
# Thréonine (Threonine)

La thréonine est l'un des acides aminés essentiels (non synthétisable par l'organisme humain). Elle est présente dans la kératine capillaire à environ 6–8% — son groupe β-hydroxyle en fait un site de N-acétylglucosaminylation et de phosphorylation dans les structures protéiques.

## INCI
**THREONINE** (CAS: 72-19-5 | COSING: 58748)

## Mécanisme d'action

### 1. Hydratation hygroscopique
Le groupe hydroxyle (-OH) de la thréonine est hygroscopique — les résidus thréonine dans la kératine ou ajoutés librement retiennent l'eau dans la fibre. Contribution directe au NMF capillaire.

### 2. Sites de glycosylation
In vivo, la thréonine est un site d'O-glycosylation protéique — en cosmétique, cette propriété permet à la thréonine de se lier aux sucres et polysaccharides co-formulés, renforçant les films hydrophiles de surface.

### 3. Stabilité chimique de la kératine
La thréonine résiste bien à l'oxydation, ce qui en fait un acide aminé stabilisant dans les zones exposées aux agents oxydants (UV, traitements).

### 4. Participation aux liaisons peptidiques
En s'incorporant dans les lacunes peptidiques de la kératine endommagée, la thréonine contribue à la cohésion inter-résidus.

## Concentration d'usage
- Complexes d'acides aminés capillaires : 0,1–1%
- Souvent combinée à la sérine et la glycine.
`,
  },
  {
    name: 'Sérine (Serine)',
    slug: INGREDIENT_SLUGS.SERINE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Acide aminé hydroxylé majeur du NMF cutané et capillaire, puissant humectant naturel qui maintient l'hydratation de la fibre et du cuir chevelu.",
    content: `
# Sérine (Serine)

La sérine est l'un des acides aminés les plus abondants dans la kératine capillaire (~8–10%) et dans le NMF (Natural Moisturizing Factor) du cuir chevelu. Son groupe -CH₂OH la rend très hygroscopique — elle est souvent isolée spécifiquement pour son action hydratante.

## INCI
**SERINE** (CAS: 56-45-1 | COSING: 57196)

## Mécanisme d'action

### 1. Humectance puissante
Le groupe hydroxyle de la sérine est l'un des plus efficaces pour retenir l'eau parmi les acides aminés naturels. La sérine libre dans la fibre capillaire forme des liaisons hydrogène avec l'eau atmosphérique — maintien de l'hydratation même en faible humidité relative.

### 2. Composant du NMF capillaire
La sérine fait partie des acides aminés naturellement présents dans le contenu cortical des cheveux — son apport externe reconstitue le pool NMF dégradé par les lavages et traitements chimiques.

### 3. Sites de phosphorylation
In vivo, la sérine est l'acide aminé le plus fréquemment phosphorylé — en cosmétique, cette propriété permet des interactions avec des actifs minéraux (zinc, calcium) et renforce la cohésion de la structure protéique.

### 4. Douceur sensorielle
La sérine libre contribue à la sensation de douceur et de glissant perçue sur la fibre — réduit la friction lors du démêlage.

## Concentration d'usage
- Complexes NMF capillaires : 0,2–2%
- Formules hydratantes et après-shampooings : 0,5–2%
`,
  },
  {
    name: 'Glycine',
    slug: INGREDIENT_SLUGS.GLYCINE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Plus petit acide aminé naturel, composant structurel majeur de la kératine et de la soie, pénètre profondément la fibre et stabilise la structure protéique.',
    content: `
# Glycine

La glycine est le plus simple des acides aminés (R = H) et le seul non chiral. Elle représente ~6–8% des résidus kératiniques capillaires et ~45% de la fibroïne de soie. Sa taille minimale lui confère une pénétration capillaire exceptionnelle.

## INCI
**GLYCINE** (CAS: 56-40-6 | COSING: 35299)

## Mécanisme d'action

### 1. Pénétration corticale maximale
PM = 75 Da — l'un des acides aminés les plus petits. Traverse la cuticule intacte et atteint directement le cortex, y compris dans les fibres peu endommagées. Pénétration supérieure à celle des peptides ou protéines.

### 2. Stabilisation structurelle de la kératine
En s'incorporant aux jonctions entre hélices alpha, la glycine améliore le réseau de liaisons hydrogène inter-chaînes — augmentation de la rigidité structurelle localisée (rôle inverse à la proline).

### 3. Précurseur métabolique
La glycine est le précurseur du glutathion (via γ-glutamylcystéine synthétase) et de la créatine — au niveau du follicule pileux, elle soutient les mécanismes antioxydants endogènes.

### 4. Tampon acide-base
La glycine est un acide aminé zwitterionique — elle agit comme tampon dans la formule et dans la fibre, stabilisant le pH optimal de la kératine (~3,5–5,5).

## Concentration d'usage
- Complexes d'acides aminés : 0,1–1%
- Souvent présente en mélange avec sérine, alanine, thréonine.
`,
  },
  {
    name: 'Alanine',
    slug: INGREDIENT_SLUGS.ALANINE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Acide aminé aliphatique abondant dans la kératine, renforce la structure alpha-hélicoïdale de la fibre et contribue à sa résistance mécanique.',
    content: `
# Alanine

L'alanine est un acide aminé aliphatique non polaire, l'un des plus stables chimiquement. Elle représente ~5–6% des résidus kératiniques des cheveux humains. Sa chaîne méthyle lui confère une tendance à former des hélices alpha — la structure secondaire dominante de la kératine.

## INCI
**ALANINE** (CAS: 56-41-7 | COSING: 28437)

## Mécanisme d'action

### 1. Stabilisation des hélices alpha
L'alanine est l'acide aminé qui forme le plus facilement des hélices alpha en solution. En s'incorporant dans les zones de kératine dégradée, elle favorise la recouvrance de la structure hélicoïdale — amélioration de la résistance mécanique longitudinale.

### 2. Film non polaire de surface
Sa chaîne méthyle non polaire contribue à former un film légèrement hydrophobe en surface de la cuticule — réduction de la friction inter-fibres et résistance partielle à la réhumectation excessive.

### 3. Renforcement de la matrice inter-microfibrillaire
Dans le cortex, l'alanine participe à la cohésion de la matrice amorphe entourant les microfibrilles kératiniques — amélioration de la résistance transversale de la fibre.

### 4. Tolérance optimale
Non irritante, non allergisante, stable dans toutes les formulations cosmétiques courantes.

## Concentration d'usage
- Complexes d'acides aminés capillaires : 0,1–1%
`,
  },
  {
    name: 'Valine',
    slug: INGREDIENT_SLUGS.VALINE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Acide aminé essentiel ramifié, composant des feuillets bêta de la kératine, améliore la compacité et la rigidité structurelle de la fibre capillaire.',
    content: `
# Valine

La valine est un acide aminé essentiel à chaîne ramifiée (BCAA). Elle représente ~4–5% des résidus kératiniques. Sa chaîne isopropyle volumineuse la prédispose à former des feuillets bêta et des structures compactes — les régions cristallines de la kératine où réside la résistance mécanique.

## INCI
**VALINE** (CAS: 72-18-4 | COSING: 59360)

## Mécanisme d'action

### 1. Renforcement des feuillets bêta
La valine s'intercale préférentiellement dans les domaines cristallins de la kératine (feuillets β) — amélioration de la compacité et de la résistance à la dénaturation thermique et chimique.

### 2. Hydrophobicité contrôlée
La chaîne isopropyle non polaire contribue au cœur hydrophobe des domaines cristallins kératiniques — stabilisation de la structure tertiaire de la protéine.

### 3. Résistance aux traitements chimiques
Les zones riches en résidus valine sont plus résistantes à l'hydrolyse alcaline (décoloration) — l'apport externe de valine renforce ces zones vulnérables.

### 4. Synergie avec leucine et isoleucine
Souvent formulée avec les autres BCAA (leucine, isoleucine) pour un effet synergique sur la structuration kératinique.

## Concentration d'usage
- Complexes d'acides aminés : 0,1–0,5%
`,
  },
  {
    name: 'Histidine',
    slug: INGREDIENT_SLUGS.HISTIDINE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Acide aminé essentiel à cycle imidazole, chélatant naturel des métaux lourds dans la fibre capillaire, protège la kératine contre les dommages oxydatifs.',
    content: `
# Histidine

L'histidine est un acide aminé essentiel dont le cycle imidazole (pKa ~6) lui confère des propriétés de chélation métallique uniques. Elle représente ~1–2% des résidus kératiniques. Son rôle protecteur contre les métaux lourds en fait un actif particulièrement pertinent pour les cheveux colorés ou exposés aux eaux calcaires.

## INCI
**HISTIDINE** (CAS: 71-00-1 | COSING: 37289)

## Mécanisme d'action

### 1. Chélation des métaux lourds
Le cycle imidazole de l'histidine forme des complexes stables avec Cu²⁺, Fe²⁺, Zn²⁺ et d'autres ions métalliques. Dans la fibre capillaire, ces métaux (issus de l'eau du robinet, des colorants, des outils métalliques) catalysent les réactions de Fenton — génération de radicaux OH⁻ qui dégradent la kératine. La chélation par l'histidine bloque cette voie.

### 2. Tampon pH à pH physiologique
Le cycle imidazole est en équilibre protoné/déprotoné à pH 6–7 — l'histidine agit comme tampon physiologique dans la fibre, maintenant un pH optimal pour la kératine.

### 3. Protection antioxydante indirecte
En piégeant les métaux catalyseurs de la peroxydation, l'histidine protège indirectement les lipides cuticulaires et les chaînes kératiniques contre l'oxydation.

### 4. Substantivité sur fibre endommagée
Les groupes imidazole chargés s'adsorbent sur les sites négatifs de la kératine dégradée — dépôt préférentiel sur les zones abîmées.

## Concentration d'usage
- Formules protectrices couleur / anti-métal : 0,1–1%
- Associée à l'EDTA ou à d'autres chélateurs pour une protection complète.
`,
  },
  {
    name: 'Phénylalanine (Phenylalanine)',
    slug: INGREDIENT_SLUGS.PHENYLALANINE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Acide aminé essentiel aromatique, composant des domaines hydrophobes de la kératine, contribue à la compacité structurelle et à la résistance chimique de la fibre.',
    content: `
# Phénylalanine (Phenylalanine)

La phénylalanine est un acide aminé essentiel à noyau phényle. Elle représente ~2–3% des résidus kératiniques. Sa chaîne benzyle lui confère une forte hydrophobicité et une tendance à participer aux interactions π-π (stacking aromatique) dans le cœur des domaines cristallins.

## INCI
**PHENYLALANINE** (CAS: 63-91-2 | COSING: 75595)

## Mécanisme d'action

### 1. Compacité du cœur hydrophobe
La phénylalanine s'intègre dans les régions hydrophobes des domaines cristallins de la kératine — participation aux interactions Van der Waals et π-π qui cimentent la structure tertiaire. Amélioration de la résistance à la dénaturation thermique.

### 2. Résistance aux détergents
Les domaines riches en résidus aromatiques (phénylalanine, tyrosine) résistent mieux à la solubilisation par les tensioactifs. Apport externe de phénylalanine : protection partielle contre les dégâts liés aux shampooings répétés.

### 3. Précurseur de tyrosine et mélanine
In vivo, la phénylalanine est hydroxylée en tyrosine, précurseur de la mélanine. Au niveau du cuir chevelu, elle soutient les mélanocytes folliculaires — bénéfice potentiel sur la pigmentation et la vitalité du follicule.

### 4. Stabilité chimique
Peu réactive chimiquement (pas de groupe fonctionnel polaire sur la chaîne latérale) — stable dans les formules oxydantes et alcalines.

## Concentration d'usage
- Complexes d'acides aminés : 0,1–0,5%
`,
  },
  {
    name: 'Acide Aspartique (Aspartic Acid)',
    slug: INGREDIENT_SLUGS.ASPARTIC_ACID_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Acide aminé dicarboxylique chargé négativement, tamponne le pH de la fibre capillaire, hydrate le cortex et participe à la cohésion ionique de la kératine.',
    content: `
# Acide Aspartique (Aspartic Acid)

L'acide aspartique est un acide aminé dicarboxylique non essentiel, abondant dans la kératine (~6–8% des résidus). Sa double charge négative (pKa 1,99 et 3,90) en fait un actif ionique influençant les interactions électrostatiques au sein de la structure protéique.

## INCI
**ASPARTIC ACID** (CAS: 56-84-8 | COSING: 29237)

## Mécanisme d'action

### 1. Tamponnement du pH cortical
Les deux groupes carboxyliques de l'acide aspartique jouent un rôle de tampon acide dans la fibre. Ils maintiennent un environnement acide optimal (pH 3,5–5) dans le cortex, favorable à la compaction de la kératine (fermeture de la cuticule).

### 2. Cohésion ionique inter-chaînes
Les résidus aspartique chargés (-COO⁻) forment des ponts ioniques avec les résidus basiques (arginine, lysine, histidine) des chaînes kératiniques voisines — ponts salin stabilisant la structure quaternaire.

### 3. Hydratation hygroscopique
Les groupes carboxylates polaires de l'acide aspartique forment des liaisons hydrogène avec l'eau — contribution à la rétention hydrique dans le cortex.

### 4. Activation enzymatique folliculaire
L'acide aspartique est cofacteur de nombreuses réactions enzymatiques — au niveau du follicule, il soutient le cycle cellulaire des kératinocytes et la synthèse de kératine endogène.

## Concentration d'usage
- Complexes d'acides aminés capillaires : 0,1–1%
- Formules acides post-coloration et post-permanente : 0,2–1%
`,
  },
]

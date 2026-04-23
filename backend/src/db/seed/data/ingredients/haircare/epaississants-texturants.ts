import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_EPAISSISSANTS: IngredientInput[] = [
  {
    name: 'Carbomer',
    slug: INGREDIENT_SLUGS.CARBOMER_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      'Polymère acrylique réticulé qui forme des gels clairs à pH neutre-basique, agent épaississant et suspenseur de référence pour les gels coiffants et les shampoings.',
    content: `
# Carbomer

Le carbomer (Carbopol®, marque déposée Lubrizol) est un polymère de l'acide acrylique réticulé avec du divinyl glycol ou de l'allyl pentaérythritol. Il ne gèle pas à l'état natif (pH acide) mais forme des gels viscoélastiques très stables lorsqu'il est neutralisé à pH 6–8.

## INCI
**CARBOMER** (CAS: 76050-42-5 | COSING: 31403)

## Mécanisme d'action

### 1. Gélification par neutralisation
À pH acide, le carbomer est compact et peu visqueux. La neutralisation (NaOH, triéthanolamine, arginine) ionise les groupements carboxyliques (-COOH → -COO⁻), créant des répulsions électrostatiques qui déroulent les chaînes polymères et forment un réseau gel tridimensionnel.

### 2. Comportement rhéofluidifiant (shear-thinning)
Le gel carbomer s'écoule facilement sous cisaillement (application) et retrouve sa viscosité au repos — idéal pour les gels coiffants et les crèmes capillaires (application facile, maintien en place).

### 3. Suspension de particules
Le réseau polymère peut maintenir en suspension des particules insolubles (silicones, huiles, nacres) sans sédimentation — essentiel pour les shampoings biphasiques ou les formules opaques.

### 4. Stabilisation des émulsions
Les chaînes ioniques du carbomer interagissent avec les interfaces huile/eau et stabilisent les émulsions, permettant de réduire les teneurs en émulsifiants.

## Grades principaux

| Grade | Réticulant | Application typique |
|---|---|---|
| Carbomer 940 | Allyl pentaérythritol | Gels clairs, haute viscosité |
| Carbomer 980 | Allyl pentaérythritol | Gels épais, masques |
| Carbomer 2020 | Divinyl glycol | Émulsions, crèmes |
| Carbomer ETD 2020 | — | Tolerant électrolytes |

## Concentration d'usage

- Gels coiffants : 0,5–2%
- Shampoings épaississants : 0,1–0,5%
`,
  },
  {
    name: 'Acrylates Copolymer',
    slug: INGREDIENT_SLUGS.ACRYLATES_COPOLYMER_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      'Copolymère acrylique tolèrant les électrolytes, épaississant stable dans les formules à forte concentration en sel ou en tensioactifs — utilisé dans les shampoings et après-shampooings modernes.',
    content: `
# Acrylates Copolymer

Les acrylates copolymers (Carbopol® Aqua SF-1, Ultrez 20, Sepimax Zen, etc.) sont des copolymères d'acide acrylique avec des monomères modificateurs (acide méthylique, acrylates d'alkyle) conçus pour pallier le principal défaut du carbomer : son instabilité en présence d'électrolytes (sel, tensioactifs ioniques).

## INCI
**ACRYLATES COPOLYMER** (CAS: 25133-97-5)

## Mécanisme d'action

### 1. Épaississement tolérant aux électrolytes
La copolymérisation avec des monomères non ioniques ou cationiques réduit la sensibilité aux cations (Na⁺, K⁺, Ca²⁺) qui compriment les chaînes ioniques du carbomer classique et effondrent la viscosité. Les acrylates copolymers maintiennent leur structure gel dans des milieux riches en sel ou en tensioactifs.

### 2. Épaississement sans neutralisation
Certains grades (ex: Sepimax Zen, Carbopol Aqua SF-1) épaississent directement à pH 5–7 sans nécessiter de neutralisation — simplifiant la formulation et évitant les risques d'ajout de base.

### 3. Texture soyeuse et non collante
Confèrent des textures légères, non grasses et à rinçage facile — avantage sensoriel vs les carbomers traditionnels, particulièrement apprécié dans les après-shampooings et les leave-ins crémeux.

### 4. Film flexible sur la fibre
Certains grades forment un film polymère sur la cuticule qui améliore le glissant, réduit la friction et facilite le démêlage — double fonction épaississant / agent conditionneur.

## Grades courants en capillaire

- **Carbopol Aqua SF-1** (Lubrizol) : stable électrolytes, pH 3,5–6
- **Sepimax Zen** (Seppic) : auto-épaississant, pH 5–7
- **Ultrez 20** (Lubrizol) : émulsifiant épaississant, crèmes capillaires

## Concentration d'usage

- Shampoings, après-shampooings : 0,3–1%
- Gels légers, leave-ins : 0,5–1,5%
`,
  },
  {
    name: 'Gomme de Xanthane (Xanthan Gum)',
    slug: INGREDIENT_SLUGS.XANTHAN_GUM_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      'Polysaccharide fermenté par Xanthomonas campestris, épaississant et stabilisant naturel rhéofluidifiant, compatible formules Cosmos et soins capillaires naturels.',
    content: `
# Gomme de Xanthane (Xanthan Gum)

La gomme de xanthane est un polysaccharide microbien produit par fermentation de glucose ou sucrose par la bactérie *Xanthomonas campestris*. C'est l'épaississant naturel de référence en cosmétique capillaire, certifiable Cosmos/Ecocert et largement utilisé dans les formules clean beauty.

## INCI
**XANTHAN GUM** (CAS: 11138-66-2 | COSING: 60166)

## Structure chimique

Polysaccharide héteroglycane à chaîne principale de cellulose (1,4-β-D-glucose) et chaînes latérales de mannose, acide glucuronique et mannose pyruvylé. La double hélice rigide confère une haute viscosité à très faible concentration.

## Mécanisme d'action

### 1. Épaississement par enchevêtrement moléculaire
Les chaînes de xanthane s'associent en double hélice et s'enchevêtrent pour former un réseau viscoélastique hydraté. La viscosité est obtenue dès 0,1–0,5% — efficience élevée vs épaississants synthétiques.

### 2. Comportement rhéofluidifiant prononcé
Viscosité très élevée au repos (empêche la sédimentation) mais chute drastiquement sous cisaillement (application facile). Idéal pour les shampoings, masques et gels coiffants naturels.

### 3. Stabilisation des suspensions et émulsions
Le réseau gel maintient en suspension les particules (nacres, argiles, poudres) et les globules d'émulsion, réduisant le besoin en émulsifiants — formulation naturelle simplifiée.

### 4. Compatibilité électrolytes et pH
Stable sur une large gamme de pH (3–12) et tolère les sels — avantage décisif sur le carbomer en milieu tensioactif.

## Limites

Sensation légèrement filmogène sur certains types de cheveux (cheveux fins, sensible à l'accumulation). Souvent associée à un agent clarifiant (ACV, acide citrique) dans les formules curl-friendly.

## Concentration d'usage

- Shampoings et après-shampooings : 0,1–0,5%
- Gels coiffants naturels : 0,5–2%
- Masques et crèmes : 0,3–1%
`,
  },
  {
    name: 'Gomme de Cellulose (Cellulose Gum)',
    slug: INGREDIENT_SLUGS.CELLULOSE_GUM_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      'Carboxyméthylcellulose sodique dérivée du bois ou du coton, épaississant naturel substantif qui se dépose préférentiellement sur les cheveux abîmés pour un lissage et une protection durables.',
    content: `
# Gomme de Cellulose (Cellulose Gum / Carboxymethylcellulose sodique)

La gomme de cellulose, ou carboxyméthylcellulose sodique (Na-CMC), est un éther de cellulose obtenu par réaction de la cellulose (bois, coton) avec l'acide monochloracétique en milieu basique. C'est l'un des épaississants et agents filmogènes les plus versatiles en cosmétique capillaire.

## INCI
**CELLULOSE GUM** (CAS: 9004-32-4 | COSING: 31695)

## Mécanisme d'action

### 1. Épaississement en phase aqueuse
Les chaînes de CMC s'hydratent et s'enchevêtrent pour former des solutions visqueuses pseudoplastiques. La viscosité dépend du degré de substitution (DS) et du poids moléculaire.

### 2. Substantivité capillaire (dépôt préférentiel)
Les charges anioniques de la CMC interagissent avec les zones cationiques de la cuticule capillaire endommagée (pointes fourchues, cheveux poreux, décolorés). Elle se dépose de manière préférentielle sur les zones les plus abîmées, les protégeant et les lissant.

### 3. Film protecteur et lissant
Le film CMC déposé sur la cuticule : réduit la friction inter-capillaire, améliore le glissant et facilite le démêlage, et réduit la porosité des zones endommagées.

### 4. Stabilisation des tensioactifs
Améliore la stabilité et la texture mousseuse des shampoings, en particulier des formules sulfate-free où la mousse est naturellement moins abondante.

## Concentration d'usage

- Shampoings : 0,3–1%
- Après-shampooings et masques : 0,5–2%
- Gels coiffants naturels : 0,5–3%
`,
  },
  {
    name: 'Hydroxyéthylcellulose (Hydroxyethylcellulose)',
    slug: INGREDIENT_SLUGS.HYDROXYETHYLCELLULOSE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      "Éther de cellulose non ionique d'origine végétale, épaississant stable aux électrolytes, agents filmogènes doux, compatible toutes formulations capillaires y compris shampoings à forte teneur en sel.",
    content: `
# Hydroxyéthylcellulose (HEC)

L'hydroxyéthylcellulose est un éther de cellulose obtenu par réaction de la cellulose avec de l'oxyde d'éthylène. Sa structure non ionique lui confère une excellente compatibilité avec les électrolytes et les tensioactifs de toutes charges, contrairement à la CMC anionique.

## INCI
**HYDROXYETHYLCELLULOSE** (CAS: 9004-62-0 | COSING: 37846)

## Mécanisme d'action

### 1. Épaississement non ionique
Les groupements hydroxyéthyle augmentent l'hydrophilie et l'encombrement stérique des chaînes de cellulose, formant des solutions visqueuses par enchevêtrement sans interaction ionique. Résultat : viscosité indépendante de la force ionique du milieu.

### 2. Compatibilité électrolytes totale
Contrairement au carbomer et à la CMC, l'HEC maintient sa viscosité dans les formules à forte teneur en sel (NaCl, MgSO₄), dans les milieux tensioactifs (SLS, SLES, betaïne) et sur une large gamme de pH (2–12).

### 3. Film protecteur léger sur la fibre
Se dépose sur la cuticule capillaire sous forme d'un film léger et flexible qui améliore le glissant et réduit la friction — sans alourdissement (avantage sur les guar hydroxypropyltrimonium cationiques).

### 4. Texturation des gels coiffants
À plus haute concentration, forme des gels translucides à toucher soyeux non collant — base de gels coiffants "hold léger" pour cheveux bouclés.

## Concentration d'usage

- Shampoings et après-shampooings : 0,3–1%
- Gels coiffants légers : 1–3%
- Masques et crèmes sans rinçage : 0,5–1,5%
`,
  },
  {
    name: 'Hydroxypropyl Méthylcellulose (Hydroxypropyl Methylcellulose)',
    slug: INGREDIENT_SLUGS.HYDROXYPROPYL_METHYLCELLULOSE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      "Éther de cellulose mixte hydroxypropyléthylé, épaississant et agent filmogène thermogelifiable d'origine végétale, valorisé dans les formules capillaires naturelles et les gels coiffants.",
    content: `
# Hydroxypropyl Méthylcellulose (HPMC)

L'HPMC est un éther de cellulose mixed (méthyl + hydroxypropyl) obtenu par réaction de la cellulose avec du chlorure de méthyle et de l'oxyde de propylène. Sa propriété remarquable de gélification thermique inverse (gel à chaud, liquide à froid) offre des opportunités formulatoires uniques.

## INCI
**HYDROXYPROPYL METHYLCELLULOSE** (CAS: 9004-65-3 | COSING: 37855)

## Mécanisme d'action

### 1. Épaississement non ionique
Similaire à l'HEC : enchevêtrement des chaînes par hydratation des groupements éther, viscosité stable aux électrolytes et sur large gamme de pH (3–11).

### 2. Gélification thermique inverse (propriété distinctive)
Les groupements méthyle (hydrophobes) favorisent les associations inter-chaînes à haute température, formant un gel thermoreversible. Propriété exploitée dans les conditionneurs "rinse-off" qui gèlent au contact du cuir chevelu chaud et se rincent facilement à l'eau froide.

### 3. Film gélifiant sur la fibre
Se dépose sous forme d'un film gel flexible qui améliore le glissant, réduit l'électricité statique et confère une légère fixation sans rigidité (effet "cast" doux pour les cheveux bouclés).

### 4. Agent de suspension
Maintient les particules en suspension (argiles, poudres botaniques) sans nécessiter d'autres épaississants — formulation minimaliste.

## Concentration d'usage

- Shampoings et après-shampooings : 0,3–1%
- Gels coiffants à fixation légère : 1–3%
- Formules thermogelifiables : 2–5%
`,
  },
  {
    name: 'PEG-120 Methyl Glucose Dioleate',
    slug: INGREDIENT_SLUGS.PEG_120_METHYL_GLUCOSE_DIOLEATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      'Épaississant tensioactif non ionique PEGylé du glucose, augmente efficacement la viscosité des shampoings riches en tensioactifs doux sans alourdir la formule.',
    content: `
# PEG-120 Methyl Glucose Dioleate

Le PEG-120 Methyl Glucose Dioleate est un ester gras PEGylé obtenu par réaction du méthyl glucose dioleate avec 120 unités d'oxyde d'éthylène. C'est un épaississant tensioactif non ionique spécialement conçu pour les shampoings doux et les formules à base de tensioactifs amphotères.

## INCI
**PEG-120 METHYL GLUCOSE DIOLEATE** (CAS: 86893-19-8)

## Mécanisme d'action

### 1. Épaississement associatif en milieu tensioactif
Contrairement aux épaississants polymériques classiques (carbomer, gommes), le PEG-120 Methyl Glucose Dioleate épaissit par interactions associatives avec les micelles de tensioactifs. Les chaînes oléique lipophiles s'insèrent dans les micelles de tensioactifs, créant un réseau micellaire étendu de haute viscosité.

### 2. Compatibilité avec les tensioactifs doux
Particulièrement efficace avec les tensioactifs amphotères (cocamidopropyl betaine, alkyl glucosides) et les non ioniques — milieux dans lesquels le chlorure de sodium (sel) traditionnel est peu efficace pour épaissir.

### 3. Résistance aux électrolytes
La structure PEG très hydrophile maintient sa capacité épaississante même en présence de sel — avantage dans les formules légèrement salines.

### 4. Amélioration de la mousse
Stabilise et améliore la qualité de la mousse dans les shampoings doux (mousses plus crémeuses, plus durables).

## Concentration d'usage

- Shampoings sulfate-free et tensioactifs doux : 1–3%
`,
  },
  {
    name: 'Alginate de Sodium (Sodium Alginate)',
    slug: INGREDIENT_SLUGS.SODIUM_ALGINATE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      "Polysaccharide anionique extrait d'algues brunes, épaississant et agent filmogène naturel qui forme des gels en présence de calcium, certifiable Cosmos.",
    content: `
# Alginate de Sodium (Sodium Alginate)

L'alginate de sodium est le sel sodique de l'acide alginique, un polysaccharide linéaire anionique extrait des algues brunes (*Macrocystis pyrifera*, *Laminaria hyperborea*, *Ascophyllum nodosum*). C'est un épaississant naturel certifiable Cosmos, apportant également des propriétés filmogènes et hydratantes.

## INCI
**SODIUM ALGINATE** (CAS: 9005-38-3 | COSING: 57200)

## Structure chimique

Copolymère de β-D-mannuronate (M) et α-L-guluronate (G) liés en 1,4. La proportion M/G détermine la rigidité et la gélification du polymère.

## Mécanisme d'action

### 1. Épaississement par hydratation des chaînes
En solution aqueuse, les chaînes d'alginate s'hydratent et s'enchevêtrent pour former des solutions visqueuses. L'efficacité dépend du pH (optimale à pH 5–10) et de la teneur en électrolytes.

### 2. Gélification ionique (zones riche en G)
En présence de cations divalents (Ca²⁺, Ba²⁺), les blocs G de l'alginate forment des liaisons en "boîte à œufs" qui créent un gel ionotropique — mécanisme exploité dans les masques capillaires gélifiant au contact des minéraux de l'eau.

### 3. Film protecteur et hydratant
Le film d'alginate déposé sur la cuticule est hygroscopique (retient l'eau) et forme une protection mécanique légère. Propriétés adoucissantes prouvées.

### 4. Suspension et stabilisation
Maintient en suspension les particules et globules d'émulsion dans les formules capillaires naturelles.

## Concentration d'usage

- Shampoings et après-shampooings : 0,5–2%
- Masques géliants capillaires : 1–3%
`,
  },
  {
    name: 'Gomme de Sclérote (Sclerotium Gum)',
    slug: INGREDIENT_SLUGS.SCLEROTIUM_GUM,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      'Biopolymère fongique fermenté, épaississant naturel à haute performance tolérant les électrolytes, compatible formules certifiées et soins capillaires pour cheveux bouclés.',
    content: `
# Gomme de Sclérote (Sclerotium Gum)

La gomme de sclérote (ScleroPure™, Amigel™) est un biopolymère produit par fermentation du champignon *Sclerotium rolfsii*. Ce glucane ramifié (β-1,3/β-1,6 glucane) est l'un des épaississants naturels les plus performants, notamment adopté dans les formules curly et les soins certifiés naturels premium.

## INCI
**SCLEROTIUM GUM** (CAS: 39464-87-4)

## Mécanisme d'action

### 1. Épaississement par réseau polymère
Les chaînes de β-glucane s'associent par liaisons hydrogène pour former un réseau gel semi-rigide capable d'atteindre des viscosités très élevées à faible concentration (0,5–1,5%). La texture est caractéristiquement soyeuse et non collante.

### 2. Tolérance aux électrolytes et aux tensioactifs
Structure non ionique — la viscosité est maintenue en présence de sel, de tensioactifs ioniques et sur une large gamme de pH (4–9). Avantage décisif dans les formules capillaires complexes.

### 3. Stabilisation des émulsions
Renforce les films interfaciaux des émulsions H/E et E/H, permettant de réduire les teneurs en émulsifiants et d'améliorer la stabilité long terme.

### 4. Hydratation de la fibre
Les β-glucanes exercent une humectance de surface et peuvent se déposer légèrement sur la cuticule, apportant douceur et brillance — double fonction épaississant/conditionneur léger.

## Avantages formulatoires

- Compatible Cosmos/Ecocert (fermentation)
- Texture sensorielle supérieure aux gommes d'origine végétale (xanthane, guar)
- Très apprécié dans la communauté curly girl pour les gels without flaking

## Concentration d'usage

- Gels coiffants légers à moyens : 0,5–2%
- Crèmes et leave-ins : 0,3–1%
`,
  },
  {
    name: 'Gomme de Tara (Caesalpinia Spinosa Gum)',
    slug: INGREDIENT_SLUGS.TARA_GUM,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      'Galactomannane extrait des gousses du tara péruvien, épaississant et conditionneur naturel qui améliore le glissant et facilite le démêlage des cheveux bouclés et épais.',
    content: `
# Gomme de Tara (Caesalpinia Spinosa Gum)

La gomme de tara est un galactomannane extrait de l'endosperme des gousses du tara (*Caesalpinia spinosa*), légumineuse originaire d'Amérique du Sud (Pérou, Bolivie). Structurellement proche de la gomme de guar, elle présente un meilleur profil sensoriel et une meilleure compatibilité avec les formules naturelles.

## INCI
**CAESALPINIA SPINOSA GUM** (CAS: 39300-88-4)

## Structure chimique

Galactomannane : chaîne principale de mannose (β-1,4) avec des chaînes latérales de galactose en position 6. Ratio mannose/galactose ~3:1, plus élevé que la gomme de guar (2:1), conférant une texture plus légère.

## Mécanisme d'action

### 1. Épaississement par réseau galactomannane
Les chaînes s'hydratent et forment un réseau viscoélastique en solution aqueuse. Comportement rhéofluidifiant doux — s'écoule sous cisaillement et reprend sa texture au repos.

### 2. Dépôt conditionneur sur la fibre
Les galactomannanes se déposent sur la surface de la cuticule capillaire, formant un film polysaccharidique lubrifiants. Réduit la friction inter-capillaire, améliore le démêlage et le glissant — propriété conditionneur douce.

### 3. Compatibilité tensioactifs et électrolytes
Plus stable que la gomme de guar native en milieu tensioactif. Compatible shampoings sulfate-free et formules naturelles.

### 4. Hydratation légère
Le film polysaccharidique est légèrement hygroscopique — contribue à la rétention hydrique superficielle de la fibre.

## Avantages vs gomme de guar

- Texture plus légère, moins collante
- Sensation de glissant supérieure
- Moins de risque d'alourdissement sur cheveux fins
- Certifiable Cosmos/Ecocert

## Concentration d'usage

- Après-shampooings, masques et crèmes coiffantes : 0,3–1,5%
- Formules démêlantes sans rinçage : 0,5–2%
`,
  },
  {
    name: 'Cétéaryl Glucoside (Cetearyl Glucoside)',
    slug: INGREDIENT_SLUGS.CETEARYL_GLUCOSIDE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      "Émulsifiant et co-émulsifiant non ionique biosourcé, produit par estérification d'alcools gras cétéaryliques et de glucose, utilisé pour former les émulsions O/E des après-shampooings et masques.",
    content: `
# Cétéaryl Glucoside (Cetearyl Glucoside)

Le cétéaryl glucoside est un alkyl glucoside obtenu par réaction d'alcool cétéarylique (mélange C16/C18) avec le glucose. C'est un émulsifiant non ionique biosourcé et biodégradable, certifiable Cosmos/Ecocert, utilisé seul ou en combinaison avec des alcools gras pour former des émulsions stables.

## INCI
**CETEARYL GLUCOSIDE** (CAS: 97281-44-2 | COSING: 31769)

## Mécanisme d'action

### 1. Émulsification huile-dans-eau (O/E)
La structure amphiphile du cétéaryl glucoside (tête glucoside hydrophile + queue C16/C18 lipophile) lui permet de s'adsorber aux interfaces huile/eau, réduisant la tension interfaciale et stabilisant les gouttelettes d'huile dans la phase aqueuse.

### 2. Formation de structures cristaux liquides lamellaires
Associé à l'alcool cétéarylique (co-émulsifiant classique), le cétéaryl glucoside forme des structures cristaux liquides lamellaires dans la phase aqueuse. Ces structures augmentent la viscosité, stabilisent l'émulsion et confèrent un toucher crémeux et onctueux caractéristique des après-shampooings.

### 3. Douceur et tolérance cutanée
Structure glucoside non irritante, compatible peaux et cuirs chevelus sensibles. Profil toxicologique excellent confirmé par le SCCS.

### 4. Propriétés tensioactives douces
HLB ~11–12 : convient aux émulsions O/E légères à modérées. Peut être combiné avec des émulsifiants plus lipophiles (HLB faible) pour optimiser la stabilité.

## Concentration d'usage

- Émulsions après-shampooings et masques : 2–5% (en combinaison avec alcool cétéarylique)
`,
  },
  {
    name: 'PEG-40 Huile de Ricin Hydrogénée (PEG-40 Hydrogenated Castor Oil)',
    slug: INGREDIENT_SLUGS.PEG_40_HYDROGENATED_CASTOR_OIL,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      "Agent solubilisant PEGylé de l'huile de ricin hydrogénée, incorpore les huiles essentielles, silicones et actifs lipophiles dans les phases aqueuses des shampoings et soins capillaires.",
    content: `
# PEG-40 Huile de Ricin Hydrogénée (PEG-40 Hydrogenated Castor Oil)

Le PEG-40 Hydrogenated Castor Oil (Cremophor® RH40, Eumulgin® HRE40) est un éther de polyéthylène glycol d'huile de ricin hydrogénée (ricinoléate estérifié avec 40 unités d'OE). C'est le solubilisant non ionique de référence pour les phases huileuses dans les formulations capillaires aqueuses.

## INCI
**PEG-40 HYDROGENATED CASTOR OIL** (CAS: 61788-85-0 | COSING: 75558)

## Mécanisme d'action

### 1. Solubilisation des actifs lipophiles
Les micelles formées par le PEG-40 HCO (HLB ~13–14) encapsulent les molécules lipophiles (huiles essentielles, vitamines liposolubles A, D, E, silicones volatils, fragrances) dans leur cœur hydrophobe, les rendant dispersibles en phase aqueuse.

### 2. Émulsification légère
Forme des microémulsions transparentes O/E à faible rapport huile/eau — permet d'obtenir des shampoings clairs contenant des huiles ou parfums sans agent opacifiant ni séparation de phases.

### 3. Amélioration de la biodisponibilité des actifs
En solubilisant les actifs dans des nanoparticules micellaires, augmente leur surface de contact avec la fibre et le cuir chevelu, améliorant leur dépôt et leur pénétration.

### 4. Compatibilité tensioactifs
Compatible avec les tensioactifs anioniques, cationiques et amphotères — versant dans la quasi-totalité des formulations shampoings.

## Remarque réglementaire

Contient des chaînes PEG susceptibles de contenir des impuretés (1,4-dioxane) si non purifiées. Formulation certifiée Cosmos exclut les dérivés PEG — remplacé par des solubilisants naturels (PPG-5 Ceteth-20, polysorbates végétaux) dans ces formules.

## Concentration d'usage

- Shampoings et soins capillaires : 0,5–3% (ratio solubilisant/huile ≈ 3:1 à 5:1)
`,
  },
]

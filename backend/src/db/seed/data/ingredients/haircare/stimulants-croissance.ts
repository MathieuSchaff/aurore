import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_STIMULANTS_CROISSANCE: IngredientInput[] = [
  {
    name: 'Caféine (Caffeine)',
    slug: INGREDIENT_SLUGS.CAFFEINE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Méthylxanthine qui pénètre le follicule pileux, inhibe la phosphodiestérase et contre l'effet inhibiteur de la DHT sur la croissance capillaire.",
    content: `
# Caféine (Caffeine)

La caféine (1,3,7-triméthylxanthine) est une méthylxanthine naturellement présente dans le café, le thé et le guarana. En cosmétique capillaire, des études in vitro et quelques études cliniques lui attribuent un rôle de stimulant de la croissance folliculaire, indépendamment de son ingestion.

## INCI
**CAFFEINE** (CAS: 58-08-2 | COSING: 31324)

## Mécanisme d'action

### 1. Inhibition de la phosphodiestérase (PDE)
La caféine inhibe la PDE, l'enzyme qui dégrade l'AMP cyclique (AMPc) intracellulaire. L'augmentation d'AMPc dans les cellules folliculaires stimule leur prolifération et prolonge la phase anagène (croissance active) du cycle capillaire.

### 2. Antagonisme de l'effet de la DHT
La dihydrotestostérone (DHT) inhibe la croissance des kératinocytes folliculaires in vitro. La caféine contrecarre partiellement cet effet inhibiteur en activant les voies de signalisation AMPc-dépendantes, sans modifier les niveaux de DHT systémiques.

### 3. Pénétration folliculaire
Des études de Franz-cell montrent une pénétration significative de la caféine à travers la peau dans le follicule pileux en moins de 2 minutes d'application, même avec un shampoing (temps de contact réduit). Sa pénétration est supérieure à celle de nombreux actifs plus lourds.

### 4. Stimulation de la vascularisation locale
Peut améliorer la microcirculation périfolliculaire par vasodilatation légère, optimisant l'apport en nutriments au bulbe pileux.

## Données cliniques

Études Fischer et al. (Université d'Iéna) montrent une stimulation in vitro de la croissance des follicules pileux humains de 46% à 0,001% de caféine. Des études cliniques pilotes (shampoings à 0,2%) montrent une réduction de la chute perçue après 6 mois.

## Concentration d'usage

- Shampoings et revitalisants : 0,05–0,2%
- Lotions et sérums sans rinçage : 0,1–0,5%
`,
  },
  {
    name: 'Niacinamide',
    slug: INGREDIENT_SLUGS.NIACINAMIDE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Forme amide de la vitamine B3, améliore la microcirculation du cuir chevelu, renforce la barrière kératinique folliculaire et réduit l'inflammation associée à la miniaturisation pilaire.",
    content: `
# Niacinamide (Nicotinamide / Vitamine B3)

Le niacinamide (nicotinamide) est la forme amide de la niacine (acide nicotinique, vitamine B3). Contrairement à la niacine, il ne provoque pas de flush cutané. En cosmétique capillaire, il est utilisé pour ses effets sur la vascularisation, le métabolisme cellulaire et la protection de la barrière du cuir chevelu.

## INCI
**NIACINAMIDE** (CAS: 98-92-0 | COSING: 52812)

## Mécanisme d'action

### 1. Précurseur de NAD+/NADP+
Le niacinamide est converti en NAD+ (nicotinamide adénine dinucléotide) et NADP+ dans les cellules folliculaires. Ces coenzymes sont indispensables à la production d'énergie cellulaire (mitochondries) et aux réactions anaboliques nécessaires à la croissance du cheveu.

### 2. Amélioration de la microcirculation
Dilate les capillaires du derme superficiel (sans flush) et améliore l'apport sanguin périfolliculaire. Un meilleur apport en oxygène et nutriments favorise l'activité des cellules de la papille dermique.

### 3. Renforcement de la barrière du cuir chevelu
Stimule la synthèse de céramides et de protéines de jonctions serrées dans l'épiderme du cuir chevelu, renforçant la fonction barrière et réduisant la perte en eau transépidermique.

### 4. Action anti-inflammatoire
Inhibe la dégranulation des mastocytes et la production de médiateurs inflammatoires, réduisant l'inflammation périfolliculaire associée à l'alopécie androgénétique et à la dermite séborrhéique.

### 5. Inhibition de la 5α-réductase (données préliminaires)
Des études in vitro suggèrent une inhibition partielle de la 5α-réductase de type II, réduisant la conversion locale de testostérone en DHT — données moins solides que pour le finastéride.

## Concentration d'usage

- Shampoings et après-shampooings : 2–5%
- Sérums et lotions capillaires sans rinçage : 2–10%
`,
  },
  {
    name: 'Biotine (Biotin / Vitamine H)',
    slug: INGREDIENT_SLUGS.BIOTIN_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Coenzyme carboxylase essentielle au métabolisme des acides aminés et des acides gras constituant la kératine, active principalement en cas de carence avérée.',
    content: `
# Biotine (Biotin / Vitamine H / Vitamine B7)

La biotine (acide D-(+)-biotique) est une vitamine hydrosoluble du groupe B, coenzyme de plusieurs carboxylases impliquées dans la synthèse d'acides gras, la gluconéogenèse et le catabolisme des acides aminés. Sa réputation de "vitamine des cheveux" est réelle mais nuancée : son efficacité est principalement démontrée en cas de carence.

## INCI
**BIOTIN** (CAS: 58-85-5 | COSING: 30774)

## Mécanisme d'action

### 1. Cofacteur de la carboxylase de l'acétyl-CoA
Essentielle à la synthèse des acides gras à longue chaîne qui constituent la gaine lipidique de la fibre capillaire. Une carence entraîne des cheveux ternes, cassants et une chute accrue.

### 2. Métabolisme des acides aminés soufrés
Participe au métabolisme de la méthionine et de la cystéine — acides aminés clés des ponts disulfures de la kératine. Un statut biotine optimal garantit la solidité structurelle de la fibre.

### 3. Prolifération des kératinocytes matriciels
La biotine module l'expression de gènes impliqués dans la prolifération cellulaire du bulbe pileux via l'activation du récepteur de la biotine et les voies NF-κB.

### 4. Limitation des carences
La carence vraie en biotine est rare chez les adultes en bonne santé. Les suppléments topiques peuvent corriger des apports insuffisants locaux, mais la biodisponibilité percutanée reste limitée.

## Efficacité par voie topique vs orale

La prise orale à forte dose (2,5–10 mg/jour) n'a montré un effet que chez les patients avec une carence documentée. La voie topique offre une action locale directe sur le follicule, sans nécessiter d'absorption systémique.

## Concentration d'usage

- Shampoings fortifiants : 0,01–0,1%
- Sérums et masques : 0,01–0,05%
`,
  },
  {
    name: 'Minoxidil',
    slug: INGREDIENT_SLUGS.MINOXIDIL,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Vasodilatateur antihypertenseur reconverti en stimulant capillaire topique, seul actif OTC reconnu par la FDA pour l'alopécie androgénétique masculine et féminine.",
    content: `
# Minoxidil

Le minoxidil est initialement un antihypertenseur oral développé dans les années 1970. La découverte fortuite d'une hypertrichose chez des patients traités a conduit à son développement topique comme traitement de l'alopécie androgénétique. C'est aujourd'hui le seul actif capillaire OTC reconnu efficace par la FDA pour ce type de chute.

## INCI
**MINOXIDIL** (CAS: 38304-91-5)

## Mécanisme d'action

### 1. Activation des canaux potassiques ATP-dépendants
Le sulfate de minoxidil (métabolite actif produit par la sulfotransférase folliculaire) ouvre les canaux K⁺ ATP-dépendants des cellules musculaires lisses et des cellules de la papille dermique. Cette hyperpolarisation membranaire provoque une vasodilatation des capillaires périfolliculaires.

### 2. Amélioration de la vascularisation folliculaire
L'augmentation du débit sanguin périfolliculaire améliore l'apport en oxygène et nutriments aux cellules matricielles du bulbe — environnement favorable à la reprise de la phase anagène.

### 3. Stimulation directe de la papille dermique
Indépendamment de son effet vasculaire, le minoxidil stimule directement la prolifération des cellules de la papille dermique et inhibe leur apoptose via des voies VEGF et Wnt.

### 4. Prolongement de la phase anagène
Retarde l'entrée en phase catagène (régression), augmentant la durée de vie de chaque cycle capillaire.

## Efficacité clinique

Études pivotales FDA : 5% topique chez l'homme → 45% des sujets montrent une repousse notable à 48 semaines. 2% chez la femme → réduction de la chute et légère repousse vertex. Effet maintenu uniquement à l'usage continu — arrêt = rechute en 3–6 mois.

## Statut réglementaire

- **OTC FDA** : 2% (femme), 5% (homme)
- **EU** : Médicament (prescription ou OTC selon pays)
- Non autorisé en formulation cosmétique pure en EU

## Concentration d'usage

- Solution/mousse topique : 2–5%
- Nouveaux formats oraux faibles doses (off-label) : 0,25–1 mg/jour
`,
  },
  {
    name: 'Capixyl (Acetyl Tetrapeptide-3)',
    slug: INGREDIENT_SLUGS.CAPIXYL,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Complexe breveté associant un tétrapeptide biomimétique et un extrait de trèfle rouge, stimule la matrice folliculaire et inhibe la 5α-réductase pour lutter contre l'alopécie androgénétique.",
    content: `
# Capixyl™ (Acetyl Tetrapeptide-3 & Trifolium Pratense Extract)

Capixyl est un complexe actif breveté développé par Lucas Meyer Cosmetics (aujourd'hui IFF). Il combine l'Acetyl Tetrapeptide-3 (peptide biomimétique) avec un extrait de trèfle rouge (*Trifolium pratense*) riche en isoflavones. Il est présenté comme une alternative cosmétique au minoxidil.

## INCI
**ACETYL TETRAPEPTIDE-3 (AND) TRIFOLIUM PRATENSE (CLOVER) FLOWER EXTRACT**

## Composition du complexe

| Composant | Origine | Rôle |
|---|---|---|
| Acetyl Tetrapeptide-3 | Synthèse peptidique | Biomimétisme matrice ECM |
| Extrait de trèfle rouge | *Trifolium pratense* | Inhibition 5α-réductase |

## Mécanisme d'action

### 1. Stimulation des protéines de la matrice extracellulaire (ECM)
L'Acetyl Tetrapeptide-3 mime les fragments peptidiques de la laminine-1 et du collagène IV, protéines structurales de la membrane basale folliculaire. Il stimule la synthèse de ces protéines par les cellules de la papille dermique, renforçant l'ancrage du bulbe pileux et améliorant l'environnement cellulaire de la phase anagène.

### 2. Inhibition de la 5α-réductase
L'extrait de trèfle rouge est riche en biochanine A et génistéine, isoflavones qui inhibent la 5α-réductase de types I et II, réduisant la conversion locale de testostérone en DHT périfolliculaire.

### 3. Réduction de la miniaturisation folliculaire
En associant stimulation ECM et inhibition androgénique locale, Capixyl s'oppose aux deux mécanismes principaux de la miniaturisation folliculaire dans l'alopécie androgénétique.

## Données in vitro (Lucas Meyer Cosmetics)

- +46% expression laminine-1 vs placebo
- +121% expression collagène IV vs placebo
- Inhibition 5α-réductase comparable à ~30% de l'effet du finastéride in vitro

## Concentration d'usage

- Sérums et lotions capillaires sans rinçage : 2–3% du complexe complet
`,
  },
  {
    name: 'Redensyl',
    slug: INGREDIENT_SLUGS.REDENSYL,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Complexe breveté Givaudan ciblant les cellules souches folliculaires, réactive la division des cellules ORSc pour relancer la phase anagène et réduire la chute de cheveux.',
    content: `
# Redensyl™

Redensyl est un complexe actif breveté développé par Givaudan (anciennement Induchem). Il est présenté comme le premier actif à cibler directement les cellules souches du follicule pileux (ORSc — Outer Root Sheath cells) pour relancer la croissance capillaire.

## INCI
**DIHYDROQUERCETIN-GLUCOSIDE (AND) EPIGALLOCATECHIN GALLATE-GLUCOSIDE (AND) GLYCINE (AND) ZINC CHLORIDE**

## Composition du complexe

| Composant | Rôle principal |
|---|---|
| DHQG (Dihydroquercétine-glucoside) | Stimulation ORSc, anti-apoptose |
| EGCG2 (EGCG-glucoside) | Anti-inflammation, antioxydant folliculaire |
| Glycine | Acide aminé constitutif de la kératine |
| Chlorure de zinc | Cofacteur enzymatique, régulation androgénique locale |

## Mécanisme d'action

### 1. Activation des cellules souches folliculaires (ORSc)
Le DHQG stimule la division des cellules ORSc en phase télogène, favorisant leur entrée en anagène. Ces cellules, situées dans le renflement (bulge) du follicule, sont les cellules souches clés du cycle capillaire.

### 2. Inhibition de l'apoptose folliculaire
Le DHQG et l'EGCG2 inhibent les voies apoptotiques (caspases) dans les cellules folliculaires, prolongeant leur survie en phase anagène.

### 3. Réduction du ratio télogène/anagène
En stimulant l'entrée en anagène et en retardant la catagène, Redensyl augmente le ratio de follicules actifs vs inactifs — translatable en cheveux plus denses perçus.

### 4. Protection antioxydante du bulbe
L'EGCG2 neutralise les radicaux libres produits par le stress oxydatif périfolliculaire (UV, pollution, DHT), protégeant les cellules matricielles.

## Données cliniques (Givaudan)

Étude clinique 3 mois (n=26) : -17% de cheveux en phase télogène ; +9% de densité capillaire vs placebo. Comparaison interne avec minoxidil 5% montrant des résultats comparables sur le count de cheveux perdus.

## Concentration d'usage

- Sérums, lotions et après-shampooings sans rinçage : 3% du complexe complet
`,
  },
  {
    name: 'Procapil',
    slug: INGREDIENT_SLUGS.PROCAPIL,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Complexe breveté Sederma à triple action anti-chute : inhibe la 5α-réductase, stimule la synthèse de protéines d'ancrage folliculaire et améliore la microcirculation du cuir chevelu.",
    content: `
# Procapil™

Procapil est un complexe actif breveté développé par Sederma (groupe Croda). Il associe trois molécules complémentaires pour agir sur les trois mécanismes principaux de la chute de cheveux androgénétique : l'excès de DHT, la fragilisation de l'ancrage folliculaire et l'ischémie périfolliculaire.

## INCI
**BIOTINYL-GHK (AND) APIGENIN (AND) OLEANOLIC ACID**

## Composition du complexe

| Composant | Cible | Mécanisme |
|---|---|---|
| Biotinyl-GHK | Métabolisme folliculaire | Cofacteur biotine + tripeptide GHK |
| Apigénine | Vasculaire | Vasodilatation, anti-androgénique |
| Acide oléanolique | Androgénique | Inhibition 5α-réductase |

## Mécanisme d'action

### 1. Inhibition de la 5α-réductase (Acide oléanolique)
L'acide oléanolique, triterpène naturel présent dans l'olive et la sauge, inhibe la 5α-réductase de type I et II, réduisant la production locale de DHT périfolliculaire. Données in vitro comparables à 30–40% de l'effet du finastéride.

### 2. Stimulation de l'ancrage folliculaire (Biotinyl-GHK)
Le Biotinyl-GHK (biotine couplée au tripeptide Glycyl-Histidyl-Lysine) stimule la synthèse des protéines de la matrice extracellulaire (fibronectine, laminine) qui ancrent le follicule au derme. Un ancrage renforcé réduit la chute par effluvium.

### 3. Vasodilatation périfolliculaire (Apigénine)
La flavone apigénine (extraite de persil, camomille) inhibe l'enzyme de dégradation du NO (phosphodiestérase), augmentant la disponibilité du monoxyde d'azote vasodilatateur. Améliore la microcirculation du cuir chevelu.

## Données cliniques (Sederma)

Étude in vivo 4 mois (n=35) : -46% de cheveux en phase télogène ; résultats comparés favorablement au minoxidil 2% dans une étude d'efficacité interne.

## Concentration d'usage

- Sérums et lotions capillaires sans rinçage : 2–3% du complexe complet
`,
  },
  {
    name: 'Extrait de Ginseng (Panax Ginseng Root Extract)',
    slug: INGREDIENT_SLUGS.GINSENG_EXTRACT_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Extrait de racine de ginseng riche en ginsénosides, stimule la prolifération des cellules de la papille dermique et prolonge la phase anagène du cycle capillaire.',
    content: `
# Extrait de Ginseng (Panax Ginseng Root Extract)

Le ginseng (*Panax ginseng* C.A. Meyer) est une plante adaptogène originaire d'Asie du Nord-Est utilisée depuis des millénaires en médecine traditionnelle. Ses racines sont riches en ginsénosides, des triterpènes stéroïdiens présentant des propriétés biologiques multiples, dont des effets prouvés sur la croissance capillaire.

## INCI
**PANAX GINSENG ROOT EXTRACT** (CAS: 90045-38-8 | COSING: 55092)

## Composés actifs principaux

Les ginsénosides constituent 3–8% de la racine séchée. Les plus étudiés pour le cheveu : **Rb1**, **Rg1**, **Rg3**, **Re**, **Rd**.

## Mécanisme d'action

### 1. Stimulation des cellules de la papille dermique
Les ginsénosides Rb1 et Rg1 stimulent la prolifération des cellules de la papille dermique (DPC) et inhibent leur apoptose via activation de la voie Akt/PI3K et Wnt/β-caténine. Les DPC sont les cellules régulatrices centrales du cycle folliculaire.

### 2. Inhibition de la 5α-réductase
Plusieurs ginsénosides (notamment Rg3) inhibent la 5α-réductase de types I et II in vitro, réduisant la conversion locale de testostérone en DHT.

### 3. Vasodilatation et amélioration de la microcirculation
L'extrait de ginseng stimule la production de NO par les cellules endothéliales, améliorant la vascularisation périfolliculaire.

### 4. Action antioxydante
Neutralise les espèces réactives de l'oxygène (ROS) dans l'environnement folliculaire, protégeant les cellules matricielles du stress oxydatif.

## Données cliniques

Études in vitro et quelques études pilotes in vivo montrent une stimulation de la croissance folliculaire ; données cliniques contrôlées en cours d'accumulation. Synergie documentée avec la caféine et les peptides.

## Concentration d'usage

- Shampoings et sérums capillaires : 0,5–3%
`,
  },
  {
    name: 'Extrait de Cresson / Capucine',
    slug: INGREDIENT_SLUGS.CRESSON_CAPUCINE_EXTRACT,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Extraits riches en glucosinolates et isothiocyanates, stimulent la circulation périfolliculaire et constituent la base végétale de l'actif breveté Procapil.",
    content: `
# Extrait de Cresson / Capucine (Nasturtium Officinale / Tropaeolum Majus)

Le cresson de fontaine (*Nasturtium officinale*) et la capucine (*Tropaeolum majus*) appartiennent à la famille des Brassicacées. Ces deux plantes sont riches en glucosinolates et en leur hydrolysat actif, les isothiocyanates — molécules à forte activité biologique sur le follicule pileux. Leur extrait combiné est la base végétale du complexe breveté Procapil (Sederma).

## INCI
**NASTURTIUM OFFICINALE EXTRACT (AND/OR) TROPAEOLUM MAJUS EXTRACT**

## Composés actifs principaux

| Composé | Rôle |
|---|---|
| Glucosinolates (gluconapin, gluconasturtiine) | Précurseurs des isothiocyanates |
| Isothiocyanates (AITC, PEITC) | Actifs biologiques — stimulation capillaire |
| Vitamines C, E | Antioxydants folliculaires |
| Zinc, soufre organiques | Cofacteurs kératinogènes |

## Mécanisme d'action

### 1. Vasodilatation périfolliculaire
Les isothiocyanates libérés par hydrolyse des glucosinolates stimulent les récepteurs TRPA1 des fibres nerveuses sensitives du cuir chevelu. Cette activation neurogène déclenche une vasodilatation locale (réflexe d'axone), améliorant la perfusion sanguine des follicules.

### 2. Stimulation de la microcirculation
Potentialise les effets vasodilatateurs en inhibant la dégradation du NO local — mécanisme complémentaire à l'apigénine dans le complexe Procapil.

### 3. Apport en soufre bio-assimilable
Les glucosinolates souffrés fournissent du soufre organique directement utilisable pour la synthèse de kératine (ponts disulfures), renforçant la fibre capillaire.

### 4. Activité antioxydante et anti-inflammatoire
Les polyphénols et la vitamine C neutralisent le stress oxydatif périfolliculaire et inhibent la production de médiateurs inflammatoires.

## Concentration d'usage

- Extraits standardisés en isothiocyanates : 0,5–2%
- Dans le complexe Procapil : inclus dans les 3% de formulation totale
`,
  },
  {
    name: 'Saw Palmetto (Serenoa Serrulata)',
    slug: INGREDIENT_SLUGS.SAW_PALMETTO,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Extrait lipidique de palmier nain américain riche en acides gras et stérols, inhibiteur naturel de la 5α-réductase utilisé contre l'alopécie androgénétique.",
    content: `
# Saw Palmetto (Serenoa repens / Serenoa serrulata)

Le saw palmetto (palmier nain américain, *Serenoa repens*) est une plante endémique du sud-est des États-Unis. Son extrait lipidique, obtenu par extraction à froid des baies séchées, est riche en acides gras libres, en phytostérols et en polyphénols. Il est largement étudié pour son action anti-androgénique locale.

## INCI
**SERENOA SERRULATA FRUIT EXTRACT** (CAS: 89957-98-2)

## Composition de l'extrait standardisé

| Composant | Teneur | Rôle |
|---|---|---|
| Acide laurique, myristique, oléique | 85–95% | Inhibition 5α-réductase |
| β-sitostérol, campestérol, stigmastérol | 0,2–0,3% | Inhibition 5α-réductase, anti-androgénique |
| Polyphénols, flavonoïdes | traces | Antioxydant, anti-inflammatoire |

## Mécanisme d'action

### 1. Inhibition de la 5α-réductase (types I et II)
Les acides gras libres (notamment laurique et myristique) et les β-phytostérols inhibent compétitivement la 5α-réductase folliculaire, réduisant la conversion locale de testostérone en DHT. Contrairement au finastéride (inhibiteur de type II seulement), le saw palmetto inhibe les deux isoformes — spectre d'action plus large.

### 2. Antagonisme du récepteur aux androgènes
Le β-sitostérol réduit l'affinité de liaison de la DHT sur son récepteur nucléaire dans les cellules folliculaires — double mécanisme d'inhibition.

### 3. Inhibition de la liaison DHT-récepteur nucléaire
Des études in vitro montrent une réduction de la translocation nucléaire du complexe DHT-récepteur, diminuant l'expression des gènes cibles androgéniques dans la papille dermique.

### 4. Propriétés anti-inflammatoires
Inhibe les cyclo-oxygénases (COX-1, COX-2) et la 5-lipoxygénase, réduisant la production de prostaglandines et leucotriènes pro-inflammatoires périfolliculaires.

## Données cliniques

Étude randomisée contrôlée (Prager et al., 2002) : shampoing + lotion au saw palmetto vs placebo sur 21 semaines chez 26 hommes avec alopécie androgénétique légère à modérée — 60% des sujets traités présentent une amélioration vs 11% placebo. Données moins robustes que pour minoxidil ou finastéride.

## Concentration d'usage

- Extraits lipidiques standardisés (85% acides gras) : 2–5%
- Sérums et lotions sans rinçage : 1–3%
`,
  },
]

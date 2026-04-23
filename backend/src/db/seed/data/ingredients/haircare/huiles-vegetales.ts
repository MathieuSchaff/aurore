import { HAIRCARE_INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_HUILES_VEGETALES: IngredientInput[] = [
  {
    name: "Huile d'Argan (Argania Spinosa Kernel Oil)",
    slug: INGREDIENT_SLUGS.ARGAN_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Huile précieuse extraite des amandes de l'arganier marocain, riche en acide oléique et en vitamine E, reconnue pour son action réparatrice et anti-oxydante sur la fibre capillaire.",
    content: `
# Huile d'Argan (Argania Spinosa Kernel Oil)

L'huile d'argan est extraite par pression à froid des amandes du fruit de l'arganier (*Argania spinosa*), arbre endémique du Maroc. Longtemps réservée à l'usage alimentaire et cosmétique traditionnel berbère, elle est aujourd'hui l'une des huiles les plus utilisées en capillaire haut-de-gamme.

## INCI
**ARGANIA SPINOSA KERNEL OIL** (CAS: 223748-92-3)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide oléique (C18:1, Ω9) | 43–49% |
| Acide linoléique (C18:2, Ω6) | 29–36% |
| Acide palmitique (C16:0) | 11–15% |
| Acide stéarique (C18:0) | 4–7% |
| Acide palmitoléique (C16:1) | <1% |

**Insaponifiables remarquables** : tocophérols (vitamine E, ~620 mg/kg), squalène, stérols (schotténol, spinastérol), polyphénols (catéchines, vanillique).

## Mécanisme d'action capillaire

### 1. Pénétration corticale sélective
La proportion élevée en acide linoléique (polyinsaturé, chaîne C18) facilite la diffusion à travers les lipides cimentaires de la cuticule. L'huile atteint partiellement le cortex, contrairement aux huiles très saturées qui restent en surface.

### 2. Réparation des lipides cuticulaires
Les acides oléique et linoléique se substituent aux lipides 18-MEA (acide 18-méthyleicosanoïque) de la cuticule, endommagés par les traitements chimiques et la chaleur. Ce mécanisme réduit la porosité, améliore la brillance et facilite le démêlage.

### 3. Protection antioxydante
La vitamine E (tocophérols) neutralise les radicaux libres générés par les UV, la chaleur et la pollution. Protection contre le jaunissement des cheveux blonds et la dégradation des couleurs.

### 4. Effet occlusif léger
Film lipidique en surface qui réduit la perte en eau de la fibre sans sensation de lourdeur — profil sensoriel sec, non gras.

## Concentration d'usage

- Soins avant-shampoing (pre-poo) : 5–30% pur ou en mélange
- Masques et après-shampooings : 2–10%
- Leave-ins et sérums : 0,5–5%
- Huile de finition pure : application ciblée sur les pointes
`,
  },
  {
    name: 'Huile de Coco (Cocos Nucifera Oil)',
    slug: INGREDIENT_SLUGS.COCONUT_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Huile à dominante laurique unique capable de pénétrer profondément dans le cortex capillaire, réduisant la perte de protéines lors du lavage et renforçant la fibre de l'intérieur.",
    content: `
# Huile de Coco (Cocos Nucifera Oil)

L'huile de coco est extraite par pression à froid ou par procédé humide de la pulpe de la noix de coco (*Cocos nucifera*). C'est l'huile végétale la mieux étudiée scientifiquement pour la capillaire : des études publiées (Rele & Mohile, 2003 ; JACS) démontrent sa pénétration corticale unique parmi les huiles végétales.

## INCI
**COCOS NUCIFERA OIL** (CAS: 8001-31-8)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide laurique (C12:0) | 45–53% |
| Acide myristique (C14:0) | 16–21% |
| Acide palmitique (C16:0) | 7–11% |
| Acide caprique (C10:0) | 5–9% |
| Acide caprylique (C8:0) | 5–8% |
| Acide oléique (C18:1) | 5–8% |
| Acide stéarique (C18:0) | 2–4% |

La très haute teneur en acide laurique (chaîne courte C12, linéaire) est la clé de ses propriétés capillaires.

## Mécanisme d'action capillaire

### 1. Pénétration corticale démontrée
La structure linéaire et le faible poids moléculaire de l'acide laurique permettent une diffusion à travers la cuticule jusqu'au cortex. Études au radiomarquage (¹⁴C-laurate) confirment la présence dans le cortex après application et rinçage.

### 2. Réduction de la perte de protéines (PPT)
En pré-shampoing (30 min avant lavage) ou en post-rinçage : l'huile de coco réduit significativement la perte en protéines kératiniques lors du lavage (étude JACS 2003 : –46% vs contrôle, vs –32% pour la minérale, vs 0% pour le tournesol).

### 3. Réduction du gonflement hygrométrique
Limite l'absorption d'eau par les fibres kératiniques lors du lavage, réduisant la dilatation de la cuticule et les dommages mécaniques associés.

### 4. Propriétés antimicrobiennes
L'acide laurique est actif contre *Malassezia furfur* (levure impliquée dans les pellicules) et certaines bactéries — bénéfice indirect pour le cuir chevelu.

## Précautions d'usage

> ⚠️ Trop occlusif en occlusif seul sur cuir chevelu gras — préférer les pointes et longueurs. Peut alourdir les cheveux fins à forte concentration.

## Concentration d'usage

- Pre-poo pur : 100% (30 min à 1h avant shampoing)
- Masques et après-shampooings : 3–15%
- Leave-ins légers : 0,5–3%
`,
  },
  {
    name: 'Huile de Jojoba (Simmondsia Chinensis Seed Oil)',
    slug: INGREDIENT_SLUGS.JOJOBA_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Cire liquide biomimétique du sébum humain extraite des graines de jojoba, régulatrice du sébum, non comédogène et idéale pour équilibrer cuir chevelu gras et longueurs sèches.',
    content: `
# Huile de Jojoba (Simmondsia Chinensis Seed Oil)

Le jojoba (*Simmondsia chinensis*) est un arbuste du désert de Sonora. Contrairement aux autres "huiles" végétales (triglycérides), l'huile de jojoba est en réalité une **cire liquide** composée d'esters de cires à longue chaîne. Cette structure unique la rapproche du sébum humain.

## INCI
**SIMMONDSIA CHINENSIS SEED OIL** (CAS: 90045-98-0)

## Composition lipidique

La fraction dominante n'est pas des triglycérides mais des **esters de cires** (wax esters) :

| Composant | Proportion |
|---|---|
| Ester eicosényle gadolénate | ~70% |
| Ester docosényle érucate | ~14% |
| Autres esters de cire | ~10% |
| Acides gras libres (oléique, gadoléique, érucique) | ~5% |

**Acides gras libres** : acide gadoléique (C20:1, Ω9, ~71%), érucique (C22:1, Ω9, ~14%), oléique (C18:1, ~11%).

## Mécanisme d'action capillaire

### 1. Biomimétisme sébacé
La structure ester de cire est très proche du sébum humain (qui contient également des esters de cires). Cette affinité structurelle lui confère une excellente tolérance et une absorption rapide par le cuir chevelu et la fibre.

### 2. Régulation séborrhéique
En se substituant partiellement au sébum excédentaire, le jojoba envoie un signal de rétrocontrôle négatif aux sébocytes, réduisant la production sébacée — effet "régulateur" utilisé sur cuirs chevelus gras.

### 3. Non comédogène et non film
L'index comédogène est 0–2. Le film formé est non occlusif, breathable — applicable sur cuir chevelu sans risque de bouchage folliculaire.

### 4. Stabilité oxydative exceptionnelle
Pratiquement absence d'acides gras polyinsaturés → résistance au rancissement : durée de conservation >5 ans sans antioxydant ajouté.

## Concentration d'usage

- Cuir chevelu gras (application directe) : 5–20%
- Masques et après-shampooings : 2–8%
- Leave-ins et sérums : 1–5%
`,
  },
  {
    name: "Huile d'Olive (Olea Europaea Fruit Oil)",
    slug: INGREDIENT_SLUGS.OLIVE_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Huile méditerranéenne riche en acide oléique et en squalène, nourrissante en profondeur, elle améliore l'élasticité de la fibre et protège les cheveux secs ou colorés.",
    content: `
# Huile d'Olive (Olea Europaea Fruit Oil)

L'huile d'olive est obtenue par pression à froid des fruits de l'olivier (*Olea europaea*). Utilisée depuis l'Antiquité pour les soins corporels et capillaires, elle est l'une des huiles les mieux documentées en nutrition comme en cosmétique.

## INCI
**OLEA EUROPAEA FRUIT OIL** (CAS: 8001-25-0)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide oléique (C18:1, Ω9) | 55–83% |
| Acide palmitique (C16:0) | 7–20% |
| Acide linoléique (C18:2, Ω6) | 3–21% |
| Acide stéarique (C18:0) | 0,5–5% |
| Acide α-linolénique (C18:3, Ω3) | 0–1,5% |

**Insaponifiables** (~1–2%) : squalène (~0,5%), β-sitostérol, α-tocophérol, polyphénols (oleuropéine, hydroxytyrosol), chlorophylles.

## Mécanisme d'action capillaire

### 1. Pénétration et nutrition
L'acide oléique majoritaire (monoinsaturé, C18:1) pénètre la cuticule et nourrit le cortex. Moins pénétrant que le laurate de coco mais bien assimilé par la kératine.

### 2. Élasticité et souplesse
Le squalène et les phytostérols entrent dans les espaces intercellulaires de la cuticule, restituant de la flexibilité aux fibres desséchées ou fragilisées chimiquement.

### 3. Protection antioxydante
Les polyphénols (hydroxytyrosol, oleuropéine) et la vitamine E neutralisent les ROS générés par la chaleur, les UV et les traitements colorants.

### 4. Renforcement de la kératine
Des études suggèrent une interaction des phénols avec les ponts disulfure de la kératine, contribuant à la résistance mécanique.

## Précautions d'usage

> ⚠️ Profil assez lourd — peut alourdir les cheveux fins. Préférer sur longueurs et pointes. Rincer soigneusement en masque.

## Concentration d'usage

- Masques pré-shampoing : 10–50% pur
- Après-shampooings et masques rincés : 2–8%
- Leave-ins : 0,5–2% (cheveux épais/crépus)
`,
  },
  {
    name: "Huile d'Avocat (Persea Gratissima Oil)",
    slug: INGREDIENT_SLUGS.AVOCADO_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Huile dense extraite de la pulpe d'avocat, riche en acide oléique, vitamines A, D et E, et stérols végétaux — profondément nourrissante pour les cheveux très secs et les cuirs chevelus déshydratés.",
    content: `
# Huile d'Avocat (Persea Gratissima Oil)

L'huile d'avocat est extraite par pression à froid de la pulpe (chair) du fruit de l'avocatier (*Persea gratissima* / *Persea americana*). À ne pas confondre avec l'huile de noyau d'avocat. Sa haute densité nutritive en fait un soin de choix pour les cheveux très secs, épais ou texturés.

## INCI
**PERSEA GRATISSIMA OIL** (CAS: 8024-32-6)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide oléique (C18:1, Ω9) | 60–75% |
| Acide palmitique (C16:0) | 10–20% |
| Acide linoléique (C18:2, Ω6) | 6–15% |
| Acide palmitoléique (C16:1) | 2–8% |
| Acide α-linolénique (C18:3, Ω3) | 0,5–3% |
| Acide stéarique (C18:0) | 0,5–2% |

**Insaponifiables remarquables** (~4,7%) : stérols végétaux (β-sitostérol), α-tocophérol (vitamine E), caroténoïdes (bêta-carotène/provitamine A), vitamine D, lécithine, chlorophylles.

La fraction insaponifiable élevée (~4,7% vs ~1% pour l'olive) en fait une huile particulièrement riche en actifs non lipidiques.

## Mécanisme d'action capillaire

### 1. Nutrition profonde
La forte teneur en acide oléique et la fraction insaponifiable élevée permettent une pénétration corticale significative. Particulièrement adaptée aux cheveux poreux qui absorbent rapidement les corps gras.

### 2. Réparation des lipides cuticulaires
Les stérols végétaux et les glycolipides (lécithine) restaurent les lipides cimentaires de la cuticule, réduisant la porosité et les frisottis liés à l'humidité.

### 3. Apaisement du cuir chevelu
Les caroténoïdes et la vitamine E exercent une action anti-inflammatoire légère — soulagement des cuirs chevelus secs, squameux ou irrités.

### 4. Renforcement de la fibre
La lécithine (phosphatidylcholine) interagit avec les lipides membranaires des cellules cuticulaires, renforçant leur cohésion.

## Concentration d'usage

- Masques pré-shampoing : 10–100% pur
- Masques rincés et après-shampooings : 3–10%
- Leave-ins (cheveux très secs) : 1–5%
`,
  },
  {
    name: 'Huile de Ricin (Ricinus Communis Seed Oil)',
    slug: INGREDIENT_SLUGS.CASTOR_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Huile viscosifiante unique à très haute teneur en acide ricinoléique hydroxylé, forme un film occlusif dense sur la fibre capillaire, stimule la microcirculation du cuir chevelu et épaissit les formules.',
    content: `
# Huile de Ricin (Ricinus Communis Seed Oil)

L'huile de ricin est extraite par pression à froid ou par solvant des graines du ricin (*Ricinus communis*). Sa viscosité exceptionnellement élevée (poids moléculaire ~298 Da pour le ricinoléate, structure trihydroxylée) la distingue de toutes les autres huiles végétales.

## INCI
**RICINUS COMMUNIS SEED OIL** (CAS: 8001-79-4)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide ricinoléique (C18:1 OH, Ω9 hydroxylé) | 85–92% |
| Acide oléique (C18:1, Ω9) | 3–6% |
| Acide linoléique (C18:2, Ω6) | 3–5% |
| Acide palmitique (C16:0) | 1–2% |
| Acide stéarique (C18:0) | 1–2% |

L'acide ricinoléique est un acide gras hydroxylé unique dans le règne végétal : son groupe hydroxyle en C12 lui confère une viscosité et des propriétés filmogènes inégalées.

## Mécanisme d'action capillaire

### 1. Film occlusif dense
La viscosité de l'huile de ricin (450–1000 cP à 25°C, vs 60–80 cP pour l'huile d'argan) génère un film occlusif épais sur la cuticule, scellant l'humidité et réduisant la perte en eau transfibre.

### 2. Stimulation de la microcirculation
L'acide ricinoléique est un agoniste partiel des récepteurs EP3 aux prostaglandines. Cette interaction stimule la microcirculation du cuir chevelu, favorisant l'apport de nutriments aux follicules pileux — mécanisme souvent cité dans les protocoles de stimulation capillaire.

### 3. Humectance du scalp
Le groupe hydroxyle de l'acide ricinoléique est hygroscopique — retient l'eau atmosphérique sur le cuir chevelu et les fibres, contrairement aux huiles à profil occlusif pur.

### 4. Viscosifiant et épaississant en formule
En formulatoire, l'huile de ricin augmente la viscosité des phases huileuses, épaissit les masques et sérums sans gélifiants supplémentaires.

## Précautions d'usage

> ⚠️ Très occlusive — à éviter en grande quantité sur cuir chevelu gras ou sujets aux bouchages folliculaires. Diluer systématiquement (50% max dans un mélange huileux).

## Concentration d'usage

- Huile de massage scalp : 20–50% dans un mélange (ex. 50% ricin + 50% jojoba)
- Masques pré-shampoing : 5–20%
- Formules (leave-ins, sérums) : 1–5%
`,
  },
  {
    name: 'Huile de Chanvre (Cannabis Sativa Seed Oil)',
    slug: INGREDIENT_SLUGS.HEMP_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Huile de graine de chanvre à ratio Ω6/Ω3 optimal (3:1), riche en acide gamma-linolénique, anti-inflammatoire pour le cuir chevelu et régulatrice de la production sébacée.',
    content: `
# Huile de Chanvre (Cannabis Sativa Seed Oil)

L'huile de chanvre est extraite par pression à froid des graines de *Cannabis sativa*. Elle ne contient pas de THC ni de CBD (issus des fleurs et feuilles). Son profil en acides gras essentiels est l'un des plus équilibrés du règne végétal, avec un ratio Ω6/Ω3 de 3:1 considéré comme idéal pour les besoins cellulaires humains.

## INCI
**CANNABIS SATIVA SEED OIL** (CAS: 68956-68-3)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide linoléique (C18:2, Ω6) | 54–60% |
| Acide α-linolénique (C18:3, Ω3) | 17–23% |
| Acide oléique (C18:1, Ω9) | 9–12% |
| Acide gamma-linolénique (C18:3 GLA, Ω6) | 1–4% |
| Acide stéaridonique (C18:4, Ω3) | 0,5–2% |
| Acide palmitique (C16:0) | 5–7% |
| Acide stéarique (C18:0) | 2–4% |

La présence d'acide gamma-linolénique (GLA) et d'acide stéaridonique (SDA) est rare parmi les huiles végétales courantes.

## Mécanisme d'action capillaire

### 1. Nutrition et réparation des lipides cuticulaires
Le linoléate et l'α-linolénate pénètrent les espaces intercellulaires de la cuticule, restituant les lipides essentiels perdus par les traitements chimiques et thermiques.

### 2. Action anti-inflammatoire (GLA et Ω3)
L'acide gamma-linolénique est précurseur des prostaglandines E1 (PGE1) et des dihomo-γ-linolénates — médiateurs anti-inflammatoires. Réduit les inflammations légères du cuir chevelu (dermite séborrhéique, prurit, sensibilité).

### 3. Régulation séborrhéique
Le GLA module la production sébacée en inhibant la 5α-réductase cutanée, enzyme impliquée dans la conversion de la testostérone en DHT (driver sébum et alopécie androgénétique).

### 4. Renforcement de la barrière cutanée du scalp
Les polyinsaturés essentiels (LA, ALA) sont des constituants obligatoires des céramides de la couche cornée — leur apport externe soutient la barrière cutanée du cuir chevelu.

## Concentration d'usage

- Sérums scalp anti-inflammatoires : 5–20%
- Masques et après-shampooings : 2–8%
- Leave-ins : 1–4%
`,
  },
  {
    name: 'Huile de Tournesol (Helianthus Annuus Seed Oil)',
    slug: INGREDIENT_SLUGS.SUNFLOWER_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Huile légère à haute teneur en acide linoléique, vecteur d'actifs et emollient non occlusif, idéale comme huile de base en formulation capillaire pour son excellente biodisponibilité et sa légèreté sensorielle.",
    content: `
# Huile de Tournesol (Helianthus Annuus Seed Oil)

L'huile de tournesol est extraite par pression à froid des graines de tournesol (*Helianthus annuus*). Sa grande disponibilité, son prix accessible et son excellent profil sensoriel (légèreté, absorption rapide) en font l'une des huiles de base les plus utilisées en formulation cosmétique capillaire.

## INCI
**HELIANTHUS ANNUUS SEED OIL** (CAS: 8001-21-6)

## Composition lipidique

Il existe deux types principaux :

| Type | Linoléique (Ω6) | Oléique (Ω9) |
|---|---|---|
| Standard (high-linoleic) | 60–75% | 15–25% |
| Oléique (high-oleic, HO) | 10–20% | 75–85% |

En cosmétique capillaire, la variété **standard (high-linoleic)** est la plus utilisée pour ses propriétés réparatrices.

**Autres acides gras** : acide palmitique (C16:0, 5–8%), stéarique (C18:0, 2–5%), α-linolénique (C18:3, <1% dans standard).

**Insaponifiables** : α-tocophérol (vitamine E, ~600–800 mg/kg), phytostérols.

## Mécanisme d'action capillaire

### 1. Pénétration et réparation des lipides cuticulaires
Le linoléate (C18:2) est un précurseur des acéyl-céramides de la cuticule. Son apport externe restaure les lipides 18-MEA érodés par les shampoings et traitements chimiques.

### 2. Emollient léger non occlusif
Contrairement aux huiles saturées, le tournesol ne forme pas de film épais. Il s'étale uniformément et offre un toucher soyeux sans lourdeur — idéal pour les cheveux fins.

### 3. Vecteur d'actifs
Sa faible viscosité et son excellente spreading capacity en font un véhicule idéal pour diluer des actifs concentrés (huiles essentielles, vitamines liposolubles).

### 4. Protection antioxydante
La vitamine E protège les lipides de la fibre contre la peroxydation induite par les UV et la chaleur.

## Concentration d'usage

- Huile de base pour mélanges maison : 30–80%
- Formulations (masques, après-shampooings) : 3–15%
- Leave-ins légers : 1–5%
`,
  },
  {
    name: 'Huile de Macadamia (Macadamia Ternifolia Seed Oil)',
    slug: INGREDIENT_SLUGS.MACADAMIA_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Huile extraite des noix de macadamia, exceptionnellement riche en acide palmitoléique (Ω7) — acide gras rare biomimétique du sébum juvénile — qui nourrit et assouplit la fibre capillaire avec un profil sensoriel sec et soyeux.',
    content: `
# Huile de Macadamia (Macadamia Ternifolia Seed Oil)

L'huile de macadamia est extraite par pression à froid des noix de *Macadamia ternifolia* (ou *M. integrifolia*), arbre originaire d'Australie. Sa composition lipidique est unique : elle contient la proportion la plus élevée d'acide palmitoléique (C16:1, Ω7) de toutes les huiles végétales courantes.

## INCI
**MACADAMIA TERNIFOLIA SEED OIL** (CAS: 128497-20-1)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide oléique (C18:1, Ω9) | 55–65% |
| Acide palmitoléique (C16:1, Ω7) | 16–25% |
| Acide palmitique (C16:0) | 7–10% |
| Acide stéarique (C18:0) | 2–5% |
| Acide gadoléique (C20:1, Ω9) | 1–3% |
| Acide arachidonique (C20:0) | 2–5% |
| Acide linoléique (C18:2, Ω6) | 1–3% |

La teneur en acide palmitoléique (16–25%) est une caractéristique unique dans le règne végétal.

## Mécanisme d'action capillaire

### 1. Biomimétisme du sébum juvénile
L'acide palmitoléique est le principal acide gras du sébum humain chez les jeunes adultes. Sa proportion décroît avec l'âge. L'huile de macadamia reproduit cette composition, ce qui explique son excellente affinité avec la kératine et sa sensation d'absorption rapide.

### 2. Nutrition sans résidu
Le profil majoritairement monoinsaturé (Ω9 + Ω7) permet une pénétration partielle de la cuticule et un toucher sec post-application — pas de film lourd résiduel.

### 3. Lissage et brillance
Les monoinsaturés à longue chaîne s'organisent en films orientés à la surface de la cuticule, réduisant la rugosité et améliorant la réflexion lumineuse.

### 4. Stabilité oxydative
Teneur faible en polyinsaturés → résistance au rancissement supérieure aux huiles riches en Ω6 (lin, chanvre). DLC naturelle longue sans antioxydant ajouté.

## Concentration d'usage

- Masques pré-shampoing : 5–30%
- Après-shampooings et masques rincés : 2–8%
- Leave-ins et sérums : 1–5%
`,
  },
  {
    name: "Huile d'Amande Douce (Prunus Amygdalus Dulcis Oil)",
    slug: INGREDIENT_SLUGS.ALMOND_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Huile douce polyvalente extraite des amandes, riche en acide oléique et en vitamine E, adoucissante, émolliente et protectrice pour tous types de cheveux, particulièrement recommandée pour les cuirs chevelus sensibles.',
    content: `
# Huile d'Amande Douce (Prunus Amygdalus Dulcis Oil)

L'huile d'amande douce est extraite par pression à froid des amandes du prunier amandier doux (*Prunus amygdalus dulcis*). C'est l'une des huiles les plus douces et les mieux tolérées, utilisée depuis l'Antiquité dans les soins cosmétiques. Distinction importante : amande **douce** (comestible) vs amande amère (huile essentielle toxique).

## INCI
**PRUNUS AMYGDALUS DULCIS OIL** (CAS: 8007-69-0)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide oléique (C18:1, Ω9) | 62–72% |
| Acide linoléique (C18:2, Ω6) | 20–30% |
| Acide palmitique (C16:0) | 4–8% |
| Acide stéarique (C18:0) | 1–3% |
| Acide palmitoléique (C16:1) | <1% |
| Acide α-linolénique (C18:3, Ω3) | <1% |

**Insaponifiables** : α-tocophérol (vitamine E), phytostérols, squalène.

## Mécanisme d'action capillaire

### 1. Émollience et douceur
Le ratio équilibré oléique/linoléique confère une texture soyeuse et non grasse. Lisse la cuticule sans alourdir la fibre — convient aux cheveux fins à mi-épais.

### 2. Hydratation et nutrition légères
L'acide oléique pénètre partiellement la cuticule, apportant nutrition sans film occlusif marqué. L'acide linoléique restaure les lipides cuticulaires.

### 3. Apaisement du cuir chevelu
Phytostérols et tocophérols réduisent les inflammations légères. Profil de tolérance excellent, recommandé pour les cuirs chevelus secs, sensibles ou irrités.

### 4. Démêlant naturel
Le film huileux léger réduit les forces de friction lors du démêlage, limitant la casse mécanique.

## Concentration d'usage

- Masques pré-shampoing : 10–50% pur
- Après-shampooings et masques : 3–10%
- Leave-ins : 1–5%
- Usage quotidien sur pointes : pur, en petite quantité
`,
  },
  {
    name: 'Huile de Rose Musquée (Rosa Canina Fruit Oil)',
    slug: INGREDIENT_SLUGS.ROSEHIP_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Huile de gratte-cul exceptionnellement riche en acides linoléique et α-linolénique, réparatrice et régénérante pour cuir chevelu sec ou abîmé, avec une action antioxydante notable grâce aux caroténoïdes.',
    content: `
# Huile de Rose Musquée (Rosa Canina Fruit Oil)

L'huile de rose musquée (également nommée "rosier muscat" ou "rose hip") est extraite par pression à froid des graines des cynorrhodons (fruits) de *Rosa canina* ou *Rosa rubiginosa*. Elle est particulièrement utilisée en cosmétique réparatrice pour sa haute teneur en polyinsaturés essentiels et en caroténoïdes.

## INCI
**ROSA CANINA FRUIT OIL** (CAS: 83512-85-0)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide linoléique (C18:2, Ω6) | 44–52% |
| Acide α-linolénique (C18:3, Ω3) | 19–35% |
| Acide oléique (C18:1, Ω9) | 14–20% |
| Acide palmitique (C16:0) | 3–5% |
| Acide stéarique (C18:0) | 1–2% |

**Insaponifiables** : β-carotène (provitamine A), lycopène, tocophérols, phytostérols. Teneur en caroténoïdes parmi les plus élevées des huiles végétales (~3–5 mg/100g).

> ⚠️ Huile instable : forte teneur en polyinsaturés → oxydation rapide. Conservation au réfrigérateur, usage dans les 6 mois.

## Mécanisme d'action capillaire

### 1. Réparation des lipides cuticulaires endommagés
L'apport en LA et ALA reconstitue les lipides essentiels de la cuticule perdus par décoloration, permanente ou chaleur répétée.

### 2. Régénération cellulaire du cuir chevelu
Les caroténoïdes (provitamine A) stimulent le renouvellement des kératinocytes du cuir chevelu, aidant à normaliser les squames et à restaurer une barrière saine.

### 3. Action antioxydante puissante
La combinaison β-carotène + lycopène + tocophérols offre une protection multi-spectre contre les ROS UV-induits et les oxydations post-coloration.

### 4. Anti-inflammatoire
L'acide α-linolénique est précurseur des eicosanoïdes anti-inflammatoires de série 3 (EPA-like via désaturation). Réduit les inflammations folliculaires légères.

## Concentration d'usage

- Masques réparateurs : 3–15%
- Sérums scalp régénérants : 5–20%
- Leave-ins (cheveux colorés/abîmés) : 1–5%
`,
  },
  {
    name: 'Huile de Camélia (Camellia Sinensis Seed Oil)',
    slug: INGREDIENT_SLUGS.CAMELLIA_SINENSIS_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Huile japonaise extraite des graines du théier, à très haute teneur en acide oléique (80–90%), légère et non grasse, elle lisse la cuticule, apporte brillance et protège la fibre de la chaleur des outils coiffants.',
    content: `
# Huile de Camélia (Camellia Sinensis Seed Oil)

L'huile de camélia est extraite par pression à froid des graines du théier (*Camellia sinensis*), la même plante qui produit le thé vert, blanc et noir. Traditionnellement utilisée au Japon par les geishas pour l'entretien de leurs chevelures (tsubaki oil pour *C. japonica*), l'huile de *C. sinensis* est sa proche parente capillaire.

## INCI
**CAMELLIA SINENSIS SEED OIL** (CAS: 68916-73-4)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide oléique (C18:1, Ω9) | 78–90% |
| Acide palmitique (C16:0) | 7–11% |
| Acide linoléique (C18:2, Ω6) | 2–5% |
| Acide stéarique (C18:0) | 1–3% |
| Acide α-linolénique (C18:3, Ω3) | <1% |

Teneur en acide oléique parmi les plus élevées des huiles végétales (78–90%), équivalente à l'huile d'olive oléique.

**Insaponifiables** : squalène, phytostérols, catéchines (EGCG, ECG), tocophérols.

## Mécanisme d'action capillaire

### 1. Lissage et fermeture de la cuticule
L'acide oléique majoritaire adopte une configuration de film monomoléculaire très organisé à la surface de la cuticule. Effet lissant comparable à la silicone, mais d'origine naturelle — réduit les frisottis et les fourches d'aspect.

### 2. Protection thermique
Le film huileux formé interpose une couche protectrice entre la fibre et l'outil chauffant, ralentissant la diffusion de la chaleur dans le cortex. Utilisé en protection avant brushing/lissage (125–210°C).

### 3. Brillance exceptionnelle
Le squalène et les phytostérols contribuent à un film très réfléchissant, donnant une brillance intense sans effet plastifié.

### 4. Antioxydant (catéchines)
Les polyphénols du thé (EGCG) neutralisent les radicaux libres générés par la chaleur et les UV.

## Concentration d'usage

- Protection thermique : 5–30% dans un spray ou sérum
- Masques et après-shampooings : 2–8%
- Leave-ins et huiles de finition : 1–5% (cheveux lisses à ondulés)
`,
  },
  {
    name: 'Huile de Moringa (Moringa Oleifera Seed Oil)',
    slug: INGREDIENT_SLUGS.MORINGA_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Huile extraite des graines de l'arbre à vie africain, très stable oxydativement grâce au béhénate, elle nettoie le cuir chevelu des impuretés environnementales, conditionne la fibre et apporte légèreté et brillance.",
    content: `
# Huile de Moringa (Moringa Oleifera Seed Oil)

L'huile de moringa est extraite par pression à froid des graines de *Moringa oleifera*, arbre tropical originaire d'Inde et d'Afrique subsaharienne, surnommé "arbre à vie" pour ses multiples utilisations. Son profil unique en acide béhénique lui confère des propriétés adsorbantes et une stabilité oxydative exceptionnelle.

## INCI
**MORINGA OLEIFERA SEED OIL** (CAS: 8002-43-5)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide oléique (C18:1, Ω9) | 65–80% |
| Acide béhénique (C22:0) | 6–10% |
| Acide palmitique (C16:0) | 3–7% |
| Acide stéarique (C18:0) | 3–6% |
| Acide gadoléique (C20:1, Ω9) | 1–3% |
| Acide arachidonique (C20:0) | 2–5% |
| Acide linoléique (C18:2, Ω6) | 1–2% |

La présence d'acide béhénique (C22:0, saturé à longue chaîne) est caractéristique et rare parmi les huiles végétales.

## Mécanisme d'action capillaire

### 1. Adsorption des impuretés environnementales
L'acide béhénique (et ses dérivés) est connu pour sa capacité à adsorber les particules de pollution, métaux lourds et fumée de cigarette des surfaces kératiniques. Cette propriété est exploitée dans les soins "detox capillaire".

### 2. Conditionnement substantif
Le profil oléique confère un film soyeux et léger sur la cuticule, sans lourdeur. La chaine longue béhénique contribue à la substantivité et à la durée du dépôt.

### 3. Stabilité oxydative remarquable
La très faible teneur en polyinsaturés (<2% LA, traces ALA) et la présence d'acides saturés à longue chaîne donnent une durée de conservation naturelle exceptionnelle (>3 ans).

### 4. Rafraîchissement du cuir chevelu
Des études in vitro montrent que l'huile de moringa réduit le dépôt de sébum oxydé sur le cuir chevelu, contribuant à une sensation de propreté prolongée.

## Concentration d'usage

- Soins detox scalp : 5–20%
- Masques et après-shampooings : 2–8%
- Leave-ins et sérums : 1–5%
`,
  },
  {
    name: 'Huile de Noisette (Corylus Avellana Seed Oil)',
    slug: INGREDIENT_SLUGS.HAZELNUT_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Huile finement astringente extraite des noisettes, à dominante oléique et profil sec très léger, idéale pour les cuirs chevelus gras ou mixtes — pénètre sans résidu et régule légèrement la production sébacée.',
    content: `
# Huile de Noisette (Corylus Avellana Seed Oil)

L'huile de noisette est extraite par pression à froid des noisettes de *Corylus avellana*. Souvent décrite comme la plus "astringente" des huiles végétales, elle est réputée pour sa pénétration rapide et son profil sensoriel parfaitement sec — quasiment aucun résidu après absorption.

## INCI
**CORYLUS AVELLANA SEED OIL** (CAS: 84012-21-5)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide oléique (C18:1, Ω9) | 74–84% |
| Acide linoléique (C18:2, Ω6) | 8–15% |
| Acide palmitique (C16:0) | 4–7% |
| Acide stéarique (C18:0) | 1–3% |
| Acide palmitoléique (C16:1) | <1% |
| Acide α-linolénique (C18:3, Ω3) | <0,5% |

**Insaponifiables** : tocophérols, phytostérols (β-sitostérol, campestérol), squalène.

## Mécanisme d'action capillaire

### 1. Pénétration rapide et profil sec
Le profil oléique concentré et l'absence d'acides gras saturés à longue chaîne confèrent à l'huile de noisette une pénétration très rapide dans la cuticule — sensation "anhydre" après quelques minutes. Idéale pour cheveux fins qui refusent les huiles lourdes.

### 2. Légère astringence et régulation séborrhéique
Des composés tanniques (acide gallique, catéchines traces) exercent un léger effet astringent sur les pores folliculaires, contribuant à la régulation de l'excès de sébum.

### 3. Lissage de la cuticule
Film monomoléculaire oléique très lisse, réduisant la rugosité cuticulaire et les frisottis — effet brillance dans la continuité de l'olive et du camélia.

### 4. Tolérance universelle
Faible potentiel comédogène et allergisant (sauf allergie aux fruits à coque). Compatible cuirs chevelus gras, mixtes et normaux.

## Concentration d'usage

- Soins cuir chevelu gras : 10–30% dans un mélange
- Formulations légères (leave-ins, après-shampooings) : 2–8%
- Huile de finition légère : pur sur pointes
`,
  },
  {
    name: 'Huile de Nigelle (Nigella Sativa Seed Oil)',
    slug: INGREDIENT_SLUGS.BLACK_SEED_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Huile de cumin noir aux propriétés anti-inflammatoires et antifongiques élevées grâce à la thymoquinone, efficace contre les pellicules, le prurit et les inflammations du cuir chevelu.',
    content: `
# Huile de Nigelle (Nigella Sativa Seed Oil)

L'huile de nigelle est extraite par pression à froid des graines de *Nigella sativa* (cumin noir, kalonji). Utilisée depuis plus de 2000 ans dans la médecine traditionnelle islamique (*Habba Sawda*, « graine noire »), elle est aujourd'hui validée par de nombreuses études pharmacologiques pour ses propriétés anti-inflammatoires et antimicrobiennes.

## INCI
**NIGELLA SATIVA SEED OIL** (CAS: 8016-78-2)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide linoléique (C18:2, Ω6) | 50–60% |
| Acide oléique (C18:1, Ω9) | 20–25% |
| Acide palmitique (C16:0) | 11–14% |
| Acide eicosadiénoïque (C20:2) | 2–4% |
| Acide stéarique (C18:0) | 2–4% |
| Acide α-linolénique (C18:3, Ω3) | 0,5–1,5% |

**Composés actifs non lipidiques (huile essentielle, 0,4–2,5%)** :
- **Thymoquinone (TQ)** : 25–55% — principal actif anti-inflammatoire, antifongique, antioxydant
- Thymol, carvacrol, p-cymène, α-thujène

## Mécanisme d'action capillaire

### 1. Action antifongique (thymoquinone)
La thymoquinone inhibe la croissance de *Malassezia globosa* et *M. restricta* (levures impliquées dans les pellicules et la dermite séborrhéique) — mécanisme de perméabilisation membranaire.

### 2. Anti-inflammatoire du scalp
La TQ inhibe NF-κB et COX-2, réduisant les cytokines pro-inflammatoires (IL-6, TNF-α). Efficace sur les inflammations folliculaires légères et les cuirs chevelus prurigineux.

### 3. Stimulation folliculaire
Des études animales et humaines limitées (mais prometteuses) suggèrent un effet de la TQ sur la prolifération des kératinocytes folliculaires, potentiellement bénéfique dans les alopécies légères.

### 4. Réparation des lipides cuticulaires
L'acide linoléique majoritaire contribue à la restauration des lipides cuticulaires essentiels.

## Concentration d'usage

- Sérums scalp antifongiques/anti-pelliculaires : 5–20%
- Masques cuir chevelu : 3–10%
- Leave-ins : 1–3% (odeur caractéristique à doser avec précaution)
`,
  },
  {
    name: 'Huile de Carthame (Carthamus Tinctorius Seed Oil)',
    slug: INGREDIENT_SLUGS.SAFFLOWER_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Huile légère à très haute teneur en acide linoléique (Ω6), émolliente fine et non occlusive, réparatrice des lipides cuticulaires et idéale pour les cheveux secs déshydratés qui absorbent rapidement les corps gras.',
    content: `
# Huile de Carthame (Carthamus Tinctorius Seed Oil)

L'huile de carthame est extraite par pression à froid des graines de *Carthamus tinctorius* (safran des teinturiers, faux safran). Légère et d'absorption rapide, elle est très proche de l'huile de tournesol en termes d'usage capillaire, mais présente une teneur en linoléate encore plus élevée.

## INCI
**CARTHAMUS TINCTORIUS SEED OIL** (CAS: 8001-23-8)

## Composition lipidique

Il existe deux variétés :

| Type | Linoléique (Ω6) | Oléique (Ω9) |
|---|---|---|
| High-linoleic | 73–80% | 11–16% |
| High-oleic (HO) | 10–15% | 74–80% |

En capillaire, la variété **high-linoleic** est la plus utilisée.

**Autres acides gras** : acide palmitique (C16:0, 5–8%), stéarique (C18:0, 2–3%), α-linolénique (<1%).

**Insaponifiables** : α-tocophérol, phytostérols.

## Mécanisme d'action capillaire

### 1. Restauration des lipides cuticulaires essentiels
L'acide linoléique est le précurseur direct des céramides de surface (acéyl-céramides à linoléate) de la cuticule. Son apport externe est particulièrement efficace sur les cheveux décolorés ou permanentés, où ces lipides sont massivement dégradés.

### 2. Émollience légère et pénétration rapide
Viscosité très faible → spreading excellence. Convient aux cheveux fins qui refusent les huiles trop riches (jojoba, noisette sont de bons partenaires de mélange).

### 3. Protection de la couleur
En se substituant aux lipides de surface dégradés par le traitement colorant, le linoléate réduit la porosité post-coloration et donc la perte de pigments synthétiques en lavage.

### 4. Antioxydant (tocophérol)
La vitamine E protège contre la photodégradation des pigments capillaires et la peroxydation lipidique.

## Concentration d'usage

- Formulations légères (après-shampooings, leave-ins) : 3–10%
- Base huileuse pour mélanges : 30–60%
- Masques cheveux colorés : 5–15%
`,
  },
  {
    name: 'Huile de Ricin Hydrogénée (Hydrogenated Castor Oil)',
    slug: INGREDIENT_SLUGS.HYDROGENATED_CASTOR_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Dérivé solide de l'huile de ricin obtenu par hydrogénation catalytique, utilisé comme épaississant de phase huileuse, agent de structuration des baumes et émulsifiant co-formulaire dans les soins capillaires.",
    content: `
# Huile de Ricin Hydrogénée (Hydrogenated Castor Oil)

L'huile de ricin hydrogénée est obtenue par hydrogénation catalytique de l'huile de ricin (*Ricinus communis*). Cette réaction transforme les doubles liaisons de l'acide ricinoléique en liaisons simples, produisant un solide blanc cire à point de fusion ~86°C. Son rôle en capillaire est majoritairement formulatoire.

## INCI
**HYDROGENATED CASTOR OIL** (CAS: 8001-78-3)

## Composition après hydrogénation

L'hydrogénation de l'acide ricinoléique (C18:1 OH) produit principalement de l'**acide 12-hydroxystéarique** (C18:0 OH, ~85–90%), conservant le groupe hydroxyle caractéristique du ricin.

La structure résultante est une cire solide semi-cristalline à base d'ester de glycérol de 12-hydroxystéarate.

## Mécanisme d'action capillaire

### 1. Épaississant et structurant de phase huileuse
L'acide 12-hydroxystéarique cristallise en réseau tridimensionnel à température ambiante, gélifiant les phases huileuses sans solvant — utilisé pour formuler des baumes, des pomades et des masques épais à texture riche.

### 2. Émulsifiant co-formulaire
Le groupe hydroxyle résiduel (polaire) confère une légère HLB, permettant une émulsification partielle des phases eau/huile. Souvent utilisé avec des tensioactifs classiques pour stabiliser les émulsions capillaires riches.

### 3. Agent de brillance
Le film cristallin appliqué sur la fibre donne une brillance "cire" typique des pomades et des produits de coiffage structurants.

### 4. Conditionnement occlusif
Forme un film protecteur dense sur la cuticule, limitant l'évaporation de l'eau de la fibre. Effet occlusif supérieur à l'huile de ricin liquide.

## Précautions d'usage

> ⚠️ Non recommandé pour les soins rinçables en grande quantité (formation de résidu difficile à éliminer). Usage privilégié dans les produits sans rinçage et les produits de coiffage.

## Concentration d'usage

- Baumes et pomades de coiffage : 5–20%
- Masques sans rinçage riches : 1–5%
- Co-épaississant en phase huileuse : 1–3%
`,
  },
  {
    name: 'Huile de Baobab (Adansonia Digitata Seed Oil)',
    slug: INGREDIENT_SLUGS.BAOBAB_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Huile africaine extraite des graines du baobab, équilibrée en acides gras essentiels (Ω6, Ω9, Ω3), profondément nourrissante et réparatrice pour les cheveux secs, texturés ou chimiquement traités.',
    content: `
# Huile de Baobab (Adansonia Digitata Seed Oil)

L'huile de baobab est extraite par pression à froid des graines du baobab africain (*Adansonia digitata*). Utilisée depuis des millénaires par les populations d'Afrique subsaharienne pour les soins corporels et capillaires, elle se distingue par un profil tripartite équilibré en Ω6, Ω9 et Ω3.

## INCI
**ADANSONIA DIGITATA SEED OIL** (CAS: 90063-83-5)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide linoléique (C18:2, Ω6) | 33–40% |
| Acide oléique (C18:1, Ω9) | 33–40% |
| Acide α-linolénique (C18:3, Ω3) | 3–7% |
| Acide palmitique (C16:0) | 17–25% |
| Acide stéarique (C18:0) | 4–8% |

Rare équilibre : part quasi-équivalente de Ω6 et Ω9, avec présence d'Ω3 — profil tripartite unique.

**Insaponifiables** : α-tocophérol, phytostérols, β-carotène, vitamine D.

## Mécanisme d'action capillaire

### 1. Nutrition multi-niveaux
La combinaison oléique/linoléique offre une nutrition double : le linoléate restaure les lipides cuticulaires essentiels (pénétration), l'oléate nourrit le cortex et forme le film de surface (protection).

### 2. Réparation des lipides cuticulaires
L'acide linoléique, précurseur des acéyl-céramides, est particulièrement efficace sur les cheveux à porosité élevée (décolorés, permanentés) pour refermer les écailles et réduire les frisottis.

### 3. Action anti-inflammatoire (Ω3)
L'acide α-linolénique apporte un bénéfice anti-inflammatoire pour le cuir chevelu sec et irrité.

### 4. Texture polyvalente
Viscosité intermédiaire (entre jojoba léger et olive lourd), adapté à un usage sur tous types de cheveux épais à normaux — glisse facilement en masque pré-shampoing.

## Concentration d'usage

- Masques pré-shampoing (cheveux secs/texturés) : 10–50% pur
- Après-shampooings et masques rincés : 3–10%
- Leave-ins et sérums : 2–6%
`,
  },
  {
    name: "Huile d'Abyssinie (Crambe Abyssinica Seed Oil)",
    slug: INGREDIENT_SLUGS.CRAMBE_ABYSSINICA_OIL,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Huile éthiopienne à teneur record en acide érucique (55–65%), formant un film ultra-léger et lissant sur la cuticule capillaire, utilisée comme alternative naturelle aux silicones pour la brillance et la protection thermique.',
    content: `
# Huile d'Abyssinie (Crambe Abyssinica Seed Oil)

L'huile de crambe est extraite par pression à froid des graines de *Crambe abyssinica*, plante annuelle originaire d'Éthiopie, cultivée aujourd'hui en Europe et en Amérique du Nord pour l'industrie cosmétique. Sa composition lipidique est parmi les plus originales du règne végétal.

## INCI
**CRAMBE ABYSSINICA SEED OIL** (CAS: 128497-20-1)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide érucique (C22:1, Ω9) | 55–65% |
| Acide gadoléique (C20:1, Ω9) | 14–20% |
| Acide linoléique (C18:2, Ω6) | 8–12% |
| Acide oléique (C18:1, Ω9) | 2–4% |
| Acide linolénique (C18:3, Ω3) | 4–7% |
| Acide nervonique (C24:1, Ω9) | 1–3% |

La teneur en acide érucique (C22:1) dépasse 55% — record absolu parmi les huiles végétales courantes (vs ~40% pour le colza non sélectionné). L'acide érucique à très longue chaîne est le responsable direct du profil sensoriel exceptionnel.

## Mécanisme d'action capillaire

### 1. Film ultra-léger biomimétique des silicones
L'acide érucique (C22:1) et l'acide gadoléique (C20:1) forment, à la surface de la cuticule, des films monomoléculaires ultra-fins grâce à leur chaîne très longue. Ce film :
- Lisse les écailles cuticulaires
- Réduit la friction inter-fibres et le frizz
- Apporte une brillance intense
- Sans le résidu lourd des silicones cycliques ou linéaires

### 2. Protection thermique naturelle
Le film de cire à longue chaîne protège la cuticule lors des opérations de lissage et brushing (jusqu'à ~180°C) en formant une barrière thermique fine.

### 3. Légèreté sensorielle incomparable
Indice de réfraction et viscosité faibles → spreading immédiat, absorption quasi-instantanée, sans effet gras résiduel. Toléré même sur les cheveux fins.

### 4. Stabilité oxydative
Malgré la double liaison, les chaînes très longues limitent l'oxydabilité — meilleure stabilité que l'huile de lin ou de chanvre comparée en teneur en insaturations.

## Concentration d'usage

- Sérums capillaires anti-frizz : 10–30%
- Huiles de finition légères : 20–60% dans un mélange
- Sprays protection thermique : 1–10%
- Masques et leave-ins brillance : 1–5%
`,
  },
]

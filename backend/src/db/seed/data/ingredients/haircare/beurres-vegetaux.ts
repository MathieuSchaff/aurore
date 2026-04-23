import { HAIRCARE_INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_BEURRES_VEGETAUX: IngredientInput[] = [
  {
    name: 'Beurre de Karité (Butyrospermum Parkii Butter)',
    slug: INGREDIENT_SLUGS.SHEA_BUTTER_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Beurre végétal africain à fraction insaponifiable exceptionnellement élevée (~8–12%), profondément occlusif et anti-inflammatoire, indispensable dans les soins des cheveux secs, crépus ou bouclés.',
    content: `
# Beurre de Karité (Butyrospermum Parkii Butter)

Le beurre de karité est extrait par extraction aqueuse ou pression des graines de *Vitellaria paradoxa* (syn. *Butyrospermum parkii*), arbre des savanes africaines. Il existe sous deux formes : brut (non raffiné, couleur ivoire à jaune, odeur fumée) et raffiné (blanc, neutre). La forme brute conserve davantage les insaponifiables actifs.

## INCI
**BUTYROSPERMUM PARKII BUTTER** (CAS: 194043-92-0)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide oléique (C18:1, Ω9) | 40–55% |
| Acide stéarique (C18:0) | 35–48% |
| Acide linoléique (C18:2, Ω6) | 3–8% |
| Acide palmitique (C16:0) | 3–7% |
| Acide α-linolénique (C18:3, Ω3) | 0–1% |

**Fraction insaponifiable (8–12%)** — parmi les plus élevées des beurres végétaux :
- **Triterpènes** : α-amyrine, β-amyrine, lupéol, butyrospermol — anti-inflammatoires, cicatrisants
- **Stérols** : α-spinastérol, parkéol, Δ7-avenastérol
- Tocophérols (vitamine E), phénols, vitamine D

## Mécanisme d'action capillaire

### 1. Occlusion et rétention hydrique
L'acide stéarique élevé (35–48%) forme un film occlusif dense et durable sur la cuticule, scellant l'humidité dans la fibre. Cette propriété est essentielle pour les cheveux crépus et très bouclés dont la cuticule naturellement soulevée perd l'eau rapidement.

### 2. Anti-inflammatoire du cuir chevelu
Les triterpènes (lupéol, α/β-amyrine) inhibent NF-κB, COX-2 et la synthèse des leucotriènes — action comparable à des AINS légers. Soulagement des cuirs chevelus irrités, sensibles ou sujets à l'eczéma séborrhéique.

### 3. Réparation des lipides cuticulaires
L'acide oléique majoritaire complète le profil de réparation en pénétrant partiellement la cuticule, reconstituant les lipides intercellulaires.

### 4. Protection thermique et mécanique
Film occlusif thermostable, souvent utilisé dans les soins LOC/LCO (Liquid-Oil-Cream) et comme couche de scellement avant styling des cheveux texturés.

## Concentration d'usage

- Soins pré-shampoing (pre-poo) : pur ou 50–100% dans un mélange
- Masques capillaires riches : 5–20%
- Leave-ins crèmes (cheveux crépus/bouclés) : 3–15%
- Beurres de coiffage : 10–40%
`,
  },
  {
    name: 'Beurre de Cacao (Theobroma Cacao Seed Butter)',
    slug: INGREDIENT_SLUGS.CACAO_BUTTER_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Beurre solide extrait des fèves de cacao, riche en acides stéarique et palmitique, hautement occlusif avec une texture fondante au contact de la chaleur corporelle, il protège la fibre capillaire de la déshydratation et du casse.',
    content: `
# Beurre de Cacao (Theobroma Cacao Seed Butter)

Le beurre de cacao est extrait par pression à froid ou à chaud des fèves de *Theobroma cacao* après fermentation et torréfaction. Sa particularité est sa structure cristalline polymorphe (6 formes cristallines, forme V la plus stable) qui lui confère un point de fusion étroit (~32–35°C) — fond exactement à la température du corps humain.

## INCI
**THEOBROMA CACAO SEED BUTTER** (CAS: 8002-31-1)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide stéarique (C18:0) | 31–37% |
| Acide oléique (C18:1, Ω9) | 31–37% |
| Acide palmitique (C16:0) | 25–30% |
| Acide linoléique (C18:2, Ω6) | 2–4% |
| Acide arachidonique (C20:0) | 1–2% |
| Acide palmitique (C16:0) triglycérides POS/SOS | dominant |

La structure triglycéridique symétrique POS (palmitoyl-oléoyl-stéaroyl) et SOS (stéaroyl-oléoyl-stéaroyl) est caractéristique et responsable du comportement cristallin.

**Insaponifiables** : tocophérols, phytostérols, polyphénols (catéchines, procyanidines — davantage dans la poudre de cacao brute), théobromine.

## Mécanisme d'action capillaire

### 1. Occlusion à la chaleur corporelle
La fusion à 32–35°C permet une application solide qui fond progressivement sous l'effet de la chaleur des mains, formant un film occlusif très dense. Ce film scelle efficacement l'humidité dans la fibre.

### 2. Plastifiant de la fibre
Les acides stéarique et palmitique (saturés à longue chaîne) s'intercalent entre les macrofibrilles du cortex, réduisant la rigidité et améliorant l'élasticité — résistance au casse lors du démêlage.

### 3. Protection mécanique
Film solide résistant à la traction et à la friction — utilisé dans les masques de protection pré-traitement chimique et les pomades de coiffage structurant.

### 4. Apaisement du cuir chevelu (polyphénols)
Les procyanidines et catéchines de la fraction insaponifiable exercent une légère action antioxydante et anti-inflammatoire.

## Précautions d'usage

> ⚠️ Texture très occlusive et grasse — peut alourdir les cheveux fins. Utiliser en petite quantité ou limiter aux pointes et longueurs. Nécessite un shampoing soigneux pour le rinçage.

## Concentration d'usage

- Masques pré-shampoing (cheveux très secs) : 5–20%
- Baumes et pomades de coiffage : 10–30%
- Leave-ins crèmes (cheveux épais/crépus) : 2–8%
`,
  },
  {
    name: 'Beurre de Mangue (Mangifera Indica Seed Butter)',
    slug: INGREDIENT_SLUGS.MANGO_BUTTER_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Beurre léger et non comédogène extrait des graines de mangue, profil lipidique proche du beurre de cacao mais texture plus douce et moins occlusive, idéal pour adoucir et protéger sans alourdir les cheveux.',
    content: `
# Beurre de Mangue (Mangifera Indica Seed Butter)

Le beurre de mangue est extrait par pression à froid des graines (amandes du noyau) du manguier (*Mangifera indica*). Sa texture est intermédiaire entre le beurre de karité (point de fusion ~38°C) et le beurre de cacao (~35°C) — point de fusion ~34–38°C. Moins connu que le karité mais apprécié pour sa légèreté relative et son profil doux.

## INCI
**MANGIFERA INDICA SEED BUTTER** (CAS: 90063-86-8)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide stéarique (C18:0) | 38–48% |
| Acide oléique (C18:1, Ω9) | 38–46% |
| Acide palmitique (C16:0) | 4–8% |
| Acide linoléique (C18:2, Ω6) | 2–6% |
| Acide arachidonique (C20:0) | 1–3% |

Structure triglycéridique similaire au beurre de cacao (SOS/POS dominants) mais avec une teneur en stéarate encore plus élevée → point de fusion légèrement supérieur et texture plus stable à la chaleur.

**Insaponifiables** : tocophérols, polyphénols (mangiférine), phytostérols, terpènes.

## Mécanisme d'action capillaire

### 1. Occlusion modérée sans lourdeur
Malgré une teneur en stéarate élevée (40–48%), le beurre de mangue est réputé moins lourd sensoriel que le cacao. Son film occlusif est dense mais s'étale plus facilement, limitant l'effet "poix".

### 2. Adoucissement et lissage de la cuticule
L'acide oléique et les phytostérols lissent les écailles cuticulaires soulevées, réduisant les frisottis et améliorant le glissement entre fibres lors du démêlage.

### 3. Action antioxydante (mangiférine)
La mangiférine (xanthone C-glucoside spécifique à *Mangifera*) est un antioxydant puissant qui protège les protéines kératiniques et les lipides cuticulaires de la peroxydation.

### 4. Apaisement du cuir chevelu
Les polyphénols et triterpènes exercent une légère action anti-inflammatoire et adoucissante sur les cuirs chevelus secs et sensibles.

## Concentration d'usage

- Masques capillaires riches : 5–15%
- Leave-ins crèmes et butters capillaires : 5–20%
- Baumes de coiffage structurant léger : 10–25%
`,
  },
  {
    name: 'Beurre de Sal (Shorea Robusta Seed Butter)',
    slug: INGREDIENT_SLUGS.SAL_BUTTER_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Beurre asiatique rare issu des graines de l'arbre sal indien, à très haute teneur en acide stéarique, utilisé comme alternative au beurre de cacao pour ses propriétés structurantes et occlusives dans les soins capillaires riches.",
    content: `
# Beurre de Sal (Shorea Robusta Seed Butter)

Le beurre de sal est extrait par pression à froid ou par solvant des graines de *Shorea robusta*, grand arbre forestier d'Asie du Sud et du Sud-Est (Inde, Népal, Bangladesh). Traditionnellement utilisé en Ayurveda comme corps gras alimentaire et médicinal, il est de plus en plus intégré en cosmétique capillaire comme équivalent végétal au beurre de cacao.

## INCI
**SHOREA ROBUSTA SEED BUTTER** (CAS: 91078-95-4)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide stéarique (C18:0) | 40–56% |
| Acide oléique (C18:1, Ω9) | 34–44% |
| Acide palmitique (C16:0) | 4–8% |
| Acide linoléique (C18:2, Ω6) | 1–4% |
| Acide arachidonique (C20:0) | 1–3% |

Teneur en acide stéarique parmi les plus élevées des beurres végétaux (40–56%), dépassant parfois le beurre de cacao.

**Structure triglycéridique** : dominée par SOS (stéaroyl-oléoyl-stéaroyl) — profil cristallin similaire au beurre de cacao, point de fusion 30–38°C.

**Insaponifiables** : α-tocophérol, phytostérols.

## Mécanisme d'action capillaire

### 1. Occlusion renforcée
La teneur stéarique très élevée génère un film occlusif encore plus dense que le karité ou le cacao. Idéal pour sceller les traitements profonds dans les protocoles LOC/LCO.

### 2. Structurant de formule
Le beurre de sal est utilisé en formulatoire pour durcir et structurer les phases grasses des baumes, masques épais et pomades — similaire à l'action du beurre de cacao.

### 3. Réparation des lipides de surface
L'acide oléique associé forme un film réparateur sur la cuticule, combinant occlusion (stéarate) et nutrition (oléate).

### 4. Texture fondante au contact
Point de fusion 30–38°C → fond légèrement sous les doigts pour une application facile, tout en restant solide à température ambiante.

## Précautions d'usage

> ⚠️ Très occlusif — mêmes précautions que le beurre de cacao. Déconseillé en grande quantité sur cuirs chevelus gras. À diluer dans un mélange ou à utiliser sur longueurs et pointes.

## Concentration d'usage

- Masques capillaires riches pré-shampoing : 5–20%
- Pomades et baumes de coiffage : 10–30%
- Leave-ins butters (cheveux crépus) : 5–15%
`,
  },
  {
    name: 'Beurre de Madhuca (Madhuca Longifolia Seed Butter)',
    slug: INGREDIENT_SLUGS.MADHUCA_LONGIFOLIA_BUTTER,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Beurre ayurvédique issu des graines du mahua indien, riche en acide oléique et en fraction insaponifiable active, traditionnellement utilisé pour nourrir le cuir chevelu, stimuler la pousse et traiter les affections cutanées.',
    content: `
# Beurre de Madhuca (Madhuca Longifolia Seed Butter)

Le beurre de madhuca (ou beurre de mahua) est extrait par pression à froid des graines de *Madhuca longifolia* (syn. *Bassia latifolia*), arbre sacré de l'Inde centrale et méridionale. Profondément ancré dans la tradition ayurvédique, il est utilisé depuis des siècles pour les soins capillaires, la cuisine et la fabrication artisanale.

## INCI
**MADHUCA LONGIFOLIA SEED BUTTER** (CAS: 91771-32-7)

## Composition lipidique

| Acide gras | Proportion |
|---|---|
| Acide oléique (C18:1, Ω9) | 35–48% |
| Acide stéarique (C18:0) | 20–30% |
| Acide palmitique (C16:0) | 17–25% |
| Acide linoléique (C18:2, Ω6) | 8–14% |
| Acide arachidonique (C20:0) | 2–5% |

Profil plus équilibré que les beurres stéarate-dominants (cacao, sal) : teneur en oléique élevée et part de linoléique non négligeable (~10%).

**Fraction insaponifiable (3–5%)** :
- Saponines stéroïdiques (bassiasides) — actives anti-inflammatoires
- Triterpènes (α-amyrine, β-amyrine, lupéol)
- Phytostérols (β-sitostérol, stigmastérol)
- Tocophérols

## Mécanisme d'action capillaire

### 1. Nutrition profonde du cuir chevelu
L'acide oléique majoritaire pénètre les lipides folliculaires et nourrit le derme papillaire. Utilisé traditionnellement en massage scalp pour favoriser la circulation et nourrir les follicules pileux.

### 2. Anti-inflammatoire et antipruritic
Les saponines stéroïdiques (bassiasides) et les triterpènes inhibent les médiateurs inflammatoires — soulagement des cuirs chevelus secs, squameux ou sujets à l'eczéma.

### 3. Réparation et occlusion modérée
Le profil stéarate/palmitate (45–55% de saturés totaux) assure une occlusion protectrice sans la lourdeur extrême des beurres à très haute teneur stéarique.

### 4. Stimulation capillaire traditionnelle
En médecine ayurvédique, le mahua est prescrit pour renforcer les cheveux et stimuler leur croissance — effet attribué à l'amélioration de la microcirculation du scalp par les saponines.

## Concentration d'usage

- Masques ayurvédiques et pré-shampoing : 10–40% pur
- Formulations leave-ins et crèmes capillaires : 3–15%
- Baumes de massage scalp : 10–30%
`,
  },
]

import { HAIRCARE_INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_HUILES_MINERALES: IngredientInput[] = [
  {
    name: 'Huile de Paraffine (Paraffinum Liquidum)',
    slug: INGREDIENT_SLUGS.PARAFFINUM_LIQUIDUM_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Huile minérale pétrolière légère, occlusif efficace qui scelle le film hydrique de la fibre capillaire et réduit la friction pour le démêlage — incontournable des formules afro et curl.',
    content: `
# Huile de Paraffine (Paraffinum Liquidum)

La paraffine liquide (huile minérale légère) est un mélange d'alcanes saturés à chaînes moyennes (C15–C40) obtenu par distillation et raffinage du pétrole. Inerte chimiquement, non allergène, elle est utilisée depuis le XIXe siècle en cosmétique pour ses propriétés occlusives et lubrifiantes.

## INCI
**PARAFFINUM LIQUIDUM** (CAS: 8012-95-1 | COSING: 55305)

## Mécanisme d'action

### 1. Occlusion et scellement de l'eau
Les alcanes de la paraffine liquide sont imperméables à la vapeur d'eau. Un film de paraffine sur la cuticule capillaire réduit la perte en eau transépidermique (TEWL) — maintien de l'hydratation interne de la fibre, particulièrement bénéfique pour les cheveux poreux et crépus.

### 2. Lubrification de la cuticule
Les chaînes alkyle s'intercalent entre les écailles cuticulaires et forment un film lubrifiant qui réduit la friction inter-capillaire. Facilite considérablement le démêlage des cheveux épais, bouclés ou crépus.

### 3. Prévention de la casse mécanique
En réduisant les forces de friction lors du coiffage (peigne, brosse), la paraffine limite les dommages mécaniques — réduction de la casse et des pointes fourchues.

### 4. Remplissage des zones poreuses
Sur les cheveux chimiquement traités ou très poreux, les molécules d'alcane comblent partiellement les "trous" de la cuticule endommagée, restaurant temporairement un aspect lissé.

## Grades cosmétiques

| Grade | Viscosité | Usage |
|---|---|---|
| Paraffinum Liquidum (léger) | 40–70 cP | Huiles, sérums, sprays |
| Paraffinum Liquidum (lourd) | 90–200 cP | Masques, graisses capillaires |

## Considérations

- **Occlusif "lourd"** : peut créer de l'accumulation sur cheveux fins (nécessite shampoing pour enlever)
- **Non biodégradable** : d'origine pétrolière, profil environnemental discuté
- **Parfaitement sûr** : raffiné cosmétique conforme USP/Ph.Eur., aucun risque cancérogène

## Concentration d'usage

- Huiles pré-shampoing et graisses capillaires : 10–80%
- Sérums et sprays : 1–10%
`,
  },
  {
    name: 'Vaseline (Petrolatum)',
    slug: INGREDIENT_SLUGS.PETROLATUM_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Mélange semi-solide d'hydrocarbures pétroliers, occlusif ultime pour sceller l'humidité des pointes et des longueurs, base de nombreuses graisses capillaires afro et produits de styling.",
    content: `
# Vaseline (Petrolatum)

La vaseline (petrolatum blanc ou jaune) est un mélange semi-solide d'hydrocarbures à longues chaînes (alcanes C18–C90) obtenu par distillation sous vide et raffinage du pétrole brut. C'est l'occlusif le plus puissant connu en cosmétique — son coefficient de diffusion à la vapeur d'eau est quasi-nul.

## INCI
**PETROLATUM** (CAS: 8009-03-8 | COSING: 75566)

## Mécanisme d'action

### 1. Occlusion totale
La vaseline forme un film imperméable continu sur la surface de la fibre capillaire. Sa viscosité semi-solide lui permet d'adhérer à la cuticule sans s'écouler, maintenant une occlusivité durable même en conditions humides (douche, pluie).

### 2. Scellement des pointes abîmées
Pénètre dans les microcraquelures et espaces intercuticulaires des pointes fourchues, les "scellant" mécaniquement. Empêche la propagation des fissures le long de la fibre.

### 3. Rétention hydrique maximale
Bloque quasi-totalement la perte en eau transépidermique de la fibre — indispensable pour les techniques de rétention hydrique (LOC Method : Liquid → Oil → Cream) populaires dans le soin des cheveux afro.

### 4. Protection des pointes et des longueurs
Crée une barrière physique contre les agressions extérieures : UV, pollution, friction mécanique, eau chlorée — prolonge l'intégrité de la fibre entre les coupes.

## Grades cosmétiques

- **Petrolatum blanc (raffiné)** : USP/Ph.Eur., incolore, inodore — usage cosmétique premium
- **Petrolatum jaune** : légèrement coloré, usage industriel cosmétique courant

## Accumulation et retrait

La vaseline nécessite un shampoing tensioacif (pas co-wash) pour être retirée — son imperméabilité à l'eau la rend résistante au simple rinçage. Usage excessif = accumulation sur cuir chevelu (bouche les follicules).

> ⚠️ Appliquer sur les longueurs et pointes uniquement, jamais en grande quantité sur le cuir chevelu.

## Concentration d'usage

- Graisses et pomades capillaires : 10–60%
- Soins des pointes : 5–30%
`,
  },
  {
    name: 'Huile Minérale (Mineral Oil)',
    slug: INGREDIENT_SLUGS.MINERAL_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Mélange d'hydrocarbures pétroliers liquides de viscosité variable, émollient et occlusif de grande pureté utilisé comme phase huileuse dans les émulsions capillaires et les produits de glissant.",
    content: `
# Huile Minérale (Mineral Oil)

L'huile minérale cosmétique est un terme générique désignant des mélanges d'hydrocarbures liquides saturés d'origine pétrolière (paraffines, isoparaffines, cycloparaffines), distincts de la paraffine liquide par leur viscosité et leur gamme de poids moléculaires. Elle peut désigner des grades légers (proche de la paraffine liquide) à des grades lourds (proche du pétrolatum).

## INCI
**MINERAL OIL** (CAS: 8012-95-1 / 8020-83-5)

## Distinction avec les autres hydrocarbures

| Ingrédient | Viscosité | Consistance | HLB approximatif |
|---|---|---|---|
| Paraffinum Liquidum (léger) | 15–40 cP | Liquide fluide | — |
| Mineral Oil | 20–300 cP | Liquide léger à huileux | — |
| Petrolatum | Semi-solide | Vaseline | — |
| Cera Microcristallina | Solide | Cire | — |

## Mécanisme d'action

### 1. Émollience et lissage de la cuticule
Les hydrocarbures de l'huile minérale s'intercalent entre les écailles de la cuticule et comblent les irrégularités de surface, lissant optiquement la fibre et lui conférant brillance et toucher doux.

### 2. Occlusion modérée
Forme un film semi-occlusif sur la fibre, réduisant la perte en eau sans créer l'effet imperméable total de la vaseline. Balance entre rétention hydrique et respirabilité.

### 3. Vecteur d'actifs lipophiles
Phase huileuse de référence pour les formulations riches en actifs liposolubles (vitamine E, rétinol, provitamines, acides gras essentiels) — excellente stabilité oxydative (saturée).

### 4. Lubrification de la mèche
Lubrifie chaque fibre individuellement, facilitant le glissement et réduisant les nœuds dans les cheveux bouclés et crépus.

## Pureté et grades

Grades cosmétiques régis par USP (US Pharmacopeia), Ph.Eur. (Pharmacopée Européenne) et FDA 21 CFR. Les grades non raffinés (types 3) contenant des hydrocarbures aromatiques polycycliques (HAP) sont classés carcinogènes 1B (IARC) — seuls les grades hautement raffinés (types 1) sont autorisés en cosmétique.

## Concentration d'usage

- Émulsions après-shampooings et masques : 1–15%
- Produits de glissant (slip products) : 5–30%
`,
  },
  {
    name: 'Céresine (Ceresin)',
    slug: INGREDIENT_SLUGS.CERESIN_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      "Cire minérale raffinée issue de l'ozokérite ou du pétrole, structurante et gélifiante des phases huileuses dans les pomades, graisses de coiffage et cires capillaires.",
    content: `
# Céresine (Ceresin)

La céresine est une cire minérale obtenue par raffinage et purification de l'ozokérite naturelle (cire fossile) ou par synthèse pétrolière. Point de fusion plus élevé que la paraffine cristalline (61–78°C), elle structure les phases huileuses dans les formules semi-solides capillaires.

## INCI
**CERESIN** (CAS: 8001-75-0)

## Mécanisme d'action

### 1. Structuration des phases huileuses
À température ambiante, la céresine cristallise dans la phase huileuse, formant un réseau de microcristaux qui gèle les huiles liquides en un gel semi-solide. Propriété fondamentale pour les pomades, sticks coiffants et graisses capillaires.

### 2. Contrôle du point de fusion
En ajustant la concentration de céresine (et en la combinant avec d'autres cires), les formulateurs contrôlent précisément la fermeté, la température de fusion et le comportement rhéologique du produit fini.

### 3. Occlusivité
Film occlusif solide sur la fibre capillaire, scellant l'humidité et protégeant contre les agressions mécaniques et environnementales.

### 4. Fixation légère à modérée
Le réseau cristallin se déforme progressivement sous cisaillement (chaleur du doigt, friction), permettant la mise en forme du cheveu sans rigidité cassante.

## Différences ozokérite / céresine / cire microcristalline

| Propriété | Ozokérite | Céresine | Cire microcristalline |
|---|---|---|---|
| Origine | Fossile naturelle | Ozokérite raffinée | Pétrole (cires de fond) |
| Cristaux | Gros | Fins | Très fins |
| Texture | Granuleuse | Lisse | Très lisse, flexible |
| Point de fusion | 52–82°C | 61–78°C | 60–90°C |

## Concentration d'usage

- Pomades, graisses capillaires : 5–20%
- Sticks coiffants : 10–30%
`,
  },
  {
    name: 'Ozokérite (Ozokerite)',
    slug: INGREDIENT_SLUGS.OZOKERITE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      'Cire minérale fossile naturelle, mélange de cérésine et de paraffines à haut PM, précurseur naturel de la céresine raffinée utilisée dans les pomades et produits de coiffage semi-solides.',
    content: `
# Ozokérite (Ozokerite)

L'ozokérite (du grec ozein = sentir, keros = cire) est une cire minérale fossile d'origine naturelle, formée par évaporation et condensation de pétroles à haute teneur en paraffines dans des gisements géologiques. Elle est principalement exploitée en Ukraine, en Pologne et en Roumanie.

## INCI
**OZOKERITE** (CAS: 8021-55-4 | COSING: 55383)

## Composition

Mélange complexe de cérésines, de paraffines à haut poids moléculaire (C30–C60) et de faibles quantités de résines bitumineuses. La composition exacte varie selon l'origine géologique.

## Mécanisme d'action

### 1. Agent structurant brut
Dans sa forme brute ou semi-raffinée, l'ozokérite structure les phases huileuses par formation d'un réseau cristallin paraffine/céresine. Plus "rustique" que la céresine raffinée — texture légèrement granuleuse.

### 2. Occlusivité élevée
Le film solide formé sur la fibre est très imperméable — propriété occlusif similaire à la vaseline mais avec une consistance plus rigide à température ambiante.

### 3. Fondant contrôlé
Les formulations à l'ozokérite "fondent" au contact de la chaleur du cuir chevelu et des doigts, permettant un étalement progressif — caractéristique appréciée dans les graisses de coiffage traditionnelles.

### 4. Compatibilité huileuse universelle
Se mélange à toutes les huiles minérales, végétales et esters, permettant une grande liberté formulatoire dans les compositions de sticks et pomades.

## Usage moderne

L'ozokérite brute est de moins en moins utilisée en formulation moderne au profit de la céresine raffinée (profil de pureté mieux contrôlé) et de la cire microcristalline. Elle reste présente dans les formules artisanales et certains produits capillaires d'inspiration traditionnelle.

## Concentration d'usage

- Pomades, graisses capillaires : 5–15%
`,
  },
  {
    name: 'Cire Microcristalline (Cera Microcristallina)',
    slug: INGREDIENT_SLUGS.CERA_MICROCRISTALLINA_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      'Cire pétrolière à microcristaux très fins, plus flexible et plus lisse que les paraffines classiques, agent structurant premium pour les cires de coiffage, pomades et produits de fixation.',
    content: `
# Cire Microcristalline (Cera Microcristallina)

La cire microcristalline est une cire pétrolière obtenue par déparaffinage des résidus de distillation sous vide. Sa structure se distingue des paraffines communes par ses cristaux beaucoup plus petits et ramifiés (isoparaffines et naphtènes), lui conférant une texture supérieure et une flexibilité accrue.

## INCI
**CERA MICROCRISTALLINA** (CAS: 63231-60-7 | COSING: 31601)

## Distinction cristalline

| Cire | Structure cristalline | Texture | Flexibilité |
|---|---|---|---|
| Paraffine | Grands cristaux en plaques | Dure, cassante | Faible |
| Céresine | Cristaux fins | Lisse | Modérée |
| Cire microcristalline | Microcristaux ramifiés | Très lisse, cireuse | Élevée |

## Mécanisme d'action

### 1. Structuration flexible
Les microcristaux isoparaffines forment un réseau dense mais flexible — le produit fini est ferme à température ambiante mais se plie sans casser, contrairement aux formulations à base de paraffine pure.

### 2. Cohésion et brillance
La très fine taille des cristaux crée une surface quasi-homogène sur la fibre capillaire, diffusant uniformément la lumière — brillance supérieure aux cires à gros cristaux.

### 3. Tenue et fixation
Le film cire microcristalline est plus résistant à la chaleur et à l'humidité que la paraffine ordinaire (point de fusion plus élevé : 60–90°C). Formulations "long hold" pour coiffures sculpturales.

### 4. Compatibilité avec les huiles et actifs
Excellente compatibilité avec les huiles végétales, minérales, esters et silicones — facilite la formulation de produits coiffants hybrides (mixant fixation et soin).

## Grades principaux

- **Grade bas PM** (point de fusion 60–65°C) : pomades souples, brillantines
- **Grade haut PM** (point de fusion 85–90°C) : cires coiffantes dures, sticks

## Concentration d'usage

- Pomades et cires coiffantes : 5–25%
- Sticks coiffants : 15–40%
`,
  },
]

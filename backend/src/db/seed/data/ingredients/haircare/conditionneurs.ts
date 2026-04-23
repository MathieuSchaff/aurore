import { HAIRCARE_INGREDIENT_CATEGORIES, INGREDIENT_TYPES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_CONDITIONNEURS: IngredientInput[] = [
  {
    name: 'Alcool Cétylique (Cetyl Alcohol)',
    slug: INGREDIENT_SLUGS.CETYL_ALCOHOL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Alcool gras saturé C16 solide, épaississant et co-émulsifiant essentiel des après-shampooings, apporte corps, onctuosité et douceur sans alourdir.',
    content: `
# Alcool Cétylique (Cetyl Alcohol)

L'alcool cétylique est un alcool gras à chaîne longue saturée (C16), extrait des huiles de coco ou de palme par hydrogénation catalytique des acides gras correspondants. Malgré son nom, ce n'est pas un alcool séchant — c'est un émollient solide et un co-émulsifiant incontournable.

## INCI
**CETYL ALCOHOL** (CAS: 36653-82-4 | COSING: 31669)

## Mécanisme d'action

### 1. Épaississement par cristaux liquides
En association avec un tensioactif cationique (behentrimonium chloride, BTMS), l'alcool cétylique forme des cristaux liquides lamellaires — structure gel qui stabilise l'émulsion de l'après-shampoing et lui confère sa texture crémeuse caractéristique.

### 2. Émollience
La chaîne C16 se dépose sur la cuticule, réduit la friction inter-fibres et améliore la douceur tactile. Contrairement aux silicones, ce dépôt est biodégradable et ne crée pas de film imperméable.

### 3. Consistance formulatoire
Point de fusion ~49°C : solide à température ambiante, fond au contact de la peau/cheveux. Ajuste la viscosité des émulsions de façon prévisible.

## Concentration d'usage
- Après-shampooings légèrs : 2–5%
- Après-shampooings épais / masques : 5–10%
`,
  },
  {
    name: 'Alcool Cétéarylique (Cetearyl Alcohol)',
    slug: INGREDIENT_SLUGS.CETEARYL_ALCOHOL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Mélange d'alcools gras C16–C18, co-émulsifiant et épaississant polyvalent, confère corps et texture crémeuse à la majorité des après-shampooings et masques.",
    content: `
# Alcool Cétéarylique (Cetearyl Alcohol)

L'alcool cétéarylique est un mélange d'alcool cétylique (C16) et d'alcool stéarylique (C18). Ce mélange offre un profil de fusion plus large que l'un ou l'autre seul, et constitue l'agent épaississant/co-émulsifiant le plus utilisé dans les conditionneurs.

## INCI
**CETEARYL ALCOHOL** (CAS: 8005-44-5 | COSING: 31654)

## Mécanisme d'action

### 1. Co-émulsifiant universel
En présence de tensioactifs cationiques, l'alcool cétéarylique s'organise en bicouches lamellaires — structure qui stabilise les émulsions H/E de façon robuste sur une large plage de pH et de température.

### 2. Ajustement de texture
Le rapport C16:C18 (généralement 30:70 ou 50:50) permet d'ajuster finement la viscosité et la texture : plus de C16 → texture plus fluide ; plus de C18 → texture plus ferme.

### 3. Émollience
Film doux sur la cuticule, réduit la friction et améliore le démêlage. Moins occlusif que les silicones lourdes.

## Avantages formulatoires
- Compatible certifications Cosmos (origine végétale)
- Point de fusion ~50°C : stable à température de process
- Synergie parfaite avec behentrimonium chloride et BTMS

## Concentration d'usage
3–10% selon la texture voulue (léger à très crémeux).
`,
  },
  {
    name: 'Alcool Stéarylique (Stearyl Alcohol)',
    slug: INGREDIENT_SLUGS.STEARYL_ALCOHOL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Alcool gras saturé C18 à point de fusion élevé, épaississant robuste qui confère une texture dense et riche aux masques et après-shampooings intensifs.',
    content: `
# Alcool Stéarylique (Stearyl Alcohol)

L'alcool stéarylique est un alcool gras saturé à 18 carbones (C18), extrait des huiles végétales (coco, palme) ou synthétique. Sa chaîne longue et saturée lui confère un point de fusion élevé (~59°C) et une consistance plus ferme que l'alcool cétylique.

## INCI
**STEARYL ALCOHOL** (CAS: 112-92-5 | COSING: 57570)

## Mécanisme d'action

### 1. Épaississement intensif
Chaîne C18 saturée → packing lamellaire très dense avec les tensioactifs cationiques. Formules plus épaisses et riches que celles à base d'alcool cétylique C16.

### 2. Émollience profonde
Dépôt gras discret sur la cuticule, texture légèrement plus "riche" au toucher. Adapté aux cheveux très secs, traités chimiquement ou très poreux.

### 3. Stabilisation thermique
Point de fusion plus élevé que le cétylique → formules stables à des températures plus importantes. Utile dans les masques chauffants ou les soins à laisser sous bonnet.

## Usage préférentiel
Masques intensifs, après-shampooings riches pour cheveux très secs, formules "hair butter".

## Concentration d'usage
2–8% seul ; souvent utilisé en mélange avec alcool cétylique (= alcool cétéarylique).
`,
  },
  {
    name: 'Alcool Béhénylique (Behenyl Alcohol)',
    slug: INGREDIENT_SLUGS.BEHENYL_ALCOHOL,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Alcool gras saturé C22 à très longue chaîne, co-émulsifiant des formules les plus riches, apporte un dépôt conditionneur long-lasting supérieur aux alcools C16–C18.',
    content: `
# Alcool Béhénylique (Behenyl Alcohol)

L'alcool béhénylique (1-docosanol) est un alcool gras saturé à 22 carbones (C22), extrait des huiles de colza ou de noix de coco. Sa très longue chaîne lui confère des propriétés distinctives des alcools gras standard.

## INCI
**BEHENYL ALCOHOL** (CAS: 661-19-8 | COSING: 30614)

## Mécanisme d'action

### 1. Cristaux liquides lamellaires très stables
La chaîne C22 forme des bicouches lamellaires encore plus ordonnées que les C16 ou C18. Résultat : émulsions plus stables, viscosité plus élevée à concentration équivalente.

### 2. Dépôt substantif sur la kératine
En association avec le behentrimonium chloride (également C22), l'alcool béhénylique co-dépose sur la fibre : les deux molécules s'intercalent dans les espaces cuticulaires, formant un film conditionneur durable et épais.

### 3. Texture "soyeuse" distinctive
Formules à l'alcool béhénylique présentent un toucher souvent décrit comme plus "soyeux" et "luxueux" que les équivalents cétyliques/cétéaryliques. Signature sensorielle des conditionneurs premium.

## Utilisations typiques
Après-shampooings premium, masques intensifs pour cheveux très abîmés, formules co-wash riches.

## Concentration d'usage
1–6% en co-émulsifiant ; 3–8% dans les formules épaisses.
`,
  },
  {
    name: 'Arachidyl/Behenyl Alcohol',
    slug: INGREDIENT_SLUGS.ARACHIDYL_BEHENYL_ALCOHOL,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Mélange d'alcools gras C20–C22, co-émulsifiant ultra-stable pour formules riches, combinaison synergique qui améliore la texture et le dépôt conditionneur.",
    content: `
# Arachidyl/Behenyl Alcohol (Arachidyl Alcohol + Behenyl Alcohol)

Ce mélange associe l'alcool arachidylique (C20) et l'alcool béhénylique (C22). La combinaison de deux chaînes longues légèrement différentes crée une structure lamellaire particulièrement stable.

## INCI
**ARACHIDYL ALCOHOL (AND) BEHENYL ALCOHOL** (CAS: 629-97-0 / 661-19-8)

## Mécanisme d'action

### 1. Synergie de chaînes C20 + C22
Les deux alcools gras forment des cristaux mixtes plus ordonnés qu'un alcool pur seul — phénomène d'eutexie inversée. La structure mixte améliore la stabilité de l'émulsion et la régularité du dépôt sur la fibre.

### 2. Texture premium
Confère aux formules une onctuosité et un "slip" (glissant) remarquables. Les formules à base de ce mélange sont moins collantes et plus faciles à étaler que les équivalents cétéaryliques.

### 3. Co-émulsifiant performant
Associé au BTMS ou au behentrimonium chloride, stabilise des émulsions à haute teneur en corps gras (masques très riches, "hair butters" émulsifiés).

## Utilisation typique
Conditionneurs sans rinçage épais, masques capillaires de luxe, formules "creamy co-wash".

## Concentration d'usage
2–8% en co-émulsifiant.
`,
  },
  {
    name: 'Diméthicone (Dimethicone)',
    slug: INGREDIENT_SLUGS.DIMETHICONE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Silicone linéaire polydiméthylsiloxane, forme un film occlusif sur la cuticule qui apporte brillance, lissage et protection mécanique, mais s'accumule sans shampoings sulfatés.",
    content: `
# Diméthicone (Dimethicone / PDMS)

La diméthicone (polydiméthylsiloxane, PDMS) est un polymère silicone linéaire composé de motifs répétés de diméthylsiloxane (-Si(CH₃)₂-O-). Sa viscosité varie de quelques centistokes (légère) à des millions (très lourde) selon le degré de polymérisation.

## INCI
**DIMETHICONE** (CAS: 9006-65-9 | COSING: 33259)

La viscosité est souvent précisée : Dimethicone (100 cst), Dimethicone (1000 cst), Dimethicone (350 cst)...

## Mécanisme d'action

### 1. Film occlusif cuticule
La diméthicone s'adsorbe sur la kératine par interactions de van der Waals et hydrophobes. Elle forme un film continu, imperméable à l'eau et aux frottements.

### 2. Lissage mécanique
Ce film comble les aspérités de la cuticule (zones érodées, zones de porosité), réduit la rugosité de surface et améliore la réflexion de la lumière → brillance intense.

### 3. Protection thermique
Barrière thermique partielle lors du brushing ou du lissage — réduit la transmission de chaleur vers le cortex. Mais pas un véritable protecteur thermique en dessous de son point d'évaporation.

### 4. Réduction de l'électricité statique
Film conducteur partiel réduit les charges électrostatiques — anti-frisottis en temps sec.

## Problème d'accumulation
La diméthicone non hydrosoluble s'accumule avec les lavages répétés sans sulfates. Ce dépôt progressif :
- Pèse sur les cheveux fins
- Bloque la pénétration des actifs nourrissants
- Nécessite un shampooing clarifiant sulfaté pour être éliminé

## Viscosité et effet

| Viscosité | Texture | Effet principal |
|---|---|---|
| 50–200 cst | Très fluide | Légèreté, anti-frisottis |
| 350–1000 cst | Fluide–moyen | Brillance, lissage |
| >5000 cst | Épais | Réparation cuticule, protection intense |

## Concentration d'usage
- Après-shampooings : 0,5–5%
- Sérums : 5–20%
- Après-shampooings sans rinçage : 1–3%
`,
  },
  {
    name: 'Amodiméthicone (Amodimethicone)',
    slug: INGREDIENT_SLUGS.AMODIMETHICONE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Silicone aminofonctionnelle se déposant préférentiellement sur les zones endommagées de la fibre capillaire, conditionneur ciblé à haute substantivité.',
    content: `
# Amodiméthicone (Amodimethicone)

L'amodimethicone est une silicone modifiée par des groupements amino (-NH₂ et -NH-) sur certains motifs siloxane. Ces groupes amines lui confèrent une charge positive partielle qui la rend "substantive" sur la kératine chargée négativement — contrairement à la dimethicone neutre.

## INCI
**AMODIMETHICONE** (CAS: 106842-44-8 | COSING: 28779)

Souvent formulé avec un agent de dispersion cationique : **AMODIMETHICONE (AND) TRIDECETH-12 (AND) CETRIMONIUM CHLORIDE**.

## Mécanisme d'action

### 1. Dépôt ciblé sur les zones endommagées
Les zones abîmées de la fibre (pointes fourchues, cuticule érodée) présentent une densité de charges négatives plus élevée. Les groupes amino de l'amodimethicone s'y adsorbent préférentiellement — dépôt "intelligent" là où c'est le plus utile.

### 2. Substantivité ionique
L'interaction ionique amine–kératine est plus forte que les interactions van der Waals de la dimethicone neutre. Le dépôt d'amodimethicone résiste mieux au rinçage et dure plusieurs lavages.

### 3. Réparation visuelle et mécanique
Comble les lacunes cuticulaires avec une précision plus grande que la dimethicone standard — amélioration de brillance, de résistance à la traction et de réduction des pointes fourchues.

### 4. Moindre accumulation que la dimethicone classique
Le dépôt ciblé (zones endommagées) et la dose plus faible nécessaire réduisent l'accumulation globale. Peut être rincé plus facilement que les dimethicones lourdes.

## Avantage sur la dimethicone standard
Plus efficace à concentration inférieure, ciblage des zones lésées, meilleure substantivité = moins de surcharge sur les zones saines.

## Concentration d'usage
0,5–3% dans après-shampooings et masques réparateurs.
`,
  },
  {
    name: 'Cyclopentasiloxane (D5)',
    slug: INGREDIENT_SLUGS.CYCLOPENTASILOXANE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Silicone cyclique volatile D5, véhicule léger qui s'évapore après application, apporte glissant et légèreté immédiate sans résidu — mais soumis à restriction réglementaire UE.",
    content: `
# Cyclopentasiloxane (D5 / Décaméthylcyclopentasiloxane)

Le cyclopentasiloxane (D5) est une silicone cyclique volatile (VMS) formée de 5 motifs diméthylsiloxane en cycle. Sa principale caractéristique : il s'évapore rapidement après application, ne laissant théoriquement pas de résidu sur la fibre.

## INCI
**CYCLOPENTASILOXANE** (CAS: 541-02-6 | COSING: 32690)

## Mécanisme d'action

### 1. Vecteur volatile
Le D5 solubilise et transporte d'autres silicones non volatiles, actifs lipophiles et conditionneurs jusqu'à la surface de la fibre. Une fois appliqué, il s'évapore (température de vaporisation ~210°C à pression atm.) et les actifs restent sur la fibre sans le D5 lui-même.

### 2. Légèreté immédiate
Pendant l'application et les premières minutes, le D5 confère un toucher extrêmement léger, "glissant", qui facilite le démêlage et l'application de sérum sans effet lourd.

### 3. Sensorialité premium
Signature sensorielle distinctive : "silky dry touch". Très utilisé dans les sérums et huiles capillaires légères pour éliminer l'effet gras.

## Restriction réglementaire UE
Le D5 (et D4) sont classés comme polluants persistants dans les milieux aquatiques. Règlement UE 2018/35 : interdit dans les produits cosmétiques à rincer à partir de janvier 2020. Dans les produits sans rinçage (sérums, huiles), toujours autorisé mais en discussion.

## Concentration d'usage
5–30% dans sérums et huiles capillaires légères.

> ⚠️ Vérifier la conformité réglementaire avant usage dans les produits rincés.
`,
  },
  {
    name: 'Cyclotetrasiloxane (D4)',
    slug: INGREDIENT_SLUGS.CYCLOTETRASILOXANE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Silicone cyclique volatile D4 à 4 motifs, vecteur ultraléger mais soumis à restriction réglementaire stricte en UE en raison de sa persistance environnementale.',
    content: `
# Cyclotetrasiloxane (D4 / Octaméthylcyclotétrasiloxane)

Le cyclotetrasiloxane (D4) est la silicone cyclique volatile à 4 motifs, homologue inférieur du D5. Plus volatile et plus légère que le D5, elle était historiquement présente dans de nombreux sérums et laques.

## INCI
**CYCLOTETRASILOXANE** (CAS: 556-67-2 | COSING: 32689)

## Mécanisme d'action

### 1. Volatilité supérieure au D5
Point d'ébullition ~175°C (vs ~210°C pour D5) → évaporation plus rapide. Toucher encore plus léger et moins persistant après application.

### 2. Vecteur d'actifs
Même rôle véhicule que le D5, mais pour des applications où une évaporation très rapide est souhaitée (après-rasage capillaire, sprays coiffants).

## Restriction réglementaire UE (critique)
Le D4 est classé substance extrêmement préoccupante (SVHC) : toxique pour la reproduction (Cat. 2) et perturbateur endocrinien potentiel. Interdit dans les cosmétiques rincés (Règlement UE 2018/35) et sa présence dans les produits non rincés est très limitée.

**En pratique** : le D4 est progressivement abandonné en Europe en faveur du D5 ou de silicones alternatives non cycliques.

## Concentration d'usage
Historiquement 5–20% ; usage fortement restreint/interdit dans la majorité des formules UE modernes.
`,
  },
  {
    name: 'Phényl Triméthicone (Phenyl Trimethicone)',
    slug: INGREDIENT_SLUGS.PHENYL_TRIMETHICONE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Silicone phénylée non volatile, apporte une brillance exceptionnelle à la fibre capillaire par son indice de réfraction élevé, sans l'effet lourd des silicones non volatiles standard.",
    content: `
# Phényl Triméthicone (Phenyl Trimethicone)

La phenyl trimethicone est une silicone modifiée par des groupements phényle sur certains atomes de silicium. Ces groupements aromatiques augmentent significativement l'indice de réfraction de la silicone (nD ~1,46 vs ~1,40 pour la dimethicone) — responsable de la brillance exceptionnelle.

## INCI
**PHENYL TRIMETHICONE** (CAS: 2116-84-9 | COSING: 75557)

## Mécanisme d'action

### 1. Indice de réfraction élevé → brillance intense
Un indice de réfraction plus élevé signifie que la silicone réfléchit davantage la lumière à sa surface. La phényl triméthicone appliquée sur la cuticule agit comme un "miroir" microscopique, amplifiant la brillance de façon visible même à faible concentration.

### 2. Film non occlusif léger
Malgré ses propriétés filmogènes, la phenyl trimethicone produit un film plus fin et moins lourd que les dimethicones de haute viscosité. Adapté aux cheveux fins qui veulent de la brillance sans le poids.

### 3. Compatibilité huiles végétales
Meilleure compatibilité avec les huiles végétales riches en insaturés que la dimethicone standard — stable en présence d'huile d'argan, de jojoba, de macadamia.

### 4. Non volatile
Contrairement au D4 et D5, reste sur la fibre. Le film persiste jusqu'au prochain lavage.

## Usage typique
Sérums brillance, laques et sprays finissants, après-shampooings légèreté-brillance.

## Concentration d'usage
0,5–5% dans sérums et sprays ; jusqu'à 10% dans formules haute brillance.
`,
  },
  {
    name: 'Diméthiconol (Dimethiconol)',
    slug: INGREDIENT_SLUGS.DIMETHICONOL,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Silicone linéaire à terminaisons hydroxyle, plus substantive et plus conditionnante que la dimethicone standard, apporte douceur et glissant durable.',
    content: `
# Diméthiconol (Dimethiconol)

Le dimethiconol est un polydiméthylsiloxane α,ω-diol : chaîne PDMS identique à la dimethicone, mais terminée par des groupes hydroxyle (-OH) aux deux extrémités au lieu de groupes méthyle.

## INCI
**DIMETHICONOL** (CAS: 70131-67-8 | COSING: 33262)

## Mécanisme d'action

### 1. Substantivité accrue
Les groupements hydroxyle terminaux forment des liaisons hydrogène avec les groupes amide (-CO-NH-) de la kératine. Le dimethiconol s'adsorbe donc plus fortement sur la fibre que la dimethicone neutre — dépôt résistant au rinçage.

### 2. Glissant et démêlage
La chaîne PDMS lubrifie la cuticule, réduit la friction inter-fibres. L'adsorption supérieure garantit un effet durable sur plusieurs lavages.

### 3. Compatibilité émulsion
Les groupes OH favorisent la dispersion dans les émulsions aqueuses sans agent de dispersion supplémentaire — formulatoire simplifié vs dimethicone standard.

## Comparaison dimethicone vs dimethiconol

| Propriété | Dimethicone | Dimethiconol |
|---|---|---|
| Substantivité | Faible | Élevée |
| Durée d'effet | Court | Long |
| Accumulation | Élevée | Modérée |
| Solubilité eau | Nulle | Légère |

## Concentration d'usage
0,5–4% dans après-shampooings et sérums conditionneurs.
`,
  },
  {
    name: 'Polysilicone-15',
    slug: INGREDIENT_SLUGS.POLYSILICONE_15,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Silicone polymère avec groupements UV-filtrants organiques, double fonction conditionneur et filtre UV solaire pour la protection de la fibre capillaire.',
    content: `
# Polysilicone-15

Le polysilicone-15 est un co-polymère silicone greffé avec des groupements organiques filtrants UV (dérivés de benzophénone ou méthoxycinnamate). Il combine la substantivité d'une silicone avec la fonction photoprotectrice d'un filtre UV.

## INCI
**POLYSILICONE-15** (CAS: 207009-42-5)

## Mécanisme d'action

### 1. Dépôt substantif sur la kératine
Chaîne silicone longue → dépôt filmogène sur la cuticule, durable au rinçage. Réduit friction, améliore douceur et brillance.

### 2. Protection UV de la fibre
Les groupements chromophores greffés absorbent les UV-A et UV-B (λmax ~310–350 nm) et dissipent l'énergie sous forme de chaleur. Protège :
- La mélanine (pigment naturel de la couleur)
- Les liaisons disulfure (résistance structurelle)
- Les protéines kératiniques (photooxydation)

### 3. Protection couleur
Particulièrement utile sur cheveux colorés : réduit la décoloration photo-induite (fading) par blocage de la photolyse des colorants artificiels.

## Contexte réglementaire
Le polysilicone-15 contient des groupements UV-filtrants ; sa classification "filtre UV" vs "actif cosmétique" varie selon les réglementations nationales.

## Concentration d'usage
0,5–3% dans sprays protecteurs, après-shampooings "color protect" et leave-ins solaires.
`,
  },
  {
    name: 'Triméthylsilylamodiméthicone (Trimethylsilylamodimethicone)',
    slug: INGREDIENT_SLUGS.TRIMETHYLSILYLAMODIMETHICONE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Silicone aminofonctionnelle à terminaisons triméthylsilyle, combinant la substantivité de l'amodimethicone avec une meilleure compatibilité formulatoire et un moindre jaunissement.",
    content: `
# Triméthylsilylamodiméthicone (Trimethylsilylamodimethicone)

La trimethylsilylamodimethicone est une silicone amino-modifiée dont les extrémités de chaîne sont protégées par des groupes triméthylsilyle (TMS). Cette protection terminale résout le principal défaut de l'amodimethicone classique : le jaunissement.

## INCI
**TRIMETHYLSILYLAMODIMETHICONE** (CAS: 68554-64-3 | COSING: 58846)

## Mécanisme d'action

### 1. Substantivité amino identique à l'amodimethicone
Les groupes amino intrachaîne s'adsorbent de façon préférentielle sur les zones endommagées de la kératine. Même ciblage des zones de haute porosité.

### 2. Pas de jaunissement
L'amodimethicone classique peut jaunir les cheveux blonds/gris en raison de l'oxydation des amines libres en bout de chaîne. Les groupes TMS protègent les terminaisons de chaîne contre cette oxydation.

### 3. Compatibilité formulatoire améliorée
Les terminaisons TMS réduisent la tendance à la gélification et à l'incompatibilité avec certains émulsifiants — formulations plus stables.

## Avantage clé vs amodimethicone
Même performance conditionnante, sans le risque de jaunissement sur cheveux clairs ou décolorés.

## Concentration d'usage
0,5–3% dans après-shampooings et traitements sans rinçage, notamment pour cheveux blonds/gris/décolorés.
`,
  },
  {
    name: 'Silicone Quaternium-8',
    slug: INGREDIENT_SLUGS.SILICONE_QUATERNIUM_8,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Silicone quaternaire (silicone + ammonium quaternaire), double action conditionnante et antistatique, dépôt substantif sur fibre chargée négativement.',
    content: `
# Silicone Quaternium-8

Le silicone quaternium-8 est un polymère hybride silicone-ammonium quaternaire. Il combine la backbone silicone (conditionnement, lissage, brillance) avec des charges cationiques quaternaires (substantivité, antistatique).

## INCI
**SILICONE QUATERNIUM-8** (CAS: 265996-67-2)

## Mécanisme d'action

### 1. Double affinité pour la kératine
Les charges quaternaires s'adsorbent électrostatiquement sur la kératine chargée négativement (même mécanisme que le behentrimonium), tandis que la backbone silicone forme un film lubrifiant.

### 2. Substantivité supérieure aux silicones non ioniques
Le dépôt ionique est plus fort que le dépôt par van der Waals. Le silicone quaternium-8 résiste mieux au rinçage que la dimethicone standard.

### 3. Antistatique efficace
Les charges cationiques neutralisent les charges négatives accumulées sur la fibre — élimine les frisottis et l'électricité statique de façon durable.

### 4. Conditionnement léger à modéré
Silicone légère : apporte douceur et brillance sans le poids des dimethicones de haute viscosité.

## Avantage vs silicones non ioniques
Substantivité + antistatique sans avoir à utiliser un ammonium quaternaire séparé.

## Concentration d'usage
0,1–2% dans shampoings 2-en-1, après-shampooings légèrs et sprays démêlants.
`,
  },
  {
    name: 'Silicone Quaternium-16',
    slug: INGREDIENT_SLUGS.SILICONE_QUATERNIUM_16,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Silicone quaternaire à chaîne longue, conditionneur filmogène substantif adapté aux formules réparatrices, supérieur en dépôt au Silicone Quaternium-8.',
    content: `
# Silicone Quaternium-16

Le silicone quaternium-16 est un polymère silicone-ammonium quaternaire de masse moléculaire et densité de charge plus élevées que le SQ-8. Cette architecture lui confère un conditionnement plus intense.

## INCI
**SILICONE QUATERNIUM-16** (CAS: 1262489-23-5)

## Mécanisme d'action

### 1. Dépôt filmogène dense
Masse moléculaire plus élevée → film silicone plus épais et plus résistant sur la cuticule. Conditionnement visible, réduction de friction importante.

### 2. Réparation visuelle des pointes
Le film dense comble efficacement les lacunes cuticulaires des pointes abîmées — amélioration de brillance et de texture comparable aux silicones haute viscosité.

### 3. Substantivité très élevée
Densité de charges quaternaires élevée → adsorption forte sur zones endommagées. Résiste à plusieurs lavages.

### 4. Hydrophobisation de la fibre
Le film silicone dense réduit l'absorption d'eau en excès dans les zones surporeuses — améliore le comportement au séchage et réduit l'effet "hygral fatigue" sur cheveux poreux.

## Usage typique
Après-shampooings réparateurs, masques "protein-bond repair", traitements pour cheveux très abîmés.

## Concentration d'usage
0,1–2% dans formules réparatrices.
`,
  },
  {
    name: 'Silicone Quaternium-22',
    slug: INGREDIENT_SLUGS.SILICONE_QUATERNIUM_22,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Silicone quaternaire de haute substantivité, particulièrement adapté aux shampoings 2-en-1 et formules rincées grâce à son excellent dépôt résistant à l'eau.",
    content: `
# Silicone Quaternium-22

Le silicone quaternium-22 est un quaternaire silicone optimisé pour la déposition en présence de tensioactifs — propriété critique pour les shampoings 2-en-1 où les tensioactifs interfèrent normalement avec le dépôt conditionneur.

## INCI
**SILICONE QUATERNIUM-22** (CAS: 1040454-37-2)

## Mécanisme d'action

### 1. Résistance à la désorption par les tensioactifs
Dans un shampoing, les tensioactifs anioniques éliminent généralement les conditionneurs cationiques déposés (compétition pour les sites kératine). Le SQ-22 possède une affinité kératine suffisamment forte pour résister à cette compétition — dépôt efficace même dans les produits rincés.

### 2. Conditionnement post-rinçage
Apporte douceur, brillance et réduction de friction résiduels après rinçage du shampoing. Propriété centrale des "2-en-1".

### 3. Effet lissant
Le film silicone résiduel lisse les cuticules soulevées après lavage — réduit l'effet "terne" post-shampoing.

## Usage typique
Shampoings 2-en-1, shampoings conditionneurs, formules "quick-wash" pour cheveux en déplacement.

## Concentration d'usage
0,1–1,5% dans shampoings conditionneurs et produits rincés.
`,
  },
  {
    name: 'Polyquaternium-7',
    slug: INGREDIENT_SLUGS.POLYQUATERNIUM_7,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Polymère cationique acrylique (DADMAC/acrylamide), conditionneur léger très utilisé dans les shampoings pour son dépôt filmogène résistant à l'eau sans alourdir.",
    content: `
# Polyquaternium-7 (PQ-7)

Le polyquaternium-7 est un copolymère d'acrylate de chlorure de diallyldiméthylammonium (DADMAC) et d'acrylamide. C'est l'un des conditionneurs polymériques les plus utilisés dans les shampoings grand public.

## INCI
**POLYQUATERNIUM-7** (CAS: 26590-05-6 | COSING: 55907)

## Mécanisme d'action

### 1. Dépôt filmogène polymérique
Le PQ-7 forme un film polymère fin et continu sur la fibre capillaire. Contrairement aux conditionneurs à base d'alcools gras, ce film est très léger et transparent — ne pèse pas sur les cheveux fins.

### 2. Substantivité résistante aux tensioactifs
Même mécanisme que le SQ-22 : la densité de charges cationiques du PQ-7 lui permet de rester déposé sur la kératine malgré la présence de tensioactifs anioniques dans le shampoing.

### 3. Effet démêlant
Réduit la friction inter-fibres lors du rinçage et du séchage. Facilite le peigne même sur cheveux mouillés.

### 4. Légèreté sensorielle
Film très fin — adapté cheveux fins, cheveux gras, formules légères. Ne bouche pas la cuticule et n'accumule pas excessivement.

## Concentration d'usage
0,1–0,5% dans shampoings conditionneurs ; 0,5–2% dans après-shampooings légers.
`,
  },
  {
    name: 'Polyquaternium-10',
    slug: INGREDIENT_SLUGS.POLYQUATERNIUM_10,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Cellulose quaternisée (hydroxypropyl trimonium chlorure), conditionneur filmogène d'origine naturelle, apporte volume et corps sans alourdir les cheveux fins.",
    content: `
# Polyquaternium-10 (PQ-10)

Le polyquaternium-10 est une cellulose hydroxypropylée quaternisée avec du chlorure de glycidyltriméthylammonium. Dérivé cellulosique naturel, il combine l'origine biopolymère avec les propriétés conditionnantes des quaternaires.

## INCI
**POLYQUATERNIUM-10** (CAS: 81859-24-7 | COSING: 55910)

## Mécanisme d'action

### 1. Dépôt biopolymère sur la fibre
Le PQ-10 s'adsorbe sur la kératine grâce à ses charges cationiques. La backbone cellulosique forme un film légèrement épaissi qui gaine chaque fibre individuellement.

### 2. Effet volume
Contrairement aux conditionneurs gras, le film cellulosique "gonfle" légèrement chaque fibre — augmentation perceptible du volume et du corps, particulièrement sur cheveux fins et mous.

### 3. Compatibilité eau dure
Moins sensible aux ions calcium et magnésium que les cationiques classiques — maintient ses propriétés en eau dure.

### 4. Origine naturelle
Dérivé de la cellulose (coton ou bois) → certifiable partiellement naturel selon les référentiels Cosmos.

## Avantage clé
Seul conditionneur courant qui apporte du **volume** plutôt que de l'aplatissement. Idéal cheveux fins, manquant de corps.

## Concentration d'usage
0,1–0,5% dans shampoings volumisants ; 0,5–1,5% dans après-shampooings légers.
`,
  },
  {
    name: 'Polyquaternium-11',
    slug: INGREDIENT_SLUGS.POLYQUATERNIUM_11,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Polymère quaternaire vinylpyrrolidone/DMAE, agent filmogène et fixateur capillaire avec effet conditionneur, présent dans laques et gels coiffants.',
    content: `
# Polyquaternium-11 (PQ-11)

Le polyquaternium-11 est un copolymère de vinylpyrrolidone (VP) et de méthacrylate de chlorure de diméthylaminoéthyle (DMAE). C'est un agent filmogène double-fonction : fixateur coiffant + conditionneur léger.

## INCI
**POLYQUATERNIUM-11** (CAS: 53633-54-8 | COSING: 55911)

## Mécanisme d'action

### 1. Film fixateur
La fraction VP (vinylpyrrolidone) forme un film rigide autour de la fibre — propriété fixante exploitée dans les laques, gels et mousses coiffantes. Maintien de la coiffure par réticulat polymère.

### 2. Conditionnement par charges cationiques
Les charges quaternaires DMAE s'adsorbent sur la kératine — douceur, antistatique, réduction de friction résiduels après rinçage ou séchage.

### 3. Hydrosolubilité contrôlée
Soluble dans l'eau mais forme un film résistant à l'humidité modérée — comportement idéal pour les fixateurs coiffants.

## Usage typique
Gels coiffants, crèmes coiffantes légères, mousses, laques. Moins courant dans les après-shampooings (trop filmogène).

## Concentration d'usage
0,5–3% dans produits coiffants ; 0,1–0,5% comme conditionneur dans shampoings.
`,
  },
  {
    name: 'Polyquaternium-37',
    slug: INGREDIENT_SLUGS.POLYQUATERNIUM_37,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Polymère acrylate cationique crosslinké, conditionneur et épaississant polyvalent, apporte texture gel et douceur dans les soins capillaires sans rinçage.',
    content: `
# Polyquaternium-37 (PQ-37)

Le polyquaternium-37 est un copolymère acrylate quaternaire réticulé (crosslinké). Sa structure réticulée lui confère des propriétés rhéologiques (épaississement) en plus des propriétés conditionnantes.

## INCI
**POLYQUATERNIUM-37** (CAS: 26161-33-1 | COSING: 55940)

## Mécanisme d'action

### 1. Épaississement sans sel
Contrairement aux polymères carbomère classiques, le PQ-37 peut épaissir les formules anioniques sans ajout de sel — propriété utile dans les gels aqueux conducteurs.

### 2. Conditionnement cationique
Les charges quaternaires s'adsorbent sur la kératine — douceur, démêlage, légère antistatique. Film polymère fin et non collant.

### 3. Texture gel aqueux
Crée des textures gel légères, transparentes ou translucides — base des gels coiffants "eau" pour cheveux bouclés.

## Usage typique
Gels curl-définissants, crèmes leave-in légères, produits pour cheveux bouclés (CG-method).

## Concentration d'usage
0,5–2% comme conditionneur ; 1–4% comme épaississant dans les gels.
`,
  },
  {
    name: 'Polyquaternium-44',
    slug: INGREDIENT_SLUGS.POLYQUATERNIUM_44,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Copolymère quaternaire VP/DMAPA, conditionneur filmogène à effet curl-enhancing, favorise la définition des boucles sans rigidité ni effet craquant.',
    content: `
# Polyquaternium-44 (PQ-44)

Le polyquaternium-44 est un copolymère de vinylpyrrolidone et de méthacryloylaminopropyl chlorure de lauryldiméthylammonium (DMAPA). Conçu spécifiquement pour les produits pour cheveux bouclés.

## INCI
**POLYQUATERNIUM-44** (CAS: 39461-87-7)

## Mécanisme d'action

### 1. Film flexible anti-frisottis
Contrairement au PQ-11 (film rigide fixant), le PQ-44 forme un film souple et élastique autour de chaque boucle. Ce film retient la forme de la boucle naturelle sans rigidifier ni craquer au séchage.

### 2. Définition des boucles
La chaîne polymère suit le contour de la boucle lors du séchage et maintient la définition obtenue en état mouillé — prolonge l'effet "wet look" défini.

### 3. Réduction des frisottis
Les charges cationiques antistatiques + le film souple réduisent l'absorption d'humidité atmosphérique par les zones de cuticule soulevée — prévient le frizz par temps humide.

## Usage typique
Crèmes définissantes pour cheveux bouclés/ondulés, gels souples curl-enhancing, leave-ins défini.

## Concentration d'usage
0,5–2% dans produits bouclés et définissants.
`,
  },
  {
    name: 'Polyquaternium-55',
    slug: INGREDIENT_SLUGS.POLYQUATERNIUM_55,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Polymère quaternaire silicone-organique hybride, conditionneur longue durée combinant les avantages des silicones quaternaires et des polyquaterniums organiques.',
    content: `
# Polyquaternium-55 (PQ-55)

Le polyquaternium-55 est un polymère hybride organosilicone quaternaire — chaîne silicone greffée avec des segments organiques quaternaires. Cette architecture hybride lui confère des propriétés intermédiaires entre les silicones quaternaires et les polyquaterniums organiques.

## INCI
**POLYQUATERNIUM-55** (CAS: 173700-72-6)

## Mécanisme d'action

### 1. Substantivité silicone + cationique
Double mécanisme d'adsorption : interactions hydrophobes de la fraction silicone + attraction électrostatique des charges quaternaires. Dépôt très durable, résistant aux lavages répétés.

### 2. Conditionnement complet
La fraction silicone apporte lissage, brillance et réduction de friction. La fraction organique apporte douceur, démêlage et antistatique.

### 3. Légèreté relative
Malgré sa substantivité élevée, le PQ-55 est moins lourd que les dimethicones pures de haute viscosité — adapté à des formules légères ou semi-légères.

## Usage typique
Après-shampooings "total repair", produits 2-en-1 premium, sérums conditionneurs longue durée.

## Concentration d'usage
0,1–1,5% dans formules conditionnantes rincées et sans rinçage.
`,
  },
  {
    name: 'Guar Hydroxypropyltrimonium Chloride',
    slug: INGREDIENT_SLUGS.GUAR_HYDROXYPROPYLTRIMONIUM_CHLORIDE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Gomme de guar quaternisée, conditionneur naturel cationique formant un film doux et substantif sur la fibre capillaire, adapté aux formules naturelles et CG-friendly.',
    content: `
# Guar Hydroxypropyltrimonium Chloride (GHPTC)

Le guar hydroxypropyltrimonium chloride est la gomme de guar (*Cyamopsis tetragonoloba*) modifiée par quaternisation avec du chlorure de 3-chloro-2-hydroxypropyl triméthylammonium. C'est le conditionneur naturel quaternaire le plus utilisé en cosmétique capillaire naturelle.

## INCI
**GUAR HYDROXYPROPYLTRIMONIUM CHLORIDE** (CAS: 65497-29-2 | COSING: 36168)

## Mécanisme d'action

### 1. Biopolymère naturel quaternisé
La backbone galactomannane de la guar est biodégradable et d'origine végétale. La quaternisation greffe des charges cationiques qui permettent l'adsorption sur la kératine.

### 2. Film polysaccharidique doux
Le film formé est de nature polysaccharidique (non silicone) — douceur, légèreté, non occlusif. N'accumule pas comme les silicones lourdes.

### 3. Démêlage
Réduit efficacement la friction entre fibres mouillées — propriété démêlante documentée. Particulièrement utile sur cheveux bouclés/crépus très enchevêtrés.

### 4. Compatibilité tensioactifs
Bonne résistance à la désorption par les tensioactifs anioniques (propriété substantivité) — dépôt efficace dans les shampoings et produits rincés.

## Avantage naturel vs silicones
Film naturel, certifiable Cosmos, biodégradable, sans accumulation problématique — alternative performante aux silicones légères dans les formules naturelles.

## Concentration d'usage
0,05–0,5% dans shampoings ; 0,1–1% dans après-shampooings et leave-ins naturels.
`,
  },
  {
    name: 'Hydroxypropyl Guar',
    slug: INGREDIENT_SLUGS.HYDROXYPROPYL_GUAR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      'Gomme de guar hydroxypropylée non quaternaire, épaississant et conditionneur naturel doux sans charge cationique, idéal pour formules sans tensioactifs cationiques.',
    content: `
# Hydroxypropyl Guar

L'hydroxypropyl guar est la forme hydroxypropylée de la gomme de guar, sans quaternisation. Cette modification améliore la solubilité dans l'eau froide et la compatibilité formulatoire sans introduire de charges cationiques.

## INCI
**HYDROXYPROPYL GUAR** (CAS: 39421-75-5 | COSING: 37372)

## Mécanisme d'action

### 1. Épaississement polysaccharidique
Viscosité élevée en solution aqueuse — épaississant naturel efficace pour ajuster la texture des shampoings et après-shampooings sans sel ni polymère synthétique.

### 2. Film conditionneur doux
Déposition partielle sur la fibre par interactions hydrogène (non ionique). Film léger, non occlusif, apporte douceur de surface sans le conditionnement intense du GHPTC.

### 3. Compatibilité universelle
Non ionique → compatible avec tous types de tensioactifs (anioniques, cationiques, amphotères) sans interaction perturbatrice.

### 4. Effet anti-frisottis léger
Film polysaccharidique légèrement protecteur contre la pénétration excessive de l'humidité atmosphérique.

## Différence vs GHPTC
L'hydroxypropyl guar est moins conditionneur (pas de charge cationique) mais plus polyvalent formulairement et certifiable plus facilement dans les référentiels naturels stricts.

## Concentration d'usage
0,1–1% comme épaississant ou conditionneur léger.
`,
  },
  {
    name: 'Honeyquat (Hydroxypropyltrimonium Honey)',
    slug: INGREDIENT_SLUGS.HONEYQUAT,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR,
    description:
      "Miel quaternisé hydroxypropyltrimonium, conditionneur naturel d'origine apicole avec double action humectante et substantive sur la fibre capillaire.",
    content: `
# Honeyquat (Hydroxypropyltrimonium Honey)

L'Honeyquat (nom commercial) est le miel (*Mel*) modifié par quaternisation avec du chlorure de 3-chloro-2-hydroxypropyl triméthylammonium. Analogue du GHPTC mais avec la backbone glucidique du miel plutôt que la guar — propriétés humectantes supérieures.

## INCI
**HYDROXYPROPYLTRIMONIUM HONEY** (CAS: 160578-06-3)

## Composition d'origine
Le miel brut contient glucides (fructose ~38%, glucose ~31%, saccharose ~1%, autres oligosaccharides), acides aminés, enzymes, vitamines du groupe B, minéraux (potassium, calcium, magnésium) et facteurs antimicrobiens (H₂O₂, défensines apicoles).

## Mécanisme d'action

### 1. Dépôt substantif cationique
Les charges quaternaires greffées sur la backbone miel permettent l'adsorption sur la kératine — même mécanisme que le GHPTC. Résiste partiellement au rinçage.

### 2. Humectance par les glucides
La backbone glucidique conserve les propriétés hygroscopiques du miel. Les multiples groupes hydroxyle retiennent l'eau sur la fibre — humectance + conditionnement en une seule molécule.

### 3. Bénéfice "miel"
Aux concentrations typiques d'usage, les actifs secondaires du miel (antioxydants, vitamines) sont dilués. L'effet principal reste le conditionnement et l'humectance par les glucides quaternisés. Le bénéfice "nourrissant du miel" est surtout marketing à faible concentration.

### 4. Légèreté et douceur
Film polysaccharidique doux, non lourd — adapté cheveux fins à moyens.

## Avantages
- Origine naturelle/apicole — positioning "naturel" fort
- Double action humectant + conditionneur
- Certifiable Cosmos (avec conditions)

## Concentration d'usage
0,1–1% dans shampoings et après-shampooings ; 0,5–2% dans leave-ins.
`,
  },
]

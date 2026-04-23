import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_DIVERS: IngredientInput[] = [
  {
    name: 'Tocophérol (Tocopherol / Vitamine E)',
    slug: INGREDIENT_SLUGS.TOCOPHEROL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Antioxydant liposoluble majeur, protège les lipides de la cuticule contre la peroxydation et nourrit le cuir chevelu en profondeur.',
    content: `
# Tocophérol (Tocopherol / Vitamine E)

Le tocophérol est la principale forme active de la vitamine E dans les organismes vivants. En cosmétique capillaire, il est extrait d'huiles végétales (tournesol, soja, germe de blé) ou synthétisé. Son rôle premier est antioxydant : il neutralise les radicaux libres générés par l'UV, la chaleur et la pollution qui dégradent les lipides cuticulaires et les pigments de la fibre.

## INCI
**TOCOPHEROL** (CAS: 59-02-9 | COSING: 58503)

## Mécanisme d'action

### 1. Antioxydant liposoluble
Le tocophérol s'intercale dans les bicouches lipidiques de la cuticule. Il cède un électron aux radicaux peroxyle (ROO•) avant qu'ils n'attaquent les acides gras polyinsaturés — interrompant la chaîne de peroxydation.

### 2. Régénération synergique
La vitamine C (acide ascorbique) régénère le tocophérol oxydé (tocophéroxyle) en tocophérol actif. L'association des deux dans une formule multiplie leur efficacité.

### 3. Nutrition du cuir chevelu
Améliore la microcirculation du cuir chevelu par inhibition de l'agrégation plaquettaire locale. Favorise l'apport en nutriments aux follicules pileux.

### 4. Film occlusif léger
À concentration >0,5%, forme un film lipidique superficiel qui réduit la perte en eau transépidermique et améliore le toucher.

## Formes cosmétiques
- **Tocophérol naturel** (d-α-tocophérol) : extrait d'huiles végétales, plus coûteux, légèrement plus biodisponible
- **Acétate de tocophéryle** (tocopheryl acetate) : forme ester plus stable en formule, hydrolysée en tocophérol après application

## Concentration d'usage
- Huiles et sérums : 0,1–1%
- Après-shampooings / masques : 0,05–0,5%
- Conservateur auxiliaire (phase huileuse) : 0,02–0,05%
`,
  },
  {
    name: 'Rétinyl Palmitate (Retinyl Palmitate / Vitamine A)',
    slug: INGREDIENT_SLUGS.RETINYL_PALMITATE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Ester stable de la vitamine A, stimule le renouvellement cellulaire du cuir chevelu et renforce la gaine du follicule pileux.',
    content: `
# Rétinyl Palmitate (Retinyl Palmitate / Vitamine A)

Le rétinyl palmitate est un ester de rétinol (vitamine A) et d'acide palmitique. C'est la forme de stockage de la vitamine A dans les tissus animaux, et l'une des formes les plus stables en formulation cosmétique. En capillaire, il est ciblé principalement sur le cuir chevelu plutôt que sur la fibre.

## INCI
**RETINYL PALMITATE** (CAS: 79-81-2 | COSING: 56655)

## Mécanisme d'action

### 1. Conversion en rétinoïdes actifs
Une fois absorbé par le cuir chevelu, le rétinyl palmitate est hydrolysé en rétinol, puis oxydé en acide rétinoïque — le ligand des récepteurs RAR/RXR qui régulent l'expression génique cellulaire.

### 2. Stimulation du renouvellement folliculaire
L'acide rétinoïque accélère la différenciation kératinocytaire, améliore le cycle folliculaire et renforce la gaine épithéliale de la racine. Bénéfice : cuir chevelu plus sain, racines renforcées.

### 3. Régulation sébacée
Normalise la production de sébum par les glandes sébacées en modifiant l'expression des gènes lipogéniques — utile pour les cuirs chevelus gras.

### 4. Antioxydant indirect
Précurseur du bêta-carotène, contribue à la protection contre le stress oxydatif des cellules folliculaires.

## Stabilité et formulation
Sensible à l'oxydation et à la lumière UV — encapsuler de préférence, ou associer au tocophérol. Éviter les formules à pH > 8.

## Concentration d'usage
- Soins cuir chevelu : 0,1–1%
- Shampoings traitants : 0,05–0,5%

> ⚠️ Éviter en cas de grossesse (précaution rétinoïde). Peut augmenter la photosensibilité du cuir chevelu.
`,
  },
  {
    name: 'Coenzyme Q10 (Ubiquinone)',
    slug: INGREDIENT_SLUGS.COENZYME_Q10_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Coenzyme liposoluble de la chaîne respiratoire mitochondriale, antioxydant puissant qui protège les cellules folliculaires du vieillissement oxydatif.',
    content: `
# Coenzyme Q10 (Ubiquinone)

Le coenzyme Q10 (ubiquinone-10) est une molécule quinonique liposoluble naturellement synthétisée par les cellules de l'organisme. Il joue un rôle central dans la chaîne de transport des électrons mitochondriaux (production d'ATP) et constitue l'un des antioxydants endogènes les plus puissants. Sa concentration dans le cuir chevelu diminue avec l'âge.

## INCI
**UBIQUINONE** (CAS: 303-98-0 | COSING: 59498)

## Mécanisme d'action

### 1. Antioxydant mitochondrial
L'ubiquinol (forme réduite du CoQ10) neutralise les espèces réactives de l'oxygène (ERO) générées dans les mitochondries des kératinocytes folliculaires. Protège l'ADN mitochondrial de l'oxydation — mécanisme directement lié au ralentissement du vieillissement du follicule.

### 2. Régénération de l'énergie cellulaire
Accélère la phosphorylation oxydative dans les cellules de la matrice du follicule, qui ont des besoins énergétiques élevés (division cellulaire rapide en phase anagène).

### 3. Synergie avec la vitamine E
Le CoQ10 régénère le tocophérol oxydé dans les membranes cellulaires, amplifiant l'effet antioxydant global.

### 4. Stimulation de la kératine
Des études in vitro montrent une augmentation de la synthèse de kératine de type I et II en présence de CoQ10, suggérant un renforcement de la structure de la fibre.

## Biodisponibilité capillaire
Molécule lipophile de haut poids moléculaire (863 Da) — pénétration limitée à la surface et aux couches superficielles. L'encapsulation liposomale ou en nanoparticules améliore significativement la délivrance cuticulaire.

## Concentration d'usage
0,01–0,1% dans sérums, masques et huiles capillaires.
`,
  },
  {
    name: 'Extrait de Bambou',
    slug: INGREDIENT_SLUGS.BAMBOU_EXTRACT_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Extrait riche en silice organique issu des entrenœuds de bambou, renforce la structure kératinique et améliore résistance et élasticité de la fibre.',
    content: `
# Extrait de Bambou (Bambusa Vulgaris Extract)

L'extrait de bambou est obtenu par extraction aqueuse ou hydro-alcoolique des entrenœuds de *Bambusa vulgaris* ou *Phyllostachys edulis*. Sa principale caractéristique est sa très haute teneur en silice organique (jusqu'à 70% de la matière sèche des entrenœuds), ce qui en fait la source végétale la plus concentrée en silicium biodisponible.

## INCI
**BAMBUSA VULGARIS EXTRACT** (CAS: 91771-32-3)

## Composition
- **Silice organique** (dioxyde de silicium, SiO₂) : actif principal
- Flavonoïdes (vitexine, orientine) : antioxydants
- Polysaccharides : humectants
- Acides aminés : tyrosine, cystéine (précurseurs kératine)

## Mécanisme d'action

### 1. Renforcement de la structure kératinique
Le silicium est un oligo-élément structurel qui s'intègre aux chaînes de kératine via des liaisons silicates. Il augmente la résistance à la traction et réduit la casse — particulièrement bénéfique sur cheveux fragilisés chimiquement.

### 2. Stimulation de la synthèse protéique folliculaire
La silice organique stimule la production de kératine et de collagène dans le derme du cuir chevelu, renforçant les follicules et soutenant la croissance capillaire.

### 3. Lissage de la cuticule
Les polysaccharides forment un film lissant sur les écailles cuticulaires, réduisant rugosité et frisottis.

### 4. Antioxydant flavonoïdique
Les flavonoïdes (vitexine, orientine) protègent les pigments de la mélanine et les lipides de la fibre contre la dégradation photo-oxydative.

## Concentration d'usage
1–5% dans shampoings, après-shampooings, masques et leave-ins.
`,
  },
  {
    name: 'Extrait de Romarin (Rosmarinus Officinalis Extract)',
    slug: INGREDIENT_SLUGS.ROMARIN_EXTRACT_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Extrait botanique riche en acide rosmarinique et en diterpènes, stimule la microcirculation du cuir chevelu et protège la fibre du stress oxydatif.',
    content: `
# Extrait de Romarin (Rosmarinus Officinalis Extract)

L'extrait de romarin est obtenu par extraction aqueuse, alcoolique ou CO₂ supercritique des feuilles de *Salvia rosmarinus* (syn. *Rosmarinus officinalis*). Riche en composés phénoliques et diterpéniques, il est l'un des extraits végétaux les mieux documentés pour la stimulation capillaire — une étude clinique (2015, *Skinmed*) a montré son efficacité comparable au minoxidil 2% sur l'alopécie androgénétique légère à modérée.

## INCI
**ROSMARINUS OFFICINALIS (ROSEMARY) LEAF EXTRACT** (CAS: 84604-14-8 | COSING: 92401)

## Composition
- **Acide rosmarinique** : antioxydant puissant, inhibiteur de la 5α-réductase
- **Acide carnosique / carnosol** : diterpènes antioxydants et anti-inflammatoires
- **Acide ursolique** : triterpène stimulant la croissance cellulaire
- 1,8-cinéole (dans l'huile essentielle) : activateur de microcirculation
- Flavonoïdes : lutéoline, apigénine

## Mécanisme d'action

### 1. Stimulation de la microcirculation folliculaire
L'acide rosmarinique et le 1,8-cinéole augmentent le débit sanguin local du cuir chevelu, améliorant l'apport en oxygène et nutriments aux cellules de la matrice folliculaire — mécanisme probablement comparable au minoxidil (vasodilatation locale).

### 2. Inhibition de la 5α-réductase
L'acide rosmarinique inhibe partiellement la 5α-réductase (enzyme convertissant la testostérone en DHT), réduisant l'effet androgénique sur les follicules sensibles.

### 3. Antioxydant multi-niveaux
Le carnosol et l'acide carnosique sont parmi les antioxydants végétaux les plus puissants (ORAC élevé). Protègent les lipides cuticulaires et les mélanocytes du cuir chevelu contre le stress oxydatif.

### 4. Anti-inflammatoire
Inhibe la COX-2 et la production de prostaglandines — réduit l'inflammation du cuir chevelu associée aux pellicules et à la dermite séborrhéique.

## Concentration d'usage
0,5–3% dans shampoings stimulants, sérums cuir chevelu et soins anti-chute.
`,
  },
  {
    name: 'Kaolin (Argile Blanche)',
    slug: INGREDIENT_SLUGS.KAOLIN_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Argile minérale douce à forte capacité d'adsorption, purifie le cuir chevelu en absorbant sébum et impuretés sans altérer la fibre.",
    content: `
# Kaolin (Argile Blanche)

Le kaolin est une argile minérale naturelle composée principalement de kaolinite (phyllosilicate d'aluminium hydraté). Extrait de gisements sédimentaires, il est l'argile la plus douce utilisée en cosmétique — moins desséchante que la bentonite ou l'argile verte, ce qui le rend adapté aux cuirs chevelus sensibles et aux formulations pour cheveux colorés.

## INCI
**KAOLIN** (CAS: 1332-58-7 | COSING: 37817)

## Composition minéralogique
- **Kaolinite** [Al₂Si₂O₅(OH)₄] : composant majoritaire (>80%)
- Quartz, feldspaths : traces
- Alumine, silice : constituants structurels

## Mécanisme d'action

### 1. Adsorption du sébum
La structure en feuillets de la kaolinite présente une large surface spécifique (10–20 m²/g). Elle adsorbe le sébum et les lipides oxydés par interactions de Van der Waals, purifiant le cuir chevelu sans savonification agressive.

### 2. Absorption des impuretés et toxines
Adsorbe les polluants lipophiles, les résidus de produits coiffants et les dépôts de calcaire sur la fibre et le cuir chevelu.

### 3. Régulation sébacée douce
Contrairement aux argiles plus actives (bentonite, montmorillonite), le kaolin n'appauvrit pas le cuir chevelu en lipides essentiels — purification sélective du surplus sébacé.

### 4. Texturant et opacifiant
En formulation, apporte corps et onctuosité aux shampoings secs, masques et poudres coiffantes. Opacifie légèrement les formules claires.

## Usages capillaires typiques
- Shampooings secs (base principale)
- Masques purifiant cuir chevelu
- Poudres volumisantes

## Concentration d'usage
- Shampoings / masques rinçables : 1–5%
- Shampoings secs : 10–50% (base)
`,
  },
  {
    name: 'Charbon Actif (Activated Charcoal)',
    slug: INGREDIENT_SLUGS.ACTIVATED_CHARCOAL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Carbone poreux à surface spécifique ultra-élevée, adsorbe les polluants, résidus de silicones et excès de sébum du cuir chevelu avec une efficacité supérieure aux argiles.',
    content: `
# Charbon Actif (Activated Charcoal / Charcoal Powder)

Le charbon actif est produit par activation thermique (vapeur d'eau à 800–1000°C ou activation chimique) de matières carbonées (coco, bois, os, charbon minéral). L'activation crée une structure microporeuse avec une surface spécifique considérable (500–1500 m²/g), conférant une capacité d'adsorption exceptionnelle.

## INCI
**CHARCOAL POWDER** (CAS: 16291-96-6 | COSING: 71771)

## Mécanisme d'action

### 1. Adsorption par porosité élevée
La surface microporeuse du charbon actif (500–1500 m²/g, vs ~15 m²/g pour le kaolin) crée une affinité de Van der Waals avec les molécules lipophiles. Adsorbe : sébum, silicones en accumulation, résidus de silicones cycliques (D4, D5), produits coiffants polymériques, polluants urbains (HAP, métaux lourds).

### 2. Purification en profondeur des pores folliculaires
Les microparticules de charbon pénètrent dans les ostiums folliculaires et en extraient les débris kératinisés, le sébum oxydé et les bactéries — effet "détox" du cuir chevelu.

### 3. Équilibrage du microbiome
En réduisant le sébum oxydé (substrat pour *Malassezia* et bactéries anaérobies), le charbon actif contribue à rééquilibrer le microbiome du cuir chevelu sans être directement antimicrobien.

## Différence charbon actif vs charbon de bambou
Le charbon actif classique (issu du coco ou du bois) présente généralement une surface spécifique plus élevée et un profil de purification plus intense. Le charbon de bambou est souvent positionné "naturel" avec une action plus douce.

## Formulation
Poudre noire intense — nécessite des conservateurs adaptés et une formule opaque ou noire. Peut colorer temporairement les cheveux très clairs (rinçage soigneux requis).

## Concentration d'usage
0,1–2% dans shampoings détox et masques purifiant cuir chevelu.
`,
  },
  {
    name: 'Charbon de Bambou (Bambou Charcoal)',
    slug: INGREDIENT_SLUGS.BAMBOU_CHARCOAL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Charbon obtenu par pyrolyse du bambou, alliant les propriétés adsorbantes du charbon actif et les oligo-éléments minéraux du végétal.',
    content: `
# Charbon de Bambou (Bamboo Charcoal)

Le charbon de bambou est produit par pyrolyse lente du bambou (*Moso bamboo*, *Phyllostachys pubescens*) à des températures de 800–1200°C. La structure microporeuse résultante conserve la structure tubulaire naturelle du bambou, avec une surface spécifique élevée (200–400 m²/g). Il est particulièrement populaire dans les cosmétiques d'inspiration asiatique.

## INCI
**BAMBUSA VULGARIS CHARCOAL** ou **BAMBOO CHARCOAL POWDER**

## Composition
- Carbone (>85%) : structure poreuse adsorbante
- Silice minérale, potassium, calcium : minéraux issus du végétal
- Structure mésoporeuse distinctive : canaux tubulaires du bambou préservés

## Mécanisme d'action

### 1. Adsorption sébum et impuretés
Surface microporeuse (200–400 m²/g) adsorbe le sébum, les résidus de produits coiffants et les polluants. Action légèrement moins intense que le charbon actif de coco, mais suffisante pour un usage capillaire régulier.

### 2. Purification du cuir chevelu
Élimine les résidus protéiques oxydés et les débris folliculaires accumulés. Favorise un cuir chevelu propre et "respirant".

### 3. Apport minéral
Contrairement au charbon actif classique, le charbon de bambou conserve des traces de silice et de minéraux (potassium, calcium, magnésium) pouvant bénéficier au cuir chevelu.

### 4. Régulation du pH
Propriétés légèrement alcalines (pH ~8–9 en suspension) — à contrebalancer avec des acides en formulation pour maintenir le pH capillaire optimal (4,5–5,5).

## Avantage naturel
Souvent certifiable naturel/Cosmos. Positionné comme alternative éco-responsable au charbon minéral.

## Concentration d'usage
0,5–3% dans shampoings, masques et soins détox cuir chevelu.
`,
  },
  {
    name: 'Sel Marin (Sea Salt / Sodium Chloride)',
    slug: INGREDIENT_SLUGS.SEA_SALT_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      "Chlorure de sodium d'origine marine, ajuste la viscosité des shampoings et des gels, exfolie le cuir chevelu et apporte du volume à la fibre.",
    content: `
# Sel Marin (Sea Salt / Sodium Chloride)

Le sel marin (chlorure de sodium) est obtenu par évaporation solaire d'eau de mer. En cosmétique capillaire, il joue plusieurs rôles selon sa granulométrie et sa concentration : régulateur rhéologique en solution, agent exfoliant en gros cristaux, et actif volumisant à faible concentration.

## INCI
**SODIUM CHLORIDE** (CAS: 7647-14-5 | COSING: 57278)

## Mécanisme d'action

### 1. Régulation de viscosité (effet épaississant)
Dans les shampoings à base de SLES/ALES, les ions Na⁺ et Cl⁻ modifient l'agrégation micellaire des tensioactifs : augmentent la longueur des micelles vermiculaires et donc la viscosité de la formule. Effet non-linéaire — au-delà d'un optimum (~2–4%), la viscosité rechute (effet Hofmeister).

### 2. Exfoliation du cuir chevelu (cristaux)
En granulométrie grossière (250–500 μm), les cristaux de sel marin exfolient mécaniquement le cuir chevelu, éliminant les squames et cellules mortes sans tensioactifs supplémentaires.

### 3. Effet volumisant sur la fibre
À faible concentration dans les brumes et sprays de plage, les ions Na⁺ et Cl⁻ créent une légère déshydratation osmotique superficielle de la cuticule, gonflant la fibre et créant le classique "effet cheveux de plage" (texture, volume, tenue légère).

### 4. Conservateur auxiliaire
À concentrations >0,5%, inhibe partiellement la prolifération microbienne dans la phase aqueuse.

## Points d'attention
- Peut assécher sur utilisation prolongée (cheveux secs/colorés/chimiquement traités)
- En spray volumisant : limiter à 1–3% pour l'effet sans dessèchement

## Concentration d'usage
- Épaississant shampoing : 0,5–4%
- Exfoliant cuir chevelu : 5–20% (scrub)
- Spray volumisant "beach waves" : 1–3%
`,
  },
  {
    name: 'Poudre de Shikakai (Acacia Concinna)',
    slug: INGREDIENT_SLUGS.SHIKAKAI_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Poudre ayurvédique issue des gousses d'Acacia concinna, naturellement riche en saponines lavantes douces et en acide ascorbique, nettoie et fortifie la fibre sans agresser le cuir chevelu.",
    content: `
# Poudre de Shikakai (Acacia Concinna Pod Powder)

Le shikakai ("fruit pour les cheveux" en sanskrit) est une liane légumineuse (*Acacia concinna*) dont les gousses sont utilisées depuis des siècles en Ayurveda pour laver et soigner les cheveux. La poudre est obtenue par séchage et broyage des gousses. Actif clé des "no-poo" et formules capillaires naturelles.

## INCI
**ACACIA CONCINNA FRUIT POWDER** (CAS: 84697-47-2)

## Composition
- **Saponines** (schikakai saponines, acacia saponines) : tensioactifs naturels
- **Acide ascorbique** (vitamine C) : antioxydant, stimulant de la synthèse collagénique
- **Tanins** : astringents, régulateurs sébacés
- **Flavonoïdes** : luteoline, quercétine (anti-inflammatoires)
- Acides aminés essentiels : lysine, cystéine

## Mécanisme d'action

### 1. Nettoyage par saponines
Les saponines du shikakai sont des tensioactifs amphotères naturels. Elles forment de la mousse en milieu aqueux et émulsifient les graisses et impuretés. pH naturel ~4,5–5,5 — presque idéalement adapté au cheveu, contrairement aux shampoings sodiques.

### 2. Renforcement de la fibre
La vitamine C stimule la synthèse de collagène dans le derme péri-folliculaire. La cystéine est un précurseur direct des ponts disulfure de la kératine.

### 3. Action antiparasitaire et antifongique
Des études in vitro montrent une activité antifongique (*Malassezia*) et antiparasitaire (*Pediculus humanus*) des extraits de shikakai — usage traditionnel confirmé par la recherche.

### 4. Régulation sébacée
Les tanins ressèrent les pores du cuir chevelu et régulent la production de sébum sans dessécher.

## Usage et formulation
Utilisé en poudre (mélangée à l'eau ou avec reetha/amla) ou comme extrait aqueux dans les formules liquides.

## Concentration d'usage
- Poudre en masque : 10–30% (mélange avec eau)
- Extrait en shampoing : 1–5%
`,
  },
  {
    name: 'Poudre de Reetha (Sapindus Mukorossi)',
    slug: INGREDIENT_SLUGS.REETHA_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Poudre de noix de lavage ayurvédique à haute teneur en saponines triterpéniques, agent moussant naturel purifiant et anti-pelliculaire.',
    content: `
# Poudre de Reetha (Sapindus Mukorossi — Soapnut)

Le reetha (noix de lavage, "soap nut") est le péricarpe séché des fruits de *Sapindus mukorossi*, arbre de la famille des Sapindacées cultivé en Inde et au Népal. Utilisé en Ayurveda depuis des millénaires, il constitue l'un des détergents naturels les plus puissants d'origine végétale.

## INCI
**SAPINDUS MUKOROSSI FRUIT EXTRACT** ou **SAPINDUS MUKOROSSI PEEL POWDER** (CAS: 84929-62-4)

## Composition
- **Saponines triterpéniques** (sapindoside A, B, C) : 8–15% du poids sec — actifs principaux
- **Mucorosine** : saponine spécifique à S. mukorossi
- Tanins : propriétés astringentes
- Alcaloïdes : activité antimicrobienne légère

## Mécanisme d'action

### 1. Tensioactivité naturelle puissante
Les sapindosides sont des saponines triterpéniques de type oléanane. En solution aqueuse, leurs propriétés amphiphiles (tête hydrophile polaire + queue lipophile) forment des micelles lavantes, émulsifiant efficacement graisses, silicones et résidus de produits coiffants.

### 2. Activité antifongique et anti-pelliculaire
Des études montrent une activité inhibitrice sur *Malassezia furfur*, principal pathogène impliqué dans les pellicules et la dermite séborrhéique du cuir chevelu.

### 3. Douceur sur la fibre
Malgré une puissance nettoyante élevée, les saponines du reetha respectent la couche lipidique (18-MEA) de la cuticule mieux que les sulfates, préservant l'hydrophobie naturelle de la fibre.

### 4. pH naturellement acide
En solution aqueuse (~pH 4,5–5,5), idéalement adapté au cheveu — ferme les écailles cuticulaires post-lavage.

## Usage
Souvent associé au shikakai et à l'amla (trio ayurvédique classique) en masque de lavage ou shampoing en poudre.

## Concentration d'usage
- Masque lavant en poudre : 20–50%
- Extrait en shampoing liquide : 2–8%
`,
  },
  {
    name: "Poudre d'Amla (Phyllanthus Emblica)",
    slug: INGREDIENT_SLUGS.AMLA_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Poudre de groseille indienne exceptionnellement riche en vitamine C et en tanins hydrolysables, stimule la croissance capillaire, renforce la fibre et prévient le grisonnement prématuré.',
    content: `
# Poudre d'Amla (Phyllanthus Emblica / Indian Gooseberry)

L'amla (groseille indienne, amalaki) est le fruit séché de *Phyllanthus emblica* (syn. *Emblica officinalis*), pilier de l'Ayurveda depuis 5000 ans. C'est l'une des sources végétales les plus concentrées en vitamine C (jusqu'à 20× plus que l'orange à poids égal), stabilisée par les tanins qui empêchent son oxydation.

## INCI
**PHYLLANTHUS EMBLICA FRUIT POWDER** (CAS: 90028-08-3)

## Composition
- **Acide ascorbique** (vitamine C) : 600–900 mg/100g — exceptionnellement stable grâce aux tanins
- **Tanins hydrolysables** : acide emblicanine A et B, punigluconine, pedunculagine (antioxydants puissants)
- **Galloellagitanins** : principaux antioxydants de la fraction polyphénolique
- **Acide gallique, acide ellagique** : anti-inflammatoires, antifongiques
- Rutine, quercétine (flavonoïdes) : vaso-protecteurs folliculaires

## Mécanisme d'action

### 1. Stimulation de la croissance capillaire
La vitamine C est essentielle à la synthèse du collagène dans le derme péri-folliculaire. Elle stimule également les fibroblastes de la papille dermique — directement liée à la croissance en phase anagène.

### 2. Inhibition de la 5α-réductase
Les tanins hydrolysables, notamment l'acide emblicanine B, inhibent la 5α-réductase, réduisant la conversion de testostérone en DHT — mécanisme anti-alopécique androgénétique.

### 3. Protection des mélanocytes et anti-grisonnement
L'acide gallique et les galloellagitanins protègent les mélanocytes folliculaires du stress oxydatif (cause principale du grisonnement prématuré). Effets documentés en Ayurveda et partiellement confirmés par des études in vitro.

### 4. Conditionnement et brillance
Les tanins interagissent avec les protéines de la cuticule, la ressèrent et lui confèrent brillance et douceur. Propriété astringente qui réduit le gonflement de la fibre.

## Usage classique
Associé au shikakai et au reetha (trio lavant ayurvédique), ou en soin seul mélangé à l'huile de coco ou d'amande.

## Concentration d'usage
- Masque en poudre : 10–30%
- Extrait en soin capillaire : 1–5%
`,
  },
  {
    name: 'Bis-Aminopropyl Diglycol Dimaleate',
    slug: INGREDIENT_SLUGS.BIS_AMINOPROPYL_DIGLYCOL_DIMALEATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Actif exclusif d'Olaplex, reconstruit les ponts disulfure brisés de la kératine à l'intérieur de la fibre capillaire — le seul traitement capillaire à réparer structurellement la kératine.",
    content: `
# Bis-Aminopropyl Diglycol Dimaleate (Olaplex Bond Multiplier)

Le bis-aminopropyl diglycol dimaléate est la molécule brevetée (US 9,566,217 — Olaplex Inc., 2014) qui constitue la base de la technologie Olaplex. Développée par les chimistes Dr Craig Hawker et Dr Eric Pressley, elle représente la première innovation structurellement démontrée dans la réparation des ponts disulfure intra-kératiniques. Présente dans les produits Olaplex N°1 à N°9.

## INCI
**BIS-AMINOPROPYL DIGLYCOL DIMALEATE** (CAS: 1429522-68-6)

## Structure chimique
Molécule bifonctionnelle à deux groupes maléamide et deux groupes amine terminaux, reliés par une chaîne diglycol. La bifunctionnalité est la clé de son mécanisme : elle peut se lier simultanément à deux chaînes de kératine distinctes.

## Mécanisme d'action

### 1. Liaison aux thiol libres de la kératine
Les liaisons kératiniques thiol (-SH) exposées résultent de la rupture des ponts disulfure (-S-S-) causée par la décoloration, la permanente ou les dégâts thermiques. Le bis-aminopropyl diglycol dimaléate se lie covalemment aux thiols libres via réaction thiol-Michael (addition thiol sur double liaison maléamide).

### 2. Pontage inter-chaînes kératiniques
Étant bifonctionnel, chaque molécule peut connecter deux chaînes de kératine distinctes — reconstituant mécaniquement le réseau de pontage inter-chaînes équivalent aux ponts disulfure natifs.

### 3. Action pendant le process chimique
Formulé à pH 5,5–6,5, il reste actif pendant la décoloration ou la permanente, reconstruisant les liens au fur et à mesure que les peroxyde/bisulfite en brisent d'autres — réduction nette des dommages.

### 4. Accumulation avec les cycles de soins
Les traitements répétés augmentent la densité de pontage — amélioration progressive de la résistance à la traction, de l'élasticité et de la brillance.

## Preuves cliniques
Études Olaplex (microscopie électronique SEM, résistance à la traction) : réduction significative de la casse (-50%) vs contrôle, augmentation de l'élasticité mesurée par traction dynamique.

## Concentration d'usage
0,1–1% selon le produit. N°1 (concentré professionnel) : ~1%. N°3–9 (grande distribution) : 0,1–0,5%.
`,
  },
  {
    name: 'Hydroxypropyl Cyclodextrine (Hydroxypropyl Cyclodextrin)',
    slug: INGREDIENT_SLUGS.HYDROXYPROPYL_CYCLODEXTRIN,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Oligosaccharide cyclique modifié capable d'encapsuler des molécules lipophiles, améliore la solubilité et la délivrance des actifs dans la fibre et élimine les odeurs par inclusion moléculaire.",
    content: `
# Hydroxypropyl Cyclodextrine (HP-β-CD)

L'hydroxypropyl bêta-cyclodextrine (HP-β-CD) est un oligosaccharide cyclique dérivé de l'amidon par cyclisation enzymatique puis substitution des hydroxyles par des groupes hydroxypropyle. Sa structure en "tronc de cône" creux définit une cavité hydrophobe interne et une surface externe hydrophile — propriété centrale de toutes ses applications.

## INCI
**HYDROXYPROPYL CYCLODEXTRIN** (CAS: 128446-35-5 | COSING: 71767)

## Structure
Anneau de 7 unités glucosidiques (β-cyclodextrine modifiée) formant une cavité toroïdale de diamètre interne ~6–6,5 Å. Les groupes hydroxypropyle externes augmentent la solubilité aqueuse et réduisent la toxicité rénale vs la β-CD native.

## Mécanisme d'action

### 1. Encapsulation moléculaire (complexe d'inclusion)
La cavité hydrophobe interne peut encapsuler des molécules lipophiles de taille appropriée (huiles essentielles, actifs lipidiques, fragrances) par interactions de Van der Waals. Le complexe d'inclusion est soluble dans l'eau — permettant de formuler des actifs lipophiles dans une phase aqueuse sans émulsifiant.

### 2. Amélioration de la biodisponibilité
Les actifs encapsulés sont libérés progressivement en contact avec la fibre ou le cuir chevelu (compétition avec les lipides cuticulaires) — délivrance contrôlée améliorant l'efficacité à concentration plus faible.

### 3. Neutralisation des odeurs (odor capture)
La HP-β-CD encapsule les molécules odorantes hydrophobes (ammoniac résiduel post-coloration, mercaptans, aldéhydes de transpiration) et les piège durablement. Mécanisme différent des masquants olfactifs classiques : neutralisation physique, non masquage chimique.

### 4. Vecteur de livraison de la kératine et des protéines
Améliore la pénétration des peptides kératiniques hydrolysés de faible PM dans les zones déficientes de la fibre.

## Concentration d'usage
1–5% dans shampoings, après-shampooings, traitements post-coloration et déodorants capillaires.
`,
  },
  {
    name: 'Phytantriol',
    slug: INGREDIENT_SLUGS.PHYTANTRIOL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Alcool triterpénique biomimétique dérivé de la phytol (chlorophylle), conditionneur de cuticule d'exception qui apporte brillance, douceur et protection thermique sans alourdir.",
    content: `
# Phytantriol (3,7,11,15-Tetramethyl-1,2,3-hexadecanetriol)

Le phytantriol est un alcool trimétylé à longue chaîne (C20) dérivé par réduction du phytol, constituant de la queue lipophile de la chlorophylle. Naturellement présent dans de nombreuses huiles végétales à l'état de traces, il est produit synthétiquement pour usage cosmétique. Son profil de performance sur cuticule le distingue des conditionneurs classiques.

## INCI
**PHYTANTRIOL** (CAS: 768-01-4 | COSING: 75858)

## Structure chimique
Alcool tertiaire à longue chaîne (C20) avec trois groupes hydroxyle, quatre méthyles en position 3, 7, 11, 15. La ramification méthylique éloigne les molécules entre elles, évitant l'agrégation — d'où l'absence d'effet lourd ou gras.

## Mécanisme d'action

### 1. Adsorption sur la cuticule
Les trois groupes OH forment des liaisons hydrogène avec les groupes polaires de la kératine cuticulaire. Adsorption douce et réversible, sans occlusion excessive — conditionnement léger même sur cheveux fins.

### 2. Lissage des écailles cuticulaires
Le phytantriol s'intercale entre les écailles de la cuticule, remplissant les micro-espaces et réduisant la rugosité de surface. Résultats : brillance améliorée, réduction du coefficient de friction, détressage facilité.

### 3. Protection thermique
Le film lipidique léger formé sur la cuticule tamponne le choc thermique du brushing et du lissage. Des mesures calorimétriques montrent une augmentation de la température de dénaturation de la kératine en présence de phytantriol.

### 4. Hydratation sans film occlusif
La structure ramifiée du phytantriol réduit son effet occlusif tout en maintenant l'hydratation — bénéfice sur cheveux fins pour lesquels les conditionneurs classiques (huiles, cétyl alcool) alourdissent.

## Avantage formulatoire
Compatible certifications naturelles. Non filmogène au sens classique — adapté aux formules "légères" pour cheveux fins ou facilement alourdis.

## Concentration d'usage
0,1–1% dans après-shampooings, leave-ins, crèmes de coiffage et protecteurs thermiques.
`,
  },
  {
    name: 'Extrait de Noni (Morinda Citrifolia Fruit Extract)',
    slug: INGREDIENT_SLUGS.MORINDA_CITRIFOLIA_EXTRACT,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Extrait riche en proxéronine et en antioxydants phénoliques issu du fruit du noni polynésien, stimule la régénération cellulaire du cuir chevelu et protège la fibre du vieillissement oxydatif.',
    content: `
# Extrait de Noni (Morinda Citrifolia Fruit Extract)

Le noni (*Morinda citrifolia*) est un arbuste des régions tropicales (Polynésie, Asie du Sud-Est) dont les fruits mûrs sont utilisés en médecine traditionnelle polynésienne depuis plus de 2000 ans. L'extrait cosmétique est obtenu par fermentation contrôlée ou extraction aqueuse/alcoolique du fruit.

## INCI
**MORINDA CITRIFOLIA FRUIT EXTRACT** (CAS: 91770-97-7)

## Composition
- **Proxéronine** : précurseur de la xéronine (alcaloïde) impliquée dans la régulation des récepteurs protéiques cellulaires
- **Scopolétine** : coumarine anti-inflammatoire, vasodilatatrice
- **Damnacanthal** : anthraquinone, activité antimicrobienne et antiproliférative
- **Acide ascorbique, vitamine C** : antioxydants
- **Polysaccharides** : β-glucanes, humectants immunomodulateurs
- **Acides gras** (acide caprylique, acide caproïque) : propriétés antimicrobiennes

## Mécanisme d'action

### 1. Stimulation cellulaire via la proxéronine
La proxéronine se combine avec la proxéronase intestinale pour former la xéronine, qui activerait des récepteurs protéiques membranaires. Hypothèse : amélioration du métabolisme cellulaire des kératinocytes et fibroblastes péri-folliculaires.

### 2. Vasodilatation folliculaire
La scopolétine inhibe la sérotonine et agit comme vasodilatateur local — amélioration du débit sanguin folliculaire et de l'apport en nutriments aux cellules de la matrice.

### 3. Activité antifongique et antimicrobienne
Le damnacanthal et les acides gras à chaîne courte (acide caprylique) exercent une activité inhibitrice sur *Malassezia* et *Candida albicans* — bénéfique sur cuirs chevelus à tendance pelliculaire.

### 4. Antioxydant polyphénolique
Les anthraquinones et la vitamine C protègent les mélanocytes et les cellules folliculaires du stress oxydatif.

## Concentration d'usage
1–5% dans shampoings traitants, sérums cuir chevelu et soins anti-chute.
`,
  },
  {
    name: "Extrait d'Açaï (Euterpe Oleracea Fruit Extract)",
    slug: INGREDIENT_SLUGS.EUTERPE_OLERACEA_EXTRACT,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Extrait de baie d'açaï amazonienne à très haute densité antioxydante (ORAC parmi les plus élevés), protège la kératine et les pigments de la fibre contre la dégradation oxydative.",
    content: `
# Extrait d'Açaï (Euterpe Oleracea Fruit Extract)

L'açaï est le fruit du palmier *Euterpe oleracea*, originaire des forêts tropicales d'Amazonie. Sa réputation de "superfruit" repose sur une densité exceptionnelle en anthocyanes et en acides gras — l'un des scores ORAC (Oxygen Radical Absorbance Capacity) les plus élevés mesurés dans un fruit. En cosmétique capillaire, il est utilisé comme antioxydant de haute performance.

## INCI
**EUTERPE OLERACEA FRUIT EXTRACT** (CAS: 187150-09-0)

## Composition
- **Anthocyanes** (cyanidine-3-glucoside, cyanidine-3-rutinoside) : ~3–4 g/100g — pigments antioxydants puissants
- **Acide oléique (oméga-9)** : ~56% des acides gras
- **Acide palmitique** : ~24%
- **Phytostérols** (β-sitostérol, campestérol) : anti-inflammatoires
- **Vitamine E** (tocophérols)
- **Resvératrol** : polyphénol stilbénoïde
- **Protéines, acides aminés** : nutrition fibre

## Mécanisme d'action

### 1. Protection antioxydante multi-niveaux
Les anthocyanes neutralisent les radicaux superoxyde (O₂•⁻), hydroxyle (•OH) et peroxyle (ROO•) avec une efficacité 4× supérieure à la vitamine E et 20× supérieure à la vitamine C (ORAC). Protège les lipides cuticulaires (18-MEA) et les pigments de la mélanine contre la photo-oxydation.

### 2. Prévention de la décoloration (photo-protection indirecte)
La protection des mélanocytes et des pigments de la fibre contre l'oxydation UV limite le jaunissement des cheveux blonds et le ternissement des cheveux colorés.

### 3. Nutrition lipidique de la cuticule
Les acides gras (oléique, palmitique) nourrissent la couche lipidique cuticulaire, restaurant l'hydrophobie naturelle et la brillance.

### 4. Anti-inflammatoire cuir chevelu
Les phytostérols inhibent la synthèse de prostaglandines et de cytokines pro-inflammatoires — apaisant sur cuirs chevelus réactifs.

## Concentration d'usage
1–5% dans masques, sérums et huiles capillaires enrichies.
`,
  },
  {
    name: 'Extrait de Grenade (Punica Granatum Extract)',
    slug: INGREDIENT_SLUGS.PUNICA_GRANATUM_EXTRACT,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Extrait polyphénolique de grenade issu des graines et de l'écorce, puissant antioxydant et stimulant de la kératinisation folliculaire grâce à ses ellagitanins.",
    content: `
# Extrait de Grenade (Punica Granatum Extract)

L'extrait de grenade est obtenu des graines, de l'écorce et du péricarpe de *Punica granatum*. Parmi les végétaux les plus riches en polyphénols antioxydants, la grenade contient notamment de la punicalagine — un ellagitanin de haut poids moléculaire dont l'activité antioxydante (ORAC) dépasse celle du thé vert et du vin rouge.

## INCI
**PUNICA GRANATUM FRUIT EXTRACT** (CAS: 84012-42-8) — graine : **PUNICA GRANATUM SEED OIL** (CAS: 84012-42-8)

## Composition
- **Punicalagine** (ellagitanin) : antioxydant majeur, inhibiteur de la 5α-réductase
- **Acide ellagique** : polyphénol anti-inflammatoire, anti-tyrosinase
- **Acide punique (punicic acid)** : acide gras conjugué C18:3 Ω-5 unique à la grenade, anti-inflammatoire puissant
- Anthocyanes (delphinidin, cyanidine, pélargonidine) : antioxydants
- Vitamine C : cofacteur synthèse kératine/collagène

## Mécanisme d'action

### 1. Protection antioxydante exceptionnelle
La punicalagine est hydrolysée en acide ellagique et urolithines (par le microbiome) — métabolites à forte activité antioxydante et anti-inflammatoire prolongée.

### 2. Stimulation de la kératinisation folliculaire
Des études in vitro montrent que l'extrait de grenade stimule la prolifération des kératinocytes de la gaine épithéliale externe du follicule, soutenant la croissance en phase anagène.

### 3. Inhibition de la 5α-réductase
La punicalagine et l'acide ellagique inhibent la 5α-réductase de type II — mécanisme anti-androgénique local au niveau du cuir chevelu.

### 4. Prévention du grisonnement
L'acide ellagique inhibe la tyrosinase (enzyme de synthèse de la mélanine) mais aussi protège les mélanocytes du stress oxydatif. À faible concentration, l'effet net est protecteur des pigments existants.

### 5. Anti-inflammatoire du cuir chevelu
L'acide punique inhibe NF-κB et la production d'IL-1β — anti-inflammatoire puissant sur cuirs chevelus irrités ou sujets à la dermite.

## Concentration d'usage
1–5% dans shampoings traitants, sérums et masques cuir chevelu anti-chute.
`,
  },
  {
    name: 'Palmitoyl Myristyl Serinate',
    slug: INGREDIENT_SLUGS.PALMITOYL_MYRISTYL_SERINATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Ester lipopeptidique biomimétique de la 18-MEA capillaire, restaure la couche lipidique externe hydrophobe de la cuticule et réduit le coefficient de friction de la fibre.',
    content: `
# Palmitoyl Myristyl Serinate

Le palmitoyl myristyl serinate est un ester lipopeptidique de synthèse composé d'un acide aminé (sérine) et de deux chaînes acyle lipidiques (palmitoyle C16 et myristyle C14). Sa structure est conçue pour mimer la 18-méthyleicosénoïque (18-MEA), la graisse liée à la cuticule par liaison thioester qui confère aux cheveux sains leur hydrophobie et leur brillance naturelles.

## INCI
**PALMITOYL MYRISTYL SERINATE** (CAS: 91080-38-5)

## Rôle biomimétique : la 18-MEA
La 18-MEA est un acide gras ramifié unique (acide 18-méthyleicosénoïque) qui recouvre chaque écaille cuticulaire par une liaison thioester à la cystéine. C'est elle qui rend les cheveux naturellement lisses, brillants et non-électriques. La décoloration, la permanente et les dommages thermiques brisent cette liaison, laissant la cuticule nue, rugueuse et hydrophile.

## Mécanisme d'action

### 1. Restauration du film lipidique cuticulaire
Le palmitoyl myristyl serinate se dépose sur la cuticule et reconstitue un film lipidique hydrophobe à la surface des écailles — analogie fonctionnelle avec la 18-MEA native. Résultat : réduction du coefficient de friction interfibres, brillance restaurée, réduction des nœuds.

### 2. Lissage et fermeture des écailles
La couche lipidique restaurée ferme les microespaces entre écailles, réduisant la porosité de la cuticule et limitant l'absorption d'eau (et donc le gonflement osmotique responsable du frisottis en humidité élevée).

### 3. Réduction de l'électricité statique
La couche lipidique externe est un isolant électrique : elle empêche l'accumulation de charges électrostatiques sur la fibre sèche — réduction significative du fly-away et du volume indésirable.

### 4. Protection contre la friction
Film lubrifiant qui réduit les dommages mécaniques lors du démêlage, du brushing et de la friction entre fibres.

## Applications prioritaires
Soins post-décoloration, post-permanente, traitements anti-porosité et leave-ins lissants pour cheveux abîmés.

## Concentration d'usage
0,5–3% dans après-shampooings, masques de réparation et leave-ins.
`,
  },
]

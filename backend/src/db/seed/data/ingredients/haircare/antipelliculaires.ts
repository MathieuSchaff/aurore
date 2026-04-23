import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_ANTIPELLICULAIRES: IngredientInput[] = [
  {
    name: 'Pyrithione de Zinc (Zinc Pyrithione)',
    slug: INGREDIENT_SLUGS.ZINC_PYRITHIONE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Antifongique et antibactérien de référence contre Malassezia, réduit les squames et les démangeaisons du cuir chevelu.',
    content: `
# Pyrithione de Zinc (Zinc Pyrithione)

Le pyrithione de zinc (ZPT) est un composé organosoufré du zinc utilisé depuis les années 1960 dans les shampoings antipelliculaires. C'est l'actif le plus largement étudié et formulé pour la dermite séborrhéique et les pellicules.

## INCI
**ZINC PYRITHIONE** (CAS: 13463-41-7 | COSING: 60418)

## Mécanisme d'action

### 1. Inhibition fongique (Malassezia)
Le ZPT perturbe le transport membranaire des ions hydrogène dans les levures du genre *Malassezia* (*M. globosa*, *M. restricta*), principales responsables des pellicules. Cette perturbation entraîne une dépolarisation membranaire et la mort cellulaire fongique.

### 2. Activité antibactérienne
Inhibe également la croissance de bactéries à Gram+ et Gram- par le même mécanisme ionique — contribue à rééquilibrer le microbiome du cuir chevelu.

### 3. Action cytotoxique sur les kératinocytes hyperproliférants
Réduit le taux de prolifération des kératinocytes du cuir chevelu, diminuant ainsi la production de squames sans provoquer d'atrophie.

### 4. Propriétés anti-inflammatoires
Inhibe la synthèse de cytokines pro-inflammatoires (IL-1α, TNF-α) au niveau du cuir chevelu irrité.

## Concentration d'usage

- Shampoings grand public : 0,5–1%
- Produits médicaux OTC (US/EU) : jusqu'à 2%
- Laissé en contact (traitement ciblé) : 0,1–0,5%

> ⚠️ Substance réglementée — concentrations maximales définies par la réglementation cosmétique européenne (Règlement 1223/2009, Annexe V). Non autorisé en Cosmos/Ecocert.
`,
  },
  {
    name: 'Piroctone Olamine',
    slug: INGREDIENT_SLUGS.PIROCTONE_OLAMINE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Antifongique de nouvelle génération, plus efficace et mieux toléré que le pyrithione de zinc, actif de choix pour les formules antipelliculaires modernes.',
    content: `
# Piroctone Olamine

La piroctone olamine (sel d'éthanolamine de l'acide 1-hydroxy-4-méthyl-6-(2,4,4-triméthylpentyl)-2(1H)-pyridinone) est un antifongique développé dans les années 1980 comme alternative au pyrithione de zinc. Elle est aujourd'hui l'actif antipelliculaire le plus utilisé dans les formules cosmétiques premium.

## INCI
**PIROCTONE OLAMINE** (CAS: 68890-66-4 | COSING: 75582)

## Mécanisme d'action

### 1. Chélation des ions métalliques essentiels
La piroctone olamine séquestre le fer et d'autres cations métalliques indispensables au métabolisme de *Malassezia*. Sans ces cofacteurs, les enzymes fongiques (lipases, phospholipases) sont inactivées et la levure ne peut pas dégrader le sébum en acides gras irritants.

### 2. Perturbation de la membrane fongique
Interfère avec la synthèse des stérols membranaires (ergostérol) des levures, fragilisant leur paroi cellulaire.

### 3. Action kératorégulatrice
Normalise le turn-over des kératinocytes du cuir chevelu, réduisant la production excessive de squames sans effets cytotoxiques à faible dose.

### 4. Propriétés anti-inflammatoires
Inhibe la production de leucotriènes et de prostaglandines au niveau du cuir chevelu, réduisant les démangeaisons et rougeurs associées.

## Avantages vs pyrithione de zinc

- Efficace à doses plus faibles (0,5% vs 1%)
- Meilleure solubilité dans les phases aqueuses et tensioactives
- Compatible avec les certifications naturelles/Ecocert sous conditions
- Profil de tolérance supérieur, moins de résidus colorants sur cheveux colorés

## Concentration d'usage

- Shampoings : 0,3–0,5%
- Après-shampooings, leave-ins antipelliculaires : 0,1–0,3%
`,
  },
  {
    name: 'Sulfure de Sélénium (Selenium Sulfide)',
    slug: INGREDIENT_SLUGS.SELENIUM_SULFIDE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Actif antipelliculaire puissant à double mécanisme antifongique et cytostatique, réservé aux traitements médicamenteux OTC en raison de son profil réglementaire strict.',
    content: `
# Sulfure de Sélénium (Selenium Sulfide)

Le sulfure de sélénium (SeS₂) est un composé inorganique utilisé comme actif antipelliculaire et antifongique depuis les années 1950. En raison de son profil d'innocuité, il est principalement formulé dans des produits médicamenteux (OTC aux États-Unis, prescription dans certains pays européens).

## INCI
**SELENIUM SULFIDE** (CAS: 7488-56-4)

## Mécanisme d'action

### 1. Activité cytostatique
Inhibe la synthèse d'ADN et la mitose des kératinocytes du cuir chevelu hyperproliférants — mécanisme rare parmi les actifs antipelliculaires, très efficace sur les squames épaisses et grasses.

### 2. Inhibition enzymatique fongique
Les ions séléniures libérés perturbent les chaînes respiratoires mitochondriales des levures *Malassezia*, entraînant leur apoptose.

### 3. Activité antifongique à large spectre
Également actif contre *Tinea versicolor* (pityriasis versicolor) causé par *Malassezia furfur* — indication thérapeutique distincte des shampoings antipelliculaires classiques.

### 4. Réduction du sébum résiduel
Diminue l'activité des glandes sébacées par action locale, réduisant le substrat lipidique disponible pour *Malassezia*.

## Concentration d'usage

- Shampoings médicamenteux OTC : 1% (États-Unis, Australie)
- Formulations sur prescription : 2,5%

> ⚠️ Concentrations >1% nécessitent une ordonnance dans de nombreux pays. Toxique en cas d'ingestion. Peut décolorer cheveux blonds ou traités chimiquement à usage prolongé.
`,
  },
  {
    name: 'Acide Salicylique (Salicylic Acid)',
    slug: INGREDIENT_SLUGS.SALICYLIC_ACID_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Bêta-hydroxy acide kératolytique qui exfolie le cuir chevelu en dissolisant le ciment intercornéocytaire, libère les squames et améliore la pénétration des autres actifs antipelliculaires.',
    content: `
# Acide Salicylique (Salicylic Acid)

L'acide salicylique (2-hydroxybenzoïque) est un bêta-hydroxy acide (BHA) d'origine naturelle (écorce de saule, *Salix alba*) ou synthétique. En formulation capillaire, il agit essentiellement comme kératolytique et peut être associé à d'autres antifongiques pour une action antipelliculaire synergique.

## INCI
**SALICYLIC ACID** (CAS: 69-72-7 | COSING: 14280)

## Mécanisme d'action

### 1. Kératolyse
Dissout les liaisons intercornéocytaires (desmosomes) de la couche cornée du cuir chevelu en solubilisant le ciment protéique. Facilite le détachement et l'élimination des squames adhérentes — indispensable en cas de dermite séborrhéique croûteuse.

### 2. Réduction de la cohésion squameuse
Abaisse le pH local, ce qui modifie l'activité des protéases endogènes régulatrices de la desquamation. Résultat : desquamation normalisée plutôt qu'hyperprolification.

### 3. Propriétés antimicrobiennes directes
À concentrations ≥2%, exerce une activité bactériostatique et fongistatique de contact — complémentaire aux antifongiques co-formulés.

### 4. Amélioration de la pénétration
En dissolvant les squames obstruantes, l'acide salicylique améliore la pénétration cutanée des actifs co-formulés (ZPT, piroctone olamine, etc.).

## Réglementation

Classé dans l'Annexe III du Règlement cosmétique 1223/2009 : concentration max 3% (rinçage) et 2% (sans rinçage). Interdit dans les produits pour enfants < 3 ans. Non autorisé Cosmos.

## Concentration d'usage

- Shampoings kératolytiques : 1–3%
- Traitements ciblés cuir chevelu : 0,5–2%
`,
  },
  {
    name: 'Kétoconazole (Ketoconazole)',
    slug: INGREDIENT_SLUGS.KETOCONAZOLE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Antifongique azolé à action ciblée sur la biosynthèse de l'ergostérol fongique, traitement de référence de la dermite séborrhéique modérée à sévère.",
    content: `
# Kétoconazole (Ketoconazole)

Le kétoconazole est un antifongique azolé synthétique développé dans les années 1970. C'est le traitement de référence de la dermite séborrhéique sévère et des mycoses cutanées. En cosmétique capillaire, il est principalement utilisé dans des formules médicales ou à la limite prescription/OTC selon les pays.

## INCI
**KETOCONAZOLE** (CAS: 65277-42-1)

## Mécanisme d'action

### 1. Inhibition de la 14α-déméthylase (CYP51)
Inhibe l'enzyme fongique CYP51 (lanosterol 14α-déméthylase), bloquant la conversion du lanostérol en ergostérol — composant essentiel de la membrane cellulaire des champignons. Sans ergostérol, la membrane perd son intégrité et la levure meurt.

### 2. Fungicide à faibles concentrations
Contrairement à de nombreux antifongiques qui sont fongistatiques (inhibent la croissance), le kétoconazole est fungicide (tue les cellules fongiques) à des concentrations thérapeutiques, assurant une éradication plutôt qu'une simple suppression.

### 3. Activité anti-androgène locale
Propriété secondaire : inhibe la synthèse locale de dihydrotestostérone (DHT) via inhibition partielle de la 5α-réductase au niveau folliculaire. Intérêt potentiel dans la perte de cheveux androgénétique (données cliniques limitées à 2%).

### 4. Propriétés anti-inflammatoires
Réduit la production de cytokines pro-inflammatoires au niveau du cuir chevelu.

## Statut réglementaire

- **EU** : OTC jusqu'à 2% en shampoing (Directive cosmétique 76/768/CEE antérieure, statut ambigu sous 1223/2009 — souvent classé médicament)
- **US** : Prescription uniquement à 2% ; OTC 1% (Nizoral A-D)
- **Non autorisé Cosmos/Ecocert**

## Concentration d'usage

- Shampoings traitants : 1–2%
`,
  },
  {
    name: 'Goudron de Houille (Coal Tar)',
    slug: INGREDIENT_SLUGS.COAL_TAR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Mélange complexe de composés aromatiques issu de la distillation du charbon, actif kératolytique et anti-prurigineux historique pour le psoriasis et la dermite séborrhéique sévère.',
    content: `
# Goudron de Houille (Coal Tar)

Le goudron de houille est un sous-produit de la distillation du charbon, contenant plusieurs milliers de composés organiques (hydrocarbures aromatiques polycycliques, phénols, créosols, pyridines). C'est l'un des premiers traitements topiques du psoriasis et de la dermite séborrhéique, utilisé depuis le XIXe siècle.

## INCI
**COAL TAR** (CAS: 8007-45-2)

## Composition
Mélange complexe contenant notamment : anthracène, phénanthracène, fluorène, crésols, naphtols, phénols. La fraction active exacte n'est pas totalement élucidée.

## Mécanisme d'action

### 1. Action antiproliférative
Inhibe la synthèse d'ADN des kératinocytes hyperproliférants du cuir chevelu, réduisant le turn-over cellulaire accéléré caractéristique du psoriasis.

### 2. Kératolyse
Les phénols et crésols dissolvent partiellement les protéines de la couche cornée, facilitant le détachement des squames épaisses et adhérentes.

### 3. Anti-prurigineux
Réduit la sensibilité des terminaisons nerveuses pruriceptives du cuir chevelu — mécanisme d'action encore partiellement élucidé.

### 4. Activité antifongique faible
Activité modérée contre *Malassezia*, bien inférieure aux antifongiques spécifiques — l'effet antipelliculaire passe surtout par la normalisation du turn-over kératinocytaire.

## Statut réglementaire

- **EU** : Autorisé OTC à des concentrations variables selon le pays, souvent classé médicament.
- **US** : OTC reconnu par la FDA pour le psoriasis et les pellicules à 0,5–5%.
- Considéré potentiellement carcinogène (CIRC groupe 1 pour expositions professionnelles à forte dose — données rassurants à usage cosmétique dilué).

## Concentration d'usage

- Shampoings OTC : 0,5–5% (fraction soluble)

> ⚠️ Odeur forte, peut tacher linge et cheveux clairs. Usage réservé aux dermatoses sévères résistantes aux autres traitements.
`,
  },
  {
    name: 'Climbazole',
    slug: INGREDIENT_SLUGS.CLIMBAZOLE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Antifongique azolé très ciblé sur Malassezia, efficace à faible concentration et compatible avec les formules de rinçage comme les leave-ins antipelliculaires.',
    content: `
# Climbazole

Le climbazole (1-(4-chlorophénoxy)-1-imidazol-1-yl-3,3-diméthylbutan-2-one) est un antifongique imidazolé développé spécifiquement pour usage cosmétique capillaire. Il présente une excellente sélectivité pour les levures *Malassezia* et une bonne substantivité sur le cuir chevelu.

## INCI
**CLIMBAZOLE** (CAS: 38083-17-9 | COSING: 33084)

## Mécanisme d'action

### 1. Inhibition de la biosynthèse de l'ergostérol
Comme les autres azolés, le climbazole inhibe la CYP51 (14α-déméthylase) fongique, bloquant la conversion du lanostérol en ergostérol. La membrane plasmique des levures perd son intégrité.

### 2. Sélectivité pour Malassezia
Le climbazole présente une CMI (Concentration Minimale Inhibitrice) exceptionnellement basse pour *M. globosa* et *M. restricta* (~0,06–0,25 µg/mL), ce qui lui confère une efficacité antipelliculaire à très faible dose avec un profil de sécurité cutanée favorable.

### 3. Substantivité cuir chevelu
Sa lipophilie modérée lui permet de se déposer préférentiellement sur les zones riches en sébum (cuir chevelu) et d'y maintenir une activité résiduelle après rinçage.

### 4. Compatibilité formulatoire
Stable en phase aqueuse, compatible avec la majorité des tensioactifs, émulsifiants et conservateurs. Plus facile à formuler que le kétoconazole.

## Avantages vs autres azolés

- Autorisé comme conservateur cosmétique en EU (Annexe V, max 0,5%)
- Efficace à 0,1–0,5% contre Malassezia
- Compatible formules sans rinçage (leave-ins, lotions cuir chevelu)

## Concentration d'usage

- Shampoings antipelliculaires : 0,2–0,5%
- Produits sans rinçage : 0,1–0,3%
`,
  },
  {
    name: "Huile d'Arbre à Thé (Tea Tree Oil)",
    slug: INGREDIENT_SLUGS.TEA_TREE_OIL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Huile essentielle à large spectre antimicrobien extraite de Melaleuca alternifolia, reconnue pour ses propriétés antifongiques, antibactériennes et anti-inflammatoires sur le cuir chevelu.',
    content: `
# Huile d'Arbre à Thé (Tea Tree Oil)

L'huile essentielle d'arbre à thé est extraite par vapeur d'eau des feuilles et rameaux de *Melaleuca alternifolia*, originaire d'Australie. Elle est normalisée (ISO 4730) et doit contenir entre 30–48% de terpinén-4-ol (composant actif principal) pour être considérée conforme.

## INCI
**MELALEUCA ALTERNIFOLIA LEAF OIL** (CAS: 68647-73-4 | COSING: 75618)

## Composition principale

| Composant | Teneur typique | Rôle |
|---|---|---|
| Terpinén-4-ol | 30–48% | Actif antimicrobien principal |
| γ-Terpinène | 10–28% | Synergie antimicrobienne |
| α-Terpinène | 5–13% | Antioxydant, synergie |
| 1,8-Cinéole (eucalyptol) | <15% | Solvant pénétrant (irritant à haute dose) |

## Mécanisme d'action

### 1. Perturbation membranaire
Le terpinén-4-ol s'insère dans les bicouches lipidiques des membranes bactériennes et fongiques, augmentant leur perméabilité et provoquant la fuite des constituants cellulaires essentiels.

### 2. Activité anti-Malassezia
Inhibe la croissance des levures *Malassezia* responsables des pellicules, avec une efficacité démontrée in vitro et in vivo (études cliniques sur shampoings à 5%).

### 3. Propriétés anti-inflammatoires
Supprime la production de médiateurs inflammatoires (IL-1β, IL-8, TNF-α) par les kératinocytes et monocytes — réduit les démangeaisons et l'irritation du cuir chevelu.

### 4. Activité séborrhéostatique légère
Peut réduire modestement la production sébacée par action locale sur les glandes sébacées.

## Données cliniques

Une étude randomisée contrôlée (Satchell et al., 2002, n=126) montre qu'un shampoing à 5% de tea tree oil réduit les pellicules de 41% vs 11% pour le placebo.

## Concentration d'usage

- Shampoings antipelliculaires : 1–5%
- Masques cuir chevelu : 0,5–2%

> ⚠️ Allergène potentiel (SCCS). Éviter les formulations > 5%. Le 1,8-cinéole peut être irritant sur cuirs chevelus très sensibles ou lésés.
`,
  },
  {
    name: 'Soufre (Sulfur)',
    slug: INGREDIENT_SLUGS.SULFUR_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Élément minéral kératolytique et séborrhéostatique historique, actif sur Malassezia et les bactéries du cuir chevelu, utilisé en shampoings et lotions traitants.',
    content: `
# Soufre (Sulfur)

Le soufre élémentaire (précipité ou colloïdal) est l'un des actifs dermatologiques les plus anciens, utilisé depuis l'Antiquité pour traiter les affections cutanées. En cosmétique capillaire moderne, il est principalement formulé dans des shampoings traitants pour cuirs chevelus gras, sujets aux pellicules et à l'acné du cuir chevelu.

## INCI
**SULFUR** (CAS: 7704-34-9)

## Formes cosmétiques

- **Soufre précipité** : forme la plus courante, particules fines dispersables dans les émulsions
- **Soufre colloïdal** : particules ultrafines, meilleure pénétration et tolérance cutanée

## Mécanisme d'action

### 1. Action kératolytique
Réagit avec les protéines kératiniques de la couche cornée via des réactions de sulfhydration, fragilisant les liaisons cornéocytaires et facilitant la desquamation des squames.

### 2. Activité séborrhéostatique
Réduit la production de sébum par action directe sur les glandes sébacées — bénéfique pour les cuirs chevelus gras et les formes grasses de dermite séborrhéique.

### 3. Activité antimicrobienne
Les polysulfures produits par oxydation du soufre élémentaire au contact du sébum exercent une activité bactéricide et fongistatique contre *Malassezia*, *Staphylococcus epidermidis* et *Propionibacterium acnes*.

### 4. Réduction de l'inflammation
Inhibe la 5-lipoxygénase, réduisant la production de leucotriènes pro-inflammatoires au niveau cutané.

## Statut réglementaire

Reconnu actif OTC antipelliculaire par la FDA (catégorie I) aux concentrations de 2–5%. Usage autorisé en cosmétique européen.

## Concentration d'usage

- Shampoings antipelliculaires : 2–5%
- Masques cuir chevelu : 1–3%

> ⚠️ Odeur soufrée caractéristique. Peut décolorer partiellement les cheveux blonds ou très clairs à usage prolongé.
`,
  },
]

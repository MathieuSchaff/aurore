# Seed & Taxonomie — État des lieux

> **À propos :** Architecture du seed et de la taxonomie. *Où* tout vit : paths shared, layout `backend/src/db/seed/`, schéma DB, comptages réels. Répond à « c'est où dans le code ? ».

Document de référence stable. Décrit le contrat architectural du seed et de la
taxonomie des tags — ce qui est vrai aujourd'hui dans le code. Les évolutions
en cours sont dans [`ROADMAP.md`](./ROADMAP.md).

À lire avant toute modification des fichiers seed, de la taxonomie, ou des
associations tag↔entité.

---

## 1. Vue d'ensemble

### 1.1 Layout du seed

```
backend/src/db/seed/
├── data/
│   ├── ingredients/         # source de vérité ingrédients
│   │   ├── ingredient-slugs.ts   # re-export * depuis 4 domaines + INGREDIENT_SLUGS agrégé (120L)
│   │   ├── index.ts              # dedupeBySlug + ingredientData assemblé
│   │   ├── seed-ingredients.ts   # type IngredientInput
│   │   ├── GUIDE.md              # guide contributeur
│   │   ├── skincare/             # 23 fichiers : index, ingredient-slugs, ingredient-tags, 18 groupes + 2
│   │   ├── supplements/          # 29 fichiers : index, ingredient-slugs, ingredient-tags, 26 ingrédients
│   │   ├── dental/               # 10 fichiers : index, ingredient-slugs, ingredient-tags, 7 catégories
│   │   └── haircare/             # 20 fichiers : index, ingredient-slugs, ingredient-tags, 17 catégories
│   ├── ingredient-tags/     # ingredientTagMap (shell + imports par domaine, 61L)
│   │   └── index.ts
│   ├── products/            # seeds produits, un dossier par marque
│   │   ├── types.ts          # UnifiedProductSeed
│   │   ├── index.ts          # agrégation marques JS-seedées (haircare + dental + supplement)
│   │   ├── products-slugs.ts # allProductSlugs dérivé (consommé par tests)
│   │   ├── haircare/         # 50 marques actives
│   │   ├── dental/           # 25 marques actives
│   │   └── supplement/       # 1 marque active (nutripure)
│   │   #  skincare/ → archivé hors repo (cf §1.3) ; source = snapshot SQL
│   ├── tags/                # seed-tags : ingredientTagData + productTagData (284L)
│   │   └── index.ts
│   └── blog/                # article-data.ts + 8 catégories (articles seed)
├── runners/                 # seed-core.ts, seed-blog.ts, etc.
├── scripts/                 # outils data quality (ex: auto-tag.ts)
├── tests/                   # seed-data-integrity, shared-schemas-vs-tags, etc.
└── docs/                    # ← ici
```

### 1.2 4 domaines

Tout le code (ingrédient, produit, tag) se divise en 4 domaines :

- **skincare** — soins visage/corps (principal, le plus fourni)
- **haircare** — cheveux
- **dental** — soins dentaires
- **supplement** — compléments alimentaires

### 1.3 Sources de vérité produits — split JS seed vs snapshot

Depuis 2026-05-02, deux sources cohabitent selon la catégorie :

| Catégorie    | Source de vérité          | Ajout / modif                                                                 |
|--------------|---------------------------|-------------------------------------------------------------------------------|
| skincare     | `backend/src/db/snapshot/data.sql` (committé) | SQL direct DB (`make db-studio` ou migration `drizzle/00XX_*.sql`) → `make db-snapshot` → commit |
| solaire      | idem skincare (vivait dans `data/products/skincare/`) | idem |
| bodycare     | idem skincare (idem) | idem |
| haircare     | seeds JS dans `data/products/haircare/`     | éditer `.seed.ts` → `make db-reset` → `make db-snapshot` → commit |
| dental       | seeds JS dans `data/products/dental/`       | idem |
| supplement   | seeds JS dans `data/products/supplement/`   | idem |

**Pourquoi ?** Skincare = 1923 produits + tags v2 stables. Éditer 100+ fichiers
TS pour chaque renommage de tag = trop coûteux. SQL chirurgical sur DB +
re-snapshot = workflow plus rapide pour catégorie figée.

Les autres catégories restent en JS tant qu'elles sont en croissance active.

**Workflow fresh env** : `make db-snapshot-reset` (clean + migrate + load
snapshot). Plus `make db-reset` (qui ne contient plus skincare).

**Archive** : ancien dossier `data/products/skincare/` déplacé vers
`~/Mathieu/Vault/aurore-archive/skincare-seed/` (référence locale uniquement).
Path masqué dans `.gitignore`.

---

## 2. Structure ingrédient

### 2.1 Axe `type` — domaine d'usage

Déclaré dans `shared/src/ingredients/ingredient-types.ts` (`INGREDIENT_TYPES`,
`INGREDIENT_TYPE_VALUES`, `INGREDIENT_TYPE_LABELS`).

| Valeur | Sens |
|---|---|
| `skincare` | Soins visage/corps |
| `haircare` | Cheveux |
| `dental` | Soins dentaires |
| `supplement` | Compléments alimentaires |

- DB : `ingredients.type` → `text NOT NULL`, CHECK constraint sur les 4 valeurs
  (migration `0027`). Typé côté Drizzle via `.$type<IngredientType>()`.
- Zod : `createIngredientSchema.type` → obligatoire.

### 2.2 Axe `category` — rôle fonctionnel

Les valeurs autorisées dépendent du `type` :

| `type` | Const | Fichier | Valeurs |
|---|---|---|---|
| `skincare` | `SKINCARE_INGREDIENT_CATEGORIES` | `shared/src/ingredients/skincare/categories.ts` | `actif`, `humectant`, `emollient`, `filtre-uv`, `tensioactif`, `excipient` |
| `haircare` | `HAIRCARE_INGREDIENT_CATEGORIES` | `shared/src/ingredients/haircare/categories.ts` | `actif`, `conditionneur`, `filmogene`, `humectant`, `tensioactif`, `excipient` |
| `dental` | `DENTAL_INGREDIENT_CATEGORIES` | `shared/src/ingredients/dental/categories.ts` | `actif`, `abrasif`, `aromatisant`, `humectant`, `tensioactif`, `excipient` |
| `supplement` | `SUPPLEMENT_CATEGORIES` | `shared/src/ingredients/supplement/categories.ts` | `vitamine`, `mineral`, `acide-amine`, `acide-gras`, `antioxydant`, `carotenoide`, `plante`, `adaptogene`, `champignon`, `probiotique`, `prebiotique`, `peptide`, `collagene`, `polyphenol`, `neuroactif`, `longevite`, `enzyme`, `autre` |

Chaque set exporte aussi `<DOMAIN>_INGREDIENT_CATEGORY_VALUES` pour Zod enum.

- DB : `category text` nullable, **pas de check constraint** — seul le test seed
  vérifie la cohérence (`seed-data-integrity.test.ts`).
- Zod `createIngredientSchema` : `category: string().min(1).max(100).optional()` — free-form.

**Pourquoi `emollient` → `conditionneur` côté haircare :** `emollient` décrit un
mécanisme chimique (lisse une surface en comblant les aspérités). `conditionneur`
décrit la fonction capillaire (coat + démêlage). Les huiles/beurres/silicones en
haircare sont taggés `conditionneur` pour leur rôle fonctionnel.

### 2.3 Agrégation et slugs

Structure après split d'avril 2026 :

- **Root `ingredient-slugs.ts`** (`data/ingredients/ingredient-slugs.ts`, 120L) : re-export
  `export *` depuis les 4 sous-dossiers + agrégat `INGREDIENT_SLUGS` (597 clés TS,
  595 slugs uniques — 2 aliases intentionnels : `ASTAXANTHINE`/`HAEMATOCOCCUS_PLUVIALIS`,
  `BUTYL_METHOXYDIBENZOYLMETHANE`/`AVOBENZONE`).
- **Domain `ingredient-slugs.ts`** : chaque domaine possède son propre fichier avec les
  `export const GROUP = {...} as const` spécifiques.
- `data/ingredients/index.ts` agrège, dédupe par slug (première occurrence gagne —
  skincare > haircare), et injecte `type: 'skincare'` par défaut pour les entrées
  skincare non explicites.
- `INGREDIENT_SLUGS` : source unique de tous les slugs, consommée partout
  (seed produits, ingredientTagMap, etc.).
- Pas d'inventer un slug : si un actif manque, l'ajouter au fichier
  `ingredient-slugs.ts` du domaine concerné avant de référencer.

---

## 3. Structure produit

### 3.1 `category` × `kind`

Défini dans `shared/src/products/kinds.ts` (`PRODUCT_CATEGORIES`, `PRODUCT_KINDS`,
`PRODUCT_CATEGORY_VALUES`).

| `category` | `kind` valides |
|---|---|
| `skincare` | `serum`, `moisturizer`, `cleanser`, `toner`, `exfoliant`, `eye-cream`, `mask`, `mist`, `essence`, `spot-treatment`, `lip-care`, `balm`, `oil`, `primer`, `patch` |
| `solaire` | `sunscreen`, `after-sun`, `self-tanner` |
| `bodycare` | `body-lotion`, `body-oil`, `body-scrub`, `body-wash`, `deodorant`, `hand-cream`, `foot-cream` |
| `haircare` | `shampoo`, `conditioner`, `hair-mask`, `hair-serum`, `hair-oil`, `styling` |
| `complement` | `gelule`, `capsule`, `ampoule`, `poudre`, `sirop`, `gummy`, `huile` |
| `dental` | `toothpaste`, `mouthwash`, `teeth-whitening`, `floss` |

- DB : `products.category` → `text NOT NULL` depuis migration `0025`. Pas de
  check constraint — seul le TS protège les valeurs.
- Zod : `createProductSchema` valide que `kind` appartient à
  `PRODUCT_KINDS[category]` via `.refine()`. `updateProductSchema` via
  `superRefine` force `category` et `kind` à voyager ensemble (si l'un est
  présent, l'autre aussi).
- Seed : `data/products/index.ts` dérive automatiquement `category` depuis
  `kind` via une reverse map (évite de toucher les 81 fichiers marque un par un).

### 3.2 `unit` — type de contenant

Défini dans `shared/src/products/units.ts` (`PRODUCT_UNITS`, `PRODUCT_UNIT_VALUES`).

| Valeur | Usage |
|---|---|
| `pump` | Flacon avec pompe |
| `bottle` | Flacon sans pompe (toner, essence…) |
| `tube` | Tube souple |
| `jar` | Pot |
| `dropper` | Flacon pipette |
| `spray` | Spray, brume |
| `pack` | Pack (masques tissu, patches) |
| `bar` | Pain solide |
| `aerosol` | Aérosol pressurisé |
| `roller` | Applicateur roller |
| `cartridge` | Cartouche rechargeable |

- Drizzle : `products.unit` typé via `.$type<ProductUnit>()`.
- Zod : `createProductSchema.unit`, `updateProductSchema.unit`,
  `productChangesSchema.unit` → `z.enum(PRODUCT_UNIT_VALUES)`.

> `unit` de contenant ≠ `unit` de concentration d'ingrédient (`%`, `mg/ml`, `ppm`…).
> Le second vit sur `keyIngredients[n].concentrationUnit` (string libre).

### 3.3 Format `UnifiedProductSeed`

Un fichier par marque : `data/products/<brand>/<brand>.seed.ts`. 81 fichiers actifs
exportent un array `UnifiedProductSeed[]` enregistré dans `data/products/index.ts`.
Un dossier `drSam/` est un stub non connecté (non importé dans `index.ts`).

```ts
interface UnifiedProductSeed {
  slug: string              // unique, kebab-case, "brand-product-name"
  name: string              // nom produit (sans marque, sans volume)
  brand: string             // PascalCase ("Cosrx", "La Roche-Posay")
  kind: ProductKind
  unit: ProductUnit
  totalAmount: number       // 0 si inconnu
  amountUnit: string        // 'ml' | 'g' | 'oz'
  priceCents: number        // 0 si inconnu
  description: string       // 1–2 phrases FR, bénéfice principal
  notes?: string            // compatibilités, contre-indications
  inci?: string             // liste INCI complète, MAJUSCULES, séparateur ", "
  url?: string              // https://...
  imageUrl?: string         // https://...
  tags: {
    primary: string[]       // 1–3 max — problème traité, bénéfice signature
    secondary: string[]     // type produit, étape routine, peau cible, zone, labels
    avoid: string[]         // profils déconseillés (skin_type / concern uniquement)
  }
  keyIngredients?: {
    slug: string            // INGREDIENT_SLUGS.XXX
    concentrationValue?: number
    concentrationUnit?: string  // '%', 'mg/ml', 'ppm', 'UI', ...
    notes?: string          // rôle ou précision
  }[]
}
```

`category` n'apparaît pas dans le type seed — elle est dérivée de `kind` à
l'agrégation dans `data/products/index.ts`.

### 3.4 Conventions de champs

**`name`** — sans la marque (~~"COSRX Low pH Cleanser"~~ → `"Low pH Cleanser"`),
sans le volume (~~"Moisturizer 50ml"~~ → `"Moisturizer"`). Si double nom
(ex: Sensibio / Créaline), privilégier le nom FR ou conserver les deux si les
slugs legacy diffèrent.

**`brand`** — PascalCase : `'Cosrx'`, `'Anua'`, `'La Roche-Posay'`. Pas tout
en majuscules sauf nom officiel (ex: `'SVR'`).

**`slug`** — `brand-product-name` en kebab-case strict, unique.

**`inci`** — tout en MAJUSCULES, séparateur `, `. Normaliser
`WATER/AQUA/EAU` → `WATER`, `ETHYLHEXYL GLYCERIN` → `ETHYLHEXYLGLYCERIN`.

**`url` / `imageUrl`** — commencent par `https://`, omis si vides.

`imageUrl` est servi via CDN (Bunny) une fois les images uploadées en S3.
Format cible : `${IMAGE_CDN_BASE}/products/<slug>.webp`. Le patch est appliqué
par `scripts/patch-image-urls.ts` à partir de `output/image-mapping.json`.
Détails et état : [§11 Pipeline images](#11-pipeline-images).

### 3.5 Règles de tagging

**`primary` — 1 à 3 tags max.** Le problème principal traité ou le bénéfice
signature du produit. Trop de primary → information diluée.

**`secondary` — tags descriptifs complets.** Inclure systématiquement :
- type produit (`serum`, `tonique`, `creme-hydratante`…)
- étape routine (`matin`, `soir`, `traitement`…)
- type de peau cible (`peau-sensible`, `tous-types`…)
- zone (`zone-visage`, `zone-corps`…)
- labels (`sans-parfum`, `non-comedogene`, `vegan`…)

**`avoid` — contre-indications.** Uniquement `skin_type` ou `concern`
(+ exception `grossesse-compatible`). Voir §4.4 pour les règles absolues.

### 3.6 Règles `keyIngredients`

- **Slugs uniquement** depuis `INGREDIENT_SLUGS`. Pas d'inventer. Si manquant
  → ajouter au fichier `ingredient-slugs.ts` du domaine concerné avant.
- **Inclure** : actifs fonctionnels (acides, peptides, vitamines), extraits
  végétaux signatures, humectants principaux.
- **Exclure** : WATER, conservateurs (benzoate, phenoxyethanol), émulsifiants
  basiques, parfums, agents de texture neutres (dimethicone seul).
- **Ordre** : par importance décroissante ou concentration.
- **Concentration** : préférer les champs dédiés
  (`concentrationValue` + `concentrationUnit`) plutôt que le `notes`.
  Voir `docs/prompts/backfill-concentrations.md` pour l'extraction auto.
- **Pré-remplissage historique** : `scripts/infer-key-ingredients.ts` parsait
  l'INCI des candidats du pipeline `migrate-*` (archivé, cf. `~/Mathieu/Vault/aurore-archive/seed-docs/IMPORT_PIPELINE.md`)
  et marquait les slugs auto-détectés `/* AUTO-INFERRED */`. Le pipeline n'est
  plus relancé ; les marqueurs restants dans `data/products/**/*.seed.ts` sont
  des reliquats à curer manuellement.

### 3.7 Source de données seed

- **Saisie manuelle** — marques soigneusement curées, FR, dans
  `data/products/<brand>/<brand>.seed.ts` (seule source désormais).
- **Texte brut (copier-coller web)** — suivre les règles §3.4. Si INCI absent,
  omettre `inci`. Pour `unit`, déduire du nom ("Spray" → `spray`, "Pot" → `jar`).

---

## 4. Taxonomie tags

### 4.1 Tables DB — pas de table `tags` unifiée

Chaque entité a sa propre table de définition + sa propre table de jonction.

**Définitions :**

```
ingredient_tags       product_tags
──────────────        ──────────────
id        uuid        id        uuid
slug      text        slug      text
label     text        label     text
type      text        type      text        ← colonne DB; TS: tagType
created_at            created_at
```

Index : `slug` unique, `type` indexé.

**Jonctions** (clé primaire composite, pas d'`id`) :

```
tag_ingredients                      tag_products
──────────────                       ──────────────
ingredient_tag_id  uuid FK           product_tag_id  uuid FK
ingredient_id      uuid FK           product_id      uuid FK
relevance          enum              relevance       enum
```

`relevance` : `'primary' | 'secondary' | 'avoid'`.

Un slug identique (`peau-grasse`) peut exister dans les deux tables — ce sont
des rows indépendantes. Les deux partagent le jeu de slugs pour `concern`,
`skin_type`, `skin_effect`, `shared_label` ; `ingredient_tags` n'a pas de
`product_type`/`routine_step`/`skin_zone`, et `product_tags` n'a pas
d'`ingredient_attribute`.

### 4.2 Sémantique de `relevance`

| Valeur | Signification |
|---|---|
| `primary` | Intention principale. Ce pourquoi l'actif/produit est connu. Max 3–4 tags. Typiquement `concern` ou `ingredient_attribute`. |
| `secondary` | Bénéfices secondaires, "pour qui c'est adapté", labels, autres concerns. |
| `avoid` | Contre-indication. Croisée avec le profil dermo pour afficher un badge ou filtrer (voir §5.3). |

**Dans les filtres standards de recherche, `relevance` est ignoré.** Un produit
avec `matin` en `primary`, `secondary` ou `avoid` apparaît identiquement dans
les résultats du filtre `routine_step=matin`. `avoid` n'est exploité que par
le filtre d'exclusion profil.

### 4.3 Les catégories (`tagType`) par domaine

Fichiers shared organisés par domaine sous `shared/src/ingredients/<domain>/` et
`shared/src/products/<domain>/` :

```
shared/src/ingredients/
├── skincare/
│   ├── tag-slugs.ts      SKINCARE_INGREDIENT_TAG_SLUGS
│   └── tag-taxonomy.ts   SKINCARE_INGREDIENT_TAG_TAXONOMY, SKINCARE_INGREDIENT_TAG_CATEGORIES
├── supplement/
│   ├── tag-slugs.ts      SUPPLEMENT_INGREDIENT_TAG_SLUGS
│   └── tag-taxonomy.ts   SUPPLEMENT_INGREDIENT_TAG_TAXONOMY, SUPPLEMENT_INGREDIENT_TAG_CATEGORIES
├── haircare/
│   ├── tag-slugs.ts      HAIRCARE_INGREDIENT_TAG_SLUGS
│   └── tag-taxonomy.ts   HAIRCARE_INGREDIENT_TAG_TAXONOMY, HAIRCARE_INGREDIENT_TAG_CATEGORIES
└── dental/
    ├── tag-slugs.ts      DENTAL_INGREDIENT_TAG_SLUGS
    └── tag-taxonomy.ts   DENTAL_INGREDIENT_TAG_TAXONOMY, DENTAL_INGREDIENT_TAG_CATEGORIES

shared/src/products/
├── skincare/
│   ├── tag-slugs.ts      SKINCARE_PRODUCT_TAG_SLUGS
│   └── tag-taxonomy.ts   SKINCARE_PRODUCT_TAG_TAXONOMY, SKINCARE_PRODUCT_TAG_CATEGORIES
├── haircare/
│   └── tag-slugs.ts      HAIRCARE_PRODUCT_TAG_SLUGS  (vide — {} as const)
├── dental/
│   └── tag-slugs.ts      DENTAL_PRODUCT_TAG_SLUGS    (vide — {} as const)
└── supplement/
    └── tag-slugs.ts      SUPPLEMENT_PRODUCT_TAG_SLUGS (vide — {} as const)
```

Chaque domaine dispose de son fichier `tag-filters.ts` et d'un `index.ts` barrel.

#### Ingrédients skincare — 5 `tagType`

| `tagType` | Sens | Exemples de slugs |
|---|---|---|
| `concern` | Problématique cutanée | `anti-acne`, `anti-age`, `eclat` |
| `skin_type` | Type de peau compatible | `peau-seche`, `peau-grasse` |
| `ingredient_attribute` | Ce que fait la molécule | `humectant`, `filtre-uv`, `apaisant` |
| `skin_effect` | Effet rendu sur la peau | `occlusif`, `matifiant`, `repulpant` |
| `shared_label` | Label transversal | `comedogene`, `grossesse-compatible` |

#### Ingrédients supplement — 4 `tagType`

| `tagType` | Sens |
|---|---|
| `goal` | Objectif santé ciblé (`sommeil`, `energie`, `cognition`…) |
| `moment` | Moment de prise (`matin`, `soir`, `avec-repas`…) |
| `restriction` | Contre-indication (`grossesse-incompatible`, `interaction-anticoagulants`…) |
| `ingredient_attribute` | Nature biochimique (`adaptogene`, `nootrope`, `antioxydant`…) |

#### Ingrédients haircare — 4 `tagType`

| `tagType` | Sens |
|---|---|
| `concern` | Problème capillaire (`pellicules`, `chute`, `casse`…) |
| `hair_type` | Type de cheveu (`boucles`, `fins`, `colores`…) |
| `ingredient_attribute` | Nature de la molécule (`humectant`, `gainant`, `chelateur`…) |
| `hair_effect` | Effet rendu (`brillance`, `volume`, `discipline`…) |

#### Ingrédients dental — 4 `tagType`

| `tagType` | Sens |
|---|---|
| `concern` | Problème dentaire (`carie`, `sensibilite-dentinaire`, `halitose`…) |
| `age_group` | Profil utilisateur (`adulte`, `enfant`, `orthodontie`…) |
| `ingredient_attribute` | Nature de la molécule (`remineralisant`, `fluorure`, `desensibilisant`…) |
| `dental_effect` | Effet rendu (`fraicheur`, `blancheur`, `renforcement-email`…) |

#### Produits skincare — 8 `tagType`

`concern`, `skin_type`, `skin_zone`, `product_type`, `routine_step`, `skin_effect`,
`product_label`, `shared_label`. Les 3 autres domaines produit n'ont pas encore de
slugs remplis.

---

#### Détail des slugs skincare (référence)

##### `concern` — scope both

Problématiques cutanées que l'utilisateur veut corriger.
```
anti-rougeurs, rosacee, couperose, flushs, barriere-cutanee, anti-taches,
anti-acne, anti-age, hyperpigmentation, deshydratation, pores-dilates,
cernes-poches, brillance, eclat, post-acne, cicatrisation, microbiome,
photo-vieillissement, teint-terne, lumiere-bleue, pollution, eczema,
grain-peau, keratose-pilaire, photo-protection, barriere-cutanee-alteree
```

##### `skin_type` — scope both

Profil de peau. **Mêmes slugs que le profil dermo user** — c'est ce qui permet
le croisement pour le filtre profil.
```
peau-seche, peau-mixte, peau-grasse, peau-reactive, peau-sensible,
peau-normale, peau-atopique, peau-rugueuse, tous-types
```

> `peau-sensible` est un `skin_type`, pas un `concern`. Ne pas déplacer.

##### `skin_zone` — scope product

Où le produit est appliqué. Aucun sens sur une molécule isolée.
```
zone-visage, zone-corps, zone-yeux, zone-levres, zone-mains
```

##### `product_type` — scope product

Ce qu'est physiquement le produit (texture, format). Plus fiable que
`products.kind` (granularité plus fine, indépendante des regroupements UI).

Liste non exhaustive — ~55 slugs couvrant skincare, solaire, corps, cheveux,
dental, compléments. Voir `SKINCARE_PRODUCT_TAG_SLUGS`.

##### `routine_step` — scope product

Étape de routine. Position dans un workflow, pas une propriété chimique.
```
matin, soir, nettoyant, double-nettoyage-1, double-nettoyage-2, preparation,
traitement, hydratation, emollience, protection-solaire, occlusion,
soin-yeux, soin-localise, exfoliation, masque-hebdo
```

> **Piège classique :** `hydratation` et `emollience` sont des étapes de
> routine, pas des propriétés fonctionnelles. Sur un ingrédient, utiliser
> `humectant` (attire l'eau) et `emollient` (lisse la surface). Sur un
> produit appliqué à l'étape hydratation, mettre `hydratation`.

##### `ingredient_attribute` — ingrédients uniquement

Rôle chimique/biologique de la molécule. Aucun sens sur un produit fini.
```
anti-oxydant, humectant, emollient, reparateur, antiseptique, keratolytique,
sebo-regulateur, astringent, anti-bacterien, biomimetique, apaisant,
prebiotique, anti-inflammatoire, purifiant, filtre-uv,
filtres-chimiques, filtres-mineraux, tensioactif, excipient, actif
```

> `filtres-chimiques`/`filtres-mineraux` apparaissent aussi en `product_label`
> (côté produit). Sur l'ingrédient c'est sa nature fonctionnelle ; sur le
> produit c'est une revendication de formulation. **Même slug, catégorie
> différente selon l'entité — voulu.**

##### `skin_effect` — scope mixte

Effet/rendu perçu après application.

- **scope `both`** : molécules qui ont cet effet intrinsèquement ET produits
  qui le revendiquent — `occlusif`, `repulpant`, `matifiant`, `protection-cutanee`
- **scope `product` uniquement** : rendu de texture niveau formulation —
  `texture-riche`, `texture-legere`

##### `product_label` — produits uniquement

Labels de formulation / certifications. Qualifie une formulation entière.
```
sans-parfum, bio-naturel, vegan, cruelty-free, hypoallergenique,
pigments-verts, sans-savon, filtres-chimiques, filtres-mineraux,
grossesse-compatible
```

##### `shared_label` — ingrédients et produits

Labels qui qualifient à la fois une molécule (fait de laboratoire) et un
produit fini (revendication).
```
comedogene, non-comedogene, grossesse-compatible
```

> La comédogénicité est un fait moléculaire (échelle Fulton) ET une
> revendication produit — d'où la présence des deux côtés. Comme c'est un
> fait, ça va en `secondary`, jamais en `avoid`. Si un ingrédient est
> comédogène, on met `avoid: [peau-grasse, anti-acne]` pour signifier la
> contre-indication clinique.

### 4.4 Règles absolues

1. **`avoid` = uniquement `skin_type` ou `concern`** (+ exception `grossesse-compatible`).
2. **`hydratation` / `emollience` sur un ingrédient = interdit.** Étapes de routine.
3. **Jamais de `product_type` sur un ingrédient.**
4. **`peau-sensible` est `skin_type`**, pas `concern`.
5. **`grossesse-compatible` en `secondary` = sûr. En `avoid` = contre-indiqué.** Ne pas inverser.
6. **`comedogene` / `non-comedogene` → `secondary`**, jamais en `avoid`.

### 4.5 Exemple complet — Niacinamide

```ts
[INGREDIENT_SLUGS.NIACINAMIDE]: {
  primary: [
    TAG_SLUGS.BARRIERE_CUTANEE,     // concern
    TAG_SLUGS.APAISANT,              // ingredient_attribute
    TAG_SLUGS.SEBO_REGULATEUR,       // ingredient_attribute
    TAG_SLUGS.ANTI_ROUGEURS,         // concern
    TAG_SLUGS.ANTI_TACHES,           // concern
  ],
  secondary: [
    TAG_SLUGS.ANTI_ACNE,             // concern secondaire
    TAG_SLUGS.PORES_DILATES,
    TAG_SLUGS.ECLAT,
    TAG_SLUGS.PEAU_MIXTE,            // skin_type
    TAG_SLUGS.PEAU_GRASSE,
    TAG_SLUGS.PEAU_SENSIBLE,
    TAG_SLUGS.PEAU_REACTIVE,
    TAG_SLUGS.GROSSESSE_COMPATIBLE,  // product_label : sûr → secondary
  ],
  avoid: [],                          // universel, aucune contre-indication
}
```

---

## 5. Architecture des filtres

### 5.1 Pipeline à 5 étapes

```
Taxonomie partagée (shared/)
  → Route (validation Zod)
    → Page Component (FilterGroupConfig[])
      → Hooks (useListFilters + useTagFilterGroups)
        → Query (tableau → chaîne CSV)
          → Backend Service (parse CSV, SQL subqueries)
```

### 5.2 Règle logique : AND / OR

**AND entre catégories, OR au sein d'une catégorie.**

Exemple : `concern=anti-acne,imperfections` + `skin_type=peau-grasse`
→ produits qui ont (anti-acne OU imperfections) ET peau-grasse.

Implémentation SQL (backend/src/features/products/service.ts) :

```sql
-- Subquery par catégorie (OR intra)
SELECT tp.product_id FROM tag_products tp
  JOIN product_tags pt ON pt.id = tp.product_tag_id
  WHERE pt.slug IN ('anti-acne', 'imperfections')
    AND pt.type = 'concern'

-- Requête principale : AND entre catégories
SELECT * FROM products
WHERE id IN (concern_subquery)
  AND id IN (skin_type_subquery)
ORDER BY name LIMIT 20 OFFSET 0
```

### 5.3 Filtre d'exclusion par profil (`avoid_for`)

Paramètre URL `profile_filter=true` sur ProductsPage → récupère `skinTypes` +
`skinConcerns` du profil dermo, les passe en `avoid_for` (CSV) à l'API.

Côté backend :

```ts
if (filters.avoid_for) {
  const slugs = filters.avoid_for.split(',').filter(Boolean)
  conditions.push(
    notInArray(
      products.id,
      db.select({ productId: tagProducts.productId })
        .from(tagProducts)
        .innerJoin(productTagsDefs, eq(tagProducts.productTagId, productTagsDefs.id))
        .where(and(inArray(productTagsDefs.slug, slugs), eq(tagProducts.relevance, 'avoid')))
    )
  )
}
```

UI complémentaire :

- **Toggle** "Selon mon profil" dans le `FilterDrawer` (hint "Masque les
  produits contre-indiqués"), visible uniquement si user connecté.
- **Badge d'avertissement** dans `ProductInfoTab` : intersection entre
  `relevance='avoid'` du produit et les slugs du profil → `FormMessage warning`.

Comportements limites :

| Cas | Comportement |
|---|---|
| User non connecté | Toggle invisible, badge absent, aucun filtre |
| Profil dermo vide | `avoidFor=[]` → aucun filtre appliqué |
| Seed `avoid` non lancé | Filtre actif mais aucun produit exclu |

### 5.4 Endpoints filtre

| Route | Description |
|---|---|
| `GET /products` | Liste paginée avec filtres |
| `GET /products/filter-options` | Options disponibles (kinds, brands, tags). Dynamique : uniquement tags présents en junction. |
| `GET /products/search?q=` | Full-text fuzzy (pg_trgm) |
| `GET /ingredients` | Liste paginée avec filtres |
| `GET /ingredients/filter-options` | Options tags par catégorie |
| `GET /ingredients/search?q=` | Recherche texte simple |
| `POST/PATCH/DELETE /tags` | CRUD définitions **product_tags uniquement** |
| `GET /tags/:slug/products` | Produits associés |
| `GET /tags/:slug/ingredients` | Ingrédients associés |

> **Asymétrie importante :** `/tags` opère uniquement sur `product_tags`. Les
> tags ingrédients sont **seed-only** (`data/tags/index.ts`,
> `ingredientTagData`). Les associations ingrédient↔tag passent par
> `replaceIngredientTagsSchema` via l'endpoint d'ingrédient.

### 5.5 Frontend — paramétrage pages

**ProductsPage** — 10 clés de filtre tag/brand (8 catégories tag + `brand` + `ingredient`) + 3 contrôles hors-drawer (`sort`, `priceMin`, `priceMax`).

| Groupe | Tier | Filtres |
|---|---|---|
| Peau & Problèmes | essential | skin_type, concern |
| Zone & Usage | essential | skin_zone, product_type |
| Routine & Effets | advanced | routine_step, skin_effect |
| Labels | advanced | product_label, shared_label |
| Recherche précise | advanced | brand, ingredient (SearchSelect) |

**Contrôles supplémentaires** (état URL, hors `FilterGroupConfig`) :

| Contrôle | Composant | Emplacement | Options / format |
|---|---|---|---|
| Tri | `SortControl` (`features/products/components/SortControl/`) | `PageHeader` à gauche du bouton Filtrer | Dropdown 5 valeurs : `random` (Découverte), `name`, `price_asc`, `price_desc`, `newest` |
| Prix range | `PriceRangeFilter` (`features/products/components/PriceRangeFilter/`) | Injecté dans `FilterDrawer` via `children` (à côté du toggle profil) | 2 inputs `number` en euros, commit `onBlur`/`Enter`, stockés en centimes dans l'URL |
| Profil dermo | `Toggle` "Selon mon profil" | Idem, via `children` | `profile_filter: boolean` → `avoid_for` à l'API |

Override label : `{ 'barriere-cutanee-alteree': 'Peau sensibilisée' }`.

Counts par tag affichés dans les chips (badge sobre après le label, source `GET /products/filter-options` — cf. §5.4).

Mode Découverte (aucun filtre tag + pas de range prix + `sort === 'random'`) : `limit=12`, pas de pagination.
Toute intention utilisateur (filtre, range prix, ou sort explicite) → `limit=20, page=N`.

**IngredientsPage** — 5 clés de filtre.

| Groupe | Tier | Filtres |
|---|---|---|
| Type de peau & Problèmes | essential | skin_type, concern |
| Attributs & Effets | advanced | ingredient_attribute, skin_effect, shared_label |

### 5.6 Tabs de domaine (frontend)

`/products` est scopé par un tab de domaine passé en query param `?category=`.
4 tabs sous `PageHeader` : Skincare / Cheveux / Dents / Compléments.

| Tab frontend | DB categories couvertes |
|---|---|
| `skincare` (défaut) | `skincare`, `solaire`, `bodycare` |
| `haircare` | `haircare` |
| `dental` | `dental` |
| `complement` | `complement` |

Meta des tabs : `shared/src/products/domain-tabs.ts`
(`PRODUCT_DOMAIN_TABS`, `PRODUCT_DOMAIN_DB_CATEGORIES`, `PRODUCT_DOMAIN_TAB_META`).

Backend : `GET /products` et `GET /products/filter-options` acceptent un param
optionnel `category`. Quand absent, comportement inchangé. Quand présent,
`listProducts` ajoute `inArray(products.category, PRODUCT_DOMAIN_DB_CATEGORIES[tab])`
et `getFilterOptions` scope `brands` / `kinds` / `tags` au même set.

Frontend : sur le tab `skincare`, drawer identique à l'actuel (8 accordions tag
+ brand + ingredient). Sur les 3 autres tabs, drawer minimal (kind + brand +
ingredient) — la taxonomie produit `haircare/dental/complement` n'est pas
encore seedée (cf. §8.5). Le toggle profil dermo ne s'affiche que sur le tab
skincare.

Reset au switch de tab : tag filters, `brand`, `kind`, `profile_filter` → reset ;
`sort`, `priceMin`, `priceMax`, `ingredient` → préservés ; `page` → 1.
Helper : `frontend/src/features/products/helpers.ts` → `buildDomainSwitchSearch`.

---

## 6. Tagging — sources

Les tags en DB sont statiques — créés au seed, jamais à la volée par l'API
(sauf CRUD `/tags` sur les produits).

### 6.1 Définitions initiales

`data/tags/index.ts` (284L) exporte `ingredientTagData` et `productTagData` — rows à
insérer. Labels FR définis localement dans `TAG_LABELS` (dict slug → string, ~200
entrées). Le `tagType` est dérivé de la taxonomie shared.

- `ingredientTagData` : agrégat skincare + supplement + dental + haircare (déduplification
  first-occurrence). 4 domaines insérés en DB.
- `productTagData` : construit depuis `SKINCARE_PRODUCT_TAG_TAXONOMY` + `DENTAL_PRODUCT_TAG_TAXONOMY` —
  haircare et supplement produit ont des stubs vides.

### 6.2 Associations ingrédient↔tag — manuel

`data/ingredient-tags/index.ts` (61L, shell post-refactor) → `ingredientTagMap`.
432 ingrédients taggués à la main, répartis en 4 fichiers domaine :

| Domaine | Const | Entries | Fichier |
|---|---|---|---|
| `skincare` | `skincareTagMap` | 376 | `ingredients/skincare/INGREDIENT-TAGS.ts` |
| `supplements` | `supplementTagMap` | 26 | `ingredients/supplements/INGREDIENT-TAGS.ts` |
| `haircare` | `haircareTagMap` | 12 | `ingredients/haircare/INGREDIENT-TAGS.ts` |
| `dental` | `dentalTagMap` | 18 | `ingredients/dental/INGREDIENT-TAGS.ts` |

Les 12 entries haircare sont des tensioactifs/silicones dual-domain : ils réutilisent
des slugs skincare via `TAG_SLUGS` (slugs skincare), pas les slugs haircare-natifs.

```ts
[INGREDIENT_SLUGS.ACIDE_SALICYLIQUE]: {
  primary: [INGREDIENT_TAG_SLUGS.ANTI_ACNE, INGREDIENT_TAG_SLUGS.KERATOLYTIQUE],
  secondary: [INGREDIENT_TAG_SLUGS.PEAU_GRASSE, INGREDIENT_TAG_SLUGS.PORES_DILATES],
  avoid: [INGREDIENT_TAG_SLUGS.PEAU_REACTIVE, INGREDIENT_TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE],
}
```

### 6.3 Associations produit↔tag — marques connues (manuel)

Chaque marque porte ses tags dans son `<brand>.seed.ts` sous `tags: {primary, secondary, avoid}`.
Les tags `avoid` sont critiques pour les produits à acides forts, rétinoïdes, etc.

Exception : `noreva-product-tags.ts` est un fichier séparé hérité de l'ancienne convention
(tous les autres brands intègrent les tags inline).

### 6.4 Script de tagging initial — `scripts/auto-tag.ts`

Script one-shot utilisé en avril 2026 pour pré-remplir les 1 017 produits seed
dont `tags: { primary: [], secondary: [], avoid: [] }`.

Logique par domaine :

| Domaine | primary | secondary | avoid |
|---|---|---|---|
| skincare | INCI → `INGREDIENT_TAG_MAP` → concern tags (top 3 par score) | effets fonctionnels INCI + kind-based (zone, type produit) | ingrédients agressifs (retinol, SA, BHA, BP) |
| haircare | `kind` → type produit (`shampoing`, `serum-cheveux`…) | — | — |
| dental | `kind` → type produit (`dentifrice`, `fil-dentaire`…) | — | — |

Détection domaine : path (`/haircare/`, `/dental/`) ou `kind` (détecte les
shampoings stockés sous `skincare/` chez des marques multi-domaines).

État après exécution :
- **875 produits** : primary + secondary (± avoid) remplis
- **142 produits** : secondary rempli, primary encore vide (INCI absent ou aucun
  ingrédient connu ne mappe sur un concern primaire)
- **90 fichiers** seed ont reçu l'import `{ TAG_SLUGS }` manquant automatiquement

Les 142 restants sont à traiter manuellement (voir ROADMAP §3.2).

Usage (idempotent, skip les produits déjà taggués) :
```sh
bun run backend/src/db/seed/scripts/auto-tag.ts           # dry run
bun run backend/src/db/seed/scripts/auto-tag.ts --write   # apply
```

---

## 7. Garde-fous — tests d'intégrité

Les tests vivent dans `backend/src/db/seed/tests/`. Ils tournent via
`make test-dev ARGS="<pattern>"` (DB de test persistante via `make test-db-up`).

### 7.1 `seed-data-integrity.test.ts`

26 blocs `test()`. Couvre :

- `ingredientTagMap` : slugs valides, tags valides, pas de duplicates
- `allProductTagsMap` : cohérence slugs produits et tags
- `allIngredientProductTags` : références valides
- `INGREDIENT_SLUGS` vs `ingredientData` : tout slug a une entrée, pas de doublons
- `TAG_SLUGS` vs seed tag data : couverture complète
- `allProductData` : pas de doublons, champs `name`/`brand`, kinds valides, tag primaire présent
- `ingredientData field completeness` :
  - `name` et `slug` non vides
  - tag primaire obligatoire pour chaque ingrédient **skincare**
  - `category` valide pour le domaine (skincare / haircare / dental / supplement)
- `TAG_LABELS coverage` : chaque tag a un label
- **every product has a valid category** (depuis migration 0025)
- **every product kind is consistent with its category** (superRefine-like)
- **every product unit is a valid ProductUnit**
- **every ingredient has a non-empty valid IngredientType**
- **ingredient type and category are consistent** — 4 branches séparées par domaine

### 7.2 `shared-schemas-vs-tags.test.ts`

6 blocs. Couvre :

1. Chaque valeur de `PRODUCT_KINDS.complement` a un tag `product_type`
   correspondant dans `productTagData`
2. Chaque valeur de `INGREDIENT_CATEGORY_VALUES` a un tag
   `ingredient_attribute` correspondant dans `ingredientTagData`
3. Chaque slug dans `ingredientTagMap` existe dans `INGREDIENT_TAG_TAXONOMY`
   (aucun slug product-only sur un ingrédient)
4. `avoid` dans `ingredientTagMap` : uniquement `skin_type` ou `concern`
   (+ exception `grossesse-compatible`)
5. Chaque slug dans `allProductTagsMap` existe dans `PRODUCT_TAG_TAXONOMY`
   (aucun slug ingredient-only sur un produit)
6. `avoid` dans `allProductTagsMap` : uniquement `skin_type` ou `concern`
   (+ exception `grossesse-compatible`)

### 7.3 `ingredient-slugs-split.test.ts`

2 blocs. Snapshot `INGREDIENT_SLUGS` : 597 clés, 595 slugs uniques.

### 7.4 `ingredient-tags-split.test.ts`

4 blocs. Snapshot `ingredientTagMap` (432 entries) + routing par domaine.

### 7.5 Script utilitaire

`backend/src/db/seed/tests/verify-ingredient-slugs.ts` — valide que les produits
référencent des slugs d'ingrédients existants. 929 produits avec `keyIngredients`
validés.

### 7.6 Commandes

| Action | Commande |
|---|---|
| Garder la DB de test active | `make test-db-up` |
| Lancer un test ciblé | `make test-dev ARGS="seed-data-integrity"` |
| Mode watch | `make test-dev-watch ARGS="<pattern>"` |
| Cycle complet up/run/down | `make test` |

---

## 8. Problèmes ouverts

### 8.1 `category` sans contrainte DB ni Zod par domaine (ingrédients)

- DB : `category text` nullable, aucun check constraint. Un insert `category: 'foobar'` passe.
- Zod `createIngredientSchema` : `category: string().min(1).max(100).optional()` — free-form.
- Seul filet : test `every ingredient category is a valid category for its domain` dans
  `seed-data-integrity.test.ts`.

**Fix possible** : 4 check constraints par domaine (SQL CASE), ou refine Zod
discriminated union sur `type` qui restreint `category` au set correspondant.

### 8.2 Cohérence type↔category non validée par l'API

Un payload `{ type: 'skincare', category: 'vitamine' }` passe le Zod (category est
`string().optional()`). Seul le test seed vérifie la cohérence.

### 8.3 Dedupe silencieux haircare

`dedupeBySlug()` ignore les entrées haircare qui dupliquent un slug déjà pris par
skincare/supp/dental. 12 slugs tensioactifs/chelateurs/silicones partagés. Warning
console à l'exécution, pas d'erreur. Comportement voulu, mais masqué.

### 8.4 ~~Aucun tag dental~~ — résolu

`dentalTagMap` contient 18 entries (reminéralisation, antimicrobiens, anti-sensibilité,
abrasifs, blanchissants, divers). Les 34 slugs dental sont insérés via
`ingredientTagData` (aggregate skincare + supplement + dental). `productTagData`
inclut désormais les tags dental produit (36 slugs, dedup — 25 nouveaux rows en DB).

### 8.5 ~~`productTagData` ne couvre que skincare~~ — résolu pour dental

`productTagData` agrège skincare + dental (dedup par slug — first-occurrence gagne).
`DENTAL_PRODUCT_TAG_SLUGS` (36 slugs) et `DENTAL_PRODUCT_TAG_TAXONOMY` sont remplis.
5 catégories : `concern`, `age_group`, `product_type`, `dental_effect`, `product_label`.
Les 10 slugs partagés avec skincare (`dentifrice`, `bain-de-bouche`, `sans-parfum`…)
ne créent pas de nouvelles rows — le dedup les filtre.
Haircare et supplement produit restent vides.

### 8.6 `TAG_SLUGS` legacy toujours consommé

`TAG_SLUGS` dans `data/tags/index.ts` est un agrégat non typé encore consommé par
`noreva-product-tags.ts` et `haircareTagMap` (12 entries dual-domain).

**Fix** : migrer les consommateurs restants vers les slugs typés domain-spécifiques,
puis supprimer `TAG_SLUGS`.

### 8.7 `productResponseSchema.category` encore nullable

DB : `category text NOT NULL`. `productResponseSchema` : `z.enum(...).nullable()`.
`Product.category` dans `shared/src/products/types.ts` : `string | null`.

**Fix** : retirer `.nullable()` et aligner `Product.category` sur `ProductCategory`.

### 8.8 Pas de check constraint DB sur `category`, `kind`, `unit` produits

Un insert direct hors API/seed peut injecter n'importe quelle valeur. Pas d'index
sur `category` — filtrage par catégorie sur grande table fera un seq scan.

### 8.9 `drSam/` stub non connecté

`data/products/drSam/` : deux fichiers vides (1 ligne chacun), non importé dans
`index.ts`. Soit alimenter et connecter, soit supprimer.

---

## 9. Corrections historiques — ne pas défaire

- `PEAU_SENSIBLE` déplacé de `concern` → `skin_type`
- `SPOT_TREATMENT` renommé "Traitement ciblé" pour le distinguer de
  `SOIN_LOCALISE` ("Soin localisé")
- `BEURRE_CACAO` : `avoid: [NON_COMEDOGENE]` → `avoid: [PEAU_GRASSE, ANTI_ACNE]`
  + `secondary: [COMEDOGENE]`
- 792 violations de scope (slugs product-only sur ingrédients et vice versa)
  corrigées sur 35 marques
- Tags `TEXTURE_RICHE`, `MATIN`, `SANS_PARFUM` retirés de `avoid` (skin_effect,
  routine_step et product_label sont interdits dans `avoid`)
- Refacto catégorie `attribute` fourre-tout → split en 4
  (`ingredient_attribute`, `skin_effect`, `product_label`, `shared_label`)
  avec axe `scope`
- Regroupement `shared/src/<domain>/` → `shared/src/ingredients/<domain>/`
  et `shared/src/products/<domain>/` (commit `ee95c32`)
- Prefix `SKINCARE_` sur les exports shared pour disambiguer (`876f494`,
  `c28371b`) : `INGREDIENT_CATEGORIES` → `SKINCARE_INGREDIENT_CATEGORIES`,
  `INGREDIENT_TAG_SLUGS` → `SKINCARE_INGREDIENT_TAG_SLUGS`, etc.
- Split `ingredient-slugs.ts` (842L → 120L root + 4 fichiers domaine, avril 2026)
- Split `ingredient-tags/index.ts` (3069L → 61L shell + 4 fichiers domaine, avril 2026) :
  376 entries skincare + 26 supplement + 12 haircare + 18 dental = 432 total


---

## 10. Glossaire — sémantique des champs

> Anciennement `AUDIT.md`. Glossaire cross-entité : les mots `type`, `category`, `kind`, `tagType` ont des sens différents selon la table — ce chapitre pose qui a quoi.

### 10.0 Vue d'ensemble — un tableau, trois entités

| Entité | Axe « domaine » | Axe « rôle / type spécifique » | Axe « conditionnement » |
|---|---|---|---|
| **Ingredient** | `type` (4 valeurs) | `category` (6 à 18 valeurs selon `type`) | — |
| **Product** | `category` (6 valeurs) | `kind` (3 à 15 valeurs selon `category`) | `unit` (11 valeurs) |
| **Tag** | `tagType` (varie selon table et domaine, voir §3.2) | — | — |

**Piège #1 — le mot `type` n'a pas le même sens partout :**
- sur un ingrédient → domaine métier (skincare, haircare, dental, supplement)
- sur un tag → famille de tag (concern, skin_type, skin_zone, …)

**Piège #2 — le mot `category` n'a pas le même sens partout :**
- sur un produit → domaine métier (skincare, solaire, complement, haircare, bodycare, dental)
- sur un ingrédient → rôle fonctionnel (actif, humectant, emollient, …)

**Piège #3 — le « domaine » n'est pas un champ unique.**
C'est un concept métier porté par des champs différents selon l'entité
(`ingredient.type`, `product.category`) et également par la hiérarchie de
dossiers shared (post-`ee95c32`) :
- côté ingrédient : `shared/src/ingredients/{skincare,haircare,dental,supplement}/`
- côté produit : `shared/src/products/{skincare,haircare,dental,supplement}/`

---

### 10.1 Ingredient

#### 10.1.1 Axe `type` — domaine métier

**4 valeurs** — définies dans `shared/src/ingredients/ingredient-types.ts` :

| Valeur | Label FR |
|---|---|
| `skincare` | Soins peau |
| `haircare` | Cheveux |
| `dental` | Dents |
| `supplement` | Compléments alimentaires |

- **DB** (`ingredients.type`) : `text NOT NULL` avec CHECK constraint
  sur les 4 valeurs (migration `0027`). Typé Drizzle via `.$type<IngredientType>()`.
- **Zod** (`createIngredientSchema.type`) : `z.enum(INGREDIENT_TYPE_VALUES)` obligatoire.
- **Index DB** : `ingredients_type_idx`.

#### 10.1.2 Axe `category` — rôle fonctionnel

La liste de valeurs valides **dépend de `type`**. Chaque domaine a son
sous-dossier dans `shared/src/ingredients/<domaine>/` avec son propre
`categories.ts` — pas d'union TS globale `IngredientCategory`.

| `type` | Source shared | Fichier | Nombre | Valeurs |
|---|---|---|---|---|
| `skincare` | `SKINCARE_INGREDIENT_CATEGORIES` | `shared/src/ingredients/skincare/categories.ts` | 6 | `actif`, `humectant`, `emollient`, `filtre-uv`, `tensioactif`, `excipient` |
| `haircare` | `HAIRCARE_INGREDIENT_CATEGORIES` | `shared/src/ingredients/haircare/categories.ts` | 6 | `actif`, `conditionneur`, `filmogene`, `humectant`, `tensioactif`, `excipient` |
| `dental` | `DENTAL_INGREDIENT_CATEGORIES` | `shared/src/ingredients/dental/categories.ts` | 6 | `actif`, `abrasif`, `aromatisant`, `humectant`, `tensioactif`, `excipient` |
| `supplement` | `SUPPLEMENT_CATEGORIES` | `shared/src/ingredients/supplement/categories.ts` | 18 | `vitamine`, `mineral`, `acide-amine`, `acide-gras`, `antioxydant`, `carotenoide`, `plante`, `adaptogene`, `champignon`, `probiotique`, `prebiotique`, `peptide`, `collagene`, `polyphenol`, `neuroactif`, `longevite`, `enzyme`, `autre` |

> **Historique de nommage** — le skincare a été écrit en premier sous le
> nom générique `INGREDIENT_CATEGORIES`, puis renommé
> `SKINCARE_INGREDIENT_CATEGORIES` lors de l'ajout des 3 autres domaines
> (`cd05aab`). Les fichiers ont ensuite été regroupés dans
> `shared/src/ingredients/<domaine>/` avec barrels `index.ts` par domaine
> (`f6b543f`, `ee95c32`). Le nom `SUPPLEMENT_CATEGORIES` (au lieu de
> `SUPPLEMENT_INGREDIENT_CATEGORIES`) est conservé car les compléments
> ne sont pas un rôle de formulation mais une taxonomie biochimique
> distincte.
> La branche skincare du test `ingredient type and category are consistent`
> (`seed-data-integrity.test.ts`) confirme l'usage exclusif skincare
> de la constante historique.

- **DB** (`ingredients.category`) : `text` (nullable, **sans CHECK constraint**).
  Dette ouverte : voir ROADMAP §2.2.
- **Zod** (`createIngredientSchema.category`) : `z.string()` free-form,
  **pas de validation croisée `type × category`**. Dette ouverte : ROADMAP §2.1.
- **Index DB** : `ingredients_category_idx`.
- **Filet de sécurité actuel** : les tests seed
  (`seed-data-integrity.test.ts`, branche `ingredient type and category are consistent`)
  vérifient la cohérence pour les 4 domaines.
- **Schémas Zod de filtrage** (`skincareIngredientFilterOptionsSchema`,
  `skincareIngredientsSearchSchema`) : définis dans
  `shared/src/ingredients/skincare/schemas.ts`. Axes skincare : `skin_type`,
  `concern`, `ingredient_attribute`, `skin_effect`, `shared_label`.
  Parallèles pour les autres domaines : `haircareIngredient*` (axes
  `concern`, `hair_type`, `ingredient_attribute`, `hair_effect`),
  `dentalIngredient*` (`concern`, `age_group`, `ingredient_attribute`,
  `dental_effect`), `supplementIngredient*` (`goal`, `moment`,
  `restriction`, `ingredient_attribute`). La route `GET /ingredients`
  utilise encore seulement `skincareIngredientsSearchSchema` — un client
  haircare/dental/supplement ne peut pas filtrer (follow-up : dispatch
  par `ingredient_type` vers le schéma du bon domaine).

#### 10.1.3 Ce qui n'existe pas pour un ingrédient

- Pas de `kind`.
- Pas d'axe conditionnement (un ingrédient n'est pas conditionné — c'est une
  matière première).

---

### 10.2 Product

#### 10.2.1 Axe `category` — domaine métier

**6 valeurs** — définies dans `shared/src/products/kinds.ts`
(`PRODUCT_CATEGORIES`).

| Valeur | Description |
|---|---|
| `skincare` | Soins visage/corps |
| `solaire` | Solaires |
| `complement` | Compléments alimentaires |
| `haircare` | Cheveux |
| `bodycare` | Soins corps hors visage |
| `dental` | Soins dentaires |

- **DB** (`products.category`) : `text NOT NULL` depuis migration `0025`.
  Typé Drizzle via `.$type<ProductCategory>()`.
- **Zod** (`createProductSchema.category`) : `z.enum(PRODUCT_CATEGORY_VALUES)`
  obligatoire.
- **Pas de CHECK constraint** en DB (le typage Drizzle + Zod est la seule garde).
- **Pas d'index dédié** aujourd'hui (index existant uniquement sur `kind`).

#### 10.2.2 Axe `kind` — type spécifique

La liste dépend de `category`. Structure : `PRODUCT_KINDS[category]`.

| `category` | Nombre | Kinds |
|---|---|---|
| `skincare` | 15 | `serum`, `moisturizer`, `cleanser`, `toner`, `exfoliant`, `eye-cream`, `mask`, `mist`, `essence`, `spot-treatment`, `lip-care`, `balm`, `oil`, `primer`, `patch` |
| `solaire` | 3 | `sunscreen`, `after-sun`, `self-tanner` |
| `complement` | 7 | `gelule`, `capsule`, `ampoule`, `poudre`, `sirop`, `gummy`, `huile` |
| `haircare` | 6 | `shampoo`, `conditioner`, `hair-mask`, `hair-serum`, `hair-oil`, `styling` |
| `bodycare` | 7 | `body-lotion`, `body-oil`, `body-scrub`, `body-wash`, `deodorant`, `hand-cream`, `foot-cream` |
| `dental` | 4 | `toothpaste`, `mouthwash`, `teeth-whitening`, `floss` |

- **DB** (`products.kind`) : `text NOT NULL`, typé `.$type<ProductKind>()`.
  Index `products_kind_idx`.
- **Zod création** (`createProductSchema`) : `.refine()` vérifie
  `kind ∈ PRODUCT_KINDS[category]`.
- **Zod mise à jour** (`updateProductSchema`) : `.superRefine()` force
  `category` et `kind` à voyager ensemble (si l'un change, l'autre doit être
  présent dans le body) + validation croisée.
- **Schémas Zod de filtrage** (`skincareProductFilterOptionsSchema`,
  `skincareListProductsQuery`) : définis dans
  `shared/src/products/skincare/schemas.ts`. Axes skincare : `routine_step`,
  `skin_type`, `skin_zone`, `product_type`, `concern`, `skin_effect`,
  `product_label`, `shared_label`. Parallèles stub (vides) pour les
  3 autres domaines : `haircareProduct*`, `dentalProduct*`,
  `supplementProduct*` — à remplir quand les axes produit seront définis.
  La route `GET /products` utilise encore seulement
  `skincareListProductsQuery` — un client haircare/bodycare/dental/
  complement/solaire ne peut pas filtrer (follow-up : dispatch par
  `category` vers le schéma du bon domaine).

#### 10.2.3 Axe `unit` — conditionnement

**11 valeurs** — `shared/src/products/units.ts` (`PRODUCT_UNITS`,
`PRODUCT_UNIT_VALUES`).

`pump`, `bottle`, `tube`, `jar`, `dropper`, `spray`, `pack`, `bar`, `aerosol`,
`roller`, `cartridge`.

- **DB** (`products.unit`) : `text NOT NULL`, typé `.$type<ProductUnit>()`.
- **Zod** : `z.enum(PRODUCT_UNIT_VALUES)` dans `createProductSchema`,
  `updateProductSchema`, `productChangesSchema`.

> Ne pas confondre avec `keyIngredients[n].concentrationUnit` (`%`, `mg/ml`,
> `ppm`, `UI`, …) qui décrit une unité de concentration **intra-ingrédient**,
> pas un conditionnement produit.

#### 10.2.4 Autre axe : `amountUnit`

`products.amountUnit` (`ml`, `g`, `oz`, …) décrit l'unité du volume/poids
(`totalAmount`). Pas de validation stricte, `text` libre aujourd'hui.

---

### 10.3 Tag

#### 10.3.1 Deux tables séparées

Pas de table `tags` unifiée. Chaque entité a sa table de définition :

| Entité | Table définition | Table jonction |
|---|---|---|
| Ingrédient | `ingredient_tags` (Drizzle : `ingredientTagsDefs`) | `tag_ingredients` |
| Produit | `product_tags` (Drizzle : `productTagsDefs`) | `tag_products` |

Les deux tables ont la **même structure** :

```
id         uuid  (PK)
slug       text  (unique)
label      text  (FR, affiché UI)
type       text  (= tagType côté Drizzle)
created_at timestamp
```

**Important :** le même slug (`peau-grasse`, `anti-acne`) peut exister dans
les deux tables — ce sont deux rows indépendantes. Rien ne garantit que les
labels soient identiques (le code partage un dictionnaire `TAG_LABELS` dans
`data/tags/index.ts` pour éviter la divergence).

#### 10.3.2 Axe `tagType` — famille de tag

**Colonne DB :** `type`. **Propriété TS :** `tagType` (Drizzle mappe l'une sur
l'autre via `tagType: text('type')`).

**Liste différente selon la table.**

#### `ingredient_tags` — valeurs par domaine

Chaque domaine a sa taxonomie dans `shared/src/ingredients/<domaine>/tag-taxonomy.ts`.
Le nom de la constante porte le préfixe domaine : `SKINCARE_INGREDIENT_TAG_CATEGORIES`,
`HAIRCARE_INGREDIENT_TAG_CATEGORIES`, etc. La valeur de la colonne DB `type`
(`tagType` côté TS) est une union de toutes les valeurs possibles.

| Domaine | Catégories | Slugs définis | Seed DB |
|---|---|---|---|
| skincare | `concern`, `skin_type`, `ingredient_attribute`, `actif_class`, `skin_effect`, `shared_label` (6) | ~86 | ✅ inséré |
| haircare | `concern`, `hair_type`, `ingredient_attribute`, `hair_effect` (4) | 49 | ❌ pas encore en DB |
| dental | `concern`, `age_group`, `ingredient_attribute`, `dental_effect` (4) | 33 | ❌ pas encore en DB |
| supplement | `goal`, `moment`, `restriction`, `ingredient_attribute` (4) | 47 | ✅ inséré |

Les catégories `concern` et `ingredient_attribute` existent dans plusieurs
domaines mais ne partagent pas les mêmes slugs — chaque domaine a son
lexique (ex : `concern=anti-acne` côté skincare vs `concern=pellicules`
côté haircare). Une collision **a existé** entre `anti-age` (skincare
concern) et `anti-age` (supplement goal) — résolue en supprimant de la
taxonomie supplement (`longevite` couvre le cas).

**Flux d'insertion DB** — `backend/src/db/seed/data/tags/index.ts`
(`ingredientTagData`) itère les slugs skincare et supplement, dedupe par
slug (pour `anti-inflammatoire` partagé entre les deux domaines avec la
même catégorie `ingredient_attribute`). Les domaines haircare et dental
ne sont pas encore ajoutés — dette ouverte.

Valeurs skincare détaillées :

| Valeur | Signification |
|---|---|
| `concern` | Problématique cutanée (anti-acne, eczema, anti-age…) |
| `skin_type` | Type de peau compatible (peau-grasse, peau-sensible…) |
| `ingredient_attribute` | Rôle chimique/biologique de la molécule (humectant, keratolytique, filtre-uv…) |
| `actif_class` | Famille pharmacologique d'un actif (retinoids, vitamin-c, aha, bha, niacinamide, ceramides, hyaluronic-acid, peptides, polyphenols, centella, tyrosinase-inhibitors…). Permet règles dermo type "max 1 retinoid", détection redondance variants vit C, filtres UI par famille. Distinct de `ingredient_attribute` (fonction) — la famille décrit le **mécanisme partagé** entre molécules. |
| `skin_effect` | Effet perçu sur la peau (occlusif, matifiant, repulpant…) |
| `shared_label` | Label transverse (comedogene, non-comedogene, grossesse-compatible) |

#### `product_tags` — 8 valeurs

Définies dans `shared/src/products/skincare/tag-taxonomy.ts`
(`SKINCARE_PRODUCT_TAG_CATEGORIES`). Skincare-only : les 8 valeurs
listées sont des axes skincare. Les domaines haircare/dental/supplement
ont leurs propres fichiers `tag-taxonomy.ts` en stub (array vide) — axes
à définir quand le besoin se présentera.

| Valeur | Signification |
|---|---|
| `concern` | Problématique visée |
| `skin_type` | Type de peau cible |
| `skin_zone` | Zone d'application (zone-visage, zone-corps…) |
| `product_type` | Nature physique du produit (serum, creme-hydratante…) |
| `routine_step` | Étape de routine (matin, traitement, hydratation…) |
| `skin_effect` | Effet texture/visuel (matifiant, texture-legere…) |
| `product_label` | Label formulation (sans-parfum, vegan, filtres-mineraux…) |
| `shared_label` | Label transverse (comedogene, …) |

#### Catégories partagées entre ingrédient et produit

`concern`, `skin_type`, `skin_effect`, `shared_label` existent des deux côtés.
`ingredient_attribute` est ingrédient-only ;
`skin_zone`, `product_type`, `routine_step`, `product_label` sont produit-only.

#### 10.3.3 Axe `relevance` — lien entité↔tag

Sur les tables de jonction (`tag_ingredients`, `tag_products`) un enum PG.

**Source :** `shared/src/tags/index.ts` — `relevanceValues = ['primary', 'secondary', 'avoid']`.

| Valeur | Signification |
|---|---|
| `primary` | Association principale, ce pour quoi l'entité est connue. Max 3–4 par entité. |
| `secondary` | Bénéfice secondaire, compatibilité, label. |
| `avoid` | Contre-indication. `skin_type`, `concern` ou `restriction` (pour supplements : `grossesse-incompatible`, `insuffisance-renale`, `interaction-anticoagulants`…) + exception `grossesse-compatible`. |

**Dans les filtres standards, `relevance` est ignoré** — un produit avec
`matin` en `primary`, `secondary` ou `avoid` apparaît identiquement dans un
filtre `routine_step=matin`. Seul le filtre d'exclusion profil (`avoid_for`)
exploite `relevance='avoid'`.

#### 10.3.4 CRUD asymétrique

- **`ingredient_tags`** : **seed-only**. Pas d'endpoint HTTP. Les rows sont
  insérées par `data/tags/index.ts` (`ingredientTagData`). Les associations
  `tag_ingredients` sont gérées via `replaceIngredientTagsSchema` sur
  l'endpoint d'ingrédient.
- **`product_tags`** : **CRUD complet** via `/tags` (`POST`, `PATCH`, `DELETE`,
  `GET /:slug/products`).

#### 10.3.5 Pièges slug côté seed

**Collision TS key `INGREDIENT_SLUGS`** — `backend/src/db/seed/data/ingredients/ingredient-slugs.ts`
agrège par spread tous les groupes des 4 sous-dossiers domaine. Quand deux
groupes définissent la même clé TS (ex : `ASTAXANTHINE`), le dernier spread
gagne et le slug de l'autre disparaît silencieusement. Parade : les 3 clés
en collision supplement portent un suffixe explicite dans la source supplement
(`ASTAXANTHINE_SUPPLEMENT`, `ERGOTHIONEINE_SUPPLEMENT`, `GLYCINE_SUPPLEMENT`)
pour que `INGREDIENT_SLUGS` ait bien les deux versions (597 clés, 595 slugs
uniques — 2 aliases intentionnels). Testé par snapshot dans
`ingredient-slugs-split.test.ts`.

**Architecture actuelle (post-split avril 2026)** :

```
data/ingredients/
├── ingredient-slugs.ts          # barrel root : re-export * des 4 domaines
│                                # + INGREDIENT_SLUGS aggregate (~120 lignes)
├── skincare/ingredient-slugs.ts # groupes skincare
├── supplements/ingredient-slugs.ts
├── haircare/ingredient-slugs.ts
└── dental/ingredient-slugs.ts
```

**`TAG_SLUGS` legacy** — `backend/src/db/seed/data/tags/index.ts` expose une
constante `TAG_SLUGS` qui n'est qu'un merge des consts shared
(`SKINCARE_INGREDIENT_TAG_SLUGS` + `SKINCARE_PRODUCT_TAG_SLUGS` +
`SUPPLEMENT_INGREDIENT_TAG_SLUGS`). Les re-exports thin dans
`shared/src/ingredients/tag-slugs.ts` et `shared/src/products/tag-slugs.ts`
ont été supprimés (`ddd35b7`). Subsiste uniquement la constante locale dans
`data/tags/index.ts`, consommée par `noreva-product-tags.ts` et les 12
entries haircare dual-domain de `haircare/ingredient-tags.ts`. Dette ouverte :
ROADMAP §4.2.

---

### 10.4 Croisements domaine ingrédient × domaine produit

Les domaines ne se recouvrent pas parfaitement :

| Domaine | Ingredient.type | Product.category |
|---|---|---|
| skincare | ✅ | ✅ |
| haircare | ✅ | ✅ |
| dental | ✅ | ✅ |
| supplement | ✅ | ✅ (nommé `complement`) |
| solaire | ❌ (pas de type dédié) | ✅ |
| bodycare | ❌ (pas de type dédié) | ✅ |

**Conséquences :**

- Un produit `category='solaire'` référence des ingrédients `type='skincare'`
  (filtres UV, émollients classés côté soin).
- Un produit `category='bodycare'` référence aussi des ingrédients
  `type='skincare'`.
- La catégorie ingrédient `filtre-uv` (dans `INGREDIENT_CATEGORIES`) est le
  point de rattachement des actifs solaires, mais leur `type` reste
  `skincare`.
- Le nom diffère : l'ingrédient utilise `supplement`, le produit utilise
  `complement` — pas de raison historique claire, juste deux choix faits à
  deux moments.

---

### 10.5 État de la validation — matrice

|  | DB `NOT NULL` | DB CHECK | Drizzle `.$type<>()` | Zod | Test seed |
|---|---|---|---|---|---|
| `ingredient.type` | ✅ | ✅ (4 valeurs) | ✅ | ✅ enum | ✅ |
| `ingredient.category` | ❌ (nullable) | ❌ | ❌ | ❌ `z.string()` | ✅ croisé avec `type` |
| `product.category` | ✅ | ❌ | ✅ | ✅ enum | ✅ |
| `product.kind` | ✅ | ❌ | ✅ | ✅ `.refine()` croisé avec `category` | ✅ |
| `product.unit` | ✅ | ❌ | ✅ | ✅ enum | ✅ |
| `ingredient_tags.tagType` | ✅ | ❌ | ❌ (text) | ❌ (pas de schéma Zod CRUD) | ✅ (via taxonomy) |
| `product_tags.tagType` | ✅ | ❌ | ❌ (text) | `z.string()` dans `createTagSchema` | ✅ (via taxonomy) |
| `relevance` (junctions) | ✅ | ✅ (pgEnum) | — | ✅ enum | ✅ |

**Dettes visibles** (suivies dans ROADMAP) :

- `ingredient.category` sans CHECK constraint ni validation Zod croisée
  avec `type` → ROADMAP §2.1 et §2.2.
- `product.category/kind/unit` sans CHECK DB (typage TS + validation Zod
  suffisent en pratique, shared/dist sans JS rend la migration coûteuse —
  décision : accepter).
- `tagType` en `text` libre en DB : rien n'empêche d'insérer un `tagType`
  inventé. Garde-fou = tests seed uniquement.

---

### 10.6 Cheat sheet — quel champ regarder ?

**Je cherche le domaine d'une entité…**
- Ingrédient → `ingredient.type` (fichiers dans
  `shared/src/ingredients/<domaine>/`)
- Produit → `product.category` (fichiers dans
  `shared/src/products/<domaine>/`)
- Tag → `tag.tagType` pour la famille + dossier shared du domaine concerné

**Je cherche la nature fonctionnelle d'une entité…**
- Ingrédient → `ingredient.category` (actif / humectant / excipient / …)
- Produit → `product.kind` (serum / cleanser / sunscreen / …)
- Tag → `tag.tagType` (concern / skin_type / …)

**Je cherche le conditionnement…**
- Produit → `product.unit` (pump / tube / jar / …)
- Ingrédient → n/a
- Tag → n/a

**Je cherche l'importance d'une association tag↔entité…**
- `relevance` sur `tag_ingredients` ou `tag_products` (`primary` / `secondary` / `avoid`)


---

## 11. Pipeline images

> Anciennement `IMAGES.md`. Où vivent les images produit, mapping seed↔image, pipeline upload S3 → CDN Bunny.

### 11.1 Trois stores

| Store | Rôle | Origine | Naming | Résolution | Taille |
|---|---|---|---|---|---|
| `output/images/<slug>.{jpg,png}` | Thumbnails listing Pharmashop | scrap field `imageUrl` (URL CDN Pharmashop) | slug dérivé du `link` Pharmashop | 198×198 | ~71 MB, 3272 fichiers |
| `output/product-details/<dir>/img_NN.{jpg,png}` | Pages détail (HD) | scrap fiche produit Pharmashop | dir = path URL `/`→`_`, fichier = `img_01..N` | 600×600 (parfois plus) | ~212 MB, 2304 images sur 1918 dirs |
| `output/images-downloaded/<slug>.{jpg,png}` | DL externe (Atida + Skinsafe) | `scrapper-para/scripts/download-external-images.ts` | slug seed canonique | source CDN (variable) | ~47 MB, 471 fichiers |
| `output/images-normalized/<slug>.webp` | **Sortie pipeline** prête S3 | conversion hybride detail → thumb fallback → atida → skinsafe | slug seed canonique, flat | source-natif (pas d'upscale) | ~65 MB, 2700 fichiers |

Originaux laissés intacts. Seul `images-normalized/` est uploadé.

---

### 11.2 Mapping seed ↔ image

#### 11.2.1 Stratégie

Le mapping `slug seed → fichier image` vit dans `output/image-mapping.json`. Il est généré en cherchant pour chaque slug :

1. **Detail prioritaire** — si un dossier `product-details/<dir>` contient `img_01.jpg` et que le suffixe du dirname matche le slug seed (bidirectionnel : slug suffixe-of-dir, ou dir suffixe-of-slug), on prend le HD.
2. **Thumb fallback** — sinon on cherche dans `output/images/` par préfixe bidirectionnel (image = `<slug>-<format>` ou seed = `<image>-<id-atida>`).
3. **Atida / Skinsafe DL** — pour les seeds sans match local mais avec un `imageUrl` externe (`assets.atida.com` ou `cdn1.skinsafeproducts.com`), `scrapper-para/scripts/download-external-images.ts` télécharge l'image et l'ajoute au mapping.
4. **Pas de fuzzy aveugle** — token-reorder et token-set matching ont été testés mais produisent des faux positifs (ex: `aderma-exomega-huile-500` ≠ `aderma-exomega-control-huile-lavante-emolliente-200ml`). On ne match que par préfixe bidirectionnel exact.

#### 11.2.2 État (snapshot)

| Niveau | Seeds couverts | Source |
|---|---:|---|
| Detail HD 600×600 | 1168 | `product-details/` |
| Thumb fallback LR 198×198 | 1061 | `images/` |
| Atida DL | 58 | `images-downloaded/` |
| Skinsafe DL | 413 | `images-downloaded/` |
| **Total mappé** | **2700 / 3303** (82%) | |
| Sans image (mapping) | 603 | K-beauty + résidus pharma (cf. §3) |

Format du mapping :

```json
{
  "mapping": {
    "avene-cicalfate-creme-protectrice": {
      "source": "detail",
      "dir": "fr_beaute_avene_avene_cicalfate_creme_protectrice_40_ml_html",
      "file": "img_01.jpg"
    },
    "klorane-quinine-edelweiss-shampoing-fortifiant": {
      "source": "thumb",
      "file": "klorane-quinine-edelweiss-shampoing-fortifiant-200ml.jpg"
    }
  },
  "summary": { "total": 2229, "detail": 1168, "thumb": 1061 }
}
```

---

### 11.3 Classification des produits seed par source d'image

| Bucket | Nb | Action patch CDN |
|---|---:|---|
| LOCAL only (pas d'imageUrl actuel) | 1172 | insert `imageUrl` |
| LOCAL + Atida (URL `assets.atida.com` existante) | 977 | replace → CDN |
| LOCAL sans ligne `imageUrl` | 76 | insert |
| LOCAL + Skinsafe | 4 | replace → CDN |
| Atida DL (résidus) | 58 | replace → CDN |
| Skinsafe DL (K-beauty récupérables) | 413 | replace → CDN |
| **Total mappé = 2700** ✅ | | patché |
| Skinsafe externe (PNG protégés 403) | 119 | **non touché** (URL Skinsafe préservée) |
| Atida externe (404) | 2 | non touché |
| Sans image (vide/absent) | 636 | non touché |
| Shopify-only (remedy) | 13 | non touché |

### Skinsafe — état après DL (avril 2026)

Sur 532 produits Skinsafe-only, **413 récupérés** (78%) via `download-external-images.ts`. Les 119 restants sont des PNG en 403 Forbidden (probablement protection per-asset Skinsafe). Atida 58/60 (97%, 2 × 404).

Pour récupérer les 119 PNG bloqués il faudra browser automation (cookies session, scrapper-para). Cf. ROADMAP §7.3.

### Brands sans image du tout (636)

svr (35 résidus / 177 catalogue), the-ordinary (35), bioderma (31), theramid (29), avene (24 résidus / 146), dermeden (22), geek (19), nutripure (16), nooance (16), loccitane (16)…
Mix de marques jamais scrappées (the-ordinary, bioderma) + résidus de marques scrappées (variantes/références particulières).

---

### 11.4 Pipeline complet

```
scrape Pharmashop ──┬──> output/images/<slug>.jpg               (thumb listing)
                    └──> output/product-details/<dir>/img_NN.jpg (detail HD)

[script]    download-external-images.ts ──> output/images-downloaded/<slug>.{jpg,png}
                                              (Atida + Skinsafe URLs from seeds)

[hors-script] ── build-image-mapping.py ──> output/image-mapping.json
[script]    download-external-images.ts (idempotent) ──> output/images-normalized/<slug>.webp
                                                          + merge mapping

[script]    upload-images.ts ──> S3 bucket → Bunny CDN edge
                                  └──> https://${IMAGE_CDN_BASE}/products/<slug>.webp

[script]    patch-image-urls.ts (env IMAGE_CDN_BASE) ──> data/products/**/*.seed.ts
                                                          └── imageUrl: '<absolute-cdn-url>'
```

#### 11.4.1 Scripts

| Script | Rôle |
|---|---|
| `scrapper-para/scripts/download-external-images.ts` | Pour chaque slug ∉ mapping avec `imageUrl` Atida/Skinsafe : fetch parallèle (8 workers, UA banal, 10s timeout), save dans `images-downloaded/`, convert webp dans `images-normalized/`, merge mapping. Idempotent (skip si webp existe). Failures → `output/image-download-failures.json`. `--dry` pour preview. |
| `scripts/upload-images.ts` | Upload `output/images-normalized/*.webp` → S3 (Bun.S3Client, parallèle). Idempotent côté S3 (noms stables). DRY_RUN=1 pour preview. |
| `scripts/patch-image-urls.ts` | Pour chaque slug ∈ mapping, écrit `imageUrl: '${IMAGE_CDN_BASE}/products/<slug>.webp'` dans le `<brand>.seed.ts`. Replace si présent, insert sinon (après `url:` ou avant `tags:`). Slugs hors mapping → laissés intacts. `--dry` pour preview. |

#### 11.4.2 Env vars

**upload-images.ts** (Bunny Storage HTTP native API) :

| Var | Default | Notes |
|---|---|---|
| `BUNNY_STORAGE_ZONE` | — | requis. Nom du Storage Zone (ex: `aurore-images`). |
| `BUNNY_STORAGE_PASSWORD` | — | requis. Storage Zone → FTP & API Access → Password. |
| `BUNNY_STORAGE_HOSTNAME` | `storage.bunnycdn.com` | hostname régional (DE par défaut, sinon `ny.storage.bunnycdn.com`, etc.). |
| `BUNNY_STORAGE_PREFIX` | `products/` | trailing slash auto |
| `DRY_RUN` | `0` | `1` = preview |
| `CONCURRENCY` | `16` | uploads parallèles |

**patch-image-urls.ts** :

| Var | Default | Notes |
|---|---|---|
| `IMAGE_CDN_BASE` | — | requis sauf `--dry`. Ex : `https://aurore-cdn.b-cdn.net`. URL absolue résolue au patch-time. |

#### 11.4.3 Workflow

```bash
# 1. (re)build mapping & normaliser webp si scrap a bougé — ad hoc, pas de script versionné
#    voir §11.6 pour les commandes manuelles

# 2. compléter avec downloads externes (Atida / Skinsafe)
(cd ../scrapper-para && bun run scripts/download-external-images.ts)

# 3. upload Bunny Storage (env vars depuis .env.dev)
set -a; source .env.dev; set +a
bun run backend/src/db/seed/scripts/upload-images.ts

# 4. patch seeds (IMAGE_CDN_BASE déjà dans .env.dev)
bun run backend/src/db/seed/scripts/patch-image-urls.ts

# 5. vérif
make ts-verify
```

Re-runnable : changer `IMAGE_CDN_BASE` et relancer le patch ré-écrit toutes les URL gérées par le mapping.

---

### 11.5 Décisions design

- **Format `.webp` uniforme** — gain ~30 % sur thumbs jpg, ~50 % sur PNG. Bunny CDN sait servir des fallbacks au besoin.
- **Flat `products/<slug>.<ext>`** — pas de hiérarchie marque (lookup direct depuis le slug, pas de jointure).
- **URL absolue dans seed** — l'env var est résolue au patch-time, pas runtime. Évite import d'un module config dans 80+ seeds.
- **Pas de variantes contenance dans le slug** — un produit seed = une image. Si plusieurs formats du produit existent (ex: `-100ml` et `-400ml`), le matcher choisit le format le plus court (heuristique « base »).
- **Originaux préservés** — `output/images/` et `output/product-details/` restent intacts, on n'écrit que dans `images-normalized/`. Re-build idempotent.

---

### 11.6 Re-générer mapping et webp (ad hoc)

Pas encore scripté en TS — le mapping a été construit en Python one-shot. À scripter quand le scrap bougera. Étapes manuelles :

1. Lister slugs seed et image filenames, faire le matching bidirectionnel detail-priority/thumb-fallback.
2. Écrire `output/image-mapping.json`.
3. Pour chaque entrée, convertir source → `output/images-normalized/<slug>.webp` via `magick <src> -quality 85 <dst>`.

Voir aussi `output/image-mapping-detail.json` (mapping detail-only, sert au debug).

---

### 11.7 Tâches futures (cf. ROADMAP §7)

- 119 PNG Skinsafe en 403 — récupérables via browser automation (scrapper-para).
- ~636 produits sans image (the-ordinary, bioderma résidus, etc.) — scrap source à choisir.
- Scripter le pipeline mapping+normalize en TS (`build-image-mapping.ts`) — actuellement Python one-shot.
- Optionnel : route backend `/seed-images/<slug>.webp` (servir local en dev avant CDN).

---

### 11.8 Liens

- Pipeline import scrap amont : `~/Mathieu/Vault/aurore-archive/seed-docs/IMPORT_PIPELINE.md` (archivé)
- Format seed produit : [`SEED_FORMAT.md`](./SEED_FORMAT.md) §3 (workflow B)
- État global seed : [§3.3 Source de données seed](#33-source-de-données-seed)
- Roadmap : [`ROADMAP.md`](./ROADMAP.md)


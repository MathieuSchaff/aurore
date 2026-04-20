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
│   │   ├── index.ts          # agrégation toutes marques
│   │   └── <brand>/<brand>.seed.ts   # 81 fichiers actifs
│   └── tags/                # seed-tags : ingredientTagData + productTagData (284L)
│       └── index.ts
├── runners/                 # seed-core.ts, seed-skincare.ts, etc.
├── tests/                   # seed-data-integrity, shared-schemas-vs-tags, etc.
├── otherdata/               # product-associations.ts, tag-associations.ts (CSV)
└── docs/                    # ← ici
```

### 1.2 4 domaines

Tout le code (ingrédient, produit, tag) se divise en 4 domaines :

- **skincare** — soins visage/corps (principal, le plus fourni)
- **haircare** — cheveux
- **dental** — soins dentaires
- **supplement** — compléments alimentaires

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

### 3.7 Source de données seed

- **CSV (skinsafeproducts.com)** — ~8 000 produits, traduction CSV→interne
  via `data/products/types.ts` et `otherdata/product-associations.ts`
  (mapping catégorie/kind/unit anglais → interne).
- **Saisie manuelle** — marques soigneusement curées, FR, dans
  `data/products/<brand>/<brand>.seed.ts`.
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
`products.kind` (qui vient du CSV anglais avec 25 valeurs hétérogènes).

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

**ProductsPage** — 10 clés de filtre (8 catégories tag + `brand` + `ingredient`).

| Groupe | Tier | Filtres |
|---|---|---|
| Peau & Problèmes | essential | skin_type, concern |
| Zone & Usage | essential | skin_zone, product_type |
| Routine & Effets | advanced | routine_step, skin_effect |
| Labels | advanced | product_label, shared_label |
| Recherche précise | advanced | brand, ingredient (SearchSelect) |

Override label : `{ 'barriere-cutanee-alteree': 'Peau sensibilisée' }`.

Mode Découverte (aucun filtre actif) : `sort=random, limit=12`.
Mode Filtré : `sort=name, limit=20, page=N`.

**IngredientsPage** — 5 clés de filtre.

| Groupe | Tier | Filtres |
|---|---|---|
| Type de peau & Problèmes | essential | skin_type, concern |
| Attributs & Effets | advanced | ingredient_attribute, skin_effect, shared_label |

---

## 6. Tagging — sources

Les tags en DB sont statiques — créés au seed, jamais à la volée par l'API
(sauf CRUD `/tags` sur les produits).

### 6.1 Définitions initiales

`data/tags/index.ts` (284L) exporte `ingredientTagData` et `productTagData` — rows à
insérer. Labels FR définis localement dans `TAG_LABELS` (dict slug → string, ~200
entrées). Le `tagType` est dérivé de la taxonomie shared.

- `ingredientTagData` : agrégat skincare + supplement (déduplification first-occurrence).
  Les slugs haircare-natifs et dental ne sont pas encore insérés en DB.
- `productTagData` : construit depuis `SKINCARE_PRODUCT_TAG_TAXONOMY` uniquement — les
  3 autres domaines produit ont des stubs vides.

### 6.2 Associations ingrédient↔tag — manuel

`data/ingredient-tags/index.ts` (61L, shell post-refactor) → `ingredientTagMap`.
414 ingrédients taggués à la main, répartis en 4 fichiers domaine :

| Domaine | Const | Entries | Fichier |
|---|---|---|---|
| `skincare` | `skincareTagMap` | 376 | `ingredients/skincare/ingredient-tags.ts` |
| `supplements` | `supplementTagMap` | 26 | `ingredients/supplements/ingredient-tags.ts` |
| `haircare` | `haircareTagMap` | 12 | `ingredients/haircare/ingredient-tags.ts` |
| `dental` | `dentalTagMap` | 0 | `ingredients/dental/ingredient-tags.ts` |

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

### 6.4 Associations produit↔tag — CSV (auto)

`otherdata/tag-associations.ts` + `getTargetTagSlugs()` dans
`runners/seed-skincare.ts`. Trois signaux combinés :

1. **Catégorie CSV** → tags (`"Serum"` → `serum`, `traitement`)
2. **Mots-clés dans le nom** → tags (`"éclat"` → `eclat`)
3. **Ingrédients INCI** → tags (`retinol` → `anti-age`, `traitement`)

Limite connue (voir ROADMAP P1) : couvre bien `product_type` et
`routine_step`, mais pas assez `concern` et `skin_type`.

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

4 blocs. Snapshot `ingredientTagMap` (414 entries) + routing par domaine.

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

### 8.4 Aucun tag dental

`dentalTagMap` est vide (placeholder). Les ingrédients dental n'ont aucun mapping
primary/secondary/avoid. Les slugs dental ne sont pas non plus insérés en DB.

### 8.5 `productTagData` ne couvre que skincare

`ingredientTagData` agrège skincare + supplement. `productTagData` n'agrège que
`SKINCARE_PRODUCT_TAG_TAXONOMY` — les slugs haircare/dental/supplement produits sont
vides. À étendre manuellement si ces slugs sont un jour remplis.

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
- `INGREDIENT_TAG_MAP` : `EMOLLIENCE` → `EMOLLIENT`, `HYDRATATION` → `HUMECTANT`
  sur les ingrédients
- `CSV_CATEGORY_TAG_MAP` : 12 clés dupliquées supprimées (JS écrasait
  silencieusement la première par la dernière)
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
  376 entries skincare + 26 supplement + 12 haircare + 0 dental = 414 total

# AUDIT — Ingrédients, Produits, Tags : que représente chaque axe ?

Document de clarification. Les trois entités partagent un vocabulaire
(`type`, `category`, `kind`, `tagType`) dont la signification change selon
le contexte. Ce fichier pose qui a quoi et évite les confusions.

Pour l'architecture complète voir [`STATE.md`](./STATE.md).
Pour la dette ouverte voir [`ROADMAP.md`](./ROADMAP.md).

---

## 0. Vue d'ensemble — un tableau, trois entités

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

## 1. Ingredient

### 1.1 Axe `type` — domaine métier

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

### 1.2 Axe `category` — rôle fonctionnel

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

### 1.3 Ce qui n'existe pas pour un ingrédient

- Pas de `kind`.
- Pas d'axe conditionnement (un ingrédient n'est pas conditionné — c'est une
  matière première).

---

## 2. Product

### 2.1 Axe `category` — domaine métier

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

### 2.2 Axe `kind` — type spécifique

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

### 2.3 Axe `unit` — conditionnement

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

### 2.4 Autre axe : `amountUnit`

`products.amountUnit` (`ml`, `g`, `oz`, …) décrit l'unité du volume/poids
(`totalAmount`). Pas de validation stricte, `text` libre aujourd'hui.

---

## 3. Tag

### 3.1 Deux tables séparées

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

### 3.2 Axe `tagType` — famille de tag

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
| skincare | `concern`, `skin_type`, `ingredient_attribute`, `skin_effect`, `shared_label` (5) | ~70 | ✅ inséré |
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

### 3.3 Axe `relevance` — lien entité↔tag

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

### 3.4 CRUD asymétrique

- **`ingredient_tags`** : **seed-only**. Pas d'endpoint HTTP. Les rows sont
  insérées par `data/tags/index.ts` (`ingredientTagData`). Les associations
  `tag_ingredients` sont gérées via `replaceIngredientTagsSchema` sur
  l'endpoint d'ingrédient.
- **`product_tags`** : **CRUD complet** via `/tags` (`POST`, `PATCH`, `DELETE`,
  `GET /:slug/products`).

### 3.5 Pièges slug côté seed

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

## 4. Croisements domaine ingrédient × domaine produit

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

## 5. État de la validation — matrice

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

## 6. Cheat sheet — quel champ regarder ?

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

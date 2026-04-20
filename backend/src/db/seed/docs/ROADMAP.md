# Seed & Taxonomie — Roadmap

Dette et tâches ouvertes. Pour l'architecture actuelle (stable), voir
[`STATE.md`](./STATE.md).

Règle : **une étape = une session = un commit propre.** Pas de chaînage.

---

## 1. Infra

- [ ] **DB reset + seed complet** — les migrations ont bougé (`0025` insérée,
      `0024` modifiée, `0026` et `0027` sur ingredients). DB locale probablement
      désynchronisée. → `make db-reset` (fallback `make db-clean && make db-migrate`).

---

## 2. Ingrédients

### 2.1 Cohérence `type → category` en Zod

`category` est `z.string()` free-form dans les schémas ingrédient. Un
ingrédient `type: 'skincare'` peut avoir `category: 'vitamine'` sans erreur
côté API. La vérification n'existe qu'en test seed.

- [ ] Ajouter un `superRefine` dans `createIngredientSchema` /
      `updateIngredientSchema` croisant `type` × `category` avec les 4 sets
      (`SKINCARE_INGREDIENT_CATEGORY_VALUES`, `HAIRCARE_INGREDIENT_CATEGORY_VALUES`,
      `DENTAL_INGREDIENT_CATEGORY_VALUES`, `SUPPLEMENT_CATEGORY_VALUES`).

### 2.2 CHECK constraint DB sur `ingredients.category`

Actuellement `text` nullable sans contrainte. Un `category: 'foobar'` passe en
DB sans erreur (seul `type` a une CHECK constraint depuis migration `0027`).

- [ ] Migration CHECK constraint croisée sur `(type, category)`. Dupliquer
      manuellement les valeurs (drizzle-kit tourne via Bun qui charge les TS
      source de shared, mais seules les valeurs constantes s'importent —
      simple à maintenir).

### 2.3 ✅ Renommé `INGREDIENT_CATEGORIES` → `SKINCARE_INGREDIENT_CATEGORIES`

Fait. Fichiers déplacés dans `shared/src/ingredients/<domaine>/categories.ts`.
Symboles renommés : `SKINCARE_INGREDIENT_CATEGORIES`, `SkincareIngredientCategory`,
`SKINCARE_INGREDIENT_CATEGORY_VALUES`. 51 fichiers consumers mis à jour.
Pas de re-export legacy (clean break, monorepo self-contained). — `cd05aab` / `876f494`

### 2.4 Fichiers seed haircare/dental importent `SKINCARE_INGREDIENT_CATEGORIES`

Bug pré-existant rendu visible par le rename §2.3. 20 fichiers dans
`data/ingredients/{haircare,dental}/` importent `SKINCARE_INGREDIENT_CATEGORIES`
alors qu'ils devraient importer respectivement
`HAIRCARE_INGREDIENT_CATEGORIES` et `DENTAL_INGREDIENT_CATEGORIES`.

Fonctionne aujourd'hui parce que les valeurs string sont identiques dans
l'intersection (`actif`, `humectant`, `tensioactif`, `excipient`). Mais :
- Un reader humain croit que ces ingrédients sont skincare.
- Si quelqu'un ajoute `SKINCARE_INGREDIENT_CATEGORIES.EMOLLIENT` dans un
  fichier haircare, le test `ingredient type and category are consistent`
  échouera (EMOLLIENT absent de HAIRCARE_*).

Fichiers concernés (13 haircare, 7 dental) :

```
haircare/agents-nacrants, antipelliculaires, ceramides-lipides, chelateurs,
         divers, epaississants-texturants, humectants, proteines-keratine,
         stimulants-croissance, tensioactifs-amphoteres, tensioactifs-anioniques,
         tensioactifs-cationiques, tensioactifs-non-ioniques
dental/  abrasifs, anti-sensibilite, antimicrobiens, blanchissants,
         divers, excipients, remineralisation
```

- [ ] Remplacer l'import + les références par `HAIRCARE_INGREDIENT_CATEGORIES`
      dans chaque fichier haircare (sauf `EMOLLIENT` → `CONDITIONNEUR` si présent)
- [ ] Remplacer par `DENTAL_INGREDIENT_CATEGORIES` dans chaque fichier dental
- [ ] Vérifier chaque `.X` utilisé existe dans le set cible

### 2.5 Cohérence catégorie ingrédient ↔ tags associés

Ex : un ingrédient `filtre-uv` sans tag `filtre-uv` dans `ingredientTagMap` —
non détecté aujourd'hui.

- [ ] Ajouter test dans `shared-schemas-vs-tags.test.ts` : cohérence
      catégorie → `ingredient_attribute` correspondant.

---

## 3. Produits

### 3.1 `productResponseSchema.category` encore `.nullable()`

Sans impact concret : Hono RPC type les réponses depuis le handler, ce schema
n'est utilisé dans aucune route. À nettoyer par cohérence quand on touche.

- [ ] Retirer `.nullable()` sur `productResponseSchema.category` + aligner
      `Product.category` sur `ProductCategory` (non nullable) dans `shared/src/products/types.ts`.

### 3.2 Tags `avoid` produits — data quality

Plusieurs marques ont `avoid: []` vides sur des produits avec rétinol/AHA
forts / filtres chimiques. Règles de rattrapage (rappel) :

- Rétinoïde → `peau-reactive` + `barriere-cutanee-alteree` +
  `grossesse-compatible` (avoid)
- AHA fort (>8%) → `peau-reactive` + `barriere-cutanee-alteree`
- BHA 2% → `peau-sensible`
- Acide azélaïque 10%+ → `peau-reactive` + `barriere-cutanee-alteree`
  (sauf produits rosacée cliniquement validés — cf. drIdriss Left Un-Red)
- Filtres chimiques → `grossesse-compatible` (avoid) dans solaires

Marques non traitées :

- [ ] `labBiarritz` (10 produits)
- [ ] `occitane` (16 produits)
- [ ] `solaires` (17 produits — principalement filtres chimiques)
- [ ] `toners` (7 produits)
- [ ] `uriage` (11 produits)
- [ ] `noreva` — concentrations + avoid
- [ ] `drIdriss` — concentrations étiquettes restantes

Bioderma : ajouter **Sebium Global** (niacinamide 5/10%) et
**Pigmentbio C-Concentrate** (AA 10%) avant concentrations.

Solaires absents du seed à évaluer quand ajoutés : Actinica Lotion,
Colibri Daily SPF50 (vérifier absence `grossesse-compatible`, filtres chimiques).

### 3.3 CSV seed — améliorations (optionnel)

1. [ ] Enrichir tags produits depuis `category` ingrédient matché
       (`filtre-uv` → `protection-solaire` + `filtres-mineraux`/`filtres-chimiques`).
2. [ ] Auto-détection `PRODUCT_CATEGORIES.SOLAIRE` + `kind=sunscreen` quand
       `Moisturizers with SPF` + filtre UV matché dans l'INCI.
3. [ ] Flag `--dry-run` imprimant la distribution `(category, kind)` sur N lignes.
4. [ ] Logger les `category` CSV tombant dans le fallback `moisturizer` /
       `body-lotion`.

### 3.4 Problème doublons FR/EN (historique)

Le seed mélange deux sources linguistiques :
- Manuel FR (`<brand>.seed.ts`)
- CSV EN (SkinSafe, ~8k produits)

Détection doublons basée sur `slug = slugify(brand + name)` → même produit,
deux langues = deux slugs = deux rows. Pollution du catalogue, UI mixte
FR/EN. Aucune décision prise. Pistes : EAN/GTIN, dictionnaire de traduction,
fuzzy match brand+name, priorité manuel.

- [ ] Décider d'une stratégie ou accepter le doublon comme design choisi.

---

## 4. Tags

### 4.1 Vocabulaire haircare / dental / supplement (seed DB)

Les fichiers shared `tag-slugs.ts` et `tag-taxonomy.ts` existent dans les 4
domaines ingrédients (skincare, haircare, dental, supplement) — mais seuls
skincare et supplement sont insérés en DB via `data/tags/index.ts`
(`ingredientTagData`). Les taxonomies haircare et dental sont définies dans
shared mais leurs slugs ne sont pas seedés.

À définir par domaine quand un cas d'usage frontend l'exigera :

- [ ] **haircare** — étendre `ingredientTagData` pour inclure
      `HAIRCARE_INGREDIENT_TAG_TAXONOMY`
- [ ] **dental** — étendre `ingredientTagData` pour inclure
      `DENTAL_INGREDIENT_TAG_TAXONOMY`
- [ ] **produits non-skincare** — `productTagData` ne couvre que skincare ;
      étendre quand les stubs haircare/dental/supplement produits seront remplis

### 4.2 `TAG_SLUGS` legacy dans `data/tags/index.ts`

`TAG_SLUGS` est un agrégat non typé (skincare ingrédient + skincare produit +
supplement ingrédient) encore consommé par `noreva-product-tags.ts` et les 12
entries haircare dans `haircare/ingredient-tags.ts` (qui réutilisent des slugs
skincare). Les re-exports shared (`shared/src/ingredients/tag-slugs.ts`,
`shared/src/products/tag-slugs.ts`) ont déjà été supprimés — il ne reste que
la constante locale dans `data/tags/index.ts`.

- [ ] Migrer `noreva-product-tags.ts` vers `SKINCARE_PRODUCT_TAG_SLUGS` typés,
      puis fusionner le fichier dans `noreva.seed.ts`
- [ ] Décider du sort des 12 entries haircare dual-domain : les conserver sur
      les slugs skincare (intentionnel) ou créer des slugs haircare équivalents
- [ ] Supprimer `TAG_SLUGS` une fois zéro consommateur
- [ ] Routes API qui filtrent/retournent des tags → audit
- [ ] Frontend (filtres, affichage) → audit

### 4.3 Feature exclusion par profil — ingrédients

La feature `avoid_for` existe côté produits. Hors scope de son itération
initiale : l'appliquer également aux ingrédients.

- [ ] `ingredientsSearchSchema.avoid_for`
- [ ] `backend/src/features/ingredients/service.ts` — clause `notInArray`
      équivalente
- [ ] Frontend `IngredientsPage` — toggle + fetch profil dermo

---

## 5. Problèmes connus — pipeline filtres

| ID | Sévérité | Problème | Piste |
|----|---|---|---|
| P1 | 🔴 Bloquant | Couverture tags faible sur produits CSV (288–792 / 8 053 pour `concern`/`skin_type`/`attribute`). AND multi-filtres retourne peu de résultats. | Améliorer l'algo de tagging (position INCI + claims marketing) |
| P2 | 🔴 Bloquant | `products.kind` : 25 valeurs, 2 sources, 2 langues → inutilisable en filtre. | Remplacer par `product_type` tag (§3.3 point 1) |
| P5 | 🟡 Moyen | Recherche texte incohérente : fuzzy (produits, pg_trgm) vs simple (ingrédients) | Harmoniser |
| P6 | 🟢 Faible | Tri minimal : seulement `name` et `random`. Pas de tri date/popularité. | — |
| P7 | 🟡 Moyen | camelCase `skinType` (ingrédients) vs snake_case `skin_type` (produits) | Harmoniser |

---

## 6. Design debt noté — pas d'action immédiate

- `shared/dist/` ne contient pas de JS → drizzle-kit ne peut pas importer
  de valeurs runtime depuis shared. Décision : laisser ainsi, drizzle-kit
  tourne via Bun qui charge le TS source (`"bun": "./src/index.ts"`).
  Duplication manuelle nécessaire si pgEnum construit depuis shared.
- `ingredients.category` Drizzle column sans `.$type<>()` — retiré après avoir
  cassé les spreads dans les seeds. Laissé sans cast, sécurisé par tests seed
  + futur CHECK constraint (§2.2).
- `ProductWithIngredients.category` encore optionnel dans
  `frontend/src/features/products/components/ProductForm/ProductForm.tsx`
  (`backend/dist/index.d.ts` stale pas rebuild en isolation). À rendre
  obligatoire après rebuild backend dist.
- `product.category`, `product.kind`, `product.unit` : pas de check constraint
  DB (typage TS + validation Zod suffisent en pratique, shared/dist sans JS
  rend la migration coûteuse — décision : accepter). Pas d'index sur
  `products.category` — filtrages par catégorie sur grande table feront un
  seq scan.

---

## Corrigés récemment

| Commit | Section | Correction |
|---|---|---|
| `d0c0cd6` | Ingrédients | Injection `type: 'skincare'` par défaut dans agrégation — 120 ingrédients skincare sans type explicite |
| `7505926` | Ingrédients | Migration 0026 — suppression `DEFAULT 'skincare'` + Zod `type` obligatoire |
| `cd05aab` | Ingrédients | 4 sets de catégories par domaine (skincare/haircare/dental/supplement) au lieu d'un set commun |
| `876f494` | Ingrédients | Prefix `SKINCARE_` / `HAIRCARE_` / `DENTAL_` sur les exports shared pour disambiguer |
| `ee95c32` | Shared | Regroupement `shared/src/ingredients/<domaine>/` et `shared/src/products/<domaine>/` |
| `c553a65` | Produits | Injection `category` via reverse-map `kindToCategory` — `category` n'est plus à renseigner dans les fichiers `.seed.ts` |
| `4d740d3` | Produits | `category` obligatoire dans `createProductSchema` (enum strict) ; ajout du `.refine()` category↔kind |
| `cd05aab` | Produits | `superRefine` dans `updateProductSchema` — `category` et `kind` doivent voyager ensemble |
| `c28371b` | Tags | Prefix `SKINCARE_PRODUCT_*` sur les exports tag slugs/taxonomy, ajout stubs domaine |
| `876f494` | Tags | Prefix `SKINCARE_INGREDIENT_*` sur les exports tag slugs/taxonomy, ajout stubs domaine |
| `ddd35b7` | Tags | Split tag slugs produit en fichiers par domaine (`shared/src/products/<domaine>/tag-slugs.ts`) |
| `88e6514` | Tags | Ajout taxonomie supplement (`SUPPLEMENT_INGREDIENT_TAG_TAXONOMY`, 4 catégories) |
| `ffc9d7f`..`c6058f5` | Ingrédients | Split `ingredient-slugs.ts` par domaine — 4 fichiers (`skincare/`, `supplements/`, `haircare/`, `dental/`) + barrel root 120L + 2 snapshot tests (597 clés, 595 slugs uniques) |
| `cae8526`..`03ba20f` | Tags | Split `ingredient-tags/index.ts` par domaine — 4 fichiers `ingredient-tags.ts` (376/26/12/0 entries) + shell 61L + 4 snapshot tests (414 entries totales) |

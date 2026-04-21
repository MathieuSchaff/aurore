# Seed & Taxonomie — Roadmap

> **À propos :** TODO list du seed + historique. Sections : dette ouverte (Infra / Ingrédients / Produits / Tags / Tests) et tableau des corrections récentes (avec SHAs). Répond à « qu'est-ce qui reste à faire ? » et « ça, c'est déjà fait ? ».

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
| P6 | 🟢 Faible | Tri minimal : seulement `name` et `random`. Pas de tri date/popularité/prix. | — |
| P7 | 🟡 Moyen | camelCase `skinType` (ingrédients) vs snake_case `skin_type` (produits) | Harmoniser |
| P8 | 🟢 Faible | Pas de filtre prix. `products.priceCents` existe en DB mais aucun paramètre `priceMin`/`priceMax` dans `skincareListProductsQuery`. Pas d'UI range côté frontend. | Ajouter params range backend + composant range/input frontend |
| P9 | 🟢 Faible | `GET /products/filter-options` retourne les tags sans compteur (`{ slug, name }`). UI ne peut pas afficher `"Acné (12)"`. Même limite côté ingrédients. | Enrichir la réponse avec `count` agrégé via junction |

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
- Pas de doc frontend pour les composants `Filter/` (FilterDrawer,
  FilterAccordion, SearchSelect, ActiveFiltersBar) ni pour les hooks
  `useListFilters` / `useTagFilterGroups`. `STATE.md` §5.5 liste les clés de
  filtre par page mais n'explique pas les props/variants. `frontend/docs/CSS_GUIDE.md`
  référencé dans `CLAUDE.md` n'existe pas. Décision : laisser tant que le code
  reste auto-explicatif, ajouter une page dédiée si un 3ᵉ consommateur de
  FilterDrawer apparaît.

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

---

## Journal de chantier (non-commité)

### 2026-04-21 — P6 sort étendu (backend)

- `shared/src/products/skincare/schemas.ts` : `sort` enum étendu avec `price_asc`, `price_desc`, `newest` (en plus de `name`, `random`).
- `backend/src/features/products/service.ts` (`listProducts`) : switch sur `filters.sort`. `price_asc`/`price_desc` → `NULLS LAST` pour ne pas faire remonter les produits sans prix. `newest` → `createdAt DESC NULLS LAST`.
- `backend/src/features/products/tests/products.test.ts` : 3 tests sort (`price_asc` NULLs last, `price_desc` NULLs last, `newest` par `createdAt`).
- Tests : 172/172 pass.
- Frontend : non touché à cette étape — UI sort à câbler plus tard.

### 2026-04-21 — P8 filtre prix range (backend)

- `shared/src/products/skincare/schemas.ts` : ajout `priceMin?` / `priceMax?` (integer ≥ 0, en centimes).
- `backend/src/features/products/service.ts` : conditions `gte(priceCents, priceMin)` / `lte(priceCents, priceMax)`. Les produits sans `priceCents` sortent naturellement (NULL en SQL rend les comparaisons falsy) — conforme à l'intention d'un filtre range.
- Import drizzle élargi : ajout `gte`, `lte`.
- `backend/src/features/products/tests/products.test.ts` : 4 tests range (`priceMin`, `priceMax`, bornes combinées, exclusion NULL).
- Tests : 176/176 pass.
- Frontend : non touché — UI range à câbler plus tard.

### 2026-04-21 — P9 counts par tag dans filter-options (backend)

- `shared/src/core/index.ts` : `tagItemSchema` enrichi d'un `count?: number` optionnel. Choix d'optionnel pour ne pas forcer les endpoints non-agrégés (filter-options ingrédients) à fournir des comptes.
- `backend/src/features/products/service.ts` (`getFilterOptions`) : requête SQL passe de `selectDistinct` à `select ... count(tagProducts.productId) ... GROUP BY`. Le type `FilterOptions` rend `count` obligatoire côté produit (contrat strict pour ce domaine).
- Décision : comptes **absolus** (ignorent les autres filtres actifs) et toutes relevances confondues — aligné sur le comportement actuel de `listProducts` qui ne filtre pas sur `relevance`. Des comptes contextuels seraient bien plus coûteux et nécessiteraient de passer l'état de filtre à `/filter-options`.
- `backend/src/features/products/tests/products.test.ts` : 1 test `getFilterOptions > should include product counts per tag`.
- Tests produits : 177/177 pass. Tests tags : 71 pass / 11 fail pré-existants (stash confirmé, aucun rapport avec les modifs P9).
- Frontend : types OK via structural typing (le `TagItem` local dans `useTagFilterGroups.ts` n'a pas `count` mais accepte un objet qui le contient). UI d'affichage des comptes à câbler plus tard.

### 2026-04-21 — Branchement frontend P6/P8/P9

Après le backend, câblage côté frontend.

- **Type + route search params**
  - `frontend/src/lib/queries/products.ts` : type `ProductSort` exporté, `ListProductsFilters` étendu (`sort` enum 5 valeurs, `priceMin?`, `priceMax?`). Sérialisation dans la query API pour les deux bornes prix.
  - `frontend/src/routes/products/index.tsx` : `extendedSchema` gagne `sort` (default `'random'`), `priceMin`, `priceMax` (optionnels). `extendedDefaults` aussi.
- **Sort UI**
  - Nouveau composant `frontend/src/features/products/components/SortControl/` — dropdown via `DropdownMenu` compound, 5 options (Découverte, Nom A-Z, Prix croissant/décroissant, Nouveautés).
  - Placé dans `PageHeader` de `ProductsPage` avant le bouton Filtrer. Déclenche `navigate({ sort, page: 1 })`.
  - Règle Découverte assouplie : `isDiscovery` = pas de filtre + pas de range prix + `sort === 'random'`. N'importe quelle intention utilisateur bascule en mode paginé (limit 20).
- **Prix range UI**
  - Nouveau composant `frontend/src/features/products/components/PriceRangeFilter/` — 2 inputs number (euros), commit `onBlur` ou `Enter`, conversion €↔centimes.
  - Injecté dans `FilterDrawer` via `children` (à côté du toggle profil). Le drawer ignore ces contrôles — ils naviguent directement.
  - `handleReset` nettoie aussi `priceMin`/`priceMax`.
  - `effectiveFilterCount` inclut `+1` si un range prix est actif.
- **Counts par tag**
  - `frontend/src/component/Filter/types.ts` : `FilterOption.count?: number`.
  - `frontend/src/hooks/useTagFilterGroups.ts` : propage `count` depuis le payload API.
  - `frontend/src/component/Input/ChipGroup/ChipGroup.tsx` : rend un `<span className="chip__count">` avec `aria-hidden` + texte `sr-only` pour les lecteurs d'écran. Style discret (opacity 0.65, tabular-nums).
- **Validation**
  - Types : frontend tsc clean, shared tsc clean, backend tsc clean.
  - Lint biome : 0 erreur / 0 warning sur fichiers touchés.
  - Tests frontend vitest : **159 pass** / 18 fail — les 18 fails sont **pré-existants** (confirmé via `git stash`). +13 nouveaux tests ajoutés :
    - `SortControl` (4 tests) : rendu label courant, fallback sur valeur inconnue, les 5 options dans le menu, onChange au clic
    - `PriceRangeFilter` (9 tests) : rendu vide/pré-rempli, sync avec props (reset), commit on blur, commit on Enter, clear sur input vidé, no-op si valeur inchangée, no-op sur négatif, clear bound existant sur négatif
  - Browser : **non testé en session** — rebuild docker pas lancé. À valider manuellement en ouvrant `/products` : dropdown Sort dans header, inputs prix dans drawer, counts dans les chips.
  - `STATE.md` §5.5 mis à jour pour refléter les 3 contrôles hors-drawer (Sort, PriceRange, profile toggle) + nouvelle règle Découverte + counts.

### 2026-04-21 — Couverture tests frontend complète

Comblé tous les trous côté frontend après audit matrice. **222/240 pass** (+63 nouveaux), 18 fails pré-existants inchangés.

Refactos pour rendre les choses testables :
- `productsSearchSchema` + `productsSearchDefaults` extraits de `routes/products/index.tsx` vers `features/products/filters.ts` (import depuis la route).
- Logique métier de `ProductsPage` extraite vers `features/products/helpers.ts` : `hasActivePriceRange`, `isDiscoveryMode`, `buildProductsApiFilters`, `buildResetSearchParams`.
- Sérialisation de la query API extraite vers `buildListProductsQuery` exporté depuis `lib/queries/products.ts`.

Nouveaux tests :
- **ChipGroup counts** (`component/Input/ChipGroup/__tests__/ChipGroup.test.tsx`, 5 tests) : pas de span sans count, rendu label+badge, sr-only "(N résultats)", count=0 affiché, click toujours fonctionnel.
- **useTagFilterGroups** (`hooks/tests/useTagFilterGroups.test.tsx`, 5 tests) : undefined payload, propagation count, count absent, labelOverrides + count, structure FilterGroupConfig.
- **productsSearchSchema** (`features/products/__tests__/filters-schema.test.ts`, 13 tests) : defaults, 5 valeurs sort acceptées (it.each) + rejet valeur inconnue, priceMin/Max positifs, zéro accepté, négatif rejeté, non-entier rejeté, tag arrays, profile_filter.
- **buildListProductsQuery** (`lib/queries/__tests__/products-serialization.test.ts`, 12 tests) : empty, string vs array, 11 clés array, sort, priceMin/Max (avec zéro), page/limit.
- **ProductsPage helpers** (`features/products/__tests__/helpers.test.ts`, 18 tests) : `hasActivePriceRange` × 4, `isDiscoveryMode` × 4, `buildProductsApiFilters` × 6 (discovery, avoidFor, paginated, tag arrays vides, sort seul, price seul), `buildResetSearchParams` × 2.
- **FilterDrawer flow** (`component/Filter/FilterDrawer/__tests__/FilterDrawer.test.tsx`, 6 tests) : pas d'apply à l'ouverture, modify + apply, toggle off, OR intra-catégorie, reset wipe state, children rendus. Polyfill `HTMLDialogElement.showModal`/`close` local au fichier (jsdom ne les implémente pas).

Validation :
- Types : `bunx tsc --noEmit` clean.
- Lint biome : propre après autofix (imports reformatés).
- Vitest : 222/240 pass (18 fails pré-existants stricts sur `collection/__integration__`, `Toggle`, `PaletteSettings`, `ProductDetailSheet`, `useQuickAdd`, `CriteriaList` — aucun rapport avec mes modifs, confirmé via l'invariance pré/post changes).

### 2026-04-21 — Couverture tests backend complète (listProducts + getFilterOptions)

Après l'audit "qu'est-ce qui n'est PAS testé", comblé tous les trous dans `listProducts` et `getFilterOptions`. +22 tests, **199/199 pass**.

- **Sort** (3 nouveaux) : `sort=name` explicite, default (sans param) = name ASC, `sort=random` retourne tous les items sans erreur.
- **Ingredient filter** (2) : slug unique → filtre OK, slugs multiples → OR.
- **8 tag categories** (paramétrés) : `skin_type, concern, skin_zone, product_type, routine_step, skin_effect, product_label, shared_label` — un test par catégorie, tous vérifient que seuls les produits taggés ressortent.
- **Logique AND/OR** (2) : OR intra-catégorie (2 slugs concern → union), AND inter-catégories (skin_type × concern → intersection).
- **avoid_for** (2) : produits `relevance='avoid'` exclus ; produits `relevance='primary'` sur le même slug **non** exclus (confirme le scope limité au relevance='avoid').
- **Pagination** (3) : `limit` respecté, page hors bornes retourne items vides avec total correct, pages 1 et 2 sans chevauchement.
- **getFilterOptions scope** (2) : tags hors `PRODUCT_FILTER_CATEGORIES` (ex: catégorie inventée) n'apparaissent pas ; tags orphelins (définis mais sans lien produit) exclus par l'INNER JOIN.

Aucune régression : tests produits 199/199 pass, lint 0/0, types clean.

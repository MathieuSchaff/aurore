# Roadmap - Filtres Produits

Ce document liste les améliorations, correctifs et évolutions identifiés pour le système de filtrage de la page produits.

## 🚨 Régression TS — Résolue (effondrement AppType Hono RPC)

- [x] **~50 erreurs `ts-verify` / ~195 `ts-build` sur features non touchées (`blog/`, `collection/`, `profile/`, `ProductsPage.tsx`).** Symptôme dominant : `implicit any` (TS7006), `'item' is of type 'unknown'` (TS18046), `Property X does not exist on type '{ id: string; name: string; }'` (TS2339). Tous les fichiers pointaient vers des appels Hono RPC dont le type retour s'était dégradé en `any`/`unknown`.

### Diagnostic

1. **Inspection des `.d.ts` émis** : dans `backend/dist/index.d.ts`, `AppType` était collapsé à `HonoBase<AppEnv, BlankSchema | MergeSchemaPath<{}, "/api/auth"> | MergeSchemaPath<{}, "/api/health"> | …>` — **tous les schemas de routes vides (`{}`)**. Le frontend, qui consomme ce type via `hc<AppType>`, perdait toute info de routes/payloads → tout retombait en `any`.
2. **Vérification cache TS** : nettoyage de `shared/dist`, `shared/tsconfig.tsbuildinfo`, `backend/dist`, `backend/tsconfig.tsbuildinfo`, `frontend/tsconfig.tsbuildinfo` puis rebuild complet (`bunx tsc -b`). L'effondrement persistait → ce n'était pas un cache stale.
3. **Bisect du working tree** (105 fichiers WIP) : stash de tous les fichiers backend non-seed/non-test + `shared/src/products/list-products-query.ts` + schemas DB (13 fichiers ciblés). Résultat post-stash : passage de ~50 erreurs à **4 erreurs propres** (toutes attendues : `profileMatches` manquant, route `by-slugs` absente). Confirmation que le coupable est dans ces 13 fichiers, pas dans le frontend WIP.
4. **Bisect raffiné** : application progressive des fichiers stashés. Lorsque `backend/src/features/products/service.ts` a été ré-introduit, des erreurs `Cannot find module 'src/db/schema'` et `Cannot find module 'src/features/products/product-ingredients/product-ingredients.service'` sont apparues. Ces imports utilisent un style **path absolu** s'appuyant sur `baseUrl: "."` du `backend/tsconfig.json`.

### Cause racine

Trois imports absolus `'src/...'` dans le backend (présents depuis HEAD `bc8d5d4`, **pas introduits par la WIP**, mais réveillés par les modifs adjacentes WIP qui forcent une nouvelle inférence) :

| Fichier | Ligne | Import absolu |
|---|---|---|
| `backend/src/features/auth/routes.ts` | 21 | `from 'src/features/auth/google.service'` |
| `backend/src/features/products/service.ts` | 35 | `from 'src/db/schema'` |
| `backend/src/features/products/service.ts` | 36 | `from 'src/features/products/product-ingredients/product-ingredients.service'` |

Avec `moduleResolution: "Bundler"` + `composite: true` + références TS, ces imports résolvaient mal côté `tsc -b`. Quand l'inférence Hono RPC traversait `auth/routes.ts` ou `products/service.ts`, elle rencontrait des modules non résolus, et **propageait silencieusement un schema `{}` à toute la chaîne `app.route(...)`**, contaminant l'union `AppType` entière (toutes les routes, pas seulement auth/products).

### Fix appliqué

Conversion des 3 imports absolus en relatifs :

```diff
- import { getGoogleAuthUrl, handleGoogleCallback } from 'src/features/auth/google.service'
+ import { getGoogleAuthUrl, handleGoogleCallback } from './google.service'
```

```diff
- import { ingredients, productIngredients } from 'src/db/schema'
- import { listIngredientsByProduct } from 'src/features/products/product-ingredients/product-ingredients.service'
+ import { ingredients, productIngredients } from '../../db/schema'
+ import { listIngredientsByProduct } from './product-ingredients/product-ingredients.service'
```

### Avant / Après

| Commande | Avant fix | Après fix |
|---|---|---|
| `bunx tsc -b` (= `make ts-build`) | passait silencieusement mais émettait un `AppType` cassé | ✅ passe, émet `AppType` complet (routes typées) |
| `make ts-verify` (`bunx tsc -b --noEmit`) | ~50 erreurs (cascade `implicit any` frontend) | ❌ 1 erreur résiduelle (TS6310 — voir ci-dessous) |
| `frontend/dist/...` AppType inféré | `MergeSchemaPath<{}, "/api/auth"> \| …` (tous vides) | schemas complets par route |

### Problème résiduel (pré-existant, non lié à la roadmap) — Résolu

- [x] **`TS6310: Referenced project '/shared' may not disable emit`** sur `backend/tsconfig.json(40,5)`. Faux positif déclenché par `bunx tsc -b --noEmit` quand un projet référencé en `composite` a `emitDeclarationOnly: true` (cas de `shared/`). Bug connu TS 5.6+. **Fix** : `Makefile` → `ts-verify: bunx tsc -b` (sans `--noEmit`). `tsc -b` est incrémental, donc reste rapide en fin de session, et émet les `.d.ts` à jour comme effet bord utile. `ts-check` (`tsc -b --watch`) inchangé — n'avait jamais le flag `--noEmit`.

## 🐛 Bugs à corriger

- [x] **Pagination masquée** : ~~La pagination ne s'affiche pas si seuls les filtres de prix ou de profil sont actifs (car `hasFilters` ne prend en compte que les tags).~~ Gate remplacée par `totalPages > 1 && sort !== 'random'` dans `ProductsPage.tsx`.
- [x] **Filtre `kind` manquant en Skincare** : ~~L'onglet "Soin visage" n'affiche pas le filtre de type de produit (`kind`), contrairement aux autres domaines (Cheveux, Dents, etc.).~~ Branches skincare/non-skincare unifiées dans `filterGroups` (`ProductsPage.tsx`) — `kind` exposé sur tous les onglets.
- [x] **Instabilité du tri Random** : ~~Le tri `random()` en backend change à chaque changement de page, rendant la pagination incohérente en mode "Découverte".~~ Default sort = `newest` (stable, paginable). Random reste opt-in via `SortControl` mais la pagination se cache automatiquement quand `sort === 'random'`.
- [x] **Chip quantité affiche `0` parasite** : `{product.totalAmount && (...)}` rendait le littéral `0` quand `totalAmount === 0`. Remplacé par `product.totalAmount != null && product.totalAmount > 0` dans `ProductsPage.tsx`.

## 💄 Améliorations UX / UI

- [x] **Filtres actifs manquants** : ~~Afficher les filtres de **Prix** et de **Profil** dans la `ActiveFiltersBar`.~~ Ajout d'un prop `extraChips` à `ActiveFiltersBar` ; chips Prix (range / borne) et Profil rendus côté `ProductsPage`. `onClearAll` recâblé sur `handleReset` pour réinitialiser aussi prix + profil.
- [x] **Indicateurs de profil sur les cartes** : ~~Afficher un badge de compatibilité (ex: "Éviter") directement sur les cartes dans la liste pour les utilisateurs connectés.~~ Backend `listProducts` ne masque plus les produits via `avoid_for` ; il calcule `profileMatches: string[]` (slugs `relevance='avoid'` ∩ profil) par produit. Frontend rend un badge `list-card__avoid-badge` (icône `AlertTriangle` + tooltip listant les concerns FR via `SKIN_TYPE_LABELS` / `SKIN_CONCERN_LABELS`). Toggle « Selon mon profil » repositionné en hint « Signale… » au lieu de « Masque… ».
- [x] **Expérience "Découverte" (Sort: random)** : ~~Augmenter le `staleTime` (actuellement à 0) pour éviter les changements de liste trop fréquents lors de la navigation retour.~~ `staleTime` passe à 5 min quand `sort === 'random'` (sinon comportement inchangé : 5 min si filtres actifs, 0 sinon). Évite que `random()` reshuffle l'ordre au retour.
- [x] **Messages d'état vide (Empty State)** : ~~Ajuster le message pour suggérer de modifier les filtres si des filtres sont actifs.~~ Empty state branché sur `effectiveFilterCount` dans `ProductsPage.tsx` : message + bouton "Tout effacer" si filtres actifs ; message "catalogue s'enrichit" sinon. Plus dépendant de `category`.

## 🛠️ Dette Technique & Refactoring

### Frontend
- [x] **Alignement taxonomique** : ~~Remplacer les chaînes en dur dans `unitClass` et `kindClass` par les constantes issues de `shared/src/products/` (`PRODUCT_UNITS`, `PRODUCT_KINDS`).~~ `kindClass` dérive la category via reverse lookup `PRODUCT_KINDS` ; `unitClass` valide contre `PRODUCT_UNITS`. Les anciennes chaînes FR (`pompe`, `crème`, `compte-gouttes`…) et les pseudo-kinds (`vitamine`, `complément`) supprimés. Effet visuel : produits skincare/complement adoptent la couleur de catégorie (CSS existant) au lieu de retomber en `kind--default`.
- [x] **Validation stricte `kind` / `category`** : ~~Renforcer le schéma Zod des filtres pour valider la cohérence entre la catégorie et le type de produit (éviter `?category=dental&kind=serum`).~~ `kind` per-domaine validé via `kindFilterFor(domain)` dans `shared/src/products/list-products-query.ts` ; valide chaque token CSV contre l'union des `PRODUCT_KINDS` des DB-categories du tab (`PRODUCT_DOMAIN_DB_CATEGORIES`). Skincare accepte donc `serum` + `sunscreen` (solaire) + `body-lotion` (bodycare), refuse `shampoo`. Tests : `products.routes.test.ts` (rejet cross-domaine + accept solaire sur skincare).
- [x] **Performance du filtre Ingrédients** : ~~Passer à une recherche asynchrone (autocomplete API) pour le filtre ingrédients au lieu de charger la liste complète (`allIngredients`) en mémoire.~~ Filtre `ingredient` passe en variant `async-search-select`. Nouveau composant `AsyncSearchSelect` (clone UX de `SearchSelect` + debounce 250 ms + 2 requêtes via TanStack : `loadOptionsQuery` pour la recherche + `resolveValuesQuery` pour résoudre les labels des chips déjà sélectionnés depuis l'URL). Backend route `GET /ingredients/by-slugs?slugs=...` ajoutée pour la résolution batch (cap 50 slugs, ILIKE non requis car lookup exact). `ingredientQueries.options()` (chargement complet) plus consommé par `ProductsPage`. Cache labels mergé : ce qui passe par la recherche ou la résolution est mémorisé côté composant pour ne pas re-fetch après toggle.
- [x] **BrandCombobox (Race Condition)** : ~~Remplacer le `setTimeout` dans `handleBlur` par une solution robuste (gestion du focus via `onMouseDown`).~~ Le `mousedown.preventDefault` sur les options du `ComboboxPrimitive` empêche déjà le blur via clic ; le `setTimeout(200)` masquait en fait une closure périmée sur Tab-autocomplete (`handleSelect` → `setInputValue` async, blur natif lit `inputValue` stale → confirm parasite sur sélection valide). Remplacé par `latestValueRef` (sync, mis à jour dans `handleInputChange` / `handleSelect` / `useEffect` sur prop `value`) lu par `handleBlur`. Plus de delay artificiel.
- [x] **Cohérence du switch de domaine** : ~~Décider si le filtre `brand` doit être conservé lors du changement d'onglet (actuellement réinitialisé, contrairement aux ingrédients).~~ `brand` persiste désormais (cohérence avec `ingredient`). Justifié : nombreuses marques cross-domaine (Avène, Bioderma, La Roche-Posay…). Marque mono-domaine sur onglet incompatible → empty state + bouton « Tout effacer » (pas un dead-end). `buildDomainSwitchSearch` ne reset plus que `kind` (taxonomie domaine-spécifique), tags du domaine, `profile_filter`, `page`. Test mis à jour dans `helpers.test.ts`.

### Backend
- [x] **Normalisation des données** : ~~Centraliser la normalisation des textes (trim, espaces multiples) pour qu'elle soit appliquée aussi lors des `updateProduct` (actuellement uniquement en `create`).~~ `normalizeString` hissé au module ; `NORMALIZED_STRING_FIELDS` (`name`, `brand`, `kind`, `unit`, `amountUnit`) appliqué dans `updateProduct` avant calcul du slug et build des `setEntries`.
- [x] **Optimisation SQL (Filters)** : ~~Évaluer le remplacement des sous-requêtes `IN (...)` par des `EXISTS` ou `JOIN` pour les filtres de tags et d'ingrédients.~~ Sous-requêtes `IN (SELECT ... FROM productIngredients/tagProducts ...)` dans `listProducts` remplacées par `exists(...)` corrélé sur `products.id`. Le planner peut court-circuiter au premier match par produit et utiliser `product_ingredients_product_idx` / index sur `tag_products.product_id` comme driver.
- [x] **Indexation Fuzzy Search** : ~~Vérifier la présence d'index `pg_trgm` (GIST/GIN) pour `findSimilarProducts` et `searchProducts` afin de garantir les performances.~~ Extension `pg_trgm` déjà présente (baseline 0000) mais aucun index trigram. Ajout dans schemas Drizzle : `products_name_trgm_idx`, `products_brand_trgm_idx` (GIN `gin_trgm_ops`) pour `similarity()` + `ILIKE %q%` de `searchProducts` / `findSimilarProducts`. Migration `0032_parched_wiccan.sql`. Ajout également de `ingredients_name_trgm_idx` + `ingredients_slug_trgm_idx` pour préparer l'autocomplete async (`searchIngredients` ILIKE `%q%`).

## 🧹 Nettoyage labels (2026-04-25) — Fait

- [x] **Labels FR non-tag dupliqués** : ~~`'Marque'`, `'Ingrédient'`, `'Type'` hardcodés à la fois dans `filters.ts` (`GROUP_LABELS`) et dans `ProductsPage.tsx` (`filterGroups`).~~ Extraction de `NON_TAG_FILTER_LABELS` + `NON_TAG_FILTER_PLACEHOLDERS` dans `filters.ts`. `GROUP_LABELS` les compose (au lieu de re-écrire). `ProductsPage.tsx` consomme les constantes pour `label` + `placeholder` des filtres `kind` / `brand` / `ingredient`. Plus de drift possible entre `ActiveFiltersBar` (qui lit `GROUP_LABELS`) et le drawer.

## 🧩 Filtres shared-driven (2026-04-25) — Fait

Refacto plan : `PLAN_shared_filters.md` (terminé).

- [x] **Phase A** — Lift labels FR dans `shared/src/products/{skincare,haircare,dental,supplement}/tag-taxonomy.ts` (`*_PRODUCT_TAG_LABELS`). Helpers `getProductTagLabel` + `getProductTagsByCategory` exposés depuis `@habit-tracker/shared`. Backend seed (`tags/index.ts`) split en `labelForIngredient` (lookup local `INGREDIENT_TAG_LABELS`) + `labelForProduct` (lookup shared).
- [x] **Phase B** — `getFilterOptions` retourne `tagCounts: Record<string, number>` (slug → count) au lieu d'un `tags: Record<TagCategory, …[]>`. Query SQL simplifiée (plus de filtrage par `tagType`). Tests `products.test.ts` réécrits, 76/76 ✅. Hono RPC propage automatiquement le nouveau shape.
- [x] **Phase C** — Nouveau hook `useProductTagFilterGroups(domain, tagCounts, labelOverrides?)` (fork de `useTagFilterGroups`, ce dernier reste pour `IngredientsPage` en mode DB-driven). Drawer itère la taxonomy shared → tous les axes haircare (`hair_type`, `concern`, `routine_step`, `hair_effect`, `product_label`) toujours visibles, même sans produits liés ; chips `count=0` rendus disabled. `FilterOption.disabled?: boolean` ajouté + propagation dans `ChipGroup` (variantes radio + button). Tests `useProductTagFilterGroups` 5/5 ✅.
- [x] **Cleanup** — `DOMAIN_TAG_META` inliné dans `useProductTagFilterGroups.ts` (seul consommateur). `DOMAIN_TAG_KEYS` supprimé (orphelin). `filters.ts` allégé.

**Validation visuelle** : drawer haircare confirme les 6 accordéons + chips count=0 grayed (utilisateur 2026-04-25). Skincare no-regress.

**Reste** :
- `make db-seed` non relancé — diff DB labels attendu nul (Phase A préserve les chaînes, source change).

## 🚧 Tab Cheveux — État des lieux (2026-04-25)

Audit visuel du drawer haircare. Tags vides + UX confuse côté kind.

### 🐛 Frontend (à fixer)

- [x] **Doublon "Type" dans le drawer** : ~~deux filtres portent le label "Type" (tag `product_type` + `kind` "Recherche précise").~~ `NON_TAG_FILTER_LABELS.kind` renommé "Type" → "Format" (`filters.ts`). Placeholder ajusté à "Tous formats". `product_type` (taxonomy fonctionnelle) garde "Type", `kind` (galénique / sous-type produit) devient "Format".
- [x] **`kind` affiche les slugs bruts** : ~~`ProductsPage.tsx:208` rendait `hair-serum`, `shampoo`, `styling` etc.~~ Map `PRODUCT_KIND_LABELS` (FR par slug, couvre les 6 catégories DB) ajoutée dans `shared/src/products/kinds.ts` + helper `getProductKindLabel`. Consommée dans `ProductsPage.tsx` pour les options du filtre `kind` et le chip `list-card__kind` sur les cartes. Re-export depuis `@habit-tracker/shared`.

### 🌱 Seed haircare — Root cause

Backend `getFilterOptions` renvoie `[]` pour `hair_type`, `concern`, `routine_step`, `hair_effect`, `product_label`. Cause **pas un bug d'affichage** : aucun produit haircare n'est lié à un tag de la taxonomy haircare.

#### Diagnostic

`backend/src/db/seed/data/tags/index.ts:30-45` — l'alias legacy `TAG_SLUGS` spread :
```ts
SKINCARE_INGREDIENT_TAG_SLUGS, SKINCARE_PRODUCT_TAG_SLUGS,
SUPPLEMENT_INGREDIENT_TAG_SLUGS, DENTAL_INGREDIENT_TAG_SLUGS,
HAIRCARE_INGREDIENT_TAG_SLUGS, DENTAL_PRODUCT_TAG_SLUGS,
SUPPLEMENT_PRODUCT_TAG_SLUGS,
```
**`HAIRCARE_PRODUCT_TAG_SLUGS` est absent.**

Conséquence : quand un seed haircare écrit `TAG_SLUGS.SHAMPOING`, c'est le slug **skincare** `'shampoing'` (legacy hérité de l'époque où skincare contenait `shampoing`, `apres-shampoing`, `masque-cheveux`, `serum-cheveux`, `huile-cheveux`, `produit-coiffant` — cf. `shared/src/products/skincare/tag-slugs.ts:95-100`). Insertion DB : `tagType='product_type'` via `SKINCARE_PRODUCT_TAG_TAXONOMY`, label `'Shampoing'`.

Pipeline (`backend/src/db/seed/data/tags/index.ts:525-531`) insère bien les définitions `HAIRCARE_PRODUCT_TAG_*` dans `productTagsDefs`, mais aucun produit n'y est lié. `getFilterOptions` (`INNER JOIN tagProducts`) ne renvoie que les tags avec ≥1 produit lié → 5 catégories haircare retournent `[]`.

`product_type` apparaît parce que ce tagType est partagé skincare/haircare ; les 9 produits haircare portent les slugs skincare legacy → 3 chips ("Shampoing", "Sérum cheveux", "Produit coiffant").

#### Plan de fix

- [x] **Migration mécanique des 50 seeds haircare (2026-04-25)** :
  - Ajout `export { HAIRCARE_PRODUCT_TAG_SLUGS } from '@habit-tracker/shared'` dans `backend/src/db/seed/data/tags/index.ts` (avec note expliquant pourquoi PAS via spread dans `TAG_SLUGS` : collision `BRILLANCE` / `HYDRATATION` qui ont des slug values différentes côté skincare et haircare → `'brillance'` vs `'brillance-cheveux'`).
  - Bulk replace via `sed` sur 50 fichiers `haircare/*/*.seed.ts` :
    - `TAG_SLUGS.SHAMPOING` → `HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING` (262 occ)
    - `TAG_SLUGS.APRES_SHAMPOING` → `…APRES_SHAMPOOING` (41 occ)
    - `TAG_SLUGS.SERUM_CHEVEUX` → `…SERUM_CAPILLAIRE` (33 occ)
    - `TAG_SLUGS.MASQUE_CHEVEUX` → `…MASQUE_CAPILLAIRE` (3 occ)
    - `TAG_SLUGS.HUILE_CHEVEUX` → `…HUILE_CAPILLAIRE` (3 occ)
  - 6 occurrences `PRODUIT_COIFFANT` mappées manuellement (slug absent de `HAIRCARE_PRODUCT_TAG_SLUGS`) :
    - `biorene` Crème de Coiffage → `CREME_COIFFANTE`.
    - `olaplex` N°6 Bond Smoother (Crème Coiffante) → `CREME_COIFFANTE`.
    - `lesSecretsDeLoly` Gelée Boost Curl → `GEL_COIFFANT`.
    - `redken` Pommade Maneuver + Pommade Clay → `CIRE_COIFFANTE` (×2).
    - `cinqSurCinq` Kit Anti-Poux Spray → `SPRAY_COIFFANT` *(mauvaise catégorisation, voir flag ci-dessous)*.
  - Imports `import { TAG_SLUGS } from …` remplacés par `import { HAIRCARE_PRODUCT_TAG_SLUGS } from …` (paths préservés).
  - `tsc -b` ✅, `biome check` ✅. **À faire : re-seed DB pour appliquer les nouveaux slugs** (sinon le frontend continue à lire les anciens slugs skincare-flavored attachés aux produits haircare).
- [ ] **Enrichir tags haircare** : ajouter `hair_type` / `concern` / `routine_step` / `hair_effect` / `product_label` sur chaque produit haircare (au moins 1 tag par axe pertinent). Phase 2 — sémantique, demande lecture produit par produit.
- [x] **Slugs hair legacy côté skincare supprimés (2026-04-25)** : ~~`shampoing`, `apres-shampoing`, `masque-cheveux`, `serum-cheveux`, `huile-cheveux`, `produit-coiffant` dans `SKINCARE_PRODUCT_TAG_SLUGS`.~~ Vérification DB : 6 rows existent en `product_tags` (type `product_type`) avec `used = 0` (aucune ref `tag_products`) → safe. Suppression :
  - `shared/src/products/skincare/tag-slugs.ts:95-100` (6 keys)
  - `shared/src/products/skincare/tag-taxonomy.ts:110-115` (labels FR)
  - `shared/src/products/skincare/tag-taxonomy.ts:259-264` (bucket `product_type`)
  - `backend/src/db/seed/scripts/auto-tag.ts` : retrait des 6 entries `SLUG_TO_KEY`, refacto `KIND_HAIRCARE_PRIMARY` (5 mappings sur slugs `HAIRCARE_PRODUCT_TAG_SLUGS` corrects, `styling` retiré car ambigu), ajout `HAIRCARE_SLUG_TO_KEY` + `slugToCode` namespace-aware → émet `HAIRCARE_PRODUCT_TAG_SLUGS.X` pour slugs haircare, `TAG_SLUGS.X` sinon.
  - `backend/src/db/seed/data/tags/index.ts:151-156` (legacy `INGREDIENT_TAG_LABELS` dead).
  - **Reste** : DB cleanup (`DELETE FROM product_tags WHERE slug IN (...) AND type = 'product_type'`) — rows orphelines après suppression du source, à exécuter manuellement.

#### Flag

- **`cinqSurCinq` mal catégorisé** : c'est une marque anti-poux (insecticide / pediculicide), pas un produit capillaire d'usage courant. Forcer dans `SPRAY_COIFFANT` / `SHAMPOOING` est une approximation. À reclasser proprement (nouvelle catégorie `treatment-cuir-chevelu` ou exclusion du domaine haircare).

### Priorité

1. **Seed haircare** : migrer les slugs + enrichir tags (débloque les 5 groupes vides).
2. **Frontend `kind` labels FR** : mapping shared.
3. **Clarté UX `kind` vs `product_type`** : renommer ou masquer (orthogonal au fix seed).

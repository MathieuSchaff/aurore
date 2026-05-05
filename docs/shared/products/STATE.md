# Products — État transverse (shared + backend + frontend)

Doc de référence du domaine `products` à travers les 3 couches. Couvre :
schéma DB, taxonomie, validation Zod, routes, service, UI state, flow de bout en bout.

> Ce fichier vit dans `shared/src/products/` par convenance (langage commun des 3 couches)
> mais sa portée est cross-layer.

---

## 1. Layout

### Shared (`shared/src/products/`)

```
index.ts
types.ts                 # ProductSearchResult, ProductErrorCode, Create/Update/Changes Inputs
schemas.ts               # Zod: createProductSchema, updateProductSchema, productChangesSchema, searchProductsQuery
kinds.ts                 # PRODUCT_CATEGORIES, PRODUCT_KINDS (nested par category)
units.ts                 # PRODUCT_UNITS (nested par category, mirror kinds)
helpers.ts               # productErrorMapping + AllProductTagCategory (union 4 domaines)
                         # + DOMAIN_PRODUCT_FILTER_CATEGORIES: Record<ProductDomainTab, readonly AllProductTagCategory[]>
                         #   (source de vérité cross-layer pour dispatcher les clés par domaine)
ingredients.ts           # createProductIngredientSchema + error mapping
domain-tabs.ts           # PRODUCT_DOMAIN_TABS ↔ ProductCategory
list-products-query.ts   # z.discriminatedUnion('category') — 4 branches
                         # Exporté sélectivement via index.ts (complementListProductsQuery,
                         # ComplementListProductsFilters, listProductsQuery, ListProductsFilters)
{skincare,haircare,dental,supplement}/
    schemas.ts               # {domain}ProductFilterOptionsSchema
    tag-slugs.ts             # constants slug (DB-facing, immutables)
    tag-taxonomy.ts          # {DOMAIN}_PRODUCT_TAG_CATEGORIES (toutes les catégories remplies)
    tag-filters.ts           # {DOMAIN}_PRODUCT_TAG_CATEGORY_META (label, placeholder, tier, order)
                             # + {domain}ProductFilterCategories() — retourne les clés triées par order
```

### Backend (`backend/src/features/products/`)

```
index.ts
routes.ts                # Hono app: GET list/search/filter-options/brands/:slug, POST, PATCH, DELETE
service.ts               # createProduct, listProducts, getFilterOptions, findSimilar, searchProducts…
product-error.ts         # ProductError class
product-ingredients/
    routes.ts                # Sous-router: GET/POST/PATCH/DELETE/PUT sur product_ingredients
    product-ingredients.service.ts
    product-ingredients-error.ts
product-tags/
    routes.ts                # GET/:productId/tags, PUT (replace)
tests/
```

### Frontend (`frontend/src/features/products/` + `frontend/src/routes/products/` + `frontend/src/lib/queries/products.ts`)

```
routes/products/
    index.tsx                # /products — list page (validateSearch)
    new.tsx                  # /products/new — creation
    $slug.tsx                # /products/:slug — detail
    $slug/                   # nested /products/:slug/...

features/products/
    filters.ts               # productsSearchSchema, FILTER_KEYS, GROUP_LABELS, productsSearchDefaults
    helpers.ts               # isDiscoveryMode, buildProductsApiFilters, buildDomainSwitchSearch, …
    components/
        ProductsPage.tsx         # liste + filter drawer + tabs
        ProductLayout.tsx, ProductInfoTab.tsx, ProductForm/, …
        AddToCollectionModal/, BrandCombobox/, IngredientSearch/, PriceRangeFilter/, SortControl/
    __tests__/

lib/queries/products.ts        # TanStack Query: productQueries.list / filterOptions / bySlug,
                                # useCreateProduct, useUpdateProduct, useDeleteProduct
                                # + buildListProductsQuery (array → CSV)
                                # + ListProductsFilters (type LOCAL, dupliqué vs shared — voir §12)
```

---

## 2. Schéma DB (référence)

```ts
// backend/src/db/schema/products/products.ts
products pgTable {
  id: uuid primary (default uuidv7),
  createdBy: uuid → users.id (cascade),
  name, brand,
  category: text $type<ProductCategory>,
  kind:     text $type<ProductKind>,
  unit:     text $type<ProductUnit>,
  inci, description,
  totalAmount: int, amountUnit: text,      // null si identique à unit
  slug: text,
  url, imageUrl, notes,
  priceCents: int,
  createdAt, updatedAt,
}
// indexes: kind, created_by, UNIQUE(lower(name), lower(brand)), UNIQUE(slug)
```

Tables liées : `product_ingredients` (pivot vers ingrédients + concentration),
`tag_products` (pivot vers `product_tags_defs`), `product_edits` (audit jsonb).

---

## 3. Taxonomie (shared)

### 3.1 `ProductCategory` — 6 valeurs stables

```
skincare | solaire | complement | haircare | bodycare | dental
```

### 3.2 `ProductKind` par category

| Category    | Kinds |
|-------------|-------|
| skincare    | serum, moisturizer, cleanser, toner, exfoliant, eye-cream, mask, mist, essence, spot-treatment, lip-care, balm, oil, primer, patch |
| solaire     | sunscreen, after-sun, self-tanner |
| complement  | gelule, capsule, ampoule, poudre, sirop, gummy, huile |
| haircare    | shampoo, conditioner, hair-mask, hair-serum, hair-oil, styling |
| bodycare    | body-lotion, body-oil, body-scrub, body-wash, deodorant, hand-cream, foot-cream |
| dental      | toothpaste, mouthwash, teeth-whitening, floss |

`ProductKind` = union plate de toutes les feuilles. Validation `category ↔ kind` via
`createProductSchema.refine` / `updateProductSchema.superRefine`.

### 3.3 `ProductUnit` par category (structure mirror `PRODUCT_KINDS`)

```ts
PRODUCT_UNITS = {
  skincare:   { PUMP, DROPPER, JAR, TUBE, BOTTLE, SPRAY, PACK, ROLLER, BAR },
  solaire:    { TUBE, SPRAY, AEROSOL, BOTTLE, PUMP, STICK },
  complement: { TABLET, CAPSULE, GUMMY, SACHET, POWDER, BOTTLE, STICK, AMPOULE },
  haircare:   { BOTTLE, TUBE, PUMP, SPRAY, JAR, SACHET, CARTRIDGE },
  bodycare:   { TUBE, BOTTLE, PUMP, JAR, BAR, SPRAY, STICK },
  dental:     { TUBE, PACK, BOTTLE, SPRAY },
}
type ProductUnit = union plate des feuilles
PRODUCT_UNIT_VALUES: [ProductUnit, ...ProductUnit[]]  // dédupliqué
```

- Validation Zod : `z.enum(PRODUCT_UNIT_VALUES)` — plate, aucun contrôle
  `category ↔ unit` côté schema (option future, §12).
- DB : colonne `text` typée `$type<ProductUnit>()` — pas de migration.

**Rappel sémantique** — `kind` = nature/usage (sérum, shampoing, capsule),
`unit` = format physique du packaging (pipette, flacon, tube, sachet). Un même
kind peut exister en plusieurs units.

---

## 4. Schemas Zod (`shared/src/products/schemas.ts`)

| Schema                 | Usage                                                              |
|------------------------|--------------------------------------------------------------------|
| `createProductSchema`  | POST /products — valide `category ↔ kind` cohérent (`.refine`)      |
| `updateProductSchema`  | PATCH /products/:id — `category` + `kind` updatés ensemble (`.superRefine`) |
| `productChangesSchema` | diff JSON stocké en `jsonb` sur `product_edits.changes` (backend `lib/logs.ts`) |
| `searchProductsQuery`  | GET /products/search                                                |

Helper interne `editableProductFields` = record `fieldChangeSchema` par champ éditable,
consommé par `productChangesSchema`.

Pas de `productResponseSchema` / `productsPageSchema` : Hono RPC infère la réponse
depuis la signature du handler.

---

## 5. Filtres liste — `listProductsQuery` (shared)

`z.discriminatedUnion('category', [...])`. Le client envoie `category=X` et Zod
branche sur les filtres autorisés. Interdit `skin_type` en haircare, etc.

| Branche    | Clés spécifiques (miroir `{domain}/tag-filters.ts`)                                                                       |
|------------|--------------------------------------------------------------------------------------------------------------------------|
| skincare   | skin_type, concern, product_type_v2, texture, skin_zone, routine_step_v2, routine_moment, skin_effect, product_label, shared_label |
| haircare   | hair_type, concern, product_type, routine_step, hair_effect, product_label                                                |
| dental     | concern, age_group, product_type, dental_effect, product_label                                                            |
| complement | goal, product_type, moment, restriction, product_label                                                                    |

Base commune : `kind, brand, ingredient, avoid_for, q, priceMin, priceMax, page, limit, sort`.

Types exposés : `SkincareListProductsFilters`, `HaircareListProductsFilters`,
`DentalListProductsFilters`, `ComplementListProductsFilters`, `ListProductsFilters` (union).

---

## 6. Tabs UI (`shared/src/products/domain-tabs.ts`)

4 tabs, mapping n:1 vers `ProductCategory` :

```
skincare   tab ← [skincare, solaire, bodycare]
haircare   tab ← [haircare]
dental     tab ← [dental]
complement tab ← [complement]
```

Garde TS : ajouter une nouvelle `ProductCategory` sans la router casse la compilation.

---

## 7. Types shared (`types.ts`)

| Type                  | Usage                                                             |
|-----------------------|-------------------------------------------------------------------|
| `ProductSearchResult` | backend `searchProducts` service                                  |
| `ProductErrorCode`    | `helpers.ts` + backend `product-error.ts`                          |
| `CreateProductInput`  | backend service + frontend mutations (`z.infer<createProductSchema>`) |
| `UpdateProductInput`  | backend service + frontend mutations                              |
| `ProductChanges`      | backend `logs.ts` + DB `products.ts` jsonb `$type`                 |

Types DB (`Product`, `ProductEdit`, `ProductIngredient`) consommés **directement**
depuis `backend/src/db/schema/products` via `$inferSelect`, pas re-exportés par shared.

---

## 8. Sous-dossiers par domaine (shared)

Même shape pour `skincare/ | haircare/ | dental/ | supplement/` :

- `tag-slugs.ts` — constantes de slug (DB-facing, immutables)
- `tag-taxonomy.ts` — `{DOMAIN}_PRODUCT_TAG_CATEGORIES` — **toutes remplies** (les arrays haircare/dental/supplement étaient des stubs `[] as const`, corrigé 2026-04-22)
- `tag-filters.ts` — `{DOMAIN}_PRODUCT_TAG_CATEGORY_META` (label, placeholder, tier, order, defaultOpen?) + `{domain}ProductFilterCategories()` retournant les clés triées — **toutes remplies**
- `schemas.ts` — `{domain}ProductFilterOptionsSchema` (forme réponse `/filter-options`)
- `index.ts` — barrel

| Domaine    | Catégories tag                                                             |
|------------|---------------------------------------------------------------------------|
| skincare   | skin_type, concern, product_type_v2, texture, skin_zone, routine_step_v2, routine_moment, skin_effect, product_label, shared_label |
| haircare   | hair_type, concern, product_type, routine_step, hair_effect, product_label |
| dental     | concern, age_group, product_type, dental_effect, product_label             |
| supplement | goal, product_type, moment, restriction, product_label                     |

Modifs de taxonomie tag : passer par `backend/src/db/seed/docs/STATE.md` (seed/DB)
**et** mettre à jour ce fichier si l'API shared bouge.

---

## 9. Backend — `backend/src/features/products/`

### 9.1 `routes.ts` — Hono sub-app (`/products`)

| Méthode | Path                      | Validator                               | Service                           |
|---------|---------------------------|-----------------------------------------|-----------------------------------|
| GET     | `/filter-options`         | `{ category?: ProductDomainTab }`        | `getFilterOptions`                |
| GET     | `/brands`                 | —                                       | `getDistinctBrands`               |
| GET     | `/check-duplicate`        | `{ name, brand }`                        | `findSimilarProducts`             |
| GET     | `/search`                 | `searchProductsQuery`                    | `searchProducts`                  |
| GET     | `/`                       | `listProductsQuery` (discriminated)      | `listProducts`                    |
| POST    | `/`                       | `createProductSchema`                    | `createProduct`                   |
| GET     | `/:slug`                  | slugParam                               | `getProductWithIngredientsBySlug` |
| PATCH   | `/:id`                    | `updateProductSchema`                    | `updateProduct`                   |
| DELETE  | `/:id`                    | —                                       | `deleteProduct`                   |

Middleware : `requireJwtAuth` sur tous sauf `GET`, `withRlsContext` sur tous.
Note : `/brands` placé **avant** `/:slug` pour éviter que le router slug attrape `brands`.

### 9.2 `service.ts` — fonctions exportées

- `createProduct(userId, input, db)` — slugify, catch unique violation → `product_already_exists`.
- `getProductById`, `getProductBySlug`, `getProductWithIngredientsBySlug`.
- `updateProduct(userId, id, data, summary, db)` — UPDATE + RETURNING OLD.* dans un seul SQL,
  diff via `buildChanges`, persiste `product_edits`.
- `listProducts(filters: ListProductsFilters)` — voir §11.
- `getFilterOptions(db, category?)` — renvoie `{ kinds, brands, tags }`. Tags groupés
  par category. Dispatch via `DOMAIN_PRODUCT_FILTER_CATEGORIES[category]` (shared).
  Sans `category` → union dédupliquée des 4 domaines. `FilterOptions.tags` typé
  `Partial<Record<AllProductTagCategory, TagItem[]>>` — seules les clés du domaine
  demandé sont présentes dans la réponse.
- `getDistinctBrands`, `deleteProduct`.
- `findSimilarProducts(name, brand)` — pour la détection de doublons côté UI.
- `searchProducts({ q, limit })` — LIKE sur name/brand pour autocomplete.

Constantes internes : `EXCLUDED_KEYS` (champs non-éditables via PATCH),
`TRACKED_FIELDS` (champs loggés dans `product_edits`).

### 9.3 Sous-routeurs

- **`product-ingredients/routes.ts`** — monté à part. GET/POST/PATCH/DELETE/PUT sur
  `/:productId/ingredients`. Utilise `createProductIngredientSchema` (shared) pour POST
  et `replaceIngredientsSchema` local pour PUT. Service `product-ingredients.service.ts`
  définit son propre `CreateProductIngredientInput` local (avec `productId`, distinct
  du contrat API côté shared).
- **`product-tags/routes.ts`** — GET/PUT `/:productId/tags`. Utilise `replaceProductTagsSchema`
  (shared, features/tags). Service dans `features/tags/tags.service.ts`.

### 9.4 Erreurs

`ProductError` avec codes :
`product_not_found | product_creation_failed | product_update_failed | product_delete_failed | product_already_exists | unauthorized_access | database_error`.
Mapping → HTTP via `productErrorMapping` (shared).

---

## 10. Frontend — list page

### 10.1 Route (`frontend/src/routes/products/index.tsx`)

```ts
createFileRoute('/products/')({
  validateSearch: zodValidator(productsSearchSchema),
  search: { middlewares: [stripSearchParams(productsSearchDefaults)] },
  component: ProductsPage,
})
```

Le `stripSearchParams` enlève les valeurs par défaut de l'URL pour garder l'URL courte.

### 10.2 Schéma URL state (`features/products/filters.ts`)

```ts
// TAG_FILTER_KEYS = union dédupliquée de toutes les clés des 4 domaines
// (dérivé de DOMAIN_PRODUCT_FILTER_CATEGORIES depuis shared)
const _allTagKeys = Object.values(DOMAIN_PRODUCT_FILTER_CATEGORIES).flat()
export const TAG_FILTER_KEYS = [...new Set(_allTagKeys)] as TagFilterKey[]
export const FILTER_KEYS = [...TAG_FILTER_KEYS, 'brand', 'ingredient', 'kind']

// baseSchema = filterSearchSchema(FILTER_KEYS) — génère { [k]: z.array(z.string()).default([]) }
// + page: z.number().min(1).default(1)
productsSearchSchema = baseSchema.extend({
  category: z.enum(PRODUCT_DOMAIN_TABS).default('skincare'),
  kind: z.array(z.string()).default([]),
  profile_filter: z.boolean().default(false),
  sort: z.enum(['name', 'random', 'price_asc', 'price_desc', 'newest']).default('random'),
  priceMin: z.number().int().min(0).optional(),
  priceMax: z.number().int().min(0).optional(),
})
```

L'URL state couvre **tous les domaines** : `hair_type`, `age_group`, `goal`, etc. sont tous
présents dans le schéma. TanStack Router les strip quand vides via `stripSearchParams`.

`DOMAIN_TAG_KEYS` et `DOMAIN_TAG_META` (dérivés de shared) permettent à `ProductsPage.tsx`
de dispatcher la config UI par domaine sans duplication.

### 10.3 Queries (`frontend/src/lib/queries/products.ts`)

- `productQueries.list(filters)` — `api.products.$get({ query })` via Hono RPC.
- `productQueries.filterOptions(category?)` — `api.products['filter-options'].$get`.
- `productQueries.bySlug(slug)` — détail.
- Mutations : `useCreateProduct`, `useUpdateProduct`, `useDeleteProduct`, helpers pour
  tags/ingredients.
- **`buildListProductsQuery(filters)`** — convertit arrays → CSV pour l'API. Boucle sur
  `TAG_FILTER_KEYS` (toutes les clés des 4 domaines) + clés base (kind, brand, ingredient,
  avoid_for). Produit `Record<string, string>` pour Hono RPC.
- **Type `ListProductsFilters` local** — forme pré-sérialisation acceptant `string | string[]`.
  Intentionnellement distinct du shared `ListProductsFilters` (discriminated union Zod) car
  Hono RPC attend `Record<string, string>`. Cast via `as Parameters<…>` pour le type RPC.
  Couvre tous les domaines via `& { [K in AllProductTagCategory]?: string | string[] }`.

### 10.4 Composants clés

- `ProductsPage.tsx` — orchestre tabs, drawer filtres, pagination, modal d'ajout
  à la collection. Consomme `productQueries.list` + `filterOptions`.
- `FilterDrawer` + `ActiveFiltersBar` (component générique) — configuré via
  `FilterGroupConfig[]` construit par `useTagFilterGroups`.
- `useTagFilterGroups(domainKeys, tagsByCategory, domainMeta, labelOverrides)`
  — hook générique. `ProductsPage` lui passe `DOMAIN_TAG_KEYS[category]` et
  `DOMAIN_TAG_META[category]` pour dispatcher automatiquement par domaine actif.
- `buildProductsApiFilters({ category, kind, filters, … })` — construit le `ListProductsFilters`
  local. En mode discovery (pas de filtre, sort=random, pas de prix) → payload minimal `limit:12`.
  En mode paginé → ne forward que les clés de `DOMAIN_PRODUCT_FILTER_CATEGORIES[category]`
  (isolation cross-domain garantie).

---

## 11. Flow de bout en bout (GET /products)

```
URL TanStack Router state        ?concern=%5B%22acne%22%5D&category=skincare
                                    ↓ validateSearch (productsSearchSchema)
Route search params              { concern: ['acne'], category: 'skincare', … }
                                    ↓ buildProductsApiFilters (helpers.ts)
ListProductsFilters local        { concern: ['acne'], category: 'skincare', sort: 'random', … }
                                    ↓ buildListProductsQuery (arrays → CSV)
Hono RPC query                   { concern: 'acne', category: 'skincare', … }
                                    ↓ fetch
URL API                          GET /products?concern=acne&category=skincare
                                    ↓ zValidator('query', listProductsQuery)
Backend filters                  { concern: 'acne', category: 'skincare', … }  (narrowed)
                                    ↓ listProducts()
DB query                         SELECT … FROM products
                                   WHERE category IN ('skincare','solaire','bodycare')
                                     AND id IN (SELECT productId FROM tag_products
                                                JOIN product_tags_defs
                                                WHERE slug IN ('acne') AND tagType='concern')
                                    ↓
Response                         { items: ProductSummary[], total, page, limit }
```

**Les deux sérialisations cohabitent** : l'URL frontend parle array
(TanStack Router encode/decode tout seul), l'API parle CSV (plus simple, type-safe via
discriminated union). La conversion est localisée dans `buildListProductsQuery`.

---

## 11.bis Refonte Type/Zone/Texture skincare (Phase 1+2 — 2026-05-02)

Le filtre skincare `product_type` legacy (42 slugs plats : `creme-mains`, `gel-nettoyant`, `huile-corps`…) mélangeait **fonction**, **zone** et **texture** sur un seul axe. Refonte en 3 dimensions UX-first :

### Nouvelles catégories tag

| Catégorie       | Slugs (count) | Source                                                |
|-----------------|---------------|-------------------------------------------------------|
| `product_type_v2` | 12          | Nettoyant, Toner, Mist, Sérum, Hydratant, Masque, Exfoliation, Solaire, Traitement, Primer, Déodorant, Outil |
| `texture`       | 9             | Gel, Crème, Baume, Huile, Lait, Mousse, Eau, Patch, Stick |
| `skin_zone`     | 6 (était 5)   | + `zone-pieds`                                        |

Slugs préfixés (`type-*`, `texture-*`) pour éviter collision avec legacy (`baume`, `gel-creme`).

### Coexistence avec `product_type` legacy

Les 42 slugs legacy restent en DB (tier=essential, label="Type (legacy)") pour rétrocompat scoring/scraping. UI affiche les deux filtres side-by-side. Décision : drop legacy plus tard quand 100% des produits sont taggués v2.

### Backfill (`backend/src/db/seed/scripts/backfill-skincare-tags-v2.ts`)

Script idempotent (`onConflictDoNothing`) qui dérive les nouveaux tags depuis legacy via 3 mappings dans `shared/src/products/skincare/tag-type-mapping.ts` :

- `SKINCARE_LEGACY_TYPE_TO_V2` : 42 → 12 (couverture 100%)
- `SKINCARE_LEGACY_TYPE_TO_ZONE` : 10 entrées (corps, yeux, lèvres, mains, pieds quand le slug est explicite)
- `SKINCARE_LEGACY_TYPE_TO_TEXTURE` : 24 entrées (sérum/ampoule/essence laissés non-dérivés — ambigus)

Run via `make backfill-skincare-tags-v2 ARGS=--write`. Première exécution 2026-05-02 → 4145 rows insérées dans `tag_products` sur 2585 paires legacy.

Stats post-backfill (filter-options) :
- Type : Hydratant 839, Solaire 419, Sérum 353, Nettoyant 282, Exfoliation 187, Traitement 156, Toner 128, Masque 83, Déodorant 49, Mist 18, Primer 11, Outil 0
- Texture : Crème 1096, Eau 132, Gel 87, Lait 73, Baume 58, Huile 54, Mousse 33, Patch 9, Stick 0
- Zone : Visage 1925, Corps 353, Yeux 87, Lèvres 35, Mains 35, Pieds 6

### Dette restante

- [ ] Tagger manuellement `Outil` (0) et `Stick` (0) — pas de mapping legacy → cible.
- [ ] Texture `texture-eau`/`texture-gel`/`texture-huile` pour sérums/ampoules/essences (ambiguïté slug).
- [ ] `MetaStrip` étendu (`product_type_v2`, `texture`) mais pas testé visuellement.

### Phase 3 — Drop du legacy `product_type` (DONE 2026-05-02)

Hard drop direct (pas de soak `tier='internal'`) — corpus pas encore en prod, pas de lien externe à préserver. Migrations `0044_drop_skincare_product_type_legacy.sql` (43 slugs).

**Effectué**
- Migration seeds via `scripts/migrate-seeds-to-v2.ts` : 4291 hits sur 99 fichiers.
- `auto-tag.ts` réécrit pour émettre v2/texture/zone directement.
- Catégorie `'product_type'` retirée de `SKINCARE_PRODUCT_TAG_CATEGORIES` ; 43 entries label + arrays + `buildTagTaxonomy` purgés.
- `skincareListProductsQuery` ne contient plus `product_type`.
- `tag-type-mapping.ts` supprimé + ré-exports nettoyés (`shared/src/index.ts`, `shared/src/products/skincare/index.ts`).
- DB : 2537 lignes `tag_products` + 43 `product_tags` supprimées (skincare-scoped, haircare/dental/supplement intacts).
- Frontend `MetaStrip.tsx` bascule sur `product_type_v2 + texture + routine_moment`.

---

## 11.ter Refonte Routine skincare (Phase 1 — 2026-05-02)

Le filtre skincare `routine_step` legacy (15 slugs) mélangeait deux axes orthogonaux : **ordonnancement** dans la routine (1er nettoyage, traitement…) et **moment** d'usage (matin, soir, hebdo…). Impossible de filtrer "produit du soir" sans embarquer aussi un ordonnancement. Refonte en 2 dimensions :

### Nouvelles catégories tag

| Catégorie         | Slugs (count) | Source                                                    |
|-------------------|---------------|-----------------------------------------------------------|
| `routine_step_v2` | 7             | 1er nettoyage, 2e nettoyage, Préparation, Traitement, Hydratation, Occlusif, Protection solaire |
| `routine_moment`  | 5             | Matin, Soir, Hebdomadaire, Usage localisé, En cas de crise |

Slugs préfixés (`step-*`, `moment-*`) pour éviter collision avec legacy (`matin`, `traitement`, `occlusion`).

### Modèle "default = pas de tag"

Pour `routine_moment`, la **majorité** des produits (sérums, hydratants…) sont universels (utilisables matin et soir). Plutôt que les tagger M+S explicitement, on **n'insère aucun tag moment** : un produit sans tag moment = universel par défaut.

Conséquence côté filtre : `routine_moment=moment-matin` doit retourner produits taggués `Matin` **OR** produits sans tag moment du tout. Logique implémentée dans `service.ts` (`routineMomentFilterCondition`, special case du filter loop). `Soir` symétrique. Restrictifs (`Hebdomadaire`/`Usage localisé`/`En cas de crise`) gardent un EXISTS strict.

### Coexistence avec `routine_step` legacy

Les 15 slugs legacy restent en DB (tier=advanced, label="Étape (legacy)") pour rétrocompat scoring/scraping. Drop legacy plus tard quand corpus v2 est complet.

### Backfill (`backend/src/db/seed/scripts/backfill-skincare-routine-v2.ts`)

Script idempotent (`onConflictDoNothing`) qui dérive les nouveaux tags depuis legacy via 2 mappings dans `shared/src/products/skincare/tag-routine-mapping.ts` :

- `SKINCARE_LEGACY_ROUTINE_TO_STEP_V2` : 11 entrées (array car `nettoyant` legacy → potentiellement 1er+2e nettoyage ; ici on l'a skippé car couvert par `TYPE_NETTOYANT`).
- `SKINCARE_LEGACY_ROUTINE_TO_MOMENT` : 5 entrées (matin/soir/protection-solaire/occlusion/soin-localise). `masque-hebdo` et `exfoliation` skippés (couverts par `TYPE_MASQUE`/`TYPE_EXFOLIATION`).

`MOMENT_CRISE` n'a pas de mapping legacy → tag manuel post-migration uniquement.

Run via `make backfill-skincare-routine-v2 ARGS=--write`. Première exécution 2026-05-02 : 12 defs insérées, 5379 candidats sur 4851 paires legacy.

Stats post-backfill :
- Step v2 : Hydratation 1541, Traitement 665, Protection solaire 456, 2e nettoyage 206, Préparation 87, 1er nettoyage 47, Occlusif 21
- Moment : Matin 974, Soir 637, Usage localisé 51, Hebdomadaire 0 (skip legacy), En cas de crise 0 (manuel)

### Phase 3 — Drop du legacy `routine_step` (DONE 2026-05-02)

Hard drop direct, en bundle avec §11.bis Phase 3. Migration `0045_drop_skincare_routine_step_legacy.sql` (15 slugs).

**Effectué**
- Migration seeds : `MATIN`/`SOIR` → `MOMENT_*`, `EXFOLIATION`/`SOIN_YEUX`/`SOIN_LOCALISE`/`TRAITEMENT` → `STEP_TRAITEMENT`, `EMOLLIENCE`/`HYDRATATION` → `STEP_HYDRATATION`, `PROTECTION_SOLAIRE` → `STEP_PROTECTION_SOLAIRE` + `MOMENT_MATIN`, `OCCLUSION` → `STEP_OCCLUSIF` + `MOMENT_SOIR`, `MASQUE_HEBDO` → `MOMENT_HEBDOMADAIRE`, `NETTOYANT` dropé (couvert par `TYPE_NETTOYANT`).
- Catégorie `'routine_step'` retirée de `SKINCARE_PRODUCT_TAG_CATEGORIES` ; 15 entries purgées.
- `skincareListProductsQuery` ne contient plus `routine_step`.
- `tag-routine-mapping.ts` supprimé.
- DB : 5179 lignes `tag_products` + 15 `product_tags` supprimées (skincare-scoped, haircare routine_step intact).
- Backfill scripts `backfill-skincare-tags-v2.ts`/`backfill-skincare-routine-v2.ts` + cibles Makefile retirés (one-shot, plus exécutables).

---

## 12. Dette / TODO cross-layer (snapshot 2026-04-25)

### Shared — ✅ propre
- Units restructurées par category (mirror kinds).
- Types morts retirés (`Product`, `ProductEdit`, `ProductEditResponseSchema`,
  `productResponseSchema`, `productsPageSchema`, `productIngredientResponseSchema`,
  `CreateProductIngredientInput`, `ProductIngredient`).
- `listProductsQuery` — 4 branches enrichies, clés miroir `tag-filters.ts`.
- Filter-options schemas remplis pour haircare / dental / supplement.
- Taxonomies `HAIRCARE/DENTAL/SUPPLEMENT_PRODUCT_TAG_CATEGORIES` remplies (stubs `[]` corrigés).
- `HAIRCARE/DENTAL/SUPPLEMENT_PRODUCT_TAG_CATEGORY_META` remplis (labels, tier, order).
- `AllProductTagCategory` + `DOMAIN_PRODUCT_FILTER_CATEGORIES` ajoutés dans `helpers.ts`.
- `list-products-query.ts` exposé via `products/index.ts` (4 exports sélectifs).

### Backend — ✅ propre
- [x] `listProducts` : dispatch par domaine via `*_PRODUCT_TAG_CATEGORIES` (source unique shared).
- [x] `getFilterOptions` : dispatch par domaine via `DOMAIN_PRODUCT_FILTER_CATEGORIES`.
      `FilterOptions.tags` → `Partial<Record<AllProductTagCategory, TagItem[]>>`.
      `{haircare,dental,supplement}/schemas.ts` `filterOptionsSchema.tags` remplis.
- [ ] `Array.isArray(filters.kind|brand|ingredient)` dans `listProducts` — dead code,
      Zod `z.string().optional()` ne produit jamais un array. Cosmétique, garder OK.
- [x] Validation `kind` contre `PRODUCT_KINDS[category]` : `kindFilterFor(domain)` valide
      chaque valeur CSV contre l'union des kinds du domaine — typo rejette avec message d'erreur.

### Frontend — ✅ dette principale résolue
- [x] **`FILTER_KEYS` / `productsSearchSchema` all-domain** — URL state couvre toutes
      les clés via `TAG_FILTER_KEYS` (union des 4 domaines, dédupliquée). `baseSchema`
      construit depuis `FILTER_KEYS` dynamiquement.
- [x] **`buildListProductsQuery` all-domain** — boucle sur `TAG_FILTER_KEYS`, forward
      les clés haircare/dental/complement si présentes.
- [x] **`ListProductsFilters` local couvre tous les domaines** — `& { [K in AllProductTagCategory]?: string | string[] }`.
      Le cast `as Parameters<…>` reste nécessaire (forme pré-sérialisation ≠ discriminated union Zod).
- [x] **`useTagFilterGroups` dispatche par domaine** — `ProductsPage.tsx` passe
      `DOMAIN_TAG_KEYS[category]` et `DOMAIN_TAG_META[category]`.
- [x] **`buildProductsApiFilters` domain-aware** — isole les clés par `DOMAIN_PRODUCT_FILTER_CATEGORIES[category]`.

### Tests (snapshot 2026-04-22)

**Frontend** — `features/products/__tests__/helpers.test.ts` + `lib/queries/__tests__/products-serialization.test.ts` — 66 tests :
- Isolation cross-domain vérifiée pour les 4 domaines.
- Discovery mode (mode/non-mode, kind silencieusement ignoré en discovery).
- Edge cases : `avoidFor: ['']`, filtres avec strings vides, prix inversés, page négative.
- `buildListProductsQuery` adversarial : `['']` vs `''`, trailing comma, comma embarquée,
  `NaN`/`Infinity`/négatifs, large array, duplicates.

**Backend** — `features/products/tests/products.test.ts` — 79 tests :
- `getFilterOptions` domain scoping : haircare renvoie `hair_type/concern/…` et pas `skin_type` ;
  skincare ne renvoie pas les tags haircare ; tags orphelins exclus ; catégories inconnues exclues.
- `listProducts` : filtres par domaine, pagination, tri, prix, ingredient, avoid_for.

### Seed (hors scope shared mais lié taxonomie)
- [x] `UnifiedProductSeed.unit` typé `ProductUnit` (commit `23fda57`).
      Un typo unit échoue désormais à la compile plutôt qu'au runtime.
- [ ] Migrer `nutripure` (supplement) : `unit: 'pack'` générique → `'tablet' | 'capsule' | 'powder'`
      selon le kind. Type-valide aujourd'hui (`pack ∈ ProductUnit`) mais
      sémantiquement incorrect pour un supplement.

### Option future
- [ ] Discriminated union `unit ↔ category` dans `createProductSchema` /
      `updateProductSchema` — valider que `unit ∈ PRODUCT_UNITS[category]`. Aujourd'hui
      `z.enum(PRODUCT_UNIT_VALUES)` plat.

# Roadmap - Products

## 🚧 Reste actif

### Seed haircare
- [ ] **Enrichir tags haircare** : ajouter `hair_type` / `concern` / `routine_step` / `hair_effect` / `product_label` sur chaque produit haircare (≥1 tag par axe pertinent). Phase sémantique — lecture produit par produit.
- [ ] **DB cleanup** : `DELETE FROM product_tags WHERE slug IN ('shampoing', 'apres-shampoing', 'masque-cheveux', 'serum-cheveux', 'huile-cheveux', 'produit-coiffant') AND type = 'product_type'` — rows orphelines depuis suppression du source.
- [ ] **db-seed non relancé** — diff DB labels attendu nul (Phase A préserve les chaînes), mais à relancer pour valider.

#### Flag
- **`cinqSurCinq` mal catégorisé** : marque anti-poux (pediculicide), pas capillaire d'usage courant. `SPRAY_COIFFANT` est une approximation. Reclasser en `traitement-cuir-chevelu` ou exclure du domaine haircare.

---

## 🆕 Nouveaux chantiers

### 1. `concentrationUnit` et `unit` — champs libres à contraindre

**✅ 1a/1b implémentés 2026-04-26.**
- `unit` (conditionnement) : `productEditFormSchema` (`ProductForm.schema.ts:20-26`) valide via `.refine(v => PRODUCT_UNIT_VALUES.includes(v))`. Cast `as ProductUnit` conservé (refine ne narrow pas le type). UI : `ChipGroup` lié à `PRODUCT_UNITS[form.category]` (`ProductForm.tsx:333-344`).
- `amountUnit` (contenance) : enum partagé `PRODUCT_AMOUNT_UNIT_VALUES` (`shared/src/products/units.ts:100-110`) + map par catégorie `PRODUCT_AMOUNT_UNITS`. Validation Zod (`ProductForm.schema.ts:39-44`). UI : `ChipGroup` (`ProductForm.tsx:359-368`).

**✅ 1c — `concentrationUnit` implémenté 2026-04-26.**
- Constante shared `PRODUCT_CONCENTRATION_UNIT_VALUES` (`['%', 'IU', 'mg', 'mcg', 'mg/mL']`) + type `ProductConcentrationUnit` + `PRODUCT_CONCENTRATION_UNIT_LABELS` (FR : `%`, `UI`, `mg`, `µg`, `mg/mL`) ajoutés dans `shared/src/products/units.ts`. Ré-exportés depuis `shared/src/index.ts`.
- `createProductIngredientSchema` (`shared/src/products/ingredients.ts:11`) consomme la constante via `z.enum(PRODUCT_CONCENTRATION_UNIT_VALUES)`.
- `updateProductIngredientSchema` côté backend (`backend/.../product-ingredients/routes.ts:26`) idem — duplication supprimée.
- UI inline dans `ProductForm.tsx` : composant interne `IngredientRow` avec `<Input type="number">` (dose) + `<ChipGroup>` (unité). Champs optionnels.
  - `create` : stocké dans `pendingIngredients`, envoyé via `addIngredient.mutateAsync` au submit.
  - `edit` : nouvelle mutation `useUpdateProductIngredient` (PATCH) sur blur du value et change de l'unit.
- Couvre `products/new` et `product/$slug/edit` (composant unique `ProductForm`).

**Contexte**

Dans les formulaires `products/new` et `product/$slug/edit`, deux champs acceptent actuellement n'importe quelle chaîne saisie librement :

- **`unit`** (contenance physique du produit) : ex. `ml`, `g`, `mg`. Ce champ est déjà géré via `PRODUCT_UNITS` dans shared, mais le formulaire ne le contraint pas suffisamment — on peut y saisir `grammes`, `kilogrammes`, `kilos`, etc.
- **`concentrationUnit`** (unité de la concentration d'un ingrédient actif) : ex. `mg`, `g`, `%`, `UI`. Ce champ est entièrement libre, ce qui rend les données inconsistantes et inexploitables pour des comparaisons ou des filtrages futurs.

**Problème**

Un champ libre sur des données qui ont une sémantique fermée est une dette data. On ne peut pas filtrer, trier, ni afficher proprement `"2 grammes"` vs `"2g"` vs `"2 G"`. La correction devient exponentiellement plus coûteuse avec le volume de produits.

**Solution envisagée**

Même approche que `kind` et `unit` déjà contraints par `PRODUCT_UNITS` dans shared :

1. Définir une liste canonique fermée pour `concentrationUnit` dans `shared/` : `mg | g | µg | ml | % | UI | IU | ppm`.
2. Exposer cette liste comme enum Zod + constante de labels FR.
3. Remplacer l'input libre par un **ChipGroup** ou un **Select** fermé dans les deux formulaires.

Impacte : `products/new` **et** `product/$slug/edit`.

**Audit 2026-04-26**

Vérifié en navigateur sur `products/new` et `product/$slug/edit` (Abib Glutathiosome Dark Spot Serum) :

- `amountUnit` : input texte libre avec placeholder `"ml, g..."`. Aucune contrainte côté frontend. Valeur `"ml"` visible dans edit — saisie libre confirmée. Zod backend : `z.string().min(1).max(50)` dans `shared/src/products/schemas.ts:18`. Aucune constante partagée n'existe pour ce champ.
- `concentrationUnit` : enum Zod strict `['%', 'IU', 'mg', 'mcg', 'mg/mL']` dans `shared/src/products/ingredients.ts:11` — mais hardcodé en double dans `backend/src/features/products/product-ingredients/routes.ts:26`. Aucun composant d'édition frontend existant pour ce champ.
- `unit` (conditionnement) : ChipGroup correct côté UI, mais `ProductForm.schema.ts:17` utilise `z.string().max(50)` au lieu de `z.enum(PRODUCT_UNIT_VALUES)` → cast `as ProductUnit` aux lignes 105/146. Backend valide, frontend ne valide pas.

---

### 2. Tags non filtrés par catégorie dans les formulaires

**✅ Implémenté 2026-04-26.**
- `validTagTypes` dérivé de `DOMAIN_PRODUCT_FILTER_CATEGORIES[domain]` (`ProductForm.tsx:99-102`).
- `domainTags = allTags.filter(t => validTagTypes.has(t.category))` passé à `useFormTags` (`ProductForm.tsx:104-113`) → le dropdown "Ajouter un tag" ne propose que les catégories du domaine.
- Reset des tags incompatibles au switch de catégorie (`ProductForm.tsx:285-290`).
- Note : `tagQueries.list()` charge toujours tous les tags (pas de paramètre `category` passé). Filtrage côté client. Pas de pagination backend (`backend/src/features/tags/routes.ts:40`) → tous les tags sont disponibles. Optimisation possible (passer `category` à la query) mais pas un bug.
- **✅ Validation backend shippée 2026-04-27.**
  - `assertTagsMatchProductDomain` (`backend/src/features/products/product-tags/domain-validation.ts`) : fetch product.category → derive domain via `PRODUCT_CATEGORY_TO_DOMAIN_TAB` → compare chaque `tag.tagType` à `DOMAIN_PRODUCT_FILTER_CATEGORIES[domain]`. Throw `ProductError('tag_domain_mismatch')` si mismatch.
  - Hookée dans `PUT /products/:productId/tags` (`product-tags/routes.ts:38-39`) avant `replaceProductTags`. Code mappé en `400 BAD_REQUEST` (`shared/products/helpers.ts:34`).
  - Pas de partial commit : la validation court-circuite `replaceProductTags` → les liens existants sont préservés en cas de mismatch.
  - **Limite connue** : seed-core utilise `addTagToProduct` (service direct), pas la route. La validation API ne couvre pas le seed. Filet de sécurité = `make audit-db` (script umbrella `backend/src/db/audit/audit-db.ts` avec checker `checkTagProductDomainConsistency`) + chain `make db-seed-safe = db-seed + audit-db`. Run initial sur DB actuelle = 0 violation.

**Contexte**

Dans `products/new` et `product/$slug/edit`, le sélecteur de tags charge et affiche **tous les tags de toutes les catégories** sans tenir compte de la catégorie choisie pour le produit. On peut donc attacher un tag `hair_type: cheveux bouclés` à un produit skincare, ou un tag `skin_concern: anti-âge` à un shampoing.

**Problème**

Deux sous-problèmes distincts :

1. **Chargement incomplet** : la requête ne ramène pas la totalité des tags disponibles (à investiguer côté query — probablement un filtre ou une pagination manquante).
2. **Absence de filtrage par catégorie** : les tags affichés devraient être limités à la taxonomie de la catégorie du produit en cours d'édition. La taxonomie shared (`getProductTagsByCategory`) existe déjà et est utilisée côté liste/filtres — elle n'est pas encore appliquée côté formulaires.

**Solution envisagée**

- Corriger le chargement pour s'assurer que tous les tags de la catégorie sont disponibles.
- Lier le sélecteur de tags à la catégorie sélectionnée dans le formulaire : quand la catégorie change, la liste de tags proposés se met à jour en conséquence.
- Utiliser `getProductTagsByCategory(category)` (shared) comme source de vérité pour les options affichées.

Impacte : `products/new` **et** `product/$slug/edit`.

**Audit 2026-04-26**

Vérifié en navigateur sur `products/new` (Soin visage) et `product/abib-glutathiosome-dark-spot-serum/edit` :

Le dropdown "Ajouter un tag" expose en vrac pour un produit skincare : `hair_type` (Cheveux bouclés, Cheveux fins…), `dental_effect` (Anti-plaque, Blancheur, Carie…), `goal` suppléments (Cognition, Digestion, Énergie…), `moment` suppléments (À jeun, Avec repas…), `hair_effect` (Anti-frisottis, Brillance…). Identique dans new et edit. La liste ne change pas en sélectionnant "Cheveux" — `tagQueries.list()` est appelé sans paramètre de catégorie (`ProductForm.tsx:82`).

Ce qui existe et n'est pas utilisé : `GET /api/tags?category=<tagType>` supporte le filtre (`tags/routes.ts:40`, `tags.service.ts:62`). `getProductTagsByCategory()` dans `shared/src/products/helpers.ts:90` fonctionne — utilisée uniquement dans `useProductTagFilterGroups.ts:42` (filtres liste). Aucune validation backend que les tags attachés correspondent à la catégorie du produit.

---

### 3. Glitch visuel lors du switch d'onglet (page liste produits)

**✅ Implémenté 2026-04-26.**
- `handleDomainChange` wrappé dans `startTransition` (`ProductsPage.tsx:146-153`) → React traite le `navigate` comme non-urgent, garde la liste précédente jusqu'à résolution de la nouvelle query.
- `page-header__loader` rendu en slot fixed-width 8px avec `visibility: hidden/visible` (`PageHeader.css:55-66`) → le mount/unmount du dot ne shift plus le layout. Le `<span>` est toujours dans le DOM, seule la visibilité bascule.
- Plus de "ce qui apparaît à gauche de l'input" : le slot est réservé en permanence.

**Contexte**

Sur la page liste des produits (`/products`), lors du changement d'onglet de domaine (Skincare → Cheveux, Dents, Compléments…), un glitch visuel bref est visible :

- L'input de recherche "saute" ou change de position pendant un court instant.
- Quelque chose apparaît fugacement à gauche de l'input (probablement une icône ou un élément de layout).

**Hypothèse**

Vraisemblablement un état intermédiaire rendu visible entre deux renders : soit un mount/unmount de l'icône de recherche (ex. icône loupe vs icône clear), soit un layout shift lié à la réinitialisation de la valeur de l'input lors du changement de domaine. Le composant passe par un état "vide puis re-rempli" qui se matérialise visuellement.

**À investiguer**

- Identifier ce qui se monte/démonte autour de l'input de recherche lors du changement d'onglet.
- Vérifier si le glitch est lié à un changement de `key` React qui force un remount complet du composant.
- Potentiellement : stabiliser le layout en gardant le composant monté et en réinitialisant seulement sa valeur interne, sans le détruire.

**Audit 2026-04-26 — cause identifiée**

Trace de performance capturée pendant le click sur l'onglet "Cheveux" :

- **ForcedReflow : 133ms** dans `setValueForKnownAttribute` (react-dom:1466). Se produit parce que React met à jour des attributs DOM après invalidation de style, forçant un recalcul de layout synchrone sur un DOM large (18+ cards × ~10 nœuds).
- **INP total : 328ms** (seuil "needs improvement" = 200ms). Décomposition : input delay 1ms / processing 292ms / presentation 35ms. Les 292ms de processing sont dominés par le reflow.
- **`page-header__loader`** : le dot animé (8px, `PageHeader.tsx:29`) apparaît dans le `<h2>` pendant `isPlaceholderData=true`. En layout desktop row, il est visuellement à gauche du bloc search → c'est "ce qui apparaît à gauche de l'input".

Structure du search dans le header : `.page-header__actions` (flex row) → `.combobox-primitive` → `.search-combobox__input-wrap` (flex, relative) → icône (position absolute, left 12px) + input (padding-left 35px). Pas de `key` React sur le SearchCombobox → pas de remount.

---

### 4. Ajout produit depuis une card — champ "en stock"

**✅ Implémenté 2026-04-26.** `AddToCollectionModal` : étape 2 (date + prix) ouverte pour les statuts "possédés" (`in_stock | holy_grail | archived | avoided` — constante `OWNED_STATUSES`). `wishlist` et `watched` restent un ajout direct (produit pas encore acquis). Bouton "Plus tard" sur l'étape 2 → crée le `userProduct` sans `purchase`. `selectedStatus` propagé dans `handlePurchaseSubmit` (plus de hardcode `'in_stock'`). `archived` ré-inclus dans `STATUS_OPTIONS`.

**Contexte**

Quand l'utilisateur clique sur "Ajouter" depuis une card produit dans la liste, une modale ou un panneau s'ouvre pour lier ce produit à sa collection avec un statut (En cours, Surveillé, Évité, Saint-graal…). Actuellement, on ne peut pas indiquer si le produit est **en stock** ou non au moment de l'ajout.

**Besoin**

Permettre de cocher "en stock / pas en stock" directement lors de l'ajout, sans avoir à repasser par l'édition du produit lié.

**Question ouverte — à trancher avant d'implémenter**

La sémantique "stock" est orthogonale au statut collection, mais pas forcément indépendante :

- Un produit **Évité** peut-il être en stock ? (On l'a mais on ne l'utilise plus / on ne veut plus l'utiliser.)
- Un produit **Surveillé** peut-il être en stock ? (On l'a, on attend de voir comment la peau réagit.)
- Un produit **Saint-graal** peut-il être épuisé ? (Oui, clairement.)

Décision à prendre : est-ce que "en stock" a du sens pour tous les statuts, ou seulement pour certains ? Si tous → le champ est toujours visible. Si seulement certains → le champ est conditionnel au statut sélectionné.

**Audit 2026-04-26**

Modal `AddToCollectionModal` confirmé en navigateur (produit haircare, utilisateur connecté). Étape 1 : 5 boutons de statut — "En stock", "Liste de souhaits", "Surveillé", "Saint Graal", "Évité". Seul "En stock" ouvre l'étape 2 (date d'achat requis + prix optionnel pré-rempli). Les autres statuts ajoutent directement sans champ stock.

**Il n'existe pas de colonne `in_stock` booléenne en DB.** La colonne `status` dans `user_products` est une enum : `in_stock | wishlist | watched | holy_grail | archived | avoided`. Le stock IS le statut — les deux sont mutuellement exclusifs par construction. Pour introduire un "en stock" orthogonal (ex: j'ai ce produit mais je le surveille), il faudrait une colonne `in_stock boolean` séparée + migration. Le schéma Zod supporte déjà `sentiment`, `wouldRepurchase`, `comment` non exposés dans le modal.

---

### 5. Dropdown de recherche d'ingrédients (edit) — ouvrir vers le haut si manque de place

**✅ Implémenté.** Hook `useFlipPlacement` extrait dans `frontend/src/component/Search/useFlipPlacement.ts` et consommé par `ComboboxPrimitive`, `AsyncSearchSelect`, `SearchSelect`. Le dropdown bascule au-dessus si la place sous le trigger est insuffisante. Recompute sur scroll de `.filter-drawer__body` et resize fenêtre.

**Contexte**

Dans `product/$slug/edit`, la recherche d'ingrédients utilise un composant `AsyncSearchSelect` qui affiche ses résultats dans un dropdown. Ce dropdown s'ouvre systématiquement **vers le bas**, même lorsque le champ est positionné en bas du formulaire et que la place est insuffisante. Le dropdown se retrouve alors rogné ou sort de l'écran visible.

**Solution standard**

Implémenter un hook de détection de place disponible (pattern "flip") :

1. Au moment de l'ouverture du dropdown, mesurer `getBoundingClientRect()` du champ déclencheur.
2. Comparer l'espace disponible en dessous (`window.innerHeight - rect.bottom`) avec la hauteur estimée du dropdown.
3. Si insuffisant → ouvrir vers le haut (`bottom: 100%` au lieu de `top: 100%`).

Ce pattern est déjà courant dans les librairies de Select/Combobox (Radix, Headless UI, etc.). L'implémentation peut être un hook `useDropdownPlacement` réutilisable — ce composant n'est probablement pas le seul concerné.

**Audit 2026-04-26**

Vérifié en navigateur sur `product/abib-glutathiosome-dark-spot-serum/edit`, formulaire scrollé en bas. Recherche "niac" saisie dans `IngredientSearch`.

Mesures réelles (viewport 876px) :
- Input : top=703px, bottom=754px
- Dropdown : top=758px, bottom=876px, height=117px — `position: absolute; top: 55.475px`
- Débordement : 0.1px (limite exacte du viewport à cette résolution)

Sur écran plus petit ou avec plus d'ingrédients existants, le débordement devient significatif — les résultats sont coupés sous le bord.

`ComboboxPrimitive.css:6` : `position: absolute; top: calc(100% + 4px)` — pas de flip. `AsyncSearchSelect` a déjà le mécanisme complet (`position: fixed` + `getBoundingClientRect` + comparaison espace haut/bas) aux lignes 156-203 de `AsyncSearchSelect.tsx`. C'est ce code qu'il faut porter sur `ComboboxPrimitive` ou extraire en hook partagé.

---

### 6. Dropdown Marque + Ingrédient dans le drawer — scroll parasite et position incorrecte

**✅ Implémenté.** `scrollIntoView` window-scroll supprimé de `SearchSelect.tsx` et `AsyncSearchSelect.tsx` à l'ouverture du dropdown. Le hook `useFlipPlacement` lit `getBoundingClientRect()` et écoute le scroll de `.filter-drawer__body` pour suivre le trigger sans polluer le scroll page. Reste un `scrollIntoView({ block: 'nearest' })` sur l'option active du listbox — ça c'est la nav clavier, pas le bug.

**Contexte**

Dans le filter drawer (`/products`), les filtres "Marque" (`SearchSelect`) et "Ingrédient" (`AsyncSearchSelect`) déclenchent un scroll visible de la page au moment où leur dropdown s'ouvre. Le dropdown apparaît ensuite en dehors de la zone visible du drawer, en dessous des boutons "Appliquer" / "Réinitialiser", voire complètement hors écran.

**Cause racine identifiée**

`SearchSelect.tsx:116` et `AsyncSearchSelect.tsx:152` partagent la même ligne :
```ts
inputRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' })
```
Cette ligne s'exécute dans un `useEffect` qui se déclenche quand `isOpen` passe à `true`. L'intention (commentaire en place) est de ramener l'input en haut de la zone scrollable du drawer pour libérer de l'espace en dessous. Mais `scrollIntoView` traverse TOUS les ancêtres scrollables — pas seulement `.filter-drawer__body`, mais aussi le `window`. Résultat : la page entière scrolle en douceur (`behavior: 'smooth'`), l'utilisateur voit la page descendre sous le drawer fixe.

Le dropdown utilise `position: fixed` et recalcule sa position via `getBoundingClientRect()` à l'ouverture. Si le scroll se produit AVANT le repositionnement du dropdown (effet non synchronisé), le dropdown se place à une position calculée avant ou pendant le scroll, ce qui le fait atterrir hors de la zone visible.

**Problème complémentaire — input hors de la zone visible du drawer**

La zone "Marque" et la zone "Ingrédient" sont en bas de la liste du drawer, après tous les accordéons de tags. Le `.filter-drawer__body` (`scrollHeight: 2066px`, `clientHeight: 737px`, `maxScroll: 1329px`) ne peut pas ramener ces inputs dans sa zone visible même après scroll max — les inputs dépassent le bas du drawer visible (viewport y ≈ 1199px vs bottom du drawer à y=808px). Le scroll de la page déclenché par `scrollIntoView` ne résout pas ce problème structurel.

**Solution**

1. Remplacer `scrollIntoView` par un scroll manuel ciblé sur `.filter-drawer__body` uniquement :
   ```ts
   const scrollable = inputRef.current.closest('.filter-drawer__body')
   scrollable?.scrollTo({ top: scrollable.scrollTop + delta, behavior: 'smooth' })
   ```
   Ou simplement supprimer cet effet maintenant que le dropdown est `position: fixed` — il n'a pas besoin que l'input soit en haut de l'écran pour se positionner correctement (il lit `getBoundingClientRect()` directement).

2. Vérifier que le `scroll` listener sur `.filter-drawer__body` (lignes 161-162 `SearchSelect.tsx`, idem `AsyncSearchSelect.tsx`) recalcule bien la position du dropdown quand le drawer scrolle — la logique `updatePosition` est en place, il faut juste que `scrollIntoView` ne pollue plus le `window`.

**Audit 2026-04-26**

Confirmé par mesure : brand input à viewport y=1199 après maxScroll du drawer (1329px), drawer bottom à y=808. Scroll de la page détecté via `scrollIntoView`. `SearchSelect.css:76` : `.search-select__dropdown { position: fixed; z-index: 200 }` — la position fixed est correcte, c'est le `scrollIntoView` qui casse l'expérience.

---

### 7. Filtres Marque et Ingrédient non transmis au backend

**✅ Implémenté.** `buildProductsApiFilters` (`frontend/src/features/products/helpers.ts:53-61`) lit `filters.brand` et `filters.ingredient` et les propage dans la valeur de retour. Backend déjà supportait. Le schema d'URL côté frontend accepte `string[]` (cf. `filterSearchSchema`).

**Contexte**

Sélectionner une marque (ex: Avène, Mixa) ou un ingrédient dans le filter drawer ne filtre pas la liste de produits — tous les produits sont toujours affichés.

**Cause racine**

`buildProductsApiFilters` (`frontend/src/features/products/helpers.ts:21`) ne transmet jamais `brand` ni `ingredient` au backend.

La fonction reçoit `filters: FilterValues<TagFilterKey>` et construit `tagFields` uniquement à partir de `DOMAIN_PRODUCT_FILTER_CATEGORIES[category]` (les clés de taxonomie comme `skin_type`, `concern`…). Les clés `brand` et `ingredient` sont dans l'objet `filters` passé en argument, mais ne sont jamais extraites ni incluses dans l'objet retourné.

```ts
// helpers.ts — ce qui est retourné :
return {
  category, ...tagFields, kind, avoid_for, sort, priceMin, priceMax, page, limit
  // ← brand et ingredient absents
}
```

Conséquence : `brand` et `ingredient` se retrouvent dans l'URL (le router TanStack les persiste), mais l'API est appelée sans eux.

**Proof**

Backend fonctionne parfaitement : `GET /api/products?category=skincare&brand=Avène` → 36 produits Avène (confirmé en curl). Le bug est exclusivement dans le mapping frontend → API call.

**Fix**

Ajouter `brand` et `ingredient` dans la valeur de retour de `buildProductsApiFilters` :
```ts
brand: filters['brand']?.length > 0 ? filters['brand'].join(',') : undefined,
ingredient: filters['ingredient']?.length > 0 ? filters['ingredient'].join(',') : undefined,
```
Vérifier que `ListProductsFilters` (type partagé) accepte ces deux champs — le backend les supporte déjà (`service.ts:262-264`).

**Audit 2026-04-26**

Naviguer vers `?brand=Av%C3%A8ne` (format string) → error page (schema Zod attend `string[]`). API curl directe : `?brand=Avène` → 36 produits. Le schema URL frontend est `z.string().array().default([])` pour `brand` (via `filterSearchSchema`). Le backend accepte `brand` en string (séparés par virgule possible d'après `service.ts:263`).

---

### 8. Header search — résultats limités à 8, pas de navigation vers la liste filtrée

**✅ Implémenté 2026-04-26.**

- **Étape A** : `productQueries.search` passe `limit: '20'` (`frontend/src/lib/queries/products.ts:122`). Schema `searchProductsQuery` a `max(20)`.
- **Étape B1** : entrée "Voir tous les produits {Marque}" en bas du dropdown quand le query matche une marque connue (case-insensitive, exact). Click → `navigate({ to: '/products', search: { brand: [match], page: 1 } })`. Implémentation :
  - `ComboboxPrimitive` reçoit un nouveau prop `footer?: ReactNode` rendu en bas de la listbox.
  - `SearchCombobox` reçoit `extraEntry?: (q) => { id, label, onSelect } | null` exposé en footer stylisé. Click clear le query + ferme.
  - `ProductsHeader` consomme `productQueries.brands()` et passe la fonction `extraEntry`.
- **Étape C** : load-more serveur (pagination par `offset`).
  - Backend : `searchProductsQuery` schema accepte `offset` (default 0). `searchProducts` fetch `limit + 1` pour détecter `hasMore` sans COUNT(*) séparé. Retourne `{ items, hasMore, nextOffset }`. Tests `searchProducts` adaptés (les deux existants + un nouveau pour la pagination).
  - Shared : nouveau type `ProductSearchPage`.
  - Frontend `productQueries.search` : passé en `infiniteQueryOptions` (`getNextPageParam` lit `lastPage.hasMore`).
  - `ingredientQueries.searchInfinite` : wrapper single-page (pas de pagination backend pour ingrédients) — distinct de `ingredientQueries.search` (toujours `queryOptions`, utilisé par `IngredientSearch` et `useProductsFilterGroups`).
  - `SearchCombobox` : passé sur `useInfiniteQuery`, flatten `data.pages.flatMap(p => p.items)`. Expose `hasNextPage` + `fetchNextPage` à `ComboboxPrimitive`.
  - `ComboboxPrimitive` : sentinel `<div ref={sentinelRef}>` en bas du listbox + `IntersectionObserver` (root = dropdown, rootMargin 40px). Quand le sentinel intersecte → `onLoadMore()`. Status "Chargement..." si `isLoadingMore`.
  - Consommateurs migrés : `ProductsHeader`, `QuickAdd`, `IngredientsPage` (passe `searchInfinite`).

**Limitations connues étape B1**
- Match marque exact uniquement (pas de fuzzy / startsWith) → typer "av" ne déclenche pas l'entrée. Volontaire pour éviter les faux positifs.
- Pas de count par marque dans l'entrée ("Voir tous les produits Avène (36)") — `getDistinctBrands` retourne `string[]`. Si besoin, ajouter un endpoint `/brands?withCount=1` ou enrichir `getDistinctBrands`.
- L'entrée extra n'est pas accessible au clavier (arrows skip le footer). Souris/tap uniquement pour v1. À ré-évaluer si usage clavier devient un signal.

**Contexte**

La barre de recherche dans le header de la page produits (`SearchCombobox`) est un autocomplete de navigation : taper un terme affiche ~8 suggestions, cliquer sur l'une d'elles navigue vers la fiche du produit. L'utilisateur s'attend à trouver tous les produits correspondants (ex: "Avène" → tous les produits Avène), avec scroll ou pagination.

**Ce qui existe**

`searchProducts` (`backend/src/features/products/service.ts:527`) : `limit: 8` hardcodé. Recherche ILIKE sur `name` + `brand`, retourne 8 résultats maximum, sans total ni pagination.

Il existe **36 produits Avène** en DB skincare. La recherche "avène" en retourne 8 — les 28 autres sont invisibles.

**Deux usages distincts à clarifier**

1. **Autocomplete de navigation** (comportement actuel) : trouver un produit précis et naviguer vers sa fiche. Limite basse (8) adaptée.
2. **Filtre de liste** (comportement attendu par l'utilisateur) : voir tous les produits d'une marque/correspondant à un terme, avec pagination. → Ce besoin est couvert par le filtre "Marque" du drawer (bug #7 à corriger), pas par la SearchCombobox.

**Action**

- Court terme : corriger le bug #7 (brand filter). L'utilisateur pourra filtrer par marque via le drawer.
- Moyen terme : clarifier l'UX de la SearchCombobox — ajouter une entrée "Voir tous les résultats pour X" qui applique un filtre de texte libre sur la liste, ou augmenter la limite à 15-20.

**Audit 2026-04-26**

`curl /api/products/search?q=avène` → `count=8`. `curl /api/products?brand=Avène` → `total=36`. Confirme : le header search ne montre qu'une fraction des résultats réels.

---

### 9. Soumission de la recherche (Enter) — filtre liste plutôt que navigation

---

#### Journal D1 — 2026-04-26 ✅ shippé

**Le problème en une phrase**

Quand on tapait "vitamine C" dans la barre de recherche du header produits, on voyait seulement les produits dont le **nom** contient "vitamine C" (genre "Sérum Vitamine C 10%"). On ne voyait **pas** les 30 autres produits qui contiennent l'ingrédient vitamine C dans leur formule mais sans le mot dans le nom. L'utilisateur ratait l'essentiel.

**La solution choisie**

Garder l'autocomplete actuel (qui cherche dans le nom + la marque), mais **ajouter en bas du dropdown une entrée raccourci** : "Voir tous les produits avec Vitamine C". Cliquer dessus filtre la page produits par ingrédient. Pareil pour la marque (déjà fait en B1) — maintenant pareil pour les ingrédients.

**Plan d'attaque en 5 étapes**

Le travail a été découpé en 5 commits pour qu'on puisse revenir en arrière facilement si quelque chose casse, et pour que chaque commit fasse une seule chose claire.

---

##### Étape 1 — Outil "foldText" pour comparer les mots sans accents

**Commits :** `4995d839` puis `20f6925e` (polish)

Avant de comparer "Avène" et "avene", il faut les normaliser. La fonction `foldText` enlève les accents, met tout en minuscules, vire les espaces autour. Comme ça `foldText('Avène') === foldText('avene')` est vrai.

C'est une petite fonction de 5 lignes, plus 5 tests qui vérifient qu'elle fait bien son boulot. Le commit polish `20f6925e` a juste rendu le code plus lisible (les caractères "marque combinante" Unicode étaient invisibles, on les a remplacés par leur forme `̀-ͯ` lisible).

**Fichier créé :** `frontend/src/component/Search/text-fold.ts`

---

##### Étape 2 — Bug du dropdown qui restait collé à l'écran

**Commits :** `4a0b788f` puis `af40156c` (polish)

Bug constaté : on ouvrait le dropdown de recherche, on scrollait la page, et le dropdown ne suivait pas l'input — il restait fixe au milieu de l'écran, coupé du champ de saisie. Pas joli.

**La cause** : le dropdown utilise `position: fixed` et un calcul de position basé sur le viewport. Le code écoutait le scroll du tiroir de filtres et le redimensionnement de la fenêtre — mais pas le scroll de la page elle-même. Donc quand on scrollait la page, rien ne disait au dropdown de se repositionner.

**Le fix** : ajouter un écouteur `window.addEventListener('scroll', ...)` (en mode `passive` pour ne pas ralentir le scroll). Plus un cleanup symétrique pour ne pas créer de fuite mémoire quand le dropdown se ferme.

Bonus dans le même commit : le `MAX_HEIGHT` du dropdown passe de "240px sur desktop / 200px sur mobile" à `min(50% de la hauteur écran, 400px)`. Plus adaptatif. Le polish `af40156c` ajoute juste `passive: true` aussi sur l'écouteur resize, par cohérence avec le scroll.

**Fichier modifié :** `frontend/src/component/Search/useFlipPlacement.ts`

---

##### Étape 3 — Couper le dropdown en 2 zones (items qui scrollent + footer fixe)

**Commit :** `abfefec4`

Bug constaté : l'entrée "Voir tous les produits Avène" (le footer brand B1 déjà existant) était noyée tout en bas du dropdown, après les 8+ suggestions produits. Il fallait scroller pour la voir. Pas découvrable.

**La cause** : le dropdown était une seule grosse boîte qui scrollait, avec les items + le footer dedans. Le footer scrollait avec.

**Le fix** : restructurer la boîte en deux compartiments empilés (flex column) :
- **Zone du haut** : les items produits, qui scrollent (`overflow-y: auto`)
- **Zone du bas** : le footer (les "Voir tous"), qui ne scrolle pas, toujours visible

Côté ARIA accessibility, la zone du haut garde le `role="listbox"` (c'est elle qui contient les vraies options sélectionnables). Le footer sort du listbox, ce qui est correct sémantiquement (les entrées footer sont des actions de navigation, pas des "options").

**Fichiers modifiés :** `frontend/src/component/Search/ComboboxPrimitive.tsx` et `.css`

---

##### Étape 4 — Permettre PLUSIEURS entrées footer (pas juste une)

**Commit :** `bcac04b9`

Avant : `SearchCombobox` acceptait `extraEntry` (singulier) — une seule entrée bonus possible (la marque B1).

Maintenant : `extraEntries` (pluriel) — un tableau d'entrées. Comme ça on peut empiler marque + ingrédient quand les deux matchent.

Au passage on ajoute un champ `icon?: ReactNode` à chaque entrée pour pouvoir mettre une petite icône Lucide à gauche du label.

**Détail CSS** : avant, chaque bouton `.search-combobox__extra` avait un `border-top` à lui. Avec la nouvelle zone footer (étape 3) qui a déjà son propre `border-top`, on aurait eu une double bordure. Fix : enlever le `border-top` du bouton, et le mettre uniquement entre boutons adjacents via `.search-combobox__extra + .search-combobox__extra { border-top: ... }`.

**Fichiers modifiés :**
- `frontend/src/component/Search/SearchCombobox.tsx` (l'API)
- `frontend/src/component/Search/SearchCombobox.css` (le fix bordure)
- `frontend/src/features/products/components/ProductsHeader/ProductsHeader.tsx` (mise à jour conso : passe un tableau d'un seul élément pour la marque, en attendant l'étape 5)

---

##### Étape 5 — La vraie feature D1 : brancher le match ingrédient

**Commit :** `e3540c92`

Maintenant qu'on a tous les outils, on les assemble dans `ProductsHeader` :

1. On charge la liste de tous les ingrédients via `ingredientQueries.options()` (déjà existant dans le code mais sans consommateur jusqu'ici — cache 10 minutes, ~7 KB gzippé pour ~427 ingrédients skincare).

2. Dans le callback `extraEntries(q)` qu'on passe au `SearchCombobox`, on fait :
   - Fold le query
   - Si trop court (< 2 caractères) → tableau vide
   - Cherche un match marque exact → si trouvé, ajoute une entrée (icône `Tag`)
   - Cherche un match ingrédient exact (par nom OU par slug) → si trouvé, ajoute une entrée (icône `FlaskConical`)
   - Retourne le tableau (0, 1 ou 2 entrées)

3. Click sur une entrée → `navigate({ to: '/products', search: (prev) => ({ ...prev, brand: [X], page: 1 }) })` (préserve les autres filtres actifs).

**Pourquoi inline et pas un hook `useProductFacetMatch` ?** Le spec proposait un hook. Mais le callback `extraEntries(q)` du `SearchCombobox` est appelé sur chaque keystroke debouncé — appeler un hook React dedans casserait les Rules of Hooks (un hook doit être appelé au top-level d'un composant, pas dans un callback). Solution : on hoist `useQuery` au body du composant (légal), et on fait la comparaison synchrone fold-and-find dans le callback (pure, pas un hook). Plus simple, moins de fichiers.

**Tests intégration ajoutés** dans `ProductsHeader.test.tsx` (4 tests) :
- Tape "avène" → l'entrée marque apparaît
- Tape "vitamine c" → l'entrée ingrédient apparaît
- Tape "xyzqwerty" → aucune entrée
- Click sur l'entrée ingrédient → `navigate` est bien appelé avec `ingredient: ['vitamine-c'], page: 1`

**Fichiers :**
- `frontend/src/features/products/components/ProductsHeader/ProductsHeader.tsx` (modifié)
- `frontend/src/features/products/components/ProductsHeader/__tests__/ProductsHeader.test.tsx` (nouveau)

---

#### Résumé du résultat final

L'utilisateur tape un terme dans la barre de recherche du header produits. Le dropdown s'affiche en deux zones :

```
┌─ Suggestions produits (scrollables) ──────┐
│  • Sérum Vitamine C — The Ordinary        │
│  • Booster Vitamine C — Paula's Choice    │
│  • ... (charge plus en scrollant)         │
├────────────────────────────────────────────┤
│  🧪  Voir tous les produits avec Vitamine C │  ← footer fixe
└────────────────────────────────────────────┘
```

- **Click sur un produit** → fiche produit (comme avant)
- **Click sur le footer "Voir tous"** → page liste filtrée (`/products?ingredient=vitamine-c`)
- **Scroll de la page** → dropdown suit l'input (bug fixé)

Tests : **+9 tests verts** (5 unitaires `foldText` + 4 intégration `ProductsHeader`). 0 régression sur la baseline de 19 fails préexistants (Toggle / FilterDrawer / etc., orthogonaux).

#### Journal D2 — 2026-04-27 ✅ shippé

**Le problème en une phrase**

Taper "niacinamide" puis Enter ne faisait rien — l'utilisateur devait cliquer sur le footer "Voir tous les produits avec Niacinamide" à la souris. Sur mobile ou clavier, c'était une friction inutile.

**La solution**

`SearchCombobox.handleKeyDown` s'étend : quand Enter est pressé sans item highlight (`highlightedIndex === -1`), le dropdown est ouvert (`showDropdown`), et une entrée footer existe (`extras[0]`) → `e.preventDefault()` + déclenche `handleExtraSelect(extras[0])`. Le `ComboboxPrimitive` voit `defaultPrevented=true` et passe — aucune modif du Primitive.

Comportement complet :
- Enter + item highlight → navigation produit (inchangé)
- Enter + pas de highlight + footer → déclenche `extras[0].onSelect()` (marque ou ingrédient selon ce qui matche)
- Enter + pas de highlight + pas de footer → rien (inchangé)

**Fichier modifié :** `frontend/src/component/Search/SearchCombobox.tsx` (+4 lignes)

Tests : **+2 tests verts** dans `SearchCombobox.test.tsx` (keyboard suite) :
- "Enter with no highlight triggers first footer entry"
- "Enter with highlighted item selects item, not footer"

#### Journal D3 — 2026-04-27 ✅ shippé

**Le problème en une phrase**

Taper un terme qui n'est ni une marque ni un ingrédient (ex: "matifiant") ne ramenait que ~8 produits via l'autocomplete header (`searchProducts`, ILIKE name+brand limit 8). Aucun moyen depuis la barre de recherche d'obtenir la **liste complète** des produits dont le nom contient ce mot.

**La solution**

Paramètre `q` texte libre ajouté au list endpoint (ILIKE name OR brand). Le header `SearchCombobox` propose une entrée footer fallback **"Voir tous les résultats pour 'X'"** quand la query ne matche ni marque ni ingrédient. Click ou Enter → `/products?q=X` → liste paginée filtrée.

Comportement complet en cascade :
- Match marque exact → entrée brand footer
- Match ingrédient exact (name OU slug, fold) → entrée ingredient footer
- **Aucun match facette → entrée fallback `q`** (mutuellement exclusive avec les facettes)

**Implémentation (12 fichiers)**

Backend / shared :
- `shared/src/products/list-products-query.ts` : `q: z.string().trim().min(1).max(100).optional()` dans `baseListProductsQuery` (propagé aux 4 branches discriminées).
- `backend/src/features/products/service.ts` : `if (filters.q) conditions.push(or(ilike(name, %q%), ilike(brand, %q%)))`. `escapeLike` pour échapper les wildcards LIKE dans l'input utilisateur.
- `backend/src/features/products/tests/products.test.ts` : 3 tests (match name, match brand, no match).

Frontend :
- `frontend/src/features/products/filters.ts` : `q` dans `productsSearchSchema` (URL state).
- `frontend/src/features/products/helpers.ts` : `q` dans `buildProductsApiFilters`. `isDiscoveryMode` étendu avec `hasQuery` — un `q` actif sort du discovery (intent utilisateur). `buildResetSearchParams` + `buildDomainSwitchSearch` clear `q`.
- `frontend/src/features/products/__tests__/helpers.test.ts` : signature `hasQuery` propagée + 2 nouveaux tests (forward `q`, sort discovery).
- `frontend/src/features/products/hooks/useProductsExtraChips.ts` : chip `Recherche : "X"`, onRemove → set `q: undefined`.
- `frontend/src/features/products/pages/ProductsPage/ProductsPage.tsx` : lit `q` du search, passe au builder + `useProductsExtraChips` + `effectiveFilterCount`.
- `frontend/src/features/products/components/ProductsHeader/ProductsHeader.tsx` : fallback footer (icône `Search`) quand `entries.length === 0`. Click/Enter navigate avec `q: trimmed`.
- `frontend/src/features/products/components/ProductsHeader/__tests__/ProductsHeader.test.tsx` : 4 nouveaux tests (no-match → fallback positive, mutex facette/fallback, click fallback, Enter fallback).
- `frontend/src/lib/queries/products.ts` : `q` dans `ListProductsFilters` + serializer `buildListProductsQuery`.
- `frontend/e2e/products.spec.ts` : "matifiant" → footer fallback → URL `?q=matifiant` + chip visible.

**Limitations connues**

- D3 ne matche **que** `products.name` + `products.brand`. Pas les **tags**. Un produit taggué `product_label: matifiant` mais sans le mot dans son nom reste invisible via D3. Couvrir aussi les tags = scope D4 (multi-facettes) ou nouveau chantier.
- ILIKE simple, pas de `pg_trgm`. Volontaire : prédictabilité (le user a tapé un mot exact, on cherche ce mot, pas une approximation). Si besoin de tolérance fautes plus tard, switch vers `similarity()` comme `searchProducts`.
- Pas d'empty state spécifique au mode `q` — fallback sur l'EmptyState générique "Aucun produit ne correspond à vos filtres".

**Tests**
- Backend: 80/80 (+3 tests `q free-text`)
- Frontend: 94/94 (+4 helpers, +4 ProductsHeader)
- E2E: 1 nouveau spec (compile, listé, à valider via `make e2e`)

#### Journal D4 — 2026-04-27 ✅ shippé

**Le problème en une phrase**

D1+D2+D3 ne montraient qu'**un** match par facette (le match exact via `===` après fold). Taper "vita" ne ramenait que la "Vitamine C" si elle existait, masquant Vitamine E, A, B3. Une seule entrée mélangée dans un footer plat (au plus 2-3 entrées toutes confondues), sans hiérarchie visuelle entre marques / ingrédients / fallback texte.

**La solution**

Le dropdown bascule en **sections labellisées** : Ingrédients (top 3) / Marques (top 3) / Recherche (fallback toujours présent). Match passe d'`===` à `contains` après fold (multi-match). Sections vides filtrées avant rendu. Navigation clavier traverse tout le contenu (items principaux + items de sections) via un index global. ARIA: `role="group"` + `aria-labelledby` par section, items toujours `role="option"` dans le `role="listbox"` parent.

```
┌─ items produits scrollables ────────┐
│ • Sérum Vitamine C — The Ordinary  │
│ • Vitamin C Booster — Paula's      │
├─ INGRÉDIENTS ───────────────────────┤
│ 🧪 Voir tous produits avec Vitamine C│
│ 🧪 Voir tous produits avec Vitamine E│
│ 🧪 Voir tous produits avec Vitamine A│
├─ RECHERCHE ─────────────────────────┤
│ 🔍 Voir tous résultats "vita"      │
└─────────────────────────────────────┘
```

**Implémentation (8 fichiers)**

`frontend/src/component/Search/` :
- `ComboboxPrimitive.tsx` : nouveau prop `sections?: ComboboxSection[]` + types `ComboboxSection` / `ComboboxSectionItem`. Flat keyboard nav (`totalEntries = items + section items`, indices contigus). Render sections après items dans le même listbox. ARIA group + aria-labelledby sur chaque section. `useFlipPlacement` deps trigger sur `totalEntries`.
- `ComboboxPrimitive.css` : styles `__section` (border-top + spacing) et `__section-label` (uppercase, muted, xs).
- `SearchCombobox.tsx` : API `extraEntries` remplacée par `sections: (q) => ComboboxSection[]`. Wrap chaque `item.onSelect` via `handleSectionSelect` pour cleanup automatique (clear input, close, reset highlight). Filter empty sections. Enter sans highlight → premier item du premier section visible (cascade D2 préservée).
- `SearchCombobox.css` : suppression `__extra`/`__extra+__extra`, ajout `__section-entry` (flex icon+label).
- `index.ts` : ré-export `ComboboxSection` / `ComboboxSectionItem`.

`frontend/src/features/products/components/ProductsHeader/ProductsHeader.tsx` :
- 3 sections (Ingrédients / Marques / Recherche). Match passe à `foldText(name).includes(folded) || slug.includes(slugFolded)` pour ingrédients, `foldText(b).includes(folded)` pour marques. Top 3 par section (`FACET_SECTION_LIMIT`). Fallback toujours présent (plus mutex avec facets).

**Tests** :
- `SearchCombobox.test.tsx` : 4 tests sections (header label, empty filter, click+close, keyboard nav inter-sections) + 2 keyboard adaptés (`extraEntries` → `sections`).
- `ProductsHeader.test.tsx` : mock ingredients passe à 4 vitamines pour tester top-3. Test mutex D3 supprimé, remplacé par "fallback alongside facet". Nouveaux : "section header labels", "caps ingredient section at FACET_SECTION_LIMIT".

**Comportement Enter (cascade D2 préservée)**
- Enter avec highlight → onSelect ou item.onSelect (item ciblé)
- Enter sans highlight + ingredient match → premier ingredient (best semantic)
- Enter sans highlight + brand match seul → première brand
- Enter sans highlight + ni facet → fallback (`q=...`)

**Limitations connues**
- Match alphabétique (`Array.filter` order par `ingredients`/`brands` query order). Pas de scoring relevance. Suffisant tant que les listes restent courtes (~427 ingrédients, ~70 marques).
- Section "Marques" peut sembler redondante avec D1 brand match exact (qui ramenait 1 entrée). Maintenant top 3 brands `contains` — par exemple taper "der" matche "Bioderma" + "Biodermabrush". Plus utile pour les marques composées.
- Pas d'announcer aria-live pour le changement de sections (le total est annoncé via `${totalEntries} résultats disponibles`).

**Tests**
- Backend: 80/80 (inchangé)
- Frontend: 114/114 (sur Search + products) — 0 régression sur la baseline 19 fails préexistants
- E2E spec D3 toujours valide (footer fallback texte préservé via section "Recherche")

#### Ce qui reste à faire

- _(Vide — D1/D2/D3/D4 tous shippés.)_

#### Coverage gaps — ✅ addressé 2026-04-27

**Unit / intégration** (`ProductsHeader.test.tsx`)
- ✅ Test no-match durci : `aria-expanded=true` confirmé avant la négative. Renommé "renders fallback footer" depuis D3 (la négative pure n'a plus de sens, le fallback est positif).
- ✅ Test intégration accent fold : `avene` → `Avène` (mock `brands: ['Avène']`).
- ✅ Test intégration Enter → navigate : `vitamine c` + Enter → asserte `navigate({ to: '/products', search: ... ingredient: ['vitamine-c'] ... })`.

**E2E** (`frontend/e2e/products.spec.ts`)
- ✅ D1 : tape "vitamine c" → footer ingrédient → click → URL `?ingredient=vitamin-c` + cards visibles.
- ✅ D2 : tape "niacinamide" → footer visible → Enter → URL `?ingredient=niacinamide` + cards.
- ✅ Brand footer : tape "avène" → footer marque → click → URL `?brand=Av%C3%A8ne` + cards.
- ✅ D3 : tape "matifiant" → footer fallback → click → URL `?q=matifiant` + cards + chip "Recherche".

#### Références

- **Spec** : `docs/superpowers/specs/2026-04-26-search-d1-design.md`
- **Plan d'implémentation** : `docs/superpowers/plans/2026-04-26-search-d1.md`
- **Commits** : `4995d839` → `e3540c92` (5 commits feature + 2 polish + 1 docs)

---

#### Contexte original (préservé)

**Scénario observé**

L'utilisateur tape "vitamine C" dans le header search. Le dropdown affiche les produits dont le **nom** contient "vitamine C" (ILIKE sur `name` + `brand`). Mais l'intention réelle est souvent : "montre-moi les produits qui *contiennent* de la vitamine C" — pas ceux dont le nom mentionne "vitamine C".

Idem pour "rétinol", "niacinamide", "acide salicylique" : ce sont des **ingrédients**, pas des noms de produits. Le pattern "marque" (couvert en B1 par l'entrée "Voir tous les produits Avène") doit s'étendre à d'autres facettes : **ingrédient**, **type de produit**, **type de peau**.

**Le bon pattern UX : "submit search"**

Convention universelle en e-commerce et catalogues (Amazon, Sephora, Beautypedia, Skinsort) :

1. **Click sur une suggestion** → navigation vers la fiche d'UN produit (l'utilisateur sait lequel il veut).
2. **Appui sur Enter sans suggestion sélectionnée** → soumission de la recherche → page liste filtrée par le terme.
3. **Lien "Voir tous les résultats pour X"** en bas du dropdown → équivalent visuel de la touche Enter, pour les utilisateurs qui n'utilisent pas le clavier.

L'autocomplete reste un raccourci (latence faible, peu de résultats), la liste filtrée reste l'outil de "browse" (pagination, filtres combinés, tri).

**Pourquoi c'est important pour Aurore**

Aurore n'est pas un site qui fait acheter un produit précis. C'est un outil de **découverte de routine**. L'utilisateur arrive avec :
- une **problématique** ("anti-âge", "rougeurs"),
- un **ingrédient** qu'on lui a recommandé,
- un **type de produit** ("sérum hydratant"),
- ou une **marque** qu'il connaît.

Dans aucun de ces cas il ne tape un nom de produit complet. Le header search devrait donc traiter le terme comme un signal multi-facettes, pas un préfixe `name LIKE '%X%'`.

**Mappings souhaités**

| Type de match | Action sur Enter / clic "Voir tous" |
|---------------|-------------------------------------|
| Marque connue (Avène, Bioderma…) | navigate `/products?brand=[X]` (déjà fait — étape B1) |
| Ingrédient connu (vitamine c, rétinol, niacinamide…) | navigate `/products?ingredient=[slug]` |
| Type de produit (sérum, crème, baume…) | navigate `/products?kind=[slug]` ou `?product_type=[slug]` selon taxonomie |
| Tag taxonomie (anti-âge, peau sèche…) | navigate `/products?<tagCategory>=[slug]` |
| Aucun match facette → texte libre | navigate `/products?q=[term]` (nécessite filtre `q` côté list endpoint — pas implémenté) |

**Bonnes pratiques**

1. **Hiérarchie des intentions** : autocomplete (nav) > raccourcis facettes (filter via match) > recherche texte libre (filter via `q`). Jamais l'inverse.
2. **Disambiguation visible** : afficher dans le dropdown des sections distinctes :
   - "Produits" (suggestions navigables)
   - "Ingrédients" (Voir produits avec X)
   - "Marques" (Voir produits Y)
   - "Voir tous les résultats" (texte libre)
3. **Enter = soumission** : implicite et universel. L'utilisateur attend ce comportement même sans le savoir. Si la touche ne fait rien (ou navigue vers le 1er résultat sans choix), c'est une friction TDAH classique : "j'ai tapé, j'ai validé, il s'est rien passé d'utile".
4. **Slug-first matching** : `getDistinctIngredients()` doit comparer sur `slug` ou `name` insensiblement, accent-fold, trim. Sinon "vitamine c" ≠ "Vitamine C" ≠ "vitamine-c".
5. **Conserver le query dans l'URL** : `?q=vitamine c` permet le partage de lien et l'historique navigateur.
6. **Empty state utile** : si aucun produit ne contient l'ingrédient cherché, ne pas montrer "0 résultat" mais "Aucun produit ne contient encore X — voir la fiche ingrédient" + lien fiche ingrédient. La fiche ingrédient est un autre point d'entrée valide.

**Recommandation pragmatique pour aurore**

Phase par phase, avec valeur visible à chaque étape :

1. **Étape D1 — Match ingrédient (analogue à B1 marque)** : query `ingredientQueries.list({ q })` ou un endpoint léger `/api/ingredients/match-name?q=`. Si match exact (slug/name fold), entrée "Voir tous les produits avec X" → `navigate({ to: '/products', search: { ingredient: [slug] } })`. Couvre 80% du besoin "rétinol" / "niacinamide" / "vitamine c". Coût modéré (un endpoint match + handler dropdown).

2. **Étape D2 — Submit-on-enter** : si Enter pressé sans suggestion sélectionnée, déclencher la même logique de match-and-navigate (marque → filtre brand, ingrédient → filtre ingredient). Si aucun match, fallback vers étape D3.

3. **Étape D3 — Filtre `q` texte libre sur list endpoint** : pour les recherches qui ne matchent ni marque ni ingrédient (ex: "matifiant" qui n'est ni une marque ni un ingrédient mais peut être un nom de produit ou un tag). Ajouter `q` dans `listProductsQuery` schema, ILIKE name+brand côté service. Stocker dans URL `?q=...`. Plus lourd (touche le schéma list partagé, le builder URL frontend, le drawer pour afficher le query actif comme une "puce").

4. **Étape D4 (optionnelle) — Sections multi-facettes dans le dropdown** : "Produits" / "Ingrédients" / "Marques" / "Voir tous". UX plus riche, mais aussi plus complexe à maintenir (3-4 sources async, ordering, gestion clavier). À ouvrir seulement si D1+D2+D3 ne suffisent pas.

**Mon avis honnête**

L'utilisateur cherchait initialement "voir plus de résultats" (étape C — load-more — fait). Mais le vrai pain produit, c'est cette confusion entre *autocomplete de navigation* et *filtre de liste*. Tant que la SearchCombobox traite "vitamine C" comme un préfixe de nom, elle est un mauvais outil de découverte.

L'étape D1 (match ingrédient) est le meilleur ratio impact/coût — elle débloque tout de suite le cas le plus fréquent (ingrédients) en suivant un pattern déjà éprouvé (B1 marque). Ne pas faire D3 tout de suite : la search texte libre sur la liste est tentante mais redondante si D1+D2 couvrent bien les facettes nommées.

**Risque à éviter** : empiler trois mécanismes de recherche concurrents (autocomplete + filtre brand + filtre ingredient + filtre q + filtres tags du drawer) sans hiérarchie claire. La page liste devient un sapin de Noël et l'utilisateur ne sait plus quel canal donne quel résultat. Préférer une seule barre de recherche **intelligente** qui dispatche selon le match, plutôt que trois inputs qui font des choses différentes.

---

### 10. Flash visuel du dropdown SearchCombobox au re-fetch

**✅ Implémenté 2026-04-27.**

**Cause**

À chaque frappe (après debounce), `debouncedQuery` changeait → TanStack Query vidait `data` et passait `isFetching=true` → `ComboboxPrimitive` swappait les items contre le spinner "Chargement..." → items de retour à la résolution. Flash visible à chaque keystroke.

**Fix (`frontend/src/component/Search/SearchCombobox.tsx`)**

- `placeholderData: (prev) => prev` sur `useInfiniteQuery` : les résultats précédents restent visibles (`isPlaceholderData=true`) pendant que la nouvelle query charge.
- `isLoading={isFetching && !isFetchingNextPage && !isPlaceholderData}` : le spinner n'apparaît que lors du tout premier fetch (aucune donnée en cache) — jamais entre deux frappes.

**Tests ajoutés (`frontend/src/component/Search/__tests__/SearchCombobox.test.tsx`)**

9 tests couvrant `SearchCombobox` (composant non testé jusqu'ici) :
- `results` : items affichés après minChars, `onSelect` appelé avec slug + result, input vidé + dropdown fermé après sélection.
- `loading states` : spinner sur premier fetch / **items précédents visibles pendant re-fetch** (régression directe du fix).
- `keyboard` : Escape ferme, ArrowDown + Enter sélectionne le premier item.
- `footer` : `extraEntries` rendues, `onSelect` + fermeture au clic.

Infrastructure : stub `IntersectionObserver` (jsdom) ajouté en tête du fichier ; `debounce={0}` utilisé comme prop pour les tests (contourne le timer sans fake-timers). Le flag `abcStarted` dans le test "no flash" garantit que la re-fetch a bien démarré avant l'assertion.

# Roadmap — Products

## 📚 Références

| Doc | Rôle | Quand consulter |
|---|---|---|
| `shared/src/products/STATE.md` | Source de vérité domaine products (schéma DB, taxonomie, validation Zod, routes, service, UI state, flow cross-layer) | Avant toute modif touchant un layer products |
| `shared/src/products/PLAN.md` | Refacto taxonomy skincare (clusters, aliases, tier ⊥ visibility, search expansion) | Avant toucher search aliases, ordre drawer, auto-tagging |
| `frontend/docs/filter-tests-plan.md` | Plan de tests Filter (drawer + search + hooks), MSW v2, état dette | Avant modif `component/Filter/*` ou tests intégration ProductsPage |
| `backend/src/db/seed/docs/DEDUP.md` + `audit-imported-products.ts` | Audit doublons produits | Avant Phase 6 doublons |
| `backend/src/db/seed/docs/IMAGES_AUDIT.md` | Audit images manquantes BunnyCDN | Avant Phase 6 images |
| `idee/algo/dermo-signal-scoring-roadmap.md` §12.5 | Intégration `algo-derm` × Aurore | Avant Phase 8 concentrations INCI |

---

## 🏗️ Architecture

| Fichier / dossier | Rôle |
|---|---|
| `pages/ProductsPage/` | Orchestration liste + filtres + pagination |
| `pages/ProductLayout/` | Wrapper détail (tabs) |
| `pages/ProductInfoTab/` | Fiche produit : ingrédients, tags, purchase log |
| `pages/ProductCreate/EditPage/` | Wrappers form création/édition |
| `components/ProductCard/` | Card (slug, brand, price, tags, view transitions) |
| `components/ProductForm/` | Form création/édition + `IngredientRow` inline |
| `components/ProductsHeader/` | Search + sort + filter button + create |
| `components/ProductsActiveBar/` | Chips filtres actifs + remove |
| `components/ProductsFilterDrawerContent/` | Wrapper composition du drawer |
| `components/SortControl/` | Dropdown tri (relevance, price, newest, random) |
| `components/BrandCombobox/` | Combobox brand async |
| `components/IngredientSearch/` | Single-add ingrédient (dans le form, ≠ `AsyncSearchSelect`) |
| `components/PriceRangeFilter/` + `PriceFilterAccordion/` | Slider prix + wrapper `<details>` |
| `hooks/useProductsFilterGroups.ts` | Dérive la structure des groupes de filtres depuis le domaine |
| `hooks/useProductsExtraChips.ts` | Construit les chips actifs (prix, profil, q) |
| `filters.ts` | Schéma Zod de l'URL search params |
| `helpers.ts` | `buildProductsApiFilters()` + helpers domaine |

---

## 🚧 Actif — phasé par dépendances

> Audit 2026-04-26 : baseline 19 fails tests préexistants (Toggle, FilterDrawer resync, CollectionPage, PurchaseFlow, ProductDetailSheet, Layout/Card) — orthogonaux, traités Phase 4.

---

### Phase 1 — Perf isolées (ProductsPage + Info/Edit) ✅

PR 1a + 1b traités. Pass LOW close (voir Terminé #16).

Triagés out (gain marginal, ré-ouvrir si profiling montre hotspot) :
- `style={{ viewTransitionName }}` inline par card (`ProductCard.tsx:156`) — Card `memo`isée → re-render rare.
- `unit?.toLowerCase().trim()` alloue par card (`ProductCard.tsx:79-82`) — Coût négligeable.
- `tagQueries.list` mapping en `queryFn` (`lib/queries/tags.ts:20-24`) — runs 1× per fetch, RQ cache la sortie. Pas un re-render alloc.
- `BrandCombobox` `useEffect` miroir prop→state — comportement intentionnel (Tab autocomplete via `latestValueRef`), déjà documenté inline (lignes 33-36).

---

### Phase 4 — Tests (`frontend/docs/filter-tests-plan.md`)

Dette tracée dans le plan de tests Filter. Section 0-9 unit ✅, intégration ProductsPage scope complet ✅.

- [x] **Section 9 scope complet** — 3 tests intégration ProductsPage ajoutés (2026-05-04) :
  - filtre ingrédient async type → click → apply ;
  - chips count=0 disabled (clic ignoré, URL inchangée) ;
  - switch tab Cheveux ré-interroge filter-options avec `category=haircare`.
  - Dette préalable : fixtures `PRODUCT_TAGS` utilisaient `'anti-acne'/'pores-dilates'` (slugs supprimés par refacto skincare-tags ca462cd1) → remplacés par `'acne-imperfections'/'pores-sebum'`. 4 tests scope min cassés depuis 2026-05-02 maintenant verts.
- [ ] **Fails préexistants** orthogonaux à ce plan : Toggle, FilterDrawer resync, CollectionPage (4), `useProductTagFilterGroups` (override `barriere-cutanee-alteree` slug absent du shared), PurchaseFlow, ProductDetailSheet, Layout/Card. Suite globale au 2026-05-04 : **496/501 passing**, 5 fails (62 files, 2 fail).
- [ ] **FilterDrawer focus trap & focus initial** reportés en e2e (limites jsdom) — voir `frontend/docs/e2e.md`.

---

### Phase 5 — Seed haircare (backend isolé)

Pas de couplage frontend. Préalable à P6 auto-tagging propre sur haircare.

État au 2026-05-04 : **51/51 marques traitées ✅** + **Phase 5d push deltas done ✅**. **Prompt de reprise** : `~/log/aurore-phase5-resume-2026-05-04.md`.

- [x] **DB cleanup** orphan slugs (`shampoing`, `apres-shampoing`, `masque-cheveux`, `serum-cheveux`, `huile-cheveux`, `produit-coiffant`) — déjà absents de la DB (0 rows à la vérif). Probable cleanup lors d'un `db-reset` antérieur.
- [x] **Décision cinqSurCinq** (pediculicide) — option B appliquée : items 1+2 (kits environnement biocide) supprimés ; items 3-5 (appliqués cheveux) reclassés `primary: [POUX]`, `secondary: [TRAITEMENT_CUIR_CHEVELU, ...]`. Nouveau slug `HAIRCARE_PRODUCT_TAG_SLUGS.POUX = 'poux'` (concern) ajouté dans `shared/src/products/haircare/tag-slugs.ts:29` + label "Poux et lentes" + push dans `CONCERN[]` taxonomy.
- [x] **Enrichir tags haircare** ≥1 tag par axe pertinent (`hair_type` / `concern` / `routine_step` / `hair_effect` / `product_label`). **51/51 marques OK**.
  - **Convention tagging** : `primary` = product_type principal (1 slug), `secondary` = multi-axe. Exception anti-poux : `primary = [POUX]`, secondary inclut product_type.
  - **Convention reclassement** : si `primary` existant est faux (ex: SHAMPOOING sur un masque), corriger ; si `kind:` est faux, **reporter Phase 6** (on touche pas au champ kind).
  - **51 marques traitées** : argiletz, arkopharma, bailleul, beauterra, biocyte, biokap, biorene, cattier, caudalie, cinqSurCinq, clarification, coslys, cutByFred, dermaclay, drTheiss, ducray, essence, eyeCare, herbatint, item, jaldes, keranove, klorane, laRosee, lazartigue, ledNoreva, les3Chenes, lesSecretsDeLoly, lOrealProfessionnel, luxeol, melvita, mklGreenNature, natessance, neutraderm, neutrogena, nuxe, olaplex, petroleHahn, phyto, pouxit, pranarom, puressentiel, redken, reneFurterer, sanoflore, sebamed, sowe, stiefel, toppik, wellaProfessionals + 1 dernière (klorane par sous-gamme : Quinine/Antichute/Croissance, Avoine/Lin, Mangue/Pivoine/Figuier, Ortie/Galanga/Cédrat/Grenade/Menthe/Réparation, Bébé/Junior/Maman/Calendula, Cupuaçu/Bleuet/Monoï/Amande/Althéa).
  - **Skipped** : `florame` (pas de fichier seed haircare, juste bodycare), `VRAC` (juste 2 `.md`).
  - **Items flag** non sortis du seed mais taggés minimal (à reclasser/sortir Phase 6) : Essence calendrier avent (kit makeup), Pranarom Nigelle capsules (compléments), Klorane gels douche Cupuaçu (10 body), Klorane Bleuet (12 yeux/visage skincare), Klorane Monoï&Tamanu sun/after-sun corps (9), Klorane Amande dépilatoire/cire (5), Klorane Althéa déodorant, Klorane Bébé/Calendula body items (28 lingettes/eaux/crèmes change/lait toilette/etc.), Klorane Pivoine crème visage, Klorane Menthe stick visage.
- [x] **Phase 5d — Push deltas DB sans full reset** (option B retenue : refacto seed idempotent ≫ script ad-hoc) :
  - Approche : `seed-core` étendu avec mode idempotent (flag `shouldClean=false`, CLI `--no-clean`). Pré-fetch slugs/pairs existants en début de tx → pré-filtre les inputs avant insert. Évite unique-violations (donc abort tx) et savepoints concurrents (Drizzle race sous `Promise.allSettled` de `seedBatch`). Tag defs : `.onConflictDoNothing()` direct.
  - Fichiers : `backend/src/db/seed/runners/seed-core.ts` (`computeProductSlug`, pré-fetch 5 sets, filter par seedBatch), `backend/src/db/seed/runners/seed-blog.ts` (`idempotent` flag, swallow unique-violation via cause-chain walker), `Makefile` (`db-seed-merge`, `db-seed-merge-safe`).
  - Workflow : `make db-seed-merge-safe` → `db-backup` + seed `--no-clean` + `audit-db`.
  - Résultat 2026-05-04 : **+1470 productTags** insérés (poux concern + 8 routine_step + 12 product_label haircare propagés à 51 marques) ; ingrédients/produits/relations existants tous skippés ; user-state intact (1 user, 4 user_products, etc.) ; audit ✓.
  - DELETE complémentaire (hors merge) : 2 produits `cinq-sur-cinq-kit-*-environnement` retirés via SQL direct (cascade tag_products/product_ingredients).
  - **Non couvert** : DELETE des relations `tag_products` obsolètes (tag retiré du seed côté haircare). Impact faible — tag en trop = filtre légèrement bruyant, pas de bug fonctionnel. Si nécessaire plus tard : ajouter mode `--prune` à `seed-core` qui diff seed vs DB sur produits seed-créés (skip user-créés).
- [x] **Dette long-terme (séparée Phase 5)** — résolu par Phase 5d. `seed-core` est idempotent désormais : `db-seed-merge` (= `--no-clean`) ré-exécutable à volonté sans wipe ni drift. `db-seed` (clean mode) inchangé pour repart-de-zéro.

---

### Phase 6 — Data catalogue

Ordre interne : doublons résolus avant auto-tagging (sinon tags appliqués sur doublons). Images en parallèle.

- [ ] **Doublons produits** — cross-source clean. **Round 7 done 2026-05-04** : dental reliquat + ducray flacon-pompe — 10 drops (arthrodont/parodontax curés inherit image+inci ; 5 elmex slug-variants + lot-3x + bain-de-bouche 100ml ; gum paroex lot-3 ; hyalugel 100ml-50ml-offert ; ducray flacon-pompe-400ml). Audit 161 → **150 paires intra-source** (-11). DB DELETE 10/10 done + ts-verify ✅. Active products 479 → 469. **Round 6 done** : 2 haircare reliquat (lazartigue thicker, melvita 1L). **Round 5 done** : 9 klorane (slug curé courts, lots, volume canon.). **Round 4 done** : 19 lots/refills/volume-variants. **Reste backlog 150 paires majoritairement FP irréductibles** : dental ~83 (brossettes interdentaires inava/tepe/gum/crinex tailles+couleurs, elmex/fluocaril gencives variants), haircare ~67 (klorane 39 cupuaçu parfums + monoï SPF + shampoo/conditioner kind-diff, herbatint/petroleHahn/les3Chenes coloration shades, nuxe huile prodigieuse). Workflow + règles : `backend/src/db/seed/docs/DEDUP.md`. CDN cleanup Round 7 (8 orphans) à lancer : `delete-bunny-images.ts SLUGS_FILE=output/dedup-dropped-slugs.json`.
- [x] **Bug elmex skincare** (2026-05-04) — `elmex-protection-email-professional` était `kind: sunscreen` avec tags skincare/solaire (fichier `elmex-solaire.seed.ts` mal nommé). Fix : merged dans `elmex.seed.ts` avec `kind: 'toothpaste'` + tag `dentifrice`, fichier supprimé, DB updated.
- [x] **Auto-tagging** — fait 2026-04-23 via `scripts/auto-tag.ts`. 1017 produits seed traités : 875 primary+secondary remplis, 142 sans primary (manuel à finir). `avoid` auto sur retinol/retinal/salicylic/glycolic/BPO. Détail seed `ROADMAP.md §3.2`.
- [ ] **Images manquantes** — 603 produits sans `image_url` (couverture 2700/3303 = 82 %). 119 PNG Skinsafe en 403 (browser automation requis, liste `output/image-download-failures.json`). Sources : `the-ordinary` (35), résidus svr/avene/bioderma, marques jamais scrappées. Référence : `backend/src/db/seed/docs/IMAGES_AUDIT.md` + seed `ROADMAP.md §7.3`.

---

### Phase 7 — Décisions produit bloquées

Code bloqué tant que décision UX non prise.

- [ ] **Ordre accordéons drawer** — l'ordre actuel (essentiel → avancé) ne convient pas. Pas les tags, mais la séquence des accordéons. Décision produit avant code. Piloté par `order` dans `hooks/useProductsFilterGroups.ts` + `shared/` (`tag-filters.ts` par domaine). Voir `filter-drawer.md §1` + `shared/src/products/PLAN.md` Q2 (tier ⊥ visibility).
- [x] **Édition nom + slug par admin** — fait commit `c83237ff` (admin slug edit + fix silent slug regen on name change).

---

### Phase 8 — Dép externe `algo-derm`

Attendre intégration scoring INCI fourchettes côté lib.

- [ ] **Estimer % ingrédients clés INCI** — fourchette de concentration depuis position liste INCI (ordre décroissant réglementaire). Pistes :
  - Position = signal principal (avant/après eau, avant/après conservateurs <1 %).
  - Données réf connues (niacinamide souvent 2-10 %, conservateurs <1 %).
  - `algo-derm` scoring INCI déjà en place — voir si moteur peut exposer fourchettes (`idee/algo/dermo-signal-scoring-roadmap.md` §12.5).
  - Affichage : fourchette indicative (ex: "~4-8 %"), pas valeur exacte (trompeur sinon).
  - Stocker estimations ou calculer à la volée ? À décider selon coût.

---

## ✅ Terminé

| # | Chantier | Fichiers clés | Limitations / dette |
|---|----------|---------------|---------------------|
| 1 | Champs libres contraints (`unit`, `amountUnit`, `concentrationUnit`) | `shared/src/products/units.ts`, `ProductForm.tsx` (IngredientRow), `ProductForm.schema.ts` | — |
| 2 | Tags filtrés par catégorie (formulaires + validation backend) | `ProductForm.tsx:99-113`, `backend/product-tags/domain-validation.ts` (`assertTagsMatchProductDomain`) | `tagQueries.list()` charge tous les tags, filtrage client. Optimisation : passer `category` à la query. Seed contourne la validation API (direct service). |
| 3 | Glitch tab switch (`/products`) | `ProductsPage.tsx:146-153` (`startTransition`), `PageHeader.css:55-66` (slot fixed-width 8px) | INP mesuré 328ms, cible 200ms. `content-visibility: auto` sur les cards = levier non activé. |
| 4 | `AddToCollectionModal` — statuts possédés + étape date/prix | `AddToCollectionModal.tsx`, constante `OWNED_STATUSES` | Pas de colonne `in_stock` booléenne. Le stock = le statut (enum). Décision UX si orthogonalité nécessaire. |
| 5 | Dropdown flip (ingrédient / brand / drawer) | `component/Search/useFlipPlacement.ts` → `ComboboxPrimitive`, `AsyncSearchSelect`, `SearchSelect` | — |
| 6 | Scroll parasite drawer (brand / ingredient) | `scrollIntoView` supprimé de `SearchSelect.tsx` + `AsyncSearchSelect.tsx` | — |
| 7 | Filtres brand + ingredient transmis à l'API | `helpers.ts:53-61` (`buildProductsApiFilters`) | — |
| 8 | Limit search 8 → 20 + pagination infinie | `productQueries.search` → `infiniteQueryOptions`, sentinel `IntersectionObserver` dans `ComboboxPrimitive` | — |
| 9 | Header search multi-facettes (D1 ingrédient · D2 Enter · D3 `q` · D4 sections) | `SearchCombobox`, `ComboboxPrimitive`, `ProductsHeader`, `text-fold.ts` ; backend : param `q` list endpoint | Match alphabétique (pas de scoring). `q` couvre name+brand uniquement (pas les tags). Pas d'empty state spécifique mode `q`. |
| 10 | Flash dropdown au re-fetch | `SearchCombobox.tsx` : `placeholderData: prev`, spinner premier fetch seulement | — |
| 11 | Filter tests unit — Sections 0-8 + intégration scope min | `frontend/src/test/msw/`, `component/Filter/__tests__/`, `features/products/__tests__/` | Section 9 scope complet → Phase 4. Plan détaillé : `frontend/docs/filter-tests-plan.md`. |
| 12 | Cache invalidation foundation (ex-Phase 0) — `useUpdateProductTags` / `use{Add,Update,Remove}ProductIngredient` / `useDeleteProduct` invalident `bySlug` + `lists` (+ brands pour delete) | `lib/queries/products.ts` (mutations 217-367) | `slug` passé dans payload mutation pour permettre invalidation cible. |
| 13 | Memoize ProductsPage (ex-MEDIUM Phase 1) — `filters`, `apiFilters`, `avoidFor` tous `useMemo` ; `avoidFor` literal idem | `pages/ProductsPage/ProductsPage.tsx:71-77, 82-86, 108-123` | LOW `avoidFor literal` couvert par le même fix. |
| 14 | Phase 1 PR 1b — waterfalls Info/Edit + dermo prefetch | backend `service.ts` (`getProductFullBySlug` inclut `tags`), frontend `lib/queries/products.ts` (drop `productQueries.tags`), `ProductEditPage.tsx`, `ProductInfoTab.tsx`, `routes/products/$slug.tsx` (loader parallèle bySlug+dermo, `.catch(() => null)` sur dermo), `routes/products/index.tsx` (loader prefetchQuery dermo si auth) | Sheet collection sur-fetch tags (~few hundred bytes) — marginal. Dermo failure ne casse pas la page produit (catch). |
| 15 | Phase 1 PR 1a — `staleTime` ternary collapse + `react-markdown` lazy | `pages/ProductsPage/ProductsPage.tsx:127`, `pages/ProductInfoTab/ProductInfoTab.tsx:5,99` (`lazy()` + `<Suspense fallback={<p>{description}</p>}>`) | ~50 KB gzip déférré. Fallback raw text pendant chargement chunk. |
| 16 | Phase 1 LOW pass — narrow `useRouterState`, drop type cast, fuse `useEffect` mirrors, dédupe filter loop | `ProductLayout.tsx:46` (`select: s => s.location.pathname.includes('/discussions')`), `ProductsPage.tsx:47` (drop `as Record`), `PriceRangeFilter.tsx:33-37` (1 effect au lieu de 2), `lib/queries/products.ts:53-56` (`for FILTER_KEYS` au lieu de TAG_FILTER_KEYS + 3 lignes manuelles) | 4 entries triagées out — voir section Phase 1. |
| 17 | Phase 2 — ProductForm batch | `ProductForm.tsx` (amountUnit ChipGroup → `<select>` natif + `__select` CSS ; readonly image URL input sous ImageUpload ; row-scope `removing` via `removeIngredient.variables.ingredientId`), `lib/queries/products.ts` (`checkDuplicate` cache key normalisé lowercase+trim ; `useRemoveProductIngredient` optimistic `onMutate`/rollback/onSettled), `AddToCollectionModal.tsx` (`useState(() => today)` au lieu de body-level `new Date()`). HIGH `key={product.id}` déjà appliqué (`ProductEditPage.tsx:46`). | Backend `findSimilarProducts` est case-insensitive (`lower()`) → safe d'envoyer lowercase. |
| 18 | Phase 3 — SearchCombobox bugs | `ComboboxPrimitive.tsx` (sections rendues avant items, index keyboard inversé : sections 0..N puis items N..total) + CSS divider via `.section + .option`, `SearchCombobox.tsx` (prop `onSubmitQuery` ; Enter sans highlight → `onSubmitQuery(debouncedQuery)` au lieu de premier item première section), `ProductsHeader.tsx` (`onSubmitQuery` → `navigate(/products?q=trimmed&page=1)`). Tests MAJ : `SearchCombobox.test.tsx` (nouveau test `onSubmitQuery` + retrait premier-section ; ordre keyboard inversé), `ProductsHeader.test.tsx` (Enter applique `q` même quand facette match ; ArrowDown+Enter → ingredient). | Section "Marques" toujours visible : sections en haut. Enter contract clair : highlight = sélection (item ou section), pas de highlight = `q` fallback. Fallback section "Recherche" gardée pour click discoverability. |
| 19 | Phase 3 — densité dropdown header search | `ProductsHeader.tsx` (`FACET_SECTION_LIMIT: 3 → 2`), `useFlipPlacement.ts` (`MAX_HEIGHT: min(0.5vh, 400) → min(0.6vh, 520)`), `SearchCombobox.css` (`label`/`sublabel` truncate single-line ellipsis), `ComboboxPrimitive.css` (sections : drop margin/padding extra, divider `section + option` minimal, `__option` dans section padding compact, `__section-label` padding réduit). Tests MAJ : cap 3 → 2. | Avant : 1 produit visible (sections 287px / 400px, 1er item 84px à cause du wrap label + divider). Après : 4-6 produits visibles (sections 245px / 520px, items 58px stables). |

---

## 📝 Notes — Loading & data flow `/products`

Documenté pour référence. Pas de chantier actif, juste l'état actuel.

### Flow page `/products` (mount)

1. **Loader route** (`routes/products/index.tsx`) — run avant render :
   - `productQueries.list(filtersFromUrl)` → page paginée selon `?page=1&...` (24/page)
   - Si auth : `dermo` prefetch parallèle (`.catch(()=>null)`, fail silencieux)
2. **`ProductsPage` mount** :
   - `useQuery(productQueries.list(...))` → cache hit (loader)
3. **`ProductsHeader` mount** (toujours, pas conditionnel) :
   - `useQuery(productQueries.brands())` → **fetch ALL marques** (one-shot, ~quelques KB)
   - `useQuery(ingredientQueries.options())` → **fetch ALL ingrédients** (one-shot, id/slug/name)
4. **`FilterDrawer` mount** (lazy si ouvert, voir Terminé #2) :
   - `tagQueries.list()` → **fetch ALL tags**, filtrage client par catégorie

→ **4 fetch initiaux** : `products?filters` (24) + `brands` (full) + `ingredients/options` (full) + `dermo` (auth only).

### SearchCombobox header (live typing)

- **Hook** : `useInfiniteQuery({ ...productQueries.search(debouncedQuery), enabled: q.length ≥ 2, placeholderData: prev })`
- **Debounce** : 300ms
- **1er fetch** : spinner "Chargement..." (`isFetching && !isFetchingNextPage && !isPlaceholderData`)
- **Re-fetch** ("vit" → "vita") : pas de flash, anciens results visibles, pas de spinner (cf Terminé #10)
- **Infinite scroll** : sentinel `IntersectionObserver` au bas de la liste → `fetchNextPage()` + indicator "Chargement..." inline
- **Sections** (ingredients/brands/fallback) : pas de fetch live, filtrage client via `foldText()` sur les listes complètes déjà chargées
- **Cache RQ** : clé `[productKeys.lists, 'search', q]`, persiste entre frappes

### Trade-offs

- **Brands + ingredients full lists** : payload initial gonflé, mais matching dropdown instant sans round-trip serveur par caractère. Acceptable tant que listes < ~quelques milliers d'items.
- **Tags full list** : idem, optim future = passer `category` à la query (Terminé #2 limitation).
- **`placeholderData: prev`** : pattern clé pour éviter le flash. Tradeoff = stale data brièvement visible jusqu'au resolve nouveau fetch.

### Cache invalidation (mutations produit)

Toutes les mutations (`useUpdateProductTags`, `use{Add,Update,Remove}ProductIngredient`, `useDeleteProduct`) invalident `productKeys.bySlug(slug)` + `productKeys.lists` (+ `brands` pour delete). Voir Terminé #12.

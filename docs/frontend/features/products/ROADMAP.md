# Roadmap — Products

## 📚 Références

| Doc | Rôle | Quand consulter |
|---|---|---|
| `docs/shared/products/STATE.md` | Source de vérité domaine products (schéma DB, taxonomie, validation Zod, routes, service, UI state, flow cross-layer) | Avant toute modif touchant un layer products |
| `docs/shared/products/PLAN.md` | Refacto taxonomy skincare (clusters, aliases, tier ⊥ visibility, search expansion) | Avant toucher search aliases, ordre drawer, auto-tagging |
| `docs/frontend/filter-tests-plan.md` | Plan de tests Filter (drawer + search + hooks), MSW v2, état dette | Avant modif `component/Filter/*` ou tests intégration ProductsPage |
| `backend/src/db/seed/docs/DEDUP.md` + `audit-imported-products.ts` | Audit doublons produits | Avant Phase 6 doublons |
| `backend/src/db/seed/docs/IMAGES_AUDIT.md` | Audit images manquantes BunnyCDN | Avant Phase 6 images |
| `docs/algo/dermo-signal-scoring-roadmap.md` §12.5 | Intégration `algo-derm` × Aurore | Avant Phase 8 concentrations INCI |

---

## 🏗️ Architecture

| Fichier / dossier | Rôle |
|---|---|
| `pages/ProductsPage/` | Orchestration liste + filtres + pagination |
| `pages/ProductLayout/` | Wrapper détail (tabs) |
| `pages/ProductInfoTab/` | Fiche produit : ingrédients, tags, purchase log |
| `pages/ProductCreatePage/` | Wrapper form création |
| `pages/ProductEditPage/` | Wrapper form édition |
| `comparison/pages/ComparisonsListPage/` | Liste des comparaisons sauvegardées de l'utilisateur |
| `comparison/pages/ComparisonBuilderPage/` | Page de construction (picker N produits → résultat live) |
| `comparison/components/ComparisonHeader/` | Header builder (titre, save, share) |
| `comparison/components/ComparisonBody/` | Compose `MetaStrip` + `DiffSection` + `SignalsSection` + `CommonIngredientsSection` |
| `comparison/components/MetaStrip/` | Bandeau métadonnées (prix/unité, alertes prix non comparable mixed-unit) |
| `comparison/components/DiffSection/` | Diff colonne par produit (tags, ingrédients spécifiques) |
| `comparison/components/SignalsSection/` | Actifs partagés ✦, alertes ⚠ avec count `(N/total)`, conflits ⊗ |
| `comparison/components/CommonIngredientsSection/` | Ingrédients communs (collapsible via `ExpandableSection`) |
| `comparison/components/PerProductSpecificsSection/` | Ingrédients spécifiques à un seul produit |
| `comparison/components/ProductPicker/` | Combobox async ajout produit au comparatif |
| `comparison/components/EmptyComparisonState/` | Empty state quand picker sous le minimum |
| `comparison/helpers/aggregations.ts` | `computeSharedActives` / `computeAlerts` / `computeConflicts` |
| `components/ProductCard/` | Card (slug, brand, price, tags, view transitions) |
| `components/ProductImage/` | Affichage image produit (fallback, lazy) |
| `components/ProductForm/` | Form création/édition. Sous-dossiers `components/`, `helpers/` ; `DoseField`, `ProductImageField`, `SlugEditModal` |
| `components/ProductsHeader/` | Search + sort + filter button + create |
| `components/ProductsActiveBar/` | Chips filtres actifs + remove |
| `components/ProductsFilterDrawerContent/` | Wrapper composition du drawer |
| `components/CollapsibleFiltersStrip/` | Strip filtres collapsible (header sticky) |
| `components/AddToCollectionModal/` | Modal ajout à la collection user |
| `components/SortControl/` | Dropdown tri (relevance, price, newest, random) |
| `components/BrandCombobox/` | Combobox brand async |
| `components/IngredientSearch/` | Single-add ingrédient (dans le form, ≠ `AsyncSearchSelect`) |
| `components/PriceRangeFilter/` + `PriceFilterAccordion/` | Slider prix + wrapper `<details>` |
| `components/skeletons/` | Skeletons loading (`ProductLayoutSkeleton`) |
| `hooks/useProductsFilterGroups.ts` | Dérive la structure des groupes de filtres depuis le domaine |
| `hooks/useProductsExtraChips.ts` | Construit les chips actifs (prix, profil, q) |
| `hooks/useProductFormSubmit.ts` | Submit + validation form produit |
| `filters.ts` | Schéma Zod de l'URL search params |
| `helpers.ts` | `buildProductsApiFilters()` + helpers domaine |

---

## 🚧 Actif

---

### Phase 6 — Data catalogue

Ordre interne : doublons résolus avant auto-tagging (sinon tags appliqués sur doublons). Images en parallèle.

- [ ] **Doublons produits** — backlog 150 paires (état 2026-05-04, après Round 7) : ~83 dental (brossettes interdentaires multi-tailles/couleurs, elmex/fluocaril variants), ~67 haircare (klorane cupuaçu parfums + monoï SPF + shampoo/conditioner kind-diff, herbatint/petroleHahn/les3Chenes coloration shades, nuxe huile prodigieuse). Majoritairement FP irréductibles. Workflow + règles : `backend/src/db/seed/docs/DEDUP.md`. Historique Round 4-7 → Terminé #24. CDN cleanup Round 7 (8 orphans) en attente : `delete-bunny-images.ts SLUGS_FILE=output/dedup-dropped-slugs.json`.
- [ ] **Images manquantes** — 211/3137 = 93.3 % couverture (2026-05-05, après LRP via illicopharma). Reste : Bioderma 31, L'Occitane 16, Avène 16, Nutripure 16, LdB 10, Uriage 9, Weleda 8 + long-tail. Référence : `backend/src/db/seed/docs/IMAGES_AUDIT.md` (audit 2026-05-03 stale).
  - **Pipelines branchés** (2026-05-05) :
    - `fetch-images-deciem.ts` (Salesforce CC) — The Ordinary 33/34 (manquant : retinol 0.2% emulsion absent catalogue live).
    - `fetch-images-shopify.ts` + `data/image-fetchers/<brand>.ts` (handle→slug map, Wayback og:image fallback) — Theramid 27/29, DermEden 22/22, Geek & Gorgeous 19/19, Nooance 15/16, Colibri 7/7, Dr. Idriss 7/7, numbuzin 3/3 (`us.numbuzin.com`), Cos De BAHA 1/3, SVR 27/27 (`fr.svr.com`).
    - `fetch-images-loreal-mbf.ts` (Next.js + Sitecore, regex `product-summary__current-img__img` + `_next/image?url=`) — Mixa 7/7.
    - `fetch-images-illicopharma.ts` (fallback pharma reseller via og:image) — La Roche-Posay 7/7. Utile quand site marque bot-protégé (Cloudflare).

---

### Phase 8 — Dép externe `algo-derm`

Attendre intégration scoring INCI fourchettes côté lib.

- [ ] **Estimer % ingrédients clés INCI** — fourchette de concentration depuis position liste INCI (ordre décroissant réglementaire). Pistes :
  - Position = signal principal (avant/après eau, avant/après conservateurs <1 %).
  - Données réf connues (niacinamide souvent 2-10 %, conservateurs <1 %).
  - `algo-derm` scoring INCI déjà en place — voir si moteur peut exposer fourchettes (`docs/algo/dermo-signal-scoring-roadmap.md` §12.5).
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
| 11 | Filter tests unit — Sections 0-8 + intégration scope min | `frontend/src/test/msw/`, `component/Filter/__tests__/`, `features/products/__tests__/` | Section 9 scope complet → Phase 4. Plan détaillé : `docs/frontend/filter-tests-plan.md`. |
| 12 | Cache invalidation foundation (ex-Phase 0) — `useUpdateProductTags` / `use{Add,Update,Remove}ProductIngredient` / `useDeleteProduct` invalident `bySlug` + `lists` (+ brands pour delete) | `lib/queries/products.ts` (mutations 217-367) | `slug` passé dans payload mutation pour permettre invalidation cible. |
| 13 | Memoize ProductsPage (ex-MEDIUM Phase 1) — `filters`, `apiFilters`, `avoidFor` tous `useMemo` ; `avoidFor` literal idem | `pages/ProductsPage/ProductsPage.tsx:71-77, 82-86, 108-123` | LOW `avoidFor literal` couvert par le même fix. |
| 14 | Phase 1 PR 1b — waterfalls Info/Edit + dermo prefetch | backend `service.ts` (`getProductFullBySlug` inclut `tags`), frontend `lib/queries/products.ts` (drop `productQueries.tags`), `ProductEditPage.tsx`, `ProductInfoTab.tsx`, `routes/products/$slug.tsx` (loader parallèle bySlug+dermo, `.catch(() => null)` sur dermo), `routes/products/index.tsx` (loader prefetchQuery dermo si auth) | Sheet collection sur-fetch tags (~few hundred bytes) — marginal. Dermo failure ne casse pas la page produit (catch). |
| 15 | Phase 1 PR 1a — `staleTime` ternary collapse + `react-markdown` lazy | `pages/ProductsPage/ProductsPage.tsx:127`, `pages/ProductInfoTab/ProductInfoTab.tsx:5,99` (`lazy()` + `<Suspense fallback={<p>{description}</p>}>`) | ~50 KB gzip déférré. Fallback raw text pendant chargement chunk. |
| 16 | Phase 1 LOW pass — narrow `useRouterState`, drop type cast, fuse `useEffect` mirrors, dédupe filter loop | `ProductLayout.tsx:46` (`select: s => s.location.pathname.includes('/discussions')`), `ProductsPage.tsx:47` (drop `as Record`), `PriceRangeFilter.tsx:33-37` (1 effect au lieu de 2), `lib/queries/products.ts:53-56` (`for FILTER_KEYS` au lieu de TAG_FILTER_KEYS + 3 lignes manuelles) | 4 entries triagées out — voir section Phase 1. |
| 17 | Phase 2 — ProductForm batch | `ProductForm.tsx` (amountUnit ChipGroup → `<select>` natif + `__select` CSS ; readonly image URL input sous ImageUpload ; row-scope `removing` via `removeIngredient.variables.ingredientId`), `lib/queries/products.ts` (`checkDuplicate` cache key normalisé lowercase+trim ; `useRemoveProductIngredient` optimistic `onMutate`/rollback/onSettled), `AddToCollectionModal.tsx` (`useState(() => today)` au lieu de body-level `new Date()`). HIGH `key={product.id}` déjà appliqué (`ProductEditPage.tsx:46`). | Backend `findSimilarProducts` est case-insensitive (`lower()`) → safe d'envoyer lowercase. |
| 18 | Phase 3 — SearchCombobox bugs | `ComboboxPrimitive.tsx` (sections rendues avant items, index keyboard inversé : sections 0..N puis items N..total) + CSS divider via `.section + .option`, `SearchCombobox.tsx` (prop `onSubmitQuery` ; Enter sans highlight → `onSubmitQuery(debouncedQuery)` au lieu de premier item première section), `ProductsHeader.tsx` (`onSubmitQuery` → `navigate(/products?q=trimmed&page=1)`). Tests MAJ : `SearchCombobox.test.tsx` (nouveau test `onSubmitQuery` + retrait premier-section ; ordre keyboard inversé), `ProductsHeader.test.tsx` (Enter applique `q` même quand facette match ; ArrowDown+Enter → ingredient). | Section "Marques" toujours visible : sections en haut. Enter contract clair : highlight = sélection (item ou section), pas de highlight = `q` fallback. Fallback section "Recherche" gardée pour click discoverability. |
| 19 | Phase 3 — densité dropdown header search | `ProductsHeader.tsx` (`FACET_SECTION_LIMIT: 3 → 2`), `useFlipPlacement.ts` (`MAX_HEIGHT: min(0.5vh, 400) → min(0.6vh, 520)`), `SearchCombobox.css` (`label`/`sublabel` truncate single-line ellipsis), `ComboboxPrimitive.css` (sections : drop margin/padding extra, divider `section + option` minimal, `__option` dans section padding compact, `__section-label` padding réduit). Tests MAJ : cap 3 → 2. | Avant : 1 produit visible (sections 287px / 400px, 1er item 84px à cause du wrap label + divider). Après : 4-6 produits visibles (sections 245px / 520px, items 58px stables). |
| 20 | Audit composants réutilisables — items 1-5 (cf `audit-composants.md`) | `ProductsPage.tsx` + `.css` (split button-in-button), `AddToCollectionModal.tsx` + `.css` (close → `<Button ghost>`, status grid → `<Button primary/outline>`), `ProductForm.tsx` + `.css` (remove ingredient → `<Button ghost>`), `ProductPicker.tsx` (119 → 46 lignes, délègue à `<AsyncSearchSelect>`), `lib/queries/products.ts` (`searchFlat` + `byIds` factories), `shared/src/products/schemas.ts` + `index.ts` (`productsByIdsQuery`), backend `routes.ts` + `service.ts` (`GET /products/by-ids`, route avant `/:slug`), tests `products.routes.test.ts` (+4) | Pas de régression : 251 frontend tests + 85 backend tests pass. |
| 21 | `<ExpandableSection>` extrait (audit composants item 6) | `component/Layout/ExpandableSection/ExpandableSection.tsx` (controlled `open`+`onToggle` ou uncontrolled `defaultOpen`), refacto `comparison/components/CommonIngredientsSection.tsx` + `PerProductSpecificsSection.tsx` | `CollapsibleFiltersStrip` (ProductsPage) exclu : 2 boutons header + body always-mounted avec `aria-hidden` ferait gonfler la primitive. `<AccordionShell>` partagé `FilterAccordion`/`PriceFilterAccordion` décliné (4+ knobs + ref forwarding pour ~12 lignes). `<RemovableChip>` pattern (`chip chip--sm chip--active chip--removable` dans `AsyncSearchSelect.tsx:186` + `SearchSelect.tsx:147`) gardé inline — 2 sites internes Filter, extraire si 3e apparaît. 524/524 tests pass. |
| 22 | Phase 4 — Filter tests (Section 9 + fails préexistants + couverture étendue + focus trap) | `frontend/src/test/msw/`, `component/Filter/__tests__/`, `features/products/__tests__/`, `frontend/e2e/filter-drawer-focus.spec.ts` | Section 9 intégration ProductsPage scope complet (3 tests : ingrédient async, count=0 disabled, switch tab haircare). Fails préexistants 501→524 résolus (slugs skincare-tags refacto `barriere-cutanee`/`acne-imperfections`, `role='tab'` vs `'button'`, aria-label criteria). +23 tests a11y/clavier (FilterDrawer `aria-modal`/`aria-labelledby`/arrows ↑↓, FilterAccordion `aria-controls`/`aria-pressed`, SearchSelect clamp+focus retour, ActiveFiltersBar Enter/Espace). Focus trap natif `<dialog>` réparé via `handleTabTrap` (bug Chromium `showModal()` ne cycle pas Tab/Shift+Tab aux bornes). 524/524 pass. |
| 23 | Phase 5 — Seed haircare 51/51 + push deltas idempotent | `shared/src/products/haircare/tag-slugs.ts` (slug `POUX`), `backend/src/db/seed/runners/{seed-core,seed-blog}.ts` (`shouldClean=false`, pré-fetch slugs/pairs, swallow unique-violation cause-chain), `Makefile` (`db-seed-merge`, `db-seed-merge-safe`) | 51/51 marques tagguées ≥1 tag par axe (`hair_type`/`concern`/`routine_step`/`hair_effect`/`product_label`). Conventions : `primary` = product_type principal (1 slug), `secondary` = multi-axe ; exception anti-poux : `primary=[POUX]`. Décision cinqSurCinq option B (kits environnement drop, items cheveux reclassés POUX). `seed-core` mode idempotent → +1470 productTags insérés sans wipe, user-state intact. Skipped : florame (bodycare only), VRAC. Reste dette : pas de `--prune` mode (tags obsolètes non delete, impact faible) ; items à reclasser/sortir en P6 (Klorane Bébé/Calendula body, Cupuaçu gels douche, Bleuet skincare, Pivoine/Menthe visage…). |
| 24 | Phase 6 — Doublons Round 4-7 + auto-tag + bug elmex skincare | `backend/src/db/seed/docs/DEDUP.md`, `scripts/auto-tag.ts`, `elmex.seed.ts` (mergé `elmex-solaire.seed.ts` supprimé) | Round 4-7 (40 drops total) : R4 19 lots/refills/volume-variants ; R5 9 klorane (slugs courts, lots, volume canonique) ; R6 2 haircare reliquat (lazartigue thicker, melvita 1L) ; R7 10 dental + ducray flacon-pompe (arthrodont/parodontax inherit image+inci, 5 elmex slug-variants + lot-3x + bain-de-bouche 100ml, gum paroex lot-3, hyalugel 100ml-50ml-offert). Audit 161 → 150 paires intra-source. Active products 519 → 469. Auto-tag 2026-04-23 : 1017 produits, 875 primary+secondary, 142 sans primary (manuel pending), `avoid` auto sur retinol/retinal/salicylic/glycolic/BPO. Bug elmex : `elmex-protection-email-professional` mal classé `kind: sunscreen` + tags skincare (fichier `elmex-solaire.seed.ts` mal nommé) → fix `kind: 'toothpaste'` + tag `dentifrice`. |
| 25 | Phase 7 — Décisions UX drawer (skincare) | `shared/src/products/skincare/tag-filters.ts`, `FilterDrawer.tsx`, commit `c83237ff` | Ordre accordéons skincare : essentials Zone→Problème→Actions/Effets→Peau→Type de produit→Forme/Galénique→Ingrédients (appended) ; advanced Étape routine→Moment→Sensation→Caractéristiques→Brand (appended)→Prix (`advancedExtras` slot). Profile toggle : status quo (flottant tête drawer, control binaire ≠ accordéon). `product_type` vs `routine_step` skincare : libellés explicites `Type de produit` / `Étape routine`, pas de fusion (taxonomy lourde). Reset/Apply modèle A : drawer = brouillon, Apply commit, Reset clear draft + URL non-draft (price/profile/q via `onReset`), X/Échap/backdrop drop draft (no commit). Édition admin nom + slug (fix silent slug regen on name change). Side-effect : Prix migré `essentialExtras` → `advancedExtras`. |

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

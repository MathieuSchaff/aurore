# ProductsPage Audit — 2026-04-26

Cross-referenced against Vercel React Best Practices (8 categories, 70 rules).
Scope : `frontend/src/features/products/**` + immediate dependencies (`useListFilters`, `useFormTags`, `useProductTagFilterGroups`, `lib/queries/products.ts`, `lib/queries/tags.ts`, `Filter/*`, `Search/*`, `PageHeader`).

---

## Status — 2026-04-26 (end of session)

**Done** (root `ROADMAP.md` is the source of truth):
- Phase 1 entirely (Bug 7, mutation cache hygiene, Bug 6).
- Phase 2 — Bug 3 (startTransition + loader slot), Bug 2 (form tags filtered by category), Bug 1a/1b (`unit` enum, `PRODUCT_AMOUNT_UNITS` + ChipGroup), **Bug 1c** (`concentrationUnit` shared constant + inline edit UI — `IngredientRow` in `ProductForm`, `useUpdateProductIngredient` PATCH on blur).
- Phase 3 entirely — `useFlipPlacement` extracted (`frontend/src/component/Search/useFlipPlacement.ts`), `ProductsPage` split + folder cleanup, `ProductForm` form-state sync via `key` reset.

**Stale line/file refs in this audit (Phase 3 fallout)** — re-grep before fixing:
- `ProductsPage.tsx:396-491` (card render) → `features/products/components/ProductCard/ProductCard.tsx`.
- `ProductsPage.tsx:185-229` (filterGroups memo) → `features/products/hooks/useProductsFilterGroups.ts`.
- `ProductsPage.tsx:249-281` (extraChips builder) → `features/products/hooks/useProductsExtraChips.ts`.
- Header actions (search + sort + filter btn + create) → `features/products/components/ProductsHeader/ProductsHeader.tsx`.
- ActiveFiltersBar wrapper → `features/products/components/ProductsActiveBar/ProductsActiveBar.tsx`.
- FilterDrawer + profile toggle + price range → `features/products/components/ProductsFilterDrawerContent/ProductsFilterDrawerContent.tsx`.
- Card CSS rules (`.list-card--product …`) extracted from `ProductsPage.css` → `ProductCard.css`. `ProductsPage.css` now only owns `.products-page__tabs` + responsive media query.
- `ProductsPage.tsx` is ~255 lines (orchestration only). Issues described in audit MEDIUM rows 102-103 (component-split + memoize `filters`/`apiFilters`) — split is done; memoization (Phase 5) still pending.
- Mutation cache hygiene rows (CRITICAL, lines 95-97) — fixed (`useUpdateProductTags`, `useAddProductIngredient`, `useRemoveProductIngredient`, `useDeleteProduct`).
- HIGH row 101 (`ProductForm` form-state sync) — fixed via `key` reset.
- Bug 5 partial diagnosis (line 47) — confirmed and fixed via `useFlipPlacement` extraction.

**Pre-existing test baseline** — 19 failing tests (Toggle, FilterDrawer resync, CollectionPage, PurchaseFlow, ProductDetailSheet, a few Layout/Card). All pre-date this audit; none block products work. Skip unless explicitly asked.

**Build note** — after edits to `shared/src/`: `bun run --filter '@habit-tracker/shared' build` then `bunx tsc -b` (or `cd frontend && bunx tsc --noEmit`).

---

## Known bugs (from ROADMAP.md) — root cause analysis

### Bug 1 — `concentrationUnit` and `unit` (form free-text fields) — **✅ FIXED 2026-04-26**
- **Originally** : `unit` schema accepted `string`, `amountUnit` was free input, `concentrationUnit` had no UI + enum duplicated backend↔shared.
- **1a — `unit`** : `productEditFormSchema.unit` now validates via `.refine(v => PRODUCT_UNIT_VALUES.includes(v))` (`ProductForm.schema.ts:20-26`). Cast `as ProductUnit` retained because `refine` does not narrow.
- **1b — `amountUnit`** : closed enum `PRODUCT_AMOUNT_UNIT_VALUES` + per-category map `PRODUCT_AMOUNT_UNITS` in `shared/src/products/units.ts`. Form uses `ChipGroup` (`ProductForm.tsx:359-368`).
- **1c — `concentrationUnit`** : shared constant `PRODUCT_CONCENTRATION_UNIT_VALUES` + `ProductConcentrationUnit` type + `PRODUCT_CONCENTRATION_UNIT_LABELS` (FR : `%`, `UI`, `mg`, `µg`, `mg/mL`) in `shared/src/products/units.ts`. Backend route enum dedup'd. Inline edit UI : `IngredientRow` component in `ProductForm.tsx` (per-row `<Input number>` + `<ChipGroup>`). Persistence : `addIngredient` for create-mode (submit-time), `useUpdateProductIngredient` (PATCH) on blur/unit-change for edit-mode.

### Bug 2 — Tags not filtered by category in product forms
- **File** : `components/ProductForm/ProductForm.tsx:82` (`useQuery(tagQueries.list())`), `lib/queries/tags.ts:12-26` (the `category` parameter exists but is never passed by `ProductForm`).
- **Root cause** : `tagQueries.list()` is called with no category, so the dropdown receives the full union of all tags across domains. `getProductTagsByCategory(domain, cat)` (shared) is wired only into `useProductTagFilterGroups` (filters drawer), never into `useFormTags` / `TagManager`.
- **Diagnosis match** : yes.
- **Fix** : pass `form.category` (and ideally the relevant `tagType`s for that domain) to `tagQueries.list()`. Best : derive `availableTags` from `getProductTagsByCategory(form.category)` directly so the form uses the same source of truth as the filters. When `category` toggles, drop tags whose `tagType` is no longer valid (mirrors the existing `kind`/`unit` reset behavior in `ProductForm.tsx:260`).

### Bug 3 — Tab switch glitch on `/products`
- **Files** : `pages/ProductsPage/ProductsPage.tsx:177-181` (`useQuery({ ... placeholderData: (prev) => prev })`), `pages/ProductsPage/ProductsPage.tsx:295` (`isLoading={isPlaceholderData}`), `component/Layout/PageHeader/PageHeader.tsx:27-32` (loader span mounts when `isLoading`), `pages/ProductsPage/ProductsPage.tsx:283-288` (`handleDomainChange` → synchronous `navigate`).
- **Root cause** : two compounding effects on tab click :
  1. `placeholderData: (prev) => prev` keeps the cards on screen while React simultaneously updates 18+ DOM nodes (kind class, unit class, brand, price, icon, link target). React’s `setValueForKnownAttribute` on every existing card forces a synchronous reflow (133ms measured).
  2. `isPlaceholderData` flips to `true`, mounting `<span class="page-header__loader" />`. In the desktop `flex-direction: row` layout (`PageHeader.css:82`) the dot lands visually to the left of the search input → "something appears to the left of the input".
- **Diagnosis match** : yes — confirmed (forced reflow + loader mount).
- **Fix** :
  - Wrap `handleDomainChange` and the consequent state writes in `startTransition(() => navigate(...))` so the tab change is marked non-urgent and React can keep painting the prior DOM until the new query resolves (`rerender-transitions`, `rendering-usetransition-loading`).
  - Or render the loader in a fixed-width slot (`min-width: 8px; visibility: hidden` toggled to `visible`) so its mount/unmount doesn’t shift layout.
  - Optionally `content-visibility: auto` on `.list-card--product` (`rendering-content-visibility`) to skip offscreen card layouts.

### Bug 4 — `AddToCollectionModal` lacks orthogonal `in_stock` flag
- **File** : `components/AddToCollectionModal/AddToCollectionModal.tsx:29-35` (5 statuses, `in_stock` mutually exclusive with `wishlist | watched | holy_grail | avoided`).
- **Root cause** : DB schema models stock as a value of `user_products.status`. There is no `in_stock` boolean column. The Zod schema for `useCreateUserProduct` already accepts `sentiment`, `wouldRepurchase`, `comment` — none surfaced in the UI.
- **Diagnosis match** : yes.
- **Fix** : product/UX decision needed first (does an "Évité" product still need to expose an in-stock flag ?). Two paths :
  1. Keep statuses orthogonal — add `in_stock boolean` column + migration + enable in the modal as a second-step toggle on every status.
  2. Status stays the truth — add a sub-step "When did you start using it ?" only for `holy_grail` / `watched` (purchase log already exists for `in_stock`).

### Bug 5 — Ingredient search dropdown (form) does not flip
- **Files** : `components/IngredientSearch/IngredientSearch.tsx:28-69` (uses `ComboboxPrimitive`), `component/Search/ComboboxPrimitive.tsx:99-133` (no `getBoundingClientRect` / flip — just `position: absolute; top: calc(100% + 4px)` per `ComboboxPrimitive.css`). The full flip implementation lives in `component/Filter/AsyncSearchSelect/AsyncSearchSelect.tsx:161-203` and `component/Filter/SearchSelect/SearchSelect.tsx:123-169`.
- **Root cause** : the form uses `ComboboxPrimitive` (lighter inline-positioned dropdown). `ComboboxPrimitive` has no flip logic, so when the trigger sits near the bottom of the viewport (the ingredients section is at the bottom of the form) the dropdown is clipped. `AsyncSearchSelect` already implements `position: fixed` + space-measurement + flip-above, so its dropdown is fine — the form just doesn’t use it.
- **Diagnosis match** : partial. ROADMAP bug 5’s opening sentence says the edit form "utilise un composant `AsyncSearchSelect`" — that is incorrect. The edit form uses `<IngredientSearch>` which wraps `ComboboxPrimitive`. The audit-2026-04-26 paragraph at the bottom of the bug silently corrects the diagnosis ("C'est ce code qu'il faut porter sur `ComboboxPrimitive`") and the fix path stays valid.

  **Why two ingredient components exist (do not collapse them blindly)** :
  - `AsyncSearchSelect` (drawer) is a *multi-select* : `selected: string[]` + `onToggle(value)` (toggle = add or remove). Maintains its own chips and resolves slugs → labels via `resolveValuesQuery` for deep-linked URLs.
  - `IngredientSearch` (form) is a *single-add-into-external-list* : `onAdd(id, name)` — the parent (`ProductForm`) keeps the list above the search and renders per-row remove buttons + relevance + per-row mutation pending state. It also filters `existingIds` out of the result list (no toggle-removal semantics — the trash button is the remove action).
  - The two APIs are intentionally different ; merging them into one component would force the form to adopt chip-based multi-select UX it does not want.
- **Fix** : extract the flip logic from `AsyncSearchSelect` into a reusable `useFlipPlacement(triggerRef, dropdownRef, isOpen)` hook (or a `<Popover>` primitive) and consume it from `ComboboxPrimitive` (which would automatically fix `IngredientSearch` and `BrandCombobox` at the same time — both wrap `ComboboxPrimitive`). `AsyncSearchSelect` and `SearchSelect` then refactor to consume the same hook, eliminating the duplicated logic.

### Bug 6 — Brand + Ingredient drawer dropdowns trigger page scroll
- **Files** : `component/Filter/SearchSelect/SearchSelect.tsx:114-118`, `component/Filter/AsyncSearchSelect/AsyncSearchSelect.tsx:150-154`.
  ```ts
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }, [isOpen])
  ```
- **Root cause** : `Element.scrollIntoView` walks every scrollable ancestor — including `window`. The drawer is `position: fixed`, so the window scroll behind it is visible. Also, the dropdown (`position: fixed`) reads coordinates from `getBoundingClientRect` *before* the smooth scroll completes, landing it offscreen. Both dropdowns share the same defect.
- **Diagnosis match** : yes.
- **Fix** : drop the `scrollIntoView` effect entirely — the fixed dropdown does not need the input to be at the top of the viewport. If a small upward bias is desired, scroll only the closest `.filter-drawer__body` :
  ```ts
  const scrollable = inputRef.current.closest('.filter-drawer__body') as HTMLElement | null
  scrollable?.scrollTo({ top: scrollable.scrollTop + (rect.top - 80), behavior: 'smooth' })
  ```
  The existing scroll listener (`SearchSelect.tsx:161` / `AsyncSearchSelect.tsx:195`) already recalculates the dropdown position when `.filter-drawer__body` scrolls.

### Bug 7 — Brand + Ingredient filters never reach the API
- **File** : `helpers.ts:21-64` (`buildProductsApiFilters`).
- **Root cause** : the function builds `tagFields` only from `DOMAIN_PRODUCT_FILTER_CATEGORIES[args.category]` (lines 45-51) — that array contains tag-category keys (`skin_type`, `concern`…) but excludes `brand`, `ingredient`. The returned object then explicitly forwards `kind` (line 56) but omits `brand` and `ingredient`. Confirmed by `__tests__/helpers.test.ts` — 0 assertions cover `brand` / `ingredient` propagation.
- **Diagnosis match** : yes.
- **Fix** :
  ```ts
  brand: args.filters.brand?.length ? args.filters.brand : undefined,
  ingredient: args.filters.ingredient?.length ? args.filters.ingredient : undefined,
  ```
  in the non-discovery branch. Add coverage in `__tests__/helpers.test.ts`. Note that `FilterValues<TagFilterKey>` is the type of `args.filters` — the cast is fine because `'brand'` and `'ingredient'` are in `FILTER_KEYS` even though they are not in `TAG_FILTER_KEYS` (signature should accept `FilterValues<FilterKey>` instead of `FilterValues<TagFilterKey>` for cleanliness).

### Bug 8 — Header search limited to 8 results
- **File** : `backend/src/features/products/service.ts:527` (out of frontend audit scope — confirmed in roadmap).
- **Diagnosis match** : yes (backend concern).
- **Fix** : roadmap path — fix bug 7 first so users can rely on the brand filter; later raise the autocomplete limit and/or add a "Voir tous les résultats" entry that navigates with `?brand=` / `?q=` populated.

---

## New issues found

| Severity | File | Line(s) | Issue | Fix |
|---|---|---|---|---|
| CRITICAL | `lib/queries/products.ts` | 252-255 (`useUpdateProductTags.onSuccess`) | After saving tag changes from the form, only `productKeys.tags(productId)` is invalidated. `productKeys.bySlug(...)` and `productKeys.lists()` are not — so the product detail page (`ProductInfoTab` / `ProductLayout`) keeps showing the stale tag-driven warnings (`ProductInfoTab.tsx:46-53`). | Invalidate `productKeys.bySlug(slugOrId)` and `productKeys.lists()` in the same `onSuccess`. Best : pass `slug` in the mutation payload so we don’t need a separate lookup. |
| CRITICAL | `lib/queries/products.ts` | 277-278 (`useAddProductIngredient.onSuccess`), 298-299 (`useRemoveProductIngredient.onSuccess`) | The product detail (`bySlug`) embeds `product.ingredients[]` (`ProductInfoTab.tsx:91-130`). Mutations only invalidate `productKeys.ingredients(productId)`. After add/remove from the edit form, the user navigates back to `/products/$slug` and sees the stale ingredient list until manual refresh. | Invalidate `productKeys.bySlug(slug)` (and `productKeys.lists()` if INCI-driven counts surface there). |
| CRITICAL | `lib/queries/products.ts` | 220-230 (`useDeleteProduct.onSuccess`) | Only `productKeys.lists()` invalidated. `productKeys.bySlug(slug)` and `[...productKeys.all, 'brands']` remain in cache; if the deleted product was the last of its brand, the brand combobox / drawer keep offering a phantom brand. | Add `qc.removeQueries({ queryKey: productKeys.bySlug(slug) })` and invalidate the brands list. |
| HIGH | `pages/ProductEditPage/ProductEditPage.tsx` | 14-15 | Async waterfall : `useSuspenseQuery(bySlug)` then `useSuspenseQuery(tags(product.id))` — the second request waits on the first because it needs `product.id`. (`async-parallel`, `async-cheap-condition-before-await`) | Two options : (1) expose tags through `productQueries.tags(slug)` so both queries can be `useSuspenseQueries`-batched ; (2) ship initial tags inside the `bySlug` payload (the detail endpoint already returns `ingredients[]`). |
| HIGH | `pages/ProductInfoTab/ProductInfoTab.tsx` | 31, 36-44 | Same pattern : `useSuspenseQuery(bySlug)` then `useQuery(tags(product.id))` and `useQuery(profileQueries.dermo())`. The two follow-ups are independent of each other but both wait on the suspense barrier. (`async-parallel`) | Move `profileQueries.dermo()` to the route loader (preloaded in parallel with the product), or fetch via `useQueries` so all three resolve concurrently. |
| HIGH | `pages/ProductsPage/ProductsPage.tsx` | 117-120, 122-125 | `dermoProfile` is fetched only when `profile_filter` is `true`, but the toggle’s click already updates the URL synchronously, then waits for the profile to load before computing `avoidFor`, then fires the products list with the new filter. The user sees a flash of "all products" then the filtered set. (`async-parallel`) | Prefetch `profileQueries.dermo()` at app boot for authenticated users (or via the products route loader) so the toggle takes effect on the first list render. |
| HIGH | `components/ProductForm/ProductForm.tsx` | 89-93 | `initialForm = useMemo(...)` recomputes when `product` changes, but `useState(initialForm)` only honours the initial value at mount. After `useUpdateProduct` mutates and `setQueryData` ships a new `product` object, the form continues to display the pre-edit values until the page is left and re-entered. | Replace `useState(initialForm)` by `useReducer` keyed on a synced version, or `key={product.id ?? 'create'}` on the form, or use `useEffect` to sync (`isFormDirty ? skip : setForm(initialForm)`). |
| MEDIUM | `pages/ProductsPage/ProductsPage.tsx` | 102-514 | Single 514-line component. Card rendering (lines 396-491), `extraChips` builder (249-281), `filterGroups` memo (185-229), profile toggle (236-247) and pagination are all inlined. Hurts readability and makes it hard to memoize the card grid independently from the header. (`rerender-memo` "extract expensive work into memoized components") | Split into : `<ProductsHeader>` (search + sort + filter + create), `<ProductsFilterDrawer>` (wraps `FilterDrawer` + groups + extras), `<ProductCard>` (memoized — receives `product` only), `<ProductGrid>` (maps `items`). Keeps `ProductsPage` to ~150 lines of orchestration. |
| MEDIUM | `pages/ProductsPage/ProductsPage.tsx` | 127-129, 151-161 | `filters` and `apiFilters` are recreated on every render (object literals). They become the `useMemo` dep arrays of `useListFilters` (`activeTags`, `filterCount`) and the queryKey of `productQueries.list`. TanStack Query deep-equals the key so no refetch — but every parent render allocates a new object and runs the deps comparators. (`rerender-defer-reads`) | Wrap `filters` in `useMemo(..., [search, FILTER_KEYS])` (where `search` is an immutable router-driven object). Same for `apiFilters` and `avoidFor`. |
| MEDIUM | `pages/ProductsPage/ProductsPage.tsx` | 176 | `staleTime = sort === 'random' ? 5*60*1000 : hasFilters ? 5*60*1000 : 0` — readable but the two branches share the same value. | `staleTime = sort === 'random' || hasFilters ? 5 * 60 * 1000 : 0`. Pull to a module-level constant `BROWSING_STALE_TIME`. |
| MEDIUM | `pages/ProductInfoTab/ProductInfoTab.tsx` | 5, 86 | `import Markdown from 'react-markdown'` is loaded eagerly even though only `product.description` (an optional field) consumes it. `react-markdown` + `mdast` deps weigh ~50KB gzipped. (`bundle-dynamic-imports`, `bundle-conditional`) | `const Markdown = lazy(() => import('react-markdown'))` and wrap usage in `<Suspense fallback={null}>`. Skip render entirely when `!product.description`. |
| MEDIUM | `components/ProductForm/ProductForm.tsx` | 117-120 | `productQueries.checkDuplicate(name, brand)` re-keys on every keystroke (after debounce), inflating the cache and never reusing prior results. The `staleTime: 30s` on the query (`lib/queries/products.ts:144`) is too short to amortize. | Either bump `staleTime` to 5 min for this query, or normalize the cache key (lowercase, trim) so `"Avene"` and `"avene"` share an entry. |
| MEDIUM | `components/ProductForm/ProductForm.tsx` | 215, 217-223, 426-436 | Optimistic state for ingredients in `create` mode lives in `pendingIngredients`; in `edit` mode the source of truth is `product.ingredients`. The `mode === 'edit' && removeIngredient.isPending` disable on the trash button (line 431) blocks the entire list during a single removal. | When in edit mode, keep an optimistic cache via `qc.setQueryData(productKeys.bySlug(slug), …)` inside the mutation’s `onMutate`, and only disable the trash button for the row being removed (compare `removeIngredient.variables?.ingredientId === ing.ingredientId`). |
| MEDIUM | `components/AddToCollectionModal/AddToCollectionModal.tsx` | 38 | `const today = new Date().toISOString().split('T')[0]` runs on every render of the modal — fine in practice but technically a non-pure default for `useState(today)` (line 43). If the modal stays open over midnight, the displayed default never updates. | Extract to `useState(() => new Date().toISOString().split('T')[0])` (lazy init, runs once). Date drift while open is acceptable. |
| LOW | `components/BrandCombobox/BrandCombobox.tsx` | 38-41 | `useEffect(() => { setInputValue(value); latestValueRef.current = value }, [value])` mirrors prop into state — classic "derived state stored as state" pattern. (`rerender-derived-state-no-effect`) | Acceptable here because `inputValue` is also written from internal events. Document the bidirectional binding intent in a one-line comment instead of removing the effect. |
| LOW | `components/PriceRangeFilter/PriceRangeFilter.tsx` | 33-38 | Same pattern (two `useEffect`s mirror `min`/`max` props into local state). | Acceptable — same justification (need to react to URL-driven resets). Could be merged into a single effect to halve the React.useEffect overhead. |
| LOW | `pages/ProductsPage/ProductsPage.tsx` | 122-125 | `avoidFor` array literal recreated each render. Used downstream in `apiFilters`. Same dedup story as `filters` above. | Memoize : `useMemo(() => profile_filter && dermoProfile ? [...] : EMPTY_ARRAY, [profile_filter, dermoProfile])`. |
| LOW | `pages/ProductsPage/ProductsPage.tsx` | 249-281 | `extraChips` array built at the top level of render with imperative `push`. Survives because `ActiveFiltersBar` doesn’t memoize, but if it ever does the array identity will defeat it. | Wrap in `useMemo`. Or move into `ActiveFiltersBar` as a `priceRange` / `profileActive` prop and let the bar build its own chips. |
| LOW | `pages/ProductsPage/ProductsPage.tsx` | 442-446 | `style={{ viewTransitionName: \`product-name-${product.slug}\` }}` allocated inline per card per render. With 20 cards × N renders this is hot but `Card.Title` is not memoized so the cost is irrelevant today. Will become a problem if `Card.Title` is later wrapped in `React.memo`. | Move the style object to a small `useMemo` keyed on `product.slug`, or compute the value in CSS via `data-slug` + `view-transition-name: var(--vt-name)`. |
| LOW | `lib/queries/tags.ts` | 19-25 | `select` (named `tagQueries.list().queryFn` post-mapping) re-runs the `name`/`category` rename on every cached read. The result is stable but the allocation is recurring. | Move the rename one layer deeper (`select: (data) => data.map(...)`) so React Query caches the mapped result and shares it across consumers. |
| LOW | `pages/ProductLayout/ProductLayout.tsx` | 42-46 | `useRouterState({ select: (s) => s.location })` re-renders on *every* router change (search, hash, pathname). The component only needs `location.pathname.includes('/discussions')`. | `useRouterState({ select: (s) => s.location.pathname.includes('/discussions') })` — boolean selector, re-renders only on tab switch. (`rerender-derived-state` — subscribe to the derived boolean.) |
| LOW | `pages/ProductLayout/ProductLayout.tsx` | 21-34 | `getBadgeVariant(kind)` is a `switch` rebuilt at every call. With 4 kinds it’s trivial. | Keep as is (premature optimization to memoize). Noted for completeness. |
| LOW | `pages/ProductsPage/ProductsPage.tsx` | 89-92 | `unitClass(unit)` and `kindClass(kind)` run a Set lookup + `toLowerCase` per card per render. `KNOWN_UNITS` is a `Set` (good) but `unit?.toLowerCase().trim()` allocates a string every time. (`js-cache-property-access`) | Pre-compute a `unitToClass` Map at module load. Or accept the cost — 20 cards × ~5 renders/min = negligible. |
| LOW | `pages/ProductsPage/ProductsPage.tsx` | 67 | `EMPTY_TAG_FILTERS as Record<string, string[]>` casts away the typed FilterValues — losing the discriminated relation between `TAG_FILTER_KEYS` and the resulting object. | `as FilterValues<TagFilterKey>` and update `buildDomainSwitchSearch` to accept the same type. Mostly TS hygiene. |
| LOW | `lib/queries/products.ts` | 30-61 | `buildListProductsQuery` iterates `TAG_FILTER_KEYS`, then explicitly handles `kind`/`brand`/`ingredient` — a deliberate inconsistency that makes future filter additions easy to forget. | Drive both lists from `FILTER_KEYS`, treating `brand`/`ingredient`/`kind` exactly like tag categories. Keeps the contract symmetric and reduces the chance of bug 7 recurring. |

---

## Summary

- **Total issues** : 32 (8 from ROADMAP.md + 24 new).
- **Already in ROADMAP.md** : 8.
- **New** : 24 (3 CRITICAL, 3 HIGH, 8 MEDIUM, 10 LOW).

The largest gap between ROADMAP and the code is the **mutation-cache hygiene** : three product mutations (`useUpdateProductTags`, `useAddProductIngredient`, `useRemoveProductIngredient`) update partial cache slices and leave the canonical `productKeys.bySlug(...)` stale. This produces silent UI regressions that look like user error ("I just added that ingredient — why don’t I see it ?") and is invisible until you read the mutation’s `onSuccess`.

### Top 3 priorities

1. **Fix `buildProductsApiFilters` to forward `brand` and `ingredient`** (`helpers.ts:21-64`, ROADMAP bug 7). One-line fix with backend already supporting it ; unlocks the entire drawer’s brand/ingredient UX. Add regression tests in `__tests__/helpers.test.ts` (currently 0 coverage on these keys).
2. **Invalidate `productKeys.bySlug(...)` in tag and ingredient mutations** (`lib/queries/products.ts:252-255, 277-278, 298-299`). Removes the stale-data class entirely. Smaller blast radius than rewriting cache keys.
3. **Wrap `handleDomainChange` in `startTransition` and stabilize the loader slot** (`ProductsPage.tsx:283-288` + `PageHeader.css:55-62`). Addresses ROADMAP bug 3 — the visible glitch — and reduces the 328 ms INP toward the 200 ms target.

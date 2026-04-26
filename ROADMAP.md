# Roadmap

---

## In progress / next up

- Fix product filters (AND vs OR logic, data quality gaps for some categories)
- Design improvements: sidebar layout with more space on large screens, larger cards, bigger search bar
- Image support for products
- Dermatological profile and skin algorithm

---

## Products feature refactor (2026-04-26 audit)

> **Before touching anything: read `frontend/src/features/products/AUDIT.md`** (32 issues, severity-ranked, with file:line + fix per item) and `frontend/src/features/products/ROADMAP.md` (8 known bugs with browser-verified diagnoses). The audit cross-references against Vercel React best practices and confirms / corrects every entry in the products ROADMAP.

Execute in phases — each phase is independently shippable. Pick any phase, no prerequisites between them except where noted.

### Phase 1 — Surgical fixes (cheap, high-value, ~1h)
- [ ] **Bug 7** — `helpers.ts:21-64` forward `brand` + `ingredient` to API. Widen signature to `FilterValues<FilterKey>`. Add 2 tests in `__tests__/helpers.test.ts`.
- [ ] **Mutation cache hygiene** — `lib/queries/products.ts` lines 252, 277, 298 invalidate `productKeys.bySlug(...)` (currently silent stale data on detail page after tag/ingredient edits). Line 227 (`useDeleteProduct`) invalidate brands + remove bySlug.
- [ ] **Bug 6** — drop `scrollIntoView` `useEffect` in `SearchSelect.tsx:114-118` and `AsyncSearchSelect.tsx:150-154` (kills page scroll glitch in drawer).

### Phase 2 — UX glitches (~2h, browser verification per change)
- [ ] **Bug 3** — `ProductsPage.tsx:283-288` wrap `navigate` in `startTransition`. `PageHeader.css:55-62` reserve fixed-width loader slot. Verify INP < 200ms.
- [ ] **Bug 2** — `ProductForm.tsx:82` pass `form.category` to `tagQueries.list(category)`, drop tags whose `tagType` is invalid on category change.
- [ ] **Bug 1** — `ProductForm.schema.ts:17` enum-ify `unit`. New `PRODUCT_AMOUNT_UNITS` shared constant + `ChipGroup` for `amountUnit`. Move `concentrationUnit` enum to one shared constant + add edit UI.

### Phase 3 — Architecture refactors (~3h, single feature branch)
- [ ] **Bug 5 / extract `useFlipPlacement`** — lift the flip `useEffect` from `AsyncSearchSelect.tsx:161-203` to a hook in `frontend/src/component/Search/`. Apply to `ComboboxPrimitive` (fixes `IngredientSearch` + `BrandCombobox` for free). Migrate `AsyncSearchSelect` + `SearchSelect` to consume it. **Note**: do not collapse `IngredientSearch` and `AsyncSearchSelect` into one component — the audit explains why their APIs intentionally differ (see Bug 5 section).
- [ ] **Split `ProductsPage`** (514 → ~150 lines) into `<ProductCard>` (memoized), `<ProductsHeader>`, `<ProductsActiveBar>`, `<ProductsFilterDrawerContent>`. Existing integration test should pass unchanged.
- [ ] **`ProductForm` form-state sync** — `key={mode === 'edit' ? product.id : 'create'}` on `<form>` so post-mutation `product` updates re-seed the form. Same pattern for `useFormTags(initialTags)`.

### Phase 4 — Async waterfalls (~1h)
- [ ] **`ProductEditPage`** — `productQueries.tags(slug)` instead of `tags(productId)` so both queries parallelize via `useSuspenseQueries`.
- [ ] **`ProductInfoTab`** — move `profileQueries.dermo()` to the route loader.
- [ ] **Prefetch `dermo` for `/products`** — root loader / app boot for authenticated users so the "Selon mon profil" toggle takes effect on first paint.

### Phase 5 — Bundle + memoization batch (~1h)
- [ ] Lazy-load `react-markdown` in `ProductInfoTab` (~50KB gzip).
- [ ] `useMemo` for `filters`, `apiFilters`, `avoidFor`, `extraChips` in `ProductsPage`.
- [ ] `useRouterState` boolean selector in `ProductLayout.tsx:42`.
- [ ] `BROWSING_STALE_TIME` constant + simplified ternary at `ProductsPage.tsx:176`.
- [ ] `tagQueries.list` use `select` instead of inline map.
- [ ] `AddToCollectionModal` lazy `useState(() => …)` for `today`.
- [ ] `buildListProductsQuery` symmetric loop over `FILTER_KEYS` (prevents bug 7 from recurring).

### Phase 6 — Decisions needed (no code yet)
- [ ] **Bug 4** — `AddToCollectionModal` orthogonal `in_stock` flag. Question: can "Évité" / "Surveillé" / "Saint-graal" coexist with an in-stock state? If yes → schema migration (`in_stock boolean` column on `user_products`); if no → richer status meta only. See products ROADMAP bug 4.
- [ ] **Bug 8** — header search limit (8 results hardcoded backend `service.ts:527`). Two paths: raise to 20 vs add "Voir tous les résultats" entry that navigates with `?brand=` populated (relies on Phase 1 bug 7 fix).

---

## Exploring

- Enforce `user_bans` at the JWT middleware layer (schema exists, no runtime check — banned users still pass until their access token expires)
- JSON data export (GDPR portability) — currently promised in PRIVACY.md as "in development"
- Encrypt production backups at rest (GPG or `openssl enc` before gzip) — currently stored compressed but in clear on the VPS
- Migrate transactional email provider from Resend to Brevo — PRIVACY.md and PrivacyPage announce Brevo, backend still uses Resend
- Avatar upload via object storage (EU) — `users.avatar_url` field exists but no upload endpoint yet
- Optional AI analysis via Mistral (EU) — `ai_consent` flag already stored in `user_preferences`, no integration yet
- Media CDN (images, future uploads)
- Purchase timeline
- Public/private product reviews (schema exists, no routes yet — making reviews shareable is the next step)
- Article system with discussion (wiki-style, PR-like comments)
- Routine sharing
- Stripe integration

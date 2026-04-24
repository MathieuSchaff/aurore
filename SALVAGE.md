# SALVAGE — lost stash 2026-04-22

Entry point for resuming the salvage work across Claude sessions.

**Status (2026-04-25):** shared, backend-non-seed and frontend zones are
done. Only the **seed zone (209 files)** and **doc sync** remain —
jump straight to [Zone seed](#zone-seed---remaining-209-files) below.

## Context

A WIP stash (2026-04-22 21:15) was lost during reset operations on 2026-04-23. It
contained 260 modified files including a shared/ cleanup that `STATE.md` §12
falsely marked as ✅ done. See `AUDIT.md` for the full 260-file inventory.

## Resources

| Item | Location | Purpose |
|------|----------|---------|
| Stash commit hash | `0f6252e663054e4f7ee76d229717027ddff6fe62` | Immutable git object in `.git/objects/0f/6252e…` |
| Stash tag | `lost-stash-2026-04-22` | Named pointer so `git gc` never prunes it |
| Worktree | `../aurore-stash-recovery/` | Detached HEAD at stash — browse files visually |
| Offline bundle | `~/Mathieu/backups/aurore-stash/lost-stash-2026-04-22.bundle` (5.3 MB) | Self-contained backup, works even if the repo is nuked |
| Full file inventory | `AUDIT.md` (committed) | All 260 files listed, grouped by zone |
| Per-file decisions | `SALVAGE_INVENTORY.md` | Stash-vs-main diff analysis, shared zone |
| Callers map | `SALVAGE_CALLERS.md` | Blast radius of dead-type deletions |

### Why three layers of redundancy

- **Tag** = fast access, local, survives anything short of `git gc --prune=now` or `git tag -d`.
- **Worktree** = visual side-by-side comparison without switching branches.
- **Bundle** = disaster recovery. Portable single file. Survives full repo loss, disk wipe, etc.

## Recovery scenarios

### Normal case — everything still in place

```bash
# Verify tag
git rev-parse lost-stash-2026-04-22          # → 0f6252e66305…

# Verify worktree
git worktree list | grep aurore-stash-recovery

# Verify bundle
ls -lh ~/Mathieu/backups/aurore-stash/lost-stash-2026-04-22.bundle
git bundle verify ~/Mathieu/backups/aurore-stash/lost-stash-2026-04-22.bundle
```

### Worktree was removed

Just recreate it:

```bash
git worktree add ../aurore-stash-recovery lost-stash-2026-04-22
```

### Tag was deleted (but repo intact)

The commit object is still in `.git/objects/` — find it with fsck and retag:

```bash
git fsck --dangling | grep "dangling commit"
# Look for the one dated 2026-04-22 21:15 with "WIP on main: d7e8524"
git tag lost-stash-2026-04-22 0f6252e663054e4f7ee76d229717027ddff6fe62
```

### Everything is gone from the repo (worst case)

Restore from the bundle:

```bash
cd /home/schaff/Mathieu/projets/aurore
git bundle verify ~/Mathieu/backups/aurore-stash/lost-stash-2026-04-22.bundle
git fetch ~/Mathieu/backups/aurore-stash/lost-stash-2026-04-22.bundle lost-stash-2026-04-22:lost-stash-2026-04-22
# Now the tag is back, hash 0f6252e66…
git worktree add ../aurore-stash-recovery lost-stash-2026-04-22
```

### Bundle is also gone

Unrecoverable. Accept the loss. The commit history of what was done is still in
`AUDIT.md` (committed) and this doc.

## What has been salvaged

### Commit `0bebaf3` — `refactor(products): adopt discriminated union and drop dead types`

**Shared (9 files)** — cleanup from STATE.md §12 + units restructure:
- `types.ts` — removed `Product`, `EditableProductKeys`, `ProductEdit`, `ProductEditResponseSchema` (preserved `Patent` WIP)
- `schemas.ts` — removed `productResponseSchema`, `productEditResponseSchema`, `productsPageSchema` (preserved `patentSchema` WIP)
- `ingredients.ts` — removed `productIngredientResponseSchema`, `CreateProductIngredientInput`, `ProductIngredient`
- `units.ts` — nested per-category (mirror `PRODUCT_KINDS`)
- `{dental,haircare,skincare,supplement}/schemas.ts` — removed duplicate `{domain}ListProductsQuery` (source of truth = `list-products-query.ts`)
- `products/index.ts` barrel — re-export queries from `list-products-query.ts`

**Backend (8 files)** — discriminated-union wiring + tests:
- `routes.ts` — `skincareListProductsQuery` → `listProductsQuery`
- `service.ts` — `listProducts` signature `ListProductsFilters`, `category` required, per-domain tag dispatch via `{SKINCARE,HAIRCARE,DENTAL,SUPPLEMENT}_PRODUCT_TAG_CATEGORIES`, factored `tagFilterCondition` helper
- `tests/products.test.ts` — added `category` to 30 calls, deleted obsolete `omitting category` test, fixed `deleteProduct` signature
- `tests/products.routes.test.ts` — added `?category=X` to 32 requests, fixed DELETE 500→404 mismatch
- `features/auth/demo-seed.ts` — collateral fix (caller of `listProducts`)
- `db/seed/utils/csv.ts` + `db/seed/data/otherdata/product-associations.ts` — 102 callers patched from `PRODUCT_UNITS.X` to `PRODUCT_UNITS.skincare.X`

**Migration (1)** — `drizzle/0029_last_piledriver.sql` adds `patents jsonb` column (prepares Patent WIP).

**Test result:** `make test-dev ARGS="products/tests/products"` → 115/115 pass.

### Commit `55a91f5` — `refactor(products): salvage shared tag taxonomies per domain`

**Shared (11 files)** — per-domain taxonomy adoptions:
- `haircare/{tag-slugs,tag-taxonomy}.ts` — empty stubs → full impls (concerns, hair_type, product_type, routine_step, hair_effect, product_label)
- `supplement/{tag-slugs,tag-taxonomy}.ts` — empty stubs → full impls (goals, moment, restriction, product_type, product_label) + 4 new product forms (comprime, ampoule-buvable, huile-orale, spray-sublingual)
- `dental/{tag-slugs,tag-taxonomy}.ts` — added email-affaibli, secheresse-buccale, ado, brossette, kit-blanchiment, remineralisation, sans-edulcorants-artificiels; blanchiment-dentaire superseded by kit-blanchiment
- `skincare/{tag-slugs,tag-taxonomy}.ts` — removed 10 misfiled slugs (dental product_types + supplement forms now in their respective domains)
- `{dental,haircare,supplement}/tag-filters.ts` — UX label refinements (Effet→Bénéfice, Type→Forme, Restriction→Contre-indication)

**Backend (4 files)** — caller patches:
- `seed/data/tags/index.ts` — `TAG_SLUGS` spreads `DENTAL_PRODUCT_TAG_SLUGS` + `SUPPLEMENT_PRODUCT_TAG_SLUGS`; `productTagData` adds `supplementProductTags`; 19 new TAG_LABELS entries for new slugs
- `seed/data/products/dental/gum/gum.seed.ts` — `BLANCHIMENT_DENTAIRE` → `KIT_BLANCHIMENT`
- `seed/scripts/auto-tag.ts` — same rename + kind mapping
- `seed/tests/shared-schemas-vs-tags.test.ts` — `KNOWN_MISSING` adds `'ampoule'` (superseded by `ampoule-buvable`)

**Test result:** products 115/115 pass; seed tests back to baseline (10 pre-existing fails unchanged, 0 delta).

### Commit `493872c` — `wip: snapshot before salvaging lost stash 2026-04-22`

Pre-salvage safety commit with user's uncommitted WIP + `AUDIT.md`.

## What was REJECTED from the stash

The stash was partially out-of-date vs main. These changes were NOT adopted:

- `service.ts::getFilterOptions` — stash had skincare-only; main already has multi-domain dispatch via `DOMAIN_PRODUCT_FILTER_CATEGORIES`, which is superior.
- `service.ts::deleteProduct` — stash dropped the `createdBy` authorization check (would be a security regression).
- `routes.ts` delete handler — corresponding call kept with `userId` arg.

## What remains to salvage

Use `git diff HEAD lost-stash-2026-04-22 -- <path>` to inspect each.

### Zone shared — ✅ done (commit `55a91f5`)

### Zone backend (non-seed) — ✅ done (commit `414f0d4`)

- `auth/users.ts` — adopted `NULLIF` RLS guard + new `profiles_select_public` policy (stash had `USING (true)`; will be tightened to `profile_public = true` once public-profile feature lands)
- `auth/routes.ts` — adopted `X-Forwarded-For` comma-split. Rejected stash's `csrf` middleware removal and OAuth-callback `?token=...` query param (both security regressions)
- `utils/errors/error-handler.ts` — skipped entirely (habits/logs feature dropped by user)
- `drizzle/meta/_journal.json` — skipped (main's 0028/0029 ahead of stash)
- Migration `drizzle/0030_watery_harpoon.sql` — generated for the RLS changes

### Zone frontend — ✅ done (commits `cc797be` + `d381caf`)

**Products (`cc797be`)** — 7 files:
- `filters.ts`, `filters-schema.test.ts` — strict validation (drop `.catch()` fallbacks)
- `ProductLayout.tsx` — `priceCents > 0` guard against "0 €" display
- `ProductsPage.css` — add missing `.products-page__tabs` rule
- `DomainTabs/**` (3 files) — deleted (dead code, no imports)
- Rejected stash deletions of `helpers.test.ts` + `products-serialization.test.ts` (66 passing tests)

**Ambient (`d381caf`)** — 13 files:
- `vite.config.ts` — `allowedHosts: true`
- `AppLayout.tsx` — re-enable `DevThemeSwitcher` in dev
- `RichText.css`, `PageHeader.css`, `BlogArticlePage.css` — mobile responsive fixes
- `FirstTimeEmpty.{css,tsx}` — glassy bottles with product icons
- `routes/_authenticated/collection.tsx`, `routes/blog/*.tsx` — strict search schema
- `features/legal/PrivacyPage/` → `features/legal/components/PrivacyPage/` (folder convention)

**Rejected from the stash** (security / main-ahead / habits):
- Router-context regression: stash pulls `auth` out of `RouterContext` (main added it via `InnerApp`)
- OAuth `?token=${accessToken}` redirect flow (leaks token via referer/history)
- `sanitizeRedirect()` removal on `/auth/login` (open redirect vuln)
- `silentRefresh.ts` exponential backoff removal (refresh-storm risk)
- All habits feature files + nav/stats/home entries
- BottomNav/NavItem UX rework (Blog as tab vs sheet)
- `package.json` adds `react-router-dom` (project uses TanStack Router)
- `routes/ingredients|products/new.tsx` flat structure (main keeps `_authenticated/` layout)

### Zone seed — ⏳ remaining (209 files)

Session stopped here. Pick this up in a fresh Claude session.

**Breakdown** (per `AUDIT.md`):
- 87 products seed (`backend/src/db/seed/data/products/**`)
- 70 ingredients seed (`backend/src/db/seed/data/ingredients/**`)
- 31 blog seed (`backend/src/db/seed/data/blog/**`)
- 21 seed infra (runners, tests, utils, docs)

**⚠️ Most at-risk zone.** Main has re-done a lot of seed since Apr 22
(category-split reorg, dental/supplement domains fleshed out, blog
restructure). Stash is often stale here. Rules:
- **Never** bulk `git checkout` the whole zone.
- For each file, run `git diff HEAD lost-stash-2026-04-22 -- <file>` first.
- If main has clearly evolved past the stash (new structure, new domain
  split), favor main. Stash only wins when it fixes something main still
  has wrong OR adds data main never got.
- Seed test baseline: **10 pre-existing fails** in `make test-dev
  ARGS="seed/tests"` (see commit `55a91f5` summary). Any salvage must
  stay at or below this count.

**Suggested order** (lowest risk first):
1. **Seed infra** (21) — runners/utils/docs. Diff first; some may already
   match main (stash was derived from it).
2. **Blog seed** (31) — check if main's blog restructure supersedes.
3. **Ingredients seed** (70) — dental/supplement taxonomies now fleshed
   out post-`55a91f5`; stash may have useful ingredient rows, especially
   for the new tag slugs (email-affaibli, secheresse-buccale, etc.).
4. **Products seed** (87) — last. Depends on tag taxonomies from the
   shared zone, so must come after ingredients.

**Known cascading data decisions** from `55a91f5`:
- Dental concerns dropped from main: `parodontite`, `erosion-acide`,
  `bruxisme`, `aphtes`, `implants`, `dents-lait`, `blanchiment-dentaire`,
  `reduction-sensibilite`, 6 labels. If stash ingredient/product seeds
  still reference these, adapt to the new slugs (`email-affaibli`,
  `secheresse-buccale`, `kit-blanchiment`, etc.) or drop the reference.
- Skincare: `dentifrice`, `bain-de-bouche`, `fil-dentaire`,
  `blanchiment-dentaire`, `gelule`, `capsule`, `poudre`, `sirop`,
  `gummy` moved out of skincare tag-slugs. Any skincare seed using
  them must switch domain tag or drop the tag.

### Doc sync — ⏳ remaining
- `shared/src/products/STATE.md` §12 — update to reflect what is actually
  ✅ now (the taxonomies implemented by `55a91f5` + the dental/supplement
  product slug rules). Today it still over-claims.
- `backend/src/db/seed/docs/STATE.md` + `ROADMAP.md` — expect updates
  once the seed zone lands (per CLAUDE.md seed workflow).

### Post-salvage tightening (not stash-driven)
- `profiles_select_public` RLS policy currently uses `USING (true)` (from
  stash). Tighten to `USING (${t.profilePublic})` when the public-profile
  feature actually ships. Generate a new migration at that point.

## How to resume (fresh Claude session)

```bash
# 1. Verify resources are still in place
git tag -l "lost-stash*"                                # should list lost-stash-2026-04-22
git worktree list                                        # should list aurore-stash-recovery
ls ~/Mathieu/backups/aurore-stash/                       # bundle

# 2. Pick next file, inspect diff
git diff HEAD lost-stash-2026-04-22 -- <path>

# 3. Adopt wholesale (if safe per SALVAGE_INVENTORY.md)
git checkout lost-stash-2026-04-22 -- <path>

# 4. Or merge manually if there's a WIP conflict or partial adoption
git show lost-stash-2026-04-22:<path>                    # peek
# Then Read/Edit the file hand-merging

# 5. Verify TS
bunx tsc --noEmit --project backend/tsconfig.json
cd shared && bunx tsc --noEmit

# 6. Run tests when touching runtime code
make test-dev ARGS="<scope>"

# 7. Commit per coherent zone (not per file — batch by theme)
```

## Patterns to expect

- **Dead shared types**: many were redeclared locally via Drizzle `$inferSelect`. Safe to delete in shared, no caller refacto.
- **WIP preservation**: if main has new code not in stash (e.g. `Patent`, `patentSchema`, `list-products-query.ts`, `STATE.md`), preserve it and merge manually.
- **Stash regressions**: stash may be partially behind main on features refactored after Apr 22. Never bulk-copy — check each function.
- **Test/impl coupling**: stash tests assume stash impl. When rejecting a stash impl change, adapt the adopted test to main's behavior.

## Cleanup (when 100% done)

```bash
git worktree remove ../aurore-stash-recovery
git tag -d lost-stash-2026-04-22
# Keep the bundle in ~/Mathieu/backups/ as archive
# Delete AUDIT.md + SALVAGE*.md once nothing references them
```

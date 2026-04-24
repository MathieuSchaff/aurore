# SALVAGE — lost stash 2026-04-22

Entry point for resuming the salvage work across Claude sessions.

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

### Commit `493872c` — `wip: snapshot before salvaging lost stash 2026-04-22`

Pre-salvage safety commit with user's uncommitted WIP + `AUDIT.md`.

## What was REJECTED from the stash

The stash was partially out-of-date vs main. These changes were NOT adopted:

- `service.ts::getFilterOptions` — stash had skincare-only; main already has multi-domain dispatch via `DOMAIN_PRODUCT_FILTER_CATEGORIES`, which is superior.
- `service.ts::deleteProduct` — stash dropped the `createdBy` authorization check (would be a security regression).
- `routes.ts` delete handler — corresponding call kept with `userId` arg.

## What remains to salvage

Use `git diff HEAD lost-stash-2026-04-22 -- <path>` to inspect each.

### Zone shared — 11 files remaining

Taxonomy data + filter-meta enrichment. Small per-file, mostly mechanical.

```
shared/src/products/dental/tag-filters.ts
shared/src/products/dental/tag-slugs.ts
shared/src/products/dental/tag-taxonomy.ts
shared/src/products/haircare/tag-filters.ts
shared/src/products/haircare/tag-slugs.ts
shared/src/products/haircare/tag-taxonomy.ts
shared/src/products/skincare/tag-slugs.ts
shared/src/products/skincare/tag-taxonomy.ts
shared/src/products/supplement/tag-filters.ts
shared/src/products/supplement/tag-slugs.ts
shared/src/products/supplement/tag-taxonomy.ts
```

Decisions pre-computed in `SALVAGE_INVENTORY.md` → mostly "adopt stash" (data fills STATE.md §12 claims as done).

### Zone backend (non-seed) — 6 files remaining

```
backend/src/db/schema/auth/users.ts
backend/src/features/auth/routes.ts
backend/src/utils/errors/error-handler.ts
backend/drizzle/meta/_journal.json         # already updated by 0029
```

(auth/demo-seed.ts and products/* already done)

### Zone frontend — 16 files

Components + `products/filters.ts` + `products/helpers.ts`. Includes 3 DELETED files (`DomainTabs/*`) — verify main no longer imports them.

### Zone seed — 209 files

- 87 products seed
- 70 ingredients seed
- 31 blog seed
- 21 seed infra (runners, tests, utils, docs)

⚠️ Zone most at-risk: main has re-done a lot of seed since the stash (category-split reorg). Case-by-case only, never bulk adopt.

### Doc sync
- `shared/src/products/STATE.md` §12 — update to reflect what is actually ✅ now (after the refactor commit).

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

# Auto-tagging write-ops: propagate a detector change to the DB.
# (Not read-only audits: backfill/reconcile write, goldset samples,
#  explain traces, catalog-fix-tag-domain fixes.)
#
# ── backfill vs reconcile: two ways to propagate a detector change ──
# Applying is an option:  just autotag-backfill --write   (else dry-run). Other knobs via env.
#
#   ┌──────────────────────────────────────────────────────┬──────────┬───────────────────┐
#   │                                                      │ backfill │     reconcile     │
#   ├──────────────────────────────────────────────────────┼──────────┼───────────────────┤
#   │ inserts new links (detector emits, DB lacks them)    │ ✅       │ ✅                │
#   ├──────────────────────────────────────────────────────┼──────────┼───────────────────┤
#   │ raises relevance (secondary→primary)                 │ ✅       │ ✅                │
#   ├──────────────────────────────────────────────────────┼──────────┼───────────────────┤
#   │ drops stale links (DB has them, detector stopped)    │ ❌       │ ✅                │
#   ├──────────────────────────────────────────────────────┼──────────┼───────────────────┤
#   │ lowers relevance (primary→secondary)                 │ ❌       │ ✅                │
#   ├──────────────────────────────────────────────────────┼──────────┼───────────────────┤
#   │ touches manual tags (admin/user)                     │ no       │ no (manual-safe)  │
#   └──────────────────────────────────────────────────────┴──────────┴───────────────────┘
#
# reconcile = DELETE non-manual + re-INSERT detector output (writeTagsForProduct) =
# EXACT sync: add + drop + relevance ↕. backfill = additive/upgrade-only, NEVER deletes
# nor downgrades (safe, e.g. cautious prod). reconcile ⊇ backfill → after a reconcile,
# backfill finds 0 to insert.

[doc('Fix tag_products rows violating domain constraints (skincare tagTypes on haircare products). Dry-run unless --write. TARGET: dev|prod (prod + --write → confirm).')]
[group('catalog')]
[arg('WRITE', long='write', value='1', help='apply instead of the dry-run')]
[script]
catalog-fix-tag-domain $WRITE="":
    source {{justfile_directory()}}/scripts/just/_lib.sh
    data_run "catalog-fix-tag-domain" "src/db/seed/maintenance/fix-tag-domain-consistency.ts"

[doc('Backfill auto-tags in an isolated one-shot container. Dry-run unless --write. Env: SLUG, LIMIT, PAGE_SIZE, CONF_OVERRIDE, INCLUDE_DROPPED, TAG (per-tag plan), EXCLUDE_TAG (write-all-except), SAMPLE (review CSV, with SEED/CSV_OUT).')]
[group('autotag')]
[arg('WRITE', long='write', value='1', help='apply instead of the dry-run')]
[script]
autotag-backfill $WRITE="":
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    if [ "$TARGET" = prod ] && [ -n "$WRITE" ]; then confirm_prod "WRITE (autotag-backfill)"; fi
    MODE=$([ -n "$WRITE" ] && echo "WRITE" || echo "dry-run")
    printf "{{CYAN}}Backfill auto-tags ($MODE, $TARGET)...{{NC}}\n"
    mkdir -p backend/tmp
    $COMPOSE run --rm --no-deps \
        ${CONF_OVERRIDE:+-e CONF_OVERRIDE="$CONF_OVERRIDE"} \
        ${LIMIT:+-e LIMIT="$LIMIT"} \
        ${PAGE_SIZE:+-e PAGE_SIZE="$PAGE_SIZE"} \
        ${INCLUDE_DROPPED:+-e INCLUDE_DROPPED="$INCLUDE_DROPPED"} \
        ${TAG:+-e TAG="$TAG"} \
        ${EXCLUDE_TAG:+-e EXCLUDE_TAG="$EXCLUDE_TAG"} \
        ${SAMPLE:+-e SAMPLE="$SAMPLE"} \
        ${SEED:+-e SEED="$SEED"} \
        ${CSV_OUT:+-e CSV_OUT="$CSV_OUT"} \
        autotag-backfill bun run src/features/auto-tagging/runners/backfill/main.ts \
        ${WRITE:+--write} \
        ${SLUG:+--slug "$SLUG"}

[doc('Reconcile auto-tags to current orchestrator: drop stale rows + fix relevance downgrades (manual-safe; backfill is additive/upgrade-only). Dry-run unless --write. Env: SLUG, LIMIT. TARGET: dev|prod.')]
[group('autotag')]
[arg('WRITE', long='write', value='1', help='apply instead of the dry-run')]
[script]
autotag-reconcile $WRITE="":
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    if [ "$TARGET" = prod ] && [ -n "$WRITE" ]; then confirm_prod "WRITE (autotag-reconcile)"; fi
    MODE=$([ -n "$WRITE" ] && echo "WRITE" || echo "dry-run")
    printf "{{CYAN}}Reconcile auto-tags ($MODE, $TARGET)...{{NC}}\n"
    $COMPOSE exec \
        ${LIMIT:+-e LIMIT="$LIMIT"} \
        -w /app/backend api bun run src/features/auto-tagging/runners/backfill/reconcile.ts \
        ${WRITE:+--write} \
        ${SLUG:+--slug "$SLUG"}

[doc('Delete non-manual links of ONE tag the detector no longer emits (tag-scoped reconcile slice; full reconcile also re-inserts). Dry-run unless --write. Env: TAG (required). TARGET: dev|prod.')]
[group('autotag')]
[arg('WRITE', long='write', value='1', help='apply instead of the dry-run')]
[script]
autotag-purge-stale $WRITE="":
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    if [ -z "${TAG:-}" ]; then printf "{{RED}}TAG=<tagSlug> requis{{NC}}\n"; exit 1; fi
    if [ "$TARGET" = prod ] && [ -n "$WRITE" ]; then confirm_prod "WRITE (autotag-purge-stale $TAG)"; fi
    MODE=$([ -n "$WRITE" ] && echo "WRITE" || echo "dry-run")
    printf "{{CYAN}}Purge stale auto-tag links ($MODE, $TARGET, tag=$TAG)...{{NC}}\n"
    $COMPOSE exec \
        -e TAG="$TAG" \
        -w /app/backend api bun run src/features/auto-tagging/runners/backfill/purge-stale-tag.ts \
        ${WRITE:+--write}

[doc('Delete non-manual links of products whose category left the auto-tag corpus (skincare/solaire/bodycare). Dry-run unless --write. TARGET: dev|prod.')]
[group('autotag')]
[arg('WRITE', long='write', value='1', help='apply instead of the dry-run')]
[script]
autotag-purge-off-corpus $WRITE="":
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    if [ "$TARGET" = prod ] && [ -n "$WRITE" ]; then confirm_prod "WRITE (autotag-purge-off-corpus)"; fi
    MODE=$([ -n "$WRITE" ] && echo "WRITE" || echo "dry-run")
    printf "{{CYAN}}Purge auto-tags hors corpus ($MODE, $TARGET)...{{NC}}\n"
    $COMPOSE exec \
        -w /app/backend api bun run src/features/auto-tagging/runners/backfill/purge-off-corpus.ts \
        ${WRITE:+--write}

[doc('Explain auto-tag pipeline: SLUG=<slug> traces a real product (full input: name/desc/brand/texture), INCI="..." traces one raw INCI (INCI-only, blind to name/claim passes), COUNTS=1 aggregates the catalogue. Read-only. Env: SLUG, INCI, KIND (serum), CATEGORY (skincare), COUNTS=1.')]
[group('autotag')]
[script]
autotag-explain:
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    if [ -n "${COUNTS:-}" ]; then
        printf "{{CYAN}}Explain auto-tags — catalogue counts ($TARGET)...{{NC}}\n"
        $COMPOSE exec -w /app/backend api bun run src/features/auto-tagging/runners/explain/main.ts --counts
    elif [ -n "${SLUG:-}" ]; then
        printf "{{CYAN}}Explain auto-tags — product trace ($TARGET)...{{NC}}\n"
        $COMPOSE exec -w /app/backend api bun run src/features/auto-tagging/runners/explain/main.ts --slug "$SLUG"
    else
        if [ -z "${INCI:-}" ]; then
            printf "{{RED}}SLUG ou INCI requis (SLUG=<slug> pour un vrai produit, ou INCI=\"aqua, glycerin, ...\"){{NC}}\n"; exit 1
        fi
        printf "{{CYAN}}Explain auto-tags — INCI trace ($TARGET)...{{NC}}\n"
        $COMPOSE exec -w /app/backend api bun run src/features/auto-tagging/runners/explain/main.ts \
            --kind "${KIND:-serum}" --category "${CATEGORY:-skincare}" "$INCI"
    fi

[doc('Stratified sample of 60-80 products → data/gold-set/annotations.json (idempotent). Env: TAGS (optional comma-separated focus subset), SAMPLE_SIZE, POSITIVES_PER_TAG, NEGATIVES_PER_TAG, SEED, GOLD_SET_PATH.')]
[group('autotag')]
[script]
autotag-goldset:
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    printf "{{CYAN}}Gold-set bootstrap ($TARGET)...{{NC}}\n"
    $COMPOSE exec \
        ${TAGS:+-e TAGS="$TAGS"} \
        ${SAMPLE_SIZE:+-e SAMPLE_SIZE="$SAMPLE_SIZE"} \
        ${POSITIVES_PER_TAG:+-e POSITIVES_PER_TAG="$POSITIVES_PER_TAG"} \
        ${NEGATIVES_PER_TAG:+-e NEGATIVES_PER_TAG="$NEGATIVES_PER_TAG"} \
        ${SEED:+-e SEED="$SEED"} \
        ${GOLD_SET_PATH:+-e GOLD_SET_PATH="$GOLD_SET_PATH"} \
        -w /app/backend api bun run src/features/auto-tagging/runners/gold-set-bootstrap.ts

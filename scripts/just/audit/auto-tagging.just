# Auto-tagging audits (read-only dry-runs against algo-derm + formula passes).

[doc('Dry-run auto-tagging via algo-derm (read-only). Env: CONF_OVERRIDE, CSV_OUT, LIMIT, INCLUDE_DROPPED, DUMP_BUDGETS, CHECK, DUMP_BENEFITS, BENEFITS_OUT, DISABLE_FLOORS.')]
[group('audit')]
[script]
audit-auto-tags:
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    printf "{{CYAN}}Audit auto-tags dry-run ($TARGET) → .audit-out/db/audit-auto-tags.$TARGET.md{{NC}}\n"
    $COMPOSE exec \
        ${CONF_OVERRIDE:+-e CONF_OVERRIDE="$CONF_OVERRIDE"} \
        ${CSV_OUT:+-e CSV_OUT="$CSV_OUT"} \
        ${LIMIT:+-e LIMIT="$LIMIT"} \
        ${INCLUDE_DROPPED:+-e INCLUDE_DROPPED="$INCLUDE_DROPPED"} \
        ${DUMP_BUDGETS:+-e DUMP_BUDGETS="$DUMP_BUDGETS"} \
        ${CHECK:+-e CHECK="$CHECK"} \
        ${DUMP_BENEFITS:+-e DUMP_BENEFITS="$DUMP_BENEFITS"} \
        ${BENEFITS_OUT:+-e BENEFITS_OUT="$BENEFITS_OUT"} \
        ${DISABLE_FLOORS:+-e DISABLE_FLOORS="$DISABLE_FLOORS"} \
        -w /app/backend api bun run src/features/auto-tagging/runners/audit/main.ts \
        | tee "$(audit_out audit-auto-tags)"

[doc('Calibration drift: hit_rate per (slug,category) vs TAG_HIT_RATE_BUDGET; exit 1 on FAIL, out-of-budget → WARN (warn-only).')]
[group('audit')]
[script]
audit-auto-tags-check:
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    printf "{{CYAN}}Audit auto-tags CHECK ($TARGET) → .audit-out/db/audit-auto-tags-check.$TARGET.md{{NC}}\n"
    $COMPOSE exec -e CHECK=1 -w /app/backend api bun run src/features/auto-tagging/runners/audit/main.ts \
        | tee "$(audit_out audit-auto-tags-check)"

[doc('Detect kind mistags the name-regex misses, via INCI signal (wash kind w/o surfactant). Read-only, report-only.')]
[group('audit')]
[script]
audit-kind-inci:
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    printf "{{CYAN}}Audit kind⇄INCI coherence ($TARGET) → .audit-out/db/audit-kind-inci.$TARGET.md{{NC}}\n"
    $COMPOSE exec -w /app/backend api bun run src/features/auto-tagging/runners/audit/kind-inci-coherence.ts \
        | tee "$(audit_out audit-kind-inci)"

# Detect visible SPF products (name or kind=sunscreen) with no filtre-uv ingredient linked.
# Report-only: the cause is an empty/weak source INCI (scrape), not a linking bug. Catches a
# new hole right after a catalogue ingest.
[doc('Visible SPF products with no filtre-uv ingredient linked. Report-only.')]
[group('audit')]
[script]
audit-uv-filters:
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    printf "{{CYAN}}Audit UV filter coverage ($TARGET) → .audit-out/db/audit-uv-filters.$TARGET.md{{NC}}\n"
    $COMPOSE exec -w /app/backend api bun run src/features/auto-tagging/runners/audit/uv-filters-coverage.ts \
        | tee "$(audit_out audit-uv-filters)"

[doc('Detect sans-sulfates false negatives: leave-on products denied the claim by a cetearyl/coceth emulsifier. Read-only.')]
[group('audit')]
[script]
audit-sans-sulfates:
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    printf "{{CYAN}}Audit sans-sulfates coherence ($TARGET) → .audit-out/db/audit-sans-sulfates.$TARGET.md{{NC}}\n"
    $COMPOSE exec -w /app/backend api bun run src/features/auto-tagging/runners/audit/sans-sulfates-coherence.ts \
        | tee "$(audit_out audit-sans-sulfates)"

[doc('Detect absence tags (sans-parfum, sans-silicones, …) whose own INCI declares the thing they deny. Read-only, report-only.')]
[group('audit')]
[script]
audit-tag-contradictions:
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    printf "{{CYAN}}Audit absence-tag contradictions ($TARGET) → .audit-out/db/audit-tag-contradictions.$TARGET.md{{NC}}\n"
    $COMPOSE exec -w /app/backend api bun run src/features/auto-tagging/runners/audit/tag-contradictions.ts \
        | tee "$(audit_out audit-tag-contradictions)"

[doc('Audit products.kind mistags via name patterns. Read-only. Apply reviewed fixes via `just db-fix`.')]
[group('audit')]
[arg('SLUG', long='slug', help='restrict to a single product slug')]
[script]
audit-product-kinds $SLUG="":
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    printf "{{CYAN}}Audit product kinds (read-only, $TARGET) → .audit-out/db/audit-product-kinds.$TARGET.md{{NC}}\n"
    $COMPOSE exec -w /app/backend api bun run src/features/auto-tagging/runners/audit/product-kinds.ts \
        ${SLUG:+--slug "$SLUG"} \
        | tee "$(audit_out audit-product-kinds)"

[doc('Snapshot/diff orchestrator output. Env: LIMIT.')]
[group('audit')]
[arg('CSV_OUT', long='csv-out', help='destination CSV (required)')]
[arg('BASELINE', long='baseline', help='earlier CSV to diff against; omit to snapshot')]
[script]
audit-orchestrator-diff $CSV_OUT $BASELINE="":
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    MODE=$([ -n "$BASELINE" ] && echo "DIFF" || echo "SNAPSHOT")
    printf "{{CYAN}}Audit orchestrator ($MODE, $TARGET)...{{NC}}\n"
    $COMPOSE exec \
        -e CSV_OUT="$CSV_OUT" \
        ${BASELINE:+-e BASELINE="$BASELINE"} \
        ${LIMIT:+-e LIMIT="$LIMIT"} \
        -w /app/backend api bun run src/features/auto-tagging/runners/audit/orchestrator-diff.ts

[doc('Dry-run pharmacological cluster audit (pass 2). Env: LIMIT, DUMP_DRIFT (rows that changed cluster), DUMP_NEW (rows the pass newly claims).')]
[group('audit')]
[script]
audit-actif-class:
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    printf "{{CYAN}}Audit actif-class dry-run ($TARGET) → .audit-out/db/audit-actif-class.$TARGET.md{{NC}}\n"
    $COMPOSE exec \
        ${LIMIT:+-e LIMIT="$LIMIT"} \
        ${DUMP_DRIFT:+-e DUMP_DRIFT="$DUMP_DRIFT"} \
        ${DUMP_NEW:+-e DUMP_NEW="$DUMP_NEW"} \
        -w /app/backend api bun run src/features/auto-tagging/runners/audit/actif-class.ts \
        | tee "$(audit_out audit-actif-class)"

[doc('Audit AHA/BHA/PHA manual overrides. Read-only unless --write, which DELETES. Env: CSV_OUT, CSV_DIR, LIMIT, APPLY_FROM_CSV.')]
[group('audit')]
[arg('WRITE', long='write', value='1', help='⚠ DELETE the pairs listed in APPLY_FROM_CSV')]
[script]
audit-aha-bha-pha $WRITE="":
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    if [ -n "$WRITE" ]; then
        printf "{{RED}}⚠ WRITE mode ($TARGET): DELETE pairs from ${APPLY_FROM_CSV:-?}{{NC}}\n"
        if [ "$TARGET" = prod ]; then confirm_prod "DESTRUCTIVE (aha-bha-pha)"; fi
    else
        printf "{{CYAN}}Audit AHA/BHA/PHA overrides read-only ($TARGET) → .audit-out/db/audit-aha-bha-pha.$TARGET.md{{NC}}\n"
    fi
    $COMPOSE exec \
        ${CSV_OUT:+-e CSV_OUT="$CSV_OUT"} \
        ${CSV_DIR:+-e CSV_DIR="$CSV_DIR"} \
        ${LIMIT:+-e LIMIT="$LIMIT"} \
        ${WRITE:+-e APPLY=1} \
        ${APPLY_FROM_CSV:+-e APPLY_FROM_CSV="$APPLY_FROM_CSV"} \
        -w /app/backend api bun run src/features/auto-tagging/runners/audit/aha-bha-pha-overrides.ts \
        | tee "$(audit_out audit-aha-bha-pha)"

[doc('Benchmark orchestrator vs gold-set (precision/recall/Brier/ECE per tag).')]
[group('audit')]
[arg('GOLD_SET_PATH', long='gold-set', help='annotations.json to benchmark against')]
[arg('CSV_OUT', long='csv-out', help='also write per-tag metrics to this CSV')]
[arg('STRICT', long='strict', value='1', help='exit 1 when a tag misses its threshold')]
[script]
audit-gold-set $GOLD_SET_PATH="" $CSV_OUT="" $STRICT="":
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    printf "{{CYAN}}Gold-set benchmark ($TARGET) → .audit-out/db/audit-gold-set.$TARGET.md{{NC}}\n"
    $COMPOSE exec \
        ${GOLD_SET_PATH:+-e GOLD_SET_PATH="$GOLD_SET_PATH"} \
        ${CSV_OUT:+-e CSV_OUT="$CSV_OUT"} \
        ${STRICT:+-e STRICT="$STRICT"} \
        -w /app/backend api bun run src/features/auto-tagging/runners/audit/gold-set.ts \
        | tee "$(audit_out audit-gold-set)"

[doc('Audit algo-derm concentration solver vs brand-claim % (product_ingredients.concentration_value); per-slug + global MAE/RMSE + CI coverage.')]
[group('audit')]
[arg('SLUG', long='slug', help='restrict to a single product slug')]
[arg('JSON_OUT', long='json-out', help='also write the raw result as JSON to this path')]
[script]
audit-concentration-solver $SLUG="" $JSON_OUT="":
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    printf "{{CYAN}}Concentration solver audit ($TARGET) → .audit-out/db/audit-concentration-solver.$TARGET.md{{NC}}\n"
    $COMPOSE exec \
        ${JSON_OUT:+-e JSON_OUT="$JSON_OUT"} \
        ${SLUG:+-e SLUG="$SLUG"} \
        -w /app/backend api bun run src/features/auto-tagging/runners/audit/concentration-solver.ts \
        | tee "$(audit_out audit-concentration-solver)"

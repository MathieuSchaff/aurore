import '_vars.just'

# Audit DB + auto-tagging pipeline (audits + backfill + gold-set).
# TARGET: env var (dev par défaut | prod). Confirmation interactive si TARGET=prod + write/apply.
# Tous les autres paramètres passent par env vars (pas de positional bugué).
#
# Exemples:
#   LIMIT=50 just audit-actif-class
#   SLUG=la-roche-posay WRITE=1 just audit-product-kinds
#   CSV_OUT=/tmp/orch.csv just audit-orchestrator-diff
#   TARGET=prod WRITE=1 just backfill-auto-tags     # prod, confirmation requise

# Fix tag_products rows violating domain constraints (skincare tagTypes on haircare products).
# Env: WRITE=1 (apply). TARGET: dev|prod. Confirmation interactive si TARGET=prod + WRITE.
fix-tag-domain-consistency:
    #!/usr/bin/env bash
    set -euo pipefail
    TARGET="${TARGET:-dev}"
    case "$TARGET" in
        dev)  COMPOSE="{{COMPOSE_DEV}}" ;;
        prod) COMPOSE="{{COMPOSE_PROD}}" ;;
        *)    printf "{{RED}}TARGET invalide: dev|prod (got '$TARGET'){{NC}}\n"; exit 1 ;;
    esac
    if [ "$TARGET" = "prod" ] && [ -n "${WRITE:-}" ]; then
        printf "{{RED}}⚠ PROD WRITE (fix-tag-domain-consistency) — tape 'PROD' pour confirmer{{NC}}\n"
        read -r -p "> " C
        [ "$C" = "PROD" ] || { printf "{{RED}}abandon{{NC}}\n"; exit 1; }
    fi
    MODE=$([ -n "${WRITE:-}" ] && echo "WRITE" || echo "dry-run")
    printf "{{CYAN}}fix-tag-domain-consistency ($MODE, $TARGET)...{{NC}}\n"
    $COMPOSE exec api bun run src/db/seed/maintenance/fix-tag-domain-consistency.ts \
        ${WRITE:+--write}

# Scan DB rows for suspicious URLs / HTML injection (pre-dates safeUrl validation).
# Exit 1 if high-severity findings. Env: WRITE=1 (auto-fix), CSV_OUT=/tmp/out.csv (export).
# TARGET: dev|prod. Confirmation interactive si TARGET=prod + WRITE.
audit-security:
    #!/usr/bin/env bash
    set -euo pipefail
    TARGET="${TARGET:-dev}"
    case "$TARGET" in
        dev)  COMPOSE="{{COMPOSE_DEV}}" ;;
        prod) COMPOSE="{{COMPOSE_PROD}}" ;;
        *)    printf "{{RED}}TARGET invalide: dev|prod (got '$TARGET'){{NC}}\n"; exit 1 ;;
    esac
    if [ "$TARGET" = "prod" ] && [ -n "${WRITE:-}" ]; then
        printf "{{RED}}⚠ PROD WRITE (audit-security) — tape 'PROD' pour confirmer{{NC}}\n"
        read -r -p "> " C
        [ "$C" = "PROD" ] || { printf "{{RED}}abandon{{NC}}\n"; exit 1; }
    fi
    MODE=$([ -n "${WRITE:-}" ] && echo "WRITE" || echo "dry-run")
    printf "{{CYAN}}Security audit ($MODE, $TARGET)...{{NC}}\n"
    $COMPOSE exec \
        ${WRITE:+-e WRITE="$WRITE"} \
        ${CSV_OUT:+-e CSV_OUT="$CSV_OUT"} \
        api bun run src/db/audit/audit-security.ts

# Audit DB consistency (seed drift, relational integrity)
audit-db:
    #!/usr/bin/env bash
    set -euo pipefail
    TARGET="${TARGET:-dev}"
    case "$TARGET" in
        dev)  COMPOSE="{{COMPOSE_DEV}}" ;;
        prod) COMPOSE="{{COMPOSE_PROD}}" ;;
        *)    printf "{{RED}}TARGET invalide: dev|prod (got '$TARGET'){{NC}}\n"; exit 1 ;;
    esac
    printf "{{CYAN}}DB audit ($TARGET)...{{NC}}\n"
    $COMPOSE exec api bun run src/db/audit/audit-db.ts

# Dry-run auto-tagging via algo-derm (read-only). Env: CONF_OVERRIDE, CSV_OUT, LIMIT, INCLUDE_DROPPED, DUMP_BUDGETS, CHECK, DUMP_BENEFITS, BENEFITS_OUT, DISABLE_FLOORS.
audit-auto-tags:
    #!/usr/bin/env bash
    set -euo pipefail
    TARGET="${TARGET:-dev}"
    case "$TARGET" in
        dev)  COMPOSE="{{COMPOSE_DEV}}" ;;
        prod) COMPOSE="{{COMPOSE_PROD}}" ;;
        *)    printf "{{RED}}TARGET invalide: dev|prod (got '$TARGET'){{NC}}\n"; exit 1 ;;
    esac
    printf "{{CYAN}}Audit auto-tags dry-run ($TARGET)...{{NC}}\n"
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
        api bun run src/features/auto-tagging/runners/audit/main.ts

# Calibration drift detector — validate hit_rate per (slug, category) vs TAG_HIT_RATE_BUDGET.
# Exit 1 on FAIL. Tags hors budget → WARN (warn-only initial — roadmap A3).
audit-auto-tags-check:
    #!/usr/bin/env bash
    set -euo pipefail
    TARGET="${TARGET:-dev}"
    case "$TARGET" in
        dev)  COMPOSE="{{COMPOSE_DEV}}" ;;
        prod) COMPOSE="{{COMPOSE_PROD}}" ;;
        *)    printf "{{RED}}TARGET invalide: dev|prod (got '$TARGET'){{NC}}\n"; exit 1 ;;
    esac
    printf "{{CYAN}}Audit auto-tags CHECK ($TARGET)...{{NC}}\n"
    $COMPOSE exec -e CHECK=1 api bun run src/features/auto-tagging/runners/audit/main.ts

# Audit products.kind mistags via name patterns. Env: SLUG (single product), WRITE (apply fixes).
audit-product-kinds:
    #!/usr/bin/env bash
    set -euo pipefail
    TARGET="${TARGET:-dev}"
    case "$TARGET" in
        dev)  COMPOSE="{{COMPOSE_DEV}}" ;;
        prod) COMPOSE="{{COMPOSE_PROD}}" ;;
        *)    printf "{{RED}}TARGET invalide: dev|prod (got '$TARGET'){{NC}}\n"; exit 1 ;;
    esac
    if [ "$TARGET" = "prod" ] && [ -n "${WRITE:-}" ]; then
        printf "{{RED}}⚠ PROD WRITE (audit-product-kinds) — tape 'PROD' pour confirmer{{NC}}\n"
        read -r -p "> " C
        [ "$C" = "PROD" ] || { printf "{{RED}}abandon{{NC}}\n"; exit 1; }
    fi
    MODE=$([ -n "${WRITE:-}" ] && echo "WRITE" || echo "dry-run")
    printf "{{CYAN}}Audit product kinds ($MODE, $TARGET)...{{NC}}\n"
    $COMPOSE exec api bun run src/features/auto-tagging/runners/audit/product-kinds.ts \
        ${WRITE:+--write} \
        ${SLUG:+--slug "$SLUG"}

# Backfill auto-tags. Env: SLUG, WRITE (apply), LIMIT, CONF_OVERRIDE, INCLUDE_DROPPED.
backfill-auto-tags:
    #!/usr/bin/env bash
    set -euo pipefail
    TARGET="${TARGET:-dev}"
    case "$TARGET" in
        dev)  COMPOSE="{{COMPOSE_DEV}}" ;;
        prod) COMPOSE="{{COMPOSE_PROD}}" ;;
        *)    printf "{{RED}}TARGET invalide: dev|prod (got '$TARGET'){{NC}}\n"; exit 1 ;;
    esac
    if [ "$TARGET" = "prod" ] && [ -n "${WRITE:-}" ]; then
        printf "{{RED}}⚠ PROD WRITE (backfill-auto-tags) — tape 'PROD' pour confirmer{{NC}}\n"
        read -r -p "> " C
        [ "$C" = "PROD" ] || { printf "{{RED}}abandon{{NC}}\n"; exit 1; }
    fi
    MODE=$([ -n "${WRITE:-}" ] && echo "WRITE" || echo "dry-run")
    printf "{{CYAN}}Backfill auto-tags ($MODE, $TARGET)...{{NC}}\n"
    $COMPOSE exec \
        ${CONF_OVERRIDE:+-e CONF_OVERRIDE="$CONF_OVERRIDE"} \
        ${LIMIT:+-e LIMIT="$LIMIT"} \
        ${INCLUDE_DROPPED:+-e INCLUDE_DROPPED="$INCLUDE_DROPPED"} \
        api bun run src/features/auto-tagging/runners/backfill/main.ts \
        ${WRITE:+--write} \
        ${SLUG:+--slug "$SLUG"}

# Snapshot/diff orchestrator output. Env: CSV_OUT (required), BASELINE, LIMIT.
audit-orchestrator-diff:
    #!/usr/bin/env bash
    set -euo pipefail
    if [ -z "${CSV_OUT:-}" ]; then
        printf "{{RED}}CSV_OUT requis (e.g. CSV_OUT=/tmp/out.csv just audit-orchestrator-diff){{NC}}\n"; exit 1
    fi
    TARGET="${TARGET:-dev}"
    case "$TARGET" in
        dev)  COMPOSE="{{COMPOSE_DEV}}" ;;
        prod) COMPOSE="{{COMPOSE_PROD}}" ;;
        *)    printf "{{RED}}TARGET invalide: dev|prod (got '$TARGET'){{NC}}\n"; exit 1 ;;
    esac
    MODE=$([ -n "${BASELINE:-}" ] && echo "DIFF" || echo "SNAPSHOT")
    printf "{{CYAN}}Audit orchestrator ($MODE, $TARGET)...{{NC}}\n"
    $COMPOSE exec \
        -e CSV_OUT="$CSV_OUT" \
        ${BASELINE:+-e BASELINE="$BASELINE"} \
        ${LIMIT:+-e LIMIT="$LIMIT"} \
        api bun run src/features/auto-tagging/runners/audit/orchestrator-diff.ts

# Dry-run pharmacological cluster audit (pass 2). Env: LIMIT.
audit-actif-class:
    #!/usr/bin/env bash
    set -euo pipefail
    TARGET="${TARGET:-dev}"
    case "$TARGET" in
        dev)  COMPOSE="{{COMPOSE_DEV}}" ;;
        prod) COMPOSE="{{COMPOSE_PROD}}" ;;
        *)    printf "{{RED}}TARGET invalide: dev|prod (got '$TARGET'){{NC}}\n"; exit 1 ;;
    esac
    printf "{{CYAN}}Audit actif-class dry-run ($TARGET)...{{NC}}\n"
    $COMPOSE exec \
        ${LIMIT:+-e LIMIT="$LIMIT"} \
        api bun run src/features/auto-tagging/runners/audit/actif-class.ts

# Audit AHA/BHA/PHA manual overrides. Env: CSV_OUT, CSV_DIR, LIMIT, APPLY (destructive), APPLY_FROM_CSV.
audit-aha-bha-pha:
    #!/usr/bin/env bash
    set -euo pipefail
    TARGET="${TARGET:-dev}"
    case "$TARGET" in
        dev)  COMPOSE="{{COMPOSE_DEV}}" ;;
        prod) COMPOSE="{{COMPOSE_PROD}}" ;;
        *)    printf "{{RED}}TARGET invalide: dev|prod (got '$TARGET'){{NC}}\n"; exit 1 ;;
    esac
    if [ -n "${APPLY:-}" ]; then
        printf "{{RED}}⚠ APPLY mode ($TARGET) — DELETE pairs from ${APPLY_FROM_CSV:-?}{{NC}}\n"
        if [ "$TARGET" = "prod" ]; then
            printf "{{RED}}⚠ PROD DESTRUCTIVE — tape 'PROD' pour confirmer{{NC}}\n"
            read -r -p "> " C
            [ "$C" = "PROD" ] || { printf "{{RED}}abandon{{NC}}\n"; exit 1; }
        fi
    else
        printf "{{CYAN}}Audit AHA/BHA/PHA overrides read-only ($TARGET)...{{NC}}\n"
    fi
    $COMPOSE exec \
        ${CSV_OUT:+-e CSV_OUT="$CSV_OUT"} \
        ${CSV_DIR:+-e CSV_DIR="$CSV_DIR"} \
        ${LIMIT:+-e LIMIT="$LIMIT"} \
        ${APPLY:+-e APPLY="$APPLY"} \
        ${APPLY_FROM_CSV:+-e APPLY_FROM_CSV="$APPLY_FROM_CSV"} \
        api bun run src/features/auto-tagging/runners/audit/aha-bha-pha-overrides.ts

# Sample 60-80 produits stratifié → data/gold-set/annotations.json (idempotent).
# Env: SAMPLE_SIZE, POSITIVES_PER_TAG, NEGATIVES_PER_TAG, SEED, GOLD_SET_PATH.
gold-set-bootstrap:
    #!/usr/bin/env bash
    set -euo pipefail
    TARGET="${TARGET:-dev}"
    case "$TARGET" in
        dev)  COMPOSE="{{COMPOSE_DEV}}" ;;
        prod) COMPOSE="{{COMPOSE_PROD}}" ;;
        *)    printf "{{RED}}TARGET invalide: dev|prod (got '$TARGET'){{NC}}\n"; exit 1 ;;
    esac
    printf "{{CYAN}}Gold-set bootstrap ($TARGET)...{{NC}}\n"
    $COMPOSE exec \
        ${SAMPLE_SIZE:+-e SAMPLE_SIZE="$SAMPLE_SIZE"} \
        ${POSITIVES_PER_TAG:+-e POSITIVES_PER_TAG="$POSITIVES_PER_TAG"} \
        ${NEGATIVES_PER_TAG:+-e NEGATIVES_PER_TAG="$NEGATIVES_PER_TAG"} \
        ${SEED:+-e SEED="$SEED"} \
        ${GOLD_SET_PATH:+-e GOLD_SET_PATH="$GOLD_SET_PATH"} \
        api bun run src/features/auto-tagging/runners/gold-set-bootstrap.ts

# Benchmark orchestrator vs gold-set (precision/recall/Brier/ECE per tag).
# Env: GOLD_SET_PATH, CSV_OUT, STRICT.
audit-gold-set:
    #!/usr/bin/env bash
    set -euo pipefail
    TARGET="${TARGET:-dev}"
    case "$TARGET" in
        dev)  COMPOSE="{{COMPOSE_DEV}}" ;;
        prod) COMPOSE="{{COMPOSE_PROD}}" ;;
        *)    printf "{{RED}}TARGET invalide: dev|prod (got '$TARGET'){{NC}}\n"; exit 1 ;;
    esac
    printf "{{CYAN}}Gold-set benchmark ($TARGET)...{{NC}}\n"
    $COMPOSE exec \
        ${GOLD_SET_PATH:+-e GOLD_SET_PATH="$GOLD_SET_PATH"} \
        ${CSV_OUT:+-e CSV_OUT="$CSV_OUT"} \
        ${STRICT:+-e STRICT="$STRICT"} \
        api bun run src/features/auto-tagging/runners/audit/gold-set.ts

# Audit algo-derm concentration solver vs brand-claim % stored in
# product_ingredients.concentration_value. Read-only. Per-slug + global
# MAE/RMSE + CI coverage. Env: JSON_OUT (per-row detail), SLUG (filter).
audit-concentration-solver:
    #!/usr/bin/env bash
    set -euo pipefail
    TARGET="${TARGET:-dev}"
    case "$TARGET" in
        dev)  COMPOSE="{{COMPOSE_DEV}}" ;;
        prod) COMPOSE="{{COMPOSE_PROD}}" ;;
        *)    printf "{{RED}}TARGET invalide: dev|prod (got '$TARGET'){{NC}}\n"; exit 1 ;;
    esac
    printf "{{CYAN}}Concentration solver audit ($TARGET)...{{NC}}\n"
    $COMPOSE exec \
        ${JSON_OUT:+-e JSON_OUT="$JSON_OUT"} \
        ${SLUG:+-e SLUG="$SLUG"} \
        api bun run src/features/auto-tagging/runners/audit/concentration-solver.ts

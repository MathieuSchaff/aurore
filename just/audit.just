# Audit DB consistency (seed drift, relational integrity)
audit-db:
    @printf "{{CYAN}}DB audit in progress...{{NC}}\n"
    {{COMPOSE_DEV}} exec api bun run src/db/audit/audit-db.ts

# Dry-run auto-tagging via algo-derm (read-only)
# Usage: just audit-auto-tags conf_override=0.7 limit=50
audit-auto-tags conf_override="" csv_out="" limit="" include_dropped="":
    #!/usr/bin/env bash
    printf '\033[0;36mAudit auto-tags (dry-run)...\033[0m\n'
    {{COMPOSE_DEV}} exec \
        $([ -n "{{conf_override}}" ] && echo "-e CONF_OVERRIDE={{conf_override}}" || true) \
        $([ -n "{{csv_out}}" ]       && echo "-e CSV_OUT={{csv_out}}"             || true) \
        $([ -n "{{limit}}" ]         && echo "-e LIMIT={{limit}}"                 || true) \
        $([ -n "{{include_dropped}}" ] && echo "-e INCLUDE_DROPPED={{include_dropped}}" || true) \
        api bun run src/features/auto-tagging/runners/audit.ts

# Audit products.kind mistags via name patterns
# Usage: just audit-product-kinds slug=my-slug write=1
audit-product-kinds slug="" write="":
    #!/usr/bin/env bash
    MODE=$([ -n "{{write}}" ] && echo "WRITE" || echo "dry-run")
    printf "\033[0;36mAudit product kinds ($MODE)...\033[0m\n"
    {{COMPOSE_DEV}} exec api bun run src/db/seed/runners/audit-product-kinds.ts \
        $([ -n "{{write}}" ] && echo "--write" || true) \
        $([ -n "{{slug}}" ]  && echo "--slug {{slug}}" || true)

# Dry-run backfill tags (algo-derm + actif-class + kind)
# Usage: just backfill-auto-tags write=1 slug=my-slug limit=50
backfill-auto-tags slug="" write="" limit="" conf_override="" include_dropped="":
    #!/usr/bin/env bash
    MODE=$([ -n "{{write}}" ] && echo "WRITE" || echo "dry-run")
    printf "\033[0;36mBackfill auto-tags ($MODE)...\033[0m\n"
    {{COMPOSE_DEV}} exec \
        $([ -n "{{conf_override}}" ]   && echo "-e CONF_OVERRIDE={{conf_override}}"     || true) \
        $([ -n "{{limit}}" ]           && echo "-e LIMIT={{limit}}"                     || true) \
        $([ -n "{{include_dropped}}" ] && echo "-e INCLUDE_DROPPED={{include_dropped}}" || true) \
        api bun run src/features/auto-tagging/runners/backfill.ts \
        $([ -n "{{write}}" ] && echo "--write"         || true) \
        $([ -n "{{slug}}" ]  && echo "--slug {{slug}}" || true)

# Snapshot/diff orchestrator output
# Usage: just audit-orchestrator-diff csv_out=/tmp/out.csv baseline=/tmp/base.csv limit=100
audit-orchestrator-diff csv_out baseline="" limit="":
    #!/usr/bin/env bash
    MODE=$([ -n "{{baseline}}" ] && echo "DIFF" || echo "SNAPSHOT")
    printf "\033[0;36mAudit orchestrator ($MODE)...\033[0m\n"
    {{COMPOSE_DEV}} exec \
        -e CSV_OUT={{csv_out}} \
        $([ -n "{{baseline}}" ] && echo "-e BASELINE={{baseline}}" || true) \
        $([ -n "{{limit}}" ]    && echo "-e LIMIT={{limit}}"       || true) \
        api bun run src/features/auto-tagging/runners/audit-orchestrator-diff.ts

# Dry-run pharmacological cluster audit (pass 2)
# Usage: just audit-actif-class limit=50
audit-actif-class limit="":
    #!/usr/bin/env bash
    printf '\033[0;36mAudit actif-class (dry-run)...\033[0m\n'
    {{COMPOSE_DEV}} exec \
        $([ -n "{{limit}}" ] && echo "-e LIMIT={{limit}}" || true) \
        api bun run src/features/auto-tagging/runners/audit-actif-class.ts

# Audit AHA/BHA/PHA manual overrides
# Usage: just audit-aha-bha-pha limit=50 apply=1 apply_from_csv=/path/to.csv
audit-aha-bha-pha csv_out="" csv_dir="" limit="" apply="" apply_from_csv="":
    #!/usr/bin/env bash
    if [ -n "{{apply}}" ]; then
        printf '\033[0;31m⚠ APPLY mode — DELETE pairs from {{apply_from_csv}}\033[0m\n'
    else
        printf '\033[0;36mAudit AHA/BHA/PHA overrides (read-only)...\033[0m\n'
    fi
    {{COMPOSE_DEV}} exec \
        $([ -n "{{csv_out}}" ]        && echo "-e CSV_OUT={{csv_out}}"               || true) \
        $([ -n "{{csv_dir}}" ]        && echo "-e CSV_DIR={{csv_dir}}"               || true) \
        $([ -n "{{limit}}" ]          && echo "-e LIMIT={{limit}}"                   || true) \
        $([ -n "{{apply}}" ]          && echo "-e APPLY={{apply}}"                   || true) \
        $([ -n "{{apply_from_csv}}" ] && echo "-e APPLY_FROM_CSV={{apply_from_csv}}" || true) \
        api bun run src/features/auto-tagging/runners/audit-aha-bha-pha-overrides.ts

# Sample 60-80 products stratified → data/gold-set/annotations.json (idempotent)
# Usage: just gold-set-bootstrap sample_size=80 seed=42
gold-set-bootstrap sample_size="" positives_per_tag="" negatives_per_tag="" seed="" gold_set_path="":
    #!/usr/bin/env bash
    printf '\033[0;36mGold-set bootstrap (stratified sampling)...\033[0m\n'
    {{COMPOSE_DEV}} exec \
        $([ -n "{{sample_size}}" ]       && echo "-e SAMPLE_SIZE={{sample_size}}"              || true) \
        $([ -n "{{positives_per_tag}}" ] && echo "-e POSITIVES_PER_TAG={{positives_per_tag}}"  || true) \
        $([ -n "{{negatives_per_tag}}" ] && echo "-e NEGATIVES_PER_TAG={{negatives_per_tag}}"  || true) \
        $([ -n "{{seed}}" ]              && echo "-e SEED={{seed}}"                            || true) \
        $([ -n "{{gold_set_path}}" ]     && echo "-e GOLD_SET_PATH={{gold_set_path}}"          || true) \
        api bun run src/features/auto-tagging/runners/gold-set-bootstrap.ts

# Benchmark orchestrator vs gold-set (precision/recall/Brier/ECE per tag)
# Usage: just audit-gold-set gold_set_path=/path strict=1
audit-gold-set gold_set_path="" csv_out="" strict="":
    #!/usr/bin/env bash
    printf '\033[0;36mGold-set benchmark...\033[0m\n'
    {{COMPOSE_DEV}} exec \
        $([ -n "{{gold_set_path}}" ] && echo "-e GOLD_SET_PATH={{gold_set_path}}" || true) \
        $([ -n "{{csv_out}}" ]       && echo "-e CSV_OUT={{csv_out}}"             || true) \
        $([ -n "{{strict}}" ]        && echo "-e STRICT={{strict}}"               || true) \
        api bun run src/features/auto-tagging/runners/audit-gold-set.ts

import '_vars.just'

# CDN images pipeline: Bunny upload + audits + DB URL maintenance.
# Applying is `--write`; the rest goes through env vars (prefixed before `just`).
# TARGET=dev (default) | prod. Interactive confirmation when TARGET=prod + write.
#
# Examples:
#   SLUG=brand-product URL=https://… just image-upload
#   BATCH=/path/to/jobs.json just image-upload

# Upload an image to Bunny CDN + update DB. Env: SLUG, URL, FILE, BATCH,
# NO_DB, NO_STAGED, CONCURRENCY.
[doc("Upload an image to Bunny CDN + update DB. Dry-run unless --write. Env: SLUG|BATCH, URL, FILE, NO_DB, NO_STAGED, CONCURRENCY")]
[group('images')]
[arg('WRITE', long='write', value='1', help='apply instead of the dry-run')]
[script]
image-upload $WRITE="":
    if [ -z "${SLUG:-}" ] && [ -z "${BATCH:-}" ]; then
        printf "{{RED}}SLUG or BATCH required (env vars){{NC}}\n"; exit 1
    fi
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    if [ "$TARGET" = prod ] && [ -n "$WRITE" ] && [ -z "${NO_DB:-}" ]; then confirm_prod "WRITE (image-upload)"; fi
    MODE=$([ -n "$WRITE" ] && echo "WRITE" || echo "dry-run")
    printf "{{CYAN}}Image upload ($MODE, $TARGET)...{{NC}}\n"
    $COMPOSE exec -w /app/backend api bun run src/images/upload/main.ts \
        ${SLUG:+"$SLUG"} \
        ${URL:+--url "$URL"} \
        ${FILE:+--file "$FILE"} \
        ${BATCH:+--batch "$BATCH"} \
        $([ -z "$WRITE" ] && echo "--dry" || true) \
        ${NO_DB:+--no-db} \
        ${NO_STAGED:+--no-staged} \
        ${CONCURRENCY:+--concurrency "$CONCURRENCY"}

# Build output/image-mapping.json from the Bunny ∩ DB inventory (prerequisite of
# image-fix-refs). Writes a local artifact only (no DB, no CDN), so no mode flag.
[doc("Build output/image-mapping.json from the Bunny ∩ DB inventory (prerequisite of image-fix-refs). Local artifact, no mode")]
[group('images')]
[script]
image-build-mapping:
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    printf "{{CYAN}}Build image mapping ($TARGET)...{{NC}}\n"
    $COMPOSE exec -w /app/backend api bun run src/images/maintenance/build-mapping.ts

[doc('Reconcile DB image_url ⇄ Bunny from image-mapping.json (rename/nullify/cleanup). Writes DB+CDN. Dry-run unless --write. TARGET: dev|prod (prod + --write → confirm).')]
[group('images')]
[arg('WRITE', long='write', value='1', help='apply instead of the dry-run')]
[script]
image-fix-refs $WRITE="":
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    if [ "$TARGET" = prod ] && [ -n "$WRITE" ]; then confirm_prod "WRITE DB+CDN (image-fix-refs)"; fi
    MODE=$([ -n "$WRITE" ] && echo "WRITE" || echo "dry-run")
    printf "{{CYAN}}Fix broken image refs ($MODE, $TARGET)...{{NC}}\n"
    $COMPOSE exec -w /app/backend api bun run src/images/maintenance/fix-broken-refs.ts \
        ${WRITE:+--apply}

import '_vars.just'

# INCI tools: corpus audit + one-shot cleanups + linker.
# Applying is `--write`; the rest goes through env vars. TARGET=dev (default) | prod.
# Audits read-only. Cleanups/linker: dry-run by default (confirm on prod).
#
# Examples:
#   FULL=1 just audit-inci-quality
#   just inci-cleanup clean-inci                    # dry-run
#   just inci-cleanup-all --write                   # writes the 3 cleanups
#   LIMIT=20 just inci-cleanup resplit-single-token --write
#   just link-ingredients                           # dry-run link backfill
#   just link-ingredients --write                   # apply
#   SLUG=<slug> just link-ingredients --write       # reconcile links of 1 product
#   RELINK=1 just link-ingredients --write          # reconcile every product carrying an INCI

# Backfill product_ingredients from products.inci (products with 0 links).
# Idempotent. Run it again after every ingest. Seed/ingest does NOT link:
# this script is the only path that populates links for imported products.
# SLUG and RELINK reconcile, they do not replace: a link the recompute no longer derives is
# dropped only when nothing marks it as human, and an empty recompute deletes nothing. ONLY_SLUGS
# scopes a RELINK to additive inserts for a bounded creation lot; it never removes a link. Those
# are INGREDIENT slugs, not product slugs: a product list silently plans zero rows. Scope a lot of
# products with one SLUG run per product.
[doc("Backfill INCI links → product_ingredients. Dry-run unless --write. Env: SLUG (reconcile 1 product), RELINK (reconcile all), ONLY_SLUGS (additive scope, ingredient slugs), LIMIT (integer >= 0)")]
[group('inci')]
[arg('WRITE', long='write', value='1', help='apply instead of the dry-run')]
[script]
link-ingredients $WRITE="":
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    if [ "$TARGET" = prod ] && [ -n "$WRITE" ]; then confirm_prod "WRITE (link-ingredients)"; fi
    MODE=$([ -n "$WRITE" ] && echo "WRITE" || echo "dry-run")
    printf "{{CYAN}}INCI link-ingredients ($MODE, $TARGET)...{{NC}}\n"
    $COMPOSE exec ${LIMIT:+-e LIMIT="$LIMIT"} ${ONLY_SLUGS:+-e ONLY_SLUGS="$ONLY_SLUGS"} -w /app/backend api bun run src/db/seed/inci/link-ingredients/main.ts ${WRITE:+--write} ${SLUG:+--slug "$SLUG"} ${RELINK:+--relink}

# One-shot INCI cleanup. SCRIPT ∈ clean-inci | resplit-single-token | worst-match-prose.
# Dry-run by default; --write commits. Env: TARGET, LIMIT (resplit).
[doc("One-shot INCI cleanup (clean-inci|resplit-single-token|worst-match-prose). Dry-run unless --write. Env: LIMIT")]
[group('inci')]
[arg('WRITE', long='write', value='1', help='apply instead of the dry-run')]
[script]
inci-cleanup script $WRITE="":
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    if [ "$TARGET" = prod ] && [ -n "$WRITE" ]; then confirm_prod "WRITE (inci-cleanup {{script}})"; fi
    MODE=$([ -n "$WRITE" ] && echo "WRITE" || echo "dry-run")
    printf "{{CYAN}}INCI cleanup {{script}} ($MODE, $TARGET)...{{NC}}\n"
    $COMPOSE exec -w /app/backend api bun run src/db/seed/inci/cleanup/{{script}}.ts ${WRITE:+--apply} ${LIMIT:+--limit="$LIMIT"}

# All INCI cleanups in sequence: clean-inci → resplit-single-token → worst-match-prose.
# Dry-run by default; --write commits. Run `just db-snapshot` after a write.
[doc("The 3 INCI cleanups in sequence. Dry-run unless --write; db-snapshot after a write")]
[group('inci')]
[arg('WRITE', long='write', value='1', help='apply instead of the dry-run')]
[script]
inci-cleanup-all $WRITE="":
    source {{justfile_directory()}}/scripts/just/_lib.sh
    target_compose
    if [ "$TARGET" = prod ] && [ -n "$WRITE" ]; then confirm_prod "WRITE (inci-cleanup-all)"; fi
    MODE=$([ -n "$WRITE" ] && echo "WRITE" || echo "dry-run")
    for s in clean-inci resplit-single-token worst-match-prose; do
        printf "{{CYAN}}── $s ($MODE, $TARGET) ──{{NC}}\n"
        $COMPOSE exec -w /app/backend api bun run src/db/seed/inci/cleanup/$s.ts ${WRITE:+--apply}
    done

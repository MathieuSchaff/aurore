import '../_vars.just'
import 'db.just'
import 'auto-tagging.just'
import 'seed-coverage.just'
import 'autotag-ops.just'
import 'code.just'

# Audit DB + auto-tagging pipeline (audits + backfill + gold-set).
# TARGET: env var (dev default | prod). Interactive confirmation when TARGET=prod + write.
# Writing is `--write`; the other settings are env vars unless `just --usage <recipe>` lists them.
#
# Examples:
#   LIMIT=50 just audit-actif-class
#   just audit-product-kinds --slug <product-slug>
#   just audit-orchestrator-diff --csv-out /tmp/orch.csv
#   TARGET=prod just autotag-backfill --write        # prod, confirmation required
#   just audit-db-full                               # all read-only audits in one go

# No -e: every audit must run, the exit code is decided at the end.
[doc('Run all read-only DB audits in sequence; never aborts in the middle of a run, exits 1 if any failed. TARGET: dev|prod.')]
[group('audit')]
[script('bash', '-uo', 'pipefail')]
audit-db-full:
    source {{justfile_directory()}}/scripts/just/_lib.sh
    audits=(audit-db audit-taxonomy audit-security audit-product-kinds audit-actif-class
        audit-kind-inci audit-uv-filters audit-sans-sulfates audit-tag-contradictions audit-aha-bha-pha
        audit-auto-tags audit-auto-tags-check audit-gold-set audit-concentration-solver)
    summary="$(audit_out audit-db-full)"
    { printf '# audit-db-full (%s)\n\n' "$TARGET"; printf '| audit | statut |\n|---|---|\n'; } > "$summary"
    fail=0
    for a in "${audits[@]}"; do
        printf "\n{{CYAN}}━━ %s ━━{{NC}}\n" "$a"
        if just "$a"; then st="✅ ok"; else st="🔴 FAIL"; fail=1; fi
        printf '| %s | %s |\n' "$a" "$st" >> "$summary"
    done
    printf "\n{{CYAN}}Résumé ($TARGET) → %s{{NC}}\n" "$summary"
    cat "$summary"
    exit $fail

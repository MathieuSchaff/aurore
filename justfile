set shell := ["bash", "-c"]

# Default (bare `just`): show the recruiter/contributor path, not every ops recipe.
default:
    @printf "{{ CYAN }}Aurore — common commands{{ NC }}\n"
    @printf "  First clone: just init, then just dev-fresh\n"
    @printf "  Daily dev:   just dev\n"
    @printf "  Tests:       just test\n"
    @printf "  Full list:   just --list\n"
    @printf "  Guide:       docs/commands/README.md\n"

import 'scripts/just/_vars.just'
import 'scripts/just/dev.just'
import 'scripts/just/test.just'
import 'scripts/just/e2e.just'
import 'scripts/just/db.just'
import 'scripts/just/audit/main.just'
import 'scripts/just/data.just'
import 'scripts/just/images.just'
import 'scripts/just/inci.just'
import 'scripts/just/quality.just'
import 'scripts/just/ops.just'
import 'scripts/just/monitoring.just'
import? 'scripts/local.just'

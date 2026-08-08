# Static code-quality audit (no Docker / no DB): knip + biome + tsc + cycles + fallow + anon-db-gate + react-doctor.

AUDIT_CODE_OUT := '.audit-out/code'

# Full code audit: probes, then HTML/CSV reports, then the diff against the previous run. OPEN=1 also opens the reports.
audit-code:
    #!/usr/bin/env bash
    # set +e keeps every report being written when one probe fails, but a bare "Done" then
    # reads as a clean audit: knip and cycles both exited 1 under a "Done" once. Each probe
    # records its own status (PIPESTATUS[0], since tee would otherwise mask it) and the
    # summary names the failures. Exit stays 0 — knip and react-doctor exit 1 on findings
    # that are triaged, not blocking.
    #
    # raw/ is the audit: every probe writes there and nothing outside the repo toolchain is
    # needed to read it. sarif/ and json/ are a bonus for `just audit-report`, which is the
    # only recipe that depends on sarif-tools. A probe with no machine-readable format keeps
    # raw/ as its single output rather than getting a hand-rolled converter.
    set +e
    repo="$PWD"
    out='{{ AUDIT_CODE_OUT }}'
    mkdir -p "$out"/raw "$out"/json
    # Rotate before probing: what is in sarif/ right now IS the previous run, so the diff at
    # the end costs no separate snapshot step. mv rather than cp so sarif/ starts empty and a
    # probe that fails to write leaves a gap instead of last run's file passing for fresh.
    if compgen -G "$out/sarif/*.sarif" > /dev/null; then
        rm -rf "$out/sarif-prev"
        mv "$out/sarif" "$out/sarif-prev"
    fi
    mkdir -p "$out"/sarif
    # Reports used to land flat in .audit-out/, so leaving them behind means reading a stale
    # run by mistake. Named one by one: a glob would take .audit-out/inci/ with it.
    rm -f .audit-out/{knip,biome,tsc,cycles,health,dupes,anon-db-gate,react-doctor}.txt
    failed=()
    nosarif=()
    check_sarif() { [ -s "$1" ] || nosarif+=("$(basename "$1" .sarif)"); }
    printf "{{ CYAN }}=== knip (dead code/exports/deps) ==={{ NC }}\n"
    just knip 2>&1 | tee "$out/raw/knip.txt"
    [ ${PIPESTATUS[0]} -eq 0 ] || failed+=("knip")
    # Second run instead of one repeated --reporter: knip writes every reporter to the same
    # stdout, so asking for compact and sarif at once interleaves them into invalid JSON.
    just knip "" sarif > "$out/sarif/knip.sarif" 2>/dev/null
    check_sarif "$out/sarif/knip.sarif"
    printf "{{ CYAN }}=== biome (lint + unused locals) ==={{ NC }}\n"
    just lint 2>&1 | tee "$out/raw/biome.txt"
    [ ${PIPESTATUS[0]} -eq 0 ] || failed+=("biome")
    # --reporter-file writes the report *instead of* stdout, so this cannot be folded into
    # `just lint` without losing the human output. Biome runs in under a second.
    bunx biome check . --reporter=sarif --reporter-file="$out/sarif/biome.sarif" >/dev/null 2>&1
    check_sarif "$out/sarif/biome.sarif"
    printf "{{ CYAN }}=== tsc -b (types) ==={{ NC }}\n"
    bunx tsc -b --pretty false 2>&1 | tee "$out/raw/tsc.txt"
    [ ${PIPESTATUS[0]} -eq 0 ] || failed+=("tsc")
    printf "{{ CYAN }}=== madge (cycles) ==={{ NC }}\n"
    just cycles 2>&1 | tee "$out/raw/cycles.txt"
    [ ${PIPESTATUS[0]} -eq 0 ] || failed+=("cycles")
    printf "{{ CYAN }}=== fallow health (complexity/CRAP) ==={{ NC }}\n"
    npx fallow health 2>&1 | tee "$out/raw/health.txt"
    [ ${PIPESTATUS[0]} -eq 0 ] || failed+=("fallow-health")
    # --sarif-file claims to write "in addition to" the primary format, but is a no-op in
    # fallow 3.10.0 — it silently writes nothing. --output-file does work, hence a second run.
    npx fallow health --format sarif --quiet --output-file "$out/sarif/fallow-health.sarif" >/dev/null 2>&1
    check_sarif "$out/sarif/fallow-health.sarif"
    printf "{{ CYAN }}=== fallow dupes ==={{ NC }}\n"
    npx fallow dupes 2>&1 | tee "$out/raw/dupes.txt"
    [ ${PIPESTATUS[0]} -eq 0 ] || failed+=("fallow-dupes")
    npx fallow dupes --format sarif --quiet --output-file "$out/sarif/fallow-dupes.sarif" >/dev/null 2>&1
    check_sarif "$out/sarif/fallow-dupes.sarif"
    printf "{{ CYAN }}=== anon-db-gate (anonDb surface) ==={{ NC }}\n"
    just anon-db-gate 2>&1 | tee "$out/raw/anon-db-gate.txt"
    [ ${PIPESTATUS[0]} -eq 0 ] || failed+=("anon-db-gate")
    printf "{{ CYAN }}=== react-doctor (React patterns/a11y/perf) ==={{ NC }}\n"
    # Version comes from frontend/package.json (react-doctor dependency) — no pin here.
    (cd frontend && npx react-doctor --verbose --no-score 2>&1) | tee "$out/raw/react-doctor.txt"
    [ ${PIPESTATUS[0]} -eq 0 ] || failed+=("react-doctor")
    # JSON, not SARIF: react-doctor has no SARIF reporter, so this one stays out of the
    # aggregated HTML. --json-out takes an absolute path because of the subshell cd.
    (cd frontend && npx react-doctor --verbose --no-score --json --json-out "$repo/$out/json/react-doctor.json" >/dev/null 2>&1)
    if [ ${#failed[@]} -eq 0 ]; then
        printf "{{ GREEN }}Done, every probe exited clean. Reports → %s/raw/{{ NC }}\n" "$out"
    else
        printf "{{ YELLOW }}Done, but %d probe(s) exited non-zero: %s{{ NC }}\n" "${#failed[@]}" "${failed[*]}"
        printf "{{ YELLOW }}Read the matching %s/raw/ report before calling this run clean.{{ NC }}\n" "$out"
    fi
    if [ ${#nosarif[@]} -ne 0 ]; then
        printf "{{ YELLOW }}No SARIF written for: %s — the HTML reports will be short by that much.{{ NC }}\n" "${nosarif[*]}"
    fi
    just audit-report
    # First ever run has no sarif-prev/, and there is nothing to say about it.
    if [ -d "$out/sarif-prev" ]; then
        printf "{{ CYAN }}=== diff vs previous run ==={{ NC }}\n"
        just audit-diff
    fi
    [ -n "${OPEN:-}" ] && just audit-open
    exit 0

# Aggregate the SARIF reports into HTML + CSV (needs sarif-tools). Output → .audit-out/code/
audit-report:
    #!/usr/bin/env bash
    set -euo pipefail
    out='{{ AUDIT_CODE_OUT }}'
    if ! command -v sarif >/dev/null 2>&1; then
        printf "{{ YELLOW }}sarif-tools not installed — 'uv tool install sarif-tools' or 'pipx install sarif-tools'.{{ NC }}\n"
        printf "{{ YELLOW }}The reports in %s/raw/ are the audit and do not need it.{{ NC }}\n" "$out"
        exit 0
    fi
    if [ ! -d "$out/sarif" ]; then
        printf "{{ RED }}No %s/sarif/ — run 'just audit-code' first.{{ NC }}\n" "$out"
        exit 1
    fi
    # Two reports, not one: fallow contributes over half the findings and its severities are
    # complexity bands, so merging it with Biome and knip buries the handful of real errors
    # under a wall of CRAP scores. sarif-tools also labels a rule group from the first
    # finding's message, which turns fallow's quoted function names into "' ...".
    sarif html --output "$out/code.html" "$out/sarif/biome.sarif" "$out/sarif/knip.sarif"
    sarif html --output "$out/complexity.html" "$out/sarif/fallow-health.sarif" "$out/sarif/fallow-dupes.sarif"
    # CSV keeps the per-finding message the grouped HTML drops — the format to grep.
    sarif csv --output "$out/findings.csv" "$out/sarif"
    printf "{{ GREEN }}%s/{code,complexity}.html + findings.csv{{ NC }}\n" "$out"

# Open the aggregated audit reports in a browser
audit-open:
    #!/usr/bin/env bash
    set -euo pipefail
    out='{{ AUDIT_CODE_OUT }}'
    for f in "$out/code.html" "$out/complexity.html"; do
        [ -f "$f" ] || { printf "{{ RED }}%s missing — run 'just audit-report'.{{ NC }}\n" "$f"; exit 1; }
        xdg-open "$f"
    done

# Diff the current SARIF run against an earlier one. Defaults to the run just before it; audit-code calls this on its own.
audit-diff previous=(AUDIT_CODE_OUT + '/sarif-prev'):
    #!/usr/bin/env bash
    set -uo pipefail
    out='{{ AUDIT_CODE_OUT }}'
    command -v sarif > /dev/null 2>&1 || { printf "{{ YELLOW }}sarif-tools not installed.{{ NC }}\n"; exit 0; }
    if [ ! -d '{{ previous }}' ]; then
        printf "{{ RED }}Nothing at %s to compare against.{{ NC }}\n" '{{ previous }}'
        exit 1
    fi
    # The counts are per rule code, not per site: a finding that moves from one file to another
    # keeps the same code and the same total, so it shows as no change. Read findings.csv for that.
    # -o suppresses the readable output entirely, hence two passes — both only re-read JSON
    # already on disk.
    sarif diff '{{ previous }}' "$out/sarif" | tee "$out/diff.txt"
    sarif diff -o "$out/diff.json" '{{ previous }}' "$out/sarif" > /dev/null

# Pin the current SARIF run as a named reference point. Usage: just audit-snapshot before-refactor
audit-snapshot name:
    #!/usr/bin/env bash
    set -euo pipefail
    out='{{ AUDIT_CODE_OUT }}'
    # sarif-prev/ is rotated by audit-code on every run, so a pin parked there would not survive.
    [ '{{ name }}' != 'prev' ] || { printf "{{ RED }}'prev' is taken by the automatic rotation — pick another name.{{ NC }}\n"; exit 1; }
    rm -rf "$out/sarif-{{ name }}"
    cp -r "$out/sarif" "$out/sarif-{{ name }}"
    printf "{{ GREEN }}Pinned → %s/sarif-{{ name }}/  (just audit-diff %s/sarif-{{ name }}){{ NC }}\n" "$out" "$out"

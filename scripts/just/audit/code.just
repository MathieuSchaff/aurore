# Static code-quality audit (no Docker / no DB): knip + biome + tsc + cycles + fallow + anon-db-gate + react-doctor.

AUDIT_CODE_OUT := '.audit-out/code'

# Plain bash (no -e, no pipefail) keeps every report being written when one probe fails, but a
# bare "Done" then reads as a clean audit: knip and cycles both exited 1 under a "Done" once.
[doc('Full code audit: probes, then the map and the HTML/CSV reports, opened in a browser. NO_OPEN=1 skips the window.')]
[group('audit')]
[script('bash')]
audit-code:
    # Each probe records its own status (PIPESTATUS[0], since tee would otherwise mask it) and
    # the summary names the failures. Exit stays 0: knip and react-doctor exit 1 on findings
    # that are triaged, not blocking.
    #
    # raw/ is the audit: every probe writes there and nothing outside the repo toolchain is
    # needed to read it. sarif/ and json/ are what `just audit-report` renders from. A probe with
    # no machine-readable format keeps raw/ as its single output rather than getting a hand-rolled
    # converter.
    repo="$PWD"
    out='{{ AUDIT_CODE_OUT }}'
    mkdir -p "$out"/raw "$out"/json
    # Wipe rather than overwrite, so a probe that fails to write leaves a gap instead of last run's
    # file passing for fresh output. There is no sarif-prev/ any more: nothing compared two runs
    # once the `new` marking was dropped.
    rm -rf "$out/sarif" "$out/sarif-prev"
    mkdir -p "$out"/sarif
    # sarif-full/ holds the fallow runs without their baseline: the standing debt the report
    # shows behind a "0 regressions". Wiped rather than rotated: it is a snapshot of a backlog,
    # and a backlog compared against itself says nothing the baselined sarif/ does not already say.
    rm -rf "$out/sarif-full"
    mkdir -p "$out"/sarif-full
    # Reports used to land flat in .audit-out/, so leaving them behind means reading a stale
    # run by mistake. Named one by one: a glob would take .audit-out/inci/ with it.
    rm -f .audit-out/{knip,biome,tsc,cycles,health,dupes,anon-db-gate,react-doctor}.txt
    failed=()
    nosarif=()
    statuses=()
    # Exit codes are persisted, not only printed: a probe that died reported nothing, and the
    # report has to say so rather than render its absence as a clean section.
    record() {
        statuses+=("{\"probe\":\"$1\",\"exit\":$2}")
        [ "$2" -eq 0 ] || failed+=("$1")
    }
    check_sarif() { [ -s "$1" ] || nosarif+=("$(basename "$1" .sarif)"); }
    printf "{{ CYAN }}=== knip (dead code/exports/deps) ==={{ NC }}\n"
    just knip 2>&1 | tee "$out/raw/knip.txt"
    record knip ${PIPESTATUS[0]}
    # Second run instead of one repeated --reporter: knip writes every reporter to the same
    # stdout, so asking for compact and sarif at once interleaves them into invalid JSON.
    just knip "" sarif > "$out/sarif/knip.sarif" 2>/dev/null
    check_sarif "$out/sarif/knip.sarif"
    printf "{{ CYAN }}=== biome (lint + unused locals) ==={{ NC }}\n"
    just lint 2>&1 | tee "$out/raw/biome.txt"
    record biome ${PIPESTATUS[0]}
    # --reporter-file writes the report *instead of* stdout, so this cannot be folded into
    # `just lint` without losing the human output. Biome runs in under a second.
    bunx biome check . --reporter=sarif --reporter-file="$out/sarif/biome.sarif" >/dev/null 2>&1
    check_sarif "$out/sarif/biome.sarif"
    printf "{{ CYAN }}=== tsc -b (types) ==={{ NC }}\n"
    bunx tsc -b --pretty false 2>&1 | tee "$out/raw/tsc.txt"
    record tsc ${PIPESTATUS[0]}
    printf "{{ CYAN }}=== madge (cycles) ==={{ NC }}\n"
    just cycles 2>&1 | tee "$out/raw/cycles.txt"
    record cycles ${PIPESTATUS[0]}
    printf "{{ CYAN }}=== fallow health (complexity/CRAP/CSS) ==={{ NC }}\n"
    # Without a baseline the repo's ~200 standing complexity findings make this exit 1 forever,
    # so the gate says nothing. With one, it fails only on regressions. Baselines live in the
    # gitignored .fallow/ (run `just fallow-baseline`), so a fresh clone falls back to absolute
    # mode. Not passing --coverage here on purpose: it adds exact per-function CRAP findings the
    # baseline was not recorded with, which reads as a regression. Use it ad hoc, or regenerate
    # the baseline with the same flag.
    #
    # --css is on the JSON pass only. Its findings cannot be baselined: the baseline file stores
    # complexity_*/crap_* counts and refactoring targets, so `--save-baseline --css` writes a
    # byte-identical file and the styling findings come back as regressions on every single run
    # (measured: 162 on fallow 3.10.0). Baselined they would be a permanent wall, and would pin
    # the text probe's exit code at 1 forever. They stay out of sarif-full/ too, where they
    # outnumbered the code debt 162 to 154; the JSON carries them with a severity, a confidence
    # and an agent disposition the SARIF export drops anyway.
    health_args=()
    [ -f .fallow/audit-health.json ] && health_args+=(--baseline .fallow/audit-health.json)
    npx fallow health "${health_args[@]}" 2>&1 | tee "$out/raw/health.txt"
    record fallow-health ${PIPESTATUS[0]}
    # --sarif-file claims to write "in addition to" the primary format, but is a no-op in
    # fallow 3.10.0: it silently writes nothing. --output-file does work, hence a second run.
    # Same baseline as the text run: without it the SARIF carried all ~200 standing findings, so
    # the report was the same immutable wall every run and nothing could ever read as new. The
    # standing list is not lost: the sarif-full/ pass below keeps it.
    npx fallow health "${health_args[@]}" --format sarif --quiet --output-file "$out/sarif/fallow-health.sarif" >/dev/null 2>&1
    check_sarif "$out/sarif/fallow-health.sarif"
    # Third pass, baseline-free, only when there is a baseline to subtract. Its findings never
    # reach sarif/ (they would drown the regressions again), but the report needs them to tell
    # "clean" apart from "0 new on top of a backlog you accepted".
    if [ ${#health_args[@]} -ne 0 ]; then
        npx fallow health --format sarif --quiet --output-file "$out/sarif-full/fallow-health.sarif" >/dev/null 2>&1
    fi
    # The SARIF export carries the complexity findings and the refactoring targets, and drops the
    # rest of what health computes: the score with its penalty breakdown, the vital signs, and the
    # churn-weighted hotspots (the one ranking that says which complex file is also being edited
    # every week), plus the css_analytics block. Baseline-free on purpose: a score and a hotspot are
    # absolute state, not a delta.
    npx fallow health --css --format json --quiet --output-file "$out/json/fallow-health.json" >/dev/null 2>&1
    printf "{{ CYAN }}=== fallow dupes ==={{ NC }}\n"
    dupes_args=()
    [ -f .fallow/audit-dupes.json ] && dupes_args+=(--baseline .fallow/audit-dupes.json)
    npx fallow dupes "${dupes_args[@]}" 2>&1 | tee "$out/raw/dupes.txt"
    record fallow-dupes ${PIPESTATUS[0]}
    npx fallow dupes "${dupes_args[@]}" --format sarif --quiet --output-file "$out/sarif/fallow-dupes.sarif" >/dev/null 2>&1
    check_sarif "$out/sarif/fallow-dupes.sarif"
    if [ ${#dupes_args[@]} -ne 0 ]; then
        npx fallow dupes --format sarif --quiet --output-file "$out/sarif-full/fallow-dupes.sarif" >/dev/null 2>&1
    fi
    printf "{{ CYAN }}=== anon-db-gate (anonDb surface) ==={{ NC }}\n"
    just anon-db-gate 2>&1 | tee "$out/raw/anon-db-gate.txt"
    record anon-db-gate ${PIPESTATUS[0]}
    printf "{{ CYAN }}=== react-doctor (React patterns/a11y/perf) ==={{ NC }}\n"
    # Version comes from frontend/package.json (react-doctor dependency). No pin here.
    (cd frontend && npx react-doctor --verbose --no-score 2>&1) | tee "$out/raw/react-doctor.txt"
    record react-doctor ${PIPESTATUS[0]}
    # react-doctor has no SARIF reporter, so the JSON report is converted after the fact; its
    # findings are the freshest of any probe here and belong in the HTML, not only in raw/.
    # --json-out takes an absolute path because of the subshell cd. The JSON is a temp file, not
    # an output: the converter reads it once and nothing else ever does.
    rd_json="$(mktemp -t react-doctor-XXXXXX.json)"
    (cd frontend && npx react-doctor --verbose --no-score --json --json-out "$rd_json" >/dev/null 2>&1)
    bun scripts/react-doctor-sarif.ts "$rd_json" "$out/sarif/react-doctor.sarif" >/dev/null 2>&1
    rm -f "$rd_json" "$out/json/react-doctor.json"
    check_sarif "$out/sarif/react-doctor.sarif"
    printf '[%s]\n' "$(IFS=,; printf '%s' "${statuses[*]}")" > "$out/status.json"
    if [ ${#failed[@]} -eq 0 ]; then
        printf "{{ GREEN }}Done, every probe exited clean. Reports → %s/raw/{{ NC }}\n" "$out"
    else
        printf "{{ YELLOW }}Done, but %d probe(s) exited non-zero: %s{{ NC }}\n" "${#failed[@]}" "${failed[*]}"
        printf "{{ YELLOW }}Read the matching %s/raw/ report before calling this run clean.{{ NC }}\n" "$out"
    fi
    if [ ${#nosarif[@]} -ne 0 ]; then
        printf "{{ YELLOW }}No SARIF written for: %s. The report will be short by that much.{{ NC }}\n" "${nosarif[*]}"
    fi
    just audit-report
    exit 0

[doc('Rebuild the map and the report from the probe output already on disk, then open both. NO_OPEN=1 writes them without a browser window.')]
[group('audit')]
[script]
audit-report:
    out='{{ AUDIT_CODE_OUT }}'
    if [ ! -d "$out/sarif" ]; then
        printf "{{ RED }}No %s/sarif/. Run 'just audit-code' first.{{ NC }}\n" "$out"
        exit 1
    fi
    printf "{{ CYAN }}=== fallow viz (codebase map) ==={{ NC }}\n"
    # Ships with fallow, costs ~200ms, and is the only view of the repo that shows shape rather
    # than a list: a treemap and an import graph recoloured by dead code, duplication, boundaries
    # and complexity. --no-open because the browser window is opened once, at the end, for both
    # pages at a time.
    npx fallow viz --no-open --out "$out/map.html" 2>&1 | tail -1
    # Own generator instead of `sarif html`: sarif-tools grouped by rule code and dropped the
    # location, so its page could name a finding but never open it. See scripts/audit-report.ts.
    bun scripts/audit-report.ts "$out"
    # Leftovers from the sarif-tools era: two generated pages, the removed diff, and findings.csv.
    # Removed rather than kept, so a stale file cannot be mistaken for this run's output. Nothing
    # in the repo read the CSV, and dropping it drops the last dependency outside the toolchain.
    rm -f "$out/code.html" "$out/complexity.html" "$out/diff.txt" "$out/diff.json" "$out/findings.csv"
    printf "{{ GREEN }}%s/report.html{{ NC }} · %s/summary.json (agent-readable)\n" "$out" "$out"
    # Opening is the default because an audit nobody looks at is an audit nobody ran. NO_OPEN is
    # for the cases with no browser to open into: an agent, a CI job, a remote shell.
    if [ -z "${NO_OPEN:-}" ]; then
        xdg-open "$out/report.html" 2>/dev/null
        xdg-open "$out/map.html" 2>/dev/null
    fi
    exit 0

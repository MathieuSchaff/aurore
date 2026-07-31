# Static code-quality audit (no Docker / no DB): knip + biome + tsc + cycles + fallow + react-doctor.

# Full code audit (knip + biome + tsc + cycles + fallow health/dupes + react-doctor). Reports → .audit-out/
audit-code:
    #!/usr/bin/env bash
    # set +e keeps every report being written when one probe fails, but a bare "Done" then
    # reads as a clean audit: knip and cycles both exited 1 under a "Done" once. Each probe
    # records its own status (PIPESTATUS[0], since tee would otherwise mask it) and the
    # summary names the failures. Exit stays 0 — knip and react-doctor exit 1 on findings
    # that are triaged, not blocking.
    set +e
    mkdir -p .audit-out
    failed=()
    printf "{{ CYAN }}=== knip (dead code/exports/deps) ==={{ NC }}\n"
    just knip 2>&1 | tee .audit-out/knip.txt
    [ ${PIPESTATUS[0]} -eq 0 ] || failed+=("knip")
    printf "{{ CYAN }}=== biome (lint + unused locals) ==={{ NC }}\n"
    just lint 2>&1 | tee .audit-out/biome.txt
    [ ${PIPESTATUS[0]} -eq 0 ] || failed+=("biome")
    printf "{{ CYAN }}=== tsc -b (types) ==={{ NC }}\n"
    bunx tsc -b --pretty false 2>&1 | tee .audit-out/tsc.txt
    [ ${PIPESTATUS[0]} -eq 0 ] || failed+=("tsc")
    printf "{{ CYAN }}=== madge (cycles) ==={{ NC }}\n"
    just cycles 2>&1 | tee .audit-out/cycles.txt
    [ ${PIPESTATUS[0]} -eq 0 ] || failed+=("cycles")
    printf "{{ CYAN }}=== fallow health (complexity/CRAP) ==={{ NC }}\n"
    npx fallow health 2>&1 | tee .audit-out/health.txt
    [ ${PIPESTATUS[0]} -eq 0 ] || failed+=("fallow-health")
    printf "{{ CYAN }}=== fallow dupes ==={{ NC }}\n"
    npx fallow dupes 2>&1 | tee .audit-out/dupes.txt
    [ ${PIPESTATUS[0]} -eq 0 ] || failed+=("fallow-dupes")
    printf "{{ CYAN }}=== react-doctor (React patterns/a11y/perf) ==={{ NC }}\n"
    # Version comes from frontend/package.json (react-doctor dependency) — no pin here.
    (cd frontend && npx react-doctor --verbose --no-score 2>&1) | tee .audit-out/react-doctor.txt
    [ ${PIPESTATUS[0]} -eq 0 ] || failed+=("react-doctor")
    if [ ${#failed[@]} -eq 0 ]; then
        printf "{{ GREEN }}Done, every probe exited clean. Reports → .audit-out/{{ NC }}\n"
    else
        printf "{{ YELLOW }}Done, but %d probe(s) exited non-zero: %s{{ NC }}\n" "${#failed[@]}" "${failed[*]}"
        printf "{{ YELLOW }}Read the matching .audit-out/ report before calling this run clean.{{ NC }}\n"
    fi

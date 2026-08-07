# Code audit

Static analysis and bundle analysis. No Docker, no DB.

## Everything at once

| Command | What |
| :--- | :--- |
| `just audit-code` | The whole thing: probes, then the HTML/CSV reports, then the diff against the previous run |
| `OPEN=1 just audit-code` | Same, and opens the two HTML reports at the end |

That is the only command to remember. It runs knip, biome, `tsc -b`, madge, fallow health, fallow
dupes, anon-db-gate and react-doctor in that order, then calls `audit-report` and `audit-diff`
itself — both degrade to a message when their prerequisites are missing, so neither can break the
run.

It never aborts mid-run: each probe records its own status and the summary names the failures.
Exit stays 0 — knip and react-doctor exit 1 on findings that are triaged, not blocking. A bare
"Done" is not a clean audit; read the summary line.

### Where the output lands

```
.audit-out/code/
├── raw/         knip biome tsc cycles health dupes anon-db-gate react-doctor  (.txt)
├── sarif/       biome knip fallow-health fallow-dupes                          (.sarif)
├── sarif-prev/  the same four, from the run before — rotated automatically
├── json/        react-doctor.json
├── code.html · complexity.html · findings.csv        written by audit-report
└── diff.txt · diff.json                              written by audit-diff
```

**`raw/` is the audit.** Every probe writes there and reading it needs nothing beyond the repo
toolchain. `sarif/` and `json/` are a bonus for the reporting recipes below; a probe with no
machine-readable format (`tsc`, madge, `anon-db-gate`) lives in `raw/` only.

Each tool that has both formats runs twice, because none of them emits two formats in one pass:
Biome's `--reporter-file` and react-doctor's `--json-out` write *instead of* stdout. Every probe
runs in under two seconds, so the second pass costs about five seconds over the whole audit.

## The steps on their own

`audit-code` calls these itself. Run them by hand only to redo a step without re-probing —
regenerating the HTML or re-reading a diff costs nothing, since all three only re-read JSON
already on disk.

| Command | What |
| :--- | :--- |
| `just audit-report` | Aggregates `sarif/` into `code.html`, `complexity.html`, `findings.csv` |
| `just audit-open` | `xdg-open` on both HTML reports |
| `just audit-diff [dir]` | Compares `sarif/` against `sarif-prev/` by default, or any pinned run |
| `just audit-snapshot <name>` | Pins `sarif/` as `sarif-<name>/`, to diff against much later |

`audit-report`, `audit-open` and `audit-diff` are the only parts that need a tool outside the
repo: `uv tool install sarif-tools` (or `pipx`). Without it they print an install hint and exit 0.

### How the comparison finds a previous run

There is no snapshot step to remember. `audit-code` rotates `sarif/` to `sarif-prev/` *before*
probing — what sits in `sarif/` at that moment is by definition the previous run. The move also
empties `sarif/`, so a probe that fails to write leaves a gap instead of last run's file passing
for fresh output. The first ever run has no `sarif-prev/` and skips the diff.

`audit-snapshot <name>` is for the other case: pinning a reference point you choose (before a big
refactor, say) that the per-run rotation must not overwrite. `prev` is rejected as a name for
exactly that reason.

`audit-diff` prints to the terminal and writes `diff.txt`; `diff.json` carries the same data
structured. Two passes, because `sarif diff -o` suppresses the readable output entirely.

**Its grain is the rule code, not the site.** The `+N/-N` headline counts rule codes that appeared
or disappeared; a code that survives with a different count gets its own `20 -> 18` line below,
which the headline does not reflect — read the lines, not the total. A finding that *moves* from
one file to another keeps its code and its count, so it shows as no change at all. For that,
compare `findings.csv` between runs: it carries the location.

Three things worth knowing before trusting the HTML:

- **Two reports, not one, on purpose.** fallow contributes over half the findings and its
  severities are complexity bands, so a merged report buries the handful of real Biome and knip
  errors under a wall of CRAP scores.
- **`sarif html` groups by rule and drops the per-finding message.** It labels each group from
  the *first* finding's message, which renders fallow's quoted function names as `' ...`.
  `findings.csv` keeps the message — that is the file to grep.
- **fallow's `--sarif-file` is a no-op** in 3.10.0. It is documented as writing "in addition to"
  the primary format and silently writes nothing; `--output-file` is what works.

## One tool at a time

| Command | Tool | What it is good at |
| :--- | :--- | :--- |
| `just knip [flags] [reporter]` | knip | Dead files, exports, types, deps. Re-export aware, follows the workspace symlink. `--strict` also reports unlisted deps and types-only issues. Second positional picks the reporter — `just knip "" sarif` is what `audit-code` calls, since repeating `--reporter` interleaves both formats into the same stdout |
| `just lint` / `just lint-fix` | Biome | Lint, unused locals, format. `lint-fix` writes |
| `just ts-verify` | `tsc -b` | Type errors across project references |
| `just cycles` | madge | Import cycles. Type-only imports ignored via `.madgerc`; seed blog data excluded |
| `npx fallow health` | fallow | Complexity, hotspots, CRAP score |
| `npx fallow dupes` | fallow | Duplication (suffix array) |
| `npx fallow audit --format compact` | fallow | New issues versus `main` only |
| `just fallow-baseline` | fallow | Re-save the baselines after a big cleanup |
| `just anon-db-gate [--update]` | own script | Freezes the `c.get('anonDb')` surface against `scripts/anon-db-allowlist.json`. Also runs in CI |
| `cd frontend && npx react-doctor --verbose --no-score` | react-doctor | React patterns, a11y, perf |
| `bunx biome format --write .` | Biome | Format only (`just lint-fix` already includes it) |

Two notes that save a triage round:

- **madge over-reports.** Every new hit needs an individual check — lazy imports and erased
  type edges can read as runtime cycles.
- **`fallow dead-code` globally is not used here.** It is blind across workspaces; knip covers
  that ground with far fewer false positives.
- **`anon-db-gate` fails on a site that disappears too**, not only on a new one: the grain is
  file + count, and a count that no longer matches means the list has rotted. `--update`
  re-baselines and parks unknown files on group `?`, which keeps failing until they are classified.

## Bundle analysis

The tracked `frontend/vite.config.ts` already carries all three tools. No separate config, no
`--config` flag — everything is gated by `ANALYZE` or by the dev server.

| Tool | Command | Output | Gate |
| :--- | :--- | :--- | :--- |
| Inspect | `cd frontend && bunx vite` | `http://localhost:5173/__inspect/` | dev server |
| visualizer | `cd frontend && ANALYZE=1 bunx vite build` | `frontend/stats.html` (gzip + brotli treemap) | `ANALYZE` |
| devtools | `cd frontend && ANALYZE=1 bunx vite build` | panel on `http://localhost:9999` | dev server or `ANALYZE` |

`ANALYZE=1 bunx vite build` is **one** build with **three** outputs: the gzip column in the
terminal, the `stats.html` treemap, and the devtools panel.

| Fact | Detail |
| :--- | :--- |
| Inspect shows | Each plugin's output per module (`tanstackStart`, babel, …) |
| devtools shows | Rolldown module graph, why a module landed in a chunk, chunking, perf |
| The build does not exit | While the devtools server runs. Kill it with `fuser -k 9999/tcp` |
| Inspect is off in preview | `vite preview` serves a frozen build, so transform inspection is meaningless there |
| Without `ANALYZE` | Normal and prod builds emit no `stats.html` and no panel — that gate is what keeps `profile-prod` and CI working |

Build output lives in `frontend/.output/` (`public/` + `server/`), not `dist/`.

## Comparing against prod

`just profile-prod` serves the built SSR frontend behind a real nginx edge (HTTP/2 + TLS) —
see [dev-stack.md](dev-stack.md).

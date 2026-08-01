# Code audit

Static analysis and bundle analysis. No Docker, no DB.

## Everything at once

| Command | What | Output |
| :--- | :--- | :--- |
| `just audit-code` | knip, biome, `tsc -b`, madge, fallow health, fallow dupes, react-doctor, in that order | `.audit-out/{knip,biome,tsc,cycles,health,dupes,react-doctor}.txt` |

It never aborts mid-run: each probe records its own status and the summary names the failures.
Exit stays 0 — knip and react-doctor exit 1 on findings that are triaged, not blocking. A bare
"Done" is not a clean audit; read the summary line.

## One tool at a time

| Command | Tool | What it is good at |
| :--- | :--- | :--- |
| `just knip [flags]` | knip | Dead files, exports, types, deps. Re-export aware, follows the workspace symlink. `--strict` also reports unlisted deps and types-only issues |
| `just lint` / `just lint-fix` | Biome | Lint, unused locals, format. `lint-fix` writes |
| `just ts-verify` | `tsc -b` | Type errors across project references |
| `just cycles` | madge | Import cycles. Type-only imports ignored via `.madgerc`; seed blog data excluded |
| `npx fallow health` | fallow | Complexity, hotspots, CRAP score |
| `npx fallow dupes` | fallow | Duplication (suffix array) |
| `npx fallow audit --format compact` | fallow | New issues versus `main` only |
| `just fallow-baseline` | fallow | Re-save the baselines after a big cleanup |
| `cd frontend && npx react-doctor --verbose --no-score` | react-doctor | React patterns, a11y, perf |
| `bunx biome format --write .` | Biome | Format only (`just lint-fix` already includes it) |

Two notes that save a triage round:

- **madge over-reports.** Every new hit needs an individual check — lazy imports and erased
  type edges can read as runtime cycles.
- **`fallow dead-code` globally is not used here.** It is blind across workspaces; knip covers
  that ground with far fewer false positives.

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

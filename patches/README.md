# Dependency patches

Bun applies these patches during `bun install --frozen-lockfile`. Every Docker dependency
stage copies this directory before installing. The package versions remain unchanged.

| Patch | Purpose |
| :--- | :--- |
| [vite@8.2.0.patch](vite@8.2.0.patch) | Release connections accepted by Vite's temporary TCP port checks so HTTP readiness probes cannot stall startup. |
| [@tanstack/router-core@1.171.15.patch](@tanstack%252Frouter-core@1.171.15.patch) | Finalize initial non-SSR route loads that finish before React mounts its transition observer. |

## Initial non-SSR route hydration

Router hydration starts loading client-only routes before React mounts `Transitioner`.
If loading finishes first, that component never observes the pending state and leaves the
router pending without a resolved location. The page renders, but navigation progress and
listeners waiting for `onRendered` remain blocked.

The patch shares the existing SPA load finalizer with non-SSR routes. SPA pending UI stays
scoped to SPA mode; full SSR hydration keeps its existing path. Both runtime module formats
and the TypeScript source carry the same change. React still emits `onRendered` after commit,
where the router restores scroll.

`frontend/e2e/hydration-guard.spec.ts` holds React mounting until the actual initial load
finishes, then checks route readiness, progress removal and a real click. Before removing
this patch during a dependency update, run that guard across the three browser engines,
the collection formula flow, navigation/scroll checks and the production auth SSR guard.

## Vite port checks

Vite checks wildcard addresses before binding its HTTP server. On Bun, a readiness probe can
connect before the temporary server's `listening` callback calls `close`. That callback waits
for existing connections to end, but the probe waits for an HTTP response the TCP check never
sends. This affects both curl and Playwright's readiness request.

The patch destroys connections only on the temporary check server. It preserves port-conflict
detection and the real HTTP server. When updating Vite, verify startup while HTTP probes arrive
during the port check before removing or updating this patch.

References: [Vite port-check source](https://github.com/vitejs/vite/blob/v8.2.0/packages/vite/src/node/http.ts),
[Bun dependency patches](https://bun.com/docs/pm/cli/patch).

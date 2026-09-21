# Dependency patches

Bun applies these patches during `bun install --frozen-lockfile`. Every Docker dependency
stage copies this directory before installing. The package versions remain unchanged.

| Patch | Purpose |
| :--- | :--- |
| [vite@8.2.0.patch](vite@8.2.0.patch) | Release connections accepted by Vite's temporary TCP port checks so HTTP readiness probes cannot stall startup. |

Vite checks wildcard addresses before binding its HTTP server. On Bun, a readiness probe can
connect before the temporary server's `listening` callback calls `close`. That callback waits
for existing connections to end, but the probe waits for an HTTP response the TCP check never
sends. This affects both curl and Playwright's readiness request.

The patch destroys connections only on the temporary check server. It preserves port-conflict
detection and the real HTTP server. When updating Vite, verify startup while HTTP probes arrive
during the port check before removing or updating this patch.

References: [Vite port-check source](https://github.com/vitejs/vite/blob/v8.2.0/packages/vite/src/node/http.ts),
[Bun dependency patches](https://bun.com/docs/pm/cli/patch).

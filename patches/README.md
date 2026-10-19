# Dependency patches

Bun applies these patches during `bun install --frozen-lockfile`. Every Docker dependency
stage copies this directory before installing. The package versions remain unchanged.

| Patch | Purpose |
| :--- | :--- |
| [vite@8.2.0.patch](vite@8.2.0.patch) | Release connections accepted by Vite's temporary TCP port checks so HTTP readiness probes cannot stall startup. |

## Initial non-SSR route hydration

The former router-core 1.171.15 patch fixed a load that completed before React mounted
`Transitioner`. The route stayed pending without a resolved location, so progress and
listeners waiting for `onRendered` remained blocked even though the data was ready.

With router-core 1.171.34, hydration lives in `load-client.ts`. The core finalizes loads
without a mounted React observer; `Transitioner` acknowledges rendering after mounting.
Normal client-only hydration starts its load at mount. The old patch targets files that
no longer exist and is retired rather than renamed. No router patch is currently applied.

`frontend/e2e/hydration-guard.spec.ts` explicitly completes a real `router.load()` before
mounting React. It checks idle state and resolved location before mount, then rendered
readiness, progress removal, scroll and a real click. Its other guards cover scroll before
the first rendered route and a document still waiting for CSS. Keep these checks across
Chromium, Firefox and WebKit when updating Router, alongside collection/formula flows and
the production auth SSR guard. Do not write internal router stores from an E2E helper.

## Router and Query upgrade compatibility

The security-fixed group uses Start 1.168.60, React Router 1.170.41, router-core 1.171.34
and start-server-core 1.169.39. Seroval and seroval-plugins are pinned to 1.6.7. Router CLI
1.167.40 keeps its generator on the same core version.

SSR Query integration must also follow the new lifecycle. Version 1.167.1 calls the removed
`serverSsr.isDehydrated` method through its core adapter, despite broad peer ranges. Aurore
uses React SSR Query 1.167.3 with its core 1.169.3 and the minimum required Query 5.102.0.
The 1.167.3 patch also cancels failed hydration streams and releases their readers.

Keeping core 1.171.15 through an override is incompatible with the corrected server core,
which expects newer exports including `defaultSerovalDeserializerPlugins`. The historical
hydration patch did not address the server-function security advisory.

References: [Start dependencies](https://registry.npmjs.org/@tanstack/react-start/1.168.60),
[SSR Query dependencies](https://registry.npmjs.org/@tanstack/react-router-ssr-query/1.167.3),
[SSR Query core dependencies](https://registry.npmjs.org/@tanstack/router-ssr-query-core/1.169.3),
[TanStack security advisory](https://github.com/TanStack/router/security/advisories/GHSA-qx66-fv34-fjm8).

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

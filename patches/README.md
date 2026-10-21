# Dependency patches

No dependency patches are currently applied. This directory records compatibility
decisions and remains available to Docker dependency stages. Frozen installs use the
unmodified registry packages at the versions retained in `bun.lock`.

When removing the former Vite patch from an existing checkout, run
`bun install --frozen-lockfile --force`: a plain frozen install can leave the
previously patched file in place. Verify it against a clean installation.

## Dependency resolution without global overrides

The frontend declares Babel core 7.29.7 directly to satisfy the Babel plugin's peer
dependency without allowing it to select Babel 8. Istanbul resolves its own Babel 8.0.7
through its declared dependency. Neither branch needs a Babel override.

PostCSS 8.5.31, Nano ID 3.3.20, Undici 8.12.3 and Drizzle Kit's esbuild 0.25.12
also resolve within their consumers' declared ranges without overrides. Their existing
versions remain in `bun.lock`; use a frozen install to reproduce the qualified graph.
The separate esbuild override for the legacy esbuild-kit loader remains an exception
outside that loader's declared range.

Vite, brace-expansion, fast-uri, js-yaml, seroval, seroval-plugins and tsx also
resolve without overrides. Removing their seven overrides preserves every package
entry, integrity and dependency relationship in the existing lockfile. The frontend
still pins Vite 8.3.4 directly; its former TCP patch has been retired.
Only the ts-morph and legacy esbuild-kit exceptions remain in the root manifest.
Keep frozen installs: regenerating the full graph can update unrelated packages.

## Initial non-SSR route hydration

The former router-core 1.171.15 patch fixed a load that completed before React mounted
`Transitioner`. The route stayed pending without a resolved location, so progress and
listeners waiting for `onRendered` remained blocked even though the data was ready.

With router-core 1.171.38, hydration lives in `load-client.ts`. The core finalizes loads
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

The current group pins Start 1.169.3, React Router 1.170.45 and router-core 1.171.38,
with start-server-core 1.169.44. Router CLI 1.167.45 keeps its generator on the same core
version. React Query and its DevTools are both pinned to 5.104.5; Router DevTools uses
1.167.2. Exact DevTools versions keep their peer requirements aligned with the app.
Seroval and seroval-plugins remain locked together at 1.6.12. Bun 1.4.3, Vite 8.3.4 and Nitro
nightly 3.0.1-20261017-153525-59940084 support this group without an application API migration.

SSR Query integration must also follow the new lifecycle. Version 1.167.1 calls the removed
`serverSsr.isDehydrated` method through its core adapter, despite broad peer ranges. Aurore
uses React SSR Query 1.167.3 with its core 1.169.3 and Query 5.104.5 (minimum 5.102.0).
The 1.167.3 patch also cancels failed hydration streams and releases their readers.

Keeping core 1.171.15 through an override is incompatible with the corrected server core,
which expects newer exports including `defaultSerovalDeserializerPlugins`. The historical
hydration patch did not address the server-function security advisory.

References: [Start dependencies](https://registry.npmjs.org/@tanstack/react-start/1.169.3),
[Router release](https://github.com/TanStack/router/releases/tag/release-2026-10-16-2111),
[SSR Query dependencies](https://registry.npmjs.org/@tanstack/react-router-ssr-query/1.167.3),
[SSR Query core dependencies](https://registry.npmjs.org/@tanstack/router-ssr-query-core/1.169.3),
[TanStack security advisory](https://github.com/TanStack/router/security/advisories/GHSA-qx66-fv34-fjm8).

## Vite port checks

Vite checks wildcard addresses before binding its HTTP server. Older Bun versions could
accept an HTTP readiness probe before emitting `listening`. Closing the temporary TCP
server then waited for that probe, which waited for an HTTP response the check never sent.
The former patch destroyed connections accepted by this temporary server.

Bun fixed the event ordering in PR #40041. The fix is present from Bun 1.4.1, including
the pinned 1.4.3 runtime. A fixture that delays `listening` until after a connection is
accepted still reproduces the old sequence, but overrides the repaired runtime ordering.
It does not establish that the race persists during normal startup.

The patch was retired after qualifying the real Aurore E2E stack with Bun 1.4.3 and
Vite 8.3.4: five patched and twenty unpatched starts under eight concurrent HTTP probes,
with no HTTP read timeout. Both variants reject an occupied port. The unpatched stack
also passes all 209 Playwright cases with four workers, no retries and no skipped cases.
Keep concurrent readiness probes and an occupied-port check when changing this runtime pair.

References: [Vite port-check source](https://github.com/vitejs/vite/blob/v8.3.4/packages/vite/src/node/http.ts),
[Bun ordering fix](https://github.com/oven-sh/bun/pull/40041),
[Bun 1.4.3 networking source](https://github.com/oven-sh/bun/blob/bun-v1.4.3/src/js/node/net.ts).

## Vite and Nitro upgrade compatibility

Vite 8.3.4 requires the optional DevTools peer `^0.7.1`. Version 0.4.12 lacks
`isDevToolsEnabled`, so it fails when Vite enables its integration. Aurore pins
`@vitejs/devtools`, `@vitejs/devtools-vite` and `@vitejs/devtools-rolldown` to 0.7.6.
DevTools 0.8.0 falls outside Vite's peer range. Keep the existing Bun gate on the
separate dev panel until its WebSocket adapter is verified on that runtime.

Nitro remains an exact nightly alias. The later October 17 build satisfies the three-day
release-age policy. The Bun preset, development `/api/**` proxy and production
`.output/server/index.mjs` entry remain in use. Removed auto-imports and changes to
cache/storage APIs do not require application changes because Aurore does not use them.
The later build changes Vercel runtime inference; Aurore keeps its explicit Bun preset.

References: [Vite metadata](https://registry.npmjs.org/vite/8.3.4),
[DevTools metadata](https://registry.npmjs.org/@vitejs/devtools/0.7.6),
[Nitro migration guide](https://nitro.build/docs/migration).

## Undici for jsdom

The lockfile retains Undici 8.12.3, within jsdom 30.1.3's declared `^8.12.1`
range, without an override. The former 7.30.1 override forced an incompatible major into that consumer.
Undici is used only by development tooling, with no application imports. Version
8.12.3 was qualified under the explicit October 21 release-age exception.
The permanent `minimumReleaseAge = 259200` policy remains unchanged.

Vitest runs through its Node launcher. Undici 8 requires Node >=22.19.0; jsdom's
own Node requirement is stricter. Verify the two jsdom environment suites and
network resource loading when updating this resolution. Bun substitutes its native
`undici` module for a bare import; a Bun probe must load the npm entry by absolute
path to test the installed package. No application fetch implementation changes.

References: [Undici metadata](https://registry.npmjs.org/undici/8.12.3),
[jsdom metadata](https://registry.npmjs.org/jsdom/30.1.3),
[Undici 8 changes](https://github.com/nodejs/undici/releases/tag/v8.0.0).

## Native tinyglobby in ts-morph

The root override pins `ts-morph` to 27.0.2 for hono-docs, its only consumer.
This release uses `@ts-morph/common` 0.28.1 and tinyglobby natively, so the
fast-glob alias and the common 0.27.0 compatibility patch are retired.
The fast-glob / micromatch / braces chain stays absent from the dependency graph.

hono-docs 1.4.0 still declares `ts-morph: ^26.0.0`. This override is an explicit
exception outside that range, qualified by regenerating the complete OpenAPI document
without cache and comparing parsed JSON. Remove it when hono-docs declares a compatible
version using tinyglobby. Do not override `@ts-morph/common` independently: ts-morph
and common share a bundled TypeScript compiler and must stay aligned.

When updating hono-docs or this override, regenerate with `--no-cache`, compare the
OpenAPI document and check that fast-glob, micromatch and braces remain absent.
Run both full and production dependency audits. A clean frozen install must resolve
the same ts-morph/common pair and the unmodified Vite package.

Rollback requires restoring the former ts-morph/common patch, its registration,
the fast-glob alias and the matching lockfile together. Removing this override alone
would bring back the vulnerable braces branch. Vite's patch retirement is independent
of this ts-morph rollback.

References: [ts-morph 27 native tinyglobby migration](https://github.com/dsherret/ts-morph/releases/tag/27.0.0),
[hono-docs dependencies](https://github.com/rcmade/hono-docs/blob/main/package.json),
[braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

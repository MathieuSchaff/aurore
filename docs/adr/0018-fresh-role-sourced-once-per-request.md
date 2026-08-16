---
date: 2026-08-17
accepted: 2026-08-17
---

# The fresh DB role is sourced once per request in `withRlsContext`, not only at the two gates

Supersedes [ADR-0008](0008-role-demotion-enforced-fresh-at-gates.md), which chose option B3 (fresh
read inside `requireCatalogWrite` and `requireContentModerator` only) and recorded option B2
(source the role once per request in `withRlsContext`) as *Rejected (still too broad)*. B2 is what
the code does now. This ADR records why the rejection no longer holds and why B3 alone could not
close the window it was written for.

## Why

- **The cost that justified rejecting B2 does not exist.** B2 was refused because "it runs on every
  authenticated request including browse/SELECT; it taxes reads". `withRlsContext` already issued a
  `SELECT ... FROM users WHERE id = $1 FOR KEY SHARE` on every authenticated request, for an
  unrelated reason: account deletion takes `FOR UPDATE` before touching owned targets, and holding
  `KEY SHARE` here forces every request to lock in the same order. Adding `role` to that select's
  column list costs nothing.
- **B3 cannot cover the routes where the window actually bites.** `PATCH /api/products/:id` and
  `PATCH /api/ingredients/:id` must stay reachable by the author of a pending submission, so they
  cannot carry `requireCatalogWrite`. They delegated authorization entirely to RLS policies, and
  those policies read `app.role`, which ADR-0008 explicitly left sourced from the JWT claim. A
  contributor demoted while the token was still valid kept catalogue write on exactly those routes
  for up to 15 min.
- **The claim also leaked past the guards into the services.** Six route reads passed
  `getAuthedUserRole(c)` (the claim) down to services. During the stale window
  `resolveCatalogQuality` stamped a row `verified` that the INSERT policy then rejected, so a
  `42501` surfaced as a `500`. Fail-closed, but the wrong error shape, and unfixable one call site
  at a time.

## Decision

`withRlsContext` reads `role` in the `FOR KEY SHARE` select it already performs, then:

- sets `app.role` from that row, so every RLS policy arbitrates on the database, not the token;
- overwrites `userRole` in the Hono context, so guards and services downstream see the same row the
  policies see. An account gone since the token was issued falls back to the anonymous role.

One write point, no call site changed. `requireAdmin`, which reads the context role, becomes
DB-sourced as a consequence.

## Considered options

- **A. Amend ADR-0008 in place.** Rejected: the chosen option changes, not a detail of it. The
  repository convention for a reversed decision is a `superseded-by-XXXX` status in the index plus
  a replacement.
- **B. Keep B3 and add a third gate for the two `PATCH` routes.** Rejected: the routes are open to
  submission authors by design, so the gate would have to encode the submission-ownership rule that
  RLS already holds. It also leaves the services reading the claim.
- **C. Source the role once per request in `withRlsContext` (ADR-0008's B2).** **Chosen.** Free on
  top of an existing select, covers the gates, the policy-only routes and the services at once.
- **D. Redefine `auth.role()` to read the database (ADR-0008's B1).** Still rejected, and for the
  reason ADR-0008 gave: `auth.role()` is evaluated inside policies, so the lookup lands once per
  statement rather than once per request.

## Consequences

- **Demotion is immediate everywhere the role is read**, not only on the two gated routes.
  Covered by `backend/src/tests/integration/role-demotion-rls-routes.test.ts`.
- **The two gates of ADR-0008 stay in place** and now perform a second `getUserRole` lookup on
  privileged routes, redundant with the context role. Kept deliberately: the gate returns `403`
  before the service runs, and it is the surface `role-demotion-gate-403.test.ts` pins. Collapsing
  it onto the context role is a separate change with its own test surface.
- **RLS tests that fake a role via `app.role` stay green.** ADR-0008 predicted B2 would blast them;
  it did not. They set `app.role` directly and never traverse the middleware.
- **The residual ADR-0008 accepted** (other role-dependent paths still trusting the claim) is
  closed: `requireJwtAuth` still seeds `userRole` from the claim, but `withRlsContext` overwrites it
  before any guard or service runs on an authenticated request.

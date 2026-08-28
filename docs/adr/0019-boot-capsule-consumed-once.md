---
date: 2026-08-21
accepted: 2026-08-26
---

# The server hands identity over in a capsule consumed once, then one module owns every client session transition

An earlier draft at this number proposed a permanent read gate over a `['session']` cache entry
plus a shared `settleSession`. It is option C below, and the part of it that survived is named
there.

Scope: the frontend answer to "who is connected". Authorization is untouched and stays where
[ADR-0018](0018-fresh-role-sourced-once-per-request.md) put it, on the database role read again once per
request.

## Why

- **Four carriers answered the same question, and disagreeing was legal.** The Zustand store
  (`frontend/src/store/auth.ts`), the TanStack Query entry `['session']`, `RouterContext.auth` (two
  fields copied from the store by a subscription in `router.tsx`), and the freshness module state.
  Since the SSR boot personalizes the first render from the refresh cookie, a `user` seeded with
  `accessToken` still null is a legal state, so the carriers legitimately diverged during that
  window and nothing reconciled them.
- **Every screen recomposed its own question.** Before this change, 55 files imported
  `useAuthStore`, 31 of them under `component/` or `features/`. "Is someone connected" was written
  four different ways (`!!accessToken`, `user !== null`, their disjunction, and a store-plus-cache
  blend in `UserMenu`), and they gave different answers on the same cold-load screen.
- **The store default `role: 'user'` was a silent false negative.** Before the boot probe settled, a
  reader saw a plain user. Role guards compensated by awaiting the probe, five components
  compensated with five different pending policies, and the remaining readers did not know the state
  existed.
- **The router context carried nothing of its own.** It existed to keep guards off the store, yet
  six route files plus the shared feature-guard module read `useAuthStore.getState()` anyway, and
  `requireAuth` read both the context and the live store because the context could be one render
  behind, a premise that died when the context became a synchronous store subscription. This
  argument comes from the earlier draft and was never refuted; it is why `RouterContext` keeps only
  `queryClient` below.
- **A permanent identity entry keeps two carriers in agreement by convention, not by
  construction.** The earlier draft closed the concrete divergences: on the client its derivation read the
  store first, so an SSR `anonymous` verdict could not outlive a later login, and a logout cleared
  the cache with the entry in it. What no derivation closes is the standing obligation, since every
  future writer of identity has to remember the entry too, and a forgotten purge is a silent
  disagreement rather than a type error.
- **A settle shared by both guards owed an explicit split, and the draft had not written it.**
  `requireAuth` let an expired token through on `cooldown` because a network blip is plausible and
  the 401 interceptor recovers; `awaitBootRefresh` purged on any non-`ok`. Routing both through one
  `settleSession` meant saying which policy each guard kept, and a role guard that inherited the
  permissive one would mount an admin page on an unproven role. Two guards keep the split by
  construction instead.

## Decision

1. **The identity crosses the wire in a capsule, and the capsule is consumed.** The root loader
   writes `['boot', 'session']` into the per-request `QueryClient`, first as `pending` before any
   fallible operation, then replaces it with the boot verdict. A three-branch union
   (`pending | anonymous | authenticated`) replaces the previous optional-field shape, so there is no
   partial form to abandon silently.

2. **The consumption point is the router hydrate hook, before client guards.** `client.tsx` calls
   `hydrateStart()`; inside it, the hook installed on `router.options.hydrate` in `router.tsx`
   restores the Query cache, calls `seedClientSession(queryClient)`, then hands back to the loading
   of matches. `hydrateRoot()` starts only after. The seed publishes the branch into Zustand and
   deletes exactly that entry. After this point the capsule does not exist, so no verdict can go
   stale. A server read before the root loader is a violated precondition and throws, not a state to
   recover from.

3. **Zustand is the single client authority, behind one adapter.** `lib/auth/sessionState.ts` is the
   only production importer of the store; `lib/auth/session.ts` and `lib/auth/credential.ts` are the
   only importers of that adapter. The public read surface is a discriminated union, `SessionView`
   (`pending | anonymous | authenticated` with `credential: 'restoring' | 'present'`). `role` lives
   only on `session.user`, so no component can compare a role before a verdict exists. This union comes
   from the earlier draft, adopted unchanged apart from two names.

4. **Named transitions own every write.** `installSession`, `updateSessionUser`, `endSession` and
   `recordBan`, plus the one-shot `seedClientSession` at hydration, all synchronous. The three that
   can change viewer, role or liveness purge before they publish. Session expiry and ban stay
   separate events rather than becoming branches of the identity state: an identity state answers
   "who is connected", not "where should this user be sent".

5. **Two guards, not one settle.** `requireSession` and `requireRole` share identity resolution and
   keep different `cooldown` policies by construction, where the draft would have had to carry that
   split inside `settleSession`. A refused role is a bare `redirect()`: it never ends the session and
   never purges.

6. **A network answer only acts on the snapshot that launched it.** `captureClientSession()` freezes
   the branch before an await and yields `isCurrent()`. A refresh whose snapshot was replaced returns
   `superseded` and touches nothing, which closes the race where a stale refresh could overwrite or
   expire a newer login.

7. **The remote proof is a separate key that never publishes identity.** `GET /api/auth/session` is
   cached under `['auth', 'credential-validation', viewerId]`. It proves a Bearer is still accepted
   and its `userId` and `role` are compared against the current snapshot, never adopted.

8. **The boundaries are lint-enforced, and mostly proven by refusals.** A `noRestrictedImports` rule
   in `biome.json` forbids five import shapes repository-wide; only `frontend/src` can match them.
   Each allowed file gets an `override` that redeclares the rule minus the patterns it actually needs,
   one for most files and two for `freshness.ts` and `recoverUnauthorized.ts`. Tests and
   `frontend/src/test/**` carry the one blanket exemption, so this is a production-code boundary, not
   a repository-wide one. `scripts/check-auth-import-boundaries.ts` then plants five negative fixtures
   from `frontend/lint-fixtures/auth-boundaries/` in synthetic subfolders under `component/`,
   `features/` and `lib/queries/`, runs `biome lint` on each, and requires a non-zero exit carrying
   the expected message. They cover four of the five patterns, transitions twice over; the
   `sessionState` pattern has no fixture and is still unproven.

`RouterContext` keeps only `queryClient`. Security still comes from backend route guards and RLS
policies together; none of the above changes what protects a route, only how the UI reads.

## Considered options

- **A. Capabilities object (`can.moderate`, `can.editCatalog`).** Rejected: the frontend does not
  arbitrate rights (ADR-0018, the DB role is the authority per request); it would copy the
  [ADR-0006](0006-contributor-gains-content-moderation.md) matrix client-side and invite rendering
  conditions to act as protection.
- **B. One function per question (`useIsAdmin`, `useIsAuthenticated`).** Rejected: a `useIsAdmin()`
  returning `false` while pending is the same false negative moved to another file.
- **C. A discriminated session state with a pending branch, read through a gate over a permanent
  `['session']` entry, plus `settleSession`.** The earlier draft. Its three-branch union, with
  `role` out of reach before a verdict, is the part that survived: it ships above as `SessionView`,
  with `bearer` renamed `credential` and `'ready'` renamed `'present'`. Rejected for the rest: the
  entry stays a second carrier kept in agreement by convention rather than by construction, and the
  draft had not written how `settleSession` would carry the two `cooldown` policies that `requireAuth`
  and the boot purge pin separately.
- **D. A capsule consumed once, plus owned transitions.** **Chosen.** It removes the second carrier
  instead of maintaining it, and it keeps the two guard policies distinct because nothing forces them
  together.
- **E. Make the Query cache canonical and the store a projection.** Rejected: it is the mirror
  mechanism the freshness module boundary already refused, inverted; the Bearer has no place in a
  dehydrated cache, and after `queryClient.clear()` something must still say "anonymous".
- **F. Make the router context authoritative.** Rejected: it would need role, user and pending, a
  full mirror of the store, and the server would still not see it.

## Consequences

- **One intended rendering change.** The home page keeps its skeleton for a seeded identity whose
  Bearer is still restoring, instead of rendering the hub as soon as a boot latch flipped. Before,
  three of the hub's four queries went out without a Bearer and each took a 401; only `profile.me`
  was already seeded by the SSR boot. The cost is a few hundred milliseconds of skeleton on an
  authenticated cold load.
- **Boot latches disappear without replacement.** `bootRefreshAttempted`, `bootRefreshPending` and
  `useBootPending` are removed: `pending`, `anonymous` and `authenticated/restoring` make them
  unnecessary, and the in-flight refresh is deduplicated inside `freshness.ts`.
- **The store's top-level `role`, `emailVerified`, `isDemo` and `banned` fields are gone** in favor of
  `user`, and a type-test file pins that impossible states do not compile.
- **The lint lock has a standing cost.** Every file newly allowed to touch a restricted import needs
  its own `override` block in `biome.json` redeclaring the rule minus the patterns it uses, so the
  config grows with the allowlist: seven blocks today, each repeating three or four of the five
  patterns verbatim.
- **A `beforeLoad` never sees the capsule.** All `beforeLoad` run before all loaders, so only a child
  loader can read it, after `await parentMatchPromise`. No shipped guard runs during SSR, so nothing
  delivered is affected, but moving a guarded route to `ssr: true` would require another way to
  acquire identity.
- **Three purge moments stay on the write path**: a session ending, adopting a different viewer or
  a different role, and a global ban. [ADR-0021](0021-keep-marked-anonymous-queries-during-pending-adoption.md)
  narrows only the `pending` boot adoption: explicitly marked anonymous viewer entries can finish
  hydration while every unmarked or known-viewer entry is still removed. A logout clears the whole
  cache, public roots included.
- **The earlier refusal to merge the five waiting policies into one enum stands.** What is unified is
  the derivation and its type, never what each screen draws while waiting.

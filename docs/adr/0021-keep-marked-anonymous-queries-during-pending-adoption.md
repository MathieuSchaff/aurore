---
date: 2026-08-28
accepted: 2026-08-28
---

# Keep marked anonymous viewer queries during pending session adoption

When a degraded SSR boot leaves the client session `pending`, adopting the refreshed session keeps
only cached queries explicitly marked for the anonymous viewer. Every unmarked session query and
every query owned by a known viewer is still removed before the credential is published.

## Why

A degraded product document is rendered anonymously. Its Query cache is dehydrated under a
`userId: null` key, while the session capsule freezes a `pending` hydration snapshot. The browser
can adopt the real session before every Suspense boundary has hydrated. Removing the anonymous
entry at that point makes a late boundary fetch the page with the null key, then fetch it again
under the adopted viewer key after React switches to the live session.

The broad purge from [ADR-0019](0019-boot-capsule-consumed-once.md) remains a safety net. A query
that depends on the viewer but forgot to carry that viewer in its key must not survive session
adoption. A raw trailing `null` is not enough proof because query keys carry many unrelated null
values.

React exposes no reliable event for "every Suspense boundary has hydrated". Coordinating the purge
with an effect, a timer or observer counts would make data ownership depend on rendering timing.

## Decision

1. Viewer-owned queries that can feed SSR hydration carry `meta.sessionScope.viewerId` as well as
   the same viewer id in their query key. TanStack Query dehydrates this metadata with the entry.
2. `installSession` may preserve entries whose metadata says `viewerId: null` only when the
   previous session was `pending`. It still removes every other session-scoped entry before
   publishing the credential.
3. Anonymous, authenticated and role-changing transitions keep the full purge. Session end and a
   global ban also keep the full purge.
4. Preserved anonymous data is never copied into the authenticated key. Late boundaries finish
   hydration from that data, then the normal viewer-key change performs the single authenticated
   read.

## Considered options

- **A. Wait for hydration before purging and invalidating.** Rejected: React has no completion
  signal for all Suspense boundaries, so every available implementation is timing-dependent.
- **B. Keep catalogue entries by root or by a trailing null.** Rejected: neither property proves
  that the query is viewer-keyed, so the exception could hide exactly the missing-key defect the
  purge exists to catch.
- **C. Accept two reads on the degraded path.** Rejected: it weakens the network contract and lets
  a request carrying a Bearer write personalized data under an anonymous key.
- **D. Mark the viewer scope and preserve only the pending anonymous entries.** **Chosen.** The
  query declares its ownership where its key is built, while the purge policy stays in one module.

## Consequences

The product list and product detail page factories carry one small metadata object. Their tests pin
that its viewer id matches the viewer segment of the key.

On the rare degraded boot, the anonymous entry remains until its normal Query garbage collection
or a later full cache purge. Authenticated readers use a different key, so they cannot consume it.

Adding another SSR viewer-owned query requires the same metadata if it must survive pending
hydration. Omitting the metadata is safe by default: the entry is removed.

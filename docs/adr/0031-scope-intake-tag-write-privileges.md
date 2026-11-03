---
date: 2026-11-03
accepted: 2026-11-03
---

# Scope intake tag write privileges to computed rows

Product intake derives automatic tags for every authorized submission, including ordinary
users. Direct tag editing remains restricted to contributors and administrators.

## Why

An ordinary user can create an unverified product and update their own unverified product.
The automatic writer inherited that user's RLS role, which cannot insert into
`product_tag_links`. Creation still returned 201 through the fail-soft path, leaving the
product without derived tags. Tests using the database owner did not expose this refusal.

## Decision

Keep product authorization and tag computation under the caller's existing context.
Inside the automatic writer's replacement savepoint, capture `app.role`, temporarily set
it to `contributor`, delete only that product's non-manual rows, and insert the rows
computed by the server. Restore the captured role before releasing the savepoint,
including when no tags are emitted. A failure rolls the savepoint back, restoring both
rows and role before the fail-soft caller continues.

The writer remains an internal trusted operation. Its callers must authorize the product
write first, or already run as a trusted maintenance operation. It accepts no client tag
payload. No route or RLS policy gains new privileges; `app.user_id` never changes.

## Considered options

- Expand the table policy to ordinary users: rejected because it also authorizes direct tags.
- Use a separate privileged connection: rejected because the product may be uncommitted,
  and tags must roll back with the surrounding request.
- Elevate the whole request: rejected because subsequent operations could inherit catalog rights.

## Consequences

Creation and watched-field edits persist automatic tags for users, contributors and admins.
Manual rows still win collisions. Genuine tagging failures still preserve the product and
emit `product_autotag_skipped`. This change does not backfill existing products.

`backend/src/tests/integration/product-intake-rls.test.ts` exercises the real `app_runtime`
pool: HTTP creation/editing, manual preservation, role restoration after success, empty
output and SQL failure, plus rollback with the product. Catalog authorization tests retain
the direct-write and ownership refusals.

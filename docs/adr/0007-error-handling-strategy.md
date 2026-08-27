---
status: accepted
date: 2026-06-02
accepted: 2026-06-02
---

# Hybrid error handling strategy

Aurore accepts three error styles in the backend:

1. domain errors thrown by services and translated by `globalErrorHandler`, the default;
2. explicit `ApiResponse<T, E>` results for expected branches that are clearer as values;
3. narrow local `try/catch` blocks when one adapter must translate a specific infrastructure
   failure, while rethrowing everything else.

The styles may coexist in the repository, but one operation must have one owner for translation.
A route must not catch an error that the global handler is already responsible for.

## Why

Most CRUD routes are clearest when the service throws a typed `DomainError` and the route contains
only validation, guards and the success response. Auth and a few administration flows have expected
branches, such as an invalid token or an already pending request, that read better as explicit
results. A small number of adapters also need a local infrastructure translation that has no useful
global meaning.

Forcing every flow into one style would either add result plumbing to ordinary CRUD or turn normal
branching into exception control flow. Allowing unconstrained mixing would duplicate status mapping
and make transaction rollback unreliable.

The normative contract lives in [`docs/conventions/error-handling.md`](../conventions/error-handling.md).

## Considered options

- **Throw only**: rejected because expected auth and administration outcomes become noisy exceptions.
- **`ApiResponse` only**: rejected because every ordinary route must repeat result branching.
- **Local `try/catch` everywhere**: rejected because status mapping and serialization spread across
  route files.
- **Constrained hybrid**: chosen because each flow uses the smallest clear interface while the wire
  contract stays uniform.

## Consequences

- Every JSON failure uses `{ success: false, error, details? }`.
- Thrown business failures inherit from `DomainError`; a foreign error with a `code` field remains
  an internal error.
- HTTP status selection for thrown domain errors is centralized by error code in
  `thrownDomainErrorMapping` and `baseErrorMapping`, not by subclass name.
- `publicDetails` may cross the wire; `cause` remains private for logs and diagnostics.
- Errors inside `withRlsContext` must propagate so the request transaction rolls back.
- Contributors still choose a style per operation, so the convention and tests are part of the
  interface.

## Precisions

Reading the decision against the code adds four precisions, all carried by
[`docs/conventions/error-handling.md`](../conventions/error-handling.md):

1. **A fourth exit exists and predates this ADR**: the `zValidator` hook answers `invalid_input`
   with 400 by itself and never reaches the global handler. It is the main source of 400 responses
   in the API.
2. **"A route must not catch an error the global handler owns" is not held everywhere**:
   `features/admin/suggested-edits.routes.ts` maps its own domain errors inside the route.
3. **"Do not throw and return failures for the same operation" needs a sharper wording**: expected
   branches are returned, infrastructure failures are rethrown. A service may legitimately do both,
   because catching a constraint violation and returning a value would leave an aborted transaction
   to commit. `features/admin/moderation.service.ts` states that reason in place.
4. **"Errors must propagate so the transaction rolls back" is incomplete**: `withRlsContext` rolls
   back on `c.error` **or** a final status of 400 or more. Returning a clean 404 also discards
   writes made earlier in the same request.

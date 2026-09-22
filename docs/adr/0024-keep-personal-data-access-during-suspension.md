---
date: 2026-09-15
accepted: 2026-09-15
---

# Keep personal data access during suspension

A global suspension blocks normal account access while preserving export and account deletion.

## Why

The suspended account cannot refresh its session. Moving export outside the ban guard alone
would stop working when the current access token expires.

## Decision

The suspension screen accepts email and password for two dedicated POST operations under
`/api/profile/access`: export and deletion. Password verification shares the login lockout and
timing protections. It issues no access token, refresh token or cookie. Export binds only the
verified owner's RLS identity and records the usual export audit event. Deletion uses the same
account cleanup transaction as the authenticated endpoint. Normal authenticated export and
deletion also remain available during suspension.

The existing password reset flow lets an owner with a Google account establish a password.
The deletion confirmation remains explicit in the interface.

## Considered options

- Refresh a general session during suspension: rejected because it grants an unnecessary credential.
- Accept only the current access token: rejected because expiry makes both operations inaccessible.
- Verify credentials for each operation: chosen because it grants exactly one requested operation.

## Consequences

The two POST routes use the login rate limiter and normal origin checks. A password failure
does not export or delete data. Account deletion keeps the existing anonymization of public
contributions. A change of frontend session while deletion is pending cannot clear the new session.

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

Google-only accounts keep their provider identity. The password reset flow deliberately does
not establish a password for them. Since 2026-10-13, the suspension screen also offers a
dedicated Google verification flow for either export or deletion.

The flow uses the existing Google callback, state and PKCE. A signed HttpOnly cookie binds the
chosen operation to the OAuth exchange for ten minutes. The callback looks up the existing
Google subject only: it neither links by email nor creates an account. It issues a separate
five-minute `privacy-access` authorization in an HttpOnly cookie, scoped to the verified user
and the chosen operation. Its token type is rejected by normal access and refresh validation.
No general session or permanent credential is issued.

The screen displays the verified account before the final action. Each POST must name that
same account, preventing another tab's authorization from changing the intended target.
Deletion requires an explicit confirmation after Google verification. A successful operation
clears the authorization cookie; server-side expiry still bounds a copied token to five minutes.
Export retains its existing per-user rate limit and owner-only RLS transaction.

Google account selection is requested. Google may use its existing session; this verifies the
linked provider identity without promising a new password challenge. See
[Google's OpenID Connect server flow](https://developers.google.com/identity/openid-connect/openid-connect).

## Considered options

- Refresh a general session during suspension: rejected because it grants an unnecessary credential.
- Accept only the current access token: rejected because expiry makes both operations inaccessible.
- Verify credentials for each operation: chosen because it grants exactly one requested operation.
- Email link for Google-only accounts: not selected; it proves mailbox control instead of the linked provider identity.
- Allow password reset for Google-only accounts: not selected; it adds a permanent authentication method.

## Consequences

The two POST routes use the login rate limiter and normal origin checks. A password failure
does not export or delete data. Account deletion keeps the existing anonymization of public
contributions. A change of frontend session while deletion is pending cannot clear the new session.

The Google flow uses the same rate limiter and origin checks. Its cookies are HttpOnly,
SameSite=Lax, Secure in production, and limited to `/api`. Responses are `no-store`. Expired,
forged, wrong-purpose or wrong-operation authorizations are rejected without modifying data.
No database migration or additional Google redirect URI is required.

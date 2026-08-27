---
date: 2026-08-14
accepted: 2026-08-27
---

# The session cookie reaches the server render, and it only ever reads

The refresh cookie is issued at `Path=/`, so the browser attaches it to the document request. The
SSR entry copies the incoming `cookie` header onto a single `GET /api/boot` call and renders the
HTML already personalised. TanStack Start decodes nothing and shares no secret with Hono: Hono
stays the only authorization boundary, with RLS behind it. The cookie opens read routes only, and
that restriction is what keeps CSRF off the table.

## Why

Before this, the server knew nobody. It rendered an anonymous shell, the browser hydrated, called
`POST /api/auth/refresh` for a bearer, then refetched the page data. Two round trips before a
signed-in user saw their own content, and the anonymous flash was structural rather than a bug.

Letting the cookie reach the render removes both round trips, but it changes the nature of the CSRF
defence. With a bearer, protection is structural: a third
party site cannot read our memory, so it cannot forge the `Authorization` header, and there is
nothing to configure. A cookie is attached by the browser on its own, `httpOnly` included, so the
protection stops being a property of the transport and becomes a rule about which routes accept it.
The rule holds until someone mounts the cookie middleware on a route that writes.

The deployment is single-origin, so `__Host-` stays usable and no `Domain` widening is needed.
What blocked the change was the cookie path: `Path=/api/auth` never matches a document request
for `/products`.

## Decision

1. The refresh cookie is issued at `Path=/`. Nothing else about it changes: `httpOnly`, `SameSite=Lax`,
   seven days, hashed `jti` in the database, rotation on every refresh.
2. Exactly two routes accept the cookie: `GET /api/boot` and `POST /api/auth/refresh`. Everything
   that writes keeps requiring `Authorization: Bearer`.
3. `GET /api/boot` performs `SELECT` only, under RLS, with the identity the cookie carries. It always
   answers 200: a missing, invalid or revoked cookie yields `authenticated: false`, never a 401.
4. Two guard rails keep rule 2 from eroding. `requireSessionCookie` carries a comment stating why it
   must never leave read routes, and a global `Origin` check refuses any non-GET request whose
   `Origin` header is present and foreign. A missing `Origin` passes, because mobile and non-browser
   clients do not send one and do not use the cookie.
5. The SSR path is fail-soft. The boot call has its own 2 second timeout, distinct from the 8 seconds
   of the shared HTTP client, and any failure at all falls back to the anonymous render with a
   structured log. No retry on the server; the client repairs.
6. A document request without the cookie takes the previous path unchanged, at zero cost. With the
   cookie, the document is `private, no-store`.

## Considered options

- **A. Hono alone, the pre-existing setup**: the browser talks straight to Hono and the server knows
  nobody. Rejected: it makes the anonymous flash structural, and it needed a companion hint cookie
  just to pick which skeleton to render.
- **B. Start as a permanent BFF**: the browser only ever talks to Start, which holds the session and
  relays every call to Hono. Rejected: Start lands on the critical path forever, adding a hop to every
  request after hydration while contributing nothing past the first render.
- **C. The cookie reaches the server render, once**: **Chosen.** One extra server-to-server call on
  the document request, the existing circuit resumes after hydration, and Start never becomes an
  authorization boundary.

## Consequences

The personalised HTML is no longer cacheable, so it is served `private, no-store`. Nothing is lost:
the document was already `no-cache` at the root and no nginx `proxy_cache` covered `/`.

The server render now blocks on Hono for signed-in visitors. The 2 second timeout bounds it, and the
worst case is the behaviour that used to be the norm: a flash, then the session.

The CSRF protection is now a rule rather than a property. It is breakable by mounting
`requireSessionCookie` somewhere that writes. The comment and the `Origin` check exist for that
future mistake, not for a threat present on the day of deployment.

The hint cookie became pointless and was removed, along with its three readers, on 2026-08-14. Its
active expiry and the purge of the old `Path=/api/auth` cookie were carried as transitional code
until 2026-08-27, once every live session had rotated past the seven day refresh window.

Migrating a cookie's path is the sharp edge here. A cookie is identified by the triple (name, domain,
path), so issuing the new one leaves the old one in place and the browser sends both. Hono's parser
keeps the first occurrence, which is the more specific path, which is the revoked one: refresh
answers 401 and the user is signed out. Every issue site had to delete the old path explicitly, logout
included.

---
date: 2026-08-30
accepted: 2026-08-30
---

# Refuse internal targets before fetching a stored image URL

Every fetch of a URL read from `products.image_url` goes through `fetchPublicHttpUrl`
(`backend/src/images/lib/safe-url.ts`). The helper refuses internal targets, follows redirects by
hand and judges every hop again. There is no allow-list of image hosts. Scope: the two operator
CLIs that pull contributor-supplied images before rehosting them on the CDN (`just image-upload`,
`backend/src/images/fetchers/from-db.ts`). The runtime API never fetches a stored URL.

## Why

Any authenticated, non-banned account writes `image_url` when it creates or edits a product (scope
`product_create`). The API stores the string and never opens it. Two operator CLIs do, later, from
the operator's own machine. A contributor who stores `http://169.254.169.254/latest/meta-data/` or
`http://localhost:5432/` arms a request that an operator fires from inside their network months
later. The target is the maintenance environment, not the application server, which lowers the
severity without removing the hole.

Images come from wherever contributors found the product. The 2026-08-30 snapshot holds 7343
products; `products.url` points at 111 distinct shop and brand sites over 6153 rows, and the image
is pulled from that page or its CDN. Once rehosted, `image_url` moves to the CDN: all 6237 stored
values sit on `aurore-cdn.b-cdn.net` today, the other 1106 are null. The set of sources is not
known in advance and grows by one with each new reseller.

Validation at write time alone would not cover the rows already stored, nor a direct SQL import
(seed, `.db-fixes/`). The CLIs are the only place that sees every URL right before the socket
opens.

## Decision

1. Both CLIs fetch through `fetchPublicHttpUrl` and never call `fetch` on a stored URL directly.
   The helper owns the fetch, so a caller cannot forget the guard.
2. Refused: any scheme other than `http:` and `https:`; IPv4 `0.0.0.0/8`, `10/8`, `127/8`,
   `100.64/10`, `169.254/16`, `172.16/12`, `192.168/16` and everything from `224.0.0.0` up; IPv6
   every `::` prefixed form (unspecified, loopback, v4-mapped), `fc00::/7`, `fe80::/10`,
   `ff00::/8`. A hostname is resolved before it is judged, one internal answer refuses the whole
   host, and a hostname that resolves to nothing is refused too.
3. Redirects are never left to `fetch`: `redirect: 'manual'`, `Location` resolved against the hop
   that sent it (absolute, relative or protocol-relative), each hop judged again, five hops at most.
4. Not refused on purpose: TEST-NET and benchmark ranges (`192.0.2/24`, `198.51.100/24`,
   `203.0.113/24`, `198.18/15`, `192.0.0/24`). They are unroutable, not dangerous.
5. Known gap, accepted: `fetch` resolves DNS on its own, so a zone that answers a public address
   to the guard and an internal one to the fetch (rebinding) gets through. Closing it means owning
   the socket, which these CLIs do not.

## Considered options

- **A. Allow-list of image hosts**: a list the operator maintains, seeded from the hosts already
  stored. Rejected: the sources are the 111 reseller and brand sites contributors find, one more
  per new brand, so every new brand needs an operator edit before its images can be pulled, and a
  host name says nothing about where it resolves.
- **B. Validate at write time only**: a `shared/` schema rule, an error code and an HTTP mapping on
  the product routes. Rejected as the only gate: it leaves every row already stored and every
  direct SQL import uncovered. It can still come later as a second layer.
- **C. Deny internal targets at fetch time, redirects included**: **Chosen.** Zero maintenance,
  sits at the one place every URL passes right before the socket opens, covers rows however they
  got in.

## Consequences

A stored URL that points inside the operator's network fails with `refusing <url>: ...` before a
single byte is read. `from-db` lists it among its failures and moves on, `image-upload` throws.

`::ffff:<public IPv4>` is refused as well: the URL parser rewrites the dotted form to hex, so the
guard matches the `::` prefix rather than the tail. Nobody stores an image that way. Accepted
false positive.

A write-time check (option B) would add a schema, an error code and an HTTP mapping. It would not
replace this guard.

`from-db.ts` is gitignored with the other throwaway fetchers, so its call to the helper lives only
on the operator machine. `backend/src/images/fetchers/README.md` carries the rule for any new
fetcher.

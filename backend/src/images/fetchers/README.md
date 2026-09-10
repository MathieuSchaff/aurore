# Image fetchers

Brand-specific packshot fetchers (throwaway scrapers). The `*.ts` files are
gitignored on purpose: they break whenever a brand site changes, and their
output lives on the CDN. Run manually: `bun run src/images/fetchers/<brand>.ts <brand>`.

A fetcher that opens a URL read from `products.image_url` goes through `fetchPublicHttpUrl`
(`../lib/safe-url.ts`), never through a bare `fetch`: the URL was written by a contributor and the
request leaves from your machine (docs/adr/0022).

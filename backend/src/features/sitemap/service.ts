import { evaluateSeoEligibility, SITE_URL } from '@aurore/shared'

import { isNotNull, sql } from 'drizzle-orm'

import type { DB } from '../../db'
import { articles } from '../../db/schema/blog/articles'
import { ingredients } from '../../db/schema/ingredients/ingredients'
import { products } from '../../db/schema/products/products'
import { normalizeInstant } from '../../utils/dates'

// lastmod feeds crawlers a recrawl hint. A null one omits the tag: static pages
// have no row to date them.
type SitemapEntry = { path: string; lastmod: string | null }

// Marketing + indexable hub pages that are not row-backed. The blog category hubs
// are data-driven (only non-empty ones) and come from toSitemapEntries.
const STATIC_PATHS = ['/', '/about', '/privacy', '/products', '/ingredients', '/blog']

// Slugs are [a-z0-9-] by construction (create paths slugify); this is the belt
// for when a row bypasses that. lastmod is toISOString output, never escaped.
function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Promise.all is safe here, unlike the product list reads: this route carries no auth
// middleware, so `db` is never the RLS transaction. Verified against the Postgres log.
async function readSitemapRows(db: DB) {
  const [prods, ings, arts] = await Promise.all([
    db
      .select({
        slug: products.slug,
        updatedAt: products.updatedAt,
        moderationStatus: products.moderationStatus,
        category: products.category,
        // Keep formula payloads out of the sitemap query; we only need to know an
        // INCI exists. btrim also rejects whitespace-only INCI.
        hasInci: sql<boolean>`nullif(btrim(coalesce(${products.inci}, '')), '') is not null`,
      })
      .from(products),
    db
      .select({
        slug: ingredients.slug,
        updatedAt: ingredients.updatedAt,
        moderationStatus: ingredients.moderationStatus,
      })
      .from(ingredients),
    db
      .select({
        slug: articles.slug,
        category: articles.category,
        updatedAt: articles.updatedAt,
      })
      .from(articles)
      .where(isNotNull(articles.publishedAt)),
  ])

  return { prods, ings, arts }
}

type SitemapRows = Awaited<ReturnType<typeof readSitemapRows>>

// ISO strings compare lexicographically = chronologically.
function latestArticleDateByCategory(arts: SitemapRows['arts']): Map<string, string | null> {
  const byCategory = new Map<string, string | null>()
  for (const article of arts) {
    const lastmod = normalizeInstant(article.updatedAt)
    const previous = byCategory.get(article.category)
    if (previous === undefined || (lastmod && (previous === null || lastmod > previous))) {
      byCategory.set(article.category, lastmod)
    }
  }
  return byCategory
}

// Public URLs only: catalogue rows accepted by the shared SEO publication rule
// + published articles.
function toSitemapEntries({ prods, ings, arts }: SitemapRows): SitemapEntry[] {
  return [
    ...prods
      .filter(
        (p) =>
          evaluateSeoEligibility({
            kind: 'product',
            moderationStatus: p.moderationStatus,
            category: p.category,
            hasInci: p.hasInci,
          }).indexable
      )
      .map((p) => ({ path: `/products/${p.slug}`, lastmod: normalizeInstant(p.updatedAt) })),
    ...ings
      .filter(
        (i) =>
          evaluateSeoEligibility({
            kind: 'ingredient',
            moderationStatus: i.moderationStatus,
          }).indexable
      )
      .map((i) => ({
        path: `/ingredients/${i.slug}`,
        lastmod: normalizeInstant(i.updatedAt),
      })),
    // A hub is indexable only if the category holds at least one published article.
    ...[...latestArticleDateByCategory(arts)].map(([category, lastmod]) => ({
      path: `/blog/${category}`,
      lastmod,
    })),
    ...arts.map((a) => ({
      path: `/blog/${a.category}/${a.slug}`,
      lastmod: normalizeInstant(a.updatedAt),
    })),
  ]
}

export async function buildSitemapXml(db: DB): Promise<string> {
  const urls: SitemapEntry[] = [
    ...STATIC_PATHS.map((path) => ({ path, lastmod: null })),
    ...toSitemapEntries(await readSitemapRows(db)),
  ]
  const body = urls
    .map(({ path, lastmod }) => {
      const loc = escapeXml(`${SITE_URL}${path}`)
      const mod = lastmod ? `<lastmod>${lastmod}</lastmod>` : ''
      return `<url><loc>${loc}</loc>${mod}</url>`
    })
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`
}

// A build scans products, ingredients and articles in full. The route is public and nginx
// lets a single client burst 20 requests, so rebuilding per hit is a cheap way to pin the
// DB. Holding the promise rather than the string also collapses a concurrent burst into
// one build. TTL matches the Cache-Control the route advertises.
const CACHE_TTL_MS = 3_600_000

let cached: { xml: Promise<string>; expiresAt: number } | null = null

export type SitemapXml = {
  xml: string
  maxAgeSeconds: number
}

export async function getSitemapXml(db: DB): Promise<SitemapXml> {
  const now = Date.now()
  let entry = cached

  if (!entry || entry.expiresAt <= now) {
    entry = { xml: buildSitemapXml(db), expiresAt: now + CACHE_TTL_MS }
    cached = entry
    // A failed build must not be served for the rest of the hour.
    entry.xml.catch(() => {
      if (cached === entry) cached = null
    })
  }

  const xml = await entry.xml
  return {
    xml,
    maxAgeSeconds: Math.max(0, Math.floor((entry.expiresAt - Date.now()) / 1000)),
  }
}

// Test-only: each spec seeds its own fixtures and reads the route once, so without this
// they would all see whatever the first one built.
export function resetSitemapCache(): void {
  cached = null
}

#!/usr/bin/env bun
/**
 * fetch-images-shopify.ts — Generic Shopify-based image fetcher.
 *
 * Reads a brand config (handles -> DB slug map, plus optional wayback fallback list)
 * from `data/image-fetchers/<brand>.ts`, downloads first product image,
 * normalizes to webp via ImageMagick (max 800px, q82), drops in
 * output/images-normalized/<slug>.webp ready for upload-images.ts.
 *
 * Wayback fallback: handles in `legacyHandles` are fetched via
 * web.archive.org og:image meta -> cdn.shopify.com (assets often outlive product pages).
 *
 * Usage: bun run backend/src/db/seed/scripts/fetch-images-shopify.ts <brand>
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const SEED_ROOT = join(import.meta.dir, '..')
const NORMALIZED_DIR = join(SEED_ROOT, 'output', 'images-normalized')
const SOURCE_DIR = join(SEED_ROOT, 'output', 'images-source')

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36'

export interface FetchConfig {
  // shopify storefront origin (e.g. 'https://geekandgorgeous.com')
  origin: string
  // shopify CDN files prefix for og:image filename rewrite (legacy products)
  // e.g. 'https://cdn.shopify.com/s/files/1/0325/6398/6572/files'
  cdnFiles?: string
  // optional vendor filter when origin hosts multiple brands
  vendor?: string
  // shopify handle -> aurore DB slug
  slugByHandle: Record<string, string>
  // handles to fetch via Wayback og:image (when product is delisted from live catalog)
  legacyHandles?: string[]
  // wayback timestamp for legacy fallback
  waybackTs?: string
}

interface ShopifyProduct {
  handle: string
  title: string
  vendor: string
  images: { src: string }[]
}

async function processOne(src: string, slug: string) {
  const jpgPath = join(SOURCE_DIR, `${slug}.jpg`)
  const webpPath = join(NORMALIZED_DIR, `${slug}.webp`)
  const imgRes = await fetch(src, { headers: { 'User-Agent': UA } })
  if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`)
  const buf = new Uint8Array(await imgRes.arrayBuffer())
  writeFileSync(jpgPath, buf)
  execFileSync('magick', [jpgPath, '-resize', '800x800>', '-strip', '-quality', '82', webpPath])
  console.log(`  ✓ ${slug}`)
}

export async function fetchBrand(cfg: FetchConfig) {
  mkdirSync(NORMALIZED_DIR, { recursive: true })
  mkdirSync(SOURCE_DIR, { recursive: true })

  let downloaded = 0
  let failed = 0

  console.log(`fetching ${cfg.origin}/products.json ...`)
  const res = await fetch(`${cfg.origin}/products.json?limit=250`, {
    headers: { 'User-Agent': UA },
  })
  if (!res.ok) throw new Error(`shopify fetch failed: HTTP ${res.status}`)
  const json = (await res.json()) as { products: ShopifyProduct[] }
  const filtered = cfg.vendor ? json.products.filter((p) => p.vendor === cfg.vendor) : json.products
  console.log(`found ${filtered.length} products${cfg.vendor ? ` (vendor=${cfg.vendor})` : ''}`)

  for (const p of filtered) {
    const slug = cfg.slugByHandle[p.handle]
    if (!slug) continue
    const src = p.images[0]?.src
    if (!src) {
      failed++
      console.error(`  ✗ ${p.handle}: no image`)
      continue
    }
    try {
      await processOne(src, slug)
      downloaded++
    } catch (err) {
      failed++
      console.error(`  ✗ ${slug}: ${(err as Error).message}`)
    }
  }

  if (cfg.legacyHandles?.length) {
    if (!cfg.cdnFiles || !cfg.waybackTs) {
      throw new Error('legacyHandles requires cdnFiles + waybackTs in config')
    }
    console.log(`\nfetching ${cfg.legacyHandles.length} legacy handles via wayback...`)
    for (const handle of cfg.legacyHandles) {
      const slug = cfg.slugByHandle[handle]
      if (!slug) continue
      try {
        const wbUrl = `https://web.archive.org/web/${cfg.waybackTs}id_/${cfg.origin}/products/${handle}`
        const html = await (await fetch(wbUrl, { headers: { 'User-Agent': UA } })).text()
        const m = html.match(/"og:image"\s+content="([^"]+)"/)
        if (!m) throw new Error('no og:image meta')
        const file = m[1].split('/').pop()?.split('?')[0]
        if (!file) throw new Error('cannot parse og:image filename')
        await processOne(`${cfg.cdnFiles}/${file}`, slug)
        downloaded++
      } catch (err) {
        failed++
        console.error(`  ✗ ${slug ?? handle}: ${(err as Error).message}`)
      }
    }
  }

  console.log(`\ndownloaded: ${downloaded}, failed: ${failed}`)
}

if (import.meta.main) {
  const brand = process.argv[2]
  if (!brand) {
    console.error('usage: fetch-images-shopify.ts <brand>')
    process.exit(1)
  }
  const mod = await import(`../data/image-fetchers/${brand}.ts`)
  await fetchBrand(mod.config as FetchConfig)
}

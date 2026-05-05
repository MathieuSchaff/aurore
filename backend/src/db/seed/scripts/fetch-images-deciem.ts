#!/usr/bin/env bun
/**
 * fetch-images-deciem.ts — The Ordinary (Deciem / Salesforce Commerce Cloud).
 *
 * Reads a brand config (pageSlug -> aurore DB slug) from
 * `data/image-fetchers/<brand>.ts`, resolves each pageSlug to a product URL by
 * scraping category listings, fetches the page, extracts the pack-shot image
 * (`Images/products/The%20Ordinary/rdn-*.{png,jpg}` — no subfolder filters out
 * model/infographic variants), normalizes to webp via ImageMagick.
 *
 * Usage: bun run backend/src/db/seed/scripts/fetch-images-deciem.ts <brand>
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const SEED_ROOT = join(import.meta.dir, '..')
const NORMALIZED_DIR = join(SEED_ROOT, 'output', 'images-normalized')
const SOURCE_DIR = join(SEED_ROOT, 'output', 'images-source')

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36'

export interface DeciemConfig {
  origin: string
  categoryPaths: string[]
  brandFolder: string // URL-encoded brand folder, e.g. 'The%20Ordinary'
  slugByPageSlug: Record<string, string>
}

async function get(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`)
  return res.text()
}

async function processOne(src: string, slug: string) {
  const ext = src.toLowerCase().includes('.png') ? 'png' : 'jpg'
  const srcPath = join(SOURCE_DIR, `${slug}.${ext}`)
  const webpPath = join(NORMALIZED_DIR, `${slug}.webp`)
  const imgRes = await fetch(src, { headers: { 'User-Agent': UA } })
  if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`)
  const buf = new Uint8Array(await imgRes.arrayBuffer())
  writeFileSync(srcPath, buf)
  execFileSync('magick', [srcPath, '-resize', '800x800>', '-strip', '-quality', '82', webpPath])
  console.log(`  ok ${slug}`)
}

export async function fetchDeciem(cfg: DeciemConfig) {
  mkdirSync(NORMALIZED_DIR, { recursive: true })
  mkdirSync(SOURCE_DIR, { recursive: true })

  const urlByPageSlug: Record<string, string> = {}
  for (const path of cfg.categoryPaths) {
    const url = `${cfg.origin}${path}${path.includes('?') ? '&' : '?'}sz=200`
    console.log(`scanning ${url} ...`)
    const html = await get(url)
    const re = /href="(\/[a-z]{2}-[a-z]{2}\/([a-z0-9-]+)-(\d+)\.html)"/g
    let m: RegExpExecArray | null
    while ((m = re.exec(html)) !== null) {
      const [, href, pageSlug] = m
      if (!urlByPageSlug[pageSlug]) urlByPageSlug[pageSlug] = `${cfg.origin}${href}`
    }
  }
  console.log(`resolved ${Object.keys(urlByPageSlug).length} product URLs`)

  let downloaded = 0
  let failed = 0
  const packShotRe = new RegExp(
    `https://[^"]+/Images/products/${cfg.brandFolder}/[^/"?]+\\.(png|jpg)`
  )

  for (const [pageSlug, dbSlug] of Object.entries(cfg.slugByPageSlug)) {
    const productUrl = urlByPageSlug[pageSlug]
    if (!productUrl) {
      failed++
      console.error(`  fail ${dbSlug}: page slug not in category index (${pageSlug})`)
      continue
    }
    try {
      const html = await get(productUrl)
      const m = html.match(packShotRe)
      if (!m) throw new Error('no pack-shot image in page')
      await processOne(m[0], dbSlug)
      downloaded++
    } catch (err) {
      failed++
      console.error(`  fail ${dbSlug}: ${(err as Error).message}`)
    }
  }

  console.log(`\ndownloaded: ${downloaded}, failed: ${failed}`)
}

if (import.meta.main) {
  const brand = process.argv[2]
  if (!brand) {
    console.error('usage: fetch-images-deciem.ts <brand>')
    process.exit(1)
  }
  const mod = await import(`../data/image-fetchers/${brand}.ts`)
  await fetchDeciem(mod.config as DeciemConfig)
}

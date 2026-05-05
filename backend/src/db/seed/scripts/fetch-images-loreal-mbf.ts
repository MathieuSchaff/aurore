#!/usr/bin/env bun
/**
 * fetch-images-loreal-mbf.ts — L'Oréal "MBFv2" Next.js + Sitecore brands.
 *
 * Reads `data/image-fetchers/<brand>.ts` exposing { origin, pathBySlug }
 * (DB slug -> product page path). For each, fetches the page, locates the
 * <img class="...product-summary__current-img__img..."> element, and decodes
 * the Next.js image proxy URL to recover the underlying Sitecore CDN URL.
 *
 * Usage: bun run backend/src/db/seed/scripts/fetch-images-loreal-mbf.ts <brand>
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const SEED_ROOT = join(import.meta.dir, '..')
const NORMALIZED_DIR = join(SEED_ROOT, 'output', 'images-normalized')
const SOURCE_DIR = join(SEED_ROOT, 'output', 'images-source')

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36'

export interface MbfConfig {
  origin: string
  // DB slug -> product page path (e.g. '/corps/creme-niacinamide-correction-eclat')
  pathBySlug: Record<string, string>
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

const PACK_SHOT_RE =
  /class="[^"]*product-summary__current-img__img[^"]*"[^>]*?(?:srcSet|src)="[^"]*?_next\/image\?url=([^"&]+)/

export async function fetchMbf(cfg: MbfConfig) {
  mkdirSync(NORMALIZED_DIR, { recursive: true })
  mkdirSync(SOURCE_DIR, { recursive: true })

  let downloaded = 0
  let failed = 0

  for (const [dbSlug, path] of Object.entries(cfg.pathBySlug)) {
    const url = `${cfg.origin}${path}`
    try {
      const html = await get(url)
      const m = html.match(PACK_SHOT_RE)
      if (!m) throw new Error('no pack-shot img found')
      const cdnUrl = decodeURIComponent(m[1])
      await processOne(cdnUrl, dbSlug)
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
    console.error('usage: fetch-images-loreal-mbf.ts <brand>')
    process.exit(1)
  }
  const mod = await import(`../data/image-fetchers/${brand}.ts`)
  await fetchMbf(mod.config as MbfConfig)
}

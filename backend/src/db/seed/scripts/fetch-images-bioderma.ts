#!/usr/bin/env bun
/**
 * fetch-images-bioderma.ts — Bioderma (Naos) AEM + Magento backend.
 *
 * Reads `data/image-fetchers/<brand>.ts` exposing { origin, pathBySlug }
 * (DB slug -> /p/<bare> path). For each, fetches the page and extracts the
 * first variant pack-shot from the encoded `data-product-variants` JSON
 * (position=0, type=image).
 *
 * Usage: bun run backend/src/db/seed/scripts/fetch-images-bioderma.ts <brand>
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const SEED_ROOT = join(import.meta.dir, '..')
const NORMALIZED_DIR = join(SEED_ROOT, 'output', 'images-normalized')
const SOURCE_DIR = join(SEED_ROOT, 'output', 'images-source')

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36'

export interface BiodermaConfig {
  origin: string
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

// Pack-shot strategies (HTML attributes are double-encoded with &#34;):
//   1. variants JSON: first asset of first variant (position=0, type=image)
//   2. fallback: Magento media filename matching "bio_<gamme>_<sku>_..._1.png"
//      — Naos packshot convention, used on non-variant pages (e.g. xdefense)
const VARIANT_PACK_SHOT_RE =
  /&#34;position&#34;:0,&#34;type&#34;:&#34;image&#34;,&#34;path&#34;:&#34;(https:\/\/[^&]+)&#34;/
const NAMED_PACK_SHOT_RE =
  /(https:\/\/back-ac-prod\.bioderma\.com\/media\/catalog\/product\/[^"&]*?bio_[^"&]*?_1\.png)/

export async function fetchBioderma(cfg: BiodermaConfig) {
  mkdirSync(NORMALIZED_DIR, { recursive: true })
  mkdirSync(SOURCE_DIR, { recursive: true })

  let downloaded = 0
  let failed = 0

  for (const [dbSlug, path] of Object.entries(cfg.pathBySlug)) {
    const url = `${cfg.origin}${path}`
    try {
      const html = await get(url)
      const m = html.match(VARIANT_PACK_SHOT_RE) ?? html.match(NAMED_PACK_SHOT_RE)
      if (!m) throw new Error('no pack-shot found (variants empty + no bio_*_1.png)')
      await processOne(m[1], dbSlug)
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
    console.error('usage: fetch-images-bioderma.ts <brand>')
    process.exit(1)
  }
  const mod = await import(`../data/image-fetchers/${brand}.ts`)
  await fetchBioderma(mod.config as BiodermaConfig)
}

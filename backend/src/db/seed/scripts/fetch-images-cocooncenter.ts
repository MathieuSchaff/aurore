#!/usr/bin/env bun
/**
 * fetch-images-cocooncenter.ts — Generic fetcher via cocooncenter.com.
 *
 * Cocooncenter has no og:image meta, but ships a JSON-LD Product schema
 * with `"image": ["https://cdn1.costatic.com/img/product/240/.../<slug>-pXXX.jpg"]`.
 * We rewrite the size segment from 240 to 800 to get a higher-res packshot.
 *
 * Usage: bun run backend/src/db/seed/scripts/fetch-images-cocooncenter.ts <brand>
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const SEED_ROOT = join(import.meta.dir, '..')
const NORMALIZED_DIR = join(SEED_ROOT, 'output', 'images-normalized')
const SOURCE_DIR = join(SEED_ROOT, 'output', 'images-source')

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36'

export interface CocoonConfig {
  // DB slug -> cocooncenter product page URL (full https:// URL)
  urlBySlug: Record<string, string>
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

const IMG_RE =
  /"image":\s*\[\s*"(https:\/\/cdn[0-9]+\.costatic\.com\/img\/product\/)(\d+)(\/[^"]+\.(?:jpg|jpeg|png|webp))"/

export async function fetchCocoon(cfg: CocoonConfig) {
  mkdirSync(NORMALIZED_DIR, { recursive: true })
  mkdirSync(SOURCE_DIR, { recursive: true })

  let downloaded = 0
  let failed = 0

  for (const [dbSlug, productUrl] of Object.entries(cfg.urlBySlug)) {
    try {
      const html = await get(productUrl)
      const m = html.match(IMG_RE)
      if (!m) throw new Error('no JSON-LD image')
      // upscale CDN size segment from whatever to 800
      const src = `${m[1]}800${m[3]}`
      await processOne(src, dbSlug)
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
    console.error('usage: fetch-images-cocooncenter.ts <brand>')
    process.exit(1)
  }
  const mod = await import(`../data/image-fetchers/${brand}.ts`)
  await fetchCocoon(mod.config as CocoonConfig)
}

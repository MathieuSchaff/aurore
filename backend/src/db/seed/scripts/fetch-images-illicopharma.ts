#!/usr/bin/env bun
/**
 * fetch-images-illicopharma.ts — Generic fetcher via illicopharma.com.
 *
 * Reads `data/image-fetchers/<brand>.ts` exposing { urlBySlug }
 * (DB slug -> illicopharma product page URL). For each, fetches the
 * page, extracts og:image, normalizes to webp.
 *
 * Useful as a third-party fallback for big-brand products whose first-party
 * sites are bot-protected (Cloudflare etc.) — pharma resellers carry the same
 * pack-shot images and have no anti-bot.
 *
 * Usage: bun run backend/src/db/seed/scripts/fetch-images-illicopharma.ts <brand>
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const SEED_ROOT = join(import.meta.dir, '..')
const NORMALIZED_DIR = join(SEED_ROOT, 'output', 'images-normalized')
const SOURCE_DIR = join(SEED_ROOT, 'output', 'images-source')

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36'

export interface IllicoConfig {
  // DB slug -> illicopharma product page URL (full https:// URL)
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

const OG_RE = /<meta\s+property="og:image"\s+content="([^"]+)"/

export async function fetchIllico(cfg: IllicoConfig) {
  mkdirSync(NORMALIZED_DIR, { recursive: true })
  mkdirSync(SOURCE_DIR, { recursive: true })

  let downloaded = 0
  let failed = 0

  for (const [dbSlug, productUrl] of Object.entries(cfg.urlBySlug)) {
    try {
      const html = await get(productUrl)
      const m = html.match(OG_RE)
      if (!m) throw new Error('no og:image meta')
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
    console.error('usage: fetch-images-illicopharma.ts <brand>')
    process.exit(1)
  }
  const mod = await import(`../data/image-fetchers/${brand}.ts`)
  await fetchIllico(mod.config as IllicoConfig)
}

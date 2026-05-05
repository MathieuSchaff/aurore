#!/usr/bin/env bun
/**
 * fetch-images-pharmashopdiscount.ts — pharmashopdiscount.com (PSD) reseller.
 *
 * No bot-block, no og:image — packshot lives at:
 *   /mbFiles/images/<cat>/thumbs/766x766/<EAN>.jpg
 *
 * Reads `data/image-fetchers/<brand>.ts` exposing { origin, pathBySlug }
 * (DB slug -> PSD product page path).
 *
 * Usage: bun run backend/src/db/seed/scripts/fetch-images-pharmashopdiscount.ts <brand>
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const SEED_ROOT = join(import.meta.dir, '..')
const NORMALIZED_DIR = join(SEED_ROOT, 'output', 'images-normalized')
const SOURCE_DIR = join(SEED_ROOT, 'output', 'images-source')

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36'

export interface PsdConfig {
  origin: string
  pathBySlug: Record<string, string>
}

async function get(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' })
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

const PACK_SHOT_RE = /\/mbFiles\/images\/[^"]+?\/thumbs\/766x766\/[^"]+?\.(?:jpg|jpeg|png|webp)/i
const FALLBACK_RE = /\/mbFiles\/images\/[^"]+?\/thumbs\/(?:416x416|198x198)\/[^"]+?\.(?:jpg|jpeg|png|webp)/i

export async function fetchPsd(cfg: PsdConfig) {
  mkdirSync(NORMALIZED_DIR, { recursive: true })
  mkdirSync(SOURCE_DIR, { recursive: true })

  let downloaded = 0
  let failed = 0

  for (const [dbSlug, path] of Object.entries(cfg.pathBySlug)) {
    const url = `${cfg.origin}${path}`
    try {
      const html = await get(url)
      const m = html.match(PACK_SHOT_RE) ?? html.match(FALLBACK_RE)
      if (!m) throw new Error('no pack-shot in page')
      await processOne(`${cfg.origin}${m[0]}`, dbSlug)
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
    console.error('usage: fetch-images-pharmashopdiscount.ts <brand>')
    process.exit(1)
  }
  const mod = await import(`../data/image-fetchers/${brand}.ts`)
  await fetchPsd(mod.config as PsdConfig)
}

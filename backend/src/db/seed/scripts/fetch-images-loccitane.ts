#!/usr/bin/env bun
/**
 * fetch-images-loccitane.ts — L'Occitane (Demandware Commerce Cloud).
 *
 * Product pages are DataDome-gated, but the static image CDN is not. Image
 * URLs follow a stable template:
 *   https://fr.loccitane.com/dw/image/v2/<site>/on/demandware.static/-/Sites-occ_master/default/<dwHash>/RECT/<SKU>.png?sw=880&sh=1110&sm=fit
 *
 * `dwHash` is the master-catalog build hash and is shared across all SKUs
 * (changes when the catalog is republished). Probe a known SKU page via
 * web.archive.org if the current hash stops working.
 *
 * Usage: bun run backend/src/db/seed/scripts/fetch-images-loccitane.ts <brand>
 */

import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const SEED_ROOT = join(import.meta.dir, '..')
const NORMALIZED_DIR = join(SEED_ROOT, 'output', 'images-normalized')
const SOURCE_DIR = join(SEED_ROOT, 'output', 'images-source')

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/127.0'

export interface LoccitaneConfig {
  cdnBase: string // e.g. 'https://fr.loccitane.com/dw/image/v2/BCDQ_PRD/on/demandware.static/-/Sites-occ_master/default/dw52a35c4e/RECT'
  skuBySlug: Record<string, string>
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

export async function fetchLoccitane(cfg: LoccitaneConfig) {
  mkdirSync(NORMALIZED_DIR, { recursive: true })
  mkdirSync(SOURCE_DIR, { recursive: true })

  let downloaded = 0
  let failed = 0

  for (const [slug, sku] of Object.entries(cfg.skuBySlug)) {
    const url = `${cfg.cdnBase}/${sku}.png?sw=880&sh=1110&sm=fit`
    try {
      await processOne(url, slug)
      downloaded++
    } catch (err) {
      failed++
      console.error(`  fail ${slug}: ${(err as Error).message}`)
    }
  }

  console.log(`\ndownloaded: ${downloaded}, failed: ${failed}`)
}

if (import.meta.main) {
  const brand = process.argv[2]
  if (!brand) {
    console.error('usage: fetch-images-loccitane.ts <brand>')
    process.exit(1)
  }
  const mod = await import(`../data/image-fetchers/${brand}.ts`)
  await fetchLoccitane(mod.config as LoccitaneConfig)
}

#!/usr/bin/env bun
/**
 * download-external-images.ts — Pull Atida + Skinsafe images locally.
 *
 * For seeds whose imageUrl points at an external CDN (assets.atida.com,
 * cdn1.skinsafeproducts.com) and whose slug is NOT in image-mapping.json,
 * download the image, convert to webp, and add it to images-normalized/.
 *
 * Steps:
 *   1. walk data/products/**\/*.seed.ts, extract slug → imageUrl when domain
 *      ∈ {atida, skinsafe} AND slug is not in current mapping
 *   2. fetch each URL → output/images-downloaded/<slug>.<ext>
 *   3. convert with `magick` → output/images-normalized/<slug>.webp
 *   4. update output/image-mapping.json (adds source: 'atida' | 'skinsafe')
 *
 * Idempotent: existing originals & webp are skipped.
 *
 * Usage:
 *   bun run backend/src/db/seed/scripts/download-external-images.ts
 *   bun run backend/src/db/seed/scripts/download-external-images.ts --dry
 */

import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DRY = process.argv.includes('--dry')
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 8)

const SEED_ROOT = join(import.meta.dir, '..')
const PRODUCTS_DIR = join(SEED_ROOT, 'data', 'products')
const MAPPING_PATH = join(SEED_ROOT, 'output', 'image-mapping.json')
const DL_DIR = join(SEED_ROOT, 'output', 'images-downloaded')
const WEBP_DIR = join(SEED_ROOT, 'output', 'images-normalized')
const FAIL_PATH = join(SEED_ROOT, 'output', 'image-download-failures.json')

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const SLUG_RE = /slug:\s*'([^']+)'/g
const URL_RE = /imageUrl:\s*\n?\s*'(https?:\/\/[^']+)'/m

function walkSeed(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walkSeed(p, out)
    else if (name.endsWith('.seed.ts')) out.push(p)
  }
  return out
}

type Job = { slug: string; url: string; source: 'atida' | 'skinsafe' }

const mappingFile = JSON.parse(readFileSync(MAPPING_PATH, 'utf8')) as {
  mapping: Record<string, { source: string; file: string; dir?: string }>
  summary?: Record<string, number>
}
const knownSlugs = new Set(Object.keys(mappingFile.mapping))

const jobs: Job[] = []
for (const file of walkSeed(PRODUCTS_DIR)) {
  const src = readFileSync(file, 'utf8')
  const slugMatches: { idx: number; slug: string }[] = []
  for (const m of src.matchAll(SLUG_RE)) {
    slugMatches.push({ idx: m.index ?? 0, slug: m[1] })
  }
  for (let i = 0; i < slugMatches.length; i++) {
    const { idx, slug } = slugMatches[i]
    if (knownSlugs.has(slug)) continue
    const end = i + 1 < slugMatches.length ? slugMatches[i + 1].idx : src.length
    const block = src.slice(idx, end)
    const u = block.match(URL_RE)
    if (!u) continue
    const url = u[1]
    let source: Job['source'] | null = null
    if (url.includes('atida')) source = 'atida'
    else if (url.includes('skinsafe')) source = 'skinsafe'
    if (!source) continue
    jobs.push({ slug, url, source })
  }
}

const byBrand = (s: string) => s.split('-')[0]
const counts = jobs.reduce<Record<string, number>>((acc, j) => {
  acc[j.source] = (acc[j.source] ?? 0) + 1
  return acc
}, {})
console.log(`jobs: ${jobs.length} (atida=${counts.atida ?? 0}, skinsafe=${counts.skinsafe ?? 0})`)

if (DRY) {
  console.log('\n--- DRY RUN ---')
  for (const j of jobs.slice(0, 3)) console.log(`  ${j.source}  ${j.slug}\n    ${j.url}`)
  if (jobs.length > 3) console.log(`  ... +${jobs.length - 3} more`)
  process.exit(0)
}

mkdirSync(DL_DIR, { recursive: true })
mkdirSync(WEBP_DIR, { recursive: true })

function extFromContentType(ct: string | null, fallback: string): string {
  if (!ct) return fallback
  if (ct.includes('jpeg')) return 'jpg'
  if (ct.includes('png')) return 'png'
  if (ct.includes('webp')) return 'webp'
  return fallback
}

function magick(src: string, dst: string): Promise<boolean> {
  return new Promise((resolve) => {
    const p = spawn('magick', [src, '-quality', '85', dst])
    p.on('close', (code) => resolve(code === 0))
    p.on('error', () => resolve(false))
  })
}

async function downloadOne(job: Job): Promise<{ ok: boolean; reason?: string; ext?: string }> {
  // skip if normalized webp already exists (idempotent)
  const webpPath = join(WEBP_DIR, `${job.slug}.webp`)
  if (existsSync(webpPath)) return { ok: true }

  // detect existing original (any ext)
  for (const e of ['jpg', 'jpeg', 'png', 'webp']) {
    if (existsSync(join(DL_DIR, `${job.slug}.${e}`))) {
      const ok = await magick(join(DL_DIR, `${job.slug}.${e}`), webpPath)
      return ok ? { ok: true, ext: e } : { ok: false, reason: 'magick failed' }
    }
  }

  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 10_000)
    const res = await fetch(job.url, {
      headers: { 'User-Agent': UA, Accept: 'image/avif,image/webp,image/*,*/*;q=0.8' },
      signal: ctrl.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return { ok: false, reason: `http ${res.status}` }
    const ext = extFromContentType(res.headers.get('content-type'), 'jpg')
    const dlPath = join(DL_DIR, `${job.slug}.${ext}`)
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length === 0) return { ok: false, reason: 'empty body' }
    writeFileSync(dlPath, buf)
    const ok = await magick(dlPath, webpPath)
    return ok ? { ok: true, ext } : { ok: false, reason: 'magick failed', ext }
  } catch (err) {
    return { ok: false, reason: (err as Error).message ?? 'fetch error' }
  }
}

let done = 0
let failed = 0
const failures: { slug: string; url: string; reason: string }[] = []
const start = Date.now()
const queue = [...jobs]

async function worker() {
  while (queue.length > 0) {
    const j = queue.shift()
    if (!j) break
    const r = await downloadOne(j)
    if (r.ok) {
      done++
    } else {
      failed++
      failures.push({ slug: j.slug, url: j.url, reason: r.reason ?? 'unknown' })
    }
    if ((done + failed) % 50 === 0) {
      const rate = ((done + failed) / ((Date.now() - start) / 1000)).toFixed(1)
      console.log(`  ${done + failed}/${jobs.length} (ok=${done} fail=${failed}, ${rate}/s)`)
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))

console.log(`\ndone: ${done} downloaded, ${failed} failed in ${((Date.now() - start) / 1000).toFixed(1)}s`)

if (failures.length > 0) {
  writeFileSync(FAIL_PATH, JSON.stringify(failures, null, 2))
  console.log(`failures written: ${FAIL_PATH}`)
}

// merge new entries into mapping
let added = 0
for (const j of jobs) {
  if (failures.some((f) => f.slug === j.slug)) continue
  if (!existsSync(join(WEBP_DIR, `${j.slug}.webp`))) continue
  if (mappingFile.mapping[j.slug]) continue
  mappingFile.mapping[j.slug] = { source: j.source, file: `${j.slug}.webp` }
  added++
}
const total = Object.keys(mappingFile.mapping).length
mappingFile.summary = {
  total,
  detail: Object.values(mappingFile.mapping).filter((v) => v.source === 'detail').length,
  thumb: Object.values(mappingFile.mapping).filter((v) => v.source === 'thumb').length,
  atida: Object.values(mappingFile.mapping).filter((v) => v.source === 'atida').length,
  skinsafe: Object.values(mappingFile.mapping).filter((v) => v.source === 'skinsafe').length,
}
writeFileSync(MAPPING_PATH, JSON.stringify(mappingFile, null, 2))
console.log(`mapping: +${added} entries → total ${total}`)
console.log(`  detail=${mappingFile.summary.detail} thumb=${mappingFile.summary.thumb} atida=${mappingFile.summary.atida} skinsafe=${mappingFile.summary.skinsafe}`)

process.exit(failed === 0 ? 0 : 0)

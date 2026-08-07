#!/usr/bin/env bun
/**
 * Deletes product images from Bunny Storage. Reads slugs from the CDN-delete list
 * (or $SLUGS_FILE) and DELETEs each <slug>.webp; 404s count as success (idempotent).
 * Required env: BUNNY_STORAGE_ZONE, BUNNY_STORAGE_PASSWORD.
 * Usage: bun run backend/src/images/maintenance/delete-bunny.ts [--apply]  # preview by default
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { deleteBunny, resolveBunnyConfig } from '../lib/bunny'

const cfg = resolveBunnyConfig()
const SLUGS_FILE =
  process.env.SLUGS_FILE ??
  join(import.meta.dir, '..', '..', 'db', 'seed', 'output', 'dedup-dropped-slugs.json')
const APPLY = process.argv.includes('--apply')
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 8)

if (APPLY) {
  const missing = ['BUNNY_STORAGE_ZONE', 'BUNNY_STORAGE_PASSWORD'].filter((k) => !process.env[k])
  if (missing.length > 0) {
    console.error(`missing env: ${missing.join(', ')}`)
    process.exit(1)
  }
}

const slugs: string[] = JSON.parse(readFileSync(SLUGS_FILE, 'utf8'))
console.log(`${slugs.length} slugs to delete from ${SLUGS_FILE}`)

if (!APPLY) {
  console.log('--- DRY RUN ---')
  for (const s of slugs.slice(0, 5)) {
    console.log(`  DELETE https://${cfg.hostname}/${cfg.zone ?? '<zone>'}/${cfg.prefix}${s}.webp`)
  }
  if (slugs.length > 5) console.log(`  ... and ${slugs.length - 5} more`)
  process.exit(0)
}

let deleted = 0
let notFound = 0
let failed = 0

async function deleteOne(slug: string) {
  try {
    const result = await deleteBunny(cfg, `${slug}.webp`)
    if (result === 'notFound') notFound++
    else deleted++
  } catch (err) {
    failed++
    console.error(`  fail: ${slug} — ${(err as Error).message}`)
  }
}

const queue = [...slugs]
async function worker() {
  while (queue.length > 0) {
    const s = queue.shift()
    if (s) await deleteOne(s)
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))

console.log(`\ndeleted: ${deleted}, not-found (already gone): ${notFound}, failed: ${failed}`)
process.exit(failed === 0 ? 0 : 1)

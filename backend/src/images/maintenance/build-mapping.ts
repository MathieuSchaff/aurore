#!/usr/bin/env bun

// Bunny storage is authoritative; local normalized files are only transient staging.

import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { SQL } from 'bun'

import { listBunny, resolveBunnyConfig } from '../lib/bunny'
import { resolveImageOutputDir } from '../lib/paths'
import { buildImageMapping, imageMappingTarget, type ProductImageRow } from './repair-plan'

const DRY = process.argv.includes('--dry')
const OUTPUT_DIR = resolveImageOutputDir()
const NORMALIZED_DIR = join(OUTPUT_DIR, 'images-normalized')
const MAPPING_PATH = join(OUTPUT_DIR, 'image-mapping.json')

const cfg = resolveBunnyConfig()
// app_runtime would hide masked products and misclassify their images as orphans.
const DB_URL = process.env.DATABASE_URL
const environment = process.env.IMAGE_MAINTENANCE_TARGET

const missing = [
  !cfg.zone && 'BUNNY_STORAGE_ZONE',
  !cfg.password && 'BUNNY_STORAGE_PASSWORD',
  !DB_URL && 'DATABASE_URL',
  !environment && 'IMAGE_MAINTENANCE_TARGET',
  !cfg.cdnBase && 'IMAGE_CDN_BASE',
].filter(Boolean) as string[]
if (missing.length > 0) {
  console.error(`missing env: ${missing.join(', ')}`)
  process.exit(1)
}

console.log(`→ listing Bunny storage at ${cfg.prefix}…`)
const items = await listBunny(cfg)
const cdnWebpFiles = items
  .filter((i) => !i.IsDirectory && i.ObjectName.endsWith('.webp'))
  .map((i) => i.ObjectName)
console.log(`  ${cdnWebpFiles.length} webp on Bunny`)

const localFiles = existsSync(NORMALIZED_DIR)
  ? readdirSync(NORMALIZED_DIR).filter((file) => file.endsWith('.webp'))
  : []
console.log(`  ${localFiles.length} webp local (staging)\n`)

const sql = new SQL(DB_URL as string)
const rows = (await sql`SELECT slug, image_url FROM products`) as ProductImageRow[]
await sql.close()
const payload = buildImageMapping(
  rows,
  cdnWebpFiles,
  localFiles,
  cfg,
  imageMappingTarget(DB_URL as string, cfg, environment as string)
)
console.log('→ summary')
console.table(payload.summary)
console.log('CDN orphan candidates are informational only; this mapping never authorizes deletion.')

if (DRY) {
  console.log(`\n(dry run: would write ${MAPPING_PATH})`)
} else {
  mkdirSync(OUTPUT_DIR, { recursive: true })
  writeFileSync(MAPPING_PATH, `${JSON.stringify(payload, null, 2)}\n`)
  console.log(`\nwrote ${MAPPING_PATH}`)
}

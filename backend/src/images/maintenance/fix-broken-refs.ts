#!/usr/bin/env bun

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { SQL } from 'bun'

import { resolveBunnyConfig } from '../lib/bunny'
import { resolveImageOutputDir } from '../lib/paths'
import { applyImageRepairs } from './apply-repairs'
import { imageMappingTarget, repairPlanSchema } from './repair-plan'

const APPLY = process.argv.includes('--apply')
const MAPPING_PATH = join(resolveImageOutputDir(), 'image-mapping.json')
const cfg = resolveBunnyConfig()
// app_runtime cannot see or repair every product, even when the CDN copy succeeds.
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

const parsed = repairPlanSchema.safeParse(JSON.parse(readFileSync(MAPPING_PATH, 'utf8')))
if (!parsed.success) {
  console.error('Unsupported image mapping; run image-build-mapping again.')
  process.exit(1)
}
const plan = parsed.data
const target = imageMappingTarget(DB_URL as string, cfg, environment as string)
if (plan.target !== target) {
  console.error('Image mapping target mismatch; run image-build-mapping on this target.')
  process.exit(1)
}

console.log('→ plan (sources and orphan candidates are retained)')
for (const r of plan.renames) console.log(`  COPY ${r.oldFile} → ${r.newFile} (slug ${r.slug})`)
for (const n of plan.nullifies)
  console.log(`  NULLIFY ${n.slug} if the source is still missing and its URL is unchanged`)
console.log(APPLY ? '\n→ APPLY mode\n' : '\n→ DRY RUN (use --apply to execute)\n')
if (!APPLY) process.exit(0)

const sql = new SQL(DB_URL as string)
let failed = false
try {
  const results = await applyImageRepairs(sql, cfg, plan, target)
  for (const result of results) {
    console.log(
      `  ${result.status} ${result.kind} ${result.slug}${result.reason ? `: ${result.reason}` : ''}`
    )
  }
  const done = results.filter((result) => result.status === 'done').length
  const skipped = results.filter((result) => result.status === 'skipped').length
  const failures = results.filter((result) => result.status === 'failed').length
  console.log(`\ndone=${done}, skipped=${skipped}, failed=${failures}. CDN files retained.`)
  if (skipped) console.log('Rebuild the mapping before retrying skipped repairs.')
  failed = failures > 0
} finally {
  await sql.close()
}
process.exit(failed ? 1 : 0)

#!/usr/bin/env bun
/**
 * upload-images.ts — Upload normalized product images to S3.
 *
 * Reads output/images-normalized/<slug>.webp and pushes each to
 * s3://${S3_BUCKET}/${S3_PREFIX}<slug>.webp using Bun's built-in S3 client.
 *
 * Required env:
 *   S3_BUCKET            target bucket name
 *   S3_REGION            (default: auto)
 *   S3_ENDPOINT          custom endpoint (e.g. for Bunny edge S3 / Backblaze)
 *   S3_ACCESS_KEY_ID
 *   S3_SECRET_ACCESS_KEY
 *
 * Optional env:
 *   S3_PREFIX            key prefix, trailing slash optional (default: products/)
 *   DRY_RUN              "1" → list jobs, no upload
 *   CONCURRENCY          parallel uploads (default: 16)
 *
 * Usage:
 *   bun run backend/src/db/seed/scripts/upload-images.ts
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SEED_ROOT = join(import.meta.dir, '..')
const SOURCE_DIR = join(SEED_ROOT, 'output', 'images-normalized')

const BUCKET = process.env.S3_BUCKET
const REGION = process.env.S3_REGION ?? 'auto'
const ENDPOINT = process.env.S3_ENDPOINT
const ACCESS_KEY = process.env.S3_ACCESS_KEY_ID
const SECRET_KEY = process.env.S3_SECRET_ACCESS_KEY
const PREFIX = (process.env.S3_PREFIX ?? 'products/').replace(/^\/+|\/+$/g, '') + '/'
const DRY_RUN = process.env.DRY_RUN === '1'
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 16)

if (!DRY_RUN) {
  const missing = ['S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY'].filter(
    (k) => !process.env[k],
  )
  if (missing.length > 0) {
    console.error(`missing env: ${missing.join(', ')}\nuse DRY_RUN=1 to preview`)
    process.exit(1)
  }
}

const files = readdirSync(SOURCE_DIR).filter((f) => f.endsWith('.webp'))
console.log(`found ${files.length} webp files in ${SOURCE_DIR}`)
if (DRY_RUN) {
  console.log('--- DRY RUN ---')
  for (const f of files.slice(0, 5)) {
    const size = statSync(join(SOURCE_DIR, f)).size
    console.log(`  s3://${BUCKET ?? '<bucket>'}/${PREFIX}${f}  (${size} B)`)
  }
  if (files.length > 5) console.log(`  ... and ${files.length - 5} more`)
  process.exit(0)
}

// biome-ignore lint/suspicious/noExplicitAny: Bun.S3Client is runtime-only API
const client = new (Bun as any).S3Client({
  bucket: BUCKET,
  region: REGION,
  endpoint: ENDPOINT,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
})

let done = 0
let failed = 0
const start = Date.now()

async function uploadOne(file: string) {
  const key = `${PREFIX}${file}`
  const body = readFileSync(join(SOURCE_DIR, file))
  try {
    await client.write(key, body, { type: 'image/webp' })
    done++
    if (done % 100 === 0) {
      const rate = (done / ((Date.now() - start) / 1000)).toFixed(1)
      console.log(`  ${done}/${files.length} (${rate}/s)`)
    }
  } catch (err) {
    failed++
    console.error(`  fail: ${file} — ${(err as Error).message}`)
  }
}

const queue = [...files]
async function worker() {
  while (queue.length > 0) {
    const f = queue.shift()
    if (f) await uploadOne(f)
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))

console.log(`\ndone: ${done} uploaded, ${failed} failed in ${((Date.now() - start) / 1000).toFixed(1)}s`)
process.exit(failed === 0 ? 0 : 1)

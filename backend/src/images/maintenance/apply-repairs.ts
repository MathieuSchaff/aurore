import type { SQL } from 'bun'

import { type BunnyConfig, existsBunny } from '../lib/bunny'
import { type ImageRepairPlan, referencedImageFile } from './repair-plan'

type Storage = {
  exists: typeof existsBunny
}
type RepairResult = {
  slug: string
  kind: 'nullify'
  status: 'done' | 'skipped' | 'failed'
  reason?: string
}

type Repair = ImageRepairPlan['nullifies'][number]

async function applyRepair(
  sql: SQL,
  cfg: BunnyConfig,
  repair: Repair,
  storage: Storage
): Promise<Pick<RepairResult, 'status' | 'reason'>> {
  if (referencedImageFile(repair.oldUrl, cfg) !== repair.oldFile) {
    throw new Error('Image mapping source mismatch; rebuild the mapping')
  }
  const current = await sql`SELECT image_url FROM products WHERE slug = ${repair.slug}`
  if (current[0]?.image_url !== repair.oldUrl) return { status: 'skipped', reason: 'URL changed' }
  if (await storage.exists(cfg, repair.oldFile)) {
    return { status: 'skipped', reason: 'Source restored' }
  }
  // The URL can change while the CDN probe is pending. Never erase that newer write
  const updated = await sql`UPDATE products SET image_url = NULL
    WHERE slug = ${repair.slug} AND image_url = ${repair.oldUrl} RETURNING slug`
  return updated.length ? { status: 'done' } : { status: 'skipped', reason: 'URL changed' }
}

export async function applyImageRepairs(
  sql: SQL,
  cfg: BunnyConfig,
  plan: ImageRepairPlan,
  target: string,
  storage: Storage = { exists: existsBunny }
): Promise<RepairResult[]> {
  if (plan.target !== target) throw new Error('Image mapping target mismatch; rebuild the mapping')
  const results: RepairResult[] = []
  for (const repair of plan.nullifies) {
    const { slug } = repair
    const kind = 'nullify'
    try {
      results.push({ slug, kind, ...(await applyRepair(sql, cfg, repair, storage)) })
    } catch (error) {
      results.push({ slug, kind, status: 'failed', reason: (error as Error).message })
    }
  }
  return results
}

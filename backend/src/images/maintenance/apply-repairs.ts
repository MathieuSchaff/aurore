import type { SQL } from 'bun'

import { type BunnyConfig, getBunny, listBunny, putBunny } from '../lib/bunny'
import { type ImageRepairPlan, referencedImageFile } from './repair-plan'

type Storage = {
  list: typeof listBunny
  get: typeof getBunny
  put: typeof putBunny
}
type RepairResult = {
  slug: string
  kind: 'rename' | 'nullify'
  status: 'done' | 'skipped' | 'failed'
  reason?: string
}

type Repair =
  | (ImageRepairPlan['renames'][number] & { kind: 'rename' })
  | (ImageRepairPlan['nullifies'][number] & { kind: 'nullify' })

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
  const inventory = new Set(
    (await storage.list(cfg)).filter((item) => !item.IsDirectory).map((item) => item.ObjectName)
  )
  let newUrl: string | null = null
  if (repair.kind === 'rename') {
    if (!inventory.has(repair.oldFile) || inventory.has(repair.newFile)) {
      return { status: 'skipped', reason: 'CDN inventory changed' }
    }
    const body = await storage.get(cfg, repair.oldFile)
    await storage.put(cfg, repair.newFile, body)
    newUrl = `${cfg.cdnBase}/${cfg.prefix}${repair.newFile}`
  } else if (inventory.has(repair.oldFile)) {
    return { status: 'skipped', reason: 'Source restored' }
  }
  // The URL can change while CDN calls are pending. Never erase that newer write.
  const updated = await sql`UPDATE products SET image_url = ${newUrl}
    WHERE slug = ${repair.slug} AND image_url = ${repair.oldUrl} RETURNING slug`
  return updated.length ? { status: 'done' } : { status: 'skipped', reason: 'URL changed' }
}

export async function applyImageRepairs(
  sql: SQL,
  cfg: BunnyConfig,
  plan: ImageRepairPlan,
  target: string,
  storage: Storage = { list: listBunny, get: getBunny, put: putBunny }
): Promise<RepairResult[]> {
  if (plan.target !== target) throw new Error('Image mapping target mismatch; rebuild the mapping')
  const results: RepairResult[] = []
  const repairs: Repair[] = [
    ...plan.renames.map((repair) => ({ ...repair, kind: 'rename' as const })),
    ...plan.nullifies.map((repair) => ({ ...repair, kind: 'nullify' as const })),
  ]
  // A single DB inventory cannot authorize deletion in a potentially shared CDN zone.
  for (const repair of repairs) {
    const { slug, kind } = repair
    try {
      results.push({ slug, kind, ...(await applyRepair(sql, cfg, repair, storage)) })
    } catch (error) {
      results.push({ slug, kind, status: 'failed', reason: (error as Error).message })
    }
  }
  return results
}

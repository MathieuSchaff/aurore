import { createHash, randomUUID } from 'node:crypto'

import { z } from 'zod'

import type { BunnyConfig } from '../lib/bunny'

export type ProductImageRow = { slug: string; image_url: string | null }

const fileSchema = z
  .string()
  .regex(/^[^/\\?#]+\.webp$/)
  .refine((file) => !file.includes('%'))
const repairSchema = z.object({ slug: z.string().min(1), oldUrl: z.url(), oldFile: fileSchema })
export const repairPlanSchema = z.object({
  version: z.literal(2),
  target: z.string().min(1),
  renames: z.array(repairSchema.extend({ newFile: fileSchema })),
  nullifies: z.array(repairSchema),
})
export type ImageRepairPlan = z.infer<typeof repairPlanSchema>

export function imageMappingTarget(
  databaseUrl: string,
  cfg: BunnyConfig,
  environment: string
): string {
  const db = new URL(databaseUrl)
  // Bind plans to their destination without recording credentials in the artifact.
  return createHash('sha256')
    .update(
      JSON.stringify([
        environment,
        db.host,
        db.pathname,
        cfg.hostname,
        cfg.zone,
        cfg.prefix,
        cfg.cdnBase,
      ])
    )
    .digest('hex')
}

export function referencedImageFile(raw: string | null, cfg: BunnyConfig): string | null {
  if (!raw) return null
  const url = URL.parse(raw)
  const base = new URL(`${cfg.cdnBase}/${cfg.prefix}`)
  if (!url || url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return null
  let file: string
  try {
    file = decodeURIComponent(url.pathname.slice(base.pathname.length))
  } catch {
    return null
  }
  const parsed = fileSchema.safeParse(file)
  return parsed.success ? parsed.data : null
}

export function buildImageMapping(
  rows: ProductImageRow[],
  cdnFiles: string[],
  localFiles: string[],
  cfg: BunnyConfig,
  target: string
) {
  const files = new Set(cdnFiles)
  const local = new Set(localFiles)
  const referenced = new Set<string>()
  const mapping: Record<string, { source: 'cdn'; file: string; localStaged: boolean }> = {}
  const renames: ImageRepairPlan['renames'] = []
  const nullifies: ImageRepairPlan['nullifies'] = []
  const missing: ProductImageRow[] = []

  for (const row of rows) {
    const file = referencedImageFile(row.image_url, cfg)
    if (file) referenced.add(file)
    if (!row.image_url || !file || !files.has(file)) {
      missing.push(row)
      if (file && row.image_url) {
        nullifies.push({ slug: row.slug, oldUrl: row.image_url, oldFile: file })
      }
      continue
    }
    mapping[row.slug] = { source: 'cdn', file, localStaged: local.has(file) }
    const canonical = `${row.slug}.webp`
    if (file !== canonical && !files.has(canonical) && !file.startsWith(`${row.slug}-recovered-`)) {
      // A unique destination cannot overwrite an upload that starts after this inventory.
      const newFile = fileSchema.parse(`${row.slug}-recovered-${randomUUID()}.webp`)
      renames.push({ slug: row.slug, oldUrl: row.image_url, oldFile: file, newFile })
    }
  }

  const slugs = (names: string[]) => names.map((file) => file.replace(/\.webp$/, '')).sort()
  const gaps = {
    cdnOrphans: slugs(cdnFiles.filter((file) => !referenced.has(file))),
    localOrphans: slugs(localFiles.filter((file) => !referenced.has(file))),
    localPendingUpload: slugs(localFiles.filter((file) => !files.has(file))),
    productsNoCdnNoUrl: missing.filter((row) => !row.image_url).map((row) => row.slug),
    productsNoCdnExternal: missing
      .filter((row) => row.image_url)
      .map((row) => ({ slug: row.slug, url: row.image_url })),
  }
  return {
    version: 2 as const,
    target,
    renames,
    nullifies,
    mapping,
    gaps,
    summary: {
      mapped: Object.keys(mapping).length,
      cdnFiles: cdnFiles.length,
      localStaged: local.size,
      dbProducts: rows.length,
      cdnOrphans: gaps.cdnOrphans.length,
      localOrphans: gaps.localOrphans.length,
      localPendingUpload: gaps.localPendingUpload.length,
      productsNoCdn: missing.length,
      productsNoCdnNoUrl: gaps.productsNoCdnNoUrl.length,
      productsNoCdnExternal: gaps.productsNoCdnExternal.length,
    },
  }
}

import { describe, expect, it } from 'bun:test'

import type { BunnyConfig } from '../lib/bunny'
import {
  buildImageMapping,
  imageMappingTarget,
  referencedImageFile,
  repairPlanSchema,
} from './repair-plan'

const cfg: BunnyConfig = {
  hostname: 'storage.example.com',
  zone: 'test',
  prefix: 'products/',
  cdnBase: 'https://cdn.example.com',
}
const cdn = `${cfg.cdnBase}/products/`

describe('buildImageMapping', () => {
  it.each([
    [
      [
        { slug: 'a', image_url: `${cdn}a.webp` },
        { slug: 'b', image_url: `${cdn}a.webp` },
      ],
      ['a.webp'],
    ],
    [[{ slug: 'b', image_url: `${cdn}old.webp?v=1#preview` }], ['old.webp']],
    [[{ slug: 'b', image_url: `${cdn}old.webp` }], ['old.webp', 'b.webp']],
  ])('preserves referenced files independently of product slugs (%j)', (rows, files) => {
    const plan = buildImageMapping(rows, files, [], cfg, 'test-target')
    // Slug-based inventories used to nullify a shared URL or delete the referenced old file.
    expect(plan.nullifies).toEqual([])
    expect(plan.gaps.cdnOrphans).not.toContain('old')
    expect(plan.gaps.cdnOrphans).not.toContain('a')
    expect(plan.mapping.b.file).toBe(files[0])
  })

  it('plans distinct recovery copies for products sharing a source', () => {
    const plan = buildImageMapping(
      [
        { slug: 'a', image_url: `${cdn}old.webp` },
        { slug: 'b', image_url: `${cdn}old.webp` },
      ],
      ['old.webp'],
      [],
      cfg,
      'test-target'
    )
    expect(plan.renames).toHaveLength(2)
    expect(plan.renames.map((r) => r.oldFile)).toEqual(['old.webp', 'old.webp'])
    expect(plan.renames[0].newFile).toMatch(/^a-recovered-.+\.webp$/)
    expect(plan.renames[1].newFile).toMatch(/^b-recovered-.+\.webp$/)
    expect(repairPlanSchema.safeParse(plan).success).toBe(true)
  })

  it('distinguishes a missing referenced file from an unused canonical file', () => {
    const plan = buildImageMapping(
      [{ slug: 'a', image_url: `${cdn}missing.webp?v=1` }],
      ['a.webp'],
      [],
      cfg,
      'test-target'
    )
    expect(plan.nullifies).toEqual([
      { slug: 'a', oldUrl: `${cdn}missing.webp?v=1`, oldFile: 'missing.webp' },
    ])
    expect(plan.gaps.cdnOrphans).toEqual(['a'])
  })

  it('leaves existing recovery copies stable on subsequent inventories', () => {
    const plan = buildImageMapping(
      [{ slug: 'a', image_url: `${cdn}a-recovered-123.webp` }],
      ['a-recovered-123.webp'],
      [],
      cfg,
      'test-target'
    )
    expect(plan.renames).toEqual([])
    expect(plan.nullifies).toEqual([])
    expect(plan.gaps.cdnOrphans).toEqual([])
  })
})

describe('referencedImageFile', () => {
  it.each([
    'https://evil.example/products/a.webp',
    `${cdn}../avatars/a.webp`,
    `${cdn}nested/a.webp`,
    `${cdn}%2fsecret.webp`,
    `${cdn}%ZZ.webp`,
  ])('ignores foreign or malformed keys (%s)', (url) => {
    expect(referencedImageFile(url, cfg)).toBeNull()
  })
  it('normalizes encoded names and query/hash against the configured prefix', () => {
    expect(referencedImageFile(`${cdn}%6fld.webp?v=1#x`, cfg)).toBe('old.webp')
  })
})

describe('image mapping compatibility', () => {
  it('rejects the old unscoped mapping format', () => {
    expect(
      repairPlanSchema.safeParse({ gaps: { cdnOrphans: ['old'], productsNoCdnExternal: [] } })
        .success
    ).toBe(false)
  })
  it('binds a mapping to DB and CDN identity without depending on passwords', () => {
    const first = imageMappingTarget('postgres://app:dummy@localhost:5433/test', cfg, 'dev')
    expect(imageMappingTarget('postgres://app:rotated@localhost:5433/test', cfg, 'dev')).toBe(first)
    expect(imageMappingTarget('postgres://app:dummy@localhost:5433/other', cfg, 'dev')).not.toBe(
      first
    )
    expect(imageMappingTarget('postgres://app:dummy@localhost:5434/test', cfg, 'dev')).not.toBe(
      first
    )
    expect(
      imageMappingTarget(
        'postgres://app:dummy@localhost:5433/test',
        { ...cfg, zone: 'other' },
        'dev'
      )
    ).not.toBe(first)
  })
})

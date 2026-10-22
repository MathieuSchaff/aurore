import { describe, expect, it } from 'bun:test'

import { testDb } from '../../tests/db.test.config'
import { setupDbTests } from '../../tests/db-setup'
import { createTestAdminUser, createTestProduct } from '../../tests/helpers/test-factories'
import type { BunnyConfig } from '../lib/bunny'
import { applyImageRepairs } from './apply-repairs'
import { buildImageMapping, type ProductImageRow } from './repair-plan'

setupDbTests()

const cfg: BunnyConfig = {
  hostname: 'storage.example.com',
  zone: 'test',
  prefix: 'products/',
  cdnBase: 'https://cdn.example.com',
}
const cdn = `${cfg.cdnBase}/products/`
const sql = testDb.$client
const imageBytes = new Uint8Array([1, 2, 3])

describe('applyImageRepairs', () => {
  async function seedImages(rows: ProductImageRow[]) {
    const author = await createTestAdminUser()
    for (const row of rows) {
      await createTestProduct(author.id, {
        name: `Repair ${row.slug}`,
        slug: row.slug,
        imageUrl: row.image_url ?? undefined,
      })
    }
  }

  function storageWith(...names: string[]) {
    const files = new Map<string, Uint8Array>(names.map((name) => [name, imageBytes]))
    return {
      files,
      async exists(_cfg: BunnyConfig, name: string) {
        return files.has(name)
      },
      async list() {
        return [...files].map(([ObjectName, bytes]) => ({
          ObjectName,
          IsDirectory: false,
          Length: bytes.length,
        }))
      },
    }
  }

  async function storedUrl(slug: string) {
    const rows = await sql`SELECT image_url FROM products WHERE slug = ${slug}`
    return rows[0].image_url as string | null
  }

  it('preserves healthy shared references without writing recovery copies', async () => {
    const rows = [
      { slug: 'a', image_url: `${cdn}old.webp` },
      { slug: 'b', image_url: `${cdn}old.webp` },
    ]
    await seedImages(rows)
    const storage = storageWith('old.webp', 'prod-only.webp')
    const plan = buildImageMapping(rows, [...storage.files.keys()], [], cfg, 'test-target')

    const results = await applyImageRepairs(sql, cfg, plan, 'test-target', storage)

    expect(results).toEqual([])
    expect(await storedUrl('a')).toBe(`${cdn}old.webp`)
    expect(await storedUrl('b')).toBe(`${cdn}old.webp`)
    expect([...storage.files.keys()].sort()).toEqual(['old.webp', 'prod-only.webp'])
  })

  it('checks only missing references without listing the full CDN inventory', async () => {
    const rows = [
      { slug: 'a', image_url: `${cdn}missing-a.webp` },
      { slug: 'b', image_url: `${cdn}missing-b.webp` },
    ]
    await seedImages(rows)
    const storage = storageWith('unrelated.webp')
    let listings = 0
    storage.list = async () => {
      listings++
      return []
    }
    const plan = buildImageMapping(rows, [], [], cfg, 'test-target')

    await applyImageRepairs(sql, cfg, plan, 'test-target', storage)

    expect(listings).toBe(0)
    expect(await storedUrl('a')).toBeNull()
    expect(await storedUrl('b')).toBeNull()
  })

  it('preserves a reference when its CDN probe fails and continues with the next product', async () => {
    const rows = [
      { slug: 'a', image_url: `${cdn}missing-a.webp` },
      { slug: 'b', image_url: `${cdn}missing-b.webp` },
    ]
    await seedImages(rows)
    const storage = storageWith()
    storage.exists = async (_config, name) => {
      if (name === 'missing-a.webp') throw new Error('CDN unavailable')
      return false
    }
    const plan = buildImageMapping(rows, [], [], cfg, 'test-target')

    const results = await applyImageRepairs(sql, cfg, plan, 'test-target', storage)

    expect(results.map((result) => result.status)).toEqual(['failed', 'done'])
    expect(await storedUrl('a')).toBe(`${cdn}missing-a.webp`)
    expect(await storedUrl('b')).toBeNull()
  })

  it('nullifies a reference only when its source is still missing', async () => {
    const rows = [{ slug: 'a', image_url: `${cdn}missing.webp?v=1` }]
    await seedImages(rows)
    const plan = buildImageMapping(rows, [], [], cfg, 'test-target')
    const results = await applyImageRepairs(sql, cfg, plan, 'test-target', storageWith())
    expect(results.map((r) => r.status)).toEqual(['done'])
    expect(await storedUrl('a')).toBeNull()
  })

  it('preserves a repaired URL when an old nullification plan is applied', async () => {
    const rows = [{ slug: 'a', image_url: `${cdn}missing.webp` }]
    await seedImages(rows)
    const plan = buildImageMapping(rows, [], [], cfg, 'test-target')
    await sql`UPDATE products SET image_url = ${`${cdn}a.webp?v=2`} WHERE slug = 'a'`
    const results = await applyImageRepairs(sql, cfg, plan, 'test-target', storageWith('a.webp'))
    expect(results.map((r) => r.status)).toEqual(['skipped'])
    expect(await storedUrl('a')).toBe(`${cdn}a.webp?v=2`)
  })

  it('rechecks the URL atomically after a concurrent write during the CDN probe', async () => {
    const rows = [{ slug: 'a', image_url: `${cdn}missing.webp` }]
    await seedImages(rows)
    const plan = buildImageMapping(rows, [], [], cfg, 'test-target')
    const storage = storageWith()
    storage.exists = async () => {
      await sql`UPDATE products SET image_url = ${`${cdn}fresh.webp`} WHERE slug = 'a'`
      return false
    }
    // Checking only before the network call would erase this intervening upload.
    const results = await applyImageRepairs(sql, cfg, plan, 'test-target', storage)
    expect(results.map((r) => r.status)).toEqual(['skipped'])
    expect(await storedUrl('a')).toBe(`${cdn}fresh.webp`)
  })

  it('retains a source restored after the mapping was built', async () => {
    const rows = [{ slug: 'a', image_url: `${cdn}missing.webp` }]
    await seedImages(rows)
    const plan = buildImageMapping(rows, [], [], cfg, 'test-target')
    const results = await applyImageRepairs(
      sql,
      cfg,
      plan,
      'test-target',
      storageWith('missing.webp')
    )
    expect(results.map((r) => r.status)).toEqual(['skipped'])
    expect(await storedUrl('a')).toBe(`${cdn}missing.webp`)
  })

  it('retains a source restored while an earlier repair is being applied', async () => {
    const rows = [
      { slug: 'a', image_url: `${cdn}missing-a.webp` },
      { slug: 'b', image_url: `${cdn}missing-b.webp` },
    ]
    await seedImages(rows)
    const storage = storageWith()
    storage.exists = async (_config, name) => {
      if (name === 'missing-a.webp') storage.files.set('missing-b.webp', imageBytes)
      return storage.files.has(name)
    }
    const plan = buildImageMapping(rows, [], [], cfg, 'test-target')

    const results = await applyImageRepairs(sql, cfg, plan, 'test-target', storage)

    expect(results.map((result) => result.status)).toEqual(['done', 'skipped'])
    expect(await storedUrl('b')).toBe(`${cdn}missing-b.webp`)
    expect(storage.files.get('missing-b.webp')).toEqual(imageBytes)
  })

  it('refuses a different target before any storage or database write', async () => {
    const plan = buildImageMapping([], [], [], cfg, 'dev-target')
    await expect(applyImageRepairs(sql, cfg, plan, 'prod-target', storageWith())).rejects.toThrow(
      'target mismatch'
    )
  })

  it('rejects a mapping whose source does not match the stored URL', async () => {
    const rows = [{ slug: 'a', image_url: `${cdn}missing.webp` }]
    await seedImages(rows)
    const plan = buildImageMapping(rows, [], [], cfg, 'test-target')
    plan.nullifies[0].oldFile = 'other.webp'

    const results = await applyImageRepairs(sql, cfg, plan, 'test-target', storageWith())

    expect(results[0].status).toBe('failed')
    expect(results[0].reason).toContain('source mismatch')
    expect(await storedUrl('a')).toBe(`${cdn}missing.webp`)
  })
})

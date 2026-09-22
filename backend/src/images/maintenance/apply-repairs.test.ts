import { describe, expect, it } from 'bun:test'

import { testDb } from '../../tests/db.test.config'
import { setupDbTests } from '../../tests/db-setup'
import { createTestAdminUser, createTestProduct } from '../../tests/helpers/test-factories'
import type { BunnyConfig } from '../lib/bunny'
import { applyImageRepairs } from './apply-repairs'
import { buildImageMapping, type ProductImageRow, referencedImageFile } from './repair-plan'

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
      async list() {
        return [...files].map(([ObjectName, bytes]) => ({
          ObjectName,
          IsDirectory: false,
          Length: bytes.length,
        }))
      },
      async get(_cfg: BunnyConfig, name: string) {
        const bytes = files.get(name)
        if (!bytes) throw new Error('GET 404')
        return bytes
      },
      async put(_cfg: BunnyConfig, name: string, bytes: Uint8Array) {
        files.set(name, bytes)
      },
    }
  }

  async function storedUrl(slug: string) {
    const rows = await sql`SELECT image_url FROM products WHERE slug = ${slug}`
    return rows[0].image_url as string | null
  }

  it('copies a shared source for every product and keeps sources and orphan candidates', async () => {
    const rows = [
      { slug: 'a', image_url: `${cdn}old.webp` },
      { slug: 'b', image_url: `${cdn}old.webp` },
    ]
    await seedImages(rows)
    const storage = storageWith('old.webp', 'prod-only.webp')
    const plan = buildImageMapping(rows, [...storage.files.keys()], [], cfg, 'test-target')
    const results = await applyImageRepairs(sql, cfg, plan, 'test-target', storage)
    expect(results.map((r) => r.status)).toEqual(['done', 'done'])
    // Deleting after the first copy previously made the second GET fail and broke product b.
    expect(storage.files.get('old.webp')).toEqual(imageBytes)
    expect(storage.files.get('prod-only.webp')).toEqual(imageBytes)
    for (const slug of ['a', 'b']) {
      const file = referencedImageFile(await storedUrl(slug), cfg)
      expect(file).toMatch(new RegExp(`^${slug}-recovered-`))
      if (!file) throw new Error('Expected a stored CDN reference')
      expect(storage.files.get(file)).toEqual(imageBytes)
    }
    expect(
      (await applyImageRepairs(sql, cfg, plan, 'test-target', storage)).map((r) => r.status)
    ).toEqual(['skipped', 'skipped'])
    expect(storage.files.size).toBe(4)
  })

  it('keeps the shared source when one copy fails and continues with the next product', async () => {
    const rows = [
      { slug: 'a', image_url: `${cdn}old.webp` },
      { slug: 'b', image_url: `${cdn}old.webp` },
    ]
    await seedImages(rows)
    const storage = storageWith('old.webp')
    const put = storage.put
    storage.put = async (config, name, bytes) => {
      if (name.startsWith('a-recovered-')) throw new Error('PUT failed')
      await put(config, name, bytes)
    }
    const plan = buildImageMapping(rows, ['old.webp'], [], cfg, 'test-target')
    const results = await applyImageRepairs(sql, cfg, plan, 'test-target', storage)
    expect(results.map((r) => r.status)).toEqual(['failed', 'done'])
    expect(await storedUrl('a')).toBe(`${cdn}old.webp`)
    expect(storage.files.get('old.webp')).toEqual(imageBytes)
    expect(await storedUrl('b')).toMatch(/b-recovered-/)
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

  it('rechecks the URL atomically after a concurrent write during the CDN inventory', async () => {
    const rows = [{ slug: 'a', image_url: `${cdn}missing.webp` }]
    await seedImages(rows)
    const plan = buildImageMapping(rows, [], [], cfg, 'test-target')
    const storage = storageWith()
    storage.list = async () => {
      await sql`UPDATE products SET image_url = ${`${cdn}fresh.webp`} WHERE slug = 'a'`
      return []
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

  it('preserves the URL and bytes of an upload completing during a recovery copy', async () => {
    const rows = [{ slug: 'a', image_url: `${cdn}old.webp` }]
    await seedImages(rows)
    const plan = buildImageMapping(rows, ['old.webp'], [], cfg, 'test-target')
    const storage = storageWith('old.webp')
    const freshBytes = new Uint8Array([4, 5, 6])
    storage.put = async (_cfg, name, bytes) => {
      storage.files.set('a.webp', freshBytes)
      await sql`UPDATE products SET image_url = ${`${cdn}a.webp?v=2`} WHERE slug = 'a'`
      storage.files.set(name, bytes)
    }
    const results = await applyImageRepairs(sql, cfg, plan, 'test-target', storage)
    expect(results.map((r) => r.status)).toEqual(['skipped'])
    expect(await storedUrl('a')).toBe(`${cdn}a.webp?v=2`)
    expect(storage.files.get('a.webp')).toEqual(freshBytes)
    expect(storage.files.get('old.webp')).toEqual(imageBytes)
  })

  it('refuses a different target before any storage or database write', async () => {
    const plan = buildImageMapping([], [], [], cfg, 'dev-target')
    await expect(applyImageRepairs(sql, cfg, plan, 'prod-target', storageWith())).rejects.toThrow(
      'target mismatch'
    )
  })

  it('skips a destination that appeared since planning instead of overwriting it', async () => {
    const rows = [{ slug: 'a', image_url: `${cdn}old.webp` }]
    await seedImages(rows)
    const plan = buildImageMapping(rows, ['old.webp'], [], cfg, 'test-target')
    const storage = storageWith('old.webp', plan.renames[0].newFile)
    const results = await applyImageRepairs(sql, cfg, plan, 'test-target', storage)
    expect(results.map((r) => r.status)).toEqual(['skipped'])
    expect(await storedUrl('a')).toBe(`${cdn}old.webp`)
  })
})

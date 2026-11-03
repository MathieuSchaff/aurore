import { describe, expect, it } from 'bun:test'

import { eq } from 'drizzle-orm'

import { qualifyInciInput } from '../../../../lib/inci-input-quality'
import { testDb } from '../../../../tests/db.test.config'
import { setupDbTests } from '../../../../tests/db-setup'
import { createTestAdminUser, createTestProduct } from '../../../../tests/helpers/test-factories'
import { products } from '../../../schema'

setupDbTests()

const runner = new URL('./worst-match-prose.ts', import.meta.url).pathname

describe('targeted prose cleanup', () => {
  it.each([',', ';', '...', '…'])(
    'retains %s after folding an HTML paragraph list',
    async (ending) => {
      const owner = await createTestAdminUser()
      const product = await createTestProduct(owner.id, { name: 'Paragraph Terminator Fixture' })
      await testDb
        .update(products)
        .set({
          slug: 'eve-lom-time-retreat-smoothing-eye-complex',
          inci: `<p>Full Ingredient List:</p><p>AQUA</p><p>GLYCERIN</p><p>PANTHENOL${ending}</p>`,
        })
        .where(eq(products.id, product.id))
      const result = Bun.spawnSync([process.execPath, runner, '--apply'], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      const [stored] = await testDb.select().from(products).where(eq(products.id, product.id))
      expect(stored?.inci).toBe(`AQUA, GLYCERIN, PANTHENOL${ending}`)
      expect(qualifyInciInput(stored?.inci).reasons).toContain('truncated-list')
    }
  )

  it.each([
    {
      name: 'paragraph list',
      raw: '<p>Full Ingredient List:</p><p>AQUA</p><p>GLYCERIN</p><p>PANTHENOL</p>',
      expected: 'AQUA, GLYCERIN, PANTHENOL',
    },
    {
      name: 'break list',
      raw: '<span>Full Ingredient List: AQUA<br>GLYCERIN<br/>PANTHENOL</span>',
      expected: 'AQUA, GLYCERIN, PANTHENOL',
    },
    {
      name: 'wrapped compound',
      raw: '<div>Full Ingredient List:</div><div>AQUA, Sodium</div><div>Hyaluronate, PANTHENOL</div>',
      expected: 'AQUA, Sodium Hyaluronate, PANTHENOL',
    },
    {
      name: 'unknown header outside the extracted payload',
      raw: '<p>Unknown Heading</p><p>Full Ingredient List:</p><span>UNLISTED EXTRACT, AQUA</span>',
      expected: 'UNLISTED EXTRACT, AQUA',
    },
    {
      name: 'inline compound',
      raw: '<span>Full Ingredient List: AQUA, Sodium</span><span>Hyaluronate, PANTHENOL</span>',
      expected: 'AQUA, Sodium Hyaluronate, PANTHENOL',
    },
  ])('preserves ingredient boundaries for $name', async ({ raw, expected }) => {
    const owner = await createTestAdminUser()
    const product = await createTestProduct(owner.id, { name: 'HTML Boundary Fixture' })
    await testDb
      .update(products)
      .set({
        slug: 'eve-lom-time-retreat-smoothing-eye-complex',
        inci: raw,
      })
      .where(eq(products.id, product.id))
    for (const [args, count, inci] of [
      [[], 1, raw],
      [['--apply'], 1, expected],
      [['--apply'], 0, expected],
    ] as const) {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      expect(result.stdout.toString()).toContain(
        `${args.length ? 'Applied' : 'Would apply'} ${count} fix(es)`
      )
      const [stored] = await testDb.select().from(products).where(eq(products.id, product.id))
      expect(stored?.inci).toBe(inci)
    }
  })

  it.each([
    '<span>Full Ingredient List: AQUA, Arginine<br>PCA, PANTHENOL</span>',
    '<span>Full Ingredient List: AQUA, Fictus Plantus<br>Extract, PANTHENOL</span>',
    'Full Ingredient List: AQUA, Arginine\nPCA, PANTHENOL',
  ])('refuses unresolved extracted line boundaries without writing %s', async (raw) => {
    const owner = await createTestAdminUser()
    const product = await createTestProduct(owner.id, { name: 'Unresolved HTML Fixture' })
    await testDb
      .update(products)
      .set({
        slug: 'eve-lom-time-retreat-smoothing-eye-complex',
        inci: raw,
      })
      .where(eq(products.id, product.id))
    const before = await testDb.select().from(products)
    for (const args of [['--apply'], []]) {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect(await testDb.select().from(products)).toEqual(before)
      expect(result.exitCode).not.toBe(0)
      expect(result.stderr.toString()).toContain('unresolved-line-boundaries')
      expect(result.stdout.toString()).not.toContain('Applied')
    }
  })

  it.each([
    ['named', '&lt;', '&gt;'],
    ['literal', '<', '>'],
    ['decimal', '&#60;', '&#62;'],
    ['hexadecimal', '&#x3c;', '&#x3e;'],
  ])(
    'refuses %s comparison spans without erasing ingredients or applying another fix',
    async (_, lt, gt) => {
      const owner = await createTestAdminUser()
      const companion = await createTestProduct(owner.id, { name: 'Comparison Companion Fixture' })
      await testDb
        .update(products)
        .set({
          slug: 'medicube-age-r-booster-pro-mini',
          inci: 'LED fixture',
        })
        .where(eq(products.id, companion.id))
      const product = await createTestProduct(owner.id, { name: 'HTML Comparison Fixture' })
      const raw = `<span>Full Ingredient List: AQUA, NIACINAMIDE ${lt}5%, GLYCERIN ${gt}1%, PANTHENOL</span>`
      await testDb
        .update(products)
        .set({
          slug: 'eve-lom-time-retreat-smoothing-eye-complex',
          inci: raw,
        })
        .where(eq(products.id, product.id))
      const before = await testDb.select().from(products).orderBy(products.slug)
      for (const args of [['--apply'], []]) {
        const result = Bun.spawnSync([process.execPath, runner, ...args], {
          env: process.env,
          timeout: 10_000,
        })
        expect(await testDb.select().from(products).orderBy(products.slug)).toEqual(before)
        expect(result.exitCode).not.toBe(0)
        expect(result.stderr.toString()).toContain('markup-residue')
        expect(result.stdout.toString()).not.toContain('Applied')
      }
    }
  )

  it('rejects unsupported scopes before SQL without applying either candidate', async () => {
    const owner = await createTestAdminUser()
    const candidates = [
      ['medicube-age-r-booster-pro-mini', 'LED fixture'],
      ['eve-lom-cleansing-oil', 'How to Use: Apply 1, 2 pumps.'],
    ] as const
    for (const [slug, inci] of candidates) {
      const product = await createTestProduct(owner.id, { name: `Arguments Fixture ${slug}` })
      await testDb.update(products).set({ slug, inci }).where(eq(products.id, product.id))
    }
    const before = await testDb.select().from(products).orderBy(products.slug)
    for (const arg of [
      '--limit=1',
      '--limt=1',
      '--slug=missing',
      '--write',
      '--apply=false',
      'extra',
    ]) {
      for (const mode of [['--apply'], []]) {
        const result = Bun.spawnSync([process.execPath, runner, ...mode, arg], {
          env: process.env,
          timeout: 10_000,
        })
        expect(await testDb.select().from(products).orderBy(products.slug)).toEqual(before)
        expect(result.exitCode).not.toBe(0)
        expect(result.stderr.toString()).toContain('Unknown argument:')
        expect(result.stdout.toString()).toBe('')
      }
      const result = Bun.spawnSync([process.execPath, runner, '--apply', arg], {
        env: { ...process.env, DATABASE_URL: 'invalid://targeted-arguments' },
        timeout: 10_000,
      })
      expect(result.exitCode).not.toBe(0)
      expect(result.stderr.toString()).toContain('Unknown argument:')
      expect(result.stdout.toString()).toBe('')
    }
  })

  it('previews and applies a permitted null fix before converging', async () => {
    const owner = await createTestAdminUser()
    const product = await createTestProduct(owner.id, { name: 'Null Fix Fixture' })
    await testDb
      .update(products)
      .set({ slug: 'medicube-age-r-booster-pro-mini', inci: 'LED fixture' })
      .where(eq(products.id, product.id))
    for (const [args, count, expected] of [
      [[], 1, 'LED fixture'],
      [['--apply', '--apply'], 1, null],
      [['--apply'], 0, null],
    ] as const) {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      expect(result.stdout.toString()).toContain(
        `${args.length ? 'Applied' : 'Would apply'} ${count} fix(es)`
      )
      const [stored] = await testDb.select().from(products).where(eq(products.id, product.id))
      expect(stored?.inci).toBe(expected)
    }
  })

  it.each(
    [',', '...', ';', '…'].flatMap((suffix) =>
      ['extraction', 'legacy residue'].map((mode) => ({ suffix, mode }))
    )
  )('retains the $suffix terminator through $mode and convergence', async ({ suffix, mode }) => {
    const owner = await createTestAdminUser()
    const product = await createTestProduct(owner.id, { name: 'Damaged Formula Fixture' })
    const formula = `AQUA, GLYCERIN, PANTHENOL${suffix}`
    const raw =
      mode === 'extraction' ? `<span>Full Ingredient List: ${formula}</span>` : `${formula} /p`
    await testDb
      .update(products)
      .set({ slug: 'eve-lom-time-retreat-smoothing-eye-complex', inci: raw })
      .where(eq(products.id, product.id))
    for (const [args, count, expected] of [
      [[], 1, raw],
      [['--apply'], 1, formula],
      [['--apply'], 0, formula],
    ] as const) {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      expect(result.stdout.toString()).toContain(
        `${args.length ? 'Applied' : 'Would apply'} ${count} fix(es)`
      )
      const [stored] = await testDb.select().from(products).where(eq(products.id, product.id))
      expect(stored?.inci).toBe(expected)
      if (args.length) expect(qualifyInciInput(stored?.inci).reasons).toContain('truncated-list')
    }
  })
})

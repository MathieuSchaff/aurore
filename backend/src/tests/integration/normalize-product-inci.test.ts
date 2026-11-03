import { describe, expect, it } from 'bun:test'

import { eq, sql } from 'drizzle-orm'

import { products } from '../../db/schema'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { BODYCARE, COMPLEMENT, SKINCARE, SOLAIRE } from '../helpers/product-shapes'
import { createTestAdminUser, createTestProduct } from '../helpers/test-factories'

setupDbTests()

const runner = new URL('../../db/seed/maintenance/normalize-product-inci.ts', import.meta.url)
  .pathname
const raw = 'Water, Glycerin, Panthenol'

describe('governed INCI maintenance', () => {
  it('includes hidden eligible products without changing visibility, guards or excluded categories', async () => {
    const owner = await createTestAdminUser()
    const guarded = 'Aqua, Arginine\nPCA, Panthenol'
    const cases = [
      {
        name: 'Visible',
        shape: SKINCARE,
        hidden: false,
        inci: raw,
        expected: 'Aqua, Glycerin, Panthenol',
      },
      {
        name: 'Hidden Skin',
        shape: SKINCARE,
        hidden: true,
        inci: raw,
        expected: 'Aqua, Glycerin, Panthenol',
      },
      {
        name: 'Hidden Sun',
        shape: SOLAIRE,
        hidden: true,
        inci: raw,
        expected: 'Aqua, Glycerin, Panthenol',
      },
      {
        name: 'Hidden Body',
        shape: BODYCARE,
        hidden: true,
        inci: raw,
        expected: 'Aqua, Glycerin, Panthenol',
      },
      { name: 'Hidden Excluded', shape: COMPLEMENT, hidden: true, inci: raw, expected: raw },
      { name: 'Hidden Guarded', shape: SKINCARE, hidden: true, inci: guarded, expected: guarded },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, { ...entry.shape, name: entry.name })
      await testDb
        .update(products)
        .set({
          inci: entry.inci,
          moderationStatus: entry.hidden ? 'hidden' : 'visible',
        })
        .where(eq(products.id, product.id))
    }
    const read = () =>
      testDb
        .select({
          name: products.name,
          inci: products.inci,
          moderationStatus: products.moderationStatus,
        })
        .from(products)
        .orderBy(products.name)
    const expected = cases
      .map(
        (entry) =>
          ({
            name: entry.name,
            inci: entry.expected,
            moderationStatus: entry.hidden ? 'hidden' : 'visible',
          }) satisfies Pick<typeof products.$inferSelect, 'name' | 'inci' | 'moderationStatus'>
      )
      .sort((a, b) => a.name.localeCompare(b.name))
    const before = await read()
    const outputs: string[] = []
    for (const args of [[], ['--write'], ['--write']]) {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      expect(await read()).toEqual(args.length ? expected : before)
      outputs.push(result.stdout.toString())
    }
    for (const [index, stdout] of outputs.entries()) {
      expect(stdout).toContain('products with inci: 5')
      expect(stdout).toContain(`to rewrite:         ${index === 2 ? 0 : 4}`)
      expect(stdout).toContain('skipped guardrail:  1')
      if (index) {
        expect(stdout).toContain('skipped stale:      0')
        expect(stdout).toContain(`applied: rewrote inci on ${index === 1 ? 4 : 0} products.`)
      }
    }
  })

  it('rejects unsupported arguments before opening the application database', async () => {
    const owner = await createTestAdminUser()
    for (const name of ['Argument Fixture One', 'Argument Fixture Two']) {
      const product = await createTestProduct(owner.id, { ...SKINCARE, name })
      await testDb.update(products).set({ inci: raw }).where(eq(products.id, product.id))
    }
    const before = await testDb.select().from(products).orderBy(products.name)
    for (const arg of [
      '--limit=1',
      '--limt=1',
      '--slug=missing',
      '--apply',
      '--write=false',
      'extra',
    ]) {
      for (const mode of [['--write'], []]) {
        const result = Bun.spawnSync([process.execPath, runner, ...mode, arg], {
          env: process.env,
          timeout: 10_000,
        })
        expect(await testDb.select().from(products).orderBy(products.name)).toEqual(before)
        expect(result.exitCode).not.toBe(0)
        expect(result.stderr.toString()).toContain('Unknown argument:')
        expect(result.stdout.toString()).toBe('')
      }
      const result = Bun.spawnSync([process.execPath, runner, '--write', arg], {
        env: { ...process.env, APP_DATABASE_URL: 'invalid://maintenance-arguments' },
        timeout: 10_000,
      })
      expect(result.exitCode).not.toBe(0)
      expect(result.stderr.toString()).toContain('Unknown argument:')
      expect(result.stdout.toString()).toBe('')
    }
  })

  it.each(['edit', 'delete', 'recategorize'] as const)(
    'preserves a row changed by a concurrent %s after selection',
    async (change) => {
      const owner = await createTestAdminUser()
      const product = await createTestProduct(owner.id, {
        ...SKINCARE,
        name: 'Concurrent Normalize',
      })
      await testDb.update(products).set({ inci: raw }).where(eq(products.id, product.id))
      const applicationName = `normalize-concurrency-${product.id}`
      const url = new URL(process.env.APP_DATABASE_URL ?? '')
      url.searchParams.set('application_name', applicationName)
      let child: Bun.Subprocess<'ignore', 'pipe', 'pipe'> | undefined
      let expected: (typeof product)[] = []
      try {
        await testDb.transaction(async (tx) => {
          if (change === 'edit') {
            await tx
              .update(products)
              .set({ inci: 'Aqua, Glycerin, Niacinamide' })
              .where(eq(products.id, product.id))
          } else if (change === 'delete') {
            await tx.delete(products).where(eq(products.id, product.id))
          } else {
            await tx.update(products).set(COMPLEMENT).where(eq(products.id, product.id))
          }
          expected = await tx.select().from(products).where(eq(products.id, product.id))
          child = Bun.spawn([process.execPath, runner, '--write'], {
            env: { ...process.env, APP_DATABASE_URL: url.toString() },
            stdout: 'pipe',
            stderr: 'pipe',
            timeout: 10_000,
          })
          // Observe the blocked UPDATE before releasing the fixture transaction
          let waiting = false
          const deadline = Date.now() + 5_000
          while (Date.now() < deadline) {
            const [row] = await testDb.execute<{ waiting: boolean }>(sql`
              SELECT EXISTS (
                SELECT 1 FROM pg_stat_activity
                WHERE application_name = ${applicationName} AND wait_event_type = 'Lock'
                  AND query ILIKE '%update "products" set "inci"%'
              ) AS waiting
            `)
            if (row?.waiting) {
              waiting = true
              break
            }
            await Bun.sleep(10)
          }
          expect(waiting).toBe(true)
        })
        if (!child) throw new Error('Concurrent normalization process missing')
        const [exitCode, stdout, stderr] = await Promise.all([
          child.exited,
          new Response(child.stdout).text(),
          new Response(child.stderr).text(),
        ])
        expect({ exitCode, stderr }).toEqual({ exitCode: 0, stderr: '' })
        expect(await testDb.select().from(products).where(eq(products.id, product.id))).toEqual(
          expected
        )
        expect(stdout).toContain('to rewrite:         1')
        expect(stdout).toContain('skipped stale:      1')
        expect(stdout).toContain('applied: rewrote inci on 0 products.')
      } finally {
        if (child) {
          child.kill()
          await child.exited
        }
      }
    },
    15_000
  )

  it('previews without writing and applies eligible rows before converging', async () => {
    const owner = await createTestAdminUser()
    for (const [name, shape] of [
      ['Eligible Normalize', SKINCARE],
      ['Excluded Normalize', COMPLEMENT],
    ] as const) {
      const product = await createTestProduct(owner.id, { ...shape, name })
      await testDb.update(products).set({ inci: raw }).where(eq(products.id, product.id))
    }
    const read = () =>
      testDb
        .select({ name: products.name, inci: products.inci })
        .from(products)
        .orderBy(products.name)
    const before = await read()
    for (const [args, planned, applied] of [
      [[], 1, false],
      [['--write', '--write'], 1, true],
      [['--write'], 0, true],
    ] as const) {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      const stdout = result.stdout.toString()
      expect(stdout).toContain(`to rewrite:         ${planned}`)
      expect(await read()).toEqual(
        applied
          ? [
              { name: 'Eligible Normalize', inci: 'Aqua, Glycerin, Panthenol' },
              { name: 'Excluded Normalize', inci: raw },
            ]
          : before
      )
      if (args.length) {
        expect(stdout).toContain('skipped stale:      0')
        expect(stdout).toContain(`applied: rewrote inci on ${planned} products.`)
      } else {
        expect(stdout).toContain('[dry-run]')
        expect(stdout).not.toContain('applied:')
      }
    }
  })
})

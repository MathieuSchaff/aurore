import { describe, expect, it } from 'bun:test'

import { eq, sql } from 'drizzle-orm'

import { testDb } from '../../../../tests/db.test.config'
import { setupDbTests } from '../../../../tests/db-setup'
import { SKINCARE } from '../../../../tests/helpers/product-shapes'
import { createTestAdminUser, createTestProduct } from '../../../../tests/helpers/test-factories'
import { products } from '../../../schema'

setupDbTests()

const runner = new URL('./clean-inci.ts', import.meta.url).pathname
const raw = 'INGREDIENTS: Water | Glycerin | Panthenol'
const cleaned = 'Water, Glycerin, Panthenol'

describe('historical INCI cleaner', () => {
  it('rejects unknown arguments before SQL in dry-run and apply modes', async () => {
    const owner = await createTestAdminUser()
    const product = await createTestProduct(owner.id, { ...SKINCARE, name: 'Cleaner Arguments' })
    await testDb.update(products).set({ inci: raw }).where(eq(products.id, product.id))
    const before = await testDb.select().from(products)
    const invalid = ['--limit=1', '--limt=1', '--write', '--apply=false', '--slug=missing', 'extra']
    for (const argument of invalid) {
      for (const mode of [['--apply'], []]) {
        const result = Bun.spawnSync([process.execPath, runner, ...mode, argument], {
          env: process.env,
          timeout: 10_000,
        })
        expect(await testDb.select().from(products)).toEqual(before)
        expect(result.exitCode).not.toBe(0)
        expect(result.stderr.toString()).toContain('Unknown argument:')
        expect(result.stdout.toString()).not.toContain('Scanning')
      }
      const preflight = Bun.spawnSync([process.execPath, runner, '--apply', argument], {
        env: { ...process.env, DATABASE_URL: 'invalid://cleaner-arguments' },
        timeout: 10_000,
      })
      expect(preflight.exitCode).not.toBe(0)
      expect(preflight.stderr.toString()).toContain('Unknown argument:')
      expect(preflight.stdout.toString()).not.toContain('Scanning')
    }
  })

  it.each(['edit', 'delete'] as const)(
    'skips a row changed by a concurrent %s after selection',
    async (change) => {
      const owner = await createTestAdminUser()
      const product = await createTestProduct(owner.id, { ...SKINCARE, name: 'Concurrent Cleaner' })
      await testDb.update(products).set({ inci: raw }).where(eq(products.id, product.id))
      const applicationName = `cleaner-concurrency-${product.id}`
      const url = new URL(process.env.DATABASE_URL ?? '')
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
          } else {
            await tx.delete(products).where(eq(products.id, product.id))
          }
          expected = await tx.select().from(products).where(eq(products.id, product.id))
          child = Bun.spawn([process.execPath, runner, '--apply'], {
            env: { ...process.env, DATABASE_URL: url.toString() },
            stdout: 'pipe',
            stderr: 'pipe',
            timeout: 10_000,
          })
          // Wait for the actual blocked write so the race does not depend on process startup time
          let waiting = false
          const deadline = Date.now() + 5_000
          while (Date.now() < deadline) {
            const [row] = await testDb.execute<{ waiting: boolean }>(sql`
              SELECT EXISTS (
                SELECT 1 FROM pg_stat_activity
                WHERE application_name = ${applicationName} AND wait_event_type = 'Lock'
                  AND query LIKE '%UPDATE products SET inci = %'
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
        if (!child) throw new Error('Concurrent cleaner process missing')
        const [exitCode, stdout, stderr] = await Promise.all([
          child.exited,
          new Response(child.stdout).text(),
          new Response(child.stderr).text(),
        ])
        expect({ exitCode, stderr }).toEqual({ exitCode: 0, stderr: '' })
        expect(await testDb.select().from(products).where(eq(products.id, product.id))).toEqual(
          expected
        )
        expect(stdout).toContain('Updated 0 rows.')
        expect(stdout).toContain('Touched: 0')
        expect(stdout).toContain('Skipped stale rows: 1')
        expect(stdout).not.toContain(`  ${product.slug}`)
      } finally {
        if (child) {
          child.kill()
          await child.exited
        }
      }
    },
    15_000
  )

  it('previews without writing and counts only successful updates before converging', async () => {
    const owner = await createTestAdminUser()
    const product = await createTestProduct(owner.id, { ...SKINCARE, name: 'Cleaner Control' })
    await testDb.update(products).set({ inci: raw }).where(eq(products.id, product.id))
    for (const [args, count, expectedInci] of [
      [[], 1, raw],
      [['--apply', '--apply'], 1, cleaned],
      [['--apply'], 0, cleaned],
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
      expect(stdout).toContain(`${args.length ? 'Updated' : 'Would update'} ${count} rows.`)
      expect(stdout).toContain(`Touched: ${count}`)
      expect(stdout).toContain('Skipped stale rows: 0')
      const [stored] = await testDb.select().from(products).where(eq(products.id, product.id))
      expect(stored?.inci).toBe(expectedInci)
      if (count) expect(stdout).toContain(`  ${product.slug}`)
      else expect(stdout).not.toContain(`  ${product.slug}`)
    }
  })
})

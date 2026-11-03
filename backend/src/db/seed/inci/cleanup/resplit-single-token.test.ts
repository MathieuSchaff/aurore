import { describe, expect, it } from 'bun:test'

import { eq, sql } from 'drizzle-orm'

import { testDb } from '../../../../tests/db.test.config'
import { setupDbTests } from '../../../../tests/db-setup'
import { COMPLEMENT, SKINCARE } from '../../../../tests/helpers/product-shapes'
import { createTestAdminUser, createTestProduct } from '../../../../tests/helpers/test-factories'
import { products } from '../../../schema'

setupDbTests()

describe('historical single-token resplit', () => {
  it.each(['edit', 'delete'] as const)(
    'skips a row changed by a concurrent %s after selection',
    async (change) => {
      const owner = await createTestAdminUser()
      const product = await createTestProduct(owner.id, { ...SKINCARE, name: 'Concurrent Resplit' })
      const raw =
        'Aqua Glycerin Niacinamide Panthenol Squalane Sodium Hyaluronate Allantoin Tocopherol Betaine'
      await testDb.update(products).set({ inci: raw }).where(eq(products.id, product.id))
      const edited = 'Aqua, Glycerin, Panthenol'
      const applicationName = `resplit-concurrency-${product.id}`
      const url = new URL(process.env.DATABASE_URL ?? '')
      url.searchParams.set('application_name', applicationName)
      const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
      let child: Bun.Subprocess<'ignore', 'pipe', 'pipe'> | undefined
      let expected: (typeof product)[] = []
      try {
        await testDb.transaction(async (tx) => {
          if (change === 'edit') {
            await tx.update(products).set({ inci: edited }).where(eq(products.id, product.id))
          } else {
            await tx.delete(products).where(eq(products.id, product.id))
          }
          expected = await tx.select().from(products).where(eq(products.id, product.id))
          child = Bun.spawn([process.execPath, runner, '--apply', '--limit=1'], {
            env: { ...process.env, DATABASE_URL: url.toString() },
            stdout: 'pipe',
            stderr: 'pipe',
            timeout: 10_000,
          })
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
        if (!child) throw new Error('Concurrent resplit process missing')
        const [exitCode, stdout, stderr] = await Promise.all([
          child.exited,
          new Response(child.stdout).text(),
          new Response(child.stderr).text(),
        ])
        expect({ exitCode, stderr }).toEqual({ exitCode: 0, stderr: '' })
        const rows = await testDb.select().from(products).where(eq(products.id, product.id))
        expect(rows).toEqual(expected)
        expect(stdout).toContain('Updated 0 rows.')
        expect(stdout).toContain('Skipped stale rows: 1')
        expect(stdout).toContain('Preview (0 samples)')
        expect(stdout).toContain('  blob:    0')
        expect(stdout).toContain('  skipped: 1')
      } finally {
        if (child) {
          child.kill()
          await child.exited
        }
      }
    },
    15_000
  )

  it('retains exponent quantities with their preceding ingredient word', async () => {
    const owner = await createTestAdminUser()
    const labels = (declaration: string) => [
      'Aqua',
      'Glycerin',
      declaration,
      'Panthenol',
      'Squalane',
      'Sodium Hyaluronate',
      'Allantoin',
      'Tocopherol',
      'Betaine',
    ]
    const units = [
      ['Percent', '%'],
      ['PPM', 'ppm'],
      ['Mass Ratio', ' mg/g'],
    ]
    const forms = [
      ['Negative Exponent', '5e-1'],
      ['Positive Exponent', '5e+1'],
      ['Uppercase Exponent', '5E0'],
      ['Leading Decimal Mantissa', '.5e-1'],
      ['Comma Mantissa', '1,5e-1'],
      ['Both Bounds', '5e-2-1e-1'],
      ['Second Bound', '.05-1e-1'],
      ['First Bound', '5e-2-.1'],
      ['Comparison', '≤5e-1'],
      ['Existing Decimal', '0.5'],
    ]
    const held = units.flatMap(([unit, suffix]) => [
      ...forms.map(([name, value]) => ({
        name: `${unit} ${name}`,
        raw: labels(`Niacinamide ${value}${suffix}`).join(' '),
      })),
      {
        name: `${unit} Compound`,
        raw: labels(`Sodium Hyaluronate 5e-1${suffix}`).join(' '),
      },
    ])
    held.push({ name: 'Spaced Ratio Unit', raw: labels('Niacinamide 5e-1 mg / g').join(' ') })
    const safe = units.flatMap(([unit, suffix]) => {
      const declaration = `Niacinamide 5e-1${suffix}`
      const blob = labels(declaration).slice(1, -1).join(' ')
      return [
        {
          name: `${unit} Trivial`,
          raw: labels(declaration).join('; '),
          expected: labels(declaration).join(', '),
        },
        {
          name: `${unit} Parenthesized`,
          raw: labels(`Niacinamide (5e-1${suffix})`).join(' '),
          expected: labels(`Niacinamide (5e-1${suffix})`).join(', '),
        },
        {
          name: `${unit} Mixed`,
          raw: `Aqua; ${blob}; Betaine`,
          expected: `Aqua, ${blob}, Betaine`,
        },
      ]
    })
    const cases = [
      ...held.map((entry) => ({ ...entry, expected: entry.raw, shape: SKINCARE })),
      ...safe.map((entry) => ({ ...entry, shape: SKINCARE })),
      {
        name: 'Plain Exponent Control',
        raw: labels('Niacinamide').join(' '),
        expected: labels('Niacinamide').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Exponent Supplement',
        raw: labels('Niacinamide 5e-1%').join(' '),
        expected: labels('Niacinamide 5e-1%').join(' '),
        shape: COMPLEMENT,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, { ...entry.shape, name: entry.name })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    const dryRun = run([])
    expect(dryRun).toContain('Would update 10 rows.')
    expect(dryRun).toContain('Percentage regions kept unsplit: 12')
    expect(dryRun).toContain('PPM regions kept unsplit: 12')
    expect(dryRun).toContain('Mass-ratio regions kept unsplit: 13')
    expect(await read()).toEqual(before)
    const applied = run(['--apply'])
    expect(applied).toContain('Updated 10 rows.')
    expect(applied).toContain('Percentage regions kept unsplit: 12')
    expect(applied).toContain('PPM regions kept unsplit: 12')
    expect(applied).toContain('Mass-ratio regions kept unsplit: 13')
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('Exponent fixture missing')
      return { ...product, inci: entry.expected }
    })
    expect(await read()).toEqual(expected)
    const repeated = run(['--apply'])
    expect(repeated).toContain('Updated 0 rows.')
    expect(repeated).toContain('Percentage regions kept unsplit: 12')
    expect(repeated).toContain('PPM regions kept unsplit: 12')
    expect(repeated).toContain('Mass-ratio regions kept unsplit: 13')
    expect(await read()).toEqual(expected)
  })

  it('rejects unsupported arguments and repeated limits before changing any row', async () => {
    const owner = await createTestAdminUser()
    const names = [
      'Aqua',
      'Glycerin',
      'Niacinamide',
      'Panthenol',
      'Squalane',
      'Sodium Hyaluronate',
      'Allantoin',
      'Tocopherol',
    ]
    const raw = names.join('; ')
    const repaired = names.join(', ')
    for (const name of ['Arguments A', 'Arguments B', 'Arguments C']) {
      const product = await createTestProduct(owner.id, { ...SKINCARE, name })
      await testDb.update(products).set({ inci: raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const spawn = (args: string[], databaseUrl?: string) =>
      Bun.spawnSync([process.execPath, runner, ...args], {
        env: databaseUrl ? { ...process.env, DATABASE_URL: databaseUrl } : process.env,
        timeout: 10_000,
      })
    const cases = [
      { args: ['--limt=1'], message: 'Unsupported resplit argument' },
      { args: ['--limit', '1'], message: 'Unsupported resplit argument' },
      { args: ['--write'], message: 'Unsupported resplit argument' },
      { args: ['--apply=true'], message: 'Unsupported resplit argument' },
      { args: ['unexpected'], message: 'Unsupported resplit argument' },
      { args: ['--limit=1', 'unexpected'], message: 'Unsupported resplit argument' },
      { args: ['--limit=0', '--limit=1'], message: '--limit must be specified at most once' },
      { args: ['--limit=1', '--limit=0'], message: '--limit must be specified at most once' },
      { args: ['--limit=1', '--limit=1'], message: '--limit must be specified at most once' },
    ]
    for (const entry of cases) {
      for (const mode of [[], ['--apply']]) {
        const result = spawn([...mode, ...entry.args])
        expect(result.exitCode).not.toBe(0)
        expect(result.stderr.toString()).toContain(entry.message)
        expect(await read()).toEqual(before)
      }
    }
    for (const entry of [cases[0], cases[6]]) {
      const result = spawn(['--apply', ...entry.args], 'invalid://arguments-preflight')
      expect(result.exitCode).not.toBe(0)
      expect(result.stderr.toString()).toContain(entry.message)
      expect(await read()).toEqual(before)
    }
    const run = (args: string[]) => {
      const result = spawn(args)
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    expect(run([])).toContain('Would update 3 rows.')
    expect(run(['--limit=0', '--apply'])).toContain('Updated 0 rows.')
    expect(run(['--limit=1'])).toContain('Would update 1 rows.')
    expect(await read()).toEqual(before)
    expect(run(['--limit=1', '--apply', '--apply'])).toContain('Updated 1 rows.')
    const capped = await read()
    expect(capped.filter((product) => product.inci === repaired)).toHaveLength(1)
    expect(capped.filter((product) => product.inci === raw)).toHaveLength(2)
    expect(before).toEqual(capped.map((product) => ({ ...product, inci: raw })))
    expect(run(['--apply'])).toContain('Updated 2 rows.')
    const expected = before.map((product) => ({ ...product, inci: repaired }))
    expect(await read()).toEqual(expected)
    expect(run(['--apply'])).toContain('Updated 0 rows.')
    expect(await read()).toEqual(expected)
  })

  it('rejects invalid write limits before changing any row', async () => {
    const owner = await createTestAdminUser()
    const names = [
      'Aqua',
      'Glycerin',
      'Niacinamide',
      'Panthenol',
      'Squalane',
      'Sodium Hyaluronate',
      'Allantoin',
      'Tocopherol',
    ]
    const raw = names.join('; ')
    const repaired = names.join(', ')
    for (const name of ['Limit A', 'Limit B', 'Limit C']) {
      const product = await createTestProduct(owner.id, { ...SKINCARE, name })
      await testDb.update(products).set({ inci: raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const spawn = (args: string[], databaseUrl?: string) =>
      Bun.spawnSync([process.execPath, runner, ...args], {
        env: databaseUrl ? { ...process.env, DATABASE_URL: databaseUrl } : process.env,
        timeout: 10_000,
      })
    const invalidValues = [
      'invalid',
      'NaN',
      'Infinity',
      '-Infinity',
      '-1',
      '0.5',
      '',
      ' ',
      '9007199254740992',
    ]
    for (const value of invalidValues) {
      for (const mode of [[], ['--apply']]) {
        const result = spawn([...mode, `--limit=${value}`])
        expect(result.exitCode).not.toBe(0)
        expect(result.stderr.toString()).toContain('--limit must be a non-negative safe integer')
        expect(await read()).toEqual(before)
      }
    }
    const preflight = spawn(['--apply', '--limit=invalid'], 'invalid://limit-preflight')
    expect(preflight.exitCode).not.toBe(0)
    expect(preflight.stderr.toString()).toContain('--limit must be a non-negative safe integer')
    expect(await read()).toEqual(before)
    const run = (args: string[]) => {
      const result = spawn(args)
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    expect(run(['--limit=0'])).toContain('Would update 0 rows.')
    expect(run(['--apply', '--limit=0'])).toContain('Updated 0 rows.')
    expect(await read()).toEqual(before)
    expect(run(['--limit=1'])).toContain('Would update 1 rows.')
    expect(run(['--limit=01'])).toContain('Would update 1 rows.')
    expect(run(['--limit=1.0'])).toContain('Would update 1 rows.')
    expect(await read()).toEqual(before)
    expect(run(['--apply', '--limit=1'])).toContain('Updated 1 rows.')
    const capped = await read()
    expect(capped.filter((product) => product.inci === repaired)).toHaveLength(1)
    expect(capped.filter((product) => product.inci === raw)).toHaveLength(2)
    expect(before).toEqual(capped.map((product) => ({ ...product, inci: raw })))
    expect(run(['--apply'])).toContain('Updated 2 rows.')
    const expected = before.map((product) => ({ ...product, inci: repaired }))
    expect(await read()).toEqual(expected)
    expect(run(['--apply'])).toContain('Updated 0 rows.')
    expect(await read()).toEqual(expected)
  })

  it('retains leading decimal quantities with their preceding ingredient word', async () => {
    const owner = await createTestAdminUser()
    const labels = (declaration: string) => [
      'Aqua',
      'Glycerin',
      declaration,
      'Panthenol',
      'Squalane',
      'Sodium Hyaluronate',
      'Allantoin',
      'Tocopherol',
      'Betaine',
    ]
    const units = [
      ['Percent', '%'],
      ['PPM', 'ppm'],
      ['Mass Ratio', ' mg/g'],
    ]
    const forms = [
      ['Dot', '.5'],
      ['Comma', ',5'],
      ['Comparison', '≤.5'],
      ['Approximation', '≈,5'],
      ['Both Bounds', '.5-.75'],
      ['Second Bound', '0.5-.75'],
      ['First Bound', '.5-0.75'],
      ['Word Range', ',5 à ,75'],
      ['Existing Leading Zero', '0.5'],
    ]
    const held = units.flatMap(([unit, suffix]) => [
      ...forms.map(([name, value]) => ({
        name: `${unit} ${name}`,
        raw: labels(`Niacinamide ${value}${suffix}`).join(' '),
      })),
      {
        name: `${unit} Compound`,
        raw: labels(`Sodium Hyaluronate .5${suffix}`).join(' '),
      },
    ])
    held.push({ name: 'Spaced Ratio Unit', raw: labels('Niacinamide .5 mg / g').join(' ') })
    const safe = units.flatMap(([unit, suffix]) => {
      const declaration = `Niacinamide .5${suffix}`
      const blob = labels(declaration).slice(1, -1).join(' ')
      return [
        {
          name: `${unit} Trivial`,
          raw: labels(declaration).join('; '),
          expected: labels(declaration).join(', '),
        },
        {
          name: `${unit} Parenthesized`,
          raw: labels(`Niacinamide (.5${suffix})`).join(' '),
          expected: labels(`Niacinamide (.5${suffix})`).join(', '),
        },
        {
          name: `${unit} Mixed`,
          raw: `Aqua; ${blob}; Betaine`,
          expected: `Aqua, ${blob}, Betaine`,
        },
      ]
    })
    const cases = [
      ...held.map((entry) => ({ ...entry, expected: entry.raw, shape: SKINCARE })),
      ...safe.map((entry) => ({ ...entry, shape: SKINCARE })),
      {
        name: 'Plain Decimal Control',
        raw: labels('Niacinamide').join(' '),
        expected: labels('Niacinamide').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Decimal Supplement',
        raw: labels('Niacinamide .5%').join(' '),
        expected: labels('Niacinamide .5%').join(' '),
        shape: COMPLEMENT,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, { ...entry.shape, name: entry.name })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    const dryRun = run([])
    expect(dryRun).toContain('Would update 10 rows.')
    expect(dryRun).toContain('Percentage regions kept unsplit: 11')
    expect(dryRun).toContain('PPM regions kept unsplit: 11')
    expect(dryRun).toContain('Mass-ratio regions kept unsplit: 12')
    expect(await read()).toEqual(before)
    const applied = run(['--apply'])
    expect(applied).toContain('Updated 10 rows.')
    expect(applied).toContain('Percentage regions kept unsplit: 11')
    expect(applied).toContain('PPM regions kept unsplit: 11')
    expect(applied).toContain('Mass-ratio regions kept unsplit: 12')
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('Leading decimal fixture missing')
      return { ...product, inci: entry.expected }
    })
    expect(await read()).toEqual(expected)
    const repeated = run(['--apply'])
    expect(repeated).toContain('Updated 0 rows.')
    expect(repeated).toContain('Percentage regions kept unsplit: 11')
    expect(repeated).toContain('PPM regions kept unsplit: 11')
    expect(repeated).toContain('Mass-ratio regions kept unsplit: 12')
    expect(await read()).toEqual(expected)
  })

  it('retains input quality evidence when a repair would erase a suspicion reason', async () => {
    const owner = await createTestAdminUser()
    const names = [
      'Aqua',
      'Glycerin',
      'Niacinamide',
      'Panthenol',
      'Squalane',
      'Sodium Hyaluronate',
      'Allantoin',
      'Tocopherol',
    ]
    const body = names.join(' ')
    const repaired = names.join(', ')
    const held = [
      ['French Claim', `Sans Retinol ${body}`],
      ['English Claim', `Without Retinol ${body}`],
      ['Free From Claim', `Free From Retinol ${body}`],
      ['Uppercase Claim', `SANS RETINOL ${body}`],
      ['Tab Claim', `Free\tFrom Retinol ${body}`],
      ['Inner Claim', `Aqua; Without Retinol ${body}`],
      ['Two Reasons', `Sans Retinol ${body},`],
    ].map(([name, raw]) => ({ name, raw }))
    const cases = [
      ...held.map((entry) => ({ ...entry, expected: entry.raw, shape: SKINCARE })),
      {
        name: 'Plain Quality Control',
        raw: body,
        expected: repaired,
        shape: SKINCARE,
      },
      {
        name: 'Heading Quality Control',
        raw: `FORMULE : ${body}`,
        expected: repaired,
        shape: SKINCARE,
      },
      ...[
        ['Trailing Comma', ','],
        ['Trailing Semicolon', ';'],
        ['Trailing Ellipsis', '...'],
        ['Trailing Unicode Ellipsis', '…'],
      ].map(([name, suffix]) => ({
        name,
        raw: `${body}${suffix}`,
        expected: `${repaired}${suffix}`,
        shape: SKINCARE,
      })),
      {
        name: 'Intact Claim',
        raw: `Sans Retinol; ${body}`,
        expected: `Sans Retinol, ${repaired}`,
        shape: SKINCARE,
      },
      {
        name: 'Intact Two Reasons',
        raw: `Sans Retinol; ${body};`,
        expected: `Sans Retinol, ${repaired};`,
        shape: SKINCARE,
      },
      {
        name: 'Encoded Claim',
        raw: `Sans&nbsp;Retinol ${body}`,
        expected: `Sans&nbsp;Retinol, ${repaired}`,
        shape: SKINCARE,
      },
      {
        name: 'Quality Supplement',
        raw: `Sans Retinol ${body}`,
        expected: `Sans Retinol ${body}`,
        shape: COMPLEMENT,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, { ...entry.shape, name: entry.name })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    const dryRun = run([])
    expect(dryRun).toContain('Would update 9 rows.')
    expect(dryRun).toContain('Damage-evidence rows kept unchanged: 7')
    expect(await read()).toEqual(before)
    const applied = run(['--apply'])
    expect(applied).toContain('Updated 9 rows.')
    expect(applied).toContain('Damage-evidence rows kept unchanged: 7')
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('Input quality fixture missing')
      return { ...product, inci: entry.expected }
    })
    expect(await read()).toEqual(expected)
    const repeated = run(['--apply'])
    expect(repeated).toContain('Updated 0 rows.')
    expect(repeated).toContain('Damage-evidence rows kept unchanged: 7')
    expect(await read()).toEqual(expected)
  })

  it('retains optional declarations when a repair would change their scope', async () => {
    const owner = await createTestAdminUser()
    const labels = (declaration: string) => [
      'Aqua',
      'Glycerin',
      declaration,
      'Panthenol',
      'Squalane',
      'Sodium Hyaluronate',
      'Allantoin',
      'Tocopherol',
    ]
    const held = [
      ['Spaced Marker', '+ / - Retinol'],
      ['Left Spaced Marker', '+ /- Retinol'],
      ['Right Spaced Marker', '+/ - Retinol'],
      ['Tab Marker', '+\t/\t- Retinol'],
      ['Wide Marker', '+  /  - Retinol'],
    ].map(([name, declaration]) => ({ name, raw: labels(declaration).join(' ') }))
    const masked = `[May contain Retinol]; ${labels('+ / - Niacinamide').join(' ')}`
    const safe = [
      {
        name: 'Compact Marker',
        raw: labels('+/- Retinol').join(' '),
        expected:
          'Aqua, Glycerin, +/-, Retinol, Panthenol, Squalane, Sodium Hyaluronate, Allantoin, Tocopherol',
      },
      {
        name: 'Unicode Marker',
        raw: labels('± Retinol').join(' '),
        expected:
          'Aqua, Glycerin ±, Retinol, Panthenol, Squalane, Sodium Hyaluronate, Allantoin, Tocopherol',
      },
      {
        name: 'English Marker',
        raw: labels('May contain Retinol').join(' '),
        expected:
          'Aqua, Glycerin, May contain, Retinol, Panthenol, Squalane, Sodium Hyaluronate, Allantoin, Tocopherol',
      },
      {
        name: 'French Marker',
        raw: labels('Peut contenir Retinol').join(' '),
        expected:
          'Aqua, Glycerin, Peut contenir, Retinol, Panthenol, Squalane, Sodium Hyaluronate, Allantoin, Tocopherol',
      },
      {
        name: 'Closed Marker',
        raw: `${labels('[+ / - Retinol]').join('; ')}; Betaine; Niacinamide`,
        expected: `${labels('[+ / - Retinol]').join('; ')}; Betaine; Niacinamide`,
      },
      {
        name: 'Repeated Closed Marker',
        raw: `${labels('[May contain Retinol]').join('; ')}; [May contain Niacinamide]`,
        expected: `${labels('[May contain Retinol]').join('; ')}; [May contain Niacinamide]`,
      },
      {
        name: 'Optical ASCII',
        raw: labels('(+/-)-Bisabolol').join('; '),
        expected: labels('(+/-)-Bisabolol').join(', '),
      },
      {
        name: 'Optical Unicode',
        raw: labels('(±)-Bisabolol').join('; '),
        expected: labels('(±)-Bisabolol').join(', '),
      },
      {
        name: 'Plain Marker Control',
        raw: `${labels('Retinol').join(' ')} Betaine`,
        expected: `${labels('Retinol').join(', ')}, Betaine`,
      },
      {
        name: 'Outside Marker',
        raw: `${labels('Niacinamide').join('; ')}; May contain Retinol`,
        expected: `${labels('Niacinamide').join(', ')}, May contain Retinol`,
      },
    ]
    const cases = [
      ...held.map((entry) => ({ ...entry, expected: entry.raw, shape: SKINCARE })),
      { name: 'Masked Marker Loss', raw: masked, expected: masked, shape: SKINCARE },
      ...safe.map((entry) => ({ ...entry, shape: SKINCARE })),
      {
        name: 'Optional Supplement',
        raw: labels('+ / - Retinol').join(' '),
        expected: labels('+ / - Retinol').join(' '),
        shape: COMPLEMENT,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, { ...entry.shape, name: entry.name })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    const dryRun = run([])
    expect(dryRun).toContain('Would update 8 rows.')
    expect(dryRun).toContain('Optional-declaration rows kept unchanged: 6')
    expect(dryRun).toContain('Annotation rows kept unchanged: 1')
    expect(await read()).toEqual(before)
    const applied = run(['--apply'])
    expect(applied).toContain('Updated 8 rows.')
    expect(applied).toContain('Optional-declaration rows kept unchanged: 6')
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('Optional declaration fixture missing')
      return { ...product, inci: entry.expected }
    })
    expect(await read()).toEqual(expected)
    const repeated = run(['--apply'])
    expect(repeated).toContain('Updated 0 rows.')
    expect(repeated).toContain('Optional-declaration rows kept unchanged: 6')
    expect(await read()).toEqual(expected)
  })

  it('retains mg/g quantities with their preceding ingredient word', async () => {
    const owner = await createTestAdminUser()
    const labels = (declaration: string) => [
      'Aqua',
      'Glycerin',
      declaration,
      'Panthenol',
      'Squalane',
      'Sodium Hyaluronate',
      'Allantoin',
      'Tocopherol',
    ]
    const held = [
      ['Spaced Mass Ratio', 'Niacinamide 5 mg/g'],
      ['Compact Mass Ratio', 'Niacinamide 5mg/g'],
      ['Decimal Point Mass Ratio', 'Niacinamide 0.5 mg/g'],
      ['Decimal Comma Mass Ratio', 'Niacinamide 0,5 MG/G'],
      ['Comparison Mass Ratio', 'Niacinamide <=5 mg/g'],
      ['Approximation Mass Ratio', 'Niacinamide ≈ 5 mg/g'],
      ['Range Mass Ratio', 'Niacinamide 5-10 mg/g'],
      ['Word Range Mass Ratio', 'Niacinamide 5 to 10mg/g'],
      ['French Range Mass Ratio', 'Niacinamide 5 à 10 mg/g'],
      ['Unicode Range Mass Ratio', 'Niacinamide 5\u201310 mg/g'],
      ['Spaced Range Mass Ratio', 'Niacinamide 5 - 10 mg/g'],
      ['Compound Mass Ratio', 'Sodium Hyaluronate 5 mg/g'],
      ['Spaced Unit', 'Niacinamide 5 mg / g'],
      ['Right Spaced Unit', 'Niacinamide 5mg/ g'],
      ['Left Spaced Unit', 'Niacinamide 5mg /g'],
      ['Tab Unit', 'Niacinamide 5 mg\t/\tg'],
      ['Wide Unit', 'Niacinamide 5 mg  /  g'],
    ].map(([name, declaration]) => ({ name, raw: labels(declaration).join(' ') }))
    const repeated = `Niacinamide (5 mg/g); ${labels('Niacinamide 5 mg/g').join(' ')}`
    const blob = labels('Niacinamide 5 mg/g').slice(1, -1).join(' ')
    const spacedBlob = labels('Niacinamide 5 mg / g').slice(1, -1).join(' ')
    const cases = [
      ...held.map((entry) => ({ ...entry, expected: entry.raw, shape: SKINCARE })),
      {
        name: 'Repeated Mass Ratio',
        raw: repeated,
        expected: `Niacinamide (5 mg/g), ${labels('Niacinamide 5 mg/g').join(' ')}`,
        shape: SKINCARE,
      },
      {
        name: 'Trivial Mass Ratio',
        raw: labels('Niacinamide 5 mg/g').join('; '),
        expected: labels('Niacinamide 5 mg/g').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Parenthesized Mass Ratio',
        raw: labels('Niacinamide (5 mg/g)').join(' '),
        expected: labels('Niacinamide (5 mg/g)').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Plain Mass Ratio Control',
        raw: labels('Niacinamide').join(' '),
        expected: labels('Niacinamide').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Unit Suffix Control',
        raw: labels('Niacinamide 5 mg/ga').join(' '),
        expected:
          'Aqua, Glycerin, Niacinamide, 5 mg/ga, Panthenol, Squalane, Sodium Hyaluronate, Allantoin, Tocopherol',
        shape: SKINCARE,
      },
      {
        name: 'Mixed Mass Ratio',
        raw: `Aqua; ${blob}; Tocopherol`,
        expected: `Aqua, ${blob}, Tocopherol`,
        shape: SKINCARE,
      },
      {
        name: 'Trivial Spaced Unit',
        raw: labels('Niacinamide 5 mg / g').join('; '),
        expected: labels('Niacinamide 5 mg / g').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Parenthesized Spaced Unit',
        raw: labels('Niacinamide (5 mg / g)').join(' '),
        expected: labels('Niacinamide (5 mg / g)').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Mixed Spaced Unit',
        raw: `Aqua; ${spacedBlob}; Tocopherol`,
        expected: `Aqua, ${spacedBlob}, Tocopherol`,
        shape: SKINCARE,
      },
      {
        name: 'Slash List Control',
        raw: labels('Niacinamide').join(' / '),
        expected: labels('Niacinamide').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Slash With Other Denominator',
        raw: labels('Niacinamide 5 mg / gg').join('; '),
        expected: labels('Niacinamide 5 mg, gg').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Slash Without Numerator',
        raw: labels('Niacinamide / g').join('; '),
        expected: labels('Niacinamide, g').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Mass Ratio Supplement',
        raw: labels('Niacinamide 5 mg/g').join(' '),
        expected: labels('Niacinamide 5 mg/g').join(' '),
        shape: COMPLEMENT,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, { ...entry.shape, name: entry.name })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    const dryRun = run([])
    expect(dryRun).toContain('Would update 12 rows.')
    expect(dryRun).toContain('Mass-ratio regions kept unsplit: 20')
    expect(await read()).toEqual(before)
    const applied = run(['--apply'])
    expect(applied).toContain('Updated 12 rows.')
    expect(applied).toContain('Mass-ratio regions kept unsplit: 20')
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('Mass Ratio fixture missing')
      return { ...product, inci: entry.expected }
    })
    expect(await read()).toEqual(expected)
    const repeatedRun = run(['--apply'])
    expect(repeatedRun).toContain('Updated 0 rows.')
    expect(repeatedRun).toContain('Mass-ratio regions kept unsplit: 20')
    expect(await read()).toEqual(expected)
  })

  it('retains ppm declarations with their preceding ingredient word', async () => {
    const owner = await createTestAdminUser()
    const labels = (declaration: string) => [
      'Aqua',
      'Glycerin',
      declaration,
      'Panthenol',
      'Squalane',
      'Sodium Hyaluronate',
      'Allantoin',
      'Tocopherol',
    ]
    const held = [
      ['Spaced PPM', 'Niacinamide 5 ppm'],
      ['Compact PPM', 'Niacinamide 5ppm'],
      ['Decimal Point PPM', 'Niacinamide 0.5 ppm'],
      ['Decimal Comma PPM', 'Niacinamide 0,5 PPM'],
      ['Comparison PPM', 'Niacinamide <=5 ppm'],
      ['Approximation PPM', 'Niacinamide ≈ 5 ppm'],
      ['Range PPM', 'Niacinamide 5-10 ppm'],
      ['Word Range PPM', 'Niacinamide 5 to 10ppm'],
      ['French Range PPM', 'Niacinamide 5 à 10 ppm'],
      ['Unicode Range PPM', 'Niacinamide 5\u201310 ppm'],
      ['Spaced Range PPM', 'Niacinamide 5 - 10 ppm'],
      ['Compound PPM', 'Sodium Hyaluronate 5 ppm'],
    ].map(([name, declaration]) => ({ name, raw: labels(declaration).join(' ') }))
    const repeated = `Niacinamide (5 ppm); ${labels('Niacinamide 5 ppm').join(' ')}`
    const blob = labels('Niacinamide 5 ppm').slice(1, -1).join(' ')
    const cases = [
      ...held.map((entry) => ({ ...entry, expected: entry.raw, shape: SKINCARE })),
      {
        name: 'Repeated PPM',
        raw: repeated,
        expected: `Niacinamide (5 ppm), ${labels('Niacinamide 5 ppm').join(' ')}`,
        shape: SKINCARE,
      },
      {
        name: 'Trivial PPM',
        raw: labels('Niacinamide 5 ppm').join('; '),
        expected: labels('Niacinamide 5 ppm').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Parenthesized PPM',
        raw: labels('Niacinamide (5 ppm)').join(' '),
        expected: labels('Niacinamide (5 ppm)').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Plain PPM Control',
        raw: labels('Niacinamide').join(' '),
        expected: labels('Niacinamide').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Unit Suffix Control',
        raw: labels('Niacinamide 5 ppma').join(' '),
        expected:
          'Aqua, Glycerin, Niacinamide, 5 ppma, Panthenol, Squalane, Sodium Hyaluronate, Allantoin, Tocopherol',
        shape: SKINCARE,
      },
      {
        name: 'Mixed PPM',
        raw: `Aqua; ${blob}; Tocopherol`,
        expected: `Aqua, ${blob}, Tocopherol`,
        shape: SKINCARE,
      },
      {
        name: 'PPM Supplement',
        raw: labels('Niacinamide 5 ppm').join(' '),
        expected: labels('Niacinamide 5 ppm').join(' '),
        shape: COMPLEMENT,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, { ...entry.shape, name: entry.name })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    const dryRun = run([])
    expect(dryRun).toContain('Would update 6 rows.')
    expect(dryRun).toContain('PPM regions kept unsplit: 14')
    expect(await read()).toEqual(before)
    const applied = run(['--apply'])
    expect(applied).toContain('Updated 6 rows.')
    expect(applied).toContain('PPM regions kept unsplit: 14')
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('PPM fixture missing')
      return { ...product, inci: entry.expected }
    })
    expect(await read()).toEqual(expected)
    const repeatedRun = run(['--apply'])
    expect(repeatedRun).toContain('Updated 0 rows.')
    expect(repeatedRun).toContain('PPM regions kept unsplit: 14')
    expect(await read()).toEqual(expected)
  })

  it('retains percentage comparisons with their preceding ingredient word', async () => {
    const owner = await createTestAdminUser()
    const labels = (declaration: string) => [
      'Aqua',
      'Glycerin',
      declaration,
      'Panthenol',
      'Squalane',
      'Sodium Hyaluronate',
      'Allantoin',
      'Tocopherol',
    ]
    const held = [
      ['Less Than', 'Niacinamide <5%'],
      ['At Most', 'Niacinamide <=5%'],
      ['Greater Than', 'Niacinamide >5%'],
      ['At Least', 'Niacinamide >=5%'],
      ['Unicode At Most', 'Niacinamide ≤5%'],
      ['Unicode At Least', 'Niacinamide ≥5%'],
      ['Tilde Approximation', 'Niacinamide ~5%'],
      ['Unicode Approximation', 'Niacinamide ≈5%'],
      ['Decimal Comma', 'Niacinamide ≤0,5 %'],
      ['Decimal Point', 'Niacinamide >=0.5%'],
      ['Spaced Comparison', 'Niacinamide <= 5 %'],
      ['Compound Comparison', 'Sodium Hyaluronate <1%'],
      ['Existing Spaced Comparison', 'Niacinamide < 5%'],
    ].map(([name, declaration]) => ({
      name,
      raw: labels(declaration).join(' '),
    }))
    const blob = [
      'Niacinamide <5%',
      'Glycerin',
      'Panthenol',
      'Squalane',
      'Sodium Hyaluronate',
      'Allantoin',
      'Betaine',
    ].join(' ')
    const cases = [
      ...held.map((entry) => ({ ...entry, expected: entry.raw, shape: SKINCARE })),
      {
        name: 'Trivial Comparison',
        raw: labels('Niacinamide <5%').join('; '),
        expected: labels('Niacinamide <5%').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Parenthesized Comparison',
        raw: labels('Niacinamide (≤5%)').join(' '),
        expected: labels('Niacinamide (≤5%)').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Plain Comparison Control',
        raw: labels('Niacinamide').join(' '),
        expected: labels('Niacinamide').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Mixed Comparison',
        raw: `Aqua; ${blob}; Tocopherol`,
        expected: `Aqua, ${blob}, Tocopherol`,
        shape: SKINCARE,
      },
      {
        name: 'Comparison Supplement',
        raw: labels('Niacinamide <5%').join(' '),
        expected: labels('Niacinamide <5%').join(' '),
        shape: COMPLEMENT,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, { ...entry.shape, name: entry.name })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    const dryRun = run([])
    expect(dryRun).toContain('Would update 4 rows.')
    expect(dryRun).toContain('Percentage regions kept unsplit: 14')
    expect(await read()).toEqual(before)
    const applied = run(['--apply'])
    expect(applied).toContain('Updated 4 rows.')
    expect(applied).toContain('Percentage regions kept unsplit: 14')
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('Comparison fixture missing')
      return { ...product, inci: entry.expected }
    })
    // Separating the comparison from its name loses the declared qualification
    expect(await read()).toEqual(expected)
    const repeated = run(['--apply'])
    expect(repeated).toContain('Updated 0 rows.')
    expect(repeated).toContain('Percentage regions kept unsplit: 14')
    expect(await read()).toEqual(expected)
  })

  it('retains declared percentage ranges with their preceding ingredient word', async () => {
    const owner = await createTestAdminUser()
    const labels = (declaration: string) => [
      'Aqua',
      'Glycerin',
      declaration,
      'Panthenol',
      'Squalane',
      'Sodium Hyaluronate',
      'Allantoin',
      'Tocopherol',
    ]
    const held = [
      ['Integer Range', 'Niacinamide 5-10%'],
      ['Decimal Comma Range', 'Niacinamide 0,5-1,0 %'],
      ['Decimal Point Range', 'Niacinamide 0.5-1.0%'],
      ['Spaced Range', 'Niacinamide 5 - 10 %'],
      ['En Dash Range', 'Niacinamide 5\u201310%'],
      ['Em Dash Range', 'Niacinamide 5\u201410%'],
      ['Minus Range', 'Niacinamide 5\u221210%'],
      ['English Range', 'Niacinamide 5 to 10%'],
      ['Uppercase Range', 'Niacinamide 5 TO 10%'],
      ['French Range', 'Niacinamide 5 à 10%'],
      ['Compound Range', 'Sodium Hyaluronate 0.5-1%'],
    ].map(([name, declaration]) => ({
      name,
      raw: labels(declaration).join(' '),
    }))
    const blob = [
      'Niacinamide 5-10%',
      'Glycerin',
      'Panthenol',
      'Squalane',
      'Sodium Hyaluronate',
      'Allantoin',
      'Betaine',
    ].join(' ')
    const cases = [
      ...held.map((entry) => ({ ...entry, expected: entry.raw, shape: SKINCARE })),
      {
        name: 'Trivial Range',
        raw: labels('Niacinamide 5-10%').join('; '),
        expected: labels('Niacinamide 5-10%').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Parenthesized Range',
        raw: labels('Niacinamide (5-10%)').join(' '),
        expected: labels('Niacinamide (5-10%)').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Plain List',
        raw: labels('Niacinamide').join(' '),
        expected: labels('Niacinamide').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Mixed Range',
        raw: `Aqua; ${blob}; Tocopherol`,
        expected: `Aqua, ${blob}, Tocopherol`,
        shape: SKINCARE,
      },
      {
        name: 'Range Supplement',
        raw: labels('Niacinamide 5-10%').join(' '),
        expected: labels('Niacinamide 5-10%').join(' '),
        shape: COMPLEMENT,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, { ...entry.shape, name: entry.name })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    const dryRun = run([])
    expect(dryRun).toContain('Would update 4 rows.')
    expect(dryRun).toContain('Percentage regions kept unsplit: 12')
    expect(await read()).toEqual(before)
    const applied = run(['--apply'])
    expect(applied).toContain('Updated 4 rows.')
    expect(applied).toContain('Percentage regions kept unsplit: 12')
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('Range fixture missing')
      return { ...product, inci: entry.expected }
    })
    // A range detached from its name can no longer qualify that declared ingredient
    expect(await read()).toEqual(expected)
    const repeated = run(['--apply'])
    expect(repeated).toContain('Updated 0 rows.')
    expect(repeated).toContain('Percentage regions kept unsplit: 12')
    expect(await read()).toEqual(expected)
  })

  it('retains unresolved newline boundaries instead of guessing an ingredient list', async () => {
    const owner = await createTestAdminUser()
    const labels = (declaration: string) => [
      'Aqua',
      'Niacinamide',
      'Glycerin',
      declaration,
      'Panthenol',
      'Squalane',
      'Sodium Hyaluronate',
      'Allantoin',
      'Tocopherol',
    ]
    const held = [
      { name: 'Ambiguous LF', raw: labels('Arginine\nPCA').join('\n') },
      { name: 'Ambiguous CRLF', raw: labels('Arginine\r\nPCA').join('\r\n') },
      { name: 'Ambiguous CR', raw: labels('Arginine\rPCA').join('\r') },
      { name: 'Unknown Lines', raw: labels('Unknown Ingredient\nBetaine').join('\n') },
      { name: 'Mixed Separators', raw: labels('Arginine\nPCA').join('; ') },
    ]
    const safe = [
      {
        name: 'Known LF',
        raw: labels('Betaine').join('\n'),
        expected: labels('Betaine').join(', '),
      },
      {
        name: 'Wrapped CRLF',
        raw: labels('Sodium\r\nHyaluronate').join('\r\n'),
        expected: labels('Sodium Hyaluronate').join(', '),
      },
      {
        name: 'Known CR',
        raw: labels('Betaine').join('\r'),
        expected: labels('Betaine').join(', '),
      },
      {
        name: 'Unknown Without Lines',
        raw: labels('Unknown Ingredient').join(' '),
        expected: labels('Unknown Ingredient').join(', '),
      },
      {
        name: 'Blank Lines',
        raw: `\n${labels('Betaine').join('\n')}\n`,
        expected: labels('Betaine').join(', '),
      },
      {
        name: 'Explicit Compound',
        raw: labels('Arginine PCA').join(' '),
        expected: labels('Arginine PCA').join(', '),
      },
      {
        name: 'Explicit Separate',
        raw: [...labels('Arginine, PCA'), 'Glycerin', 'Panthenol'].join(' '),
        expected: [...labels('Arginine, PCA'), 'Glycerin', 'Panthenol'].join(', '),
      },
      {
        name: 'Trailing Comma',
        raw: `${labels('Betaine').join('\n')},`,
        expected: `${labels('Betaine').join(', ')},`,
      },
    ]
    const cases = [
      ...held.map((entry) => ({ ...entry, expected: entry.raw, shape: SKINCARE })),
      ...safe.map((entry) => ({ ...entry, shape: SKINCARE })),
      {
        name: 'Line Supplement',
        raw: labels('Arginine\nPCA').join('\n'),
        expected: labels('Arginine\nPCA').join('\n'),
        shape: COMPLEMENT,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, { ...entry.shape, name: entry.name })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    const dryRun = run([])
    expect(dryRun).toContain('Would update 8 rows.')
    expect(dryRun).toContain('Skipped unresolved line boundaries: 5')
    expect(await read()).toEqual(before)
    const applied = run(['--apply'])
    expect(applied).toContain('Updated 8 rows.')
    expect(applied).toContain('Skipped unresolved line boundaries: 5')
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('Newline fixture missing')
      return { ...product, inci: entry.expected }
    })
    // Flattening these lines would replace source uncertainty with guessed boundaries
    expect(await read()).toEqual(expected)
    const repeated = run(['--apply'])
    expect(repeated).toContain('Updated 0 rows.')
    expect(repeated).toContain('Skipped unresolved line boundaries: 5')
    expect(await read()).toEqual(expected)
  })

  it('retains source annotations and their attachment when a repair would change them', async () => {
    const owner = await createTestAdminUser()
    const labels = (declaration: string) => [
      'Aqua',
      'Glycerin',
      declaration,
      'Panthenol',
      'Squalane',
      'Sodium Hyaluronate',
      'Tocopherol',
    ]
    const longNote = 'Niacinamide (supplier grade with Retinol and Parfum)'
    const held = [
      { name: 'Long Annotation', raw: labels(longNote).join(' ') },
      { name: 'Inner Separator', raw: labels('Niacinamide (supplier; grade)').join('; ') },
      {
        name: 'Square Annotation',
        raw: labels('Niacinamide [supplier grade with Retinol and Parfum]').join(' '),
      },
      {
        name: 'Nested Annotation',
        raw: labels('Niacinamide (supplier [grade; note])').join('; '),
      },
      {
        name: 'Adjacent Annotation',
        raw: labels('Niacinamide (supplier; grade) [second note]').join('; '),
      },
      {
        name: 'Unclosed Annotation',
        raw: labels('Niacinamide (supplier note').join(' '),
      },
      {
        name: 'Mismatched Annotation',
        raw: labels('Niacinamide (supplier note]').join(' '),
      },
      {
        name: 'Repeated Annotation',
        raw: `${longNote}; ${labels(longNote).join(' ')}`,
      },
    ]
    const safe = [
      { name: 'Safe Annotation', declaration: 'Niacinamide (supplier grade)' },
      { name: 'Standalone Group', declaration: '[supplier grade]' },
      { name: 'Safe Adjacent', declaration: 'Niacinamide (supplier) [grade]' },
      { name: 'Comma Annotation', declaration: 'Niacinamide (supplier, grade)' },
    ]
    const cases = [
      ...held.map((entry) => ({ ...entry, expected: entry.raw, shape: SKINCARE })),
      ...safe.map(({ name, declaration }) => ({
        name,
        raw: labels(declaration).join('; '),
        expected: labels(declaration).join(', '),
        shape: SKINCARE,
      })),
      {
        name: 'Annotation Supplement',
        raw: labels(longNote).join(' '),
        expected: labels(longNote).join(' '),
        shape: COMPLEMENT,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, { ...entry.shape, name: entry.name })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    const dryRun = run([])
    expect(dryRun).toContain('Would update 4 rows.')
    expect(dryRun).toContain('Annotation rows kept unchanged: 8')
    expect(await read()).toEqual(before)
    const applied = run(['--apply'])
    expect(applied).toContain('Updated 4 rows.')
    expect(applied).toContain('Annotation rows kept unchanged: 8')
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('Annotation fixture missing')
      return { ...product, inci: entry.expected }
    })
    // Splitting a note from its ingredient changes the declared meaning
    expect(await read()).toEqual(expected)
    const repeated = run(['--apply'])
    expect(repeated).toContain('Updated 0 rows.')
    expect(repeated).toContain('Annotation rows kept unchanged: 8')
    expect(await read()).toEqual(expected)
  })

  it('preserves HTML entity terminators inside ingredient names', async () => {
    const owner = await createTestAdminUser()
    const labels = (declaration: string) => [
      'Aqua',
      'Niacinamide',
      'Glycerin',
      declaration,
      'Panthenol',
      'Squalane',
      'Allantoin',
      'Tocopherol',
    ]
    const cases = [
      ...[
        ['Named Entity', 'Sodium&nbsp; Hyaluronate'],
        ['Uppercase Entity', 'Sodium&NBSP; Hyaluronate'],
        ['Decimal Entity', 'Sodium&#160; Hyaluronate'],
        ['Hex Entity', 'Sodium&#xA0; Hyaluronate'],
        ['Unknown Entity', 'Sodium&vendor; Hyaluronate'],
        ['Compact Entity', 'Sodium&nbsp;Hyaluronate'],
        ['Plain Semicolons', 'Sodium Hyaluronate'],
      ].map(([name, declaration]) => ({
        name,
        raw: labels(declaration).join('; '),
        expected: labels(declaration).join(', '),
        shape: SKINCARE,
      })),
      {
        name: 'Adjacent Separator',
        raw: labels('Sodium&nbsp;; Hyaluronate').join('; '),
        expected: labels('Sodium&nbsp;, Hyaluronate').join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Truncated Entity',
        raw: `${labels('Sodium&nbsp; Hyaluronate').join('; ')},&nbsp;`,
        expected: `${labels('Sodium&nbsp; Hyaluronate').join(', ')},&nbsp;`,
        shape: SKINCARE,
      },
      {
        name: 'Entity Supplement',
        raw: labels('Sodium&nbsp; Hyaluronate').join('; '),
        expected: labels('Sodium&nbsp; Hyaluronate').join('; '),
        shape: COMPLEMENT,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, { ...entry.shape, name: entry.name })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    expect(run([])).toContain('Would update 9 rows.')
    expect(await read()).toEqual(before)
    expect(run(['--apply'])).toContain('Updated 9 rows.')
    const expected = before.map((row) => {
      const entry = cases.find((item) => item.name === row.name)
      if (!entry) throw new Error('Entity fixture missing')
      return { ...row, inci: entry.expected }
    })
    // Cutting the entity's semicolon makes the declared name undecodable
    expect(await read()).toEqual(expected)
    expect(run(['--apply'])).toContain('Updated 0 rows.')
    expect(await read()).toEqual(expected)
  })

  it('preserves existing comma boundaries when expanding glued regions', async () => {
    const owner = await createTestAdminUser()
    const body = [
      'Niacinamide',
      'Glycerin',
      'Panthenol',
      'Sodium Hyaluronate',
      'Squalane',
      'Allantoin',
      'Betaine',
    ]
    const expectedInci = ['Aqua', ...body, 'Tocopherol'].join(', ')
    const decimal = `Aqua, Niacinamide 0,5 % ${body.slice(1).join(' ')}, Tocopherol`
    const cases = [
      {
        name: 'Partial Commas',
        raw: `Aqua, ${body.join(' ')}, Tocopherol`,
        expected: expectedInci,
      },
      { name: 'Mixed Commas', raw: `Aqua, ${body.join(' ')}; Tocopherol`, expected: expectedInci },
      {
        name: 'Trailing Comma',
        raw: `Aqua, ${body.join(' ')}, Tocopherol,`,
        expected: `${expectedInci},`,
      },
      { name: 'Decimal Comma', raw: decimal, expected: decimal },
      {
        name: 'Annotation Comma',
        raw: `Squalane (supplier, grade), ${body.join(' ')}, Tocopherol`,
        expected: ['Squalane (supplier, grade)', ...body, 'Tocopherol'].join(', '),
      },
      {
        name: 'Existing Double Comma',
        raw: `Aqua,, ${body.join(' ')}, Tocopherol`,
        expected: `Aqua,, ${[...body, 'Tocopherol'].join(', ')}`,
      },
      {
        name: 'Comma Before Name',
        raw: `Unknown Blend ,${body.join(' ')}, Tocopherol`,
        expected: `Unknown Blend ,${[...body, 'Tocopherol'].join(', ')}`,
      },
      {
        name: 'Partial Supplement',
        raw: `Aqua, ${body.join(' ')}, Tocopherol`,
        expected: `Aqua, ${body.join(' ')}, Tocopherol`,
        shape: COMPLEMENT,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, {
        ...(entry.shape ?? SKINCARE),
        name: entry.name,
      })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    expect(run([])).toContain('Would update 6 rows.')
    expect(await read()).toEqual(before)
    expect(run(['--apply'])).toContain('Updated 6 rows.')
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('Comma fixture missing')
      return { ...product, inci: entry.expected }
    })
    // Existing delimiters must not create empty list entries during recomposition
    expect(await read()).toEqual(expected)
    expect(run(['--apply'])).toContain('Updated 0 rows.')
    expect(await read()).toEqual(expected)
  })

  it('preserves recognized long names before matching shorter identities inside them', async () => {
    const owner = await createTestAdminUser()
    const labels = (declaration: string) => [
      'Aqua',
      'Niacinamide',
      'Glycerin',
      declaration,
      'Panthenol',
      'Sodium Hyaluronate',
      'Tocopherol',
    ]
    const water = 'Houttuynia Cordata Flower Leaf Stem Water'
    const uncertain = `Unlisted supplier material without known separators ${water} Unlisted supplier material at the end`
    const captured = [
      'AQUA WATER EAU',
      'PERSEA GRATISSIMA AVOCADOOIL',
      'SQUALANE',
      'PANTHENOL',
      '12HEXANEDIOL',
      'ACRYLATES C10 30 ALKYL ACRYLATE CROSSPOLYMER',
      'XANTHAN GUM',
      'CAPRYLYL GLYCOL',
      'PENTAERYTHRITTYL TETRA DI T BUTYL HYDROXYHYDROCINNAMATE',
      'SODIUM HYDROXIDE',
    ]
    const cases = [
      { name: 'Botanical Water', raw: labels(water).join(' '), expected: labels(water).join(', ') },
      { name: 'Captured Blob', raw: captured.join(' '), expected: captured.join(', ') },
      {
        name: 'Long Polymer',
        raw: labels('C30 45 Alkyl Cetearyl Dimethicone Crosspolymer').join(' '),
        expected: labels('C30 45 Alkyl Cetearyl Dimethicone Crosspolymer').join(', '),
      },
      {
        name: 'Long Peptide',
        raw: labels('Nicotiana Benthamiana Hexapeptide 40 Sh Oligopeptide 1').join(' '),
        expected: labels('Nicotiana Benthamiana Hexapeptide 40 Sh Oligopeptide 1').join(', '),
      },
      {
        name: 'Annotated Water',
        raw: labels(`${water} (supplier grade)`).join(' '),
        expected: labels(`${water} (supplier grade)`).join(', '),
      },
      {
        name: 'Mixed Long Name',
        raw: `Aqua; ${['Niacinamide', 'Glycerin', water, 'Panthenol', 'Sodium Hyaluronate'].join(' ')}; Tocopherol`,
        expected: labels(water).join(', '),
      },
      { name: 'Uncertain Long Blob', raw: uncertain, expected: uncertain },
      {
        name: 'Uncertain Long Region',
        raw: `Aqua; ${uncertain}; Tocopherol`,
        expected: `Aqua, ${uncertain}, Tocopherol`,
      },
      {
        name: 'Long Supplement',
        raw: labels(water).join(' '),
        expected: labels(water).join(' '),
        shape: COMPLEMENT,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, {
        ...(entry.shape ?? SKINCARE),
        name: entry.name,
      })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    expect(run([])).toContain('Would update 7 rows.')
    expect(await read()).toEqual(before)
    expect(run(['--apply'])).toContain('Updated 7 rows.')
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('Long name fixture missing')
      return { ...product, inci: entry.expected }
    })
    // Matching Water inside a known botanical name changes the declared preparation
    expect(await read()).toEqual(expected)
    expect(run(['--apply'])).toContain('Updated 0 rows.')
    expect(await read()).toEqual(expected)
  })

  it('keeps known slash names intact inside glued ingredient lists', async () => {
    const owner = await createTestAdminUser()
    const labels = (declaration: string) => [
      'Aqua',
      'Niacinamide',
      'Glycerin',
      declaration,
      'Panthenol',
      'Sodium Hyaluronate',
      'Tocopherol',
    ]
    const oil = 'Caprylic / Capric Triglyceride'
    const polymer = 'Sodium Acrylate / Sodium Acryloyldimethyl Taurate Copolymer'
    const mixed = ['Niacinamide', 'Glycerin', oil, 'Panthenol', 'Sodium Hyaluronate'].join(' ')
    const uncertain = `Unlisted supplier material without known separators ${oil} Unlisted supplier material at the end`
    const cases = [
      { name: 'Oil Blob', raw: labels(oil).join(' '), expected: labels(oil).join(', ') },
      {
        name: 'Polymer Blob',
        raw: labels(polymer).join(' '),
        expected: labels(polymer).join(', '),
      },
      {
        name: 'Annotated Blob',
        raw: labels(`${polymer} (supplier grade)`).join(' '),
        expected: labels(`${polymer} (supplier grade)`).join(', '),
      },
      {
        name: 'Mixed Semicolon',
        raw: `Aqua; ${mixed}; Tocopherol`,
        expected: labels(oil).join(', '),
      },
      {
        name: 'Mixed Slash',
        raw: `Aqua / ${mixed} / Tocopherol`,
        expected: labels(oil).join(', '),
      },
      {
        name: 'Uncertain Blob',
        raw: uncertain,
        expected: uncertain,
      },
      {
        name: 'Uncertain Region',
        raw: `Aqua; ${uncertain}; Tocopherol`,
        expected: `Aqua, ${uncertain}, Tocopherol`,
      },
      {
        name: 'Supplement Blob',
        raw: labels(oil).join(' '),
        expected: labels(oil).join(' '),
        shape: COMPLEMENT,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, {
        ...(entry.shape ?? SKINCARE),
        name: entry.name,
      })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    expect(run([])).toContain('Would update 6 rows.')
    expect(await read()).toEqual(before)
    expect(run(['--apply'])).toContain('Updated 6 rows.')
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('Glued slash fixture missing')
      return { ...product, inci: entry.expected }
    })
    // A missing comma must not turn a slash inside one ingredient into a list boundary
    expect(await read()).toEqual(expected)
    expect(run(['--apply'])).toContain('Updated 0 rows.')
    expect(await read()).toEqual(expected)
  })

  it('preserves known slash names before treating slash as a list separator', async () => {
    const owner = await createTestAdminUser()
    const oil = 'Caprylic / Capric Triglyceride'
    const polymer = 'Sodium Acrylate / Sodium Acryloyldimethyl Taurate Copolymer'
    const labels = (declaration: string) => [
      'Aqua',
      'Niacinamide',
      'Glycerin',
      declaration,
      'Panthenol',
      'Sodium Hyaluronate',
      'Tocopherol',
    ]
    const cases = [
      { name: 'Oil Semicolon', raw: labels(oil).join('; '), expected: labels(oil).join(', ') },
      { name: 'Oil Slash', raw: labels(oil).join(' / '), expected: labels(oil).join(', ') },
      {
        name: 'Polymer Semicolon',
        raw: labels(polymer).join('; '),
        expected: labels(polymer).join(', '),
      },
      {
        name: 'Polymer Slash',
        raw: labels(polymer).join(' / '),
        expected: labels(polymer).join(', '),
      },
      {
        name: 'Polymer Note',
        raw: labels(`${polymer} (supplier grade)`).join('; '),
        expected: labels(`${polymer} (supplier grade)`).join(', '),
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, { ...SKINCARE, name: entry.name })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    const dryRun = run([])
    expect(await read()).toEqual(before)
    const applied = run(['--apply'])
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('Slash fixture missing')
      return { ...product, inci: entry.expected }
    })
    expect(await read()).toEqual(expected)
    expect(dryRun).toContain('Would update 5 rows.')
    expect(applied).toContain('Updated 5 rows.')
    expect(run(['--apply'])).toContain('Updated 0 rows.')
    expect(await read()).toEqual(expected)
  })

  it('refuses proposals that detach declared percentages while keeping safe repairs', async () => {
    const owner = await createTestAdminUser()
    const labels = (declaration: string) => [
      'Aqua',
      declaration,
      'Glycerin',
      'Panthenol',
      'Sodium Hyaluronate',
      'Tocopherol',
      'Allantoin',
      'Squalane',
    ]
    const integer = labels('Niacinamide 10%')
    const decimal = labels('Niacinamide 0,5 %')
    const parentheses = labels('Niacinamide (10%)')
    const combined = labels('Zinc Oxide [nano] (10%)')
    const blob = [
      'Niacinamide 0,5 %',
      'Glycerin',
      'Panthenol',
      'Sodium Hyaluronate',
      'Tocopherol',
      'Allantoin',
      'Squalane',
    ].join(' ')
    const cases = [
      { name: 'Integer Blob', raw: integer.join(' '), expected: integer.join(' ') },
      { name: 'Decimal Blob', raw: decimal.join(' '), expected: decimal.join(' ') },
      { name: 'Safe Parentheses', raw: parentheses.join(' '), expected: parentheses.join(', ') },
      { name: 'Safe Combined', raw: combined.join(' '), expected: combined.join(', ') },
      { name: 'Trivial Percentage', raw: integer.join('; '), expected: integer.join(', ') },
      {
        name: 'Mixed Percentage',
        raw: `Aqua; ${blob}; Betaine`,
        expected: `Aqua, ${blob}, Betaine`,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, { ...SKINCARE, name: entry.name })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    const dryRun = run([])
    expect(await read()).toEqual(before)
    const applied = run(['--apply'])
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('Percentage fixture missing')
      return { ...product, inci: entry.expected }
    })
    expect(await read()).toEqual(expected)
    expect(dryRun).toContain('Would update 4 rows.')
    expect(applied).toContain('Updated 4 rows.')
    expect(applied).toContain('Percentage regions kept unsplit: 3')
    const repeated = run(['--apply'])
    expect(repeated).toContain('Updated 0 rows.')
    expect(repeated).toContain('Percentage regions kept unsplit: 3')
    expect(await read()).toEqual(expected)
  })

  it('refuses proposals that split nano declarations while keeping safe repairs', async () => {
    const owner = await createTestAdminUser()
    const longName = 'Methylene Bis-Benzotriazolyl Tetramethylbutylphenol'
    const square = [
      'Aqua',
      'Niacinamide',
      'Glycerin',
      `${longName} [ NANO ]`,
      'Panthenol',
      'Sodium Hyaluronate',
      'Tocopherol',
    ]
    const round = square.map((label) => label.replace('[ NANO ]', '( nano )'))
    const short = [
      'Aqua',
      'Niacinamide',
      'Glycerin',
      'Zinc Oxide [nano]',
      'Panthenol',
      'Sodium Hyaluronate',
      'Tocopherol',
    ]
    const blob = [
      'Niacinamide',
      'Glycerin',
      `${longName} [ NANO ]`,
      'Panthenol',
      'Sodium Hyaluronate',
    ].join(' ')
    const cases = [
      { name: 'Long Square', raw: square.join(' '), expected: square.join(' ') },
      { name: 'Long Round', raw: round.join(' '), expected: round.join(' ') },
      { name: 'Short Square', raw: short.join(' '), expected: short.join(', ') },
      { name: 'Trivial Square', raw: square.join('; '), expected: square.join(', ') },
      {
        name: 'Mixed Square',
        raw: `Aqua; ${blob}; Tocopherol`,
        expected: `Aqua, ${blob}, Tocopherol`,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, { ...SKINCARE, name: entry.name })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    const dryRun = run([])
    expect(await read()).toEqual(before)
    const applied = run(['--apply'])
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('Nano fixture missing')
      return { ...product, inci: entry.expected }
    })
    expect(await read()).toEqual(expected)
    expect(dryRun).toContain('Would update 3 rows.')
    expect(applied).toContain('Updated 3 rows.')
    expect(applied).toContain('Nano regions kept unsplit: 3')
    const repeated = run(['--apply'])
    expect(repeated).toContain('Updated 0 rows.')
    expect(repeated).toContain('Nano regions kept unsplit: 3')
    expect(await read()).toEqual(expected)
  })

  it('preserves chemical hyphens while repairing list separators and excluding supplements', async () => {
    const owner = await createTestAdminUser()
    const labels = [
      'Aqua',
      'Niacinamide',
      'Glycerin',
      'C12 - 16 Alcohols',
      'PEG - 75',
      'D - Panthenol',
      'Sodium Hyaluronate',
      'Tocopherol',
    ]
    const plain = [
      'Aqua',
      'Niacinamide',
      'Glycerin',
      'Panthenol',
      'Sodium Hyaluronate',
      'Tocopherol',
      'Allantoin',
    ]
    const cases = [
      {
        name: 'Chemical Dash',
        raw: labels.join(' - '),
        expected: labels.join(', '),
        shape: SKINCARE,
      },
      {
        name: 'Chemical Semicolon',
        raw: labels.join('; '),
        expected: labels.join(', '),
        shape: SKINCARE,
      },
      { name: 'Plain Dash', raw: plain.join(' - '), expected: plain.join(', '), shape: SKINCARE },
      { name: 'Spaced Slash', raw: plain.join(' / '), expected: plain.join(', '), shape: SKINCARE },
      {
        name: 'Supplement',
        raw: labels.join(' - '),
        expected: labels.join(' - '),
        shape: COMPLEMENT,
      },
    ]
    for (const entry of cases) {
      const product = await createTestProduct(owner.id, { ...entry.shape, name: entry.name })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const read = () => testDb.select().from(products).orderBy(products.name)
    const before = await read()
    const runner = new URL('./resplit-single-token.ts', import.meta.url).pathname
    const run = (args: string[]) => {
      const result = Bun.spawnSync([process.execPath, runner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      return result.stdout.toString()
    }
    expect(run([])).toContain('Would update 4 rows.')
    expect(await read()).toEqual(before)
    expect(run(['--apply'])).toContain('Updated 4 rows.')
    const expected = before.map((product) => {
      const entry = cases.find((item) => item.name === product.name)
      if (!entry) throw new Error('Historical fixture missing')
      return { ...product, inci: entry.expected }
    })
    expect(await read()).toEqual(expected)
    expect(run(['--apply'])).toContain('Updated 0 rows.')
    expect(await read()).toEqual(expected)
  })
})

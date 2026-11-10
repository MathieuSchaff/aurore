import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'

import { testDb } from '../../../../tests/db.test.config'
import { setupDbTests } from '../../../../tests/db-setup'
import { SKINCARE } from '../../../../tests/helpers/product-shapes'
import { createTestAdminUser } from '../../../../tests/helpers/test-factories'
import { products } from '../../../schema'

setupDbTests()

const runner = new URL('./main.ts', import.meta.url).pathname

describe('catalogue ingest receipts', () => {
  let directory: string
  let clockPath: string
  let lotPath: string
  let ownerEmail: string

  beforeEach(async () => {
    ownerEmail = (await createTestAdminUser()).email
    directory = mkdtempSync(join(tmpdir(), 'aurore-ingest-receipts-'))
    clockPath = join(directory, 'clock.ts')
    writeFileSync(
      clockPath,
      "import { setSystemTime } from 'bun:test'; setSystemTime(new Date('2026-11-09T12:00:00.000Z'))"
    )
    lotPath = join(directory, 'lot.jsonl')
    writeLot(lotPath, 1)
  })

  afterEach(() => {
    rmSync(directory, { recursive: true, force: true })
  })

  function writeLot(path: string, index: number) {
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(
      path,
      JSON.stringify({
        ...SKINCARE,
        brand: 'Lab',
        name: `Receipt Fixture ${index}`,
        slug: `receipt-fixture-${index}`,
        inci: 'Water, Niacinamide, Glycerin',
      })
    )
  }

  function run(path: string, flags: readonly string[]) {
    const result = Bun.spawnSync(
      [process.execPath, '--preload', clockPath, runner, path, ...flags],
      {
        cwd: directory,
        env: { ...process.env, SEED_OWNER_EMAIL: ownerEmail },
        timeout: 10_000,
      }
    )
    expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
      exitCode: 0,
      stderr: '',
    })
    const relativePlan = result.stdout.toString().match(/plan : (.+)/)?.[1]
    if (!relativePlan) throw new Error('Ingest did not report its plan path')
    const planPath = join(directory, relativePlan)
    return { planPath, journalPath: join(dirname(planPath), 'apply.jsonl') }
  }

  it.each([
    { mode: 'dry-run', flags: [] },
    { mode: 'write replay', flags: ['--write'] },
  ])('retains the committed receipt when a $mode follows in the same second', async ({ flags }) => {
    const first = run(lotPath, ['--write'])
    const firstPlan = readFileSync(first.planPath, 'utf8')
    const firstJournal = readFileSync(first.journalPath, 'utf8')
    expect(JSON.parse(firstJournal)).toEqual({ slug: 'receipt-fixture-1', status: 'created' })

    const next = run(lotPath, flags)
    expect({
      plan: readFileSync(first.planPath, 'utf8'),
      journal: readFileSync(first.journalPath, 'utf8'),
    }).toEqual({ plan: firstPlan, journal: firstJournal })
    expect(next.planPath).not.toBe(first.planPath)
    expect(JSON.parse(readFileSync(next.planPath, 'utf8'))).toMatchObject({
      mode: flags.length ? 'write' : 'dry-run',
      counters: { candidates: 0, skippedExisting: 1 },
    })
    if (flags.length) expect(readFileSync(next.journalPath, 'utf8')).toBe('')
    else expect(existsSync(next.journalPath)).toBe(false)
    expect(await testDb.select({ slug: products.slug }).from(products)).toEqual([
      { slug: 'receipt-fixture-1' },
    ])
  })

  it('keeps distinct source hashes and journals for same-named lots in the same second', async () => {
    const otherLot = join(directory, 'other', 'lot.jsonl')
    writeLot(otherLot, 2)
    const first = run(lotPath, ['--write'])
    const firstPlan = readFileSync(first.planPath, 'utf8')
    const firstJournal = readFileSync(first.journalPath, 'utf8')
    const second = run(otherLot, ['--write'])

    expect({
      plan: readFileSync(first.planPath, 'utf8'),
      journal: readFileSync(first.journalPath, 'utf8'),
    }).toEqual({ plan: firstPlan, journal: firstJournal })
    expect(second.planPath).not.toBe(first.planPath)
    for (const [path, receipt, slug] of [
      [lotPath, first, 'receipt-fixture-1'],
      [otherLot, second, 'receipt-fixture-2'],
    ] as const) {
      expect(JSON.parse(readFileSync(receipt.planPath, 'utf8'))).toMatchObject({
        lot: path,
        lotSha256: createHash('sha256').update(readFileSync(path)).digest('hex'),
        counters: { candidates: 1, skippedExisting: 0 },
      })
      expect(JSON.parse(readFileSync(receipt.journalPath, 'utf8'))).toEqual({
        slug,
        status: 'created',
      })
    }
    expect(
      await testDb.select({ slug: products.slug }).from(products).orderBy(products.slug)
    ).toEqual([{ slug: 'receipt-fixture-1' }, { slug: 'receipt-fixture-2' }])
  })
})

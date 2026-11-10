import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'bun:test'

import { testDb } from '../../../../tests/db.test.config'
import { setupDbTests } from '../../../../tests/db-setup'
import { SKINCARE } from '../../../../tests/helpers/product-shapes'
import { createTestAdminUser } from '../../../../tests/helpers/test-factories'
import { products } from '../../../schema'

setupDbTests()

const runner = new URL('./main.ts', import.meta.url).pathname

describe('catalogue ingest arguments', () => {
  let directory: string
  let lotPath: string
  let ownerEmail: string

  beforeEach(async () => {
    ownerEmail = (await createTestAdminUser()).email
    directory = mkdtempSync(join(tmpdir(), 'aurore-ingest-arguments-'))
    lotPath = join(directory, 'lot.jsonl')
    writeFileSync(
      lotPath,
      [1, 2]
        .map((index) =>
          JSON.stringify({
            ...SKINCARE,
            brand: 'Lab',
            name: `Argument Fixture ${index}`,
            slug: `argument-fixture-${index}`,
            inci: 'Water, Niacinamide, Glycerin',
          })
        )
        .join('\n')
    )
  })

  afterEach(() => {
    rmSync(directory, { recursive: true, force: true })
  })

  function run(args: string[]) {
    return Bun.spawnSync([process.execPath, runner, ...args], {
      cwd: directory,
      env: { ...process.env, SEED_OWNER_EMAIL: ownerEmail },
      timeout: 10_000,
    })
  }

  it.each(['--limit=1', '--classifications'])(
    'refuses %s instead of importing both rows with an ignored instruction',
    async (argument) => {
      const result = run([lotPath, '--write', argument])
      expect(await testDb.select({ slug: products.slug }).from(products)).toEqual([])
      expect(result.exitCode).not.toBe(0)
      expect(result.stdout.toString()).toBe('')
      expect(readdirSync(directory)).toEqual(['lot.jsonl'])
    }
  )

  it.each(
    [
      [],
      [''],
      ['missing.jsonl', '--limit=1'],
      ['--dry-run', 'missing.jsonl'],
      ['missing.jsonl', '--write=false'],
      ['missing.jsonl', 'another.jsonl'],
      ['missing.jsonl', '--classifications'],
      ['missing.jsonl', '--classifications', ''],
      ['missing.jsonl', '--classifications', '--write'],
      ['missing.jsonl', '--classifications', '--write', 'first.json'],
      ['missing.jsonl', '--classifications', 'first.json', '--classifications', 'second.json'],
    ].map((args) => ({ args }))
  )('rejects malformed arguments before reading the lot: %j', ({ args }) => {
    for (const mode of [[], ['--write']]) {
      const result = run([...args, ...mode])
      expect(result.exitCode).not.toBe(0)
      expect(result.stderr.toString()).toContain('Invalid arguments:')
      expect(result.stdout.toString()).toBe('')
    }
    expect(readdirSync(directory)).toEqual(['lot.jsonl'])
  })

  it('rejects unknown arguments before querying an unavailable database', () => {
    const result = Bun.spawnSync([process.execPath, runner, lotPath, '--write', '--limit=1'], {
      cwd: directory,
      env: {
        ...process.env,
        DATABASE_URL: 'postgres://app:app@127.0.0.1:1/appdb',
        APP_DATABASE_URL: 'postgres://app:app@127.0.0.1:1/appdb',
      },
      timeout: 10_000,
    })
    expect(result.exitCode).not.toBe(0)
    expect(result.stderr.toString()).toContain('Invalid arguments: unknown option --limit=1')
    expect(result.stdout.toString()).toBe('')
    expect(readdirSync(directory)).toEqual(['lot.jsonl'])
  })

  it('keeps reordered flags, classification overrides, dry-run and idempotent writes', async () => {
    const classificationsPath = join(directory, 'classifications.json')
    writeFileSync(
      classificationsPath,
      JSON.stringify({
        'argument-fixture-1': 'DROP',
        'argument-fixture-2': { name: 'Classified Fixture' },
      })
    )
    for (const mode of [[], ['--write', '--write'], ['--write']]) {
      const result = run([
        ...mode,
        '--classifications',
        classificationsPath,
        lotPath,
        '--allow-partial',
        '--allow-partial',
      ])
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      expect(
        await testDb.select({ slug: products.slug, name: products.name }).from(products)
      ).toEqual(mode.length ? [{ slug: 'argument-fixture-2', name: 'Classified Fixture' }] : [])
    }
  })

  it('requires allow-partial before importing the valid rows of a blocked lot', async () => {
    writeFileSync(lotPath, `${readFileSync(lotPath, 'utf8')}\n{"name":"Invalid row"}`)
    const refused = run([lotPath, '--write'])
    expect(refused.exitCode).not.toBe(0)
    expect(await testDb.select({ slug: products.slug }).from(products)).toEqual([])

    const accepted = run([lotPath, '--allow-partial', '--write'])
    expect(accepted.exitCode).toBe(0)
    expect(
      await testDb.select({ slug: products.slug }).from(products).orderBy(products.slug)
    ).toEqual([{ slug: 'argument-fixture-1' }, { slug: 'argument-fixture-2' }])
  })
})

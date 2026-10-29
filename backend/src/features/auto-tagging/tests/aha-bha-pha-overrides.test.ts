import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, test } from 'bun:test'

import { eq } from 'drizzle-orm'

import { productTagLinks, productTagTypes } from '../../../db/schema'
import { productTagData } from '../../../db/seed/data/tags'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { createAutoTagProduct, getTagDefBySlug, getTagLinks } from './db-helpers'

setupDbTests()

const runner = new URL('../runners/audit/aha-bha-pha-overrides.ts', import.meta.url).pathname
const lateAcid = `Aqua, ${Array.from({ length: 24 }, (_, i) => `Filler${i}`).join(', ')}, Lactic Acid`
const directories: string[] = []

async function tempCsv() {
  const directory = await mkdtemp(join(tmpdir(), 'aha-overrides-'))
  directories.push(directory)
  return join(directory, 'audit.csv')
}

function runAudit(env: Record<string, string>) {
  const result = Bun.spawnSync([process.execPath, runner], {
    env: {
      ...process.env,
      APPLY: '',
      APPLY_FROM_CSV: '',
      CSV_DIR: '',
      CSV_OUT: '',
      LIMIT: '',
      ...env,
    },
    timeout: 10_000,
  })
  expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
    exitCode: 0,
    stderr: '',
  })
}

afterEach(async () => {
  for (const directory of directories.splice(0))
    await rm(directory, { recursive: true, force: true })
})

describe('AHA/BHA/PHA override audit', () => {
  test('reports only manual mismatches, including products without INCI', async () => {
    await testDb.insert(productTagTypes).values(productTagData)
    const user = await createTestUser()
    const manual = await createAutoTagProduct(user.id, { name: 'Triphase Essence', inci: lateAcid })
    const automatic = await createAutoTagProduct(user.id, {
      name: 'Automatic acid',
      inci: lateAcid,
    })
    const empty = await createAutoTagProduct(user.id, { name: 'AHA cream' })
    const aha = await getTagDefBySlug('aha')
    await testDb.insert(productTagLinks).values([
      { productId: manual.id, productTagId: aha.id, source: 'manual', relevance: 'primary' },
      {
        productId: automatic.id,
        productTagId: aha.id,
        source: 'actif-class',
        relevance: 'secondary',
      },
      { productId: empty.id, productTagId: aha.id, source: 'manual', relevance: 'secondary' },
    ])
    const csv = await tempCsv()
    const csvDir = join(csv, '..')
    runAudit({ CSV_OUT: csv, CSV_DIR: csvDir })
    expect(await Bun.file(join(csvDir, 'keep.csv')).text()).toContain(`${empty.slug},aha`)
    expect(await Bun.file(join(csvDir, 'delete.csv')).text()).toContain(`${manual.slug},aha`)
    const rows = (await Bun.file(csv).text())
      .trim()
      .split('\n')
      .slice(1)
      .map((row) => row.split(',').slice(0, 2).join(','))
    expect(rows.sort()).toEqual([`${manual.slug},aha`, `${empty.slug},aha`].sort())
  })

  test('uses the current pipeline rinse off cap instead of the legacy default cap', async () => {
    await testDb.insert(productTagTypes).values(productTagData)
    const user = await createTestUser()
    const cleanser = await createAutoTagProduct(user.id, {
      name: 'Rinse cleanser',
      kind: 'cleanser',
      inci: `Aqua, ${Array.from({ length: 16 }, (_, i) => `Filler${i}`).join(', ')}, Salicylic Acid`,
    })
    const bha = await getTagDefBySlug('bha')
    await testDb
      .update(productTagLinks)
      .set({ source: 'manual' })
      .where(eq(productTagLinks.productId, cleanser.id))
    expect(await getTagLinks(cleanser.id, bha.id)).toHaveLength(1)
    const csv = await tempCsv()
    runAudit({ CSV_OUT: csv })
    expect(await Bun.file(csv).exists()).toBe(false)
  })

  test('deletes only manual rows from a reviewed CSV even when automatic pairs are listed', async () => {
    await testDb.insert(productTagTypes).values(productTagData)
    const user = await createTestUser()
    const manual = await createAutoTagProduct(user.id, { name: 'Manual removal', inci: lateAcid })
    const automatic = await createAutoTagProduct(user.id, {
      name: 'Automatic survivor',
      inci: lateAcid,
    })
    const aha = await getTagDefBySlug('aha')
    await testDb.insert(productTagLinks).values([
      { productId: manual.id, productTagId: aha.id, source: 'manual', relevance: 'primary' },
      {
        productId: automatic.id,
        productTagId: aha.id,
        source: 'actif-class',
        relevance: 'secondary',
      },
    ])
    const csv = await tempCsv()
    await Bun.write(csv, `product_slug,tag_slug\n${manual.slug},aha\n${automatic.slug},aha\n`)
    runAudit({ APPLY: '1', APPLY_FROM_CSV: csv })
    expect(await getTagLinks(manual.id, aha.id)).toEqual([])
    expect((await getTagLinks(automatic.id, aha.id)).map((row) => row.source)).toEqual([
      'actif-class',
    ])
  })
})

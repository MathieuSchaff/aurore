import { describe, expect, test } from 'bun:test'

import { products } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestProduct, createTestUser } from '../../../tests/helpers/test-factories'

setupDbTests()

const runner = new URL('../runners/audit/product-kinds.ts', import.meta.url).pathname

function runAudit(slug?: string) {
  const result = Bun.spawnSync([process.execPath, runner, ...(slug ? ['--slug', slug] : [])], {
    env: { ...process.env },
    timeout: 10_000,
  })
  expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
    exitCode: 0,
    stderr: '',
  })
  return result.stdout.toString()
}

describe('product kind audit scope', () => {
  test('keeps supplement benefit names out of cosmetic proposals without hiding a cosmetic mismatch', async () => {
    const user = await createTestUser()
    const names = ['Complexe Cheveux', 'Eye Support', 'Complément nettoyant']
    for (const name of names) {
      await createTestProduct(user.id, {
        name,
        category: 'complement',
        kind: 'gelule',
        unit: 'capsule',
      })
    }
    await createTestProduct(user.id, { name: 'Eye Cream', kind: 'moisturizer' })

    const output = runAudit()

    expect(output).toMatch(/certain\s*:\s*1\b/)
    expect(output).toContain('Eye Cream')
    for (const name of names) expect(output).not.toContain(name)
  })

  test('accepts a scoped supplement without proposing or persisting a topical classification', async () => {
    const user = await createTestUser()
    const product = await createTestProduct(user.id, {
      name: 'Gummies Cheveux',
      category: 'complement',
      kind: 'gummy',
      unit: 'gummy',
    })
    const before = await testDb.select().from(products)

    const output = runAudit(product.slug)

    expect(output).toContain('1 produits scannés')
    expect(output).toMatch(/certain\s*:\s*0\b/)
    expect(output).not.toContain('hair-serum')
    expect(await testDb.select().from(products)).toEqual(before)
  })
})

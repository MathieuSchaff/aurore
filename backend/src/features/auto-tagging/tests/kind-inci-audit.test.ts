import { describe, expect, test } from 'bun:test'

import { products } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestProduct, createTestUser } from '../../../tests/helpers/test-factories'

setupDbTests()

const runner = new URL('../runners/audit/kind-inci-coherence.ts', import.meta.url).pathname

function runAudit() {
  const result = Bun.spawnSync([process.execPath, runner], {
    env: { ...process.env },
    timeout: 10_000,
  })
  expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
    exitCode: 0,
    stderr: '',
  })
  return result.stdout.toString()
}

describe('kind INCI audit evidence', () => {
  test('reports unrecognized wash text without claiming a wrong kind or offering an automatic fix', async () => {
    const user = await createTestUser()
    const refill = await createTestProduct(user.id, {
      name: 'Recharge Shampoing quotidien',
      category: 'haircare',
      kind: 'shampoo',
      inci: 'Même formule, même efficacité, même plaisir. La recharge contient exactement la même formule que le Shampoing Quotidien : Ortie sauvage, Pissenlit sauvage, Sauge Water, 100% naturelle, Bio et Vegan, sans silicone. Le format change, la qualité reste',
    })
    const shampoo = await createTestProduct(user.id, {
      name: 'Shampoing témoin',
      category: 'haircare',
      kind: 'shampoo',
      inci: 'Aqua, Lauryl Glucoside, Disodium Cocoyl Glutamate, Glycerin, Citric Acid, Sodium Chloride',
    })
    const before = await testDb.select().from(products)

    const output = runAudit()

    expect(output).not.toContain('likely mistag')
    expect(output).toContain('1 wash kinds without a recognized surfactant pattern')
    expect(output).toContain(refill.slug)
    expect(output).not.toContain(shampoo.slug)
    expect(output).toContain('does not validate the INCI text or prove a wrong kind')
    expect(output).not.toContain('WRITE=1')
    expect(await testDb.select().from(products)).toEqual(before)
  })

  test('keeps a leading wash pattern reviewable without presenting it as a confirmed rinse-off', async () => {
    const user = await createTestUser()
    const product = await createTestProduct(user.id, {
      name: 'Soin à qualifier',
      kind: 'moisturizer',
      inci: 'Aqua, Sodium Laureth Sulfate, Glycerin, Sodium Chloride',
    })

    const output = runAudit()

    expect(output).not.toContain('likely a wash')
    expect(output).toContain('1 leave-on kinds with a leading wash pattern')
    expect(output).toContain(product.slug)
    expect(output).toContain('Sodium Laureth Sulfate')
    expect(output).toContain('Verify the source INCI and intended use before changing a kind')
  })

  test('does not certify coherence when no pattern flags a product with missing INCI', async () => {
    const user = await createTestUser()
    await createTestProduct(user.id, {
      name: 'Shampoing sans liste',
      category: 'haircare',
      kind: 'shampoo',
    })

    const output = runAudit()

    expect(output).not.toContain('no kind ⇄ INCI contradiction')
    expect(output).toContain('No kind/INCI heuristic flags')
    expect(output).toContain('does not validate the INCI text or prove a wrong kind')
  })
})

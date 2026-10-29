import { describe, expect, test } from 'bun:test'

import { productIngredients } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestIngredient, createTestUser } from '../../../tests/helpers/test-factories'
import { createAutoTagProduct } from './db-helpers'

setupDbTests()

const runner = new URL('../runners/audit/actif-class.ts', import.meta.url).pathname
const ureaFormula =
  'Urea, Aqua, Glycerin, Isononyl Isononanoate, Octyldodecanol, Carbomer, Arginine, Dimethicone, Cyclopentasiloxane, Phenoxyethanol, Octyldodecyl Xyloside, PEG-30 Dipolyhydroxystearate, Cyclohexasiloxane, Laureth-9, Lactic Acid, Parfum, Allantoin, Disodium EDTA, Ethylhexylglycerin, Limonene, Hexyl Cinnamal, Alpha-Isomethyl Ionone, Linalool, Benzyl Salicylate, Eugenol, Citral, Hydroxycitronellal, Coumarin, Geraniol, Citronellol, Cinnamyl Alcohol, Isoeugenol'
const cleanserFormula =
  'Aqua, Sodium Cocoamphoacetate, Sodium Laureth Sulfate, Methylpropanediol, Disodium EDTA, Mannitol, Xylitol, Rhamnose, Fructooligosaccharides, Zinc Sulfate, Copper Sulfate, Ginkgo Biloba Leaf Extract, PEG-90 Glyceryl Isostearate, Lactic Acid, Laureth-2, Potassium Sorbate, Sodium Chloride, Propylene Glycol, Sodium Hydroxide, Parfum'

function runAudit() {
  const result = Bun.spawnSync([process.execPath, runner], {
    env: {
      ...process.env,
      DUMP_DRIFT: '',
      DUMP_NEW: '1',
      LIMIT: '',
      GOLD_SET_PATH: '/nonexistent/actif-class-gold-set.json',
    },
    timeout: 10_000,
  })
  expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
    exitCode: 0,
    stderr: '',
  })
  return result.stdout.toString().split('Dump new proposals')[1] ?? ''
}

describe('actif class audit context', () => {
  test('withholds cap marginal AHA when the dose assessment rejects the exfoliant name', async () => {
    const user = await createTestUser()
    const product = await createAutoTagProduct(user.id, {
      name: 'Urea exfoliant',
      kind: 'exfoliant',
      inci: ureaFormula,
    })

    const proposals = runAudit()

    expect(proposals).not.toMatch(/\baha \(/)
    expect(proposals).toMatch(/\burea \(1\)/)
    expect(proposals).toContain(product.slug)
  })

  test.each([
    { dose: '0.05', emitted: false },
    { dose: '5', emitted: true },
  ])('uses the stored $dose percent dose for cap marginal AHA', async ({ dose, emitted }) => {
    const user = await createTestUser()
    const product = await createAutoTagProduct(user.id, {
      name: 'Purifying cleanser',
      kind: 'cleanser',
      inci: cleanserFormula,
    })
    const ingredient = await createTestIngredient(user.id, { name: 'Lactic Acid' })
    await testDb.insert(productIngredients).values({
      productId: product.id,
      ingredientId: ingredient.id,
      concentrationValue: dose,
      concentrationUnit: '%',
    })
    const before = await testDb.select().from(productIngredients)

    const proposals = runAudit()

    expect(/\baha \(1\)/.test(proposals)).toBe(emitted)
    expect(await testDb.select().from(productIngredients)).toEqual(before)
  })
})

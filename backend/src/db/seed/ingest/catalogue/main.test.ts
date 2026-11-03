import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'

import { type CreateProductInput, isDisplayedProductTag } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { previewProductFormula } from '../../../../features/products/formula-preview.service'
import { updateProduct } from '../../../../features/products/service'
import { testDb } from '../../../../tests/db.test.config'
import { setupDbTests } from '../../../../tests/db-setup'
import { COMPLEMENT, SKINCARE } from '../../../../tests/helpers/product-shapes'
import {
  createTestAdminUser,
  createTestIngredient,
  createTestProduct,
} from '../../../../tests/helpers/test-factories'
import {
  ingredients,
  productIngredients,
  products,
  productTagLinks,
  productTagTypes,
} from '../../../schema'
import { productTagData } from '../../data/tags'
import { computeLinks } from '../../inci/link-ingredients/main'

setupDbTests()

const runner = new URL('./main.ts', import.meta.url).pathname

describe('catalogue ingest INCI preservation', () => {
  it('retains truncation evidence through historical cleanup and later tag recalculation', async () => {
    await testDb.insert(productTagTypes).values(productTagData)
    const owner = await createTestAdminUser()
    const lot = [',', ';', '...'].map(
      (tail, index) =>
        ({
          ...SKINCARE,
          brand: 'Lab',
          name: `Damaged Cleanup Serum ${index}`,
          inci: `Aqua\nNiacinamide\nGlycerin\nPanthenol${tail}`,
        }) satisfies CreateProductInput
    )
    const directory = mkdtempSync(join(tmpdir(), 'aurore-ingest-cleanup-damage-'))
    const cleanupRunner = new URL('../../inci/cleanup/clean-inci.ts', import.meta.url).pathname
    try {
      const lotPath = join(directory, 'lot.jsonl')
      writeFileSync(lotPath, lot.map((entry) => JSON.stringify(entry)).join('\n'))
      const ingested = Bun.spawnSync([process.execPath, runner, lotPath, '--write'], {
        cwd: directory,
        env: { ...process.env, SEED_OWNER_EMAIL: owner.email },
        timeout: 10_000,
      })
      expect({ exitCode: ingested.exitCode, stderr: ingested.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      const read = () => testDb.select().from(products).orderBy(products.name)
      const expected = lot.map(({ name, inci }) => ({ name, inci }))
      const before = await read()
      expect(before.map(({ name, inci }) => ({ name, inci }))).toEqual(expected)
      const tagsBefore = await testDb
        .select()
        .from(productTagLinks)
        .orderBy(productTagLinks.productId, productTagLinks.productTagId)
      const reports: string[] = []
      for (const args of [[], ['--apply'], ['--apply']]) {
        const cleaned = Bun.spawnSync([process.execPath, cleanupRunner, ...args], {
          cwd: directory,
          env: process.env,
          timeout: 10_000,
        })
        expect({ exitCode: cleaned.exitCode, stderr: cleaned.stderr.toString() }).toEqual({
          exitCode: 0,
          stderr: '',
        })
        expect(await read()).toEqual(before)
        reports.push(cleaned.stdout.toString())
      }
      for (const report of reports) expect(report).toContain('Skipped damage evidence loss: 3')
      expect(
        await testDb
          .select()
          .from(productTagLinks)
          .orderBy(productTagLinks.productId, productTagLinks.productTagId)
      ).toEqual(tagsBefore)
      const readTags = (productId: string) =>
        testDb
          .select({ slug: productTagTypes.slug })
          .from(productTagLinks)
          .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
          .where(eq(productTagLinks.productId, productId))
      for (const product of await read()) {
        await testDb.transaction((tx) =>
          updateProduct(owner.id, product.id, { inci: product.inci }, tx)
        )
        const tags = (await readTags(product.id)).map((tag) => tag.slug)
        expect(tags).toContain('type-serum')
        expect(tags).not.toContain('sans-parfum')
        expect(tags).not.toContain('sans-huiles-essentielles')
      }
      const reference = before[0]
      if (!reference) throw new Error('Damaged reference not ingested')
      const repaired = await testDb.transaction((tx) =>
        updateProduct(
          owner.id,
          reference.id,
          { inci: 'Aqua\nNiacinamide\nGlycerin\nPanthenol' },
          tx
        )
      )
      expect(repaired.inci).toBe('Aqua, Niacinamide, Glycerin, Panthenol')
      expect((await readTags(reference.id)).map((tag) => tag.slug)).toContain('sans-parfum')
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

  it('keeps ambiguous line boundaries unlinked until an explicit compound declaration', async () => {
    await testDb.insert(productTagTypes).values(productTagData)
    const owner = await createTestAdminUser()
    for (const [name, slug] of [
      ['Arginine PCA', 'arginine-pca'],
      ['Niacinamide', 'niacinamide'],
    ]) {
      const ingredient = await createTestIngredient(owner.id, { name, slug }, 'admin')
      await testDb
        .update(ingredients)
        .set({ canonicalKey: name })
        .where(eq(ingredients.id, ingredient.id))
    }
    const raw = 'Aqua, Arginine\nPCA, Niacinamide'
    const lot = [{ ...SKINCARE, brand: 'Lab', name: 'Ambiguous Link Serum', inci: raw }]
    const directory = mkdtempSync(join(tmpdir(), 'aurore-ingest-line-link-'))
    const linkRunner = new URL('../../inci/link-ingredients/main.ts', import.meta.url).pathname
    try {
      const lotPath = join(directory, 'lot.jsonl')
      writeFileSync(lotPath, lot.map((entry) => JSON.stringify(entry)).join('\n'))
      const ingested = Bun.spawnSync([process.execPath, runner, lotPath, '--write'], {
        cwd: directory,
        env: { ...process.env, SEED_OWNER_EMAIL: owner.email },
        timeout: 10_000,
      })
      expect({ exitCode: ingested.exitCode, stderr: ingested.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      const [product] = await testDb.select().from(products)
      if (!product) throw new Error('Ambiguous line product not ingested')
      expect(product.inci).toBe(raw)
      const runLinker = () => {
        const result = Bun.spawnSync(
          [process.execPath, linkRunner, '--write', '--relink', '--slug', product.slug],
          {
            cwd: directory,
            env: process.env,
            timeout: 10_000,
          }
        )
        expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
          exitCode: 0,
          stderr: '',
        })
        return result.stdout.toString()
      }
      const readLinks = () =>
        testDb
          .select({ slug: ingredients.slug, source: productIngredients.source })
          .from(productIngredients)
          .innerJoin(ingredients, eq(productIngredients.ingredientId, ingredients.id))
          .where(eq(productIngredients.productId, product.id))
          .orderBy(ingredients.slug)
      const report = runLinker()
      expect(await readLinks()).toEqual([{ slug: 'niacinamide', source: 'linker' }])
      expect(report).toContain('Unresolved line boundaries')
      await testDb.transaction((tx) =>
        updateProduct(owner.id, product.id, { inci: 'Aqua, Arginine PCA, Niacinamide' }, tx)
      )
      runLinker()
      expect(await readLinks()).toEqual([
        { slug: 'arginine-pca', source: 'linker' },
        { slug: 'niacinamide', source: 'linker' },
      ])
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

  it('keeps optional pigments unlinked after ingest and links them after explicit declaration', async () => {
    await testDb.insert(productTagTypes).values(productTagData)
    const owner = await createTestAdminUser()
    const niacinamide = await createTestIngredient(
      owner.id,
      { name: 'Niacinamide', slug: 'niacinamide' },
      'admin'
    )
    const red = await createTestIngredient(
      owner.id,
      { name: 'CI 77491', slug: 'oxide-de-fer' },
      'admin'
    )
    await testDb
      .update(ingredients)
      .set({ canonicalKey: 'Niacinamide' })
      .where(eq(ingredients.id, niacinamide.id))
    await testDb
      .update(ingredients)
      .set({ canonicalKey: 'CI 77491' })
      .where(eq(ingredients.id, red.id))
    const raw = 'Aqua, Niacinamide, [+/- CI 77491]'
    const lot = [{ ...SKINCARE, brand: 'Lab', name: 'Optional Link Serum', inci: raw }]
    const directory = mkdtempSync(join(tmpdir(), 'aurore-ingest-optional-link-'))
    const linkRunner = new URL('../../inci/link-ingredients/main.ts', import.meta.url).pathname
    try {
      const lotPath = join(directory, 'lot.jsonl')
      writeFileSync(lotPath, lot.map((entry) => JSON.stringify(entry)).join('\n'))
      const ingested = Bun.spawnSync([process.execPath, runner, lotPath, '--write'], {
        cwd: directory,
        env: { ...process.env, SEED_OWNER_EMAIL: owner.email },
        timeout: 10_000,
      })
      expect({ exitCode: ingested.exitCode, stderr: ingested.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      const [product] = await testDb.select().from(products)
      if (!product) throw new Error('Optional pigment product not ingested')
      expect(product.inci).toBe(raw)
      const runLinker = () => {
        const result = Bun.spawnSync(
          [process.execPath, linkRunner, '--write', '--relink', '--slug', product.slug],
          {
            cwd: directory,
            env: process.env,
            timeout: 10_000,
          }
        )
        expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
          exitCode: 0,
          stderr: '',
        })
      }
      const readLinks = () =>
        testDb
          .select({ slug: ingredients.slug, source: productIngredients.source })
          .from(productIngredients)
          .innerJoin(ingredients, eq(productIngredients.ingredientId, ingredients.id))
          .where(eq(productIngredients.productId, product.id))
          .orderBy(ingredients.slug)
      runLinker()
      expect(await readLinks()).toEqual([{ slug: 'niacinamide', source: 'linker' }])
      await testDb.transaction((tx) =>
        updateProduct(owner.id, product.id, { inci: 'Aqua, Niacinamide, CI 77491' }, tx)
      )
      runLinker()
      expect(await readLinks()).toEqual([
        { slug: 'niacinamide', source: 'linker' },
        { slug: 'oxide-de-fer', source: 'linker' },
      ])
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

  it('preserves botanical water and its texture tags through footnotes and annotations', async () => {
    await testDb.insert(productTagTypes).values(productTagData)
    const owner = await createTestAdminUser()
    const lot = ['', '†', '* (organic)'].map(
      (suffix, index) =>
        ({
          ...SKINCARE,
          brand: 'Lab',
          name: `Water Note Serum ${index}`,
          inci: `Oryza Sativa (Rice) Bran Water${suffix}, 1,2-Hexanediol, Oryza Sativa Extract, Glycerin`,
        }) satisfies CreateProductInput
    )
    const directory = mkdtempSync(join(tmpdir(), 'aurore-ingest-water-notes-'))
    try {
      const lotPath = join(directory, 'lot.jsonl')
      writeFileSync(lotPath, lot.map((entry) => JSON.stringify(entry)).join('\n'))
      const result = Bun.spawnSync([process.execPath, runner, lotPath, '--write'], {
        cwd: directory,
        env: { ...process.env, SEED_OWNER_EMAIL: owner.email },
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      const stored = await testDb.select().from(products).orderBy(products.name)
      expect(stored).toHaveLength(lot.length)
      for (const [index, product] of stored.entries()) {
        const tags = await testDb
          .select({ slug: productTagTypes.slug })
          .from(productTagLinks)
          .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
          .where(eq(productTagLinks.productId, product.id))
        expect(tags.map((tag) => tag.slug)).toContain('texture-legere')
        expect(product.inci).toBe(lot[index]?.inci)
      }
      const product = stored[0]
      if (!product) throw new Error('Water reference not ingested')
      const edited =
        'Oryza Sativa (Rice) Bran Water‡, 1,2-Hexanediol, Oryza Sativa Extract, Glycerin'
      const updated = await testDb.transaction((tx) =>
        updateProduct(owner.id, product.id, { inci: edited }, tx)
      )
      expect(updated.inci).toBe(edited)
      const tags = await testDb
        .select({ slug: productTagTypes.slug })
        .from(productTagLinks)
        .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
        .where(eq(productTagLinks.productId, product.id))
      expect(tags.map((tag) => tag.slug)).toContain('texture-legere')
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

  it('treats HTML whitespace as formatting while retaining a real trailing separator', async () => {
    await testDb.insert(productTagTypes).values(productTagData)
    const owner = await createTestAdminUser()
    const canonical = 'Aqua, Niacinamide, Glycerin, Panthenol'
    const lot = [
      { name: 'Entity Tail Serum 0', inci: canonical },
      { name: 'Entity Tail Serum 1', inci: `${canonical}&nbsp;` },
      { name: 'Entity Tail Serum 2', inci: `${canonical},&nbsp;` },
    ].map((entry) => ({ ...SKINCARE, brand: 'Lab', ...entry }) satisfies CreateProductInput)
    const directory = mkdtempSync(join(tmpdir(), 'aurore-ingest-html-tail-'))
    try {
      const lotPath = join(directory, 'lot.jsonl')
      writeFileSync(lotPath, lot.map((entry) => JSON.stringify(entry)).join('\n'))
      const result = Bun.spawnSync([process.execPath, runner, lotPath, '--write'], {
        cwd: directory,
        env: { ...process.env, SEED_OWNER_EMAIL: owner.email },
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      const stored = await testDb.select().from(products).orderBy(products.name)
      const [plain, encoded, truncated] = stored
      if (!plain || !encoded || !truncated) throw new Error('Entity tail lot not ingested')
      const readTags = (productId: string) =>
        testDb
          .select({
            slug: productTagTypes.slug,
            relevance: productTagLinks.relevance,
            source: productTagLinks.source,
          })
          .from(productTagLinks)
          .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
          .where(eq(productTagLinks.productId, productId))
          .orderBy(productTagTypes.slug)
      const reference = await readTags(plain.id)
      expect(reference.map((tag) => tag.slug)).toContain('sans-parfum')
      expect(await readTags(encoded.id)).toEqual(reference)
      expect(encoded.inci).toBe(canonical)
      expect(truncated.inci).toBe(`${canonical},&nbsp;`)
      expect((await readTags(truncated.id)).map((tag) => tag.slug)).not.toContain('sans-parfum')
      const updated = await testDb.transaction((tx) =>
        updateProduct(owner.id, truncated.id, { inci: `${canonical}&nbsp;` }, tx)
      )
      expect(updated.inci).toBe(canonical)
      expect(await readTags(updated.id)).toEqual(reference)
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

  it('retains unresolved line boundaries when historical cleanup follows ingest', async () => {
    await testDb.insert(productTagTypes).values(productTagData)
    const owner = await createTestAdminUser()
    const lot = [
      { name: 'Ambiguous Cleanup Serum', inci: 'Aqua, Glycerin, Arginine\nPCA, Panthenol' },
      {
        name: 'Unknown Cleanup Serum',
        inci: 'Aqua, Glycerin, Fictus Plantus Extract\nNiacinamide, Panthenol',
      },
    ].map((entry) => ({ ...SKINCARE, brand: 'Lab', ...entry }) satisfies CreateProductInput)
    const directory = mkdtempSync(join(tmpdir(), 'aurore-ingest-cleanup-'))
    const cleanupRunner = new URL('../../inci/cleanup/clean-inci.ts', import.meta.url).pathname
    try {
      const lotPath = join(directory, 'lot.jsonl')
      writeFileSync(lotPath, lot.map((entry) => JSON.stringify(entry)).join('\n'))
      const ingested = Bun.spawnSync([process.execPath, runner, lotPath, '--write'], {
        cwd: directory,
        env: { ...process.env, SEED_OWNER_EMAIL: owner.email },
        timeout: 10_000,
      })
      expect({ exitCode: ingested.exitCode, stderr: ingested.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      const expected = lot.map(({ name, inci }) => ({ name, inci }))
      const before = await testDb
        .select({ name: products.name, inci: products.inci })
        .from(products)
        .orderBy(products.name)
      expect(before).toEqual(expected)
      const tagsBefore = await testDb
        .select()
        .from(productTagLinks)
        .orderBy(productTagLinks.productId, productTagLinks.productTagId)

      for (const args of [[], ['--apply']]) {
        const cleaned = Bun.spawnSync([process.execPath, cleanupRunner, ...args], {
          cwd: directory,
          env: process.env,
          timeout: 10_000,
        })
        expect({ exitCode: cleaned.exitCode, stderr: cleaned.stderr.toString() }).toEqual({
          exitCode: 0,
          stderr: '',
        })
        expect(cleaned.stdout.toString()).toContain('Skipped unresolved line boundaries: 2')
        expect(cleaned.stdout.toString()).toContain(
          `${args.length ? 'Updated' : 'Would update'} 0 rows.`
        )
        expect(
          await testDb
            .select({ name: products.name, inci: products.inci })
            .from(products)
            .orderBy(products.name)
        ).toEqual(expected)
      }
      expect(
        await testDb
          .select()
          .from(productTagLinks)
          .orderBy(productTagLinks.productId, productTagLinks.productTagId)
      ).toEqual(tagsBefore)
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

  it('repairs uniquely readable historical lines while keeping cleaner spelling and token limits', async () => {
    await testDb.insert(productTagTypes).values(productTagData)
    const owner = await createTestAdminUser()
    const cases = [
      {
        raw: 'Aqua, Glycerin, Niacinamide\nPanthenol',
        expected: 'Aqua, Glycerin, Niacinamide, Panthenol',
      },
      {
        raw: 'Aqua, Glycerin, Sodium\r\nHyaluronate, Panthenol',
        expected: 'Aqua, Glycerin, Sodium Hyaluronate, Panthenol',
      },
      {
        raw: 'INGREDIENTS: Water | Glycerin | Panthenol',
        expected: 'Water, Glycerin, Panthenol',
      },
      {
        raw: 'INGREDIENTS: Water | Glycerin | Panthenol,',
        expected: 'Water, Glycerin, Panthenol,',
      },
      { raw: 'INGREDIENTS: Water | Glycerin', expected: 'INGREDIENTS: Water | Glycerin' },
    ]
    for (const [index, entry] of cases.entries()) {
      const product = await createTestProduct(owner.id, {
        name: `Historical Cleanup Serum ${index}`,
      })
      await testDb.update(products).set({ inci: entry.raw }).where(eq(products.id, product.id))
    }
    const cleanupRunner = new URL('../../inci/cleanup/clean-inci.ts', import.meta.url).pathname
    const read = () =>
      testDb
        .select({ name: products.name, inci: products.inci })
        .from(products)
        .orderBy(products.name)
    const expected = cases.map((entry, index) => ({
      name: `Historical Cleanup Serum ${index}`,
      inci: entry.expected,
    }))
    for (const args of [[], ['--apply'], ['--apply']]) {
      const result = Bun.spawnSync([process.execPath, cleanupRunner, ...args], {
        env: process.env,
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      expect(await read()).toEqual(
        args.length
          ? expected
          : cases.map((entry, index) => ({
              name: `Historical Cleanup Serum ${index}`,
              inci: entry.raw,
            }))
      )
    }
  })

  it('retains order, optional pigments and botanical water while recognizing canonical butter', async () => {
    await testDb.insert(productTagTypes).values(productTagData)
    const owner = await createTestAdminUser()
    const alphabetical =
      'Alanine, Arginine, Betaine, BLUE NO. 1 (CI 42090), Butylene Glycol, Caffeine, Carbomer, Ceramide NP, Citric Acid, Glycerin, Panthenol, Propanediol, Lactic Acid, Salicylic Acid'
    const optional = 'Aqua, Glycerin, Niacinamide, [+/- MICA, CI 77491, CI 77499]'
    const water = 'Oryza Sativa (Rice) Bran Water, 1,2-Hexanediol, Oryza Sativa Extract, Glycerin'
    const lot = [
      { name: 'Alphabetical Serum', inci: alphabetical },
      { name: 'Optional Serum', inci: optional },
      { name: 'Botanical Water Serum', inci: water },
      {
        name: 'Canonical Butter Serum',
        inci: 'Aqua, Glycerin, Butyrospermum Parkii Butter, Panthenol',
      },
      {
        name: 'Alias Butter Serum',
        inci: 'Aqua, Glycerin, BUTYROSPERMUM PARKII BUTTER/SHEA BUTTER, Panthenol',
      },
    ].map((entry) => ({ ...SKINCARE, ...entry, brand: 'Lab' }) satisfies CreateProductInput)
    const directory = mkdtempSync(join(tmpdir(), 'aurore-ingest-tag-semantics-'))
    try {
      const lotPath = join(directory, 'lot.jsonl')
      writeFileSync(lotPath, lot.map((entry) => JSON.stringify(entry)).join('\n'))
      const result = Bun.spawnSync([process.execPath, runner, lotPath, '--write'], {
        cwd: directory,
        env: { ...process.env, SEED_OWNER_EMAIL: owner.email },
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      const stored = await testDb.select().from(products)
      const tagged = await testDb
        .select({ productId: productTagLinks.productId, slug: productTagTypes.slug })
        .from(productTagLinks)
        .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
      const product = (name: string) => {
        const row = stored.find((entry) => entry.name === name)
        if (!row) throw new Error(`Product not ingested: ${name}`)
        return row
      }
      const tagsFor = (name: string) =>
        tagged.filter((tag) => tag.productId === product(name).id).map((tag) => tag.slug)
      // Canonical alias spelling must not erase the evidence read by downstream passes
      expect(product('Alphabetical Serum').inci).toBe(alphabetical)
      expect(tagsFor('Alphabetical Serum')).toEqual(expect.arrayContaining(['aha', 'bha']))
      expect(product('Optional Serum').inci).toBe(optional)
      expect(product('Botanical Water Serum').inci).toBe(water)
      expect(tagsFor('Botanical Water Serum')).toContain('texture-legere')
      for (const name of ['Canonical Butter Serum', 'Alias Butter Serum']) {
        expect(tagsFor(name)).toEqual(expect.arrayContaining(['occlusif', 'step-occlusif']))
        expect(tagsFor(name)).not.toContain('semi-occlusif')
      }
      const updated = await testDb.transaction((tx) =>
        updateProduct(owner.id, product('Alphabetical Serum').id, { inci: alphabetical }, tx)
      )
      expect(updated.inci).toBe(alphabetical)
      const updatedTags = await testDb
        .select({ slug: productTagTypes.slug })
        .from(productTagLinks)
        .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
        .where(eq(productTagLinks.productId, updated.id))
      expect(updatedTags.map((tag) => tag.slug)).toEqual(expect.arrayContaining(['aha', 'bha']))
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

  it('keeps declared percentages recognizable while excluding non-discriminant jojoba aliases', async () => {
    await testDb.insert(productTagTypes).values(productTagData)
    const owner = await createTestAdminUser()
    const declaredInci = 'Aqua, phospholipides (issus du tournesol) 13 %, Niacinamide'
    const lot = [
      { ...COMPLEMENT, name: 'Declared Percent', inci: declaredInci },
      { ...SKINCARE, name: 'Alias Serum', inci: 'Aqua, Hydrolyzed Jojoba Esters, Niacinamide' },
      { ...SKINCARE, name: 'Canonical Serum', inci: 'Aqua, Jojoba Esters, Niacinamide' },
    ].map((entry) => ({ ...entry, brand: 'Lab' }) satisfies CreateProductInput)
    const directory = mkdtempSync(join(tmpdir(), 'aurore-ingest-declared-percent-'))
    try {
      const lotPath = join(directory, 'lot.jsonl')
      writeFileSync(lotPath, lot.map((entry) => JSON.stringify(entry)).join('\n'))
      // Erasing the percent sign makes the following linker treat 13 as part of the name
      const result = Bun.spawnSync([process.execPath, runner, lotPath, '--write'], {
        cwd: directory,
        env: { ...process.env, SEED_OWNER_EMAIL: owner.email },
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      const stored = await testDb.select().from(products).orderBy(products.name)
      const declared = stored.find((product) => product.name === 'Declared Percent')
      if (!declared?.inci) throw new Error('Declared product not ingested')
      expect(declared.inci).toBe(declaredInci)
      expect(computeLinks(declared.inci, declared.category, new Map(), new Map()).slugs).toEqual([
        'phospholipids-hair',
        'niacinamide',
      ])
      for (const product of stored.filter((row) => row.name.endsWith('Serum'))) {
        if (!product.inci) throw new Error('Serum not ingested')
        expect(computeLinks(product.inci, product.category, new Map(), new Map()).slugs).toEqual([
          'niacinamide',
        ])
      }
      expect(
        computeLinks(
          'Aqua, Hydrolyzed Jojoba Esters, Niacinamide',
          'skincare',
          new Map(),
          new Map()
        ).slugs
      ).toEqual(['niacinamide'])
      const updated = await testDb.transaction((tx) =>
        updateProduct(
          owner.id,
          declared.id,
          { inci: 'Aqua, phospholipides (issus de tournesol) 13 %, Glycerin' },
          tx
        )
      )
      expect(updated.inci).toBe('Aqua, phospholipides (issus de tournesol) 13 %, Glycerin')
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

  it('ingests newline lists while retaining compound names and unresolved boundaries', async () => {
    await testDb.insert(productTagTypes).values(productTagData)
    const owner = await createTestAdminUser()
    const canonical =
      'Aqua, Niacinamide, Sodium Hyaluronate, Camellia Sinensis Leaf Extract, Glycerin, Panthenol'
    const labels = [
      'Aqua',
      'Niacinamide',
      'Sodium Hyaluronate',
      'Camellia Sinensis Leaf Extract',
      'Glycerin',
      'Panthenol',
    ]
    const ambiguous = 'Aqua\nArginine\nPCA\nGlycerin'
    const unknown = 'Aqua\nFictus Plantus Extract\nGlycerin'
    const lot = [
      { name: 'Line Serum 0', inci: canonical },
      { name: 'Line Serum 1', inci: labels.join('\n') },
      { name: 'Line Serum 2', inci: labels.join('\r\n') },
      {
        name: 'Line Serum 3',
        inci: 'Aqua\nNiacinamide\nSodium\nHyaluronate\nCamellia Sinensis\nLeaf Extract\nGlycerin\nPanthenol',
      },
      { name: 'Ambiguous Serum', inci: ambiguous },
      { name: 'Unknown Serum', inci: unknown },
    ].map((entry) => ({ ...SKINCARE, brand: 'Lab', ...entry }) satisfies CreateProductInput)
    const directory = mkdtempSync(join(tmpdir(), 'aurore-ingest-lines-'))
    try {
      const lotPath = join(directory, 'lot.jsonl')
      writeFileSync(lotPath, lot.map((entry) => JSON.stringify(entry)).join('\n'))
      // A successful CLI exit must not hide line boundaries erased before storage
      const result = Bun.spawnSync([process.execPath, runner, lotPath, '--write'], {
        cwd: directory,
        env: { ...process.env, SEED_OWNER_EMAIL: owner.email },
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      const stored = await testDb.select().from(products).orderBy(products.name)
      expect(stored.map(({ name, inci }) => ({ name, inci }))).toEqual([
        { name: 'Ambiguous Serum', inci: ambiguous },
        ...[0, 1, 2, 3].map((index) => ({ name: `Line Serum ${index}`, inci: canonical })),
        { name: 'Unknown Serum', inci: unknown },
      ])
      const tags = await testDb
        .select({
          productId: productTagLinks.productId,
          slug: productTagTypes.slug,
          relevance: productTagLinks.relevance,
          source: productTagLinks.source,
        })
        .from(productTagLinks)
        .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
        .orderBy(productTagTypes.slug)
      const tagsFor = (productId: string) =>
        tags.filter((tag) => tag.productId === productId).map(({ productId: _, ...tag }) => tag)
      const variants = stored.filter((product) => product.name.startsWith('Line Serum'))
      const reference = variants[0]
      if (!reference) throw new Error('Reference product not ingested')
      const referenceTags = tagsFor(reference.id)
      expect(referenceTags).toContainEqual({
        slug: 'type-serum',
        relevance: 'primary',
        source: 'kind',
      })
      for (const product of variants) {
        expect(tagsFor(product.id)).toEqual(referenceTags)
        const source = lot.find((entry) => entry.name === product.name)
        if (!source?.inci) throw new Error('Source lot entry missing')
        const preview = await testDb.transaction((tx) =>
          previewProductFormula(
            {
              inci: source.inci,
              category: source.category,
              kind: source.kind,
              name: source.name,
              brand: source.brand,
            },
            tx
          )
        )
        expect(
          preview.suggestedTags
            .map(({ tagSlug, ...tag }) => ({ slug: tagSlug, ...tag }))
            .sort((a, b) => a.slug.localeCompare(b.slug))
        ).toEqual(referenceTags.filter((tag) => isDisplayedProductTag(tag.slug, tag.relevance)))
      }
      const updated = await testDb.transaction((tx) =>
        updateProduct(owner.id, reference.id, { inci: 'Aqua\nSodium\nHyaluronate\nGlycerin' }, tx)
      )
      expect(updated.inci).toBe('Aqua, Sodium Hyaluronate, Glycerin')
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

  it('stores equivalent separator variants with the same automatic tags', async () => {
    await testDb.insert(productTagTypes).values(productTagData)
    const owner = await createTestAdminUser()
    const canonical = 'Aqua, Niacinamide, Glycerin, Dimethicone, Panthenol, Parfum'
    const lot = [', ', '; ', ';', ' - ', ' • '].map(
      (separator, index) =>
        ({
          ...SKINCARE,
          brand: 'Lab',
          name: `Separator Serum ${index}`,
          inci: ['Aqua', 'Niacinamide', 'Glycerin', 'Dimethicone', 'Panthenol', 'Parfum'].join(
            separator
          ),
        }) satisfies CreateProductInput
    )
    lot.push({
      ...SKINCARE,
      brand: 'Lab',
      name: 'Qualified Serum',
      inci: 'Water; Titanium Dioxide (CI 77891) [nano]; Aroma; Glycerin',
    })
    const directory = mkdtempSync(join(tmpdir(), 'aurore-ingest-separators-'))
    try {
      const lotPath = join(directory, 'lot.jsonl')
      writeFileSync(lotPath, lot.map((entry) => JSON.stringify(entry)).join('\n'))
      // The linker already handles these separators; intake must not tag a welded token
      const result = Bun.spawnSync([process.execPath, runner, lotPath, '--write'], {
        cwd: directory,
        env: { ...process.env, SEED_OWNER_EMAIL: owner.email },
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })
      const stored = await testDb.select().from(products).orderBy(products.name)
      expect(stored.map(({ name, inci }) => ({ name, inci }))).toEqual([
        {
          name: 'Qualified Serum',
          inci: 'Water, Titanium Dioxide (CI 77891) [nano], Aroma, Glycerin',
        },
        ...[0, 1, 2, 3, 4].map((index) => ({ name: `Separator Serum ${index}`, inci: canonical })),
      ])
      const tags = await testDb
        .select({
          productId: productTagLinks.productId,
          slug: productTagTypes.slug,
          relevance: productTagLinks.relevance,
          source: productTagLinks.source,
        })
        .from(productTagLinks)
        .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
        .orderBy(productTagTypes.slug)
      const tagsFor = (productId: string) =>
        tags.filter((tag) => tag.productId === productId).map(({ productId: _, ...tag }) => tag)
      const variants = stored.filter((product) => product.name.startsWith('Separator Serum'))
      const reference = variants[0]
      if (!reference) throw new Error('Reference product not ingested')
      const referenceTags = tagsFor(reference.id)
      expect(referenceTags).toContainEqual({
        slug: 'type-serum',
        relevance: 'primary',
        source: 'kind',
      })
      expect(referenceTags.map((tag) => tag.slug)).not.toContain('sans-parfum')
      expect(referenceTags.map((tag) => tag.slug)).not.toContain('sans-silicones')
      for (const product of variants) {
        expect(tagsFor(product.id)).toEqual(referenceTags)
        const source = lot.find((entry) => entry.name === product.name)
        if (!source?.inci) throw new Error('Source lot entry missing')
        const preview = await testDb.transaction((tx) =>
          previewProductFormula(
            {
              inci: source.inci,
              category: source.category,
              kind: source.kind,
              name: source.name,
              brand: source.brand,
            },
            tx
          )
        )
        expect(preview.tokens.map((entry) => entry.canonicalKey)).toEqual([
          'Aqua',
          'Niacinamide',
          'Glycerin',
          'Dimethicone',
          'Panthenol',
          'Parfum',
        ])
        expect(
          preview.suggestedTags
            .map(({ tagSlug, ...tag }) => ({ slug: tagSlug, ...tag }))
            .sort((a, b) => a.slug.localeCompare(b.slug))
        ).toEqual(referenceTags.filter((tag) => isDisplayedProductTag(tag.slug, tag.relevance)))
      }
      const updated = await testDb.transaction((tx) =>
        updateProduct(
          owner.id,
          reference.id,
          { inci: 'Water; Panthenol; Niacinamide; Glycerin' },
          tx
        )
      )
      expect(updated.inci).toBe('Aqua, Panthenol, Niacinamide, Glycerin')
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

  it('stores nano declarations from a JSONL lot and preserves them on update', async () => {
    await testDb.insert(productTagTypes).values(productTagData)
    const owner = await createTestAdminUser()
    const lot = [
      { name: 'Nano Zinc', inci: 'Water, Zinc Oxide [nano], Glycerin' },
      { name: 'Nano Titanium', inci: 'Water, Titanium Dioxide (nano), Glycerin' },
      {
        name: 'Nano Organic Filter',
        inci: 'Water, Methylene Bis-Benzotriazolyl Tetramethylbutylphenol [nano], Glycerin',
      },
      { name: 'Plain Zinc', inci: 'Water, Zinc Oxide, Glycerin' },
    ].map((entry) => ({ ...SKINCARE, brand: 'Lab', ...entry }) satisfies CreateProductInput)
    const directory = mkdtempSync(join(tmpdir(), 'aurore-ingest-nano-'))

    try {
      const lotPath = join(directory, 'lot.jsonl')
      writeFileSync(lotPath, lot.map((entry) => JSON.stringify(entry)).join('\n'))
      // Run the real ingest so schema validation and automatic tagging precede the DB assertion
      const result = Bun.spawnSync([process.execPath, runner, lotPath, '--write'], {
        cwd: directory,
        env: { ...process.env, SEED_OWNER_EMAIL: owner.email },
        timeout: 10_000,
      })
      expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
        exitCode: 0,
        stderr: '',
      })

      const stored = await testDb
        .select({ name: products.name, inci: products.inci })
        .from(products)
        .orderBy(products.name)
      expect(stored).toEqual([
        {
          name: 'Nano Organic Filter',
          inci: 'Water, Methylene Bis-Benzotriazolyl Tetramethylbutylphenol [nano], Glycerin',
        },
        { name: 'Nano Titanium', inci: 'Water, Titanium Dioxide (nano), Glycerin' },
        { name: 'Nano Zinc', inci: 'Water, Zinc Oxide [nano], Glycerin' },
        { name: 'Plain Zinc', inci: 'Aqua, Zinc Oxide, Glycerin' },
      ])

      const [product] = await testDb.select().from(products).where(eq(products.name, 'Nano Zinc'))
      if (!product) throw new Error('Ingested product not found')
      const tags = await testDb
        .select({ slug: productTagTypes.slug, source: productTagLinks.source })
        .from(productTagLinks)
        .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
        .where(eq(productTagLinks.productId, product.id))
      expect(tags).toContainEqual({ slug: 'type-serum', source: 'kind' })
      const editedInci = 'Water, Zinc Oxide (nano), Glycerin, Niacinamide'
      await testDb.transaction((tx) =>
        updateProduct(owner.id, product.id, { inci: editedInci }, tx)
      )
      const [updated] = await testDb
        .select({ inci: products.inci })
        .from(products)
        .where(eq(products.id, product.id))
      expect(updated?.inci).toBe(editedInci)
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })
})

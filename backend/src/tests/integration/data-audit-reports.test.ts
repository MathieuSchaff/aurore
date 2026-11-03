import { describe, expect, it } from 'bun:test'

import { eq } from 'drizzle-orm'

import {
  articles,
  productIngredients,
  products,
  productTagLinks,
  productTagTypes,
} from '../../db/schema'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import {
  createTestAdminUser,
  createTestArticle,
  createTestIngredient,
  createTestProduct,
} from '../helpers/test-factories'

setupDbTests()

describe('data audit reports', () => {
  it.each([
    { hidden: false, source: 'algo-derm', expected: 1 },
    { hidden: true, source: 'algo-derm', expected: 1 },
    { hidden: false, source: 'manual', expected: 0 },
    { hidden: true, source: 'manual', expected: 0 },
  ])(
    'reports off-corpus tags for hidden=$hidden and source=$source',
    async ({ hidden, source, expected }) => {
      const owner = await createTestAdminUser()
      const product = await createTestProduct(owner.id, { name: 'Integrity Fixture' })
      await testDb
        .update(products)
        .set({
          category: 'haircare',
          kind: 'shampoo',
          moderationStatus: hidden ? 'hidden' : 'visible',
        })
        .where(eq(products.id, product.id))
      const [tag] = await testDb
        .insert(productTagTypes)
        .values({
          slug: 'integrity-fixture',
          label: 'Integrity Fixture',
          tagType: 'product_characteristic',
        })
        .returning()
      if (!tag) throw new Error('Integrity tag fixture missing')
      await testDb.insert(productTagLinks).values({
        productId: product.id,
        productTagId: tag.id,
        source,
      })
      const before = await testDb.select().from(products)
      const linksBefore = await testDb.select().from(productTagLinks)
      const runner = new URL('../../db/audit/audit-db.ts', import.meta.url).pathname
      const result = Bun.spawnSync([process.execPath, runner], {
        env: process.env,
        timeout: 10_000,
      })
      expect(result.stdout.toString()).toContain(
        expected
          ? 'auto-tags-outside-eligible-corpus (1 violations)'
          : '✓ auto-tags-outside-eligible-corpus'
      )
      expect(result.stdout.toString()).toContain('✓ tag-product-domain-consistency')
      if (hidden) expect(result.stdout.toString()).toContain('0 with empty INCI input and 0 links')
      expect(result.exitCode).toBe(expected)
      expect(await testDb.select().from(products)).toEqual(before)
      expect(await testDb.select().from(productTagLinks)).toEqual(linksBefore)
    }
  )

  it.each([false, true])('reports domain violations when hidden=%s', async (hidden) => {
    const owner = await createTestAdminUser()
    const product = await createTestProduct(owner.id, { name: 'Domain Integrity Fixture' })
    if (hidden)
      await testDb
        .update(products)
        .set({ moderationStatus: 'hidden' })
        .where(eq(products.id, product.id))
    const [tag] = await testDb
      .insert(productTagTypes)
      .values({
        slug: 'domain-fixture',
        label: 'Domain Fixture',
        tagType: 'invalid-domain',
      })
      .returning()
    if (!tag) throw new Error('Domain tag fixture missing')
    await testDb
      .insert(productTagLinks)
      .values({ productId: product.id, productTagId: tag.id, source: 'manual' })
    const before = await testDb.select().from(products)
    const linksBefore = await testDb.select().from(productTagLinks)
    const runner = new URL('../../db/audit/audit-db.ts', import.meta.url).pathname
    const result = Bun.spawnSync([process.execPath, runner], { env: process.env, timeout: 10_000 })
    expect(result.stdout.toString()).toContain('tag-product-domain-consistency (1 violations)')
    expect(result.stdout.toString()).toContain('✓ auto-tags-outside-eligible-corpus')
    expect(result.exitCode).toBe(1)
    expect(await testDb.select().from(products)).toEqual(before)
    expect(await testDb.select().from(productTagLinks)).toEqual(linksBefore)
  })

  it.each(
    ['0', '1'].flatMap((write) => [
      { write, content: '<script>alert(1)</script>', excerpt: null, expected: 1 },
      { write, content: '<p>Safe article</p>', excerpt: null, expected: 0 },
      { write, content: '<p>Safe article</p>', excerpt: 'https://example.test', expected: 0 },
    ])
  )(
    'reports security status with WRITE=$write and content=$content and excerpt=$excerpt',
    async ({ write, content, excerpt, expected }) => {
      const owner = await createTestAdminUser()
      const article = await createTestArticle(owner.id, { title: 'Manual Security Fixture' })
      await testDb.update(articles).set({ content, excerpt }).where(eq(articles.id, article.id))
      const before = await testDb.select().from(articles)
      const runner = new URL('../../db/audit/audit-security.ts', import.meta.url).pathname
      const result = Bun.spawnSync([process.execPath, runner], {
        env: { ...process.env, WRITE: write, CSV_OUT: '' },
        timeout: 10_000,
      })
      expect(result.stdout.toString()).toContain(
        expected ? 'article-content (1 finding(s))' : '✓ article-content'
      )
      if (excerpt)
        expect(result.stdout.toString()).toContain('embedded-urls-in-text (LOW) (1 finding(s))')
      expect(result.exitCode).toBe(expected)
      expect(await testDb.select().from(articles)).toEqual(before)
    }
  )

  it('counts hidden catalogue products in both coverage numerators and denominators', async () => {
    const owner = await createTestAdminUser()
    const ingredient = await createTestIngredient(owner.id, { name: 'Report Ingredient Fixture' })
    const [tag] = await testDb
      .insert(productTagTypes)
      .values({
        slug: 'report-fixture',
        label: 'Report Fixture',
        tagType: 'test',
      })
      .returning()
    if (!tag) throw new Error('Report tag fixture missing')
    for (const [name, hidden] of [
      ['Visible Report Fixture', false],
      ['Hidden Report Fixture', true],
    ] as const) {
      const product = await createTestProduct(owner.id, { name })
      if (hidden)
        await testDb
          .update(products)
          .set({ moderationStatus: 'hidden' })
          .where(eq(products.id, product.id))
      await testDb
        .insert(productIngredients)
        .values({ productId: product.id, ingredientId: ingredient.id, source: 'manual' })
      await testDb
        .insert(productTagLinks)
        .values({ productId: product.id, productTagId: tag.id, source: 'manual' })
    }
    const before = await testDb.select().from(products).orderBy(products.name)
    const runner = new URL('../../db/audit/stats-db.ts', import.meta.url).pathname
    const result = Bun.spawnSync([process.execPath, runner], { env: process.env, timeout: 10_000 })
    expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
      exitCode: 0,
      stderr: '',
    })
    const report =
      result.stdout.toString().split('── Products')[1]?.split('── Ingredients')[0] ?? ''
    expect(report).toMatch(/total\.+ 2(?:\r?\n)/)
    expect(report).toMatch(/with ingredients\.+ 2 \/ 2(?:\r?\n)/)
    expect(report).toMatch(/with tags\.+ 2 \/ 2(?:\r?\n)/)
    expect(await testDb.select().from(products).orderBy(products.name)).toEqual(before)
  })

  it.each([
    { label: 'no format', formats: 0, visible: 1, expected: '✓ product-type-axis-leak' },
    { label: 'one format', formats: 1, visible: 1, expected: 'sur 1 produit' },
    { label: 'two formats', formats: 2, visible: 1, expected: 'sur 1 produit' },
    { label: 'two products and two formats', formats: 2, visible: 2, expected: 'sur 2 produits' },
  ])('reports distinct products for $label', async ({ formats, visible, expected }) => {
    const owner = await createTestAdminUser()
    const tags = await testDb
      .insert(productTagTypes)
      .values([
        { slug: 'type-exfoliation', label: 'Exfoliation Fixture', tagType: 'product_type_v2' },
        { slug: 'format-one', label: 'Format One Fixture', tagType: 'product_type_v2' },
        { slug: 'format-two', label: 'Format Two Fixture', tagType: 'product_type_v2' },
      ])
      .returning()
    for (let index = 0; index <= visible; index++) {
      const product = await createTestProduct(owner.id, { name: `Axis Fixture ${index}` })
      if (index === visible) {
        await testDb
          .update(products)
          .set({ moderationStatus: 'hidden' })
          .where(eq(products.id, product.id))
      }
      for (const tag of tags.filter(
        (entry) =>
          entry.slug === 'type-exfoliation' ||
          (entry.slug === 'format-one' && formats >= 1) ||
          (entry.slug === 'format-two' && formats === 2)
      )) {
        await testDb
          .insert(productTagLinks)
          .values({ productId: product.id, productTagId: tag.id, source: 'manual' })
      }
    }
    const before = await testDb
      .select()
      .from(productTagLinks)
      .orderBy(productTagLinks.productId, productTagLinks.productTagId)
    const runner = new URL('../../db/audit/audit-taxonomy.ts', import.meta.url).pathname
    const result = Bun.spawnSync([process.execPath, runner], { env: process.env, timeout: 10_000 })
    expect({ exitCode: result.exitCode, stderr: result.stderr.toString() }).toEqual({
      exitCode: 0,
      stderr: '',
    })
    const report = result.stdout.toString()
    expect(report).toContain(expected)
    if (formats) expect(report).toContain(`format-one=${visible}`)
    if (formats === 2) expect(report).toContain(`format-two=${visible}`)
    else expect(report).not.toContain('format-two=')
    expect(report).toContain('taxonomy checker(s) ran')
    expect(
      await testDb
        .select()
        .from(productTagLinks)
        .orderBy(productTagLinks.productId, productTagLinks.productTagId)
    ).toEqual(before)
  })
})

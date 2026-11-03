import { describe, expect, it } from 'bun:test'

import { eq, sql } from 'drizzle-orm'

import { products, productTagLinks, productTagTypes, users } from '../../db/schema'
import { productTagData } from '../../db/seed/data/tags'
import { writeTagsForProductFailSoft } from '../../features/auto-tagging/write'
import { createProduct } from '../../features/products/service'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb, withRlsAs } from '../helpers/app-runtime-db'
import { captureError } from '../helpers/capture-error'
import { SKINCARE } from '../helpers/product-shapes'
import { createRlsApp, loginViaRlsApp } from '../helpers/rls-app'
import { createTestUser } from '../helpers/test-factories'

setupDbTests()

const runtimeDb = await createAppRuntimeDb()
const { jwtAuthRoutes } = await import('../../features/auth/routes')
const { productsFeature } = await import('../../features/products')
const app = createRlsApp(runtimeDb).route('/auth', jwtAuthRoutes).route('', productsFeature)

describe('product intake under app_runtime', () => {
  it.each(['user', 'contributor', 'admin'] as const)(
    'persists automatic tags for a %s submission',
    async (role) => {
      const email = 'intake-rls@example.com'
      const password = 'Azerty123!'
      const user = await createTestUser(email, password)
      await testDb.update(users).set({ role }).where(eq(users.id, user.id))
      await testDb.insert(productTagTypes).values(productTagData)
      const token = await loginViaRlsApp(app, email, password)

      const response = await app.request('/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Intake RLS Serum',
          brand: 'Lab',
          ...SKINCARE,
          inci: 'Aqua, Niacinamide, Retinol, Glycerin, Tocopherol, Phenoxyethanol, Hyaluronic Acid',
        }),
      })
      expect(response.status).toBe(201)
      const product = await testDb.query.products.findFirst({
        where: eq(products.name, 'Intake RLS Serum'),
      })
      expect(product).toBeDefined()
      if (!product) throw new Error('Product was not persisted')
      expect(product.catalogQuality).toBe(role === 'user' ? 'unverified' : 'verified')
      const tags = await testDb
        .select({ slug: productTagTypes.slug, source: productTagLinks.source })
        .from(productTagLinks)
        .innerJoin(productTagTypes, eq(productTagTypes.id, productTagLinks.productTagId))
        .where(eq(productTagLinks.productId, product.id))
      expect(tags.map((tag) => tag.slug)).toContain('type-serum')
      expect(tags.every((tag) => tag.source !== 'manual')).toBe(true)

      const manualTag = await testDb.query.productTagTypes.findFirst({
        where: eq(productTagTypes.slug, 'peau-seche'),
      })
      if (!manualTag) throw new Error('Missing dry skin tag fixture')
      await testDb
        .insert(productTagLinks)
        .values({
          productId: product.id,
          productTagId: manualTag.id,
          relevance: 'primary',
          source: 'manual',
        })
        .onConflictDoUpdate({
          target: [productTagLinks.productId, productTagLinks.productTagId],
          set: { relevance: 'primary', source: 'manual' },
        })
      const update = await app.request(`/products/${product.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'skincare', kind: 'moisturizer', unit: 'tube' }),
      })
      expect(update.status).toBe(200)
      const updatedTags = await testDb
        .select({
          slug: productTagTypes.slug,
          source: productTagLinks.source,
          relevance: productTagLinks.relevance,
        })
        .from(productTagLinks)
        .innerJoin(productTagTypes, eq(productTagTypes.id, productTagLinks.productTagId))
        .where(eq(productTagLinks.productId, product.id))
      expect(updatedTags.map((tag) => tag.slug)).toContain('type-hydratant')
      expect(updatedTags.map((tag) => tag.slug)).not.toContain('type-serum')
      expect(updatedTags).toContainEqual({
        slug: 'peau-seche',
        source: 'manual',
        relevance: 'primary',
      })
    }
  )
  it.each(['success', 'empty', 'failure'] as const)(
    'restores the caller role after %s and keeps the product',
    async (scenario) => {
      const user = await createTestUser()
      await testDb.insert(productTagTypes).values(productTagData)
      if (scenario === 'failure') {
        await testDb.execute(
          sql`ALTER TABLE product_tag_links ADD CONSTRAINT intake_test_reject CHECK (source = 'manual') NOT VALID`
        )
      }
      try {
        const product = await withRlsAs(runtimeDb, 'user', user.id, async (tx) => {
          const created = await createProduct(
            user.id,
            'user',
            {
              name: 'Role Restoration',
              brand: 'Lab',
              ...SKINCARE,
            },
            tx,
            { autoTag: false }
          )
          if (scenario === 'empty') await testDb.delete(productTagTypes)
          await writeTagsForProductFailSoft(tx, created.id, {
            operation: 'create',
            userId: user.id,
          })
          const [context] = await tx.execute(
            sql`SELECT current_setting('app.role', true) AS role, current_setting('app.user_id', true) AS uid`
          )
          expect(context).toMatchObject({ role: 'user', uid: user.id })
          const deleted = await tx
            .delete(productTagLinks)
            .where(eq(productTagLinks.productId, created.id))
            .returning()
          expect(deleted).toHaveLength(0)
          return created
        })
        expect(
          await testDb.query.products.findFirst({ where: eq(products.id, product.id) })
        ).toBeDefined()
        const tags = await testDb
          .select()
          .from(productTagLinks)
          .where(eq(productTagLinks.productId, product.id))
        expect(tags.length > 0).toBe(scenario === 'success')
      } finally {
        if (scenario === 'failure')
          await testDb.execute(
            sql`ALTER TABLE product_tag_links DROP CONSTRAINT intake_test_reject`
          )
      }
    }
  )

  it('rolls automatic tags back with the surrounding product write', async () => {
    const user = await createTestUser()
    await testDb.insert(productTagTypes).values(productTagData)
    const abort = new Error('Abort intake')
    const error = await captureError(() =>
      withRlsAs(runtimeDb, 'user', user.id, async (tx) => {
        const product = await createProduct(
          user.id,
          'user',
          { name: 'Rolled Back', brand: 'Lab', ...SKINCARE },
          tx
        )
        expect(
          (await tx.select().from(productTagLinks).where(eq(productTagLinks.productId, product.id)))
            .length
        ).toBeGreaterThan(0)
        throw abort
      })
    )
    expect(error).toBe(abort)
    expect(await testDb.select().from(products)).toHaveLength(0)
    expect(await testDb.select().from(productTagLinks)).toHaveLength(0)
  })
})

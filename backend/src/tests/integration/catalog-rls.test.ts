import { describe, expect, it } from 'bun:test'

import { eq, sql } from 'drizzle-orm'

import { withAdminRls } from '../../db/rls'
import { products } from '../../db/schema/products/products'
import { productTagTypes } from '../../db/schema/tags/tags'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb, withRlsAs } from '../helpers/app-runtime-db'
import { createTestUser } from '../helpers/test-factories'

const appRuntimeDb = await createAppRuntimeDb()

setupDbTests()

// Insert a product as `role` via the app_runtime pool with RLS context set.
function insertProductAs(role: string, createdBy: string, contextUserId: string = createdBy) {
  return withRlsAs(appRuntimeDb, role, contextUserId, (tx) =>
    tx.insert(products).values({
      createdBy,
      name: 'RLS Probe',
      brand: 'RLSBrand',
      category: 'skincare',
      kind: 'serum',
      unit: 'dropper',
      slug: `rls-probe-${role}`,
    })
  )
}

// Insert a product_tag def as `role` — admin-only table.
function insertProductTagAs(role: string) {
  return withRlsAs(appRuntimeDb, role, '', (tx) =>
    tx.insert(productTagTypes).values({
      slug: `rls-tag-${role}`,
      label: 'RLS Tag Probe',
      tagType: 'test',
    })
  )
}

// Count rows visible for `slug` under a given app.role via the NO-BYPASSRLS pool.
function selectProductCountAs(role: string, slug: string, contextUserId = '') {
  return withRlsAs(appRuntimeDb, role, contextUserId, async (tx) => {
    const rows = await tx.select({ id: products.id }).from(products).where(eq(products.slug, slug))
    return rows.length
  })
}

// Drizzle wraps the PG error, so the policy message lives in e.cause.
async function expectRlsDenial(run: () => Promise<unknown>) {
  let threw = false
  try {
    await run()
  } catch (e) {
    threw = true
    const msg = (e as { cause?: { message?: string } }).cause?.message ?? (e as Error).message
    expect(msg).toMatch(/row-level security|policy/i)
  }
  expect(threw).toBe(true)
}

describe('catalog RLS — fail closed', () => {
  it('allows anonymous SELECT on products (public read, no app.role)', async () => {
    // Public SELECT policy USING(true): must not require app.role
    const rows = await appRuntimeDb.execute(sql`SELECT 1 AS ok FROM products LIMIT 1`)
    expect(Array.isArray(rows)).toBe(true)
  })

  it('denies INSERT for anonymous (no app.user_id)', async () => {
    const owner = await createTestUser('rls-noctx@test.local', 'Azerty123!')
    // Identity absent → auth.uid() is null, so created_by = auth.uid() fails.
    await expectRlsDenial(() => insertProductAs('', owner.id, ''))
  })

  it('allows role=user to self-insert own unverified row', async () => {
    const owner = await createTestUser('rls-user@test.local', 'Azerty123!')
    await insertProductAs('user', owner.id)
    const [row] = await testDb
      .select({ slug: products.slug })
      .from(products)
      .where(eq(products.slug, 'rls-probe-user'))
    expect(row?.slug).toBe('rls-probe-user')
  })

  it('allows INSERT for role=contributor', async () => {
    const owner = await createTestUser('rls-contrib@test.local', 'Azerty123!')
    await insertProductAs('contributor', owner.id)
    const [row] = await testDb
      .select({ slug: products.slug })
      .from(products)
      .where(eq(products.slug, 'rls-probe-contributor'))
    expect(row?.slug).toBe('rls-probe-contributor')
  })

  it('allows INSERT for role=admin', async () => {
    const owner = await createTestUser('rls-admin@test.local', 'Azerty123!')
    await insertProductAs('admin', owner.id)
    const [row] = await testDb
      .select({ slug: products.slug })
      .from(products)
      .where(eq(products.slug, 'rls-probe-admin'))
    expect(row?.slug).toBe('rls-probe-admin')
  })

  // product_tags is admin-only: contributor must be denied.
  it('denies product_tags INSERT for role=contributor (admin-only table)', async () => {
    await expectRlsDenial(() => insertProductTagAs('contributor'))
  })

  it('allows product_tags INSERT for role=admin', async () => {
    await insertProductTagAs('admin')
    const [row] = await testDb
      .select({ slug: productTagTypes.slug })
      .from(productTagTypes)
      .where(eq(productTagTypes.slug, 'rls-tag-admin'))
    expect(row?.slug).toBe('rls-tag-admin')
  })

  // Locks withAdminRls as the correct primitive for trusted CLI/seed runners:
  // it sets app.role='admin' LOCAL to the writing tx (the bug was a bare
  // SET LOCAL outside any tx → no-op → RLS denied the write). Exercises the
  // real helper on the shared app_runtime `db`, not a hand-rolled tx.
  // select_visible exposes hidden submission rows to moderators so a sheet can be
  // reviewed/restored; plain users
  // (even the owner) and anon never see a hidden sheet — public reads stay honest.
  it('hides a product sheet from role=user + anon, shows it to contributor + admin', async () => {
    const owner = await createTestUser('rls-hidden@test.local', 'Azerty123!')
    await testDb.insert(products).values({
      createdBy: owner.id,
      name: 'Hidden Probe',
      brand: 'HiddenBrand',
      category: 'skincare',
      kind: 'serum',
      unit: 'dropper',
      slug: 'rls-hidden-probe',
      moderationStatus: 'hidden',
    })
    // even the owner (role=user) cannot SELECT their own hidden sheet
    expect(await selectProductCountAs('user', 'rls-hidden-probe', owner.id)).toBe(0)
    expect(await selectProductCountAs('', 'rls-hidden-probe')).toBe(0)
    expect(await selectProductCountAs('contributor', 'rls-hidden-probe')).toBe(1)
    expect(await selectProductCountAs('admin', 'rls-hidden-probe')).toBe(1)
  })

  it('withAdminRls can INSERT into an RLS-protected catalog table', async () => {
    const owner = await createTestUser('rls-withadmin@test.local', 'Azerty123!')
    await withAdminRls(async (tx) => {
      await tx.insert(products).values({
        createdBy: owner.id,
        name: 'withAdminRls Probe',
        brand: 'RLSBrand',
        category: 'skincare',
        kind: 'serum',
        unit: 'dropper',
        slug: 'rls-probe-withadminrls',
      })
    })
    const [row] = await testDb
      .select({ slug: products.slug })
      .from(products)
      .where(eq(products.slug, 'rls-probe-withadminrls'))
    expect(row?.slug).toBe('rls-probe-withadminrls')
  })
})

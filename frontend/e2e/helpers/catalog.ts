import { expect, type Page } from '@playwright/test'

import { type Credentials, loginAs, SEED_EMAIL, SEED_PASSWORD } from './auth'
import { waitForHydration } from './hydration'

// Admin user: auto-verifies created products; use for UI moderation + admin API calls.
const ADMIN: Credentials = { email: SEED_EMAIL, password: SEED_PASSWORD }
// Plain user: products land unverified in the moderation queue.
// keep in sync with backend/src/db/seed/seeders/seed-test-users.ts
const USER: Credentials = { email: 'anna@seed.local', password: SEED_PASSWORD }

// Login as admin (seed@seed.com). Sets the page's session cookie to admin.
export const loginAndGetToken = (page: Page) => loginAs(page, ADMIN)
// Login as a plain user (anna@seed.local). Sets the page's session cookie to that user.
export const loginAsUser = (page: Page) => loginAs(page, USER)

function bearer(token: string) {
  return { authorization: `Bearer ${token}` }
}

// Alphabetical first on skincare = a stable pick. We avoid the /products list
// + "first card" approach because the default sort=newest makes the first card
// volatile across parallel tests that create products mid-run. Specs that WRITE
// this product belong in a *.mutation.spec.ts file (see e2e.md): it is the same
// row for every project, and later seed products fail client-side validation.
export async function resolveFirstSkincareSlug(page: Page): Promise<string> {
  const res = await page.request.get('/api/products?category=skincare&sort=name&limit=1')
  expect(res.ok()).toBe(true)
  const json = await res.json()
  return json.data.items[0].slug as string
}

export async function gotoFirstProductDetail(page: Page): Promise<string> {
  const slug = await resolveFirstSkincareSlug(page)
  await page.goto(`/products/${slug}`)
  await expect(page).toHaveURL(new RegExp(`/products/${slug}$`), { timeout: 15_000 })
  await waitForHydration(page)
  return slug
}

export type CatalogFixture = { id: string; slug: string; name: string }

// Creates a real product as the seed user, so it lands unverified + visible (the moderation
// "À vérifier" queue / a "pending" submission). Unique name keeps the slug + (name,brand)
// visible-unique index collision-free across runs
export async function createProduct(
  page: Page,
  token: string,
  name: string
): Promise<CatalogFixture> {
  const res = await page.request.post('/api/products', {
    headers: bearer(token),
    data: { name, brand: 'E2E Lab', category: 'skincare', kind: 'serum', unit: 'pump' },
  })
  expect(res.ok(), `create product failed (${res.status()}): ${await res.text()}`).toBe(true)
  const data = (await res.json()).data
  return { id: data.id, slug: data.slug, name }
}

// Admin-only hard delete: lets a spec that creates a product through the UI put the
// catalogue back the way it found it.
export async function deleteProduct(page: Page, token: string, id: string): Promise<void> {
  const res = await page.request.delete(`/api/products/${id}`, { headers: bearer(token) })
  expect(res.ok(), `delete product failed (${res.status()})`).toBe(true)
}

export async function verifyProduct(page: Page, token: string, id: string): Promise<void> {
  const res = await page.request.patch(`/api/products/${id}/quality`, {
    headers: bearer(token),
    data: { quality: 'verified' },
  })
  expect(res.ok(), `verify product failed (${res.status()})`).toBe(true)
}

export async function hideProduct(
  page: Page,
  token: string,
  id: string,
  reason: string
): Promise<void> {
  const res = await page.request.patch(`/api/admin/moderation/products/${id}`, {
    headers: bearer(token),
    data: { status: 'hidden', reason },
  })
  expect(res.ok(), `hide product failed (${res.status()})`).toBe(true)
}

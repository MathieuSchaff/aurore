import { productDetailSchema } from '@aurore/shared'

import { expect, test } from '@playwright/test'

import { loginAsPersona, registerFreshUser } from './helpers/auth'
import { resolveShelfProductWithInci } from './helpers/catalog'
import { waitForHydration, waitForProductsListSettled } from './helpers/hydration'
import { authRequests, captureRequests, requestsFor } from './helpers/network'

test('fetches one complete catalogue page on authenticated SPA navigation', async ({ page }) => {
  await registerFreshUser(page)

  const refreshResponse = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      new URL(response.url()).pathname === '/api/auth/refresh'
  )
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/about')
  await waitForHydration(page)
  expect((await refreshResponse).ok()).toBe(true)

  const requests = captureRequests(page)

  await page.locator('.main-nav__inline').getByRole('link', { name: 'Produits' }).click()
  await expect(page.getByRole('heading', { name: 'Produits', level: 1 })).toBeVisible()
  await waitForProductsListSettled(page)

  // The standing setting resolves server-side (apply_preferences=auto): one list
  // read, no profile reads, no replace-navigate
  expect(requestsFor(requests, 'GET', '/api/products')).toHaveLength(1)
  expect(requestsFor(requests, 'GET', '/api/profile/dermo')).toEqual([])
  expect(requestsFor(requests, 'GET', '/api/profile/preference-targets')).toEqual([])
  expect(new URL(page.url()).searchParams.get('profile_filter')).toBeNull()
})

test('fetches one complete product detail page on authenticated SPA navigation', async ({
  page,
  browserName,
}) => {
  const token = await loginAsPersona(page, browserName)
  const shelfProduct = await resolveShelfProductWithInci(page, token, browserName)

  // profile_filter pinned off: preference-marks mutates this shared persona's rules
  // while the suite runs, and an active "Avec" would drop the target card from a ruled list
  // This spec counts the detail navigation, not the personalization
  await page.goto(`/products?q=${encodeURIComponent(shelfProduct.name)}&profile_filter=false`)
  await waitForHydration(page)
  await waitForProductsListSettled(page)

  const requests = captureRequests(page)
  await page.locator(`a[href="/products/${shelfProduct.slug}"]`).first().click()
  await expect(page.getByRole('heading', { name: shelfProduct.name, level: 1 })).toBeVisible()
  const preferenceDisclosure = page.getByRole('button', {
    name: 'Utiliser un ingrédient de cette formule dans mes recherches',
  })
  await expect(preferenceDisclosure).toBeVisible()
  await preferenceDisclosure.click()
  await expect(page.getByRole('button', { name: /^Sans / }).first()).toBeVisible()
  await page.waitForLoadState('networkidle')

  expect(requestsFor(requests, 'GET', `/api/products/${shelfProduct.slug}/page`)).toHaveLength(1)
  expect(requestsFor(requests, 'GET', `/api/products/${shelfProduct.slug}`)).toEqual([])
  expect(requestsFor(requests, 'GET', `/api/products/${shelfProduct.slug}/dermo-score`)).toEqual([])
  expect(requestsFor(requests, 'GET', '/api/profile/dermo')).toEqual([])
  expect(requestsFor(requests, 'GET', '/api/profile/preference-targets')).toEqual([])
})

// The explicit setting keeps the request contract stable across SSR and hydration
// The cookie-authenticated boot owns the only list read, seeds that exact connected
// cache key, and the client only exchanges the refresh cookie for its Bearer token
test('cold authenticated /products reuses the SSR list and probes auth once', async ({
  page,
  browserName,
}) => {
  await loginAsPersona(page, browserName)

  const requests = captureRequests(page)
  const refreshResponse = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      new URL(response.url()).pathname === '/api/auth/refresh'
  )

  const document = await page.goto('/products?profile_filter=true')
  if (!document) throw new Error('no navigation response for /products')

  // Playwright cannot see the server-side boot read. The rendered grid proves the
  // response reached the document instead of moving the only list fetch to the client
  expect(await document.text(), 'SSR HTML carries no product grid').toContain('list-card--product')

  expect((await refreshResponse).ok()).toBe(true)
  await waitForProductsListSettled(page)

  expect(requestsFor(requests, 'GET', '/api/products')).toEqual([])
  expect(authRequests(requests)).toEqual(['POST /api/auth/refresh'])
})

test('cold authenticated product detail reuses every seeded first screen read', async ({
  page,
  browserName,
}) => {
  const token = await loginAsPersona(page, browserName)
  const shelfProduct = await resolveShelfProductWithInci(page, token, browserName)
  const requests = captureRequests(page)
  const refreshResponse = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      new URL(response.url()).pathname === '/api/auth/refresh'
  )

  const document = await page.goto(`/products/${shelfProduct.slug}`)
  if (!document) throw new Error(`no navigation response for /products/${shelfProduct.slug}`)
  const html = await document.text()
  expect(html).toContain(shelfProduct.name)
  expect(html).toContain('Dans votre collection')
  expect(html).toContain('Lecture de la formule')

  expect((await refreshResponse).ok()).toBe(true)
  await waitForHydration(page)
  await page.waitForLoadState('networkidle')

  expect(requestsFor(requests, 'GET', `/api/products/${shelfProduct.slug}/page`)).toEqual([])
  expect(requestsFor(requests, 'GET', `/api/products/${shelfProduct.slug}`)).toEqual([])
  expect(requestsFor(requests, 'GET', `/api/products/${shelfProduct.slug}/dermo-score`)).toEqual([])
  expect(requestsFor(requests, 'GET', '/api/profile/dermo')).toEqual([])
  expect(requestsFor(requests, 'GET', '/api/profile/preference-targets')).toEqual([])
  expect(authRequests(requests)).toEqual(['POST /api/auth/refresh'])
})

test('cold authenticated discussions reuses the complete product page', async ({
  page,
  browserName,
}) => {
  const token = await loginAsPersona(page, browserName)
  const shelfProduct = await resolveShelfProductWithInci(page, token, browserName)
  const requests = captureRequests(page)
  const refreshResponse = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      new URL(response.url()).pathname === '/api/auth/refresh'
  )

  const document = await page.goto(`/products/${shelfProduct.slug}/discussions`)
  if (!document) throw new Error('no navigation response for product discussions')
  expect(await document.text()).toContain(shelfProduct.name)

  expect((await refreshResponse).ok()).toBe(true)
  await waitForHydration(page)
  await expect(page.getByRole('button', { name: 'Ouvrir une discussion' })).toBeVisible()
  await page.waitForLoadState('networkidle')

  expect(requestsFor(requests, 'GET', `/api/products/${shelfProduct.slug}/page`)).toEqual([])
  expect(requestsFor(requests, 'GET', `/api/products/${shelfProduct.slug}`)).toEqual([])
  expect(requestsFor(requests, 'GET', `/api/products/${shelfProduct.slug}/dermo-score`)).toEqual([])
  expect(requestsFor(requests, 'GET', '/api/profile/dermo')).toEqual([])
  expect(requestsFor(requests, 'GET', '/api/profile/preference-targets')).toEqual([])
  expect(authRequests(requests)).toEqual(['POST /api/auth/refresh'])
})

test('cold anonymous product detail reuses the SSR page without secondary reads', async ({
  page,
}) => {
  const slug = 'cerave-baume-hydratant'
  const detailResponse = await page.request.get(`/api/products/${slug}`)
  expect(detailResponse.ok()).toBe(true)
  const product = productDetailSchema.parse((await detailResponse.json()).data)
  const requests = captureRequests(page)

  const document = await page.goto(`/products/${slug}`)
  if (!document) throw new Error(`no navigation response for /products/${slug}`)
  const html = await document.text()
  expect(html).toContain(product.name)
  expect(html).toContain('Lecture de la formule')

  await waitForHydration(page)
  await page.waitForLoadState('networkidle')

  expect(requestsFor(requests, 'GET', `/api/products/${slug}/page`)).toEqual([])
  expect(requestsFor(requests, 'GET', `/api/products/${slug}`)).toEqual([])
  expect(requestsFor(requests, 'GET', `/api/products/${slug}/dermo-score`)).toEqual([])
  expect(requestsFor(requests, 'GET', '/api/profile/dermo')).toEqual([])
  expect(requestsFor(requests, 'GET', '/api/profile/preference-targets')).toEqual([])
  expect(authRequests(requests)).toEqual([])
})

// The other half of the contract: a fresh account has no portrait and no declared
// rule, so auto resolves to "nothing applied" server-side and the boot-seeded key
// is already the one the page reads. No profile read, no extra list fetch
test('cold /products costs no extra list fetch for an account with nothing to apply', async ({
  page,
}) => {
  await registerFreshUser(page)

  const requests = captureRequests(page)
  const refreshResponse = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      new URL(response.url()).pathname === '/api/auth/refresh'
  )

  const document = await page.goto('/products')
  if (!document) throw new Error('no navigation response for /products')
  expect(await document.text(), 'SSR HTML carries no product grid').toContain('list-card--product')

  expect((await refreshResponse).ok()).toBe(true)
  await waitForHydration(page)
  await waitForProductsListSettled(page)

  expect(requestsFor(requests, 'GET', '/api/products')).toHaveLength(0)
  expect(requestsFor(requests, 'GET', '/api/profile/dermo')).toEqual([])
  expect(requestsFor(requests, 'GET', '/api/profile/preference-targets')).toEqual([])
})

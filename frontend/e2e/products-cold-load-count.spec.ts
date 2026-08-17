import { expect, type Page, test } from '@playwright/test'

import { loginAsPersona, registerFreshUser } from './helpers/auth'
import { resolveShelfProductWithInci } from './helpers/catalog'
import { waitForHydration, waitForProductsListSettled } from './helpers/hydration'

function captureRequests(page: Page): string[] {
  const requests: string[] = []
  page.on('request', (request) => {
    requests.push(`${request.method()} ${new URL(request.url()).pathname}`)
  })
  return requests
}

function requestsFor(requests: string[], method: string, pathname: string): string[] {
  return requests.filter((request) => request === `${method} ${pathname}`)
}

function authRequests(requests: string[]): string[] {
  return requests.filter((request) => request.includes(' /api/auth/'))
}

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
  expect(requestsFor(requests, 'GET', '/api/products/shelf-status')).toEqual([])
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

  expect(requestsFor(requests, 'GET', `/api/products/${shelfProduct.slug}`)).toEqual([])
  expect(requestsFor(requests, 'GET', `/api/products/${shelfProduct.slug}/dermo-score`)).toEqual([])
  expect(requestsFor(requests, 'GET', '/api/products/shelf-status')).toEqual([])
  expect(requestsFor(requests, 'GET', '/api/profile/dermo')).toEqual([])
  expect(authRequests(requests)).toEqual(['POST /api/auth/refresh'])
})

// The other half of the contract, and the whole point of keying on the rules: a fresh
// account has no portrait and no declared rule, so no replace-navigate is coming and the
// response cannot differ from the anonymous one the SSR already dehydrated.
test('cold /products costs no extra list fetch for an account with nothing to apply', async ({
  page,
}) => {
  await registerFreshUser(page)

  const requests = captureRequests(page)

  // Armed before the navigation: both land within a few hundred ms of hydration, so a
  // waitForResponse created after the goto races the response it is waiting for
  const profileLanded = Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/profile/dermo')),
    page.waitForResponse((res) => res.url().includes('/api/profile/preference-targets')),
  ])

  const document = await page.goto('/products')
  if (!document) throw new Error('no navigation response for /products')
  expect(await document.text(), 'SSR HTML carries no product grid').toContain('list-card--product')

  // The hold ends on these two, and nothing else can move the key afterwards: with no
  // portrait and no declared rule there is no replace-navigate to wait for
  await profileLanded
  await waitForProductsListSettled(page)

  expect(requestsFor(requests, 'GET', '/api/products')).toHaveLength(0)
})

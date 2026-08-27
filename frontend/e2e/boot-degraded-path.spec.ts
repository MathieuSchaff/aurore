import { expect, type Page, test } from '@playwright/test'

import { loginAsPersona } from './helpers/auth'
import { resolveShelfProductWithInci } from './helpers/catalog'
import { waitForHydration, waitForProductsListSettled } from './helpers/hydration'
import { captureRequests, requestsFor } from './helpers/network'

// Degraded boot path: /api/boot exceeds its 2 s SSR timeout, the server renders
// anonymously, then the client exchanges its cookie and the loaders replay with
// the real identity. The counts below are the contract
// a change here must be deliberate, not a silent regression
// The delay rides an e2e_boot_delay cookie honored by the backend only when the
// e2e compose overlay sets E2E_TEST_HOOKS (see ssr-boot.routes.ts)

function bootDelayCookie(baseURL: string | undefined) {
  if (!baseURL) throw new Error('Playwright baseURL is required')
  return {
    name: 'e2e_boot_delay',
    value: '2500',
    url: baseURL,
  }
}

function waitForRefreshOk(page: Page) {
  return page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      new URL(response.url()).pathname === '/api/auth/refresh' &&
      response.ok()
  )
}

test('degraded boot: personalized catalogue on a mute URL pays one browser list read', async ({
  page,
  browserName,
  baseURL,
}) => {
  await loginAsPersona(page, browserName)
  await page.context().addCookies([bootDelayCookie(baseURL)])

  const requests = captureRequests(page)
  const refreshDone = waitForRefreshOk(page)

  await page.goto('/products')
  await waitForHydration(page)
  await refreshDone
  await waitForProductsListSettled(page)

  // The standing setting resolves server-side (apply_preferences=auto), so the
  // loader replay after the refresh is the only browser read: no profile reads,
  // no replace-navigate, the URL stays mute. The SSR list read was anonymous and
  // server-side, invisible here. Before auto this path cost two reads
  expect(new URL(page.url()).searchParams.get('profile_filter')).toBeNull()
  expect(requestsFor(requests, 'GET', '/api/products')).toHaveLength(1)
  expect(requestsFor(requests, 'GET', '/api/profile/dermo')).toEqual([])
  expect(requestsFor(requests, 'GET', '/api/profile/preference-targets')).toEqual([])
  expect(requestsFor(requests, 'POST', '/api/auth/refresh')).toHaveLength(1)
})

test('degraded boot: product detail pays exactly one browser page read', async ({
  page,
  browserName,
  baseURL,
}) => {
  const token = await loginAsPersona(page, browserName)
  const shelfProduct = await resolveShelfProductWithInci(page, token, browserName)
  await page.context().addCookies([bootDelayCookie(baseURL)])

  const requests = captureRequests(page)
  const refreshDone = waitForRefreshOk(page)

  await page.goto(`/products/${shelfProduct.slug}`)
  await waitForHydration(page)
  await refreshDone
  await expect(page.getByRole('heading', { name: shelfProduct.name, level: 1 })).toBeVisible()
  // Authed-only affordance: its arrival marks the identity swap after the invalidate
  await expect(
    page.getByRole('button', {
      name: 'Utiliser un ingrédient de cette formule dans mes recherches',
    })
  ).toBeVisible()
  await page.waitForLoadState('networkidle')

  expect(requestsFor(requests, 'GET', `/api/products/${shelfProduct.slug}/page`)).toHaveLength(1)
  expect(requestsFor(requests, 'POST', '/api/auth/refresh')).toHaveLength(1)
})

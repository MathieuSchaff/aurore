import type { SsrBootResponse, UserProductStatus } from '@aurore/shared'

import { expect, test } from '@playwright/test'

import { loginAsPersona, loginAsSeed } from './helpers/auth'
import { resolveShelfProductWithInci } from './helpers/catalog'
import { waitForHydration } from './helpers/hydration'

const STATUS_LABELS: Record<UserProductStatus, string> = {
  in_stock: 'En stock',
  wishlist: 'Wishlist',
  watched: 'Garde un œil',
  archived: 'Archivé',
  avoided: 'À éviter',
}

function listDomain(category: string): string {
  if (category === 'solaire' || category === 'bodycare') return 'skincare'
  return category
}

function requireAuthenticatedProductsBoot(boot: SsrBootResponse) {
  if (!boot.session.authenticated) throw new Error('products boot session is anonymous')
  if (!boot.profile.username) throw new Error('products boot profile has no username')
  if (boot.page?.view !== 'products') throw new Error('products boot page is missing')
  return boot
}

test('authenticated raw products document contains its personalized list and URL filters', async ({
  page,
  browserName,
}) => {
  const token = await loginAsPersona(page, browserName)
  const shelfProduct = await resolveShelfProductWithInci(page, token, browserName)
  const domain = listDomain(shelfProduct.category)
  const filteredPath = `/products?category=${domain}&q=${encodeURIComponent(shelfProduct.name)}`

  const bootResponse = await page.request.get(
    `/api/boot?view=products&category=${domain}&q=${encodeURIComponent(shelfProduct.name)}&sort=relevance&page=1&limit=24`
  )
  const bootBody = await bootResponse.text()
  expect(bootResponse.ok(), `boot failed (${bootResponse.status()}): ${bootBody}`).toBe(true)
  const boot = requireAuthenticatedProductsBoot(
    (JSON.parse(bootBody) as { data: SsrBootResponse }).data
  )
  const personalizedProduct = boot.page.items.find(
    (product) => product.id === shelfProduct.id && product.userStatus === shelfProduct.status
  )
  if (!personalizedProduct) throw new Error('filtered boot page has no seeded shelf overlay')
  const shelfMarker =
    personalizedProduct.userStatus === 'avoided' ? 'Marqué à éviter pour vous' : 'Sur votre étagère'

  const documentResponse = await page.request.get(filteredPath)
  const html = await documentResponse.text()

  expect(documentResponse.status()).toBe(200)
  expect(documentResponse.headers()['cache-control']).toBe('private, no-store')
  expect(html).toContain(boot.profile.username)
  expect(html).toContain(`/products/${personalizedProduct.slug}`)
  expect(html).toContain(personalizedProduct.userStatus)
  expect(html).toContain(shelfMarker)
})

test('authenticated raw product detail contains its shelf status and formula reading', async ({
  page,
  browserName,
}) => {
  const token = await loginAsPersona(page, browserName)
  const shelfProduct = await resolveShelfProductWithInci(page, token, browserName)
  const bootResponse = await page.request.get(
    `/api/boot?view=product-detail&slug=${shelfProduct.slug}`
  )
  const bootBody = await bootResponse.text()
  expect(bootResponse.ok(), `boot failed (${bootResponse.status()}): ${bootBody}`).toBe(true)
  const boot = (JSON.parse(bootBody) as { data: SsrBootResponse }).data
  if (
    !boot.session.authenticated ||
    !boot.profile.username ||
    boot.page?.view !== 'product-detail' ||
    boot.page.assessment === null
  ) {
    throw new Error('seed persona has no authenticated product detail boot payload')
  }
  expect(boot.page.userStatus).toBe(shelfProduct.status)

  const documentResponse = await page.request.get(`/products/${shelfProduct.slug}`)
  const html = await documentResponse.text()

  expect(documentResponse.status()).toBe(200)
  expect(documentResponse.headers()['cache-control']).toBe('private, no-store')
  expect(html).toContain(boot.profile.username)
  expect(html).toContain(shelfProduct.name)
  expect(html).toContain('Dans votre collection')
  expect(html).toContain(STATUS_LABELS[shelfProduct.status])
  expect(html).toContain('Lecture de la formule')
  expect(html).toContain(`href="/products/${shelfProduct.slug}/edit"`)
})

test('anonymous raw product detail stays public and contains no seeded identity', async ({
  page,
  context,
  browserName,
}) => {
  const token = await loginAsPersona(page, browserName)
  const shelfProduct = await resolveShelfProductWithInci(page, token, browserName)
  const boot = (
    (await (
      await page.request.get(`/api/boot?view=product-detail&slug=${shelfProduct.slug}`)
    ).json()) as { data: SsrBootResponse }
  ).data
  if (!boot.session.authenticated || !boot.profile.username) {
    throw new Error('seed persona has no authenticated profile')
  }
  await context.clearCookies()

  const documentResponse = await page.request.get(`/products/${shelfProduct.slug}`)
  const html = await documentResponse.text()

  expect(documentResponse.status()).toBe(200)
  expect(documentResponse.headers()['cache-control']).toBe('no-cache')
  expect(html).toContain(shelfProduct.name)
  expect(html).not.toContain(boot.profile.username)
  expect(html).not.toContain(boot.session.userId)
  expect(html).not.toContain('Dans votre collection')
  expect(html).not.toContain('Modifier ce produit')
})

test('unknown product slug keeps its document 404 with a valid cookie', async ({ page }) => {
  await loginAsSeed(page)

  const documentResponse = await page.request.get(
    `/products/missing-product-${Date.now().toString(36)}`
  )

  expect(documentResponse.status()).toBe(404)
})

test('anonymous raw document contains no session data and keeps no-cache', async ({
  page,
  context,
}) => {
  await loginAsSeed(page)
  const bootResponse = await page.request.get('/api/boot')
  const boot = ((await bootResponse.json()) as { data: SsrBootResponse }).data
  if (!boot.session.authenticated || !boot.profile.username) {
    throw new Error('seed user has no authenticated navbar profile')
  }
  await context.clearCookies()

  const documentResponse = await page.request.get('/products')
  const html = await documentResponse.text()

  expect(documentResponse.status()).toBe(200)
  expect(documentResponse.headers()['cache-control']).toBe('no-cache')
  expect(html).not.toContain(boot.profile.username)
  expect(html).not.toContain(boot.session.user.email)
  expect(html).not.toContain(boot.session.userId)
})

test('hydration keeps the SSR identity without refetching session data', async ({ page }) => {
  await loginAsSeed(page)
  const boot = (
    (await (await page.request.get('/api/boot')).json()) as {
      data: SsrBootResponse
    }
  ).data
  if (!boot.session.authenticated || !boot.profile.username) {
    throw new Error('seed user has no authenticated navbar profile')
  }

  await page.addInitScript(() => {
    const state = window as typeof window & { __sawLoggedOutNav?: boolean }
    state.__sawLoggedOutNav = false
    const containsLoginLink = (node: Node): boolean =>
      node instanceof Element &&
      (node.matches('a[href^="/auth/login"]') ||
        node.querySelector('a[href^="/auth/login"]') !== null)
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (containsLoginLink(node)) state.__sawLoggedOutNav = true
        }
      }
    }).observe(document, { childList: true, subtree: true })
  })

  const sessionReads: string[] = []
  const profileReads: string[] = []
  const refreshCalls: string[] = []
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (request.method() === 'GET' && url.pathname === '/api/auth/session') {
      sessionReads.push(request.url())
    }
    if (request.method() === 'GET' && url.pathname === '/api/profile') {
      profileReads.push(request.url())
    }
    if (request.method() === 'POST' && url.pathname === '/api/auth/refresh') {
      refreshCalls.push(request.url())
    }
  })
  const refreshResponse = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === '/api/auth/refresh' &&
      response.request().method() === 'POST'
  )

  await page.goto('/products')
  await waitForHydration(page)
  expect((await refreshResponse).ok()).toBe(true)
  await expect(page.getByRole('img', { name: `Avatar de ${boot.profile.username}` })).toBeVisible()
  expect(
    await page.evaluate(
      () => (window as typeof window & { __sawLoggedOutNav?: boolean }).__sawLoggedOutNav
    )
  ).toBe(false)

  await page.getByRole('link', { name: 'Collection', exact: true }).click()
  await expect(page).toHaveURL(/\/collection/, { timeout: 15_000 })
  await expect(page.getByRole('heading', { name: 'Ma Collection' })).toBeVisible({
    timeout: 15_000,
  })

  expect(refreshCalls).toHaveLength(1)
  expect(sessionReads).toEqual([])
  expect(profileReads).toEqual([])
})

test('public page stays available when the client rejects its seeded session', async ({ page }) => {
  await loginAsSeed(page)
  const boot = (
    (await (await page.request.get('/api/boot')).json()) as {
      data: SsrBootResponse
    }
  ).data
  if (!boot.session.authenticated || !boot.profile.username) {
    throw new Error('seed user has no authenticated navbar profile')
  }
  await page.route('**/api/auth/refresh', (route) =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, error: 'invalid_refresh_token' }),
    })
  )
  const refreshResponse = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === '/api/auth/refresh' &&
      response.request().method() === 'POST'
  )

  const documentResponse = await page.goto('/products')
  if (!documentResponse) throw new Error('no navigation response for /products')
  expect(await documentResponse.text()).toContain(boot.profile.username)
  await waitForHydration(page)
  expect((await refreshResponse).status()).toBe(401)

  await expect(page.getByRole('heading', { name: 'Produits' })).toBeVisible()
  await expect(page.locator('.list-card--product').first()).toBeVisible()
  await page.getByRole('button', { name: 'Menu utilisateur' }).click()
  await expect(page.getByRole('menuitem', { name: 'Connexion' })).toBeVisible()
})

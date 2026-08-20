import type { SsrBootResponse } from '@aurore/shared'

import { expect, test } from '@playwright/test'

import { loginAsSeed } from './helpers/auth'
import { waitForHydration } from './helpers/hydration'

test('authenticated raw document contains the navbar profile and stays private', async ({
  page,
}) => {
  await loginAsSeed(page)

  const bootResponse = await page.request.get('/api/boot')
  const bootBody = await bootResponse.text()
  expect(bootResponse.ok(), `boot failed (${bootResponse.status()}): ${bootBody}`).toBe(true)
  const boot = (JSON.parse(bootBody) as { data: SsrBootResponse }).data
  if (!boot.session.authenticated || !boot.profile.username) {
    throw new Error('seed user has no authenticated navbar profile')
  }

  const documentResponse = await page.request.get('/products')

  expect(documentResponse.status()).toBe(200)
  expect(documentResponse.headers()['cache-control']).toBe('private, no-store')
  expect(await documentResponse.text()).toContain(boot.profile.username)
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

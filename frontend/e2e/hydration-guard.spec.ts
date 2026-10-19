import { expect, test } from '@playwright/test'

import { loginAsSeed } from './helpers/auth'
import { gotoAuthenticatedHydrated, waitForHydration } from './helpers/hydration'

test('finishes a non-SSR route loaded before React mounts', async ({ page }) => {
  await page.addInitScript(() => {
    const scrollTo = window.scrollTo
    window.scrollTo = (...args: Parameters<typeof scrollTo>) => {
      if (!Reflect.get(window, '__e2eRouteRendered')) {
        Reflect.set(window, '__e2eScrollBeforeReady', true)
      }
      Reflect.apply(scrollTo, window, args)
    }
  })
  // Explicit loading preserves the early-load regression case now that hydration defers it to mount
  await page.route('**/src/client.tsx*', async (route) => {
    const response = await route.fetch()
    const source = await response.text()
    const mount = 'startTransition(() => {'
    expect(source).toContain(mount)
    await route.fulfill({
      response,
      body: source.replace(
        mount,
        `
        await router.load()
        Reflect.set(window, '__e2eLoadedBeforeMount',
          !router.state.isLoading && router.state.status === 'idle' &&
          router.state.resolvedLocation?.href === router.state.location.href)
        router.subscribe('onRendered', () => Reflect.set(window, '__e2eRouteRendered', true))
        ${mount}
      `
      ),
    })
  })

  await loginAsSeed(page)
  await gotoAuthenticatedHydrated(page, '/collection')
  await page.waitForFunction(() => Reflect.get(window, '__e2eRouteRendered'))
  expect(await page.evaluate(() => Reflect.get(window, '__e2eLoadedBeforeMount'))).toBe(true)
  expect(await page.evaluate(() => Reflect.get(window, '__e2eScrollBeforeReady'))).toBe(true)
  await expect(page.getByRole('heading', { name: 'Ma Collection', level: 1 })).toBeVisible()
  await expect(page.getByRole('progressbar', { name: 'Chargement de la page' })).toBeHidden()
  await page.getByRole('button', { name: 'Menu utilisateur', exact: true }).click()
  await expect(page.getByRole('menu')).toBeVisible()
})

test('waits for the first rendered route to restore scroll', async ({ page }) => {
  await page.addInitScript(() => {
    Reflect.set(window, '__e2eScrollRestored', false)
    const scrollTo = window.scrollTo
    window.scrollTo = (...args: Parameters<typeof scrollTo>) => {
      Reflect.set(window, '__e2eScrollRestored', true)
      Reflect.apply(scrollTo, window, args)
    }
  })

  await page.goto('/products')
  await waitForHydration(page)
  expect(await page.evaluate(() => Reflect.get(window, '__e2eScrollRestored'))).toBe(true)
})

test('keeps hydration pending while a reloaded document waits for its stylesheet', async ({
  page,
}) => {
  await page.goto(`/products/${'x'.repeat(201)}`)
  await waitForHydration(page)

  let releaseStyles = () => {}
  const stylesGate = new Promise<void>((resolve) => {
    releaseStyles = resolve
  })
  await page.route('**/@tanstack-start/styles.css*', async (route) => {
    await stylesGate
    await route.continue()
  })

  const stylesRequested = page.waitForRequest('**/@tanstack-start/styles.css*')
  const reloaded = page.waitForEvent('framenavigated', (frame) => frame === page.mainFrame())
  await page.evaluate(() => location.reload())
  await reloaded
  await stylesRequested

  const hydration = waitForHydration(page)
  try {
    const state = await Promise.race([
      hydration.then(() => 'resolved' as const),
      new Promise<'pending'>((resolve) => setTimeout(() => resolve('pending'), 500)),
    ])
    expect(state).toBe('pending')

    releaseStyles()
    await hydration
    expect(await page.evaluate(() => document.readyState)).toBe('complete')
    await expect(page.getByRole('heading', { name: 'On a renversé quelque chose.' })).toBeVisible()
  } finally {
    releaseStyles()
    await page.unrouteAll({ behavior: 'wait' })
  }
})

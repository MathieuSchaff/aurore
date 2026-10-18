import { expect, test } from '@playwright/test'
import type { AnyRouter } from '@tanstack/react-router'

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
    let router: AnyRouter | undefined
    let finishLoad = () => {}
    Reflect.set(
      window,
      '__e2eInitialLoad',
      new Promise<void>((resolve) => {
        finishLoad = resolve
      })
    )
    Object.defineProperty(window, '__TSR_ROUTER__', {
      configurable: true,
      get: () => router,
      set: (value: AnyRouter) => {
        router = value
        const load = value.load
        value.load = async (...args: Parameters<typeof load>) => {
          await load(...args)
          Reflect.set(window, '__e2eLoadFinished', true)
          finishLoad()
        }
      },
    })
  })
  // A cold client can mount Transitioner after loading has already finished
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
        await Reflect.get(window, '__e2eInitialLoad')
        Reflect.set(window, '__e2eLoadedBeforeMount',
          Reflect.get(window, '__e2eLoadFinished') && !router.state.isLoading)
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

test('exposes the TanStack stream global before hydration removes it', async ({ page }) => {
  // Hydration can finish before goto resolves, so record the global while HTML is parsed
  await page.addInitScript(() => {
    Reflect.set(window, '__e2eSawStream', false)
    const observer = new MutationObserver(() => {
      if (Reflect.has(window, '$_TSR')) {
        Reflect.set(window, '__e2eSawStream', true)
        observer.disconnect()
      }
    })
    observer.observe(document, { childList: true, subtree: true })
  })

  await page.goto('/products')
  await waitForHydration(page)
  expect(
    await page.evaluate(() => Reflect.get(window, '__e2eSawStream')),
    'TanStack Router no longer exposes $_TSR: update waitForHydration and this guard'
  ).toBe(true)
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

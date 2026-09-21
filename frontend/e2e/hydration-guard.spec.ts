import { expect, test } from '@playwright/test'

import { waitForHydration } from './helpers/hydration'

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

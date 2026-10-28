import { expect, test } from '@playwright/test'

import { waitForHydration } from './helpers/hydration'

for (const route of ['/products', '/ingredients']) {
  test.describe(`Filter drawer on ${route}`, () => {
    test.use({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })

    test.beforeEach(async ({ page }) => {
      await page.goto(route)
      await waitForHydration(page)
      await page
        .getByRole('button', { name: /^Filtrer$|^Filtrer \(/ })
        .first()
        .click()
      await expect(page.getByRole('dialog', { name: 'Filtres' })).toBeVisible()
    })

    test('disables the opening slide when reduced motion is requested', async ({ page }) => {
      // The unlayered drawer animation used to override the layered reset
      const panel = page.locator('.filter-drawer__panel')
      await expect(panel).toHaveCSS('animation-name', 'none')
      await page.setViewportSize({ width: 1280, height: 900 })
      await expect(panel).toHaveCSS('animation-name', 'none')
    })

    test('keeps the scroll indicator available and the footer reachable', async ({
      page,
      browserName,
      headless,
    }) => {
      test.skip(
        browserName === 'firefox' && headless,
        'Firefox headless injects an agent stylesheet hiding every scrollbar; run headed'
      )
      const drawer = page.getByRole('dialog', { name: 'Filtres' })
      const body = drawer.locator('.filter-drawer__body')
      expect(await body.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true)
      await expect(body).not.toHaveCSS('scrollbar-width', 'none')
      expect(
        await body.evaluate((el) => getComputedStyle(el, '::-webkit-scrollbar').display)
      ).not.toBe('none')

      await body.evaluate((el) => {
        el.scrollTop = el.scrollHeight
      })
      const footer = drawer.getByRole('button', { name: 'Appliquer les filtres sélectionnés' })
      await expect(footer).toBeInViewport({ ratio: 1 })
      await footer.click()
      await expect(drawer).toBeHidden()
      await expect(
        page.getByRole('button', { name: /^Filtrer$|^Filtrer \(/ }).first()
      ).toBeFocused()
    })
  })
}

test('keeps mobile footer actions above the bottom safe area', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'CDP provides a nonzero safe-area environment')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const session = await page.context().newCDPSession(page)
  await session.send('Emulation.setSafeAreaInsetsOverride', { insets: { bottom: 34 } })
  await page.goto('/products')
  await waitForHydration(page)
  await page
    .getByRole('button', { name: /^Filtrer$|^Filtrer \(/ })
    .first()
    .click()
  const drawer = page.getByRole('dialog', { name: 'Filtres' })
  await expect(drawer).toBeVisible()
  await page.locator('.filter-drawer__panel').evaluate(async (el) => {
    await Promise.all(el.getAnimations().map((animation) => animation.finished))
  })
  const bottomGap = await drawer.locator('.filter-drawer__footer').evaluate((el) => {
    const buttons = Array.from(el.querySelectorAll('button'))
    return innerHeight - Math.max(...buttons.map((button) => button.getBoundingClientRect().bottom))
  })
  expect(bottomGap).toBeGreaterThanOrEqual(34)
})

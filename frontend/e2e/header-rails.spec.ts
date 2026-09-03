import { expect, type Page, test } from '@playwright/test'

import { loginAsSeed } from './helpers/auth'
import { gotoHydrated, waitForHydration, waitForSettledUrl } from './helpers/hydration'

interface Rect {
  x: number
  width: number
}

async function rect(page: Page, selector: string): Promise<Rect> {
  return page.locator(selector).evaluate((element) => {
    const { x, width } = element.getBoundingClientRect()
    return { x, width }
  })
}

async function contentRect(page: Page, selector: string): Promise<Rect> {
  return page.locator(selector).evaluate((element) => {
    const bounds = element.getBoundingClientRect()
    const styles = getComputedStyle(element)
    const paddingLeft = Number.parseFloat(styles.paddingLeft)
    const paddingRight = Number.parseFloat(styles.paddingRight)
    return {
      x: bounds.x + paddingLeft,
      width: bounds.width - paddingLeft - paddingRight,
    }
  })
}

// Poll rather than measure once: hydration is not the last word on geometry. In dev Vite
// injects a component's CSS when its client module runs, so a rail read a beat too early is
// read on unstyled markup, and a loaded worker pool widens that beat.
async function expectAligned(
  page: Page,
  headerSelector: string,
  bodySelector: string,
  measureHeader: (page: Page, selector: string) => Promise<Rect> = rect
) {
  await expect
    .poll(
      async () => {
        const header = await measureHeader(page, headerSelector)
        const body = await rect(page, bodySelector)
        return Math.max(Math.abs(header.x - body.x), Math.abs(header.width - body.width))
      },
      { timeout: 10_000 }
    )
    .toBeLessThanOrEqual(1)
}

test.describe('Page header rails', () => {
  test.use({ viewport: { width: 1440, height: 1000 } })

  test('aligns public list headers with their body rails', async ({ page }) => {
    await gotoHydrated(page, '/products')
    await expect(page.getByRole('heading', { name: 'Produits', level: 1 })).toBeVisible()
    await expectAligned(page, '.list-browse-header__top-inner', '.list-page-layout__body')

    await gotoHydrated(page, '/ingredients')
    await expect(page.getByRole('heading', { name: 'Ingrédients', level: 1 })).toBeVisible()
    await expectAligned(page, '.list-browse-header__top-inner', '.list-page-layout__body')

    await gotoHydrated(page, '/blog')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    // The gradient stays full-bleed; only the header CONTENT (inside padding)
    // must sit on the body rail, hence contentRect. Strict: the body mirrors
    // the header's --space-6 padding floor, so both rails match exactly.
    await expectAligned(page, '.page-header', '.blog-list-page__body', contentRect)
  })

  test('aligns authenticated headers and preserves the centered collection variant', async ({
    page,
  }) => {
    await loginAsSeed(page)

    await gotoHydrated(page, '/collection')
    await expect(page.getByRole('heading', { name: 'Ma Collection', level: 1 })).toBeVisible()
    await expectAligned(page, '.list-page-layout__header', '.list-page-layout__body')
    // Desktop contract: centered only aligns the row vertically; title and actions
    // stay at the rail edges, which is what the centered variant means.
    await expect(page.locator('.list-page-layout__header')).toHaveCSS('align-items', 'center')
    await expect
      .poll(async () => {
        const [header, title, actionsContent] = await Promise.all([
          rect(page, '.list-page-layout__header'),
          rect(page, '.list-page-layout__title'),
          rect(page, '.list-page-layout__actions > *'),
        ])
        return Math.max(
          Math.abs(title.x - header.x),
          Math.abs(actionsContent.x + actionsContent.width - (header.x + header.width))
        )
      })
      .toBeLessThanOrEqual(1)

    await gotoHydrated(page, '/feed')
    await expect(
      page.getByRole('heading', { name: 'Le fil des semblables', level: 1 })
    ).toBeVisible()
    await expectAligned(page, '.list-page-layout__header', '.list-page-layout__body')

    // Mobile contract: centered centers the stacked header.
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoHydrated(page, '/collection')
    await expect(page.getByRole('heading', { name: 'Ma Collection', level: 1 })).toBeVisible()
    await expect
      .poll(async () => {
        const [mobileHeader, mobileInfo] = await Promise.all([
          rect(page, '.list-page-layout__header'),
          rect(page, '.list-page-layout__header-info'),
        ])
        return Math.abs(
          mobileInfo.x + mobileInfo.width / 2 - (mobileHeader.x + mobileHeader.width / 2)
        )
      })
      .toBeLessThanOrEqual(1)
  })

  test('keeps public list headers within a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    for (const path of ['/products', '/ingredients', '/blog']) {
      await gotoHydrated(page, path)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)

      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth
          )
        )
        .toBeLessThanOrEqual(0)
    }
  })

  test('renders every light palette variant without losing the page title', async ({ page }) => {
    await gotoHydrated(page, '/products')

    for (const variant of ['terracota', 'foret', 'ardoise']) {
      await page.evaluate((nextVariant) => {
        localStorage.setItem('theme-preference', 'light')
        localStorage.setItem('variant', nextVariant)
      }, variant)
      // Hydration lands before the lazy chunks it kicked off (react-query devtools
      // in dev); reloading while one is in flight cancels the document request too
      // (Firefox: NS_BINDING_ABORTED, 12 aborts / 18 reloads without this wait).
      // The URL never moves here: this is borrowed for its quiet window, and
      // networkidle is unusable against the Vite dev server's HMR socket.
      await waitForSettledUrl(page)
      await page.reload()
      await waitForHydration(page)

      const title = page.getByRole('heading', { name: 'Produits', level: 1 })
      await expect(title).toBeVisible()
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
      await expect(page.locator('html')).toHaveAttribute('data-variant', variant)
      await expect(title).not.toHaveCSS('color', 'rgba(0, 0, 0, 0)')
    }
  })
})

import { expect, type Page, test } from '@playwright/test'

import { loginAsSeed } from './helpers/auth'
import { waitForHydration } from './helpers/hydration'

const inlineLink = (page: Page, name: string) =>
  page.locator('.main-nav__inline').getByRole('link', { name, exact: true })

// The nav's display rules are media-query gated; on a cold Vite stack the CSS is injected a
// beat after the DOM, so gate on a Header.css-only property before asserting hidden states.
const navReady = (page: Page) => expect(page.locator('.main-nav')).toHaveCSS('position', 'fixed')

test.describe('Top navbar', () => {
  test('shows anonymous inline links without a hamburger on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/products')
    await expect(page.getByRole('heading', { name: 'Produits', level: 1 })).toBeVisible()
    await navReady(page)
    await waitForHydration(page)

    // Inline, not the drawer: the hamburger stays hidden and no drawer is mounted.
    await expect(page.locator('.main-nav__lead .main-nav__toggle')).toBeHidden()
    await expect(page.locator('.main-nav-drawer')).toHaveCount(0)

    await expect(inlineLink(page, 'Produits')).toBeVisible()
    await expect(inlineLink(page, 'Ingrédients')).toBeVisible()
    await expect(inlineLink(page, 'Blog')).toBeVisible()
    await expect(inlineLink(page, 'Accueil')).toBeVisible()
    // Auth-walled links are not advertised to logged-out visitors.
    await expect(inlineLink(page, 'Collection')).toHaveCount(0)
    await expect(inlineLink(page, 'Comparaisons')).toHaveCount(0)
  })

  test('swaps to authenticated desktop links after login', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await loginAsSeed(page)
    await page.goto('/products')
    await expect(page.getByRole('heading', { name: 'Produits', level: 1 })).toBeVisible()
    await navReady(page)
    await waitForHydration(page)

    await expect(inlineLink(page, 'Collection')).toBeVisible()
    await expect(inlineLink(page, 'Comparaisons')).toBeVisible()
    // Accueil only makes sense for logged-out visitors.
    await expect(inlineLink(page, 'Accueil')).toHaveCount(0)

    // Nested route: only the most specific link is marked current, not fuzzy /products too.
    // Use the navigation being tested so the first cold-load refresh can finish in-page.
    await inlineLink(page, 'Comparaisons').click()
    await expect(page).toHaveURL(/\/products\/compare/)
    await expect(inlineLink(page, 'Comparaisons')).toHaveAttribute('aria-current', 'page')
    await expect(inlineLink(page, 'Produits')).not.toHaveAttribute('aria-current', 'page')
  })

  test('uses the hamburger and drawer below 1024px', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 900 })
    await page.goto('/products')
    await expect(page.getByRole('heading', { name: 'Produits', level: 1 })).toBeVisible()
    await navReady(page)
    await waitForHydration(page)

    const burger = page.locator('.main-nav__lead .main-nav__toggle')
    await expect(burger).toBeVisible()
    // Inline links are collapsed at this width.
    await expect(page.locator('.main-nav__inline')).toBeHidden()

    await burger.click()
    const drawer = page.locator('.main-nav-drawer')
    await expect(drawer).toBeVisible()
    await expect(drawer.getByRole('link', { name: 'Produits', exact: true })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(drawer).toHaveCount(0)
    // Native <dialog> loses its focus restore when React unmounts it before close();
    // Header hands focus back to the trigger manually. Assert that contract.
    await expect(burger).toBeFocused()
  })

  for (const variant of ['terracota', 'foret', 'ardoise']) {
    for (const theme of ['light', 'dark']) {
      for (const layout of ['desktop', 'drawer']) {
        test(`preserves user menu spacing in ${layout}, ${theme}, ${variant}`, async ({
          page,
        }, testInfo) => {
          await page.setViewportSize({ width: layout === 'desktop' ? 1280 : 390, height: 900 })
          await page.addInitScript(
            ({ theme, variant }) => {
              localStorage.setItem('theme-preference', theme)
              localStorage.setItem('variant', variant)
            },
            { theme, variant }
          )
          await loginAsSeed(page)
          await page.goto('/products')
          await navReady(page)
          await waitForHydration(page)
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
          await expect(page.locator('html')).toHaveAttribute('data-variant', variant)

          if (layout === 'drawer') {
            await page.locator('.main-nav__lead .main-nav__toggle').click()
          }
          const trigger = page
            .locator(layout === 'drawer' ? '.main-nav-drawer' : '.main-nav')
            .getByRole('button', { name: 'Menu utilisateur', exact: true })
          await trigger.click()
          const menu = page.getByRole('menu', { name: 'Menu utilisateur', exact: true })
          const logout = menu.getByRole('menuitem', { name: 'Déconnexion', exact: true })
          const profile = menu.getByRole('menuitem', { name: 'Profil', exact: true })
          await expect(logout).toBeVisible()

          const readSpacing = (element: HTMLElement | SVGElement) => {
            const style = getComputedStyle(element)
            return {
              top: parseFloat(style.paddingTop),
              right: parseFloat(style.paddingRight),
              bottom: parseFloat(style.paddingBottom),
              left: parseFloat(style.paddingLeft),
              height: element.getBoundingClientRect().height,
            }
          }
          const spacing = {
            trigger: await trigger.evaluate(readSpacing),
            logout: await logout.evaluate(readSpacing),
            profile: await profile.evaluate(readSpacing),
          }
          await testInfo.attach('menu-spacing', {
            body: JSON.stringify(spacing, null, 2),
            contentType: 'application/json',
          })

          // The bare Button reset must not erase the menu's own spacing
          for (const side of ['top', 'right', 'bottom', 'left'] as const) {
            expect(spacing.logout[side]).toBeCloseTo(spacing.profile[side], 1)
          }
          const rootSize = await page
            .locator('html')
            .evaluate((element) => parseFloat(getComputedStyle(element).fontSize))
          expect(spacing.trigger.top).toBeCloseTo(rootSize * 0.25, 1)
          expect(spacing.trigger.right).toBeCloseTo(rootSize * 0.25, 1)
          expect(spacing.trigger.bottom).toBeCloseTo(rootSize * 0.25, 1)
          expect(spacing.trigger.left).toBeCloseTo(
            rootSize * (layout === 'drawer' ? 0.75 : 0.25),
            1
          )
          expect(spacing.logout.height).toBeGreaterThanOrEqual(44)
        })
      }
    }
  }

  test('closes the drawer after a backdrop click', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 900 })
    await page.goto('/products')
    await expect(page.getByRole('heading', { name: 'Produits', level: 1 })).toBeVisible()
    await navReady(page)
    await waitForHydration(page)

    await page.locator('.main-nav__lead .main-nav__toggle').click()
    const drawer = page.locator('.main-nav-drawer')
    await expect(drawer).toBeVisible()

    // The drawer panel is min(20rem, 86vw) wide, left-anchored; x=700 lands on the backdrop.
    await page.mouse.click(700, 450)
    await expect(drawer).toHaveCount(0)
  })
})

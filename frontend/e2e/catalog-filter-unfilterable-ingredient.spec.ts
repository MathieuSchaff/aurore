import { expect, test } from '@playwright/test'

import { waitForHydration } from './helpers/hydration'
import { mockJson } from './helpers/network'

// product_ingredients is not a mirror of the INCI: excipients and over-common tokens
// are dropped on purpose, so filtering on Glycerin would match nothing. The catalogue
// used to stay silent about it and offer the option anyway. It must now say so at the
// one moment the user asks (searching the ingredient), and refuse the selection.

test.describe('Catalogue filter: an unfilterable ingredient says so', () => {
  test('Glycerin is listed, explained and not selectable', async ({ page }) => {
    await mockJson(page, (url) => url.pathname.endsWith('/api/ingredients/search'), 200, {
      success: true,
      data: [
        {
          id: '11111111-1111-4111-8111-111111111111',
          name: 'Glycerin',
          slug: 'glycerin',
          type: 'skincare',
          category: 'humectant',
          canonicalKey: 'glycerin',
          filterable: false,
        },
      ],
    })

    await page.goto('/products')
    await expect(page.locator('.list-card--product').first()).toBeVisible({ timeout: 15_000 })
    await waitForHydration(page)

    await page
      .getByRole('button', { name: /^Filtrer$|^Filtrer \(/ })
      .first()
      .click()
    const drawer = page.getByRole('dialog', { name: 'Filtres' })
    await expect(drawer).toBeVisible()

    await drawer.getByRole('combobox', { name: 'Ingrédient' }).fill('glycerin')

    const option = drawer.getByRole('option', { name: /Glycerin/ })
    await expect(option).toBeVisible()
    await expect(option).toHaveAttribute('aria-disabled', 'true')
    await expect(option).toContainText('Non filtrable')

    // dispatchEvent, not click(): aria-disabled already makes Playwright refuse the
    // click, so a plain click() would pass without ever reaching the handler. Firing
    // it anyway is what proves the refusal is in the code, not only in the ARIA.
    await option.dispatchEvent('click')
    await expect(drawer.locator('.search-select__selected')).toHaveCount(0)
    await expect(option).toBeVisible()
  })
})

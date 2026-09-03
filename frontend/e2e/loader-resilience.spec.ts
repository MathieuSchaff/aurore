import { expect, test } from '@playwright/test'

import { loginAsSeed } from './helpers/auth'
import { gotoHydrated } from './helpers/hydration'
import { mockApiError } from './helpers/network'

test.describe('Catalogue resilience', () => {
  test('keeps the catalogue rendered when filter options fail', async ({ page }) => {
    await loginAsSeed(page)

    await mockApiError(page, '**/api/products/filter-options*', 500, 'server_error')
    const filterOptionsResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        new URL(response.url()).pathname === '/api/products/filter-options'
    )

    await gotoHydrated(page, '/products?profile_filter=true')
    await page
      .getByRole('button', { name: /^Filtrer/ })
      .first()
      .hover()

    expect((await filterOptionsResponse).status()).toBe(500)

    await expect(page.getByRole('heading', { name: 'Produits', level: 1 })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.locator('.list-card--product').first()).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('.global-error-page')).toHaveCount(0)
  })
})

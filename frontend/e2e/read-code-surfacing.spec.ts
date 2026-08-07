import { expect, test } from '@playwright/test'

import { gotoHydrated } from './helpers/hydration'
import { mockJson } from './helpers/network'

// A 429 on a list read must show the rate-limit retry window, not the misleading
// "empty catalogue" state: the queryFn must keep the backend code and retryAfter
// on the ApiError. Oracle for this effort; see docs/conventions/error-handling.md §"Known gap".
test.describe('Rate-limit surfacing: 429 shows a retry message', () => {
  test('products list 429 renders "Trop de requêtes" with the retry delay', async ({ page }) => {
    // 429 only the catalogue list endpoint; detail/search/etc. stay live.
    // retryAfter is a string: the backend forwards the Retry-After HTTP header verbatim.
    await mockJson(page, (url) => url.pathname.endsWith('/api/products'), 429, {
      success: false,
      error: 'rate_limit_exceeded',
      details: { retryAfter: '42' },
    })

    // /products is ssr:true and prefetches the list on the server, out of reach of
    // page.route. Enter from another page so the failing fetch happens in the browser.
    await gotoHydrated(page, '/ingredients')
    await page
      .locator('.main-nav__inline')
      .getByRole('link', { name: 'Produits', exact: true })
      .click()
    await expect(page).toHaveURL(/\/products/)

    // EmptyState mirrors its message into the app-level aria-live region, so 'Trop de requêtes'
    // now matches two nodes. Assert the visible empty-state nodes (heading + subtitle) directly.
    await expect(page.getByRole('heading', { name: 'Trop de requêtes' })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page.locator('.empty-state__subtitle')).toHaveText(/réessayez dans 42\s*s/)
  })
})

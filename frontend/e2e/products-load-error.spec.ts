import { expect, test } from '@playwright/test'

import { gotoHydrated } from './helpers/hydration'

test('recovers the catalogue after a failed load', async ({ page }) => {
  const listUrl = (url: URL) => url.pathname === '/api/products'
  await page.route(listUrl, (route) => route.fulfill({ status: 503, body: '' }))

  // Client navigation lets the browser intercept the catalogue request instead of SSR
  await gotoHydrated(page, '/ingredients')
  await page.getByRole('link', { name: 'Produits', exact: true }).first().click()
  await expect(page.getByRole('heading', { name: 'Chargement impossible' })).toBeVisible()
  await expect(page.getByText(/aucun produit/i)).toHaveCount(0)

  await page.unroute(listUrl)
  await page.getByRole('button', { name: 'Réessayer', exact: true }).click()
  await expect(page.locator('.list-card--product').first()).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Chargement impossible' })).toHaveCount(0)
})

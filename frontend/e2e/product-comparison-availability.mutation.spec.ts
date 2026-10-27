import type { CreateComparisonInput, EnrichedComparison } from '@aurore/shared'

import { expect, type Page, test } from '@playwright/test'

import { deleteTestUser, registerFreshUser } from './helpers/auth'
import { createProduct, deleteProduct, hideProduct, loginAndGetToken } from './helpers/catalog'
import { waitForHydration } from './helpers/hydration'

const productColumns = (page: Page) =>
  page
    .getByRole('table', { name: 'Fiche d’identité' })
    .getByRole('columnheader')
    .filter({ has: page.getByRole('link') })

test('signals unavailable comparison products without revealing their names and clears after restoration', async ({
  page,
}) => {
  const adminToken = await loginAndGetToken(page)
  const fixtures: Awaited<ReturnType<typeof createProduct>>[] = []
  const freshUser = await registerFreshUser(page)
  try {
    for (const suffix of ['A', 'B', 'C']) {
      fixtures.push(await createProduct(page, adminToken, `Availability ${Date.now()} ${suffix}`))
    }
    const saved = await page.request.post('/api/product-comparisons', {
      headers: { Authorization: `Bearer ${freshUser.token}` },
      data: {
        name: 'Sélection conservée',
        productIds: fixtures.map((product) => product.id),
      } satisfies CreateComparisonInput,
    })
    expect(saved.ok()).toBe(true)
    const comparisonId: string = (await saved.json()).data.id
    const last = fixtures[2]
    if (!last) throw new Error('Third product fixture missing')
    await hideProduct(page, adminToken, last.id, 'Availability regression')

    await page.goto(`/products/compare/${comparisonId}`)
    await waitForHydration(page)
    await expect(page.getByRole('status', { name: /^1 produit indisponible\./ })).toBeVisible()
    await expect(page.getByText(/Modifier la sélection retirera/)).toBeVisible()
    await expect(productColumns(page)).toHaveCount(2)
    await expect(page.getByText(last.name, { exact: false })).toHaveCount(0)

    await page.getByRole('button', { name: 'Modifier la comparaison' }).click()
    await page.getByRole('textbox', { name: /nom de la comparaison/i }).fill('Sélection renommée')
    await page.getByRole('button', { name: 'Enregistrer le nom' }).click()
    await expect(page.getByRole('status', { name: /^1 produit indisponible\./ })).toBeVisible()
    await page.goto('/products/compare')
    await waitForHydration(page)
    await expect(page.getByRole('link', { name: /Sélection renommée/ })).toContainText(
      '1 indisponible'
    )

    for (const product of fixtures.slice(0, 2)) {
      await hideProduct(page, adminToken, product.id, 'Availability regression')
    }
    await page.goto(`/products/compare/${comparisonId}`)
    await waitForHydration(page)
    await expect(page.getByRole('status', { name: /^3 produits indisponibles\./ })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Fiche d’identité' })).toHaveCount(0)
    for (const product of fixtures) {
      await expect(page.getByText(product.name, { exact: false })).toHaveCount(0)
    }

    for (const product of fixtures) {
      const restored = await page.request.patch(`/api/admin/moderation/products/${product.id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
        data: { status: 'visible' },
      })
      expect(restored.ok()).toBe(true)
    }
    await page.reload()
    await waitForHydration(page)
    await expect(
      page.getByRole('status').filter({ hasText: /produits? indisponibles?/ })
    ).toHaveCount(0)
    await expect(productColumns(page)).toHaveCount(3)
    const response = await page.request.get(`/api/product-comparisons/${comparisonId}`, {
      headers: { Authorization: `Bearer ${freshUser.token}` },
    })
    expect(response.ok()).toBe(true)
    const detail: EnrichedComparison = (await response.json()).data
    expect(detail.products.map((product) => product.id)).toEqual(
      fixtures.map((product) => product.id)
    )
  } finally {
    for (const product of fixtures) await deleteProduct(page, adminToken, product.id)
    await deleteTestUser(page, freshUser.token, 'comparison availability')
  }
})

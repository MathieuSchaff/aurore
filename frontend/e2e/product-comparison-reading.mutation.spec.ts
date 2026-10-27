import type { CreateComparisonInput, ProductSearchPage } from '@aurore/shared'

import { expect, type Page, test } from '@playwright/test'

import { deleteTestUser, registerFreshUser } from './helpers/auth'
import { waitForHydration } from './helpers/hydration'

// Pair from snapshot/data.sql, both with an INCI on file
// Aqua opens both labels and Petrolatum is only in CeraVe
// CeraVe ships in a pump, Krème in a tube
const PAIR = [
  ['CeraVe', 'cerave-creme-hydratante'],
  ['Hydratation Intense Bio', 'kreme-creme-hydratation-intense-bio'],
] as const

// Long names and five columns: the case that squeezed names to a letter per line on a phone
const FIVE = [
  ...PAIR,
  ['retinol', 'cosrx-retinol-05-oil'],
  ['Milkfoliant', 'dermalogica-daily-milkfoliant'],
  [
    'Isdinceutics Salicylic',
    'isdin-isdinceutics-salicylic-renewal-serum-a-l-acide-salicylique-reduit-imperfections-et-rides-30ml-302724',
  ],
] as const

async function createComparison(
  page: Page,
  token: string,
  products: ReadonlyArray<readonly [string, string]>
) {
  const productIds: string[] = []
  for (const [query, slug] of products) {
    const search = await page.request.get(`/api/products/search?q=${encodeURIComponent(query)}`)
    expect(search.ok()).toBe(true)
    const catalog: ProductSearchPage = (await search.json()).data
    const product = catalog.items.find((p) => p.slug === slug)
    if (!product) throw new Error(`Missing comparison fixture: ${slug}`)
    productIds.push(product.id)
  }
  const created = await page.request.post('/api/product-comparisons', {
    headers: { Authorization: `Bearer ${token}` },
    data: { productIds } satisfies CreateComparisonInput,
  })
  expect(created.ok()).toBe(true)
  return (await created.json()).data.id as string
}

test('reads a saved comparison block by block', async ({ page }) => {
  const user = await registerFreshUser(page)
  try {
    const id = await createComparison(page, user.token, PAIR)

    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(`/products/compare/${id}`)
    await waitForHydration(page)

    await expect(page.getByRole('heading', { level: 1, name: 'Comparer 2 produits' })).toBeVisible()
    const edit = page.getByRole('button', { name: 'Modifier la comparaison' })
    const nameInput = page.getByRole('textbox', { name: 'Nom de la comparaison (facultatif)' })
    await expect(edit).toHaveAttribute('aria-expanded', 'false')
    await expect(nameInput).toBeHidden()
    await edit.click()
    await expect(edit).toHaveAttribute('aria-expanded', 'true')
    await expect(nameInput).toBeVisible()
    await expect(page.getByRole('button', { name: /^Remplacer CeraVe/ })).toBeVisible()
    await edit.click()
    await expect(nameInput).toBeHidden()

    const body = page.locator('.comparison-body')
    await expect(body.getByRole('heading', { level: 2 })).toHaveText([
      'Fiche d’identité',
      'Formules',
      'Signaux',
      'Votre expérience',
    ])
    await expect(page.getByRole('region', { name: 'Différences', exact: true })).toHaveCount(0)

    const identity = page.getByRole('table', { name: 'Fiche d’identité' })
    await expect(identity.getByRole('columnheader', { name: /CeraVe/ })).toBeVisible()
    const container = identity.getByRole('row', { name: /^Contenant/ })
    await expect(container).toContainText('Pompe')
    await expect(container).toContainText('Tube')

    const formulas = page.getByRole('table', { name: 'Formules' })
    const rows = formulas.locator('tbody tr')
    await expect(rows.first().getByRole('cell')).toHaveText(['Aqua (commun)', 'Aqua (commun)'])
    await expect(rows).toHaveCount(15)
    await page.getByRole('button', { name: 'Voir toute la formule' }).click()
    await expect(page.getByRole('button', { name: 'Réduire la formule' })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
    await expect.poll(() => rows.count()).toBeGreaterThan(15)

    const filter = page.getByRole('radiogroup', { name: 'Ingrédients affichés' })
    await filter.getByText('Seulement les communs').click()
    await expect(filter.getByRole('radio', { name: 'Seulement les communs' })).toBeChecked()
    await expect(formulas.getByText('Petrolatum', { exact: true })).toHaveCount(0)
    await expect(formulas.getByText('Aqua', { exact: true })).toHaveCount(2)
    await filter.getByText('Seulement les différences').click()
    await expect(formulas.getByText('Petrolatum', { exact: true })).toBeVisible()
    await expect(formulas.getByText('Aqua', { exact: true })).toHaveCount(0)

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true)
  } finally {
    await deleteTestUser(page, user.token)
  }
})

test('keeps five products readable on a phone without widening the page', async ({ page }) => {
  const user = await registerFreshUser(page)
  try {
    const id = await createComparison(page, user.token, FIVE)
    await page.setViewportSize({ width: 320, height: 812 })
    await page.goto(`/products/compare/${id}`)
    await waitForHydration(page)

    for (const name of ['Fiche d’identité', 'Formules']) {
      const products = page
        .getByRole('table', { name })
        .getByRole('columnheader')
        .filter({ has: page.getByRole('link') })
      await expect(products).toHaveCount(5)
      // Measured in rem: the root font size changes with the viewport width
      const narrowest = await products.evaluateAll((cells) => {
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
        return Math.min(...cells.map((cell) => cell.getBoundingClientRect().width)) / rem
      })
      expect(narrowest).toBeGreaterThanOrEqual(6.99)
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true)
  } finally {
    await deleteTestUser(page, user.token)
  }
})

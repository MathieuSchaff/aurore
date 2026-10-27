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

    for (const width of [375, 1280]) {
      await page.setViewportSize({ width, height: 812 })
      const navBottom = await page
        .getByRole('navigation', { name: 'Navigation principale', exact: true })
        .evaluate((nav) => nav.getBoundingClientRect().bottom)
      const productHeader = identity.getByRole('columnheader').first()
      await identity.evaluate((table, top) => {
        window.scrollTo({
          top: window.scrollY + table.getBoundingClientRect().top - top + 40,
          behavior: 'instant',
        })
      }, navBottom)
      await expect
        .poll(() =>
          productHeader.evaluate(
            (cell, top) => Math.abs(cell.getBoundingClientRect().top - top),
            navBottom
          )
        )
        .toBeLessThan(2)
      await expect(productHeader.locator('.cmp-table__photo')).toBeInViewport()
      await identity.evaluate((table, top) => {
        window.scrollTo({
          top: window.scrollY + table.getBoundingClientRect().bottom - top + 10,
          behavior: 'instant',
        })
      }, navBottom)
      await expect
        .poll(() => productHeader.evaluate((cell) => cell.getBoundingClientRect().bottom))
        .toBeLessThan(navBottom + 2)
    }
    await page.setViewportSize({ width: 375, height: 812 })

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
    await page.setViewportSize({ width: 320, height: 480 })
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

      const table = page.getByRole('table', { name })
      const frame = table.locator('..')
      const corner = table.locator('thead tr').locator('th, td').first()
      const firstRow = table.locator('tbody tr').first()
      const navBottom = await page
        .getByRole('navigation', { name: 'Navigation principale', exact: true })
        .evaluate((nav) => nav.getBoundingClientRect().bottom)
      await frame.evaluate((element, top) => {
        window.scrollTo({
          top: window.scrollY + element.getBoundingClientRect().top - top - 8,
          behavior: 'instant',
        })
      }, navBottom)
      const headerTop = await products.first().evaluate((cell) => cell.getBoundingClientRect().top)
      const rowTop = await firstRow.evaluate((row) => row.getBoundingClientRect().top)
      const cornerLeft = await corner.evaluate((cell) => cell.getBoundingClientRect().left)
      await frame.evaluate((element) => {
        element.scrollTop = 80
        element.scrollLeft = element.scrollWidth
      })
      await expect.poll(() => frame.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
      await expect.poll(() => frame.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0)
      await expect
        .poll(() =>
          products
            .first()
            .evaluate((cell, top) => Math.abs(cell.getBoundingClientRect().top - top), headerTop)
        )
        .toBeLessThan(2)
      expect(await firstRow.evaluate((row) => row.getBoundingClientRect().top)).toBeLessThan(rowTop)
      expect(await corner.evaluate((cell) => cell.getBoundingClientRect().left)).toBeCloseTo(
        cornerLeft,
        0
      )
      await expect(products.last()).toBeInViewport()
      expect(
        await corner.evaluate((cell) => {
          const rect = cell.getBoundingClientRect()
          return cell.contains(document.elementFromPoint(rect.left + rect.width / 2, rect.top + 10))
        })
      ).toBe(true)
      await frame.evaluate((element) => {
        element.scrollTop = element.scrollHeight
      })
      const lastRow = table.locator('tbody tr').last().getByRole('rowheader')
      expect(
        await lastRow.evaluate((row) => {
          const rect = row.getBoundingClientRect()
          return row.contains(document.elementFromPoint(rect.left + 10, rect.top + rect.height / 2))
        })
      ).toBe(true)
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
    ).toBe(true)
  } finally {
    await deleteTestUser(page, user.token)
  }
})

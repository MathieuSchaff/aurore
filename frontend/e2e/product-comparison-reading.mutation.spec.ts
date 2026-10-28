import type {
  CreateComparisonInput,
  CreateUserProductInput,
  EnrichedComparison,
  ProductSearchPage,
} from '@aurore/shared'

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

const LAYOUT_PAIR = [
  ['Cyla', 'cyla-creme-intense-initiale'],
  ['Remedy Rich', 'remedy-rich-moisturizer'],
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

test('separates readable ingredient names from formula labels and sheet INCI', async ({ page }) => {
  const user = await registerFreshUser(page)
  try {
    const id = await createComparison(page, user.token, LAYOUT_PAIR)
    await page.goto(`/products/compare/${id}`)
    await waitForHydration(page)
    const formulas = page.getByRole('region', { name: 'Formules', exact: true })
    await expect(
      formulas.getByRole('link', { name: 'Curcuma Longa Root Extract', exact: true })
    ).toHaveAttribute('href', '/ingredients/curcuma-longa-root-extract')

    const signals = page.getByRole('region', { name: 'Signaux', exact: true })
    await signals.getByRole('button', { name: /autres/ }).click()
    const curcuma = signals.getByRole('link', { name: 'Extrait de racine de curcuma', exact: true })
    await expect(curcuma).toHaveAttribute('href', '/ingredients/curcuma-longa-root-extract')
    await curcuma.click()
    await waitForHydration(page)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Extrait de racine de curcuma')
    await expect(page.getByRole('heading', { name: 'Nom INCI', exact: true })).toBeVisible()
    await expect(page.getByText('Curcuma Longa Root Extract', { exact: true })).toBeVisible()

    await page.goto('/ingredients/glucose')
    await waitForHydration(page)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Glucose')
    await expect(page.getByRole('heading', { name: 'Nom INCI', exact: true })).toHaveCount(0)
  } finally {
    await deleteTestUser(page, user.token)
  }
})

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

    const ingredientLink = formulas.getByRole('link', { name: 'Ceramide NP', exact: true })
    await expect(ingredientLink).toHaveAttribute('href', '/ingredients/ceramide-np')
    await ingredientLink.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/ingredients\/ceramide-np$/)
    await waitForHydration(page)
    await expect(page.getByRole('heading', { level: 1, name: /Céramide NP/i })).toBeVisible()
    await page.goBack()
    await waitForHydration(page)
    await expect(page.getByRole('heading', { level: 1, name: 'Comparer 2 produits' })).toBeVisible()

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

test('keeps identity data reachable as the viewport height shrinks and grows', async ({ page }) => {
  const user = await registerFreshUser(page)
  try {
    const id = await createComparison(page, user.token, FIVE)
    await page.goto(`/products/compare/${id}`)
    await waitForHydration(page)
    const table = page.getByRole('table', { name: 'Fiche d’identité' })
    const frame = table.locator('..')
    const header = table.getByRole('columnheader').last()
    const lastRow = table.locator('tbody tr').last()

    // A tall sticky header covered every data row at the native 400% viewport height
    for (const height of [480, 229, 480]) {
      await page.setViewportSize({ width: 320, height })
      await frame.evaluate((element) => {
        element.scrollTop = 0
        element.scrollLeft = element.scrollWidth
        const nav = document.querySelector('nav[aria-label="Navigation principale"]')
        window.scrollTo({
          top:
            window.scrollY +
            element.getBoundingClientRect().top -
            (nav?.getBoundingClientRect().bottom ?? 0) -
            8,
          behavior: 'instant',
        })
      })
      const headerTop = await header.evaluate((cell) => cell.getBoundingClientRect().top)
      await frame.evaluate((element) => {
        element.scrollTop = 80
      })
      if (height === 480) {
        await expect
          .poll(() =>
            header.evaluate(
              (cell, top) => Math.abs(cell.getBoundingClientRect().top - top),
              headerTop
            )
          )
          .toBeLessThan(2)
      }
      await frame.evaluate((element) => {
        element.scrollTop = element.scrollHeight
      })
      await expect
        .poll(() =>
          lastRow.evaluate((row) => {
            return [row.firstElementChild, row.lastElementChild].every((cell) => {
              if (!cell) return false
              const rect = cell.getBoundingClientRect()
              return cell.contains(
                document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
              )
            })
          })
        )
        .toBe(true)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true
      )
    }
  } finally {
    await deleteTestUser(page, user.token)
  }
})

test('uses the available width for a single signal card', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  const user = await registerFreshUser(page)
  try {
    const id = await createComparison(page, user.token, LAYOUT_PAIR)
    await page.goto(`/products/compare/${id}`)
    await waitForHydration(page)
    const signals = page.getByRole('region', { name: 'Signaux', exact: true })
    const cards = signals.getByRole('article')
    await expect(cards).toHaveCount(1)
    // The single card cap left half the section empty on desktop
    await expect
      .poll(() =>
        cards.evaluateAll(([card]) => {
          const container = card.parentElement
          return container
            ? Math.abs(card.getBoundingClientRect().width - container.getBoundingClientRect().width)
            : Number.POSITIVE_INFINITY
        })
      )
      .toBeLessThan(1)
  } finally {
    await deleteTestUser(page, user.token)
  }
})

test('aligns experience fields despite different title and note lengths', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 1000 })
  const user = await registerFreshUser(page)
  try {
    const id = await createComparison(page, user.token, LAYOUT_PAIR)
    const detail = await page.request.get(`/api/product-comparisons/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
    expect(detail.ok()).toBe(true)
    const comparison: EnrichedComparison = (await detail.json()).data
    const added = await page.request.post('/api/user-products', {
      headers: { Authorization: `Bearer ${user.token}` },
      data: {
        productId: comparison.products[0].id,
        status: 'in_stock',
        comment:
          'Une première ligne.\nUne deuxième ligne.\nUne troisième ligne de note personnelle.',
      } satisfies CreateUserProductInput,
    })
    expect(added.ok()).toBe(true)
    await page.goto(`/products/compare/${id}`)
    await waitForHydration(page)
    const experience = page.getByRole('region', { name: 'Votre expérience', exact: true })
    const cards = experience.getByRole('article')
    await expect(cards).toHaveCount(2)
    await expect(experience.getByRole('button', { name: /Mes notes et décisions/ })).toBeVisible()
    await expect(experience.getByRole('button', { name: /Ajouter à ma collection/ })).toBeVisible()
    // Titles and optional hints must not shift corresponding facts or actions
    await expect
      .poll(() =>
        cards.evaluateAll(([first, second]) => {
          const offsets = (card: Element) =>
            Array.from(
              card.querySelectorAll('dt, .cmp-experience__label, button'),
              (element) => element.getBoundingClientRect().top
            )

          const left = offsets(first)
          const right = offsets(second)
          if (left.length !== 4 || right.length !== 4) return Number.POSITIVE_INFINITY
          return Math.max(...left.map((top, index) => Math.abs(top - right[index])))
        })
      )
      .toBeLessThan(1)
  } finally {
    await deleteTestUser(page, user.token)
  }
})

test('keeps formula ingredients and actives without pairs or combined-use copy', async ({
  page,
}, testInfo) => {
  const user = await registerFreshUser(page)
  try {
    const id = await createComparison(page, user.token, [
      ['retinol', 'cosrx-retinol-05-oil'],
      ['glycolique', 'lierac-protocole-eclat-masque-acide-glycolique-pur'],
    ])
    await page.goto(`/products/compare/${id}`)
    await waitForHydration(page)
    const signals = page.getByRole('region', { name: 'Signaux', exact: true })
    const facts = signals.getByRole('article', { name: 'Parfum et alcool dénaturé' })
    await expect(facts.getByRole('link', { name: 'Parfum', exact: true })).toHaveAttribute(
      'href',
      '/ingredients/fragrance'
    )
    await expect(facts.getByText('Linalool', { exact: true })).toBeVisible()
    await expect(facts.getByText(/^\d+$/)).toHaveCount(0)
    await expect(signals.getByRole('article', { name: 'Vigilances' })).toHaveCount(0)
    await expect(signals.getByText(/allergènes ou sensibilisants/i)).toHaveCount(0)
    const actives = signals.getByRole('article', { name: 'Actifs renseignés' })
    const retinolLink = actives.getByRole('link', { name: 'Rétinol', exact: true })
    await expect(retinolLink).toHaveAttribute('href', '/ingredients/retinol')
    await expect(retinolLink.locator('..')).toContainText('Soin de la peau')
    await expect(actives.getByText(/^\d+$/)).toHaveCount(0)
    await actives.getByRole('button', { name: /autres/ }).click()
    await expect(
      actives.getByRole('link', { name: 'Acide Glycolique', exact: true })
    ).toHaveAttribute('href', '/ingredients/glycolic-acid')
    await actives.getByRole('button', { name: 'Voir moins' }).click()
    await expect(actives).toContainText('COSRX Retinol 0.5 Oil')
    await expect(actives).toContainText('Lierac Protocole Eclat Masque Acide Glycolique Pur')
    await expect(
      signals.getByRole('article', { name: 'Paires d’ingrédients repérées' })
    ).toHaveCount(0)
    await expect(signals.getByText(/utilisation ensemble/i)).toHaveCount(0)
    const formulas = page.getByRole('table', { name: 'Formules', exact: true })
    await expect(formulas.getByRole('link', { name: 'Retinol', exact: true })).toBeVisible()
    await expect(formulas.getByRole('link', { name: 'Glycolic Acid', exact: true })).toBeVisible()
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: 844 })
      expect(await signals.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
      await signals.screenshot({ path: testInfo.outputPath(`signals-without-pairs-${width}.png`) })
      await facts.evaluate((element) => {
        const nav = document.querySelector('nav[aria-label="Navigation principale"]')
        window.scrollTo({
          top:
            window.scrollY +
            element.getBoundingClientRect().top -
            (nav?.getBoundingClientRect().bottom ?? 0) -
            16,
          behavior: 'instant',
        })
      })
      await facts.screenshot({ path: testInfo.outputPath(`formula-facts-${width}.png`) })
    }
  } finally {
    await deleteTestUser(page, user.token)
  }
})

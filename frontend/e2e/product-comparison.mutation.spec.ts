import { type CreateComparisonInput, err, type ProductSearchPage } from '@aurore/shared'

import { expect, type Page, type TestInfo, test } from '@playwright/test'

import { deleteTestUser, registerFreshUser } from './helpers/auth'
import { waitForHydration } from './helpers/hydration'

// Known populated pair from snapshot/data.sql: they share a common ingredient, so
// the common ingredients section is non-empty (not the "0 commun" path). Anchored regexes are
// dash-agnostic (option label is `${brand} — ${name}`) and pin the exact name.
const PRODUCT_A = /^CeraVe .+ Crème Hydratante$/
const PRODUCT_B = /^Krème .+ Crème Hydratation Intense Bio$/

test('builds a comparison and displays its bands', async ({ page }, testInfo) => {
  const freshUser = await registerFreshUser(page)
  try {
    await page.goto('/products/compare/new')

    const picker = page.getByRole('combobox', { name: 'Produits à comparer' })
    await expect(picker).toBeVisible({ timeout: 15_000 })

    await picker.fill('CeraVe')
    await page.getByRole('option', { name: PRODUCT_A }).click()
    // commitOption clears the query; the selected chip confirms the pick
    await expect(page.getByRole('button', { name: /^Retirer CeraVe / })).toBeVisible({
      timeout: 10_000,
    })

    await picker.fill('Krème')
    await page.getByRole('option', { name: PRODUCT_B }).click()
    await expect(page.getByRole('button', { name: /^Retirer Krème / })).toBeVisible({
      timeout: 10_000,
    })

    await expect(page.getByText('Sélectionnez au moins 2 produits')).toHaveCount(0)
    await expect(page.getByRole('region', { name: 'Différences', exact: true })).toBeVisible()
    await expect(page).toHaveURL(/\/products\/compare\/new$/)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Comparer des produits' })
    ).toBeVisible()
    const nameLabel = page
      .locator('label')
      .filter({ hasText: 'Nom de la comparaison (facultatif)' })
    const nameInput = page.getByRole('textbox', {
      name: 'Nom de la comparaison (facultatif)',
      exact: true,
    })
    await expect(nameLabel).toBeVisible()
    await nameLabel.click()
    await expect(nameInput).toBeFocused()
    await nameInput.fill('Brouillon de test')
    await expect(nameLabel).toBeVisible()
    await expect(nameLabel).toHaveAttribute('for', (await nameInput.getAttribute('id')) ?? '')
    const draftDifferences = page.getByRole('region', { name: 'Différences', exact: true })
    await draftDifferences.getByRole('link', { name: 'Céramide AP', exact: true }).click()
    await expect(nameInput).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.goBack()
    await expect(nameInput).toHaveValue('Brouillon de test')
    await expect(page.getByRole('button', { name: /^Retirer CeraVe / })).toBeVisible()
    await expect(page.getByRole('button', { name: /^Retirer Krème / })).toBeVisible()
    await page
      .getByRole('region', { name: 'Produits comparés' })
      .getByRole('link', { name: 'Crème Hydratante', exact: true })
      .click()
    await expect(nameInput).toHaveCount(0)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Crème Hydratante', exact: true })
    ).toBeVisible()
    await page.goBack()
    await expect(nameInput).toHaveValue('Brouillon de test')
    await expect(draftDifferences).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath('draft-return-preserved.png') })
    await nameInput.fill('')
    const previewProducts = page.getByRole('region', { name: 'Produits comparés' })
    await expect(
      previewProducts.getByRole('heading', { level: 2, name: 'Produits comparés' })
    ).toBeVisible()
    await expect(previewProducts.getByRole('heading', { level: 3 })).toHaveCount(2)
    const comparisonsBeforeSave = await page.request.get('/api/product-comparisons', {
      headers: { Authorization: `Bearer ${freshUser.token}` },
    })
    expect((await comparisonsBeforeSave.json()).data).toEqual([])
    await page.getByRole('button', { name: /^Retirer Krème / }).click()
    await expect(page.getByRole('region', { name: 'Différences', exact: true })).toHaveCount(0)
    await expect(page.getByText(/Plus qu'un produit à ajouter/)).toBeVisible()
    await picker.fill('Krème')
    await page.getByRole('option', { name: PRODUCT_B }).click()
    await expect(page.getByRole('region', { name: 'Différences', exact: true })).toBeVisible()
    await page.setViewportSize({ width: 390, height: 844 })
    await picker.press('Escape')
    await page.getByRole('form', { name: 'Nom de la comparaison' }).screenshot({
      path: testInfo.outputPath('name-label-draft-mobile.png'),
    })
    await page.screenshot({ path: testInfo.outputPath('draft-preview-mobile.png'), fullPage: true })
    await page
      .getByRole('region', { name: 'Différences', exact: true })
      .screenshot({ path: testInfo.outputPath('draft-differences-mobile.png') })
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.getByRole('button', { name: 'Annuler', exact: true }).click()
    await expect(page).toHaveURL(/\/products\/compare$/)
    const afterCancel = await page.request.get('/api/product-comparisons', {
      headers: { Authorization: `Bearer ${freshUser.token}` },
    })
    expect((await afterCancel.json()).data).toEqual([])
    await page.goBack()
    await expect(nameInput).toHaveValue('')
    await expect(page.getByRole('button', { name: /^Retirer / })).toHaveCount(0)
    await page.goto('/products/compare/new')
    await waitForHydration(page)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Comparer des produits' })
    ).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await picker.fill('CeraVe')
    await page.getByRole('option', { name: PRODUCT_A }).click()
    await picker.fill('Krème')
    await page.getByRole('option', { name: PRODUCT_B }).click()
    await expect(page.getByRole('region', { name: 'Différences', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)

    const saveBtn = page.getByRole('button', { name: 'Enregistrer', exact: true })
    await expect(saveBtn).toBeEnabled({ timeout: 5_000 })
    await saveBtn.click()
    await expect(page).toHaveURL(/\/products\/compare\/[^/]+$/, { timeout: 20_000 })

    await expect(page.getByRole('heading', { level: 1, name: 'Comparer 2 produits' })).toBeVisible()
    await page.goBack()
    await expect(nameInput).toHaveValue('')
    await expect(page.getByRole('button', { name: /^Retirer / })).toHaveCount(0)
    await page.goForward()
    await expect(page.getByRole('heading', { level: 1, name: 'Comparer 2 produits' })).toBeVisible()

    const shelf = page.getByRole('region', { name: 'Produits comparés' })
    await expect(shelf).toBeVisible()
    await expect(shelf.getByText('CeraVe', { exact: true })).toBeVisible()
    await expect(shelf.getByText('Krème', { exact: true })).toBeVisible()

    const summary = page.getByRole('note', { name: 'Synthèse des ingrédients renseignés' })
    await expect(summary).toBeVisible()
    await expect(summary).toContainText(/ingrédients? renseignés? en commun/i)
    await expect(summary).toContainText(/chacun des 2 produits/i)
    await expect(summary).not.toContainText(
      /compositions (proches|nuancées|distinctes)|sensations|complémentaires/i
    )

    const signals = page.getByRole('region', { name: 'Signaux', exact: true })
    await expect(signals).toBeVisible()
    const alerts = signals.getByRole('article', { name: 'Vigilances' })
    await expect(alerts).toContainText('Parfum')
    await expect(alerts).toContainText('Krème : Crème Hydratation Intense Bio')
    await expect(alerts).not.toContainText('CeraVe')
    await expect(alerts).not.toContainText('1/2')
    const actives = signals.getByRole('article', { name: 'Actifs renseignés' })
    await expect(actives).toContainText('CeraVe : Crème Hydratante')
    await expect(actives).toContainText('Krème : Crème Hydratation Intense Bio')
    await expect(signals).not.toContainText(/conflits d.usage|à espacer|aucun signal à signaler/i)
    await page.setViewportSize({ width: 390, height: 844 })
    await signals.screenshot({ path: testInfo.outputPath('signals-mobile.png') })
    expect(await signals.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
    await page.setViewportSize({ width: 1280, height: 900 })
    await signals.screenshot({ path: testInfo.outputPath('signals-desktop.png') })
    await expect(page.getByRole('heading', { name: 'Différences' })).toBeVisible()
    await expect(page.getByText(/concentration/i)).toHaveCount(0)
    await expect(page.getByRole('img', { name: /position INCI/i })).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Points communs' })).toBeVisible()

    await expect(
      page.getByText(/Aucun ingrédient.*n.apparaît dans toutes les formules/)
    ).toHaveCount(0)
    const experience = page.getByRole('region', { name: 'Votre expérience' })
    await expect(experience).toBeVisible()
    const cerave = experience.getByRole('article', { name: 'CeraVe : Crème Hydratante' })
    const kreme = experience.getByRole('article', { name: 'Krème : Crème Hydratation Intense Bio' })
    await expect(cerave).toContainText('Absent de votre collection')
    await expect(kreme).toContainText('Aucune note personnelle')

    await cerave.getByRole('button', { name: /ajouter à ma collection/i }).click()
    let dialog = page.getByRole('dialog')
    await dialog.getByRole('button', { name: 'En stock', exact: true }).click()
    await dialog.getByRole('button', { name: 'Plus tard', exact: true }).click()
    await expect(dialog).toHaveCount(0)
    await expect(cerave).toContainText('En stock')

    await cerave.getByRole('button', { name: /mes notes et décisions/i }).click()
    dialog = page.getByRole('dialog')
    const note = dialog.getByRole('textbox', { name: 'Notes personnelles' })
    await note.fill('Note de test : texture appréciée le soir.')
    const savedNote = page.waitForResponse(
      (response) =>
        response.url().includes('/api/user-products/') &&
        response.request().method() === 'PATCH' &&
        response.ok()
    )
    await note.press('Tab')
    await savedNote
    const savedDecision = page.waitForResponse(
      (response) =>
        response.url().includes('/api/user-products/') &&
        response.request().method() === 'PATCH' &&
        response.ok()
    )
    await dialog
      .getByRole('group', { name: 'Racheter ?' })
      .getByRole('button', { name: 'Non', exact: true })
      .click()
    await savedDecision
    await dialog.getByRole('button', { name: /Statut : En stock/ }).click()
    await page.getByRole('menuitem', { name: 'À éviter', exact: true }).click()
    await dialog
      .getByRole('textbox', { name: 'Raison (optionnelle)' })
      .fill('Décision de test : mis de côté.')
    const savedStatus = page.waitForResponse(
      (response) =>
        response.url().includes('/api/user-products/') &&
        response.request().method() === 'PATCH' &&
        response.ok()
    )
    await dialog.getByRole('button', { name: 'Confirmer', exact: true }).click()
    await savedStatus
    await dialog.getByRole('button', { name: 'Fermer', exact: true }).click()
    await expect(cerave).toContainText('Note de test : texture appréciée le soir.')
    await expect(cerave).toContainText('Non')
    await expect(kreme).not.toContainText('Note de test')
    await expect(cerave).toContainText('À éviter')
    await experience.evaluate((element) =>
      element.scrollIntoView({ block: 'center', behavior: 'instant' })
    )
    await experience.screenshot({ path: testInfo.outputPath('personal-experience-desktop.png') })
    await page.setViewportSize({ width: 390, height: 844 })
    await experience.evaluate((element) =>
      element.scrollIntoView({ block: 'center', behavior: 'instant' })
    )
    await experience.screenshot({ path: testInfo.outputPath('personal-experience-mobile.png') })
    const firstCard = await cerave.boundingBox()
    const secondCard = await kreme.boundingBox()
    if (!firstCard || !secondCard) throw new Error('Experience cards must be visible')
    expect(secondCard.y).toBeGreaterThanOrEqual(firstCard.y + firstCard.height)
    expect(await experience.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
      true
    )
    await page.setViewportSize({ width: 1280, height: 900 })

    await page.reload()
    await waitForHydration(page)
    await expect(cerave).toContainText('Note de test : texture appréciée le soir.')
    await cerave.getByRole('button', { name: /mes notes et décisions/i }).click()
    const clearedNote = page.waitForResponse(
      (response) =>
        response.url().includes('/api/user-products/') &&
        response.request().method() === 'PATCH' &&
        response.ok()
    )
    await page.getByRole('textbox', { name: 'Notes personnelles' }).fill('')
    await page.getByRole('textbox', { name: 'Notes personnelles' }).press('Tab')
    await clearedNote
    await page.getByRole('dialog').getByRole('button', { name: 'Fermer', exact: true }).click()
    await expect(cerave).toContainText('Aucune note personnelle')
    await expect(cerave).not.toContainText('Note de test')
    const replacementRequests: unknown[] = []
    page.on('request', (request) => {
      if (request.url().includes('/api/product-comparisons/') && request.method() === 'PATCH') {
        replacementRequests.push(request.postDataJSON())
      }
    })
    const replacementTrigger = page.getByRole('button', { name: /^Remplacer CeraVe / })
    await replacementTrigger.focus()
    await replacementTrigger.press('Enter')
    const replacement = page.getByRole('dialog', { name: 'Remplacer un produit' })
    await expect(
      replacement.getByRole('combobox', { name: 'Produit de remplacement' })
    ).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(replacement).toHaveCount(0)
    await expect(replacementTrigger).toBeFocused()
    await replacementTrigger.press('Enter')
    await expect(replacement).toContainText(/au moins 2 produits/i)
    const replacementSearch = replacement.getByRole('combobox', { name: 'Produit de remplacement' })
    await replacementSearch.fill('CeraVe')
    await expect(replacement.getByRole('listbox')).toBeVisible()
    await expect(
      replacement.getByRole('option', { name: /^Crème Hydratante CeraVe$/ })
    ).toHaveCount(0)
    await replacementSearch.fill('Hydrance Light')
    await replacement.getByRole('option', { name: /^Hydrance Light Crème Hydratante/ }).click()
    await replacement.getByRole('button', { name: 'Annuler', exact: true }).click()
    await expect(replacement).toHaveCount(0)
    await expect(replacementTrigger).toBeFocused()
    expect(replacementRequests).toHaveLength(0)
    await expect(shelf.getByText('CeraVe', { exact: true })).toBeVisible()

    await expect(page.getByRole('button', { name: /^Remplacer CeraVe / })).toBeVisible()
    await page.getByRole('button', { name: /^Remplacer CeraVe / }).click()
    await replacementSearch.fill('Hydrance Light')
    await expect(
      replacement.getByRole('option', { name: /^Hydrance Light Crème Hydratante/ })
    ).toBeVisible()
    await replacementSearch.press('ArrowDown')
    await replacementSearch.press('Enter')
    await replacement.screenshot({ path: testInfo.outputPath('replacement-choice.png') })
    await page.setViewportSize({ width: 390, height: 844 })
    await replacement.screenshot({ path: testInfo.outputPath('replacement-mobile.png') })
    expect(
      await replacement.evaluate((element) => element.scrollWidth <= element.clientWidth)
    ).toBe(true)
    await page.setViewportSize({ width: 1280, height: 900 })
    let failSelectionUpdate = true
    await page.route('**/api/product-comparisons/*', async (route) => {
      if (route.request().method() === 'PATCH' && failSelectionUpdate) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify(err('server_error')),
        })
        return
      }
      await route.continue()
    })
    const pageError = page.getByText("Impossible d'enregistrer la modification. Réessayez.", {
      exact: true,
    })
    const updateToast = page.getByText('Mise à jour de la comparaison impossible.', {
      exact: true,
    })
    const replacementError = replacement.getByRole('alert')
    await replacement.getByRole('button', { name: 'Remplacer', exact: true }).click()
    await expect(replacementError).toHaveText('Remplacement non enregistré. Réessayez.')
    expect(await pageError.count()).toBe(0)
    expect(await updateToast.count()).toBe(0)
    await expect(shelf.getByText('CeraVe', { exact: true })).toBeVisible()
    await expect(replacement.getByRole('status')).toContainText('Hydrance Light')
    await replacement.screenshot({ path: testInfo.outputPath('replacement-error-inline.png') })
    await replacement.getByRole('button', { name: 'Annuler', exact: true }).click()
    expect(await pageError.count()).toBe(0)
    expect(await updateToast.count()).toBe(0)
    await page.getByRole('button', { name: /^Remplacer CeraVe / }).click()
    await expect(replacementError).toHaveCount(0)
    await replacementSearch.fill('Hydrance Light')
    await replacement.getByRole('option', { name: /^Hydrance Light Crème Hydratante/ }).click()
    await replacement.getByRole('button', { name: 'Remplacer', exact: true }).click()
    await expect(replacementError).toHaveText('Remplacement non enregistré. Réessayez.')
    // The replacement label must not depend on the delayed by-ids lookup
    const lookupStarted = Promise.withResolvers<void>()
    const releaseLookup = Promise.withResolvers<void>()
    await page.route('**/api/products/by-ids?*', async (route) => {
      lookupStarted.resolve()
      await releaseLookup.promise
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify(err('server_error')),
      })
    })
    failSelectionUpdate = false
    try {
      await replacement.getByRole('button', { name: 'Remplacer', exact: true }).click()
      await expect(replacement).toHaveCount(0)
      expect(await pageError.count()).toBe(0)
      expect(await updateToast.count()).toBe(0)
      expect(await page.getByRole('button', { name: /^Remplacer / }).allTextContents()).toEqual([
        expect.stringMatching(/^Remplacer Avène .+ Hydrance Light Crème Hydratante$/),
        expect.stringMatching(/^Remplacer Krème .+ Crème Hydratation Intense Bio$/),
      ])
      await lookupStarted.promise
      await page.screenshot({ path: testInfo.outputPath('replacement-retry-saved.png') })
      await page.setViewportSize({ width: 390, height: 844 })
      await page.getByRole('group', { name: 'Sélection des produits' }).screenshot({
        path: testInfo.outputPath('replacement-label-pending-mobile.png'),
      })
      await page.getByRole('button', { name: /^Remplacer Avène / }).click()
      await expect(replacement).toContainText('À remplacer : Avène')
      await expect(replacement).toContainText('Hydrance Light Crème Hydratante')
      await replacement.getByRole('button', { name: 'Annuler', exact: true }).click()
      await page.setViewportSize({ width: 1280, height: 900 })
    } finally {
      releaseLookup.resolve()
    }
    expect(replacementRequests).toHaveLength(3)
    expect(replacementRequests[2]).toMatchObject({
      productIds: [expect.any(String), expect.any(String)],
    })
    await expect(
      shelf.getByRole('heading', { name: 'Hydrance Light Crème Hydratante' })
    ).toBeVisible()
    await expect(
      shelf.getByRole('heading', { name: 'Crème Hydratation Intense Bio' })
    ).toBeVisible()
    await expect(shelf.getByText('CeraVe', { exact: true })).toHaveCount(0)
    await page.reload()
    await waitForHydration(page)
    await expect(
      shelf.getByRole('heading', { name: 'Hydrance Light Crème Hydratante' })
    ).toBeVisible()

    await expect(page.getByRole('button', { name: /^Remplacer Avène / })).toBeVisible()
    await page.unroute('**/api/products/by-ids?*')
    await page.setViewportSize({ width: 390, height: 844 })
    const selection = page.getByRole('group', { name: 'Sélection des produits' })
    await selection.screenshot({ path: testInfo.outputPath('replacement-controls-mobile.png') })
    expect(await selection.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
      true
    )
    await page.setViewportSize({ width: 1280, height: 900 })
    await picker.fill('CeraVe')
    await page.getByRole('option', { name: PRODUCT_A }).click()
    await expect(page.getByRole('button', { name: /^Retirer CeraVe / })).toBeVisible()
    failSelectionUpdate = true
    await page.getByRole('button', { name: /^Retirer CeraVe / }).click()
    await expect(pageError).toBeVisible()
    expect(await updateToast.count()).toBe(0)
    await expect(shelf.getByText('CeraVe', { exact: true })).toBeVisible()
    failSelectionUpdate = false
    await page.getByRole('button', { name: /^Retirer CeraVe / }).click()
    await expect(page.getByRole('button', { name: /^Remplacer Krème / })).toBeVisible()
    await expect(pageError).toHaveCount(0)
    await expect(shelf.getByText('CeraVe', { exact: true })).toHaveCount(0)
  } finally {
    await deleteTestUser(page, freshUser.token)
  }
})

async function assertComparisonLayout(page: Page, width: number) {
  const shelf = page.getByRole('region', { name: 'Produits comparés' })
  const differences = page.getByRole('region', { name: 'Différences', exact: true })
  const signals = page.getByRole('region', { name: 'Signaux', exact: true })
  await page.setViewportSize({ width, height: 844 })
  for (const cards of [shelf.locator('.cmp-shelf__item'), differences.getByRole('article')]) {
    const bounds = await cards.evaluateAll((elements) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect()
        return {
          x: box.x,
          y: box.y,
          right: box.right,
          bottom: box.bottom,
          fits: element.scrollWidth <= element.clientWidth,
        }
      })
    )
    expect(bounds.every((box) => box.x >= 0 && box.right <= width && box.fits)).toBe(true)
    if (width < 768) {
      for (let index = 1; index < bounds.length; index++) {
        expect(bounds[index].x).toBe(bounds[0].x)
        expect(bounds[index].y).toBeGreaterThanOrEqual(bounds[index - 1].bottom)
      }
    } else {
      expect(bounds[1].y).toBe(bounds[0].y)
    }
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  )
  expect(await signals.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
}

async function captureComparisonLayout(
  page: Page,
  testInfo: TestInfo,
  count: number,
  width: number,
  longName: ProductSearchPage['items'][number]
) {
  const shelf = page.getByRole('region', { name: 'Produits comparés' })
  const differences = page.getByRole('region', { name: 'Différences', exact: true })
  if (count === 8 && width === 390) {
    await differences.screenshot({
      path: testInfo.outputPath('differences-eight-mobile.png'),
    })
  }
  if (count === 2 && (width === 390 || width === 1280)) {
    await page.locator('.comparison-body').evaluate((el) => {
      window.scrollTo({
        top: window.scrollY + el.getBoundingClientRect().top - 60,
        behavior: 'instant',
      })
    })
    await page.screenshot({ path: testInfo.outputPath(`hierarchy-${width}.png`) })
    await shelf.screenshot({ path: testInfo.outputPath(`products-${width}.png`) })
    await differences.screenshot({ path: testInfo.outputPath(`differences-${width}.png`) })
    if (width === 390) {
      const firstProduct = differences.getByRole('article', {
        name: `${longName.brand} ${longName.name}`,
        exact: true,
      })
      const expand = firstProduct.getByRole('button')
      await expect(expand).toContainText(/autres/)
      await expand.focus()
      await page.keyboard.press('Enter')
      await expect(expand).toHaveAttribute('aria-expanded', 'true')
      expect(
        await firstProduct.evaluate((element) => element.scrollWidth <= element.clientWidth)
      ).toBe(true)
      await differences.screenshot({
        path: testInfo.outputPath('differences-expanded-mobile.png'),
      })
      await page.keyboard.press('Enter')
      await expect(expand).toHaveAttribute('aria-expanded', 'false')
    }
  }
}

async function captureComparisonThemes(page: Page, testInfo: TestInfo) {
  const shelf = page.getByRole('region', { name: 'Produits comparés' })
  const differences = page.getByRole('region', { name: 'Différences', exact: true })
  const signals = page.getByRole('region', { name: 'Signaux', exact: true })
  await page.setViewportSize({ width: 390, height: 844 })
  for (const variant of ['terracota', 'foret', 'ardoise']) {
    for (const theme of ['light', 'dark']) {
      await page.evaluate(
        ({ variant, theme }) => {
          localStorage.setItem('variant', variant)
          localStorage.setItem('theme-preference', theme)
        },
        { variant, theme }
      )
      await page.reload()
      await waitForHydration(page)
      await expect(page.locator('html')).toHaveAttribute('data-variant', variant)
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      await page.locator('.comparison-body').evaluate((el) => {
        window.scrollTo({
          top: window.scrollY + el.getBoundingClientRect().top - 60,
          behavior: 'instant',
        })
      })
      await expect
        .poll(() =>
          shelf
            .locator('img')
            .evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete))
        )
        .toBe(true)
      await page.screenshot({
        path: testInfo.outputPath(`hierarchy-${variant}-${theme}.png`),
      })
      await differences.screenshot({
        path: testInfo.outputPath(`differences-${variant}-${theme}.png`),
      })
      await signals.screenshot({
        path: testInfo.outputPath(`signals-${variant}-${theme}.png`),
      })
    }
  }
}

test('keeps same-brand products identifiable without horizontal scrolling', async ({
  page,
}, testInfo) => {
  const freshUser = await registerFreshUser(page)
  try {
    const search = await page.request.get('/api/products/search?q=CeraVe')
    expect(search.ok()).toBe(true)
    const catalog: ProductSearchPage = (await search.json()).data
    const longName = catalog.items.find(
      (product) =>
        product.slug === 'cerave-nettoyants-creme-moussante-nettoyante-hydratante-236ml-278406'
    )
    if (!longName) throw new Error('Missing populated CeraVe fixture')
    const products = [
      longName,
      ...catalog.items.filter((product) => product.id !== longName.id),
    ].slice(0, 8)
    expect(products).toHaveLength(8)
    expect(products.every((product) => product.brand === 'CeraVe')).toBe(true)

    for (const count of [2, 3, 8]) {
      const selected = products.slice(0, count)
      const created = await page.request.post('/api/product-comparisons', {
        headers: { Authorization: `Bearer ${freshUser.token}` },
        data: {
          name: `Lecture mobile : ${count} produits`,
          productIds: selected.map((product) => product.id),
        } satisfies CreateComparisonInput,
      })
      expect(created.ok()).toBe(true)
      const comparisonId: string = (await created.json()).data.id
      await page.goto(`/products/compare/${comparisonId}`)
      await waitForHydration(page)
      const shelf = page.getByRole('region', { name: 'Produits comparés' })
      const differences = page.getByRole('region', { name: 'Différences', exact: true })
      await expect(differences.getByRole('article')).toHaveCount(count)
      await expect(
        shelf.getByRole('heading', { level: 2, name: 'Produits comparés' })
      ).toBeVisible()
      await expect(shelf.getByRole('heading', { level: 3 })).toHaveCount(count)
      expect(
        await shelf
          .getByRole('heading')
          .evaluateAll((headings) => headings.map((heading) => heading.tagName))
      ).toEqual(['H2', ...Array(count).fill('H3')])
      const experience = page.getByRole('region', { name: 'Votre expérience' })
      expect(await differences.evaluate((el) => el.getBoundingClientRect().top)).toBeLessThan(
        await experience.evaluate((el) => el.getBoundingClientRect().top)
      )
      await expect(shelf.getByText(/Prix total/)).toHaveCount(count)
      await expect(page.getByText("Cabinet d'analyse")).toHaveCount(0)
      const ingredientLink = differences.getByRole('link').first()
      await expect(ingredientLink).toHaveAttribute('href', /^\/ingredients\//)
      for (const product of selected) {
        const card = differences.getByRole('article', {
          name: `${product.brand} ${product.name}`,
          exact: true,
        })
        await expect(
          card.getByRole('heading', { name: `${product.brand} ${product.name}`, exact: true })
        ).toBeVisible()
      }

      for (const width of [320, 390, 768, 1280]) {
        await assertComparisonLayout(page, width)
        await captureComparisonLayout(page, testInfo, count, width, longName)
      }
      if (count === 2) {
        await captureComparisonThemes(page, testInfo)
        const ingredientUrl = await ingredientLink.getAttribute('href')
        if (!ingredientUrl) throw new Error('Missing ingredient destination')
        await ingredientLink.scrollIntoViewIfNeeded()
        await ingredientLink.focus()
        await page.keyboard.press('Enter')
        await expect(page).toHaveURL(new RegExp(`${ingredientUrl}$`))
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      }
    }
  } finally {
    await deleteTestUser(page, freshUser.token)
  }
})
test('attributes an ingredient pair across real products without routine advice', async ({
  page,
}, testInfo) => {
  const user = await registerFreshUser(page)
  try {
    const selected = []
    for (const [query, slug] of [
      ['retinol', 'cosrx-retinol-05-oil'],
      ['glycolique', 'lierac-protocole-eclat-masque-acide-glycolique-pur'],
    ]) {
      const search = await page.request.get(`/api/products/search?q=${query}`)
      expect(search.ok()).toBe(true)
      const catalog: ProductSearchPage = (await search.json()).data
      const product = catalog.items.find((p) => p.slug === slug)
      if (!product) throw new Error(`Missing ingredient-pair fixture: ${slug}`)
      selected.push(product)
    }
    const created = await page.request.post('/api/product-comparisons', {
      headers: { Authorization: `Bearer ${user.token}` },
      data: { productIds: selected.map((p) => p.id) } satisfies CreateComparisonInput,
    })
    expect(created.ok()).toBe(true)
    const id: string = (await created.json()).data.id
    await page.goto(`/products/compare/${id}`)
    await waitForHydration(page)
    const pairs = page.getByRole('article', { name: 'Paires d’ingrédients repérées' })
    await expect(pairs).toBeVisible()
    await expect(pairs).toContainText(/Rétinol \+ Acide Glycolique/i)
    await expect(pairs).toContainText('COSRX : Retinol 0.5 Oil')
    await expect(pairs).toContainText('Lierac : Protocole Eclat Masque Acide Glycolique Pur')
    await expect(pairs.getByText(/répartis entre produits/i)).toContainText('COSRX')
    await expect(pairs.getByText(/dans une même formule/i)).toHaveCount(0)
    await expect(pairs).not.toContainText(/glycolic-acid|conflit|éviter|alterner|à espacer/i)
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: 844 })
      expect(await pairs.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
      await pairs.screenshot({ path: testInfo.outputPath(`ingredient-pair-${width}.png`) })
    }
  } finally {
    await deleteTestUser(page, user.token)
  }
})
for (const { label, input, saved } of [
  { label: 'whitespace only', input: '   ', saved: null },
  { label: 'surrounding whitespace', input: '  Mes deux crèmes  ', saved: 'Mes deux crèmes' },
]) {
  test(`creates a comparison with an optional name: ${label}`, async ({ page }) => {
    const user = await registerFreshUser(page)
    try {
      await page.goto('/products/compare/new')
      await waitForHydration(page)
      const picker = page.getByRole('combobox', { name: 'Produits à comparer' })
      await picker.fill('CeraVe')
      await page.getByRole('option', { name: PRODUCT_A }).click()
      await picker.fill('Krème')
      await page.getByRole('option', { name: PRODUCT_B }).click()
      const name = page.getByRole('textbox', {
        name: 'Nom de la comparaison (facultatif)',
        exact: true,
      })
      await name.fill(input)
      const creation = page.waitForResponse(
        (response) =>
          response.url().endsWith('/api/product-comparisons') &&
          response.request().method() === 'POST'
      )
      await page.getByRole('button', { name: 'Enregistrer', exact: true }).click()
      const response = await creation
      expect(response.ok()).toBe(true)
      const submitted: CreateComparisonInput = response.request().postDataJSON()
      expect(submitted.name).toBe(saved ?? undefined)
      expect((await response.json()).data.name).toBe(saved)
      await expect(
        page.getByRole('heading', {
          level: 1,
          name: saved ?? 'Comparer 2 produits',
          exact: true,
        })
      ).toBeVisible()
      await page.reload()
      await waitForHydration(page)
      await expect(name).toHaveValue(saved ?? '')
    } finally {
      await deleteTestUser(page, user.token)
    }
  })
}

test('keeps a name draft stable through delayed saves and retries', async ({ page }, testInfo) => {
  const user = await registerFreshUser(page)
  const release = Promise.withResolvers<void>()
  try {
    const search = await page.request.get('/api/products/search?q=CeraVe')
    const catalog: ProductSearchPage = (await search.json()).data
    const created = await page.request.post('/api/product-comparisons', {
      headers: { Authorization: `Bearer ${user.token}` },
      data: {
        name: 'Avant',
        productIds: catalog.items.slice(0, 2).map((p) => p.id),
      } satisfies CreateComparisonInput,
    })
    expect(created.ok()).toBe(true)
    const id: string = (await created.json()).data.id
    await page.goto(`/products/compare/${id}`)
    await waitForHydration(page)
    const started = Promise.withResolvers<void>()
    const names: (string | null)[] = []
    let failNext = false
    await page.route(`**/api/product-comparisons/${id}`, async (route) => {
      if (route.request().method() !== 'PATCH') return route.continue()
      names.push(route.request().postDataJSON().name)
      if (names.length === 1) {
        started.resolve()
        await release.promise
      }
      if (failNext) {
        failNext = false
        return route.fulfill({ status: 500, json: { success: false, error: 'server_error' } })
      }
      return route.continue()
    })
    const input = page.getByRole('textbox', { name: 'Nom de la comparaison' })
    const save = page.getByRole('button', { name: 'Enregistrer le nom', exact: true })
    await input.fill('Premier')
    await expect(input).toHaveValue('Premier')
    await expect(
      page.locator('label').filter({ hasText: 'Nom de la comparaison (facultatif)' })
    ).toBeVisible()
    await expect(input).toHaveAccessibleName('Nom de la comparaison (facultatif)')
    await expect(page.getByRole('status', { name: 'État du nom' })).toContainText(
      'Nom modifié, non enregistré'
    )
    expect(names).toEqual([])
    await save.click()
    await started.promise
    await input.fill('Dernier')
    await expect(input).toHaveValue('Dernier')
    await expect(save).toBeDisabled()
    await expect(page.getByRole('status', { name: 'État du nom' })).toContainText(
      'Enregistrement du nom'
    )
    await page.setViewportSize({ width: 390, height: 844 })
    await page.screenshot({ path: testInfo.outputPath('rename-pending.png') })
    release.resolve()
    await expect(save).toBeEnabled()
    await expect(input).toHaveValue('Dernier')
    await expect(page.getByRole('status', { name: 'État du nom' })).toContainText(
      'Nom modifié, non enregistré'
    )
    expect(names).toEqual(['Premier'])
    failNext = true
    await save.click()
    await expect(page.getByText(/Nom non enregistré. Votre saisie est conservée/)).toBeVisible()
    await expect(input).toHaveValue('Dernier')
    await page.screenshot({ path: testInfo.outputPath('rename-error.png') })
    await save.click()
    await expect(page.getByRole('status', { name: 'État du nom' })).toContainText('Nom enregistré.')
    expect(names).toEqual(['Premier', 'Dernier', 'Dernier'])
    await page.screenshot({ path: testInfo.outputPath('rename-saved.png') })
    await page.reload()
    await waitForHydration(page)
    await expect(input).toHaveValue('Dernier')
    await input.fill('Brouillon abandonné')
    await page.setViewportSize({ width: 1280, height: 900 })
    page.once('dialog', (dialog) => dialog.dismiss())
    await page.getByRole('link', { name: 'Comparaisons', exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/products/compare/${id}$`))
    await expect(input).toHaveValue('Brouillon abandonné')
    await page.getByRole('button', { name: 'Annuler', exact: true }).click()
    await expect(input).toHaveValue('Dernier')
    expect(names).toHaveLength(3)
    await input.fill('   ')
    await save.click()
    await expect(page.getByRole('status', { name: 'État du nom' })).toContainText('Nom enregistré.')
    expect(names.at(-1)).toBeNull()
    await page.reload()
    await waitForHydration(page)
    await expect(input).toHaveValue('')
    const list = await page.request.get('/api/product-comparisons', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
    expect((await list.json()).data.find((item: { id: string }) => item.id === id).name).toBeNull()
  } finally {
    release.resolve()
    await deleteTestUser(page, user.token)
  }
})

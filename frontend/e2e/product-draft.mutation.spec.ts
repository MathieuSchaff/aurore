import { expect, test } from '@playwright/test'

import { loginAsSeed } from './helpers/auth'
import { createProduct, deleteProduct, gotoFirstProductDetail } from './helpers/catalog'
import { gotoHydrated } from './helpers/hydration'

test('keeps concentration edits local and discards them on cancel', async ({ page }) => {
  await loginAsSeed(page)
  const slug = await gotoFirstProductDetail(page)
  await page.getByRole('link', { name: /Modifier/ }).click()
  await expect(page.getByRole('form', { name: /^Modifier / })).toBeVisible()
  const dose = page.getByRole('spinbutton', { name: /^Dose de / }).first()
  const original = await dose.inputValue()
  const writes: string[] = []
  page.on('request', (request) => {
    if (
      /\/api\/products\//.test(request.url()) &&
      ['PATCH', 'POST', 'PUT', 'DELETE'].includes(request.method())
    ) {
      writes.push(request.url())
    }
  })

  await dose.fill(original === '2' ? '3' : '2')
  await page.getByRole('textbox', { name: 'Notes', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Enregistrer', exact: true })).toBeEnabled()
  await expect(page.getByText('Modifications non enregistrées', { exact: true })).toBeVisible()
  expect(writes).toEqual([])

  await page.getByRole('link', { name: 'Annuler', exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`/products/${slug}$`))
  await page.getByRole('link', { name: /Modifier/ }).click()
  await expect(page.getByRole('spinbutton', { name: /^Dose de / }).first()).toHaveValue(original)
  expect(writes).toEqual([])
})

test('protects a dirty draft when returning and permits explicit discard', async ({ page }) => {
  await loginAsSeed(page)
  const slug = await gotoFirstProductDetail(page)
  await page.getByRole('link', { name: /Modifier/ }).click()
  await page.getByRole('textbox', { name: 'Notes', exact: true }).fill('Unsaved draft')
  page.once('dialog', (dialog) => dialog.dismiss())
  await page.getByRole('button', { name: 'Retour', exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`/products/${slug}/edit$`))
  await expect(page.getByRole('textbox', { name: 'Notes', exact: true })).toHaveValue(
    'Unsaved draft'
  )
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Retour', exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`/products/${slug}$`))
})

test('keeps a failed edit and its doses for a single successful retry', async ({
  page,
}, testInfo) => {
  const token = await loginAsSeed(page)
  const fixture = await createProduct(page, token, `Draft retry ${Date.now()}`)
  try {
    await gotoHydrated(page, `/products/${fixture.slug}/edit`)
    await page.getByRole('textbox', { name: 'Notes', exact: true }).fill('Preserved draft')
    await page.getByRole('combobox', { name: 'Rechercher un ingrédient', exact: true }).click()
    await page
      .getByRole('combobox', { name: 'Rechercher un ingrédient', exact: true })
      .fill('niacinamide')
    await expect(page.getByRole('option', { name: 'Niacinamide actif', exact: true })).toHaveCount(
      1
    )
    await page.getByRole('option', { name: 'Niacinamide actif', exact: true }).click()
    const dose = page.getByRole('spinbutton', { name: 'Dose de Niacinamide', exact: true })
    await dose.fill('-1')
    await expect(dose).toHaveAttribute('aria-invalid', 'true')
    await expect(
      page.getByText('La dose doit être un nombre positif ou nul.', { exact: true })
    ).toBeVisible()
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/products/${fixture.slug}/edit$`))
    await dose.fill('2')
    await page
      .getByRole('combobox', { name: 'Unité pour Niacinamide', exact: true })
      .selectOption('%')
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).scrollIntoViewIfNeeded()
    await page.screenshot({ path: testInfo.outputPath('draft.png') })
    let attempts = 0
    await page.route(`**/api/products/${fixture.id}`, async (route) => {
      if (route.request().method() === 'PATCH' && ++attempts === 1) {
        await route.fulfill({ status: 503, json: { success: false, error: 'server_error' } })
      } else await route.continue()
    })
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click()
    await expect(page.getByRole('form', { name: /^Modifier / }).getByRole('alert')).toBeVisible()
    await expect(dose).toHaveValue('2')
    await expect(page.getByRole('textbox', { name: 'Notes', exact: true })).toHaveValue(
      'Preserved draft'
    )
    await expect(page.getByRole('button', { name: 'Enregistrer', exact: true })).toBeEnabled()
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/products/${fixture.slug}$`))
    const response = await page.request.get(`/api/products/${fixture.slug}`)
    const detail = (await response.json()).data
    expect(detail.notes).toBe('Preserved draft')
    expect(detail.ingredients).toContainEqual(
      expect.objectContaining({
        ingredientName: 'Niacinamide',
        concentrationValue: '2',
        concentrationUnit: '%',
      })
    )
    expect(attempts).toBe(2)
  } finally {
    await deleteProduct(page, token, fixture.id)
  }
})

test('creates a complete draft with one request and blocks repeated submission', async ({
  page,
}) => {
  const token = await loginAsSeed(page)
  let productId: string | undefined
  try {
    await gotoHydrated(page, '/products/new')
    await page
      .getByRole('textbox', { name: 'Nom (requis)', exact: true })
      .fill(`Complete draft ${Date.now()}`)
    await page
      .getByRole('combobox', { name: 'Marque', exact: true })
      .fill(`Draft brand ${Date.now()}`)
    await page.getByRole('textbox', { name: 'Notes', exact: true }).click()
    await page.getByRole('button', { name: 'Oui', exact: true }).click()
    await page
      .getByRole('radiogroup', { name: 'Type de produit', exact: true })
      .locator('label', { hasText: 'Sérum' })
      .click()
    await page
      .getByRole('radiogroup', { name: 'Conditionnement du produit', exact: true })
      .locator('label', { hasText: 'Pompe' })
      .click()
    await page.getByRole('combobox', { name: 'Rechercher un ingrédient', exact: true }).click()
    await page
      .getByRole('combobox', { name: 'Rechercher un ingrédient', exact: true })
      .fill('niacinamide')
    await page.getByRole('option', { name: 'Niacinamide actif', exact: true }).click()
    await page.getByRole('spinbutton', { name: 'Dose de Niacinamide', exact: true }).fill('5')
    await page
      .getByRole('combobox', { name: 'Unité pour Niacinamide', exact: true })
      .selectOption('%')
    const release = Promise.withResolvers<void>()
    const started = Promise.withResolvers<void>()
    let creates = 0
    await page.route('**/api/products', async (route) => {
      if (route.request().method() === 'POST') {
        creates++
        started.resolve()
        await release.promise
      }
      await route.continue()
    })
    const responsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        new URL(response.url()).pathname === '/api/products'
    )
    await page.getByRole('button', { name: 'Créer le produit', exact: true }).click()
    await started.promise
    await expect(page.getByRole('button', { name: 'Création…', exact: true })).toBeDisabled()
    await expect(
      page.getByRole('spinbutton', { name: 'Dose de Niacinamide', exact: true })
    ).toBeDisabled()
    release.resolve()
    const response = await responsePromise
    expect(response.status()).toBe(201)
    const saved = (await response.json()).data
    productId = saved.id
    await expect(page).toHaveURL(new RegExp(`/products/${saved.slug}$`))
    expect(creates).toBe(1)
    const detail = (
      await (
        await page.request.get(`/api/products/${saved.slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).json()
    ).data
    expect(detail.ingredients).toContainEqual(
      expect.objectContaining({ concentrationValue: '5', concentrationUnit: '%' })
    )
  } finally {
    if (productId) await deleteProduct(page, token, productId)
  }
})

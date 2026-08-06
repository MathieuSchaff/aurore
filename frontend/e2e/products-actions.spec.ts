import { expect, type Page, test } from '@playwright/test'

import { loginAsPersona } from './helpers/auth'
import { deleteProduct, loginAndGetToken } from './helpers/catalog'
import { gotoHydrated, gotoProductsSettled, gotoSettled } from './helpers/hydration'
import { mockJson } from './helpers/network'

// Frontend talks to /api/* through the Vite dev proxy on the same origin.
function isApi(req: { url(): string }, path: string): boolean {
  return req.url().endsWith(`/api${path}`)
}

async function shelfIds(page: Page, token: string): Promise<string[]> {
  const res = await page.request.get('/api/user-products', {
    headers: { authorization: `Bearer ${token}` },
  })
  expect(res.ok(), `shelf read failed (${res.status()})`).toBe(true)
  return ((await res.json()).data as { id: string }[]).map((row) => row.id)
}

// These tests add products to a shelf for real. Two consequences, both of which took the
// whole "Ajouter" describe down once the shelf had grown: a shared account lets the three
// browser projects clobber each other (one persona per project fixes that), and a shelf
// that is never emptied eventually owns every card on page 1, leaving no "Ajouter" button
// to click at all. So each test reverts exactly what it added, nothing else.
let personaToken = ''
let shelfBefore: string[] = []

test.beforeEach(async ({ page, browserName }) => {
  personaToken = await loginAsPersona(page, browserName)
  shelfBefore = await shelfIds(page, personaToken)
})

test.afterEach(async ({ page }) => {
  const auth = { authorization: `Bearer ${personaToken}` }
  for (const id of await shelfIds(page, personaToken)) {
    if (shelfBefore.includes(id)) continue
    await page.request.delete(`/api/user-products/${id}`, { headers: auth })
  }
})

test.describe('Products page: "Ajouter" modal', () => {
  test('opens modal with product info and a status grid', async ({ page }) => {
    // This test compares text captured from the card to text in the dialog, so it needs
    // the products list refetch triggered by the profile-filter reflow to have landed too,
    // not just the URL. See gotoProductsSettled.
    await gotoProductsSettled(page, '/products?sort=name')

    const card = page
      .locator('.list-card--product')
      .filter({ has: page.getByRole('button', { name: /^Ajouter / }) })
      .first()
    await expect(card).toBeVisible({ timeout: 15_000 })

    const productName = await card.locator('.list-card__name').innerText()
    const brand = await card.locator('.list-card__brand').innerText()

    await card.getByRole('button', { name: /^Ajouter / }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { name: 'Ajouter à la collection' })).toBeVisible()
    await expect(dialog.getByText(`${productName} · ${brand}`)).toBeVisible()

    for (const label of ['En stock', 'Liste de souhaits', 'Garde un œil', 'Archivé', 'Évité']) {
      await expect(dialog.getByRole('button', { name: label, exact: true })).toBeVisible()
    }
  })

  test('"Liste de souhaits" sends one POST /user-products with status=wishlist', async ({
    page,
  }) => {
    await gotoSettled(page, '/products?sort=name')
    const card = page
      .locator('.list-card--product')
      .filter({ has: page.getByRole('button', { name: /^Ajouter / }) })
      .first()
    await expect(card).toBeVisible({ timeout: 15_000 })
    await card.getByRole('button', { name: /^Ajouter / }).click()

    const dialog = page.getByRole('dialog')

    const postPromise = page.waitForRequest(
      (req) => req.method() === 'POST' && isApi(req, '/user-products')
    )

    await dialog.getByRole('button', { name: 'Liste de souhaits', exact: true }).click()

    const req = await postPromise
    const body = req.postDataJSON()
    expect(body.status).toBe('wishlist')
    expect(body.productId).toMatch(/^[0-9a-f-]{36}$/)
    expect(req.headers().authorization).toMatch(/^Bearer /)

    await expect(dialog).toBeHidden({ timeout: 5_000 })
  })

  test('"En stock" goes to purchase step then POSTs user-products + purchases', async ({
    page,
  }) => {
    await gotoSettled(page, '/products?sort=name')
    const card = page
      .locator('.list-card--product')
      .filter({ has: page.getByRole('button', { name: /^Ajouter / }) })
      .first()
    await expect(card).toBeVisible({ timeout: 15_000 })
    await card.getByRole('button', { name: /^Ajouter / }).click()

    const dialog = page.getByRole('dialog')
    await dialog.getByRole('button', { name: 'En stock', exact: true }).click()

    // Purchase step UI
    await expect(dialog.getByRole('heading', { name: 'Achat' })).toBeVisible()
    const dateInput = dialog.getByLabel("Date d'achat")
    await expect(dateInput).toBeVisible()
    await expect(dateInput).toHaveValue(/^\d{4}-\d{2}-\d{2}$/)

    const priceInput = dialog.getByLabel('Prix payé (€)', { exact: false })
    await priceInput.fill('19.90')
    await dateInput.fill('2026-04-20')

    const userProductPromise = page.waitForRequest(
      (req) => req.method() === 'POST' && isApi(req, '/user-products')
    )
    const purchasePromise = page.waitForRequest(
      (req) =>
        req.method() === 'POST' && /\/api\/user-products\/[0-9a-f-]{36}\/purchases$/.test(req.url())
    )

    await dialog.getByRole('button', { name: 'Ajouter', exact: true }).click()

    const upReq = await userProductPromise
    expect(upReq.postDataJSON()).toMatchObject({ status: 'in_stock' })

    const purchaseReq = await purchasePromise
    const purchaseBody = purchaseReq.postDataJSON()
    expect(purchaseBody.pricePaidCents).toBe(1990)
    // purchasedAt is serialized as an ISO 8601 UTC timestamp.
    expect(purchaseBody.purchasedAt).toMatch(/^2026-04-20/)

    await expect(dialog).toBeHidden({ timeout: 5_000 })
  })

  test('"Retour" from purchase step returns to status grid', async ({ page }) => {
    await gotoSettled(page, '/products?sort=name')
    const card = page
      .locator('.list-card--product')
      .filter({ has: page.getByRole('button', { name: /^Ajouter / }) })
      .first()
    await expect(card).toBeVisible({ timeout: 15_000 })
    await card.getByRole('button', { name: /^Ajouter / }).click()

    const dialog = page.getByRole('dialog')
    await dialog.getByRole('button', { name: 'En stock', exact: true }).click()
    await expect(dialog.getByRole('heading', { name: 'Achat' })).toBeVisible()

    await dialog.getByRole('button', { name: 'Retour' }).click()

    await expect(dialog.getByRole('heading', { name: 'Ajouter à la collection' })).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'En stock', exact: true })).toBeVisible()
  })

  test('close button dismisses modal without firing any POST', async ({ page }) => {
    await gotoSettled(page, '/products?sort=name')
    const card = page
      .locator('.list-card--product')
      .filter({ has: page.getByRole('button', { name: /^Ajouter / }) })
      .first()
    await expect(card).toBeVisible({ timeout: 15_000 })
    await card.getByRole('button', { name: /^Ajouter / }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    let posted = false
    page.on('request', (req) => {
      if (req.method() === 'POST' && req.url().includes('/api/user-products')) posted = true
    })

    await dialog.getByRole('button', { name: 'Fermer' }).click()

    await expect(dialog).toBeHidden()
    expect(posted).toBe(false)
  })
})

test.describe('Products page: "Créer" → /products/new', () => {
  test('"Créer" link navigates to the create form', async ({ page }) => {
    await gotoSettled(page, '/products')

    await page.getByRole('link', { name: 'Créer un produit', exact: true }).click()

    await expect(page).toHaveURL(/\/products\/new/)
    await expect(page.getByRole('heading', { name: 'Nouveau produit' })).toBeVisible()
  })

  test('submit is disabled until required fields + brand confirmed', async ({ page }) => {
    await gotoHydrated(page, '/products/new')

    const submit = page.getByRole('button', { name: /^Créer le produit$|^Création…$/ })
    await expect(submit).toBeDisabled()

    await page.locator('#edit-name').fill('E2E Test Serum')
    await expect(submit).toBeDisabled()

    // Type a never-seen brand, blur fires the unknown-brand confirm prompt.
    const brandInput = page.locator('#product-form-brand')
    await brandInput.fill(`E2E Brand ${Date.now()}`)
    await brandInput.blur()
    await page.getByRole('button', { name: 'Oui', exact: true }).click()

    await page
      .getByRole('radiogroup', { name: 'Type de produit' })
      .locator('label', { hasText: 'Sérum' })
      .click()
    await expect(submit).toBeDisabled()

    await page
      .getByRole('radiogroup', { name: 'Conditionnement du produit' })
      .locator('label', { hasText: 'Pompe' })
      .click()
    await expect(submit).toBeEnabled()
  })

  test('submitting creates a product, sends correct payload, navigates to detail', async ({
    page,
  }) => {
    await gotoHydrated(page, '/products/new')

    const stamp = Date.now()
    const name = `E2E Serum ${stamp}`
    const brand = `E2E Brand ${stamp}`

    await page.locator('#edit-name').fill(name)

    const brandInput = page.locator('#product-form-brand')
    await brandInput.fill(brand)
    await brandInput.blur()
    await page.getByRole('button', { name: 'Oui', exact: true }).click()

    await page
      .getByRole('radiogroup', { name: 'Type de produit' })
      .locator('label', { hasText: 'Sérum' })
      .click()
    await page
      .getByRole('radiogroup', { name: 'Conditionnement du produit' })
      .locator('label', { hasText: 'Pompe' })
      .click()
    await page.locator('#edit-total-amount').fill('30')
    await page.getByRole('combobox', { name: 'Unité de contenance' }).selectOption('ml')
    await page.locator('#edit-price').fill('29.90')

    const postPromise = page.waitForRequest(
      (req) => req.method() === 'POST' && isApi(req, '/products')
    )
    const createdIdPromise = page
      .waitForResponse(
        (res) => res.request().method() === 'POST' && isApi(res.request(), '/products')
      )
      .then(async (res) => (await res.json()).data.id as string)

    await page.getByRole('button', { name: /^Créer le produit$|^Création…$/ }).click()

    const req = await postPromise
    expect(req.postDataJSON()).toMatchObject({
      name,
      brand,
      category: 'skincare',
      kind: 'serum',
      unit: 'pump',
      totalAmount: 30,
      amountUnit: 'ml',
      priceCents: 2990,
    })

    // ProductCreatePage.onSuccess navigates to /products/<slug>.
    await expect(page).toHaveURL(/\/products\/[^/]+$/, { timeout: 15_000 })
    await expect(page.getByRole('heading', { name })).toBeVisible()

    // The catalogue defaults to sort=newest, so a leftover product would sit first on
    // /products and poison every spec that picks the first card.
    await deleteProduct(page, await loginAndGetToken(page), await createdIdPromise)
  })

  test('server error on create surfaces inline without navigation', async ({ page }) => {
    await gotoHydrated(page, '/products/new')

    const stamp = Date.now()
    await page.locator('#edit-name').fill(`E2E Bogus ${stamp}`)

    const brandInput = page.locator('#product-form-brand')
    await brandInput.fill(`E2E Bogus Brand ${stamp}`)
    await brandInput.blur()
    await page.getByRole('button', { name: 'Oui', exact: true }).click()

    await page
      .getByRole('radiogroup', { name: 'Type de produit' })
      .locator('label', { hasText: 'Sérum' })
      .click()
    await page
      .getByRole('radiogroup', { name: 'Conditionnement du produit' })
      .locator('label', { hasText: 'Pompe' })
      .click()

    // Mock the POST to simulate a server-side validation failure.
    await mockJson(page, '**/api/products', 422, {}, 'POST')

    await page.getByRole('button', { name: /^Créer le produit$|^Création…$/ }).click()

    // Form-level error message appears, no nav.
    await expect(page).toHaveURL(/\/products\/new/)
    await expect(page.locator('.product-edit-form').getByRole('alert').first()).toBeVisible()
  })
})

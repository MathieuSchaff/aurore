import { expect, type Page, test } from '@playwright/test'

import { loginAsSeed } from './helpers/auth'
import { gotoFirstProductDetail, resolveFirstSkincareSlug } from './helpers/catalog'
import { gotoHydrated } from './helpers/hydration'

// Every test here PATCHes a seed product, the same rows for all Playwright projects.
// *.mutation.spec.ts files run only on the single-worker chromium-mutation project
// (playwright.config.ts): under the full matrix, three engines edited those rows
// concurrently and asserted on each other's writes.

test.beforeEach(async ({ page }) => {
  await loginAsSeed(page)
})

test.describe('Product edit: notes', () => {
  test('editing notes PATCHes /api/products/:id and detail shows the new value', async ({
    page,
  }) => {
    const slug = await gotoFirstProductDetail(page)
    await page.getByRole('link', { name: /Modifier/ }).click()
    await expect(page).toHaveURL(new RegExp(`/products/${slug}/edit$`))

    const stamp = Date.now()
    const newNote = `e2e edit ${stamp}`
    const notes = page.locator('#edit-notes')
    await notes.fill(newNote)

    const patchPromise = page.waitForRequest(
      (req) => req.method() === 'PATCH' && /\/api\/products\/[0-9a-f-]{36}$/.test(req.url())
    )

    await page.getByRole('button', { name: /^Enregistrer$|^Enregistrement…$/ }).click()

    const req = await patchPromise
    expect(req.postDataJSON()).toMatchObject({ notes: newNote })
    expect(req.headers().authorization).toMatch(/^Bearer /)

    // ProductForm.onSuccess navigates back to /products/<slug> with the (potentially updated) slug.
    await expect(page).toHaveURL(/\/products\/[^/]+$/, { timeout: 15_000 })
    // Scoped to the detail block: a bare getByText can match the hidden
    // #edit-notes textarea of the form still mounted during the transition.
    await expect(page.locator('.product-notes-block__body')).toHaveText(newNote)
  })

  // Editing notes must omit unchanged fields from the PATCH body. Sending an
  // untouched inci back would validate it again, which 400s legacy data that predates the
  // comma-or-short write rule (long space-separated inci). The omission is the
  // guard, asserted directly here; the backend tests cover the rule + preservation.
  test('editing notes omits the unchanged inci field and does not 400', async ({ page }) => {
    const slug = await gotoFirstProductDetail(page)
    await page.getByRole('link', { name: /Modifier/ }).click()
    await expect(page).toHaveURL(new RegExp(`/products/${slug}/edit$`))

    const newNote = `e2e legacy-inci ${Date.now()}`
    await page.locator('#edit-notes').fill(newNote)

    const patchPromise = page.waitForRequest(
      (req) => req.method() === 'PATCH' && /\/api\/products\/[0-9a-f-]{36}$/.test(req.url())
    )
    const respPromise = page.waitForResponse(
      (res) =>
        res.request().method() === 'PATCH' && /\/api\/products\/[0-9a-f-]{36}$/.test(res.url())
    )
    await page.getByRole('button', { name: /^Enregistrer$|^Enregistrement…$/ }).click()

    const req = await patchPromise
    // Unchanged inci is omitted, not sent back
    expect('inci' in req.postDataJSON()).toBe(false)
    expect((await respPromise).status()).toBe(200)

    await expect(page).toHaveURL(/\/products\/[^/]+$/, { timeout: 15_000 })
    await expect(page.locator('.product-notes-block__body')).toHaveText(newNote)
  })
})

// A legacy value the author never touched used to eat the submit whole. Both
// shapes below are real seed rows, and each failed through a different door: Zod
// validating the untouched inci, and native `min=1` rejecting a totalAmount seeded at 0
// before React saw the event, leaving nothing in the DOM to read.
test.describe('Product edit: untouched legacy fields', () => {
  const LEGACY_ROWS = [
    { slug: 'etude-house-0-2-therapy-air-mask', shape: 'an inci past the 5000-char cap' },
    { slug: 'kravebeauty-100-cold-pressed-tamanu-oil', shape: 'a totalAmount under the min of 1' },
  ]

  for (const { slug, shape } of LEGACY_ROWS) {
    test(`editing notes goes through despite ${shape}`, async ({ page }) => {
      await gotoHydrated(page, `/products/${slug}/edit`)

      const newNote = `e2e legacy ${Date.now()}`
      await page.locator('#edit-notes').fill(newNote)

      const patchPromise = page.waitForRequest(
        (req) => req.method() === 'PATCH' && /\/api\/products\/[0-9a-f-]{36}$/.test(req.url())
      )
      const respPromise = page.waitForResponse(
        (res) =>
          res.request().method() === 'PATCH' && /\/api\/products\/[0-9a-f-]{36}$/.test(res.url())
      )
      await page.getByRole('button', { name: /^Enregistrer$|^Enregistrement…$/ }).click()

      expect((await patchPromise).postDataJSON()).toMatchObject({ notes: newNote })
      expect((await respPromise).status()).toBe(200)

      await expect(page).toHaveURL(/\/products\/[^/]+$/, { timeout: 15_000 })
      await expect(page.locator('.product-notes-block__body')).toHaveText(newNote)
    })
  }
})

test.describe('Product edit: clearing nullable fields', () => {
  // Returns slug + id of the first skincare product, with `url` pre-set to a
  // known sentinel so we have something to clear.
  async function ensureProductWithUrl(
    page: Page,
    sentinel: string
  ): Promise<{ slug: string; id: string }> {
    const slug = await resolveFirstSkincareSlug(page)
    const detail = await page.request.get(`/api/products/${slug}`)
    const id = (await detail.json()).data.id as string
    const token = await loginAsSeed(page)
    const setup = await page.request.patch(`/api/products/${id}`, {
      headers: { authorization: `Bearer ${token}` },
      data: { url: sentinel },
    })
    expect(setup.ok(), `setup PATCH failed (${setup.status()})`).toBe(true)
    return { slug, id }
  }

  test('clearing the url sends url:null and detail no longer shows the link', async ({ page }) => {
    const { slug } = await ensureProductWithUrl(page, 'https://e2e-clear-url.example.com')

    await gotoHydrated(page, `/products/${slug}/edit`)
    await expect(page.locator('#edit-url')).toHaveValue('https://e2e-clear-url.example.com')

    await page.locator('#edit-url').fill('')

    const patchPromise = page.waitForRequest(
      (req) => req.method() === 'PATCH' && /\/api\/products\/[0-9a-f-]{36}$/.test(req.url())
    )
    await page.getByRole('button', { name: /^Enregistrer$|^Enregistrement…$/ }).click()
    const req = await patchPromise

    // The fix: empty input on a previously-set nullable field becomes `null`,
    // not omitted. Backend then clears the column.
    expect(req.postDataJSON()).toMatchObject({ url: null })

    await expect(page).toHaveURL(/\/products\/[^/]+$/, { timeout: 15_000 })

    // Re-fetch the canonical state from the API: url must be null after clear.
    const finalSlug = page.url().split('/').pop() as string
    const after = await page.request.get(`/api/products/${finalSlug}`)
    expect((await after.json()).data.url).toBeNull()
  })

  test('clearing url while editing notes applies BOTH changes', async ({ page }) => {
    const { slug } = await ensureProductWithUrl(page, 'https://e2e-mixed-change.example.com')

    await gotoHydrated(page, `/products/${slug}/edit`)
    await expect(page.locator('#edit-url')).toHaveValue('https://e2e-mixed-change.example.com')

    const newNote = `e2e mixed ${Date.now()}`
    await page.locator('#edit-url').fill('')
    await page.locator('#edit-notes').fill(newNote)

    const patchPromise = page.waitForRequest(
      (req) => req.method() === 'PATCH' && /\/api\/products\/[0-9a-f-]{36}$/.test(req.url())
    )
    await page.getByRole('button', { name: /^Enregistrer$|^Enregistrement…$/ }).click()
    const req = await patchPromise

    // Both fields must be present in the same PATCH body.
    expect(req.postDataJSON()).toMatchObject({ url: null, notes: newNote })

    await expect(page).toHaveURL(/\/products\/[^/]+$/, { timeout: 15_000 })
    await expect(page.locator('.product-notes-block__body')).toHaveText(newNote)

    const finalSlug = page.url().split('/').pop() as string
    const after = await page.request.get(`/api/products/${finalSlug}`)
    const data = (await after.json()).data
    expect(data.url).toBeNull()
    expect(data.notes).toBe(newNote)
  })
})

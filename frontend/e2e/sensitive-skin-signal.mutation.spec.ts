import { expect, test } from '@playwright/test'

import { loginAsSeed } from './helpers/auth'
import { createProduct, deleteProduct } from './helpers/catalog'
import { gotoHydrated } from './helpers/hydration'

test('edits a product without a manufacturer quotation workflow', async ({ page }) => {
  const token = await loginAsSeed(page)
  const fixture = await createProduct(page, token, `Sensitive signal ${Date.now()}`)
  try {
    await gotoHydrated(page, `/products/${fixture.slug}/edit`)
    await expect(
      page.getByRole('textbox', { name: 'Citation du fabricant', exact: true })
    ).toHaveCount(0)
    await expect(page.getByRole('textbox', { name: 'Lien fabricant', exact: true })).toHaveCount(0)
    await page
      .getByRole('textbox', { name: 'Description', exact: true })
      .fill('Formule documentée sans citation fabricant.')
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/products/${fixture.slug}$`))
    await expect(
      page.getByText('Peau sensible : selon le fabricant.', { exact: true })
    ).toHaveCount(0)
  } finally {
    await deleteProduct(page, token, fixture.id)
  }
})

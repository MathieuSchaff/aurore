import { expect, test } from '@playwright/test'

import { deleteTestUser, loginAsSeed, registerFreshUser } from './helpers/auth'
import { createProduct, deleteProduct, hideProduct } from './helpers/catalog'
import { gotoAuthenticatedHydrated } from './helpers/hydration'

test('keeps personal notes editable after a catalogue product is hidden', async ({ page }) => {
  const adminToken = await loginAsSeed(page)
  const { token } = await registerFreshUser(page)
  const product = await createProduct(page, token, `Hidden memory ${crypto.randomUUID()}`)
  try {
    const added = await page.request.post('/api/user-products', {
      headers: { authorization: `Bearer ${token}` },
      data: { productId: product.id, status: 'in_stock', comment: 'Personal memory marker' },
    })
    expect(added.status()).toBe(201)
    await hideProduct(page, adminToken, product.id, 'Fixture moderation')
    await gotoAuthenticatedHydrated(page, '/collection')
    const entry = page.getByRole('region', { name: 'Produit indisponible' })
    await expect(entry).toBeVisible()
    await expect(page.getByText(product.name, { exact: true })).toHaveCount(0)
    await expect(entry.getByLabel('Notes personnelles')).toHaveValue('Personal memory marker')
    await entry.getByLabel('Notes personnelles').fill('Updated personal memory')
    const saved = page.waitForResponse(
      (res) => res.request().method() === 'PATCH' && res.url().includes('/api/user-products/')
    )
    await entry.getByLabel('Notes personnelles').blur()
    expect((await saved).status()).toBe(200)
    await page.reload()
    await expect(entry.getByLabel('Notes personnelles')).toHaveValue('Updated personal memory')
    await entry.getByRole('button', { name: 'Retirer de ma collection' }).click()
    await page
      .getByRole('alertdialog')
      .getByRole('button', { name: 'Retirer', exact: true })
      .click()
    await expect(entry).toHaveCount(0)
  } finally {
    try {
      await deleteProduct(page, adminToken, product.id)
    } finally {
      await deleteTestUser(page, token)
    }
  }
})

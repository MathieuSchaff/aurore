import { expect, test } from '@playwright/test'

import { loginAs, SEED_PASSWORD } from './helpers/auth'
import { gotoAuthenticatedHydrated } from './helpers/hydration'

// Read-only spec on a persona no other spec logs in as. Her wishlist product
// carries an avoid tag (pores-sebum) that her portrait (pores-dilates) bridges
// to, so the sheet has something to say without any route mock
const PERSONA = { email: 'lea@seed.local', password: SEED_PASSWORD }
const PRODUCT_NAME = 'Hydrance Light Crème Hydratante'

test('happy path: the shelf sheet reads the formula with the portrait', async ({ page }) => {
  await loginAs(page, PERSONA, 'persona login')
  await gotoAuthenticatedHydrated(page, '/collection')

  const detailsButton = page.getByRole('button', {
    name: new RegExp(`^Voir les détails de .*${PRODUCT_NAME}`),
  })
  await expect(detailsButton).toBeVisible({ timeout: 15_000 })
  await detailsButton.click()

  const sheet = page.getByRole('dialog')
  await expect(sheet).toBeVisible({ timeout: 10_000 })

  // Only a watched product opens on its formula; a wishlist one keeps it folded
  await sheet.getByRole('button', { name: /Formule & ingrédients/ }).click()

  await expect(sheet.getByText(/Peut ne pas convenir à votre profil cutané/)).toBeVisible({
    timeout: 15_000,
  })
  await expect(sheet.getByRole('heading', { name: 'Lecture de la formule' })).toBeVisible()
  await expect(
    sheet.getByRole('button', {
      name: 'Utiliser un ingrédient de cette formule dans mes recherches',
    })
  ).toBeVisible()
})

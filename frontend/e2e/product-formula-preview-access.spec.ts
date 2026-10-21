import { expect, test } from '@playwright/test'

import { loginAsSeed } from './helpers/auth'
import { loginAsUser } from './helpers/catalog'
import { waitForHydration } from './helpers/hydration'

for (const { role, login, canManageLinks } of [
  { role: 'user', login: loginAsUser, canManageLinks: false },
  { role: 'admin', login: loginAsSeed, canManageLinks: true },
]) {
  test(`reads the formula with role-appropriate controls as ${role}`, async ({ page }) => {
    await login(page)
    await page.goto('/products/new')
    await waitForHydration(page)
    await page
      .getByRole('radiogroup', { name: 'Type de produit' })
      .getByText('Sérum', { exact: true })
      .click()
    await page.locator('#edit-inci').fill('Glycerin, Niacinamide')

    // Hiding the whole preview left the INCI help pointing at an unavailable action
    await page.getByRole('button', { name: 'Analyser la formule', exact: true }).click()
    const preview = page.getByRole('region', { name: 'Lecture de la formule' })
    await expect(
      preview.getByRole('list', { name: 'Ingrédients reliés au catalogue' })
    ).toBeVisible()
    await expect(preview.getByText('Niacinamide', { exact: true })).toBeVisible()
    const actions = preview.getByRole('button', { name: /Ajouter|Tout ajouter/ })
    if (canManageLinks) await expect(actions.first()).toBeVisible()
    else await expect(actions).toHaveCount(0)
  })
}

import { expect, test } from '@playwright/test'

import { registerFreshUser } from './helpers/auth'
import { gotoHydrated } from './helpers/hydration'

// A throwaway account: the seeded personas' portraits are read by other specs
test('happy path: picks a nuance inside a concern family and sees it on the portrait', async ({
  page,
}) => {
  await registerFreshUser(page)
  await gotoHydrated(page, '/profile')

  await page
    .getByRole('complementary', { name: 'Compléter le profil' })
    .getByRole('button', { name: 'Ma peau' })
    .click()

  const rougeurs = page.getByRole('group', { name: 'Rougeurs', exact: true })
  await expect(rougeurs).toBeVisible()
  await rougeurs.getByRole('button', { name: 'Rosacée' }).click()
  await page.getByRole('button', { name: 'Enregistrer' }).click()

  await expect(page.getByRole('button', { name: 'Enregistrer' })).toBeHidden()
  await expect(page.getByText('Rosacée')).toBeVisible()
})

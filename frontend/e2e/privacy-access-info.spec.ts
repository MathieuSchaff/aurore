import { expect, test } from '@playwright/test'

import { waitForHydration } from './helpers/hydration'

test('explains both privacy rights for suspended accounts on the public page', async ({ page }) => {
  await page.goto('/privacy')
  await waitForHydration(page)
  await page.getByText('Version juridique complète (RGPD)', { exact: true }).click()

  for (const label of ['Suppression :', 'Portabilité :']) {
    const right = page.getByRole('listitem').filter({ has: page.getByText(label, { exact: true }) })
    // Profile settings cannot be opened by a suspended account
    await expect(right.getByRole('link', { name: 'écran de suspension' })).toHaveAttribute(
      'href',
      '/auth/banned'
    )
    await expect(right).toContainText('même après expiration de votre session')
    await expect(right).toContainText('email et votre mot de passe')
    await expect(right).toContainText('Google')
  }

  await page.getByRole('link', { name: 'écran de suspension' }).first().click()
  await expect(page).toHaveURL(/\/auth\/banned$/)
})

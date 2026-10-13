import { expect, test } from '@playwright/test'

import { waitForHydration } from './helpers/hydration'

test('confirms Google identity and requires a separate deletion confirmation', async ({ page }) => {
  let authorized = false
  let deletions = 0
  const userId = '00000000-0000-4000-8000-000000000001'
  await page.route('**/api/profile/access/google', (route) =>
    route.fulfill({
      json: {
        success: true,
        data: authorized
          ? { userId, email: 'google@example.com', operation: 'delete-account' }
          : null,
      },
    })
  )
  await page.route('**/api/profile/access/google/start', async (route) => {
    expect(route.request().postDataJSON()).toEqual({ operation: 'delete-account' })
    authorized = true
    await route.fulfill({
      json: { success: true, data: { url: new URL('/auth/banned', page.url()).href } },
    })
  })
  await page.route('**/api/profile/access/google/delete-account', async (route) => {
    expect(route.request().postDataJSON()).toEqual({ userId })
    deletions++
    await route.fulfill({ status: 204 })
  })
  await page.goto('/auth/banned')
  await waitForHydration(page)
  await page.getByRole('button', { name: 'Supprimer avec Google' }).click()
  await expect(page.getByText('Compte confirmé : google@example.com')).toBeVisible()
  expect(deletions).toBe(0)
  await page.getByRole('button', { name: 'Confirmer la suppression du compte Google' }).click()
  await expect(page).toHaveURL(/\/auth\/login/)
  expect(deletions).toBe(1)
})

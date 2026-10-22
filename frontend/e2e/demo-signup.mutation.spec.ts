import { expect, test } from '@playwright/test'

import { deleteTestUser } from './helpers/auth'
import { waitForHydration } from './helpers/hydration'

test('opens signup after leaving the demo from its banner', async ({ page }) => {
  let demoToken: string | undefined
  let demoEnded = false
  page.on('response', (response) => {
    if (new URL(response.url()).pathname === '/api/auth/logout' && response.ok()) {
      demoEnded = true
    }
  })

  try {
    await page.goto('/')
    await waitForHydration(page)
    const demoResponse = page.waitForResponse('**/api/auth/demo')
    await page.getByRole('button', { name: 'Créer un compte de démo', exact: true }).first().click()
    demoToken = (await (await demoResponse).json()).data.accessToken
    await expect(page.getByRole('heading', { name: 'Ma Collection', exact: true })).toBeVisible()

    await expect(page.getByRole('status')).toContainText(/données seront effacées/i)
    await page.getByRole('button', { name: 'Quitter la démo et créer un compte' }).click()

    // A demo is authenticated, so a direct signup link used to bounce to the home page
    await expect(page).toHaveURL(/\/auth\/signup$/)
    await expect(page.getByRole('form', { name: "Formulaire d'inscription" })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toBeVisible()
  } finally {
    if (demoToken && !demoEnded) await deleteTestUser(page, demoToken, 'demo signup cleanup')
  }
})

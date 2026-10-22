import { expect, test } from '@playwright/test'

import { deleteTestUser } from './helpers/auth'
import { gotoHydrated } from './helpers/hydration'

test.use({ viewport: { width: 320, height: 844 } })

test('keeps the demo collection within 320px and opens its formula section', async ({ page }) => {
  let demoToken: string | undefined

  try {
    await gotoHydrated(page, '/auth/login')
    const demoResponse = page.waitForResponse('**/api/auth/demo')
    await page.getByRole('button', { name: 'Essayer la démo', exact: true }).click()
    demoToken = (await (await demoResponse).json()).data.accessToken
    await expect(page.getByRole('heading', { name: 'Ma Collection', exact: true })).toBeVisible()
    await expect(page.getByRole('status')).toContainText(/données seront effacées/i)

    // The grid's content minimum widened the page and displaced clicks inside the sheet
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        )
      )
      .toBeLessThanOrEqual(0)

    const leaveDemo = page.getByRole('button', { name: 'Quitter la démo et créer un compte' })
    await expect(leaveDemo).toBeInViewport({ ratio: 1 })
    await page
      .getByRole('button', { name: /^Voir les détails/ })
      .first()
      .click()

    const sheet = page.getByRole('dialog')
    await expect(sheet).toBeVisible()
    const formula = sheet.getByRole('button', { name: 'Formule & ingrédients', exact: true })
    await formula.click()
    await expect(formula).toHaveAttribute('aria-expanded', 'true')
  } finally {
    if (demoToken) await deleteTestUser(page, demoToken, 'demo layout cleanup')
  }
})

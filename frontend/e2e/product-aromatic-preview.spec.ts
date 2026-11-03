import { expect, test } from '@playwright/test'

import { loginAsSeed } from './helpers/auth'
import { waitForHydration } from './helpers/hydration'

test('withdraws unsupported absence suggestions after adding an undisclosed aroma', async ({
  page,
}) => {
  await loginAsSeed(page)
  await page.goto('/products/new')
  await waitForHydration(page)
  await page
    .getByRole('radiogroup', { name: 'Type de produit' })
    .getByText('Sérum', { exact: true })
    .click()
  const inci = page.locator('#edit-inci')
  const neutral = 'Aqua, Glycerin, Squalane, Panthenol, Tocopherol'
  const preview = page.getByRole('region', { name: 'Lecture de la formule' })
  const suggestions = preview.getByRole('list', { name: 'Tags suggérés', exact: true })
  const analyze = page.getByRole('button', { name: 'Analyser la formule', exact: true })
  const absences = ['Sans parfum', 'Sans allergènes parfumants', 'Sans huiles essentielles']

  await inci.fill(neutral)
  await analyze.click()
  for (const label of absences) {
    await expect(suggestions.getByText(label, { exact: true })).toBeVisible()
  }

  await inci.fill(`${neutral}, Aroma`)
  const response = page.waitForResponse(
    (res) => res.url().endsWith('/products/formula-preview') && res.request().method() === 'POST'
  )
  await analyze.click()
  expect((await response).ok()).toBe(true)
  await expect(preview.getByText('Les champs ont changé depuis la dernière analyse.')).toHaveCount(
    0
  )
  await expect(suggestions.getByText('Sans silicones', { exact: true })).toBeVisible()
  for (const label of absences) {
    await expect(suggestions.getByText(label, { exact: true })).toHaveCount(0)
  }
})

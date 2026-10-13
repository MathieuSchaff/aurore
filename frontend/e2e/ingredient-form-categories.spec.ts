import { expect, test } from '@playwright/test'

import { loginAsSeed } from './helpers/auth'
import { waitForHydration } from './helpers/hydration'

test('offers compatible ingredient categories after a type change', async ({ page }) => {
  await loginAsSeed(page)
  await page.goto('/ingredients/new')
  await waitForHydration(page)

  const category = page.getByRole('combobox', { name: /catégorie/i })
  await category.selectOption('filtre-uv')
  await page
    .getByRole('radiogroup', { name: "Type d'ingrédient" })
    .getByText('Cheveux', { exact: true })
    .click()

  await expect(category).toHaveValue('')
  await expect(category.getByRole('option', { name: /filtres UV/i })).toHaveCount(0)
  await category.selectOption('conditionneur')
  await expect(category).toHaveValue('conditionneur')
  await category.selectOption('')
  await expect(category).toHaveValue('')
})

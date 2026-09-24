import { expect, test } from '@playwright/test'

import { deleteTestUser, registerFreshUser } from './helpers/auth'

// Known populated pair from snapshot/data.sql: they share a common ingredient, so
// the "terroir" band is non-empty (not the "0 commun" path). Anchored regexes are
// dash-agnostic (option label is `${brand} — ${name}`) and pin the exact name.
const PRODUCT_A = /^CeraVe .+ Crème Hydratante$/
const PRODUCT_B = /^Krème .+ Crème Hydratation Intense Bio$/

test('builds a comparison and displays its bands', async ({ page }) => {
  const freshUser = await registerFreshUser(page)
  try {
    await page.goto('/products/compare/new')

    const picker = page.getByRole('combobox', { name: 'Produits à comparer' })
    await expect(picker).toBeVisible({ timeout: 15_000 })

    await picker.fill('CeraVe')
    await page.getByRole('option', { name: PRODUCT_A }).click()
    // commitOption clears the query; the selected chip confirms the pick
    await expect(page.getByRole('button', { name: /^Retirer CeraVe / })).toBeVisible({
      timeout: 10_000,
    })

    await picker.fill('Krème')
    await page.getByRole('option', { name: PRODUCT_B }).click()
    await expect(page.getByRole('button', { name: /^Retirer Krème / })).toBeVisible({
      timeout: 10_000,
    })

    await expect(page.getByText('Sélectionnez au moins 2 produits')).toHaveCount(0)
    await expect(page.getByText('Prêt à comparer')).toBeVisible()

    const saveBtn = page.getByRole('button', { name: 'Enregistrer la comparaison' })
    await expect(saveBtn).toBeEnabled({ timeout: 5_000 })
    await saveBtn.click()
    await expect(page).toHaveURL(/\/products\/compare\/[^/]+$/, { timeout: 20_000 })

    // Hero title is `text-transform: uppercase` in CSS but title-case in the DOM;
    // a case-insensitive regex dodges both the casing and the apostrophe variant
    await expect(page.getByText(/cabinet d.analyse/i)).toBeVisible({ timeout: 15_000 })

    const shelf = page.getByRole('region', { name: 'Produits comparés' })
    await expect(shelf).toBeVisible()
    await expect(shelf.getByText('CeraVe', { exact: true })).toBeVisible()
    await expect(shelf.getByText('Krème', { exact: true })).toBeVisible()

    await expect(
      page.getByRole('note', { name: 'Lecture qualitative de la comparaison' })
    ).toBeVisible()

    await expect(page.getByRole('heading', { name: 'Signaux' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Différences' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Le terroir partagé' })).toBeVisible()

    await expect(
      page.getByText(/Aucun ingrédient n.apparaît dans toutes les formules/)
    ).toHaveCount(0)
  } finally {
    await deleteTestUser(page, freshUser.token)
  }
})

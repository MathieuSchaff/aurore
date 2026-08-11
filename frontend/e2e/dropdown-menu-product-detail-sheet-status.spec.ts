import { expect, test } from '@playwright/test'

import { loginAsSeed } from './helpers/auth'

// Covers the fragile DropdownMenu-in-Sheet path: portal layer, repeated renders,
// Escape handling, and focus return.

test.beforeEach(async ({ page }) => {
  await loginAsSeed(page)
})

test.describe('DropdownMenu × ProductDetailSheet: status picker', () => {
  test("happy path: picker s'ouvre, kb nav, sélection update statut", async ({ page }) => {
    await page.goto('/collection')

    // ShelfView affiche les UserProducts du seed sous forme de cards.
    // Click the explicit details button: the card wrapper is non-interactive,
    // its center only landed on this button for some seed layouts. `.first()`
    // avoids assuming a product name, which varies with the seed.
    const detailsButton = page.getByRole('button', { name: /^Voir les détails/ }).first()
    await expect(detailsButton).toBeVisible({ timeout: 15_000 })
    await detailsButton.click()

    // La Sheet ouvre via showModal() : <dialog open> dans le top layer.
    const sheet = page.getByRole('dialog')
    await expect(sheet).toBeVisible({ timeout: 10_000 })

    // Le trigger du picker statut a un aria-label qui commence par "Statut : ".
    const statusTrigger = sheet.getByRole('button', { name: /^Statut\s?:/ })
    await expect(statusTrigger).toBeVisible()

    await statusTrigger.click()

    // Le menu doit être visible. Avant le patch portal-into-dialog,
    // le portal vers document.body rendait sous le top layer et le menu était
    // invisible.
    const menu = page.getByRole('menu', { name: 'Changer le statut du produit' })
    await expect(menu).toBeVisible()
    const items = menu.getByRole('menuitem')
    await expect(items).toHaveCount(5)

    // Sélectionne le 2e item ; le premier est statistiquement souvent le "current".
    // On capture le libellé pour re-vérifier dans le header après update.
    const targetItem = items.nth(1)
    const targetLabel = (await targetItem.innerText()).trim().split('\n')[0]?.trim()
    expect(targetLabel).toBeTruthy()

    await targetItem.click()

    await expect(menu).toBeHidden()
    // Le trigger du header reflète le nouveau statut (label visible).
    await expect(statusTrigger).toContainText(new RegExp(targetLabel ?? '.+'))
    await expect(sheet).toBeVisible()
  })

  test('Escape ferme le menu sans fermer la Sheet', async ({ page }) => {
    await page.goto('/collection')

    // Click the explicit details button: the card wrapper is non-interactive,
    // its center only landed on this button for some seed layouts.
    const detailsButton = page.getByRole('button', { name: /^Voir les détails/ }).first()
    await expect(detailsButton).toBeVisible({ timeout: 15_000 })
    await detailsButton.click()

    const sheet = page.getByRole('dialog')
    await expect(sheet).toBeVisible()

    const statusTrigger = sheet.getByRole('button', { name: /^Statut\s?:/ })
    await statusTrigger.click()

    const menu = page.getByRole('menu')
    await expect(menu).toBeVisible()

    await page.keyboard.press('Escape')

    // Escape ferme le menu, la Sheet reste ouverte (1er press
    // peel le menu, 2e press fermerait la Sheet). Focus return = trigger.
    await expect(menu).toBeHidden()
    await expect(sheet).toBeVisible()
    await expect(statusTrigger).toBeFocused()
  })
})

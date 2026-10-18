import { expect, test } from '@playwright/test'

import { loginAsSeed } from './helpers/auth'
import { gotoFirstProductDetail } from './helpers/catalog'
import { waitForHydration } from './helpers/hydration'

test('keeps the declared composition, ingredient sheets and discussions reachable', async ({
  page,
}) => {
  await page.route('https://aurore-cdn.b-cdn.net/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" />',
    })
  )
  const slug = await gotoFirstProductDetail(page)

  await expect(page.getByRole('heading', { name: 'Comprendre la formule' })).toBeVisible()
  const composition = page.getByRole('region', { name: /Les \d+ ingrédients|Composition/ })
  await expect(composition.getByRole('button', { name: /Copier la liste/ })).toBeVisible()
  // Keep the pointer down long enough to expose a scroll between press and release
  await composition
    .getByText('Consulter les fiches ingrédients', { exact: true })
    .click({ delay: 100 })
  const firstIngredient = composition.getByRole('link').first()
  await expect(firstIngredient).toBeVisible()
  // Native summary is absent from Playwright's button role selector
  const sheetsToggle = composition
    .locator('summary')
    .filter({ hasText: 'Consulter les fiches ingrédients' })
  await sheetsToggle.click()
  await expect(firstIngredient).toBeHidden()
  await sheetsToggle.focus()
  await sheetsToggle.press('Enter')
  await expect(firstIngredient).toBeVisible()

  await page.getByText('Comment Aurore lit cette formule', { exact: true }).click()
  await expect(page.getByText(/ne constitue pas un test du produit fini/)).toBeVisible()
  await page.getByRole('link', { name: 'Voir les discussions', exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`/products/${slug}/discussions$`))
  await waitForHydration(page)
  await page.getByRole('link', { name: 'Revenir à la fiche produit', exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`/products/${slug}$`))
  await waitForHydration(page)

  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Composition complète', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Réduire la composition', exact: true })
  ).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true
  )
})

test('keeps account and correction actions reachable with doubled text', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await loginAsSeed(page)
  await gotoFirstProductDetail(page)

  const correction = page.getByRole('button', { name: 'Proposer une correction', exact: true })
  const account = page.getByRole('button', { name: 'Menu utilisateur', exact: true })
  await expect(correction).toBeVisible()

  for (const width of [1440, 1280, 1024, 480, 390, 360, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await page.evaluate(() => {
      const root = document.documentElement
      // Reduced motion still animates font-size for 0.01ms in the reset stylesheet
      root.style.transition = 'none'
      root.style.fontSize = ''
      root.style.fontSize = `${Number.parseFloat(getComputedStyle(root).fontSize) * 2}px`
    })

    // Clipped controls can leave scrollWidth unchanged
    await expect
      .poll(() =>
        correction.evaluate((button) => {
          const bounds = button.getBoundingClientRect()
          const rail = button.parentElement?.getBoundingClientRect()
          const label = button.querySelector('span')
          if (!rail || !label) throw new Error('Correction action needs a rail and label')
          const text = document.createRange()
          text.selectNodeContents(label)
          const controls = Array.from(
            document.querySelectorAll('.main-nav button, .main-nav a')
          ).filter((element) => element.getClientRects().length > 0)
          return {
            correctionFits: bounds.left >= rail.left - 1 && bounds.right <= rail.right + 1,
            labelFits: Array.from(text.getClientRects()).every(
              (line) =>
                line.left >= bounds.left - 1 &&
                line.right <= bounds.right + 1 &&
                line.top >= bounds.top - 1 &&
                line.bottom <= bounds.bottom + 1
            ),
            headerFits: controls.every((element) => {
              const control = element.getBoundingClientRect()
              return control.left >= 0 && control.right <= window.innerWidth
            }),
          }
        })
      )
      .toEqual({ correctionFits: true, labelFits: true, headerFits: true })

    if (width === 1024) {
      await page.getByRole('button', { name: 'Ouvrir le menu', exact: true }).click()
      await expect(page.getByRole('dialog', { name: 'Navigation principale' })).toBeVisible()
      await page.getByRole('button', { name: 'Fermer le menu', exact: true }).click()
      await expect(page.getByRole('dialog', { name: 'Navigation principale' })).toBeHidden()
    }
  }

  await account.click()
  const menu = page.getByRole('menu')
  await expect(menu).toBeVisible()
  await expect
    .poll(() =>
      menu.evaluate((element) => {
        const bounds = element.getBoundingClientRect()
        return bounds.left >= 0 && bounds.right <= window.innerWidth
      })
    )
    .toBe(true)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('menu')).toBeHidden()
  await correction.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Annuler', exact: true }).click()
  await expect(page.getByRole('dialog')).toBeHidden()
})

import { expect, test } from '@playwright/test'

import { loginAsPersona } from './helpers/auth'
import { gotoHydrated } from './helpers/hydration'

// Server-mutating spec: one persona per browser project (see helpers/auth.ts),
// final revert keeps the warm e2e stack idempotent across runs.

test('happy path: règles Sans/Avec (geste en contexte, composeur, catalogue filtré)', async ({
  page,
  browserName,
}) => {
  // Long multi-page flow with writes and a final revert. The per-test budget is close
  // to the wall once the whole suite competes for the machine.
  test.slow()

  const token = await loginAsPersona(page, browserName)

  // Idempotent setup: a previous crashed run may have left rules behind (the final
  // revert only runs on success). Wipe both families, not just the ingredient one:
  // the composer can land on the tag "Niacinamide" too, and a surviving tag rule
  // leaves a second identical label that poisons every later run.
  const auth = { authorization: `Bearer ${token}` }
  const targets = (
    await (await page.request.get('/api/profile/preference-targets', { headers: auth })).json()
  ).data as { ingredients: { canonicalKey: string }[]; tags: { tagId: string }[] }
  for (const i of targets.ingredients) {
    const key = encodeURIComponent(i.canonicalKey)
    await page.request.delete(`/api/profile/ingredient-preferences?key=${key}`, { headers: auth })
  }
  for (const t of targets.tags) {
    await page.request.delete(`/api/profile/tag-preferences/${t.tagId}`, { headers: auth })
  }

  // Declare "Sans" from the ingredient page (in-context shortcut).
  await gotoHydrated(page, '/ingredients/niacinamide')
  const sansButton = page.getByRole('button', { name: 'Sans Niacinamide' })
  await expect(sansButton).toBeVisible()
  await expect(sansButton).toHaveAttribute('aria-pressed', 'false')
  await sansButton.click()
  await expect(sansButton).toHaveAttribute('aria-pressed', 'true')

  // Post-gesture confirmation deep-links to the authoritative recap.
  await expect(page.getByText('Ajouté à vos repères')).toBeVisible()
  await page.getByRole('link', { name: 'voir', exact: true }).click()
  await expect(page).toHaveURL(/\/profile/)

  // The recap owns the state: the rule sits in the "Sans" group.
  const marks = page.locator('#reperes')
  await expect(marks.getByRole('heading', { name: 'Mes repères' })).toBeVisible()
  const sansGroup = marks.locator('.preference-marks__group').filter({
    has: page.locator('.preference-marks__subhead', { hasText: 'Sans' }),
  })
  await expect(
    sansGroup.locator('.preference-marks__label', { hasText: 'Niacinamide' })
  ).toBeVisible()

  // Catalogue under "selon mon profil": "Sans" excludes, the banner states the rule.
  // The SSR render is anonymous, so it carries no declared rule and no banner. The banner
  // appears only after the boot refresh fetches the list again with the session. Two hops,
  // which the default 5 s window loses under a loaded worker pool.
  await gotoHydrated(page, '/products?profile_filter=true')
  const banner = page.getByTestId('avoided-banner')
  await expect(banner).toBeVisible({ timeout: 15_000 })
  await expect(banner).toContainText('vos règles : sans : Niacinamide')

  // "Afficher quand même" reverses the exclusion, banner flips, rows come back annotated.
  await banner.getByRole('button', { name: 'Afficher quand même' }).click()
  await expect(banner.getByRole('button', { name: 'Masquer à nouveau' })).toBeVisible()

  // Direct entry in /profile: the verb is the list you add into, so the
  // "Avec" composer is the one under the "Avec" heading.
  await gotoHydrated(page, '/profile')
  await expect(marks.getByRole('heading', { name: 'Mes repères' })).toBeVisible()
  const avecGroup = page
    .locator('.preference-marks__group')
    .filter({ has: page.locator('.preference-marks__subhead', { hasText: 'Avec' }) })
  const avecInput = avecGroup.getByRole('combobox', { name: 'Avec quel ingrédient ou tag ?' })
  // The suggestion list is a fixed-position portal anchored to the input, so it
  // cannot be scrolled into view on its own: bring the input in view first.
  await avecInput.scrollIntoViewIfNeeded()
  await avecInput.fill('niacinamide')
  // The field proposes ingredients and tags under one name, and the tag section
  // renders above the raw results once its deferred taxonomy read lands, so picking
  // "the first option" was a race between the two families.
  await page
    .getByRole('option', { name: 'Niacinamide' })
    .filter({ hasNot: page.locator('.preference-composer__tag-option') })
    .first()
    .click()
  await expect(
    avecGroup.locator('.preference-marks__label', { hasText: 'Niacinamide' })
  ).toBeVisible()

  // "Avec" now filters: rows without the target are masked, the banner says so.
  await gotoHydrated(page, '/products?profile_filter=true')
  await expect(banner).toBeVisible({ timeout: 15_000 })
  await expect(banner).toContainText('avec : Niacinamide')

  // Revert: remove the rule from the recap, list empties.
  await gotoHydrated(page, '/profile')
  await page.locator('#reperes').getByRole('button', { name: 'Retirer Niacinamide' }).click()
  // Scoped to list labels: the empty state's invitation copy mentions
  // "niacinamide" and getByText matches case-insensitively.
  await expect(
    page.locator('#reperes').locator('.preference-marks__label', { hasText: 'Niacinamide' })
  ).toHaveCount(0)
})

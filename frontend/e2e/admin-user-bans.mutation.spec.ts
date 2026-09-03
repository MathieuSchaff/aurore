import type { AdminBanListItem, AdminUserAccount, CreateBanResponse } from '@aurore/shared'

import { expect, test } from '@playwright/test'

import { loginAsSeed } from './helpers/auth'
import { gotoHydrated } from './helpers/hydration'

function bearer(token: string) {
  return { authorization: `Bearer ${token}` }
}

test('creates and lifts a user publication pause through the admin UI', async ({ page }) => {
  const token = await loginAsSeed(page)
  const usersResponse = await page.request.get('/api/admin/users', {
    headers: bearer(token),
  })
  expect(usersResponse.ok(), `users lookup failed (${usersResponse.status()})`).toBe(true)
  const users = (await usersResponse.json()).data.items as AdminUserAccount[]
  const target = users.find((user) => user.email === 'anna@seed.local')
  expect(target, 'anna seed account missing from admin directory').toBeDefined()
  if (!target) return

  const reason = `E2E pause ${Date.now()}`
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const expiresLocal = expiresAt.toISOString().slice(0, 16)

  try {
    await gotoHydrated(page, `/admin/users/${target.id}`)
    await expect(page.getByRole('heading', { name: target.email })).toBeVisible()

    await page.getByLabel('Portée').selectOption('social_post')
    await page.getByLabel('Expire le (optionnel)').fill(expiresLocal)
    await page.locator('textarea').fill(reason)

    await page.getByRole('button', { name: 'Mettre en pause' }).click()
    const createResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        new URL(response.url()).pathname === `/api/admin/users/${target.id}/bans`
    )
    await page.getByRole('alertdialog').getByRole('button', { name: 'Mettre en pause' }).click()

    const createResponse = await createResponsePromise
    expect(createResponse.status()).toBe(201)
    const created = (await createResponse.json()).data as CreateBanResponse

    await expect(page.getByText('Mise en pause appliquée.')).toBeVisible()
    const row = page.getByRole('row', { name: new RegExp(reason) })
    await expect(row).toBeVisible()
    await expect(row).toContainText('Publication sociale')
    await expect(row).toContainText('Active')

    await row.getByRole('button', { name: 'Lever' }).click()
    const liftResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === 'DELETE' &&
        new URL(response.url()).pathname === `/api/admin/bans/${created.id}`
    )
    await page.getByRole('alertdialog').getByRole('button', { name: 'Lever' }).click()

    expect((await liftResponsePromise).status()).toBe(200)
    await expect(page.getByText('Pause levée.')).toBeVisible()
    await expect(row).toHaveCount(0)
  } finally {
    const listResponse = await page.request.get(`/api/admin/users/${target.id}/bans`, {
      headers: bearer(token),
    })
    expect(listResponse.ok(), `ban cleanup lookup failed (${listResponse.status()})`).toBe(true)
    const bans = (await listResponse.json()).data as AdminBanListItem[]

    for (const ban of bans.filter((item) => item.reason === reason && item.status === 'active')) {
      // Lifting leaves an append only moderation audit row and the isolated E2E stack reset owns that residue
      const cleanup = await page.request.delete(`/api/admin/bans/${ban.id}`, {
        headers: bearer(token),
      })
      expect(cleanup.ok(), `ban cleanup failed (${cleanup.status()})`).toBe(true)
    }

    const verifyResponse = await page.request.get(`/api/admin/users/${target.id}/bans`, {
      headers: bearer(token),
    })
    expect(
      verifyResponse.ok(),
      `ban cleanup verification failed (${verifyResponse.status()})`
    ).toBe(true)
    const remaining = (await verifyResponse.json()).data as AdminBanListItem[]
    expect(remaining.some((ban) => ban.reason === reason && ban.status === 'active')).toBe(false)
  }
})

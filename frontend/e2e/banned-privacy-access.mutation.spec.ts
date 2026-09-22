import { expect, test } from '@playwright/test'

import { deleteTestUser, loginAsSeed, registerFreshUser } from './helpers/auth'
import { gotoHydrated } from './helpers/hydration'

test('exports and deletes a suspended account after its session is gone', async ({
  page,
  context,
}) => {
  const adminToken = await loginAsSeed(page)
  const { credentials, token } = await registerFreshUser(page)
  let deleted = false
  try {
    const identity = await page.request.get('/api/auth/session', {
      headers: { authorization: `Bearer ${token}` },
    })
    const userId: string = (await identity.json()).data.userId
    const ban = await page.request.post(`/api/admin/users/${userId}/bans`, {
      headers: { authorization: `Bearer ${adminToken}` },
      data: { scope: 'global' },
    })
    expect(ban.status()).toBe(201)
    await context.clearCookies()
    await gotoHydrated(page, '/auth/banned')
    await page.getByLabel('Adresse email', { exact: true }).fill(credentials.email)
    await page.getByLabel('Mot de passe', { exact: true }).fill(credentials.password)
    const download = page.waitForEvent('download')
    await page.getByRole('button', { name: /Exporter mes données/ }).click()
    expect((await download).suggestedFilename()).toMatch(/^aurore-export-/)
    await page.getByRole('button', { name: /Supprimer mon compte/ }).click()
    const response = page.waitForResponse((res) =>
      res.url().endsWith('/api/profile/access/delete-account')
    )
    await page.getByRole('button', { name: /Confirmer la suppression/ }).click()
    expect((await response).status()).toBe(204)
    deleted = true
    await expect(page).toHaveURL(/\/auth\/login/)
  } finally {
    if (!deleted) await deleteTestUser(page, token)
  }
})

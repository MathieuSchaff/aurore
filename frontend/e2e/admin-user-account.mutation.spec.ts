import type { AdminUserAccount, RoleRequestView } from '@aurore/shared'

import { expect, test } from '@playwright/test'

import { loginAsSeed, registerFreshUser } from './helpers/auth'
import { gotoHydrated } from './helpers/hydration'

function bearer(token: string) {
  return { authorization: `Bearer ${token}` }
}

test('forces and restores profile visibility, then demotes a contributor through the admin UI', async ({
  page,
}) => {
  const freshUser = await registerFreshUser(page)
  const marker = `E2E compte admin ${Date.now()}`
  let adminToken: string | undefined
  let targetId: string | undefined

  try {
    const requestResponse = await page.request.post('/api/role-requests', {
      headers: bearer(freshUser.token),
      data: { motivation: `${marker} pour contribuer au catalogue` },
    })
    expect(requestResponse.ok(), `role request setup failed (${requestResponse.status()})`).toBe(
      true
    )
    const roleRequest = (await requestResponse.json()).data as RoleRequestView
    targetId = roleRequest.userId

    adminToken = await loginAsSeed(page)
    const approvalResponse = await page.request.patch(
      `/api/admin/role-requests/${roleRequest.id}`,
      {
        headers: bearer(adminToken),
        data: { decision: 'approve' },
      }
    )
    expect(approvalResponse.ok(), `role approval setup failed (${approvalResponse.status()})`).toBe(
      true
    )

    await gotoHydrated(page, `/admin/users/${targetId}`)
    await expect(page.getByRole('heading', { name: freshUser.credentials.email })).toBeVisible()
    await expect(page.getByText(/Modérateur.*email non vérifié/)).toBeVisible()

    const visibility = page.getByRole('switch', { name: /Forcer le profil en privé/ })
    const visibilityControl = page.locator('label').filter({ has: visibility })
    await expect(visibility).not.toBeChecked()
    await visibilityControl.click()
    const forceDialog = page.getByRole('alertdialog')
    await expect(forceDialog).toContainText('Ses avis et publications publiques seront masqués')
    const forceResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === 'PATCH' &&
        new URL(response.url()).pathname === `/api/admin/moderation/profiles/${targetId}/visibility`
    )
    await forceDialog.getByRole('button', { name: 'Forcer en privé' }).click()

    expect((await forceResponsePromise).status()).toBe(200)
    await expect(page.getByText('Profil forcé en privé.')).toBeVisible()
    await expect(visibility).toBeChecked()

    await visibilityControl.click()
    const restoreDialog = page.getByRole('alertdialog')
    await expect(restoreDialog).toContainText('Ses avis, publications et pseudonyme retrouveront')
    const restoreResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === 'PATCH' &&
        new URL(response.url()).pathname === `/api/admin/moderation/profiles/${targetId}/visibility`
    )
    await restoreDialog.getByRole('button', { name: 'Lever' }).click()

    expect((await restoreResponsePromise).status()).toBe(200)
    await expect(page.getByText('Forçage levé.')).toBeVisible()
    await expect(visibility).not.toBeChecked()

    const demoteButton = page.getByRole('button', { name: 'Rétrograder en utilisateur' })
    const roleCard = page.getByRole('region', { name: 'Rôle' })
    await roleCard.getByLabel('Raison (optionnel)').fill(marker)
    await demoteButton.click()
    const demoteDialog = page.getByRole('alertdialog')
    await expect(demoteDialog).toContainText('droits de modération et de curation')
    const demoteResponsePromise = page.waitForResponse(
      (response) =>
        response.request().method() === 'PATCH' &&
        new URL(response.url()).pathname === `/api/admin/users/${targetId}/role`
    )
    await demoteDialog.getByRole('button', { name: 'Rétrograder' }).click()

    expect((await demoteResponsePromise).status()).toBe(200)
    await expect(demoteButton).toHaveCount(0)
    await expect(page.getByText(/Utilisateur.*email non vérifié/)).toBeVisible()

    const verifyResponse = await page.request.get(`/api/admin/users/${targetId}`, {
      headers: bearer(adminToken),
    })
    expect(
      verifyResponse.ok(),
      `admin account verification failed (${verifyResponse.status()})`
    ).toBe(true)
    const account = (await verifyResponse.json()).data as AdminUserAccount
    expect(account.role).toBe('user')
    expect(account.forcedPrivateByAdmin).toBe(false)
  } finally {
    const cleanup = await page.request.delete('/api/profile/deleteUser', {
      headers: bearer(freshUser.token),
    })
    expect(cleanup.status(), 'fresh admin account cleanup failed').toBe(204)

    if (adminToken && targetId) {
      const cleanupVerification = await page.request.get(`/api/admin/users/${targetId}`, {
        headers: bearer(adminToken),
      })
      expect(cleanupVerification.status(), 'fresh admin account still exists').toBe(404)
    }
  }
})

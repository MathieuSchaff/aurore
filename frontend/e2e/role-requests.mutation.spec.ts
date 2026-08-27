import type { RoleRequestView } from '@aurore/shared'

import { expect, test } from '@playwright/test'

import { loginAs, loginAsSeed, registerFreshUser } from './helpers/auth'
import { gotoAuthenticatedHydrated } from './helpers/hydration'

// Real end to end path has no external API to mock
// Account deletion removes the request so reruns leave no row
test.describe('Role request: demande modérateur', () => {
  test('happy path: user submits, admin approves', async ({ page }) => {
    const marker = `E2E motivation ${Date.now()} aide a verifier le catalogue`
    const freshUser = await registerFreshUser(page)

    try {
      await page.goto('/profile')
      await page.getByRole('tab', { name: 'Compte' }).click()

      await expect(page.getByRole('heading', { name: 'Devenir modérateur' })).toBeVisible()
      // Users without a previous request get a quiet opt in button
      await page.getByRole('button', { name: 'Je veux contribuer' }).click()
      await page.getByLabel('Votre motivation').fill(marker)
      await page.getByRole('button', { name: 'Envoyer la demande' }).click()

      await expect(page.getByRole('button', { name: 'Annuler ma demande' })).toBeVisible({
        timeout: 15_000,
      })

      // Full navigation restarts the app so silent refresh reads the admin cookie
      // Client navigation would retain the plain user role and redirect
      await loginAsSeed(page)
      await page.goto('/admin/role-requests')

      await expect(page.getByRole('heading', { name: 'Demandes modérateur' })).toBeVisible()
      const row = page.locator('tr', { hasText: marker })
      await expect(row).toBeVisible({ timeout: 15_000 })

      await row.getByRole('button', { name: 'Approuver' }).click()
      await page.getByRole('alertdialog').getByRole('button', { name: 'Approuver' }).click()

      await expect(page.getByText('Demande approuvée', { exact: false })).toBeVisible()

      const contributorToken = await loginAs(page, freshUser.credentials, 'promoted user login')
      const sessionResponse = await page.request.get('/api/auth/session', {
        headers: { authorization: `Bearer ${contributorToken}` },
      })
      expect(sessionResponse.ok(), `session read failed (${sessionResponse.status()})`).toBe(true)
      expect((await sessionResponse.json()).data.role).toBe('contributor')
    } finally {
      const cleanup = await page.request.delete('/api/profile/deleteUser', {
        headers: { authorization: `Bearer ${freshUser.token}` },
      })
      expect(cleanup.status(), 'fresh role request account cleanup failed').toBe(204)
    }
  })

  test('lets a demoted contributor submit a new request after session renewal', async ({
    page,
  }) => {
    const marker = `E2E nouvelle demande ${Date.now()}`
    const freshUser = await registerFreshUser(page)
    let cleanupToken = freshUser.token

    try {
      const requestResponse = await page.request.post('/api/role-requests', {
        headers: { authorization: `Bearer ${freshUser.token}` },
        data: { motivation: `${marker} candidature initiale` },
      })
      expect(requestResponse.ok(), `role request setup failed (${requestResponse.status()})`).toBe(
        true
      )
      const roleRequest = (await requestResponse.json()).data as RoleRequestView

      const adminToken = await loginAsSeed(page)
      const approvalResponse = await page.request.patch(
        `/api/admin/role-requests/${roleRequest.id}`,
        {
          headers: { authorization: `Bearer ${adminToken}` },
          data: { decision: 'approve' },
        }
      )
      expect(
        approvalResponse.ok(),
        `role approval setup failed (${approvalResponse.status()})`
      ).toBe(true)

      const demotionResponse = await page.request.patch(
        `/api/admin/users/${roleRequest.userId}/role`,
        {
          headers: { authorization: `Bearer ${adminToken}` },
          data: { role: 'user', reason: 'E2E role reapplication' },
        }
      )
      expect(demotionResponse.ok(), `role demotion failed (${demotionResponse.status()})`).toBe(
        true
      )

      cleanupToken = await loginAs(page, freshUser.credentials, 'demoted user login')
      await gotoAuthenticatedHydrated(page, '/profile')
      await page.getByRole('tab', { name: 'Compte' }).click()

      await expect(page.getByRole('heading', { name: 'Devenir modérateur' })).toBeVisible()
      const applyButton = page.getByRole('button', { name: 'Je veux contribuer' })
      await expect(applyButton).toBeVisible()
      await applyButton.click()
      const resubmissionMarker = `${marker} après rétrogradation`
      await page.getByLabel('Votre motivation').fill(resubmissionMarker)
      const resubmissionResponsePromise = page.waitForResponse(
        (response) =>
          response.request().method() === 'POST' &&
          new URL(response.url()).pathname === '/api/role-requests'
      )
      await page.getByRole('button', { name: 'Envoyer la demande' }).click()

      const resubmissionResponse = await resubmissionResponsePromise
      expect(
        resubmissionResponse.ok(),
        `resubmission failed (${resubmissionResponse.status()})`
      ).toBe(true)
      const resubmission = (await resubmissionResponse.json()).data as RoleRequestView
      expect(resubmission).toMatchObject({ motivation: resubmissionMarker, status: 'pending' })
      await expect(page.getByRole('button', { name: 'Annuler ma demande' })).toBeVisible()
    } finally {
      const cleanup = await page.request.delete('/api/profile/deleteUser', {
        headers: { authorization: `Bearer ${cleanupToken}` },
      })
      expect(cleanup.status(), 'demoted role request account cleanup failed').toBe(204)
    }
  })
})

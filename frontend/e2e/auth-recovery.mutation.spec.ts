import { expect, test } from '@playwright/test'

import { createAuthTestToken, deleteTestUser, registerFreshUser } from './helpers/auth'
import { gotoHydrated, waitForHydration } from './helpers/hydration'

test.describe('Auth: recovery and verification', () => {
  test('submits a forgot-password request and shows the neutral confirmation', async ({ page }) => {
    await gotoHydrated(page, '/auth/forgot-password')

    const submittedRequest = page.waitForRequest(
      (request) =>
        request.method() === 'POST' &&
        new URL(request.url()).pathname === '/api/auth/forgot-password'
    )
    await page.getByLabel('Email', { exact: true }).fill('recovery@example.com')
    await page.getByRole('button', { name: 'Envoyer le lien' }).click()

    await expect(page.getByRole('heading', { name: 'Vérifiez votre email' })).toBeVisible()
    expect((await submittedRequest).postDataJSON()).toEqual({ email: 'recovery@example.com' })
  })

  test('submits a real password-reset token and returns to login', async ({ page }) => {
    const freshUser = await registerFreshUser(page)
    try {
      const token = await createAuthTestToken(page, freshUser.credentials.email, 'password-reset')
      await page.context().clearCookies()
      await gotoHydrated(page, `/auth/reset-password?token=${token}`)

      await page.getByLabel('Nouveau mot de passe', { exact: true }).fill('NewPassword12!')
      await page.getByLabel('Confirmer le mot de passe', { exact: true }).fill('NewPassword12!')
      await page.getByRole('button', { name: 'Réinitialiser' }).click()

      await expect(page).toHaveURL(/\/auth\/login/)
    } finally {
      await deleteTestUser(page, freshUser.token, 'password reset account cleanup')
    }
  })

  test('verifies an email through the backend before the first UI login', async ({ page }) => {
    const freshUser = await registerFreshUser(page)
    try {
      const token = await createAuthTestToken(page, freshUser.credentials.email, 'verification')
      await page.context().clearCookies()
      await page.goto(`/auth/verify-email?token=${token}`)

      await expect(page).toHaveURL(/\/auth\/login\?redirect=%2Fprofile/, { timeout: 15_000 })
      await waitForHydration(page)
      await page.getByLabel('Email', { exact: true }).fill(freshUser.credentials.email)
      await page.getByLabel('Mot de passe', { exact: true }).fill(freshUser.credentials.password)
      await page.getByRole('button', { name: 'Se connecter', exact: true }).click()

      await expect(page).toHaveURL(/\/profile/, { timeout: 15_000 })
      await expect(page.getByRole('complementary', { name: 'Compléter le profil' })).toBeVisible()
    } finally {
      await deleteTestUser(page, freshUser.token, 'verification account cleanup')
    }
  })

  test('shows the invalid-link state when the backend rejects verification', async ({ page }) => {
    const verificationResponse = page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        new URL(response.url()).pathname === '/api/auth/verify-email'
    )
    await page.goto(`/auth/verify-email?token=${'f'.repeat(64)}`)

    // Cold client imports can exhaust the DOM assertion before verification starts
    expect((await verificationResponse).status()).toBe(400)
    await expect(page.getByRole('heading', { name: 'Lien invalide' })).toBeVisible()
    await expect(page.getByText('Ce lien de vérification est invalide.')).toBeVisible()
  })

  test('requests a fresh verification link from a real expired token', async ({ page }) => {
    const freshUser = await registerFreshUser(page)
    try {
      const token = await createAuthTestToken(
        page,
        freshUser.credentials.email,
        'verification',
        true
      )
      await page.context().clearCookies()
      await gotoHydrated(page, `/auth/verify-email?token=${token}`)

      await page.getByRole('button', { name: 'Demander un nouveau lien' }).click()

      await expect(page.getByText('Email envoyé ! Vérifiez votre boîte mail.')).toBeVisible()
    } finally {
      await deleteTestUser(page, freshUser.token, 'verification resend account cleanup')
    }
  })
})

import { expect, test } from '@playwright/test'

test.describe('Auth: recovery and verification', () => {
  test('submits a forgot-password request and shows the neutral confirmation', async ({ page }) => {
    let submittedBody: unknown
    await page.route('**/api/auth/forgot-password', async (route) => {
      submittedBody = route.request().postDataJSON()
      await route.fulfill({ json: { success: true, data: { pending: true } } })
    })
    await page.goto('/auth/forgot-password')

    await page.getByLabel('Email', { exact: true }).fill('recovery@example.com')
    await page.getByRole('button', { name: 'Envoyer le lien' }).click()

    await expect(page.getByRole('heading', { name: 'Vérifiez votre email' })).toBeVisible()
    expect(submittedBody).toEqual({ email: 'recovery@example.com' })
  })

  test('resets a password from the URL token and returns to login', async ({ page }) => {
    let submittedBody: unknown
    await page.route('**/api/auth/reset-password', async (route) => {
      submittedBody = route.request().postDataJSON()
      await route.fulfill({ json: { success: true, data: null } })
    })
    await page.goto('/auth/reset-password?token=reset-e2e-token')

    await page.getByLabel('Nouveau mot de passe', { exact: true }).fill('Abcdef12!')
    await page.getByLabel('Confirmer le mot de passe', { exact: true }).fill('Abcdef12!')
    await page.getByRole('button', { name: 'Réinitialiser' }).click()

    await expect(page).toHaveURL(/\/auth\/login/)
    expect(submittedBody).toEqual({ token: 'reset-e2e-token', password: 'Abcdef12!' })
  })

  test('shows the invalid-link state when email verification is rejected', async ({ page }) => {
    let verificationCalls = 0
    await page.route('**/api/auth/verify-email', async (route) => {
      verificationCalls++
      await route.fulfill({
        status: 400,
        json: { success: false, error: 'invalid_token' },
      })
    })

    await page.goto('/auth/verify-email?token=invalid-e2e-token')

    await expect(page.getByRole('heading', { name: 'Lien invalide' })).toBeVisible()
    await expect(page.getByText('Ce lien de vérification est invalide.')).toBeVisible()
    expect(verificationCalls).toBe(1)
  })

  test('requests a fresh verification link from an expired token', async ({ page }) => {
    let submittedBody: unknown
    await page.route('**/api/auth/verify-email', async (route) => {
      await route.fulfill({
        status: 400,
        json: { success: false, error: 'token_expired' },
      })
    })
    await page.route('**/api/auth/resend-verification-token', async (route) => {
      submittedBody = route.request().postDataJSON()
      await route.fulfill({ json: { success: true, data: null } })
    })

    await page.goto('/auth/verify-email?token=expired-e2e-token')
    await page.getByRole('button', { name: 'Demander un nouveau lien' }).click()

    await expect(page.getByText('Email envoyé ! Vérifiez votre boîte mail.')).toBeVisible()
    expect(submittedBody).toEqual({ token: 'expired-e2e-token' })
  })
})

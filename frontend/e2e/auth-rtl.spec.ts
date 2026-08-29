import { expect, test } from '@playwright/test'

test('keeps auth control spacing on inline-end in RTL', async ({ page }) => {
  await page.goto('/auth/signup')
  // Parallel cold chunk compilation can outlive Playwright's default 5 s assertion
  await expect(page.locator('#signup-password')).toBeVisible({ timeout: 15_000 })
  await expect(page.locator('.auth-footer__text')).toBeVisible()
  const spacing = await page.evaluate(() => {
    document.documentElement.dir = 'rtl'
    const password = document.querySelector('#signup-password')
    const footerText = document.querySelector('.auth-footer__text')
    if (!(password instanceof HTMLElement) || !(footerText instanceof HTMLElement)) {
      throw new Error('Auth spacing targets are missing')
    }
    const passwordStyle = getComputedStyle(password)
    const footerStyle = getComputedStyle(footerText)
    return {
      password: {
        start: Number.parseFloat(passwordStyle.paddingInlineStart),
        end: Number.parseFloat(passwordStyle.paddingInlineEnd),
      },
      footer: {
        start: Number.parseFloat(footerStyle.marginInlineStart),
        end: Number.parseFloat(footerStyle.marginInlineEnd),
      },
    }
  })

  expect.soft(spacing.password.end).toBeGreaterThan(spacing.password.start)
  expect.soft(spacing.footer.end).toBeGreaterThan(spacing.footer.start)
})

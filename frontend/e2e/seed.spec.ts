import { expect, test } from '@playwright/test'

import { loginAsSeed } from './helpers/auth'
import { waitForHydration } from './helpers/hydration'

// Bootstrap context for the Playwright test agents: they run this test first to reach an
// authenticated, hydrated page before exploring.
// Kept as a real spec so a broken login contract fails here rather than inside an agent loop.
test('seed', async ({ page }) => {
  await loginAsSeed(page)
  await page.goto('/')
  await waitForHydration(page)
  await expect(page).toHaveURL(/\/$/)
})

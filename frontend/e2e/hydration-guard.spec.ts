import { expect, test } from '@playwright/test'

// Canary for waitForHydration() (helpers/hydration.ts): it resolves when window.$_TSR
// disappears, an unexported TanStack Router internal. If a router bump renames or drops
// that global, `!Reflect.has(window, '$_TSR')` is true from the first tick and every caller
// resolves immediately instead of waiting for hydration — a silent no-op, not a crash. This
// test fails loudly the moment that precondition stops holding, before waitForHydration ever
// gets a chance to lie.
test('TanStack Router still exposes the pre-hydration $_TSR global', async ({ page }) => {
  await page.goto('/products')

  let found = true
  try {
    await page.waitForFunction(() => Reflect.has(window, '$_TSR'), undefined, { timeout: 500 })
  } catch {
    found = false
  }

  expect(
    found,
    'TanStack Router internal `$_TSR` not found — waitForHydration() in frontend/e2e/helpers/hydration.ts is now a no-op, update the guard'
  ).toBe(true)
})

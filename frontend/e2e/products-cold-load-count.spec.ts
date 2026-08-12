import { expect, test } from '@playwright/test'

import { loginAsPersona } from './helpers/auth'
import { waitForProductsListSettled } from './helpers/hydration'

// Permanent probe for A20b, which was only ever verified by a hand-captured prod
// trace. A cold authenticated /products must cost exactly two list fetches: the SSR
// one (anonymous key, no authenticated SSR) and the one issued once the standing
// "Selon mon profil" choice resolves and the replace-navigate commits. It caught a
// third on its first run (A20c) — the userKey hold released one render before the
// replace committed, buying a list fetch of the filters the replace then discarded.
// The unit tests only ever asserted the cache keys, never the fetch count, which is
// why counting here is the only thing that guards it.
test('cold authenticated /products issues one list fetch on top of the SSR one', async ({
  page,
  browserName,
}) => {
  await loginAsPersona(page, browserName)

  const listRequests: string[] = []
  page.on('request', (req) => {
    if (req.method() === 'GET' && /\/api\/products(\?|$)/.test(req.url()))
      listRequests.push(req.url())
  })

  const document = await page.goto('/products')
  if (!document) throw new Error('no navigation response for /products')

  // Half of the count Playwright cannot see: the loader's prefetch runs inside the
  // nitro server, so only the rendered grid in the served HTML proves it happened.
  // Without this, a regression moving that fetch to the client still reads as one.
  expect(await document.text(), 'SSR HTML carries no product grid').toContain('list-card--product')

  // The replace-navigate is the last event that can change the list key.
  await expect(page).toHaveURL(/[?&]profile_filter=true/, { timeout: 15_000 })
  await waitForProductsListSettled(page)

  expect(listRequests, `browser-side GET /api/products: ${listRequests.join(' | ')}`).toHaveLength(
    1
  )
})

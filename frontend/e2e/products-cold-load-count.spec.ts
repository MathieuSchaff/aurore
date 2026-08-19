import { expect, test } from '@playwright/test'

import { loginAsPersona, registerFreshUser } from './helpers/auth'
import { waitForProductsListSettled } from './helpers/hydration'

// Permanent probe for a regression that was only ever verified by a hand-captured prod
// trace. A cold authenticated /products costs the SSR list fetch (anonymous key, no
// authenticated SSR) plus one more only when the rules reshape the response: the
// replace-navigate that applies the standing "Selon mon profil" choice. An account
// with nothing to apply pays nothing on top, since the key follows the rules and not
// the identity. It caught a third fetch on its first run: the hold released
// one render before the replace committed, buying a list fetch of the filters the
// replace then discarded. The unit tests only ever asserted the cache keys, never the
// fetch count, which is why counting here is the only thing that guards it.
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

// The other half of the contract, and the whole point of keying on the rules: a fresh
// account has no portrait and no declared rule, so no replace-navigate is coming and the
// response cannot differ from the anonymous one the SSR already dehydrated.
test('cold /products costs no extra list fetch for an account with nothing to apply', async ({
  page,
}) => {
  await registerFreshUser(page)

  const listRequests: string[] = []
  page.on('request', (req) => {
    if (req.method() === 'GET' && /\/api\/products(\?|$)/.test(req.url()))
      listRequests.push(req.url())
  })

  // Armed before the navigation: both land within a few hundred ms of hydration, so a
  // waitForResponse created after the goto races the response it is waiting for
  const profileLanded = Promise.all([
    page.waitForResponse((res) => res.url().includes('/api/profile/dermo')),
    page.waitForResponse((res) => res.url().includes('/api/profile/preference-targets')),
  ])

  const document = await page.goto('/products')
  if (!document) throw new Error('no navigation response for /products')
  expect(await document.text(), 'SSR HTML carries no product grid').toContain('list-card--product')

  // The hold ends on these two, and nothing else can move the key afterwards: with no
  // portrait and no declared rule there is no replace-navigate to wait for
  await profileLanded
  await waitForProductsListSettled(page)

  expect(listRequests, `browser-side GET /api/products: ${listRequests.join(' | ')}`).toHaveLength(
    0
  )
})

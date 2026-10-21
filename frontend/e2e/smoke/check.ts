import assert from 'node:assert/strict'

import { chromium, expect } from '@playwright/test'

import { waitForHydration } from '../helpers/hydration'
import { watchPageHealth } from '../helpers/page-health'

const base = new URL(process.env.SMOKE_URL ?? 'https://aurore-app.fr')
const cold = process.argv[2] === 'cold'
const local = ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)
assert(!cold || local, 'Cold-load bursts are local-only; start just profile-prod first')
const browser = await chromium.launch({ headless: true })

async function checkPublicPages(iteration: number) {
  const context = await browser.newContext({ ignoreHTTPSErrors: local })
  const page = await context.newPage()
  const health = watchPageHealth(page)
  const started = performance.now()
  let assets = 0
  page.on('response', (response) => {
    if (new URL(response.url()).pathname.startsWith('/assets/')) assets++
  })
  try {
    await health.goto(new URL('/products', base).href)
    await health.run(async () => {
      await expect(page.locator('main h1')).toHaveText('Produits')
      const link = page
        .locator(
          'main a[href^="/products/"]:not([href="/products/new"]):not([href^="/products/compare"])'
        )
        .first()
      const href = await link.getAttribute('href')
      assert(href, 'The catalogue must contain a product link')
      if (!cold) {
        await page
          .getByRole('combobox', { name: 'Rechercher un produit' })
          .fill('xeracalm nutrition baume')
        const suggestion = page.getByRole('option', {
          name: /XeraCalm Nutrition Baume Hydratant/i,
        })
        await expect(suggestion).toBeVisible()
        await suggestion.click()
        await expect(page).toHaveURL(/\/products\/[^/?]+/)
        await waitForHydration(page)
      }
      // A direct document load checks both SSR and the modules absent from the catalogue cache
      await health.goto(new URL(href, base).href)
      await expect(page.locator('main h1')).toBeVisible()
      await page.setViewportSize({ width: 390, height: 844 })
      const expand = page.getByRole('button', { name: 'Composition complète', exact: true })
      if (await expand.isVisible()) {
        await expand.click()
        await expect(page.getByRole('button', { name: 'Réduire la composition' })).toBeVisible()
      }
      assert(assets > 0, 'The probe must load production assets')
      if (cold) {
        const protocol = await page.evaluate(
          () =>
            (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)
              .nextHopProtocol
        )
        assert.equal(protocol, 'h2', 'Cold loads must exercise the real HTTP/2 edge')
      } else {
        for (const path of ['/', '/ingredients', '/blog', '/privacy', '/auth/login']) {
          await health.goto(new URL(path, base).href)
          await expect(page.locator('main')).toBeVisible()
        }
        await health.goto(new URL('/collection', base).href)
        await expect(page).toHaveURL(/\/auth\/login/)
      }
    })
    console.log(
      JSON.stringify({
        iteration,
        assets,
        milliseconds: Math.round(performance.now() - started),
        pass: true,
      })
    )
  } finally {
    await context.close()
  }
}

try {
  if (cold) {
    for (let round = 0; round < 3; round++) {
      const results = await Promise.allSettled(
        Array.from({ length: 4 }, (_, index) => checkPublicPages(round * 4 + index))
      )
      const failures = results.filter((result) => result.status === 'rejected')
      assert.equal(failures.length, 0, failures.map((result) => String(result.reason)).join('\n'))
    }
  } else {
    await checkPublicPages(0)
  }
} finally {
  await browser.close()
}

import { SITE_URL } from '@aurore/shared'

import { expect, test } from '@playwright/test'

import { resolveFirstSkincareSlug } from './helpers/catalog'

// Raw documents only: what a crawler gets before any client JavaScript runs
test.describe('Public SSR documents', () => {
  test('an unknown public profile answers a real 404', async ({ page }) => {
    const res = await page.request.get('/u/nobody-e2e-does-not-exist')
    expect(res.status()).toBe(404)
  })

  test('the ingredients hub ships its grid in the server HTML', async ({ page }) => {
    const res = await page.request.get('/ingredients')
    expect(res.ok()).toBe(true)
    const html = await res.text()
    expect(html).toContain('ingredients-page__card-arrow')
    expect(html).toContain(`<link rel="canonical" href="${SITE_URL}/ingredients"`)
  })

  test('product discussions carry their own head without being indexable', async ({ page }) => {
    const slug = await resolveFirstSkincareSlug(page)
    const res = await page.request.get(`/products/${slug}/discussions`)
    expect(res.ok()).toBe(true)
    const html = await res.text()
    expect(html).toContain(`<link rel="canonical" href="${SITE_URL}/products/${slug}/discussions"`)
    expect(html).toContain('<meta name="robots" content="noindex, follow"')
    expect(html).toMatch(/<title>Discussions · [^<]+ — Aurore<\/title>/)
  })
})

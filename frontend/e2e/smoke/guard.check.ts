import assert from 'node:assert/strict'

import { chromium } from '@playwright/test'

import { watchPageHealth } from '../helpers/page-health'

const browser = await chromium.launch({ headless: true })
const cases = [
  { name: 'document 429', status: 429, html: '<h1>Too Many Requests</h1>', error: /HTTP 429/ },
  { name: 'document 503', status: 503, html: '<h1>Unavailable</h1>', error: /HTTP 503/ },
  {
    name: 'module 429',
    html: '<script type="module" src="/asset.js"></script>',
    assetStatus: 429,
    error: /429/,
  },
  {
    name: 'stylesheet 404',
    html: '<link rel="stylesheet" href="/asset.css">',
    assetStatus: 404,
    error: /404/,
  },
  {
    name: 'failed module request',
    html: '<script type="module" src="/asset.js"></script>',
    abort: true,
    error: /ERR_FAILED|Failed to load resource/,
  },
  {
    name: 'JavaScript exception',
    html: '<script>throw new Error("broken boot")</script>',
    error: /broken boot/,
  },
  {
    name: 'console error',
    html: '<script>console.error("broken console")</script>',
    error: /broken console/,
  },
]

try {
  for (const fixture of cases) {
    const context = await browser.newContext()
    const page = await context.newPage()
    const health = watchPageHealth(page)
    // These documents never publish routerReady: rejection must come from the failure itself
    await page.route('https://smoke.test/**', async (route) => {
      if (new URL(route.request().url()).pathname.startsWith('/asset')) {
        if (fixture.abort) return route.abort('failed')
        return route.fulfill({
          status: fixture.assetStatus,
          contentType: 'text/plain',
          body: 'refused',
        })
      }
      return route.fulfill({
        status: fixture.status ?? 200,
        contentType: 'text/html',
        body: fixture.html,
      })
    })
    try {
      page.setDefaultTimeout(5000)
      await assert.rejects(health.goto('https://smoke.test/'), fixture.error)
      console.log(`PASS ${fixture.name}`)
    } finally {
      await context.close()
    }
  }
  const context = await browser.newContext()
  const page = await context.newPage()
  const health = watchPageHealth(page)
  await page.route('https://smoke.test/**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<main>Ready</main><script>document.documentElement.dataset.routerReady=location.href</script>',
    })
  )
  try {
    await health.goto('https://smoke.test/')
    console.log('PASS healthy hydrated document')
  } finally {
    await context.close()
  }
} finally {
  await browser.close()
}

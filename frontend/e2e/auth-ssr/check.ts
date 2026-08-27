// Local-only auth-boot regression guard against the production SSR build. Runs the
// runtime server behind a proxy that mocks the whole /api boundary: browser AND
// server-side fetches hit it, since the build pins VITE_API_URL to the proxy. Shell
// markers are asserted via aur-* classes on purpose: the same vocabulary works for
// the raw SSR HTML string and the hydrated DOM. Run via `just test-auth-ssr`.
import { resolve } from 'node:path'

import { type Browser, chromium, expect, type Page } from '@playwright/test'

const SERVER = resolve(import.meta.dir, '../../.output/server/index.mjs')
const PROXY_PORT = 4190
const SSR_PORT = 4191
const BASE_URL = `http://127.0.0.1:${PROXY_PORT}`
const PRODUCTS_TOTAL = 7
const SSR_USER = {
  id: '019c0000-0000-7000-8000-000000000001',
  email: 'ssr-build@example.test',
  createdAt: '2026-08-14T10:00:00.000Z',
  emailVerified: true,
  role: 'user' as const,
  isDemo: false,
}
const SSR_PROFILE = {
  userId: SSR_USER.id,
  username: 'ssr-personalized',
  avatarUrl: null,
  links: [],
}

// A stale process from a crashed run would make waitForPort succeed against an old
// build and silently validate the wrong bundle, so fail fast instead.
async function assertPortFree(port: number) {
  try {
    await fetch(`http://127.0.0.1:${port}/favicon.svg`)
  } catch {
    return
  }
  throw new Error(`Port ${port} is already in use (stale run?). Kill that process first.`)
}

async function waitForPort(ssr: ReturnType<typeof Bun.spawn>, port: number, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (ssr.exitCode !== null) {
      throw new Error(`SSR server exited early with code ${ssr.exitCode}`)
    }
    try {
      await fetch(`http://127.0.0.1:${port}/favicon.svg`)
      return
    } catch {
      await new Promise((resolveWait) => setTimeout(resolveWait, 150))
    }
  }
  throw new Error(`SSR server did not listen on ${port}`)
}

// React recovers from hydration mismatches silently (console.error only), so a
// structural guarantee alone could rot. Collect and assert per page.
function watchHydration(page: Page): () => void {
  const problems: string[] = []
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() !== 'error') return
    const text = message.text()
    // Minified React hydration errors are #418/#423/#425.
    if (/hydrat|Minified React error #(418|423|425)\b/i.test(text)) {
      problems.push(`console: ${text}`)
    }
  })
  return () => expect(problems).toEqual([])
}

async function collectServerLogs(stream: ReadableStream<Uint8Array>, chunks: string[]) {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value, { stream: true })
    chunks.push(text)
    process.stderr.write(text)
  }
  const tail = decoder.decode()
  if (tail) {
    chunks.push(tail)
    process.stderr.write(tail)
  }
}

await assertPortFree(SSR_PORT)
await assertPortFree(PROXY_PORT)

let ssr: ReturnType<typeof Bun.spawn> | null = null
let proxy: ReturnType<typeof Bun.serve> | null = null
let browser: Browser | null = null
let ssrLogPump: Promise<void> | null = null
const ssrLogs: string[] = []

let failedRefreshCount = 0
let successfulRefreshCount = 0
let bootCallCount = 0

async function handleBootRequest(request: Request): Promise<Response> {
  bootCallCount++
  const cookie = request.headers.get('cookie') ?? ''
  if (cookie.includes('refresh_token=ssr-timeout')) {
    return new Promise<Response>((resolveResponse) => {
      const settle = () =>
        resolveResponse(
          Response.json({ success: false, error: 'boot_timeout_fixture' }, { status: 504 })
        )
      const timer = setTimeout(settle, 3000)
      request.signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timer)
          settle()
        },
        { once: true }
      )
    })
  }

  const data = cookie.includes('refresh_token=ssr-authenticated')
    ? {
        session: {
          authenticated: true as const,
          userId: SSR_USER.id,
          user: SSR_USER,
          role: SSR_USER.role,
        },
        profile: SSR_PROFILE,
      }
    : { session: { authenticated: false as const }, profile: null }
  return Response.json({ success: true, data })
}

function handleRefreshRequest(request: Request): Response {
  if (request.headers.get('x-auth-ssr-result') === 'success') {
    successfulRefreshCount++
    const accessToken = `h.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))}.s`
    return Response.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: 'build-user',
          email: 'build@example.test',
          emailVerified: true,
          role: 'user',
          isDemo: false,
        },
      },
    })
  }

  failedRefreshCount++
  const headers = new Headers({ 'content-type': 'application/json' })
  headers.append('set-cookie', 'refresh_token=; Max-Age=0; Path=/; HttpOnly')
  return new Response(JSON.stringify({ success: false, error: 'invalid_refresh_token' }), {
    status: 401,
    headers,
  })
}

async function handleApiRequest(request: Request, url: URL): Promise<Response | null> {
  switch (url.pathname) {
    case '/api/boot':
      return handleBootRequest(request)
    case '/api/auth/refresh':
      return handleRefreshRequest(request)
    case '/api/products':
      return Response.json({
        success: true,
        data: { items: [], total: PRODUCTS_TOTAL, page: 1, limit: 24 },
      })
    default:
      return url.pathname.startsWith('/api/')
        ? Response.json({ success: false, error: 'not_found' }, { status: 404 })
        : null
  }
}

// An unresolved SSR boot stays neutral until the client can probe.
async function assertUnresolvedBootStaysNeutral() {
  const serverUnknownHtml = await fetch(BASE_URL, {
    headers: { cookie: 'refresh_token=ssr-timeout' },
  }).then((response) => response.text())
  expect(serverUnknownHtml).toContain('aur-hub-boot')
  expect(serverUnknownHtml).not.toContain('aur-opening')
}

// Both documents in one function: the authenticated boot count is asserted
// against the baseline taken before the anonymous fetch.
async function assertDocumentsMatchCookieIdentity() {
  const bootCallsBeforeAnonymous = bootCallCount
  const serverProductsResponse = await fetch(`${BASE_URL}/products`)
  const serverProductsHtml = await serverProductsResponse.text()
  expect(serverProductsHtml).toContain('Produits')
  expect(serverProductsHtml).toContain(`<strong>${PRODUCTS_TOTAL}</strong>`)
  expect(serverProductsResponse.headers.get('cache-control')).toBe('no-cache')
  expect(serverProductsHtml).not.toContain(SSR_PROFILE.username)
  expect(serverProductsHtml).not.toContain(SSR_USER.email)
  expect(bootCallCount).toBe(bootCallsBeforeAnonymous)

  const authenticatedDocument = await fetch(`${BASE_URL}/products`, {
    headers: { cookie: 'refresh_token=ssr-authenticated' },
  })
  const authenticatedHtml = await authenticatedDocument.text()
  expect(authenticatedDocument.headers.get('cache-control')).toBe('private, no-store')
  expect(authenticatedHtml).toContain(SSR_PROFILE.username)
  expect(bootCallCount).toBe(bootCallsBeforeAnonymous + 1)
}

async function assertBootTimeoutRecoversOnClient(browser: Browser) {
  const fallbackContext = await browser.newContext({
    extraHTTPHeaders: { 'x-auth-ssr-result': 'success' },
  })
  await fallbackContext.addCookies([{ name: 'refresh_token', value: 'ssr-timeout', url: BASE_URL }])
  const fallbackPage = await fallbackContext.newPage()
  const assertFallbackHydration = watchHydration(fallbackPage)
  const fallbackRefresh = fallbackPage.waitForResponse(
    (response) =>
      response.url().endsWith('/api/auth/refresh') &&
      response.request().method() === 'POST' &&
      response.status() === 200
  )
  const successfulBeforeFallback = successfulRefreshCount
  const fallbackStartedAt = performance.now()

  const fallbackDocument = await fallbackPage.goto(`${BASE_URL}/about`, {
    waitUntil: 'domcontentloaded',
  })
  if (!fallbackDocument) throw new Error('no fallback document response')
  const fallbackDurationMs = performance.now() - fallbackStartedAt
  const fallbackHtml = await fallbackDocument.text()

  expect(fallbackDocument.status()).toBe(200)
  expect(fallbackDocument.headers()['cache-control']).toBe('private, no-store')
  expect(fallbackHtml).not.toContain(SSR_PROFILE.username)
  expect(fallbackHtml).not.toContain(SSR_USER.email)
  expect(fallbackDurationMs).toBeGreaterThanOrEqual(1900)
  await fallbackRefresh
  await fallbackPage.waitForFunction(() => !Reflect.has(window, '$_TSR'))
  await fallbackPage.getByRole('button', { name: 'Menu utilisateur' }).click()
  await expect(fallbackPage.getByRole('menuitem', { name: 'Profil' })).toBeVisible()
  expect(successfulRefreshCount).toBe(successfulBeforeFallback + 1)
  await expect.poll(() => ssrLogs.join('')).toContain('"event":"ssr_boot_fallback"')
  expect(ssrLogs.join('')).toContain('"route":"/api/boot"')
  expect(ssrLogs.join('')).toContain('"cause":"timeout"')
  assertFallbackHydration()

  await fallbackContext.close()
}

// Raw SSR HTML, anonymous: marketing served directly, never the skeleton.
async function assertAnonymousHtmlServesMarketing() {
  const serverAnonymousHtml = await fetch(BASE_URL).then((response) => response.text())
  expect(serverAnonymousHtml).toContain('aur-opening')
  expect(serverAnonymousHtml).not.toContain('aur-hub-boot')
}

// The list query must settle before SSR renders its total. Otherwise dehydration
// ships this mocked count after the server rendered 0 and React rejects hydration.
async function assertProductsTotalSurvivesHydration(browser: Browser) {
  const productsContext = await browser.newContext()
  const productsPage = await productsContext.newPage()
  const assertProductsHydration = watchHydration(productsPage)

  await productsPage.goto(`${BASE_URL}/products`, { waitUntil: 'domcontentloaded' })
  // TanStack drops this stream global only after the client has hydrated.
  await productsPage.waitForFunction(() => !Reflect.has(window, '$_TSR'))

  await expect(productsPage.locator('.list-page-layout__meta')).toContainText(
    `${PRODUCTS_TOTAL} en catalogue`
  )
  assertProductsHydration()

  await productsContext.close()
}

// An authenticated SSR identity dies when the client refresh returns 401.
async function assertFailedRefreshDropsSsrIdentity(browser: Browser) {
  const context = await browser.newContext()
  await context.addCookies([{ name: 'refresh_token', value: 'ssr-authenticated', url: BASE_URL }])
  const page = await context.newPage()
  const assertFailedHydration = watchHydration(page)
  const refreshSettled = page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/auth/refresh') && response.request().method() === 'POST'
  )

  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await refreshSettled

  await expect(page.locator('.aur-opening')).toBeVisible()
  await expect(page.locator('.aur-hub-boot')).toHaveCount(0)
  expect(failedRefreshCount).toBe(1)
  assertFailedHydration()

  await context.close()
}

// A stale hint cannot override an anonymous SSR boot decision.
async function assertStaleHintNeverOverridesAnonymousBoot(browser: Browser) {
  const staleHintContext = await browser.newContext()
  await staleHintContext.addCookies([{ name: 'aurore_session', value: '1', url: BASE_URL }])
  const staleHintPage = await staleHintContext.newPage()
  const assertStaleHintHydration = watchHydration(staleHintPage)
  const failedRefreshCountBeforeNavigation = failedRefreshCount

  await staleHintPage.goto(BASE_URL, { waitUntil: 'domcontentloaded' })

  await expect(staleHintPage.locator('.aur-opening')).toBeVisible()
  await expect(staleHintPage.locator('.aur-hub-boot')).toHaveCount(0)
  expect(failedRefreshCount).toBe(failedRefreshCountBeforeNavigation)
  assertStaleHintHydration()

  await staleHintContext.close()
}

// An authenticated SSR boot refreshes once and never mounts marketing.
async function assertAuthenticatedBootNeverMountsMarketing(browser: Browser) {
  const restoredContext = await browser.newContext({
    extraHTTPHeaders: { 'x-auth-ssr-result': 'success' },
  })
  await restoredContext.addCookies([
    { name: 'refresh_token', value: 'ssr-authenticated', url: BASE_URL },
  ])
  const restoredPage = await restoredContext.newPage()
  const assertRestoredHydration = watchHydration(restoredPage)
  const successfulBeforeRestored = successfulRefreshCount
  await restoredPage.addInitScript(() => {
    const state = window as typeof window & { __sawAnonymousHome?: boolean }
    state.__sawAnonymousHome = false
    // Inspect addedNodes instead of querying the live DOM: a mount that is removed
    // within the same tick would be invisible to querySelector by callback time.
    const sawOpening = (node: Node): boolean =>
      node instanceof Element &&
      (node.matches('.aur-opening') || node.querySelector('.aur-opening') !== null)
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const added of mutation.addedNodes) {
          if (sawOpening(added)) state.__sawAnonymousHome = true
        }
      }
    }).observe(document, { childList: true, subtree: true })
  })
  const successfulRefresh = restoredPage.waitForResponse(
    (response) =>
      response.url().endsWith('/api/auth/refresh') &&
      response.request().method() === 'POST' &&
      response.status() === 200
  )

  await restoredPage.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await successfulRefresh

  await expect(restoredPage.locator('.aur-hero__title')).toBeVisible()
  await expect(restoredPage.locator('.aur-hub-boot')).toHaveCount(0)
  expect(
    await restoredPage.evaluate(
      () => (window as typeof window & { __sawAnonymousHome?: boolean }).__sawAnonymousHome
    )
  ).toBe(false)
  expect(successfulRefreshCount).toBe(successfulBeforeRestored + 1)
  assertRestoredHydration()

  await restoredContext.close()
}

// A visitor without a refresh cookie gets marketing and zero refresh calls.
async function assertVisitorWithoutCookieNeverRefreshes(browser: Browser) {
  const anonymousContext = await browser.newContext()
  const anonymousPage = await anonymousContext.newPage()
  const assertAnonymousHydration = watchHydration(anonymousPage)
  const failedBefore = failedRefreshCount
  const successBefore = successfulRefreshCount

  await anonymousPage.goto(BASE_URL, { waitUntil: 'domcontentloaded' })

  await expect(anonymousPage.locator('.aur-opening')).toBeVisible()
  await expect(anonymousPage.locator('.aur-hub-boot')).toHaveCount(0)
  expect(failedRefreshCount).toBe(failedBefore)
  expect(successfulRefreshCount).toBe(successBefore)
  assertAnonymousHydration()

  await anonymousContext.close()
}

try {
  ssr = Bun.spawn(['bun', 'run', SERVER], {
    env: {
      ...process.env,
      HOST: '127.0.0.1',
      PORT: String(SSR_PORT),
    },
    stdout: 'ignore',
    stderr: 'pipe',
  })
  if (ssr.stderr instanceof ReadableStream) {
    ssrLogPump = collectServerLogs(ssr.stderr, ssrLogs)
  }
  await waitForPort(ssr, SSR_PORT)

  proxy = Bun.serve({
    hostname: '127.0.0.1',
    port: PROXY_PORT,
    async fetch(request) {
      const url = new URL(request.url)
      const apiResponse = await handleApiRequest(request, url)
      if (apiResponse) return apiResponse

      return fetch(`http://127.0.0.1:${SSR_PORT}${url.pathname}${url.search}`, {
        headers: request.headers,
        redirect: 'manual',
      })
    },
  })

  browser = await chromium.launch({ args: ['--no-sandbox'] })

  await assertUnresolvedBootStaysNeutral()
  await assertDocumentsMatchCookieIdentity()
  await assertBootTimeoutRecoversOnClient(browser)
  await assertAnonymousHtmlServesMarketing()
  await assertProductsTotalSurvivesHydration(browser)
  await assertFailedRefreshDropsSsrIdentity(browser)
  await assertStaleHintNeverOverridesAnonymousBoot(browser)
  await assertAuthenticatedBootNeverMountsMarketing(browser)
  await assertVisitorWithoutCookieNeverRefreshes(browser)
} finally {
  await browser?.close()
  proxy?.stop()
  ssr?.kill()
  await ssr?.exited
  await ssrLogPump
}

console.log('✓ Auth SSR boot converges after failed, skipped, successful, and absent refreshes')

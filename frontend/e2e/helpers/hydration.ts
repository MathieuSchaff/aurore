import { expect, type Page, type Response } from '@playwright/test'

// SSR'd markup is visible long before React owns it, so waiting on a rendered
// element is not a readiness gate: a click landing in that window is dropped
// with no error and never replayed. TanStack deletes this stream global only
// once the client has hydrated, same signal as e2e/auth-ssr/check.ts.
export function waitForHydration(page: Page) {
  return page.waitForFunction(() => !Reflect.has(window, '$_TSR'))
}

// Generic URL quiescence gate for specs whose flow may still move the location
// after hydration (redirects, param normalization). The standing "Selon mon
// profil" setting no longer replaces the URL: applyDeclaredRules sends
// apply_preferences=auto and the server resolves it
export function waitForSettledUrl(page: Page, quietMs = 400) {
  return page.waitForFunction(
    (quiet) => {
      const probe = window as unknown as { __e2eHref?: string; __e2eAt?: number }
      const now = performance.now()
      if (probe.__e2eHref !== location.href) {
        probe.__e2eHref = location.href
        probe.__e2eAt = now
        return false
      }
      return now - (probe.__e2eAt ?? now) >= quiet
    },
    quietMs,
    { polling: 50 }
  )
}

export async function gotoHydrated(page: Page, url: string): Promise<void> {
  await page.goto(url)
  await waitForHydration(page)
}

// An authenticated cold load can hydrate from the SSR identity while its refresh is
// still rotating the cookie. Starting another document navigation in that window aborts
// the response and leaves the browser with the revoked cookie from the previous request.
export async function gotoAuthenticatedHydrated(page: Page, url: string): Promise<void> {
  const refreshResponse = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      new URL(response.url()).pathname === '/api/auth/refresh'
  )
  await gotoHydrated(page, url)
  expect((await refreshResponse).ok(), `auth refresh failed while loading ${url}`).toBe(true)
}

export async function gotoSettled(page: Page, url: string): Promise<void> {
  await gotoHydrated(page, url)
  await waitForSettledUrl(page)
}

// Wait until list requests stop before clicking a card, so the click does not
// land on a row from a payload about to be replaced (loader replay, refetch)
export function waitForProductsListSettled(page: Page, quietMs = 400): Promise<void> {
  return new Promise((resolve) => {
    let timer: ReturnType<typeof setTimeout>
    const isProductsListGet = (url: string, method: string) =>
      method === 'GET' && /\/api\/products(\?|$)/.test(url)
    const finish = () => {
      page.off('response', onResponse)
      resolve()
    }
    const reset = () => {
      clearTimeout(timer)
      timer = setTimeout(finish, quietMs)
    }
    const onResponse = (res: Response) => {
      if (isProductsListGet(res.url(), res.request().method())) reset()
    }
    page.on('response', onResponse)
    reset()
  })
}

export async function gotoProductsSettled(page: Page, url: string): Promise<void> {
  await gotoSettled(page, url)
  await waitForProductsListSettled(page)
}

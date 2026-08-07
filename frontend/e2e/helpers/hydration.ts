import type { Page, Response } from '@playwright/test'

// SSR'd markup is visible long before React owns it, so waiting on a rendered
// element is not a readiness gate: a click landing in that window is dropped
// with no error and never replayed. TanStack deletes this stream global only
// once the client has hydrated, same signal as e2e/auth-ssr/check.ts.
export function waitForHydration(page: Page) {
  return page.waitForFunction(() => !Reflect.has(window, '$_TSR'))
}

// Hydration is not the last word on an authenticated catalogue: ~350 ms later
// useProductsProfileFilter lands a replace-navigate that applies the standing
// "Selon mon profil" setting. It refetches the list, so cards detach mid-click and
// a navigation started in that window is reverted. Wait for the URL to go quiet.
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

export async function gotoSettled(page: Page, url: string): Promise<void> {
  await gotoHydrated(page, url)
  await waitForSettledUrl(page)
}

// The replace-navigate above only starts a second, unguarded chain: profile_filter=true
// enables the dermoProfile query, which recomputes avoidFor, which changes the products
// list query key and refetches it. waitForSettledUrl only watches the URL, so a card read
// right after gotoSettled can still be yanked out from under a click by this later refetch —
// under real network latency the two round trips routinely outlast the 400ms URL-quiet window.
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

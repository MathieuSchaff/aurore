import type { Page } from '@playwright/test'

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

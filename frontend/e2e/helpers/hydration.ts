import type { Page } from '@playwright/test'

// SSR'd markup is visible long before React owns it, so waiting on a rendered
// element is not a readiness gate: a click landing in that window is dropped
// with no error and never replayed. TanStack deletes this stream global only
// once the client has hydrated — same signal as e2e/auth-ssr/check.ts.
export function waitForHydration(page: Page) {
  return page.waitForFunction(() => !Reflect.has(window, '$_TSR'))
}

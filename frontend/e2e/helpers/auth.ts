import { expect, type Page } from '@playwright/test'

// keep in sync with backend/src/db/seed/seeders/seed-test-users.ts
export const SEED_EMAIL = 'seed@seed.com'
export const SEED_PASSWORD = 'Azerty123!seed'

export type Credentials = { email: string; password: string }

// Returns the access token: API-level fixture calls (setup/teardown) need a
// Bearer header, the cookie alone only feeds the SPA silent refresh.
// The label only shapes the assertion message, so a failing fixture says which
// login broke without a stack walk.
export async function loginAs(page: Page, creds: Credentials, label = 'login'): Promise<string> {
  // Relative URL routes through Playwright baseURL (e2e frontend :5174), then
  // the nitro /api proxy to e2e_api. Absolute :3000 would hit the dev stack.
  const res = await page.request.post('/api/auth/login', { data: creds })
  expect(res.ok(), `${label} failed (${res.status()})`).toBe(true)
  const token = (await res.json()).data.accessToken as string
  expect(token, 'no accessToken in login response').toBeTruthy()
  return token
}

// Login via the API to set the refreshToken cookie on the BrowserContext.
// Subsequent page.goto() will trigger the SPA boot silentRefresh (see
// useTokenRefresh.ts) which exchanges the cookie for an access token and
// populates the Zustand auth store, no UI interaction needed.
export async function loginAsSeed(page: Page): Promise<string> {
  return loginAs(page, { email: SEED_EMAIL, password: SEED_PASSWORD })
}

// Server-mutating specs must NOT share an account across the 3 Playwright
// browser projects: parallel whole-state writes clobber each other (flaky
// reproduced on the watched-axes spec, then eliminated by this mapping).
const PERSONA_BY_BROWSER: Record<string, string> = {
  chromium: 'marie@seed.local',
  firefox: 'camille@seed.local',
  webkit: 'theo@seed.local',
}

export async function loginAsPersona(page: Page, browserName: string): Promise<string> {
  const email = PERSONA_BY_BROWSER[browserName]
  if (!email) throw new Error(`no persona mapped for browser "${browserName}"`)
  return loginAs(page, { email, password: SEED_PASSWORD }, 'persona login')
}

// Register a throwaway account so the profile starts empty. Needed by tests
// that assert onboarding state (the seeded personas all have complete profiles).
// Signup is enumeration-safe and no longer establishes a session (ADR 0009), so
// log in afterwards to set the refreshToken cookie on the context. Login works
// pre-verification via the grace window.
export async function registerFreshUser(
  page: Page
): Promise<{ credentials: Credentials; token: string }> {
  const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@e2e.test`
  const password = 'Abcdef12!'
  const credentials = { email, password }
  const signupRes = await page.request.post('/api/auth/signup', {
    data: credentials,
  })
  expect(signupRes.ok(), `signup failed (${signupRes.status()})`).toBe(true)

  const token = await loginAs(page, credentials)
  return { credentials, token }
}

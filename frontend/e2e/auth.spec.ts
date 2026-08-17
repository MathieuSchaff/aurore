import { expect, type Page, test } from '@playwright/test'

import { loginAsSeed, registerFreshUser, SEED_EMAIL, SEED_PASSWORD } from './helpers/auth'
import { waitForHydration } from './helpers/hydration'

// Seed user is created and verified upfront by `seed-core` (see backend/src/db/seed/seeders/create-user.ts).

// Random unique email per signup to avoid collisions across runs: snapshot-once
// seed keeps prior signups in the DB.
function uniqueEmail(): string {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@e2e.test`
}

// Parallel chunk loading under 10 workers can exceed the implicit 5s timeout.
async function expectBannedHeading(page: Page) {
  await expect(page.getByRole('heading', { name: 'Compte suspendu' })).toBeVisible({
    timeout: 15_000,
  })
}

// The catalogue can arrive in the SSR HTML without a client GET. Opening the
// menu proves hydration and the boot effect have completed.
async function gotoProductsAndOpenUserMenu(page: Page) {
  await page.goto('/products')
  await expect(page.getByRole('heading', { name: 'Produits' })).toBeVisible({
    timeout: 15_000,
  })
  await waitForHydration(page)
  await page.getByRole('button', { name: 'Menu utilisateur' }).click()
  await expect(page.getByRole('menu', { name: 'Menu utilisateur' })).toBeVisible()
}

async function expectNoSessionHint(page: Page) {
  const cookies = await page.context().cookies()
  expect(cookies.some((cookie) => cookie.name === 'aurore_session')).toBe(false)
}

test.describe('Auth: login', () => {
  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/auth/login')

    await page.getByLabel('Email', { exact: true }).fill('nope@example.com')
    await page.getByLabel('Mot de passe', { exact: true }).fill('Wrongpass1!')
    await page.getByRole('button', { name: 'Se connecter', exact: true }).click()

    // Mirrors LOGIN_ERRORS.invalid_credentials: account_locked was collapsed into this
    // neutral wording (anti-enumeration, commit dd9130d0) so a locked account is
    // indistinguishable from a wrong password.
    await expect(
      page.getByText('Identifiants incorrects ou compte temporairement indisponible')
    ).toBeVisible()
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('logs in seed user and lands on /collection', async ({ page }) => {
    await page.goto('/auth/login')

    await page.getByLabel('Email', { exact: true }).fill(SEED_EMAIL)
    await page.getByLabel('Mot de passe', { exact: true }).fill(SEED_PASSWORD)
    await page.getByRole('button', { name: 'Se connecter', exact: true }).click()

    await expect(page).toHaveURL(/\/collection/, { timeout: 15_000 })
    await expect(page.getByRole('heading', { name: 'Ma Collection' })).toBeVisible({
      timeout: 15_000,
    })
  })

  test('login redirects to ?redirect= target on success', async ({ page }) => {
    await page.goto('/auth/login?redirect=%2Fproducts%2Fnew')

    await page.getByLabel('Email', { exact: true }).fill(SEED_EMAIL)
    await page.getByLabel('Mot de passe', { exact: true }).fill(SEED_PASSWORD)
    await page.getByRole('button', { name: 'Se connecter', exact: true }).click()

    await expect(page).toHaveURL(/\/products\/new/, { timeout: 15_000 })
  })

  test('migrates a legacy refresh cookie to the root path', async ({ page, context }) => {
    await page.goto('/auth/login')
    await loginAsSeed(page)

    const loginCookies = (await context.cookies()).filter(
      (cookie) => cookie.name === 'refresh_token'
    )
    expect(loginCookies).toHaveLength(1)
    expect(loginCookies[0]?.path).toBe('/')
    if (!loginCookies[0]) return

    await context.clearCookies({ name: 'refresh_token' })
    await context.addCookies([{ ...loginCookies[0], path: '/api/auth' }])

    const refreshStatus = await page.evaluate(async () => {
      const response = await fetch('/api/auth/refresh', { method: 'POST' })
      return response.status
    })
    expect(refreshStatus).toBe(200)

    const migratedCookies = (await context.cookies()).filter(
      (cookie) => cookie.name === 'refresh_token'
    )
    expect(migratedCookies).toHaveLength(1)
    expect(migratedCookies[0]?.path).toBe('/')

    const documentRequestPromise = page.waitForRequest(
      (request) => request.isNavigationRequest() && new URL(request.url()).pathname === '/products'
    )
    await page.goto('/products')
    const documentRequest = await documentRequestPromise
    expect(await documentRequest.headerValue('cookie')).toContain('refresh_token=')
  })
})

test.describe('Auth: signup', () => {
  test('existing email lands on the neutral verify screen (no enumeration)', async ({ page }) => {
    await page.goto('/auth/signup')

    // SEED_EMAIL is already registered. Signup must NOT reveal that (ADR 0009): it
    // returns the same neutral response as a new email and lands on the same
    // check-your-email screen, no "compte existe déjà" leak.
    await page.getByLabel('Email', { exact: true }).fill(SEED_EMAIL)
    await page.getByLabel('Mot de passe', { exact: true }).fill('Abcdef12!')
    await page.getByLabel('Confirmer le mot de passe').fill('Abcdef12!')
    await page.getByRole('button', { name: 'Créer mon compte' }).click()

    await expect(page).toHaveURL(/\/auth\/verify-pending/, { timeout: 15_000 })
    await expect(page.getByRole('heading', { name: 'Vérifiez votre email' })).toBeVisible()
  })

  test('creates account with unique email and lands on the verify screen', async ({ page }) => {
    await page.goto('/auth/signup')

    const password = 'Abcdef12!'
    await page.getByLabel('Email', { exact: true }).fill(uniqueEmail())
    await page.getByLabel('Mot de passe', { exact: true }).fill(password)
    await page.getByLabel('Confirmer le mot de passe').fill(password)

    await page.getByRole('button', { name: 'Créer mon compte' }).click()

    // No auto-login (ADR 0009): land on the check-your-email screen, not /collection.
    await expect(page).toHaveURL(/\/auth\/verify-pending/, { timeout: 15_000 })
    await expect(page.getByRole('heading', { name: 'Vérifiez votre email' })).toBeVisible()
  })
})

test.describe('Auth: banned user', () => {
  test('login as banned user redirects to /auth/banned with suspension message', async ({
    page,
  }) => {
    await page.goto('/auth/login')

    // keep in sync with backend/src/db/seed/seeders/seed-test-users.ts
    await page.getByLabel('Email', { exact: true }).fill('banned@seed.local')
    await page.getByLabel('Mot de passe', { exact: true }).fill(SEED_PASSWORD)
    await page.getByRole('button', { name: 'Se connecter', exact: true }).click()

    await expect(page).toHaveURL(/\/auth\/banned/, { timeout: 15_000 })
    await expect(page.getByRole('heading', { name: 'Compte suspendu' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Se déconnecter' })).toBeVisible()
  })

  test('banned page shows fallback message when no query params', async ({ page }) => {
    await page.goto('/auth/banned')

    await expectBannedHeading(page)
    await expect(page.getByText('Votre compte est suspendu.')).toBeVisible()
    await expect(page.getByText(/contactez le support/i)).toBeVisible()
  })

  test('banned page shows reason from query params', async ({ page }) => {
    await page.goto('/auth/banned?reason=Comportement+abusif&expires=2026-06-01T00%3A00%3A00.000Z')

    await expectBannedHeading(page)
    await expect(page.getByText(/suspendu jusqu'au/i)).toBeVisible()
    await expect(page.getByText('Comportement abusif')).toBeVisible()
  })
})

test.describe('Auth: demo', () => {
  test('demo button creates a demo session and lands on /collection with banner', async ({
    page,
  }) => {
    await page.goto('/auth/login')

    await page.getByRole('button', { name: /Essayer la démo/i }).click()

    // The /demo seed itself is fast (~200ms); the headroom over the 15s default absorbs
    // Firefox boot + nav lag under full-suite parallel contention, not seed weight.
    await expect(page).toHaveURL(/\/collection/, { timeout: 30_000 })
    await expect(page.getByRole('heading', { name: 'Ma Collection' })).toBeVisible()
    await expect(page.getByText('Mode démo')).toBeVisible()
  })

  test('demo from signup page also works', async ({ page }) => {
    await page.goto('/auth/signup')

    await page.getByRole('button', { name: /Essayer la démo/i }).click()

    // Same headroom as above, for Firefox contention, not seed weight.
    await expect(page).toHaveURL(/\/collection/, { timeout: 30_000 })
    await expect(page.getByText('Mode démo')).toBeVisible()
  })
})

// A resolved anonymous SSR boot must not pay for /auth/refresh. A stale hint cookie
// is included because the frontend must ignore it during the backend transition.
test.describe('Auth: SSR boot issue (cold-load probe gate)', () => {
  test('anonymous boot skips refresh even with a stale hint cookie', async ({ page, context }) => {
    await context.addCookies([{ name: 'aurore_session', value: '1', url: 'http://localhost:5174' }])
    const refreshCalls: string[] = []
    page.on('request', (r) => {
      if (r.url().includes('/api/auth/refresh')) refreshCalls.push(r.url())
    })

    await gotoProductsAndOpenUserMenu(page)

    expect(refreshCalls).toEqual([])
  })

  test('authenticated boot fires the refresh probe', async ({ page }) => {
    test.slow()
    await loginAsSeed(page)

    const refreshReq = page.waitForRequest(
      (r) => r.url().includes('/api/auth/refresh') && r.method() === 'POST',
      { timeout: 30_000 }
    )
    await page.goto('/products')
    await waitForHydration(page)
    await refreshReq
  })

  test('login, cold-load refresh and logout work without a session hint', async ({ page }) => {
    await page
      .context()
      .addCookies([{ name: 'aurore_session', value: '1', url: 'http://localhost:5174' }])
    await loginAsSeed(page)
    await expectNoSessionHint(page)

    const refreshRequest = page.waitForRequest(
      (request) => request.url().includes('/api/auth/refresh') && request.method() === 'POST'
    )
    await page.goto('/collection')
    await expect(page.getByRole('heading', { name: 'Ma Collection' })).toBeVisible({
      timeout: 15_000,
    })
    await waitForHydration(page)
    await refreshRequest
    await expectNoSessionHint(page)

    await page.getByRole('button', { name: 'Menu utilisateur' }).click()
    const menu = page.getByRole('menu', { name: 'Menu utilisateur' })
    await expect(menu).toBeVisible()
    await menu.getByRole('menuitem', { name: 'Déconnexion' }).click()
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 15_000 })
    // Let the logout redirect fully commit before navigating away, else goto('/products')
    // races a still-in-flight nav back to /auth/login (webkit throws, firefox aborts).
    await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible()
    await expectNoSessionHint(page)

    const refreshCalls: string[] = []
    page.on('request', (r) => {
      if (r.url().includes('/api/auth/refresh')) refreshCalls.push(r.url())
    })
    await gotoProductsAndOpenUserMenu(page)
    expect(refreshCalls).toEqual([])
  })
})

// The root /auth/refresh probe does not gate the public shell. These cases pin protected-route
// self-heal and the synchronous role guards.
test.describe('Auth: optimistic boot (cold load, logged in)', () => {
  test('cold load on a protected route self-heals without redirect to login', async ({ page }) => {
    // API login sets the refresh cookie without populating the SPA store, so the goto is a
    // genuine cold boot. The guard must wait for the deduped client probe before deciding.
    await loginAsSeed(page)

    await page.goto('/collection')

    await expect(page.getByRole('heading', { name: 'Ma Collection' })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page).toHaveURL(/\/collection/)
  })

  test('cold load redirects to login when the client probe rejects the seeded session', async ({
    page,
  }) => {
    await loginAsSeed(page)
    await page.route('**/api/auth/refresh', (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'invalid_refresh_token' }),
      })
    )

    await page.goto('/collection')

    await expect(page).toHaveURL(/\/auth\/login\?redirect=/, { timeout: 15_000 })
    await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible()
  })

  test('cold load on a role-gated route keeps an admin in place', async ({ page }) => {
    // Role guards must await the boot refresh before reading the role, otherwise
    // an admin can be ejected to / on a direct /admin URL.
    await loginAsSeed(page)

    await page.goto('/admin')

    await expect(page).toHaveURL(/\/admin/, { timeout: 15_000 })
  })

  test('cold load on /admin rejects an authenticated non-admin to home', async ({ page }) => {
    // A freshly registered user is role=user: authenticated but NOT authorized. Once the probe
    // resolves the role guard must reject to /, the authorization property, complementary to the
    // "admin not ejected" liveness test above and distinct from the anonymous to /auth/login path.
    // Guards against reading the SSR-seeded role as authorization before refresh settles.
    await registerFreshUser(page)

    await page.goto('/admin')

    await page.waitForURL((url) => url.pathname === '/', { timeout: 15_000 })
  })
})

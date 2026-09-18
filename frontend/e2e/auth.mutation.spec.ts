import { expect, type Page, test } from '@playwright/test'

import {
  type Credentials,
  deleteTestUser,
  loginAsSeed,
  registerFreshUser,
  SEED_EMAIL,
  SEED_PASSWORD,
} from './helpers/auth'
import { waitForHydration } from './helpers/hydration'
import { captureRequests, requestsFor } from './helpers/network'

// Seed user is created and verified upfront by `seed-core` (see backend/src/db/seed/seeders/create-user.ts).

// Random unique email per signup avoids collisions before the test cleanup runs.
function uniqueEmail(): string {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@e2e.test`
}

async function cleanupUserByCredentials(page: Page, credentials: Credentials, label: string) {
  const login = await page.request.post('/api/auth/login', { data: credentials })
  if (login.status() === 401) return
  expect(login.ok(), `${label} login failed (${login.status()})`).toBe(true)
  const accessToken = (await login.json()).data.accessToken as string
  await deleteTestUser(page, accessToken, label)
}

async function cleanupCurrentUser(page: Page, label: string) {
  const refresh = await page.request.post('/api/auth/refresh')
  if (refresh.status() === 400 || refresh.status() === 401) return
  expect(refresh.ok(), `${label} refresh failed (${refresh.status()})`).toBe(true)
  const accessToken = (await refresh.json()).data.accessToken as string
  await deleteTestUser(page, accessToken, label)
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

test.describe('Auth: login', () => {
  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/auth/login')
    const requests = captureRequests(page)
    await page.getByLabel('Email', { exact: true }).fill('nope@example.com')
    await page.getByLabel('Mot de passe', { exact: true }).fill('Wrongpass1!')
    await page.getByRole('button', { name: 'Se connecter', exact: true }).click()

    // Mirrors LOGIN_ERRORS.invalid_credentials: account_locked was collapsed into this
    // neutral wording  so a locked account is
    // indistinguishable from a wrong password
    await expect(
      page.getByText('Identifiants incorrects ou compte temporairement indisponible')
    ).toBeVisible()
    await expect(page).toHaveURL(/\/auth\/login/)
    // register that a request isn't going after the click
    expect(requestsFor(requests, 'POST', '/api/auth/refresh')).toHaveLength(0)
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

  test('redirects to the requested target after login', async ({ page }) => {
    await page.goto('/auth/login?redirect=%2Fproducts%2Fnew')

    await page.getByLabel('Email', { exact: true }).fill(SEED_EMAIL)
    await page.getByLabel('Mot de passe', { exact: true }).fill(SEED_PASSWORD)
    await page.getByRole('button', { name: 'Se connecter', exact: true }).click()

    await expect(page).toHaveURL(/\/products\/new/, { timeout: 15_000 })
  })
})

test.describe('Auth: signup', () => {
  test('lands on the neutral verify screen for an existing email', async ({ page }) => {
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

    const email = uniqueEmail()
    const password = 'Abcdef12!'
    try {
      await page.getByLabel('Email', { exact: true }).fill(email)
      await page.getByLabel('Mot de passe', { exact: true }).fill(password)
      await page.getByLabel('Confirmer le mot de passe').fill(password)

      await page.getByRole('button', { name: 'Créer mon compte' }).click()

      // No auto-login (ADR 0009): land on the check-your-email screen, not /collection.
      await expect(page).toHaveURL(/\/auth\/verify-pending/, { timeout: 15_000 })
      await expect(page.getByRole('heading', { name: 'Vérifiez votre email' })).toBeVisible()
    } finally {
      await cleanupUserByCredentials(page, { email, password }, 'signup account cleanup')
    }
  })
})

test.describe('Auth: banned user', () => {
  test('redirects a banned user to /auth/banned with the suspension message', async ({ page }) => {
    await page.goto('/auth/login')

    // keep in sync with backend/src/db/seed/seeders/seed-test-users.ts
    await page.getByLabel('Email', { exact: true }).fill('banned@seed.local')
    await page.getByLabel('Mot de passe', { exact: true }).fill(SEED_PASSWORD)
    await page.getByRole('button', { name: 'Se connecter', exact: true }).click()

    await expect(page).toHaveURL(/\/auth\/banned$/, { timeout: 15_000 })
    await expect(page.getByRole('heading', { name: 'Compte suspendu' })).toBeVisible()
    await expect(page.getByText('Compte de test banni (seed)')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Se déconnecter' })).toBeVisible()

    await page.reload()

    await expectBannedHeading(page)
    await expect(page.getByText('Votre compte est suspendu.')).toBeVisible()
    await expect(page.getByText(/contactez le support/i)).toBeVisible()
    await expect(page.getByText('Compte de test banni (seed)')).toHaveCount(0)
  })

  test('shows the fallback message without query parameters', async ({ page }) => {
    await page.goto('/auth/banned')

    await expectBannedHeading(page)
    await expect(page.getByText('Votre compte est suspendu.')).toBeVisible()
    await expect(page.getByText(/contactez le support/i)).toBeVisible()
  })

  test('ignores fabricated suspension details from the URL', async ({ page }) => {
    await page.goto('/auth/banned?reason=Comportement+abusif&expires=2026-06-01T00%3A00%3A00.000Z')

    await expectBannedHeading(page)
    await expect(page.getByText('Votre compte est suspendu.')).toBeVisible()
    await expect(page.getByText(/contactez le support/i)).toBeVisible()
    await expect(page.getByText(/suspendu jusqu'au/i)).toHaveCount(0)
    await expect(page.getByText('Comportement abusif')).toHaveCount(0)
  })
})

test.describe('Auth: demo', () => {
  test('creates a demo session and lands on /collection with its banner', async ({ page }) => {
    try {
      await page.goto('/auth/login')

      await page.getByRole('button', { name: /Essayer la démo/i }).click()

      // The /demo seed itself is fast (~200ms); the headroom over the 15s default absorbs
      // Firefox boot + nav lag under full-suite parallel contention, not seed weight.
      await expect(page).toHaveURL(/\/collection/, { timeout: 30_000 })
      await expect(page.getByRole('heading', { name: 'Ma Collection' })).toBeVisible()
      await expect(page.getByText('Mode démo')).toBeVisible()
    } finally {
      await cleanupCurrentUser(page, 'login demo cleanup')
    }
  })

  // The home swaps its marketing view for the hub as soon as the session installs
  // so the redirect must survive that unmount
  test('lands on /collection when starting a demo from the home page', async ({ page }) => {
    try {
      await page.goto('/')
      // The home is server-rendered: a click before hydration lands on inert markup
      await waitForHydration(page)

      await page.getByRole('button', { name: 'Créer un compte de démo' }).first().click()

      await expect(page).toHaveURL(/\/collection/, { timeout: 30_000 })
      await expect(page.getByText('Mode démo')).toBeVisible()
    } finally {
      await cleanupCurrentUser(page, 'home demo cleanup')
    }
  })

  test('starts a demo from the signup page', async ({ page }) => {
    try {
      await page.goto('/auth/signup')

      await page.getByRole('button', { name: /Essayer la démo/i }).click()

      // Same headroom as above, for Firefox contention, not seed weight.
      await expect(page).toHaveURL(/\/collection/, { timeout: 30_000 })
      await expect(page.getByText('Mode démo')).toBeVisible()
    } finally {
      await cleanupCurrentUser(page, 'signup demo cleanup')
    }
  })
})

// A resolved anonymous SSR boot must not pay for /auth/refresh. A stale hint cookie
// is included because the frontend must ignore it during the backend transition.
test.describe('Auth: SSR boot issue (cold-load probe gate)', () => {
  test('skips refresh on anonymous boot even with a stale hint cookie', async ({
    page,
    context,
  }) => {
    await context.addCookies([{ name: 'aurore_session', value: '1', url: 'http://localhost:5174' }])
    const refreshCalls: string[] = []
    page.on('request', (r) => {
      if (r.url().includes('/api/auth/refresh')) refreshCalls.push(r.url())
    })

    await gotoProductsAndOpenUserMenu(page)

    expect(refreshCalls).toEqual([])
  })

  test('fires the refresh probe after authenticated boot', async ({ page }) => {
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

  // The hint cookie is dead code on both sides, but old browsers still carry one until it
  // expires. Seeding it here proves the whole session cycle ignores it.
  test('ignores a leftover session hint across login, refresh and logout', async ({ page }) => {
    await page
      .context()
      .addCookies([{ name: 'aurore_session', value: '1', url: 'http://localhost:5174' }])
    await loginAsSeed(page)

    const refreshRequest = page.waitForRequest(
      (request) => request.url().includes('/api/auth/refresh') && request.method() === 'POST'
    )
    await page.goto('/collection')
    await expect(page.getByRole('heading', { name: 'Ma Collection' })).toBeVisible({
      timeout: 15_000,
    })
    await waitForHydration(page)
    await refreshRequest

    await page.getByRole('button', { name: 'Menu utilisateur' }).click()
    const menu = page.getByRole('menu', { name: 'Menu utilisateur' })
    await expect(menu).toBeVisible()
    await menu.getByRole('menuitem', { name: 'Déconnexion' }).click()
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 15_000 })
    // Let the logout redirect fully commit before navigating away, else goto('/products')
    // races a still-in-flight nav back to /auth/login (webkit throws, firefox aborts).
    await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible()

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
  test('self-heals a protected cold load without redirecting to login', async ({ page }) => {
    // API login sets the refresh cookie without populating the SPA store, so the goto is a
    // genuine cold boot. The guard must wait for the deduped client probe before deciding.
    await loginAsSeed(page)

    await page.goto('/collection')

    await expect(page.getByRole('heading', { name: 'Ma Collection' })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page).toHaveURL(/\/collection/)
  })

  test('redirects a cold load when the client probe rejects the seeded session', async ({
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

  test('keeps an admin on a role-gated cold load', async ({ page }) => {
    // Role guards must await the boot refresh before reading the role, otherwise
    // an admin can be ejected to / on a direct /admin URL.
    await loginAsSeed(page)

    await page.goto('/admin')

    await expect(page).toHaveURL(/\/admin/, { timeout: 15_000 })
  })

  test('redirects an authenticated non-admin from /admin to home', async ({ page }) => {
    // A freshly registered user is role=user: authenticated but NOT authorized. Once the probe
    // resolves the role guard must reject to /, the authorization property, complementary to the
    // "admin not ejected" liveness test above and distinct from the anonymous to /auth/login path.
    // Guards against reading the SSR-seeded role as authorization before refresh settles.
    const freshUser = await registerFreshUser(page)
    try {
      await page.goto('/admin')

      await page.waitForURL((url) => url.pathname === '/', { timeout: 15_000 })
    } finally {
      await deleteTestUser(page, freshUser.token, 'admin guard account cleanup')
    }
  })

  test('keeps an admin on a blog editor cold load', async ({ page }) => {
    await loginAsSeed(page)

    await page.goto('/blog/admin/new')

    await expect(page.getByRole('heading', { name: 'Nouvel article' })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page).toHaveURL(/\/blog\/admin\/new/)
  })

  test('redirects a non-admin from a blog editor cold load', async ({ page }) => {
    const freshUser = await registerFreshUser(page)
    try {
      await page.goto('/blog/admin/new')

      await page.waitForURL((url) => url.pathname === '/blog', { timeout: 15_000 })
    } finally {
      await deleteTestUser(page, freshUser.token, 'blog guard account cleanup')
    }
  })

  test('keeps an admin on the admin shell during SPA navigation', async ({ page }) => {
    await loginAsSeed(page)
    await page.goto('/')
    await waitForHydration(page)

    await page.getByRole('link', { name: 'Espace admin' }).click()

    await expect(page).toHaveURL(/\/admin/, { timeout: 15_000 })
  })

  test('opens the blog editor for an admin during SPA navigation', async ({ page }) => {
    await loginAsSeed(page)
    await page.goto('/blog')
    await waitForHydration(page)

    await page.getByRole('link', { name: 'Nouvel article' }).click()

    await expect(page.getByRole('heading', { name: 'Nouvel article' })).toBeVisible({
      timeout: 15_000,
    })
    await expect(page).toHaveURL(/\/blog\/admin\/new/)
  })
})

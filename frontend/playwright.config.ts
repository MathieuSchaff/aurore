import { defineConfig, devices } from '@playwright/test'

// Specs that PATCH shared seed rows. The engine matrix shares one E2E DB, so three
// projects editing the same row race each other (mode:'serial' only serializes
// within a project). These specs run once, sequentially, on chromium-mutation;
// engine compat covers rendering/interactions, not whether a PATCH goes out.
const MUTATION_SPECS = '**/*.mutation.spec.ts'

// Specs asserting something an engine can actually change: computed geometry, CSS,
// focus order, keyboard nav, viewport. Every other spec asserts routes, network and
// text, identical on all three engines, so running it three times buys nothing.
// Adding a spec here is opt-in: a new spec runs on chromium only until listed.
const CROSS_ENGINE_SPECS = [
  '**/auth-rtl.spec.ts',
  '**/detail-back-navigation.spec.ts',
  '**/dropdown-menu-product-detail-sheet-status.spec.ts',
  '**/filter-drawer-focus.spec.ts',
  '**/header-rails.spec.ts',
  '**/main-nav.spec.ts',
]

// Ports (5174/3001/5434) differ from dev (5173/3000/5432) so both stacks can run at once.
export default defineConfig({
  tsconfig: './tsconfig.node.json',
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // One local retry covers occasional Firefox flakiness under parallel runs (heavy tmpfs
  // DB load can cause a slow boot/nav). CI uses two.
  retries: process.env.CI ? 2 : 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5174',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: MUTATION_SPECS,
    },
    {
      name: 'chromium-mutation',
      use: { ...devices['Desktop Chrome'] },
      testMatch: MUTATION_SPECS,
      // Single worker per file: tests in a mutation file run in source order, so
      // specs targeting the same row must live in the same file.
      fullyParallel: false,
    },
    // Cross-engine compat matrix. WebKit is the iOS proxy. Mobile bug reports
    // (transparent nav, demo CTA) can only be reproduced/guarded there.
    // WebKit needs system deps: sudo npx playwright install-deps webkit
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: CROSS_ENGINE_SPECS,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: CROSS_ENGINE_SPECS,
      // A webkit test costs 6-8 s here where chromium costs 2, so under the shared worker
      // pool the default 5 s assertion window expires on a page that is merely slow.
      // Measured: 31 failures at 10 workers, 8 at 4, none of them engine bugs. Scaling the
      // budgets keeps the parallelism instead of trading it for green.
      timeout: 60_000,
      expect: { timeout: 15_000 },
    },
  ],
  webServer: {
    command: 'just e2e-up',
    cwd: '..',
    url: 'http://localhost:5174',
    reuseExistingServer: true,
    timeout: 300_000,
  },
})

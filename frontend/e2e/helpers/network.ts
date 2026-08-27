import type { Page } from '@playwright/test'

// page.route is blind to what a ssr:true loader resolves: on those routes the loader runs
// server-side on the first page.goto, the mock is never hit, and the page renders real data
// The spec then fails on a CONTENT assertion, not a timing one, which makes it easy to misdiagnose
// Workaround: enter via a client-side navigation instead (goto another page, wait for hydration,
// then click the link): see `clientNavigateToDetail` in product-detail.spec.ts for a worked example
export async function mockJson(
  page: Page,
  urlPattern: Parameters<Page['route']>[0],
  status: number,
  body: unknown,
  method?: string
): Promise<void> {
  await page.route(urlPattern, async (route) => {
    if (method && route.request().method() !== method) {
      await route.continue()
      return
    }
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
  })
}

export const mockApiError = (
  page: Page,
  urlPattern: Parameters<Page['route']>[0],
  status: number,
  error: string,
  method?: string
) => mockJson(page, urlPattern, status, { success: false, error }, method)

// Browser-side request log; SSR fetches never appear here, which is what the
// cold-load and degraded-path specs count on
export function captureRequests(page: Page): string[] {
  const requests: string[] = []
  page.on('request', (request) => {
    requests.push(`${request.method()} ${new URL(request.url()).pathname}`)
  })
  return requests
}

export function requestsFor(requests: string[], method: string, pathname: string): string[] {
  return requests.filter((request) => request === `${method} ${pathname}`)
}

export function authRequests(requests: string[]): string[] {
  return requests.filter((request) => request.includes(' /api/auth/'))
}

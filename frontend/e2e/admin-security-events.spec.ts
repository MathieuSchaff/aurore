import type { ListSecurityEventsResponse, SecurityEventView } from '@aurore/shared'

import { expect, test } from '@playwright/test'

import { loginAsSeed } from './helpers/auth'
import { gotoHydrated } from './helpers/hydration'

const HIGH_EVENT = {
  id: '11111111-1111-4111-8111-111111111111',
  userId: '22222222-2222-4222-8222-222222222222',
  severity: 'high',
  eventType: 'suspicious_input',
  field: 'displayName',
  payload: '<script>alert(1)</script>',
  route: '/api/profile',
  createdAt: '2026-08-20T10:00:00.000Z',
} satisfies SecurityEventView

const LOW_EVENT = {
  ...HIGH_EVENT,
  id: '33333333-3333-4333-8333-333333333333',
  severity: 'low',
  eventType: 'data_export_requested',
  field: 'export',
  payload: 'json',
} satisfies SecurityEventView

test('filters, expands and links a security event from the admin UI', async ({ page }) => {
  await loginAsSeed(page)
  await gotoHydrated(page, '/admin')
  await page.route('**/api/admin/security-events*', async (route) => {
    const severity = new URL(route.request().url()).searchParams.get('severity')
    const data = {
      items:
        severity === 'high'
          ? [HIGH_EVENT]
          : severity === 'low'
            ? [LOW_EVENT]
            : [HIGH_EVENT, LOW_EVENT],
    } satisfies ListSecurityEventsResponse
    await route.fulfill({ json: { success: true, data } })
  })

  await page.getByRole('link', { name: 'Sécurité' }).click()
  await expect(page).toHaveURL(/\/admin\/security-events$/)
  await expect(page.getByText(HIGH_EVENT.eventType)).toBeVisible()
  await expect(page.getByText(LOW_EVENT.eventType)).toBeVisible()

  const highRequest = page.waitForRequest((request) => {
    const url = new URL(request.url())
    return (
      url.pathname === '/api/admin/security-events' && url.searchParams.get('severity') === 'high'
    )
  })
  await page.getByRole('button', { name: 'Élevée' }).click()
  await highRequest

  await expect(page.getByText(HIGH_EVENT.eventType)).toBeVisible()
  await expect(page.getByText(LOW_EVENT.eventType)).toHaveCount(0)
  await page.getByRole('button', { name: 'Voir' }).click()
  await expect(page.getByText(HIGH_EVENT.payload)).toBeVisible()
  await expect(page.getByRole('link', { name: HIGH_EVENT.userId.slice(0, 8) })).toHaveAttribute(
    'href',
    `/admin/users/${HIGH_EVENT.userId}`
  )
})

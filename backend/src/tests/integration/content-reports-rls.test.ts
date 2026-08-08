/**
 * RLS regression for content_reports under the real app_runtime pool.
 * Route-level tests run as the table-owner role `app` (implicit BYPASSRLS), which masks
 * production: APP_DATABASE_URL connects as `app_runtime` (no BYPASSRLS). content_reports
 * needs moderator policies, not only tenant_isolation + admin_bypass: a contributor
 * would otherwise see only reports they filed, and their escalate-UPDATE would touch 0
 * rows (404). moderationPolicies('content_reports') opens read+update to admin/contributor.
 */
import { describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { eq } from 'drizzle-orm'

import { contentReports } from '../../db/schema'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb, withRlsAs } from '../helpers/app-runtime-db'
import { createRlsApp, loginViaRlsApp } from '../helpers/rls-app'
import { createTestContributorUser, createTestUser } from '../helpers/test-factories'

const appRuntimeDb = await createAppRuntimeDb()

const TARGET = '019d0000-0000-7000-8000-0000000000c1'

// Count rows visible for a report id under a given app.role via the NO-BYPASSRLS pool.
function selectReportCountAs(role: string, reportId: string, contextUserId = '') {
  return withRlsAs(appRuntimeDb, role, contextUserId, async (tx) => {
    const rows = await tx
      .select({ id: contentReports.id })
      .from(contentReports)
      .where(eq(contentReports.id, reportId))
    return rows.length
  })
}

async function buildReportsApp() {
  const { jwtAuthRoutes } = await import('../../features/auth/routes')
  const { adminReportsRoutes } = await import('../../features/admin/reports.routes')

  return createRlsApp(appRuntimeDb)
    .route('/auth', jwtAuthRoutes)
    .route('/admin/reports', adminReportsRoutes)
}

setupDbTests()

describe('content_reports RLS under app_runtime', () => {
  async function seedReport(reporterId: string, reason: string) {
    const [rep] = await testDb
      .insert(contentReports)
      .values({ reporterId, targetType: 'review', targetId: TARGET, reason })
      .returning({ id: contentReports.id })
    if (!rep) throw new Error('report seed failed')
    return rep.id
  }

  it('lets a contributor + admin read a report filed by another user; a non-reporter user sees none', async () => {
    const reporter = await createTestUser('cr-reporter@test.local', 'Azerty123!')
    const other = await createTestUser('cr-other@test.local', 'Azerty123!')

    const repId = await seedReport(reporter.id, 'x')

    // moderation queue: a contributor (different identity) sees the row
    expect(await selectReportCountAs('contributor', repId, other.id)).toBe(1)
    expect(await selectReportCountAs('admin', repId, other.id)).toBe(1)
    // a plain user who is not the reporter sees nothing (queue stays private to modo)
    expect(await selectReportCountAs('user', repId, other.id)).toBe(0)
    // the reporter still sees their own row via tenant_isolation
    expect(await selectReportCountAs('user', repId, reporter.id)).toBe(1)
  })

  it('lets a contributor escalate a report owned by another user (UPDATE under prod RLS)', async () => {
    const reporter = await createTestUser('cr-up-reporter@test.local', 'Azerty123!')
    await createTestContributorUser('cr-up-modo@test.local', 'Azerty123!')

    const repId = await seedReport(reporter.id, 'needs admin')

    const app = await buildReportsApp()
    const token = await loginViaRlsApp(app, 'cr-up-modo@test.local', 'Azerty123!')

    const res = await app.request(`/admin/reports/${repId}/escalate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    })

    // Without content_reports_moderation_update this is 404 (UPDATE touches 0 rows).
    expect(res.status).toBe(HTTP_STATUS.OK)

    const [updated] = await testDb
      .select({ escalatedAt: contentReports.escalatedAt })
      .from(contentReports)
      .where(eq(contentReports.id, repId))
    expect(updated?.escalatedAt).not.toBeNull()
  })

  it('denies a non-moderator user escalate even though the route would allow the SQL', async () => {
    const reporter = await createTestUser('cr-deny-reporter@test.local', 'Azerty123!')
    await createTestUser('cr-deny-user@test.local', 'Azerty123!')

    const repId = await seedReport(reporter.id, 'nope')

    const app = await buildReportsApp()
    const token = await loginViaRlsApp(app, 'cr-deny-user@test.local', 'Azerty123!')

    const res = await app.request(`/admin/reports/${repId}/escalate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(HTTP_STATUS.FORBIDDEN)
  })
})

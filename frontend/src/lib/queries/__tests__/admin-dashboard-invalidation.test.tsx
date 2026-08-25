import type {
  AdminDashboard,
  CreateBanResult,
  ListReportsResponse,
  ModerateContentResult,
  ModerateProfileResult,
  ModerationTarget,
  ReportView,
  ReviewRoleRequestResult,
} from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { act, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'
import {
  adminQueries,
  useCreateBan,
  useLiftBan,
  useModerateContent,
  useModerateProfileVisibility,
  useResolveReport,
  useReviewRoleRequest,
} from '../admin'
import { useCreateReport } from '../reports'

const DASHBOARD = {
  openReports: 1,
  activeBans: 2,
  hiddenReviews: 3,
  hiddenThreads: 4,
  hiddenReplies: 5,
  forcedPrivateProfiles: 6,
  pendingRoleRequests: 7,
} satisfies AdminDashboard

const CREATED_AT = '2026-08-20T10:00:00.000Z'
const ACTOR_ID = '44444444-4444-4444-8444-444444444444'

const CREATE_BAN_RESULT = {
  success: true,
  data: {
    id: 'ban-1',
    userId: 'user-1',
    scope: 'global',
    reason: null,
    bannedBy: ACTOR_ID,
    expiresAt: null,
    createdAt: CREATED_AT,
  },
} satisfies CreateBanResult

const MODERATE_PROFILE_RESULT = {
  success: true,
  data: {
    userId: 'user-1',
    forcedPrivateByAdmin: true,
    forcedPrivateReason: null,
  },
} satisfies ModerateProfileResult

const RESOLVED_REPORT = {
  id: 'report-1',
  reporterId: 'user-1',
  targetType: 'profile',
  targetId: 'user-1',
  reason: 'Spam',
  status: 'resolved',
  reviewedBy: ACTOR_ID,
  reviewedAt: CREATED_AT,
  escalatedAt: null,
  escalatedBy: null,
  createdAt: CREATED_AT,
} satisfies ReportView

const REVIEW_ROLE_REQUEST_RESULT = {
  success: true,
  data: {
    id: 'request-1',
    userId: 'user-1',
    motivation: 'I can help review the catalogue',
    motivationLink: null,
    status: 'rejected',
    rejectionReason: 'Insufficient',
    reviewedBy: ACTOR_ID,
    reviewedAt: CREATED_AT,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
  },
} satisfies ReviewRoleRequestResult

const MODERATE_CONTENT_RESULT = {
  success: true,
  data: {
    id: 'content-1',
    moderationStatus: 'hidden',
    moderationReason: null,
  },
} satisfies ModerateContentResult

const CREATED_REPORT = {
  id: 'report-new',
  reporterId: 'user-1',
  targetType: 'profile',
  targetId: '11111111-1111-4111-8111-111111111111',
  reason: 'Spam',
  status: 'open',
  reviewedBy: null,
  reviewedAt: null,
  escalatedAt: null,
  escalatedBy: null,
  createdAt: CREATED_AT,
} satisfies ReportView

let dashboardReads = 0

function useDashboardMutations() {
  return {
    dashboard: useQuery(adminQueries.dashboard()),
    createBan: useCreateBan('user-1'),
    liftBan: useLiftBan('user-1'),
    moderateProfile: useModerateProfileVisibility('user-1'),
    resolveReport: useResolveReport(),
    reviewRoleRequest: useReviewRoleRequest(),
    moderateContent: useModerateContent(),
    createReport: useCreateReport(),
  }
}

type DashboardMutations = ReturnType<typeof useDashboardMutations>

async function renderAndMutate(run: (mutations: DashboardMutations) => Promise<unknown>) {
  const queryClient = createTestQueryClient()
  const { result } = renderHookWithProviders(() => useDashboardMutations(), { queryClient })
  await waitFor(() => expect(result.current.dashboard.isSuccess).toBe(true))
  expect(dashboardReads).toBe(1)

  await act(() => run(result.current))

  return result
}

describe('admin dashboard invalidation', () => {
  beforeEach(() => {
    dashboardReads = 0
    server.use(
      http.get('*/api/admin/dashboard', () => {
        dashboardReads += 1
        return HttpResponse.json({ success: true, data: DASHBOARD })
      }),
      http.post('*/api/admin/users/:id/bans', () => HttpResponse.json(CREATE_BAN_RESULT)),
      http.delete('*/api/admin/bans/:banId', () => new HttpResponse(null, { status: 204 })),
      http.patch('*/api/admin/moderation/profiles/:userId/visibility', () =>
        HttpResponse.json(MODERATE_PROFILE_RESULT)
      ),
      http.patch('*/api/admin/reports/:id', () =>
        HttpResponse.json({ success: true, data: RESOLVED_REPORT })
      ),
      http.patch('*/api/admin/role-requests/:id', () =>
        HttpResponse.json(REVIEW_ROLE_REQUEST_RESULT)
      ),
      http.patch('*/api/admin/moderation/:target/:id', () =>
        HttpResponse.json(MODERATE_CONTENT_RESULT)
      ),
      http.post('*/api/reports', () =>
        HttpResponse.json({ success: true, data: CREATED_REPORT }, { status: 201 })
      )
    )
  })

  it.each([
    [
      'creating a ban',
      (hooks: DashboardMutations) => hooks.createBan.mutateAsync({ scope: 'global' }),
    ],
    ['lifting a ban', (hooks: DashboardMutations) => hooks.liftBan.mutateAsync('ban-1')],
    [
      'forcing a profile private',
      (hooks: DashboardMutations) => hooks.moderateProfile.mutateAsync({ forcedPrivate: true }),
    ],
    [
      'resolving a report',
      (hooks: DashboardMutations) =>
        hooks.resolveReport.mutateAsync({ id: 'report-1', body: { status: 'resolved' } }),
    ],
    [
      'reviewing a role request',
      (hooks: DashboardMutations) =>
        hooks.reviewRoleRequest.mutateAsync({
          id: 'request-1',
          body: { decision: 'reject', reason: 'Insufficient' },
        }),
    ],
    [
      'creating a report',
      (hooks: DashboardMutations) =>
        hooks.createReport.mutateAsync({
          targetType: 'profile',
          targetId: '11111111-1111-4111-8111-111111111111',
          reason: 'Spam',
        }),
    ],
  ] as const)('refetches the active dashboard after %s', async (_label, run) => {
    await renderAndMutate(run)
    await waitFor(() => expect(dashboardReads).toBe(2))
  })

  it.each(['reviews', 'threads', 'replies'] as const)(
    'refetches the active dashboard after moderating %s',
    async (target) => {
      await renderAndMutate((hooks) =>
        hooks.moderateContent.mutateAsync({
          target,
          id: `${target}-1`,
          body: { status: 'hidden' },
        })
      )
      await waitFor(() => expect(dashboardReads).toBe(2))
    }
  )

  it.each(['products', 'ingredients'] as const)(
    'does not refetch the dashboard after moderating uncounted %s',
    async (target: ModerationTarget) => {
      const result = await renderAndMutate((hooks) =>
        hooks.moderateContent.mutateAsync({
          target,
          id: `${target}-1`,
          body: { status: 'hidden' },
        })
      )
      await waitFor(() => expect(result.current.moderateContent.isPending).toBe(false))
      expect(dashboardReads).toBe(1)
    }
  )

  it('refetches the active open report queue after creating a report', async () => {
    let reportReads = 0
    const report = {
      id: '22222222-2222-4222-8222-222222222222',
      reporterId: '33333333-3333-4333-8333-333333333333',
      targetType: 'profile',
      targetId: '11111111-1111-4111-8111-111111111111',
      reason: 'Spam',
      status: 'open',
      reviewedBy: null,
      reviewedAt: null,
      escalatedAt: null,
      escalatedBy: null,
      createdAt: '2026-08-20T10:00:00.000Z',
    } satisfies ReportView
    const reports = { items: [report] } satisfies ListReportsResponse
    server.use(
      http.get('*/api/admin/reports', () => {
        reportReads += 1
        return HttpResponse.json({ success: true, data: reports })
      })
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        dashboard: useQuery(adminQueries.dashboard()),
        reports: useQuery(adminQueries.reports('open')),
        createReport: useCreateReport(),
      }),
      { queryClient }
    )

    await waitFor(() => {
      expect(result.current.dashboard.isSuccess).toBe(true)
      expect(result.current.reports.isSuccess).toBe(true)
    })
    expect(dashboardReads).toBe(1)
    expect(reportReads).toBe(1)

    await act(() =>
      result.current.createReport.mutateAsync({
        targetType: 'profile',
        targetId: report.targetId,
        reason: report.reason,
      })
    )

    await waitFor(() => {
      expect(dashboardReads).toBe(2)
      expect(reportReads).toBe(2)
    })
  })
})

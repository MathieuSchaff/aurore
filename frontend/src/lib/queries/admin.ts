import type {
  AdminBanErrorCode,
  AdminRoleErrorCode,
  CatalogKind,
  CatalogQuality,
  CommonErrorCode,
  CreateBanInput,
  ModerateContentInput,
  ModerateProfileInput,
  ModerationStatus,
  ModerationTarget,
  ReportStatus,
  ResolveReportInput,
  ReviewRoleRequestErrorCode,
  ReviewRoleRequestInput,
  ReviewSuggestedEditInput,
  RoleRequestStatus,
  SecuritySeverity,
  SuggestedEditStatus,
  UpdateRoleInput,
} from '@aurore/shared'

import { type QueryClient, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '../api'
import { throwIfNotOk, unwrapData } from '../helpers/apiError'
import { catalogSubmissionKeys } from './catalog-submissions'
import { invalidateDiscussionReads } from './discussions'
import { invalidateIngredientReads } from './ingredients'
import {
  invalidateProductAuthorReads,
  invalidateProductReads,
  invalidateProductReviewReads,
} from './products'
import { invalidateProfileReviewReads, invalidatePublicProfileReads } from './profile'
import { invalidateSocialReads } from './social'

const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  user: (userId: string) => [...adminKeys.users(), userId] as const,
  userBans: (userId: string) => [...adminKeys.user(userId), 'bans'] as const,
  reports: (status?: ReportStatus, escalated?: boolean) =>
    [...adminKeys.all, 'reports', { status, escalated }] as const,
  suggestedEdits: (status?: SuggestedEditStatus) =>
    [...adminKeys.all, 'suggested-edits', { status }] as const,
  roleRequests: (status?: RoleRequestStatus) =>
    [...adminKeys.all, 'role-requests', { status }] as const,
  preview: (target: ModerationTarget, id: string) =>
    [...adminKeys.all, 'preview', target, id] as const,
  catalogQueue: (kind: CatalogKind, quality?: CatalogQuality, status?: ModerationStatus) =>
    [...adminKeys.all, 'catalog-queue', { kind, quality, status }] as const,
  securityEvents: (severity?: SecuritySeverity) =>
    [...adminKeys.all, 'security-events', { severity }] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
}

const CREATE_BAN_HANDLED_ERROR_CODES = [
  'cannot_self_ban',
  'already_banned',
] as const satisfies readonly AdminBanErrorCode[]
const LIFT_BAN_HANDLED_ERROR_CODES = ['not_found'] as const satisfies readonly AdminBanErrorCode[]
const MODERATE_PROFILE_HANDLED_ERROR_CODES = [
  'not_found',
] as const satisfies readonly CommonErrorCode[]
const DEMOTE_USER_HANDLED_ERROR_CODES = [
  'cannot_self_demote',
  'not_a_contributor',
  'not_found',
] as const satisfies readonly AdminRoleErrorCode[]
const REVIEW_ROLE_REQUEST_HANDLED_ERROR_CODES = [
  'not_found',
  'not_pending',
] as const satisfies readonly ReviewRoleRequestErrorCode[]
const REVIEW_SUGGESTED_EDIT_HANDLED_ERROR_CODES = [
  'not_found',
  'invalid_input',
] as const satisfies readonly CommonErrorCode[]
const RESOLVE_REPORT_HANDLED_ERROR_CODES = [
  'not_found',
  'forbidden',
] as const satisfies readonly CommonErrorCode[]
const ESCALATE_REPORT_HANDLED_ERROR_CODES = [
  'not_found',
] as const satisfies readonly CommonErrorCode[]
const MODERATE_CONTENT_HANDLED_ERROR_CODES = [
  'not_found',
  'invalid_input',
] as const satisfies readonly CommonErrorCode[]

export function invalidateAdminDashboard(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: adminKeys.dashboard() })
}

export function invalidateOpenAdminReports(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: adminKeys.reports('open'), exact: true })
}

export const adminQueries = {
  users: () =>
    queryOptions({
      queryKey: adminKeys.users(),
      queryFn: async () => {
        const res = await api.admin.users.$get()
        return unwrapData(res)
      },
    }),

  user: (userId: string) =>
    queryOptions({
      queryKey: adminKeys.user(userId),
      queryFn: async () => {
        const res = await api.admin.users[':id'].$get({ param: { id: userId } })
        return unwrapData(res)
      },
      enabled: !!userId,
    }),

  userBans: (userId: string) =>
    queryOptions({
      queryKey: adminKeys.userBans(userId),
      queryFn: async () => {
        const res = await api.admin.users[':id'].bans.$get({ param: { id: userId } })
        return unwrapData(res)
      },
      enabled: !!userId,
    }),

  reports: (status?: ReportStatus, escalated?: boolean) =>
    queryOptions({
      queryKey: adminKeys.reports(status, escalated),
      queryFn: async () => {
        const query: Record<string, string> = {}
        if (status) query.status = status
        if (escalated) query.escalated = 'true'
        const res = await api.admin.reports.$get({ query })
        return unwrapData(res)
      },
    }),

  suggestedEdits: (status?: SuggestedEditStatus) =>
    queryOptions({
      queryKey: adminKeys.suggestedEdits(status),
      queryFn: async () => {
        const query: Record<string, string> = {}
        if (status) query.status = status
        const res = await api.admin['suggested-edits'].$get({ query })
        return unwrapData(res)
      },
    }),

  roleRequests: (status?: RoleRequestStatus) =>
    queryOptions({
      queryKey: adminKeys.roleRequests(status),
      queryFn: async () => {
        const query: Record<string, string> = {}
        if (status) query.status = status
        const res = await api.admin['role-requests'].$get({ query })
        return unwrapData(res)
      },
    }),

  securityEvents: (severity?: SecuritySeverity) =>
    queryOptions({
      queryKey: adminKeys.securityEvents(severity),
      queryFn: async () => {
        const query: Record<string, string> = {}
        if (severity) query.severity = severity
        const res = await api.admin['security-events'].$get({ query })
        return unwrapData(res)
      },
    }),

  dashboard: () =>
    queryOptions({
      queryKey: adminKeys.dashboard(),
      queryFn: async () => {
        const res = await api.admin.dashboard.$get()
        return unwrapData(res)
      },
      staleTime: 30_000,
    }),

  catalogQueue: (kind: CatalogKind, quality?: CatalogQuality, status?: ModerationStatus) =>
    queryOptions({
      queryKey: adminKeys.catalogQueue(kind, quality, status),
      queryFn: async () => {
        const query: { kind: CatalogKind; quality?: CatalogQuality; status?: ModerationStatus } = {
          kind,
        }
        if (quality) query.quality = quality
        if (status) query.status = status
        const res = await api.admin.moderation.catalog.$get({ query })
        return unwrapData(res)
      },
      // Queue only changes when a moderator acts (which invalidates it explicitly);
      // suppress the default 0ms window-focus refetch during an action.
      staleTime: 30_000,
    }),

  contentPreview: (target: ModerationTarget, id: string) =>
    queryOptions({
      queryKey: adminKeys.preview(target, id),
      queryFn: async () => {
        const res = await api.admin.moderation[target][':id'].$get({ param: { id } })
        return unwrapData(res)
      },
      enabled: !!id,
      // Short stale so toggling visible/hidden reflects immediately after moderation.
      staleTime: 5_000,
    }),
}

export function useCreateBan(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['admin', 'ban', 'create'],
    meta: { handledErrorCodes: CREATE_BAN_HANDLED_ERROR_CODES },
    mutationFn: async (body: CreateBanInput) => {
      const res = await api.admin.users[':id'].bans.$post({
        param: { id: userId },
        json: body,
      })
      return unwrapData(res)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.userBans(userId) })
      qc.invalidateQueries({ queryKey: adminKeys.dashboard() })
    },
  })
}

export function useLiftBan(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['admin', 'ban', 'lift'],
    meta: { handledErrorCodes: LIFT_BAN_HANDLED_ERROR_CODES },
    mutationFn: async (banId: string) => {
      const res = await api.admin.bans[':banId'].$delete({ param: { banId } })
      await throwIfNotOk(res)
      return banId
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.userBans(userId) })
      qc.invalidateQueries({ queryKey: adminKeys.dashboard() })
    },
  })
}

export function useModerateProfileVisibility(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['admin', 'profile-visibility', 'update'],
    meta: { handledErrorCodes: MODERATE_PROFILE_HANDLED_ERROR_CODES },
    mutationFn: async (body: ModerateProfileInput) => {
      const res = await api.admin.moderation.profiles[':userId'].visibility.$patch({
        param: { userId },
        json: body,
      })
      return unwrapData(res)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users(), exact: true })
      qc.invalidateQueries({ queryKey: adminKeys.user(userId), exact: true })
      qc.invalidateQueries({ queryKey: adminKeys.dashboard() })
      invalidatePublicProfileReads(qc)
      invalidateProductAuthorReads(qc)
      invalidateDiscussionReads(qc)
      invalidateSocialReads(qc)
    },
  })
}

export function useDemoteToUser(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['admin', 'user-role', 'demote'],
    meta: { handledErrorCodes: DEMOTE_USER_HANDLED_ERROR_CODES },
    mutationFn: async (body: UpdateRoleInput) => {
      const res = await api.admin.users[':id'].role.$patch({
        param: { id: userId },
        json: body,
      })
      return unwrapData(res)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.users(), exact: true })
      qc.invalidateQueries({ queryKey: adminKeys.user(userId), exact: true })
    },
  })
}

export function useResolveReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['admin', 'report', 'resolve'],
    meta: { handledErrorCodes: RESOLVE_REPORT_HANDLED_ERROR_CODES },
    mutationFn: async ({ id, body }: { id: string; body: ResolveReportInput }) => {
      const res = await api.admin.reports[':id'].$patch({
        param: { id },
        json: body,
      })
      return unwrapData(res)
    },
    // Broad prefix: resolving from the escalated tab must also refresh that view; a status-only key would miss it.
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...adminKeys.all, 'reports'] })
      qc.invalidateQueries({ queryKey: adminKeys.dashboard() })
    },
  })
}

export function useEscalateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['admin', 'report', 'escalate'],
    meta: { handledErrorCodes: ESCALATE_REPORT_HANDLED_ERROR_CODES },
    mutationFn: async (id: string) => {
      const res = await api.admin.reports[':id'].escalate.$patch({ param: { id } })
      return unwrapData(res)
    },
    // Broad prefix: refreshes all status/escalated views (2-element key partial match).
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...adminKeys.all, 'reports'] })
    },
  })
}

export function useReviewSuggestedEdit() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['admin', 'suggested-edit', 'review'],
    meta: { handledErrorCodes: REVIEW_SUGGESTED_EDIT_HANDLED_ERROR_CODES },
    mutationFn: async ({ id, body }: { id: string; body: ReviewSuggestedEditInput }) => {
      const res = await api.admin['suggested-edits'][':id'].$patch({ param: { id }, json: body })
      return unwrapData(res)
    },
    // A decision moves a row between status tabs, so every cached view must refresh
    onSuccess: (edit) => {
      qc.invalidateQueries({ queryKey: [...adminKeys.all, 'suggested-edits'] })
      if (edit.status === 'accepted' && edit.targetType === 'product') {
        invalidateProductReads(qc)
      }
      if (edit.status === 'accepted' && edit.targetType === 'ingredient') {
        invalidateIngredientReads(qc)
      }
      if (edit.status === 'accepted') {
        qc.invalidateQueries({ queryKey: [...adminKeys.all, 'catalog-queue'] })
        qc.invalidateQueries({ queryKey: catalogSubmissionKeys.mine() })
      }
    },
  })
}

export function useReviewRoleRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['admin', 'role-request', 'review'],
    meta: { handledErrorCodes: REVIEW_ROLE_REQUEST_HANDLED_ERROR_CODES },
    mutationFn: async ({ id, body }: { id: string; body: ReviewRoleRequestInput }) => {
      const res = await api.admin['role-requests'][':id'].$patch({ param: { id }, json: body })
      return unwrapData(res)
    },
    onSuccess: (request) => {
      // Broad prefix: a decision moves a row between status tabs, so any cached
      // status view must refresh. A { status } key only deep-matches its own filter.
      qc.invalidateQueries({ queryKey: [...adminKeys.all, 'role-requests'] })
      // The dashboard's 5th card counts pending requests; refresh it after a decision.
      qc.invalidateQueries({ queryKey: adminKeys.dashboard() })
      if (request.status === 'approved') {
        qc.invalidateQueries({ queryKey: adminKeys.users(), exact: true })
        qc.invalidateQueries({ queryKey: adminKeys.user(request.userId), exact: true })
      }
    },
  })
}

export function useModerateContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['admin', 'content', 'moderate'],
    meta: { handledErrorCodes: MODERATE_CONTENT_HANDLED_ERROR_CODES },
    mutationFn: async ({
      target,
      id,
      body,
    }: {
      target: ModerationTarget
      id: string
      body: ModerateContentInput
    }) => {
      const res = await api.admin.moderation[target][':id'].$patch({
        param: { id },
        json: body,
      })
      return unwrapData(res)
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: adminKeys.preview(vars.target, vars.id) })
      // Hiding/restoring shifts a product or ingredient between catalog queue views; no-op when no queue is mounted.
      qc.invalidateQueries({ queryKey: [...adminKeys.all, 'catalog-queue'] })
      // Owner's submissions dashboard renders the moderation badge + note; refresh it too (no-op when not mounted).
      qc.invalidateQueries({ queryKey: catalogSubmissionKeys.mine() })
      if (vars.target === 'products') invalidateProductReads(qc)
      if (vars.target === 'ingredients') invalidateIngredientReads(qc)
      if (vars.target === 'reviews') {
        invalidateProductReviewReads(qc)
        invalidateProfileReviewReads(qc)
      }
      if (vars.target === 'threads' || vars.target === 'replies') invalidateDiscussionReads(qc)
      if (vars.target === 'reviews' || vars.target === 'threads' || vars.target === 'replies') {
        qc.invalidateQueries({ queryKey: adminKeys.dashboard() })
      }
    },
  })
}

export function useVerifyCatalogItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['admin', 'catalog-item', 'verify'],
    mutationFn: async ({ kind, id }: { kind: CatalogKind; id: string }) => {
      if (kind === 'product') {
        const res = await api.products[':id'].quality.$patch({
          param: { id },
          json: { quality: 'verified' },
        })
        return unwrapData(res)
      }
      const res = await api.ingredients[':id'].quality.$patch({
        param: { id },
        json: { quality: 'verified' },
      })
      return unwrapData(res)
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: [...adminKeys.all, 'catalog-queue'] })
      // Verifying flips the owner's submissions badge to « Vérifiée ».
      qc.invalidateQueries({ queryKey: catalogSubmissionKeys.mine() })
      if (vars.kind === 'product') invalidateProductReads(qc)
      if (vars.kind === 'ingredient') invalidateIngredientReads(qc)
    },
  })
}

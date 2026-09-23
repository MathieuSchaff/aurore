import type { CreateReportInput, ListReportsResponse, ReportStatus } from '@aurore/shared'

import { and, desc, eq, isNotNull, isNull } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../db'
import { contentReports } from '../../db/schema'
import { lockVisiblePolymorphicTarget } from '../../lib/polymorphic-target'
import { nowISO } from '../../utils/dates'
import { ReportError } from './report-error'

export async function createReport(
  db: DatabaseTransaction,
  args: { reporterId: string; body: CreateReportInput }
) {
  if (!(await lockVisiblePolymorphicTarget(db, args.body.targetType, args.body.targetId))) {
    throw new ReportError('not_found')
  }

  const [row] = await db
    .insert(contentReports)
    .values({
      reporterId: args.reporterId,
      targetType: args.body.targetType,
      targetId: args.body.targetId,
      reason: args.body.reason,
    })
    .returning()

  if (!row) throw new ReportError('server_error')
  return row
}

export async function listReports(
  db: DatabaseTransaction,
  filters: { status?: ReportStatus; escalated?: 'true'; excludeEscalated?: boolean }
): Promise<ListReportsResponse> {
  const conditions = []
  if (filters.status) conditions.push(eq(contentReports.status, filters.status))
  if (filters.escalated === 'true') conditions.push(isNotNull(contentReports.escalatedAt))
  if (filters.excludeEscalated) conditions.push(isNull(contentReports.escalatedAt))

  const rows = await db
    .select()
    .from(contentReports)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(contentReports.createdAt))

  return { items: rows }
}

export async function resolveReport(
  db: DatabaseTransaction,
  args: {
    id: string
    reviewerId: string
    reviewerRole: 'admin' | 'contributor'
    status: 'resolved' | 'dismissed'
  }
) {
  const [row] = await db
    .update(contentReports)
    .set({
      status: args.status,
      reviewedBy: args.reviewerId,
      reviewedAt: nowISO(),
    })
    .where(
      and(
        eq(contentReports.id, args.id),
        eq(contentReports.status, 'open'),
        args.reviewerRole === 'contributor' ? isNull(contentReports.escalatedAt) : undefined
      )
    )
    .returning()

  if (!row) {
    const [existing] = await db
      .select({ escalatedAt: contentReports.escalatedAt })
      .from(contentReports)
      .where(eq(contentReports.id, args.id))
    if (!existing) throw new ReportError('not_found')
    if (args.reviewerRole === 'contributor' && existing.escalatedAt) {
      throw new ReportError('forbidden')
    }
    throw new ReportError('report_transition_conflict')
  }
  return row
}

// Escalation is orthogonal to status (ADR-0006): the report stays open until resolution
// Its first moderator keeps attribution when another request reaches the same report
export async function escalateReport(
  db: DatabaseTransaction,
  args: { id: string; moderatorId: string }
) {
  const [row] = await db
    .update(contentReports)
    .set({ escalatedAt: nowISO(), escalatedBy: args.moderatorId })
    .where(
      and(
        eq(contentReports.id, args.id),
        eq(contentReports.status, 'open'),
        isNull(contentReports.escalatedAt)
      )
    )
    .returning()

  if (!row) {
    const [existing] = await db
      .select({ id: contentReports.id })
      .from(contentReports)
      .where(eq(contentReports.id, args.id))
    throw new ReportError(existing ? 'report_transition_conflict' : 'not_found')
  }
  return row
}

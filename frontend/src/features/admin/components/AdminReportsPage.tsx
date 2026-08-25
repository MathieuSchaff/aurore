import type { CommonErrorCode, ReportStatus, ReportTargetType } from '@aurore/shared'

import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { Time } from '@/component/DataDisplay/Time/Time'
import { FormMessage } from '@/component/Feedback/ui/FormMessage/FormMessage'
import { AdminFilterTabs } from '@/features/admin/components/AdminFilterTabs'
import { useConfirm } from '@/features/admin/useConfirm'
import { useSession } from '@/lib/auth/session'
import { apiErrorMessage, isApiErrorCode } from '@/lib/helpers/apiError'
import { captureFrontendError } from '@/lib/observability/faro'
import {
  adminQueries,
  useEscalateReport,
  useModerateContent,
  useResolveReport,
} from '@/lib/queries/admin'
import { adminLabels, roleLabels, rolePillClass } from '../constants'
import { useSuccessFeedback } from '../useSuccessFeedback'

type ReportTab = ReportStatus | 'escalated'

// The escalated view is admin-facing (a modo hands a case up, it leaves their concern).
const TABS: ReadonlyArray<{ value: ReportTab; label: string; adminOnly?: boolean }> = [
  { value: 'open', label: 'Ouverts' },
  { value: 'resolved', label: 'Résolus' },
  { value: 'dismissed', label: 'Rejetés' },
  { value: 'escalated', label: 'Escaladés', adminOnly: true },
]

const TARGET_TO_MODERATE: Record<
  Exclude<ReportTargetType, 'profile'>,
  'reviews' | 'threads' | 'replies' | 'products' | 'ingredients'
> = {
  review: 'reviews',
  thread: 'threads',
  reply: 'replies',
  product: 'products',
  ingredient: 'ingredients',
}

const ACTION_ERROR_MESSAGES: Partial<Record<CommonErrorCode, string>> = {
  not_found: 'Signalement introuvable.',
  forbidden: 'Ce signalement est désormais réservé aux administrateurs.',
}
const MODERATION_ERROR_MESSAGES: Partial<Record<CommonErrorCode, string>> = {
  not_found: 'Contenu introuvable.',
  invalid_input: 'Cette action de modération n’est plus valide.',
}
const ACTION_FAILED = 'L’action a échoué. Réessayez.'

export function AdminReportsPage() {
  const [tab, setTab] = useState<ReportTab>('open')
  // Moderators get content-only queue, never account PII.
  const session = useSession()
  const isAdmin = session.status === 'authenticated' && session.user.role === 'admin'
  const isEscalatedView = tab === 'escalated'
  const statusFilter: ReportStatus | undefined = tab === 'escalated' ? undefined : tab
  const { data } = useSuspenseQuery(
    isEscalatedView ? adminQueries.reports(undefined, true) : adminQueries.reports(statusFilter)
  )
  const usersQuery = useQuery({ ...adminQueries.users(), enabled: isAdmin })
  const resolve = useResolveReport()
  const escalate = useEscalateReport()
  const { confirm, dialog } = useConfirm()
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [escalatingId, setEscalatingId] = useState<string | null>(null)
  const { success, setSuccess } = useSuccessFeedback()
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const tabRef = useRef(tab)
  const visibleTabs = TABS.filter((t) => !t.adminOnly || isAdmin)

  const reporterEmailById = useMemo(() => {
    const map = new Map<string, string>()
    for (const u of usersQuery.data?.items ?? []) map.set(u.id, u.email)
    return map
  }, [usersQuery.data])

  const userById = useMemo(() => {
    const map = new Map<string, NonNullable<typeof usersQuery.data>['items'][number]>()
    for (const u of usersQuery.data?.items ?? []) map.set(u.id, u)
    return map
  }, [usersQuery.data])

  async function handleResolve(id: string, next: 'resolved' | 'dismissed') {
    const requestTab = tab
    const label = next === 'resolved' ? 'Résoudre' : 'Rejeter'
    const ok = await confirm({
      title: `${label} ce signalement ?`,
      message:
        next === 'resolved'
          ? 'Marque le signalement comme traité.'
          : 'Marque le signalement comme non recevable, sans action sur le contenu.',
      confirmLabel: label,
    })
    if (!ok) return
    setError(null)
    setSuccess(null)
    setPendingId(id)
    resolve.mutate(
      { id, body: { status: next } },
      {
        onSuccess: () => {
          if (tabRef.current === requestTab) {
            setSuccess(next === 'resolved' ? 'Signalement résolu.' : 'Signalement rejeté.')
          }
        },
        onError: (mutationError) => {
          if (tabRef.current === requestTab) {
            setError(apiErrorMessage(mutationError, ACTION_ERROR_MESSAGES, ACTION_FAILED))
          }
        },
        onSettled: () => setPendingId(null),
      }
    )
  }

  async function handleEscalate(id: string) {
    const requestTab = tab
    const ok = await confirm({
      title: 'Escalader à l’admin ?',
      message:
        'Le signalement est transmis à un administrateur pour les actions qui dépassent la modération de contenu. Action neutre et réversible.',
      confirmLabel: 'Escalader',
    })
    if (!ok) return
    setError(null)
    setSuccess(null)
    setEscalatingId(id)
    escalate.mutate(id, {
      onSuccess: () => {
        if (tabRef.current === requestTab) setSuccess('Signalement escaladé à l’admin.')
      },
      onError: (mutationError) => {
        if (tabRef.current === requestTab) {
          setError(apiErrorMessage(mutationError, ACTION_ERROR_MESSAGES, ACTION_FAILED))
        }
      },
      onSettled: () => setEscalatingId(null),
    })
  }

  function changeTab(next: ReportTab) {
    tabRef.current = next
    setSuccess(null)
    setError(null)
    setExpandedId(null)
    setTab(next)
  }

  const items = data.items

  return (
    <section>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Signalements</h1>
          <p className="admin-page__lede">{items.length} entrée(s)</p>
        </div>
      </header>

      <AdminFilterTabs
        tabs={visibleTabs}
        value={tab}
        onChange={changeTab}
        label="File de signalements"
      />

      <div aria-live="polite" aria-atomic="true">
        {success && <FormMessage variant="success">{success}</FormMessage>}
        {error && <FormMessage variant="error">{error}</FormMessage>}
      </div>

      {items.length === 0 ? (
        <p className="admin-table__empty">{adminLabels.emptyReports}</p>
      ) : (
        <div className="admin-table-scroll">
          <table className="admin-table">
            <caption className="sr-only">Liste des signalements à modérer</caption>
            <thead>
              <tr>
                <th>Cible</th>
                <th>Raison</th>
                <th>Signalé par</th>
                <th>Signalé</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => {
                const isExpanded = expandedId === r.id
                const reporterEmail = reporterEmailById.get(r.reporterId) ?? null
                const canPreview = r.targetType !== 'profile'
                const targetUser =
                  isAdmin && r.targetType === 'profile' ? userById.get(r.targetId) : null
                return (
                  <Fragment key={r.id}>
                    <tr>
                      <td>
                        {targetUser ? (
                          <div className="admin-target-snapshot">
                            <span className="admin-target-snapshot__email">{targetUser.email}</span>
                            <span className="admin-target-snapshot__meta">
                              <span className={rolePillClass(targetUser.role)}>
                                {roleLabels[targetUser.role]}
                              </span>
                              {targetUser.forcedPrivateByAdmin && (
                                <span className="admin-pill admin-pill--banned">
                                  {adminLabels.pillForced}
                                </span>
                              )}
                            </span>
                          </div>
                        ) : (
                          <code className="admin-target-code">
                            {r.targetType}#{r.targetId.slice(0, 8)}
                          </code>
                        )}
                      </td>
                      <td>{r.reason}</td>
                      <td>{isAdmin ? (reporterEmail ?? <em>—</em>) : <em>—</em>}</td>
                      <td>
                        <Time iso={r.createdAt} relative />
                      </td>
                      <td>
                        <span className={`admin-pill admin-pill--${r.status}`}>{r.status}</span>
                        {r.escalatedAt && (
                          <span className="admin-pill admin-pill--escalated">Escaladé</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-actions-inline">
                          {canPreview && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedId(isExpanded ? null : r.id)}
                              aria-expanded={isExpanded}
                            >
                              {isExpanded ? 'Replier' : 'Voir'}
                            </Button>
                          )}
                          {isAdmin && r.targetType === 'profile' && (
                            <Link
                              to="/admin/users/$userId"
                              params={{ userId: r.targetId }}
                              className="admin-table__row-link"
                            >
                              Voir le profil
                            </Link>
                          )}
                          {r.status === 'open' && (isAdmin || !r.escalatedAt) && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                loading={pendingId === r.id && resolve.isPending}
                                onClick={() => handleResolve(r.id, 'resolved')}
                              >
                                Résoudre
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                loading={pendingId === r.id && resolve.isPending}
                                onClick={() => handleResolve(r.id, 'dismissed')}
                              >
                                Rejeter
                              </Button>
                              {!r.escalatedAt && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  loading={escalatingId === r.id && escalate.isPending}
                                  onClick={() => handleEscalate(r.id)}
                                >
                                  Escalader
                                </Button>
                              )}
                            </>
                          )}
                          {r.status !== 'open' && (
                            <em className="admin-reports-meta">
                              par {reporterEmailById.get(r.reviewedBy ?? '') ?? '—'}
                            </em>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && canPreview && (
                      <tr>
                        <td colSpan={6} className="admin-preview-cell">
                          <ContentPreviewPanel
                            targetType={r.targetType as Exclude<ReportTargetType, 'profile'>}
                            targetId={r.targetId}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {dialog}
    </section>
  )
}

function ContentPreviewPanel({
  targetType,
  targetId,
}: {
  targetType: Exclude<ReportTargetType, 'profile'>
  targetId: string
}) {
  const moderateTarget = TARGET_TO_MODERATE[targetType]
  const preview = useQuery(adminQueries.contentPreview(moderateTarget, targetId))
  const moderate = useModerateContent()
  const { confirm, dialog } = useConfirm()
  const { success: feedback, setSuccess: setFeedback } = useSuccessFeedback()
  const [error, setError] = useState<string | null>(null)
  const capturedPreviewError = useRef<unknown>(null)

  useEffect(() => {
    if (!preview.isError) {
      capturedPreviewError.current = null
      return
    }
    if (
      isApiErrorCode(preview.error, 'not_found') ||
      capturedPreviewError.current === preview.error
    ) {
      return
    }
    capturedPreviewError.current = preview.error
    captureFrontendError(preview.error, {
      source: 'admin-content-preview',
      target: moderateTarget,
    })
  }, [moderateTarget, preview.error, preview.isError])

  if (preview.isLoading) return <p className="admin-reports-meta">Chargement…</p>
  if (preview.isError && isApiErrorCode(preview.error, 'not_found')) {
    return (
      <p className="admin-reports-meta">Contenu introuvable (peut-être supprimé par son auteur).</p>
    )
  }
  if (preview.isError || !preview.data) {
    return (
      <div className="admin-actions-inline">
        <p className="admin-reports-meta">Impossible de charger le contenu.</p>
        <Button variant="ghost" size="sm" onClick={() => preview.refetch()}>
          Réessayer
        </Button>
      </div>
    )
  }

  const data = preview.data
  const isHidden = data.moderationStatus === 'hidden'

  async function toggleVisibility() {
    const next = isHidden ? 'visible' : 'hidden'
    const ok = await confirm({
      title: next === 'hidden' ? 'Masquer ce contenu ?' : 'Restaurer ce contenu ?',
      message:
        next === 'hidden'
          ? 'Le contenu disparaît des lectures publiques. Action réversible.'
          : 'Le contenu redevient visible publiquement.',
      confirmLabel: next === 'hidden' ? 'Masquer' : 'Restaurer',
      variant: next === 'hidden' ? 'danger' : 'default',
    })
    if (!ok) return
    setError(null)
    setFeedback(null)
    moderate.mutate(
      { target: moderateTarget, id: targetId, body: { status: next } },
      {
        onSuccess: () => setFeedback(next === 'hidden' ? 'Contenu masqué.' : 'Contenu restauré.'),
        onError: (mutationError) =>
          setError(apiErrorMessage(mutationError, MODERATION_ERROR_MESSAGES, ACTION_FAILED)),
      }
    )
  }

  return (
    <div className="admin-preview">
      <header className="admin-preview__meta">
        <span className={`admin-pill admin-pill--${isHidden ? 'banned' : 'resolved'}`}>
          {data.moderationStatus}
        </span>
        <span className="admin-reports-meta">
          par {data.authorUsername ?? '—'} · <Time iso={data.createdAt} relative />
        </span>
      </header>
      <div className="admin-preview__body">
        {data.kind === 'review' && (data.comment ?? <em>(commentaire vide)</em>)}
        {data.kind === 'thread' && (
          <>
            <strong>{data.title}</strong>
            <p>{data.content}</p>
          </>
        )}
        {data.kind === 'reply' && <p>{data.content}</p>}
        {data.kind === 'product' && (
          <>
            <strong>{data.name}</strong>
            <p>{data.brand}</p>
          </>
        )}
        {data.kind === 'ingredient' && <strong>{data.name}</strong>}
      </div>
      {data.moderationReason && (
        <p className="admin-reports-meta">Raison admin : {data.moderationReason}</p>
      )}
      <div className="admin-actions-inline">
        <Button variant="ghost" size="sm" loading={moderate.isPending} onClick={toggleVisibility}>
          {isHidden ? 'Restaurer' : 'Masquer'}
        </Button>
        {data.authorId && (
          <Link
            to="/admin/users/$userId"
            params={{ userId: data.authorId }}
            className="admin-table__row-link"
          >
            Mettre en pause
          </Link>
        )}
      </div>
      <div aria-live="polite" aria-atomic="true">
        {feedback && <FormMessage variant="success">{feedback}</FormMessage>}
        {error && <FormMessage variant="error">{error}</FormMessage>}
      </div>
      {dialog}
    </div>
  )
}

import type { CatalogKind } from '@aurore/shared'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { Time } from '@/component/DataDisplay/Time/Time'
import { FormMessage } from '@/component/Feedback/ui/FormMessage/FormMessage'
import { AdminFilterTabs } from '@/features/admin/components/AdminFilterTabs'
import { useConfirm } from '@/features/admin/useConfirm'
import { adminQueries, useModerateContent, useVerifyCatalogItem } from '@/lib/queries/admin'
import { adminLabels } from '../constants'
import { useSuccessFeedback } from '../useSuccessFeedback'

const ACTION_FAILED = 'L’action a échoué. Réessayez.'

type View = 'to-verify' | 'hidden'

const KINDS: ReadonlyArray<{ value: CatalogKind; label: string }> = [
  { value: 'product', label: 'Produits' },
  { value: 'ingredient', label: 'Ingrédients' },
]
const VIEWS: ReadonlyArray<{ value: View; label: string }> = [
  { value: 'to-verify', label: 'À vérifier' },
  { value: 'hidden', label: 'Masqués' },
]

export function AdminCatalogPage() {
  const [kind, setKind] = useState<CatalogKind>('product')
  const [view, setView] = useState<View>('to-verify')
  const quality = view === 'to-verify' ? 'unverified' : undefined
  const status = view === 'to-verify' ? 'visible' : 'hidden'
  const { data } = useSuspenseQuery(adminQueries.catalogQueue(kind, quality, status))
  const verify = useVerifyCatalogItem()
  const moderate = useModerateContent()
  const { confirm, dialog } = useConfirm()
  const { success, setSuccess } = useSuccessFeedback()
  const [error, setError] = useState<string | null>(null)
  const contextRef = useRef({ kind, view })

  const moderateTarget = kind === 'product' ? 'products' : 'ingredients'

  // Tab switches drop stale feedback so a banner can't bleed into the next view's context.
  function changeKind(next: CatalogKind) {
    contextRef.current = { kind: next, view }
    setSuccess(null)
    setError(null)
    setKind(next)
  }
  function changeView(next: View) {
    contextRef.current = { kind, view: next }
    setSuccess(null)
    setError(null)
    setView(next)
  }

  function submitModeration(id: string, next: 'visible' | 'hidden', reason?: string) {
    const requestContext = { kind, view }
    setError(null)
    setSuccess(null)
    moderate.mutate(
      { target: moderateTarget, id, body: reason ? { status: next, reason } : { status: next } },
      {
        onSuccess: () => {
          if (
            contextRef.current.kind === requestContext.kind &&
            contextRef.current.view === requestContext.view
          ) {
            setSuccess(next === 'hidden' ? 'Fiche masquée.' : 'Fiche restaurée.')
          }
        },
        onError: () => {
          if (
            contextRef.current.kind === requestContext.kind &&
            contextRef.current.view === requestContext.view
          ) {
            setError(ACTION_FAILED)
          }
        },
      }
    )
  }

  async function handleVerify(id: string, name: string) {
    const requestContext = { kind, view }
    const ok = await confirm({
      title: 'Marquer comme vérifiée ?',
      message: `« ${name} » portera le marqueur « Vérifiée ». Action définitive.`,
      confirmLabel: 'Vérifier',
    })
    if (!ok) return
    setError(null)
    setSuccess(null)
    verify.mutate(
      { kind, id },
      {
        onSuccess: () => {
          if (
            contextRef.current.kind === requestContext.kind &&
            contextRef.current.view === requestContext.view
          ) {
            setSuccess('Fiche vérifiée.')
          }
        },
        onError: () => {
          if (
            contextRef.current.kind === requestContext.kind &&
            contextRef.current.view === requestContext.view
          ) {
            setError(ACTION_FAILED)
          }
        },
      }
    )
  }

  async function handleHide(id: string, name: string, hidden: boolean) {
    if (hidden) {
      const ok = await confirm({
        title: 'Restaurer cette fiche ?',
        message: `« ${name} » redevient visible publiquement.`,
        confirmLabel: 'Restaurer',
      })
      if (!ok) return
      submitModeration(id, 'visible')
      return
    }
    const { confirmed, reason } = await confirm({
      title: 'Masquer cette fiche ?',
      message: `« ${name} » disparaît des lectures publiques. Action réversible.`,
      confirmLabel: 'Masquer',
      variant: 'danger',
      reason: {
        label: 'Note du modérateur',
        placeholder: 'Expliquez à l’auteur pourquoi (optionnel).',
        hint: '500 caractères maximum.',
        maxLength: 500,
      },
    })
    if (!confirmed) return
    submitModeration(id, 'hidden', reason || undefined)
  }

  const items = data.items

  return (
    <section>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Modération catalogue</h1>
          <p className="admin-page__lede">{items.length} fiche(s)</p>
        </div>
      </header>

      <AdminFilterTabs tabs={KINDS} value={kind} onChange={changeKind} label="Type de fiche" />

      <AdminFilterTabs tabs={VIEWS} value={view} onChange={changeView} label="Vue" />

      <div aria-live="polite" aria-atomic="true">
        {success && <FormMessage variant="success">{success}</FormMessage>}
        {error && <FormMessage variant="error">{error}</FormMessage>}
      </div>

      {items.length === 0 ? (
        <p className="admin-table__empty">{adminLabels.emptyCatalogQueue}</p>
      ) : (
        <div className="admin-table-scroll">
          <table className="admin-table">
            <caption className="sr-only">Fiches catalogue à modérer</caption>
            <thead>
              <tr>
                <th>Fiche</th>
                <th>Qualité</th>
                <th>Auteur</th>
                <th>Soumis</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isHidden = item.moderationStatus === 'hidden'
                return (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                      {item.brand && <span className="admin-reports-meta"> · {item.brand}</span>}
                    </td>
                    <td>
                      <span className={`admin-pill admin-pill--${item.catalogQuality}`}>
                        {item.catalogQuality === 'verified' ? 'Vérifiée' : 'Non vérifiée'}
                      </span>
                    </td>
                    <td>
                      {item.authorUsername ? (
                        <span>{item.authorUsername}</span>
                      ) : (
                        <code className="admin-target-code">
                          {item.authorId?.slice(0, 8) ?? '—'}
                        </code>
                      )}
                    </td>
                    <td>
                      <Time iso={item.createdAt} relative />
                    </td>
                    <td>
                      <div className="admin-actions-inline">
                        {item.catalogQuality === 'unverified' && !isHidden && (
                          <Button
                            variant="ghost"
                            size="sm"
                            loading={verify.isPending && verify.variables?.id === item.id}
                            onClick={() => handleVerify(item.id, item.name)}
                          >
                            Vérifier
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          loading={moderate.isPending && moderate.variables?.id === item.id}
                          onClick={() => handleHide(item.id, item.name, isHidden)}
                        >
                          {isHidden ? 'Restaurer' : 'Masquer'}
                        </Button>
                      </div>
                    </td>
                  </tr>
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

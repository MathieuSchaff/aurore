/**
 * LifecycleSection — Gestion du cycle de vie des flacons.
 *
 * Affiche l'état actuel d'un flacon (ouvert, non ouvert, terminé)
 * et permet de démarrer ou terminer l'utilisation.
 * Montre aussi l'historique des flacons terminés avec leur durée.
 */

import { Calendar } from 'lucide-react'
import { toast } from 'sonner'

import type { useFinishPurchase, useOpenPurchase } from '../../../../lib/queries/purchases'
import type { UserProduct } from '../../../../lib/queries/user-products'
import './LifecycleSection.css'

interface LifecycleSectionProps {
  purchases: UserProduct['purchases']
  userProductId: string
  openPurchaseMutation: ReturnType<typeof useOpenPurchase>
  finishPurchaseMutation: ReturnType<typeof useFinishPurchase>
}

export function LifecycleSection({
  purchases,
  userProductId,
  openPurchaseMutation,
  finishPurchaseMutation,
}: LifecycleSectionProps) {
  // Flacon actuellement en cours d'utilisation (ouvert mais pas terminé)
  const activeLog = purchases?.find((l) => l.openedAt && !l.finishedAt)

  // Historique des flacons terminés, triés du plus récent au plus ancien
  const finishedLogs = purchases
    ?.filter((l) => !!l.finishedAt)
    .sort((a, b) => new Date(b.openedAt ?? 0).getTime() - new Date(a.openedAt ?? 0).getTime())

  const todayISO = () => new Date().toISOString().split('T')[0]

  return (
    <div className="coll-usage-box">
      {/* Bouton principal : ouvrir ou terminer un flacon */}
      {!activeLog ? (
        <UnopenedAction
          purchases={purchases}
          userProductId={userProductId}
          openPurchaseMutation={openPurchaseMutation}
          todayISO={todayISO}
        />
      ) : (
        <button
          type="button"
          className="coll-usage-main-btn finish"
          onClick={() =>
            finishPurchaseMutation.mutate(
              { userProductId, input: { finishedAt: todayISO() } },
              { onSuccess: () => toast.success('Flacon terminé !') }
            )
          }
        >
          <Calendar size={16} />
          Terminer le flacon
        </button>
      )}

      {/* Info sur le flacon actif */}
      {activeLog && (
        <div className="coll-active-log-info">
          En cours d'utilisation depuis le {new Date(activeLog.openedAt ?? '').toLocaleDateString()}
        </div>
      )}

      {/* Historique des flacons terminés avec durée */}
      {finishedLogs && finishedLogs.length > 0 && (
        <div className="coll-usage-history">
          <span className="coll-usage-hist-title">Historique ({finishedLogs.length})</span>
          {finishedLogs.map((log) => {
            const start = new Date(log.openedAt ?? '')
            const end = new Date(log.finishedAt ?? '')
            const diffDays = Math.ceil(
              Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            )
            return (
              <div key={log.id} className="coll-usage-log-item">
                <span className="coll-log-dates">
                  {start.toLocaleDateString()} → {end.toLocaleDateString()}
                </span>
                <span className="coll-log-duration">{diffDays} j</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/**
 * Sous-composant : affiche le bouton "Commencer un flacon"
 * ou un message si aucun flacon n'est disponible.
 */
function UnopenedAction({
  purchases,
  userProductId,
  openPurchaseMutation,
  todayISO,
}: {
  purchases: UserProduct['purchases']
  userProductId: string
  openPurchaseMutation: ReturnType<typeof useOpenPurchase>
  todayISO: () => string
}) {
  const unopenedPurchase = purchases?.find((l) => !l.openedAt)

  if (!unopenedPurchase) {
    return <p className="coll-no-purchase-hint">Aucun flacon à ouvrir. Ajoutez un achat d'abord.</p>
  }

  return (
    <button
      type="button"
      className="coll-usage-main-btn open"
      onClick={() =>
        openPurchaseMutation.mutate(
          {
            userProductId,
            purchaseId: unopenedPurchase.id,
            input: { openedAt: todayISO() },
          },
          { onSuccess: () => toast.success('Nouveau flacon commencé !') }
        )
      }
    >
      <Calendar size={16} />
      Commencer un flacon
    </button>
  )
}

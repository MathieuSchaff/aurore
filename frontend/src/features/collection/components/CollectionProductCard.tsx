import type { UserProductStatus } from '@habit-tracker/shared'

import clsx from 'clsx'
import { Calendar, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { calculateWeightedScore } from '../../../lib/helpers/reviews'
import { useFinishPurchase, useOpenPurchase } from '../../../lib/queries/purchases'
import type { UserPreferences } from '../../../lib/queries/user-preferences'
import type { UserProduct } from '../../../lib/queries/user-products'
import {
  useDeleteUserProduct,
  useUpdateUserProduct,
  useUpsertUserProductReview,
} from '../../../lib/queries/user-products'
import { sentimentEmojis, statusLabels } from '../constants'
import { AddPurchaseDialog } from './AddPurchaseDialog'
import { CriteriaList } from './CriteriaList'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'

interface CollectionProductCardProps {
  p: UserProduct
  prefs: UserPreferences | undefined
  isExpanded: boolean
  onToggleExpand: () => void
  activeTooltip: string | null
  setActiveTooltip: (v: string | null) => void
}

export function CollectionProductCard({
  p,
  prefs,
  isExpanded,
  onToggleExpand,
  activeTooltip,
  setActiveTooltip,
}: CollectionProductCardProps) {
  const updateMutation = useUpdateUserProduct()
  const deleteMutation = useDeleteUserProduct()
  const reviewMutation = useUpsertUserProductReview()
  const openPurchaseMutation = useOpenPurchase()
  const finishPurchaseMutation = useFinishPurchase()

  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [purchaseDate, setPurchaseDate] = useState(() => new Date().toISOString().split('T')[0])
  const [purchasePrice, setPurchasePrice] = useState('')

  const statusConfig = statusLabels[p.status]
  const StatusIcon = statusConfig.icon
  const score = calculateWeightedScore(p.review, prefs?.criteriaWeights, prefs?.displayScale)

  const handleUpdate = (input: Parameters<typeof updateMutation.mutate>[0]['input']) => {
    updateMutation.mutate(
      { id: p.id, input },
      { onSuccess: () => toast.success('Mise à jour effectuée') }
    )
  }

  const handleReview = (
    id: string,
    input: Parameters<typeof reviewMutation.mutate>[0]['input']
  ) => {
    reviewMutation.mutate(
      { id, input },
      { onSuccess: () => toast.success('Évaluation enregistrée') }
    )
  }

  return (
    <div className={clsx('coll-card', isExpanded && 'expanded')}>
      <button type="button" className="coll-card-header" onClick={onToggleExpand}>
        <div className="coll-card-row">
          <span
            className="coll-status-dot"
            style={{ '--dot-color': statusConfig.color } as React.CSSProperties}
          />
          <div className="coll-card-main">
            <h3 className="coll-product-name">{p.product.name}</h3>
            <p className="coll-product-brand">{p.product.brand}</p>
          </div>
          <div className="coll-card-aside">
            {score && (
              <div className="coll-score-badge">
                <span className="coll-score-val">{score}</span>
                {prefs?.displayScale !== 'percentage' && (
                  <span className="coll-score-max">
                    {prefs?.displayScale === 'out_of_5'
                      ? '/5'
                      : prefs?.displayScale === 'out_of_10'
                        ? '/10'
                        : '/20'}
                  </span>
                )}
              </div>
            )}
            <span className="coll-status-tag" style={{ color: statusConfig.color }}>
              <StatusIcon size={10} />
              {statusConfig.label}
            </span>
          </div>
          <ChevronDown className="coll-expand-icon" size={16} />
        </div>
      </button>

      {isExpanded && (
        <div className="coll-card-details">
          <section className="coll-status-section">
            <h4 className="coll-section-title">STATUT DU PRODUIT</h4>
            <div className="coll-status-picker">
              {(Object.keys(statusLabels) as UserProductStatus[]).map((s) => {
                const cfg = statusLabels[s]
                const Icon = cfg.icon
                return (
                  <button
                    key={s}
                    type="button"
                    className={clsx('coll-status-option', p.status === s && 'active')}
                    onClick={() => handleUpdate({ status: s })}
                    title={cfg.label}
                  >
                    <Icon size={18} style={{ color: p.status === s ? 'white' : cfg.color }} />
                    <span className="coll-status-opt-label">{cfg.label}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <div className="coll-details-grid">
            <section className="coll-details-section">
              <h4 className="coll-section-title">RESSENTI RAPIDE</h4>
              <div className="coll-quick-feeling-box">
                <div className="coll-sentiment-selector">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={clsx('coll-sentiment-option', p.sentiment === s && 'active')}
                      onClick={() => handleUpdate({ sentiment: s })}
                    >
                      <span>{sentimentEmojis[s]}</span>
                    </button>
                  ))}
                </div>

                <div className="coll-repurchase-row">
                  <span className="coll-repurchase-label">Rachat ?</span>
                  <div className="coll-repurchase-options">
                    {(['yes', 'unsure', 'no'] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        className={clsx(
                          'coll-repurchase-btn',
                          p.wouldRepurchase === v && `active-${v}`
                        )}
                        onClick={() => handleUpdate({ wouldRepurchase: v })}
                      >
                        {v === 'yes' ? 'Oui' : v === 'unsure' ? 'Peut-être' : 'Non'}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  className="coll-quick-comment"
                  placeholder="Un petit mot sur ce produit..."
                  defaultValue={p.comment || ''}
                  onBlur={(e) => handleUpdate({ comment: e.target.value })}
                />
              </div>
            </section>

            <section className="coll-details-section">
              <h4 className="coll-section-title">ÉVALUATION DÉTAILLÉE</h4>
              <CriteriaList
                p={p}
                activeTooltip={activeTooltip}
                setActiveTooltip={setActiveTooltip}
                handleReview={handleReview}
              />
            </section>

            <section className="coll-details-section">
              <h4 className="coll-section-title">CYCLE DE VIE</h4>
              <LifecycleSection
                purchases={p.purchases}
                userProductId={p.id}
                openPurchaseMutation={openPurchaseMutation}
                finishPurchaseMutation={finishPurchaseMutation}
              />
            </section>
          </div>

          <div className="coll-card-footer">
            <div className="coll-footer-actions">
              <button
                type="button"
                className="coll-add-purchase-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowPurchaseDialog(true)
                }}
              >
                <Plus size={14} />
                Nouvel achat
              </button>

              {showPurchaseDialog && (
                <AddPurchaseDialog
                  p={p}
                  purchaseDate={purchaseDate}
                  setPurchaseDate={setPurchaseDate}
                  purchasePrice={purchasePrice}
                  setPurchasePrice={setPurchasePrice}
                  onClose={() => setShowPurchaseDialog(false)}
                />
              )}

              <button
                type="button"
                className="coll-delete-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteDialog(true)
                }}
              >
                <Trash2 size={14} />
                Retirer
              </button>

              {showDeleteDialog && (
                <DeleteConfirmDialog
                  onConfirm={() => deleteMutation.mutate(p.id)}
                  onClose={() => setShowDeleteDialog(false)}
                  isPending={deleteMutation.isPending}
                />
              )}
            </div>
            <span className="coll-updated-at">
              MAJ le {new Date(p.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function LifecycleSection({
  purchases,
  userProductId,
  openPurchaseMutation,
  finishPurchaseMutation,
}: {
  purchases: UserProduct['purchases']
  userProductId: string
  openPurchaseMutation: ReturnType<typeof useOpenPurchase>
  finishPurchaseMutation: ReturnType<typeof useFinishPurchase>
}) {
  const activeLog = purchases?.find((l) => l.openedAt && !l.finishedAt)
  const finishedLogs = purchases
    ?.filter((l) => !!l.finishedAt)
    .sort((a, b) => new Date(b.openedAt ?? 0).getTime() - new Date(a.openedAt ?? 0).getTime())

  return (
    <div className="coll-usage-box">
      {!activeLog ? (
        (() => {
          const unopenedPurchase = purchases?.find((l) => !l.openedAt)
          return unopenedPurchase ? (
            <button
              type="button"
              className="coll-usage-main-btn open"
              onClick={() =>
                openPurchaseMutation.mutate(
                  {
                    userProductId,
                    purchaseId: unopenedPurchase.id,
                    input: {
                      openedAt: new Date().toISOString().split('T')[0],
                    },
                  },
                  {
                    onSuccess: () => toast.success('Nouveau flacon commencé !'),
                  }
                )
              }
            >
              <Calendar size={16} />
              Commencer un flacon
            </button>
          ) : (
            <p className="coll-no-purchase-hint">
              Aucun flacon à ouvrir. Ajoutez un achat d'abord.
            </p>
          )
        })()
      ) : (
        <button
          type="button"
          className="coll-usage-main-btn finish"
          onClick={() =>
            finishPurchaseMutation.mutate(
              {
                userProductId,
                input: {
                  finishedAt: new Date().toISOString().split('T')[0],
                },
              },
              {
                onSuccess: () => toast.success('Flacon terminé !'),
              }
            )
          }
        >
          <Calendar size={16} />
          Terminer le flacon
        </button>
      )}

      {activeLog && (
        <div className="coll-active-log-info">
          En cours d'utilisation depuis le {new Date(activeLog.openedAt ?? '').toLocaleDateString()}
        </div>
      )}

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

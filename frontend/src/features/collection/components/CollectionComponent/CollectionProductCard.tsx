/**
 * CollectionProductCard — Vue détaillée d'un produit dans la collection.
 *
 * Ce composant gère :
 * - L'en-tête avec nom, marque, score et statut
 * - Le panneau expanded avec : statut, ressenti, critères, cycle de vie
 * - Les actions : ajouter un achat, supprimer le produit
 */

import clsx from 'clsx'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { calculateWeightedScore } from '../../../../lib/helpers/reviews'
import { useFinishPurchase, useOpenPurchase } from '../../../../lib/queries/purchases'
import type { UserPreferences } from '../../../../lib/queries/user-preferences'
import type { UserProduct } from '../../../../lib/queries/user-products'
import {
  useDeleteUserProduct,
  useUpdateUserProduct,
  useUpsertUserProductReview,
} from '../../../../lib/queries/user-products'
import { sentimentEmojis, statusLabels } from '../../constants'
import { AddPurchaseDialog } from './AddPurchaseDialog'
import { CriteriaList } from './CriteriaList'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { LifecycleSection } from './LifecycleSection'
import './CollectionProductCard.css'

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
  /* ── Mutations ── */
  const updateMutation = useUpdateUserProduct()
  const deleteMutation = useDeleteUserProduct()
  const reviewMutation = useUpsertUserProductReview()
  const openPurchaseMutation = useOpenPurchase()
  const finishPurchaseMutation = useFinishPurchase()

  /* ── État local ── */
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  /* ── Données dérivées ── */
  const statusConfig = statusLabels[p.status]
  const StatusIcon = statusConfig.icon
  const score = calculateWeightedScore(p.review, prefs?.criteriaWeights, prefs?.displayScale)

  /* ── Handlers principaux ── */

  /** Met à jour un champ du UserProduct (statut, sentiment, rachat, commentaire) */
  const handleUpdate = (input: Parameters<typeof updateMutation.mutate>[0]['input']) => {
    updateMutation.mutate(
      { id: p.id, input },
      { onSuccess: () => toast.success('Mise à jour effectuée') }
    )
  }

  /** Met à jour un critère de la review (tolérance, efficacité, etc.) */
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
      {/* ── En-tête : nom, marque, score, statut ── */}
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
            {score && <ScoreBadge score={score} displayScale={prefs?.displayScale} />}
            <span className="coll-status-tag" style={{ color: statusConfig.color }}>
              <StatusIcon size={10} />
              {statusConfig.label}
            </span>
          </div>
          <ChevronDown className="coll-expand-icon" size={16} />
        </div>
      </button>

      {/* ── Panneau expanded ── */}
      {isExpanded && (
        <div className="coll-card-details">
          <div className="coll-details-grid">
            {/* Ressenti rapide : sentiment + rachat + commentaire */}
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

            {/* Évaluation détaillée : 6 critères avec étoiles */}
            <section className="coll-details-section">
              <h4 className="coll-section-title">ÉVALUATION DÉTAILLÉE</h4>
              <CriteriaList
                p={p}
                activeTooltip={activeTooltip}
                setActiveTooltip={setActiveTooltip}
                handleReview={handleReview}
              />
            </section>

            {/* Cycle de vie : ouvrir / terminer un flacon */}
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

          {/* Footer : nouvel achat, supprimer, date MAJ */}
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
                  userProductId={p.id}
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

/* ────────────────────────────────────────────
   Sous-composants extraits pour la lisibilité
   ──────────────────────────────────────────── */

/** Affiche le score avec son échelle (/5, /10, /20 ou %) */
function ScoreBadge({ score, displayScale }: { score: string; displayScale?: string }) {
  return (
    <div className="coll-score-badge">
      <span className="coll-score-val">{score}</span>
      {displayScale !== 'percentage' && (
        <span className="coll-score-max">
          {displayScale === 'out_of_5' ? '/5' : displayScale === 'out_of_10' ? '/10' : '/20'}
        </span>
      )}
    </div>
  )
}


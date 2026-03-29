import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Droplets,
  ExternalLink,
  HelpCircle,
  Package,
  RotateCcw,
  Star,
  Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { statusLabels } from '@/features/collection/constants'
import { calculateWeightedScore } from '@/lib/helpers/reviews'
import type { UserPreferences } from '@/lib/queries/user-preferences'
import type { UserProduct } from '@/lib/queries/user-products'
import { useDeleteUserProduct, useUpdateUserProduct } from '@/lib/queries/user-products'
import { sentimentEmojis } from '@/utils/sentimentMap'
import { DeleteConfirmDialog } from '../../parts/DeleteConfirmDialog'

import './ProductCardDetailed.css'

interface ProductCardDetailedProps {
  p: UserProduct
  prefs: UserPreferences | undefined
  isExpanded: boolean
  onToggleExpand: () => void
}

export function ProductCardDetailed({
  p,
  prefs,
  isExpanded,
  onToggleExpand,
}: ProductCardDetailedProps) {
  const updateMutation = useUpdateUserProduct()
  const deleteMutation = useDeleteUserProduct()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [localComment, setLocalComment] = useState(p.comment || '')

  const handleCommentBlur = () => {
    if (localComment !== (p.comment || '')) {
      updateMutation.mutate({ id: p.id, input: { comment: localComment } })
    }
  }

  const score = calculateWeightedScore(
    p.review,
    prefs?.criteriaWeights,
    prefs?.displayScale || 'out_of_20'
  )

  const handleStatusChange = (newStatus: UserProduct['status']) => {
    updateMutation.mutate({ id: p.id, input: { status: newStatus } })
    setShowStatusMenu(false)
  }

  // Extract tags by category
  const tagsByCategory = useMemo(() => {
    const map: Record<string, string[]> = {}
    if (!p.product.productTags) return map

    for (const pt of p.product.productTags) {
      const cat = pt.tag.category || 'other'
      if (!map[cat]) map[cat] = []
      map[cat].push(pt.tag.name)
    }
    return map
  }, [p.product.productTags])

  const zone = tagsByCategory.skin_zone?.join(', ') || 'Non spécifiée'
  const type = tagsByCategory.product_type?.join(', ') || 'Non spécifié'
  const cible = tagsByCategory.skin_type?.join(', ') || 'Non spécifiée'

  return (
    <div className={clsx('pcd-card', isExpanded && 'is-expanded')}>
      <button type="button" className="pcd-header" onClick={onToggleExpand}>
        <div className="pcd-header-main">
          <div className="pcd-header-left">
            <span className="pcd-brand">{p.product.brand}</span>
            <h3 className="pcd-name">{p.product.name}</h3>
          </div>
          <div className="pcd-header-right">
            <div className="pcd-chips">
              <span className="pcd-kind-chip">{p.product.kind}</span>
              <span className={clsx('pcd-status-chip', p.status)}>
                {statusLabels[p.status].label}
              </span>
            </div>
            <div className="pcd-score-section">
              {score && <span className="pcd-score">{score}</span>}
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="pcd-body">
          <div className="pcd-grid">
            <div className="pcd-col-left">
              <div className="pcd-section">
                <div className="pcd-section-header">
                  <Star size={16} />
                  <h4>Mon avis</h4>
                </div>
                <div className="pcd-sentiment-row">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={clsx('pcd-sentiment-btn', p.sentiment === val && 'active')}
                      onClick={() => updateMutation.mutate({ id: p.id, input: { sentiment: val } })}
                    >
                      {sentimentEmojis[val as 1 | 2 | 3 | 4 | 5]}
                    </button>
                  ))}
                </div>
                <div className="pcd-comment-box">
                  <textarea
                    placeholder="Ajouter un commentaire..."
                    value={localComment}
                    onChange={(e) => setLocalComment(e.target.value)}
                    onBlur={handleCommentBlur}
                  />
                </div>
              </div>

              <div className="pcd-section">
                <div className="pcd-section-header">
                  <RotateCcw size={16} />
                  <h4>Rachat</h4>
                </div>
                <div className="pcd-repurchase-row">
                  {(['yes', 'no', 'unsure'] as const).map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={clsx('pcd-repurchase-btn', p.wouldRepurchase === val && 'active')}
                      onClick={() =>
                        updateMutation.mutate({
                          id: p.id,
                          input: { wouldRepurchase: val },
                        })
                      }
                    >
                      {val === 'yes' && 'Oui'}
                      {val === 'no' && 'Non'}
                      {val === 'unsure' && 'Peut-être'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pcd-col-right">
              <div className="pcd-section">
                <div className="pcd-section-header">
                  <Package size={16} />
                  <h4>Infos produit</h4>
                </div>
                <div className="pcd-info-list">
                  <div className="pcd-info-item">
                    <Droplets size={14} />
                    <span>Zone: {zone}</span>
                  </div>
                  <div className="pcd-info-item">
                    <Calendar size={14} />
                    <span>Type: {type}</span>
                  </div>
                  <div className="pcd-info-item">
                    <HelpCircle size={14} />
                    <span>Cible: {cible}</span>
                  </div>
                  <div className="pcd-info-item">
                    <Package size={14} />
                    <span>Format: {p.product.unit}</span>
                  </div>
                  <Link to="/products/$slug" params={{ slug: p.product.slug }} className="pcd-link">
                    <ExternalLink size={14} />
                    Voir la fiche produit
                  </Link>
                </div>
              </div>

              <div className="pcd-footer-actions">
                <div className="pcd-status-dropdown">
                  <button
                    type="button"
                    className="pcd-action-btn"
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                  >
                    Changer le statut
                  </button>
                  {showStatusMenu && (
                    <div className="pcd-menu">
                      {(Object.keys(statusLabels) as UserProduct['status'][]).map((s) => (
                        <button key={s} type="button" onClick={() => handleStatusChange(s)}>
                          {statusLabels[s].label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="pcd-delete-btn"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <DeleteConfirmDialog
          onConfirm={() =>
            deleteMutation.mutate(p.id, { onSuccess: () => setShowDeleteConfirm(false) })
          }
          onClose={() => setShowDeleteConfirm(false)}
          isPending={deleteMutation.isPending}
          message={`Retirer ${p.product.name} de votre collection ?`}
        />
      )}
    </div>
  )
}

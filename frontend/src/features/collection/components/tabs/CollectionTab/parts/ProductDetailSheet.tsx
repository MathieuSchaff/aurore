import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  Calendar,
  Clipboard,
  DollarSign,
  Droplets,
  ExternalLink,
  HelpCircle,
  Package,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

import { Sheet } from '@/component/Dialog/Sheet'
import { calculateWeightedScore } from '@/lib/helpers/reviews'
import { productQueries } from '@/lib/queries/products'
import type { UserPreferences } from '@/lib/queries/user-preferences'
import type { UserProduct } from '@/lib/queries/user-products'
import { useDeleteUserProduct, useUpdateUserProduct } from '@/lib/queries/user-products'
import { AddPurchaseDialog } from './AddPurchaseDialog'
import { CriteriaList } from './CriteriaList'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { InciPopup } from './InciPopup'
import { LifecycleSection } from './LifecycleSection'
import { RepurchasePicker } from './RepurchasePicker'
import { SentimentPicker } from './SentimentPicker'
import { StatusChips } from './StatusChips'

import './ProductDetailSheet.css'

interface ProductDetailSheetProps {
  p: UserProduct
  prefs: UserPreferences | undefined
  activeTooltip: string | null
  setActiveTooltip: (id: string | null) => void
  onClose: () => void
}

export function ProductDetailSheet({
  p,
  prefs,
  activeTooltip,
  setActiveTooltip,
  onClose,
}: ProductDetailSheetProps) {
  const updateMutation = useUpdateUserProduct()
  const deleteMutation = useDeleteUserProduct()

  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const [showAddPurchase, setShowAddPurchase] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showInci, setShowInci] = useState(false)
  const [localComment, setLocalComment] = useState(p.comment || '')

  const { data: fullProduct } = useQuery(productQueries.bySlug(p.product.slug))

  const score = calculateWeightedScore(
    p.review,
    prefs?.criteriaWeights,
    prefs?.displayScale || 'out_of_20'
  )

  const handleCommentBlur = () => {
    if (localComment !== (p.comment || '')) {
      updateMutation.mutate({ id: p.id, input: { comment: localComment } })
    }
  }

  const tagsByCategory = useMemo(() => {
    const map: Record<string, string[]> = {}
    if (!p.product.tagProducts) return map
    for (const pt of p.product.tagProducts) {
      const cat = pt.productTag?.tagType || 'other'
      if (!map[cat]) map[cat] = []
      map[cat].push(pt.productTag?.label ?? '')
    }
    return map
  }, [p.product.tagProducts])

  const zone = tagsByCategory.skin_zone?.join(', ') || 'Non spécifiée'
  const type = tagsByCategory.product_type?.join(', ') || 'Non spécifié'
  const cible = tagsByCategory.skin_type?.join(', ') || 'Non spécifiée'
  const priceEuros = p.product.priceCents ? `${(p.product.priceCents / 100).toFixed(2)}€` : null

  return (
    <>
      <Sheet
        onClose={onClose}
        initialFocusRef={closeBtnRef}
        className="pds-sheet coll-product-sheet"
      >
        <div className="pds-header">
          <div className="pds-header-top">
            <button ref={closeBtnRef} type="button" className="pds-close-btn" onClick={onClose}>
              <X size={15} />
              <span>Fermer</span>
            </button>
          </div>

          <div className="pds-title-section">
            <div className="pds-brand-row">
              <span className="pds-brand">{p.product.brand}</span>
              <Link to="/products/$slug" params={{ slug: p.product.slug }} className="pds-link">
                <ExternalLink size={13} />
                <span>Fiche produit</span>
              </Link>
            </div>
            <Sheet.Title className="pds-name">{p.product.name}</Sheet.Title>
            <div className="pds-meta">
              <span className="pds-kind">{p.product.kind}</span>
              {priceEuros && <span className="pds-price">{priceEuros}</span>}
            </div>
          </div>
        </div>

        <div className="pds-content">
          <StatusChips
            currentStatus={p.status}
            onChange={(newStatus) =>
              updateMutation.mutate({ id: p.id, input: { status: newStatus } })
            }
          />

          <div className="pds-grid">
            <div className="pds-main-col">
              <div className="pds-card pds-review-card coll-card">
                <div className="pds-card-header">
                  <Star size={16} />
                  <h3>Mon Avis</h3>
                  {score && <span className="pds-total-score">{score}</span>}
                </div>

                <SentimentPicker
                  value={p.sentiment}
                  onChange={(val) => updateMutation.mutate({ id: p.id, input: { sentiment: val } })}
                />

                <CriteriaList
                  userProductId={p.id}
                  review={p.review}
                  activeTooltip={activeTooltip}
                  setActiveTooltip={setActiveTooltip}
                />

                <div className="pds-comment-section">
                  <label htmlFor="pds-comment" className="pds-section-title">
                    Mes notes
                  </label>
                  <textarea
                    id="pds-comment"
                    placeholder="Qu'en pensez-vous ? (texture, odeur, résultats...)"
                    value={localComment}
                    onChange={(e) => setLocalComment(e.target.value)}
                    onBlur={handleCommentBlur}
                  />
                </div>

                <RepurchasePicker
                  value={p.wouldRepurchase}
                  onChange={(val) =>
                    updateMutation.mutate({ id: p.id, input: { wouldRepurchase: val } })
                  }
                />
              </div>

              <LifecycleSection p={p} onAddPurchase={() => setShowAddPurchase(true)} />
            </div>

            <div className="pds-side-col">
              <div className="pds-card coll-card">
                <div className="pds-card-header">
                  <Droplets size={16} />
                  <h3 className="pds-section-title">Ingrédients</h3>
                </div>
                {fullProduct?.ingredients && fullProduct.ingredients.length > 0 ? (
                  <div className="pds-ingredients-list">
                    {fullProduct.ingredients.map((pi) => (
                      <Link
                        key={pi.ingredientId}
                        to="/ingredients/$slug"
                        params={{ slug: pi.ingredientSlug }}
                        className="pds-ing-tag"
                      >
                        {pi.ingredientName}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="pds-empty-msg">Liste non renseignée</p>
                )}

                {fullProduct?.inci && (
                  <button type="button" className="pds-inci-btn" onClick={() => setShowInci(true)}>
                    <Clipboard size={13} />
                    Voir l'INCI
                  </button>
                )}
              </div>

              <div className="pds-card coll-card">
                <div className="pds-card-header">
                  <Package size={16} />
                  <h3 className="pds-section-title">Infos</h3>
                </div>
                <div className="pds-info-grid">
                  <div className="pds-info-item">
                    <Droplets size={14} />
                    <span>Zone: {zone}</span>
                  </div>
                  <div className="pds-info-item">
                    <Calendar size={14} />
                    <span>Type: {type}</span>
                  </div>
                  <div className="pds-info-item">
                    <HelpCircle size={14} />
                    <span>Cible: {cible}</span>
                  </div>
                  <div className="pds-info-item">
                    <DollarSign size={14} />
                    <span>Format: {p.product.unit || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pds-danger-zone">
            <button
              type="button"
              className="pds-remove-btn"
              onClick={() => setShowDeleteConfirm(true)}
              aria-label={`Retirer ${p.product.name} de ma collection`}
            >
              <Trash2 size={15} />
              Retirer de ma collection
            </button>
          </div>
        </div>
      </Sheet>

      {showAddPurchase && (
        <AddPurchaseDialog userProductId={p.id} onClose={() => setShowAddPurchase(false)} />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmDialog
          onConfirm={() => deleteMutation.mutate(p.id, { onSuccess: onClose })}
          onClose={() => setShowDeleteConfirm(false)}
          isPending={deleteMutation.isPending}
          message={`Voulez-vous vraiment retirer ${p.product.name} ? Toutes vos notes et votre historique d'achats pour ce produit seront supprimés.`}
        />
      )}

      {showInci && fullProduct?.inci && (
        <InciPopup inci={fullProduct.inci} onClose={() => setShowInci(false)} />
      )}
    </>
  )
}

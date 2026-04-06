import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import {
  Calendar,
  Check,
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
import { useEffect, useMemo, useState } from 'react'

import { statusLabels } from '@/features/collection/constants'
import { useScrollLock } from '@/hooks/useScrollLock'
import { calculateWeightedScore } from '@/lib/helpers/reviews'
import { productQueries } from '@/lib/queries/products'
import type { UserPreferences } from '@/lib/queries/user-preferences'
import type { UserProduct } from '@/lib/queries/user-products'
import { useDeleteUserProduct, useUpdateUserProduct } from '@/lib/queries/user-products'
import { sentimentEmojis } from '@/utils/sentimentMap'
import { AddPurchaseDialog } from './AddPurchaseDialog'
import { CriteriaList } from './CriteriaList'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { LifecycleSection } from './LifecycleSection'

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
  useScrollLock(true)

  const updateMutation = useUpdateUserProduct()
  const deleteMutation = useDeleteUserProduct()

  const [showAddPurchase, setShowAddPurchase] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showInci, setShowInci] = useState(false)
  const [inciCopied, setInciCopied] = useState(false)
  const [localComment, setLocalComment] = useState(p.comment || '')

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleCommentBlur = () => {
    if (localComment !== (p.comment || '')) {
      updateMutation.mutate({ id: p.id, input: { comment: localComment } })
    }
  }

  const handleCopyInci = () => {
    if (!fullProduct?.inci) return
    navigator.clipboard.writeText(fullProduct.inci).then(() => {
      setInciCopied(true)
      setTimeout(() => setInciCopied(false), 2000)
    })
  }

  const { data: fullProduct } = useQuery(productQueries.bySlug(p.product.slug))

  const score = calculateWeightedScore(
    p.review,
    prefs?.criteriaWeights,
    prefs?.displayScale || 'out_of_20'
  )

  const handleStatusChange = (newStatus: UserProduct['status']) => {
    updateMutation.mutate({ id: p.id, input: { status: newStatus } })
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

  const priceEuros = p.product.priceCents ? `${(p.product.priceCents / 100).toFixed(2)}€` : null

  return (
    <div className="pds-overlay">
      <button type="button" className="pds-backdrop" onClick={onClose} aria-label="Fermer" />
      <div
        className="pds-sheet coll-product-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pds-product-title"
      >
        <div className="pds-header">
          <div className="pds-header-top">
            <button
              type="button"
              className="pds-close-btn"
              onClick={onClose}
              // biome-ignore lint/a11y/noAutofocus: intentional focus on open
              autoFocus
            >
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
            <h2 id="pds-product-title" className="pds-name">
              {p.product.name}
            </h2>
            <div className="pds-meta">
              <span className="pds-kind">{p.product.kind}</span>
              {priceEuros && <span className="pds-price">{priceEuros}</span>}
            </div>
          </div>
        </div>

        <div className="pds-content">
          <div className="pds-section">
            <span className="pds-section-title">Statut</span>
            <fieldset className="pds-status-chips" aria-label="Statut du produit">
              {(Object.keys(statusLabels) as UserProduct['status'][]).map((s) => {
                const cfg = statusLabels[s]
                const Icon = cfg.icon
                return (
                  <button
                    key={s}
                    type="button"
                    className={clsx('pds-status-chip', p.status === s && 'active')}
                    aria-pressed={p.status === s}
                    onClick={() => handleStatusChange(s)}
                  >
                    <Icon size={14} />
                    <span>{cfg.label}</span>
                  </button>
                )
              })}
            </fieldset>
          </div>

          <div className="pds-grid">
            <div className="pds-main-col">
              <div className="pds-card pds-review-card coll-card">
                <div className="pds-card-header">
                  <Star size={16} />
                  <h3>Mon Avis</h3>
                  {score && <span className="pds-total-score">{score}</span>}
                </div>

                <span className="pds-section-title">Ressenti rapide</span>
                <fieldset className="pds-sentiment-row" aria-label="Ressenti rapide">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={clsx('pds-sentiment-btn', p.sentiment === val && 'active')}
                      aria-label={`Ressenti ${val} sur 5`}
                      aria-pressed={p.sentiment === val}
                      onClick={() => updateMutation.mutate({ id: p.id, input: { sentiment: val } })}
                    >
                      <span className="pds-emoji">{sentimentEmojis[val as 1 | 2 | 3 | 4 | 5]}</span>
                    </button>
                  ))}
                </fieldset>

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

                <div className="pds-repurchase-section">
                  <span className="pds-section-title">Racheter ?</span>
                  <fieldset className="pds-repurchase-btns" aria-label="Racheter ?">
                    {(['yes', 'unsure', 'no'] as const).map((val) => (
                      <button
                        key={val}
                        type="button"
                        className={clsx(
                          'pds-repurchase-btn',
                          val,
                          p.wouldRepurchase === val && 'active'
                        )}
                        aria-pressed={p.wouldRepurchase === val}
                        onClick={() =>
                          updateMutation.mutate({ id: p.id, input: { wouldRepurchase: val } })
                        }
                      >
                        {val === 'yes' && 'Oui'}
                        {val === 'unsure' && 'Peut-être'}
                        {val === 'no' && 'Non'}
                      </button>
                    ))}
                  </fieldset>
                </div>
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
      </div>

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
        <div className="pds-inci-overlay">
          <button
            type="button"
            className="pds-inci-backdrop"
            onClick={() => setShowInci(false)}
            aria-label="Fermer"
          />
          <div
            className="pds-inci-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pds-inci-title"
          >
            <div className="pds-inci-header">
              <span id="pds-inci-title" className="pds-section-title">
                Liste INCI
              </span>
              <div className="pds-inci-actions">
                <button
                  type="button"
                  className={clsx('pds-inci-copy-btn', inciCopied && 'copied')}
                  onClick={handleCopyInci}
                >
                  {inciCopied ? <Check size={14} /> : <Clipboard size={14} />}
                  {inciCopied ? 'Copié !' : 'Copier'}
                </button>
                <button
                  type="button"
                  className="pds-inci-close"
                  onClick={() => setShowInci(false)}
                  aria-label="Fermer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="pds-inci-body">
              <p className="pds-inci-text">{fullProduct.inci}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

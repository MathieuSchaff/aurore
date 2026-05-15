import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  ArrowLeftRight,
  Clipboard,
  Droplets,
  ExternalLink,
  Eye,
  FlaskConical,
  Heart,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { Sheet } from '@/component/Dialog/Sheet'
import { statusLabels } from '@/features/collection/constants'
import { ProductImage } from '@/features/products/components/ProductImage/ProductImage'
import { productQueries } from '@/lib/queries/products'
import type { UserProduct } from '@/lib/queries/user-products'
import { useDeleteUserProduct, useUpdateUserProduct } from '@/lib/queries/user-products'
import { AddPurchaseDialog } from './AddPurchaseDialog'
import { CriteriaList } from './CriteriaList'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { ExperienceTags } from './ExperienceTags'
import { InciPopup } from './InciPopup'
import { LifecycleSection } from './LifecycleSection'
import { RepurchasePicker } from './RepurchasePicker'
import { SentimentPicker } from './SentimentPicker'
import { StatusChips } from './StatusChips'

import './ProductDetailSheet.css'

const REASON_TAG_LABEL = {
  avoided: 'À éviter',
  archived: 'Archivé',
} as const

type ReasonStatus = keyof typeof REASON_TAG_LABEL

function isReasonStatus(s: UserProduct['status']): s is ReasonStatus {
  return s === 'avoided' || s === 'archived'
}

function formatReasonDate(d: Date): string {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function hasRecentReasonTag(comment: string | null | undefined, status: ReasonStatus): boolean {
  if (!comment) return false
  return comment.includes(`[${REASON_TAG_LABEL[status]},`)
}

interface ProductDetailSheetProps {
  p: UserProduct
  activeTooltip: string | null
  setActiveTooltip: (id: string | null) => void
  onClose: () => void
}

export function ProductDetailSheet({
  p,
  activeTooltip,
  setActiveTooltip,
  onClose,
}: ProductDetailSheetProps) {
  const updateMutation = useUpdateUserProduct()
  const deleteMutation = useDeleteUserProduct()

  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const decisionSectionRef = useRef<HTMLElement>(null)
  const [showAddPurchase, setShowAddPurchase] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showInci, setShowInci] = useState(false)
  const [localComment, setLocalComment] = useState(p.comment || '')
  const [reasonDraft, setReasonDraft] = useState('')

  const { data: fullProduct, isError: fullProductError } = useQuery(
    productQueries.bySlug(p.product.slug)
  )

  const handleCommentBlur = () => {
    if (localComment !== (p.comment || '')) {
      updateMutation.mutate({ id: p.id, input: { comment: localComment } })
    }
  }

  const showReasonPrompt = isReasonStatus(p.status) && !hasRecentReasonTag(p.comment, p.status)

  const handleSaveReason = () => {
    const trimmed = reasonDraft.trim()
    if (!trimmed || !isReasonStatus(p.status)) return
    const prefix = `[${REASON_TAG_LABEL[p.status]}, ${formatReasonDate(new Date())}]`
    const next = p.comment ? `${p.comment}\n\n${prefix} ${trimmed}` : `${prefix} ${trimmed}`
    updateMutation.mutate({ id: p.id, input: { comment: next } })
    setLocalComment(next)
    setReasonDraft('')
  }

  // Status badge in §1 deep-links to §6 — scroll into view then focus the
  // active chip so keyboard users land on the actionable control.
  const handleFocusDecision = () => {
    const section = decisionSectionRef.current
    if (!section) return
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const activeChip = section.querySelector<HTMLButtonElement>(
      '.pds-status-chip[aria-pressed="true"]'
    )
    if (activeChip) {
      activeChip.focus({ preventScroll: true })
    } else {
      section.focus({ preventScroll: true })
    }
  }

  const statusCfg = statusLabels[p.status]
  const StatusIcon = statusCfg.icon

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
          {/* §1 Sur votre étagère */}
          <section className="pds-card coll-card pds-shelf-card">
            <div className="pds-card-header">
              <ShoppingBag size={16} />
              <h3>Sur votre étagère</h3>
            </div>
            <div className="pds-shelf-row">
              <ProductImage
                kind={p.product.kind}
                unit={p.product.unit}
                imageUrl={p.product.imageUrl}
                size={72}
              />
              <div className="pds-shelf-meta">
                <p className="pds-shelf-summary">
                  {p.product.kind
                    ? `Un ${p.product.kind.toLowerCase()} enregistré dans votre étagère.`
                    : 'Un produit enregistré dans votre étagère.'}
                </p>
                <button
                  type="button"
                  className="pds-shelf-status-badge"
                  style={{ '--shelf-status-color': statusCfg.color } as React.CSSProperties}
                  onClick={handleFocusDecision}
                  aria-label={`Statut actuel : ${statusCfg.label}. Modifier dans Votre décision.`}
                >
                  <StatusIcon size={13} aria-hidden="true" />
                  <span>{statusCfg.label}</span>
                </button>
              </div>
            </div>
            <LifecycleSection p={p} onAddPurchase={() => setShowAddPurchase(true)} />
          </section>

          {/* §2 En un coup d'œil */}
          <section className="pds-card coll-card">
            <div className="pds-card-header">
              <Eye size={16} />
              <h3>En un coup d'œil</h3>
            </div>
            <p className="pds-empty-msg">
              Aurore n'a pas encore de résumé calme pour cette formule. Le détail des ingrédients
              reste disponible plus bas.
            </p>
          </section>

          {/* §3 Groupes d'ingrédients */}
          <section className="pds-card coll-card">
            <div className="pds-card-header">
              <FlaskConical size={16} />
              <h3>Groupes d'ingrédients</h3>
            </div>
            <p className="pds-empty-msg">
              Aurore n'a pas encore assez de contexte pour regrouper cette formule. Vous trouverez
              la liste complète en bas de page.
            </p>
          </section>

          {/* §4 À noter */}
          <section className="pds-card coll-card">
            <div className="pds-card-header">
              <Sparkles size={16} />
              <h3>À noter</h3>
            </div>
            <p className="pds-empty-msg">
              Aurore n'a rien à mettre en évidence sur cette formule pour le moment. À noter, pas
              une alerte.
            </p>
          </section>

          {/* §5 Votre expérience */}
          <section className="pds-card pds-review-card coll-card">
            <div className="pds-card-header">
              <Star size={16} />
              <h3>Votre expérience</h3>
            </div>

            <SentimentPicker
              value={p.sentiment}
              status={p.status}
              onChange={(val) => updateMutation.mutate({ id: p.id, input: { sentiment: val } })}
            />

            <CriteriaList
              userProductId={p.id}
              review={p.review}
              activeTooltip={activeTooltip}
              setActiveTooltip={setActiveTooltip}
            />

            <ExperienceTags
              ressenti={p.ressenti}
              routine={p.routine}
              preferences={p.preferences}
              onChangeRessenti={(next) =>
                updateMutation.mutate({ id: p.id, input: { ressenti: next } })
              }
              onChangeRoutine={(next) =>
                updateMutation.mutate({ id: p.id, input: { routine: next } })
              }
              onChangePreferences={(next) =>
                updateMutation.mutate({ id: p.id, input: { preferences: next } })
              }
            />

            <div className="pds-comment-section">
              <label htmlFor="pds-comment" className="pds-section-title">
                Notes personnelles
              </label>
              <textarea
                id="pds-comment"
                placeholder="Quelques mots sur votre expérience : texture, odeur, ressenti dans la routine…"
                value={localComment}
                onChange={(e) => setLocalComment(e.target.value)}
                onBlur={handleCommentBlur}
              />
            </div>
          </section>

          {/* §6 Votre décision */}
          <section
            ref={decisionSectionRef}
            id="pds-decision"
            tabIndex={-1}
            className="pds-card coll-card"
          >
            <div className="pds-card-header">
              <Heart size={16} />
              <h3>Votre décision</h3>
            </div>
            <p className="pds-section-lead">
              Là où vous en êtes maintenant. Modifiable quand votre avis change.
            </p>
            <StatusChips
              currentStatus={p.status}
              onChange={(newStatus) =>
                updateMutation.mutate({ id: p.id, input: { status: newStatus } })
              }
            />
            {showReasonPrompt && (
              <div className="pds-reason-prompt">
                <label htmlFor="pds-reason" className="pds-section-title">
                  Une raison à garder en tête ?
                </label>
                <p className="pds-reason-hint">
                  Quelques mots pour vous rappeler ce choix plus tard. Ajoutés à vos notes.
                </p>
                <textarea
                  id="pds-reason"
                  className="pds-reason-textarea"
                  value={reasonDraft}
                  onChange={(e) => setReasonDraft(e.target.value)}
                  placeholder="Trop riche pour mon hiver, picotements à la première utilisation…"
                  rows={2}
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!reasonDraft.trim() || updateMutation.isPending}
                  onClick={handleSaveReason}
                >
                  Garder cette raison
                </Button>
              </div>
            )}
            <RepurchasePicker
              value={p.wouldRepurchase}
              onChange={(val) =>
                updateMutation.mutate({ id: p.id, input: { wouldRepurchase: val } })
              }
            />
          </section>

          {/* §7 Comparer avec un autre produit */}
          <section className="pds-card coll-card">
            <div className="pds-card-header">
              <ArrowLeftRight size={16} />
              <h3>Comparer avec un autre produit</h3>
            </div>
            <Link
              to="/products/compare/new"
              search={{ seed: p.productId }}
              className="pds-compare-btn"
            >
              <ArrowLeftRight size={14} />
              Comparer ce produit à un autre
            </Link>
          </section>

          {/* §8 Liste complète des ingrédients */}
          <section className="pds-card coll-card">
            <div className="pds-card-header">
              <Droplets size={16} />
              <h3 className="pds-section-title">Liste complète des ingrédients</h3>
            </div>
            {fullProductError ? (
              <p className="pds-empty-msg" role="alert">
                Détails indisponibles — vérifie ta connexion.
              </p>
            ) : fullProduct?.ingredients && fullProduct.ingredients.length > 0 ? (
              <>
                <p className="pds-disclosure-hint">
                  La liste complète reste disponible quand vous en avez besoin.
                </p>
                <details className="pds-ingredients-disclosure">
                  <summary className="pds-ingredients-summary">Voir la liste complète</summary>
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
                </details>
              </>
            ) : (
              <p className="pds-empty-msg">
                Liste d'ingrédients non ajoutée. Vous pouvez garder ce produit comme note
                personnelle pour le moment.
              </p>
            )}

            {fullProduct?.inci && (
              <button type="button" className="pds-inci-btn" onClick={() => setShowInci(true)}>
                <Clipboard size={13} />
                Voir l'INCI
              </button>
            )}
          </section>

          <div className="pds-remove-row">
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
          title="Retirer ce produit ?"
          message="Retirer supprime aussi vos notes et votre historique pour ce produit. Si vous voulez juste ne plus l'utiliser, vous pouvez le marquer À éviter — vos notes restent disponibles."
          confirmLabel="Retirer définitivement"
          onConfirm={() => deleteMutation.mutate(p.id, { onSuccess: onClose })}
          onClose={() => setShowDeleteConfirm(false)}
          isPending={deleteMutation.isPending}
          onAvoid={
            p.status === 'avoided'
              ? undefined
              : () =>
                  updateMutation.mutate(
                    { id: p.id, input: { status: 'avoided' } },
                    { onSuccess: onClose }
                  )
          }
          avoidPending={updateMutation.isPending}
        />
      )}

      {showInci && fullProduct?.inci && (
        <InciPopup inci={fullProduct.inci} onClose={() => setShowInci(false)} />
      )}
    </>
  )
}

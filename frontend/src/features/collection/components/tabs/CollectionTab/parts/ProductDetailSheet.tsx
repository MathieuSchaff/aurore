import { hasFragranceComponent } from '@habit-tracker/shared'

import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  Copy,
  Droplets,
  ExternalLink,
  Eye,
  FlaskConical,
  Heart,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { Sheet } from '@/component/Dialog/Sheet'
import { DropdownMenu } from '@/component/DropdownMenu/DropdownMenu'
import { statusLabels } from '@/features/collection/constants'
import { ProductImage } from '@/features/products/components/ProductImage/ProductImage'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { productQueries } from '@/lib/queries/products'
import { profileQueries } from '@/lib/queries/profile'
import type { UserProduct } from '@/lib/queries/user-products'
import { useDeleteUserProduct, useUpdateUserProduct } from '@/lib/queries/user-products'
import { useAuthStore } from '@/store/auth'
import { AddPurchaseDialog } from './AddPurchaseDialog'
import { CriteriaList } from './CriteriaList'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { ExperienceTags } from './ExperienceTags'
import { LifecycleSection } from './LifecycleSection'
import { RepurchasePicker } from './RepurchasePicker'
import { SentimentPicker } from './SentimentPicker'
import { StatusChips } from './StatusChips'
import { StatusHistory } from './StatusHistory'

import './ProductDetailSheet.css'

const STATUSES_REQUIRING_REASON_PROMPT: ReadonlyArray<UserProduct['status']> = [
  'avoided',
  'archived',
]

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
  const [localComment, setLocalComment] = useState(p.comment || '')
  const [pendingStatus, setPendingStatus] = useState<UserProduct['status'] | null>(null)
  const [reasonDraft, setReasonDraft] = useState('')

  const { data: fullProduct, isError: fullProductError } = useQuery(
    productQueries.bySlug(p.product.slug)
  )

  const { copied: inciCopied, copy: copyInci } = useCopyToClipboard()
  const handleCopyInci = useCallback(() => {
    if (fullProduct?.inci) void copyInci(fullProduct.inci)
  }, [fullProduct?.inci, copyInci])

  const user = useAuthStore((s) => s.user)
  const { data: dermoProfile } = useQuery({
    ...profileQueries.dermo(),
    enabled: !!user,
  })

  // §4 "À noter" — surface calm contextual notes when user prefs intersect
  // formula signals. Today: fragrance components × peau-sensible skinType.
  // Doc canonical microcopy: docs/04-design-ux/product-detail.md L171.
  const fragranceNote =
    dermoProfile?.skinTypes?.includes('peau-sensible') &&
    fullProduct?.ingredients &&
    hasFragranceComponent(fullProduct.ingredients)

  const handleCommentBlur = () => {
    if (localComment !== (p.comment || '')) {
      updateMutation.mutate({ id: p.id, input: { comment: localComment } })
    }
  }

  // Status changes to `avoided`/`archived` open an inline prompt that
  // collects an optional reason BEFORE submitting, so the reason ships with
  // the same mutation and lands on `user_product_status_log.reason` (never
  // in `comment`). Other status changes submit immediately.
  // Triggered from §6 chips OR the header popover (P2.B). When the popover
  // triggers the reason prompt, the prompt lives in §6 so we scroll there.
  const handleStatusChange = (newStatus: UserProduct['status']) => {
    if (newStatus === p.status) return
    if (STATUSES_REQUIRING_REASON_PROMPT.includes(newStatus)) {
      setPendingStatus(newStatus)
      setReasonDraft('')
      requestAnimationFrame(() => {
        decisionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return
    }
    updateMutation.mutate({ id: p.id, input: { status: newStatus } })
  }

  const handleConfirmStatus = () => {
    if (!pendingStatus) return
    const trimmed = reasonDraft.trim()
    updateMutation.mutate({
      id: p.id,
      input: { status: pendingStatus, ...(trimmed ? { reason: trimmed } : {}) },
    })
    setPendingStatus(null)
    setReasonDraft('')
  }

  const handleCancelStatus = () => {
    setPendingStatus(null)
    setReasonDraft('')
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
            <DropdownMenu className="pds-header-status">
              <DropdownMenu.Trigger>
                <button
                  type="button"
                  className="pds-header-status-trigger"
                  style={{ '--header-status-color': statusCfg.color } as React.CSSProperties}
                  aria-label={`Statut : ${statusCfg.label}. Changer le statut.`}
                >
                  <StatusIcon size={14} aria-hidden="true" />
                  <span>{statusCfg.label}</span>
                  <ChevronDown size={12} aria-hidden="true" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                ariaLabel="Changer le statut du produit"
                className="pds-header-status-content"
              >
                {(Object.keys(statusLabels) as UserProduct['status'][]).map((s, idx) => {
                  const cfg = statusLabels[s]
                  const Icon = cfg.icon
                  const isActive = p.status === s
                  return (
                    <DropdownMenu.Item key={s} index={idx} onSelect={() => handleStatusChange(s)}>
                      <button
                        type="button"
                        className={clsx('pds-header-status-item', isActive && 'is-active')}
                        title={cfg.purpose}
                      >
                        <Icon size={14} style={{ color: cfg.color }} aria-hidden="true" />
                        <span className="pds-header-status-label">{cfg.label}</span>
                        {isActive && (
                          <Check size={14} aria-hidden="true" className="pds-header-status-check" />
                        )}
                      </button>
                    </DropdownMenu.Item>
                  )
                })}
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>

          {/* Hero row (P2.E.1): photo as left-flag with brand/name/meta on
              the right. Replaces the standalone §1 photo card — the picture
              now anchors the sticky header instead of floating as a 72px
              orphan tile above Ingrédients. */}
          <div className="pds-header-main">
            <ProductImage
              kind={p.product.kind}
              unit={p.product.unit}
              imageUrl={p.product.imageUrl}
              size={96}
              className="product-image--flat"
            />
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
        </div>

        <div className="pds-content">
          {/* §2 Ingrédients — primary value for Aurore audience (INCI-literate
              per positioning.md: "lisent les listes INCI"). Moved from §8
              and expanded by default (P2.C). Editorial design (P2.D):
              refined typography for the linked tags, small-caps wide-
              tracking INCI brut text underneath. */}
          <section className="pds-card coll-card pds-ingredients-section">
            <div className="pds-card-header">
              <Droplets size={16} />
              <h3>Ingrédients</h3>
            </div>
            {fullProductError ? (
              <p className="pds-empty-msg" role="alert">
                Détails indisponibles — vérifiez votre connexion.
              </p>
            ) : fullProduct?.ingredients && fullProduct.ingredients.length > 0 ? (
              <>
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
                {fullProduct.inci && (
                  <div className="pds-inci-block">
                    <div className="pds-inci-header">
                      <h4 className="pds-inci-label">INCI brut</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyInci}
                        aria-label="Copier la liste INCI brute"
                        className="pds-inci-copy"
                      >
                        {inciCopied ? (
                          <>
                            <Check size={14} aria-hidden="true" />
                            <span>Copié</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} aria-hidden="true" />
                            <span>Copier</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="pds-inci-text">{fullProduct.inci}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="pds-empty-msg">
                Liste d'ingrédients non ajoutée. Vous pouvez garder ce produit comme note
                personnelle pour le moment.
              </p>
            )}
          </section>

          {/* §3 En un coup d'œil — admin-curated description, demoted under
              §2 Ingrédients (P2.C — description is secondary signal for
              INCI-literate Aurore audience). Render only when present. */}
          {fullProduct?.description && (
            <section className="pds-card coll-card">
              <div className="pds-card-header">
                <Eye size={16} />
                <h3>En un coup d'œil</h3>
              </div>
              <p className="pds-glance-text">{fullProduct.description}</p>
            </section>
          )}

          {/* §4 À noter — render only when a contextual note triggers. */}
          {fragranceNote && (
            <section className="pds-card coll-card">
              <div className="pds-card-header">
                <Sparkles size={16} />
                <h3>À noter</h3>
              </div>
              <ul className="pds-notes-list">
                <li className="pds-note-item">
                  Contient des composants parfumants, que vous suivez souvent.
                </li>
              </ul>
            </section>
          )}

          {/* §5 Votre expérience */}
          <section className="pds-card coll-card">
            <div className="pds-card-header">
              <Star size={16} />
              <h3>Votre expérience</h3>
            </div>

            <div className="pds-subsection">
              <h4 className="pds-subsection-title">Évaluation</h4>

              <SentimentPicker
                value={p.sentiment}
                status={p.status}
                onChange={(val) => updateMutation.mutate({ id: p.id, input: { sentiment: val } })}
              />

              <RepurchasePicker
                value={p.wouldRepurchase}
                onChange={(val) =>
                  updateMutation.mutate({ id: p.id, input: { wouldRepurchase: val } })
                }
              />

              <details className="pds-criteria-details">
                <summary>Évaluer en détail</summary>
                <div className="pds-criteria-details-body">
                  <CriteriaList
                    userProductId={p.id}
                    review={p.review}
                    activeTooltip={activeTooltip}
                    setActiveTooltip={setActiveTooltip}
                  />
                </div>
              </details>
            </div>

            <div className="pds-subsection">
              <h4 className="pds-subsection-title">Notes</h4>

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
            </div>
          </section>

          {/* §6 Votre décision */}
          <section
            ref={decisionSectionRef}
            id="pds-decision"
            tabIndex={-1}
            className="pds-card pds-review-card coll-card"
          >
            <div className="pds-card-header">
              <Heart size={16} />
              <h3>Votre décision</h3>
            </div>
            <p className="pds-section-lead">
              Aurore traite votre choix d'étagère comme votre décision actuelle. Modifiable à tout
              moment.
            </p>
            <StatusChips currentStatus={p.status} onChange={handleStatusChange} />
            {pendingStatus && (
              <div className="pds-reason-prompt">
                <p className="pds-reason-lead">
                  Marquer comme <strong>{statusLabels[pendingStatus].label}</strong> — une raison à
                  garder en tête ?
                </p>
                <p className="pds-reason-hint">Optionnel. Ajoutée à votre historique.</p>
                <textarea
                  id="pds-reason"
                  className="pds-reason-textarea"
                  value={reasonDraft}
                  onChange={(e) => setReasonDraft(e.target.value)}
                  placeholder="Trop riche pour mon hiver, picotements à la première utilisation…"
                  rows={2}
                />
                <div className="pds-reason-actions">
                  <Button variant="ghost" size="sm" onClick={handleCancelStatus}>
                    Annuler
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={updateMutation.isPending}
                    onClick={handleConfirmStatus}
                  >
                    Confirmer
                  </Button>
                </div>
              </div>
            )}
            <StatusHistory userProductId={p.id} />
          </section>

          {/* §7 Comparer avec un autre produit */}
          <section className="pds-card coll-card">
            <div className="pds-card-header">
              <ArrowLeftRight size={16} />
              <h3>Comparer avec un autre produit</h3>
            </div>
            <p className="pds-section-lead">
              Comparez les groupes d'ingrédients et vos notes personnelles côte à côte.
            </p>
            <Link
              to="/products/compare/new"
              search={{ seed: p.productId }}
              className="pds-compare-btn"
            >
              <ArrowLeftRight size={14} />
              Comparer ce produit à un autre
            </Link>
          </section>

          {/* §8 Cycle de vie — moved from §1 to footer (P2.A.2). Post-purchase
              tracking is secondary info; bottom keeps the calm narrative. */}
          <section className="pds-card coll-card">
            <div className="pds-card-header">
              <FlaskConical size={16} />
              <h3>Cycle de vie</h3>
            </div>
            <details className="pds-lifecycle-disclosure">
              <summary className="pds-lifecycle-summary">
                <span>Voir les achats et le cycle de vie</span>
              </summary>
              <LifecycleSection p={p} onAddPurchase={() => setShowAddPurchase(true)} />
            </details>
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
    </>
  )
}

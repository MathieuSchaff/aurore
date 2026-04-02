import type { UserProductStatus } from '@habit-tracker/shared'

import { ArrowLeft, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useScrollLock } from '../../../hooks/useScrollLock'
import { useAddPurchase } from '../../../lib/queries/purchases'
import { useCreateUserProduct } from '../../../lib/queries/user-products'
import './AddToCollectionModal.css'

interface ModalProduct {
  id: string
  name: string
  brand: string
  priceCents?: number | null
  userProductId?: string
}

interface AddToCollectionModalProps {
  product: ModalProduct
  onClose: () => void
  onSuccess?: () => void
}

// 'archived' is excluded: users cannot directly add a product as archived
const STATUS_OPTIONS: { value: UserProductStatus; label: string }[] = [
  { value: 'in_stock', label: 'En stock' },
  { value: 'wishlist', label: 'Liste de souhaits' },
  { value: 'watched', label: 'Surveillé' },
  { value: 'holy_grail', label: 'Saint Graal' },
  { value: 'avoided', label: 'Évité' },
]

export function AddToCollectionModal({ product, onClose, onSuccess }: AddToCollectionModalProps) {
  const today = new Date().toISOString().split('T')[0]
  const defaultPrice = product.priceCents != null ? (product.priceCents / 100).toFixed(2) : ''

  const [step, setStep] = useState<'status' | 'purchase'>('status')
  const [price, setPrice] = useState(defaultPrice)
  const [purchasedAt, setPurchasedAt] = useState(today)

  const addUserProduct = useCreateUserProduct()
  const addPurchase = useAddPurchase()

  useScrollLock(true)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const isPending = addUserProduct.isPending || addPurchase.isPending
  const isError = addUserProduct.isError || addPurchase.isError

  const handleStatusSelect = async (status: UserProductStatus) => {
    if (status === 'in_stock') {
      setStep('purchase')
      return
    }
    try {
      await addUserProduct.mutateAsync({ productId: product.id, status })
      onSuccess?.()
      onClose()
    } catch {
      // error handled via mutation state
    }
  }

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const pricePaidCents = price !== '' ? Math.round(parseFloat(price) * 100) : undefined
    try {
      let userProductId = product.userProductId
      if (!userProductId) {
        const created = await addUserProduct.mutateAsync({
          productId: product.id,
          status: 'in_stock',
        })
        userProductId = created.id
      }
      await addPurchase.mutateAsync({
        userProductId,
        input: { purchasedAt, pricePaidCents },
      })
      onSuccess?.()
      onClose()
    } catch {
      // error handled via mutation state
    }
  }

  const title = step === 'status' ? 'Ajouter à la collection' : 'Achat'

  return (
    <div className="inv-modal-wrapper">
      {/* biome-ignore lint: overlay click only, no keyboard handling needed */}
      <div className="inv-modal-overlay" onClick={onClose} />
      <div
        className="inv-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inv-modal-title"
      >
        <div className="inv-modal-header">
          <div>
            <h2 id="inv-modal-title" className="inv-modal-title">
              {title}
            </h2>
            <p className="inv-modal-subtitle">
              {product.name} · {product.brand}
            </p>
          </div>
          <button
            type="button"
            className="inv-modal-close-btn"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {step === 'status' && (
          <>
            {addUserProduct.isError && (
              <div
                className="inv-modal-error"
                role="alert"
                style={{ margin: 'var(--space-4) var(--space-5) 0' }}
              >
                Erreur lors de l'ajout. Veuillez réessayer.
              </div>
            )}
            <div className="inv-modal-status-grid">
              {STATUS_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={`inv-modal-status-btn${value === 'in_stock' ? ' inv-modal-status-btn--in-stock' : ''}`}
                  onClick={() => handleStatusSelect(value)}
                  disabled={isPending}
                >
                  <span className="inv-modal-status-label">{label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'purchase' && (
          <form onSubmit={handlePurchaseSubmit} className="inv-modal-form">
            {isError && (
              <div className="inv-modal-error" role="alert">
                Erreur lors de l'ajout. Veuillez réessayer.
              </div>
            )}

            <div className="inv-modal-field">
              <label
                htmlFor="inv-purchased-at"
                className="inv-modal-label inv-modal-label--priority"
              >
                Date d'achat
              </label>
              <input
                id="inv-purchased-at"
                type="date"
                className="inv-modal-input"
                value={purchasedAt}
                onChange={(e) => setPurchasedAt(e.target.value)}
                required
                // biome-ignore lint: ok to autofocus
                autoFocus
              />
            </div>

            <div className="inv-modal-field">
              <label htmlFor="inv-price" className="inv-modal-label">
                Prix payé (€) — optionnel
              </label>
              <input
                id="inv-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="inv-modal-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="inv-modal-actions">
              <button
                type="button"
                className="inv-modal-back-btn"
                onClick={() => setStep('status')}
                disabled={isPending}
              >
                <ArrowLeft size={14} />
                Retour
              </button>
              <button type="submit" className="inv-modal-submit-btn" disabled={isPending}>
                {isPending ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

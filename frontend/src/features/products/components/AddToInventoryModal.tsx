import { X } from 'lucide-react'
import { useState } from 'react'

import { useScrollLock } from '../../../hooks/useScrollLock'
import { useAddPurchase } from '../../../lib/queries/purchases'
import { useCreateUserProduct } from '../../../lib/queries/user-products'
import './AddToInventoryModal.css'

interface ModalProduct {
  id: string
  name: string
  brand: string
  priceCents?: number | null
  userProductId?: string
}

interface AddToInventoryModalProps {
  product: ModalProduct
  onClose: () => void
  onSuccess?: () => void
}

export function AddToInventoryModal({ product, onClose, onSuccess }: AddToInventoryModalProps) {
  const today = new Date().toISOString().split('T')[0]
  const defaultPrice = product.priceCents != null ? (product.priceCents / 100).toFixed(2) : ''

  const [price, setPrice] = useState(defaultPrice)
  const [purchasedAt, setPurchasedAt] = useState(today)

  const addUserProduct = useCreateUserProduct()
  const addPurchase = useAddPurchase()

  useScrollLock(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Backend expects prices in cents
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
      // error handling is managed via mutation state
    }
  }

  return (
    <div className="inv-modal-wrapper">
      {/*biome-ignore lint: we dont need to focus the overlay so no need for handleKey on it.*/}
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
              Ajouter au stock
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

        <form onSubmit={handleSubmit} className="inv-modal-form">
          {(addPurchase.isError || addUserProduct.isError) && (
            <div className="inv-modal-error" role="alert">
              Erreur lors de l'ajout. Veuillez réessayer.
            </div>
          )}

          <div className="inv-modal-field">
            <label htmlFor="inv-purchased-at" className="inv-modal-label inv-modal-label--priority">
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
              className="inv-modal-cancel-btn"
              onClick={onClose}
              disabled={addPurchase.isPending || addUserProduct.isPending}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inv-modal-submit-btn"
              disabled={addPurchase.isPending || addUserProduct.isPending}
            >
              {addPurchase.isPending || addUserProduct.isPending ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

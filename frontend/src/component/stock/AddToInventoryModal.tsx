import { X } from 'lucide-react'
import { useState } from 'react'

import { useScrollLock } from '../../hooks/useScrollLock'
import { useAddStockEntry } from '../../lib/queries/stock'
import './AddToInventoryModal.css'

interface ModalProduct {
  id: string
  name: string
  brand: string
  priceCents?: number | null
}

interface AddToInventoryModalProps {
  product: ModalProduct
  onClose: () => void
  onSuccess?: () => void
}

export function AddToInventoryModal({ product, onClose, onSuccess }: AddToInventoryModalProps) {
  const today = new Date().toISOString().split('T')[0]
  const defaultPrice = product.priceCents != null
    ? (product.priceCents / 100).toFixed(2)
    : ''

  const [qty, setQty] = useState(1)
  const [price, setPrice] = useState(defaultPrice)
  const [purchasedAt, setPurchasedAt] = useState(today)

  const addEntry = useAddStockEntry()

  useScrollLock(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const pricePaidCents = price !== '' ? Math.round(parseFloat(price) * 100) : undefined

    try {
      await addEntry.mutateAsync({
        productId: product.id,
        qty,
        pricePaidCents,
        purchasedAt,
      })
      onSuccess?.()
      onClose()
    } catch {
      // error is shown via addEntry.isError
    }
  }

  return (
    <div className="inv-modal-wrapper">
      <div className="inv-modal-overlay" onClick={onClose} />

      <div className="inv-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="inv-modal-title">
        <div className="inv-modal-header">
          <div>
            <h2 id="inv-modal-title" className="inv-modal-title">Ajouter au stock</h2>
            <p className="inv-modal-subtitle">{product.name} · {product.brand}</p>
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
          {addEntry.isError && (
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
              autoFocus
            />
          </div>

          <div className="inv-modal-field">
            <label htmlFor="inv-qty" className="inv-modal-label inv-modal-label--priority">
              Quantité
            </label>
            <input
              id="inv-qty"
              type="number"
              min="1"
              className="inv-modal-input"
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              required
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
              disabled={addEntry.isPending}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inv-modal-submit-btn"
              disabled={addEntry.isPending}
            >
              {addEntry.isPending ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

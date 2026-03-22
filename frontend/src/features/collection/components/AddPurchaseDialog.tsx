import type { UserProduct } from '../../../lib/queries/user-products'
import { X, Calendar, Euro } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useAddPurchase } from '../../../lib/queries/purchases'
import { toast } from 'sonner'
import { useClickOutside } from '../../../hooks/useClickOutside'

interface AddPurchaseDialogProps {
  p: UserProduct
  purchaseDate: string
  setPurchaseDate: (v: string) => void
  purchasePrice: string
  setPurchasePrice: (v: string) => void
  onClose: () => void
}

export function AddPurchaseDialog({
  p,
  purchaseDate,
  setPurchaseDate,
  purchasePrice,
  setPurchasePrice,
  onClose,
}: AddPurchaseDialogProps) {
  const addPurchaseMutation = useAddPurchase()
  const ref = useRef<HTMLDivElement>(null)
  
  useClickOutside(ref, onClose)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    addPurchaseMutation.mutate(
      {
        userProductId: p.id,
        input: {
          purchasedAt: purchaseDate,
          pricePaidCents: purchasePrice
            ? Math.round(parseFloat(purchasePrice) * 100)
            : undefined,
        },
      },
      {
        onSuccess: () => {
          onClose()
          toast.success('Achat enregistré !')
        },
      }
    )
  }

  return (
    <div className="coll-purchase-dialog" ref={ref} onClick={(e) => e.stopPropagation()}>
      <div className="coll-purchase-dialog-header">
        <span className="coll-purchase-dialog-title">ENREGISTRER UN ACHAT</span>
        <button type="button" className="coll-purchase-dialog-close" onClick={onClose}>
          <X size={14} />
        </button>
      </div>

      <div className="coll-purchase-dialog-body">
        <div className="coll-purchase-dialog-field">
          <label htmlFor={`dialog-date-${p.id}`}>
            <Calendar size={12} />
            Date d'achat
          </label>
          <input
            id={`dialog-date-${p.id}`}
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>

        <div className="coll-purchase-dialog-field">
          <label htmlFor={`dialog-price-${p.id}`}>
            <Euro size={12} />
            Prix payé (€)
          </label>
          <input
            id={`dialog-price-${p.id}`}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="coll-purchase-dialog-save"
          onClick={handleSave}
          disabled={!purchaseDate || addPurchaseMutation.isPending}
        >
          {addPurchaseMutation.isPending ? '...' : 'Valider'}
        </button>
      </div>
    </div>
  )
}

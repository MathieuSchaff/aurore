/**
 * AddPurchaseDialog — Formulaire d'enregistrement d'un achat.
 *
 * L'état du formulaire (date, prix) est local au dialog.
 * La fermeture se fait via clic extérieur ou touche Escape
 * (géré par useClickOutside qui écoute les deux).
 */

import { Calendar, Euro, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { useClickOutside } from '../../../../hooks/useClickOutside'
import { useAddPurchase } from '../../../../lib/queries/purchases'
import './AddPurchaseDialog.css'

interface AddPurchaseDialogProps {
  userProductId: string
  onClose: () => void
}

export function AddPurchaseDialog({ userProductId, onClose }: AddPurchaseDialogProps) {
  const addPurchaseMutation = useAddPurchase()
  const ref = useRef<HTMLDivElement>(null)

  // État local du formulaire — pas besoin de le remonter au parent
  const [purchaseDate, setPurchaseDate] = useState(() => new Date().toISOString().split('T')[0])
  const [purchasePrice, setPurchasePrice] = useState('')

  // Ferme sur clic extérieur OU touche Escape
  useClickOutside(ref, onClose)

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    addPurchaseMutation.mutate(
      {
        userProductId,
        input: {
          purchasedAt: purchaseDate,
          pricePaidCents: purchasePrice ? Math.round(parseFloat(purchasePrice) * 100) : undefined,
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
          <label htmlFor={`dialog-date-${userProductId}`}>
            <Calendar size={12} />
            Date d'achat
          </label>
          <input
            id={`dialog-date-${userProductId}`}
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>

        <div className="coll-purchase-dialog-field">
          <label htmlFor={`dialog-price-${userProductId}`}>
            <Euro size={12} />
            Prix payé (€)
          </label>
          <input
            id={`dialog-price-${userProductId}`}
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

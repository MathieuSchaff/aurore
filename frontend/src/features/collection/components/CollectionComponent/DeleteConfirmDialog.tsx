/**
 * DeleteConfirmDialog — Dialogue de confirmation de suppression.
 *
 * Se ferme via clic extérieur ou touche Escape
 * (géré par useClickOutside qui écoute les deux).
 */

import { AlertTriangle, X } from 'lucide-react'
import { useRef } from 'react'

import { useClickOutside } from '../../../../hooks/useClickOutside'
import './DeleteConfirmDialog.css'

interface DeleteConfirmDialogProps {
  onConfirm: () => void
  onClose: () => void
  isPending: boolean
}

export function DeleteConfirmDialog({ onConfirm, onClose, isPending }: DeleteConfirmDialogProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Ferme sur clic extérieur OU touche Escape
  useClickOutside(ref, onClose)

  return (
    <div className="coll-delete-dialog" ref={ref} onClick={(e) => e.stopPropagation()}>
      <div className="coll-delete-dialog-header">
        <div className="coll-delete-dialog-title-row">
          <AlertTriangle size={14} className="coll-delete-warning-icon" />
          <span className="coll-delete-dialog-title">CONFIRMATION</span>
        </div>
        <button type="button" className="coll-delete-dialog-close" onClick={onClose}>
          <X size={14} />
        </button>
      </div>

      <div className="coll-delete-dialog-body">
        <p>Retirer ce produit de votre collection ?</p>

        <div className="coll-delete-dialog-actions">
          <button
            type="button"
            className="coll-delete-dialog-cancel"
            onClick={onClose}
            disabled={isPending}
          >
            Annuler
          </button>
          <button
            type="button"
            className="coll-delete-dialog-confirm"
            onClick={(e) => {
              e.stopPropagation()
              onConfirm()
            }}
            disabled={isPending}
          >
            {isPending ? '...' : 'Retirer'}
          </button>
        </div>
      </div>
    </div>
  )
}

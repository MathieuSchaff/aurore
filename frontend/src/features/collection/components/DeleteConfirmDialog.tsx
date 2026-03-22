import { AlertTriangle, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useClickOutside } from '../../../hooks/useClickOutside'

interface DeleteConfirmDialogProps {
  onConfirm: () => void
  onClose: () => void
  isPending: boolean
}

export function DeleteConfirmDialog({
  onConfirm,
  onClose,
  isPending,
}: DeleteConfirmDialogProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  useClickOutside(ref, onClose)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

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

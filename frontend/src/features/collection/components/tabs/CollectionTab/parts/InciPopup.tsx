import clsx from 'clsx'
import { Check, Clipboard, X } from 'lucide-react'

import { Modal } from '@/component/Dialog/Modal'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

interface InciPopupProps {
  inci: string
  onClose: () => void
}

export function InciPopup({ inci, onClose }: InciPopupProps) {
  const { copied, copy } = useCopyToClipboard()

  return (
    <Modal onClose={onClose} size="lg" className="pds-inci-dialog">
      <div className="pds-inci-header">
        <Modal.Title className="pds-section-title">Liste INCI</Modal.Title>
        <div className="pds-inci-actions">
          <button
            type="button"
            className={clsx('pds-inci-copy-btn', copied && 'copied')}
            onClick={() => copy(inci)}
          >
            {copied ? <Check size={14} /> : <Clipboard size={14} />}
            {copied ? 'Copié !' : 'Copier'}
          </button>
          <button type="button" className="pds-inci-close" onClick={onClose} aria-label="Fermer">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="pds-inci-body">
        <p className="pds-inci-text">{inci}</p>
      </div>
    </Modal>
  )
}

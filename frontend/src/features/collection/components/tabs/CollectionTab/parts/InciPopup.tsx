import clsx from 'clsx'
import { Check, Clipboard, X } from 'lucide-react'
import { useState } from 'react'

import { Modal } from '@/component/Dialog/Modal'

interface InciPopupProps {
  inci: string
  onClose: () => void
}

export function InciPopup({ inci, onClose }: InciPopupProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(inci).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Modal onClose={onClose} size="lg" className="pds-inci-dialog">
      <div className="pds-inci-header">
        <Modal.Title className="pds-section-title">Liste INCI</Modal.Title>
        <div className="pds-inci-actions">
          <button
            type="button"
            className={clsx('pds-inci-copy-btn', copied && 'copied')}
            onClick={handleCopy}
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

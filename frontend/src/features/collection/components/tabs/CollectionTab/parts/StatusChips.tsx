import clsx from 'clsx'

import { statusLabels } from '@/features/collection/constants'
import type { UserProduct } from '@/lib/queries/user-products'

interface StatusChipsProps {
  currentStatus: UserProduct['status']
  onChange: (status: UserProduct['status']) => void
}

export function StatusChips({ currentStatus, onChange }: StatusChipsProps) {
  return (
    <div className="pds-section">
      <span className="pds-section-title">Statut</span>
      <fieldset className="pds-status-chips" aria-label="Statut du produit">
        {(Object.keys(statusLabels) as UserProduct['status'][]).map((s) => {
          const cfg = statusLabels[s]
          const Icon = cfg.icon
          return (
            <button
              key={s}
              type="button"
              className={clsx('pds-status-chip', currentStatus === s && 'active')}
              aria-pressed={currentStatus === s}
              onClick={() => onChange(s)}
            >
              <Icon size={14} />
              <span>{cfg.label}</span>
            </button>
          )
        })}
      </fieldset>
    </div>
  )
}

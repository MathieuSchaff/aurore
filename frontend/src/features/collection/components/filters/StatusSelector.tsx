import type { UserProductStatus } from '@habit-tracker/shared'

import clsx from 'clsx'
import { Archive, Ban, Eye, Heart, Package, ShoppingBag } from 'lucide-react'
import type React from 'react'

export const statusConfig: Record<
  UserProductStatus,
  { label: string; icon: React.ComponentType<{ size?: number }>; color: string }
> = {
  in_stock: { label: 'En stock', icon: Package, color: '#10b981' },
  wishlist: { label: 'Wishlist', icon: ShoppingBag, color: '#3b82f6' },
  watched: { label: 'Surveille', icon: Eye, color: '#f59e0b' },
  holy_grail: { label: 'Saint Graal', icon: Heart, color: '#ef4444' },
  archived: { label: 'Archivé', icon: Archive, color: '#6b7280' },
  avoided: { label: 'À éviter', icon: Ban, color: '#000000' },
}

interface StatusSelectorProps {
  value: UserProductStatus
  onChange: (status: UserProductStatus) => void
}

export function StatusSelector({ value, onChange }: StatusSelectorProps) {
  return (
    <fieldset className="status-selector">
      <legend className="sr-only">Statut du produit</legend>
      {(Object.keys(statusConfig) as UserProductStatus[]).map((s) => {
        const cfg = statusConfig[s]
        const Icon = cfg.icon
        return (
          <button
            key={s}
            type="button"
            className={clsx('status-option', value === s && 'active')}
            aria-pressed={value === s}
            onClick={() => onChange(s)}
          >
            <Icon size={18} />
            <span>{cfg.label}</span>
          </button>
        )
      })}
    </fieldset>
  )
}

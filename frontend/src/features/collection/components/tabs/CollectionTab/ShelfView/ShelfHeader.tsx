import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

import { statusLabels } from '@/features/collection/constants'
import type { UserProduct } from '@/lib/queries/user-products'

import './ShelfView.css'

interface ShelfHeaderProps {
  status: UserProduct['status']
  count: number
  isCollapsed: boolean
  onToggle: () => void
}

export function ShelfHeader({ status, count, isCollapsed, onToggle }: ShelfHeaderProps) {
  const cfg = statusLabels[status]

  return (
    <button
      type="button"
      className={clsx('shelf-header', isCollapsed && 'is-collapsed')}
      style={{ borderLeftColor: cfg.color }}
      onClick={onToggle}
      aria-expanded={!isCollapsed}
    >
      <cfg.icon size={14} aria-hidden="true" />
      <h3 className="shelf-header-label">{cfg.label}</h3>
      <span
        className="shelf-header-count"
        style={{
          color: cfg.color,
          background: `color-mix(in oklch, ${cfg.color} 12%, transparent)`,
        }}
      >
        {count}
      </span>
      <ChevronDown size={15} className={clsx('shelf-header-chevron', isCollapsed && 'collapsed')} />
    </button>
  )
}

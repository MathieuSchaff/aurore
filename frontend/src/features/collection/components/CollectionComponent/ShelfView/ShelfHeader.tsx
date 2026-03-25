/**
 * ShelfHeader — En-tête d'une étagère avec icône de statut, compteur et chevron.
 *
 * Change de style quand un produit est survolé au-dessus (drop-target)
 * pour donner un feedback visuel lors du drag & drop.
 */

import type { UserProductStatus } from '@habit-tracker/shared'

import { ChevronDown } from 'lucide-react'

import { statusLabels } from '../../../constants'

interface ShelfHeaderProps {
  status: UserProductStatus
  count: number
  isCollapsed: boolean
  onToggle: () => void
  isOver?: boolean
}

export function ShelfHeader({ status, count, isCollapsed, onToggle, isOver }: ShelfHeaderProps) {
  const config = statusLabels[status]
  const Icon = config.icon

  return (
    <button
      type="button"
      className={`shelf-header ${isOver ? 'drop-target' : ''}`}
      onClick={onToggle}
      style={{ '--shelf-color': config.color } as React.CSSProperties}
    >
      <Icon size={16} style={{ color: config.color }} />
      <span className="shelf-header-label">{config.label}</span>
      <span className="shelf-header-count">{count}</span>
      <ChevronDown size={14} className={`shelf-header-chevron ${isCollapsed ? 'collapsed' : ''}`} />
    </button>
  )
}

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

  return (
    <button
      type="button"
      className={`shelf-header ${isOver ? 'drop-target' : ''}`}
      onClick={onToggle}
    >
      <span className="shelf-header-dot" style={{ background: config.color }} />
      <span className="shelf-header-label">{config.label}</span>
      <span className="shelf-header-count">{count}</span>
      <ChevronDown size={14} className={`shelf-header-chevron ${isCollapsed ? 'collapsed' : ''}`} />
    </button>
  )
}

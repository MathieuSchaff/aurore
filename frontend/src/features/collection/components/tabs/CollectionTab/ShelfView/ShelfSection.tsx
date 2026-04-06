import { useDroppable } from '@dnd-kit/core'
import clsx from 'clsx'
import { type CSSProperties, type ReactNode, useState } from 'react'

import { statusLabels } from '@/features/collection/constants'
import type { UserProduct } from '@/lib/queries/user-products'
import { ShelfHeader } from './ShelfHeader'

import './ShelfView.css'

interface ShelfSectionProps {
  status: UserProduct['status']
  count: number
  children: ReactNode
}

export function ShelfSection({ status, count, children }: ShelfSectionProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  })

  const [isCollapsed, setIsCollapsed] = useState(false)

  if (count === 0) return null

  const accent = statusLabels[status].color

  return (
    <div
      ref={setNodeRef}
      className={clsx('shelf-section', isOver && 'is-over', isCollapsed && 'is-collapsed')}
      style={
        {
          '--shelf-accent': accent,
          borderLeftColor: isOver ? accent : undefined,
        } as CSSProperties
      }
    >
      <ShelfHeader
        status={status}
        count={count}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((c) => !c)}
      />
      <div className="shelf-section-content" aria-hidden={isCollapsed}>
        <div className="shelf-section-content-inner">{children}</div>
      </div>
    </div>
  )
}

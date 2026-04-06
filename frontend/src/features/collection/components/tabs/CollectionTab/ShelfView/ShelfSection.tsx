import { useDroppable } from '@dnd-kit/core'
import clsx from 'clsx'
import { type ReactNode, useState } from 'react'

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

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'shelf-section',
        `shelf-section--${status.replace('_', '-')}`,
        isOver && 'is-over'
      )}
      style={{
        borderColor: isOver ? `var(--status-color-${status.replace('_', '-')})` : undefined,
      }}
    >
      <ShelfHeader
        status={status}
        count={count}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((c) => !c)}
      />
      {!isCollapsed && children}
    </div>
  )
}

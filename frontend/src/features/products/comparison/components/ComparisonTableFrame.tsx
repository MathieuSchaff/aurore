import clsx from 'clsx'
import type { CSSProperties, ReactNode } from 'react'

import './ComparisonTable.css'

type Props = { columns: number; className?: string; children: ReactNode }

// Two products fit any width
// From three on, a phone would squeeze each name to one letter per line
export function ComparisonTableFrame({ columns, className, children }: Props) {
  return (
    <div
      className={clsx('cmp-table-frame', columns > 2 && 'is-wide', className)}
      style={{ '--cmp-cols': columns } as CSSProperties}
    >
      {children}
    </div>
  )
}

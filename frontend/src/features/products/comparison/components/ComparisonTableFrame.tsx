import clsx from 'clsx'
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react'

import './ComparisonTable.css'

type Props = { columns: number; className?: string; children: ReactNode }

// Two products fit any width
// From three on, a phone would squeeze each name to one letter per line
export function ComparisonTableFrame({ columns, className, children }: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [headerFits, setHeaderFits] = useState(false)

  useEffect(() => {
    const frame = frameRef.current
    const head = frame?.querySelector('thead')
    const firstRow = frame?.querySelector('tbody tr')
    if (columns <= 2 || !frame || !head || !firstRow) return

    // Keep at least one data row visible below a sticky header at high zoom
    const measure = () => {
      setHeaderFits(
        head.getBoundingClientRect().height + firstRow.getBoundingClientRect().height <=
          frame.clientHeight
      )
    }
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    observer.observe(head)
    observer.observe(firstRow)
    measure()
    return () => observer.disconnect()
  })

  return (
    <div
      ref={frameRef}
      className={clsx(
        'cmp-table-frame',
        columns > 2 && 'is-wide',
        headerFits && 'has-sticky-header',
        className
      )}
      style={{ '--cmp-cols': columns } as CSSProperties}
    >
      {children}
    </div>
  )
}

import clsx from 'clsx'
import type { ReactNode } from 'react'

interface IconBoxProps {
  children: ReactNode
  className?: string
}

export function IconBox({ children, className }: IconBoxProps) {
  return (
    <div className={clsx('ui-centered', className)} aria-hidden="true">
      {children}
    </div>
  )
}

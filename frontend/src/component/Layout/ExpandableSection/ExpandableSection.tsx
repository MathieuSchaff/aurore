import { type ReactNode, useState } from 'react'

import { Button } from '@/component/Button'

type Props = {
  title: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  open?: boolean
  onToggle?: () => void
}

// Toggle + chevron + collapsible body. Supports controlled (`open` +
// `onToggle`) and uncontrolled (`defaultOpen`) modes so siblings can share
// a mutually-exclusive open state when needed.
export function ExpandableSection({ title, children, defaultOpen = false, open, onToggle }: Props) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const handleToggle = () => {
    if (isControlled) onToggle?.()
    else setInternalOpen((o) => !o)
  }

  return (
    <>
      <Button variant="ghost" onClick={handleToggle} aria-expanded={isOpen}>
        {title} {isOpen ? '▾' : '▸'}
      </Button>
      {isOpen && children}
    </>
  )
}

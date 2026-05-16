import { type ReactNode, useState } from 'react'

import './ExpandableSection.css'

type Props = {
  title: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  open?: boolean
  onToggle?: () => void
}

// Controlled (`open` + `onToggle`) or uncontrolled (`defaultOpen`); siblings can share a mutually-exclusive open state.
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
      <button
        type="button"
        className="expandable-section__trigger"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <svg
          className={`expandable-section__chevron${isOpen ? ' expandable-section__chevron--open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && <div className="expandable-section__body">{children}</div>}
    </>
  )
}

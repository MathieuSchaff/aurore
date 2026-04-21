import { PRODUCT_DOMAIN_TAB_META, PRODUCT_DOMAIN_TABS, type ProductDomainTab } from '@habit-tracker/shared'
import { useRef } from 'react'

import './DomainTabs.css'

type Props = {
  value: ProductDomainTab
  onChange: (next: ProductDomainTab) => void
}

const ORDERED_TABS = [...PRODUCT_DOMAIN_TABS].sort(
  (a, b) => PRODUCT_DOMAIN_TAB_META[a].order - PRODUCT_DOMAIN_TAB_META[b].order
)

export function DomainTabs({ value, onChange }: Props) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const len = ORDERED_TABS.length
    const nextIndex =
      e.key === 'ArrowRight' ? (index + 1) % len : (index - 1 + len) % len
    refs.current[nextIndex]?.focus()
  }

  return (
    <div role="tablist" className="domain-tabs" aria-label="Catégorie de produits">
      {ORDERED_TABS.map((tab, index) => {
        const isActive = tab === value
        return (
          <button
            key={tab}
            ref={(el) => {
              refs.current[index] = el
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={`domain-tabs__tab${isActive ? ' domain-tabs__tab--active' : ''}`}
            onClick={() => onChange(tab)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {PRODUCT_DOMAIN_TAB_META[tab].label}
          </button>
        )
      })}
    </div>
  )
}

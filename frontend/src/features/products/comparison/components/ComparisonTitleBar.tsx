import { type ReactNode, useId, useState } from 'react'

import { Button } from '@/component/Button/Button'
import './ComparisonTitleBar.css'

type Props = { name: string | null; count: number; children: ReactNode }

// Editing is rare, so its controls stay folded under the title
// `hidden`, not unmounted: unmounting would drop a name draft and its leave guard
export function ComparisonTitleBar({ name, count, children }: Props) {
  const panelId = useId()
  const [open, setOpen] = useState(false)

  return (
    <header className="cmp-title-bar">
      <div className="ui-split-row">
        <div className="cmp-title-bar__heading">
          <h1 className="cmp-title-bar__title">{name || `Comparer ${count} produits`}</h1>
          {name && (
            <p className="cmp-title-bar__count">
              {count} produit{count > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
        >
          Modifier la comparaison
        </Button>
      </div>
      <div id={panelId} className="cmp-title-bar__panel" hidden={!open}>
        {children}
      </div>
    </header>
  )
}

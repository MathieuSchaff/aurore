/**
 * ShelfGrid — Grille d'affichage des cartes produit dans une étagère.
 * Layout 2 colonnes responsive défini dans ShelfView.css.
 */

import type { ReactNode } from 'react'

interface ShelfGridProps {
  children: ReactNode
}

export function ShelfGrid({ children }: ShelfGridProps) {
  return <div className="shelf-grid">{children}</div>
}

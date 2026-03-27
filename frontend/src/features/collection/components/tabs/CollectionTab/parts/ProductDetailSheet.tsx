/**
 * ProductDetailSheet — Panneau détail produit (bottom sheet).
 *
 * Affiche les informations complètes d'un produit de la collection.
 * Le scroll de la page est verrouillé pendant l'ouverture (useScrollLock).
 * Se ferme via backdrop, bouton close, ou touche Escape.
 */

import { X } from 'lucide-react'
import { useEffect } from 'react'

import { useScrollLock } from '@/hooks/useScrollLock'
import type { UserPreferences } from '@/lib/queries/user-preferences'
import type { UserProduct } from '@/lib/queries/user-products'
import { ProductCardDetailed } from '../ProductCard/Detailed/ProductCardDetailed'

import './ProductDetailSheet.css'

interface ProductDetailSheetProps {
  p: UserProduct
  prefs: UserPreferences | undefined
  activeTooltip: string | null
  setActiveTooltip: (v: string | null) => void
  onClose: () => void
}

export function ProductDetailSheet({
  p,
  prefs,
  activeTooltip,
  setActiveTooltip,
  onClose,
}: ProductDetailSheetProps) {
  useScrollLock(true)

  const headingId = `product-sheet-name-${p.id}`

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="coll-sheet-overlay">
      <button
        type="button"
        className="coll-sheet-backdrop"
        onClick={onClose}
        aria-label="Fermer le panneau"
      />
      <div
        className="coll-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
      >
        <div className="coll-sheet-handle" aria-hidden="true" />
        <div className="coll-sheet-header">
          <div className="coll-product-sheet-title">
            <h2 id={headingId} className="coll-product-sheet-name">
              {p.product.name}
            </h2>
            <span className="coll-product-sheet-brand">{p.product.brand}</span>
          </div>
          <button
            type="button"
            className="coll-sheet-close"
            onClick={onClose}
            aria-label="Fermer le détail"
            // biome-ignore lint/a11y/noAutofocus: intentional focus on open
            autoFocus
          >
            <X size={18} />
          </button>
        </div>
        <div className="coll-sheet-body coll-product-sheet">
          <ProductCardDetailed
            p={p}
            prefs={prefs}
            isExpanded={true}
            onToggleExpand={onClose}
            activeTooltip={activeTooltip}
            setActiveTooltip={setActiveTooltip}
            showHeader={false}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * ShelfProductCardUI — Rendu visuel pur d'une carte produit sur l'étagère.
 *
 * Ce composant est un pur affichage sans hooks dnd-kit.
 * Il est utilisé à la fois par ShelfProductCard (qui ajoute le draggable)
 * et par le DragOverlay (qui a besoin du rendu sans le hook useDraggable).
 */

import type { UserProduct } from '../../../../../lib/queries/user-products'
import { sentimentEmojis } from '../../../constants'

interface ShelfProductCardUIProps {
  product: UserProduct
  className?: string
  onClick?: () => void
}

export function ShelfProductCardUI({ product, className = '', onClick }: ShelfProductCardUIProps) {
  return (
    <div className={`shelf-card ${className}`} onClick={onClick}>
      <div className="shelf-card-name">{product.product.name}</div>
      <div className="shelf-card-brand">{product.product.brand}</div>
      {product.sentiment != null && (
        <span className="shelf-card-sentiment">{sentimentEmojis[product.sentiment]}</span>
      )}
    </div>
  )
}

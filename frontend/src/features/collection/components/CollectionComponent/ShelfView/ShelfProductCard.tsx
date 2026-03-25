/**
 * ShelfProductCard — Carte produit draggable sur l'étagère.
 *
 * Wrapper autour de ShelfProductCardUI qui ajoute le comportement
 * dnd-kit (useDraggable). Le rendu visuel est délégué au composant UI pur.
 */

import { useDraggable } from '@dnd-kit/core'

import type { UserProduct } from '../../../../../lib/queries/user-products'
import { ShelfProductCardUI } from './ShelfProductCardUI'

interface ShelfProductCardProps {
  product: UserProduct
  onClick: () => void
}

export function ShelfProductCard({ product, onClick }: ShelfProductCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: product.id,
    data: { product },
  })

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <ShelfProductCardUI
        product={product}
        className={isDragging ? 'dragging' : ''}
        onClick={onClick}
      />
    </div>
  )
}

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
  isJustDropped?: boolean
  score: string | null
}

export function ShelfProductCard({
  product,
  onClick,
  isJustDropped,
  score,
}: ShelfProductCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: product.id,
    data: { product },
  })

  const classes = [isDragging ? 'dragging' : '', isJustDropped ? 'shelf-card-just-dropped' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <ShelfProductCardUI product={product} score={score} className={classes} onClick={onClick} />
    </div>
  )
}

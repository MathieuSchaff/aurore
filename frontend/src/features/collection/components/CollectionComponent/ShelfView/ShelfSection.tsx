/**
 * ShelfSection — Une étagère (zone de dépôt) pour un statut donné.
 *
 * Chaque section est une Droppable de dnd-kit.
 * Elle contient un header pliable et une grille de produits.
 */

import type { UserProductStatus } from '@habit-tracker/shared'

import { useDroppable } from '@dnd-kit/core'

import type { UserProduct } from '../../../../../lib/queries/user-products'
import { ShelfGrid } from './ShelfGrid'
import { ShelfHeader } from './ShelfHeader'
import { ShelfProductCard } from './ShelfProductCard'

interface ShelfSectionProps {
  status: UserProductStatus
  products: UserProduct[]
  isCollapsed: boolean
  onToggleCollapse: () => void
  onProductClick: (productId: string) => void
  expandedCardId?: string | null
  renderExpandedCard?: (product: UserProduct) => React.ReactNode
}

export function ShelfSection({
  status,
  products,
  isCollapsed,
  onToggleCollapse,
  onProductClick,
  expandedCardId,
  renderExpandedCard,
}: ShelfSectionProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `shelf-${status}`,
    data: { status },
  })

  return (
    <div ref={setNodeRef} className="shelf-section">
      <ShelfHeader
        status={status}
        count={products.length}
        isCollapsed={isCollapsed}
        onToggle={onToggleCollapse}
        isOver={isOver}
      />
      {!isCollapsed && (
        <ShelfGrid>
          {products.map((product) => (
            <div key={product.id}>
              <ShelfProductCard product={product} onClick={() => onProductClick(product.id)} />
              {/* Rendu de la carte expanded directement sous le produit concerné */}
              {expandedCardId === product.id && renderExpandedCard?.(product)}
            </div>
          ))}
        </ShelfGrid>
      )}
    </div>
  )
}

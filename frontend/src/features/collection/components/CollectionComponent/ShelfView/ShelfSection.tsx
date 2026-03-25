/**
 * ShelfSection — Une étagère (zone de dépôt) pour un statut donné.
 *
 * Chaque section est une Droppable de dnd-kit.
 * Elle contient un header pliable et une grille de produits.
 */

import type { DisplayScale, UserProductStatus } from '@habit-tracker/shared'

import { useDroppable } from '@dnd-kit/core'

import type { CriteriaWeights } from '../../../../../lib/helpers/reviews'
import { calculateWeightedScore } from '../../../../../lib/helpers/reviews'
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
  lastDroppedId?: string | null
  criteriaWeights?: CriteriaWeights
  displayScale?: DisplayScale
}

export function ShelfSection({
  status,
  products,
  isCollapsed,
  onToggleCollapse,
  onProductClick,
  expandedCardId,
  renderExpandedCard,
  lastDroppedId,
  criteriaWeights,
  displayScale,
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
        <div className="shelf-plank-wrapper">
          <ShelfGrid>
            {products.map((product) => {
              const score = calculateWeightedScore(
                product.review,
                criteriaWeights,
                displayScale ?? 'out_of_20'
              )
              return (
                <div key={product.id}>
                  <ShelfProductCard
                    product={product}
                    score={score}
                    onClick={() => onProductClick(product.id)}
                    isJustDropped={lastDroppedId === product.id}
                  />
                  {expandedCardId === product.id && renderExpandedCard?.(product)}
                </div>
              )
            })}
          </ShelfGrid>
          <div className="shelf-plank" />
          <div className="shelf-plank-depth" />
        </div>
      )}
    </div>
  )
}

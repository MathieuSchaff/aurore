import type { DisplayScale, UserProductStatus } from '@habit-tracker/shared'

import { useDroppable } from '@dnd-kit/core'

import type { CriteriaWeights } from '@/lib/helpers/reviews'
import { calculateWeightedScore } from '@/lib/helpers/reviews'
import type { UserProduct } from '@/lib/queries/user-products'
import { ShelfGrid } from './ShelfGrid'
import { ShelfHeader } from './ShelfHeader'
import { ShelfProductCard } from './ShelfProductCard'

interface ShelfSectionProps {
  status: UserProductStatus
  products: UserProduct[]
  isCollapsed: boolean
  onToggleCollapse: () => void
  onProductClick: (productId: string) => void
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
        <ShelfGrid>
          {products.map((product) => {
            const score = calculateWeightedScore(
              product.review,
              criteriaWeights,
              displayScale ?? 'out_of_20'
            )
            return (
              <ShelfProductCard
                key={product.id}
                product={product}
                score={score}
                displayScale={displayScale}
                onClick={() => onProductClick(product.id)}
                isJustDropped={lastDroppedId === product.id}
              />
            )
          })}
        </ShelfGrid>
      )}
    </div>
  )
}

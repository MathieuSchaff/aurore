import type { DisplayScale } from '@habit-tracker/shared'

import { useDraggable } from '@dnd-kit/core'

import type { UserProduct } from '@/lib/queries/user-products'
import { useUpdateUserProduct } from '@/lib/queries/user-products'
import { ProductCardCondensed } from '../ProductCard/Condensed/ProductCardCondensed'

interface ShelfProductCardProps {
  product: UserProduct
  onClick: () => void
  isJustDropped?: boolean
  score: string | null
  displayScale?: DisplayScale
}

const SENTIMENT_CYCLE = [null, 1, 2, 3, 4, 5] as const
type SentimentValue = (typeof SENTIMENT_CYCLE)[number]

export function ShelfProductCard({
  product,
  onClick,
  isJustDropped,
  score,
  displayScale,
}: ShelfProductCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: product.id,
    data: { product },
  })
  const updateMutation = useUpdateUserProduct()

  function handleSentimentChange() {
    const current = product.sentiment as SentimentValue
    const idx = SENTIMENT_CYCLE.indexOf(current)
    const next = SENTIMENT_CYCLE[(idx === -1 ? 1 : idx + 1) % SENTIMENT_CYCLE.length]
    updateMutation.mutate({ id: product.id, input: { sentiment: next } })
  }

  const classes = [isDragging ? 'dragging' : '', isJustDropped ? 'prod-card-just-dropped' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <ProductCardCondensed
        product={product}
        score={score}
        displayScale={displayScale}
        className={classes}
        onClick={onClick}
        onSentimentChange={handleSentimentChange}
      />
    </div>
  )
}

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import type { UserProduct } from '@/lib/queries/user-products'
import { useUpdateUserProduct } from '@/lib/queries/user-products'
import { sentimentEmojis } from '@/utils/sentimentMap'

import './ShelfView.css'

interface ShelfProductCardProps {
  p: UserProduct
  onToggleExpand: () => void
}

export function ShelfProductCard({ p, onToggleExpand }: ShelfProductCardProps) {
  const updateMutation = useUpdateUserProduct()

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: p.id,
    data: { id: p.id, status: p.status },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  const handleNextSentiment = (e: React.MouseEvent) => {
    e.stopPropagation()
    // When you click the emoji, it changes to the next one in the list (1 -> 2 -> 3... -> null)
    const current = p.sentiment || 0
    const next = current >= 5 ? null : current + 1
    updateMutation.mutate({ id: p.id, input: { sentiment: next } })
  }

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      className="shelf-product-card"
      {...attributes}
      {...listeners}
      onClick={onToggleExpand}
    >
      <div className="shelf-product-name">{p.product.name}</div>
      <button type="button" className="shelf-sentiment-btn" onClick={handleNextSentiment}>
        {p.sentiment ? sentimentEmojis[p.sentiment as 1 | 2 | 3 | 4 | 5] : '—'}
      </button>
    </button>
  )
}

import type { DisplayScale } from '@habit-tracker/shared'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'
import { useState } from 'react'

import { ProductIcon } from '@/assets/product-icons'
import { statusLabels } from '@/features/collection/constants'
import { type CriteriaWeights, calculateWeightedScore } from '@/lib/helpers/reviews'
import type { UserProduct } from '@/lib/queries/user-products'
import { useUpdateUserProduct } from '@/lib/queries/user-products'
import { sentimentEmojis } from '@/utils/sentimentMap'

import './ProductCardCondensed.css'

interface ProductCardCondensedProps {
  p: UserProduct
  onToggleExpand: () => void
  criteriaWeights: CriteriaWeights | undefined
  displayScale: DisplayScale | undefined
}

function getScoreChipClass(score: string | null): string {
  if (score == null) return 'score-none'
  const n = Number.parseFloat(score)
  if (n >= 17) return 'score-gold'
  if (n >= 14) return 'score-rare'
  if (n >= 10) return 'score-good'
  return 'score-none'
}

function getStatusClass(status: string): string {
  switch (status) {
    case 'wishlist':
      return 'status-wishlist'
    case 'holy_grail':
      return 'status-holy-grail'
    case 'archived':
      return 'status-archived'
    case 'avoided':
      return 'status-avoided'
    default:
      return ''
  }
}

export function ProductCardCondensed({
  p,
  onToggleExpand,
  criteriaWeights,
  displayScale,
}: ProductCardCondensedProps) {
  const updateMutation = useUpdateUserProduct()
  const [isPopping, setIsPopping] = useState(false)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: p.id,
    data: { id: p.id, status: p.status },
  })

  // Calculate score and price
  const score = calculateWeightedScore(p.review, criteriaWeights, displayScale || 'out_of_20')
  const priceEuros = p.product.priceCents ? `${(p.product.priceCents / 100).toFixed(0)}€` : null

  const scoreChipClass = getScoreChipClass(score)
  const statusClass = getStatusClass(p.status)

  const handleNextSentiment = (e: React.MouseEvent) => {
    e.stopPropagation()
    const current = p.sentiment || 0
    const next = current >= 5 ? null : current + 1
    updateMutation.mutate({ id: p.id, input: { sentiment: next } })

    // Animation
    setIsPopping(true)
    setTimeout(() => setIsPopping(false), 350)
  }

  const dndStyle = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={
        {
          ...dndStyle,
          '--card-accent': statusLabels[p.status].color,
        } as React.CSSProperties
      }
      className={clsx('prod-card', statusClass, isDragging && 'dragging')}
      onClick={onToggleExpand}
      {...attributes}
      {...listeners}
    >
      <div className="prod-icon-wrap">
        <div className="prod-icon-box">
          <ProductIcon unit={p.product.unit} kind={p.product.kind} size={20} />
        </div>
        <button
          type="button"
          className={clsx('prod-sentiment-badge', isPopping && 'popping', !p.sentiment && 'empty')}
          onClick={handleNextSentiment}
          aria-label="Changer le ressenti"
        >
          {p.sentiment ? sentimentEmojis[p.sentiment as 1 | 2 | 3 | 4 | 5] : '—'}
        </button>
      </div>

      <div className="prod-body">
        <div className="prod-brand">{p.product.brand}</div>
        <div className="prod-name">{p.product.name}</div>
        <div className="prod-chips">
          {p.product.kind && <span className="prod-chip">{p.product.kind}</span>}
          <span className={clsx('prod-chip-score', scoreChipClass)}>
            {score != null ? `${score}/20` : '—'}
          </span>
        </div>
      </div>

      {priceEuros && <div className="prod-price">{priceEuros}</div>}

      {(scoreChipClass === 'score-gold' || scoreChipClass === 'score-rare') && (
        <div className={clsx('prod-score-corner', scoreChipClass)} />
      )}
    </button>
  )
}

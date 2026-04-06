import { useDraggable } from '@dnd-kit/core'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { SmilePlus } from 'lucide-react'
import { useState } from 'react'

import { ProductIcon } from '@/assets/product-icons'
import { Card } from '@/component/Card/Card'
import { Badge } from '@/component/DataDisplay/Badge/Badge'
import { SCORE_THRESHOLDS, statusLabels } from '@/features/collection/constants'
import { calculateWeightedScore } from '@/lib/helpers/reviews'
import { userPreferenceQueries } from '@/lib/queries/user-preferences'
import type { UserProduct } from '@/lib/queries/user-products'
import { useUpdateUserProduct } from '@/lib/queries/user-products'
import { sentimentEmojis } from '@/utils/sentimentMap'

import './ProductCardCondensed.css'

interface ProductCardCondensedProps {
  p: UserProduct
  onToggleExpand: () => void
  // When true, the card is rendered inside a DragOverlay portal: no draggable
  // hook, no interactions — it's just a visual clone following the pointer.
  isOverlay?: boolean
}

function getScoreChipClass(score: string | null): string {
  if (score == null) return 'score-none'
  const n = Number.parseFloat(score)
  if (n >= SCORE_THRESHOLDS.gold) return 'score-gold'
  if (n >= SCORE_THRESHOLDS.rare) return 'score-rare'
  if (n >= SCORE_THRESHOLDS.good) return 'score-good'
  return 'score-none'
}

function getStatusClass(status: string): string {
  switch (status) {
    case 'holy_grail':
      return 'status-holy-grail'
    case 'archived':
      return 'status-archived'
    default:
      return ''
  }
}

export function ProductCardCondensed({
  p,
  onToggleExpand,
  isOverlay = false,
}: ProductCardCondensedProps) {
  const updateMutation = useUpdateUserProduct()
  const { data: prefs } = useQuery(userPreferenceQueries.get())
  const [isPopping, setIsPopping] = useState(false)

  // When rendered in a DragOverlay we use a different id + disabled to avoid
  // colliding with the real draggable that still lives in the grid.
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: isOverlay ? `overlay-${p.id}` : p.id,
    data: { id: p.id, status: p.status },
    disabled: isOverlay,
  })

  const score = calculateWeightedScore(
    p.review,
    prefs?.criteriaWeights,
    prefs?.displayScale || 'out_of_20'
  )
  const priceEuros = p.product.priceCents ? `${(p.product.priceCents / 100).toFixed(0)}€` : null

  const scoreChipClass = getScoreChipClass(score)
  const statusClass = getStatusClass(p.status)

  const handleNextSentiment = (e: React.MouseEvent) => {
    e.stopPropagation()
    const current = p.sentiment || 0
    const next = current >= 5 ? null : current + 1
    updateMutation.mutate({ id: p.id, input: { sentiment: next } })

    setIsPopping(true)
    setTimeout(() => setIsPopping(false), 350)
  }

  const dragProps = isOverlay ? {} : { ref: setNodeRef, ...attributes, ...listeners }

  return (
    <div className={clsx('prod-card-wrapper', isDragging && 'is-source-dragging')} {...dragProps}>
      <button
        type="button"
        className={clsx('prod-sentiment-badge', isPopping && 'popping', !p.sentiment && 'empty')}
        onClick={handleNextSentiment}
        aria-label={`Changer le ressenti pour ${p.product.name}`}
      >
        {p.sentiment ? (
          sentimentEmojis[p.sentiment as 1 | 2 | 3 | 4 | 5]
        ) : (
          <SmilePlus size={16} aria-hidden="true" />
        )}
      </button>
      <Card accent={statusLabels[p.status].color} className={clsx('prod-card', statusClass)}>
        <div className="prod-card-top">
          <div className="prod-icon-wrap">
            <div className="prod-icon-box">
              <ProductIcon unit={p.product.unit} kind={p.product.kind} size={20} />
            </div>
          </div>

          <button
            type="button"
            className="prod-body"
            onClick={onToggleExpand}
            aria-label={`Voir les détails de ${p.product.name} par ${p.product.brand}`}
          >
            <div className="prod-brand">{p.product.brand}</div>
            <div className="prod-name">{p.product.name}</div>
          </button>
        </div>

        <Card.Footer>
          <div className="prod-chips">
            {p.product.kind && <Badge variant="chip">{p.product.kind}</Badge>}
            {score != null && (
              <span className={clsx('prod-chip-score', scoreChipClass)}>{score}/20</span>
            )}
          </div>
          {priceEuros && <div className="prod-price">{priceEuros}</div>}
        </Card.Footer>

        {(scoreChipClass === 'score-gold' || scoreChipClass === 'score-rare') && (
          <div className={clsx('prod-score-corner', scoreChipClass)} />
        )}
      </Card>
    </div>
  )
}

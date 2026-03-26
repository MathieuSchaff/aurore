import { useState } from 'react'
import type { DisplayScale } from '@habit-tracker/shared'

import { ProductIcon } from '@/assets/product-icons'
import type { UserProduct } from '@/lib/queries/user-products'
import { DEFAULT_KIND_COLOR_TOKEN, kindColorTokens, sentimentEmojis } from '@/features/collection/constants'

import './ProductCardCondensed.css'

interface ProductCardCondensedProps {
  product: UserProduct
  score: string | null
  displayScale?: DisplayScale
  className?: string
  onClick?: () => void
  onSentimentChange?: () => void
}

function getScoreChipClass(score: string | null, displayScale?: DisplayScale): string {
  if (score == null) return 'score-none'
  const n = parseFloat(score)
  let normalized: number
  switch (displayScale) {
    case 'out_of_5': normalized = n * 4; break
    case 'out_of_10': normalized = n * 2; break
    case 'percentage': normalized = n / 5; break
    default: normalized = n
  }
  if (normalized >= 17) return 'score-gold'
  if (normalized >= 14) return 'score-rare'
  if (normalized >= 10) return 'score-good'
  return 'score-none'
}

function getStatusClass(status: string): string {
  switch (status) {
    case 'wishlist': return 'status-wishlist'
    case 'holy_grail': return 'status-holy-grail'
    case 'archived': return 'status-archived'
    case 'avoided': return 'status-avoided'
    default: return ''
  }
}

export function ProductCardCondensed({
  product,
  score,
  displayScale,
  className = '',
  onClick,
  onSentimentChange,
}: ProductCardCondensedProps) {
  const [isPopping, setIsPopping] = useState(false)

  const p = product.product
  const kindColor = kindColorTokens[p.kind] ?? DEFAULT_KIND_COLOR_TOKEN
  const sentiment = product.sentiment ? sentimentEmojis[product.sentiment] : null
  const priceEuros = p.priceCents != null ? `${(p.priceCents / 100).toFixed(0)}€` : null
  const scoreChipClass = getScoreChipClass(score, displayScale)
  const scoreLabel = score == null
    ? '—'
    : displayScale === 'percentage'
      ? score
      : `${score}${displayScale === 'out_of_5' ? '/5' : displayScale === 'out_of_10' ? '/10' : '/20'}`
  const statusClass = getStatusClass(product.status)

  function handleSentimentClick(e: React.MouseEvent) {
    e.stopPropagation()
    setIsPopping(true)
    setTimeout(() => setIsPopping(false), 350)
    onSentimentChange?.()
  }

  const badgeClass = [
    'prod-sentiment-badge',
    !sentiment ? 'empty' : '',
    isPopping ? 'popping' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={`prod-card ${statusClass} ${className}`}
      onClick={onClick}
      style={{ '--card-accent': kindColor } as React.CSSProperties}
    >
      {(scoreChipClass === 'score-gold' || scoreChipClass === 'score-rare') && (
        <div className={`prod-score-corner ${scoreChipClass}`} />
      )}

      <div className="prod-icon-wrap">
        <div className="prod-icon-box">
          <ProductIcon unit={p.unit} kind={p.kind} size={20} />
        </div>
        {onSentimentChange && (
          <button
            type="button"
            className={badgeClass}
            onClick={handleSentimentClick}
            aria-label="Changer le sentiment"
          >
            {sentiment ?? '○'}
          </button>
        )}
      </div>

      <div className="prod-body">
        <div className="prod-brand">{p.brand}</div>
        <div className="prod-name">{p.name}</div>
        <div className="prod-chips">
          {p.kind && <span className="prod-chip">{p.kind}</span>}
          <span className={`prod-chip-score ${scoreChipClass}`}>
            {scoreLabel}
          </span>
        </div>
      </div>

      {priceEuros && <div className="prod-price">{priceEuros}</div>}
    </div>
  )
}

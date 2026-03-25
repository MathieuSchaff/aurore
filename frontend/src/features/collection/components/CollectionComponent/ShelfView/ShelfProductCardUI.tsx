import { ProductIcon } from '../../../../../assets/product-icons'
import type { UserProduct } from '../../../../../lib/queries/user-products'
import { DEFAULT_KIND_COLOR_TOKEN, kindColorTokens, sentimentEmojis } from '../../../constants'

interface ShelfProductCardUIProps {
  product: UserProduct
  score: string | null
  className?: string
  onClick?: () => void
}

function getScoreChipClass(score: string | null): string {
  if (score == null) return 'score-none'
  const n = parseFloat(score)
  if (n >= 17) return 'score-gold'
  if (n >= 14) return 'score-rare'
  if (n >= 10) return 'score-good'
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

export function ShelfProductCardUI({
  product,
  score,
  className = '',
  onClick,
}: ShelfProductCardUIProps) {
  const p = product.product
  const kindColor = kindColorTokens[p.kind] ?? DEFAULT_KIND_COLOR_TOKEN
  const sentiment = product.sentiment ? sentimentEmojis[product.sentiment] : null
  const priceEuros = p.priceCents != null ? `${(p.priceCents / 100).toFixed(0)}€` : null
  const scoreChipClass = getScoreChipClass(score)
  const statusClass = getStatusClass(product.status)

  return (
    <div
      className={`prod-card ${statusClass} ${className}`}
      onClick={onClick}
      style={{ '--card-accent': kindColor } as React.CSSProperties}
    >
      <div className="prod-icon-box">
        <ProductIcon unit={p.unit} kind={p.kind} size={20} />
      </div>

      <div className="prod-body">
        <div className="prod-brand">{p.brand}</div>
        <div className="prod-name">{p.name}</div>
        <div className="prod-chips">
          {p.kind && <span className="prod-chip">{p.kind}</span>}
          <span className={`prod-chip-score ${scoreChipClass}`}>
            {score != null ? `${score}/20` : '—'}
          </span>
          {sentiment && <span className="prod-chip-sentiment">{sentiment}</span>}
        </div>
      </div>

      {priceEuros && <div className="prod-price">{priceEuros}</div>}
    </div>
  )
}

import { ProductIcon } from '../../../../../assets/product-icons'
import type { UserProduct } from '../../../../../lib/queries/user-products'
import { DEFAULT_KIND_COLOR_TOKEN, kindColorTokens, sentimentEmojis } from '../../../constants'

interface ShelfProductCardUIProps {
  product: UserProduct
  score: string | null
  className?: string
  onClick?: () => void
}

/** Score numérique → classe de rareté RPG */
function getRarityClass(score: string | null): string {
  if (score == null) return ''
  const n = parseFloat(score)
  if (n >= 17) return 'rarity-legendary'
  if (n >= 14) return 'rarity-rare'
  if (n >= 10) return 'rarity-uncommon'
  return ''
}

/** Statut → classe d'animation ambiante */
function getStatusAnimClass(status: string): string {
  switch (status) {
    case 'in_stock':
      return 'ambient-active'
    case 'wishlist':
      return 'ambient-wishlist'
    case 'holy_grail':
      return 'ambient-holy-grail'
    case 'archived':
      return 'ambient-archived'
    case 'avoided':
      return 'ambient-avoided'
    default:
      return ''
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

  const rarityClass = getRarityClass(score)
  const statusAnimClass = getStatusAnimClass(product.status)

  return (
    <div
      className={`shelf-card ${statusAnimClass} ${rarityClass} ${className}`}
      onClick={onClick}
      style={{ '--card-kind-color': kindColor } as React.CSSProperties}
    >
      {sentiment && <span className="shelf-card-sentiment">{sentiment}</span>}

      <div className="shelf-card-icon-container">
        <ProductIcon unit={p.unit} kind={p.kind} size={64} />
      </div>

      <div className="shelf-card-text">
        <span className="shelf-card-brand">{p.brand}</span>
        <span className="shelf-card-name">{p.name}</span>
      </div>

      <div className="shelf-card-meta">
        {score != null && rarityClass && <span className={`shelf-card-rarity-dot ${rarityClass}`} />}
        <span className="shelf-card-score">{score != null ? `${score}/20` : '—'}</span>
        {priceEuros && <span className="shelf-card-price">{priceEuros}</span>}
      </div>
    </div>
  )
}

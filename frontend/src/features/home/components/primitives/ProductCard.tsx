import './ProductCard.css'

export type ProductStatus =
  | 'considering'
  | 'wishlist'
  | 'owned'
  | 'rejected'
  | 'in-stock'
  | 'testing'
  | 'finished'
  | 'repurchase'
  | 'holy'
  | 'avoid'
  | 'archived'
  | 'wish'

export type ProductStat = { label: string; value: string }

export type ProductCardProps = {
  brand: string
  name: string
  type?: string
  status?: ProductStatus
  statusLabel?: string
  /** Raw INCI string. Tokens in `highlight` are wrapped in <mark>. */
  inci?: string
  /** Substrings to highlight inside the INCI text (case-insensitive). */
  highlight?: string[]
  stats?: ProductStat[]
  /** Enables hover lift (use for clickable cards inside lists). */
  hover?: boolean
  className?: string
}

/**
 * Single product fiche — brand, name, INCI excerpt, personal stats.
 * Designed to read like a small index-card from a personal library.
 */
export function ProductCard({
  brand,
  name,
  type,
  status,
  statusLabel,
  inci,
  highlight = [],
  stats,
  hover = false,
  className,
}: ProductCardProps) {
  const renderInci = () => {
    if (!inci) return null
    if (!highlight.length) return inci
    const parts: React.ReactNode[] = []
    let rest = inci
    let i = 0
    while (rest.length && i < 50) {
      const next = highlight
        .map((h) => ({ h, idx: rest.toLowerCase().indexOf(h.toLowerCase()) }))
        .filter((x) => x.idx >= 0)
        .sort((a, b) => a.idx - b.idx)[0]
      if (!next) {
        parts.push(rest)
        break
      }
      if (next.idx > 0) parts.push(rest.slice(0, next.idx))
      parts.push(<mark key={i}>{rest.slice(next.idx, next.idx + next.h.length)}</mark>)
      rest = rest.slice(next.idx + next.h.length)
      i++
    }
    return parts
  }

  const cls = ['aur-product', hover && 'aur-product--hover', className].filter(Boolean).join(' ')

  return (
    <article className={cls}>
      <header className="aur-product__head">
        <div>
          <div className="aur-product__brand">{brand}</div>
          <div className="aur-product__name">{name}</div>
          {type ? <div className="aur-product__type">{type}</div> : null}
        </div>
        {status && statusLabel ? (
          <span className={`aur-product__status aur-product__status--${status}`}>
            {statusLabel}
          </span>
        ) : null}
      </header>

      {inci ? (
        <div className="aur-product__inci">
          <div className="aur-product__inci-label">Composition INCI</div>
          <div className="aur-product__inci-text">{renderInci()}</div>
        </div>
      ) : null}

      {stats?.length ? (
        <div className="aur-product__stats">
          {stats.map((s) => (
            <div className="aur-product__stat" key={s.label}>
              <div className="aur-product__stat-label">{s.label}</div>
              <div className="aur-product__stat-value">{s.value}</div>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  )
}

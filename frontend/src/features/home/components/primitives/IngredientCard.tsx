import { Tag } from './Tag'
import './IngredientCard.css'

export type IngredientRole = {
  label: string
  variant?: 'active' | 'safe' | 'warn' | 'outline'
}

export type IngredientRow = { key: string; value: string }

export type IngredientCardProps = {
  name: string
  inci: string
  rating?: string
  ratingLabel?: string
  roles?: IngredientRole[]
  description?: string
  rows?: IngredientRow[]
  className?: string
}

/**
 * Fiche ingrédient — pour Hero C, sections Wiki et previews.
 * Pas une recommandation médicale ; juste une lecture de la formule.
 */
export function IngredientCard({
  name,
  inci,
  rating,
  ratingLabel = 'note',
  roles = [],
  description,
  rows = [],
  className,
}: IngredientCardProps) {
  return (
    <article className={['aur-ing', className].filter(Boolean).join(' ')}>
      <header className="aur-ing__head">
        <div>
          <div className="aur-ing__name">{name}</div>
          <div className="aur-ing__inci">{inci}</div>
        </div>
        {rating ? (
          <div className="aur-ing__rating" role="img" aria-label={`Note ${rating}`}>
            <div className="aur-ing__rating-num">{rating}</div>
            <div className="aur-ing__rating-label">{ratingLabel}</div>
          </div>
        ) : null}
      </header>

      {roles.length ? (
        <div className="aur-ing__role">
          {roles.map((r, i) => (
            <Tag key={`${r.label}-${i}`} variant={r.variant}>
              {r.label}
            </Tag>
          ))}
        </div>
      ) : null}

      {description ? <p className="aur-ing__desc">{description}</p> : null}

      {rows.length > 0 ? (
        <>
          <div className="aur-ing__divider" />
          {rows.map((r, i) => (
            <div className="aur-ing__row" key={`${r.key}-${i}`}>
              <span className="aur-ing__row-key">{r.key}</span>
              <span className="aur-ing__row-val">{r.value}</span>
            </div>
          ))}
        </>
      ) : null}
    </article>
  )
}

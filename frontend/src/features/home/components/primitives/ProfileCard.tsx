import './ProfileCard.css'

export type ProfileRow = { key: string; val: string }

export type ProfileCardProps = {
  initials: string
  name: string
  meta?: string
  rows?: ProfileRow[]
  className?: string
}

/**
 * Carte profil peau — affiche un résumé du profil utilisateur
 * (type, sensibilité, ingrédients recherchés / évités).
 */
export function ProfileCard({ initials, name, meta, rows = [], className }: ProfileCardProps) {
  return (
    <article className={['aur-profile', className].filter(Boolean).join(' ')}>
      <header className="aur-profile__head">
        <div className="aur-profile__avatar" aria-hidden="true">
          {initials}
        </div>
        <div>
          <div className="aur-profile__name">{name}</div>
          {meta ? <div className="aur-profile__meta">{meta}</div> : null}
        </div>
      </header>
      {rows.map((r, i) => (
        <div key={`${r.key}-${i}`} className="aur-profile__row">
          <span className="aur-profile__key">{r.key}</span>
          <span className="aur-profile__val">{r.val}</span>
        </div>
      ))}
    </article>
  )
}

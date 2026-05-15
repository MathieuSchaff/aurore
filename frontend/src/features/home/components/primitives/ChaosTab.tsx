import './ChaosTab.css'

type Props = {
  title: string
  /** Strike-through effect — represents an abandoned/closed tab. */
  strike?: boolean
  /** Sticky-note style (italic, rotated, warm bg). */
  note?: boolean
  style?: React.CSSProperties
}

/** Decorative chaos tab — used in Hero variant B (anti-chaos). */
export function ChaosTab({ title, strike, note, style }: Props) {
  const cls = ['aur-chaos-tab', strike && 'aur-chaos-tab--strike', note && 'aur-chaos-tab--note']
    .filter(Boolean)
    .join(' ')
  return (
    <div className={cls} style={style}>
      <span className="aur-chaos-tab__favicon" aria-hidden="true" />
      <span className="aur-chaos-tab__title">{title}</span>
      {!note ? (
        <span className="aur-chaos-tab__close" aria-hidden="true">
          ×
        </span>
      ) : null}
    </div>
  )
}

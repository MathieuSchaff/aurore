import './ChaosTab.css'

type Props = {
  title: string
  strike?: boolean
  note?: boolean
  style?: React.CSSProperties
}

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

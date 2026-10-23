import './ComparisonHero.css'

type Props = {
  count: number
  name?: string | null
}

export function ComparisonHero({ count, name }: Props) {
  return (
    <header className="cmp-hero">
      <h1 className="cmp-hero__title">{name || `Comparer ${count} produits`}</h1>
      <p className="cmp-hero__sub">
        Prix, ingrédients et expérience personnelle pour éclairer votre choix.
      </p>
    </header>
  )
}

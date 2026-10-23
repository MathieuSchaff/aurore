import './EmptyComparisonState.css'

type Props = { count: number }

export function EmptyComparisonState({ count }: Props) {
  return (
    <div className="empty-comparison">
      <div className="empty-comparison__steps" aria-hidden>
        <div
          className={`empty-comparison__step${count >= 1 ? ' empty-comparison__step--done' : ' empty-comparison__step--active'}`}
        >
          1
        </div>
        <div
          className={`empty-comparison__step-line${count >= 1 ? ' empty-comparison__step-line--done' : ''}`}
        />
        <div
          className={`empty-comparison__step${count >= 2 ? ' empty-comparison__step--done' : count === 1 ? ' empty-comparison__step--active' : ''}`}
        >
          2
        </div>
        <div className="empty-comparison__step-line" />
        <div className="empty-comparison__step">…</div>
      </div>

      <p className="empty-comparison__title">
        {count === 0 ? 'Sélectionnez au moins 2 produits' : "Plus qu'un produit à ajouter"}
      </p>
      <p className="ui-empty-description">
        {count === 0
          ? 'Recherchez un produit ci-dessus pour commencer.'
          : 'Ajoutez au moins un produit supplémentaire pour comparer.'}
      </p>
      <p className="empty-comparison__foot">de 2 à 8 produits · aucun classement, aucune note</p>
    </div>
  )
}

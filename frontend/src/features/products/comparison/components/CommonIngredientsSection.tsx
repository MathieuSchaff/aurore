import type { EnrichedComparisonProduct } from '@aurore/shared'

import { Link } from '@tanstack/react-router'
import { useId } from 'react'

import { ShowMoreButton } from '@/component/DataDisplay/ShowMoreButton/ShowMoreButton'
import { useExpandableList } from '@/hooks/useExpandableList'
import { computeCommon, computePartiallyShared } from '../helpers/aggregations'
import './IngredientsSection.css'

type Props = { products: EnrichedComparisonProduct[] }

export function CommonIngredientsSection({ products }: Props) {
  const common = computeCommon(products)
  const partial = computePartiallyShared(products).toSorted((a, b) =>
    a.ingredient.inciName.localeCompare(b.ingredient.inciName, 'fr')
  )

  const actives = common.filter((i) => i.signals.includes('active'))
  const others = common.filter((i) => !i.signals.includes('active'))

  const sortedActives = actives.toSorted((a, b) => a.inciName.localeCompare(b.inciName, 'fr'))
  const sortedOthers = others.toSorted((a, b) => a.inciName.localeCompare(b.inciName, 'fr'))

  const productsKey = products.map((p) => p.id).join(',')
  const listId = useId()
  const {
    visible: visibleActives,
    hiddenCount: hiddenActivesCount,
    isExpanded: activesExpanded,
    toggle: toggleActivesExpanded,
  } = useExpandableList(sortedActives, undefined, productsKey)
  const {
    visible: visibleOthers,
    hiddenCount: hiddenOthersCount,
    isExpanded: othersExpanded,
    toggle: toggleOthersExpanded,
  } = useExpandableList(sortedOthers, undefined, productsKey)

  const {
    visible: visiblePartial,
    hiddenCount: hiddenPartialCount,
    isExpanded: partialExpanded,
    toggle: togglePartialExpanded,
  } = useExpandableList(partial, undefined, productsKey)

  return (
    <section className="terroir" aria-labelledby={`${listId}-heading`}>
      <header className="terroir__head">
        <div>
          <h2 id={`${listId}-heading`} className="terroir__title ui-display-heading">
            Points communs
          </h2>
        </div>
        <span className="terroir__count">
          {common.length} ingrédient{common.length > 1 ? 's' : ''} en commun · ordre alphabétique
        </span>
      </header>

      {common.length === 0 ? (
        <p className="terroir__empty">
          Aucun ingrédient renseigné n’apparaît dans toutes les formules.
        </p>
      ) : (
        <>
          {sortedActives.length > 0 && (
            <div className="terroir__group">
              <p className="terroir__group-label">Actifs communs</p>
              <ul role="list" id={`${listId}-actives`} className="terroir__pills">
                {visibleActives.map((i) => (
                  <li key={i.slug} className="terroir-pill terroir-pill--active">
                    <Link
                      to="/ingredients/$slug"
                      params={{ slug: i.slug }}
                      className="cmp-ingredient-link"
                    >
                      {i.inciName}
                    </Link>
                  </li>
                ))}
              </ul>
              <ShowMoreButton
                className="terroir__more"
                hiddenCount={hiddenActivesCount}
                isExpanded={activesExpanded}
                onToggle={toggleActivesExpanded}
                controlsId={`${listId}-actives`}
              />
            </div>
          )}
          {sortedOthers.length > 0 && (
            <div className="terroir__group">
              <p className="terroir__group-label terroir__group-label--muted">Autres communs</p>
              <ul role="list" id={`${listId}-others`} className="terroir__pills">
                {visibleOthers.map((i) => (
                  <li key={i.slug} className="terroir-pill">
                    <Link
                      to="/ingredients/$slug"
                      params={{ slug: i.slug }}
                      className="cmp-ingredient-link"
                    >
                      {i.inciName}
                    </Link>
                  </li>
                ))}
              </ul>
              <ShowMoreButton
                className="terroir__more"
                hiddenCount={hiddenOthersCount}
                isExpanded={othersExpanded}
                onToggle={toggleOthersExpanded}
                controlsId={`${listId}-others`}
              />
            </div>
          )}
        </>
      )}
      {partial.length > 0 && (
        <section className="terroir__group" aria-label="Partagés par certains produits">
          <h3 className="terroir__group-label">Partagés par certains produits</h3>
          <ul role="list" id={`${listId}-partial`} className="terroir__pills">
            {visiblePartial.map(({ ingredient, products: presentIn }) => (
              <li key={ingredient.slug} className="terroir-pill">
                <Link
                  to="/ingredients/$slug"
                  params={{ slug: ingredient.slug }}
                  className="cmp-ingredient-link"
                >
                  {ingredient.inciName}
                </Link>
                <span> : {presentIn.map((p) => `${p.brand} ${p.name}`).join(', ')}</span>
              </li>
            ))}
          </ul>
          <ShowMoreButton
            className="terroir__more"
            hiddenCount={hiddenPartialCount}
            isExpanded={partialExpanded}
            onToggle={togglePartialExpanded}
            controlsId={`${listId}-partial`}
          />
        </section>
      )}
    </section>
  )
}

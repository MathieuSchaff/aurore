import type { EnrichedComparisonProduct } from '@aurore/shared'

import { Link } from '@tanstack/react-router'
import { List, Sparkle } from 'lucide-react'
import { type ReactNode, useId } from 'react'

import { ShowMoreButton } from '@/component/DataDisplay/ShowMoreButton/ShowMoreButton'
import { IconBox } from '@/component/Layout/IconBox/IconBox'
import { useExpandableList } from '@/hooks/useExpandableList'
import { computeActives, computeFormulaMarkers } from '../helpers/aggregations'
import './SignalsSection.css'

import { activeRole, FORMULA_MARKER_LABELS, SIGNALS_LABELS } from './SignalsSection.constants'

type Props = { products: EnrichedComparisonProduct[] }

type CardProps = {
  tone: 'actives' | 'facts'
  title: string
  hint: string
  icon: ReactNode
  children: ReactNode
}

function SignalCard({ tone, title, hint, icon, children }: CardProps) {
  const titleId = useId()
  return (
    <article className={`signals-card signals-card--${tone}`} aria-labelledby={titleId}>
      <header className="signals-card__head">
        <IconBox className="signals-card__seal">{icon}</IconBox>
        <div className="signals-card__title-block">
          <h3 id={titleId} className="signals-card__title">
            {title}
          </h3>
          <p className="signals-card__hint">{hint}</p>
        </div>
      </header>
      {children}
    </article>
  )
}

export function SignalsSection({ products }: Props) {
  const actives = computeActives(products)
  const markers = computeFormulaMarkers(products)
  const missingLists = products.filter((p) => p.inciTokens === null)
  const productNames = (ids: string[]) =>
    products
      .filter((p) => ids.includes(p.id))
      .map((p) => `${p.brand} ${p.name}`)
      .join(' ; ')
  const titleId = useId()
  const productsKey = products.map((p) => p.id).join(',')
  const activesListId = useId()
  const {
    visible: visibleActives,
    hiddenCount: hiddenActivesCount,
    isExpanded: activesExpanded,
    toggle: toggleActivesExpanded,
  } = useExpandableList(actives, undefined, productsKey)

  return (
    <section className="signals-section" aria-labelledby={titleId}>
      <p className="signals-section__eyebrow">Repères</p>
      <h2 id={titleId} className="signals-section__title">
        Signaux
      </h2>
      <p className="signals-section__scope">{SIGNALS_LABELS.scope}</p>
      {missingLists.length > 0 && (
        <p className="signals-section__scope">
          Liste d’ingrédients non renseignée : {productNames(missingLists.map((p) => p.id))}. Les
          repères de ces produits ne peuvent pas être évalués.
        </p>
      )}
      {actives.length === 0 && markers.length === 0 && (
        <p className="signals-section__none">{SIGNALS_LABELS.empty}</p>
      )}
      <div className="signals-section__groups">
        {actives.length > 0 && (
          <SignalCard
            tone="actives"
            title={SIGNALS_LABELS.actives}
            hint={SIGNALS_LABELS.activesHint}
            icon={<Sparkle size={16} aria-hidden="true" />}
          >
            <ul role="list" id={activesListId} className="signals-card__items">
              {visibleActives.map((i) => (
                <li key={i.key} className="signals-pill">
                  {i.ingredientSlug ? (
                    <Link
                      className="signals-pill__link"
                      to="/ingredients/$slug"
                      params={{ slug: i.ingredientSlug }}
                    >
                      {i.name}
                    </Link>
                  ) : (
                    <span>{i.name}</span>
                  )}
                  <span className="signals-pill__detail">{activeRole(i.functions)}</span>
                  <span className="signals-pill__detail">
                    Renseigné dans : {productNames(i.presentIn)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="signals-card__hint">
              {SIGNALS_LABELS.rolesSource}{' '}
              <a href="https://single-market-economy.ec.europa.eu/sectors/cosmetics/cosmetic-ingredient-database_en">
                CosIng
              </a>
              . {SIGNALS_LABELS.rolesScope}
            </p>
            <ShowMoreButton
              className="signals-card__more"
              hiddenCount={hiddenActivesCount}
              isExpanded={activesExpanded}
              onToggle={toggleActivesExpanded}
              controlsId={activesListId}
            />
          </SignalCard>
        )}
        {markers.length > 0 && (
          <SignalCard
            tone="facts"
            title={SIGNALS_LABELS.facts}
            hint={SIGNALS_LABELS.factsHint}
            icon={<List size={16} aria-hidden="true" />}
          >
            <ul role="list" className="signals-card__items">
              {markers.map(({ token, presentIn }) => (
                <li key={token.key} className="signals-pill">
                  {token.ingredientSlug ? (
                    <Link
                      className="signals-pill__link"
                      to="/ingredients/$slug"
                      params={{ slug: token.ingredientSlug }}
                    >
                      {token.label}
                    </Link>
                  ) : (
                    <span>{token.label}</span>
                  )}
                  <span className="signals-pill__detail">
                    {token.comparisonMarker && FORMULA_MARKER_LABELS[token.comparisonMarker]}
                  </span>
                  <span className="signals-pill__detail">
                    Renseigné dans : {productNames(presentIn)}
                  </span>
                </li>
              ))}
            </ul>
          </SignalCard>
        )}
      </div>
    </section>
  )
}

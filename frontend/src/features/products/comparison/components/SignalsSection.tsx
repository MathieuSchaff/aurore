import type { EnrichedComparisonProduct } from '@aurore/shared'

import { AlertTriangle, Layers, Sparkle } from 'lucide-react'
import { type ReactNode, useId } from 'react'

import { ShowMoreButton } from '@/component/DataDisplay/ShowMoreButton/ShowMoreButton'
import { IconBox } from '@/component/Layout/IconBox/IconBox'
import { useExpandableList } from '@/hooks/useExpandableList'
import { computeActives, computeAlerts, computeIngredientPairs } from '../helpers/aggregations'
import './SignalsSection.css'

import { SIGNALS_LABELS } from './SignalsSection.constants'

type Props = { products: EnrichedComparisonProduct[] }

type CardProps = {
  tone: 'actives' | 'alerts' | 'pairs'
  title: string
  hint: string
  count: number
  icon: ReactNode
  children: ReactNode
}

function SignalCard({ tone, title, hint, count, icon, children }: CardProps) {
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
        <span className="signals-card__count">{count}</span>
      </header>
      {children}
    </article>
  )
}

export function SignalsSection({ products }: Props) {
  const actives = computeActives(products)
  const alerts = computeAlerts(products)
  const pairs = computeIngredientPairs(products)
  const missingLists = products.filter((p) => p.ingredients.length === 0)
  const productNames = (ids: string[]) =>
    products
      .filter((p) => ids.includes(p.id))
      .map((p) => `${p.brand} : ${p.name}`)
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
      <p className="signals-section__scope">{SIGNALS_LABELS.usage}</p>
      {missingLists.length > 0 && (
        <p className="signals-section__scope">
          Liste d’ingrédients non renseignée : {productNames(missingLists.map((p) => p.id))}. Les
          repères de ces produits ne peuvent pas être évalués.
        </p>
      )}
      {actives.length === 0 && alerts.length === 0 && pairs.length === 0 && (
        <p className="signals-section__none">{SIGNALS_LABELS.empty}</p>
      )}
      <div className="signals-section__groups">
        {actives.length > 0 && (
          <SignalCard
            tone="actives"
            title={SIGNALS_LABELS.actives}
            hint="Ingrédients repérés comme actifs, communs ou non"
            count={actives.length}
            icon={<Sparkle size={16} aria-hidden="true" />}
          >
            <ul role="list" id={activesListId} className="signals-card__items">
              {visibleActives.map((i) => (
                <li key={i.slug} className="signals-pill">
                  <span>{i.inciName}</span>
                  <span className="signals-pill__detail">
                    Renseigné dans : {productNames(i.presentIn)}
                  </span>
                </li>
              ))}
            </ul>
            <ShowMoreButton
              className="signals-card__more"
              hiddenCount={hiddenActivesCount}
              isExpanded={activesExpanded}
              onToggle={toggleActivesExpanded}
              controlsId={activesListId}
            />
          </SignalCard>
        )}
        {alerts.length > 0 && (
          <SignalCard
            tone="alerts"
            title={SIGNALS_LABELS.alerts}
            hint="Ingrédients repérés comme allergènes ou sensibilisants potentiels"
            count={alerts.length}
            icon={<AlertTriangle size={16} aria-hidden="true" />}
          >
            <ul role="list" className="signals-card__items">
              {alerts.map((a) => (
                <li key={a.slug} className="signals-pill">
                  <span>{a.inciName}</span>
                  <span className="signals-pill__detail">
                    Renseigné dans : {productNames(a.presentIn)}
                  </span>
                </li>
              ))}
            </ul>
          </SignalCard>
        )}
        {pairs.length > 0 && (
          <SignalCard
            tone="pairs"
            title={SIGNALS_LABELS.pairs}
            hint="Localisation des ingrédients, sans conclusion sur leur association"
            count={pairs.length}
            icon={<Layers size={16} aria-hidden="true" />}
          >
            <ul role="list" className="ui-stack-list">
              {pairs.map((pair) => (
                <li key={`${pair.a.slug}-${pair.b.slug}`} className="signals-pair">
                  <p className="ui-title-sm">
                    {pair.a.inciName} + {pair.b.inciName}
                  </p>
                  <p className="signals-pair__note">
                    {pair.a.inciName} : {productNames(pair.aPresentIn)}
                  </p>
                  <p className="signals-pair__note">
                    {pair.b.inciName} : {productNames(pair.bPresentIn)}
                  </p>
                  {pair.sameFormula.length > 0 && (
                    <p className="signals-pair__note">
                      Dans une même formule : {productNames(pair.sameFormula)}.
                    </p>
                  )}
                  {pair.betweenProducts.length > 0 && (
                    <p className="signals-pair__note">
                      Répartis entre produits :{' '}
                      {pair.betweenProducts.map((ids) => productNames(ids)).join(' / ')}.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </SignalCard>
        )}
      </div>
    </section>
  )
}

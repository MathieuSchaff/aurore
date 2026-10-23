import type { EnrichedComparisonProduct } from '@aurore/shared'

import { Link } from '@tanstack/react-router'
import { useId, useState } from 'react'

import { ShowMoreButton } from '@/component/DataDisplay/ShowMoreButton/ShowMoreButton'
import { computeSpecifics } from '../helpers/aggregations'
import './DiffSection.css'

import { productTone } from './productTones'

type Props = { products: EnrichedComparisonProduct[] }

const VISIBLE_DEFAULT = 3

export function DiffSection({ products }: Props) {
  const specifics = computeSpecifics(products)
  const baseId = useId()
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    const next = new Set(expanded)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpanded(next)
  }

  return (
    <section className="diff-section" aria-labelledby={`${baseId}-heading`}>
      <header className="diff-section__header">
        <h2 id={`${baseId}-heading`} className="ui-display-heading">
          Différences
        </h2>
        <p className="diff-section__lede">
          Ingrédients renseignés uniquement dans ce produit parmi la sélection, par ordre
          alphabétique. Ouvrez leur fiche pour en savoir plus. Ces listes peuvent être incomplètes.
        </p>
      </header>

      <div className="diff-section__grid">
        {products.map((p, i) => {
          const list = (specifics.get(p.id) ?? []).toSorted((a, b) =>
            a.inciName.localeCompare(b.inciName, 'fr')
          )
          const isExpanded = expanded.has(p.id)
          const visible = isExpanded ? list : list.slice(0, VISIBLE_DEFAULT)
          const hidden = list.length - VISIBLE_DEFAULT
          const colId = `${baseId}-${p.id}`

          return (
            <article
              key={p.id}
              className="diff-section__col"
              style={productTone(i)}
              aria-labelledby={`${colId}-title`}
            >
              <header className="diff-section__col-header">
                <span className="diff-section__col-num">N° {String(i + 1).padStart(2, '0')}</span>
                <span className="diff-section__col-count">{list.length} en propre</span>
                <h3 id={`${colId}-title`} className="diff-section__col-title">
                  <span className="diff-section__col-brand">{p.brand}</span> <span>{p.name}</span>
                </h3>
              </header>

              {list.length === 0 ? (
                <p className="diff-section__empty">Aucun ingrédient en propre.</p>
              ) : (
                <ul role="list" id={colId} className="diff-section__pills">
                  {visible.map((i) => (
                    <li key={i.slug} className="diff-pill">
                      <Link
                        to="/ingredients/$slug"
                        params={{ slug: i.slug }}
                        className="cmp-ingredient-link"
                      >
                        {i.inciName}
                      </Link>
                      {i.signals.includes('active') && (
                        <span className="diff-pill__active" role="img" aria-label="actif" />
                      )}
                    </li>
                  ))}
                </ul>
              )}

              <ShowMoreButton
                className="diff-section__more"
                hiddenCount={hidden}
                isExpanded={isExpanded}
                onToggle={() => toggleExpand(p.id)}
                controlsId={colId}
              />
            </article>
          )
        })}
      </div>
    </section>
  )
}

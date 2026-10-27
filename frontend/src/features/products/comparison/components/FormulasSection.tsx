import type { EnrichedComparisonProduct, InciToken } from '@aurore/shared'

import clsx from 'clsx'
import { useId, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { ChipGroup } from '@/component/Input/ChipGroup/ChipGroup'
import { type FormulaFilter, formulaRows, sharedInciKeys } from '../helpers/formulas'
import './ComparisonTable.css'
import './FormulasSection.css'

import { ComparisonTableFrame } from './ComparisonTableFrame'
import { ProductColumnHeader } from './ProductColumnHeader'

type Props = { products: EnrichedComparisonProduct[] }

const VISIBLE_ROWS = 15

const FILTER_OPTIONS: Array<{ value: FormulaFilter; label: string }> = [
  { value: 'all', label: 'Formule entière' },
  { value: 'differences', label: 'Seulement les différences' },
  { value: 'common', label: 'Seulement les communs' },
]

const productNames = (products: EnrichedComparisonProduct[]) =>
  products.map((p) => `${p.brand} ${p.name}`).join(', ')

export function FormulasSection({ products }: Props) {
  const headingId = useId()
  const tableId = useId()
  const [filter, setFilter] = useState<FormulaFilter>('all')
  const [expanded, setExpanded] = useState(false)
  const sharedKeys = sharedInciKeys(products)
  const withoutInci = products.filter((p) => !p.inciTokens)
  const rows = formulaRows(products, sharedKeys, filter)
  const visible = expanded ? rows : rows.slice(0, VISIBLE_ROWS)

  return (
    <section className="cmp-formulas" aria-labelledby={headingId}>
      <h2 id={headingId} className="cmp-formulas__title ui-display-heading">
        Formules
      </h2>
      <p className="cmp-formulas__lede">
        Ingrédients dans l’ordre de l’emballage, tels que renseignés dans le catalogue.
      </p>
      {withoutInci.length === products.length ? (
        <p className="cmp-formulas__note">Aucune liste INCI renseignée pour ces produits.</p>
      ) : (
        <>
          {sharedKeys ? (
            <div className="cmp-formulas__tools">
              <ChipGroup
                mode="exclusive"
                size="sm"
                aria-label="Ingrédients affichés"
                options={FILTER_OPTIONS}
                selected={[filter]}
                onChange={([next]) => {
                  if (next) setFilter(next)
                }}
              />
              <p className="cmp-formulas__legend">
                <span className="cmp-formulas__swatch" aria-hidden="true" />
                Commun : présent dans les {products.length} produits
              </p>
            </div>
          ) : (
            <p className="cmp-formulas__note">
              Liste INCI non renseignée : {productNames(withoutInci)}. Les ingrédients communs ne
              peuvent pas être repérés.
            </p>
          )}
          <ComparisonTableFrame columns={products.length} className="cmp-formulas__frame">
            <table
              id={tableId}
              className="cmp-table cmp-formulas__table"
              aria-labelledby={headingId}
            >
              <thead className="cmp-table__head">
                <tr>
                  <th scope="col" className="cmp-formulas__rank-head cmp-table__pinned">
                    <span className="sr-only">Ordre sur l’emballage</span>
                  </th>
                  {products.map((p, i) => (
                    <ProductColumnHeader key={p.id} product={p} index={i} />
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <tr key={row.rank}>
                    <th
                      scope="row"
                      className="cmp-formulas__rank cmp-table__label cmp-table__pinned"
                    >
                      {row.rank}
                    </th>
                    {row.cells.map((token, i) => (
                      <FormulaCell
                        key={products[i]?.id}
                        token={token}
                        sharedKeys={sharedKeys}
                        showMissingNote={row.rank === 1 && !products[i]?.inciTokens}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </ComparisonTableFrame>
          {rows.length === 0 && (
            <p className="cmp-formulas__note">Aucun ingrédient ne correspond à ce filtre.</p>
          )}
          {rows.length > VISIBLE_ROWS && (
            <Button
              variant="bare"
              className="cmp-formulas__more"
              aria-expanded={expanded}
              aria-controls={tableId}
              onClick={() => setExpanded((current) => !current)}
            >
              {expanded ? 'Réduire la formule' : 'Voir toute la formule'}
            </Button>
          )}
        </>
      )}
    </section>
  )
}

type CellProps = {
  token: InciToken | null
  sharedKeys: Set<string> | null
  showMissingNote: boolean
}

function FormulaCell({ token, sharedKeys, showMissingNote }: CellProps) {
  if (!token) {
    return (
      <td>
        {showMissingNote && <span className="cmp-formulas__missing">Liste non renseignée</span>}
      </td>
    )
  }
  const isShared = sharedKeys?.has(token.key) ?? false
  return (
    <td className={clsx('cmp-formulas__cell', isShared && 'is-shared')}>
      <span>{token.label}</span>
      {isShared && <span className="sr-only"> (commun)</span>}
    </td>
  )
}

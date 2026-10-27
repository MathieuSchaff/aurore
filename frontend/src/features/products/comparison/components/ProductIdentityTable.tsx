import type { EnrichedComparisonProduct } from '@aurore/shared'
import { PRODUCT_TEXTURE_LABELS, PRODUCT_UNIT_LABELS } from '@aurore/shared'

import { useId } from 'react'

import { tagLabel } from '@/features/products/filters'
import './ComparisonTable.css'
import './ProductIdentityTable.css'

import { ComparisonTableFrame } from './ComparisonTableFrame'
import { ProductColumnHeader } from './ProductColumnHeader'
import { IDENTITY_LABELS } from './ProductIdentityTable.constants'

type Props = { products: EnrichedComparisonProduct[] }

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

// `texture` is empty on most catalogue rows, and the texture tag fills some of them
function textureLabel(p: EnrichedComparisonProduct): string {
  if (p.texture) return PRODUCT_TEXTURE_LABELS[p.texture]
  const tag = p.tags.find((t) => t.tagType === 'texture')
  return tag ? tagLabel(tag.slug) : 'Non renseignée'
}

export function ProductIdentityTable({ products }: Props) {
  const headingId = useId()
  const pricedUnits = new Set(products.flatMap((p) => (p.pricePer ? [p.pricePer.unit] : [])))
  const mixedUnits = pricedUnits.size > 1

  const rows: Array<{ label: string; value: (p: EnrichedComparisonProduct) => string }> = [
    { label: 'Contenant', value: (p) => PRODUCT_UNIT_LABELS[p.unit] },
    {
      label: 'Contenance',
      value: (p) =>
        p.totalAmount != null && p.totalAmount > 0 && p.amountUnit
          ? `${p.totalAmount} ${p.amountUnit}`
          : 'Non renseignée',
    },
    {
      label: 'Prix',
      value: (p) => (p.priceCents != null ? eur.format(p.priceCents / 100) : 'Non renseigné'),
    },
    {
      label: 'Prix unitaire',
      value: (p) => {
        if (mixedUnits) return IDENTITY_LABELS.priceMixed
        return p.pricePer
          ? `${eur.format(p.pricePer.cents / 100)} / ${p.pricePer.unit}`
          : 'Non renseigné'
      },
    },
    { label: 'Texture', value: textureLabel },
  ]

  return (
    <section className="cmp-identity" aria-labelledby={headingId}>
      <h2 id={headingId} className="cmp-identity__title ui-display-heading">
        Fiche d’identité
      </h2>
      <ComparisonTableFrame columns={products.length}>
        <table className="cmp-table cmp-identity__table" aria-labelledby={headingId}>
          <thead>
            <tr>
              <td className="cmp-identity__corner cmp-table__pinned" />
              {products.map((p, i) => (
                <ProductColumnHeader key={p.id} product={p} index={i} withImage />
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="cmp-table__label cmp-table__pinned">
                  {row.label}
                </th>
                {products.map((p) => (
                  <td key={p.id}>{row.value(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ComparisonTableFrame>
    </section>
  )
}

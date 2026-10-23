import type { EnrichedComparisonProduct, SkincareProductTagCategory } from '@aurore/shared'

import { Link } from '@tanstack/react-router'
import { useId } from 'react'

import { ProductImage } from '@/features/products/components/ProductImage/ProductImage'
import { tagLabel } from '@/features/products/filters'

import './MetaStrip.css'

import { META_STRIP_LABELS } from './MetaStrip.constants'
import { productTone } from './productTones'

type Props = { products: EnrichedComparisonProduct[] }

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

function formatPricePer(p: EnrichedComparisonProduct): string {
  if (!p.pricePer) return 'Prix unitaire non renseigné'
  return `${eur.format(p.pricePer.cents / 100)} / ${p.pricePer.unit}`
}

// Typed against shared union so renames there become TS errors here.
const TAG_TYPES: readonly SkincareProductTagCategory[] = [
  'product_type_v2',
  'texture',
  'routine_moment',
  'skin_type',
]
const TAG_TYPES_SET: ReadonlySet<string> = new Set(TAG_TYPES)

export function MetaStrip({ products }: Props) {
  const headingId = useId()
  const allUnits = new Set(
    products.map((p) => p.pricePer?.unit).filter((u): u is NonNullable<typeof u> => Boolean(u))
  )
  const mixed = allUnits.size > 1

  return (
    <section className="cmp-shelf" aria-labelledby={headingId}>
      <h2 id={headingId} className="cmp-shelf__title ui-display-heading">
        Produits comparés
      </h2>
      <ol role="list" className="cmp-shelf__row">
        {products.map((p, i) => {
          const tags = p.tags.filter(
            (t) => TAG_TYPES_SET.has(t.tagType) && t.relevance === 'primary'
          )

          return (
            <li key={p.id} className="cmp-shelf__item" style={productTone(i)}>
              <Link
                to="/products/$slug"
                params={{ slug: p.slug }}
                className="cmp-shelf__photo-link"
                aria-hidden="true"
                tabIndex={-1}
              >
                <ProductImage
                  kind={p.kind}
                  unit={p.amountUnit}
                  imageUrl={p.imageUrl}
                  size={48}
                  className="cmp-shelf__photo"
                />
              </Link>
              <p className="cmp-shelf__brand">{p.brand}</p>
              <h3 className="cmp-shelf__name">
                <Link
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  className="cmp-shelf__name-link"
                >
                  {p.name}
                </Link>
              </h3>
              <p className="cmp-shelf__amount">
                {p.totalAmount != null && p.totalAmount > 0 && p.amountUnit
                  ? `${p.totalAmount} ${p.amountUnit}`
                  : 'Quantité non renseignée'}
              </p>
              <p className="cmp-shelf__price">
                {p.priceCents != null
                  ? `Prix total : ${eur.format(p.priceCents / 100)}`
                  : 'Prix total non renseigné'}
              </p>
              <p className="cmp-shelf__unit-price">
                {mixed ? META_STRIP_LABELS.priceMixed : formatPricePer(p)}
              </p>
              {tags.length > 0 && (
                <ul role="list" className="cmp-shelf__tags">
                  {tags.slice(0, 3).map((t) => (
                    <li key={t.slug} className="cmp-shelf__tag">
                      {tagLabel(t.slug)}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

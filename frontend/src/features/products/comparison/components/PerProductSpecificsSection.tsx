import type { EnrichedComparisonProduct } from '@habit-tracker/shared'

import { useState } from 'react'

import { ExpandableSection } from '@/component/Layout/ExpandableSection/ExpandableSection'
import { computeSpecifics } from '../helpers/aggregations'
import './IngredientsSection.css'

type Props = { products: EnrichedComparisonProduct[] }

export function PerProductSpecificsSection({ products }: Props) {
  const specifics = computeSpecifics(products)
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className="per-product-section">
      <h2 className="per-product-section__title">Spécifiques par produit</h2>
      {products.map((p) => {
        const list = specifics.get(p.id) ?? []
        const isOpen = openId === p.id
        return (
          <div key={p.id} className="per-product-item">
            <ExpandableSection
              open={isOpen}
              onToggle={() => setOpenId(isOpen ? null : p.id)}
              title={
                <span className="per-product-item__label">
                  {p.brand} — {p.name}
                  <span className="per-product-item__meta"> ({list.length})</span>
                </span>
              }
            >
              <ul className="per-product-item__body">
                {list.length === 0 ? (
                  <li className="ingredients-section__empty">Aucun ingrédient spécifique.</li>
                ) : (
                  list.map((i) => (
                    <li key={i.slug} className="ingredient-pill">
                      {i.inciName}
                    </li>
                  ))
                )}
              </ul>
            </ExpandableSection>
          </div>
        )
      })}
    </section>
  )
}

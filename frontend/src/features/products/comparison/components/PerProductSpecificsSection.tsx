import type { EnrichedComparisonProduct } from '@habit-tracker/shared'

import { useState } from 'react'

import { ExpandableSection } from '@/component/Layout/ExpandableSection/ExpandableSection'
import { computeSpecifics } from '../helpers/aggregations'

type Props = { products: EnrichedComparisonProduct[] }

export function PerProductSpecificsSection({ products }: Props) {
  const specifics = computeSpecifics(products)
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section>
      <h2>Spécifiques par produit</h2>
      {products.map((p) => {
        const list = specifics.get(p.id) ?? []
        const isOpen = openId === p.id
        return (
          <div key={p.id}>
            <ExpandableSection
              title={`${p.brand} — ${p.name} (${list.length})`}
              open={isOpen}
              onToggle={() => setOpenId(isOpen ? null : p.id)}
            >
              <ul>
                {list.map((i) => (
                  <li key={i.slug}>{i.inciName}</li>
                ))}
              </ul>
            </ExpandableSection>
          </div>
        )
      })}
    </section>
  )
}

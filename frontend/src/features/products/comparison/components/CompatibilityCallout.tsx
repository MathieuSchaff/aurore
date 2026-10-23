import type { EnrichedComparisonProduct } from '@aurore/shared'

import { computeCompatibility } from '../helpers/compatibility'
import './CompatibilityCallout.css'

type Props = { products: EnrichedComparisonProduct[] }

export function CompatibilityCallout({ products }: Props) {
  const { headline, description } = computeCompatibility(products)

  return (
    <aside className="cmp-callout" role="note" aria-label="Synthèse des ingrédients renseignés">
      <p className="cmp-callout__eyebrow">
        <span className="cmp-callout__eyebrow-dot" aria-hidden="true" />
        Ingrédients renseignés
      </p>
      <p className="ui-display-heading">{headline}</p>
      <p className="cmp-callout__description">{description}</p>
    </aside>
  )
}

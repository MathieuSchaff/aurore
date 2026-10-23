import type { EnrichedComparisonProduct } from '@aurore/shared'

import { CommonIngredientsSection } from './CommonIngredientsSection'
import { ComparisonHero } from './ComparisonHero'
import { CompatibilityCallout } from './CompatibilityCallout'
import { DiffSection } from './DiffSection'
import { MetaStrip } from './MetaStrip'
import { PersonalExperienceSection } from './PersonalExperienceSection'
import { SignalsSection } from './SignalsSection'
import './ComparisonBody.css'

type Props = {
  products: EnrichedComparisonProduct[]
  /** Optional editorial header: falls back to a generic title when absent. */
  comparisonName?: string | null
  showHero?: boolean
}

export function ComparisonBody({ products, comparisonName, showHero = true }: Props) {
  const hasIngredientLists = products.length >= 2 && products.every((p) => p.ingredients.length > 0)
  return (
    <div className="comparison-body">
      {showHero && <ComparisonHero count={products.length} name={comparisonName ?? null} />}
      <MetaStrip products={products} />
      {hasIngredientLists && <DiffSection products={products} />}
      <PersonalExperienceSection products={products} />
      <CompatibilityCallout products={products} />
      {hasIngredientLists && <CommonIngredientsSection products={products} />}
      <SignalsSection products={products} />
    </div>
  )
}

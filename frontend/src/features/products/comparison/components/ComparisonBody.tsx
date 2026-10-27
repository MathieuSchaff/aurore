import type { EnrichedComparisonProduct } from '@aurore/shared'

import { FormulasSection } from './FormulasSection'
import { PersonalExperienceSection } from './PersonalExperienceSection'
import { ProductIdentityTable } from './ProductIdentityTable'
import { SignalsSection } from './SignalsSection'
import './ComparisonBody.css'

type Props = { products: EnrichedComparisonProduct[] }

export function ComparisonBody({ products }: Props) {
  return (
    <div className="comparison-body">
      <ProductIdentityTable products={products} />
      <FormulasSection products={products} />
      <SignalsSection products={products} />
      <PersonalExperienceSection products={products} />
    </div>
  )
}

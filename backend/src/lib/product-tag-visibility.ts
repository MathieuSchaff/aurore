import { isDisplayedProductTag } from '@aurore/shared'

import { sql } from 'drizzle-orm'

import { products } from '../db/schema/products'
import { productTagLinks, productTagTypes } from '../db/schema/tags/tags'
import {
  hasUndisclosedFragrance,
  UNDISCLOSED_AROMA_PATTERN,
  UNDISCLOSED_FRAGRANCE_PATTERN,
} from './inci-facts'

const undisclosedAroma = new RegExp(UNDISCLOSED_AROMA_PATTERN, 'i')
const aromaticAbsences = new Set([
  'sans-parfum',
  'sans-allergenes-parfumants',
  'sans-huiles-essentielles',
])

export function isDisplayedProductTagLink(
  slug: string,
  relevance: string,
  source: string,
  inci: string | null | undefined
): boolean {
  if (!isDisplayedProductTag(slug, relevance)) return false
  return !(
    source === 'algo-derm' &&
    ((slug === 'sans-allergenes-parfumants' && hasUndisclosedFragrance(inci)) ||
      (aromaticAbsences.has(slug) && undisclosedAroma.test(inci ?? '')))
  )
}

// Stored inferences must stop surfacing before a catalogue reconciliation
export const visibleInferredTagCondition = sql`(
  ${productTagLinks.source} <> 'algo-derm'
  OR NOT (
    (${productTagTypes.slug} = 'sans-allergenes-parfumants'
      AND coalesce(${products.inci}, '') ~* ${UNDISCLOSED_FRAGRANCE_PATTERN})
    OR (${productTagTypes.slug} IN ('sans-parfum', 'sans-allergenes-parfumants', 'sans-huiles-essentielles')
      AND coalesce(${products.inci}, '') ~* ${UNDISCLOSED_AROMA_PATTERN})
  )
)`

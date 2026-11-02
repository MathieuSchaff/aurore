import { isDisplayedProductTag } from '@aurore/shared'

import { sql } from 'drizzle-orm'

import { products } from '../db/schema/products'
import { productTagLinks, productTagTypes } from '../db/schema/tags/tags'
import { hasUndisclosedFragrance, UNDISCLOSED_FRAGRANCE_PATTERN } from './inci-facts'

export function isDisplayedProductTagLink(
  slug: string,
  relevance: string,
  source: string,
  inci: string | null | undefined
): boolean {
  if (!isDisplayedProductTag(slug, relevance)) return false
  return !(
    source === 'algo-derm' &&
    slug === 'sans-allergenes-parfumants' &&
    hasUndisclosedFragrance(inci)
  )
}

// Stored inferences must stop surfacing before a catalogue reconciliation
export const visibleInferredTagCondition = sql`(
  ${productTagLinks.source} <> 'algo-derm'
  OR ${productTagTypes.slug} <> 'sans-allergenes-parfumants'
  OR coalesce(${products.inci}, '') !~* ${UNDISCLOSED_FRAGRANCE_PATTERN}
)`

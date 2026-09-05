import type { SkinConcern } from '@aurore/shared'
import { SKIN_CONCERNS, USER_CONCERN_TO_PRODUCT_TAGS } from '@aurore/shared'

type ConcernFamily = {
  // Product tag the family feeds; its label is the family title
  tagSlug: string
  concerns: SkinConcern[]
}

export type ConcernFamilies = {
  families: ConcernFamily[]
  // Concerns alone behind their tag, listed together without a title of their own
  others: SkinConcern[]
}

// Families are the product tags the portrait feeds, read off the bridge so no
// new word has to be coined and the grouping matches the catalogue filter and
// the similarity buckets. A concern with two targets sits under the first.
// Order follows SKIN_CONCERNS, so the picker reads like the flat list it replaces
export function groupConcernsByFamily(): ConcernFamilies {
  const byTag = new Map<string, SkinConcern[]>()
  for (const concern of SKIN_CONCERNS) {
    const tag = USER_CONCERN_TO_PRODUCT_TAGS[concern][0]
    if (!tag) continue
    const bucket = byTag.get(tag)
    if (bucket) bucket.push(concern)
    else byTag.set(tag, [concern])
  }
  const families: ConcernFamily[] = []
  const others: SkinConcern[] = []
  for (const [tagSlug, concerns] of byTag) {
    if (concerns.length > 1) families.push({ tagSlug, concerns })
    else others.push(...concerns)
  }
  return { families, others }
}

export const CONCERN_FAMILIES = groupConcernsByFamily()
